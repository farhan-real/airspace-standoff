/**
 * AIRSPACE STANDOFF: Guided Missile Kinematics, A2G Flight Profiles & Cluster Splash
 * ProNav guidance with responsive A2G turn rates, aerodynamic ballistic decay, and staging.
 */

class MissileKinetics {
  static getRelativePeakSpeed(weapon) {
    return weapon ? (weapon.speedMach || 3.0) : 3.0;
  }

  static getAccelerationProfile(weapon) {
    const trait = weapon.trait || '';
    const category = weapon.category || 'A2A';
    const range = weapon.rangeKm || 40;

    if (weapon.isRocketPod) return { boostDuration: 0.7, accelMultiplier: 3.8, hasSustainedThrust: false };
    if (weapon.seeker === 'UNGUIDED' || (weapon.seeker === 'LASER' && range <= 32)) {
      return { boostDuration: 0.0, accelMultiplier: 1.0, hasSustainedThrust: false };
    }
    if (category === 'A2A' && range <= 35) return { boostDuration: 1.2, accelMultiplier: 3.4, hasSustainedThrust: false };
    if (trait === 'SWARM_RIPPLE' || trait === 'ALL_ASPECT_BURST') return { boostDuration: 1.0, accelMultiplier: 3.0, hasSustainedThrust: false };
    if (trait === 'SUPERSONIC_CRUISE_RAMJET') return { boostDuration: 2.0, accelMultiplier: 2.8, hasSustainedThrust: true };
    if (trait === 'RAMJET_SUSTAINED' || trait === 'EXTREME_STANDOFF') return { boostDuration: 2.2, accelMultiplier: 2.5, hasSustainedThrust: true };
    if (trait === 'STEALTH_CRUISE' || trait === 'MEPHISTO_BUNKER_CRUISE' || trait === 'DATALINK_STANDOFF') {
      return { boostDuration: 1.2, accelMultiplier: 1.6, hasSustainedThrust: true };
    }
    if (trait === 'GLIDE_SATURATION' || trait === 'STANDOFF_CLUSTER_GLIDE' || trait === 'BROACH_GLIDE_PENETRATOR') {
      return { boostDuration: 0.0, accelMultiplier: 1.0, hasSustainedThrust: false };
    }
    if (trait === 'DUAL_PULSE_SURGE') return { boostDuration: 2.4, accelMultiplier: 2.4, hasSustainedThrust: false };
    if (trait === 'LOFTED_HYPERSONIC' || trait === 'HYPERSONIC_IMPACT') return { boostDuration: 3.2, accelMultiplier: 2.8, hasSustainedThrust: false };
    return { boostDuration: 2.6, accelMultiplier: 2.2, hasSustainedThrust: false };
  }

  static getMaxTurnRate(missile) {
    const w = missile.weapon || {};
    const trait = w.trait || '';
    let baseRate = 2.4;

    if (w.category === 'A2G' || w.isBunkerCracker || w.isCluster || w.isAntiRadiation || w.isRocketPod) {
      if (w.a2gGroup === 'ATGM') baseRate = 3.2;
      else if (w.isAntiRadiation) baseRate = 3.0;
      else if (w.id === 'APKWS-II') baseRate = 2.8;
      else if (w.isRocketPod || w.seeker === 'UNGUIDED') baseRate = 1.8;
      else if (trait === 'LOFTED_HYPERSONIC' || trait === 'HYPERSONIC_IMPACT') baseRate = 2.2;
      else baseRate = 2.6;
    } else if (trait === 'SNAP_TURN' || trait === 'REAR_ENGAGE' || trait === 'ALL_ASPECT_BURST') {
      baseRate = 3.8;
    } else if (trait === 'HOBS_VANE') {
      baseRate = 3.5;
    } else if (w.category === 'A2A' && (w.rangeKm || 40) <= 35) {
      baseRate = 3.2;
    } else if (trait === 'RAMJET_SUSTAINED' || trait === 'STEALTH_SEEKER' || trait === 'DUAL_PULSE_SURGE') {
      baseRate = 2.4;
    } else if (w.category === 'A2A') {
      baseRate = 2.2;
    } else if (trait === 'LOFTED_HYPERSONIC' || trait === 'HYPERSONIC_IMPACT') {
      baseRate = 1.4;
    }

    if (missile.distanceToTarget && missile.distanceToTarget <= 5.5) baseRate = Math.max(baseRate, 3.6);
    else if (!missile.hasStartedClosing && missile.age <= 2.5) baseRate = Math.max(baseRate, 3.0);
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
    if (missile.weapon && missile.weapon.isAntiRadiation && !missile.weapon.antiEmcon && missile.target && missile.target.emconTimer > 0) {
      missile.triggerLostTrack('TARGET RADAR EMCON SHUTDOWN');
      return;
    }
    MissileGuidanceSystem.computeGuidance(missile, dt);
  }

  static checkTerminalTrigger(missile) {
    return MissileGuidanceSystem.checkTerminalTrigger(missile);
  }

  static updateSpeedAndFlight(missile, dt, distToTarget) {
    const w = missile.weapon || {};
    const maxRange = Math.max(1.0, w.rangeKm || 40.0);
    const normDist = Math.max(0.0, Math.min(1.0, missile.distanceTraveled / maxRange));
    const lambda = (w.lambda !== undefined) ? w.lambda : 0.40;
    const pExp = (w.p !== undefined) ? w.p : 1.0;

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
        missile.speed = Math.min(missile.peakSpeed + 0.90, missile.speed + 3.2 * dt);
        return;
      }
      if (missile.hasIgnitedPulseTwo) {
        missile.stage = 'TERMINAL';
        const terminalSurgePeak = missile.peakSpeed + 0.90;
        const terminalRetention = Math.max(0.85, 1.0 - (lambda * 0.25) * Math.pow(normDist, pExp));
        missile.speed = Math.max(missile.peakSpeed, terminalSurgePeak * terminalRetention);
        return;
      }
    }

    if (missile.isLofting) {
      if (distToTarget > 28.0) {
        missile.stage = 'LOFT';
        missile.alt = Math.min(0.95, (missile.alt || 0.5) + 0.16 * dt);
        if (missile.speed < missile.peakSpeed * 0.88) missile.speed += 2.2 * dt;
      } else {
        missile.stage = 'DIVE';
        missile.alt = Math.max(0.18, (missile.alt || 0.5) - 0.28 * dt);
        if (missile.speed < missile.peakSpeed) missile.speed += 4.5 * dt;
      }
      return;
    }

    if (w.trait === 'RAMJET_SUSTAINED' || w.trait === 'EXTREME_STANDOFF' || w.trait === 'SUPERSONIC_CRUISE_RAMJET') {
      if (missile.distanceTraveled < maxRange) {
        missile.stage = (distToTarget <= 16.0) ? 'TERMINAL' : 'RAMJET';
        missile.speed = missile.peakSpeed;
        return;
      }
      missile.stage = 'COAST';
      missile.speed = Math.max(0.40, missile.speed - 1.2 * dt);
      return;
    }

    if (w.trait === 'STEALTH_CRUISE' || w.trait === 'MEPHISTO_BUNKER_CRUISE' || w.trait === 'DATALINK_STANDOFF') {
      if (missile.distanceTraveled < maxRange) {
        missile.stage = (distToTarget <= 15.0) ? 'TERMINAL' : 'CRUISE';
        missile.speed = w.speedMach || 0.85;
        return;
      }
      missile.stage = 'COAST';
      missile.speed = Math.max(0.35, missile.speed - 0.8 * dt);
      return;
    }

    if (w.trait === 'GLIDE_SATURATION' || w.trait === 'STANDOFF_CLUSTER_GLIDE' || w.trait === 'BROACH_GLIDE_PENETRATOR') {
      missile.stage = (distToTarget <= 12.0) ? 'TERMINAL' : 'GLIDE';
      const glideRetention = Math.max(0.40, 1.0 - lambda * Math.pow(normDist, pExp));
      missile.speed = Math.max(0.35, (w.speedMach || 0.80) * glideRetention);
      return;
    }

    if (w.trait === 'STEALTH_SEEKER') {
      if (distToTarget <= 20.0) {
        missile.stage = 'TERMINAL';
      } else if (missile.age <= (missile.boostDuration + 14.0)) {
        missile.stage = 'SUSTAIN';
        missile.speed = Math.max(missile.peakSpeed * 0.96, missile.speed);
        return;
      } else {
        missile.stage = 'COAST';
      }
      const sustainRetention = Math.max(0.40, 1.0 - lambda * Math.pow(normDist, pExp));
      missile.speed = Math.max(2.4, missile.peakSpeed * sustainRetention);
      return;
    }

    if (distToTarget <= 18.0) missile.stage = 'TERMINAL';
    else if (w.seeker === 'PASSIVE_RADAR') missile.stage = 'HOMING';
    else if (w.trait === 'DUAL_PULSE_SURGE') missile.stage = 'MIDCOURSE';
    else if (w.category === 'A2A') missile.stage = (w.rangeKm <= 35) ? 'TERMINAL' : (missile.age < 12.0 ? 'MIDCOURSE' : 'COAST');
    else missile.stage = 'GLIDE';

    const energyRetention = Math.max(0.25, 1.0 - lambda * Math.pow(normDist, pExp));
    missile.speed = Math.max(0.40, missile.peakSpeed * energyRetention);
  }

  static explainHitProbability(missile, target, weatherClouds, salvoCount) {
    if (!target || typeof target.getEffectiveAgility !== 'function') {
      const pk = (window.Physics && Physics.calcPk) ? (Physics.calcPk(missile.weapon, missile.source, target, weatherClouds).pk / 100) : 0.85;
      return { probability: pk, rawProbability: pk, probabilityFloor: 0, probabilityCeiling: 0.95, factors: { baseHitProbability: pk } };
    }
    return MissileGuidanceSystem.explainHitProbability(missile, target, weatherClouds, salvoCount);
  }

  static applyClusterAoE(missile, primaryTarget, game) {
    if (!game || !missile || !missile.weapon) return;
    const w = missile.weapon;
    const radius = w.clusterRadiusKm || 6.0;
    const baseDmg = w.clusterDamage || 3.0;
    const sourceUnit = missile.source;
    const firingTeam = missile.team;

    if (game.radar) {
      game.radar.spawnExplosionFX(missile.x, missile.y, true);
      game.radar.spawnShockwave(missile.x, missile.y, '#fbbf24', 52);
      game.radar.spawnCombatText(missile.x, missile.y, 'CLUSTER SUBMUNITIONS', '#fbbf24');
    }

    for (const surf of (game.surfaceUnits || [])) {
      if (!surf || surf.hp <= 0.05 || surf.id === primaryTarget.id || surf.team === firingTeam || surf.isIndestructible) continue;
      const d = Math.hypot(surf.x - missile.x, surf.y - missile.y);
      if (d <= radius) {
        let mult = 1.0;
        if (surf.armorClass === 'FORTIFIED') mult = 0.25;
        else if (surf.armorClass === 'ARMORED') mult = w.armorPiercing || 0.70;
        const dmg = Math.max(0.5, baseDmg * mult * (1.0 - (d / (radius * 1.4))));
        const wasAlive = surf.hp > 0.05;
        surf.takeDamage(dmg, false, w);
        if (wasAlive && surf.hp <= 0.05 && game.simulation) {
          game.simulation.recordKillEvent(firingTeam, surf, sourceUnit, { weapon: w, isSalvo: false, salvoCount: 1, salvoBreakdown: 'Cluster AOE' });
        }
      }
    }
  }

  static applyThermobaricAoE(missile, primaryTarget, directDamage, game) {
    if (!game) return;
    const blastRadiusKm = 8.5;
    const sourceUnit = missile.source;
    const firingTeam = missile.team;
    const allTargets = [...(game.alliedAircraft || []), ...(game.hostileAircraft || []), ...(game.surfaceUnits || [])];

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
        if (typeof SurfaceUnit !== 'undefined' && other instanceof SurfaceUnit) other.takeDamage(aoeDamage, false, missile.weapon);
        else if (other.isCivilian && typeof other.takeDamage === 'function') other.takeDamage(aoeDamage, sourceUnit, missile.weapon, true);
        else {
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
