/**
 * AIRSPACE STANDOFF: Loadout Metrics & Dual-Value Kinematics Calculator
 * Evaluates internal bays (zero extra RCS, zero drag), external pylons, and centerline stations.
 */

class LoadoutMetrics {
  static formatRcs(val) {
    if (val === undefined || val === null || isNaN(val)) return '1.0m2';
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
    if (!spec) return null;

    const weaponsMap = window.WEAPONS_CATALOG || {};
    const upgradesMap = window.UPGRADES_CATALOG || {};
    const gunsMap = window.AUTOCANNONS_CATALOG || {};
    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate
      : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const activeGun = gunsMap[chosenGunId] || gunsMap[spec.builtInGun] || gunsMap['M61A2'];
    const gunMass = activeGun ? Number(activeGun.mass || 100) : 100;

    const internalCapacity = Number(spec.internalSlots || 0);
    const externalCapacity = Number(spec.externalSlots !== undefined ? spec.externalSlots : (spec.totalSlots || 6));
    const hasCenterline = Boolean(spec.hasCenterline);
    const centerlineCapacity = Number(spec.centerlineSlots !== undefined ? spec.centerlineSlots : (hasCenterline ? 6 : 0));
    const baselineTotalSlots = Number(spec.totalSlots !== undefined ? spec.totalSlots : (internalCapacity + externalCapacity));

    let internalUsed = 0;
    let externalUsed = 0;
    let centerlineUsed = 0;
    let totalOrdnanceMass = 0;
    let externalDragMach = 0;
    let extraRcs = 0;
    let weaponsCost = 0;

    (weaponsList || []).forEach(wItem => {
      let wId = (typeof wItem === 'object' && wItem !== null) ? (wItem.id || wItem.specId) : wItem;
      let assignedStation = (typeof wItem === 'object' && wItem !== null && wItem.station) ? wItem.station : null;
      const w = weaponsMap[wId];
      if (!w) return;

      const wSlots = Number(w.slots || 1);
      const wType = w.slotType || 'EXTERNAL';

      if (!assignedStation) {
        if (wType === 'CENTERLINE' && hasCenterline) {
          assignedStation = 'CENTERLINE';
        } else if (wType === 'INTERNAL' && (internalUsed + wSlots <= internalCapacity)) {
          assignedStation = 'INTERNAL';
        } else if (externalUsed + wSlots <= externalCapacity) {
          assignedStation = 'EXTERNAL';
        } else if (hasCenterline && (centerlineUsed + wSlots <= centerlineCapacity)) {
          assignedStation = 'CENTERLINE';
        } else {
          assignedStation = 'EXTERNAL';
        }
      }

      totalOrdnanceMass += Number(w.mass || 0);
      weaponsCost += Number(w.cost || 0);

      if (assignedStation === 'INTERNAL') {
        internalUsed += wSlots;
      } else if (assignedStation === 'CENTERLINE') {
        centerlineUsed += wSlots;
        extraRcs += Number(w.sigmaPylon || 0.50);
        externalDragMach += 0.05;
      } else {
        externalUsed += wSlots;
        extraRcs += Number(w.sigmaPylon || 0.05);
        externalDragMach += 0.02 * wSlots;
      }
    });

    let upgradesMass = 0;
    let upgradesCost = 0;
    let hasRam = false;
    let hasSupercruise = false;
    let hasRangeTurbo = false;
    let hasTv = false;
    let hasTitaniumTub = false;
    let hasGanAesa = false;
    let hasCoffin = false;

    (upgradesList || []).forEach(uItem => {
      const uId = (typeof uItem === 'object' && uItem !== null) ? (uItem.id || uItem.specId) : uItem;
      const u = upgradesMap[uId];
      if (u) {
        upgradesMass += Number(u.mass || 0);
        upgradesCost += Number(u.cost || 0);
        if (uId === 'RAM_NANO_COATING') hasRam = true;
        if (uId === 'SUPERCRUISE_VCE') hasSupercruise = true;
        if (uId === 'EXTENDED_RANGE_TURBO') hasRangeTurbo = true;
        if (uId === 'THRUST_VECTOR') hasTv = true;
        if (uId === 'TITANIUM_COCKPIT') hasTitaniumTub = true;
        if (uId === 'GAN_AESA_CORE') hasGanAesa = true;
        if (uId === 'COFFIN_OPTICAL_BUS') hasCoffin = true;
      }
    });

    const totalMass = 100 + gunMass + totalOrdnanceMass + upgradesMass;
    const maxMass = Number(spec.M_max || 5000);
    let effectiveWr = Math.min(1.0, totalMass / maxMass);

    if (isLead && spec.category === 'STRIKE') {
      effectiveWr = Math.max(0, effectiveWr - 0.40);
    }

    const wrPercent = Math.round(effectiveWr * 100);

    let weightCategory = 'NORMAL';
    let weightColor = '#34d399';
    let weightBg = 'rgba(52, 211, 153, 0.12)';
    let weightBorder = '#10b981';

    if (wrPercent <= 35) {
      weightCategory = 'LIGHT';
      weightColor = '#38bdf8';
      weightBg = 'rgba(56, 189, 248, 0.12)';
      weightBorder = '#0284c7';
    } else if (wrPercent <= 60) {
      weightCategory = 'NORMAL';
      weightColor = '#34d399';
      weightBg = 'rgba(52, 211, 153, 0.12)';
      weightBorder = '#10b981';
    } else if (wrPercent <= 80) {
      weightCategory = 'HEAVY';
      weightColor = '#fbbf24';
      weightBg = 'rgba(251, 191, 36, 0.12)';
      weightBorder = '#f59e0b';
    } else {
      weightCategory = 'OVERLOAD';
      weightColor = '#f43f5e';
      weightBg = 'rgba(244, 63, 94, 0.14)';
      weightBorder = '#ef4444';
    }

    const totalCost = Number(spec.cost || 0) + weaponsCost + upgradesCost;

    let baseRcs = Number(spec.sigma_0 !== undefined ? spec.sigma_0 : 1.0);
    if (isLead) {
      if (spec.category === 'STEALTH') baseRcs *= 0.65;
      else if (spec.category === 'SUPERIORITY') baseRcs *= 0.60;
    }
    if (hasRam) baseRcs *= 0.55;

    const loadedRcs = Math.max(0.00005, baseRcs + extraRcs);
    const baseRcsRating = rate('rcs', baseRcs);
    const loadedRcsRating = rate('rcs', loadedRcs);

    let baseSpeed = Number(spec.S_0 || 1.15);
    if (isLead && spec.category === 'SUPERIORITY') baseSpeed *= 1.10;
    if (hasSupercruise) baseSpeed *= 1.10;
    if (hasRangeTurbo) baseSpeed *= 0.96;

    const loadedSpeed = Math.max(0.35, baseSpeed * (1.0 - 0.22 * effectiveWr) - externalDragMach);
    const baseSpeedRating = rate('speed', baseSpeed);
    const loadedSpeedRating = rate('speed', loadedSpeed);

    const baseAgility = Number(spec.AGI_0 || 0.85);
    let loadedAgility = baseAgility;
    if (spec.thrustVector || hasTv) loadedAgility += 0.12;
    if (hasCoffin && !spec.isCoffin) loadedAgility *= 1.15;
    if (hasTitaniumTub) loadedAgility *= 0.95;
    if (isLead) {
      if (spec.category === 'MULTIROLE') loadedAgility += 0.20;
      else if (spec.category === 'DRONES') loadedAgility += 0.15;
    }
    loadedAgility = Math.min(1.80, Math.max(0.12, loadedAgility));

    const baseAgiRating = rate('agility', baseAgility);
    const loadedAgiRating = rate('agility', loadedAgility);

    const baseHp = Number(spec.hp || 4);
    let loadedHp = baseHp;
    if (hasTitaniumTub) loadedHp += 1;
    if (isLead) {
      if (spec.category === 'STEALTH') loadedHp += 1;
      else if (spec.category === 'SUPERIORITY') loadedHp += 2;
      else if (spec.category === 'MULTIROLE') loadedHp += 2;
      else if (spec.category === 'STRIKE') loadedHp += 3;
      else if (spec.category === 'EW') loadedHp += 2;
      else if (spec.category === 'DRONES') loadedHp += 2;
      else loadedHp += 2;
    }
    const baseHpRating = rate('hp', baseHp);
    const loadedHpRating = rate('hp', loadedHp);

    let baseRadar = Number(spec.R_0 || 75.0);
    let loadedRadar = baseRadar;
    if (isLead && spec.category === 'STEALTH') loadedRadar += 15.0;
    if (hasGanAesa) loadedRadar *= 1.20;
    const baseRadarRating = rate('radar_range', baseRadar);
    const loadedRadarRating = rate('radar_range', loadedRadar);

    const costRating = rate('cost_airframe', totalCost);
    const formattedBaseRcs = LoadoutMetrics.formatRcs(baseRcs);
    const formattedLoadedRcs = LoadoutMetrics.formatRcs(loadedRcs);

    const rcsDualHtml = `<span class="dual-val" data-tag-title="RADAR CROSS SECTION" data-tag-tooltip="Clean Base: ${formattedBaseRcs} m2 -> Loaded: ${formattedLoadedRcs} m2 (+${LoadoutMetrics.formatRcs(extraRcs)} from external stores)."><b class="${baseRcsRating.colorClass}">${formattedBaseRcs}</b><span class="val-sep">&rarr;</span><b class="${loadedRcsRating.colorClass}">${formattedLoadedRcs} m2</b></span>`;

    const speedDualHtml = `<span class="dual-val" data-tag-title="MAX SPRINT AIRSPEED" data-tag-tooltip="Clean Base: Mach ${baseSpeed.toFixed(2)} -> Loaded: Mach ${loadedSpeed.toFixed(2)} (${wrPercent}% payload weight & drag)."><b class="${baseSpeedRating.colorClass}">M ${baseSpeed.toFixed(2)}</b><span class="val-sep">&rarr;</span><b class="${loadedSpeedRating.colorClass}">M ${loadedSpeed.toFixed(2)}</b></span>`;

    const agilityDualHtml = `<span class="dual-val" data-tag-title="TURN AGILITY" data-tag-tooltip="Base Agility: ${baseAgility.toFixed(2)} -> Loaded Agility: ${loadedAgility.toFixed(2)}."><b class="${baseAgiRating.colorClass}">${baseAgility.toFixed(2)}</b><span class="val-sep">&rarr;</span><b class="${loadedAgiRating.colorClass}">${loadedAgility.toFixed(2)}</b></span>`;

    const armorDualHtml = (loadedHp !== baseHp)
      ? `<span class="dual-val" data-tag-title="ARMOR DURABILITY" data-tag-tooltip="Base Armor: ${baseHp} HP -> Reinforced: ${loadedHp} HP."><b class="${baseHpRating.colorClass}">${baseHp}</b><span class="val-sep">&rarr;</span><b class="${loadedHpRating.colorClass}">${loadedHp} HP</b></span>`
      : `<span class="dual-val" data-tag-title="ARMOR DURABILITY" data-tag-tooltip="Airframe Armor: ${baseHp} HP."><b class="${baseHpRating.colorClass}">${baseHp} HP</b></span>`;

    const radarDualHtml = (Math.round(loadedRadar) !== Math.round(baseRadar))
      ? `<span class="dual-val" data-tag-title="RADAR RANGE" data-tag-tooltip="Base Radar: ${Math.round(baseRadar)}km -> Enhanced Radar: ${Math.round(loadedRadar)}km."><b class="${baseRadarRating.colorClass}">${Math.round(baseRadar)}km</b><span class="val-sep">&rarr;</span><b class="${loadedRadarRating.colorClass}">${Math.round(loadedRadar)}km</b></span>`
      : `<span class="dual-val" data-tag-title="RADAR RANGE" data-tag-tooltip="Instrumented Radar Range: ${Math.round(baseRadar)}km."><b class="${baseRadarRating.colorClass}">${Math.round(baseRadar)}km</b></span>`;

    let intPill = internalCapacity > 0
      ? `<span class="station-slot-pill int-pill">${internalUsed}/${internalCapacity} INT</span>`
      : '';
    let extPill = `<span class="station-slot-pill ext-pill">${externalUsed}/${externalCapacity} EXT</span>`;
    let ctrPill = hasCenterline
      ? `<span class="station-slot-pill ctr-pill ${centerlineUsed > 0 ? 'occupied' : ''}">${centerlineUsed}/${centerlineCapacity} CTR</span>`
      : '';

    const stationsBadgeHtml = `<span class="station-tag-box" data-tag-title="STATIONS BREAKDOWN" data-tag-tooltip="Internal Bay: ${internalUsed}/${internalCapacity} slots &bull; External Pylons: ${externalUsed}/${externalCapacity} slots &bull; Centerline: ${hasCenterline ? `${centerlineUsed}/${centerlineCapacity}` : 'None'} (Total: ${baselineTotalSlots} Slots)">${intPill}${extPill}${ctrPill}</span>`;

    return {
      spec, totalCost, costColorClass: costRating.colorClass,
      totalMass, maxMass, wrPercent, weightCategory, weightColor, weightBg, weightBorder,
      internalCapacity, internalUsed, remainingInternal: Math.max(0, internalCapacity - internalUsed),
      externalCapacity, externalUsed, remainingExternal: Math.max(0, externalCapacity - externalUsed),
      hasCenterline, centerlineCapacity, centerlineUsed,
      totalSlots: baselineTotalSlots,
      usedSlots: internalUsed + externalUsed,
      remainingSlots: Math.max(0, baselineTotalSlots - internalUsed - externalUsed),
      baseRcs, loadedRcs, extraRcs, baseSpeed, loadedSpeed,
      baseAgility, loadedAgility, baseHp, loadedHp, baseRadar, loadedRadar,
      formatRcs: LoadoutMetrics.formatRcs,
      rcsDualHtml, speedDualHtml, agilityDualHtml, armorDualHtml, radarDualHtml, stationsBadgeHtml
    };
  }
}

window.LoadoutMetrics = LoadoutMetrics;