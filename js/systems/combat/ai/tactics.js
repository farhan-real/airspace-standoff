/**
 * AIRSPACE STANDOFF: Tactical AI Missile Decision Engine
 * Scaled launch sizing, inbound threat prediction, decoy discrimination, and difficulty-tiered target prioritization.
 */

class AIMissileTactics {
  static filterCandidateTargets(shooter, rawTargets, profile, diffKey) {
    const isAce = Boolean(shooter && shooter.isAce);
    const aceProf = (window.AI_ACE_PROFILES && window.AI_ACE_PROFILES[diffKey]);
    const descChance = isAce && aceProf ? aceProf.decoyDiscrimination : (profile.decoyDiscrimination !== undefined ? profile.decoyDiscrimination : 0.20);

    return rawTargets.filter(t => {
      if (!t || t.hp <= 0.05) return false;
      if (t.isDecoyDrone || t.isGhost) {
        if (Math.random() < descChance) return false;
      }
      return true;
    });
  }

  static evaluateShooterWeapons(shooter, rawAirTargets, bunkers, profile, clouds, diffKey, allMissiles) {
    if (!shooter || !shooter.equippedWeapons || shooter.equippedWeapons.length === 0) {
      return { isBingo: true, plan: null };
    }

    const availablePylons = [];
    for (let i = 0; i < shooter.equippedWeapons.length; i++) {
      const item = shooter.equippedWeapons[i];
      if (item && item.ammo > 0 && item.weapon && !item.weapon.isJammerPod && !item.weapon.isDecoy && !item.weapon.isDecoyDrone && !item.weapon.isGunpod && item.weapon.category !== 'GUN') {
        availablePylons.push({ index: i, item: item, weapon: item.weapon });
      }
    }
    if (availablePylons.length === 0) return { isBingo: true, plan: null };

    const airTargets = this.filterCandidateTargets(shooter, rawAirTargets, profile, diffKey);
    const fireTiers = {
      CADET:   { minPk: 25, rangeRatio: profile.engagementRangeRatio || 0.95, hesitateChance: 0.50, maxOffAngle: Math.PI / 8.0 },
      VETERAN: { minPk: 45, rangeRatio: profile.engagementRangeRatio || 0.80, hesitateChance: 0.35, maxOffAngle: Math.PI / 7.0 },
      ELITE:   { minPk: 52, rangeRatio: profile.engagementRangeRatio || 0.70, hesitateChance: 0.24, maxOffAngle: Math.PI / 6.0 },
      ACE:     { minPk: 58, rangeRatio: profile.engagementRangeRatio || 0.65, hesitateChance: 0.16, maxOffAngle: Math.PI / 5.0 },
      MASTER:  { minPk: 64, rangeRatio: profile.engagementRangeRatio || 0.60, hesitateChance: 0.10, maxOffAngle: Math.PI / 4.5 },
      LEGEND:  { minPk: 68, rangeRatio: profile.engagementRangeRatio || 0.55, hesitateChance: 0.05, maxOffAngle: Math.PI / 4.0 }
    };
    const tier = fireTiers[diffKey] || fireTiers.VETERAN;

    if (!shooter.isAce && Math.random() < tier.hesitateChance) {
      return { isBingo: false, plan: null };
    }

    const role = shooter.tacticalRole || (shooter.spec && shooter.spec.category === 'EW' ? 'SEAD' : (shooter.spec && shooter.spec.category === 'STRIKE' ? 'STRIKE' : 'SWEEP'));

    let possibleTargets = [];
    if (role === 'SEAD') {
      const seadEmitters = bunkers.filter(s => s.type === 'RADAR_ARRAY' || s.type === 'EW_JAMMER' || s.type === 'S-400' || s.type === 'PANTSIR' || s.type === 'RADAR_VAN');
      if (['MASTER', 'LEGEND'].includes(diffKey)) {
        seadEmitters.sort((a, b) => {
          const score = type => (type === 'RADAR_ARRAY' ? 40 : (type === 'EW_JAMMER' ? 30 : (type === 'S-400' ? 25 : 10)));
          return score(b.type) - score(a.type);
        });
      }
      const otherBunkers = bunkers.filter(s => !seadEmitters.includes(s));
      possibleTargets = seadEmitters.concat(otherBunkers).concat(airTargets);
    } else if (role === 'STRIKE') {
      if (['MASTER', 'LEGEND'].includes(diffKey)) {
        const primaryBunkers = bunkers.filter(s => s.type === 'BUNKER' || s.type === 'FUEL_DEPOT');
        const secondary = bunkers.filter(s => !primaryBunkers.includes(s));
        possibleTargets = primaryBunkers.concat(secondary).concat(airTargets);
      } else {
        possibleTargets = bunkers.concat(airTargets);
      }
    } else if (role === 'SNIPER') {
      if (['MASTER', 'LEGEND'].includes(diffKey)) {
        const sniperAir = airTargets.filter(t => {
          const dist = Math.hypot(t.x - shooter.x, t.y - shooter.y);
          return dist >= 45.0 && (t.isFlightLead || t.isAce || (t.spec && t.spec.category === 'STRIKE'));
        });
        const remainingAir = airTargets.filter(t => !sniperAir.includes(t));
        possibleTargets = sniperAir.concat(remainingAir).concat(bunkers);
      } else {
        const highPrioAir = airTargets.filter(t => t.isFlightLead || t.isAce || (t.spec && t.spec.category === 'STRIKE'));
        const remainingAir = airTargets.filter(t => !highPrioAir.includes(t));
        possibleTargets = highPrioAir.concat(remainingAir).concat(bunkers);
      }
    } else {
      possibleTargets = airTargets.concat(bunkers);
    }

    if (possibleTargets.length === 0) return { isBingo: false, plan: null };

    const requiredPk = tier.minPk || 45;
    let bestScore = -999;
    let bestMatch = null;

    for (const pylon of availablePylons) {
      const w = pylon.weapon;
      const isA2G = Boolean(w.category === 'A2G' || w.isBunkerCracker);

      for (const tgt of possibleTargets) {
        if (tgt.hp <= 0 || tgt.isCivilian) continue;
        const isSurface = Boolean(tgt.type && !tgt.spec && !tgt.isCivilian);
        if (isA2G !== isSurface) continue;

        const effectiveHp = this.estimateTargetEffectiveHp(tgt, allMissiles, shooter.team, diffKey);
        if (effectiveHp <= 0 && ['ACE', 'MASTER', 'LEGEND'].includes(diffKey)) continue;

        const dist = Math.hypot(tgt.x - shooter.x, tgt.y - shooter.y);
        const maxRange = w.rangeKm * (shooter.isAce ? 0.70 : tier.rangeRatio);
        if (dist > maxRange || dist < (w.minRangeKm || 1.0)) continue;

        const angleToTarget = Math.atan2(tgt.y - shooter.y, tgt.x - shooter.x);
        let offBoresight = Math.abs(shooter.heading - angleToTarget);
        while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);

        const isHOBS = (w.trait === 'HOBS_VANE' || w.trait === 'ALL_ASPECT_BURST' || w.trait === 'REAR_ENGAGE' || w.id === 'IRIS-T');
        const maxAngle = shooter.isAce ? (Math.PI / 3.0) : tier.maxOffAngle;
        if (!isSurface && !isHOBS && offBoresight > maxAngle) continue;

        const pkResult = Physics.calcPk(w, shooter, tgt, clouds);
        const pk = pkResult.pk || 0;
        if (pk < requiredPk && diffKey !== 'CADET') continue;

        let score = pk;
        const sweetMin = w.sweetSpotMin || (w.rangeKm * 0.20);
        const sweetMax = w.sweetSpotMax || (w.rangeKm * 0.65);
        if (dist >= sweetMin && dist <= sweetMax) score += 20;

        if (dist <= 22.0 && (w.seeker === 'IIR' || w.seeker === 'EO' || w.seeker === 'OPT')) score += 20;
        else if (dist >= 30.0 && w.seeker === 'ARH') score += 18;

        if (tgt.isNotching || tgt.cmTimer > 0) {
          if (w.seeker === 'IIR' || w.seeker === 'EO') score += 22;
          else if (w.seeker === 'ARH') score -= 18;
        }

        if (role === 'SEAD' && isSurface) {
          if (tgt.type === 'RADAR_ARRAY') score += (['MASTER', 'LEGEND'].includes(diffKey) ? 55 : 40);
          else if (tgt.type === 'EW_JAMMER' || tgt.type === 'S-400') score += 35;
        }
        if (role === 'SNIPER' && dist >= 50.0) {
          score += (['MASTER', 'LEGEND'].includes(diffKey) ? 35 : 22);
        }
        if (role === 'AMBUSH' && ['MASTER', 'LEGEND'].includes(diffKey)) {
          let aspectOffNose = Math.abs((tgt.heading || 0) - Math.atan2(shooter.y - tgt.y, shooter.x - tgt.x));
          while (aspectOffNose > Math.PI) aspectOffNose = Math.abs(aspectOffNose - Math.PI * 2);
          if (aspectOffNose >= 1.0 && aspectOffNose <= 2.1) score += 28;
        }

        if (tgt.isFlightLead) score += 18;
        if (tgt.hp <= 2) score += 16;
        if (diffKey === 'CADET') score += (Math.random() * 30 - 15);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = { pylon, weapon: w, target: tgt, pk, score, effectiveHp };
        }
      }
    }

    if (!bestMatch) return { isBingo: false, plan: null };
    const salvoPlan = this.calculateSalvoComposition(bestMatch, availablePylons, diffKey, shooter, profile);
    return { isBingo: false, plan: salvoPlan };
  }

  static selectAceTargetAndSalvo(ace, candidateTargets, clouds, allMissiles, diffKey, profile) {
    if (!ace.equippedWeapons || ace.equippedWeapons.length === 0) return null;

    const availablePylons = [];
    for (let i = 0; i < ace.equippedWeapons.length; i++) {
      const item = ace.equippedWeapons[i];
      if (item && item.ammo > 0 && item.weapon && !item.weapon.isJammerPod && !item.weapon.isDecoy && !item.weapon.isDecoyDrone && !item.weapon.isGunpod && item.weapon.category !== 'GUN') {
        availablePylons.push({ index: i, item: item, weapon: item.weapon });
      }
    }
    if (availablePylons.length === 0) return null;

    const aceProf = (window.AI_ACE_PROFILES && window.AI_ACE_PROFILES[diffKey]) || profile;
    const filtered = this.filterCandidateTargets(ace, candidateTargets, aceProf, diffKey);
    const viableTargets = filtered.filter(t => t && t.hp > 0 && !t.isCivilian);
    if (viableTargets.length === 0) return null;

    viableTargets.sort((a, b) => {
      const distA = Math.hypot(a.x - ace.x, a.y - ace.y);
      const distB = Math.hypot(b.x - ace.x, b.y - ace.y);
      const prioA = (a.hp <= 2 ? 30 : 0) + (a.isFlightLead ? 22 : 0) - (distA * 0.18);
      const prioB = (b.hp <= 2 ? 30 : 0) + (b.isFlightLead ? 22 : 0) - (distB * 0.18);
      return prioB - prioA;
    });

    for (const target of viableTargets) {
      const dist = Math.hypot(target.x - ace.x, target.y - ace.y);
      const isSurface = Boolean(target.type && !target.spec && !target.isCivilian);

      const compatiblePylons = availablePylons.filter(p => {
        const isA2G = Boolean(p.weapon.category === 'A2G' || p.weapon.isBunkerCracker);
        return isA2G === isSurface;
      });
      if (compatiblePylons.length === 0) continue;

      const angleToTarget = Math.atan2(target.y - ace.y, target.x - ace.x);
      let offBoresight = Math.abs((ace.heading || 0) - angleToTarget);
      while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);

      const primary = compatiblePylons[0];
      if (!primary || dist > primary.weapon.rangeKm * 0.85 || dist < (primary.weapon.minRangeKm || 1.0)) continue;

      const isHOBS = (primary.weapon.trait === 'HOBS_VANE' || primary.weapon.trait === 'ALL_ASPECT_BURST' || primary.weapon.trait === 'REAR_ENGAGE' || primary.weapon.id === 'IRIS-T');
      if (!isSurface && !isHOBS && offBoresight > 0.85) continue;

      const pylonsToFire = [primary];
      const maxSalvo = aceProf.salvoMaxMissiles || profile.salvoMaxMissiles || 2;

      if (maxSalvo >= 2 && target.hp >= 3) {
        const mixedChance = aceProf.mixedSeekerChance !== undefined ? aceProf.mixedSeekerChance : (profile.mixedSeekerChance || 0);
        const tryMixed = Math.random() < mixedChance;
        let secondary = null;

        if (tryMixed) {
          const isRf = s => (s === 'ARH' || s === 'PASSIVE_RADAR' || s === 'INS');
          const primaryIsRf = isRf(primary.weapon.seeker);
          secondary = compatiblePylons.find(p => p.index !== primary.index && dist <= p.weapon.rangeKm * 0.85 && (primaryIsRf ? !isRf(p.weapon.seeker) : isRf(p.weapon.seeker)));
        }
        if (!secondary) {
          secondary = compatiblePylons.find(p => p.index !== primary.index && dist <= p.weapon.rangeKm * 0.85 && dist >= (p.weapon.minRangeKm || 1.0));
        }
        if (secondary) pylonsToFire.push(secondary);
      }

      return { target, pylonsToFire };
    }
    return null;
  }

  static estimateTargetEffectiveHp(target, allMissiles, team, diffKey) {
    if (!allMissiles || allMissiles.length === 0) return target.hp;
    const inbounds = allMissiles.filter(m => m.active && m.target && m.target.id === target.id && m.team === team);
    if (inbounds.length === 0) return target.hp;

    if (diffKey === 'CADET' || diffKey === 'VETERAN') return target.hp;
    const hitRateEst = ['MASTER', 'LEGEND'].includes(diffKey) ? 0.75 : 0.60;
    const expectedDmg = inbounds.reduce((sum, m) => sum + ((m.weapon ? m.weapon.damage : 3) * hitRateEst), 0);
    return target.hp - expectedDmg;
  }

  static calculateSalvoComposition(match, availablePylons, diffKey, shooter, profile) {
    const tgt = match.target, w = match.weapon, pylonsToFire = [match.pylon];
    if (w.category !== 'A2A' || diffKey === 'CADET' || diffKey === 'VETERAN') {
      return { target: tgt, pylonsToFire, primaryWeapon: w };
    }

    const isAce = Boolean(shooter && shooter.isAce);
    const aceProf = (window.AI_ACE_PROFILES && window.AI_ACE_PROFILES[diffKey]) || profile;
    const maxSalvo = isAce ? (aceProf.salvoMaxMissiles || 2) : (profile.salvoMaxMissiles || 2);
    if (maxSalvo < 2) return { target: tgt, pylonsToFire, primaryWeapon: w };

    const totalAmmoLeft = availablePylons.reduce((sum, p) => sum + (p.item.ammo || 0), 0);
    const hp = match.effectiveHp;
    if (hp <= w.damage && totalAmmoLeft <= 2) return { target: tgt, pylonsToFire, primaryWeapon: w };

    const remaining = availablePylons.filter(p => p.index !== match.pylon.index && p.weapon.category === 'A2A');
    if (remaining.length === 0) return { target: tgt, pylonsToFire, primaryWeapon: w };

    const mixedChance = isAce ? (aceProf.mixedSeekerChance || 0) : (profile.mixedSeekerChance || 0);
    const tryMixed = Math.random() < mixedChance;
    if (tryMixed) {
      const isRf = s => (s === 'ARH' || s === 'PASSIVE_RADAR' || s === 'INS');
      const primeIsRf = isRf(w.seeker);
      const mixed = remaining.find(p => primeIsRf ? !isRf(p.weapon.seeker) : isRf(p.weapon.seeker));
      if (mixed) {
        pylonsToFire.push(mixed);
        return { target: tgt, pylonsToFire, primaryWeapon: w };
      }
    }

    pylonsToFire.push(remaining[0]);
    return { target: tgt, pylonsToFire, primaryWeapon: w };
  }
}

window.AIMissileTactics = AIMissileTactics;