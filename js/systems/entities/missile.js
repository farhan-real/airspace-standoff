/**
 * AIRSPACE STANDOFF: Guided Missile Entity & Engagement Resolution
 * Enforces ProNav guidance, impact-time hit resolution, and contextual maneuver deflection reasons.
 */

class MissileEntity {
  constructor(weapon, sourceUnit, targetUnit) {
    if (!weapon) throw new Error('MissileEntity requires a weapon configuration.');
    if (!sourceUnit) throw new Error('MissileEntity requires a sourceUnit.');
    if (!targetUnit) throw new Error('MissileEntity requires a targetUnit.');
    if (typeof weapon.rangeKm !== 'number' || isNaN(weapon.rangeKm)) {
      throw new Error(`Weapon "${weapon.id || 'UNKNOWN'}" has invalid rangeKm.`);
    }

    this.id = 'MSL_' + Math.random().toString(36).substr(2, 6);
    this.weapon = weapon;
    this.source = sourceUnit;
    this.target = targetUnit;
    this.team = sourceUnit.team;

    if (typeof sourceUnit.x !== 'number' || isNaN(sourceUnit.x) || typeof sourceUnit.y !== 'number' || isNaN(sourceUnit.y)) {
      throw new Error(`SourceUnit "${sourceUnit.id}" has invalid coordinates.`);
    }
    this.x = sourceUnit.x;
    this.y = sourceUnit.y;
    this.alt = sourceUnit.alt;
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

    if (sourceUnit.missilesLaunchedCount !== undefined) {
      sourceUnit.missilesLaunchedCount++;
    }

    const angleToTarget = Math.atan2(targetUnit.y - sourceUnit.y, targetUnit.x - sourceUnit.x);
    const srcHeading = typeof sourceUnit.heading === 'number' && !isNaN(sourceUnit.heading)
      ? sourceUnit.heading
      : angleToTarget;

    let offBoresight = angleToTarget - srcHeading;
    while (offBoresight < -Math.PI) offBoresight += Math.PI * 2;
    while (offBoresight > Math.PI) offBoresight -= Math.PI * 2;

    const trait = weapon.trait || '';
    if (trait === 'REAR_ENGAGE' || trait === 'ALL_ASPECT_BURST' || trait === 'SURFACE_SAM') {
      this.heading = angleToTarget;
    } else if (trait === 'HOBS_VANE' || weapon.id === 'IRIS-T') {
      this.heading = angleToTarget;
    } else if (trait === 'SNAP_TURN' || trait === 'SWARM_RIPPLE') {
      this.heading = srcHeading + Math.max(-1.10, Math.min(1.10, offBoresight));
    } else if (weapon.category === 'A2A') {
      this.heading = srcHeading + Math.max(-0.65, Math.min(0.65, offBoresight));
    } else {
      this.heading = angleToTarget;
    }

    while (this.heading < 0) this.heading += Math.PI * 2;
    while (this.heading >= Math.PI * 2) this.heading -= Math.PI * 2;

    if (typeof MissileKinetics === 'undefined') throw new Error('MissileKinetics subsystem is not loaded.');
    MissileKinetics.initMissile(this);

    const inspection = window.Game && window.Game.inspection;
    if (inspection && inspection.enabled) {
      const clouds = window.Game.simulation ? window.Game.simulation.weatherClouds : [];
      const launchSolution = Physics.calcPk(weapon, sourceUnit, targetUnit, clouds);
      inspection.recordEvent('WEAPON LAUNCH', `${window.formatAircraftDisplayName ? window.formatAircraftDisplayName(sourceUnit) : (sourceUnit.callsign || sourceUnit.name || sourceUnit.id)} fired ${weapon.name || weapon.id}`, sourceUnit, targetUnit, {
        weapon: weapon.name || weapon.id,
        seeker: weapon.seeker || 'UNGUIDED',
        launchRangeKm: this.distanceToTarget,
        weaponMaxRangeKm: weapon.rangeKm,
        estimatedLaunchPk: launchSolution.pk,
        launchAssessment: launchSolution.label,
        assessmentReason: launchSolution.desc
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

    MissileKinetics.updateSpeedAndFlight(this, dt, dist);
    MissileKinetics.computeGuidance(this, dt);

    if (this.state === 'LOST_TRACK') return;

    const cloudHits = Physics.countIntersectingClouds(this.x, this.y, this.target.x, this.target.y, weatherClouds);
    if (cloudHits > 0) {
      this.cloudObscureTimer += dt * cloudHits;
      const loseThreshold = window.CONFIG.CLOUD_IR_TIME_TO_LOSE_SEC;
      if ((this.weapon.seeker === 'IIR' || this.weapon.seeker === 'EO' || this.weapon.seeker === 'OPT') && this.cloudObscureTimer >= loseThreshold) {
        this.triggerLostTrack('OBSCURED IN CLOUDS');
        return;
      }
    } else {
      this.cloudObscureTimer = Math.max(0, this.cloudObscureTimer - dt * 2.0);
    }

    this.prevDistanceToTarget = this.distanceToTarget;

    const step = (this.speed * 0.35) * dt;
    this.x += Math.cos(this.heading) * step;
    this.y += Math.sin(this.heading) * step;
    this.distanceTraveled += step;

    const mapW = window.CONFIG.THEATER_WIDTH_KM;
    const mapH = window.CONFIG.THEATER_HEIGHT_KM;
    const boundaryBuffer = 8.0;
    if (this.x < -boundaryBuffer || this.x > mapW + boundaryBuffer || this.y < -boundaryBuffer || this.y > mapH + boundaryBuffer) {
      this.isDead = true;
      this.active = false;
      return;
    }

    this.distanceToTarget = Math.hypot(this.target.x - this.x, this.target.y - this.y);
    this.minDistanceReached = Math.min(this.minDistanceReached, this.distanceToTarget);

    if (this.distanceTraveled >= this.weapon.rangeKm) {
      this.triggerLostTrack('KINETIC EXHAUSTION');
      return;
    }

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
          else if (tgt.activeManeuverId === 'EMERGENCY_CM' || tgt.cmTimer > 0) reason = 'CHAFF DECOY DIVERSION';
          else if (tgt.activeManeuverId === 'ZOOM_CLIMB') reason = 'HIGH-ALTITUDE CLIMB (ENERGY DEFICIT)';
          else if (tgt.activeManeuverId === 'BREAK_TURN') reason = 'DEFENSIVE BREAK TURN';
          else if (tgt.isCoffin) reason = 'COFFIN EVASIVE RESPONSE';
          else if (tgt.isAce) reason = 'ACE DEFENSIVE BREAK';
          else if (tgt.activeManeuverBonus > 0) reason = 'DEFENSIVE BREAK TURN';
        }
        this.triggerLostTrack(reason);
      } else {
        this.resolveTerminalEngagement(weatherClouds);
      }
    }
  }

  triggerLostTrack(reason) {
    if (typeof MissileTerminalSystem === 'undefined') throw new Error('MissileTerminalSystem is not loaded.');
    MissileTerminalSystem.triggerLostTrack(this, reason);
  }

  resolveTerminalEngagement(weatherClouds) {
    if (typeof MissileTerminalSystem === 'undefined') throw new Error('MissileTerminalSystem is not loaded.');
    MissileTerminalSystem.resolveTerminalEngagement(this, weatherClouds);
  }
}

window.MissileEntity = MissileEntity;