/**
 * AIRSPACE STANDOFF: Aircraft Entity & Kinematics Engine
 */

function formatAircraftDisplayName(aircraft) {
  if (!aircraft) throw new Error('formatAircraftDisplayName received undefined aircraft.');
  const callsign = String(aircraft.callsign || 'PILOT').trim();
  if (!aircraft.spec) throw new Error(`Aircraft "${aircraft.id}" has no specification object.`);
  const model = aircraft.spec.name || aircraft.spec.id;
  return `${callsign} - ${model}`;
}

function formatCombatantDisplayName(entity) {
  if (!entity) throw new Error('formatCombatantDisplayName received undefined entity.');
  if (entity.spec && (entity.callsign || entity.model)) return formatAircraftDisplayName(entity);
  return entity.callsign || entity.flightCode || entity.name || entity.id;
}

window.formatAircraftDisplayName = formatAircraftDisplayName;
window.formatCombatantDisplayName = formatCombatantDisplayName;

class Aircraft {
  constructor(specId, team, spawnX, spawnY, heading, chosenGunId, callsign, squadronName, isFlightLead = false, isAce = false, spawnAltFt = null) {
    if (!window.AIRCRAFT_CATALOG) {
      throw new Error('AIRCRAFT_CATALOG is not loaded.');
    }
    const baseSpec = window.AIRCRAFT_CATALOG[specId];
    if (!baseSpec) {
      throw new Error(`Aircraft specification "${specId}" not found in AIRCRAFT_CATALOG.`);
    }

    const requiredSpecFields = ['id', 'name', 'category', 'cost', 'hp', 'AGI_0', 'S_0', 'sOpt', 'R_0', 'radarType', 'radarConeDeg', 'lookDownBonus', 'sigma_0', 'beamSpike', 'thermalBloom', 'M_max', 'G_limit'];
    for (const field of requiredSpecFields) {
      if (baseSpec[field] === undefined || baseSpec[field] === null) {
        throw new Error(`Specification "${specId}" is missing required property: "${field}".`);
      }
    }

    this.id = 'AC_' + Math.random().toString(36).substr(2, 6);
    this.spec = JSON.parse(JSON.stringify(baseSpec));
    this.team = team;

    if (typeof spawnX !== 'number' || isNaN(spawnX) || typeof spawnY !== 'number' || isNaN(spawnY)) {
      throw new Error(`Invalid spawn coordinates (${spawnX}, ${spawnY}) for aircraft "${specId}".`);
    }
    this.x = spawnX;
    this.y = spawnY;

    if (typeof heading !== 'number' || isNaN(heading)) {
      throw new Error(`Invalid heading (${heading}) for aircraft "${specId}".`);
    }
    this.heading = heading;

    this.isAce = Boolean(isAce);
    this.isFlightLead = Boolean(isFlightLead);

    const isEW = (this.spec.category === 'EW' || this.spec.isEW);
    const isStrike = (this.spec.category === 'STRIKE');
    this.tacticalRole = isEW ? 'SEAD' : (isStrike ? 'STRIKE' : 'SWEEP');

    if (!callsign || !callsign.trim()) {
      throw new Error(`Aircraft "${specId}" requires an assigned callsign.`);
    }
    this.callsign = callsign.trim();

    if (!squadronName || !squadronName.trim()) {
      throw new Error(`Aircraft "${specId}" requires an assigned squadron name.`);
    }
    this.squadronName = squadronName.trim();

    const minAlt = window.CONFIG.MIN_ALT_FT;
    const maxAlt = window.CONFIG.MAX_ALT_FT;
    this.altFt = (typeof spawnAltFt === 'number' && !isNaN(spawnAltFt))
      ? Math.max(minAlt, Math.min(maxAlt, spawnAltFt))
      : (this.spec.id === 'DARKSTAR' ? 58000 : 30000);

    this.targetAltFt = this.altFt;
    this.vsiFpm = 0;
    this.alt = this.altFt / maxAlt;
    this.prevAltFt = this.altFt;
    this.altTrend = '--';

    this.engineAlpha = 0.50;
    this.effectiveMaxSpeed = this.spec.S_0;
    this.effectiveAcceleration = 0.24;
    this.speed = this.getTargetMach();
    this.prevSpeed = this.speed;
    this.speedTrend = '--';
    this.energy = 1.0;

    this.baseThermalBloom = this.spec.thermalBloom;
    this.thermalBloom = this.baseThermalBloom;
    this.thermalBloomTimer = 0.0;

    this.aceEvasionBonus = 0.0;
    this.leadStressMitigation = 1.0;
    this.autocannonResistance = 0.0;
    this.leadEvasionBonus = 0.0;
    this.missileDamageReduction = 0;

    if (this.isAce) {
      this.spec.hp += 1;
      this.spec.AGI_0 = Math.min(1.50, this.spec.AGI_0 + 0.05);
      this.spec.G_limit += 1.0;
      this.aceEvasionBonus = 0.08;
    } else if (this.isFlightLead && window.AircraftLeadBuffs) {
      window.AircraftLeadBuffs.apply(this);
    }

    this.hp = this.spec.hp;
    this.maxHp = this.spec.hp;
    this.stress = 0.0;
    this.glocTimer = 0.0;
    this.activeManeuverTimer = 0.0;
    this.activeManeuverBonus = 0.0;
    this.activeManeuverId = null;
    this.isNotching = false;

    const baseCm = this.isAce ? 6 : (this.isFlightLead ? (this.leadExtraCm ? 4 + this.leadExtraCm : 6) : 4);
    this.chaff = baseCm;
    this.countermeasures = baseCm;
    this.chaffFlares = baseCm;
    this.cmTimer = 0.0;

    if (!window.AUTOCANNONS_CATALOG) {
      throw new Error('AUTOCANNONS_CATALOG is not loaded.');
    }
    const effectiveGunId = chosenGunId || this.spec.builtInGun;
    if (!effectiveGunId) {
      throw new Error(`No gun defined for aircraft "${specId}".`);
    }
    const gunDef = window.AUTOCANNONS_CATALOG[effectiveGunId];
    if (!gunDef) {
      throw new Error(`Gun "${effectiveGunId}" not found in AUTOCANNONS_CATALOG.`);
    }
    this.gun = gunDef;
    this.gunAmmo = gunDef.defaultAmmo;
    this.gunCooldown = 0.0;

    this.radarLockedTarget = null;
    this.internalSlots = this.spec.internalSlots || 0;
    this.externalSlots = this.spec.externalSlots !== undefined ? this.spec.externalSlots : this.spec.totalSlots;
    this.hasCenterline = Boolean(this.spec.hasCenterline);
    this.centerlineSlots = this.spec.centerlineSlots !== undefined ? this.spec.centerlineSlots : (this.hasCenterline ? 6 : 0);
    this.totalSlots = this.spec.totalSlots !== undefined ? this.spec.totalSlots : (this.internalSlots + this.externalSlots);

    this.maxPylonRating = this.spec.maxPylonRating;
    this.upgradeSockets = this.spec.upgradeSockets;
    this.equippedWeapons = [];
    this.equippedUpgrades = [];

    const isPlayerTeam = (team === 'friendly');
    this.isCoffin = Boolean(this.spec.isCoffin);
    this.isAutonomous = (!isPlayerTeam && this.spec.isDrone && !this.isCoffin);
    this.autonomousOverride = isPlayerTeam;
    this.coffinDodgeBonus = this.isCoffin ? this.spec.coffinDodgeBonus : 0.0;

    this.isRTB = false;
    this.rtbTimer = 0.0;
    this.hasMaldDecoy = false;
    this.maldDecoyCharges = 0;
    this.distanceTraveled = 0.0;

    const is2P = Boolean(window.Game && window.Game.playerMode === '2P');
    this.trackDurationBlue = (team === 'friendly' || is2P) ? 999.0 : 0.0;
    this.trackDurationRed = (team === 'hostile' || is2P) ? 999.0 : 0.0;
    this.identifiedByBlue = (team === 'friendly' || is2P);
    this.identifiedByRed = (team === 'hostile' || is2P);

    this.kills = 0;
    this.scorePoints = 0;
    this.missilesLaunchedCount = 0;
    this.missilesEvadedCount = 0;
    this.firstDetectedTime = null;

    this.thrustVector = this.spec.thrustVector;
    this.hasIRST = false;
    this.hasDAS = false;
    this.hasESM = Boolean(this.spec.hasESM);
    this.immuneJamming = false;
    this.jamEfficiency = typeof this.spec.jamEfficiency === 'number' ? this.spec.jamEfficiency : 0.0;
    this.glocThreshold = (this.spec.isDrone || this.isCoffin) ? 999.0 : 0.95;

    this.recalculateWeight();
    this.speed = this.getTargetMach();
    this.prevSpeed = this.speed;
  }

  isIdentifiedBy(team) {
    if (window.Game && window.Game.playerMode === '2P') return true;
    if (this.team === team) return true;
    return (team === 'friendly') ? Boolean(this.identifiedByBlue) : Boolean(this.identifiedByRed);
  }

  get isIdentified() {
    if (window.Game && window.Game.playerMode === '2P') return true;
    return this.isIdentifiedBy((window.Game && window.Game.currentPvpCommander) || 'friendly');
  }

  set isIdentified(val) {
    const commander = (window.Game && window.Game.currentPvpCommander) || 'friendly';
    if (commander === 'friendly') this.identifiedByBlue = Boolean(val);
    else this.identifiedByRed = Boolean(val);
  }

  getTargetMach() {
    const maxSpd = this.effectiveMaxSpeed;
    const alpha = Math.max(0.20, Math.min(1.0, this.engineAlpha));
    const ratio = 0.45 + (alpha - 0.20) * (0.55 / 0.80);
    return Math.max(0.25, maxSpd * ratio);
  }

  getOptimalCornerSpeed() {
    return this.spec.sOpt;
  }

  getEffectiveAgility() {
    let agi = this.spec.AGI_0;
    if (this.turnBonus) agi += this.turnBonus;
    if (this.thrustVector) agi *= 1.20;
    if (this.isCoffin) agi *= 1.20;
    if (this.Wr) agi *= Math.max(0.45, 1.0 - 0.30 * this.Wr);

    let eturn = 1.0;
    if (!this.isCoffin) {
      const sOpt = this.getOptimalCornerSpeed();
      eturn = Physics.calcTurnEfficiency(this.speed, sOpt);
      eturn = Math.max(0.40, eturn);
    }
    if (this.stress >= 0.65 && !this.isCoffin && !this.spec.isDrone) eturn *= 0.70;
    return agi * eturn;
  }

  steerLeft(dt) {
    if (this.hp <= 0.05 || this.glocTimer > 0) return;
    const agi = this.getEffectiveAgility();
    this.heading -= agi * 2.0 * dt;
    while (this.heading < 0) this.heading += Math.PI * 2;
    this.energy = Math.max(0.20, this.energy - 0.10 * dt);
    this.speed = Math.max(0.30, this.speed - 0.06 * dt);
    this.applyActionStress(0.05 * dt);
  }

  steerRight(dt) {
    if (this.hp <= 0.05 || this.glocTimer > 0) return;
    const agi = this.getEffectiveAgility();
    this.heading += agi * 2.0 * dt;
    while (this.heading >= Math.PI * 2) this.heading -= Math.PI * 2;
    this.energy = Math.max(0.20, this.energy - 0.10 * dt);
    this.speed = Math.max(0.30, this.speed - 0.06 * dt);
    this.applyActionStress(0.05 * dt);
  }

  applyActionStress(amount) {
    if (this.spec.isDrone || this.isCoffin) return;
    if (this.isFlightLead && this.leadStressMitigation) amount *= this.leadStressMitigation;
    this.stress = Math.min(1.0, Math.max(0.0, this.stress + (amount * (this.stressTurnMultiplier || 1.0))));
    if (this.stress >= this.glocThreshold && this.glocTimer <= 0) this.glocTimer = 2.8;
  }

  dive() {
    this.targetAltFt = Math.max(window.CONFIG.MIN_ALT_FT, this.altFt - window.CONFIG.DIVE_ALT_DROP_FT);
    this.speed = Math.min(this.effectiveMaxSpeed * 1.35, this.speed + window.CONFIG.DIVE_SPEED_GAIN_MACH);
    this.energy = Math.min(1.0, this.energy + 0.35);
    this.applyActionStress(0.12);
  }

  zoomClimb() {
    if (this.speed <= 0.40) return false;
    this.targetAltFt = Math.min(window.CONFIG.MAX_ALT_FT, this.altFt + window.CONFIG.ZOOM_ALT_GAIN_FT);
    this.speed = Math.max(0.25, this.speed - window.CONFIG.ZOOM_SPEED_COST_MACH);
    this.energy = Math.max(0.25, this.energy - 0.30);
    this.applyActionStress(0.12);
    return true;
  }

  orderRTB() { this.isRTB = true; this.targetAltFt = 36000; this.engineAlpha = 1.0; }
  cancelRTB() { this.isRTB = false; this.rtbTimer = 0.0; this.targetAltFt = this.altFt; this.vsiFpm = 0; this.engineAlpha = 0.50; }
  toggleRTB() { if (this.isRTB) { this.cancelRTB(); return false; } else { this.orderRTB(); return true; } }

  update(dt, incomingMissiles) {
    if (this.hp <= 0.05) { this.hp = 0; return; }

    if (isNaN(this.x) || isNaN(this.y)) {
      throw new Error(`Aircraft "${this.id}" coordinates corrupted to NaN (${this.x}, ${this.y}).`);
    }
    if (isNaN(this.speed)) {
      throw new Error(`Aircraft "${this.id}" speed corrupted to NaN.`);
    }
    if (isNaN(this.heading)) {
      throw new Error(`Aircraft "${this.id}" heading corrupted to NaN.`);
    }

    if (this.isRTB) this.processRTB(dt);
    if (this.glocTimer > 0) {
      this.glocTimer -= dt;
      if (this.glocTimer <= 0) this.stress = 0.40;
    }
    if (this.activeManeuverTimer > 0) {
      this.activeManeuverTimer -= dt;
      if (this.activeManeuverTimer <= 0) {
        this.activeManeuverBonus = 0.0;
        this.isNotching = false;
        this.activeManeuverId = null;
      }
    }
    if (this.cmTimer > 0) this.cmTimer -= dt;
    if (this.gunCooldown > 0) this.gunCooldown -= dt;

    for (let i = 0; i < this.equippedWeapons.length; i++) {
      const item = this.equippedWeapons[i];
      if (item && item.cooldown > 0) {
        item.cooldown = Math.max(0, item.cooldown - dt);
      }
    }

    if (!this.spec.isDrone && !this.isCoffin && this.stress > 0) {
      this.stress = Math.max(0.0, this.stress - 0.06 * dt);
    }

    if (this.thermalBloomTimer > 0) {
      this.thermalBloomTimer -= dt;
      this.thermalBloom = Math.max(1.6, this.baseThermalBloom * 1.6);
    } else {
      let currentThrottleMultiplier = 1.0;
      if (this.engineAlpha > 0.85) currentThrottleMultiplier = 1.45;
      else if (this.engineAlpha < 0.35) currentThrottleMultiplier = 0.70;
      this.thermalBloom = this.baseThermalBloom * currentThrottleMultiplier;
    }

    const recoveryRate = 0.09 * this.engineAlpha;
    this.energy = Math.min(1.0, this.energy + recoveryRate * dt);

    const targetMach = this.getTargetMach();
    const speedDiff = targetMach - this.speed;
    this.speed += speedDiff * ((speedDiff >= 0) ? (this.effectiveAcceleration * 1.2) : 0.28) * dt;
    this.speed = Math.max(0.20, Math.min(this.effectiveMaxSpeed * 1.35, this.speed));

    const maxClimbFpm = 12000.0 * Math.max(0.3, this.speed);
    this.vsiFpm = Math.max(-maxClimbFpm, Math.min(maxClimbFpm, (this.targetAltFt - this.altFt) * 1.5));
    const minAlt = window.CONFIG.MIN_ALT_FT;
    const maxAlt = window.CONFIG.MAX_ALT_FT;
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

    const mapW = window.CONFIG.THEATER_WIDTH_KM;
    const mapH = window.CONFIG.THEATER_HEIGHT_KM;
    if (this.x < 2) { this.x = 2; this.heading = Math.PI - this.heading; }
    if (this.x > mapW - 2) { this.x = mapW - 2; this.heading = Math.PI - this.heading; }
    if (this.y < 2) { this.y = 2; this.heading = -this.heading; }
    if (this.y > mapH - 2) { this.y = mapH - 2; this.heading = -this.heading; }

    while (this.heading < 0) this.heading += Math.PI * 2;
    while (this.heading >= Math.PI * 2) this.heading -= Math.PI * 2;
  }
}

window.Aircraft = Aircraft;