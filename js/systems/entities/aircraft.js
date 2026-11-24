/**
 * js/systems/entities/aircraft.js - Aircraft entity core constructor and state initialization.
 */

class Aircraft {
  constructor(specId, team, spawnX, spawnY, heading, chosenGunId, callsign, squadronName, isFlightLead = false, isAce = false, spawnAltFt = null) {
    if (!window.AIRCRAFT_CATALOG) throw new Error('AIRCRAFT_CATALOG is not loaded.');
    const baseSpec = window.AIRCRAFT_CATALOG[specId];
    if (!baseSpec) throw new Error(`Aircraft specification "${specId}" not found in AIRCRAFT_CATALOG.`);

    const requiredFields = [
      'id', 'name', 'category', 'cost', 'hp', 'AGI_0', 'S_0', 'sOpt', 'R_0',
      'radarType', 'radarConeDeg', 'lookDownBonus', 'sigma_0', 'beamSpike',
      'thermalBloom', 'M_max', 'G_limit', 'internalSlots', 'externalSlots',
      'hasCenterline', 'centerlineSlots', 'totalSlots', 'maxPylonRating', 'upgradeSockets', 'builtInGun'
    ];
    for (const field of requiredFields) {
      if (baseSpec[field] === undefined || baseSpec[field] === null) {
        throw new Error(`Specification "${specId}" is missing required property: "${field}".`);
      }
    }
    if (team !== 'friendly' && team !== 'hostile') throw new Error(`Invalid team "${team}" for aircraft "${specId}".`);
    if (typeof spawnX !== 'number' || isNaN(spawnX) || typeof spawnY !== 'number' || isNaN(spawnY)) {
      throw new Error(`Invalid spawn coordinates (${spawnX}, ${spawnY}) for aircraft "${specId}".`);
    }
    if (typeof heading !== 'number' || isNaN(heading)) throw new Error(`Invalid heading (${heading}) for aircraft "${specId}".`);
    if (!callsign || !callsign.trim()) throw new Error(`Aircraft "${specId}" requires an assigned callsign.`);
    if (!squadronName || !squadronName.trim()) throw new Error(`Aircraft "${specId}" requires an assigned squadron name.`);

    this.id = 'AC_' + Math.random().toString(36).substr(2, 6);
    this.spec = JSON.parse(JSON.stringify(baseSpec));
    this.team = team;
    this.x = spawnX;
    this.y = spawnY;
    this.heading = heading;
    this.isAce = Boolean(isAce);
    this.isFlightLead = Boolean(isFlightLead);
    const isEW = (this.spec.category === 'EW' || this.spec.isEW);
    this.tacticalRole = isEW ? 'SEAD' : (this.spec.category === 'STRIKE' ? 'STRIKE' : 'SWEEP');
    this.callsign = callsign.trim();
    this.squadronName = squadronName.trim();

    const minAlt = window.CONFIG.MIN_ALT_FT, maxAlt = window.CONFIG.MAX_ALT_FT;
    this.altFt = (typeof spawnAltFt === 'number' && !isNaN(spawnAltFt))
      ? Math.max(minAlt, Math.min(maxAlt, spawnAltFt)) : (this.spec.id === 'DARKSTAR' ? 58000 : 30000);
    this.targetAltFt = this.altFt;
    this.vsiFpm = 0;
    this.alt = this.altFt / maxAlt;
    this.prevAltFt = this.altFt;
    this.altTrend = '--';

    this.engineAlpha = 0.50;
    this.effectiveMaxSpeed = this.spec.S_0;
    this.effectiveAcceleration = 0.24;
    this.speed = 0.70;
    this.prevSpeed = this.speed;
    this.speedTrend = '--';
    this.energy = 1.0;
    this.Wr = 0.0;
    this.maxPayloadMass = this.spec.M_max;
    this.effectiveRcs = this.spec.sigma_0;

    this.baseThermalBloom = this.spec.thermalBloom;
    this.thermalBloom = this.baseThermalBloom;
    this.thermalBloomTimer = 0.0;
    this.aceEvasionBonus = 0.0;
    this.leadStressMitigation = 1.0;
    this.autocannonResistance = 0.0;
    this.leadEvasionBonus = 0.0;
    this.missileDamageReduction = 0;
    this.leadExtraCm = 0;
    this.heavyLeadDragMitigation = 0.0;
    this.datalinkBonus = 0.0;
    this.hasFastRTB = false;
    this.beamSpikeReduction = 0.0;
    this.irPenalty = 0.0;
    this.hasECCM = false;
    this.eccmBonus = 0.0;
    this.accelBonus = 0.0;
    this.dragMitigation = 0.0;
    this.radarIdentifySpeed = 1.0;
    this.hasGaNAESA = false;
    this.dasEvasion = 0.0;
    this.stressTurnMultiplier = 1.0;
    this.hasZoeCore = false;
    this.aiReactionBonus = 0.0;
    this.pkBonus = 0.0;
    this.turnBonus = 0.0;
    this.droneDodgeBonus = 0.0;

    this.hasTfrMasking = false;
    this.tfrFloorBonusFt = 0;
    this.lowAltStealthMult = 1.0;
    this.ccipBonus = 0.0;
    this.bombRangeBonus = 1.0;
    this.hasHtsPod = false;
    this.armRangeMult = 1.0;
    this.armPkBonus = 0.0;
    this.pylonDragRelief = 0.0;
    this.aaaResistance = typeof this.spec.aaaResistance === 'number' ? this.spec.aaaResistance : 0.0;
    this.mitlBonus = 0.0;
    this.dircmEvasion = typeof this.spec.dircmEvasion === 'number' ? this.spec.dircmEvasion : 0.0;

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

    const baseCm = this.isAce ? 6 : (this.isFlightLead ? (4 + this.leadExtraCm) : 4);
    this.chaff = baseCm;
    this.countermeasures = baseCm;
    this.chaffFlares = baseCm;
    this.cmTimer = 0.0;

    if (!window.AUTOCANNONS_CATALOG) throw new Error('AUTOCANNONS_CATALOG is not loaded.');
    const effectiveGunId = chosenGunId || this.spec.builtInGun;
    const gunDef = window.AUTOCANNONS_CATALOG[effectiveGunId];
    if (!gunDef) throw new Error(`Gun "${effectiveGunId}" not found in AUTOCANNONS_CATALOG.`);
    this.gun = gunDef;
    this.gunAmmo = gunDef.defaultAmmo;
    this.gunCooldown = 0.0;

    this.radarLockedTarget = null;
    this.internalSlots = this.spec.internalSlots;
    this.externalSlots = this.spec.externalSlots;
    this.hasCenterline = Boolean(this.spec.hasCenterline);
    this.centerlineSlots = this.spec.centerlineSlots;
    this.totalSlots = this.spec.totalSlots;
    this.maxPylonRating = this.spec.maxPylonRating;
    this.upgradeSockets = this.spec.upgradeSockets;
    this.equippedWeapons = [];
    this.equippedUpgrades = [];

    const is2P = Boolean(window.Game && window.Game.playerMode === '2P');
    const isPlayerTeam = (team === 'friendly' || is2P);
    this.isCoffin = Boolean(this.spec.isCoffin);
    this.isAutonomous = (!isPlayerTeam && this.spec.isDrone && !this.isCoffin);
    this.autonomousOverride = isPlayerTeam;
    this.coffinDodgeBonus = this.isCoffin ? this.spec.coffinDodgeBonus : 0.0;

    this.isRTB = false;
    this.rtbTimer = 0.0;
    this.groundPhase = null;
    this.hasMaldDecoy = false;
    this.maldDecoyCharges = 0;
    this.targetingPodBonus = 0.0;
    this.targetingSpotRangeKm = 0.0;
    this.cloudMitigation = 0.0;
    this.a2aPkBonus = 0.0;
    this.irstRangeKm = 0.0;
    this.hasDatalinkRelay = false;
    this.distanceTraveled = 0.0;
    this.flightHistory = [];
    this.historySampleTimer = 0.0;
    this.totalProcurementCost = this.spec.cost;

    this.trackDurationBlue = (team === 'friendly' || is2P) ? 999.0 : 0.0;
    this.trackDurationRed = (team === 'hostile' || is2P) ? 999.0 : 0.0;
    this.identifiedByBlue = (team === 'friendly' || is2P);
    this.identifiedByRed = (team === 'hostile' || is2P);
    this.everIdentifiedByBlue = (team === 'friendly' || is2P);
    this.everIdentifiedByRed = (team === 'hostile' || is2P);
    this.activelyTrackedByBlue = (team === 'friendly' || is2P);
    this.activelyTrackedByRed = (team === 'hostile' || is2P);
    this.trackDecayBlue = (team === 'friendly' || is2P) ? window.CONFIG.RADAR_TRACK_DECAY_SEC : 0.0;
    this.trackDecayRed = (team === 'hostile' || is2P) ? window.CONFIG.RADAR_TRACK_DECAY_SEC : 0.0;

    this.kills = 0;
    this.scorePoints = 0;
    this.missilesLaunchedCount = 0;
    this.missilesEvadedCount = 0;
    this.firstDetectedTime = null;

    this.thrustVector = Boolean(this.spec.thrustVector);
    this.hasIRST = false;
    this.hasDAS = false;
    this.hasESM = Boolean(this.spec.hasESM);
    this.immuneJamming = false;
    this.jamEfficiency = typeof this.spec.jamEfficiency === 'number' ? this.spec.jamEfficiency : 0.0;
    this.maxJamRangeKm = this.jamEfficiency > 0 ? 90.0 : 0.0;
    this.glocThreshold = (this.spec.isDrone || this.isCoffin) ? 999.0 : 0.95;

    this.recalculateWeight();
    this.speed = this.getTargetMach();
    this.prevSpeed = this.speed;
  }

  takeDamage(amount) {
    if (this.hp <= 0.05) { this.hp = 0; return 0; }
    const damageDealt = Math.max(0, Number(amount) || 0);
    this.hp = Math.max(0, this.hp - damageDealt);
    if (this.hp <= 0.05) this.hp = 0;
    return damageDealt;
  }

  isIdentifiedBy(team) {
    if (team !== 'friendly' && team !== 'hostile') throw new Error(`Invalid team "${team}" in isIdentifiedBy.`);
    if (window.Game && window.Game.playerMode === '2P') return true;
    if (this.team === team) return true;
    return (team === 'friendly') ? Boolean(this.identifiedByBlue) : Boolean(this.identifiedByRed);
  }

  isActivelyTrackedBy(team) {
    if (team !== 'friendly' && team !== 'hostile') throw new Error(`Invalid team "${team}" in isActivelyTrackedBy.`);
    if (window.Game && window.Game.playerMode === '2P') return true;
    if (this.team === team) return true;
    return (team === 'friendly') ? Boolean(this.activelyTrackedByBlue) : Boolean(this.activelyTrackedByRed);
  }

  everIdentifiedBy(team) {
    if (team !== 'friendly' && team !== 'hostile') throw new Error(`Invalid team "${team}" in everIdentifiedBy.`);
    if (window.Game && window.Game.playerMode === '2P') return true;
    if (this.team === team) return true;
    return (team === 'friendly') ? Boolean(this.everIdentifiedByBlue) : Boolean(this.everIdentifiedByRed);
  }

  getTrackState(team) {
    if (team !== 'friendly' && team !== 'hostile') throw new Error(`Invalid team "${team}" in getTrackState.`);
    if (window.Game && window.Game.playerMode === '2P') return 'TRACKED';
    if (this.team === team) return 'TRACKED';
    const isId = (team === 'friendly') ? Boolean(this.identifiedByBlue) : Boolean(this.identifiedByRed);
    const active = (team === 'friendly') ? Boolean(this.activelyTrackedByBlue) : Boolean(this.activelyTrackedByRed);
    const everId = (team === 'friendly') ? Boolean(this.everIdentifiedByBlue) : Boolean(this.everIdentifiedByRed);
    if (isId) return active ? 'TRACKED' : 'DECAYING';
    if (everId) return 'STALE';
    return 'BOGEY';
  }

  get isIdentified() {
    if (window.Game && window.Game.playerMode === '2P') return true;
    const commander = window.Game ? window.Game.currentPvpCommander : 'friendly';
    return this.isIdentifiedBy(commander);
  }

  set isIdentified(val) {
    const commander = window.Game ? window.Game.currentPvpCommander : 'friendly';
    if (commander === 'friendly') this.identifiedByBlue = Boolean(val);
    else this.identifiedByRed = Boolean(val);
  }
}

window.Aircraft = Aircraft;
