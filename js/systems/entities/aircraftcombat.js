/**
 * AIRSPACE STANDOFF: Aircraft Combat Actions, Stores Management & Live Dynamics
 * Supports slot differentiation, real-time drag/RCS shedding, and trimmed cruise initialization.
 */

Aircraft.prototype.deployDecoyDrone = function() {
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
};

Aircraft.prototype.setGun = function(gunId) {
  const gunCatalog = window.AUTOCANNONS_CATALOG || {};
  const gun = gunCatalog[gunId];
  if (!gun) return false;
  const isComp = window.AircraftRegistry && typeof window.AircraftRegistry.isGunCompatible === 'function'
    ? window.AircraftRegistry.isGunCompatible(this.spec, gun)
    : (!this.spec.allowedGuns || this.spec.allowedGuns.includes(gunId));
  if (!isComp) return false;
  this.gun = gun;
  this.gunAmmo = this.gun.defaultAmmo || 500;
  this.recalculateWeight();
  return true;
};

Aircraft.prototype.installUpgrade = function(upgradeId) {
  if (this.equippedUpgrades.length >= this.upgradeSockets || this.equippedUpgrades.includes(upgradeId)) return false;
  const upg = (window.UPGRADES_CATALOG || {})[upgradeId];
  if (!upg || (upg.isAllowed && !upg.isAllowed(this.spec))) return false;
  this.equippedUpgrades.push(upgradeId);
  upg.apply(this);
  if (upgradeId === 'DAS_360_OPTIC') this.hasDAS = true;
  if (upgradeId === 'EOTS_DUAL_OPTICS') this.hasIRST = true;
  this.recalculateWeight();
  return true;
};

Aircraft.prototype.getUsedInternalSlots = function() { return this.equippedWeapons.reduce((sum, item) => sum + (item.station === 'INTERNAL' && item.weapon ? item.weapon.slots : 0), 0); };
Aircraft.prototype.getUsedExternalSlots = function() { return this.equippedWeapons.reduce((sum, item) => sum + (item.station === 'EXTERNAL' && item.weapon ? item.weapon.slots : 0), 0); };
Aircraft.prototype.getUsedCenterlineSlots = function() { return this.equippedWeapons.reduce((sum, item) => sum + (item.station === 'CENTERLINE' && item.weapon ? item.weapon.slots : 0), 0); };
Aircraft.prototype.getUsedSlots = function() { return this.equippedWeapons.reduce((sum, item) => sum + (item.weapon ? item.weapon.slots : 0), 0); };

Aircraft.prototype.installWeapon = function(weaponId, targetStation = null) {
  const wpn = (window.WEAPONS_CATALOG || {})[weaponId];
  if (!wpn) return false;

  const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
  if (ratings.indexOf(wpn.minRating) > ratings.indexOf(this.maxPylonRating)) return false;
  if (wpn.allowedAirframes && !wpn.allowedAirframes.includes(this.spec.id)) return false;

  const wpnSlotType = wpn.slotType || 'EXTERNAL';
  let assignedStation = targetStation;

  if (wpnSlotType === 'CENTERLINE') {
    if (!this.hasCenterline || this.getUsedCenterlineSlots() > 0) return false;
    assignedStation = 'CENTERLINE';
  } else if (!assignedStation) {
    if (wpnSlotType === 'INTERNAL' && (this.getUsedInternalSlots() + wpn.slots <= this.internalSlots)) {
      assignedStation = 'INTERNAL';
    } else if (this.getUsedExternalSlots() + wpn.slots <= this.externalSlots) {
      assignedStation = 'EXTERNAL';
    } else {
      return false;
    }
  } else {
    if (assignedStation === 'INTERNAL') {
      if (wpnSlotType !== 'INTERNAL') return false;
      if (this.getUsedInternalSlots() + wpn.slots > this.internalSlots) return false;
    } else if (assignedStation === 'EXTERNAL') {
      if (wpnSlotType === 'CENTERLINE') return false;
      if (this.getUsedExternalSlots() + wpn.slots > this.externalSlots) return false;
    } else if (assignedStation === 'CENTERLINE') {
      if (wpnSlotType !== 'CENTERLINE' || !this.hasCenterline || this.getUsedCenterlineSlots() > 0) return false;
    }
  }

  this.equippedWeapons.push({
    id: wpn.id,
    weapon: wpn,
    station: assignedStation,
    ammo: wpn.ammoCount || 4,
    maxAmmo: wpn.ammoCount || 4,
    cooldown: 0.0
  });

  if (wpn.isJammerPod) this.jamEfficiency = Math.max(this.jamEfficiency, wpn.jamEfficiency || 0.45);
  if (wpn.isDecoyDrone) {
    this.hasMaldDecoy = true;
    this.maldDecoyCharges = (this.maldDecoyCharges || 0) + (wpn.ammoCount || 2);
  }

  this.recalculateWeight();
  return true;
};

Aircraft.prototype.recalculateWeight = function() {
  let mass = this.gun ? Number(this.gun.mass || 100) : 100;
  let externalDragPenalty = 0;
  let extraRcs = 0;
  const upgCatalog = window.UPGRADES_CATALOG || {};

  for (const item of this.equippedWeapons) {
    if (!item || !item.weapon) continue;
    const w = item.weapon;
    const isMounted = item.ammo > 0;
    const ammoFraction = item.maxAmmo > 0 ? (item.ammo / item.maxAmmo) : (isMounted ? 1 : 0);
    mass += Number(w.mass || 0) * ammoFraction;

    const station = item.station || (w.slotType === 'CENTERLINE' ? 'CENTERLINE' : (w.slotType === 'INTERNAL' && this.internalSlots > 0 ? 'INTERNAL' : 'EXTERNAL'));
    if (station === 'CENTERLINE') {
      if (isMounted) {
        extraRcs += Number(w.sigmaPylon || 0.50);
        externalDragPenalty += 0.05 * ammoFraction;
      }
    } else if (station !== 'INTERNAL' && isMounted) {
      extraRcs += Number(w.sigmaPylon || 0.05);
      externalDragPenalty += 0.02 * (w.slots || 1) * ammoFraction;
    }
  }

  for (const upgId of this.equippedUpgrades) {
    const upg = upgCatalog[upgId];
    if (upg) mass += Number(upg.mass || 0);
  }

  const maxMass = (this.spec && this.spec.M_max > 0) ? this.spec.M_max : 5000;
  let effectiveWr = Math.min(1.0, mass / maxMass);
  if (this.heavyLeadDragMitigation) effectiveWr = Math.max(0, effectiveWr - this.heavyLeadDragMitigation);
  this.Wr = effectiveWr;

  let baseRcs = Number(this.spec ? (this.spec.sigma_0 || 1.0) : 1.0);
  if (this.isFlightLead && this.spec && this.spec.category === 'STEALTH') baseRcs *= 0.65;
  if (this.equippedUpgrades.includes('RAM_NANO_COATING')) baseRcs *= 0.55;
  this.effectiveRcs = Math.max(0.00005, baseRcs + extraRcs);

  const baseSpeed = Number(this.spec ? (this.spec.S_0 || 0.95) : 0.95);
  this.effectiveMaxSpeed = Math.max(0.35, baseSpeed * (1.0 - 0.22 * this.Wr) - externalDragPenalty);
  const baseAccel = 0.24 + (this.accelBonus || 0);
  this.effectiveAcceleration = baseAccel / (1.0 + 0.70 * this.Wr);

  if (!this.distanceTraveled || this.distanceTraveled === 0) {
    this.speed = this.getTargetMach();
    this.prevSpeed = this.speed;
    this.speedTrend = '--';
  }
};

Aircraft.prototype.deployCountermeasures = function() {
  const count = (this.chaff !== undefined) ? this.chaff : (this.countermeasures || 0);
  if (count > 0 && this.cmTimer <= 0) {
    this.chaff = count - 1;
    this.countermeasures = count - 1;
    this.chaffFlares = count - 1;
    this.cmTimer = 3.0;
    this.applyActionStress(0.08);
    const inspection = window.Game && window.Game.inspection;
    if (inspection && inspection.enabled) inspection.recordEvent('COUNTERMEASURE', `${window.formatAircraftDisplayName ? window.formatAircraftDisplayName(this) : this.callsign} deployed chaff`, this, null, {
      remainingChaff: this.chaff, activeWindowSec: this.cmTimer, stressAfterDeployment: this.stress,
      incomingMissiles: (window.Game.missiles || []).filter(missile => missile.active && missile.target && missile.target.id === this.id).map(missile => ({
        weapon: missile.weapon && missile.weapon.name, seeker: missile.weapon && missile.weapon.seeker, distanceKm: missile.distanceToTarget
      }))
    });
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    return true;
  }
  return false;
};

Aircraft.prototype.processRTB = function(dt) {
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
    const dur = this.hasFastRTB ? 1.8 : ((window.CONFIG && window.CONFIG.RTB_REARM_DURATION_SEC) || 3.5);
    if (this.rtbTimer >= dur) {
      this.rearmStandardPackage();
      this.isRTB = false;
      this.rtbTimer = 0.0;
      this.heading = isBlue ? 0.0 : Math.PI;
      this.engineAlpha = 0.50;
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnCombatText(this.x, this.y, 'RE-ARMED & REPAIRED', isBlue ? '#00f5a0' : '#ef4444');
      }
    }
  }
};

Aircraft.prototype.rearmStandardPackage = function() {
  this.hp = this.maxHp;
  this.energy = 1.0;
  const baseCm = this.isAce ? 6 : (this.isFlightLead ? (this.leadExtraCm ? 4 + this.leadExtraCm : 6) : 4);
  this.chaff = baseCm;
  this.countermeasures = baseCm;
  this.chaffFlares = baseCm;
  this.gunAmmo = (this.gun && this.gun.defaultAmmo) ? this.gun.defaultAmmo : 500;
  for (const item of this.equippedWeapons) {
    item.ammo = item.maxAmmo || item.ammo;
    item.cooldown = 0.0;
  }
  if (this.hasMaldDecoy) this.maldDecoyCharges = 2;
  if (this.equippedWeapons.length === 0) {
    if (this.internalSlots > 0) {
      this.installWeapon('AIM-120D', 'INTERNAL');
      this.installWeapon('AIM-9X-2', 'INTERNAL');
    } else {
      this.installWeapon('AIM-120D', 'EXTERNAL');
      this.installWeapon('AIM-9X-2', 'EXTERNAL');
    }
  }
  this.recalculateWeight();
};

Aircraft.prototype.updateAutomaticGun = function(dt, enemiesList, radarRenderer) {
  if (this.hp <= 0.05 || this.gunAmmo <= 0 || this.gunCooldown > 0) return;
  const diffKey = (window.Game && window.Game.aiDifficulty) || 'VETERAN';
  const isEnemy = (this.team !== ((window.Game && window.Game.currentPvpCommander) || 'friendly'));

  const maxRange = (this.gun && this.gun.rangeKm) ? this.gun.rangeKm : 4.6;
  const maxConeRad = ((this.gun && this.gun.coneAngleDeg ? this.gun.coneAngleDeg : 40) / 2.0) * (Math.PI / 180.0);
  const isEnergy = Boolean(this.gun && (this.gun.damagePerPulse || this.gun.id === 'DE-PULSE' || this.gun.id.startsWith('PLSL') || this.gun.id === 'EML_GUN'));

  let totalGunDps = (this.gun.damagePerSec || 2.5);
  const activeGunpods = this.equippedWeapons.filter(item => item && item.ammo > 0 && item.weapon && (item.weapon.isGunpod || item.weapon.category === 'GUN'));
  activeGunpods.forEach(p => { totalGunDps += (p.weapon.damagePerSec || 2.0); });

  for (const enemy of enemiesList) {
    if (!enemy || enemy.hp <= 0.05 || enemy.isCivilian) continue;
    const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
    if (dist <= maxRange) {
      let angleDiff = Math.abs(this.heading - Math.atan2(enemy.y - this.y, enemy.x - this.x));
      while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

      if (angleDiff < maxConeRad) {
        if (isEnemy && !this.isAce && Math.random() < (diffKey === 'CADET' ? 0.60 : 0.40)) break;

        const baseDamage = totalGunDps * dt;
        let sustainedDmg = baseDamage;
        const damageFactors = [];
        const clouds = (window.Game && window.Game.simulation && window.Game.simulation.weatherClouds) || [];
        const cloudHits = typeof Physics !== 'undefined' ? Physics.countIntersectingClouds(this.x, this.y, enemy.x, enemy.y, clouds) : 0;

        if (cloudHits > 0 && isEnergy && this.gun.cloudScattering) {
          const factor = Math.max(0.10, Math.pow(1.0 - this.gun.cloudScattering, cloudHits));
          sustainedDmg *= factor;
          damageFactors.push({ cause: 'Cloud scattering', multiplier: factor });
        }
        if (isEnemy && !this.isAce) { sustainedDmg *= 0.65; damageFactors.push({ cause: 'AI gun damage scaling', multiplier: 0.65 }); }
        if (enemy.spec && enemy.spec.category === 'STRIKE') { sustainedDmg *= 0.50; damageFactors.push({ cause: 'Strike-aircraft resistance', multiplier: 0.50 }); }
        if (enemy.isFlightLead && enemy.autocannonResistance) {
          const factor = 1.0 - enemy.autocannonResistance; sustainedDmg *= factor;
          damageFactors.push({ cause: 'Flight-lead autocannon resistance', multiplier: factor });
        }
        if (this.stress >= 0.65 && !this.isCoffin && !this.spec.isDrone) { sustainedDmg *= 0.75; damageFactors.push({ cause: 'Shooter stress', multiplier: 0.75 }); }

        const hpBefore = enemy.hp;
        enemy.hp = Math.max(0, enemy.hp - sustainedDmg);
        if (enemy.hp < 0.05) enemy.hp = 0;

        if (this.gun.kineticConcussion && this.gun.kineticConcussion > 0) {
          if (typeof enemy.applyActionStress === 'function') enemy.applyActionStress(this.gun.kineticConcussion * 0.4 * dt);
        }

        const burstRds = this.gun.roundsPerBurst || 4;
        this.gunAmmo = Math.max(0, this.gunAmmo - burstRds);

        const inspection = window.Game && window.Game.inspection;
        if (inspection && inspection.enabled) inspection.recordEvent('GUN BURST', `${window.formatAircraftDisplayName ? window.formatAircraftDisplayName(this) : this.callsign} fired ${this.gun.name || this.gun.id} at ${window.formatCombatantDisplayName ? window.formatCombatantDisplayName(enemy) : (enemy.callsign || enemy.name || enemy.id)}`, this, enemy, {
          gun: this.gun.name || this.gun.id, rangeKm: dist, maximumRangeKm: maxRange,
          targetAngleDeg: angleDiff * 180 / Math.PI, allowedHalfConeDeg: maxConeRad * 180 / Math.PI,
          firingDps: totalGunDps, simulationStepSec: dt, baseDamage, damageFactors,
          finalDamage: hpBefore - enemy.hp, hpBefore, hpAfter: enemy.hp, ammunitionRemaining: this.gunAmmo
        });

        this.gunCooldown = (window.CONFIG && window.CONFIG.AUTO_GUN_COOLDOWN) || 0.50;

        if (radarRenderer && (Math.random() < 0.45 || isEnergy || activeGunpods.length > 0)) {
          radarRenderer.spawnGunTracer(this.x, this.y, enemy.x, enemy.y, this.gun.tracerColor || (isEnemy ? '#ef4444' : '#00f0ff'));
          activeGunpods.forEach(p => {
            radarRenderer.spawnGunTracer(this.x, this.y, enemy.x, enemy.y, p.weapon.tracerColor || '#fbbf24');
          });
        }

        if (enemy.hp <= 0 && window.Game && window.Game.simulation) {
          window.Game.simulation.recordKillEvent(this.team, enemy, this, { weapon: this.gun || { name: 'Autocannon' }, isSalvo: activeGunpods.length > 0, salvoCount: activeGunpods.length + 1 });
        }
        break;
      }
    }
  }
};