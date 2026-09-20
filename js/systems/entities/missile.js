/**
 * AIRSPACE STANDOFF // Missile Entity
 * Clean hit resolution with multi-missile salvo composition tracking.
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
    this.speed = weapon.speedMach || 4.0;
    this.distanceTraveled = 0.0;
    this.distanceToTarget = Math.hypot(targetUnit.x - sourceUnit.x, targetUnit.y - sourceUnit.y);
    this.prevDistanceToTarget = this.distanceToTarget;

    this.rcs = weapon.rcs !== undefined ? weapon.rcs : 0.04;
    this.isStealthMissile = weapon.isStealthMissile || (this.rcs <= 0.005);
    this.active = true;
    this.isDead = false;

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
    this.hasIgnitedPulseTwo = false;

    if (sourceUnit && sourceUnit.missilesLaunchedCount !== undefined) {
      sourceUnit.missilesLaunchedCount++;
    }

    if (weapon.trait === 'REAR_ENGAGE') {
      this.heading = Math.atan2(targetUnit.y - sourceUnit.y, targetUnit.x - sourceUnit.x);
    } else {
      this.heading = sourceUnit.heading;
    }

    if (weapon.trait === 'SNAP_TURN') {
      let snapDiff = Math.atan2(targetUnit.y - sourceUnit.y, targetUnit.x - sourceUnit.x) - this.heading;
      while (snapDiff < -Math.PI) snapDiff += Math.PI * 2;
      while (snapDiff > Math.PI) snapDiff -= Math.PI * 2;
      this.heading += Math.max(-1.15, Math.min(1.15, snapDiff));
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

    if (this.state === 'LOST_TRACK') {
      this.lostTimer += dt;
      this.x += Math.cos(this.heading) * (this.speed * 0.20) * dt;
      this.y += Math.sin(this.heading) * (this.speed * 0.20) * dt;
      if (this.lostTimer >= 1.4) this.isDead = true;
      return;
    }

    if (!this.target || typeof this.target.x !== 'number') {
      this.triggerLostTrack('TARGET LOST');
      return;
    }

    this.trail.unshift({ x: this.x, y: this.y, alpha: 1.0 });
    if (this.trail.length > 10) this.trail.pop();
    for (const p of this.trail) p.alpha -= dt * 1.4;

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);
    this.prevDistanceToTarget = this.distanceToTarget;
    this.distanceToTarget = dist;

    if (this.weapon.trait === 'DUAL_PULSE_SURGE' && !this.hasIgnitedPulseTwo && dist <= 22.0) {
      this.hasIgnitedPulseTwo = true;
      this.speed += 1.5;
      if (window.Game && window.Game.radar) window.Game.radar.spawnCombatText(this.x, this.y, 'PULSE 2 (+1.5M)', '#00f0ff');
    }

    if (this.weapon.trait === 'RAMJET_SUSTAINED') {
      this.speed = Math.max(this.speed, this.weapon.speedMach || 4.6);
    }

    const desiredLead = Physics.calcLeadInterceptAngle(
      this.x, this.y, this.speed, this.target.x, this.target.y,
      this.target.heading || 0, this.target.speed || 0
    );

    let diff = desiredLead - this.heading;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    let rate = ((this.weapon.trait === 'SNAP_TURN' || this.weapon.trait === 'HOBS_VANE') ? 6.0 : 4.2) * dt;
    this.heading += Math.max(-rate, Math.min(rate, diff));

    let inCloud = weatherClouds && weatherClouds.some(c => c.containsPoint(this.x, this.y) || c.containsPoint(this.target.x, this.target.y));
    if (inCloud) {
      this.cloudObscureTimer += dt;
      if ((this.weapon.seeker === 'IIR' || this.weapon.seeker === 'EO' || this.weapon.seeker === 'OPT') && this.cloudObscureTimer >= ((window.CONFIG && window.CONFIG.CLOUD_IR_TIME_TO_LOSE_SEC) || 8.0)) {
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

    if (dist <= 3.8 || (this.prevDistanceToTarget < 4.8 && dist > this.prevDistanceToTarget)) {
      this.resolveTerminalEngagement(weatherClouds);
    }
  }

  triggerLostTrack(reason) {
    this.state = 'LOST_TRACK';
    this.active = false;
    this.lostReason = reason;
    this.heading += (Math.random() * 0.8 - 0.4);
    if (this.target && this.target.missilesEvadedCount !== undefined) this.target.missilesEvadedCount++;
    if (typeof AudioSys !== 'undefined') AudioSys.playMissileLost();
    if (window.Game && window.Game.radar) window.Game.radar.spawnCombatText(this.x, this.y, `LOST: ${reason}`, '#f97316');
  }

  resolveTerminalEngagement(weatherClouds) {
    const tgt = this.target;
    const w = this.weapon;
    this.active = false;
    if (!tgt || tgt.hp <= 0) { this.isDead = true; return; }

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

    let concurrent = 1;
    let salvoDetails = '';
    if (window.Game && window.Game.missiles) {
      const inbounds = window.Game.missiles.filter(m => m.active && m.target && m.target.id === tgt.id);
      concurrent = inbounds.length;
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

    if (typeof SurfaceUnit !== 'undefined' && tgt instanceof SurfaceUnit) {
      let dmg = w.damage * ((w.trait === 'EMITTER_KILLER' && (tgt.type === 'S-400' || tgt.type === 'RADAR_ARRAY')) ? 3 : 1);
      const wasDead = tgt.hp <= 0;
      tgt.takeDamage(dmg, w.isBunkerCracker);
      this.isDead = true;
      if (!wasDead && tgt.hp <= 0 && window.Game && window.Game.simulation) {
        window.Game.simulation.recordKillEvent(this.team, tgt, this.source, {
          weapon: w, isSalvo: isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails
        });
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

    const pkData = Physics.calcPk(w, this.source, tgt, weatherClouds);
    let basePk = pkData.pk / 100.0;
    const suppression = Math.max(0.35, 1.0 - (concurrent - 1) * 0.25);
    let deductions = 0.0;

    if (tgt.isNotching && (w.seeker === 'ARH' || w.seeker === 'PASSIVE_RADAR')) {
      deductions += (this.source && this.source.hasIRST ? 0.20 : 0.45 * (1.0 - (w.antiNotchBonus || 0))) * suppression;
    }

    if (tgt.cmTimer > 0) {
      deductions += (w.seeker === 'ARH' ? 0.35 * (1.0 - (w.decoyResistance || w.flareResistance || 0)) : 0.20) * (tgt.isAce ? 1.45 : 1.0) * suppression;
    }

    if (tgt.activeManeuverBonus > 0 && tgt.glocTimer <= 0) {
      deductions += tgt.activeManeuverBonus * 0.40 * suppression;
    }

    if (tgt.isCoffin || tgt.coffinDodgeBonus) {
      deductions += (tgt.coffinDodgeBonus || 0.08) * suppression;
    }

    if (tgt.isAce || tgt.aceEvasionBonus) {
      deductions += (tgt.aceEvasionBonus || 0.32) * suppression;
    }

    if (tgt.isFlightLead && tgt.leadEvasionBonus) {
      deductions += tgt.leadEvasionBonus * suppression;
    }

    if (tgt.glocTimer > 0) deductions = 0.0;
    else if (tgt.stress >= 0.65 && !tgt.isCoffin && !tgt.spec.isDrone) deductions *= 0.50;

    const floor = tgt.isAce ? 0.04 : (tgt.isFlightLead ? 0.05 : 0.10);
    const hitChance = Math.max(floor, Math.min(0.95, basePk - deductions));

    if (Math.random() <= hitChance) {
      this.isDead = true;
      let finalDamage = w.damage;
      if (tgt.isFlightLead && tgt.missileDamageReduction) {
        finalDamage = Math.max(1, finalDamage - tgt.missileDamageReduction);
      }
      tgt.hp = Math.max(0, tgt.hp - finalDamage);
      if (typeof tgt.applyActionStress === 'function') tgt.applyActionStress(0.35);
      if (this.source) this.source.scorePoints = (this.source.scorePoints || 0) + (finalDamage * 25);

      if (tgt.hp <= 0 && window.Game && window.Game.simulation) {
        window.Game.simulation.recordKillEvent(this.team, tgt, this.source, {
          weapon: w, isSalvo: isSalvo, salvoCount: concurrent, salvoBreakdown: salvoDetails
        });
      }

      if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(finalDamage >= 4);
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnExplosionFX(tgt.x, tgt.y, finalDamage >= 4);
        window.Game.radar.spawnCombatText(tgt.x, tgt.y, isSalvo ? `SALVO HIT -${finalDamage}HP` : `HIT -${finalDamage}HP`, '#ff3366');
      }
    } else {
      let reason = 'KINETIC MISS';
      const aceBreakRate = tgt.aceEvasionBonus ? Math.min(0.85, tgt.aceEvasionBonus * 2.2) : 0.60;
      if (tgt.isAce && Math.random() < aceBreakRate) reason = 'ACE BREAK TURN';
      else if (tgt.isFlightLead && tgt.leadEvasionBonus && Math.random() < 0.75) reason = 'LEAD EVASION BREAK';
      else if (tgt.isCoffin) reason = 'COFFIN DODGE';
      else if (tgt.isNotching) reason = 'DOPPLER NOTCH';
      else if (tgt.cmTimer > 0) reason = 'CHAFF SPOOF';
      else if (tgt.activeManeuverBonus > 0) reason = 'EVASION';
      this.triggerLostTrack(reason);
    }
  }
}

window.MissileEntity = MissileEntity;