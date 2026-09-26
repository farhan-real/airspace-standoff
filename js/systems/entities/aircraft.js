/**
 * AIRSPACE STANDOFF: Aircraft Entity & Kinematics Engine
 */

function formatAircraftDisplayName(aircraft) {
  if (!aircraft) return 'Unknown aircraft';
  const callsign = String(aircraft.callsign || 'PILOT').trim();
  const model = aircraft.spec
    ? (aircraft.spec.name || aircraft.spec.id || aircraft.model || 'AIRCRAFT')
    : (aircraft.model || aircraft.modelName || 'AIRCRAFT');
  return `${callsign} - ${model}`;
}

function formatCombatantDisplayName(entity) {
  if (!entity) return 'Unknown contact';
  if (entity.spec && (entity.callsign || entity.model)) return formatAircraftDisplayName(entity);
  return entity.callsign || entity.flightCode || entity.name || entity.id || 'Unknown contact';
}

window.formatAircraftDisplayName = formatAircraftDisplayName;
window.formatCombatantDisplayName = formatCombatantDisplayName;

class Aircraft {
  constructor(specId, team, spawnX, spawnY, heading, chosenGunId, callsign, squadronName, isFlightLead = false, isAce = false, spawnAltFt = null) {
    this.id = 'AC_' + Math.random().toString(36).substr(2, 6);
    const catalog = window.AIRCRAFT_CATALOG || {};
    this.spec = catalog[specId] ? JSON.parse(JSON.stringify(catalog[specId])) : {
      id: specId, name: specId, role: 'Fighter', category: 'MULTIROLE', cost: 18.0, hp: 4, AGI_0: 0.85, S_0: 0.95, sOpt: 0.65,
      R_0: 75.0, radarType: 'Pulse-Doppler', radarConeDeg: 120, sigma_0: 1.0, thermalBloom: 1.0, M_max: 5000, G_limit: 9,
      builtInGun: 'M61A2', allowedGuns: ['M61A2'], gunRounds: 24, internalSlots: 0, externalSlots: 6, hasCenterline: true, centerlineSlots: 4, totalSlots: 6, maxPylonRating: 'Type M', upgradeSockets: 3
    };
    this.team = team;
    this.x = (typeof spawnX === 'number' && !isNaN(spawnX)) ? spawnX : 20.0;
    this.y = (typeof spawnY === 'number' && !isNaN(spawnY)) ? spawnY : 50.0;
    this.heading = (typeof heading === 'number' && !isNaN(heading)) ? heading : 0.0;

    this.isAce = Boolean(isAce);
    this.isFlightLead = Boolean(isFlightLead);

    let rawCallsign = callsign || this.generateRandomCallsign();
    if (rawCallsign.toLowerCase().includes('wardog')) rawCallsign = rawCallsign.replace(/wardog/gi, 'Viper');
    this.callsign = rawCallsign;

    let cleanSquadName = squadronName || (team === 'friendly' ? '7th Tactical Squadron' : 'Red Flight');
    if (cleanSquadName.toLowerCase().includes('wardog')) cleanSquadName = (team === 'friendly' ? '7th Tactical Squadron' : 'Red Flight');
    this.squadronName = cleanSquadName;

    this.altFt = (typeof spawnAltFt === 'number' && !isNaN(spawnAltFt))
      ? Math.max(5000, Math.min(65000, spawnAltFt))
      : (this.spec.id === 'DARKSTAR' ? 58000 : 30000);

    this.targetAltFt = this.altFt;
    this.vsiFpm = 0;
    this.alt = this.altFt / 65000.0;
    this.prevAltFt = this.altFt;
    this.altTrend = '--';

    this.engineAlpha = 0.50;
    this.effectiveMaxSpeed = this.spec.S_0 || 0.95;
    this.effectiveAcceleration = 0.24;
    this.speed = this.getTargetMach();
    this.prevSpeed = this.speed;
    this.speedTrend = '--';
    this.energy = 1.0;

    const baseThermal = Number(this.spec && this.spec.thermalBloom !== undefined ? this.spec.thermalBloom : 1.0);
    this.baseThermalBloom = baseThermal;
    this.thermalBloom = this.baseThermalBloom;
    this.thermalBloomTimer = 0.0;

    this.aceEvasionBonus = 0.0;
    this.leadStressMitigation = 1.0;
    this.autocannonResistance = 0.0;
    this.leadEvasionBonus = 0.0;
    this.missileDamageReduction = 0;

    if (this.isAce) {
      this.spec.hp = (this.spec.hp || 4) + 1;
      this.spec.AGI_0 = Math.min(1.50, (this.spec.AGI_0 || 0.85) + 0.05);
      this.spec.G_limit = (this.spec.G_limit || 9.0) + 1.0;
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

    const gunCatalog = window.AUTOCANNONS_CATALOG || {};
    const defaultGun = this.spec.builtInGun || 'M61A2';
    const effectiveGunId = chosenGunId || defaultGun;
    this.gun = gunCatalog[effectiveGunId] || gunCatalog[defaultGun] || gunCatalog['M61A2'];
    this.gunAmmo = (this.gun && this.gun.defaultAmmo) ? this.gun.defaultAmmo : 24;
    this.gunCooldown = 0.0;

    this.radarLockedTarget = null;
    this.internalSlots = this.spec.internalSlots || 0;
    this.externalSlots = this.spec.externalSlots !== undefined ? this.spec.externalSlots : (this.spec.totalSlots || 6);
    this.hasCenterline = Boolean(this.spec.hasCenterline);
    this.centerlineSlots = this.spec.centerlineSlots !== undefined ? this.spec.centerlineSlots : (this.hasCenterline ? 6 : 0);
    this.totalSlots = this.spec.totalSlots !== undefined ? this.spec.totalSlots : (this.internalSlots + this.externalSlots);

    this.maxPylonRating = this.spec.maxPylonRating;
    this.upgradeSockets = this.spec.upgradeSockets || 3;
    this.equippedWeapons = [];
    this.equippedUpgrades = [];

    const isPlayerTeam = (team === 'friendly');
    this.isCoffin = Boolean(this.spec.isCoffin);
    this.isAutonomous = (!isPlayerTeam && this.spec.isDrone && !this.isCoffin);
    this.autonomousOverride = isPlayerTeam;
    this.coffinDodgeBonus = this.isCoffin ? (this.spec.coffinDodgeBonus || 0.25) : 0.0;

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
    this.immuneJamming = false;
    this.jamEfficiency = 0.0;
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

  generateRandomCallsign() {
    const pool = window.CALLSIGN_POOL || ['Trigger', 'Mobius 1', 'Cipher', 'Viper', 'Ghost', 'Talon'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  getTargetMach() {
    const maxSpd = this.effectiveMaxSpeed || (this.spec ? this.spec.S_0 : 0.95);
    const alpha = Math.max(0.20, Math.min(1.0, this.engineAlpha !== undefined ? this.engineAlpha : 0.50));
    const ratio = 0.45 + (alpha - 0.20) * (0.55 / 0.80);
    return Math.max(0.25, maxSpd * ratio);
  }

  getOptimalCornerSpeed() {
    const baseOpt = (this.spec && this.spec.sOpt) ? this.spec.sOpt : ((this.spec ? this.spec.S_0 : 0.95) * 0.65);
    const baseS0 = (this.spec && this.spec.S_0) ? this.spec.S_0 : 1.0;
    return Math.max(0.25, baseOpt * ((this.effectiveMaxSpeed || baseS0) / baseS0));
  }

  getEffectiveAgility() {
    let agi = this.spec ? (this.spec.AGI_0 || 0.85) : 0.85;
    if (this.turnBonus) agi += this.turnBonus;
    if (this.thrustVector) agi *= 1.20;
    if (this.isCoffin) agi *= 1.20;
    if (this.Wr) agi *= Math.max(0.50, 1.0 - 0.25 * this.Wr);

    let eturn = 1.0;
    if (!this.isCoffin) {
      const sOpt = this.getOptimalCornerSpeed();
      eturn = (typeof Physics !== 'undefined') ? Physics.calcTurnEfficiency(this.speed || 0.8, sOpt) : 0.85;
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
    const cfg = window.CONFIG || {};
    this.targetAltFt = Math.max(cfg.MIN_ALT_FT || 5000, this.altFt - (cfg.DIVE_ALT_DROP_FT || 7500));
    this.speed = Math.min(this.effectiveMaxSpeed * 1.35, this.speed + (cfg.DIVE_SPEED_GAIN_MACH || 0.32));
    this.energy = Math.min(1.0, this.energy + 0.35);
    this.applyActionStress(0.12);
  }

  zoomClimb() {
    const cfg = window.CONFIG || {};
    if (this.speed <= 0.40) return false;
    this.targetAltFt = Math.min(cfg.MAX_ALT_FT || 65000, this.altFt + (cfg.ZOOM_ALT_GAIN_FT || 8500));
    this.speed = Math.max(0.25, this.speed - (cfg.ZOOM_SPEED_COST_MACH || 0.28));
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
      this.x = (this.team === 'friendly') ? 20.0 : ((window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) ? window.CONFIG.THEATER_WIDTH_KM - 20.0 : 130.0);
      this.y = 50.0;
    }
    if (isNaN(this.speed)) this.speed = this.getTargetMach();
    if (isNaN(this.heading)) this.heading = (this.team === 'friendly') ? 0.0 : Math.PI;

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
      this.thermalBloom = Math.max(1.6, (this.baseThermalBloom || 1.0) * 1.6);
    } else {
      let currentThrottleMultiplier = 1.0;
      if (this.engineAlpha > 0.85) currentThrottleMultiplier = 1.45;
      else if (this.engineAlpha < 0.35) currentThrottleMultiplier = 0.70;
      this.thermalBloom = (this.baseThermalBloom || 1.0) * currentThrottleMultiplier;
    }

    const recoveryRate = 0.09 * (this.engineAlpha || 0.50);
    this.energy = Math.min(1.0, this.energy + recoveryRate * dt);

    const targetMach = this.getTargetMach();
    const speedDiff = targetMach - this.speed;
    this.speed += speedDiff * ((speedDiff >= 0) ? (this.effectiveAcceleration * 1.2) : 0.28) * dt;
    this.speed = Math.max(0.20, Math.min(this.effectiveMaxSpeed * 1.35, this.speed));

    const maxClimbFpm = 12000.0 * Math.max(0.3, this.speed);
    this.vsiFpm = Math.max(-maxClimbFpm, Math.min(maxClimbFpm, (this.targetAltFt - this.altFt) * 1.5));
    this.altFt = Math.max(5000, Math.min(65000, this.altFt + (this.vsiFpm / 60.0) * dt));
    this.alt = Math.max(0.08, Math.min(1.0, this.altFt / 65000.0));

    const dSpd = (this.speed - this.prevSpeed) / Math.max(0.001, dt);
    this.speedTrend = dSpd > 0.02 ? '^' : (dSpd < -0.02 ? 'v' : '--');
    this.prevSpeed = this.speed;

    this.altTrend = this.vsiFpm > 250 ? '^' : (this.vsiFpm < -250 ? 'v' : '--');
    this.prevAltFt = this.altFt;

    const step = this.speed * 0.35 * dt;
    this.x += Math.cos(this.heading) * step;
    this.y += Math.sin(this.heading) * step;
    this.distanceTraveled = (this.distanceTraveled || 0.0) + step;

    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    if (this.x < 2) { this.x = 2; this.heading = Math.PI - this.heading; }
    if (this.x > w - 2) { this.x = w - 2; this.heading = Math.PI - this.heading; }
    if (this.y < 2) { this.y = 2; this.heading = -this.heading; }
    if (this.y > h - 2) { this.y = h - 2; this.heading = -this.heading; }

    while (this.heading < 0) this.heading += Math.PI * 2;
    while (this.heading >= Math.PI * 2) this.heading -= Math.PI * 2;
  }
}

window.Aircraft = Aircraft;