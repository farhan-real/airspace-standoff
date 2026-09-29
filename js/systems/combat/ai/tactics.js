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

    const role = shooter.tacticalRole || (shooter.spec && shooter.spec.category === 'EW' ? 'SEAD' : 'SWEEP');
    let possibleTargets = [];

    if (role === 'SEAD') {
      const seadEmitters = bunkers.filter(s => s.type === 'RADAR_ARRAY' || s.type === 'EW_JAMMER' || s.type === 'S-400' || s.type === 'PANTSIR' || s.type === 'RADAR_VAN');
      possibleTargets = seadEmitters.concat(bunkers.filter(s => !seadEmitters.includes(s))).concat(airTargets);
    } else if (role === 'STRIKE') {
      const primaryBunkers = bunkers.filter(s => s.type === 'BUNKER' || s.type === 'FUEL_DEPOT');
      possibleTargets = primaryBunkers.concat(bunkers.filter(s => !primaryBunkers.includes(s))).concat(airTargets);
    } else if (role === 'SNIPER') {
      const sniperAir = airTargets.filter(t => Math.hypot(t.x - shooter.x, t.y - shooter.y) >= 40.0 && (t.isFlightLead || t.isAce || (t.spec && t.spec.category === 'STRIKE')));
      possibleTargets = sniperAir.concat(airTargets.filter(t => !sniperAir.includes(t))).concat(bunkers);
    } else if (role === 'DOGFIGHT') {
      const closeAir = airTargets.filter(t => Math.hypot(t.x - shooter.x, t.y - shooter.y) <= 25.0);
      possibleTargets = closeAir.concat(airTargets.filter(t => !closeAir.includes(t))).concat(bunkers);
    } else if (role === 'INTERCEPT') {
      const fastThreats = airTargets.filter(t => (t.speed || 0.8) >= 0.90 || t.isFlightLead);
      possibleTargets = fastThreats.concat(airTargets.filter(t => !fastThreats.includes(t))).concat(bunkers);
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

        if (role === 'DOGFIGHT' && (w.seeker === 'IIR' || w.seeker === 'EO' || w.trait === 'HOBS_VANE')) score += 25;
        if (role === 'INTERCEPT' && dist >= 25.0 && w.speedMach >= 3.5) score += 22;
        if (role === 'SWARM' && w.trait === 'SWARM_RIPPLE') score += 20;

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

  static executeTacticalEngagements(commander, shooter, airTargets, bunkers, profile, clouds, diffKey, tokenCost, allMissiles) {
    const res = this.evaluateShooterWeapons(shooter, airTargets, bunkers, profile, clouds, diffKey, allMissiles);
    if (res.isBingo && !shooter.isRTB) {
      if (shooter.gunAmmo && shooter.gunAmmo > 0) return false;
      const rtbChances = { CADET: 0.15, VETERAN: 0.30, ELITE: 0.50, ACE: 0.65, MASTER: 0.80, LEGEND: 0.90 };
      if (Math.random() < (rtbChances[diffKey] || 0.40)) {
        shooter.orderRTB();
      }
      return false;
    }

    if (!res.plan || !res.plan.pylonsToFire || res.plan.pylonsToFire.length === 0) return false;
    const plan = res.plan;
    const tgt = plan.target;
    let anyFired = false;

    for (const pylon of plan.pylonsToFire) {
      if (commander.game.tokenBucketRed < tokenCost || pylon.item.ammo <= 0) break;
      pylon.item.ammo--;
      commander.game.tokenBucketRed = Math.max(0, commander.game.tokenBucketRed - tokenCost);
      anyFired = true;

      if (pylon.weapon.isLaser) {
        if (typeof AudioSys !== 'undefined') AudioSys.playLaser();
        const wasAlive = tgt.hp > 0.05;
        if (tgt.isGhost || tgt.isDecoyDrone) {
          tgt.takeDamage(pylon.weapon.damage);
        } else if (typeof SurfaceUnit !== 'undefined' && tgt instanceof SurfaceUnit) {
          tgt.takeDamage(pylon.weapon.damage, false);
        } else if (tgt.isCivilian && typeof tgt.takeDamage === 'function') {
          tgt.takeDamage(pylon.weapon.damage, shooter, pylon.weapon, true);
        } else {
          tgt.hp = Math.max(0, tgt.hp - pylon.weapon.damage);
          if (tgt.hp < 0.05) tgt.hp = 0;
          if (typeof tgt.applyActionStress === 'function') tgt.applyActionStress(0.20);
        }
        if (commander.game.radar) {
          commander.game.radar.spawnExplosionFX(tgt.x, tgt.y, false);
          commander.game.radar.spawnCombatText(tgt.x, tgt.y, `LASER -${pylon.weapon.damage}HP`, '#f43f5e');
        }
        if (wasAlive && tgt.hp <= 0 && commander.game.simulation && !tgt.isCivilian) {
          commander.game.simulation.recordKillEvent(shooter.team, tgt, shooter, { weapon: pylon.weapon, isSalvo: false, salvoCount: 1 });
        } else if (wasAlive && tgt.hp > 0 && commander.game.simulation && commander.game.simulation.scoring && !tgt.isCivilian && (!tgt.isIndestructible)) {
          commander.game.simulation.scoring.recordHitEvent(shooter.team, tgt, shooter, { weapon: pylon.weapon, damage: pylon.weapon.damage });
        }
      } else if (!pylon.weapon.isGunpod && pylon.weapon.category !== 'GUN') {
        commander.game.missiles.push(new MissileEntity(pylon.weapon, shooter, tgt));
        if (typeof AudioSys !== 'undefined') AudioSys.playLaunch();
      }
    }
    shooter.recalculateWeight();
    return anyFired;
  }
}

window.AIMissileTactics = AIMissileTactics;