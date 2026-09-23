/**
 * AIRSPACE STANDOFF: Preconfigured Aircraft Preset Card Builder
 * Displays stations inside tag-like box badges as 1 cohesive stat matching the armory shelf.
 */

class PreconfigCardsRenderer {
  static buildCard(tpl, acMap, wpnMap, upgMap, deployCb, deleteCb) {
    const spec = acMap[tpl.specId];
    if (!spec) return null;

    const isCustom = (tpl.roleCategory === 'CUSTOM');
    const card = document.createElement('div');
    const category = spec.category || 'MULTIROLE';
    card.className = `preconfig-card cat-${category.toLowerCase()}`;

    const metrics = (typeof LoadoutMetrics !== 'undefined')
      ? LoadoutMetrics.calculate(spec, tpl.weapons, tpl.upgrades, tpl.chosenGunId, false)
      : null;

    const totalCost = metrics ? metrics.totalCost : Number(spec.cost || 0);
    const costClass = metrics ? metrics.costColorClass : 'stat-tier-3';

    const gunsMap = window.AUTOCANNONS_CATALOG || {};
    const gun = gunsMap[tpl.chosenGunId] || gunsMap[spec.builtInGun] || gunsMap['M61A2'];

    const weaponsListHtml = (tpl.weapons || []).map(wEntry => {
      const wId = (typeof wEntry === 'object' && wEntry !== null) ? (wEntry.id || wEntry.specId) : wEntry;
      const w = wpnMap[wId];
      if (!w) return '';
      const station = (typeof wEntry === 'object' && wEntry !== null && wEntry.station) ? wEntry.station : (w.slotType || 'EXT');
      return `<span class="pc-item-pill wpn station-${String(station).toLowerCase()}" data-tag-title="${w.name} [${station}]" data-tag-tooltip="${w.rangeKm}km range &bull; ${w.damage} HP &bull; Station: ${station} &bull; ${w.ammoCount || 4}x count">${w.name.split(' ')[0]} (${w.ammoCount || 4}x)</span>`;
    }).join('');

    const upgradesListHtml = (tpl.upgrades || []).map(uId => {
      const u = upgMap[uId];
      if (!u) return '';
      return `<span class="pc-item-pill upg" data-tag-title="${u.name}" data-tag-tooltip="${u.desc}">[${u.category || 'SYSTEM'}] ${u.name.split(' ')[0]}</span>`;
    }).join('');

    const gunHtml = gun ? `<span class="pc-item-pill gun" data-tag-title="${gun.name}" data-tag-tooltip="${gun.rpm} RPM &bull; ${gun.damagePerSec} HP/s">${gun.name.split(' ')[0]}</span>` : '';
    const tvcLabel = spec.thrustVector ? '3D TVC' : (spec.isCoffin ? 'COFFIN' : 'AERO');

    const weightBg = metrics ? metrics.weightBg : 'rgba(0, 245, 160, 0.12)';
    const weightBorder = metrics ? metrics.weightBorder : '#10b981';
    const weightColor = metrics ? metrics.weightColor : '#00f5a0';
    const weightCategory = metrics ? metrics.weightCategory : 'NORMAL';
    const wrPercent = metrics ? metrics.wrPercent : 50;

    const intSlots = Number(spec.internalSlots || 0);
    const extSlots = Number(spec.externalSlots !== undefined ? spec.externalSlots : (spec.totalSlots || 6));
    const hasCtr = Boolean(spec.hasCenterline);

    let defaultIntPill = intSlots > 0 ? `<span class="station-slot-pill int-pill">${intSlots} INT</span>` : '';
    let defaultExtPill = `<span class="station-slot-pill ext-pill">${extSlots} EXT</span>`;
    let defaultCtrPill = hasCtr ? `<span class="station-slot-pill ctr-pill">+ CTR</span>` : '';
    const fallbackBadges = `<span class="station-tag-box">${defaultIntPill}${defaultExtPill}${defaultCtrPill}</span>`;

    card.innerHTML = `
      <div class="pc-top-row">
        <div class="pc-title-group">
          <div class="pc-template-name">${tpl.name}</div>
          <div class="pc-spec-name">${spec.name} &bull; ${spec.role}</div>
        </div>
        <div class="pc-cost-badge ${costClass}">$${totalCost.toFixed(1)}M</div>
      </div>
      <div class="pc-badges-row">
        <span class="pc-role-badge">${tpl.roleCategory}</span>
        ${isCustom ? '<span class="adc-badge" style="background:#78350f;border:1px solid #f59e0b;color:#fef08a;">USER PRESET</span>' : ''}
        <span class="adc-badge badge-cat-${category.toLowerCase()}">${category}</span>
        <span class="adc-badge" style="background:#091e36;border:1px solid #0284c7;color:#7dd3fc;">${tvcLabel}</span>
        <span class="adc-badge" style="background:${weightBg};border:1px solid ${weightBorder};color:${weightColor};" data-tag-title="PAYLOAD STATUS" data-tag-tooltip="Equipped Carriage: ${metrics ? metrics.totalMass : 0}kg / ${metrics ? metrics.maxMass : 5000}kg (${wrPercent}%). Weight tier: ${weightCategory}.">LOAD: ${metrics ? metrics.totalMass : 0}kg / ${metrics ? metrics.maxMass : 5000}kg (${wrPercent}% ${weightCategory})</span>
      </div>
      <div class="pc-stats-strip">
        <div class="pc-stat-cell"><span>SPEED</span>${metrics ? metrics.speedDualHtml : `<b>M ${(spec.S_0 || 0.9).toFixed(2)}</b>`}</div>
        <div class="pc-stat-cell"><span>AGILITY</span>${metrics ? metrics.agilityDualHtml : `<b>${(spec.AGI_0 || 0.85).toFixed(2)}</b>`}</div>
        <div class="pc-stat-cell"><span>ARMOR</span>${metrics ? metrics.armorDualHtml : `<b>${spec.hp || 4} HP</b>`}</div>
        <div class="pc-stat-cell"><span>RADAR</span>${metrics ? metrics.radarDualHtml : `<b>${spec.R_0 || 75}km</b>`}</div>
        <div class="pc-stat-cell"><span>RCS</span>${metrics ? metrics.rcsDualHtml : `<b>${spec.sigma_0 || 1.0}m2</b>`}</div>
        <div class="pc-stat-cell" data-tag-title="STATIONS BREAKDOWN" data-tag-tooltip="Configured stations across internal bay, external pylons, and centerline station."><span>STATIONS</span>${metrics ? metrics.stationsBadgeHtml : fallbackBadges}</div>
      </div>
      <div class="pc-loadout-summary">
        <div class="pc-loadout-line"><span class="pc-tag-label">GUN:</span>${gunHtml}</div>
        <div class="pc-loadout-line"><span class="pc-tag-label">WEAPONS:</span>${weaponsListHtml || '<span style="color:#64748b;">NONE</span>'}</div>
        <div class="pc-loadout-line"><span class="pc-tag-label">SYSTEMS:</span>${upgradesListHtml || '<span style="color:#64748b;">NONE</span>'}</div>
      </div>
      <div class="pc-desc-box">${tpl.desc || spec.desc || ''}</div>
      <div class="pc-footer">
        <div class="pc-footer-left">
          <button type="button" class="spec-inspect-btn" data-inspect-type="airframe" data-inspect-id="${spec.id}">SPECS</button>
          ${isCustom ? `<button type="button" class="btn-delete-tpl">DELETE</button>` : ''}
        </div>
        <div class="pc-footer-right">
          <button type="button" class="btn-deploy-tpl">+ ASSIGN TO SQUADRON</button>
        </div>
      </div>
    `;

    const deployBtn = card.querySelector('.btn-deploy-tpl');
    if (deployBtn && deployCb) {
      deployBtn.onclick = () => deployCb(tpl);
    }

    const delBtn = card.querySelector('.btn-delete-tpl');
    if (delBtn && deleteCb) {
      delBtn.onclick = (e) => {
        e.stopPropagation();
        deleteCb(tpl);
      };
    }

    return card;
  }
}

window.PreconfigCardsRenderer = PreconfigCardsRenderer;