/**
 * AIRSPACE STANDOFF // Preconfigured Aircraft Preset Card Builder
 */

class PreconfigCardsRenderer {
  static buildCard(tpl, acMap, wpnMap, upgMap, deployCb, deleteCb) {
    const spec = acMap[tpl.specId];
    if (!spec) return null;

    const isCustom = (tpl.roleCategory === 'CUSTOM');
    const card = document.createElement('div');
    const category = spec.category || 'MULTIROLE';
    card.className = `preconfig-card cat-${category.toLowerCase()}`;

    let totalCost = Number(spec.cost || 0);
    let totalMass = 100;
    const gunsMap = window.AUTOCANNONS_CATALOG || {};
    const gun = gunsMap[tpl.chosenGunId] || gunsMap[spec.builtInGun] || gunsMap['M61A2'];
    if (gun) totalMass += gun.mass || 0;

    const weaponsListHtml = (tpl.weapons || []).map(wId => {
      const w = wpnMap[wId];
      if (!w) return '';
      totalCost += Number(w.cost || 0);
      totalMass += Number(w.mass || 0);
      return `<span class="pc-item-pill wpn" data-tag-title="${w.name}" data-tag-tooltip="${w.rangeKm}km range • ${w.damage} HP damage • ${w.seeker || 'GUIDED'} • ${w.ammoCount || 4}x count">${w.name.split(' ')[0]} (${w.ammoCount || 4}x)</span>`;
    }).join('');

    const upgradesListHtml = (tpl.upgrades || []).map(uId => {
      const u = upgMap[uId];
      if (!u) return '';
      totalCost += Number(u.cost || 0);
      totalMass += Number(u.mass || 0);
      return `<span class="pc-item-pill upg" data-tag-title="${u.name}" data-tag-tooltip="${u.desc}">[${u.category || 'SYSTEM'}] ${u.name.split(' ')[0]}</span>`;
    }).join('');

    const gunHtml = gun ? `<span class="pc-item-pill gun" data-tag-title="${gun.name}" data-tag-tooltip="${gun.rpm} RPM • ${gun.damagePerSec} HP/s">${gun.name.split(' ')[0]}</span>` : '';
    const maxMass = spec.M_max || 5000;
    const wrPercent = Math.round(Math.min(1.0, totalMass / maxMass) * 100);

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    const rSpeed = rate('speed', spec.S_0 || 0.90);
    const rAgi = rate('agility', spec.AGI_0 || 0.85);
    const rHp = rate('hp', spec.hp || 4);
    const rRadar = rate('radar_range', spec.R_0 || 75.0);
    const rRcs = rate('rcs', spec.sigma_0 || 1.0);
    const rCost = rate('cost_airframe', totalCost);
    const tvcLabel = spec.thrustVector ? '3D TVC' : (spec.isCoffin ? 'COFFIN' : 'AERO');
    const rcsTag = (spec.sigma_0 <= 0.0005) ? 'VLO' : ((spec.sigma_0 < 0.1) ? 'LO' : `${spec.sigma_0}m²`);

    card.innerHTML = `
      <div class="pc-top-row">
        <div class="pc-title-group">
          <div class="pc-template-name">${tpl.name}</div>
          <div class="pc-spec-name">${spec.name} • ${spec.role}</div>
        </div>
        <div class="pc-cost-badge ${rCost.colorClass}">$${totalCost.toFixed(1)}M</div>
      </div>
      <div class="pc-badges-row">
        <span class="pc-role-badge">${tpl.roleCategory}</span>
        ${isCustom ? '<span class="adc-badge" style="background:#78350f;border:1px solid #f59e0b;color:#fef08a;">USER PRESET</span>' : ''}
        <span class="adc-badge badge-cat-${category.toLowerCase()}">${category}</span>
        <span class="adc-badge" style="background:#091e36;border:1px solid #0284c7;color:#7dd3fc;">${tvcLabel}</span>
        <span class="adc-badge" style="background:#051424;border:1px solid #162a42;color:#94a3b8;">LOAD: ${wrPercent}%</span>
      </div>
      <div class="pc-stats-strip">
        <div class="pc-stat-cell"><span>SPEED</span><b class="${rSpeed.colorClass}">M ${(spec.S_0 || 0.9).toFixed(2)}</b></div>
        <div class="pc-stat-cell"><span>AGILITY</span><b class="${rAgi.colorClass}">${(spec.AGI_0 || 0.85).toFixed(2)} (${spec.G_limit || 9}G)</b></div>
        <div class="pc-stat-cell"><span>ARMOR</span><b class="${rHp.colorClass}">${spec.hp || 4} HP</b></div>
        <div class="pc-stat-cell"><span>RADAR</span><b class="${rRadar.colorClass}">${spec.R_0 || 75}km</b></div>
        <div class="pc-stat-cell"><span>RCS</span><b class="${rRcs.colorClass}">${rcsTag}</b></div>
        <div class="pc-stat-cell"><span>HARDPOINTS</span><b>${spec.totalSlots || 6} Stations</b></div>
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