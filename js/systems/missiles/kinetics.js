/**
 * AIRSPACE STANDOFF: Guided Missile Kinematics & Terminal Impact Resolution
 * ProNav guidance with corner speed turn efficiency and airframe thermal bloom modeling.
 */

class MissileKinetics {
  static getRelativePeakSpeed(weapon) {
    return weapon ? (weapon.speedMach || 3.0) : 3.0;
  }

  static getAccelerationProfile(weapon) {
    const trait = weapon.trait || '';
    const category = weapon.category || 'A2A';
    const range = weapon.rangeKm || 40;

    if (category === 'A2A' && range <= 35) return { boostDuration: 1.2, accelMultiplier: 3.4, hasSustainedThrust: false };
    if (trait === 'SWARM_RIPPLE' || trait === 'ALL_ASPECT_BURST') return { boostDuration: 1.0, accelMultiplier: 3.0, hasSustainedThrust: false };
    if (trait === 'RAMJET_SUSTAINED' || trait === 'EXTREME_STANDOFF') return { boostDuration: 2.2, accelMultiplier: 2.5, hasSustainedThrust: true };
    if (trait === 'STEALTH_CRUISE') return { boostDuration: 1.2, accelMultiplier: 1.6, hasSustainedThrust: true };
    if (trait === 'GLIDE_SATURATION') return { boostDuration: 0.0, accelMultiplier: 1.0, hasSustainedThrust: false };
    if (trait === 'DUAL_PULSE_SURGE') return { boostDuration: 2.4, accelMultiplier: 2.4, hasSustainedThrust: false };
    if (trait === 'LOFTED_HYPERSONIC' || trait === 'HYPERSONIC_IMPACT') return { boostDuration: 3.2, accelMultiplier: 2.8, hasSustainedThrust: false };
    return { boostDuration: 2.6, accelMultiplier: 2.2, hasSustainedThrust: false };
  }

  static getMaxTurnRate(missile) {
    const w = missile.weapon || {};
    const trait = w.trait || '';
    let baseRate = 1.6;

    if (trait === 'SNAP_TURN' || trait === 'REAR_ENGAGE' || trait === 'ALL_ASPECT_BURST') baseRate = 3.8;
    else if (trait === 'HOBS_VANE') baseRate = 3.5;
    else if (w.category === 'A2A' && (w.rangeKm || 40) <= 35) baseRate = 3.2;
    else if (trait === 'RAMJET_SUSTAINED' || trait === 'STEALTH_SEEKER' || trait === 'DUAL_PULSE_SURGE') baseRate = 2.2;
    else if (w.category === 'A2A') baseRate = 2.0;
    else if (trait === 'LOFTED_HYPERSONIC' || trait === 'HYPERSONIC_IMPACT') baseRate = 1.0;
    else if (trait === 'STEALTH_CRUISE' || trait === 'GLIDE_SATURATION') baseRate = 0.8;

    if (missile.distanceToTarget && missile.distanceToTarget <= 3.5) baseRate = Math.max(baseRate, 3.2);
    else if (!missile.hasStartedClosing && missile.age <= 2.5) baseRate = Math.max(baseRate, 2.6);
    return baseRate;
  }

  static initMissile(missile) {
    const w = missile.weapon || {};
    const source = missile.source;
    const launchCraftSpeed = source ? Math.max(0.70, Number(source.speed || 0.85)) : 0.85;
    const isSubsonic = (w.speedMach && w.speedMach < 1.0) || w.trait === 'GLIDE_SATURATION' || w.trait === 'STEALTH_CRUISE';
    const initialKick = isSubsonic ? 0.0 : 0.85;

    missile.launchSpeed = isSubsonic ? (w.speedMach || 0.85) : (launchCraftSpeed + initialKick);
    missile.peakSpeed = isSubsonic ? (w.speedMach || 0.85) : Math.max(missile.launchSpeed, MissileKinetics.getRelativePeakSpeed(w));
    missile.speed = missile.launchSpeed;

    const profile = MissileKinetics.getAccelerationProfile(w);
    missile.boostDuration = profile.boostDuration;
    missile.accelMultiplier = profile.accelMultiplier;
    missile.hasSustainedThrust = profile.hasSustainedThrust;

    missile.hasIgnitedPulseTwo = false;
    missile.pulseTwoTimer = 0.0;
    missile.isLofting = Boolean(w.trait === 'LOFTED_HYPERSONIC' || w.trait === 'HYPERSONIC_IMPACT');
    missile.initialAlt = source ? (source.alt || 0.5) : 0.5;

    missile.stage = isSubsonic ? 'CRUISE' : 'BOOST';
    missile.isPassiveRadar = Boolean(w.seeker === 'PASSIVE_RADAR');
    missile.launchStealthDuration = missile.isPassiveRadar ? 3.2 : 0.0;
    missile.pathRevealDistance = missile.isPassiveRadar ? 20.0 : 999.0;
  }

  static computeGuidance(missile, dt) {
    if (typeof MissileGuidanceSystem !== 'undefined') {
      MissileGuidanceSystem.computeGuidance(missile, dt);
    }
  }

  static checkTerminalTrigger(missile) {
    if (typeof MissileGuidanceSystem !== 'undefined') {
      return MissileGuidanceSystem.checkTerminalTrigger(missile);
    }
    return { shouldTrigger: false };
  }

  static updateSpeedAndFlight(missile, dt, distToTarget) {
    const w = missile.weapon || {};

    if (missile.age <= missile.boostDuration) {
      missile.stage = 'BOOST';
      const needed = Math.max(0.1, missile.peakSpeed - missile.launchSpeed);
      const accel = (needed / Math.max(0.3, missile.boostDuration)) * (missile.accelMultiplier || 2.0);
      missile.speed = Math.min(missile.peakSpeed, missile.speed + accel * dt);
      return;
    }

    if (w.trait === 'DUAL_PULSE_SURGE') {
      if (!missile.hasIgnitedPulseTwo && distToTarget <= 22.0) {
        missile.hasIgnitedPulseTwo = true;
        missile.pulseTwoTimer = 2.4;
        if (window.Game && window.Game.radar) {
          window.Game.radar.spawnCombatText(missile.x, missile.y, 'PULSE 2 (+0.9M SURGE)', '#00f0ff');
          window.Game.radar.spawnShockwave(missile.x, missile.y, '#00f0ff', 24);
        }
      }
      if (missile.pulseTwoTimer > 0) {
        missile.pulseTwoTimer -= dt;
        missile.stage = 'PULSE 2';
        missile.speed = Math.min(missile.peakSpeed + 0.9, missile.speed + 3.2 * dt);
        return;
      }
    }

    if (missile.isLofting) {
      if (distToTarget > 28.0) {
        missile.stage = 'LOFT';
        missile.alt = Math.min(0.95, (missile.alt || 0.5) + 0.16 * dt);
        if (missile.speed < missile.peakSpeed * 0.85) missile.speed += 2.2 * dt;
      } else {
        missile.stage = 'DIVE';
        missile.alt = Math.max(0.18, (missile.alt || 0.5) - 0.28 * dt);
        if (missile.speed < missile.peakSpeed) missile.speed += 4.5 * dt;
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
      missile.speed = w.speedMach || 0.85;
      return;
    }
    if (w.trait === 'GLIDE_SATURATION') {
      missile.stage = 'GLIDE';
      missile.speed = w.speedMach || 0.80;
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

    const minSustain = (w.speedMach && w.speedMach < 1.5)
      ? (w.speedMach * 0.85)
      : ((w.category === 'A2A' && (w.rangeKm || 40) <= 35) ? 1.65 : 2.0);
    missile.speed = Math.max(minSustain, missile.speed - 0.05 * dt);
  }

  static resolveHitProbability(missile, target, weatherClouds, salvoCount) {
    if (typeof MissileGuidanceSystem !== 'undefined') {
      return MissileGuidanceSystem.resolveHitProbability(missile, target, weatherClouds, salvoCount);
    }
    return 0.65;
  }

  static explainHitProbability(missile, target, weatherClouds, salvoCount) {
    if (typeof MissileGuidanceSystem !== 'undefined') {
      return MissileGuidanceSystem.explainHitProbability(missile, target, weatherClouds, salvoCount);
    }
    return { probability: 0.65, rawProbability: 0.65, factors: {} };
  }

  static applyThermobaricAoE(missile, primaryTarget, directDamage, game) {
    if (!game) return;
    const blastRadiusKm = 8.5;
    const sourceUnit = missile.source;
    const firingTeam = missile.team;
    const allTargets = [
      ...(game.alliedAircraft || []),
      ...(game.hostileAircraft || []),
      ...(game.surfaceUnits || [])
    ];

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

        if (typeof SurfaceUnit !== 'undefined' && other instanceof SurfaceUnit) {
          other.takeDamage(aoeDamage, false);
        } else if (other.isCivilian && typeof other.takeDamage === 'function') {
          other.takeDamage(aoeDamage, sourceUnit, missile.weapon, true);
        } else {
          other.hp = Math.max(0, other.hp - aoeDamage);
          if (other.hp < 0.05) other.hp = 0;
          if (typeof other.applyActionStress === 'function') other.applyActionStress(0.30);
        }

        if (game.radar) game.radar.spawnCombatText(other.x, other.y, `BLAST -${aoeDamage}HP`, '#f59e0b');
        if (wasAlive && other.hp <= 0 && game.simulation && !other.isCivilian) {
          game.simulation.recordKillEvent(firingTeam, other, sourceUnit, { weapon: missile.weapon, isSalvo: false, salvoCount: 1, salvoBreakdown: 'MPBM Secondary Blast' });
        }
      }
    }
  }
}

window.MissileKinetics = MissileKinetics;