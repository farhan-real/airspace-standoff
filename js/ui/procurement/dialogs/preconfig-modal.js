/**
 * AIRSPACE STANDOFF // Aircraft Presets Modal Controller
 * Clean military operational roles and presets.
 */

class PreconfigModalController {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this.category = 'ALL';
    this.airframe = 'ALL';
    this.search = '';
    this.sort = 'DEFAULT';
    this.initListeners();
  }

  initListeners() {
    const modal = document.getElementById('preconfig-aircraft-modal');
    const closeBtn = document.getElementById('btn-close-preconfig');
    if (closeBtn && modal) {
      closeBtn.onclick = () => {
        modal.classList.remove('active');
        if (this.pm.game.controls) this.pm.game.controls.autoUnpauseOnDialogClose();
      };
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          if (this.pm.game.controls) this.pm.game.controls.autoUnpauseOnDialogClose();
        }
      });
    }

    const searchInput = document.getElementById('preconfig-search-input');
    if (searchInput) {
      let debounceTimer = null;
      searchInput.oninput = (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.search = (e.target.value || '').toLowerCase();
          this.renderGrid();
        }, 120);
      };
    }

    const saveCurrentBtn = document.getElementById('btn-save-current-to-templates');
    if (saveCurrentBtn) {
      saveCurrentBtn.onclick = () => {
        if (!this.pm.game.procurementSquadron || this.pm.game.procurementSquadron.length === 0) {
          this.pm.showAlertModal('NO AIRCRAFT', 'Add an aircraft to your squadron before saving a preset.');
          return;
        }
        const sIdx = this.pm.activeBayIndex || 0;
        this.pm.saveSquadronBayConfig(sIdx, () => this.renderGrid());
      };
    }

    if (typeof CustomDropdown !== 'undefined') {
      CustomDropdown.setup('cdd-preconfig-sort', {
        label: 'SORT',
        value: this.sort,
        options: [
          { value: 'DEFAULT', text: 'DEFAULT' },
          { value: 'COST_ASC', text: 'COST: LOW TO HIGH' },
          { value: 'COST_DESC', text: 'COST: HIGH TO LOW' },
          { value: 'SPEED', text: 'SPEED: HIGH TO LOW' },
          { value: 'ARMOR', text: 'ARMOR: HIGH TO LOW' }
        ],
        onChange: (val) => {
          this.sort = val;
          this.renderGrid();
        }
      });
    }

    const catPills = document.querySelectorAll('#preconfig-category-pills .cat-pill-btn');
    catPills.forEach(btn => {
      btn.onclick = () => {
        catPills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.category = btn.getAttribute('data-pcat') || 'ALL';
        this.renderGrid();
      };
    });
  }

  open() {
    const modal = document.getElementById('preconfig-aircraft-modal');
    if (!modal) return;
    if (this.pm.game.controls) this.pm.game.controls.autoPauseOnDialogOpen();

    const templates = this.pm.customLoadouts.getTemplates();
    const uniqueSpecs = Array.from(new Set(Object.values(templates).map(t => t.specId))).sort();
    const airframeOpts = [{ value: 'ALL', text: 'ALL AIRCRAFT' }, ...uniqueSpecs.map(sId => ({ value: sId, text: sId }))];

    if (typeof CustomDropdown !== 'undefined') {
      CustomDropdown.setup('cdd-preconfig-airframe', {
        label: 'AIRCRAFT',
        value: this.airframe,
        options: airframeOpts,
        onChange: (val) => {
          this.airframe = val;
          this.renderGrid();
        }
      });
    }

    this.renderGrid();
    modal.classList.add('active');
  }

  renderGrid() {
    const grid = document.getElementById('preconfig-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const templates = this.pm.customLoadouts.getTemplates();
    const acMap = window.AIRCRAFT_CATALOG || {};
    const wpnMap = window.WEAPONS_CATALOG || {};
    const upgMap = window.UPGRADES_CATALOG || {};
    const gunsMap = window.AUTOCANNONS_CATALOG || {};

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    let list = Object.values(templates);
    if (this.category && this.category !== 'ALL') {
      list = list.filter(t => t.roleCategory === this.category);
    }
    if (this.airframe && this.airframe !== 'ALL') {
      list = list.filter(t => t.specId === this.airframe);
    }
    if (this.search && this.search.trim()) {
      const q = this.search.trim();
      list = list.filter(t => {
        const spec = acMap[t.specId] || {};
        const haystack = [t.name, t.specId, t.roleCategory, t.desc, spec.name, spec.role, spec.category, t.chosenGunId, ...(t.weapons || []), ...(t.upgrades || [])].join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }

    list.sort((a, b) => {
      const specA = acMap[a.specId] || {};
      const specB = acMap[b.specId] || {};
      const costA = (specA.cost || 0) + (a.weapons || []).reduce((s, w) => s + ((wpnMap[w] || {}).cost || 0), 0) + (a.upgrades || []).reduce((s, u) => s + ((upgMap[u] || {}).cost || 0), 0);
      const costB = (specB.cost || 0) + (b.weapons || []).reduce((s, w) => s + ((wpnMap[w] || {}).cost || 0), 0) + (b.upgrades || []).reduce((s, u) => s + ((upgMap[u] || {}).cost || 0), 0);
      if (this.sort === 'COST_ASC') return costA - costB;
      if (this.sort === 'COST_DESC') return costB - costA;
      if (this.sort === 'SPEED') return (specB.S_0 || 0) - (specA.S_0 || 0);
      if (this.sort === 'ARMOR') return (specB.hp || 0) - (specA.hp || 0);
      return 0;
    });

    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px 10px; color: #8494ab; font-family: var(--font-mono); font-size: 0.74rem;"><b style="color:#00f0ff;">NO PRESETS MATCH THE SELECTED FILTER</b></div>`;
      return;
    }

    list.forEach(tpl => {
      const spec = acMap[tpl.specId];
      if (!spec) return;

      const isCustom = (tpl.roleCategory === 'CUSTOM');
      const card = document.createElement('div');
      const category = spec.category || 'MULTIROLE';
      card.className = `preconfig-card cat-${category.toLowerCase()}`;

      let totalCost = Number(spec.cost || 0);
      let totalMass = 100;
      const gun = gunsMap[tpl.chosenGunId] || gunsMap[spec.builtInGun] || gunsMap['M61A2'];
      if (gun) totalMass += gun.mass || 0;

      const weaponsListHtml = (tpl.weapons || []).map(wId => {
        const w = wpnMap[wId];
        if (!w) return '';
        totalCost += Number(w.cost || 0); totalMass += Number(w.mass || 0);
        return `<span class="pc-item-pill wpn" data-tag-title="${w.name}" data-tag-tooltip="${w.rangeKm}km range &bull; ${w.damage} HP damage &bull; ${w.seeker || 'GUIDED'} &bull; ${w.ammoCount || 4}x count">${w.name.split(' ')[0]} (${w.ammoCount || 4}x)</span>`;
      }).join('');

      const upgradesListHtml = (tpl.upgrades || []).map(uId => {
        const u = upgMap[uId];
        if (!u) return '';
        totalCost += Number(u.cost || 0); totalMass += Number(u.mass || 0);
        return `<span class="pc-item-pill upg" data-tag-title="${u.name}" data-tag-tooltip="${u.desc}">[${u.category || 'SYSTEM'}] ${u.name.split(' ')[0]}</span>`;
      }).join('');

      const gunHtml = gun ? `<span class="pc-item-pill gun" data-tag-title="${gun.name}" data-tag-tooltip="${gun.rpm} RPM &bull; ${gun.damagePerSec} HP/s">${gun.name.split(' ')[0]}</span>` : '';
      const maxMass = spec.M_max || 5000;
      const wrPercent = Math.round(Math.min(1.0, totalMass / maxMass) * 100);

      const rSpeed = rate('speed', spec.S_0 || 0.90);
      const rAgi = rate('agility', spec.AGI_0 || 0.85);
      const rHp = rate('hp', spec.hp || 4);
      const rRadar = rate('radar_range', spec.R_0 || 75.0);
      const rRcs = rate('rcs', spec.sigma_0 || 1.0);
      const rCost = rate('cost_airframe', totalCost);
      const tvcLabel = spec.thrustVector ? '3D TVC' : (spec.isCoffin ? 'COFFIN' : 'AERO');
      const rcsTag = (spec.sigma_0 <= 0.0005) ? `VLO` : ((spec.sigma_0 < 0.1) ? `LO` : `${spec.sigma_0}m²`);

      card.innerHTML = `
        <div class="pc-top-row">
          <div class="pc-title-group">
            <div class="pc-template-name">${tpl.name}</div>
            <div class="pc-spec-name">${spec.name} &bull; ${spec.role}</div>
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

      card.querySelector('.btn-deploy-tpl').onclick = () => {
        this.deploy(tpl);
        document.getElementById('preconfig-aircraft-modal').classList.remove('active');
        if (this.pm.game.controls) this.pm.game.controls.autoUnpauseOnDialogClose();
      };

      const delBtn = card.querySelector('.btn-delete-tpl');
      if (delBtn) {
        delBtn.onclick = (e) => {
          e.stopPropagation();
          this.pm.showConfirmModal('DELETE PRESET', `Are you sure you want to delete configuration "${tpl.name}"?`, () => {
            this.pm.customLoadouts.deleteTemplate(tpl.name);
            this.renderGrid();
          });
        };
      }

      grid.appendChild(card);
    });
  }

  deploy(tpl) {
    const maxUnits = (window.CONFIG && window.CONFIG.MAX_SQUADRON_SIZE) || 16;
    if (this.pm.game.procurementSquadron.length >= maxUnits) {
      this.pm.showAlertModal('LIMIT REACHED', `Maximum squadron capacity of ${maxUnits} aircraft reached.`);
      return;
    }
    const pool = window.CALLSIGN_POOL || ['Trigger', 'Mobius 1', 'Cipher', 'Viper'];
    const assignedCallsign = pool[Math.floor(Math.random() * pool.length)];
    const isFirstCraft = (this.pm.game.procurementSquadron.length === 0);

    this.pm.game.procurementSquadron.push({
      specId: tpl.specId,
      chosenGunId: tpl.chosenGunId || 'M61A2',
      weapons: [...(tpl.weapons || [])],
      upgrades: [...(tpl.upgrades || [])],
      callsign: `${assignedCallsign}`,
      isLead: isFirstCraft
    });
    this.pm.activeBayIndex = this.pm.game.procurementSquadron.length - 1;
    this.pm.updateUI();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }
}

window.PreconfigModalController = PreconfigModalController;
