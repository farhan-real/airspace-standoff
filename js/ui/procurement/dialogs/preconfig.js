/**
 * AIRSPACE STANDOFF // Aircraft Presets Modal Controller
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

    if (typeof PreconfigCardsRenderer !== 'undefined') {
      list.forEach(tpl => {
        const card = PreconfigCardsRenderer.buildCard(tpl, acMap, wpnMap, upgMap, (t) => {
          this.deploy(t);
          document.getElementById('preconfig-aircraft-modal').classList.remove('active');
          if (this.pm.game.controls) this.pm.game.controls.autoUnpauseOnDialogClose();
        }, (t) => {
          this.pm.showConfirmModal('DELETE PRESET', `Are you sure you want to delete configuration "${t.name}"?`, () => {
            this.pm.customLoadouts.deleteTemplate(t.name);
            this.renderGrid();
          });
        });
        if (card) grid.appendChild(card);
      });
    }
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