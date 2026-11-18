/**
 * js/ui/procurement/loadoutmetrics.js - Hangar loadout metrics, weight ratios, and subsystem preview calculator.
 */

class LoadoutMetrics {
  static formatRcs(val) {
    if (val === undefined || val === null || isNaN(val)) throw new Error(`Invalid RCS value passed to formatRcs: ${val}`);
    const num = Number(val);
    if (num <= 0.00005) return '0.00005';
    if (num <= 0.0001) return '0.0001';
    if (num <= 0.0005) return '0.0005';
    if (num < 0.01) return num.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
    if (num < 0.1) return num.toFixed(3);
    if (num < 1.0) return num.toFixed(2);
    return num.toFixed(1);
  }

  static calculate(spec, weaponsList, upgradesList, chosenGunId, isLead = false) {
    if (!spec) throw new Error('LoadoutMetrics.calculate requires a valid aircraft specification.');
    if (!window.WEAPONS_CATALOG || !window.UPGRADES_CATALOG || !window.AUTOCANNONS_CATALOG) {
      throw new Error('Weapon, upgrade, and autocannon catalogs must be loaded before LoadoutMetrics.calculate.');
    }

    const weaponsMap = window.WEAPONS_CATALOG;
    const upgradesMap = window.UPGRADES_CATALOG;
    const gunsMap = window.AUTOCANNONS_CATALOG;
    const rate = StatEvaluator.rate;

    const gunId = chosenGunId || spec.builtInGun;
    const activeGun = gunsMap[gunId];
    if (!activeGun) throw new Error(`Gun "${gunId}" not found in AUTOCANNONS_CATALOG.`);

    const internalCapacity = spec.internalSlots;
    const externalCapacity = spec.externalSlots;
    const hasCenterline = Boolean(spec.hasCenterline);
    const centerlineCapacity = spec.centerlineSlots;
    const baselineTotalSlots = spec.totalSlots;

    let internalUsed = 0, externalUsed = 0, centerlineUsed = 0;
    let totalOrdnanceMass = 0, externalDragMach = 0, extraRcs = 0, weaponsCost = 0;

    (weaponsList || []).forEach(wItem => {
      const wId = (typeof wItem === 'object' && wItem !== null) ? (wItem.id || wItem.specId) : wItem;
      let assignedStation = (typeof wItem === 'object' && wItem !== null && wItem.station) ? wItem.station : null;
      const w = weaponsMap[wId];
      if (!w) throw new Error(`Weapon "${wId}" not found in WEAPONS_CATALOG.`);

      const wSlots = w.slots;
      const wType = w.slotType;

      if (!assignedStation) {
        if (wType === 'CENTERLINE' && hasCenterline) assignedStation = 'CENTERLINE';
        else if (wType === 'INTERNAL' && (internalUsed + wSlots <= internalCapacity)) assignedStation = 'INTERNAL';
        else if (externalCapacity > 0 && externalUsed + wSlots <= externalCapacity) assignedStation = 'EXTERNAL';
        else if (hasCenterline && (centerlineUsed + wSlots <= centerlineCapacity)) assignedStation = 'CENTERLINE';
        else assignedStation = externalCapacity > 0 ? 'EXTERNAL' : 'INTERNAL';
      }

      totalOrdnanceMass += w.mass;
      weaponsCost += w.cost;

      if (assignedStation === 'INTERNAL') {
        internalUsed += wSlots;
      } else if (assignedStation === 'CENTERLINE') {
        centerlineUsed += wSlots;
        extraRcs += w.sigmaPylon;
        externalDragMach += 0.05;
      } else {
        externalUsed += wSlots;
        extraRcs += w.sigmaPylon;
        externalDragMach += 0.02 * wSlots;
      }
    });

    let upgradesMass = 0, upgradesCost = 0;
    let hasRam = false, hasSupercruise = false, hasRangeTurbo = false, hasTv = false;
    let hasTitaniumTub = false, hasGanAesa = false, hasCoffin = false;
    let hasPylonFairings = false, hasKevlarBelly = false;

    (upgradesList || []).forEach(uItem => {
      const uId = (typeof uItem === 'object' && uItem !== null) ? (uItem.id || uItem.specId) : uItem;
      const u = upgradesMap[uId];
      if (!u) throw new Error(`Upgrade "${uId}" not found in UPGRADES_CATALOG.`);
      upgradesMass += u.mass;
      upgradesCost += u.cost;
      if (uId === 'RAM_NANO_COATING') hasRam = true;
      if (uId === 'SUPERCRUISE_VCE') hasSupercruise = true;
      if (uId === 'EXTENDED_RANGE_TURBO') hasRangeTurbo = true;
      if (uId === 'THRUST_VECTOR') hasTv = true;
      if (uId === 'TITANIUM_COCKPIT') hasTitaniumTub = true;
      if (uId === 'GAN_AESA_CORE') hasGanAesa = true;
      if (uId === 'COFFIN_OPTICAL_BUS') hasCoffin = true;
      if (uId === 'HEAVY_PYLON_FAIRINGS') hasPylonFairings = true;
      if (uId === 'KEVLAR_BELLY_ARMOR') hasKevlarBelly = true;
    });

    if (hasPylonFairings) externalDragMach *= 0.60;

    const totalMass = 100 + activeGun.mass + totalOrdnanceMass + upgradesMass;
    const maxMass = spec.M_max;
    let effectiveWr = Math.min(1.0, totalMass / maxMass);
    if (hasPylonFairings) effectiveWr *= 0.80;
    if (isLead && spec.category === 'STRIKE') effectiveWr = Math.max(0, effectiveWr - 0.40);

    const wrPercent = Math.round(effectiveWr * 100);
    let weightCategory = 'NORMAL', weightColor = '#34d399', weightBg = 'rgba(52, 211, 153, 0.12)', weightBorder = '#10b981';
    if (wrPercent <= 35) { weightCategory = 'LIGHT'; weightColor = '#38bdf8'; weightBg = 'rgba(56, 189, 248, 0.12)'; weightBorder = '#0284c7'; }
    else if (wrPercent <= 60) { weightCategory = 'NORMAL'; }
    else if (wrPercent <= 80) { weightCategory = 'HEAVY'; weightColor = '#fbbf24'; weightBg = 'rgba(251, 191, 36, 0.12)'; weightBorder = '#f59e0b'; }
    else { weightCategory = 'OVERLOAD'; weightColor = '#f43f5e'; weightBg = 'rgba(244, 63, 94, 0.14)'; weightBorder = '#ef4444'; }

    const totalCost = spec.cost + weaponsCost + upgradesCost;

    let baseRcs = spec.sigma_0;
    if (isLead) {
      if (spec.category === 'STEALTH') baseRcs *= 0.65;
      else if (spec.category === 'SUPERIORITY') baseRcs *= 0.60;
    }
    if (hasRam) baseRcs *= 0.55;

    const loadedRcs = Math.max(0.00005, baseRcs + extraRcs);
    const baseRcsRating = rate('rcs', baseRcs), loadedRcsRating = rate('rcs', loadedRcs);

    let baseSpeed = spec.S_0;
    if (isLead && spec.category === 'SUPERIORITY') baseSpeed *= 1.10;
    if (hasSupercruise) baseSpeed *= 1.10;
    if (hasRangeTurbo) baseSpeed *= 0.96;

    const loadedSpeed = Math.max(0.35, baseSpeed * (1.0 - 0.22 * effectiveWr) - externalDragMach);
    const baseSpeedRating = rate('speed', baseSpeed), loadedSpeedRating = rate('speed', loadedSpeed);

    const baseAgility = spec.AGI_0;
    let loadedAgility = baseAgility;
    if (spec.thrustVector || hasTv) loadedAgility += 0.12;
    if (hasCoffin && !spec.isCoffin) loadedAgility *= 1.15;
    if (hasTitaniumTub) loadedAgility *= 0.95;
    if (isLead) {
      if (spec.category === 'MULTIROLE') loadedAgility += 0.20;
      else if (spec.category === 'DRONES') loadedAgility += 0.15;
    }
    loadedAgility *= Math.max(0.45, 1.0 - 0.30 * effectiveWr);
    if (externalUsed > 0 || centerlineUsed > 0) loadedAgility -= (externalDragMach * 0.4);
    loadedAgility = Math.min(1.80, Math.max(0.12, loadedAgility));

    const baseAgiRating = rate('agility', baseAgility), loadedAgiRating = rate('agility', loadedAgility);

    const baseHp = spec.hp;
    let loadedHp = baseHp;
    if (hasTitaniumTub) loadedHp += 1;
    if (hasKevlarBelly) loadedHp += 1;
    if (isLead) {
      if (spec.category === 'STEALTH') loadedHp += 1;
      else if (spec.category === 'STRIKE') loadedHp += 3;
      else loadedHp += 2;
    }
    const baseHpRating = rate('hp', baseHp), loadedHpRating = rate('hp', loadedHp);

    const baseRadar = spec.R_0;
    let loadedRadar = baseRadar;
    if (isLead && spec.category === 'STEALTH') loadedRadar += 15.0;
    if (hasGanAesa) loadedRadar *= 1.20;
    const baseRadarRating = rate('radar_range', baseRadar), loadedRadarRating = rate('radar_range', loadedRadar);
    const costRating = rate('cost_airframe', totalCost);

    const formattedBaseRcs = LoadoutMetrics.formatRcs(baseRcs), formattedLoadedRcs = LoadoutMetrics.formatRcs(loadedRcs);
    const rcsDualHtml = `<span class="dual-val" data-tag-title="RADAR CROSS SECTION" data-tag-tooltip="Clean Base: ${formattedBaseRcs} m2 -> Loaded: ${formattedLoadedRcs} m2 (+${LoadoutMetrics.formatRcs(extraRcs)} from external stores)."><b class="${baseRcsRating.colorClass}">${formattedBaseRcs}</b><span class="val-sep">&rarr;</span><b class="${loadedRcsRating.colorClass}">${formattedLoadedRcs} m2</b></span>`;
    const speedDualHtml = `<span class="dual-val" data-tag-title="MAX SPRINT AIRSPEED" data-tag-tooltip="Clean Base: Mach ${baseSpeed.toFixed(2)} -> Loaded: Mach ${loadedSpeed.toFixed(2)} (${wrPercent}% payload weight & drag)."><b class="${baseSpeedRating.colorClass}">M ${baseSpeed.toFixed(2)}</b><span class="val-sep">&rarr;</span><b class="${loadedSpeedRating.colorClass}">M ${loadedSpeed.toFixed(2)}</b></span>`;
    const agilityDualHtml = `<span class="dual-val" data-tag-title="TURN AGILITY" data-tag-tooltip="Base Agility: ${baseAgility.toFixed(2)} -> Loaded Agility: ${loadedAgility.toFixed(2)} (${wrPercent}% payload weight & drag)."><b class="${baseAgiRating.colorClass}">${baseAgility.toFixed(2)}</b><span class="val-sep">&rarr;</span><b class="${loadedAgiRating.colorClass}">${loadedAgility.toFixed(2)}</b></span>`;
    const armorDualHtml = (loadedHp !== baseHp)
      ? `<span class="dual-val" data-tag-title="ARMOR DURABILITY" data-tag-tooltip="Base Armor: ${baseHp} HP -> Reinforced: ${loadedHp} HP."><b class="${baseHpRating.colorClass}">${baseHp}</b><span class="val-sep">&rarr;</span><b class="${loadedHpRating.colorClass}">${loadedHp} HP</b></span>`
      : `<span class="dual-val" data-tag-title="ARMOR DURABILITY" data-tag-tooltip="Airframe Armor: ${baseHp} HP."><b class="${baseHpRating.colorClass}">${baseHp} HP</b></span>`;
    const radarDualHtml = (Math.round(loadedRadar) !== Math.round(baseRadar))
      ? `<span class="dual-val" data-tag-title="RADAR RANGE" data-tag-tooltip="Base Radar: ${Math.round(baseRadar)}km -> Enhanced Radar: ${Math.round(loadedRadar)}km."><b class="${baseRadarRating.colorClass}">${Math.round(baseRadar)}km</b><span class="val-sep">&rarr;</span><b class="${loadedRadarRating.colorClass}">${Math.round(loadedRadar)}km</b></span>`
      : `<span class="dual-val" data-tag-title="RADAR RANGE" data-tag-tooltip="Instrumented Radar Range: ${Math.round(baseRadar)}km."><b class="${baseRadarRating.colorClass}">${Math.round(baseRadar)}km</b></span>`;

    const intPill = internalCapacity > 0 ? `<span class="station-slot-pill int-pill">${internalUsed}/${internalCapacity} INT</span>` : '';
    const extPill = externalCapacity > 0 ? `<span class="station-slot-pill ext-pill">${externalUsed}/${externalCapacity} EXT</span>` : '';
    const ctrPill = hasCenterline ? `<span class="station-slot-pill ctr-pill ${centerlineUsed > 0 ? 'occupied' : ''}">${centerlineUsed}/${centerlineCapacity} CTR</span>` : '';
    const stationsBadgeHtml = `<span class="station-tag-box" data-tag-title="STATIONS BREAKDOWN" data-tag-tooltip="Internal Bay: ${internalUsed}/${internalCapacity} slots &bull; External Pylons: ${externalUsed}/${externalCapacity} slots &bull; Centerline: ${hasCenterline ? `${centerlineUsed}/${centerlineCapacity}` : 'None'} (Total: ${baselineTotalSlots} Slots)">${intPill}${extPill}${ctrPill}</span>`;

    return {
      spec, totalCost, costColorClass: costRating.colorClass, totalMass, maxMass, wrPercent,
      weightCategory, weightColor, weightBg, weightBorder,
      internalCapacity, internalUsed, remainingInternal: Math.max(0, internalCapacity - internalUsed),
      externalCapacity, externalUsed, remainingExternal: Math.max(0, externalCapacity - externalUsed),
      hasCenterline, centerlineCapacity, centerlineUsed, totalSlots: baselineTotalSlots,
      usedSlots: internalUsed + externalUsed, remainingSlots: Math.max(0, baselineTotalSlots - internalUsed - externalUsed),
      baseRcs, loadedRcs, extraRcs, baseSpeed, loadedSpeed, baseAgility, loadedAgility,
      baseHp, loadedHp, baseRadar, loadedRadar, formatRcs: LoadoutMetrics.formatRcs,
      rcsDualHtml, speedDualHtml, agilityDualHtml, armorDualHtml, radarDualHtml, stationsBadgeHtml
    };
  }
}

window.LoadoutMetrics = LoadoutMetrics;
