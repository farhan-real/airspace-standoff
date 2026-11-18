/**
 * js/systems/entities/surface.js - Surface air-defense batteries, radars, multi-segment runways, and facilities.
 */

class SurfaceUnit {
  constructor(type, team, x, y, options = {}) {
    if (!type) throw new Error('SurfaceUnit requires an installation type identifier.');
    if (team !== 'friendly' && team !== 'hostile') throw new Error(`Invalid team "${team}" for SurfaceUnit.`);
    if (typeof x !== 'number' || isNaN(x) || typeof y !== 'number' || isNaN(y)) {
      throw new Error(`Invalid coordinates (${x}, ${y}) for SurfaceUnit "${type}".`);
    }
    if (!window.GROUND_UNITS_CATALOG) throw new Error('GROUND_UNITS_CATALOG is not loaded.');
    const spec = window.GROUND_UNITS_CATALOG[type];
    if (!spec) throw new Error(`Unknown SurfaceUnit installation type: "${type}".`);

    const requiredFields = ['name', 'category', 'armorClass', 'hp', 'rangeKm', 'vpValue', 'desc'];
    for (const field of requiredFields) {
      if (spec[field] === undefined || spec[field] === null) {
        throw new Error(`Ground specification "${type}" is missing required field "${field}".`);
      }
    }
    if ((spec.canAttack || spec.canInterceptMissiles) && typeof spec.cooldownMax !== 'number') {
      throw new Error(`Combat surface spec "${type}" requires numeric cooldownMax.`);
    }
    if (spec.canInterceptMissiles && typeof spec.interceptAccuracy !== 'number') {
      throw new Error(`Point-defense surface spec "${type}" requires numeric interceptAccuracy.`);
    }

    this.id = 'SURF_' + Math.random().toString(36).substr(2, 6);
    this.type = type;
    this.spec = spec;
    this.team = team;
    this.x = x;
    this.y = y;
    this.alt = 0.0;
    this.heading = options.heading !== undefined ? options.heading : ((team === 'friendly') ? 0.0 : Math.PI);

    this.name = (team === 'friendly' && type === 'S-400') ? 'Patriot / S-400 SAM' :
                (team === 'friendly' && type === 'PANTSIR') ? 'Phalanx CIWS' :
                (team === 'friendly' && type === 'EW_JAMMER') ? 'Allied EW Jammer Station' :
                (team === 'friendly' && type === 'FUEL_DEPOT') ? 'Allied Fuel Farm' :
                (team === 'friendly' && type === 'RADAR_VAN') ? 'Allied Mobile Radar' :
                (options.customName || spec.name);

    this.category = spec.category;
    this.armorClass = spec.armorClass;
    this.hp = (options.hp !== undefined) ? options.hp : spec.hp;
    if (typeof this.hp !== 'number' || isNaN(this.hp) || this.hp <= 0) {
      throw new Error(`Invalid HP (${this.hp}) for SurfaceUnit "${type}".`);
    }
    this.maxHp = this.hp;
    this.rangeKm = spec.rangeKm;
    this.cooldownMax = spec.cooldownMax !== undefined ? spec.cooldownMax : 999.0;
    this.fireCooldown = Math.random() * 1.5;

    this.canAttack = Boolean(spec.canAttack);
    this.canInterceptMissiles = Boolean(spec.canInterceptMissiles);
    this.interceptAccuracy = spec.interceptAccuracy !== undefined ? spec.interceptAccuracy : 0.0;
    this.isAaaGun = Boolean(spec.isAaaGun);
    this.aaaRangeKm = spec.aaaRangeKm !== undefined ? spec.aaaRangeKm : (this.isAaaGun ? this.rangeKm : 0.0);
    this.aaaMaxAltFt = spec.aaaMaxAltFt !== undefined ? spec.aaaMaxAltFt : 15000;
    this.aaaDamage = spec.aaaDamage !== undefined ? spec.aaaDamage : 1.0;

    this.minAltFt = spec.minAltFt !== undefined ? spec.minAltFt : 1000;
    this.cuedMinAltFt = spec.cuedMinAltFt !== undefined ? spec.cuedMinAltFt : this.minAltFt;
    this.requiresEwCue = Boolean(spec.requiresEwCue);
    this.counterStealthMult = spec.counterStealthMult !== undefined ? spec.counterStealthMult : 1.0;
    this.lowAltCueBonus = Boolean(spec.lowAltCueBonus);

    this.isCivilian = false;
    this.isJammerStation = Boolean(spec.isJammerStation);
    this.baseJamEfficiency = spec.jamEfficiency !== undefined ? spec.jamEfficiency : 0.0;
    this.jamEfficiency = this.baseJamEfficiency;
    this.requiresPower = Boolean(spec.requiresPower);

    this.isIndestructible = Boolean(spec.isIndestructible);
    this.isEmitter = Boolean(spec.isEmitter);
    this.isPassiveElint = Boolean(spec.isPassiveElint);
    this.isCommsRelay = Boolean(spec.isCommsRelay);
    this.isCommandNode = Boolean(spec.isCommandNode);
    this.isGroundDecoy = Boolean(spec.isGroundDecoy);
    this.spoofsType = spec.spoofsType || 'S-400';

    this.isAirbaseRunway = Boolean(spec.isAirbaseRunway);
    this.isRunwaySegment = Boolean(spec.isRunwaySegment);
    this.isAircraftShelter = Boolean(spec.isAircraftShelter);
    this.isHangar = Boolean(spec.isHangar);
    this.isOpenField = Boolean(spec.isOpenField);
    this.isAircraftParking = Boolean(spec.isAircraftParking);
    this.airbaseId = options.airbaseId || null;
    this.segmentIndex = options.segmentIndex !== undefined ? options.segmentIndex : 0;
    this.totalSegments = options.totalSegments !== undefined ? options.totalSegments : 1;
    this.parkedAircraft = Array.isArray(options.parkedAircraft) ? options.parkedAircraft : [];

    this.isFuelDepot = Boolean(spec.isFuelDepot);
    this.isMunitionDepot = Boolean(spec.isMunitionDepot);
    this.isPowerNode = Boolean(spec.isPowerNode);
    this.secondaryBlastRadiusKm = spec.secondaryBlastRadiusKm !== undefined ? spec.secondaryBlastRadiusKm : 0.0;
    this.secondaryBlastDamage = spec.secondaryBlastDamage !== undefined ? spec.secondaryBlastDamage : 0.0;

    this.isPrimaryObjective = Boolean(options.isPrimaryObjective);
    this.vpValue = spec.vpValue;
    this.desc = spec.desc;
    this.missileSpec = spec.missileSpec || null;

    this.emconTimer = 0.0;
    this.hasEmitted = false;
    this.isRevealedToBlue = (team === 'friendly') || !spec.concealedUntilActive || Boolean(options.preRevealed);
    this.identifiedByBlue = (team === 'friendly') || !spec.concealedUntilActive || Boolean(options.preRevealed);
    this.identifiedByRed = true;
    this.trackDurationBlue = this.identifiedByBlue ? 999.0 : 0.0;
  }

  isIdentifiedBy(team) {
    if (team !== 'friendly' && team !== 'hostile') throw new Error(`Invalid team "${team}" in SurfaceUnit.isIdentifiedBy.`);
    if (team === 'hostile') return true;
    return Boolean(this.identifiedByBlue);
  }

  get isIdentified() {
    const commander = window.Game ? window.Game.currentPvpCommander : 'friendly';
    return this.isIdentifiedBy(commander);
  }

  set isIdentified(val) {
    this.identifiedByBlue = Boolean(val);
    if (val) this.isRevealedToBlue = true;
  }

  takeDamage(amount, isBunkerCracker = false, weaponSpec = null) {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      throw new Error(`Invalid damage amount (${amount}) applied to SurfaceUnit "${this.id}".`);
    }
    if (this.isIndestructible) {
      if (window.Game && window.Game.radar) window.Game.radar.spawnCombatText(this.x, this.y, 'DEPOT INDESTRUCTIBLE', '#00f5a0');
      return;
    }

    let mult = 1.0;
    const apRating = (weaponSpec && typeof weaponSpec.armorPiercing === 'number') ? weaponSpec.armorPiercing : 0;
    const isAntiRunway = Boolean(weaponSpec && weaponSpec.isAntiRunway);

    if (isAntiRunway && this.isAirbaseRunway) {
      mult = 2.0;
    } else if (this.armorClass === 'FORTIFIED') {
      if (isBunkerCracker) mult = 1.0;
      else if (apRating >= 0.65) mult = 0.50;
      else mult = 0.20;
      if (mult < 1.0 && window.Game && window.Game.radar) {
        window.Game.radar.spawnCombatText(this.x, this.y, 'FORTIFIED ARMOR DEFLECT', '#fbbf24');
      }
    } else if (this.armorClass === 'ARMORED') {
      if (isBunkerCracker || apRating >= 0.70 || (weaponSpec && (weaponSpec.isAntiRadiation || (weaponSpec.category === 'A2G' && !weaponSpec.isCluster)))) {
        mult = 1.0;
      } else {
        mult = 0.65;
      }
    }

    const effectiveDamage = Math.max(0.1, amount * mult);
    const wasAlive = this.hp > 0.05;
    this.hp = Math.max(0, this.hp - effectiveDamage);
    if (this.hp <= 0.05) this.hp = 0;

    if (typeof AudioSys !== 'undefined') AudioSys.playExplosion(this.armorClass === 'FORTIFIED' || this.hp <= 0);

    if (wasAlive && this.hp <= 0) {
      if (this.secondaryBlastRadiusKm > 0) {
        if (typeof SurfaceCombatSystem === 'undefined') throw new Error('SurfaceCombatSystem is not loaded.');
        SurfaceCombatSystem.triggerSecondaryExplosion(this);
      }
      if (this.isAircraftParking) {
        if (typeof AirbaseSystem === 'undefined') throw new Error('AirbaseSystem is not loaded.');
        AirbaseSystem.onParkingDestroyed(this);
      }
    }
  }

  update(dt, enemyAircraftList, enemyMissilesList, spawnedMissiles, radarArrayActive) {
    if (typeof SurfaceCombatSystem === 'undefined') throw new Error('SurfaceCombatSystem is not loaded.');
    SurfaceCombatSystem.updateUnit(this, dt, enemyAircraftList, enemyMissilesList, spawnedMissiles, radarArrayActive);
  }
}

window.SurfaceUnit = SurfaceUnit;
