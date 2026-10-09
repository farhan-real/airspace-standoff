/**
 * AIRSPACE STANDOFF: Flight Kinematics, RF Detection Envelopes & Countermeasure Calculations
 */

const Physics = {
  calcWr(mLoad, mMax) {
    if (typeof mLoad !== 'number' || isNaN(mLoad)) {
      throw new Error(`calcWr requires a valid numeric mLoad, received: ${mLoad}`);
    }
    if (typeof mMax !== 'number' || isNaN(mMax) || mMax <= 0) {
      throw new Error(`calcWr requires a valid positive numeric mMax, received: ${mMax}`);
    }
    return Math.min(1.0, Math.max(0.0, mLoad / mMax));
  },

  calcEffectiveMaxSpeed(s0, wr) {
    if (typeof s0 !== 'number' || isNaN(s0)) throw new Error('calcEffectiveMaxSpeed requires numeric s0');
    if (typeof wr !== 'number' || isNaN(wr)) throw new Error('calcEffectiveMaxSpeed requires numeric wr');
    return s0 * (1.0 - 0.25 * wr);
  },

  calcEffectiveAcceleration(a0, wr) {
    if (typeof a0 !== 'number' || isNaN(a0)) throw new Error('calcEffectiveAcceleration requires numeric a0');
    if (typeof wr !== 'number' || isNaN(wr)) throw new Error('calcEffectiveAcceleration requires numeric wr');
    return a0 / (1.0 + 0.80 * wr);
  },

  calcTurnEfficiency(speed, sOpt) {
    if (typeof speed !== 'number' || isNaN(speed)) throw new Error('calcTurnEfficiency requires numeric speed');
    if (typeof sOpt !== 'number' || isNaN(sOpt) || sOpt <= 0) throw new Error('calcTurnEfficiency requires positive numeric sOpt');
    if (speed <= 0) return 0.40;
    if (speed >= sOpt) {
      return Math.max(0.40, Math.min(1.0, sOpt / speed));
    } else {
      return Math.max(0.40, Math.min(1.0, speed / sOpt));
    }
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
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    let count = 0;

    for (let i = 0; i < weatherClouds.length; i++) {
      const c = weatherClouds[i];
      if (maxX < c.x - c.rx || minX > c.x + c.rx || maxY < c.y - c.ry || minY > c.y + c.ry) continue;
      const hits = typeof c.intersectsSegment === 'function'
        ? c.intersectsSegment(x1, y1, x2, y2)
        : (c.containsPoint(x1, y1) || c.containsPoint(x2, y2));
      if (hits) count++;
    }
    return count;
  },

  getRadarMaxDetectionRange(sensorUnit, targetUnit, weatherClouds) {
    if (!sensorUnit) throw new Error('getRadarMaxDetectionRange requires sensorUnit.');
    if (!targetUnit) throw new Error('getRadarMaxDetectionRange requires targetUnit.');
    if (sensorUnit.hp <= 0 || targetUnit.hp <= 0) return 0.0;

    const baseR0 = sensorUnit.spec ? sensorUnit.spec.R_0 : sensorUnit.rangeKm;
    if (typeof baseR0 !== 'number' || isNaN(baseR0)) {
      throw new Error(`Sensor unit "${sensorUnit.id}" has no valid radar range (R_0 / rangeKm).`);
    }

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
        let baseSpike = targetUnit.spec ? targetUnit.spec.beamSpike : 3.2;
        let spike = baseSpike;
        if (targetUnit.beamSpikeReduction) spike = 1.0 + (spike - 1.0) * (1.0 - targetUnit.beamSpikeReduction);
        aspectMultiplier = spike;
      } else if (aspectOffNose > 2.1) {
        aspectMultiplier = 1.8;
      }
    }

    let effectiveRcs = targetUnit.effectiveRcs !== undefined ? targetUnit.effectiveRcs : (targetUnit.rcs !== undefined ? targetUnit.rcs : targetUnit.spec.sigma_0);
    effectiveRcs = Math.max(0.0001, effectiveRcs * aspectMultiplier);
    let maxDetectDist = baseR0 * Math.pow(effectiveRcs, 0.25);

    if (targetUnit.jamEfficiency && targetUnit.jamEfficiency > 0) {
      let jamImpact = targetUnit.jamEfficiency * 0.35;
      if (sensorUnit.hasECCM) jamImpact *= (1.0 - (sensorUnit.eccmBonus || 0.60));
      if (sensorUnit.hasGaNAESA) jamImpact *= 0.50;
      maxDetectDist *= (1.0 - jamImpact);
    }

    const tAlt = targetUnit.alt !== undefined ? targetUnit.alt : 0.0;
    const sAlt = sensorUnit.alt !== undefined ? sensorUnit.alt : 0.5;
    if (tAlt < 0.20 && sAlt > 0.40) {
      const clutterFactor = (sensorUnit.spec && sensorUnit.spec.lookDownBonus !== undefined)
        ? sensorUnit.spec.lookDownBonus
        : 0.45;
      maxDetectDist *= Math.max(0.50, Math.min(1.10, 0.55 + clutterFactor * 0.55));
    }

    const cloudHits = Physics.countIntersectingClouds(sensorUnit.x, sensorUnit.y, targetUnit.x, targetUnit.y, weatherClouds);
    if (cloudHits > 0) {
      const atten = window.CONFIG.CLOUD_RADAR_ATTENUATION;
      maxDetectDist *= Math.pow(1.0 - atten, cloudHits);
    }
    return maxDetectDist;
  },

  canRadarDetect(sensorUnit, targetUnit, weatherClouds) {
    const maxDist = Physics.getRadarMaxDetectionRange(sensorUnit, targetUnit, weatherClouds);
    return maxDist > 0.0 && Math.hypot(targetUnit.x - sensorUnit.x, targetUnit.y - sensorUnit.y) <= maxDist;
  },

  calcPk(weapon, attacker, target, weatherClouds) {
    if (!weapon) throw new Error('Physics.calcPk requires weapon parameter.');
    if (!attacker) throw new Error('Physics.calcPk requires attacker parameter.');

    if (!target || target.hp <= 0 || isNaN(target.x) || isNaN(attacker.x)) {
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
      if (dist > weapon.rangeKm) return { pk: 0, label: 'OUT OF RANGE', color: '#ef4444', arrow: '--', desc: `${Math.round(dist)}km > ${weapon.rangeKm}km`, salvoCount: 0, hasMixedSeekers: false };
      if (cloudHits > 0) return { pk: Math.max(25, 95 - cloudHits * 25), label: 'SCATTERED', color: '#f59e0b', arrow: '--', desc: `${cloudHits} cloud cells scattering beam`, salvoCount: 0, hasMixedSeekers: false };
      return { pk: 95, label: 'DIRECT BEAM', color: '#00f0ff', arrow: '--', desc: 'Speed-of-light directed energy beam', salvoCount: 0, hasMixedSeekers: false };
    }

    const isSurface = (typeof SurfaceUnit !== 'undefined' && target instanceof SurfaceUnit) || Boolean(target.type && !target.spec && !target.isCivilian);
    if (isSurface) {
      if (weapon.category === 'A2A') return { pk: 0, label: 'AIR ONLY', color: '#64748b', arrow: '--', desc: 'A2A munition requires air target', salvoCount: 0, hasMixedSeekers: false };
    } else {
      if (weapon.category === 'A2G' || weapon.isBunkerCracker) return { pk: 0, label: 'GROUND ONLY', color: '#64748b', arrow: '--', desc: 'A2G munition requires ground target', salvoCount: 0, hasMixedSeekers: false };
    }

    if (isNaN(dist) || dist > weapon.rangeKm) return { pk: 0, label: 'OUT OF RANGE', color: '#ef4444', arrow: '--', desc: `${Math.round(dist || 0)}km > ${weapon.rangeKm}km Max`, salvoCount: 0, hasMixedSeekers: false };
    const minR = weapon.minRangeKm;
    if (typeof minR !== 'number') throw new Error(`Weapon "${weapon.id}" is missing minRangeKm.`);
    if (dist < minR) return { pk: 15, label: 'TOO CLOSE', color: '#ef4444', arrow: 'v', desc: `Inside arming basket (<${minR}km)`, salvoCount: 0, hasMixedSeekers: false };

    const lambda = weapon.lambda;
    const pExp = weapon.p;
    if (typeof lambda !== 'number' || typeof pExp !== 'number') {
      throw new Error(`Weapon "${weapon.id}" is missing kinetic ballistic factors lambda or p.`);
    }

    const normDist = Math.max(0.0, Math.min(1.0, dist / weapon.rangeKm));
    let rangeScore = Math.max(0.20, 1.0 - lambda * Math.pow(normDist, pExp));

    if (weapon.trait === 'DUAL_PULSE_SURGE' && (dist <= 25.0 || normDist >= 0.60)) {
      rangeScore = Math.min(1.0, rangeScore + 0.16);
    }

    const isOpticalSeeker = (weapon.seeker === 'IIR' || weapon.seeker === 'EO' || weapon.seeker === 'OPT');
    const angleToTarget = Math.atan2(target.y - attacker.y, target.x - attacker.x);
    let aspectScore = 0.90;
    let aspectDiff = Math.PI;

    if (isSurface) {
      aspectScore = 1.00;
    } else {
      aspectDiff = Math.abs((target.heading !== undefined ? target.heading : angleToTarget) - angleToTarget);
      while (aspectDiff > Math.PI) aspectDiff = Math.abs(aspectDiff - Math.PI * 2);
      if (aspectDiff > 2.2) aspectScore = 1.00;
      else if (aspectDiff < 0.8) aspectScore = isOpticalSeeker ? 1.05 : 0.95;
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
        if (offBoresight > 0.6) offBoresightPenalty = (offBoresight - 0.6) * 0.18;
      }
    }

    let targetThermalMultiplier = Number(target.thermalBloom !== undefined ? target.thermalBloom : 1.0);
    if (target.irPenalty) targetThermalMultiplier *= (1.0 + target.irPenalty);
    const thermalModifier = isOpticalSeeker ? (targetThermalMultiplier - 1.0) * 0.22 + (aspectDiff < 0.8 ? 0.10 : 0.0) : 0.0;

    let salvoBonus = 0.0;
    let salvoCount = 0;
    let hasMixedSeekers = false;
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
    const notchBonus = (target.isNotching && isRadarSeeker)
      ? (attacker.hasIRST ? 0.16 : 0.38 * (1.0 - (weapon.antiNotchBonus || 0))) : 0.0;
    const chaffBonus = (target.cmTimer > 0)
      ? (isRadarSeeker ? 0.34 : 0.18) : 0.0;

    const activeEvasion = Math.max((target.activeManeuverBonus > 0 && target.glocTimer <= 0) ? target.activeManeuverBonus : 0.0, notchBonus, chaffBonus);
    const passiveBaseline = Math.max(target.isCoffin ? 0.25 : 0.0, target.isAce ? 0.08 : 0.0, target.isFlightLead ? 0.08 : 0.0);
    const targetEnergy = Math.max(0.20, Math.min(1.0, target.energy !== undefined ? target.energy : 1.0));
    let effectiveDefense = Math.min(0.50, Math.max(activeEvasion, passiveBaseline)) * Math.pow(targetEnergy, 0.75);
    if (hasMixedSeekers) effectiveDefense *= 0.55;

    const t0 = weapon.T_0;
    if (typeof t0 !== 'number') throw new Error(`Weapon "${weapon.id}" is missing T_0 base accuracy.`);

    const basePk = t0 * rangeScore * aspectScore - effectiveDefense + salvoBonus + thermalModifier - offBoresightPenalty;
    const pkPercent = Math.round(Math.max(15, Math.min(95, basePk * 100)));
    const isClosing = (aspectDiff > 1.8);
    const arrow = isClosing ? '^' : 'v';

    let label = 'MARGINAL';
    let color = '#f59e0b';
    if (isRearShot) { label = 'REAR SHOT'; color = '#00f5a0'; }
    else if (pkPercent >= 70) { label = 'OPTIMAL'; color = '#10b981'; }
    else if (pkPercent >= 45) { label = 'GOOD'; color = '#38bdf8'; }
    else { label = 'POOR'; color = '#f43f5e'; }

    return {
      pk: pkPercent, label, color, arrow,
      desc: salvoCount > 0 ? `Salvo x${salvoCount + 1}` : (isRearShot ? 'Rear trajectory lock' : 'Target solution locked'),
      salvoCount, hasMixedSeekers
    };
  }
};

window.Physics = Physics;