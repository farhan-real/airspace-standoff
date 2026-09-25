/**
 * AIRSPACE STANDOFF: Flight Kinematics, RF Detection Envelopes & Countermeasure Calculations
 */

const Physics = {
  calcWr(mLoad, mMax) {
    if (!mMax || mMax <= 0) return 0.0;
    return Math.min(1.0, Math.max(0.0, mLoad / mMax));
  },

  calcEffectiveMaxSpeed(s0, wr) {
    return s0 * (1.0 - 0.25 * wr);
  },

  calcEffectiveAcceleration(a0, wr) {
    return a0 / (1.0 + 0.80 * wr);
  },

  calcTurnEfficiency(speed, sOpt) {
    if (!sOpt || sOpt <= 0.001) return 0.0;
    const ratio = (speed - sOpt) / sOpt;
    return Math.max(0.0, Math.min(1.0, 1.0 - 1.25 * Math.pow(ratio, 2)));
  },

  calcLeadInterceptAngle(mslX, mslY, mslSpeedMach, tgtX, tgtY, tgtHeading, tgtSpeedMach) {
    const mslKmPerSec = mslSpeedMach * 0.35;
    const tgtKmPerSec = tgtSpeedMach * 0.35;
    const dx = tgtX - mslX;
    const dy = tgtY - mslY;
    const dist = Math.hypot(dx, dy);
    const tGo = dist / Math.max(0.1, mslKmPerSec);
    return Math.atan2((tgtY + Math.sin(tgtHeading) * tgtKmPerSec * tGo) - mslY, (tgtX + Math.cos(tgtHeading) * tgtKmPerSec * tGo) - mslX);
  },

  countIntersectingClouds(x1, y1, x2, y2, weatherClouds) {
    if (!weatherClouds || weatherClouds.length === 0) return 0;
    let count = 0;
    for (const c of weatherClouds) {
      const hits = typeof c.intersectsSegment === 'function'
        ? c.intersectsSegment(x1, y1, x2, y2)
        : (c.containsPoint(x1, y1) || c.containsPoint(x2, y2));
      if (hits) count++;
    }
    return count;
  },

  getRadarMaxDetectionRange(sensorUnit, targetUnit, weatherClouds) {
    if (!sensorUnit || !targetUnit || sensorUnit.hp <= 0 || targetUnit.hp <= 0) return 0.0;
    const baseR0 = sensorUnit.spec ? (sensorUnit.spec.R_0 || 75.0) : (sensorUnit.rangeKm || 48.0);

    if (sensorUnit.heading !== undefined && sensorUnit.spec && sensorUnit.spec.radarConeDeg < 360) {
      let angleDiff = Math.abs(sensorUnit.heading - Math.atan2(targetUnit.y - sensorUnit.y, targetUnit.x - sensorUnit.x));
      while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
      if (angleDiff > (sensorUnit.spec.radarConeDeg / 2.0) * (Math.PI / 180.0)) return 0.0;
    }

    let aspectMultiplier = 1.0;
    if (typeof targetUnit.heading === 'number' && !isNaN(targetUnit.heading)) {
      let aspectOffNose = Math.abs(targetUnit.heading - Math.atan2(sensorUnit.y - targetUnit.y, sensorUnit.x - targetUnit.x));
      while (aspectOffNose > Math.PI) aspectOffNose = Math.abs(aspectOffNose - Math.PI * 2);

      if (aspectOffNose >= 1.0 && aspectOffNose <= 2.1) {
        let baseSpike = (targetUnit.spec && targetUnit.spec.beamSpike !== undefined) ? targetUnit.spec.beamSpike : 3.2;
        let spike = baseSpike;
        if (targetUnit.beamSpikeReduction) spike = 1.0 + (spike - 1.0) * (1.0 - targetUnit.beamSpikeReduction);
        aspectMultiplier = spike;
      } else if (aspectOffNose > 2.1) {
        aspectMultiplier = 1.8;
      } else {
        aspectMultiplier = 1.0;
      }
    }

    let effectiveRcs = targetUnit.effectiveRcs !== undefined ? targetUnit.effectiveRcs : (targetUnit.rcs !== undefined ? targetUnit.rcs : 1.0);
    effectiveRcs = Math.max(0.0001, effectiveRcs * aspectMultiplier);
    let maxDetectDist = baseR0 * Math.pow(effectiveRcs, 0.25);

    if (targetUnit.jamEfficiency && targetUnit.jamEfficiency > 0) {
      let jamImpact = targetUnit.jamEfficiency * 0.35;
      if (sensorUnit.hasECCM) jamImpact *= (1.0 - (sensorUnit.eccmBonus || 0.60));
      if (sensorUnit.hasGaNAESA) jamImpact *= 0.50;
      maxDetectDist *= (1.0 - jamImpact);
    }

    if (window.Game && window.Game.surfaceUnits) {
      const hostileJammers = window.Game.surfaceUnits.filter(s => s.hp > 0 && s.team !== sensorUnit.team && s.isJammerStation && Math.hypot(s.x - targetUnit.x, s.y - targetUnit.y) <= s.rangeKm);
      if (hostileJammers.length > 0) {
        let sJam = 0.30 * (sensorUnit.hasECCM ? (1.0 - (sensorUnit.eccmBonus || 0.60)) : 1.0);
        maxDetectDist *= (1.0 - sJam);
      }
    }

    const tAlt = targetUnit.alt !== undefined ? targetUnit.alt : 0.0;
    const sAlt = sensorUnit.alt !== undefined ? sensorUnit.alt : 0.5;
    if (tAlt < 0.20 && sAlt > 0.40) {
      maxDetectDist *= (0.70 + (sensorUnit.spec && sensorUnit.spec.lookDownBonus ? sensorUnit.spec.lookDownBonus : 0.20));
    }

    const cloudHits = Physics.countIntersectingClouds(sensorUnit.x, sensorUnit.y, targetUnit.x, targetUnit.y, weatherClouds);
    if (cloudHits > 0) {
      const atten = (window.CONFIG && window.CONFIG.CLOUD_RADAR_ATTENUATION) || 0.08;
      maxDetectDist *= Math.pow(1.0 - atten, cloudHits);
    }
    return maxDetectDist;
  },

  canRadarDetect(sensorUnit, targetUnit, weatherClouds) {
    const maxDist = Physics.getRadarMaxDetectionRange(sensorUnit, targetUnit, weatherClouds);
    return maxDist > 0.0 && Math.hypot(targetUnit.x - sensorUnit.x, targetUnit.y - sensorUnit.y) <= maxDist;
  },

  calcPk(weapon, attacker, target, weatherClouds) {
    if (!weapon || !attacker || !target || target.hp <= 0 || isNaN(target.x) || isNaN(attacker.x)) {
      return { pk: 0, label: 'NO TARGET', color: '#64748b', arrow: '--', desc: 'Select target', salvoCount: 0, hasMixedSeekers: false };
    }

    if (weapon.isJammerPod) {
      return { pk: 0, label: 'ACTIVE ECM', color: '#38bdf8', arrow: '--', desc: `Jamming active (${Math.round((weapon.jamEfficiency || 0.45)*100)}%)`, salvoCount: 0, hasMixedSeekers: false };
    }
    if (weapon.isDecoy || weapon.isDecoyDrone) {
      return { pk: 100, label: 'DEFENSIVE', color: '#c084fc', arrow: '--', desc: weapon.isDecoyDrone ? 'MALD spoof drone' : 'FOTD decoy', salvoCount: 0, hasMixedSeekers: false };
    }

    const dist = Math.hypot(target.x - attacker.x, target.y - attacker.y);
    const cloudHits = Physics.countIntersectingClouds(attacker.x, attacker.y, target.x, target.y, weatherClouds);

    if (weapon.isLaser || weapon.seeker === 'DIRECT_ENERGY') {
      if (dist > (weapon.rangeKm || 9.0)) return { pk: 0, label: 'OUT OF RANGE', color: '#64748b', arrow: '--', desc: `${Math.round(dist)}km > ${weapon.rangeKm || 9.0}km`, salvoCount: 0, hasMixedSeekers: false };
      if (cloudHits > 0) return { pk: Math.max(25, 95 - cloudHits * 25), label: 'SCATTERED', color: '#f59e0b', arrow: '--', desc: `${cloudHits} cloud cell${cloudHits > 1 ? 's' : ''} scattering beam`, salvoCount: 0, hasMixedSeekers: false };
      return { pk: 95, label: 'HITSCAN', color: '#00f0ff', arrow: '--', desc: 'Speed-of-light directed energy beam', salvoCount: 0, hasMixedSeekers: false };
    }

    const isSurface = (typeof SurfaceUnit !== 'undefined' && target instanceof SurfaceUnit) || Boolean(target.type && !target.spec && !target.isCivilian);
    if (isSurface) {
      if (weapon.category === 'A2A') return { pk: 0, label: 'AIR ONLY', color: '#64748b', arrow: '--', desc: 'A2A munition requires air target', salvoCount: 0, hasMixedSeekers: false };
    } else if (!target.isCivilian && !target.isGhost && !target.isDecoyDrone) {
      if (weapon.category === 'A2G' || weapon.isBunkerCracker) return { pk: 0, label: 'GROUND ONLY', color: '#64748b', arrow: '--', desc: 'A2G munition requires ground target', salvoCount: 0, hasMixedSeekers: false };
    }

    if (isNaN(dist) || dist > (weapon.rangeKm || 100)) return { pk: 0, label: 'OUT OF RANGE', color: '#64748b', arrow: '--', desc: `${Math.round(dist || 0)}km > ${weapon.rangeKm || 100}km Max`, salvoCount: 0, hasMixedSeekers: false };
    const minR = weapon.minRangeKm || 1.2;
    if (dist < minR) return { pk: 15, label: 'TOO CLOSE', color: '#ef4444', arrow: 'v', desc: `Inside arming basket (<${minR}km)`, salvoCount: 0, hasMixedSeekers: false };

    const sweetMin = weapon.sweetSpotMin || (weapon.rangeKm * 0.15);
    const sweetMax = weapon.sweetSpotMax || (weapon.rangeKm * 0.70);
    const rangeScore = (dist < sweetMin) ? (0.70 + 0.30 * (dist / sweetMin)) : ((dist > sweetMax) ? Math.max(0.35, 1.0 - (dist - sweetMax) / (weapon.rangeKm - sweetMax)) : 1.0);

    const angleToTarget = Math.atan2(target.y - attacker.y, target.x - attacker.x);
    let aspectScore = 0.90;
    let aspectDiff = Math.PI;

    if (isSurface) {
      aspectScore = 1.00;
    } else {
      aspectDiff = Math.abs((target.heading !== undefined ? target.heading : angleToTarget) - angleToTarget);
      while (aspectDiff > Math.PI) aspectDiff = Math.abs(aspectDiff - Math.PI * 2);
      if (target.isNotching && (weapon.seeker === 'ARH' || weapon.seeker === 'PASSIVE_RADAR')) aspectScore = attacker.hasIRST ? 0.75 : 0.45;
      else if (aspectDiff > 2.2) aspectScore = 1.00;
      else if (aspectDiff < 0.8) aspectScore = 0.85;
    }

    let offBoresightPenalty = 0.0;
    let isRearShot = false;
    if (!isSurface && typeof attacker.heading === 'number') {
      let offBoresight = Math.abs(attacker.heading - angleToTarget);
      while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
      const trait = weapon.trait || '';
      if (trait === 'REAR_ENGAGE') isRearShot = true;
      else if (trait !== 'ALL_ASPECT_BURST') {
        const isHobs = (trait === 'HOBS_VANE' || weapon.id === 'IRIS-T');
        const maxAngle = isHobs ? Math.PI * 0.65 : Math.PI * 0.45;
        if (offBoresight > maxAngle) {
          return { pk: 0, label: 'OFF BORESIGHT', color: '#ef4444', arrow: 'v', desc: 'Target outside forward acquisition cone', salvoCount: 0, hasMixedSeekers: false };
        }
        if (offBoresight > 0.6) {
          offBoresightPenalty = (offBoresight - 0.6) * 0.18;
        }
      }
    }

    const weatherPenalty = (cloudHits > 0 && (weapon.seeker === 'IIR' || weapon.seeker === 'EO' || weapon.seeker === 'OPT'))
      ? Math.min(0.40, cloudHits * 0.15)
      : 0.0;

    const afterburnerBonus = ((weapon.seeker === 'IIR' || weapon.seeker === 'EO') && target.engineAlpha > 0.85) ? 0.15 : 0.0;
    const heavyBonus = weapon.heavyTargetBonus ? ((target.Wr || 0) * 0.25) : 0.0;

    let jammerPenalty = 0.0;
    if (weapon.seeker === 'ARH') {
      if (target.jamEfficiency) jammerPenalty += target.jamEfficiency * 0.30 * (attacker.hasECCM ? 0.40 : 1.0);
      if (window.Game && window.Game.surfaceUnits && window.Game.surfaceUnits.some(s => s.hp > 0 && s.team === target.team && s.isJammerStation && Math.hypot(s.x - target.x, s.y - target.y) <= s.rangeKm)) {
        jammerPenalty += 0.25 * (attacker.hasECCM ? 0.40 : 1.0);
      }
    }

    let salvoBonus = 0.0;
    let salvoCount = 0;
    let hasMixedSeekers = false;
    const mixedBonusVal = (window.CONFIG && window.CONFIG.MIXED_SEEKER_SYNERGY_BONUS) || 0.25;

    if (window.Game && window.Game.missiles) {
      const inbounds = window.Game.missiles.filter(m => m.active && m.target && m.target.id === target.id);
      salvoCount = inbounds.length;
      if (salvoCount >= 1) {
        salvoBonus = Math.min(0.30, salvoCount * 0.12);
        const isRf = (s) => (s === 'ARH' || s === 'PASSIVE_RADAR' || s === 'INS' || s === 'INS_RADAR');
        const isOpt = (s) => (s === 'IIR' || s === 'EO' || s === 'OPT');
        if ((isRf(weapon.seeker) && inbounds.some(m => m.weapon && isOpt(m.weapon.seeker))) || (isOpt(weapon.seeker) && inbounds.some(m => m.weapon && isRf(m.weapon.seeker)))) {
          hasMixedSeekers = true;
          salvoBonus += mixedBonusVal;
        }
      }
    }

    const targetAgility = (typeof target.getEffectiveAgility === 'function')
      ? target.getEffectiveAgility()
      : ((target.spec && target.spec.AGI_0) ? target.spec.AGI_0 : 0.85);
    const agilityScale = Math.max(0.35, Math.min(1.65, targetAgility / 0.85));

    const sOpt = (typeof target.getOptimalCornerSpeed === 'function')
      ? target.getOptimalCornerSpeed()
      : ((target.effectiveMaxSpeed || 0.95) * 0.65);
    const turnOptEff = target.isCoffin
      ? 1.0
      : (typeof Physics !== 'undefined' ? Physics.calcTurnEfficiency(target.speed || 0.8, sOpt) : 0.85);
    const turnOptFactor = Math.max(0.40, Math.min(1.25, 0.50 + 0.50 * turnOptEff));

    const activeEvasion = Math.max(
      (target.activeManeuverBonus > 0 && target.glocTimer <= 0) ? (target.activeManeuverBonus * agilityScale * turnOptFactor) : 0.0,
      target.isNotching ? (0.28 * (0.6 + 0.4 * agilityScale)) : 0.0,
      target.cmTimer > 0 ? 0.30 : 0.0
    );
    const passiveBaseline = Math.max(
      target.isCoffin ? (target.coffinDodgeBonus || 0.25) : 0.0,
      target.isAce ? (target.aceEvasionBonus || 0.08) : 0.0,
      target.isFlightLead ? (target.leadEvasionBonus || 0.08) : 0.0
    );

    const targetEnergy = Math.max(0.20, Math.min(1.0, target.energy !== undefined ? target.energy : 1.0));
    let effectiveDefenseEstimate = Math.min(0.50, Math.max(activeEvasion, passiveBaseline) + 0.15 * Math.min(activeEvasion, passiveBaseline)) * Math.pow(targetEnergy, 0.75);
    if (hasMixedSeekers) effectiveDefenseEstimate *= 0.55;

    const energyBleedBonus = (1.0 - targetEnergy) * 0.25;
    const shooterStressPenalty = (attacker.stress >= 0.65 && !attacker.isCoffin && !attacker.spec.isDrone) ? 0.15 : 0.0;
    const agilityDefenseBonus = (targetAgility - 0.85) * 0.18;
    const turnOptBonus = (turnOptEff - 0.70) * 0.15;

    const basePk = (weapon.T_0 || 0.80) * rangeScore * aspectScore - effectiveDefenseEstimate - agilityDefenseBonus - turnOptBonus + energyBleedBonus + heavyBonus - weatherPenalty + salvoBonus + (attacker.pkBonus || 0) + afterburnerBonus - jammerPenalty - shooterStressPenalty - offBoresightPenalty;
    const pkPercent = Math.round(Math.max(12, Math.min(95, (isNaN(basePk) ? 0.50 : basePk) * 100)));
    const isClosing = (aspectDiff > 1.8);
    const arrow = (dist >= sweetMin && dist <= sweetMax) ? (isClosing ? '^' : 'v') : (isClosing ? (dist > sweetMax ? '^' : 'v') : 'v');

    let label = 'MARGINAL';
    let color = '#f59e0b';
    if (isRearShot) { label = 'REAR SHOT'; color = '#00f5a0'; }
    else if (pkPercent >= 70) { label = 'KILL SHOT'; color = '#10b981'; }
    else if (pkPercent >= 45) { label = 'GOOD'; color = '#38bdf8'; }
    else { label = 'POOR'; color = '#f43f5e'; }

    return {
      pk: pkPercent, label, color, arrow,
      desc: salvoCount > 0 ? `Salvo x${salvoCount + 1}` : (isRearShot ? 'Over-the-shoulder lock' : 'Target solution locked'),
      salvoCount, hasMixedSeekers,
      breakdown: {
        weaponBasePk: weapon.T_0 || 0.80, rangeKm: dist, rangeScore, sweetMinKm: sweetMin, sweetMaxKm: sweetMax,
        aspectDifferenceRad: aspectDiff, aspectScore, offBoresightPenalty, rearShot: isRearShot,
        activeEvasion, passiveBaseline, effectiveDefenseEstimate, mixedSeekers: hasMixedSeekers,
        targetEnergy, energyBleedBonus, targetAgility, agilityDefenseBonus, turnEfficiency: turnOptEff,
        turnEfficiencyPenalty: turnOptBonus, weatherPenalty, afterburnerBonus, heavyBonus,
        jammerPenalty, shooterStressPenalty, salvoBonus, salvoCount, preClampProbability: basePk,
        finalProbabilityPercent: pkPercent
      }
    };
  }
};

window.Physics = Physics;