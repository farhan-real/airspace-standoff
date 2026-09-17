/**
 * AIRSPACE STANDOFF // Inspector Coordinator & Hover Tooltip Engine
 * Formats aerospace specifications, armament data, and Flight Lead doctrinal adjustments.
 */

class ProcurementInspector {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this.tooltipEl = null;
    this.initHoverTooltips();
  }

  initHoverTooltips() {
    let tooltip = document.getElementById('hud-floating-tooltip');
    if (!tooltip && document.body) {
      tooltip = document.createElement('div');
      tooltip.id = 'hud-floating-tooltip';
      tooltip.className = 'hud-tooltip-box';
      document.body.appendChild(tooltip);
    }
    this.tooltipEl = tooltip;

    document.addEventListener('mouseover', (e) => {
      const tagTarget = e.target && e.target.closest ? e.target.closest('[data-tag-tooltip]') : null;
      if (tagTarget) {
        const title = tagTarget.getAttribute('data-tag-title') || 'TECHNICAL SPECIFICATION';
        const desc = tagTarget.getAttribute('data-tag-tooltip');
        if (desc) {
          const html = `
            <div class="tt-header-row" style="margin-bottom:4px;border-bottom:1px solid rgba(0,240,255,0.25);padding-bottom:3px;">
              <span class="tt-title" style="color:#00f0ff;font-size:0.74rem;">${title}</span>
            </div>
            <div class="tt-footer-desc" style="color:#cbd5e1;font-size:0.62rem;line-height:1.45;">${desc}</div>
          `;
          this.showTooltip(html, e);
          return;
        }
      }

      const target = e.target && e.target.closest ? e.target.closest('[data-inspect-type]') : null;
      if (target) {
        if (target.closest('#proc-hanger-shelf') && !target.classList.contains('spec-inspect-btn')) {
          this.hideTooltip();
          return;
        }
        const type = target.getAttribute('data-inspect-type');
        const id = target.getAttribute('data-inspect-id');
        if (type && id) {
          const html = this.generateInspectHtml(type, id);
          if (html) this.showTooltip(html, e);
        }
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.tooltipEl && this.tooltipEl.style.display === 'block') this.positionTooltip(e);
    });

    document.addEventListener('mouseout', (e) => {
      const tagTarget = e.target && e.target.closest ? e.target.closest('[data-tag-tooltip]') : null;
      const target = e.target && e.target.closest ? e.target.closest('[data-inspect-type]') : null;
      if (tagTarget || target) {
        const active = tagTarget || target;
        if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-tag-tooltip], [data-inspect-type]') === active) return;
        this.hideTooltip();
      }
    });
  }

  showTooltip(html, e) {
    if (!this.tooltipEl || !html) return;
    this.tooltipEl.innerHTML = html;
    this.tooltipEl.style.display = 'block';
    this.positionTooltip(e);
  }

  hideTooltip() {
    if (this.tooltipEl) this.tooltipEl.style.display = 'none';
  }

  positionTooltip(e) {
    if (!this.tooltipEl) return;
    const pad = 16;
    const tipW = this.tooltipEl.offsetWidth || 340;
    const tipH = this.tooltipEl.offsetHeight || 220;
    let x = e.clientX + pad;
    let y = e.clientY + pad;
    if (x + tipW > window.innerWidth - 12) x = e.clientX - tipW - pad;
    if (y + tipH > window.innerHeight - 12) y = e.clientY - tipH - pad;
    this.tooltipEl.style.left = `${Math.round(Math.max(8, Math.min(x, window.innerWidth - tipW - 8)))}px`;
    this.tooltipEl.style.top = `${Math.round(Math.max(8, Math.min(y, window.innerHeight - tipH - 8)))}px`;
  }

  generateLeadBuffHtml(specId) {
    const acMap = window.AIRCRAFT_CATALOG || {};
    const spec = acMap[specId] || { name: specId, category: 'MULTIROLE' };
    const cat = spec.category || 'MULTIROLE';
    const data = (window.LEAD_BUFFS && window.LEAD_BUFFS[cat]) || window.LEAD_BUFFS.MULTIROLE;

    const cellsHtml = data.buffs.map(b => `
      <div class="tt-cell"><span>${b.label}:</span><b class="stat-tier-1">${b.val}</b></div>
    `).join('');

    const buffsList = data.buffs.map(b => `
      <div style="display:flex;justify-content:space-between;gap:6px;border-bottom:1px solid rgba(255,255,255,0.04);padding:2px 0;">
        <span style="color:#ffd700;font-weight:800;">${b.label}:</span>
        <span style="color:#e2e8f0;text-align:right;">${b.desc}</span>
      </div>
    `).join('');

    return `
      <div class="tt-header-row">
        <span class="tt-title" style="color:#ffd700;">FLIGHT LEAD: ${(spec.name || specId).toUpperCase()}</span>
        <span class="tt-badge" style="background:#082846;color:#38bdf8;border:1px solid #0284c7;">FORMATION CENTER</span>
      </div>
      <div class="tt-sub-bar">
        <span class="tt-role-text" style="color:#fef08a;">${data.role}</span>
        <span class="tt-badge badge-cat-${cat.toLowerCase()}">${cat}</span>
      </div>
      <div class="tt-grid-box">
        ${cellsHtml}
      </div>
      <div class="tt-trait-pill" style="border-left-color:#00f5a0;background:rgba(0,245,160,0.06);border-color:rgba(0,245,160,0.25);">
        <b style="color:#00f5a0;">[SURVIVABILITY &amp; DEFENSIVE CAPABILITIES]</b><br>
        <span style="color:#cbd5e1;">${data.survivability}</span>
      </div>
      <div class="tt-trait-pill" style="border-left-color:#ffd700;background:rgba(255,215,0,0.06);border-color:rgba(255,215,0,0.25);">
        <b style="color:#ffd700;">[FLIGHT LEAD SYSTEMS &amp; TACTICAL MODIFICATIONS: ${data.title}]</b>
        <div style="margin-top:3px;font-size:0.58rem;color:#cbd5e1;line-height:1.4;">${data.weaknessFixed}</div>
        <div style="margin-top:4px;font-size:0.56rem;display:flex;flex-direction:column;gap:1px;">
          ${buffsList}
        </div>
      </div>
      <div class="tt-footer-desc" style="color:#94a3b8;">
        <b>FORMATION POSITION:</b> Positioned in the central flight slot. ${data.summary}
      </div>
    `;
  }

  generateInspectHtml(type, id) {
    if (!type || !id) return null;
    if (type === 'lead') return this.generateLeadBuffHtml(id);

    const guns = window.AUTOCANNONS_CATALOG || {};
    const weapons = window.WEAPONS_CATALOG || {};
    const aircraft = window.AIRCRAFT_CATALOG || {};
    const upgrades = window.UPGRADES_CATALOG || {};
    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    if (type === 'civilian') {
      const pool = window.CIVILIAN_FLIGHTS || [];
      const c = pool.find(f => f.code === id || f.name === id) || { code: id, name: 'Commercial Flight', speedMach: 0.78, altFt: 36000, rcs: 25.0 };
      return `
        <div class="tt-header-row"><span class="tt-title">${c.code}: ${c.name}</span><span class="tt-cost-tag" style="color:#ff3366;">ROE: -800 VP</span></div>
        <div class="tt-sub-bar"><span class="tt-role-text">Civilian Transit Corridor</span><span class="tt-badge" style="background:#065f46;color:#a7f3d0;">NON-COMBATANT</span></div>
        <div class="tt-grid-box">
          <div class="tt-cell"><span>SPEED:</span><b>M ${(c.speedMach || 0.78).toFixed(2)}</b></div>
          <div class="tt-cell"><span>ALT:</span><b>FL${Math.round((c.altFt || 36000) / 100)}</b></div>
          <div class="tt-cell"><span>RCS:</span><b>${c.rcs || 25.0} m²</b></div>
          <div class="tt-cell"><span>ARMOR:</span><b>6 HP</b></div>
        </div>
        <div class="tt-footer-desc">Protected commercial transit flight. Rules of Engagement strictly apply.</div>
      `;
    }

    if (type === 'airframe') {
      const a = aircraft[id];
      if (!a) return null;
      const cat = a.category || 'MULTIROLE';
      const rSpeed = rate('speed', a.S_0 || 0.90);
      const rAgi = rate('agility', a.AGI_0 || 0.85);
      const rRadar = rate('radar_range', a.R_0 || 75.0);
      const rRcs = rate('rcs', a.sigma_0 || 1.0);
      const rSlots = rate('pylon_slots', a.totalSlots || 6);
      const rCost = rate('cost_airframe', a.cost || 20.0);
      const rcsTag = (a.sigma_0 <= 0.0005) ? `VLO (${a.sigma_0}m²)` : ((a.sigma_0 < 0.1) ? `LO (${a.sigma_0}m²)` : `${a.sigma_0}m²`);
      const tvcFeature = a.thrustVector ? '3D/2D THRUST VECTORING' : (a.isCoffin ? 'COFFIN SYNTHETIC VISION (+25% DODGE)' : 'CONVENTIONAL CONTROL SURFACES');

      return `
        <div class="tt-header-row"><span class="tt-title">${a.name || id}</span><span class="tt-cost-tag ${rCost.colorClass}">$${Number(a.cost || 0).toFixed(1)}M</span></div>
        <div class="tt-sub-bar"><span class="tt-role-text">${a.role || 'Combat Aircraft'}</span><span class="tt-badge cat-${cat.toLowerCase()}">${cat}</span></div>
        <div class="tt-grid-box">
          <div class="tt-cell"><span>SPEED:</span><b class="${rSpeed.colorClass}">M ${(a.S_0 || 0.90).toFixed(2)}</b></div>
          <div class="tt-cell"><span>AGILITY:</span><b class="${rAgi.colorClass}">${(a.AGI_0 || 0.85).toFixed(2)} (${a.G_limit || 9}G)</b></div>
          <div class="tt-cell"><span>RADAR:</span><b class="${rRadar.colorClass}">${a.R_0 || 75}km</b></div>
          <div class="tt-cell"><span>RCS:</span><b class="${rRcs.colorClass}">${rcsTag}</b></div>
          <div class="tt-cell"><span>STATIONS:</span><b class="${rSlots.colorClass}">${a.totalSlots || 6} (${a.maxPylonRating || 'Type M'})</b></div>
          <div class="tt-cell"><span>ARMOR:</span><b class="stat-tier-2">${a.hp || 4} HP</b></div>
        </div>
        <div class="tt-trait-pill"><b>[${tvcFeature}]</b><br><span style="color:#8494ab;">Scan Cone:</span> <span style="color:#f8fafc;">±${Math.round((a.radarConeDeg || 120)/2)}° &bull; Clutter Filter: +${Math.round((a.lookDownBonus || 0.2)*100)}%</span></div>
        <div class="tt-footer-desc">${a.desc || ''}</div>
      `;
    }

    if (type === 'weapon') {
      const w = weapons[id];
      if (!w) return null;
      return `
        <div class="tt-header-row"><span class="tt-title">${w.name || id}</span><span class="tt-cost-tag">$${Number(w.cost || 0).toFixed(1)}M</span></div>
        <div class="tt-sub-bar"><span class="tt-role-text">${w.seeker || 'Direct Guidance'}</span><span class="tt-badge cat-weapon">${w.category || 'WEAPON'}</span></div>
        <div class="tt-grid-box">
          <div class="tt-cell"><span>RANGE:</span><b>${w.rangeKm || 0}km</b></div>
          <div class="tt-cell"><span>SPEED:</span><b>M ${w.speedMach || '1.0'}</b></div>
          <div class="tt-cell"><span>WARHEAD:</span><b>${w.damage || 0} HP</b></div>
          <div class="tt-cell"><span>PACK:</span><b>${w.ammoCount || 4}x Salvo</b></div>
        </div>
        <div class="tt-trait-pill"><b>[${w.traitBadge || 'TACTICAL'}]</b><br><span>${w.behaviorDesc || w.desc || ''}</span></div>
        <div class="tt-footer-desc">${w.desc || ''}</div>
      `;
    }

    if (type === 'gun') {
      const g = guns[id] || guns['M61A2'];
      if (!g) return null;
      return `
        <div class="tt-header-row"><span class="tt-title">${g.name || id}</span><span class="tt-badge cat-gun">${g.caliber || 'Cannon'}</span></div>
        <div class="tt-grid-box">
          <div class="tt-cell"><span>FIRE RATE:</span><b>${g.rpm || 3000} RPM</b></div>
          <div class="tt-cell"><span>BURST DPS:</span><b>${(g.damagePerSec || 2.5).toFixed(1)} HP/s</b></div>
          <div class="tt-cell"><span>CAPACITY:</span><b>${g.defaultAmmo || 3200} RDS</b></div>
          <div class="tt-cell"><span>RANGE:</span><b>${g.rangeKm || 4.8}km</b></div>
        </div>
        <div class="tt-footer-desc">${g.desc || ''}</div>
      `;
    }

    if (type === 'upgrade') {
      const u = upgrades[id];
      if (!u) return null;
      return `
        <div class="tt-header-row"><span class="tt-title">${u.name || id}</span><span class="tt-cost-tag">$${Number(u.cost || 0).toFixed(1)}M</span></div>
        <div class="tt-grid-box"><div class="tt-cell"><span>MASS:</span><b>+${u.mass || 50} kg</b></div><div class="tt-cell"><span>SOCKET:</span><b>1 Slot</b></div></div>
        <div class="tt-footer-desc">${u.desc || ''}</div>
      `;
    }

    return null;
  }

  openInspectModal(type, id) {
    if (!type || !id) return;
    this.hideTooltip();
    const modal = document.getElementById('system-inspect-modal');
    const titleEl = document.getElementById('inspect-modal-title');
    const bodyEl = document.getElementById('inspect-modal-body');
    if (!modal || !bodyEl || !window.InspectorModalRenderer) return;

    if (window.Game && window.Game.controls) window.Game.controls.autoPauseOnDialogOpen();

    const guns = window.AUTOCANNONS_CATALOG || {};
    const weapons = window.WEAPONS_CATALOG || {};
    const aircraft = window.AIRCRAFT_CATALOG || {};
    const upgrades = window.UPGRADES_CATALOG || {};

    if (type === 'airframe') {
      const a = aircraft[id];
      if (!a) return;
      titleEl.textContent = `AIRFRAME SPECIFICATION - ${(a.name || id).toUpperCase()}`;
      bodyEl.innerHTML = window.InspectorModalRenderer.renderAirframe(a, guns);
      const btn = bodyEl.querySelector('#inspect-btn-req');
      if (btn) btn.onclick = () => { this.pm.addAirframe(a.id); btn.textContent = 'ADDED'; };
      modal.classList.add('active');
      return;
    }

    if (type === 'weapon') {
      const w = weapons[id];
      if (!w) return;
      titleEl.textContent = `ORDNANCE SPECIFICATION - ${(w.name || id).toUpperCase()}`;
      bodyEl.innerHTML = window.InspectorModalRenderer.renderWeapon(w);
      const selBtn = bodyEl.querySelector('#inspect-btn-sel');
      if (selBtn) selBtn.onclick = () => { this.pm.setSelectedItem('weapon', w.id, w.name); modal.classList.remove('active'); };
      modal.classList.add('active');
      return;
    }

    if (type === 'gun') {
      const g = guns[id] || guns['M61A2'];
      if (!g) return;
      titleEl.textContent = `AUTOCANNON SPECIFICATION - ${(g.name || id).toUpperCase()}`;
      bodyEl.innerHTML = window.InspectorModalRenderer.renderGun(g);
      modal.classList.add('active');
      return;
    }

    if (type === 'upgrade') {
      const u = upgrades[id];
      if (!u) return;
      titleEl.textContent = `AVIONICS SUBSYSTEM SPECIFICATION - ${(u.name || id).toUpperCase()}`;
      bodyEl.innerHTML = window.InspectorModalRenderer.renderUpgrade(u);
      const selUpg = bodyEl.querySelector('#inspect-btn-sel-upg');
      if (selUpg) selUpg.onclick = () => { this.pm.setSelectedItem('upgrade', u.id, u.name); modal.classList.remove('active'); };
      modal.classList.add('active');
      return;
    }
  }
}

window.ProcurementInspector = ProcurementInspector;