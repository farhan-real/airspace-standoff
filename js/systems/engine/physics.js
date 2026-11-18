/**
 * js/systems/engine/physics.js - Flight kinematics, RF detection envelopes, and Pk calculations.
 */

const Physics = {
  calcWr(mLoad, mMax) {
    if (typeof mLoad !== 'number' || isNaN(mLoad) || mLoad <= 0) return 0.0;
    if (typeof mMax !== 'number' || isNaN(mMax) || mMax <= 0) return 0.0;
    return Math.min(1.0, Math.max(0.0, mLoad / mMax));
  },

  calcEffectiveMaxSpeed(s0, wr) { return s0 * (1.0 - 0.25 * wr); },
  calcEffectiveAcceleration(a0, wr) { return a0 / (1.0 + 0.80 * wr); },

  calcTurnEfficiency(speed, sOpt) {
    if (speed <= 0) return 0.40;
    if (speed >= sOpt) return Math.max(0.40, Math.min(1.0, sOpt / speed));
    return Math.max(0.40, Math.min(1.0, speed / sOpt));
  },

  calcLeadInterceptAngle(mslX, mslY, mslSpeedMach, tgtX, tgtY, tgtHeading, tgtSpeedMach) {
    const mslKmPerSec = mslSpeedMach * 0.35;
    const tgtKmPerSec = tgtSpeedMach * 0.35;
    const dx = tgtX - mslX, dy = tgtY - mslY;
    const tGo = Math.hypot(dx, dy) / Math.max(0.1, mslKmPerSec);
    return Math.atan2((tgtY + Math.sin(tgtHeading) * tgtKmPerSec * tGo) - mslY, (tgtX + Math.cos(tgtHeading) * tgtKmPerSec * tGo) - mslX);
  },

  countIntersectingClouds(x1, y1, x2, y2, weatherClouds) {
    if (!weatherClouds || weatherClouds.length === 0) return 0;
    const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
    let count = 0;
    for (let i = 0; i < weatherClouds.length; i++) {
      const c = weatherClouds[i];
      if (maxX < c.x - c.rx || minX > c.x + c.rx || maxY < c.y - c.ry || minY > c.y + c.ry) continue;
      if (c.intersectsSegment(x1, y1, x2, y2)) count++;
    }
    return count;
  },

  getGroundJammingImpact(targetUnit, sensorUnit) {
    const surfaces = (window.Game && window.Game.surfaceUnits) || [];
    let maxJam = 0.0;
    for (let i = 0; i < surfaces.length; i++) {
      const s = surfaces[i];
      if (!s || s.hp <= 0.05 || !s.isJammerStation || s.jamEfficiency <= 0 || s.emconTimer > 0) continue;
      if (s.team === sensorUnit.team) continue;
      if (Math.hypot(targetUnit.x - s.x, targetUnit.y - s.y) <= s.rangeKm || Math.hypot(sensorUnit.x - s.x, sensorUnit.y - s.y) <= s.rangeKm) {
        maxJam = Math.max(maxJam, s.jamEfficiency);
      }
    }
    return maxJam;
  },

  getRadarMaxDetectionRange(sensorUnit, targetUnit, weatherClouds) {
    if (!sensorUnit || !targetUnit) return 0.0;
    if (sensorUnit.hp <= 0.05 || targetUnit.hp <= 0.05) return 0.0;
    if (sensorUnit.emconTimer && sensorUnit.emconTimer > 0) return 0.0;

    const baseR0 = (sensorUnit.spec && sensorUnit.spec.R_0 !== undefined) ? sensorUnit.spec.R_0 : sensorUnit.rangeKm;
    if (typeof baseR0 !== 'number' || isNaN(baseR0) || baseR0 <= 0) return 0.0;

    const dx = targetUnit.x - sensorUnit.x, dy = targetUnit.y - sensorUnit.y;
    const distSq = dx * dx + dy * dy;
    const maxBound = baseR0 * 2.5;
    if (distSq > maxBound * maxBound) return 0.0;

    if (sensorUnit.spec && sensorUnit.spec.minDetectAltFt && typeof targetUnit.altFt === 'number') {
      if (targetUnit.altFt < sensorUnit.spec.minDetectAltFt) return 0.0;
    }

    if (sensorUnit.heading !== undefined && sensorUnit.spec && sensorUnit.spec.radarConeDeg < 360) {
      let angleDiff = Math.abs(sensorUnit.heading - Math.atan2(dy, dx));
      while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
      if (angleDiff > (sensorUnit.spec.radarConeDeg / 2.0) * (Math.PI / 180.0)) return 0.0;
    }

    let aspectMultiplier = 1.0;
    if (typeof targetUnit.heading === 'number' && !isNaN(targetUnit.heading)) {
      let aspectOffNose = Math.abs(targetUnit.heading - Math.atan2(sensorUnit.y - targetUnit.y, sensorUnit.x - targetUnit.x));
      while (aspectOffNose > Math.PI) aspectOffNose = Math.abs(aspectOffNose - Math.PI * 2);
      if (aspectOffNose >= 1.0 && aspectOffNose <= 2.1) {
        let spike = targetUnit.spec ? targetUnit.spec.beamSpike : 3.2;
        if (targetUnit.beamSpikeReduction) spike = 1.0 + (spike - 1.0) * (1.0 - targetUnit.beamSpikeReduction);
        aspectMultiplier = spike;
      } else if (aspectOffNose > 2.1) {
        aspectMultiplier = 1.8;
      }
    }

    let effectiveRcs = targetUnit.effectiveRcs !== undefined ? targetUnit.effectiveRcs : (targetUnit.rcs !== undefined ? targetUnit.rcs : targetUnit.spec.sigma_0);
    const vhfMult = sensorUnit.counterStealthMult || (sensorUnit.spec && sensorUnit.spec.counterStealthMult) || 1.0;
    if (vhfMult > 1.0 && effectiveRcs < 0.5) {
      effectiveRcs = Math.max(effectiveRcs, Math.min(0.45, Math.pow(effectiveRcs, 0.45) * vhfMult * 0.25));
    }
    effectiveRcs = Math.max(0.0001, effectiveRcs * aspectMultiplier);
    let maxDetectDist = baseR0 * Math.pow(effectiveRcs, 0.25);

    const combinedJam = Math.max(targetUnit.jamEfficiency || 0, this.getGroundJammingImpact(targetUnit, sensorUnit));
    if (combinedJam > 0) {
      let jamImpact = combinedJam * 0.35;
      if (sensorUnit.hasECCM) jamImpact *= (1.0 - sensorUnit.eccmBonus);
      if (sensorUnit.hasGaNAESA) jamImpact *= 0.50;
      maxDetectDist *= (1.0 - jamImpact);
    }

    const tAlt = targetUnit.alt !== undefined ? targetUnit.alt : 0.0;
    const sAlt = sensorUnit.alt !== undefined ? sensorUnit.alt : 0.5;
    if (tAlt < 0.20 && sAlt > 0.40) {
      const clutterFactor = (sensorUnit.spec && typeof sensorUnit.spec.lookDownBonus === 'number') ? sensorUnit.spec.lookDownBonus : 0.0;
      maxDetectDist *= Math.max(0.50, Math.min(1.10, 0.55 + clutterFactor * 0.55));
    }
    if (tAlt < 0.20 && targetUnit.lowAltStealthMult !== undefined && targetUnit.lowAltStealthMult < 1.0) {
      maxDetectDist *= targetUnit.lowAltStealthMult;
    }

    if (distSq > maxDetectDist * maxDetectDist) return 0.0;

    const cloudHits = Physics.countIntersectingClouds(sensorUnit.x, sensorUnit.y, targetUnit.x, targetUnit.y, weatherClouds);
    if (cloudHits > 0) {
      maxDetectDist *= Math.pow(1.0 - window.CONFIG.CLOUD_RADAR_ATTENUATION, cloudHits);
    }
    return maxDetectDist;
  },

  canRadarDetect(sensorUnit, targetUnit, weatherClouds) {
    const maxDist = Physics.getRadarMaxDetectionRange(sensorUnit, targetUnit, weatherClouds);
    if (maxDist <= 0.0) return false;
    const dx = targetUnit.x - sensorUnit.x, dy = targetUnit.y - sensorUnit.y;
    return (dx * dx + dy * dy) <= (maxDist * maxDist);
  },

  calcPk(weapon, attacker, target, weatherClouds) {
    if (!weapon || !attacker) throw new Error('Physics.calcPk requires valid weapon and attacker.');
    if (!target || target.hp <= 0.05 || isNaN(target.x) || isNaN(attacker.x)) {
      return { pk: 0, label: 'NO TARGET', color: '#64748b', arrow: '--', desc: 'Select target', salvoCount: 0, hasMixedSeekers: false };
    }
    if (weapon.isJammerPod) return { pk: 0, label: 'ACTIVE ECM', color: '#38bdf8', arrow: '--', desc: `Jamming active (${Math.round(weapon.jamEfficiency * 100)}%)`, salvoCount: 0, hasMixedSeekers: false };
    if (weapon.isTargetingPod) return { pk: 0, label: 'ACTIVE TGP', color: '#00f5a0', arrow: '--', desc: `Recon ${weapon.spotRangeKm}km (+${Math.round(weapon.a2gPkBonus * 100)}% A2G Pk)`, salvoCount: 0, hasMixedSeekers: false };
    if (weapon.isDecoy || weapon.isDecoyDrone) return { pk: 100, label: 'DEFENSIVE', color: '#c084fc', arrow: '--', desc: weapon.isDecoyDrone ? 'MALD spoof drone' : 'FOTD decoy', salvoCount: 0, hasMixedSeekers: false };

    const isAcAttacker = (typeof Aircraft !== 'undefined' && attacker instanceof Aircraft);
    const effectiveRange = weapon.rangeKm * (isAcAttacker
      ? (weapon.isAntiRadiation ? attacker.armRangeMult : ((weapon.seeker === 'UNGUIDED' || weapon.isRocketPod) ? attacker.bombRangeBonus : 1.0))
      : 1.0);

    const dist = Math.hypot(target.x - attacker.x, target.y - attacker.y);
    const cloudHits = Physics.countIntersectingClouds(attacker.x, attacker.y, target.x, target.y, weatherClouds);

    if (weapon.isLaser || weapon.seeker === 'DIRECT_ENERGY') {
      if (dist > effectiveRange) return { pk: 0, label: 'OUT OF RANGE', color: '#ef4444', arrow: '--', desc: `${Math.round(dist)}km > ${effectiveRange.toFixed(0)}km`, salvoCount: 0, hasMixedSeekers: false };
      if (cloudHits > 0) return { pk: Math.max(10, Math.round(95 - cloudHits * 25)), label: 'SCATTERED', color: '#f59e0b', arrow: '--', desc: `${cloudHits} cloud cells scattering beam`, salvoCount: 0, hasMixedSeekers: false };
      return { pk: 95, label: 'DIRECT BEAM', color: '#00f0ff', arrow: '--', desc: 'Speed-of-light directed energy beam', salvoCount: 0, hasMixedSeekers: false };
    }

    const isSurface = (typeof SurfaceUnit !== 'undefined' && target instanceof SurfaceUnit) || Boolean(target.type && !target.spec && !target.isCivilian);
    const isGroundedAircraft = Boolean(target.groundPhase);
    if (isSurface) {
      if (weapon.category === 'A2A') return { pk: 0, label: 'AIR ONLY', color: '#64748b', arrow: '--', desc: 'A2A munition requires air target', salvoCount: 0, hasMixedSeekers: false };
    } else if (!isGroundedAircraft && (weapon.category === 'A2G' || weapon.isBunkerCracker)) {
      return { pk: 0, label: 'GROUND ONLY', color: '#64748b', arrow: '--', desc: 'A2G munition requires ground target', salvoCount: 0, hasMixedSeekers: false };
    }

    if (isNaN(dist) || dist > effectiveRange) return { pk: 0, label: 'OUT OF RANGE', color: '#ef4444', arrow: '--', desc: `${Math.round(dist || 0)}km > ${effectiveRange.toFixed(0)}km Max`, salvoCount: 0, hasMixedSeekers: false };
    const minR = weapon.category === 'SAM' ? 0 : weapon.minRangeKm;
    if (dist < minR) return { pk: 0, label: 'TOO CLOSE', color: '#ef4444', arrow: 'v', desc: `Inside arming basket (<${minR}km)`, salvoCount: 0, hasMixedSeekers: false };

    const normDist = Math.max(0.0, Math.min(1.0, dist / effectiveRange));
    let rangeScore = Math.max(0.20, 1.0 - weapon.lambda * Math.pow(normDist, weapon.p));
    if (weapon.trait === 'DUAL_PULSE_SURGE' && (dist <= 25.0 || normDist >= 0.60)) rangeScore = Math.min(1.0, rangeScore + 0.16);

    const isOpticalSeeker = (weapon.seeker === 'IIR' || weapon.seeker === 'EO' || weapon.seeker === 'OPT');
    const isLaserSeeker = (weapon.seeker === 'LASER');
    const angleToTarget = Math.atan2(target.y - attacker.y, target.x - attacker.x);
    let aspectScore = 0.90, aspectDiff = Math.PI;

    if (isSurface || isGroundedAircraft) {
      aspectScore = 1.00;
    } else {
      aspectDiff = Math.abs((target.heading !== undefined ? target.heading : angleToTarget) - angleToTarget);
      while (aspectDiff > Math.PI) aspectDiff = Math.abs(aspectDiff - Math.PI * 2);
      if (aspectDiff > 2.2) aspectScore = 1.00;
      else if (aspectDiff < 0.8) aspectScore = isOpticalSeeker ? 1.05 : 0.95;
    }

    let offBoresightPenalty = 0.0, isRearShot = false;
    if (!isSurface && !isGroundedAircraft && weapon.category !== 'SAM' && typeof attacker.heading === 'number') {
      let offBoresight = Math.abs(attacker.heading - angleToTarget);
      while (offBoresight > Math.PI) offBoresight = Math.abs(offBoresight - Math.PI * 2);
      const trait = weapon.trait || '';
      if (trait === 'REAR_ENGAGE') isRearShot = true;
      else if (trait !== 'ALL_ASPECT_BURST') {
        const isHobs = (trait === 'HOBS_VANE' || weapon.id === 'IRIS-T');
        const maxAngle = isHobs ? Math.PI * 0.65 : Math.PI * 0.45;
        if (offBoresight > maxAngle) return { pk: 0, label: 'OFF BORESIGHT', color: '#ef4444', arrow: 'v', desc: 'Target outside forward cone', salvoCount: 0, hasMixedSeekers: false };
        if (offBoresight > 0.6) offBoresightPenalty = (offBoresight - 0.6) * 0.18;
      }
    }

    if (isSurface || (isGroundedAircraft && (weapon.category === 'A2G' || weapon.isBunkerCracker))) {
      const tgpBonus = isAcAttacker ? ((attacker.targetingPodBonus || 0) + (attacker.hasIRST && !attacker.targetingPodBonus ? 0.08 : 0.0)) : 0.0;
      const ccipAdd = (isAcAttacker && (weapon.seeker === 'UNGUIDED' || weapon.isCluster || weapon.isRocketPod)) ? attacker.ccipBonus : 0.0;
      const armAdd = (isAcAttacker && weapon.isAntiRadiation) ? attacker.armPkBonus : 0.0;
      const mitlAdd = (isAcAttacker && (weapon.seeker === 'GPS_INS' || weapon.seeker === 'IIR' || weapon.seeker === 'INS')) ? attacker.mitlBonus : 0.0;
      const cloudMit = isAcAttacker ? attacker.cloudMitigation : 0.0;
      const laserWeatherPen = isLaserSeeker ? (cloudHits * 0.20 * (1.0 - cloudMit)) : 0.0;
      const altDispersionPen = (weapon.seeker === 'UNGUIDED' && !weapon.isRocketPod && attacker.altFt > 26000 && ccipAdd <= 0)
        ? (tgpBonus > 0 ? 0.08 : 0.18) : 0.0;
      const jamPen = (weapon.seeker !== 'UNGUIDED' && this.getGroundJammingImpact(target, attacker) > 0)
        ? 0.10 * (1.0 - (isAcAttacker ? attacker.eccmBonus : 0.0)) : 0.0;
      const rawA2g = (weapon.T_0 * rangeScore) + tgpBonus + ccipAdd + armAdd + mitlAdd - laserWeatherPen - altDispersionPen - jamPen;
      const pkPct = Math.round(Math.max(15, Math.min(95, rawA2g * 100)));
      const label = pkPct >= 75 ? 'OPTIMAL' : (pkPct >= 50 ? 'GOOD' : 'MARGINAL');
      const color = pkPct >= 75 ? '#10b981' : (pkPct >= 50 ? '#38bdf8' : '#f59e0b');
      return { pk: pkPct, label, color, arrow: '--', desc: tgpBonus > 0 ? 'Targeting Pod lock boost' : 'Ballistic ground solution', salvoCount: 0, hasMixedSeekers: false };
    }

    let targetThermalMultiplier = Number(target.thermalBloom !== undefined ? target.thermalBloom : 1.0);
    if (target.irPenalty) targetThermalMultiplier *= (1.0 + target.irPenalty);
    const thermalModifier = isOpticalSeeker ? (targetThermalMultiplier - 1.0) * 0.22 + (aspectDiff < 0.8 ? 0.10 : 0.0) : 0.0;

    let salvoBonus = 0.0, salvoCount = 0, hasMixedSeekers = false;
    if (window.Game && window.Game.missiles) {
      const inbounds = window.Game.missiles.filter(m => m.active && m.target && m.target.id === target.id);
      salvoCount = inbounds.length;
      if (salvoCount >= 1) {
        salvoBonus = Math.min(0.30, salvoCount * 0.12);
        const isRf = (s) => (s === 'ARH' || s === 'PASSIVE_RADAR' || s === 'INS' || s === 'INS_RADAR');
        const isOpt = (s) => (s === 'IIR' || s === 'EO' || s === 'OPT');
        if ((isRf(weapon.seeker) && inbounds.some(m => m.weapon && isOpt(m.weapon.seeker))) || (isOpt(weapon.seeker) && inbounds.some(m => m.weapon && isRf(m.weapon.seeker)))) {
          hasMixedSeekers = true;
          salvoBonus += window.CONFIG.MIXED_SEEKER_SYNERGY_BONUS;
        }
      }
    }

    const isRadarSeeker = (weapon.seeker === 'ARH' || weapon.seeker === 'PASSIVE_RADAR');
    const notchBonus = (target.isNotching && isRadarSeeker) ? (attacker.hasIRST ? 0.16 : 0.38 * (1.0 - (weapon.antiNotchBonus || 0))) : 0.0;
    const chaffBonus = (target.cmTimer > 0) ? (isRadarSeeker ? 0.34 : 0.18) : 0.0;
    const dircmBonus = (isOpticalSeeker && typeof target.dircmEvasion === 'number') ? target.dircmEvasion : 0.0;
    const activeEvasion = Math.max((target.activeManeuverBonus > 0 && target.glocTimer <= 0) ? target.activeManeuverBonus : 0.0, notchBonus, chaffBonus, dircmBonus);
    const passiveBaseline = Math.max(target.isCoffin ? 0.25 : 0.0, target.isAce ? 0.08 : 0.0, target.isFlightLead ? 0.08 : 0.0);
    const targetEnergy = Math.max(0.20, Math.min(1.0, target.energy !== undefined ? target.energy : 1.0));
    let effectiveDefense = Math.min(0.70, Math.max(activeEvasion, passiveBaseline)) * Math.pow(targetEnergy, 0.75);
    if (hasMixedSeekers) effectiveDefense *= 0.55;

    const weatherPenalty = (weatherClouds && isOpticalSeeker && weatherClouds.some(c => c.containsPoint(target.x, target.y))) ? 0.12 : 0.0;
    const basePk = weapon.T_0 * rangeScore * aspectScore - effectiveDefense + salvoBonus + thermalModifier - offBoresightPenalty - weatherPenalty;
    const pkPercent = Math.round(Math.max(0, Math.min(95, basePk * 100)));
    const arrow = (aspectDiff > 1.8) ? '^' : 'v';

    let label = 'MARGINAL', color = '#f59e0b';
    if (isRearShot) { label = 'REAR SHOT'; color = '#00f5a0'; }
    else if (pkPercent >= 70) { label = 'OPTIMAL'; color = '#10b981'; }
    else if (pkPercent >= 45) { label = 'GOOD'; color = '#38bdf8'; }
    else if (pkPercent > 0) { label = 'POOR'; color = '#f43f5e'; }
    else { label = 'DEFEATED'; color = '#64748b'; }

    return { pk: pkPercent, label, color, arrow, desc: salvoCount > 0 ? `Salvo x${salvoCount + 1}` : (isRearShot ? 'Rear trajectory lock' : (pkPercent > 0 ? 'Target solution locked' : 'Kinematically defeated')), salvoCount, hasMixedSeekers };
  }
};

window.Physics = Physics;
