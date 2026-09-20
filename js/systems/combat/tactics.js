/**
 * AIRSPACE STANDOFF // Tactical AI Missile Decision Engine
 * Difficulty-scaled launch sizing, inbound threat prediction, and Ace blunder scaling.
 */

class AIMissileTactics {
  static evaluateShooterWeapons(shooter, candidateTargets, bunkers, profile, clouds, diffKey, allMissiles) {
    if (!shooter || !shooter.equippedWeapons || shooter.equippedWeapons.length === 0) {
      return { isBingo: true, plan: null };
    }

    const availablePylons = [];
    for (let i = 0; i < shooter.equippedWeapons.length; i++) {
      const item = shooter.equippedWeapons[i];
      if (item && item.ammo > 0 && item.weapon && !item.weapon.isJammerPod && !item.weapon.isDecoy) {
        availablePylons.push({ index: i, item: item, weapon: item.weapon });
      }
    }

    if (availablePylons.length === 0) return { isBingo: true, plan: null };

    const isBomber = Boolean(shooter.spec && shooter.spec.role && (shooter.spec.role.includes('Strike') || shooter.spec.role.includes('Bomber')));
    const possibleTargets = (isBomber && bunkers.length > 0) ? bunkers.concat(candidateTargets) : candidateTargets.concat(bunkers);
    if (possibleTargets.length === 0) return { isBingo: false, plan: null };

    const minPkThresholds = { CADET: 25, VETERAN: 38, ELITE: 52, ACE: 60, MASTER: 66, LEGEND: 70 };
    const requiredPk = minPkThresholds[diffKey] || 40;

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
        const maxRange = w.rangeKm * (profile.engagementRangeRatio || 0.85);
        if (dist > maxRange || dist < (w.minRangeKm || 1.0)) continue;

        const angleToTarget = Math.atan2(tgt.y - shooter.y, tgt.x - shooter.x);
        let offBoresight = Math.abs(shooter.heading - angleToTarget);
        while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);

        const isHOBS = (w.trait === 'HOBS_VANE' || w.trait === 'ALL_ASPECT_BURST' || w.trait === 'REAR_ENGAGE');
        if (!isHOBS && offBoresight > (Math.PI / 3.0)) continue;

        const pkResult = Physics.calcPk(w, shooter, tgt, clouds);
        const pk = pkResult.pk || 0;
        if (pk < requiredPk && diffKey !== 'CADET') continue;

        let score = pk;
        const sweetMin = w.sweetSpotMin || (w.rangeKm * 0.15);
        const sweetMax = w.sweetSpotMax || (w.rangeKm * 0.70);
        if (dist >= sweetMin && dist <= sweetMax) score += 25;

        if (dist <= 25.0 && (w.seeker === 'IIR' || w.seeker === 'EO' || w.seeker === 'OPT')) score += 20;
        else if (dist >= 35.0 && w.seeker === 'ARH') score += 20;
        else if (dist <= 12.0 && w.rangeKm >= 90.0) score -= 30;

        if (tgt.isNotching || tgt.cmTimer > 0) {
          if (w.seeker === 'IIR' || w.seeker === 'EO') score += 25;
          else if (w.seeker === 'ARH') score -= 20;
        }

        const targetInCloud = clouds && clouds.some(c => c.containsPoint(tgt.x, tgt.y));
        if (targetInCloud && (w.seeker === 'IIR' || w.seeker === 'EO')) score -= 20;

        if (tgt.isFlightLead) score += 20;
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
      if (item && item.ammo > 0 && item.weapon && !item.weapon.isJammerPod && !item.weapon.isDecoy) {
        availablePylons.push({ index: i, item: item, weapon: item.weapon });
      }
    }
    if (availablePylons.length === 0) return null;

    const viableTargets = candidateTargets.filter(t => t && t.hp > 0 && !t.isCivilian);
    if (viableTargets.length === 0) return null;

    // Difficulty-scaled Ace blunders in target prioritization
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

    const target = viableTargets[0];
    const dist = Math.hypot(target.x - ace.x, target.y - ace.y);
    const inCloud = clouds && clouds.some(c => c.containsPoint(target.x, target.y));

    availablePylons.sort((a, b) => {
      const wa = a.weapon, wb = b.weapon;
      let sa = 0, sb = 0;
      if (dist <= 25.0 && (wa.seeker === 'IIR' || wa.seeker === 'EO' || wa.trait === 'HOBS_VANE')) sa += 40;
      if (dist <= 25.0 && (wb.seeker === 'IIR' || wb.seeker === 'EO' || wb.trait === 'HOBS_VANE')) sb += 40;
      if (dist >= 35.0 && wa.seeker === 'ARH') sa += 40;
      if (dist >= 35.0 && wb.seeker === 'ARH') sb += 40;
      if ((target.isNotching || target.cmTimer > 0) && (wa.seeker === 'IIR' || wa.seeker === 'EO')) sa += 30;
      if ((target.isNotching || target.cmTimer > 0) && (wb.seeker === 'IIR' || wb.seeker === 'EO')) sb += 30;
      if (inCloud && wa.seeker === 'ARH') sa += 25;
      if (inCloud && wb.seeker === 'ARH') sb += 25;
      return sb - sa;
    });

    const primary = availablePylons[0];
    if (!primary || dist > primary.weapon.rangeKm * 0.90 || dist < (primary.weapon.minRangeKm || 1.0)) return null;

    const pylonsToFire = [primary];
    const secondary = availablePylons.find(p => p.index !== primary.index && p.weapon.category === 'A2A' && dist <= p.weapon.rangeKm * 0.90 && dist >= (p.weapon.minRangeKm || 1.0));

    // Salvo decision with difficulty-scaled discipline
    if (secondary && (target.hp >= 3 || target.isFlightLead || availablePylons.length >= 3)) {
      const skipSalvo = blunderRoll && (diffKey === 'VETERAN' || diffKey === 'CADET');
      if (!skipSalvo) {
        pylonsToFire.push(secondary);
      }
    }

    return { target, pylonsToFire };
  }

  static estimateTargetEffectiveHp(target, allMissiles, team, diffKey) {
    if (!allMissiles || allMissiles.length === 0) return target.hp;
    const inbounds = allMissiles.filter(m => m.active && m.target && m.target.id === target.id && m.team === team);
    if (inbounds.length === 0) return target.hp;

    if (diffKey === 'CADET') {
      if (Math.random() < 0.65) return target.hp;
      return target.hp - inbounds.length * 1.5;
    }
    if (diffKey === 'VETERAN') {
      const approxDmg = inbounds.reduce((sum, m) => sum + ((m.weapon ? m.weapon.damage : 2) * 0.55), 0);
      return target.hp - approxDmg;
    }

    const hasDefenses = (target.cmTimer > 0 || target.isNotching || target.coffinDodgeBonus || target.isAce);
    const hitRateEst = hasDefenses ? 0.60 : 0.85;
    const expectedDamage = inbounds.reduce((sum, m) => sum + ((m.weapon ? m.weapon.damage : 3) * hitRateEst), 0);
    return target.hp - expectedDamage;
  }

  static calculateSalvoComposition(match, availablePylons, diffKey, shooter) {
    const tgt = match.target, w = match.weapon, pylonsToFire = [match.pylon];
    if (w.category !== 'A2A') return { target: tgt, pylonsToFire, primaryWeapon: w };

    const totalAmmoLeft = availablePylons.reduce((sum, p) => sum + (p.item.ammo || 0), 0);
    const isEvasive = Boolean(tgt.isAce || tgt.isCoffin || tgt.isFlightLead || tgt.spec.AGI_0 >= 0.92);
    const hp = match.effectiveHp;

    let desiredSalvo = 1;
    if (diffKey === 'CADET') {
      desiredSalvo = 1;
    } else if (diffKey === 'VETERAN') {
      // Normal: Salvo is rare (20%), single missile default
      if ((hp > w.damage || isEvasive) && totalAmmoLeft > 2 && Math.random() < 0.20) desiredSalvo = 2;
    } else {
      if (hp <= w.damage && !isEvasive) desiredSalvo = 1;
      else if (isEvasive || hp >= 4) desiredSalvo = (diffKey === 'ACE' || diffKey === 'MASTER' || diffKey === 'LEGEND') && totalAmmoLeft >= 4 ? 3 : 2;
      else desiredSalvo = 2;
      if (totalAmmoLeft <= 2 && desiredSalvo > 1 && !tgt.isFlightLead) desiredSalvo = 1;
    }

    if (desiredSalvo > 1) {
      const remaining = availablePylons.filter(p => p.index !== match.pylon.index && p.weapon.category === 'A2A');
      remaining.sort((a, b) => ((b.weapon.seeker !== w.seeker ? 10 : 0) - (a.weapon.seeker !== w.seeker ? 10 : 0)));
      for (let i = 0; i < (desiredSalvo - 1) && i < remaining.length; i++) {
        pylonsToFire.push(remaining[i]);
      }
    }

    return { target: tgt, pylonsToFire, primaryWeapon: w };
  }
}

window.AIMissileTactics = AIMissileTactics;