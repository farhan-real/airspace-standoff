/**
 * AIRSPACE STANDOFF: Procurement Orchestrator
 */

class ProcurementManager {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.currentTab = 'airframes';
    this.currentAirframeCategory = 'ALL';
    this.searchQuery = '';
    this.activeBayIndex = 0;

    this.dialogModal = new TacticalDialogModal(this);
    this.inspector = new ProcurementInspector(this);
    this.shelf = new ProcurementShelf(this);
    this.roster = new ProcurementRoster(this);
    this.customLoadouts = new CustomLoadoutsManager();
    this.preconfigModal = new PreconfigModalController(this);
    this.equipHandler = (typeof ProcurementEquipHandler !== 'undefined') ? new ProcurementEquipHandler(this) : null;

    window.openSystemInspectModal = (t, id) => this.inspector.openInspectModal(t, id);
    this.initInspectListeners();
    this.initMobileProcurement();
    this.initSquadronNameEditor();
    this.initHangarCustomDropdowns();
  }

  showPromptModal(t, m, d, cb) { this.dialogModal.showPrompt(t, m, d, cb); }
  showConfirmModal(t, m, cb, o) { this.dialogModal.showConfirm(t, m, cb, o); }
  showAlertModal(t, m) { this.dialogModal.showAlert(t, m); }
  openCallsignPickerModal(sIdx) { this.dialogModal.openCallsignPicker(sIdx); }
  openPreconfiguredAircraftModal() { this.preconfigModal.open(); }

  initHangarCustomDropdowns() {
    if (typeof CustomDropdown === 'undefined') return;

    CustomDropdown.setup('cdd-budget', {
      label: 'BUDGET',
      value: this.game.playerBudgetId || 'BUDGET_400',
      options: [
        { value: 'BUDGET_200', text: '200M (1.75x)' },
        { value: 'BUDGET_300', text: '300M (1.30x)' },
        { value: 'BUDGET_400', text: '400M (1.00x)' },
        { value: 'BUDGET_500', text: '500M (0.80x)' },
        { value: 'BUDGET_650', text: '650M (0.60x)' }
      ],
      onChange: (val) => this.game.setPlayerBudgetTier(val)
    });

    CustomDropdown.setup('cdd-difficulty', {
      label: 'DIFFICULTY',
      value: this.game.aiDifficulty || 'VETERAN',
      options: [
        { value: 'CADET', text: 'PERMISSIVE SECTOR (0.50x)' },
        { value: 'VETERAN', text: 'CONTESTED AIRSPACE (1.00x)' },
        { value: 'ELITE', text: 'ACTIVE COMBAT ZONE (1.50x)' },
        { value: 'ACE', text: 'HIGH-THREAT GRID (2.00x)' },
        { value: 'MASTER', text: 'AIR DENIAL ZONE (2.60x)' },
        { value: 'LEGEND', text: 'FORTRESS AIRSPACE (3.20x)' }
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
      onChange: (val) => { this.game.aiDoctrine = val; }
    });
  }

  setLeadAirframe(sIdx) {
    this.game.procurementSquadron.forEach((item, idx) => { item.isLead = (idx === sIdx); });
    this.activeBayIndex = sIdx;
    this.updateUI();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  saveSquadronBayConfig(sIdx, callback) {
    const item = this.game.procurementSquadron[sIdx];
    if (!item) return;
    const spec = (window.AIRCRAFT_CATALOG || {})[item.specId] || {};
    const defName = `${item.callsign || spec.name} Config`;

    this.showPromptModal('SAVE PRESET', `Save Aircraft #${sIdx + 1} configuration as a preset:`, defName, (name) => {
      if (name && name.trim()) {
        this.customLoadouts.saveTemplate(name.trim(), {
          name: name.trim(), specId: item.specId, roleCategory: 'CUSTOM', chosenGunId: item.chosenGunId || 'M61A2',
          weapons: [...(item.weapons || [])], upgrades: [...(item.upgrades || [])],
          desc: `User configuration based on ${spec.name} (${item.callsign}).`
        });
        this.showAlertModal('PRESET SAVED', `Configuration "${name.trim()}" saved to preset library.`);
        if (callback) callback();
      }
    });
  }

  initSquadronNameEditor() {
    const editBtn = document.getElementById('btn-edit-squadron-name');
    if (editBtn) {
      editBtn.onclick = () => {
        let curName = this.game.squadronName || '7th Tactical Squadron';
        if (curName.toLowerCase().includes('wardog')) curName = '7th Tactical Squadron';
        this.showPromptModal('RENAME SQUADRON', 'Enter a name for your squadron:', curName, (newName) => {
          if (newName && newName.trim()) {
            this.game.setSquadronName(newName.trim());
            if (window.Persistence) window.Persistence.saveSquadronName(newName.trim());
          }
        });
      };
    }
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
      const btn = e.target.closest('.gun-inspect-btn, .spec-inspect-btn, .pylon-inspect-btn, .micro-spec-btn');
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
          this.showAlertModal('EMPTY SQUADRON', 'Add at least one aircraft to your squadron before launching the mission.');
          return;
        }
        if (this.game.budgetRemaining < 0) {
          this.showAlertModal('OVER BUDGET', `Total cost exceeds available budget ($${this.game.budgetMax.toFixed(1)}M). Adjust aircraft or weapons.`);
          return;
        }

        this.showConfirmModal(
          'COMMENCE MISSION',
          `Launch mission with ${this.game.procurementSquadron.length} aircraft?`,
          () => this.game.scrambleFlight(),
          { confirmText: 'LAUNCH MISSION', isAlert: false }
        );
      };
    }

    this.renderDoctrinePresetsBar();
    this.renderCatalog();
  }

  renderDoctrinePresetsBar() {
    const presetsContainer = document.getElementById('procurement-presets-bar') || document.querySelector('.procurement-presets');
    if (presetsContainer) ProcurementPresets.renderDoctrineBar(presetsContainer, this);
  }

  renderCatalog() {
    const catalogEl = document.getElementById('armory-catalog');
    this.shelf.render(catalogEl, this.currentTab, this.currentAirframeCategory, this.searchQuery);
  }

  equipItemDirectly(itemData) {
    if (this.equipHandler) this.equipHandler.equipItemDirectly(itemData);
  }

  addAirframe(specId) {
    if (this.equipHandler) this.equipHandler.addAirframe(specId);
  }

  cloneAirframe(sIdx) {
    if (this.equipHandler) this.equipHandler.cloneAirframe(sIdx);
  }

  equipItemDataToSquadron(sIdx, itemData, targetStation = null) {
    if (this.equipHandler) this.equipHandler.equipItemDataToSquadron(sIdx, itemData, targetStation);
  }

  applyBuiltinPreset(type) {
    this.game.procurementSquadron = ProcurementPresets.getBuiltinPreset(type);
    if (this.game.procurementSquadron.length > 0 && !this.game.procurementSquadron.some(it => it && it.isLead)) {
      this.game.procurementSquadron[0].isLead = true;
    }
    this.activeBayIndex = 0;
    this.updateUI();
    this.renderCatalog();
  }

  applyCustomPreset(name) {
    const data = this.customLoadouts.load(name);
    if (data) {
      this.game.procurementSquadron = data;
      if (this.game.procurementSquadron.length > 0 && !this.game.procurementSquadron.some(it => it && it.isLead)) {
        this.game.procurementSquadron[0].isLead = true;
      }
      this.activeBayIndex = 0;
      this.updateUI();
      this.renderCatalog();
    }
  }

  clearSquadron() {
    this.game.procurementSquadron = [];
    this.activeBayIndex = 0;
    this.updateUI();
    this.renderCatalog();
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

    let cleanName = this.game.squadronName || '7th Tactical Squadron';
    if (cleanName.toLowerCase().includes('wardog')) cleanName = '7th Tactical Squadron';
    this.game.squadronName = cleanName;

    const dispSqName = document.getElementById('display-squadron-name');
    if (dispSqName) dispSqName.textContent = cleanName;

    if (this.shelf) this.shelf.syncActiveAircraft();

    if (window.Persistence && this.game.procurementSquadron.length > 0) {
      window.Persistence.saveLastSquadron(this.game.procurementSquadron);
      window.Persistence.saveSquadronName(cleanName);
    }
  }
}

window.ProcurementManager = ProcurementManager;