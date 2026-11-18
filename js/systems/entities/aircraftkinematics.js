/**
 * js/systems/entities/aircraftkinematics.js - Aircraft flight steering, stress, energy trades, and real-time updates.
 */

Aircraft.prototype.getTargetMach = function() {
  const alpha = Math.max(0.20, Math.min(1.0, this.engineAlpha));
  return Math.max(0.25, this.effectiveMaxSpeed * (0.45 + (alpha - 0.20) * (0.55 / 0.80)));
};

Aircraft.prototype.getOptimalCornerSpeed = function() {
  return this.spec.sOpt;
};

Aircraft.prototype.getEffectiveAgility = function() {
  let agi = this.spec.AGI_0 + this.turnBonus;
  if (this.thrustVector) agi *= 1.20;
  if (this.isCoffin) agi *= 1.20;
  agi *= Math.max(0.45, 1.0 - 0.30 * this.Wr);
  let eturn = this.isCoffin ? 1.0 : Math.max(0.40, Physics.calcTurnEfficiency(this.speed, this.getOptimalCornerSpeed()));
  if (this.stress >= 0.65 && !this.isCoffin && !this.spec.isDrone) eturn *= 0.70;
  return agi * eturn;
};

Aircraft.prototype.steerLeft = function(dt) {
  if (this.hp <= 0.05 || this.glocTimer > 0 || this.groundPhase) return;
  this.heading -= this.getEffectiveAgility() * 2.0 * dt;
  while (this.heading < 0) this.heading += Math.PI * 2;
  this.energy = Math.max(0.20, this.energy - 0.10 * dt);
  this.speed = Math.max(0.30, this.speed - 0.06 * dt);
  this.applyActionStress(0.05 * dt);
};

Aircraft.prototype.steerRight = function(dt) {
  if (this.hp <= 0.05 || this.glocTimer > 0 || this.groundPhase) return;
  this.heading += this.getEffectiveAgility() * 2.0 * dt;
  while (this.heading >= Math.PI * 2) this.heading -= Math.PI * 2;
  this.energy = Math.max(0.20, this.energy - 0.10 * dt);
  this.speed = Math.max(0.30, this.speed - 0.06 * dt);
  this.applyActionStress(0.05 * dt);
};

Aircraft.prototype.applyActionStress = function(amount) {
  if (this.spec.isDrone || this.isCoffin) return;
  this.stress = Math.min(1.0, Math.max(0.0, this.stress + (amount * this.leadStressMitigation * this.stressTurnMultiplier)));
  if (this.stress >= this.glocThreshold && this.glocTimer <= 0) this.glocTimer = 2.8;
};

Aircraft.prototype.dive = function() {
  this.targetAltFt = Math.max(window.CONFIG.MIN_ALT_FT, this.altFt - window.CONFIG.DIVE_ALT_DROP_FT);
  this.speed = Math.min(this.effectiveMaxSpeed * 1.35, this.speed + window.CONFIG.DIVE_SPEED_GAIN_MACH);
  this.energy = Math.min(1.0, this.energy + 0.35);
  this.applyActionStress(0.12);
};

Aircraft.prototype.zoomClimb = function() {
  if (this.speed <= 0.40) return false;
  this.targetAltFt = Math.min(window.CONFIG.MAX_ALT_FT, this.altFt + window.CONFIG.ZOOM_ALT_GAIN_FT);
  this.speed = Math.max(0.25, this.speed - window.CONFIG.ZOOM_SPEED_COST_MACH);
  this.energy = Math.max(0.25, this.energy - 0.30);
  this.applyActionStress(0.12);
  return true;
};

Aircraft.prototype.orderRTB = function() {
  this.isRTB = true;
  this.targetAltFt = 36000;
  this.engineAlpha = 1.0;
};

Aircraft.prototype.cancelRTB = function() {
  this.isRTB = false;
  this.rtbTimer = 0.0;
  this.targetAltFt = this.altFt;
  this.vsiFpm = 0;
  this.engineAlpha = 0.50;
};

Aircraft.prototype.toggleRTB = function() {
  if (this.isRTB) {
    this.cancelRTB();
    return false;
  }
  this.orderRTB();
  return true;
};

Aircraft.prototype.update = function(dt, incomingMissiles) {
  if (this.hp <= 0.05) { this.hp = 0; return; }
  if (this.groundPhase) {
    const groundStep = this.speed * 0.35 * dt;
    this.x += Math.cos(this.heading) * groundStep;
    this.y += Math.sin(this.heading) * groundStep;
    this.altFt = 0;
    this.alt = 0;
    return;
  }
  if (this.isRTB) this.processRTB(dt);
  if (this.glocTimer > 0 && (this.glocTimer -= dt) <= 0) this.stress = 0.40;
  if (this.activeManeuverTimer > 0 && (this.activeManeuverTimer -= dt) <= 0) {
    this.activeManeuverBonus = 0.0;
    this.isNotching = false;
    this.activeManeuverId = null;
  }
  if (this.cmTimer > 0) this.cmTimer -= dt;
  if (this.gunCooldown > 0) this.gunCooldown -= dt;
  for (let i = 0; i < this.equippedWeapons.length; i++) {
    if (this.equippedWeapons[i] && this.equippedWeapons[i].cooldown > 0) {
      this.equippedWeapons[i].cooldown = Math.max(0, this.equippedWeapons[i].cooldown - dt);
    }
  }
  if (!this.spec.isDrone && !this.isCoffin && this.stress > 0) this.stress = Math.max(0.0, this.stress - 0.06 * dt);
  if (this.thermalBloomTimer > 0) {
    this.thermalBloomTimer -= dt;
    this.thermalBloom = Math.max(1.6, this.baseThermalBloom * 1.6);
  } else {
    const mult = this.engineAlpha > 0.85 ? 1.45 : (this.engineAlpha < 0.35 ? 0.70 : 1.0);
    this.thermalBloom = this.baseThermalBloom * mult;
  }
  this.energy = Math.min(1.0, this.energy + 0.09 * this.engineAlpha * dt);
  const speedDiff = this.getTargetMach() - this.speed;
  this.speed += speedDiff * ((speedDiff >= 0) ? (this.effectiveAcceleration * 1.2) : 0.28) * dt;
  this.speed = Math.max(0.20, Math.min(this.effectiveMaxSpeed * 1.35, this.speed));
  const maxClimbFpm = 12000.0 * Math.max(0.3, this.speed);
  this.vsiFpm = Math.max(-maxClimbFpm, Math.min(maxClimbFpm, (this.targetAltFt - this.altFt) * 1.5));
  const minAlt = window.CONFIG.MIN_ALT_FT, maxAlt = window.CONFIG.MAX_ALT_FT;
  this.altFt = Math.max(minAlt, Math.min(maxAlt, this.altFt + (this.vsiFpm / 60.0) * dt));
  this.alt = Math.max(0.08, Math.min(1.0, this.altFt / maxAlt));
  const dSpd = (this.speed - this.prevSpeed) / Math.max(0.001, dt);
  this.speedTrend = dSpd > 0.02 ? '^' : (dSpd < -0.02 ? 'v' : '--');
  this.prevSpeed = this.speed;
  this.altTrend = this.vsiFpm > 250 ? '^' : (this.vsiFpm < -250 ? 'v' : '--');
  this.prevAltFt = this.altFt;
  const step = this.speed * 0.35 * dt;
  this.x += Math.cos(this.heading) * step;
  this.y += Math.sin(this.heading) * step;
  this.distanceTraveled += step;

  this.historySampleTimer += dt;
  if (this.historySampleTimer >= 0.5) {
    this.historySampleTimer = 0;
    const simTime = (window.Game && window.Game.simulation) ? window.Game.simulation.elapsedTimeSec : (performance.now() / 1000);
    this.flightHistory.push({ time: simTime, speed: this.speed, altFt: this.altFt });
    if (this.flightHistory.length > 120) this.flightHistory.shift();
  }

  const mapW = window.CONFIG.THEATER_WIDTH_KM, mapH = window.CONFIG.THEATER_HEIGHT_KM;
  if (this.x < 2) { this.x = 2; this.heading = Math.PI - this.heading; }
  if (this.x > mapW - 2) { this.x = mapW - 2; this.heading = Math.PI - this.heading; }
  if (this.y < 2) { this.y = 2; this.heading = -this.heading; }
  if (this.y > mapH - 2) { this.y = mapH - 2; this.heading = -this.heading; }
  while (this.heading < 0) this.heading += Math.PI * 2;
  while (this.heading >= Math.PI * 2) this.heading -= Math.PI * 2;
};
