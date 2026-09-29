/**
 * AIRSPACE STANDOFF: Missile Guidance & Kinematic Flight Triggers
 * Proportional navigation guidance, terminal hit triggers, and probability breakdown calculations.
 */

class MissileGuidanceSystem {
  static computeGuidance(missile, dt) {
    const tgt = missile.target;
    if (!tgt || typeof tgt.x !== 'number') return;

    const dx = tgt.x - missile.x;
    const dy = tgt.y - missile.y;
    const dist = Math.hypot(dx, dy);

    missile.distanceToTarget = dist;
    missile.minDistanceReached = Math.min(missile.minDistanceReached || dist, dist);

    const los = Math.atan2(dy, dx);
    const vm = Math.max(0.30, missile.speed * 0.35);
    const tgtSpeedKm = (tgt.speed || 0.8) * 0.35;
    const tgtHdg = tgt.heading || 0;
    const vtx = Math.cos(tgtHdg) * tgtSpeedKm;
    const vty = Math.sin(tgtHdg) * tgtSpeedKm;
    const vmx = Math.cos(missile.heading) * vm;
    const vmy = Math.sin(missile.heading) * vm;
    const vrx = vtx - vmx;
    const vry = vty - vmy;

    const safeDist = Math.max(2.0, dist);
    const losRate = (dx * vry - dy * vrx) / (safeDist * safeDist);
    const closingVel = -((dx * vrx + dy * vry) / Math.max(0.1, dist));

    if (!missile.hasStartedClosing && (closingVel > 0.05 || dist < (missile.prevDistanceToTarget || dist))) {
      missile.hasStartedClosing = true;
    }

    const desiredLead = (typeof Physics !== 'undefined')
      ? Physics.calcLeadInterceptAngle(missile.x, missile.y, missile.speed, tgt.x, tgt.y, tgtHdg, tgt.speed || 0.8)
      : los;
    let leadDiff = desiredLead - missile.heading;
    while (leadDiff < -Math.PI) leadDiff += Math.PI * 2;
    while (leadDiff > Math.PI) leadDiff -= Math.PI * 2;

    const maxRate = (typeof MissileKinetics !== 'undefined') ? MissileKinetics.getMaxTurnRate(missile) : 2.2;

    let N = 4.0;
    if (tgt.activeManeuverTimer > 0) {
      if (tgt.isNotching && missile.weapon && (missile.weapon.seeker === 'ARH' || missile.weapon.seeker === 'PASSIVE_RADAR')) N = 0.6;
      else if (tgt.activeManeuverId === 'BARREL_ROLL') N = 1.2;
      else if (tgt.activeManeuverId === 'BREAK_TURN') N = 2.4;
    }

    const effClosing = Math.max(0.05, closingVel);
    const proNavTurn = N * (effClosing / vm) * losRate;
    const leadGain = (dist <= 3.0) ? 3.2 : 2.4;
    const commandedTurn = proNavTurn + leadDiff * leadGain;

    const clampedRate = Math.max(-maxRate, Math.min(maxRate, commandedTurn));
    missile.heading += clampedRate * dt;
    while (missile.heading < 0) missile.heading += Math.PI * 2;
    while (missile.heading >= Math.PI * 2) missile.heading -= Math.PI * 2;

    missile.cumulativeTurn = (missile.cumulativeTurn || 0) + Math.abs(clampedRate * dt);
    if (missile.hasStartedClosing && missile.minDistanceReached <= 2.0 && missile.cumulativeTurn > Math.PI * 3.0 && missile.age > 3.0) {
      missile.triggerLostTrack('KINETIC OVERSHOOT');
    }
  }

  static checkTerminalTrigger(missile) {
    const dist = missile.distanceToTarget;
    const prevDist = missile.prevDistanceToTarget;
    const tgt = missile.target;

    const minArmTime = Math.min(0.20, (missile.weapon.minRangeKm || 0.6) / Math.max(0.1, (missile.speed || 2.4) * 0.35));
    if (missile.age < minArmTime) return { shouldTrigger: false };
    if (!missile.hasStartedClosing && missile.age < 0.8) return { shouldTrigger: false };

    if (dist <= 0.85) return { shouldTrigger: true, isHitCandidate: true };

    if (missile.hasStartedClosing && dist > prevDist && (missile.minDistanceReached <= 2.0)) {
      if (missile.minDistanceReached <= 1.1) {
        return { shouldTrigger: true, isHitCandidate: true };
      }
      if (tgt && typeof tgt.x === 'number') {
        const forwardDot = (tgt.x - missile.x) * Math.cos(missile.heading) + (tgt.y - missile.y) * Math.sin(missile.heading);
        if (forwardDot <= 0 || dist > (missile.minDistanceReached + 0.6)) {
          return { shouldTrigger: true, isHitCandidate: false, isOvershoot: true };
        }
      }
    }

    if (missile.hasStartedClosing && missile.minDistanceReached <= 2.0 && (missile.cumulativeTurn || 0) > Math.PI * 3.0 && missile.age > 3.0) {
      return { shouldTrigger: true, isHitCandidate: false, isOvershoot: true };
    }

    return { shouldTrigger: false };
  }

  static explainHitProbability(missile, target, weatherClouds, salvoCount) {
    const w = missile.weapon || {};
    const basePk = (w.T_0 || 0.80);

    const lambda = (w.lambda !== undefined) ? w.lambda : 0.40;
    const pExp = (w.p !== undefined) ? w.p : 1.0;
    const normDist = Math.max(0.0, Math.min(1.0, missile.distanceTraveled / Math.max(1.0, w.rangeKm || 40.0)));
    let kineticRetention = Math.max(0.20, 1.0 - lambda * Math.pow(normDist, pExp));

    let pulseSurgeBonus = 0.0;
    if (w.trait === 'DUAL_PULSE_SURGE') {
      if (missile.stage === 'PULSE 2' || missile.hasIgnitedPulseTwo || missile.distanceToTarget <= 25.0) {
        pulseSurgeBonus = 0.18;
        kineticRetention = Math.min(1.0, kineticRetention + pulseSurgeBonus);
      }
    }

    const isManeuvering = (target.activeManeuverTimer > 0 && target.glocTimer <= 0);
    const activeManeuver = isManeuvering ? (target.activeManeuverBonus || 0.35) : 0.0;

    const angleToTarget = Math.atan2(target.y - missile.y, target.x - missile.x);
    let aspectDiff = Math.abs((target.heading !== undefined ? target.heading : angleToTarget) - angleToTarget);
    while (aspectDiff > Math.PI) aspectDiff = Math.abs(aspectDiff - Math.PI * 2);

    const isOptical = (w.seeker === 'IIR' || w.seeker === 'EO' || w.seeker === 'OPT');
    let aspectScore = (aspectDiff > 2.2) ? 1.00 : ((aspectDiff < 0.8) ? (isOptical ? 1.05 : 0.95) : 0.90);

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

    const isRadar = (w.seeker === 'ARH' || w.seeker === 'PASSIVE_RADAR');

    const notchBonus = (target.isNotching && isRadar)
      ? (missile.source && missile.source.hasIRST ? 0.16 : 0.38 * (1.0 - (w.antiNotchBonus || 0)) * (0.6 + 0.4 * agilityScale))
      : 0.0;
    const chaffBonus = (target.cmTimer > 0)
      ? (isRadar ? 0.34 * (1.0 - (w.decoyResistance || w.flareResistance || 0)) : (isOptical ? 0.18 * (1.0 - (w.decoyResistance || 0)) : 0.20))
      : 0.0;

    const primaryActiveEvasion = Math.max(activeManeuver, notchBonus, chaffBonus);
    const primaryPassiveBaseline = Math.max(
      target.isCoffin ? (target.coffinDodgeBonus || 0.25) : 0.0,
      target.isAce ? (target.aceEvasionBonus || 0.08) : 0.0,
      target.isFlightLead ? (target.leadEvasionBonus || 0.08) : 0.0
    );

    let hasMixedSeekers = false;
    const mixedBonusVal = (window.CONFIG && window.CONFIG.MIXED_SEEKER_SYNERGY_BONUS) || 0.25;
    if (window.Game && window.Game.missiles) {
      const inbounds = window.Game.missiles.filter(m => (m.active || m.id === missile.id) && m.target && m.target.id === target.id);
      const isRf = (s) => (s === 'ARH' || s === 'PASSIVE_RADAR' || s === 'INS' || s === 'INS_RADAR');
      const isOpt = (s) => (s === 'IIR' || s === 'EO' || s === 'OPT');
      hasMixedSeekers = (inbounds.some(m => m.weapon && isRf(m.weapon.seeker)) && inbounds.some(m => m.weapon && isOpt(m.weapon.seeker)));
    }

    let effectiveDefense = Math.min(0.65, primaryActiveEvasion + 0.25 * primaryPassiveBaseline);
    if (hasMixedSeekers) effectiveDefense *= 0.55;

    const salvoBonus = Math.min(0.30, Math.max(0, (salvoCount || 1) - 1) * 0.12);
    const weatherPenalty = (weatherClouds && isOptical && weatherClouds.some(c => c.containsPoint(target.x, target.y))) ? 0.25 : 0.0;

    let targetThermalMultiplier = Number(target.thermalBloom !== undefined ? target.thermalBloom : 1.0);
    if (target.irPenalty) targetThermalMultiplier *= (1.0 + target.irPenalty);

    let thermalModifier = 0.0;
    if (isOptical) {
      const baseThermalBoost = aspectDiff < 0.8 ? 0.10 : 0.0;
      thermalModifier = (targetThermalMultiplier - 1.0) * 0.22 + baseThermalBoost;
    }

    const mixedSynergyBonus = hasMixedSeekers ? mixedBonusVal : 0.0;

    let energyTurnPenalty = 0.0;
    if (missile.cumulativeTurn && missile.cumulativeTurn > Math.PI && w.trait !== 'REAR_ENGAGE' && w.trait !== 'ALL_ASPECT_BURST') {
      energyTurnPenalty = Math.min(0.12, (missile.cumulativeTurn - Math.PI) * 0.05);
    }

    const heavyBonus = w.heavyTargetBonus ? ((target.Wr || 0) * 0.25) : 0.0;
    const energyDeficitBonus = (1.0 - (target.energy !== undefined ? target.energy : 1.0)) * 0.25;
    const agilityDefenseBonus = (targetAgility - 0.85) * 0.12;
    const turnOptBonus = (turnOptEff - 0.70) * 0.10;

    const rawProb = (basePk * aspectScore * kineticRetention) - effectiveDefense - agilityDefenseBonus - turnOptBonus + salvoBonus + mixedSynergyBonus + thermalModifier + heavyBonus + energyDeficitBonus - weatherPenalty - energyTurnPenalty;
    const probabilityFloor = isManeuvering ? 0.15 : (target.isAce ? 0.20 : (target.isCoffin ? 0.15 : (target.isFlightLead ? 0.18 : 0.20)));
    const probability = Math.max(probabilityFloor, Math.min(0.95, rawProb));

    return {
      probability,
      rawProbability: rawProb,
      probabilityFloor,
      probabilityCeiling: 0.95,
      factors: {
        baseHitProbability: basePk,
        kineticRetention,
        lambda,
        pExp,
        pulseSurgeBonus,
        aspectDifferenceRad: aspectDiff,
        aspectScore,
        activeManeuverEvasion: activeManeuver,
        notchBonus,
        chaffBonus,
        combinedActiveEvasion: primaryActiveEvasion,
        passiveEvasionBaseline: primaryPassiveBaseline,
        effectiveDefense,
        mixedSeekers: hasMixedSeekers,
        salvoBonus,
        mixedSeekerBonus: mixedSynergyBonus,
        thermalModifier,
        targetThermalBloom: targetThermalMultiplier,
        heavyTargetBonus: heavyBonus,
        targetEnergyBonus: energyDeficitBonus,
        agilityPenalty: agilityDefenseBonus,
        turnEfficiency: turnOptEff,
        turnEfficiencyPenalty: turnOptBonus,
        opticalWeatherPenalty: weatherPenalty,
        excessiveTurnPenalty: energyTurnPenalty
      }
    };
  }
}

window.MissileGuidanceSystem = MissileGuidanceSystem;