/**
 * AIRSPACE STANDOFF // Aircraft Entity
 * Flight Lead receives category-specific buffs (RCS, speed, agility, armor, bus regen, CMs).
 * In 2P mode, isIdentifiedBy always returns true for fair mutual tactical visibility.
 * Synchronizes initial altFt and targetAltFt so aircraft start in steady trimmed level flight.
 */

class Aircraft {
  constructor(specId, team, spawnX, spawnY, heading, chosenGunId, callsign, squadronName, isFlightLead = false, isAce = false, spawnAltFt = null) {
    this.id = 'AC_' + Math.random().toString(36).substr(2, 6);
    const catalog = window.AIRCRAFT_CATALOG || {};
    this.spec = catalog[specId] ? JSON.parse(JSON.stringify(catalog[specId])) : {
      id: specId, name: specId, role: 'Fighter', category: 'MULTIROLE', cost: 18.0, hp: 4, AGI_0: 0.85, S_0: 0.95, R_0: 75.0, radarType: 'Pulse-Doppler', radarConeDeg: 120, sigma_0: 1.0, M_max: 5000, G_limit: 9, builtInGun: 'M61A2', allowedGuns: ['M61A2'], gunRounds: 3200, totalSlots: 6, maxPylonRating: 'Type M', upgradeSockets: 3
    };
    this.team = team;
    this.x = spawnX;
    this.y = spawnY;
    this.heading = heading;

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

    // Target altitude starts identical to spawn altitude so aircraft do not begin with climb or dive
    this.targetAltFt = this.altFt;
    this.vsiFpm = 0;
    this.alt = this.altFt / 65000.0;
    this.prevAltFt = this.altFt;
    this.altTrend = '--';

    this.engineAlpha = 0.60;
    this.speed = (this.spec.S_0 || 0.95) * 0.85;
    this.prevSpeed = this.speed;
    this.speedTrend = '--';

    this.aceEvasionBonus = 0.0;
    this.leadStressMitigation = 1.0;
    this.autocannonResistance = 0.0;
    this.leadEvasionBonus = 0.0;
    this.missileDamageReduction = 0;

    if (this.isAce) {
      this.spec.hp = (this.spec.hp || 4) + 1;
      this.spec.AGI_0 = Math.min(1.0, (this.spec.AGI_0 || 0.85) + 0.08);
      this.spec.G_limit = (this.spec.G_limit || 9.0) + 2.5;
      this.aceEvasionBonus = 0.32;
    } else if (this.isFlightLead) {
      this.applyCategoryLeadBuffs();
    }

    this.hp = this.spec.hp;
    this.maxHp = this.spec.hp;

    this.stress = 0.0;
    this.glocTimer = 0.0;
    this.activeManeuverTimer = 0.0;
    this.activeManeuverBonus = 0.0;
    this.isNotching = false;

    const baseCm = this.isAce ? 8 : (this.isFlightLead ? (this.leadExtraCm ? 4 + this.leadExtraCm : 6) : 4);
    this.chaff = baseCm;
    this.countermeasures = baseCm;
    this.chaffFlares = baseCm;
    this.cmTimer = 0.0;

    const gunCatalog = window.AUTOCANNONS_CATALOG || {};
    const defaultGun = this.spec.builtInGun || 'M61A2';
    const effectiveGunId = chosenGunId || defaultGun;
    this.gun = gunCatalog[effectiveGunId] || gunCatalog[defaultGun] || gunCatalog['M61A2'];
    this.gunAmmo = (this.gun && this.gun.defaultAmmo) ? this.gun.defaultAmmo : (this.spec.gunRounds || 3200);
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
    this.coffinDodgeBonus = this.isCoffin ? 0.25 : 0.0;

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

  setAltitude(altFt) {
    this.altFt = Math.max(5000, Math.min(65000, altFt));
    this.targetAltFt = this.altFt;
    this.vsiFpm = 0;
    this.alt = this.altFt / 65000.0;
    this.prevAltFt = this.altFt;
    this.altTrend = '--';
  }

  applyCategoryLeadBuffs() {
    const cat = this.spec.category || 'MULTIROLE';
    this.leadExtraCm = 2;
    this.leadEvasionBonus = 0.20;

    switch (cat) {
      case 'STEALTH':
        this.spec.hp = (this.spec.hp || 4) + 1;
        if (this.spec.sigma_0) this.spec.sigma_0 *= 0.65;
        this.beamSpikeReduction = 0.50;
        if (this.spec.R_0) this.spec.R_0 += 15.0;
        this.datalinkBonus = (this.datalinkBonus || 0) + 0.25;
        this.radarIdentifySpeed = 1.6;
        this.leadEvasionBonus = 0.20;
        break;
      case 'SUPERIORITY':
        this.spec.hp = (this.spec.hp || 4) + 2;
        if (this.spec.sigma_0) this.spec.sigma_0 *= 0.60;
        if (this.spec.S_0) this.spec.S_0 *= 1.10;
        this.pkBonus = (this.pkBonus || 0) + 0.12;
        this.leadStressMitigation = 0.50;
        this.leadEvasionBonus = 0.25;
        break;
      case 'MULTIROLE':
        this.spec.hp = (this.spec.hp || 4) + 2;
        this.turnBonus = (this.turnBonus || 0) + 0.20;
        this.datalinkBonus = (this.datalinkBonus || 0) + 0.20;
        this.hasFastRTB = true;
        this.leadExtraCm = 3;
        this.leadEvasionBonus = 0.25;
        break;
      case 'STRIKE':
        this.spec.hp = (this.spec.hp || 4) + 3;
        this.heavyLeadDragMitigation = 0.40;
        this.autocannonResistance = 0.60;
        this.missileDamageReduction = 1;
        this.leadEvasionBonus = 0.15;
        break;
      case 'EW':
        this.spec.hp = (this.spec.hp || 4) + 2;
        this.jamEfficiency = Math.min(0.95, (this.jamEfficiency || 0.45) + 0.25);
        this.hasESM = true;
        this.leadExtraCm = 3;
        this.leadEvasionBonus = 0.30;
        break;
      case 'DRONES':
        this.spec.hp = (this.spec.hp || 2) + 2;
        this.droneDodgeBonus = (this.droneDodgeBonus || 0) + 0.20;
        this.hasMaldDecoy = true;
        this.maldDecoyCharges = (this.maldDecoyCharges || 0) + 2;
        this.pkBonus = (this.pkBonus || 0) + 0.12;
        this.leadEvasionBonus = 0.35;
        break;
      case 'EXPERIMENTAL':
      default:
        this.spec.hp = (this.spec.hp || 4) + 2;
        this.coffinDodgeBonus = (this.coffinDodgeBonus || 0) + 0.15;
        this.datalinkBonus = (this.datalinkBonus || 0) + 0.30;
        this.thermalBloom = 0.60;
        this.leadEvasionBonus = 0.30;
        break;
    }
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

  deployDecoyDrone() {
    if (!this.hasMaldDecoy || this.maldDecoyCharges <= 0) return null;
    this.maldDecoyCharges--;
    const drone = new DecoyDrone(this, this.heading);
    if (window.Game && window.Game.simulation) window.Game.simulation.decoyDrones.push(drone);
    if (window.Game && window.Game.radar) {
      window.Game.radar.spawnCombatText(this.x, this.y, 'MALD DECOY LAUNCHED', '#c084fc');
      window.Game.radar.spawnShockwave(this.x, this.y, '#c084fc', 28);
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    return drone;
  }

  steerLeft(dt) {
    if (this.hp <= 0 || this.glocTimer > 0) return;
    let agi = (this.spec ? this.spec.AGI_0 : 0.85) * (this.thrustVector ? 1.25 : 1.0);
    if (this.stress >= 0.65 && !this.isCoffin && !this.spec.isDrone) agi *= 0.70;
    this.heading -= agi * 1.8 * dt;
    while (this.heading < 0) this.heading += Math.PI * 2;
    this.applyActionStress(0.05 * dt);
  }

  steerRight(dt) {
    if (this.hp <= 0 || this.glocTimer > 0) return;
    let agi = (this.spec ? this.spec.AGI_0 : 0.85) * (this.thrustVector ? 1.25 : 1.0);
    if (this.stress >= 0.65 && !this.isCoffin && !this.spec.isDrone) agi *= 0.70;
    this.heading += agi * 1.8 * dt;
    while (this.heading >= Math.PI * 2) this.heading -= Math.PI * 2;
    this.applyActionStress(0.05 * dt);
  }

  setGun(gunId) {
    const gunCatalog = window.AUTOCANNONS_CATALOG || {};
    if (!gunCatalog[gunId] || (this.spec.allowedGuns && !this.spec.allowedGuns.includes(gunId))) return false;
    this.gun = gunCatalog[gunId];
    this.gunAmmo = this.gun.defaultAmmo || 3200;
    this.recalculateWeight();
    return true;
  }

  installUpgrade(upgradeId) {
    if (this.equippedUpgrades.length >= this.upgradeSockets || this.equippedUpgrades.includes(upgradeId)) return false;
    const upg = (window.UPGRADES_CATALOG || {})[upgradeId];
    if (!upg || (upg.isAllowed && !upg.isAllowed(this.spec))) return false;
    const hasCat = this.equippedUpgrades.some(id => ((window.UPGRADES_CATALOG || {})[id] || {}).category === upg.category);
    if (hasCat) return false;
    this.equippedUpgrades.push(upgradeId);
    upg.apply(this);
    if (upgradeId === 'DAS_360_OPTIC') this.hasDAS = true;
    if (upgradeId === 'EOTS_DUAL_OPTICS') this.hasIRST = true;
    this.recalculateWeight();
    return true;
  }

  installWeapon(weaponId) {
    const wpn = (window.WEAPONS_CATALOG || {})[weaponId];
    if (!wpn || (this.getUsedSlots() + wpn.slots > this.totalSlots)) return false;
    const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
    if (ratings.indexOf(wpn.minRating) > ratings.indexOf(this.maxPylonRating)) return false;
    if (wpn.allowedAirframes && !wpn.allowedAirframes.includes(this.spec.id)) return false;

    this.equippedWeapons.push({ id: wpn.id, weapon: wpn, ammo: wpn.ammoCount || 4, maxAmmo: wpn.ammoCount || 4 });
    if (wpn.isJammerPod) this.jamEfficiency = Math.max(this.jamEfficiency, wpn.jamEfficiency || 0.45);
    if (wpn.isDecoyDrone) {
      this.hasMaldDecoy = true;
      this.maldDecoyCharges = (this.maldDecoyCharges || 0) + (wpn.ammoCount || 2);
    }
    this.recalculateWeight();
    return true;
  }

  getUsedSlots() {
    return this.equippedWeapons.reduce((sum, item) => sum + (item.weapon ? item.weapon.slots : 0), 0);
  }

  recalculateWeight() {
    let mass = this.gun ? Number(this.gun.mass || 100) : 100;
    let extraRcs = 0;
    const upgCatalog = window.UPGRADES_CATALOG || {};
    for (const item of this.equippedWeapons) {
      if (item && item.weapon) { mass += Number(item.weapon.mass || 0); extraRcs += Number(item.weapon.sigmaPylon || 0); }
    }
    for (const upgId of this.equippedUpgrades) {
      const upg = upgCatalog[upgId];
      if (upg) mass += Number(upg.mass || 0);
    }
    const maxMass = (this.spec && this.spec.M_max > 0) ? this.spec.M_max : 5000;
    let effectiveWr = Math.min(1.0, mass / maxMass);
    if (this.heavyLeadDragMitigation) effectiveWr = Math.max(0, effectiveWr - this.heavyLeadDragMitigation);
    this.Wr = effectiveWr;

    this.effectiveRcs = Number(this.spec ? (this.spec.sigma_0 || 1.0) : 1.0) + extraRcs;
    const baseSpeed = Number(this.spec ? (this.spec.S_0 || 0.95) : 0.95);
    this.effectiveMaxSpeed = baseSpeed * (1.0 - 0.22 * this.Wr);
    let baseAccel = 0.24 + (this.accelBonus || 0);
    this.effectiveAcceleration = baseAccel / (1.0 + 0.70 * this.Wr);
  }

  deployCountermeasures() {
    const count = (this.chaff !== undefined) ? this.chaff : (this.countermeasures || 0);
    if (count > 0 && this.cmTimer <= 0) {
      this.chaff = count - 1;
      this.countermeasures = count - 1;
      this.chaffFlares = count - 1;
      this.cmTimer = 3.0;
      this.applyActionStress(0.08);
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      return true;
    }
    return false;
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
    this.applyActionStress(0.12);
  }

  zoomClimb() {
    const cfg = window.CONFIG || {};
    if (this.speed <= 0.40) return false;
    this.targetAltFt = Math.min(cfg.MAX_ALT_FT || 65000, this.altFt + (cfg.ZOOM_ALT_GAIN_FT || 8500));
    this.speed = Math.max(0.25, this.speed - (cfg.ZOOM_SPEED_COST_MACH || 0.28));
    this.applyActionStress(0.12);
    return true;
  }

  orderRTB() { this.isRTB = true; this.targetAltFt = 36000; this.engineAlpha = 1.0; }
  cancelRTB() { this.isRTB = false; this.rtbTimer = 0.0; this.targetAltFt = this.altFt; this.vsiFpm = 0; this.engineAlpha = 0.60; }
  toggleRTB() { if (this.isRTB) { this.cancelRTB(); return false; } else { this.orderRTB(); return true; } }

  processRTB(dt) {
    const mapW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const corridorX = (window.CONFIG && window.CONFIG.RTB_CORRIDOR_X_KM) || 32.0;
    const isBlue = (this.team === 'friendly');
    const targetX = isBlue ? corridorX : (mapW - corridorX);
    const inSanctuary = isBlue ? (this.x <= targetX) : (this.x >= targetX);

    if (!inSanctuary) {
      const baseHeading = isBlue ? Math.PI : 0.0;
      let diff = baseHeading - this.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.heading += Math.max(-1.8 * dt, Math.min(1.8 * dt, diff));
      this.engineAlpha = 1.0;
      this.speed = Math.min(this.effectiveMaxSpeed * 1.35, this.speed + 0.20 * dt);
    } else {
      this.rtbTimer += dt;
      const dur = this.hasFastRTB ? 1.0 : ((window.CONFIG && window.CONFIG.RTB_REARM_DURATION_SEC) || 2.0);
      if (this.rtbTimer >= dur) {
        this.rearmStandardPackage();
        this.isRTB = false;
        this.rtbTimer = 0.0;
        this.heading = isBlue ? 0.0 : Math.PI;
        this.engineAlpha = 0.70;
        if (window.Game && window.Game.radar) {
          window.Game.radar.spawnCombatText(this.x, this.y, 'RE-ARMED & REFUELED', isBlue ? '#00f5a0' : '#ef4444');
        }
      }
    }
  }

  rearmStandardPackage() {
    const baseCm = this.isAce ? 8 : (this.isFlightLead ? (this.leadExtraCm ? 4 + this.leadExtraCm : 6) : 4);
    this.chaff = baseCm;
    this.countermeasures = baseCm;
    this.chaffFlares = baseCm;
    this.gunAmmo = (this.gun && this.gun.defaultAmmo) ? this.gun.defaultAmmo : 3200;
    for (const item of this.equippedWeapons) item.ammo = item.maxAmmo || item.ammo;
    if (this.hasMaldDecoy) this.maldDecoyCharges = 2;
    if (this.equippedWeapons.length === 0) {
      this.installWeapon('AIM-120D');
      this.installWeapon('AIM-9X-2');
    }
    this.recalculateWeight();
  }

  update(dt, incomingMissiles) {
    if (this.hp <= 0) return;
    if (this.isRTB) this.processRTB(dt);
    if (this.glocTimer > 0) {
      this.glocTimer -= dt;
      if (this.glocTimer <= 0) this.stress = 0.40;
    }
    if (this.activeManeuverTimer > 0) {
      this.activeManeuverTimer -= dt;
      if (this.activeManeuverTimer <= 0) { this.activeManeuverBonus = 0.0; this.isNotching = false; }
    }
    if (this.cmTimer > 0) this.cmTimer -= dt;
    if (this.gunCooldown > 0) this.gunCooldown -= dt;
    if (!this.spec.isDrone && !this.isCoffin && this.stress > 0) {
      this.stress = Math.max(0.0, this.stress - 0.06 * dt);
    }

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

  updateAutomaticGun(dt, enemiesList, radarRenderer) {
    if (this.hp <= 0 || this.gunAmmo <= 0 || this.gunCooldown > 0) return;
    const commanderTeam = (window.Game && window.Game.currentPvpCommander) || 'friendly';
    if (this.team === commanderTeam) return;

    const maxRange = (this.gun && this.gun.rangeKm) ? this.gun.rangeKm : 4.8;
    const maxConeRad = ((this.gun && this.gun.coneAngleDeg ? this.gun.coneAngleDeg : 45) / 2.0) * (Math.PI / 180.0);

    for (const enemy of enemiesList) {
      if (!enemy || enemy.hp <= 0 || enemy.isCivilian) continue;
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist <= maxRange) {
        let angleDiff = Math.abs(this.heading - Math.atan2(enemy.y - this.y, enemy.x - this.x));
        while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

        if (angleDiff < maxConeRad) {
          let rawDmg = (this.gun.damagePerSec || 2.4) * 0.35;
          if (enemy.spec && enemy.spec.category === 'STRIKE') rawDmg *= 0.50;
          if (enemy.isFlightLead && enemy.autocannonResistance) rawDmg *= (1.0 - enemy.autocannonResistance);
          if (this.stress >= 0.65 && !this.isCoffin && !this.spec.isDrone) rawDmg *= 0.75;
          enemy.hp = Math.max(0, enemy.hp - rawDmg);
          this.gunAmmo = Math.max(0, this.gunAmmo - 20);
          this.gunCooldown = (window.CONFIG && window.CONFIG.AUTO_GUN_COOLDOWN) || 0.35;

          if (radarRenderer) {
            radarRenderer.spawnGunTracer(this.x, this.y, enemy.x, enemy.y, '#ef4444');
            radarRenderer.spawnCombatText(enemy.x, enemy.y, `GUN -${rawDmg.toFixed(1)}HP`, '#ef4444');
          }
          if (typeof AudioSys !== 'undefined') AudioSys.playGunBurst();
          if (enemy.hp <= 0 && window.Game && window.Game.simulation) {
            window.Game.simulation.recordKillEvent(this.team, enemy, this, { weapon: this.gun || { name: 'Autocannon' }, isSalvo: false, salvoCount: 1 });
          }
          break;
        }
      }
    }
  }
}

window.Aircraft = Aircraft;