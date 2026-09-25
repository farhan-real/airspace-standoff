/**
 * AIRSPACE STANDOFF: Guided Missile Entity & Engagement Resolution
 * Enforces ProNav guidance, impact-time hit resolution, and contextual maneuver deflection reasons.
 */

class MissileEntity {
  constructor(weapon, sourceUnit, targetUnit) {
    this.id = 'MSL_' + Math.random().toString(36).substr(2, 6);
    this.weapon = weapon;
    this.source = sourceUnit;
    this.target = targetUnit;
    this.team = sourceUnit.team;
    this.x = sourceUnit.x;
    this.y = sourceUnit.y;
    this.alt = sourceUnit.alt || 0.5;
    this.distanceTraveled = 0.0;
    this.distanceToTarget = Math.hypot(targetUnit.x - sourceUnit.x, targetUnit.y - sourceUnit.y);
    this.prevDistanceToTarget = this.distanceToTarget;
    this.minDistanceReached = this.distanceToTarget;
    this.hasStartedClosing = false;
    this.cumulativeTurn = 0.0;

    this.rcs = weapon.rcs !== undefined ? weapon.rcs : 0.04;
    this.isStealthMissile = weapon.isStealthMissile || (this.rcs <= 0.005);
    this.active = true;
    this.isDead = false;
    this.age = 0.0;
    this.stage = 'BOOST';

    this.trackDurationBlue = 0.0;
    this.trackDurationRed = 0.0;
    this.trackHoldBlue = 0.0;
    this.identifiedByBlue = (this.team === 'friendly');
    this.identifiedByRed = (this.team === 'hostile');

    this.state = 'TRACKING';
    this.trail = [];
    this.lostTimer = 0.0;
    this.lostReason = '';
    this.cloudObscureTimer = 0.0;

    if (sourceUnit && sourceUnit.missilesLaunchedCount !== undefined) {
      sourceUnit.missilesLaunchedCount++;
    }

    const angleToTarget = Math.atan2(targetUnit.y - sourceUnit.y, targetUnit.x - sourceUnit.x);
    let offBoresight = angleToTarget - sourceUnit.heading;
    while (offBoresight < -Math.PI) offBoresight += Math.PI * 2;
    while (offBoresight > Math.PI) offBoresight -= Math.PI * 2;

    const trait = weapon.trait || '';
    if (trait === 'REAR_ENGAGE' || trait === 'ALL_ASPECT_BURST') {
      this.heading = angleToTarget;
    } else if (trait === 'HOBS_VANE' || weapon.id === 'IRIS-T') {
      this.heading = sourceUnit.heading + Math.max(-Math.PI * 0.5, Math.min(Math.PI * 0.5, offBoresight));
    } else if (trait === 'SNAP_TURN' || trait === 'SWARM_RIPPLE') {
      this.heading = sourceUnit.heading + Math.max(-1.05, Math.min(1.05, offBoresight));
    } else if (weapon.category === 'A2A') {
      this.heading = sourceUnit.heading + Math.max(-0.80, Math.min(0.80, offBoresight));
    } else {
      this.heading = sourceUnit.heading;
    }

    while (this.heading < 0) this.heading += Math.PI * 2;
    while (this.heading >= Math.PI * 2) this.heading -= Math.PI * 2;

    if (typeof MissileKinetics !== 'undefined') {
      MissileKinetics.initMissile(this);
    } else {
      this.speed = 2.4;
      this.isPassiveRadar = Boolean(weapon.seeker === 'PASSIVE_RADAR');
      this.pathRevealDistance = this.isPassiveRadar ? 20.0 : 999.0;
    }

    const inspection = window.Game && window.Game.inspection;
    if (inspection && inspection.enabled) {
      const clouds = window.Game.simulation ? window.Game.simulation.weatherClouds : [];
      const launchSolution = (typeof Physics !== 'undefined') ? Physics.calcPk(weapon, sourceUnit, targetUnit, clouds) : null;
      inspection.recordEvent('WEAPON LAUNCH', `${window.formatAircraftDisplayName ? window.formatAircraftDisplayName(sourceUnit) : (sourceUnit.callsign || sourceUnit.name || sourceUnit.id)} fired ${weapon.name || weapon.id}`, sourceUnit, targetUnit, {
        weapon: weapon.name || weapon.id,
        seeker: weapon.seeker || 'UNGUIDED',
        launchRangeKm: this.distanceToTarget,
        weaponMaxRangeKm: weapon.rangeKm,
        estimatedLaunchPk: launchSolution ? launchSolution.pk : null,
        launchAssessment: launchSolution ? launchSolution.label : 'Unavailable',
        assessmentReason: launchSolution ? launchSolution.desc : 'Launch model unavailable'
      }, this);
    }
  }

  isIdentifiedBy(team) {
    return (team === 'friendly') ? Boolean(this.identifiedByBlue) : Boolean(this.identifiedByRed);
  }

  get isIdentified() {
    return this.isIdentifiedBy((window.Game && window.Game.currentPvpCommander) || 'friendly');
  }

  set isIdentified(val) {
    this.identifiedByBlue = Boolean(val);
    this.identifiedByRed = Boolean(val);
  }

  update(dt, weatherClouds) {
    if (this.isDead) return;
    this.age += dt;

    if (this.state === 'LOST_TRACK') {
      this.lostTimer += dt;
      const coastStep = (this.speed * 0.35) * dt;
      this.x += Math.cos(this.heading) * coastStep;
      this.y += Math.sin(this.heading) * coastStep;
      if (this.lostTimer >= 2.0) this.isDead = true;
      return;
    }

    if (!this.target || typeof this.target.x !== 'number') {
      this.triggerLostTrack('TARGET LOST');
      return;
    }

    if (this.target.hp <= 0.05) {
      this.state = 'LOST_TRACK';
      this.active = false;
      this.lostReason = 'TARGET DESTROYED';
      this.stage = 'COAST';
      return;
    }

    const isPowered = (this.stage === 'BOOST' || this.stage === 'PULSE 2' || this.stage === 'RAMJET' || this.stage === 'SUSTAIN' || this.stage === 'DIVE');
    this.trail.unshift({ x: this.x, y: this.y, alpha: isPowered ? 1.0 : 0.45 });
    const maxTrail = isPowered ? 12 : 6;
    while (this.trail.length > maxTrail) this.trail.pop();
    for (const p of this.trail) p.alpha -= dt * 1.3;

    const dist = Math.hypot(this.target.x - this.x, this.target.y - this.y);

    if (typeof MissileKinetics !== 'undefined') {
      MissileKinetics.updateSpeedAndFlight(this, dt, dist);
      MissileKinetics.computeGuidance(this, dt);
    } else {
      const desiredLead = Physics.calcLeadInterceptAngle(this.x, this.y, this.speed, this.target.x, this.target.y, this.target.heading || 0, this.target.speed || 0);
      let diff = desiredLead - this.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.heading += Math.max(-2.5 * dt, Math.min(2.5 * dt, diff));
    }

    if (this.state === 'LOST_TRACK') return;

    const cloudHits = Physics.countIntersectingClouds(this.x, this.y, this.target.x, this.target.y, weatherClouds);
    if (cloudHits > 0) {
      this.cloudObscureTimer += dt * cloudHits;
      const loseThreshold = ((window.CONFIG && window.CONFIG.CLOUD_IR_TIME_TO_LOSE_SEC) || 8.0);
      if ((this.weapon.seeker === 'IIR' || this.weapon.seeker === 'EO' || this.weapon.seeker === 'OPT') && this.cloudObscureTimer >= loseThreshold) {
        this.triggerLostTrack('OBSCURED IN CLOUDS');
        return;
      }
    } else {
      this.cloudObscureTimer = Math.max(0, this.cloudObscureTimer - dt * 2.0);
    }

    const step = (this.speed * 0.35) * dt;
    this.x += Math.cos(this.heading) * step;
    this.y += Math.sin(this.heading) * step;
    this.distanceTraveled += step;

    if (this.distanceTraveled >= this.weapon.rangeKm) {
      this.triggerLostTrack('KINETIC EXHAUSTION');
      return;
    }

    if (typeof MissileKinetics !== 'undefined') {
      const trig = MissileKinetics.checkTerminalTrigger(this);
      if (trig.shouldTrigger) {
        if (trig.isOvershoot) {
          let reason = 'KINETIC OVERSHOOT';
          const tgt = this.target;
          if (tgt) {
            if (tgt.activeManeuverId === 'DOPPLER_NOTCH' || tgt.isNotching) reason = 'DOPPLER NOTCH (GATE LOSS)';
            else if (tgt.activeManeuverId === 'PUSH_COBRA') reason = 'COBRA BRAKE (OVERSHOOT)';
            else if (tgt.activeManeuverId === 'BARREL_ROLL') reason = 'BARREL ROLL (LEAD LOSS)';
            else if (tgt.activeManeuverId === 'SPLIT_S') reason = 'SPLIT-S (KINETIC ESCAPE)';
            else if (tgt.activeManeuverId === 'EMERGENCY_CM' || tgt.cmTimer > 0) reason = 'CHAFF DECOY SEDUCTION';
            else if (tgt.activeManeuverId === 'ZOOM_CLIMB') reason = 'ENERGY PERCH (GRAVITY DEFICIT)';
            else if (tgt.activeManeuverId === 'BREAK_TURN') reason = 'DEFENSIVE BREAK TURN';
            else if (tgt.isCoffin) reason = 'COFFIN NEURAL DODGE';
            else if (tgt.isAce) reason = 'ACE DEFENSIVE BREAK';
            else if (tgt.activeManeuverBonus > 0) reason = 'DEFENSIVE BREAK TURN';
          }
          this.triggerLostTrack(reason);
        } else {
          this.resolveTerminalEngagement(weatherClouds);
        }
      }
    } else if (dist <= 0.8) {
      this.resolveTerminalEngagement(weatherClouds);
    }
  }

  triggerLostTrack(reason) {
    if (this.state === 'LOST_TRACK') return;
    const stageBeforeLoss = this.stage;
    this.state = 'LOST_TRACK';
    this.active = false;
    this.lostReason = reason;
    this.stage = 'COAST';
    this.heading += (Math.random() * 0.2 - 0.1);

    const inspection = window.Game && window.Game.inspection;
    if (inspection && inspection.enabled) {
      inspection.recordEvent('TRACK TERMINATED', `${this.weapon.name || this.weapon.id} terminal track defeated (${reason})`, this.source, this.target, {
        missileId: this.id, reason, stageBeforeLoss, distanceToTargetKm: this.distanceToTarget,
        distanceTraveledKm: this.distanceTraveled, ageSec: this.age, cloudObscureSec: this.cloudObscureTimer
      }, this);
    }

    const isLiveTarget = this.target && this.target.hp > 0.05 && !this.target.isCivilian && !this.target.isGhost && !this.target.isDecoyDrone;
    const isGenuineEvade = isLiveTarget && (
      reason === 'KINETIC OVERSHOOT' || reason.includes('DOPPLER NOTCH') || reason.includes('COBRA') ||
      reason.includes('BARREL ROLL') || reason.includes('SPLIT-S') || reason.includes('CHAFF') ||
      reason.includes('PERCH') || reason.includes('BREAK') || reason.includes('DODGE') || reason === 'OBSCURED IN CLOUDS'
    );

    if (isGenuineEvade) {
      if (this.target.missilesEvadedCount !== undefined) {
        const isSwarm = (this.weapon && (this.weapon.trait === 'SWARM_RIPPLE' || this.weapon.trait === 'ALL_ASPECT_BURST'));
        if (isSwarm) {
          this.target._swarmEvadeAccum = (this.target._swarmEvadeAccum || 0) + 1;
          if (this.target._swarmEvadeAccum >= 4) {
            this.target.missilesEvadedCount++;
            this.target._swarmEvadeAccum = 0;
          }
        } else {
          this.target.missilesEvadedCount++;
        }
      }
      if (this.target.energy !== undefined) {
        this.target.energy = Math.max(0.20, this.target.energy - 0.15);
      }
    }

    if (typeof AudioSys !== 'undefined') AudioSys.playMissileLost();
    if (window.Game && window.Game.radar) window.Game.radar.spawnCombatText(this.x, this.y, `${reason}`, '#f97316');
  }

  resolveTerminalEngagement(weatherClouds) {
    const tgt = this.target;
    const w = this.weapon;
    if (!tgt || tgt.hp <= 0.05) {
      this.active = false; this.isDead = true;
      return;
    }

    let concurrent = 1;
    let salvoDetails = '';
    if (window.Game && window.Game.missiles) {
      const inbounds = window.Game.missiles.filter(m => (m.active || m.id === this.id) && m.target && m.target.id === tgt.id);
      concurrent = Math.max(1, inbounds.length);
      if (concurrent > 1) {
        const counts = {};
        for (const m of inbounds) {
          const rawName = (m.weapon && (m.weapon.name || m.weapon.id)) ? (m.weapon.name || m.weapon.id) : 'Missile';
          const clean = rawName.replace(/\s*\(\d+x\)/gi, '').replace(/\s*\(pack of \d+\)/gi, '').trim();
          counts[clean] = (counts[clean] || 0) + 1;
        }
        salvoDetails = Object.entries(counts).map(([name, count]) => `${name} x${count}`).join(', ');
      }
    }
    const isSalvo = (concurrent > 1);
    this.active = false;

    if (tgt.isGhost) {
      this.isDead = true;
      tgt.takeDamage();
      this.triggerLostTrack('FALSE CONTACT DISSIPATED');
      return;
    }

    if (tgt.isDecoyDrone) {
      this.isDead = true;
      tgt.takeDamage(w.damage || 1);
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnExplosionFX(tgt.x, tgt.y, false);
        window.Game.radar.spawnCombatText(tgt.x, tgt.y, 'DECOY DESTROYED', '#c084fc');
      }
      if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(false);
      return;
    }

    if (typeof SurfaceUnit !== 'undefined' && tgt instanceof SurfaceUnit) {
      const isEmitter = (tgt.type === 'S-400' || tgt.type === 'RADAR_ARRAY' || tgt.type === 'EW_JAMMER' || tgt.type === 'RADAR_VAN');
      const dmg = w.damage * ((w.trait === 'EMITTER_KILLER' && isEmitter) ? 3 : 1);
      const wasDead = tgt.hp <= 0;
      tgt.takeDamage(dmg, w.isBunkerCracker);
      this.isDead = true;
      if (!wasDead && tgt.hp <= 0 && window.Game && window.Game.simulation) {
        window.Game.simulation.recordKillEvent(this.team, tgt, this.source, { weapon: w, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      } else if (!wasDead && tgt.hp > 0 && window.Game && window.Game.simulation && window.Game.simulation.scoring) {
        window.Game.simulation.scoring.recordHitEvent(this.team, tgt, this.source, { weapon: w, damage: dmg, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      }
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnExplosionFX(tgt.x, tgt.y, true);
        window.Game.radar.spawnCombatText(tgt.x, tgt.y, `-${dmg} HP`, '#ff3366');
      }
      return;
    }

    if (tgt.isCivilian) {
      tgt.takeDamage(w.damage, this.source);
      this.isDead = true;
      return;
    }

    const impactModel = (typeof MissileKinetics !== 'undefined')
      ? MissileKinetics.explainHitProbability(this, tgt, weatherClouds, concurrent)
      : { probability: 0.65, rawProbability: 0.65, factors: {} };
    const hitChance = impactModel.probability;
    const impactRoll = Math.random();
    const hit = impactRoll <= hitChance;

    if (hit) {
      this.isDead = true;
      let finalDamage = w.damage;
      if (tgt.isFlightLead && tgt.missileDamageReduction) finalDamage = Math.max(1, finalDamage - tgt.missileDamageReduction);
      tgt.hp = Math.max(0, tgt.hp - finalDamage);
      if (tgt.hp < 0.05) tgt.hp = 0;
      if (typeof tgt.applyActionStress === 'function') tgt.applyActionStress(0.35);

      if (tgt.hp <= 0 && window.Game && window.Game.simulation) {
        window.Game.simulation.recordKillEvent(this.team, tgt, this.source, { weapon: w, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      } else if (tgt.hp > 0 && window.Game && window.Game.simulation && window.Game.simulation.scoring) {
        window.Game.simulation.scoring.recordHitEvent(this.team, tgt, this.source, { weapon: w, damage: finalDamage, isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails });
      }

      if (w.trait === 'SHOCKWAVE_DETONATION' && typeof MissileKinetics !== 'undefined') {
        MissileKinetics.applyThermobaricAoE(this, tgt, finalDamage, window.Game);
      } else {
        if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(finalDamage >= 4);
        if (window.Game && window.Game.radar) {
          window.Game.radar.spawnExplosionFX(tgt.x, tgt.y, finalDamage >= 4);
          window.Game.radar.spawnCombatText(tgt.x, tgt.y, isSalvo ? `SALVO HIT -${finalDamage}HP` : `HIT -${finalDamage}HP`, '#ff3366');
        }
      }
    } else {
      let reason = 'KINETIC OVERSHOOT';
      if (tgt.activeManeuverId === 'DOPPLER_NOTCH' || tgt.isNotching) reason = 'DOPPLER NOTCH (GATE LOSS)';
      else if (tgt.activeManeuverId === 'PUSH_COBRA') reason = 'COBRA BRAKE (OVERSHOOT)';
      else if (tgt.activeManeuverId === 'BARREL_ROLL') reason = 'BARREL ROLL (LEAD LOSS)';
      else if (tgt.activeManeuverId === 'SPLIT_S') reason = 'SPLIT-S (KINETIC ESCAPE)';
      else if (tgt.activeManeuverId === 'EMERGENCY_CM' || tgt.cmTimer > 0) reason = 'CHAFF DECOY SEDUCTION';
      else if (tgt.activeManeuverId === 'ZOOM_CLIMB') reason = 'ENERGY PERCH (GRAVITY DEFICIT)';
      else if (tgt.activeManeuverId === 'BREAK_TURN') reason = 'DEFENSIVE BREAK TURN';
      else if (tgt.isCoffin) reason = 'COFFIN NEURAL DODGE';
      else if (tgt.isAce) reason = 'ACE DEFENSIVE BREAK';
      else if (tgt.activeManeuverBonus > 0) reason = 'DEFENSIVE BREAK TURN';
      this.triggerLostTrack(reason);
    }
  }
}

window.MissileEntity = MissileEntity;