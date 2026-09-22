/**
 * AIRSPACE STANDOFF: Aircraft Entity & Kinematics Engine
 */

class Aircraft {
  constructor(specId, team, spawnX, spawnY, heading, chosenGunId, callsign, squadronName, isFlightLead = false, isAce = false, spawnAltFt = null) {
    this.id = 'AC_' + Math.random().toString(36).substr(2, 6);
    const catalog = window.AIRCRAFT_CATALOG || {};
    this.spec = catalog[specId] ? JSON.parse(JSON.stringify(catalog[specId])) : {
      id: specId, name: specId, role: 'Fighter', category: 'MULTIROLE', cost: 18.0, hp: 4, AGI_0: 0.85, S_0: 0.95,
      R_0: 75.0, radarType: 'Pulse-Doppler', radarConeDeg: 120, sigma_0: 1.0, M_max: 5000, G_limit: 9,
      builtInGun: 'M61A2', allowedGuns: ['M61A2'], gunRounds: 500, totalSlots: 6, maxPylonRating: 'Type M', upgradeSockets: 3
    };
    this.team = team;
    this.x = (typeof spawnX === 'number' && !isNaN(spawnX)) ? spawnX : 20.0;
    this.y = (typeof spawnY === 'number' && !isNaN(spawnY)) ? spawnY : 50.0;
    this.heading = (typeof heading === 'number' && !isNaN(heading)) ? heading : 0.0;

    this.isAce = Boolean(isAce);
    this.isFlightLead = Boolean(isFlightLead);
    this.callsign = callsign || this.generateRandomCallsign();
    this.squadronName = squadronName || (team === 'friendly' ? 'Wardog Squadron' : 'Red Flight');

    if (typeof spawnAltFt === 'number' && !isNaN(spawnAltFt)) {
      this.altFt = Math.max(5000, Math.min(65000, spawnAltFt));
    } else if (this.spec.id === 'DARKSTAR') {
      this.spec.S_0 = 3.20;
      this.altFt = 58000;
    } else {
      this.altFt = 30000;
    }

    this.targetAltFt = this.altFt;
    this.vsiFpm = 0;
    this.alt = this.altFt / 65000.0;
    this.prevAltFt = this.altFt;
    this.altTrend = '--';

    this.engineAlpha = 0.60;
    this.speed = (this.spec.S_0 || 0.95) * 0.85;
    this.prevSpeed = this.speed;
    this.speedTrend = '--';
    this.energy = 1.0;
    this.thermalBloom = 1.0;
    this.thermalBloomTimer = 0.0;

    this.aceEvasionBonus = 0.0;
    this.leadStressMitigation = 1.0;
    this.autocannonResistance = 0.0;
    this.leadEvasionBonus = 0.0;
    this.missileDamageReduction = 0;

    if (this.isAce) {
      this.spec.hp = (this.spec.hp || 4) + 1;
      this.spec.AGI_0 = Math.min(1.0, (this.spec.AGI_0 || 0.85) + 0.03);
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
    this.gunAmmo = (this.gun && this.gun.defaultAmmo) ? this.gun.defaultAmmo : (this.spec.gunRounds || 500);
    this.gunCooldown = 0.0;

    this.radarLockedTarget = null;
    this.totalSlots = this.spec.totalSlots;
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
  }

  isIdentifiedBy(team) {
    if (window.Game && window.Game.playerMode === '2P') return true;
    if (this.team === team) return true;
    return (team === 'friendly') ? Boolean(this.identifiedByBlue) : Boolean(this.identifiedByRed);
  }

  get isIdentified() {
    if (window.Game && window.Game.playerMode === '2P') return true;
    const commander = (window.Game && window.Game.currentPvpCommander) || 'friendly';
    return this.isIdentifiedBy(commander);
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

  steerLeft(dt) {
    if (this.hp <= 0.05 || this.glocTimer > 0) return;
    let agi = (this.spec ? this.spec.AGI_0 : 0.85) * (this.thrustVector ? 1.25 : 1.0);
    if (this.isCoffin) agi *= 1.20;
    if (this.stress >= 0.65 && !this.isCoffin && !this.spec.isDrone) agi *= 0.70;
    this.heading -= agi * 1.8 * dt;
    while (this.heading < 0) this.heading += Math.PI * 2;
    this.energy = Math.max(0.20, this.energy - 0.10 * dt);
    this.speed = Math.max(0.30, this.speed - 0.06 * dt);
    this.applyActionStress(0.05 * dt);
  }

  steerRight(dt) {
    if (this.hp <= 0.05 || this.glocTimer > 0) return;
    let agi = (this.spec ? this.spec.AGI_0 : 0.85) * (this.thrustVector ? 1.25 : 1.0);
    if (this.isCoffin) agi *= 1.20;
    if (this.stress >= 0.65 && !this.isCoffin && !this.spec.isDrone) agi *= 0.70;
    this.heading += agi * 1.8 * dt;
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
  cancelRTB() { this.isRTB = false; this.rtbTimer = 0.0; this.targetAltFt = this.altFt; this.vsiFpm = 0; this.engineAlpha = 0.60; }
  toggleRTB() { if (this.isRTB) { this.cancelRTB(); return false; } else { this.orderRTB(); return true; } }

  update(dt, incomingMissiles) {
    if (this.hp <= 0.05) {
      this.hp = 0;
      return;
    }

    if (isNaN(this.x) || isNaN(this.y)) {
      this.x = (this.team === 'friendly') ? 20.0 : ((window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) ? window.CONFIG.THEATER_WIDTH_KM - 20.0 : 130.0);
      this.y = 50.0;
    }
    if (isNaN(this.speed)) this.speed = 0.85;
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
    if (!this.spec.isDrone && !this.isCoffin && this.stress > 0) {
      this.stress = Math.max(0.0, this.stress - 0.06 * dt);
    }

    if (this.thermalBloomTimer > 0) {
      this.thermalBloomTimer -= dt;
      this.thermalBloom = 1.6;
    } else if (this.spec.category !== 'EXPERIMENTAL') {
      this.thermalBloom = 1.0;
    }

    const recoveryRate = 0.09 * (this.engineAlpha || 0.60);
    this.energy = Math.min(1.0, this.energy + recoveryRate * dt);

    const targetMach = this.effectiveMaxSpeed * (0.35 + 0.65 * this.engineAlpha);
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

    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    if (this.x < 2) { this.x = 2; this.heading = Math.PI - this.heading; }
    if (this.x > w - 2) { this.x = w - 2; this.heading = Math.PI - this.heading; }
    if (this.y < 2) { this.y = 2; this.heading = -this.heading; }
    if (this.y > h - 2) { this.y = h - 2; this.heading = -this.heading; }
  }
}

window.Aircraft = Aircraft;