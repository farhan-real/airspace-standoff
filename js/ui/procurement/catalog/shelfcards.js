/**
 * js/ui/procurement/catalog/shelfcards.js - Armory shelf card DOM builders for guns, upgrades, weapons, and pods.
 */

class ShelfCardBuilders {
  static buildGunCard(pm, g, active, activeSpec) {
    if (!window.BehaviorCodex) throw new Error('BehaviorCodex is not loaded.');
    const card = document.createElement('div');
    card.className = 'catalog-item-card';
    const isComp = activeSpec ? window.AircraftRegistry.isGunCompatible(activeSpec, g) : false;
    card.setAttribute('draggable', isComp ? 'true' : 'false');
    card.dataset.dragType = 'gun'; card.dataset.dragId = g.id; card.dataset.dragName = g.name;
    const rate = StatEvaluator.rate;
    const burstDmg = g.damagePerBurst.toFixed(2);
    const rRpm = rate('gun_rpm', g.rpm);
    const rMass = rate('component_mass', g.mass);
    const rRange = rate('gun_range', g.rangeKm);
    const rDps = rate('gun_dps', g.damagePerSec);
    const rBurst = rate('gun_burst', g.damagePerBurst);
    const rAmmo = rate('gun_ammo', g.defaultAmmo);
    const rCd = rate('gun_cooldown', g.burstCooldown);
    const specialLineHtml = window.BehaviorCodex.renderCardSummaryHtml('gun', g);

    card.innerHTML = `
      <div class="cic-top"><span class="cic-title">${g.name}</span><span class="cic-cost" style="color:#7dd3fc;">${g.caliber}</span></div>
      <div class="cic-type-bar">
        <span class="badge-category ${rRpm.colorClass}">${g.rpm} RPM</span>
        <span class="badge-mass ${rMass.colorClass}">+${g.mass} kg</span>
        ${g.speedPenalty > 0 ? `<span class="badge-category stat-tier-4">-${Math.round(g.speedPenalty * 100)}% SPD</span>` : ''}
        ${g.rcsPenalty > 0 ? `<span class="badge-category stat-tier-5">+${Math.round(g.rcsPenalty * 100)}% RCS</span>` : ''}
      </div>
      <div class="cic-specs">
        <div><span>RNG:</span><b class="${rRange.colorClass}">${g.rangeKm}km</b></div>
        <div><span>CONE:</span><b>${g.coneAngleDeg} deg</b></div>
        <div><span>DPS:</span><b class="${rDps.colorClass}">${g.damagePerSec.toFixed(1)} HP/s</b></div>
        <div><span>BURST:</span><b class="${rBurst.colorClass}">${burstDmg} HP</b></div>
        <div><span>RELOAD:</span><b class="${rCd.colorClass}">${g.burstCooldown.toFixed(1)}s</b></div>
        <div><span>MAG:</span><b class="${rAmmo.colorClass}">${g.defaultAmmo} RDS</b></div>
      </div>
      ${specialLineHtml}
      <div class="cic-desc">${g.desc}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
        <button type="button" class="spec-inspect-btn" data-inspect-type="gun" data-inspect-id="${g.id}">SPECS</button>
        <button type="button" class="btn-quick-equip btn-equip-gun" data-gun-id="${g.id}" style="flex:1;" ${!isComp ? 'disabled' : ''}>${!isComp ? 'INCOMPATIBLE' : (active ? `EQUIP TO AIRCRAFT #${active.index}` : 'EQUIP')}</button>
      </div>`;
    card.querySelector('.btn-equip-gun').onclick = (e) => {
      e.stopPropagation();
      if (isComp) pm.equipItemDirectly({ type: 'gun', id: g.id, name: g.name });
    };
    return card;
  }

  static buildUpgradeCard(pm, upg, active, activeSpec) {
    if (!window.BehaviorCodex) throw new Error('BehaviorCodex is not loaded.');
    const card = document.createElement('div');
    card.className = 'catalog-item-card';
    const isDisallowed = Boolean(upg.isAllowed && activeSpec && !upg.isAllowed(activeSpec));
    card.setAttribute('draggable', isDisallowed ? 'false' : 'true');
    card.dataset.dragType = 'upgrade'; card.dataset.dragId = upg.id; card.dataset.dragName = upg.name;

    let compBadge = 'UNIVERSAL';
    if (upg.id === 'THRUST_VECTOR' || upg.id === 'TITANIUM_COCKPIT') compBadge = 'EXCEPT DRONES & COFFIN';
    else if (upg.id === 'KEVLAR_BELLY_ARMOR') compBadge = 'MANNED AIRCRAFT ONLY';
    else if (upg.id === 'TFR_TERRAIN_RADAR') compBadge = 'EXCEPT HALE / HYPERSONIC';
    else if (upg.id === 'ZOE_NEURAL_PROCESSOR') compBadge = 'DRONES & COFFIN ONLY';
    else if (upg.id === 'COFFIN_OPTICAL_BUS') compBadge = 'EXP, COFFIN & DRONES';
    else if (upg.id === 'SWARM_AI_COPROCESSOR') compBadge = 'DRONES ONLY';
    const rate = StatEvaluator.rate;
    const rCost = rate('cost_upgrade', upg.cost);
    const rMass = rate('component_mass', upg.mass || 0);
    const badgeTierClass = (compBadge === 'UNIVERSAL') ? 'stat-tier-1' : 'stat-tier-3';
    const specialLineHtml = window.BehaviorCodex.renderCardSummaryHtml('upgrade', upg);

    card.innerHTML = `
      <div class="cic-top"><span class="cic-title">${upg.name}</span><span class="cic-cost ${rCost.colorClass}">$${upg.cost.toFixed(1)}M</span></div>
      <div class="cic-type-bar">
        <span class="badge-category">${upg.category}</span>
        <span class="badge-mass ${rMass.colorClass}">+${upg.mass} kg</span>
        <span class="badge-slots">1 SOCKET</span>
        <span class="badge-category ${badgeTierClass}">${compBadge}</span>
      </div>
      ${specialLineHtml}
      <div class="cic-desc">${upg.desc}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
        <button type="button" class="spec-inspect-btn" data-inspect-type="upgrade" data-inspect-id="${upg.id}">SPECS</button>
        <button type="button" class="btn-quick-equip btn-equip-upgrade" data-upg-id="${upg.id}" style="flex:1;" ${isDisallowed ? 'disabled' : ''}>${isDisallowed ? 'INCOMPATIBLE' : (active ? `EQUIP TO AIRCRAFT #${active.index}` : 'EQUIP')}</button>
      </div>`;
    card.querySelector('.btn-equip-upgrade').onclick = (e) => {
      e.stopPropagation();
      if (!isDisallowed) pm.equipItemDirectly({ type: 'upgrade', id: upg.id, name: upg.name });
    };
    return card;
  }

  static buildWeaponCard(pm, wpn, active, activeSpec) {
    if (!window.BehaviorCodex) throw new Error('BehaviorCodex is not loaded.');
    const card = document.createElement('div');
    card.className = 'catalog-item-card';
    const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
    const pylonMismatch = activeSpec && (ratings.indexOf(wpn.minRating) > ratings.indexOf(activeSpec.maxPylonRating));
    const isRestricted = Boolean((wpn.allowedAirframes && active && !wpn.allowedAirframes.includes(active.specId)) || pylonMismatch);
    const wpnSlotWord = wpn.slots === 1 ? 'SLOT' : 'SLOTS';

    let typeBadge = '';
    if (wpn.grantsESM) typeBadge = '<span class="badge-category" style="color:#fbbf24;border-color:#d97706;">ELINT / ESM</span>';
    else if (wpn.grantsIRST && wpn.a2gPkBonus <= 0) typeBadge = '<span class="badge-category" style="color:#00f0ff;border-color:#0284c7;">PASSIVE IRST</span>';
    else if (wpn.isTargetingPod) typeBadge = '<span class="badge-category" style="color:#00f5a0;border-color:#10b981;">TARGETING POD</span>';
    else if (wpn.isJammerPod) typeBadge = '<span class="badge-category" style="color:#38bdf8;border-color:#0284c7;">ECM JAMMER</span>';
    else if (wpn.isDecoy || wpn.isDecoyDrone) typeBadge = '<span class="badge-category" style="color:#c084fc;border-color:#9333ea;">DECOY</span>';
    else if (wpn.isGunpod) typeBadge = '<span class="badge-category" style="color:#fde047;border-color:#ca8a04;">GUN POD</span>';
    else if (wpn.isAntiRunway) typeBadge = '<span class="badge-category" style="color:#38bdf8;">ANTI-RUNWAY</span>';
    else if (wpn.isCluster) typeBadge = '<span class="badge-category" style="color:#fbbf24;">CLUSTER AOE</span>';
    else if (wpn.isBunkerCracker) typeBadge = '<span class="badge-category" style="color:#f43f5e;">BUNKER BUSTER</span>';
    else if (wpn.isRocketPod) typeBadge = '<span class="badge-category" style="color:#f97316;">ROCKET POD</span>';

    const slotType = wpn.slotType;
    let stationBadge = '<span class="badge-slots" style="background:#082f49;border-color:#0284c7;color:#38bdf8;">EXT ONLY</span>';
    if (slotType === 'INTERNAL') stationBadge = '<span class="badge-slots" style="background:#042f2e;border-color:#0d9488;color:#2dd4bf;">INT / EXT</span>';
    else if (slotType === 'CENTERLINE') stationBadge = '<span class="badge-slots" style="background:#451a03;border-color:#d97706;color:#fbbf24;">CENTERLINE</span>';

    card.setAttribute('draggable', isRestricted ? 'false' : 'true');
    card.dataset.dragType = 'weapon'; card.dataset.dragId = wpn.id; card.dataset.dragName = wpn.name;

    const rate = StatEvaluator.rate;
    const rCost = rate('cost_weapon', wpn.cost);
    const rMass = rate('ordnance_mass', wpn.mass);
    let specsRow = '';
    if (wpn.grantsESM) {
      const rSpot = rate('spot_range', wpn.spotRangeKm);
      specsRow = `<div><span>ESM:</span><b class="${rSpot.colorClass}">${wpn.spotRangeKm}km</b></div><div><span>SEAD:</span><b class="stat-tier-1">+${Math.round((wpn.armRangeBoost - 1) * 100)}% ARM</b></div>`;
    } else if (wpn.grantsIRST && wpn.a2gPkBonus <= 0) {
      specsRow = `<div><span>TRACK:</span><b class="stat-tier-1">PASSIVE IRST</b></div><div><span>STEALTH:</span><b class="stat-tier-1">28km BURN</b></div>`;
    } else if (wpn.isTargetingPod) {
      const rSpot = rate('spot_range', wpn.spotRangeKm);
      const rPk = rate('a2g_pk_bonus', wpn.a2gPkBonus);
      const rCloud = rate('cloud_mitigation', wpn.cloudMitigation || 0);
      specsRow = `<div><span>RECON:</span><b class="${rSpot.colorClass}">${wpn.spotRangeKm}km</b></div><div><span>BUFF:</span><b class="${rPk.colorClass}">+${Math.round(wpn.a2gPkBonus * 100)}% Pk</b></div>`;
      if (wpn.cloudMitigation > 0) {
        specsRow += `<div><span>CLOUD:</span><b class="${rCloud.colorClass}">-${Math.round(wpn.cloudMitigation * 100)}%</b></div><div><span>DECOYS:</span><b class="${wpn.exposesDecoys ? 'stat-tier-1' : 'stat-tier-4'}">${wpn.exposesDecoys ? 'EXPOSES' : 'NONE'}</b></div>`;
      }
    } else if (wpn.isJammerPod) {
      const rJamRng = rate('jam_range', wpn.rangeKm);
      const rJamEff = rate('jam_efficiency', wpn.jamEfficiency);
      specsRow = `<div><span>RANGE:</span><b class="${rJamRng.colorClass}">${wpn.rangeKm}km</b></div><div><span>JAM:</span><b class="${rJamEff.colorClass}">-${Math.round(wpn.jamEfficiency * 100)}%</b></div>`;
    } else if (wpn.isDecoy || wpn.isDecoyDrone) {
      const rDroneRng = rate('missile_range', wpn.rangeKm);
      const rAmmo = rate('ammo_count', wpn.ammoCount);
      specsRow = `<div>${wpn.isDecoyDrone ? `<span>RANGE:</span><b class="${rDroneRng.colorClass}">${wpn.rangeKm}km</b>` : '<span>MODE:</span><b class="stat-tier-2">TOWED</b>'}</div><div><span>CHARGES:</span><b class="${rAmmo.colorClass}">${wpn.ammoCount}x</b></div>`;
    } else if (wpn.isGunpod) {
      const rRng = rate('gun_range', wpn.rangeKm);
      const rDps = rate('gun_dps', wpn.damagePerSec || 2.8);
      const rBurst = rate('gun_burst', wpn.damagePerBurst || wpn.damage);
      const rAmmo = rate('gun_ammo', wpn.ammoCount || 16);
      specsRow = `<div><span>RNG:</span><b class="${rRng.colorClass}">${wpn.rangeKm}km</b></div><div><span>MAG:</span><b class="${rAmmo.colorClass}">${wpn.ammoCount}x</b></div><div><span>DPS:</span><b class="${rDps.colorClass}">${(wpn.damagePerSec || 2.8).toFixed(1)} HP/s</b></div><div><span>BURST:</span><b class="${rBurst.colorClass}">${(wpn.damagePerBurst || wpn.damage).toFixed(2)} HP</b></div>`;
    } else {
      const rRng = rate('missile_range', wpn.rangeKm);
      const rSpd = rate('missile_speed', wpn.speedMach);
      const rDmg = rate('missile_damage', wpn.damage);
      const rAmmo = rate('ammo_count', wpn.ammoCount || 4);
      specsRow = `<div><span>RNG:</span><b class="${rRng.colorClass}">${wpn.rangeKm}km</b></div><div><span>MAG:</span><b class="${rAmmo.colorClass}">${wpn.ammoCount || 4}x</b></div><div><span>SPD:</span><b class="${rSpd.colorClass}">M ${wpn.speedMach}</b></div><div><span>DMG:</span><b class="${rDmg.colorClass}">${wpn.damage} HP</b></div>`;
    }

    const seekerLabel = wpn.grantsESM ? 'PASSIVE ELINT' : (wpn.grantsIRST ? 'PASSIVE IRST' : (wpn.isTargetingPod ? 'OPTICAL / LASER' : (wpn.isJammerPod ? 'BROADBAND ECM' : (wpn.isDecoy || wpn.isDecoyDrone ? 'RF DECOY' : (wpn.seeker || 'GUIDED')))));
    const specialLineHtml = window.BehaviorCodex.renderCardSummaryHtml('weapon', wpn);

    card.innerHTML = `
      <div class="cic-top"><span class="cic-title">${wpn.name}</span><span class="cic-cost ${rCost.colorClass}">$${wpn.cost.toFixed(1)}M</span></div>
      <div class="cic-type-bar">
        <span class="badge-slots">${wpn.slots} ${wpnSlotWord}</span>
        ${stationBadge}
        <span class="badge-mass ${rMass.colorClass}">+${wpn.mass} kg</span>
        ${typeBadge}
        <span class="badge-category" style="color:#00f0ff;">${seekerLabel}</span>
      </div>
      <div class="cic-specs">${specsRow}</div>
      ${specialLineHtml}
      <div class="cic-desc">${wpn.behaviorDesc || wpn.desc}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
        <button type="button" class="spec-inspect-btn" data-inspect-type="weapon" data-inspect-id="${wpn.id}">SPECS</button>
        <button type="button" class="btn-quick-equip btn-equip-wpn" data-wpn-id="${wpn.id}" style="flex:1;" ${isRestricted ? 'disabled' : ''}>${isRestricted ? 'INCOMPATIBLE' : (active ? `EQUIP TO AIRCRAFT #${active.index}` : 'EQUIP')}</button>
      </div>`;
    card.querySelector('.btn-equip-wpn').onclick = (e) => {
      e.stopPropagation();
      if (!isRestricted) pm.equipItemDirectly({ type: 'weapon', id: wpn.id, name: wpn.name });
    };
    return card;
  }
}

window.ShelfCardBuilders = ShelfCardBuilders;
