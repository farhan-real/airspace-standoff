/**
 * js/ui/procurement/dialogs/preconfig.js - Aircraft Presets Modal Controller with Two-Tier Subcategories.
 */

class PreconfigModalController {
  static SUBCATEGORIES = {
    ALL: [
      { id: 'ALL', label: 'ALL AIRFRAMES', match: () => true },
      { id: 'STEALTH', label: 'STEALTH', match: (t, s) => s.category === 'STEALTH' },
      { id: 'SUPERIORITY', label: 'SUPERIORITY', match: (t, s) => s.category === 'SUPERIORITY' },
      { id: 'MULTIROLE', label: 'MULTIROLE', match: (t, s) => s.category === 'MULTIROLE' },
      { id: 'STRIKE', label: 'STRIKE & CAS', match: (t, s) => s.category === 'STRIKE' },
      { id: 'EW', label: 'EW', match: (t, s) => s.category === 'EW' },
      { id: 'DRONES', label: 'DRONES', match: (t, s) => s.category === 'DRONES' },
      { id: 'EXPERIMENTAL', label: 'EXPERIMENTAL', match: (t, s) => s.category === 'EXPERIMENTAL' },
      { id: 'CUSTOM', label: 'USER PRESETS', match: (t) => t.roleCategory === 'CUSTOM' }
    ],
    'AIR DOMINANCE': [
      { id: 'ALL', label: 'ALL AIR DOMINANCE', match: () => true },
      { id: 'STEALTH', label: 'STEALTH BVR', match: (t, s) => s.category === 'STEALTH' },
      { id: 'SUPERIORITY', label: 'HEAVY SUPERIORITY', match: (t, s) => s.category === 'SUPERIORITY' },
      { id: 'MULTIROLE', label: 'MULTIROLE CAP', match: (t, s) => s.category === 'MULTIROLE' },
      { id: 'EXPERIMENTAL', label: 'EXPERIMENTAL & COFFIN', match: (t, s) => s.category === 'EXPERIMENTAL' }
    ],
    DOGFIGHT: [
      { id: 'ALL', label: 'ALL WVR COMBAT', match: () => true },
      { id: 'SUPERIORITY', label: 'SUPERIORITY', match: (t, s) => s.category === 'SUPERIORITY' },
      { id: 'MULTIROLE', label: 'MULTIROLE', match: (t, s) => s.category === 'MULTIROLE' },
      { id: 'STEALTH', label: 'STEALTH', match: (t, s) => s.category === 'STEALTH' },
      { id: 'EXPERIMENTAL', label: 'EXPERIMENTAL', match: (t, s) => s.category === 'EXPERIMENTAL' }
    ],
    STRIKE: [
      { id: 'ALL', label: 'ALL STRIKE & CAS', match: () => true },
      { id: 'CAS', label: 'CLOSE AIR SUPPORT', match: (t, s) => ['A-10C', 'Su-25SM3', 'Su-39', 'AV-8B-PLUS', 'MiG-27K', 'A-16', 'A-29B', 'JAGUAR-GR3', 'F-16XL'].includes(s.id) },
      { id: 'INTERDICTORS', label: 'TACTICAL INTERDICTORS', match: (t, s) => ['Mirage-2000D', 'JH-7A', 'Su-24M2', 'Tornado-GR4', 'F-111F', 'F-117A', 'F-15E', 'Su-34'].includes(s.id) },
      { id: 'BOMBERS', label: 'HEAVY BOMBERS', match: (t, s) => ['B-52H', 'B-1B', 'Tu-160M', 'B-2A', 'FB-22', 'B-21'].includes(s.id) },
      { id: 'STEALTH', label: 'STEALTH STRIKE', match: (t, s) => s.category === 'STEALTH' },
      { id: 'MULTIROLE', label: 'MULTIROLE STRIKE', match: (t, s) => s.category === 'MULTIROLE' },
      { id: 'SUPERIORITY', label: 'SUPERIORITY STRIKE', match: (t, s) => s.category === 'SUPERIORITY' },
      { id: 'SPECIALS', label: 'UCAV & EXPERIMENTAL', match: (t, s) => s.category === 'DRONES' || s.category === 'EXPERIMENTAL' }
    ],
    'SEAD & EW': [
      { id: 'ALL', label: 'ALL SEAD & EW', match: () => true },
      { id: 'EW', label: 'EW ESCORTS', match: (t, s) => s.category === 'EW' },
      { id: 'STEALTH', label: 'STEALTH SEAD', match: (t, s) => s.category === 'STEALTH' },
      { id: 'MULTIROLE', label: 'MULTIROLE SEAD', match: (t, s) => s.category === 'MULTIROLE' },
      { id: 'SUPERIORITY', label: 'SUPERIORITY SEAD', match: (t, s) => s.category === 'SUPERIORITY' },
      { id: 'STRIKE', label: 'STRIKE SEAD', match: (t, s) => s.category === 'STRIKE' },
      { id: 'SPECIALS', label: 'UCAV & EXPERIMENTAL', match: (t, s) => s.category === 'DRONES' || s.category === 'EXPERIMENTAL' }
    ],
    'SWARM & DRONES': [
      { id: 'ALL', label: 'ALL UAVS', match: () => true },
      { id: 'SWARM', label: 'SWARM MICRO-DRONES', match: (t, s) => ['MQ-99', 'MQ-101'].includes(s.id) },
      { id: 'WINGMAN', label: 'LOYAL WINGMEN', match: (t, s) => ['XQ-58A', 'MQ-28', 'Kizilelma'].includes(s.id) },
      { id: 'HEAVY_UCAV', label: 'HEAVY & RECON UCAV', match: (t, s) => ['S-70', 'MQ-20', 'AKINCI', 'RQ-180'].includes(s.id) }
    ],
    'COFFIN & FLAGSHIPS': [
      { id: 'ALL', label: 'ALL EXPERIMENTAL', match: () => true },
      { id: 'COFFIN', label: 'COFFIN FRAMES', match: (t, s) => Boolean(s.isCoffin) },
      { id: 'SUPERFIGHTERS', label: 'SUPERFIGHTERS', match: (t, s) => !s.isCoffin && ['X-02S', 'ADFX-01', 'CFA-44', 'DARKSTAR', 'X-40', 'XFA-36B'].includes(s.id) },
      { id: 'DEMONSTRATORS', label: 'TECH DEMONSTRATORS', match: (t, s) => !s.isCoffin && ['F-15-SMTD', 'Su-47', 'Su-37', 'X-29A'].includes(s.id) }
    ],
    CUSTOM: [
      { id: 'ALL', label: 'ALL USER PRESETS', match: () => true }
    ]
  };

  constructor(procurementManager) {
    this.pm = procurementManager;
    this.category = 'ALL';
    this.subCategory = 'ALL';
    this.airframe = 'ALL';
    this.search = '';
    this.sort = 'DEFAULT';
    this._listenersBound = false;
  }

  ensureModal() {
    if (document.getElementById('preconfig-aircraft-modal')) return;
    if (window.ModalPanelsTemplates && typeof window.ModalPanelsTemplates.ensure === 'function') {
      window.ModalPanelsTemplates.ensure('preconfig-aircraft-modal');
    }
    this.initListeners();
  }

  initListeners() {
    if (this._listenersBound) return;
    this._listenersBound = true;
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

    const catTabs = document.querySelectorAll('#preconfig-category-tabs .shelf-tab-btn');
    catTabs.forEach(btn => {
      btn.onclick = () => {
        catTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.category = btn.getAttribute('data-pcat') || 'ALL';
        this.subCategory = 'ALL';
        this.renderGrid();
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };
    });
  }

  open() {
    this.ensureModal();
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

  renderSubcategoryPills(categoryTemplates, acMap) {
    const bar = document.getElementById('preconfig-subcat-pills');
    if (!bar) return;
    bar.innerHTML = '';

    const defs = PreconfigModalController.SUBCATEGORIES[this.category];
    if (!defs) throw new Error(`Unknown preconfig category "${this.category}".`);

    const visibleDefs = defs.filter(def => {
      if (def.id === 'ALL') return true;
      return categoryTemplates.some(t => {
        const spec = acMap[t.specId];
        return spec && def.match(t, spec);
      });
    });

    if (visibleDefs.length <= 1) {
      bar.style.display = 'none';
      this.subCategory = 'ALL';
      return;
    }

    bar.style.display = 'flex';
    if (!visibleDefs.some(d => d.id === this.subCategory)) {
      this.subCategory = 'ALL';
    }

    visibleDefs.forEach(def => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `cat-pill-btn ${this.subCategory === def.id ? 'active' : ''}`;
      btn.textContent = def.label;
      btn.onclick = () => {
        this.subCategory = def.id;
        this.renderGrid();
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };
      bar.appendChild(btn);
    });
  }

  renderGrid() {
    this.ensureModal();
    const grid = document.getElementById('preconfig-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const templates = this.pm.customLoadouts.getTemplates();
    const acMap = window.AIRCRAFT_CATALOG || {};
    const wpnMap = window.WEAPONS_CATALOG || {};
    const upgMap = window.UPGRADES_CATALOG || {};

    let categoryList = Object.values(templates);
    if (this.category && this.category !== 'ALL') {
      categoryList = categoryList.filter(t => t.roleCategory === this.category);
    }

    this.renderSubcategoryPills(categoryList, acMap);

    let list = categoryList;
    if (this.subCategory && this.subCategory !== 'ALL') {
      const defs = PreconfigModalController.SUBCATEGORIES[this.category];
      const subDef = defs && defs.find(d => d.id === this.subCategory);
      if (subDef) {
        list = list.filter(t => {
          const spec = acMap[t.specId];
          return spec && subDef.match(t, spec);
        });
      }
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
    const maxUnits = this.pm.game.getMaxSquadronSize();
    if (this.pm.game.procurementSquadron.length >= maxUnits) {
      this.pm.showAlertModal('LIMIT REACHED', `Maximum squadron capacity of ${maxUnits} aircraft reached for the $${this.pm.game.budgetMax.toFixed(0)}M budget tier.`);
      return;
    }
    const pool = window.CALLSIGN_POOL || ['Trigger', 'Mobius', 'Cipher', 'Viper'];
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
