/**
 * AIRSPACE STANDOFF // Procurement Orchestrator
 * Flight Lead selection, custom dropdown management, and auto-persistence.
 */

class ProcurementManager {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.currentTab = 'airframes';
    this.currentAirframeCategory = 'ALL';
    this.searchQuery = '';
    this.selectedItem = null;

    this.preconfigCategory = 'ALL';
    this.preconfigAirframe = 'ALL';
    this.preconfigSearch = '';
    this.preconfigSort = 'DEFAULT';

    this.dialogModal = new TacticalDialogModal(this);
    this.inspector = new ProcurementInspector(this);
    this.shelf = new ProcurementShelf(this);
    this.roster = new ProcurementRoster(this);
    this.customLoadouts = new CustomLoadoutsManager();

    window.openSystemInspectModal = (t, id) => this.inspector.openInspectModal(t, id);
    this.initInspectListeners();
    this.initMobileProcurement();
    this.initPreconfigModalListeners();
    this.initSquadronNameEditor();
    this.initHangarCustomDropdowns();
  }

  showPromptModal(t, m, d, cb) { this.dialogModal.showPrompt(t, m, d, cb); }
  showConfirmModal(t, m, cb) { this.dialogModal.showConfirm(t, m, cb); }
  showAlertModal(t, m) { this.dialogModal.showAlert(t, m); }
  openCallsignPickerModal(sIdx) { this.dialogModal.openCallsignPicker(sIdx); }

  initHangarCustomDropdowns() {
    if (typeof CustomDropdown === 'undefined') return;

    CustomDropdown.setup('cdd-budget', {
      label: 'BUDGET',
      value: this.game.playerBudgetId || 'BUDGET_400',
      options: [
        { value: 'BUDGET_200', text: '200M (1.50x VP)' },
        { value: 'BUDGET_300', text: '300M (1.25x VP)' },
        { value: 'BUDGET_400', text: '400M (1.00x VP)' },
        { value: 'BUDGET_500', text: '500M (0.85x VP)' },
        { value: 'BUDGET_650', text: '650M (0.70x VP)' }
      ],
      onChange: (val) => {
        this.game.setPlayerBudgetTier(val);
      }
    });

    CustomDropdown.setup('cdd-difficulty', {
      label: 'DIFFICULTY',
      value: this.game.aiDifficulty || 'VETERAN',
      options: [
        { value: 'CADET', text: 'CADET (0.6x)' },
        { value: 'VETERAN', text: 'VETERAN (1.0x)' },
        { value: 'ELITE', text: 'ELITE (1.4x)' },
        { value: 'ACE', text: 'ACE (1.8x)' },
        { value: 'MASTER', text: 'MASTER (2.2x)' },
        { value: 'LEGEND', text: 'LEGEND (2.8x)' }
      ],
      onChange: (val) => {
        this.game.aiDifficulty = val;
        this.game.updateModeIndicator();
      }
    });

    CustomDropdown.setup('cdd-doctrine', {
      label: 'DOCTRINE',
      value: this.game.aiDoctrine || 'BALANCED',
      options: [
        { value: 'BALANCED', text: 'BALANCED' },
        { value: 'AGGRESSIVE', text: 'AGGRESSIVE' },
        { value: 'STANDOFF', text: 'STAND-OFF' }
      ],
      onChange: (val) => {
        this.game.aiDoctrine = val;
      }
    });
  }

  setLeadAirframe(sIdx) {
    this.game.procurementSquadron.forEach((item, idx) => {
      item.isLead = (idx === sIdx);
    });
    this.updateUI();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  initSquadronNameEditor() {
    const editBtn = document.getElementById('btn-edit-squadron-name');
    if (editBtn) {
      editBtn.onclick = () => {
        const curName = this.game.squadronName || 'Wardog Squadron';
        this.showPromptModal('CUSTOMIZE SQUADRON DESIGNATION', 'Enter a tactical name for your combat fighter squadron:', curName, (newName) => {
          if (newName && newName.trim()) {
            this.game.setSquadronName(newName.trim());
            if (window.Persistence) window.Persistence.saveSquadronName(newName.trim());
          }
        });
      };
    }
  }

  initPreconfigModalListeners() {
    const modal = document.getElementById('preconfig-aircraft-modal');
    const closeBtn = document.getElementById('btn-close-preconfig');
    if (closeBtn && modal) {
      closeBtn.onclick = () => {
        modal.classList.remove('active');
        if (this.game.controls) this.game.controls.autoUnpauseOnDialogClose();
      };
    }

    const searchInput = document.getElementById('preconfig-search-input');
    if (searchInput) {
      let debounceTimer = null;
      searchInput.oninput = (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.preconfigSearch = (e.target.value || '').toLowerCase();
          this.renderPreconfigCardsGrid();
        }, 120);
      };
    }

    if (typeof CustomDropdown !== 'undefined') {
      CustomDropdown.setup('cdd-preconfig-sort', {
        label: 'SORT',
        value: this.preconfigSort,
        options: [
          { value: 'DEFAULT', text: 'DEFAULT' },
          { value: 'COST_ASC', text: 'COST: LOW TO HIGH' },
          { value: 'COST_DESC', text: 'COST: HIGH TO LOW' },
          { value: 'SPEED', text: 'SPEED: HIGH TO LOW' },
          { value: 'ARMOR', text: 'ARMOR: HIGH TO LOW' }
        ],
        onChange: (val) => {
          this.preconfigSort = val;
          this.renderPreconfigCardsGrid();
        }
      });
    }

    const catPills = document.querySelectorAll('#preconfig-category-pills .cat-pill-btn');
    catPills.forEach(btn => {
      btn.onclick = () => {
        catPills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.preconfigCategory = btn.getAttribute('data-pcat') || 'ALL';
        this.renderPreconfigCardsGrid();
      };
    });
  }

  openPreconfiguredAircraftModal() {
    const modal = document.getElementById('preconfig-aircraft-modal');
    if (!modal) return;
    if (this.game.controls) this.game.controls.autoPauseOnDialogOpen();

    const templates = this.customLoadouts.getTemplates();
    const uniqueSpecs = Array.from(new Set(Object.values(templates).map(t => t.specId))).sort();
    const airframeOpts = [{ value: 'ALL', text: 'ALL AIRFRAMES' }, ...uniqueSpecs.map(sId => ({ value: sId, text: sId }))];

    if (typeof CustomDropdown !== 'undefined') {
      CustomDropdown.setup('cdd-preconfig-airframe', {
        label: 'AIRFRAME',
        value: this.preconfigAirframe,
        options: airframeOpts,
        onChange: (val) => {
          this.preconfigAirframe = val;
          this.renderPreconfigCardsGrid();
        }
      });
    }

    this.renderPreconfigCardsGrid();
    modal.classList.add('active');
  }

  renderPreconfigCardsGrid() {
    const grid = document.getElementById('preconfig-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const templates = this.customLoadouts.getTemplates();
    const acMap = window.AIRCRAFT_CATALOG || {};
    const wpnMap = window.WEAPONS_CATALOG || {};
    const upgMap = window.UPGRADES_CATALOG || {};
    const gunsMap = window.AUTOCANNONS_CATALOG || {};

    const rate = (window.StatEvaluator && typeof window.StatEvaluator.rate === 'function')
      ? window.StatEvaluator.rate : () => ({ tier: 3, colorClass: 'stat-tier-3' });

    let list = Object.values(templates);
    if (this.preconfigCategory && this.preconfigCategory !== 'ALL') {
      list = list.filter(t => t.roleCategory === this.preconfigCategory);
    }
    if (this.preconfigAirframe && this.preconfigAirframe !== 'ALL') {
      list = list.filter(t => t.specId === this.preconfigAirframe);
    }
    if (this.preconfigSearch && this.preconfigSearch.trim()) {
      const q = this.preconfigSearch.trim();
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
      if (this.preconfigSort === 'COST_ASC') return costA - costB;
      if (this.preconfigSort === 'COST_DESC') return costB - costA;
      if (this.preconfigSort === 'SPEED') return (specB.S_0 || 0) - (specA.S_0 || 0);
      if (this.preconfigSort === 'ARMOR') return (specB.hp || 0) - (specA.hp || 0);
      return 0;
    });

    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px 10px; color: #8494ab; font-family: var(--font-mono); font-size: 0.74rem;"><b style="color:#00f0ff;">NO MATCHING PRECONFIGURED LOADOUTS FOUND</b></div>`;
      return;
    }

    list.forEach(tpl => {
      const spec = acMap[tpl.specId];
      if (!spec) return;

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
        return `<span class="pc-item-pill wpn" data-tag-title="${w.name}" data-tag-tooltip="${w.rangeKm}km RNG • ${w.damage} HP DMG • ${w.seeker || 'GUIDED'} • ${w.ammoCount || 4}x Pack">${w.name.split(' ')[0]} (${w.ammoCount || 4}x)</span>`;
      }).join('');

      const upgradesListHtml = (tpl.upgrades || []).map(uId => {
        const u = upgMap[uId];
        if (!u) return '';
        totalCost += Number(u.cost || 0); totalMass += Number(u.mass || 0);
        return `<span class="pc-item-pill upg" data-tag-title="${u.name}" data-tag-tooltip="${u.desc}">[${u.category || 'MOD'}] ${u.name.split(' ')[0]}</span>`;
      }).join('');

      const gunHtml = gun ? `<span class="pc-item-pill gun" data-tag-title="${gun.name}" data-tag-tooltip="${gun.rpm} RPM • ${gun.damagePerSec} HP/s">${gun.name.split(' ')[0]}</span>` : '';
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
          <span class="adc-badge badge-cat-${category.toLowerCase()}">${category}</span>
          <span class="adc-badge" style="background:#091e36;border:1px solid #0284c7;color:#7dd3fc;">${tvcLabel}</span>
          <span class="adc-badge" style="background:#051424;border:1px solid #162a42;color:#94a3b8;">LOAD: ${wrPercent}%</span>
        </div>
        <div class="pc-stats-strip">
          <div class="pc-stat-cell"><span>SPEED</span><b class="${rSpeed.colorClass}">M ${(spec.S_0 || 0.9).toFixed(2)}</b></div>
          <div class="pc-stat-cell"><span>AGI (G)</span><b class="${rAgi.colorClass}">${(spec.AGI_0 || 0.85).toFixed(2)} (${spec.G_limit || 9}G)</b></div>
          <div class="pc-stat-cell"><span>ARMOR</span><b class="${rHp.colorClass}">${spec.hp || 4} HP</b></div>
          <div class="pc-stat-cell"><span>RADAR</span><b class="${rRadar.colorClass}">${spec.R_0 || 75}km</b></div>
          <div class="pc-stat-cell"><span>RCS</span><b class="${rRcs.colorClass}">${rcsTag}</b></div>
          <div class="pc-stat-cell"><span>HARDPOINTS</span><b>${spec.totalSlots || 6} Pylons</b></div>
        </div>
        <div class="pc-loadout-summary">
          <div class="pc-loadout-line"><span class="pc-tag-label">GUN:</span>${gunHtml}</div>
          <div class="pc-loadout-line"><span class="pc-tag-label">WEAPONS:</span>${weaponsListHtml || '<span style="color:#64748b;">NONE</span>'}</div>
          <div class="pc-loadout-line"><span class="pc-tag-label">UPGRADES:</span>${upgradesListHtml || '<span style="color:#64748b;">NONE</span>'}</div>
        </div>
        <div class="pc-desc-box">${tpl.desc || spec.desc || ''}</div>
        <div class="pc-footer">
          <button type="button" class="spec-inspect-btn small" data-inspect-type="airframe" data-inspect-id="${spec.id}">[SPECS]</button>
          <button type="button" class="scramble-btn btn-deploy-tpl" style="padding: 4px 14px; font-size: 0.68rem;">+ DEPLOY TO SQUADRON</button>
        </div>
      `;

      card.querySelector('.btn-deploy-tpl').onclick = () => {
        this.deployPreconfiguredTemplate(tpl);
        document.getElementById('preconfig-aircraft-modal').classList.remove('active');
        if (this.game.controls) this.game.controls.autoUnpauseOnDialogClose();
      };
      grid.appendChild(card);
    });
  }

  deployPreconfiguredTemplate(tpl) {
    const maxUnits = (window.CONFIG && window.CONFIG.MAX_SQUADRON_SIZE) || 16;
    if (this.game.procurementSquadron.length >= maxUnits) {
      this.showAlertModal('MAX CAPACITY', `Squadron capacity of ${maxUnits} units reached!`);
      return;
    }
    const pool = window.CALLSIGN_POOL || ['Trigger', 'Mobius 1', 'Cipher', 'Viper'];
    const assignedCallsign = pool[Math.floor(Math.random() * pool.length)];
    const isFirstCraft = (this.game.procurementSquadron.length === 0);

    this.game.procurementSquadron.push({
      specId: tpl.specId,
      chosenGunId: tpl.chosenGunId || 'M61A2',
      weapons: [...(tpl.weapons || [])],
      upgrades: [...(tpl.upgrades || [])],
      callsign: `${assignedCallsign}`,
      isLead: isFirstCraft
    });
    this.updateUI();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  initMobileProcurement() {
    const btnShelf = document.getElementById('btn-tab-hanger-shelf');
    const btnRoster = document.getElementById('btn-tab-flight-roster');
    const paneShelf = document.getElementById('proc-hanger-shelf');
    const paneRoster = document.getElementById('proc-flight-roster');

    if (btnShelf && btnRoster && paneShelf && paneRoster) {
      btnShelf.onclick = () => {
        btnShelf.classList.add('active'); btnRoster.classList.remove('active');
        paneShelf.classList.remove('mob-hidden'); paneRoster.classList.add('mob-hidden');
      };
      btnRoster.onclick = () => {
        btnRoster.classList.add('active'); btnShelf.classList.remove('active');
        paneRoster.classList.remove('mob-hidden'); paneShelf.classList.add('mob-hidden');
      };
    }
  }

  initInspectListeners() {
    document.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('.gun-inspect-btn, .spec-inspect-btn, .pylon-inspect-btn, .micro-spec-btn') : null;
      if (btn) {
        e.preventDefault(); e.stopPropagation();
        const type = btn.getAttribute('data-inspect-type');
        const id = btn.getAttribute('data-inspect-id');
        if (type && id) this.inspector.openInspectModal(type, id);
      }
    });

    const cBtn = document.getElementById('btn-close-inspect');
    if (cBtn) {
      cBtn.onclick = () => {
        const m = document.getElementById('system-inspect-modal');
        if (m) {
          m.classList.remove('active');
          if (this.game.controls) this.game.controls.autoUnpauseOnDialogClose();
        }
      };
    }
  }

  init() {
    const tabs = document.querySelectorAll('.shelf-tab-btn');
    tabs.forEach(btn => {
      btn.onclick = () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.tab;
        this.renderCatalog();
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };
    });

    const bScramble = document.getElementById('btn-scramble');
    if (bScramble) {
      bScramble.onclick = (e) => {
        e.preventDefault();
        if (this.game.procurementSquadron.length === 0) {
          this.showAlertModal('HANGAR EMPTY', 'Add at least one aircraft or select a doctrine preset before scrambling.');
          return;
        }
        if (this.game.budgetRemaining < 0) {
          this.showAlertModal('BUDGET DEFICIT', `Fleet cost exceeds defense allocation ($${this.game.budgetMax.toFixed(1)}M). Remove ordnance or airframes.`);
          return;
        }
        this.game.scrambleFlight();
      };
    }

    this.renderDoctrinePresetsBar();
    this.renderCatalog();
  }

  renderDoctrinePresetsBar() {
    const presetsContainer = document.getElementById('procurement-presets-bar') || document.querySelector('.procurement-presets');
    if (presetsContainer) ProcurementPresets.renderDoctrineBar(presetsContainer, this);
  }

  setSelectedItem(type, id, name) {
    this.selectedItem = { type: type, id: id, name: name };
    const el = document.getElementById('shelf-instructions');
    if (el) el.textContent = `SELECTED: ${name}. Tap "+ EQUIP" or select Bay.`;

    const catalogEl = document.getElementById('armory-catalog');
    if (catalogEl) {
      const cards = catalogEl.querySelectorAll('.catalog-item-card, .airframe-dense-card');
      cards.forEach(c => {
        const isMatch = (c.dataset.itemId === id && c.dataset.itemType === type);
        c.classList.toggle('selected', isMatch);
      });
    }
  }

  renderCatalog() {
    const catalogEl = document.getElementById('armory-catalog');
    this.shelf.render(catalogEl, this.currentTab, this.currentAirframeCategory, this.searchQuery, this.selectedItem);
  }

  addAirframe(specId) {
    const spec = (window.AIRCRAFT_CATALOG || {})[specId];
    if (!spec) return;
    if (this.game.budgetRemaining < (spec.cost || 0)) {
      this.showAlertModal('INSUFFICIENT BUDGET', `Adding ${spec.name} ($${Number(spec.cost).toFixed(1)}M) exceeds available defense funds!`);
      return;
    }
    const maxUnits = (window.CONFIG && window.CONFIG.MAX_SQUADRON_SIZE) || 16;
    if (this.game.procurementSquadron.length >= maxUnits) {
      this.showAlertModal('MAX CAPACITY', `Maximum squadron capacity of ${maxUnits} airframes reached!`);
      return;
    }
    const isFirst = (this.game.procurementSquadron.length === 0);
    this.game.procurementSquadron.push({
      specId: specId, chosenGunId: spec.builtInGun || 'M61A2', weapons: [], upgrades: [], isLead: isFirst
    });
    this.updateUI();
  }

  cloneAirframe(sIdx) {
    const item = this.game.procurementSquadron[sIdx];
    if (!item) return;
    const maxUnits = (window.CONFIG && window.CONFIG.MAX_SQUADRON_SIZE) || 16;
    if (this.game.procurementSquadron.length >= maxUnits) {
      this.showAlertModal('MAX CAPACITY', `Maximum squadron capacity of ${maxUnits} reached!`);
      return;
    }
    this.game.procurementSquadron.push({
      specId: item.specId, chosenGunId: item.chosenGunId, weapons: [...item.weapons], upgrades: [...item.upgrades], isLead: false
    });
    this.updateUI();
  }

  equipItemDataToSquadron(sIdx, itemData) {
    const item = this.game.procurementSquadron[sIdx];
    if (!item) return;

    if (itemData.type === 'gun') {
      const spec = (window.AIRCRAFT_CATALOG || {})[item.specId];
      if (spec && spec.allowedGuns && !spec.allowedGuns.includes(itemData.id)) {
        this.showAlertModal('INCOMPATIBLE AUTOCANNON', `${itemData.name} cannot be mounted on this airframe.`);
        return;
      }
      item.chosenGunId = itemData.id;
    } else if (itemData.type === 'weapon') {
      const wpn = (window.WEAPONS_CATALOG || {})[itemData.id];
      const spec = (window.AIRCRAFT_CATALOG || {})[item.specId];
      if (!wpn || !spec) return;
      const curSlots = item.weapons.reduce((sum, wId) => sum + ((window.WEAPONS_CATALOG[wId] || {}).slots || 1), 0);
      if (curSlots + (wpn.slots || 1) > (spec.totalSlots || 6)) {
        this.showAlertModal('HARDPOINTS FULL', `Mounting ${wpn.name} exceeds available stations on this craft.`);
        return;
      }
      item.weapons.push(itemData.id);
    } else if (itemData.type === 'upgrade') {
      const specU = (window.AIRCRAFT_CATALOG || {})[item.specId];
      if (item.upgrades.length >= (specU.upgradeSockets || 3)) {
        this.showAlertModal('SOCKETS FULL', 'All available modular component sockets are filled on this airframe.');
        return;
      }
      if (item.upgrades.includes(itemData.id)) {
        this.showAlertModal('ALREADY INSTALLED', 'This component is already mounted on this airframe.');
        return;
      }
      item.upgrades.push(itemData.id);
    }
    this.updateUI();
  }

  equipSelectedToSquadron(sIdx) {
    if (!this.selectedItem) {
      this.showAlertModal('NO SELECTION', 'Select an autocannon, weapon, or component from the catalog first.');
      return;
    }
    this.equipItemDataToSquadron(sIdx, this.selectedItem);
  }

  applyBuiltinPreset(type) {
    this.game.procurementSquadron = ProcurementPresets.getBuiltinPreset(type);
    if (this.game.procurementSquadron.length > 0 && !this.game.procurementSquadron.some(it => it && it.isLead)) {
      this.game.procurementSquadron[0].isLead = true;
    }
    this.updateUI();
  }

  applyCustomPreset(name) {
    const data = this.customLoadouts.load(name);
    if (data) {
      this.game.procurementSquadron = data;
      if (this.game.procurementSquadron.length > 0 && !this.game.procurementSquadron.some(it => it && it.isLead)) {
        this.game.procurementSquadron[0].isLead = true;
      }
      this.updateUI();
    }
  }

  clearSquadron() {
    this.game.procurementSquadron = [];
    this.updateUI();
  }

  updateUI() {
    const rosterEl = document.getElementById('squadron-list');
    const budgetEl = document.getElementById('budget-counter');
    const fleetEl = document.getElementById('fleet-count');
    const scrambleBtn = document.getElementById('btn-scramble');

    this.renderDoctrinePresetsBar();
    this.roster.render(rosterEl, this.game.procurementSquadron, budgetEl, fleetEl, scrambleBtn);

    const mobCount = document.getElementById('mob-roster-count');
    if (mobCount) mobCount.textContent = this.game.procurementSquadron.length;

    const dispSqName = document.getElementById('display-squadron-name');
    if (dispSqName) dispSqName.textContent = this.game.squadronName || 'Wardog Squadron';

    if (window.Persistence && this.game.procurementSquadron.length > 0) {
      window.Persistence.saveLastSquadron(this.game.procurementSquadron);
      window.Persistence.saveSquadronName(this.game.squadronName);
    }
  }
}

window.ProcurementManager = ProcurementManager;