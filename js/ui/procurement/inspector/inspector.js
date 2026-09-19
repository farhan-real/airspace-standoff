/**
 * AIRSPACE STANDOFF // Inspector Coordinator & Tag-Only Tooltip Engine
 * Mobile inspection is strictly for tags and badges; aircraft cards do not trigger mobile tooltips.
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

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('has-touch');
    }

    // Tap on tag/badge displays its tooltip; tapping anywhere outside closes it
    document.addEventListener('click', (e) => {
      const tagTarget = e.target.closest('[data-tag-tooltip]');
      if (tagTarget) {
        e.stopPropagation();
        const title = tagTarget.getAttribute('data-tag-title') || 'TACTICAL SPECIFICATION';
        const desc = tagTarget.getAttribute('data-tag-tooltip');
        if (desc) {
          const html = `
            <div class="tt-touch-close-bar"><span class="tt-touch-title">TACTICAL DATA</span><button type="button" class="tt-touch-close-btn">[✕ CLOSE]</button></div>
            <div class="tt-header-row"><span class="tt-title">${title}</span></div>
            <div class="tt-footer-desc">${desc}</div>
          `;
          this.showTooltip(html, e, true);
        }
        return;
      }

      if (this.tooltipEl && this.tooltipEl.style.display === 'block') {
        if (!e.target.closest('#hud-floating-tooltip')) this.hideTooltip();
      }
    });

    // Desktop hover events (Mouse Only)
    document.addEventListener('mouseover', (e) => {
      if (document.body.classList.contains('has-touch') && this.tooltipEl.classList.contains('touch-pinned')) return;
      const tagTarget = e.target.closest('[data-tag-tooltip]');
      if (tagTarget) {
        const title = tagTarget.getAttribute('data-tag-title') || 'TACTICAL SPECIFICATION';
        const desc = tagTarget.getAttribute('data-tag-tooltip');
        if (desc) {
          const html = `<div class="tt-header-row"><span class="tt-title">${title}</span></div><div class="tt-footer-desc">${desc}</div>`;
          this.showTooltip(html, e, false);
        }
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.tooltipEl && this.tooltipEl.style.display === 'block' && !this.tooltipEl.classList.contains('touch-pinned')) {
        this.positionTooltip(e);
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (this.tooltipEl && this.tooltipEl.classList.contains('touch-pinned')) return;
      if (e.target.closest('[data-tag-tooltip]')) {
        this.hideTooltip();
      }
    });
  }

  showTooltip(html, e, isTouch = false) {
    if (!this.tooltipEl || !html) return;
    this.tooltipEl.innerHTML = html;
    this.tooltipEl.classList.toggle('touch-pinned', Boolean(isTouch));
    this.tooltipEl.style.display = 'block';
    this.positionTooltip(e);

    const closeBtn = this.tooltipEl.querySelector('.tt-touch-close-btn');
    if (closeBtn) closeBtn.onclick = () => this.hideTooltip();
  }

  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.style.display = 'none';
      this.tooltipEl.classList.remove('touch-pinned');
    }
  }

  positionTooltip(e) {
    if (!this.tooltipEl) return;
    if (document.body.classList.contains('has-touch') && this.tooltipEl.classList.contains('touch-pinned') && window.innerWidth <= 1024) return;
    const pad = 16;
    const tipW = this.tooltipEl.offsetWidth || 340;
    const tipH = this.tooltipEl.offsetHeight || 220;
    let x = (e.clientX || 100) + pad;
    let y = (e.clientY || 100) + pad;
    if (x + tipW > window.innerWidth - 12) x = (e.clientX || 100) - tipW - pad;
    if (y + tipH > window.innerHeight - 12) y = (e.clientY || 100) - tipH - pad;
    this.tooltipEl.style.left = `${Math.round(Math.max(8, Math.min(x, window.innerWidth - tipW - 8)))}px`;
    this.tooltipEl.style.top = `${Math.round(Math.max(8, Math.min(y, window.innerHeight - tipH - 8)))}px`;
  }

  generateLeadBuffHtml(specId) {
    const acMap = window.AIRCRAFT_CATALOG || {};
    const spec = acMap[specId] || { name: specId, category: 'MULTIROLE' };
    const cat = spec.category || 'MULTIROLE';
    const data = (window.LEAD_BUFFS && window.LEAD_BUFFS[cat]) || window.LEAD_BUFFS.MULTIROLE;
    const cellsHtml = data.buffs.map(b => `<div class="tt-cell"><span>${b.label}:</span><b class="stat-tier-1">${b.val}</b></div>`).join('');
    const buffsList = data.buffs.map(b => `<div style="display:flex;justify-content:space-between;gap:6px;border-bottom:1px solid rgba(255,255,255,0.04);padding:2px 0;"><span style="color:#ffd700;font-weight:800;">${b.label}:</span><span style="color:#e2e8f0;text-align:right;">${b.desc}</span></div>`).join('');

    return `
      <div class="tt-header-row"><span class="tt-title" style="color:#ffd700;">FLIGHT LEAD: ${(spec.name || specId).toUpperCase()}</span><span class="tt-badge" style="background:#082846;color:#38bdf8;border:1px solid #0284c7;">FORMATION CENTER</span></div>
      <div class="tt-sub-bar"><span class="tt-role-text" style="color:#fef08a;">${data.role}</span><span class="tt-badge badge-cat-${cat.toLowerCase()}">${cat}</span></div>
      <div class="tt-grid-box">${cellsHtml}</div>
      <div class="tt-trait-pill" style="border-left-color:#00f5a0;background:rgba(0,245,160,0.06);"><b style="color:#00f5a0;">[SURVIVABILITY]</b><br><span style="color:#cbd5e1;">${data.survivability}</span></div>
      <div class="tt-trait-pill" style="border-left-color:#ffd700;background:rgba(255,215,0,0.06);"><b style="color:#ffd700;">[LEAD SUITE: ${data.title}]</b><div style="margin-top:3px;font-size:0.58rem;color:#cbd5e1;">${data.weaknessFixed}</div><div style="margin-top:4px;display:flex;flex-direction:column;gap:1px;">${buffsList}</div></div>
      <div class="tt-footer-desc"><b>FORMATION POSITION:</b> Positioned in central slot. ${data.summary}</div>`;
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
      if (selBtn) selBtn.onclick = () => { this.pm.equipItemDirectly({ type: 'weapon', id: w.id, name: w.name }); modal.classList.remove('active'); };
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
      if (selUpg) selUpg.onclick = () => { this.pm.equipItemDirectly({ type: 'upgrade', id: u.id, name: u.name }); modal.classList.remove('active'); };
      modal.classList.add('active');
    }
  }
}

window.ProcurementInspector = ProcurementInspector;
