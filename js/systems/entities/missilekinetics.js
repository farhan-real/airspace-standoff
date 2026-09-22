/**
 * AIRSPACE STANDOFF: Guided Missile Kinematics & Terminal Impact Resolution
 * ProNav guidance with maneuver vulnerability, Doppler notch evasion, and impact-time hit resolution.
 */

class MissileKinetics {
  static getRelativePeakSpeed(weapon) {
    if (!weapon) return 2.8;
    return weapon.speedMach || 2.8;
  }

  static getAccelerationProfile(weapon) {
    const trait = weapon.trait || '';
    const category = weapon.category || 'A2A';
    const range = weapon.rangeKm || 40;

    if (category === 'A2A' && range <= 35) return { boostDuration: 1.4, accelMultiplier: 3.2, hasSustainedThrust: false };
    if (trait === 'SWARM_RIPPLE' || trait === 'ALL_ASPECT_BURST') return { boostDuration: 1.2, accelMultiplier: 2.8, hasSustainedThrust: false };
    if (trait === 'RAMJET_SUSTAINED' || trait === 'EXTREME_STANDOFF') return { boostDuration: 2.4, accelMultiplier: 2.2, hasSustainedThrust: true };
    if (trait === 'STEALTH_CRUISE') return { boostDuration: 1.4, accelMultiplier: 1.8, hasSustainedThrust: true };
    if (trait === 'GLIDE_SATURATION') return { boostDuration: 0.0, accelMultiplier: 1.0, hasSustainedThrust: false };
    if (trait === 'DUAL_PULSE_SURGE') return { boostDuration: 2.6, accelMultiplier: 2.2, hasSustainedThrust: false };
    if (trait === 'LOFTED_HYPERSONIC' || trait === 'HYPERSONIC_IMPACT') return { boostDuration: 3.6, accelMultiplier: 2.4, hasSustainedThrust: false };
    return { boostDuration: 2.8, accelMultiplier: 2.0, hasSustainedThrust: false };
  }

  static getMaxTurnRate(missile) {
    const w = missile.weapon || {};
    const trait = w.trait || '';
    let baseRate = 1.6;

    if (trait === 'SNAP_TURN') baseRate = 3.6;
    else if (trait === 'HOBS_VANE') baseRate = 3.4;
    else if (trait === 'REAR_ENGAGE' || trait === 'ALL_ASPECT_BURST') baseRate = 3.6;
    else if (w.category === 'A2A' && (w.rangeKm || 40) <= 35) baseRate = 3.0;
    else if (trait === 'RAMJET_SUSTAINED' || trait === 'STEALTH_SEEKER' || trait === 'DUAL_PULSE_SURGE') baseRate = 2.2;
    else if (w.category === 'A2A') baseRate = 2.0;
    else if (trait === 'LOFTED_HYPERSONIC' || trait === 'HYPERSONIC_IMPACT') baseRate = 1.1;
    else if (trait === 'STEALTH_CRUISE' || trait === 'GLIDE_SATURATION') baseRate = 0.8;

    if (missile.distanceToTarget && missile.distanceToTarget <= 3.5) {
      baseRate = Math.max(baseRate, 3.2);
    } else if (!missile.hasStartedClosing && missile.age <= 2.5) {
      baseRate = Math.max(baseRate, 2.6);
    }

    return baseRate;
  }

  static initMissile(missile) {
    const w = missile.weapon || {};
    const source = missile.source;

    const launchCraftSpeed = source ? Math.max(0.70, Math.min(1.35, source.speed || 0.85)) : 0.85;
    const initialKick = (w.trait === 'GLIDE_SATURATION') ? 0.0 : 0.55;
    missile.launchSpeed = (w.trait === 'GLIDE_SATURATION') ? 0.90 : (launchCraftSpeed + initialKick);
    missile.speed = missile.launchSpeed;
    missile.peakSpeed = MissileKinetics.getRelativePeakSpeed(w);

    const profile = MissileKinetics.getAccelerationProfile(w);
    missile.boostDuration = profile.boostDuration;
    missile.accelMultiplier = profile.accelMultiplier;
    missile.hasSustainedThrust = profile.hasSustainedThrust;

    missile.hasIgnitedPulseTwo = false;
    missile.pulseTwoTimer = 0.0;
    missile.isLofting = Boolean(w.trait === 'LOFTED_HYPERSONIC' || w.trait === 'HYPERSONIC_IMPACT');
    missile.initialAlt = source ? (source.alt || 0.5) : 0.5;

    missile.stage = (w.trait === 'GLIDE_SATURATION') ? 'GLIDE' : 'BOOST';
    missile.isPassiveRadar = Boolean(w.seeker === 'PASSIVE_RADAR');
    missile.launchStealthDuration = missile.isPassiveRadar ? 3.2 : 0.0;
    missile.pathRevealDistance = missile.isPassiveRadar ? 20.0 : 999.0;
  }

  static computeGuidance(missile, dt) {
    const tgt = missile.target;
    if (!tgt || typeof tgt.x !== 'number') return;

    const dx = tgt.x - missile.x;
    const dy = tgt.y - missile.y;
    const dist = Math.hypot(dx, dy);
    missile.prevDistanceToTarget = missile.distanceToTarget;
    missile.distanceToTarget = dist;
    missile.minDistanceReached = Math.min(missile.minDistanceReached || dist, dist);

    const los = Math.atan2(dy, dx);
    let headingDiffToLos = Math.abs(missile.heading - los);
    while (headingDiffToLos > Math.PI) headingDiffToLos = Math.abs(headingDiffToLos - Math.PI * 2);

    const vm = Math.max(0.45, missile.speed * 0.35);

    const tgtSpeedKm = (tgt.speed || 0.8) * 0.35;
    const tgtHdg = tgt.heading || 0;
    const vtx = Math.cos(tgtHdg) * tgtSpeedKm;
    const vty = Math.sin(tgtHdg) * tgtSpeedKm;

    const vmx = Math.cos(missile.heading) * vm;
    const vmy = Math.sin(missile.heading) * vm;
    const vrx = vtx - vmx;
    const vry = vty - vmy;

    const losRate = (dx * vry - dy * vrx) / Math.max(0.04, dist * dist);
    const closingVel = -((dx * vrx + dy * vry) / Math.max(0.1, dist));

    if (!missile.hasStartedClosing) {
      if (headingDiffToLos < Math.PI * 0.55 && (closingVel > 0.1 || dist < missile.prevDistanceToTarget)) {
        missile.hasStartedClosing = true;
      }
    }

    let N = 4.0;
    if (tgt.activeManeuverTimer > 0) {
      if (tgt.isNotching && missile.weapon && (missile.weapon.seeker === 'ARH' || missile.weapon.seeker === 'PASSIVE_RADAR')) {
        N = 0.6;
      } else if (tgt.activeManeuverId === 'BARREL_ROLL') {
        N = 1.2;
      } else if (tgt.activeManeuverId === 'BREAK_TURN') {
        N = 2.4;
      }
    }

    let turnRate = 0;
    if (closingVel > 0 && dist > 1.2) {
      turnRate = N * (closingVel / vm) * losRate;
    } else {
      let diff = los - missile.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      const terminalGain = (dist <= 1.2) ? 4.5 : (tgt.activeManeuverTimer > 0 ? 1.5 : 3.0);
      turnRate = diff * terminalGain;
    }

    const maxRate = MissileKinetics.getMaxTurnRate(missile);
    const clampedRate = Math.max(-maxRate, Math.min(maxRate, turnRate));
    missile.heading += clampedRate * dt;
    while (missile.heading < 0) missile.heading += Math.PI * 2;
    while (missile.heading >= Math.PI * 2) missile.heading -= Math.PI * 2;

    missile.cumulativeTurn = (missile.cumulativeTurn || 0) + Math.abs(clampedRate * dt);
    if (missile.hasStartedClosing && missile.cumulativeTurn > Math.PI * 2.2 && dist <= 2.2) {
      missile.triggerLostTrack('KINETIC OVERSHOOT');
    }
  }

  static checkTerminalTrigger(missile) {
    const dist = missile.distanceToTarget;
    const prevDist = missile.prevDistanceToTarget;

    if (dist <= 0.65) {
      return { shouldTrigger: true, isHitCandidate: true };
    }

    if (missile.hasStartedClosing && dist > prevDist) {
      if (prevDist <= 0.95) {
        return { shouldTrigger: true, isHitCandidate: true };
      }
      if (prevDist <= 2.2) {
        return { shouldTrigger: true, isHitCandidate: false, isOvershoot: true };
      }
    }

    return { shouldTrigger: false };
  }

  static updateSpeedAndFlight(missile, dt, distToTarget) {
    const w = missile.weapon || {};

    if (missile.age <= missile.boostDuration) {
      missile.stage = 'BOOST';
      const needed = Math.max(0.1, missile.peakSpeed - missile.launchSpeed);
      const accel = (needed / Math.max(0.4, missile.boostDuration)) * (missile.accelMultiplier || 1.8);
      missile.speed = Math.min(missile.peakSpeed, missile.speed + accel * dt);
      return;
    }

    if (w.trait === 'DUAL_PULSE_SURGE') {
      if (!missile.hasIgnitedPulseTwo && distToTarget <= 22.0) {
        missile.hasIgnitedPulseTwo = true;
        missile.pulseTwoTimer = 2.4;
        if (window.Game && window.Game.radar) {
          window.Game.radar.spawnCombatText(missile.x, missile.y, 'PULSE 2 (+1.1M SURGE)', '#00f0ff');
          window.Game.radar.spawnShockwave(missile.x, missile.y, '#00f0ff', 24);
        }
      }
      if (missile.pulseTwoTimer > 0) {
        missile.pulseTwoTimer -= dt;
        missile.stage = 'PULSE 2';
        missile.speed = Math.min(missile.peakSpeed + 0.65, missile.speed + 2.8 * dt);
        return;
      }
    }

    if (missile.isLofting) {
      if (distToTarget > 28.0) {
        missile.stage = 'LOFT';
        missile.alt = Math.min(0.95, (missile.alt || 0.5) + 0.16 * dt);
        const loftTarget = missile.peakSpeed * 0.82;
        if (missile.speed < loftTarget) missile.speed += 2.0 * dt;
      } else {
        missile.stage = 'DIVE';
        missile.alt = Math.max(0.18, (missile.alt || 0.5) - 0.28 * dt);
        if (missile.speed < missile.peakSpeed) missile.speed += 3.4 * dt;
      }
      return;
    }

    if (w.trait === 'RAMJET_SUSTAINED' || w.trait === 'EXTREME_STANDOFF') {
      missile.stage = (distToTarget <= 16.0) ? 'TERMINAL' : 'RAMJET';
      missile.speed = Math.max(missile.peakSpeed, missile.speed);
      return;
    }

    if (w.trait === 'STEALTH_CRUISE') {
      missile.stage = (distToTarget <= 15.0) ? 'TERMINAL' : 'CRUISE';
      missile.speed = Math.max(missile.peakSpeed, missile.speed);
      return;
    }
    if (w.trait === 'GLIDE_SATURATION') {
      missile.stage = 'GLIDE';
      missile.speed = 0.90;
      return;
    }

    if (w.trait === 'STEALTH_SEEKER') {
      if (distToTarget <= 20.0) missile.stage = 'TERMINAL';
      else if (missile.age <= (missile.boostDuration + 14.0)) {
        missile.stage = 'SUSTAIN';
        missile.speed = Math.max(missile.peakSpeed * 0.95, missile.speed);
        return;
      } else missile.stage = 'COAST';
    } else if (distToTarget <= 18.0) missile.stage = 'TERMINAL';
    else if (w.seeker === 'PASSIVE_RADAR') missile.stage = 'HOMING';
    else if (w.trait === 'DUAL_PULSE_SURGE') missile.stage = 'MIDCOURSE';
    else if (w.category === 'A2A') missile.stage = (w.rangeKm <= 35) ? 'TERMINAL' : (missile.age < 12.0 ? 'MIDCOURSE' : 'COAST');
    else missile.stage = 'COAST';

    const minSustain = (w.category === 'A2A' && (w.rangeKm || 40) <= 35) ? 1.85 : 2.05;
    const decayRate = 0.045;
    missile.speed = Math.max(minSustain, missile.speed - decayRate * dt);
  }

  static resolveHitProbability(missile, target, weatherClouds, salvoCount) {
    const w = missile.weapon || {};
    const basePk = (w.T_0 || 0.80);

    const isManeuvering = (target.activeManeuverTimer > 0 && target.glocTimer <= 0);
    const activeManeuver = isManeuvering ? (target.activeManeuverBonus || 0.45) : 0.0;

    const angleToTarget = Math.atan2(target.y - missile.y, target.x - missile.x);
    let aspectDiff = Math.abs((target.heading !== undefined ? target.heading : angleToTarget) - angleToTarget);
    while (aspectDiff > Math.PI) aspectDiff = Math.abs(aspectDiff - Math.PI * 2);

    let aspectScore = 0.90;
    if (aspectDiff > 2.2) aspectScore = 1.00;
    else if (aspectDiff < 0.8) aspectScore = 0.85;

    const notchBonus = (target.isNotching && (w.seeker === 'ARH' || w.seeker === 'PASSIVE_RADAR'))
      ? (missile.source && missile.source.hasIRST ? 0.16 : 0.38 * (1.0 - (w.antiNotchBonus || 0)))
      : 0.0;
    const chaffBonus = (target.cmTimer > 0)
      ? (w.seeker === 'ARH' ? 0.34 * (1.0 - (w.decoyResistance || w.flareResistance || 0)) : 0.18)
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
      const hasRf = inbounds.some(m => m.weapon && isRf(m.weapon.seeker));
      const hasOpt = inbounds.some(m => m.weapon && isOpt(m.weapon.seeker));
      if (hasRf && hasOpt) {
        hasMixedSeekers = true;
      }
    }

    let effectiveDefense = Math.min(0.72, primaryActiveEvasion + 0.30 * primaryPassiveBaseline);
    if (hasMixedSeekers) {
      effectiveDefense *= 0.55;
    }

    const salvoBonus = Math.min(0.30, Math.max(0, (salvoCount || 1) - 1) * 0.12);
    const weatherPenalty = (weatherClouds && (w.seeker === 'IIR' || w.seeker === 'EO' || w.seeker === 'OPT') && weatherClouds.some(c => c.containsPoint(target.x, target.y))) ? 0.25 : 0.0;
    const afterburnerBonus = ((w.seeker === 'IIR' || w.seeker === 'EO') && target.engineAlpha > 0.85) ? 0.15 : 0.0;
    const mixedSynergyBonus = hasMixedSeekers ? mixedBonusVal : 0.0;

    let energyTurnPenalty = 0.0;
    if (missile.cumulativeTurn && missile.cumulativeTurn > Math.PI) {
      const trait = w.trait || '';
      if (trait !== 'REAR_ENGAGE' && trait !== 'ALL_ASPECT_BURST') {
        energyTurnPenalty = Math.min(0.18, (missile.cumulativeTurn - Math.PI) * 0.08);
      }
    }

    const heavyTargetAccuracyBonus = w.heavyTargetBonus ? ((target.Wr || 0) * 0.25) : 0.0;
    const energyDeficitBonus = (1.0 - (target.energy !== undefined ? target.energy : 1.0)) * 0.25;

    const rawProb = (basePk * aspectScore) - effectiveDefense + salvoBonus + mixedSynergyBonus + afterburnerBonus + heavyTargetAccuracyBonus + energyDeficitBonus - weatherPenalty - energyTurnPenalty;
    if (isManeuvering) {
      return Math.max(0.12, Math.min(0.95, rawProb));
    }
    const floor = (target.isAce ? 0.16 : (target.isCoffin ? 0.08 : (target.isFlightLead ? 0.10 : 0.14)));
    return Math.max(floor, Math.min(0.95, rawProb));
  }

  static applyThermobaricAoE(missile, primaryTarget, directDamage, game) {
    if (!game) return;
    const blastRadiusKm = 8.5;
    const sourceUnit = missile.source;
    const firingTeam = missile.team;
    const allTargets = [...(game.alliedAircraft || []), ...(game.hostileAircraft || [])];

    if (game.radar) {
      game.radar.spawnExplosionFX(missile.x, missile.y, true);
      game.radar.spawnShockwave(missile.x, missile.y, '#f59e0b', 75);
      game.radar.spawnCombatText(missile.x, missile.y, 'MPBM THERMOBARIC BLAST', '#f59e0b');
    }

    for (const other of allTargets) {
      if (!other || other.hp <= 0 || other.id === primaryTarget.id) continue;
      const dist = Math.hypot(other.x - missile.x, other.y - missile.y);
      if (dist <= blastRadiusKm) {
        const falloff = 1.0 - (dist / blastRadiusKm);
        const aoeDamage = Math.max(1, Math.round(5.0 * falloff));
        const wasAlive = other.hp > 0;
        other.hp = Math.max(0, other.hp - aoeDamage);
        if (typeof other.applyActionStress === 'function') other.applyActionStress(0.30);

        if (game.radar) game.radar.spawnCombatText(other.x, other.y, `BLAST -${aoeDamage}HP`, '#f59e0b');
        if (wasAlive && other.hp <= 0 && game.simulation) {
          game.simulation.recordKillEvent(firingTeam, other, sourceUnit, { weapon: missile.weapon, isSalvo: false, salvoCount: 1, salvoBreakdown: 'MPBM Secondary Blast' });
        }
      }
    }
  }
}

window.MissileKinetics = MissileKinetics;