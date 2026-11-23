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
    const burstDmg = g.damagePerBurst.toFixed(2);
    const specialLineHtml = window.BehaviorCodex.renderCardSummaryHtml('gun', g);

    card.innerHTML = `
      <div class="cic-top"><span class="cic-title">${g.name}</span><span class="cic-cost" style="color:#7dd3fc;">${g.caliber}</span></div>
      <div class="cic-type-bar">
        <span class="badge-category">${g.rpm} RPM</span>
        <span class="badge-mass">+${g.mass} kg</span>
        ${g.speedPenalty > 0 ? `<span class="badge-category" style="color:#fda4af;">-${Math.round(g.speedPenalty * 100)}% SPD</span>` : ''}
        ${g.rcsPenalty > 0 ? `<span class="badge-category" style="color:#fbbf24;">+${Math.round(g.rcsPenalty * 100)}% RCS</span>` : ''}
        <span class="badge-category" style="color:#00f5a0;">${burstDmg} HP (${g.roundsPerBurst} rds, ${g.burstCooldown.toFixed(1)}s)</span>
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
    const badgeColor = (compBadge === 'UNIVERSAL') ? '#00f5a0' : '#fbbf24';
    const specialLineHtml = window.BehaviorCodex.renderCardSummaryHtml('upgrade', upg);

    card.innerHTML = `
      <div class="cic-top"><span class="cic-title">${upg.name}</span><span class="cic-cost">$${upg.cost.toFixed(1)}M</span></div>
      <div class="cic-type-bar">
        <span class="badge-category">${upg.category}</span>
        <span class="badge-mass">+${upg.mass} kg</span>
        <span class="badge-slots">1 SOCKET</span>
        <span class="badge-category" style="color:${badgeColor};">${compBadge}</span>
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

    let specsRow = `<div>RNG: <b>${wpn.rangeKm}km</b></div><div>SPD: <b>M ${wpn.speedMach}</b> &bull; DMG: <b>${wpn.damagePerBurst || wpn.damage} HP</b></div>`;
    if (wpn.grantsESM) {
      specsRow = `<div>ESM REACH: <b>${wpn.spotRangeKm}km</b></div><div>SEAD: <b>+${Math.round((wpn.armRangeBoost - 1) * 100)}% ARM RNG</b></div>`;
    } else if (wpn.grantsIRST && wpn.a2gPkBonus <= 0) {
      specsRow = `<div>TRACK: <b>PASSIVE IRST</b></div><div>ANTI-STEALTH: <b>28km BURN</b></div>`;
    } else if (wpn.isTargetingPod) {
      specsRow = `<div>RECON: <b>${wpn.spotRangeKm}km</b></div><div>BUFF: <b>+${Math.round(wpn.a2gPkBonus * 100)}% A2G Pk</b></div>`;
    } else if (wpn.isJammerPod) {
      specsRow = `<div>UMBRELLA: <b>${wpn.rangeKm}km</b></div><div>SUPPRESSION: <b>-${Math.round(wpn.jamEfficiency * 100)}% RADAR</b></div>`;
    } else if (wpn.isDecoy || wpn.isDecoyDrone) {
      specsRow = `<div>${wpn.isDecoyDrone ? `RANGE: <b>${wpn.rangeKm}km</b>` : 'TOWED: <b>REPEATER</b>'}</div><div>CHARGES: <b>${wpn.ammoCount}x</b></div>`;
    }

    const seekerLabel = wpn.grantsESM ? 'PASSIVE ELINT' : (wpn.grantsIRST ? 'PASSIVE IRST' : (wpn.isTargetingPod ? 'OPTICAL / LASER' : (wpn.isJammerPod ? 'BROADBAND ECM' : (wpn.isDecoy || wpn.isDecoyDrone ? 'RF DECOY' : (wpn.seeker || 'GUIDED')))));
    const specialLineHtml = window.BehaviorCodex.renderCardSummaryHtml('weapon', wpn);

    card.innerHTML = `
      <div class="cic-top"><span class="cic-title">${wpn.name}</span><span class="cic-cost">$${wpn.cost.toFixed(1)}M</span></div>
      <div class="cic-type-bar">
        <span class="badge-slots">${wpn.slots} ${wpnSlotWord}</span>
        ${stationBadge}
        <span class="badge-mass">+${wpn.mass} kg</span>
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
