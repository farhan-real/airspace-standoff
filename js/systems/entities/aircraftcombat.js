/**
 * js/systems/entities/aircraftcombat.js - Aircraft combat actions, stores management, and live kinematics updates.
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

Aircraft.prototype.deployDecoyDrone = function() {
  if (!this.hasMaldDecoy || this.maldDecoyCharges <= 0) return null;
  this.maldDecoyCharges--;
  const drone = new DecoyDrone(this, this.heading);
  if (window.Game && window.Game.simulation) window.Game.simulation.decoyDrones.push(drone);
  if (window.Game && window.Game.inspection && window.Game.inspection.enabled) {
    window.Game.inspection.recordEvent('DECOY DEPLOYED', `${formatAircraftDisplayName(this)} launched MALD decoy drone`, this, drone, {
      remainingCharges: this.maldDecoyCharges, mirroredRcs: drone.effectiveRcs, speedMach: drone.speed
    });
  }
  if (window.Game && window.Game.radar) {
    window.Game.radar.spawnCombatText(this.x, this.y, 'MALD DECOY LAUNCHED', '#c084fc');
    window.Game.radar.spawnShockwave(this.x, this.y, '#c084fc', 28);
  }
  if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  return drone;
};

Aircraft.prototype.setGun = function(gunId) {
  if (!window.AUTOCANNONS_CATALOG) throw new Error('AUTOCANNONS_CATALOG is not loaded.');
  const gun = window.AUTOCANNONS_CATALOG[gunId];
  if (!gun) throw new Error(`Gun "${gunId}" does not exist in AUTOCANNONS_CATALOG.`);
  if (!window.AircraftRegistry.isGunCompatible(this.spec, gun)) return false;
  this.gun = gun;
  this.gunAmmo = this.gun.defaultAmmo;
  this.recalculateWeight();
  return true;
};

Aircraft.prototype.installUpgrade = function(upgradeId) {
  if (this.equippedUpgrades.length >= this.upgradeSockets || this.equippedUpgrades.includes(upgradeId)) return false;
  if (!window.UPGRADES_CATALOG) throw new Error('UPGRADES_CATALOG is not loaded.');
  const upg = window.UPGRADES_CATALOG[upgradeId];
  if (!upg) throw new Error(`Upgrade "${upgradeId}" does not exist in UPGRADES_CATALOG.`);
  if (upg.isAllowed && !upg.isAllowed(this.spec)) return false;
  this.equippedUpgrades.push(upgradeId);
  upg.apply(this);
  if (upgradeId === 'DAS_360_OPTIC') this.hasDAS = true;
  if (upgradeId === 'EOTS_DUAL_OPTICS') this.hasIRST = true;
  this.recalculateWeight();
  return true;
};

Aircraft.prototype.getUsedInternalSlots = function() { return this.equippedWeapons.reduce((sum, item) => sum + (item.station === 'INTERNAL' ? item.weapon.slots : 0), 0); };
Aircraft.prototype.getUsedExternalSlots = function() { return this.equippedWeapons.reduce((sum, item) => sum + (item.station === 'EXTERNAL' ? item.weapon.slots : 0), 0); };
Aircraft.prototype.getUsedCenterlineSlots = function() { return this.equippedWeapons.reduce((sum, item) => sum + (item.station === 'CENTERLINE' ? item.weapon.slots : 0), 0); };
Aircraft.prototype.getUsedSlots = function() { return this.equippedWeapons.reduce((sum, item) => sum + item.weapon.slots, 0); };

Aircraft.prototype.installWeapon = function(weaponId, targetStation = null) {
  if (!window.WEAPONS_CATALOG) throw new Error('WEAPONS_CATALOG is not loaded.');
  const wpn = window.WEAPONS_CATALOG[weaponId];
  if (!wpn) throw new Error(`Weapon "${weaponId}" does not exist in WEAPONS_CATALOG.`);

  const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
  if (ratings.indexOf(wpn.minRating) > ratings.indexOf(this.maxPylonRating)) return false;
  if (wpn.allowedAirframes && !wpn.allowedAirframes.includes(this.spec.id)) return false;

  const wpnSlotType = wpn.slotType;
  let assignedStation = targetStation;

  if (wpnSlotType === 'CENTERLINE') {
    if (!this.hasCenterline || (this.getUsedCenterlineSlots() + wpn.slots > this.centerlineSlots)) return false;
    assignedStation = 'CENTERLINE';
  } else if (!assignedStation) {
    if (wpnSlotType === 'INTERNAL' && (this.getUsedInternalSlots() + wpn.slots <= this.internalSlots)) {
      assignedStation = 'INTERNAL';
    } else if (this.getUsedExternalSlots() + wpn.slots <= this.externalSlots) {
      assignedStation = 'EXTERNAL';
    } else if (this.hasCenterline && (this.getUsedCenterlineSlots() + wpn.slots <= this.centerlineSlots)) {
      assignedStation = 'CENTERLINE';
    } else {
      return false;
    }
  } else {
    if (assignedStation === 'INTERNAL') {
      if (wpnSlotType !== 'INTERNAL' || (this.getUsedInternalSlots() + wpn.slots > this.internalSlots)) return false;
    } else if (assignedStation === 'EXTERNAL') {
      if (wpnSlotType === 'CENTERLINE' || (this.getUsedExternalSlots() + wpn.slots > this.externalSlots)) return false;
    } else if (assignedStation === 'CENTERLINE') {
      if (!this.hasCenterline || (this.getUsedCenterlineSlots() + wpn.slots > this.centerlineSlots)) return false;
    }
  }

  const isPassivePod = Boolean(wpn.isJammerPod || wpn.isTargetingPod);
  const initialAmmo = isPassivePod ? 1 : wpn.ammoCount;
  if (!isPassivePod && typeof initialAmmo !== 'number') {
    throw new Error(`Weapon "${weaponId}" is missing numeric ammoCount.`);
  }

  this.equippedWeapons.push({
    id: wpn.id,
    weapon: wpn,
    station: assignedStation,
    ammo: initialAmmo,
    maxAmmo: initialAmmo,
    cooldown: 0.0
  });

  if (wpn.isJammerPod) this.jamEfficiency = Math.max(this.jamEfficiency, wpn.jamEfficiency);
  if (wpn.isTargetingPod) {
    this.targetingPodBonus = Math.max(this.targetingPodBonus, wpn.a2gPkBonus);
    if (wpn.exposesDecoys) this.targetingSpotRangeKm = Math.max(this.targetingSpotRangeKm, wpn.spotRangeKm);
    this.cloudMitigation = Math.max(this.cloudMitigation, wpn.cloudMitigation);
    if (wpn.grantsIRST) this.hasIRST = true;
    if (wpn.grantsESM) this.hasESM = true;
    if (wpn.armRangeBoost) this.armRangeMult = Math.max(this.armRangeMult, wpn.armRangeBoost);
  }
  if (wpn.isDecoyDrone) {
    this.hasMaldDecoy = true;
    this.maldDecoyCharges += initialAmmo;
  }

  this.recalculateWeight();
  return true;
};

Aircraft.prototype.recalculateWeight = function() {
  if (!window.UPGRADES_CATALOG) throw new Error('UPGRADES_CATALOG is not loaded.');
  let mass = this.gun.mass;
  let externalDragPenalty = 0;
  let extraRcs = 0;
  let weaponsCost = 0;

  for (const item of this.equippedWeapons) {
    const w = item.weapon;
    const isPassivePod = Boolean(w.isJammerPod || w.isTargetingPod);
    const isMounted = item.ammo > 0 || isPassivePod;
    const ammoFraction = isPassivePod ? 1 : (item.maxAmmo > 0 ? (item.ammo / item.maxAmmo) : 0);
    mass += w.mass * ammoFraction;
    weaponsCost += w.cost;

    if (item.station === 'CENTERLINE' && isMounted) {
      extraRcs += w.sigmaPylon;
      externalDragPenalty += 0.05 * ammoFraction;
    } else if (item.station !== 'INTERNAL' && isMounted) {
      extraRcs += w.sigmaPylon;
      externalDragPenalty += 0.02 * w.slots * ammoFraction;
    }
  }

  let upgradesCost = 0;
  for (const upgId of this.equippedUpgrades) {
    const upg = window.UPGRADES_CATALOG[upgId];
    if (!upg) throw new Error(`Equipped upgrade "${upgId}" does not exist in UPGRADES_CATALOG.`);
    mass += upg.mass;
    upgradesCost += upg.cost;
  }

  externalDragPenalty *= (1.0 - this.pylonDragRelief);
  this.totalProcurementCost = this.spec.cost + weaponsCost + upgradesCost;

  let effectiveWr = Math.min(1.0, mass / this.spec.M_max);
  effectiveWr = Math.max(0, effectiveWr * (1.0 - this.pylonDragRelief * 0.50) - this.heavyLeadDragMitigation);
  this.Wr = effectiveWr;

  let baseRcs = this.spec.sigma_0;
  if (this.isFlightLead && this.spec.category === 'STEALTH') baseRcs *= 0.65;
  if (this.equippedUpgrades.includes('RAM_NANO_COATING')) baseRcs *= 0.55;
  this.effectiveRcs = Math.max(0.00005, baseRcs + extraRcs);

  this.effectiveMaxSpeed = Math.max(0.35, this.spec.S_0 * (1.0 - 0.22 * this.Wr) - externalDragPenalty);
  this.effectiveAcceleration = (0.24 + this.accelBonus) / (1.0 + 0.70 * this.Wr);

  if (this.distanceTraveled === 0) {
    this.speed = this.getTargetMach();
    this.prevSpeed = this.speed;
    this.speedTrend = '--';
  }
};

Aircraft.prototype.deployCountermeasures = function() {
  if (this.chaff > 0 && this.cmTimer <= 0) {
    this.chaff -= 1;
    this.countermeasures = this.chaff;
    this.chaffFlares = this.chaff;
    this.cmTimer = 3.0;
    this.applyActionStress(0.08);
    const inspection = window.Game && window.Game.inspection;
    if (inspection && inspection.enabled) {
      inspection.recordEvent('COUNTERMEASURE', `${formatAircraftDisplayName(this)} deployed chaff`, this, null, {
        remainingChaff: this.chaff, activeWindowSec: this.cmTimer, stressAfterDeployment: this.stress,
        incomingMissiles: window.Game.missiles.filter(m => m.active && m.target && m.target.id === this.id).map(m => ({
          weapon: m.weapon.name, seeker: m.weapon.seeker, distanceKm: m.distanceToTarget
        }))
      });
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    return true;
  }
  return false;
};

Aircraft.prototype.processRTB = function(dt) {
  const mapW = window.CONFIG.THEATER_WIDTH_KM;
  const corridorX = window.CONFIG.RTB_CORRIDOR_X_KM;
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
    const dur = this.hasFastRTB ? 1.8 : window.CONFIG.RTB_REARM_DURATION_SEC;
    if (this.rtbTimer >= dur) {
      this.rearmStandardPackage();
      this.isRTB = false;
      this.rtbTimer = 0.0;
      this.heading = isBlue ? 0.0 : Math.PI;
      this.engineAlpha = 0.50;
      if (window.Game && window.Game.inspection && window.Game.inspection.enabled) {
        window.Game.inspection.recordEvent('RTB REARMED', `${formatAircraftDisplayName(this)} completed base repair & rearm`, this, null, {
          hpRestored: this.hp, gunAmmo: this.gunAmmo, fastTurnaround: Boolean(this.hasFastRTB)
        });
      }
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnCombatText(this.x, this.y, 'RE-ARMED & REPAIRED', isBlue ? '#00f5a0' : '#ef4444');
      }
    }
  }
};

Aircraft.prototype.rearmStandardPackage = function() {
  this.hp = this.maxHp;
  this.energy = 1.0;
  const baseCm = this.isAce ? 6 : (this.isFlightLead ? (4 + this.leadExtraCm) : 4);
  this.chaff = baseCm;
  this.countermeasures = baseCm;
  this.chaffFlares = baseCm;
  this.gunAmmo = this.gun.defaultAmmo;

  const isHumanControlled = (this.team === 'friendly') || (window.Game && window.Game.playerMode === '2P');
  if (isHumanControlled) {
    for (const item of this.equippedWeapons) {
      item.ammo = item.maxAmmo;
      item.cooldown = 0.0;
    }
    if (this.hasMaldDecoy) this.maldDecoyCharges = 2;
  } else {
    for (const item of this.equippedWeapons) {
      item.cooldown = 0.0;
      if (item.weapon.isLaser || item.weapon.category === 'GUN') {
        item.ammo = item.maxAmmo;
      }
    }
  }
  this.recalculateWeight();
};

Aircraft.prototype.updateAutomaticGun = function(dt, enemiesList, radarRenderer, surfaceTargets = null) {
  if (typeof CombatGunsSystem === 'undefined') throw new Error('CombatGunsSystem is not loaded.');
  CombatGunsSystem.updateAutomaticGun(this, dt, enemiesList, radarRenderer, surfaceTargets);
};
