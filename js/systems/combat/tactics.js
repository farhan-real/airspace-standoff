/**
 * AIRSPACE STANDOFF: Tactical AI Missile Decision Engine
 * Difficulty-scaled launch sizing, inbound threat prediction, and verified ordnance matching.
 */

class AIMissileTactics {
  static evaluateShooterWeapons(shooter, candidateTargets, bunkers, profile, clouds, diffKey, allMissiles) {
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

    const fireTiers = {
      CADET:   { minPk: 30, rangeRatio: 0.40, hesitateChance: 0.55, maxOffAngle: Math.PI / 8.0 },
      VETERAN: { minPk: 50, rangeRatio: 0.50, hesitateChance: 0.40, maxOffAngle: Math.PI / 7.0 },
      ELITE:   { minPk: 55, rangeRatio: 0.62, hesitateChance: 0.28, maxOffAngle: Math.PI / 6.0 },
      ACE:     { minPk: 62, rangeRatio: 0.72, hesitateChance: 0.18, maxOffAngle: Math.PI / 5.0 },
      MASTER:  { minPk: 66, rangeRatio: 0.80, hesitateChance: 0.10, maxOffAngle: Math.PI / 4.5 },
      LEGEND:  { minPk: 70, rangeRatio: 0.88, hesitateChance: 0.05, maxOffAngle: Math.PI / 4.0 }
    };

    const tier = fireTiers[diffKey] || fireTiers.VETERAN;

    if (!shooter.isAce && Math.random() < tier.hesitateChance) {
      return { isBingo: false, plan: null };
    }

    const isBomber = Boolean(shooter.spec && shooter.spec.role && (shooter.spec.role.includes('Strike') || shooter.spec.role.includes('Bomber')));
    const possibleTargets = (isBomber && bunkers.length > 0) ? bunkers.concat(candidateTargets) : candidateTargets.concat(bunkers);
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
        if (effectiveHp <= 0) continue;

        const dist = Math.hypot(tgt.x - shooter.x, tgt.y - shooter.y);
        const rangeRatio = shooter.isAce ? (profile.engagementRangeRatio || 0.85) : tier.rangeRatio;
        const maxRange = w.rangeKm * rangeRatio;
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
        const sweetMin = w.sweetSpotMin || (w.rangeKm * 0.15);
        const sweetMax = w.sweetSpotMax || (w.rangeKm * 0.70);
        if (dist >= sweetMin && dist <= sweetMax) score += 25;

        if (dist <= 25.0 && (w.seeker === 'IIR' || w.seeker === 'EO' || w.seeker === 'OPT')) score += 20;
        else if (dist >= 35.0 && w.seeker === 'ARH') score += 20;

        if (tgt.isNotching || tgt.cmTimer > 0) {
          if (w.seeker === 'IIR' || w.seeker === 'EO') score += 25;
          else if (w.seeker === 'ARH') score -= 20;
        }

        if (tgt.isFlightLead) score += 15;
        if (tgt.hp <= 2) score += 15;
        if (diffKey === 'CADET') score += (Math.random() * 40 - 20);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = { pylon, weapon: w, target: tgt, pk, score, effectiveHp };
        }
      }
    }

    if (!bestMatch) return { isBingo: false, plan: null };
    const salvoPlan = this.calculateSalvoComposition(bestMatch, availablePylons, diffKey, shooter);
    return { isBingo: false, plan: salvoPlan };
  }

  static selectAceTargetAndSalvo(ace, candidateTargets, clouds, allMissiles, diffKey) {
    if (!ace.equippedWeapons || ace.equippedWeapons.length === 0) return null;

    const availablePylons = [];
    for (let i = 0; i < ace.equippedWeapons.length; i++) {
      const item = ace.equippedWeapons[i];
      if (item && item.ammo > 0 && item.weapon && !item.weapon.isJammerPod && !item.weapon.isDecoy && !item.weapon.isDecoyDrone && !item.weapon.isGunpod && item.weapon.category !== 'GUN') {
        availablePylons.push({ index: i, item: item, weapon: item.weapon });
      }
    }
    if (availablePylons.length === 0) return null;

    const viableTargets = candidateTargets.filter(t => t && t.hp > 0 && !t.isCivilian);
    if (viableTargets.length === 0) return null;

    const aceBlunderRates = { CADET: 0.35, VETERAN: 0.25, ELITE: 0.08, ACE: 0.03, MASTER: 0.01, LEGEND: 0.00 };
    const blunderRoll = Math.random() < (aceBlunderRates[diffKey] || 0.10);

    viableTargets.sort((a, b) => {
      const distA = Math.hypot(a.x - ace.x, a.y - ace.y);
      const distB = Math.hypot(b.x - ace.x, b.y - ace.y);
      let prioA = (a.hp <= 2 ? 30 : 0) + (a.isFlightLead ? 20 : 0) - (distA * 0.2);
      let prioB = (b.hp <= 2 ? 30 : 0) + (b.isFlightLead ? 20 : 0) - (distB * 0.2);
      if (blunderRoll) {
        prioA += (Math.random() * 30 - 15);
        prioB += (Math.random() * 30 - 15);
      }
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

      compatiblePylons.sort((a, b) => {
        const wa = a.weapon, wb = b.weapon;
        let sa = 0, sb = 0;
        if (dist <= 25.0 && (wa.seeker === 'IIR' || wa.seeker === 'EO' || wa.trait === 'HOBS_VANE' || wa.id === 'IRIS-T')) sa += 40;
        if (dist <= 25.0 && (wb.seeker === 'IIR' || wb.seeker === 'EO' || wb.trait === 'HOBS_VANE' || wb.id === 'IRIS-T')) sb += 40;
        if (dist >= 35.0 && wa.seeker === 'ARH') sa += 40;
        if (dist >= 35.0 && wb.seeker === 'ARH') sb += 40;
        return sb - sa;
      });

      const primary = compatiblePylons[0];
      if (!primary || dist > primary.weapon.rangeKm * 0.90 || dist < (primary.weapon.minRangeKm || 1.0)) continue;

      const pylonsToFire = [primary];
      const secondary = compatiblePylons.find(p => p.index !== primary.index && dist <= p.weapon.rangeKm * 0.90 && dist >= (p.weapon.minRangeKm || 1.0));

      if (secondary && (target.hp >= 3 || target.isFlightLead || compatiblePylons.length >= 3)) {
        const skipSalvo = blunderRoll && (diffKey === 'VETERAN' || diffKey === 'CADET');
        if (!skipSalvo) pylonsToFire.push(secondary);
      }

      return { target, pylonsToFire };
    }

    return null;
  }

  static estimateTargetEffectiveHp(target, allMissiles, team, diffKey) {
    if (!allMissiles || allMissiles.length === 0) return target.hp;
    const inbounds = allMissiles.filter(m => m.active && m.target && m.target.id === target.id && m.team === team);
    if (inbounds.length === 0) return target.hp;

    if (diffKey === 'CADET' || diffKey === 'VETERAN' || diffKey === 'ELITE') {
      return target.hp - inbounds.length * 1.5;
    }

    const hasDefenses = (target.cmTimer > 0 || target.isNotching || target.coffinDodgeBonus || target.isAce);
    const hitRateEst = hasDefenses ? 0.60 : 0.85;
    const expectedDamage = inbounds.reduce((sum, m) => sum + ((m.weapon ? m.weapon.damage : 3) * hitRateEst), 0);
    return target.hp - expectedDamage;
  }

  static calculateSalvoComposition(match, availablePylons, diffKey, shooter) {
    const tgt = match.target, w = match.weapon, pylonsToFire = [match.pylon];
    if (w.category !== 'A2A') return { target: tgt, pylonsToFire, primaryWeapon: w };

    if (diffKey === 'CADET' || diffKey === 'VETERAN' || diffKey === 'ELITE' || !shooter.isAce) {
      return { target: tgt, pylonsToFire, primaryWeapon: w };
    }

    const totalAmmoLeft = availablePylons.reduce((sum, p) => sum + (p.item.ammo || 0), 0);
    const hp = match.effectiveHp;
    let desiredSalvo = 1;

    if (hp > w.damage && totalAmmoLeft >= 3) {
      desiredSalvo = (diffKey === 'ACE' || diffKey === 'MASTER' || diffKey === 'LEGEND') ? 3 : 2;
    }

    if (desiredSalvo > 1) {
      const remaining = availablePylons.filter(p => p.index !== match.pylon.index && p.weapon.category === 'A2A');
      for (let i = 0; i < (desiredSalvo - 1) && i < remaining.length; i++) {
        pylonsToFire.push(remaining[i]);
      }
    }

    return { target: tgt, pylonsToFire, primaryWeapon: w };
  }
}

window.AIMissileTactics = AIMissileTactics;