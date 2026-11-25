/**
 * js/systems/missiles/guidance.js - Proportional navigation guidance, terminal hit triggers, and Pk breakdown.
 */

class MissileGuidanceSystem {
  static initSeekerProfile(missile) {
    const w = missile.weapon || {};
    const seeker = w.seeker || 'ARH';
    const range = w.rangeKm || 40.0;
    const trait = w.trait || '';
    let baseSeeker = 18.0;
    let coneDeg = 110;

    if (typeof w.seekerRangeKm === 'number') {
      baseSeeker = w.seekerRangeKm;
    } else if (seeker === 'ARH') {
      if (w.category === 'SAM') baseSeeker = Math.min(26.0, Math.max(12.0, range * 0.25));
      else baseSeeker = Math.min(30.0, Math.max(15.0, range * 0.24));
      if (trait === 'AESA_ANTI_NOTCH' || trait === 'STEALTH_SEEKER') baseSeeker = Math.min(32.0, baseSeeker + 3.0);
    } else if (seeker === 'IIR' || seeker === 'EO' || seeker === 'OPT') {
      if (trait === 'REAR_ENGAGE' || trait === 'ALL_ASPECT_BURST') coneDeg = 360;
      else coneDeg = 120;
      baseSeeker = (w.category === 'A2G') ? 16.0 : Math.min(26.0, Math.max(12.0, range * 0.42));
    } else if (seeker === 'PASSIVE_RADAR') {
      baseSeeker = Math.min(range, 48.0);
      coneDeg = 120;
    } else if (seeker === 'INS') {
      baseSeeker = 18.0;
    } else if (seeker === 'MMW' || seeker === 'MMW_IIR') {
      baseSeeker = 18.0;
    } else if (seeker === 'LASER') {
      baseSeeker = 12.0;
    } else if (seeker === 'GPS_INS' || seeker === 'UNGUIDED') {
      baseSeeker = range;
      coneDeg = 360;
    }

    missile.seekerRangeKm = baseSeeker;
    missile.effectiveSeekerRangeKm = baseSeeker;
    missile.seekerConeDeg = coneDeg;
  }

  static getEffectiveSeekerRange(missile, tgt, weatherClouds) {
    const w = missile.weapon || {};
    const seeker = w.seeker || 'ARH';
    const base = missile.seekerRangeKm || 18.0;

    if (seeker === 'GPS_INS' || seeker === 'UNGUIDED') return base;

    if (seeker === 'ARH') {
      const tgtRcs = (tgt.effectiveRcs !== undefined) ? tgt.effectiveRcs : ((tgt.spec && tgt.spec.sigma_0) || 1.0);
      const rcsScale = Math.max(0.58, Math.min(1.22, Math.pow(Math.max(0.0005, tgtRcs), 0.14)));
      const jamVal = tgt.jamEfficiency || 0;
      const jamFactor = jamVal > 0 ? Math.max(0.68, 1.0 - jamVal * 0.25 * (1.0 - (w.antiNotchBonus || 0))) : 1.0;
      return base * rcsScale * jamFactor;
    }

    if (seeker === 'IIR' || seeker === 'EO' || seeker === 'OPT') {
      const thermal = Number(tgt.thermalBloom !== undefined ? tgt.thermalBloom : 1.0);
      const thermalScale = Math.max(0.80, Math.min(1.25, 0.85 + thermal * 0.15));
      const clouds = weatherClouds || [];
      const cloudHits = (typeof Physics !== 'undefined' && clouds.length > 0)
        ? Physics.countIntersectingClouds(missile.x, missile.y, tgt.x, tgt.y, clouds) : 0;
      const cloudFactor = cloudHits > 0 ? Math.max(0.60, 1.0 - cloudHits * 0.14) : 1.0;
      return base * thermalScale * cloudFactor;
    }

    if (seeker === 'PASSIVE_RADAR') {
      const isEmitting = tgt.type
        ? (Boolean(tgt.isEmitter) && !(tgt.emconTimer > 0))
        : (Boolean(tgt.jamEfficiency > 0) || Boolean(tgt.spec && tgt.spec.R_0 > 0));
      if (isEmitting) return base;
      return w.antiEmcon ? 12.0 : 0.0;
    }

    return base;
  }

  static hasFriendlyMidcourseSupport(missile, tgt) {
    const game = window.Game;
    if (!game || game.playerMode === '2P') return true;
    if (!tgt) return false;
    const team = missile.team;
    const w = missile.weapon || {};

    if (w.seeker === 'GPS_INS' || w.seeker === 'UNGUIDED') return true;

    const isSurface = (typeof SurfaceUnit !== 'undefined' && tgt instanceof SurfaceUnit) || Boolean(tgt.type && !tgt.spec && !tgt.isCivilian);
    if (isSurface) {
      if (w.seeker === 'LASER') {
        const allies = (team === 'friendly') ? (game.alliedAircraft || []) : (game.hostileAircraft || []);
        for (let i = 0; i < allies.length; i++) {
          const a = allies[i];
          if (!a || a.hp <= 0.05) continue;
          const tgpReach = Math.max(24.0, a.targetingSpotRangeKm || (a.hasIRST ? 30.0 : 0.0));
          if (Math.hypot(tgt.x - a.x, tgt.y - a.y) <= tgpReach) return true;
        }
        return false;
      }
      return Boolean(team === 'hostile' || tgt.isRevealedToBlue || tgt.identifiedByBlue);
    }

    if (tgt.isDecoyDrone || tgt.isGhost || tgt.isCivilian) {
      return (team === 'friendly')
        ? Boolean(game.detectedByBlue && game.detectedByBlue.has(tgt.id))
        : Boolean(game.detectedByRed && game.detectedByRed.has(tgt.id));
    }

    if (team === 'friendly') {
      return Boolean(tgt.activelyTrackedByBlue || tgt._inSensorRange || (game.simulation && game.simulation._satelliteUplinkAnnouncedBlue));
    }
    return Boolean(tgt.activelyTrackedByRed || tgt._inRedSensor);
  }

  static computeGuidance(missile, dt) {
    const tgt = missile.target;
    if (!tgt || typeof tgt.x !== 'number' || typeof tgt.y !== 'number') {
      throw new Error(`Missile "${missile.id}" has invalid target coordinates in computeGuidance.`);
    }

    const clouds = (window.Game && window.Game.simulation && window.Game.simulation.weatherClouds) || [];
    const realDx = tgt.x - missile.x;
    const realDy = tgt.y - missile.y;
    const realDist = Math.hypot(realDx, realDy);

    missile.distanceToTarget = realDist;
    missile.minDistanceReached = Math.min(missile.minDistanceReached, realDist);

    const isStationaryTarget = (typeof SurfaceUnit !== 'undefined' && tgt instanceof SurfaceUnit) ||
      Boolean(tgt.type && !tgt.spec && !tgt.isCivilian);

    let tgtSpeedMach = 0.0;
    let tgtHdg = 0.0;
    if (!isStationaryTarget) {
      if (typeof tgt.speed !== 'number' || isNaN(tgt.speed)) {
        throw new Error(`Moving target "${tgt.id || 'UNKNOWN'}" has invalid speed: ${tgt.speed}`);
      }
      tgtSpeedMach = tgt.speed;
      tgtHdg = (typeof tgt.heading === 'number' && !isNaN(tgt.heading)) ? tgt.heading : 0.0;
    }

    const effSeekerRange = this.getEffectiveSeekerRange(missile, tgt, clouds);
    missile.effectiveSeekerRangeKm = effSeekerRange;

    const halfConeRad = ((missile.seekerConeDeg || 110) / 2.0) * (Math.PI / 180.0);
    let seekerAngleDiff = Math.abs(Math.atan2(realDy, realDx) - (missile.heading || 0));
    while (seekerAngleDiff > Math.PI) seekerAngleDiff = Math.abs(seekerAngleDiff - Math.PI * 2);

    const ownSeekerTracks = (effSeekerRange > 0) && (realDist <= effSeekerRange) && (seekerAngleDiff <= halfConeRad);
    const midcourseActive = this.hasFriendlyMidcourseSupport(missile, tgt);

    missile.hasOwnSeekerLock = ownSeekerTracks;
    missile.hasMidcourseDatalink = midcourseActive;

    const realVtx = Math.cos(tgtHdg) * (tgtSpeedMach * 0.35);
    const realVty = Math.sin(tgtHdg) * (tgtSpeedMach * 0.35);

    let guideX = tgt.x;
    let guideY = tgt.y;
    let guideVx = realVtx;
    let guideVy = realVty;
    let guideSpeedMach = tgtSpeedMach;
    let guideHdg = tgtHdg;

    if (ownSeekerTracks) {
      missile.guidanceMode = 'ACTIVE_SEEKER';
      missile.inertialCoastTime = 0.0;
      missile.lastKnownTargetX = tgt.x;
      missile.lastKnownTargetY = tgt.y;
      missile.lastKnownTargetVx = realVtx;
      missile.lastKnownTargetVy = realVty;
    } else if (midcourseActive) {
      missile.guidanceMode = 'MIDCOURSE';
      missile.inertialCoastTime = 0.0;
      missile.lastKnownTargetX = tgt.x;
      missile.lastKnownTargetY = tgt.y;
      missile.lastKnownTargetVx = realVtx;
      missile.lastKnownTargetVy = realVty;
    } else {
      missile.guidanceMode = 'COAST_INERTIAL';
      missile.inertialCoastTime = (missile.inertialCoastTime || 0.0) + dt;
      missile.lastKnownTargetX = (missile.lastKnownTargetX !== undefined ? missile.lastKnownTargetX : tgt.x) + (missile.lastKnownTargetVx || 0) * dt;
      missile.lastKnownTargetY = (missile.lastKnownTargetY !== undefined ? missile.lastKnownTargetY : tgt.y) + (missile.lastKnownTargetVy || 0) * dt;
      guideX = missile.lastKnownTargetX;
      guideY = missile.lastKnownTargetY;
      guideVx = missile.lastKnownTargetVx || 0;
      guideVy = missile.lastKnownTargetVy || 0;
      const gSpdKm = Math.hypot(guideVx, guideVy);
      guideSpeedMach = gSpdKm / 0.35;
      guideHdg = gSpdKm > 0.001 ? Math.atan2(guideVy, guideVx) : tgtHdg;
      const distToPredicted = Math.hypot(guideX - missile.x, guideY - missile.y);
      if ((distToPredicted <= 1.2 || missile.inertialCoastTime >= 11.0) && !ownSeekerTracks) {
        missile.triggerLostTrack('MIDCOURSE DATALINK LOST');
        return;
      }
    }

    const dx = guideX - missile.x;
    const dy = guideY - missile.y;
    const dist = Math.hypot(dx, dy);

    const vm = Math.max(0.15, missile.speed * 0.35);
    const vmx = Math.cos(missile.heading) * vm;
    const vmy = Math.sin(missile.heading) * vm;
    const vrx = guideVx - vmx;
    const vry = guideVy - vmy;

    const safeDist = Math.max(1.2, dist);
    const losRate = (dx * vry - dy * vrx) / (safeDist * safeDist);
    const closingVel = -((dx * vrx + dy * vry) / Math.max(0.1, dist));

    if (!missile.hasStartedClosing && (closingVel > 0.05 || realDist < missile.prevDistanceToTarget)) {
      missile.hasStartedClosing = true;
    }

    const desiredLead = (isStationaryTarget || missile.guidanceMode === 'COAST_INERTIAL')
      ? Math.atan2(dy, dx)
      : Physics.calcLeadInterceptAngle(missile.x, missile.y, missile.speed, guideX, guideY, guideHdg, guideSpeedMach);

    let leadDiff = desiredLead - missile.heading;
    while (leadDiff < -Math.PI) leadDiff += Math.PI * 2;
    while (leadDiff > Math.PI) leadDiff -= Math.PI * 2;

    const maxRate = MissileKinetics.getMaxTurnRate(missile);

    let N = 4.0;
    if (!isStationaryTarget && tgt.activeManeuverTimer > 0) {
      if (tgt.isNotching && missile.weapon && (missile.weapon.seeker === 'ARH' || missile.weapon.seeker === 'PASSIVE_RADAR')) N = 2.4;
      else if (tgt.activeManeuverId === 'PUSH_COBRA') N = 2.8;
      else if (tgt.activeManeuverId === 'BARREL_ROLL') N = 3.0;
      else if (tgt.activeManeuverId === 'SPLIT_S') N = 3.2;
      else if (tgt.activeManeuverId === 'BREAK_TURN') N = 3.4;
      else if (tgt.activeManeuverId === 'ZOOM_CLIMB') N = 3.4;
    }

    const effClosing = Math.max(0.05, closingVel);
    const proNavTurn = N * (effClosing / vm) * losRate;
    const leadGain = (dist <= 4.0) ? 3.5 : 2.6;
    const commandedTurn = proNavTurn + leadDiff * leadGain;

    const clampedRate = Math.max(-maxRate, Math.min(maxRate, commandedTurn));
    missile.heading += clampedRate * dt;
    while (missile.heading < 0) missile.heading += Math.PI * 2;
    while (missile.heading >= Math.PI * 2) missile.heading -= Math.PI * 2;

    missile.cumulativeTurn += Math.abs(clampedRate * dt);
    if (missile.hasStartedClosing && missile.minDistanceReached <= 2.0 && missile.cumulativeTurn > Math.PI * 3.0 && missile.age > 3.0) {
      missile.triggerLostTrack('KINETIC OVERSHOOT');
    }
  }

  static checkTerminalTrigger(missile) {
    const dist = missile.distanceToTarget;
    const prevDist = missile.prevDistanceToTarget;
    const tgt = missile.target;

    const minArmTime = Math.min(0.20, (missile.weapon.minRangeKm || 0.6) / Math.max(0.1, missile.speed * 0.35));
    if (missile.age < minArmTime) return { shouldTrigger: false };
    if (!missile.hasStartedClosing && missile.age < 0.8) return { shouldTrigger: false };

    if (dist <= 0.85) return { shouldTrigger: true, isHitCandidate: true };

    if (missile.hasStartedClosing && dist > prevDist && missile.minDistanceReached <= 2.0) {
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

    if (!missile.hasOwnSeekerLock && missile.guidanceMode === 'COAST_INERTIAL') {
      return { shouldTrigger: false };
    }
    if (missile.hasStartedClosing && missile.minDistanceReached <= 2.0 && missile.cumulativeTurn > Math.PI * 3.0 && missile.age > 3.0) {
      return { shouldTrigger: true, isHitCandidate: false, isOvershoot: true };
    }

    return { shouldTrigger: false };
  }

  static explainHitProbability(missile, target, weatherClouds, salvoCount) {
    const w = missile.weapon;
    const basePk = w.T_0;
    const lambda = w.lambda;
    const pExp = w.p;
    const normDist = Math.max(0.0, Math.min(1.0, missile.distanceTraveled / Math.max(1.0, missile.maxRangeKm)));
    let kineticRetention = Math.max(0.20, 1.0 - lambda * Math.pow(normDist, pExp));

    let pulseSurgeBonus = 0.0;
    if (w.trait === 'DUAL_PULSE_SURGE') {
      if (missile.stage === 'PULSE 2' || missile.hasIgnitedPulseTwo || missile.distanceToTarget <= 25.0) {
        pulseSurgeBonus = 0.18;
        kineticRetention = Math.min(1.0, kineticRetention + pulseSurgeBonus);
      }
    }

    const isManeuvering = (target.activeManeuverTimer > 0 && target.glocTimer <= 0);
    const activeManeuver = isManeuvering ? target.activeManeuverBonus : 0.0;

    const angleToTarget = Math.atan2(target.y - missile.y, target.x - missile.x);
    let aspectDiff = Math.abs((target.heading !== undefined ? target.heading : angleToTarget) - angleToTarget);
    while (aspectDiff > Math.PI) aspectDiff = Math.abs(aspectDiff - Math.PI * 2);

    const isOptical = (w.seeker === 'IIR' || w.seeker === 'EO' || w.seeker === 'OPT');
    const aspectScore = (aspectDiff > 2.2) ? 1.00 : ((aspectDiff < 0.8) ? (isOptical ? 1.05 : 0.95) : 0.90);

    const targetAgility = target.getEffectiveAgility();
    const agilityScale = Math.max(0.35, Math.min(1.65, targetAgility / 0.85));

    const sOpt = target.getOptimalCornerSpeed();
    const turnOptEff = target.isCoffin ? 1.0 : Physics.calcTurnEfficiency(target.speed, sOpt);

    const isRadar = (w.seeker === 'ARH' || w.seeker === 'PASSIVE_RADAR');
    const notchBonus = (target.isNotching && isRadar)
      ? (missile.source && missile.source.hasIRST ? 0.16 : 0.38 * (1.0 - (w.antiNotchBonus || 0)) * (0.6 + 0.4 * agilityScale))
      : 0.0;
    const chaffBonus = (target.cmTimer > 0)
      ? (isRadar ? 0.34 * (1.0 - (w.decoyResistance || w.flareResistance || 0)) : (isOptical ? 0.18 * (1.0 - (w.decoyResistance || 0)) : 0.20))
      : 0.0;
    const dircmBonus = (isOptical && typeof target.dircmEvasion === 'number') ? target.dircmEvasion : 0.0;

    const primaryActiveEvasion = Math.max(activeManeuver, notchBonus, chaffBonus, dircmBonus);
    const primaryPassiveBaseline = Math.max(
      target.isCoffin ? target.coffinDodgeBonus : 0.0,
      target.isAce ? target.aceEvasionBonus : 0.0,
      target.isFlightLead ? target.leadEvasionBonus : 0.0
    );

    let hasMixedSeekers = false;
    const mixedBonusVal = window.CONFIG.MIXED_SEEKER_SYNERGY_BONUS;
    if (window.Game && window.Game.missiles) {
      const inbounds = window.Game.missiles.filter(m => (m.active || m.id === missile.id) && m.target && m.target.id === target.id);
      const isRf = (s) => (s === 'ARH' || s === 'PASSIVE_RADAR' || s === 'INS' || s === 'INS_RADAR');
      const isOpt = (s) => (s === 'IIR' || s === 'EO' || s === 'OPT');
      hasMixedSeekers = (inbounds.some(m => m.weapon && isRf(m.weapon.seeker)) && inbounds.some(m => m.weapon && isOpt(m.weapon.seeker)));
    }

    let effectiveDefense = Math.min(0.50, primaryActiveEvasion + 0.25 * primaryPassiveBaseline);
    if (hasMixedSeekers) effectiveDefense *= 0.55;

    const salvoBonus = Math.min(0.30, Math.max(0, salvoCount - 1) * 0.12);
    const weatherPenalty = (weatherClouds && isOptical && weatherClouds.some(c => c.containsPoint(target.x, target.y))) ? 0.12 : 0.0;

    let targetThermalMultiplier = Number(target.thermalBloom !== undefined ? target.thermalBloom : 1.0);
    if (target.irPenalty) targetThermalMultiplier *= (1.0 + target.irPenalty);
    const thermalModifier = isOptical ? ((targetThermalMultiplier - 1.0) * 0.22 + (aspectDiff < 0.8 ? 0.10 : 0.0)) : 0.0;
    const mixedSynergyBonus = hasMixedSeekers ? mixedBonusVal : 0.0;

    let energyTurnPenalty = 0.0;
    if (missile.cumulativeTurn > Math.PI && w.trait !== 'REAR_ENGAGE' && w.trait !== 'ALL_ASPECT_BURST') {
      energyTurnPenalty = Math.min(0.12, (missile.cumulativeTurn - Math.PI) * 0.05);
    }

    const hojTargetActive = Boolean(target.jamEfficiency > 0 || (target.spec && (target.spec.isEW || target.spec.category === 'EW' || target.spec.R_0 >= 90)));
    const hojBonus = (w.hojBonus > 0 && hojTargetActive) ? w.hojBonus : 0.0;
    const heavyBonus = w.heavyTargetBonus ? (target.Wr * 0.25) : 0.0;
    const energyDeficitBonus = (1.0 - target.energy) * 0.25;
    const agilityDefenseBonus = (targetAgility - 0.85) * 0.12;
    const turnOptBonus = (turnOptEff - 0.70) * 0.10;

    const a2aTgpBonus = missile.launchA2aTgpBonus || 0.0;
    const rawProb = (basePk * aspectScore * kineticRetention) - effectiveDefense - agilityDefenseBonus - turnOptBonus + salvoBonus + mixedSynergyBonus + thermalModifier + hojBonus + heavyBonus + energyDeficitBonus + a2aTgpBonus - weatherPenalty - energyTurnPenalty;
    const probability = Math.max(0.0, Math.min(0.95, rawProb));

    return {
      probability, rawProbability: rawProb, probabilityFloor: 0.0, probabilityCeiling: 0.95,
      factors: {
        baseHitProbability: basePk, kineticRetention, lambda, pExp, pulseSurgeBonus,
        aspectDifferenceRad: aspectDiff, aspectScore, activeManeuverEvasion: activeManeuver,
        notchBonus, chaffBonus, dircmBonus, combinedActiveEvasion: primaryActiveEvasion, passiveEvasionBaseline: primaryPassiveBaseline,
        effectiveDefense, mixedSeekers: hasMixedSeekers, salvoBonus, mixedSeekerBonus: mixedSynergyBonus,
        thermalModifier, targetThermalBloom: targetThermalMultiplier, hojBonus, heavyTargetBonus: heavyBonus,
        targetEnergyBonus: energyDeficitBonus, agilityPenalty: agilityDefenseBonus,
        turnEfficiency: turnOptEff, turnEfficiencyPenalty: turnOptBonus,
        opticalWeatherPenalty: weatherPenalty, excessiveTurnPenalty: energyTurnPenalty
      }
    };
  }
}

window.MissileGuidanceSystem = MissileGuidanceSystem;
