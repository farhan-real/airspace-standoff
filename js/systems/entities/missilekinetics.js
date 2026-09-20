/**
 * AIRSPACE STANDOFF: Guided Missile Kinematics & Multi-Stage Propulsion
 * Calibrated relative speeds, initial booster separation impulse, ProNav guidance,
 * explicit stages (BOOST, SUSTAIN, MIDCOURSE, COAST, PULSE 2, LOFT, DIVE, TERMINAL), and AoE.
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

    if (category === 'A2A' && range <= 35) {
      return { boostDuration: 1.4, accelMultiplier: 3.2, hasSustainedThrust: false };
    }
    if (trait === 'SWARM_RIPPLE' || trait === 'ALL_ASPECT_BURST') {
      return { boostDuration: 1.2, accelMultiplier: 2.8, hasSustainedThrust: false };
    }
    if (trait === 'RAMJET_SUSTAINED' || trait === 'EXTREME_STANDOFF') {
      return { boostDuration: 2.4, accelMultiplier: 2.2, hasSustainedThrust: true };
    }
    if (trait === 'STEALTH_CRUISE') {
      return { boostDuration: 1.4, accelMultiplier: 1.8, hasSustainedThrust: true };
    }
    if (trait === 'GLIDE_SATURATION') {
      return { boostDuration: 0.0, accelMultiplier: 1.0, hasSustainedThrust: false };
    }
    if (trait === 'DUAL_PULSE_SURGE') {
      return { boostDuration: 2.6, accelMultiplier: 2.2, hasSustainedThrust: false };
    }
    if (trait === 'LOFTED_HYPERSONIC' || trait === 'HYPERSONIC_IMPACT') {
      return { boostDuration: 3.6, accelMultiplier: 2.4, hasSustainedThrust: false };
    }
    return { boostDuration: 2.8, accelMultiplier: 2.0, hasSustainedThrust: false };
  }

  static getMaxTurnRate(missile) {
    const w = missile.weapon || {};
    const trait = w.trait || '';
    const category = w.category || 'A2A';

    if (trait === 'SNAP_TURN') return 3.4;
    if (trait === 'HOBS_VANE') return 3.0;
    if (category === 'A2A' && (w.rangeKm || 40) <= 35) return 2.6;

    if (trait === 'RAMJET_SUSTAINED' || trait === 'STEALTH_SEEKER' || trait === 'DUAL_PULSE_SURGE') return 1.8;
    if (category === 'A2A') return 1.4;

    if (trait === 'LOFTED_HYPERSONIC' || trait === 'HYPERSONIC_IMPACT') return 0.75;
    if (trait === 'STEALTH_CRUISE' || trait === 'GLIDE_SATURATION') return 0.60;

    return 1.3;
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

    const los = Math.atan2(dy, dx);
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

    const N = 3.8;
    let turnRate = 0;

    if (closingVel > 0 && dist > 1.0) {
      turnRate = N * (closingVel / vm) * losRate;
    } else {
      let diff = los - missile.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      turnRate = diff * 2.4;
    }

    const maxRate = MissileKinetics.getMaxTurnRate(missile);
    const clampedRate = Math.max(-maxRate, Math.min(maxRate, turnRate));
    missile.heading += clampedRate * dt;
  }

  static checkTerminalTrigger(missile) {
    const dist = missile.distanceToTarget;
    const prevDist = missile.prevDistanceToTarget;

    if (dist <= 0.45) return { shouldTrigger: true, isHitCandidate: true };
    if (prevDist <= 0.85 && dist > prevDist) return { shouldTrigger: true, isHitCandidate: true };
    if (prevDist <= 2.8 && dist > prevDist && dist > 1.2) {
      return { shouldTrigger: true, isHitCandidate: false, reason: 'KINETIC OVERSHOOT' };
    }
    return { shouldTrigger: false };
  }

  static updateSpeedAndFlight(missile, dt, distToTarget) {
    const w = missile.weapon || {};

    // 1. Initial booster burn stage for all rocket-boosted weapons
    if (missile.age <= missile.boostDuration) {
      missile.stage = 'BOOST';
      const needed = Math.max(0.1, missile.peakSpeed - missile.launchSpeed);
      const accel = (needed / Math.max(0.4, missile.boostDuration)) * (missile.accelMultiplier || 1.8);
      missile.speed = Math.min(missile.peakSpeed, missile.speed + accel * dt);
      return;
    }

    // 2. Dual-pulse second stage ignition (PL-15E)
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

    // 3. Lofted hypersonic aero-ballistic profile (R-37M, Kinzhal)
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

    // 4. Ramjet continuous sustained thrust
    if (w.trait === 'RAMJET_SUSTAINED' || w.trait === 'EXTREME_STANDOFF') {
      missile.stage = (distToTarget <= 16.0) ? 'TERMINAL' : 'RAMJET';
      missile.speed = Math.max(missile.peakSpeed, missile.speed);
      return;
    }

    // 5. Stealth cruise & glide munitions
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

    // 6. Boost-sustain long-range stealth BVR (AIM-260 JATM)
    if (w.trait === 'STEALTH_SEEKER') {
      if (distToTarget <= 20.0) {
        missile.stage = 'TERMINAL';
      } else if (missile.age <= (missile.boostDuration + 14.0)) {
        missile.stage = 'SUSTAIN';
        missile.speed = Math.max(missile.peakSpeed * 0.95, missile.speed);
        return;
      } else {
        missile.stage = 'COAST';
      }
    } else if (distToTarget <= 18.0) {
      missile.stage = 'TERMINAL';
    } else if (w.seeker === 'PASSIVE_RADAR') {
      missile.stage = 'HOMING';
    } else if (w.trait === 'DUAL_PULSE_SURGE') {
      missile.stage = 'MIDCOURSE';
    } else if (w.category === 'A2A') {
      missile.stage = (w.rangeKm <= 35) ? 'TERMINAL' : (missile.age < 12.0 ? 'MIDCOURSE' : 'COAST');
    } else {
      missile.stage = 'COAST';
    }

    const minSustain = (w.category === 'A2A' && (w.rangeKm || 40) <= 35) ? 1.85 : 2.05;
    const decayRate = 0.045;
    missile.speed = Math.max(minSustain, missile.speed - decayRate * dt);
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

        if (game.radar) {
          game.radar.spawnCombatText(other.x, other.y, `BLAST -${aoeDamage}HP`, '#f59e0b');
        }

        if (wasAlive && other.hp <= 0 && game.simulation) {
          game.simulation.recordKillEvent(firingTeam, other, sourceUnit, {
            weapon: missile.weapon, isSalvo: false, salvoCount: 1,
            salvoBreakdown: 'MPBM Secondary Blast'
          });
        }
      }
    }
  }
}

window.MissileKinetics = MissileKinetics;