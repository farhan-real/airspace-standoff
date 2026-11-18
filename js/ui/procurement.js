/**
 * AIRSPACE STANDOFF: Procurement Orchestrator
 */

class ProcurementManager {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.currentTab = 'airframes';
    this.currentAirframeCategory = 'ALL';
    this.currentA2GCategory = 'ALL';
    this.searchQuery = '';
    this.activeBayIndex = 0;
    this._isUpdatingUI = false;

    this.dialogModal = new DialogModal(this);
    this.specs = new ProcurementSpecs(this);
    this.shelf = new ProcurementShelf(this);
    this.roster = new ProcurementRoster(this);
    this.customLoadouts = new CustomLoadoutsManager();
    this.preconfigModal = new PreconfigModalController(this);
    this.equipHandler = (typeof ProcurementEquipHandler !== 'undefined') ? new ProcurementEquipHandler(this) : null;

    window.openSystemInspectModal = (t, id) => this.specs.openInspectModal(t, id);
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

  getAirDifficultyOptions() {
    return Object.entries(window.AI_DIFFICULTIES || {}).map(([key, d]) => ({
      value: key,
      text: `${d.name.toUpperCase()} (${d.scoreMultiplier.toFixed(2)}x)`
    }));
  }

  getAttackDifficultyOptions() {
    return Object.entries(window.ATTACK_DIFFICULTIES || {}).map(([key, d]) => ({
      value: key,
      text: `${d.name.toUpperCase()} (${d.scoreMultiplier.toFixed(2)}x)`
    }));
  }

  getAirDoctrineOptions() {
    return [
      { value: 'BALANCED', text: 'BALANCED' },
      { value: 'AGGRESSIVE', text: 'AGGRESSIVE' },
      { value: 'STANDOFF', text: 'STAND-OFF' }
    ];
  }

  getAttackDoctrineOptions() {
    return Object.entries(window.ATTACK_DOCTRINES || {}).map(([key, d]) => ({
      value: key,
      text: d.name
    }));
  }

  initHangarCustomDropdowns() {
    if (typeof CustomDropdown === 'undefined') return;

    CustomDropdown.setup('cdd-gamemode', {
      label: 'MODE',
      value: this.game.gameMode || 'SP_SKIRMISH',
      options: [
        { value: 'SP_SKIRMISH', text: 'SINGLE PLAYER SKIRMISH' },
        { value: 'TP_SKIRMISH', text: 'TWO PLAYER SKIRMISH' },
        { value: 'SP_DYNAMIC', text: 'SINGLE PLAYER DYNAMIC' },
        { value: 'SP_ATTACK', text: 'SINGLE PLAYER ATTACK' }
      ],
      onChange: (val) => this.game.setGameMode(val)
    });

    CustomDropdown.setup('cdd-budget', {
      label: 'BUDGET',
      value: this.game.playerBudgetId || 'BUDGET_400',
      options: [
        { value: 'BUDGET_200', text: '200M (1.75x)' },
        { value: 'BUDGET_300', text: '300M (1.30x)' },
        { value: 'BUDGET_400', text: '400M (1.00x)' },
        { value: 'BUDGET_500', text: '500M (0.80x)' },
        { value: 'BUDGET_650', text: '650M (0.60x)' },
        { value: 'BUDGET_750', text: '750M (0.55x)' },
        { value: 'BUDGET_800', text: '800M (0.50x)' },
        { value: 'BUDGET_900', text: '900M (0.45x)' },
        { value: 'BUDGET_1000', text: '1000M (0.40x)' }
      ],
      onChange: (val) => this.game.setPlayerBudgetTier(val)
    });

    const isAttack = (this.game.scenarioMode === 'ATTACK');
    CustomDropdown.setup('cdd-difficulty', {
      label: 'DIFFICULTY',
      value: isAttack ? (this.game.attackDifficulty || 'FORWARD_GARRISON') : (this.game.aiDifficulty || 'VETERAN'),
      options: isAttack ? this.getAttackDifficultyOptions() : this.getAirDifficultyOptions(),
      onChange: (val) => {
        if (this.game.scenarioMode === 'ATTACK') this.game.attackDifficulty = val;
        else this.game.aiDifficulty = val;
        this.game.updateModeIndicator();
        this.game.saveGameplaySettings();
      }
    });

    CustomDropdown.setup('cdd-doctrine', {
      label: 'DOCTRINE',
      value: isAttack ? (this.game.attackDoctrine || 'BALANCED') : (this.game.aiDoctrine || 'BALANCED'),
      options: isAttack ? this.getAttackDoctrineOptions() : this.getAirDoctrineOptions(),
      onChange: (val) => {
        if (this.game.scenarioMode === 'ATTACK') this.game.attackDoctrine = val;
        else this.game.aiDoctrine = val;
        this.game.saveGameplaySettings();
      }
    });
  }

  syncModeDropdowns() {
    if (typeof CustomDropdown === 'undefined') return;
    const modeCdd = CustomDropdown.get('cdd-gamemode');
    if (modeCdd && modeCdd.getValue() !== this.game.gameMode) {
      modeCdd.setValue(this.game.gameMode, false);
    }

    const isAttack = (this.game.scenarioMode === 'ATTACK');
    const diffCdd = CustomDropdown.get('cdd-difficulty');
    if (diffCdd) {
      diffCdd.setOptions(
        isAttack ? this.getAttackDifficultyOptions() : this.getAirDifficultyOptions(),
        isAttack ? (this.game.attackDifficulty || 'FORWARD_GARRISON') : (this.game.aiDifficulty || 'VETERAN')
      );
    }

    const docCdd = CustomDropdown.get('cdd-doctrine');
    if (docCdd) {
      docCdd.setOptions(
        isAttack ? this.getAttackDoctrineOptions() : this.getAirDoctrineOptions(),
        isAttack ? (this.game.attackDoctrine || 'BALANCED') : (this.game.aiDoctrine || 'BALANCED')
      );
    }
  }

  setLeadAirframe(sIdx) {
    if (typeof ProcurementActionDispatcher !== 'undefined') ProcurementActionDispatcher.setLeadAirframe(this, sIdx);
  }

  saveSquadronBayConfig(sIdx, callback) {
    if (typeof ProcurementActionDispatcher !== 'undefined') ProcurementActionDispatcher.saveSquadronBayConfig(this, sIdx, callback);
  }

  initSquadronNameEditor() {
    const editBtn = document.getElementById('btn-edit-squadron-name');
    if (editBtn) {
      editBtn.onclick = () => {
        const curName = this.game.squadronName || '7th Tactical Squadron';
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
        if (type && id) this.specs.openInspectModal(type, id);
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
        const editorRandomRoster = window.MissionEditor && window.MissionEditor.canProvideRandomSquadron(this.game);
        if (this.game.procurementSquadron.length === 0 && !editorRandomRoster) {
          this.showAlertModal('EMPTY SQUADRON', 'Add at least one aircraft to your squadron before launching the mission.');
          return;
        }
        if (this.game.budgetRemaining < 0 && !editorRandomRoster) {
          this.showAlertModal('OVER BUDGET', `Total cost exceeds available budget ($${this.game.budgetMax.toFixed(1)}M). Adjust aircraft or weapons.`);
          return;
        }
        const isEditorSortie = Boolean(this.game.pendingMissionEditorSettings);
        const confirmText = isEditorSortie
          ? 'Commence this custom editor sortie? It will not be ranked or saved to the leaderboard.'
          : `Commence sortie with ${this.game.procurementSquadron.length} aircraft?`;
        this.showConfirmModal(isEditorSortie ? 'COMMENCE UNRANKED SORTIE' : 'COMMENCE SORTIE', confirmText, () => this.game.scrambleFlight(), { confirmText: 'COMMENCE SORTIE', isAlert: false });
      };
    }

    if (typeof ProcurementActionDispatcher !== 'undefined' && ProcurementActionDispatcher.initCollapsibleHeader) {
      ProcurementActionDispatcher.initCollapsibleHeader(this);
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

  equipItemDirectly(itemData) { if (this.equipHandler) this.equipHandler.equipItemDirectly(itemData); }
  addAirframe(specId) { if (this.equipHandler) this.equipHandler.addAirframe(specId); }
  cloneAirframe(sIdx) { if (this.equipHandler) this.equipHandler.cloneAirframe(sIdx); }
  equipItemDataToSquadron(sIdx, itemData, targetStation = null) { if (this.equipHandler) this.equipHandler.equipItemDataToSquadron(sIdx, itemData, targetStation); }

  applyBuiltinPreset(type) { if (typeof ProcurementActionDispatcher !== 'undefined') ProcurementActionDispatcher.applyBuiltinPreset(this, type); }
  applyCustomPreset(name) { if (typeof ProcurementActionDispatcher !== 'undefined') ProcurementActionDispatcher.applyCustomPreset(this, name); }
  clearSquadron() { if (typeof ProcurementActionDispatcher !== 'undefined') ProcurementActionDispatcher.clearSquadron(this); }
  updateSquadronCard(sIdx) {
    if (this.roster && typeof this.roster.updateCard === 'function') this.roster.updateCard(this, sIdx);
    else this.updateUI();
  }

  updateUI() {
    this._isUpdatingUI = true;
    const rosterEl = document.getElementById('squadron-list');
    const budgetEl = document.getElementById('budget-counter');
    const fleetEl = document.getElementById('fleet-count');
    const scrambleBtn = document.getElementById('btn-scramble');

    this.renderDoctrinePresetsBar();
    this.roster.render(rosterEl, this.game.procurementSquadron, budgetEl, fleetEl, scrambleBtn);

    const mobCount = document.getElementById('mob-roster-count');
    if (mobCount) mobCount.textContent = this.game.procurementSquadron.length;

    const cleanName = this.game.squadronName || '7th Tactical Squadron';
    this.game.squadronName = cleanName;

    const dispSqName = document.getElementById('display-squadron-name');
    if (dispSqName) dispSqName.textContent = cleanName;

    if (this.shelf) this.shelf.syncActiveAircraft();

    if (window.Persistence && this.game.procurementSquadron.length > 0) {
      window.Persistence.saveLastSquadron(this.game.procurementSquadron);
      window.Persistence.saveSquadronName(cleanName);
    }
    this._isUpdatingUI = false;
  }
}

window.ProcurementManager = ProcurementManager;
