/**
 * AIRSPACE STANDOFF: Procurement Specifications Coordinator & Tag-Only Tooltip Engine
 * Manages spec modal views for airframes, weapons, autocannons, and modular components in the hangar.
 */

class ProcurementSpecs {
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

    document.addEventListener('click', (e) => {
      const tagTarget = e.target.closest('[data-tag-tooltip]');
      if (tagTarget) {
        e.stopPropagation();
        const title = tagTarget.getAttribute('data-tag-title') || 'TACTICAL SPECIFICATION';
        const desc = tagTarget.getAttribute('data-tag-tooltip');
        if (desc) {
          const html = `
            <div class="tt-touch-close-bar">
              <span class="tt-touch-title">TACTICAL DATA</span>
              <button type="button" class="tt-touch-close-btn"><img src="icons/close.svg" width="9" height="9" alt="Close" style="vertical-align:middle;margin-right:2px;"> CLOSE</button>
            </div>
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

  openInspectModal(type, id) {
    if (!type || !id) return;
    this.hideTooltip();
    const modal = document.getElementById('system-inspect-modal');
    const titleEl = document.getElementById('inspect-modal-title');
    const bodyEl = document.getElementById('inspect-modal-body');
    const renderer = window.SpecsModalRenderer || window.InspectorModalRenderer;
    if (!modal || !bodyEl || !renderer) return;

    if (window.Game && window.Game.controls) window.Game.controls.autoPauseOnDialogOpen();

    const guns = window.AUTOCANNONS_CATALOG || {};
    const weapons = window.WEAPONS_CATALOG || {};
    const aircraft = window.AIRCRAFT_CATALOG || {};
    const upgrades = window.UPGRADES_CATALOG || {};

    if (type === 'airframe') {
      const a = aircraft[id];
      if (!a) return;
      titleEl.textContent = `AIRFRAME SPECIFICATION - ${(a.name || id).toUpperCase()}`;
      bodyEl.innerHTML = renderer.renderAirframe(a, guns);
      const btn = bodyEl.querySelector('#inspect-btn-req');
      if (btn) btn.onclick = () => { this.pm.addAirframe(a.id); btn.textContent = 'ADDED'; };
      modal.classList.add('active');
      return;
    }
    if (type === 'weapon') {
      const w = weapons[id];
      if (!w) return;
      titleEl.textContent = `ORDNANCE SPECIFICATION - ${(w.name || id).toUpperCase()}`;
      bodyEl.innerHTML = renderer.renderWeapon(w);
      const selBtn = bodyEl.querySelector('#inspect-btn-sel');
      if (selBtn) selBtn.onclick = () => { this.pm.equipItemDirectly({ type: 'weapon', id: w.id, name: w.name }); modal.classList.remove('active'); };
      modal.classList.add('active');
      return;
    }
    if (type === 'gun') {
      const g = guns[id] || guns['M61A2'];
      if (!g) return;
      titleEl.textContent = `AUTOCANNON SPECIFICATION - ${(g.name || id).toUpperCase()}`;
      bodyEl.innerHTML = renderer.renderGun(g);
      modal.classList.add('active');
      return;
    }
    if (type === 'upgrade') {
      const u = upgrades[id];
      if (!u) return;
      titleEl.textContent = `AVIONICS SUBSYSTEM SPECIFICATION - ${(u.name || id).toUpperCase()}`;
      bodyEl.innerHTML = renderer.renderUpgrade(u);
      const selUpg = bodyEl.querySelector('#inspect-btn-sel-upg');
      if (selUpg) selUpg.onclick = () => { this.pm.equipItemDirectly({ type: 'upgrade', id: u.id, name: u.name }); modal.classList.remove('active'); };
      modal.classList.add('active');
    }
  }
}

window.ProcurementSpecs = ProcurementSpecs;
window.ProcurementInspector = ProcurementSpecs;