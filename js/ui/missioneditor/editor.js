/* AIRSPACE STANDOFF: Custom Mission Editor Logic */

const DIFFICULTY_DEFAULT_BUDGETS = {
  CADET: 150, BUFFER: 205, VETERAN: 265, ESCALATED: 315, ELITE: 360,
  FORWARD: 400, ACE: 445, FORTIFIED: 490, MASTER: 540, LEGEND: 600
};

const STANDARD_BUDGET_TIERS = [150, 200, 205, 250, 265, 300, 315, 360, 400, 445, 490, 500, 540, 600, 650, 750, 800, 900, 1000];

const FLEET_DIFFICULTY_NAMES = {
  CADET: 'PERMISSIVE SECTOR FLEET', BUFFER: 'BUFFER ZONE FLEET', VETERAN: 'CONTESTED AIRSPACE FLEET',
  ESCALATED: 'ESCALATED AIRSPACE FLEET', ELITE: 'HOSTILE AIRSPACE FLEET', FORWARD: 'FORWARD COMBAT ZONE FLEET',
  ACE: 'HIGH-THREAT SECTOR FLEET', FORTIFIED: 'FORTIFIED AIRSPACE FLEET', MASTER: 'AIR DENIAL ZONE FLEET',
  LEGEND: 'EXTREME THREAT SECTOR FLEET'
};

class MissionEditor {
  static customBudgets = { blue: null, red: null };
  static _initialized = false;

  static init(game) {
    this.game = game;
    const openButton = document.getElementById('btn-open-mission-editor');
    if (openButton) openButton.onclick = () => this.open();
    this.updateStateLabel('STANDARD MISSION', false);
  }

  static ensureModal() {
    if (document.getElementById('mission-editor-modal')) return;
    if (window.ModalEditorTemplate && typeof window.ModalEditorTemplate.ensure === 'function') {
      window.ModalEditorTemplate.ensure();
    }
    this.bindModalEvents();
  }

  static open() {
    this.ensureModal();
    const modal = document.getElementById('mission-editor-modal');
    if (!this.game.pendingMissionEditorSettings) this.syncStandardValues();
    if (modal) modal.classList.add('active');
    this.updatePreview();
  }

  static close() {
    const modal = document.getElementById('mission-editor-modal');
    if (modal) modal.classList.remove('active');
  }

  static bindModalEvents() {
    if (this._initialized) return;
    this._initialized = true;
    const modal = document.getElementById('mission-editor-modal');
    if (!modal) return;

    this.initDropdowns();

    const closeButton = document.getElementById('btn-close-mission-editor');
    const applyButton = document.getElementById('btn-apply-mission-editor');
    const resetButton = document.getElementById('btn-reset-mission-editor');
    const inspectionToggle = document.getElementById('me-inspection-mode');

    if (closeButton) closeButton.onclick = () => this.close();
    modal.addEventListener('click', event => { if (event.target === modal) this.close(); });
    if (applyButton) applyButton.onclick = () => this.applyDraft();
    if (resetButton) resetButton.onclick = () => this.resetDraft();

    if (inspectionToggle) {
      inspectionToggle.onclick = () => {
        const enabled = inspectionToggle.getAttribute('aria-pressed') !== 'true';
        inspectionToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
        inspectionToggle.textContent = enabled ? 'ON' : 'OFF';
        inspectionToggle.classList.toggle('is-active', enabled);
        this.updatePreview();
      };
    }

    modal.querySelectorAll('.me-custom-btn').forEach(button => {
      button.onclick = (e) => {
        e.stopPropagation();
        const teamKey = button.getAttribute('data-custom-budget');
        if (teamKey) this.promptCustomBudget(teamKey);
      };
    });

    modal.querySelectorAll('.mission-editor-random-toggle').forEach(button => {
      button.addEventListener('click', () => {
        button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        this.updatePreview();
      });
    });
  }

  static getFieldConfigs() {
    return {
      scenario: {
        default: 'SKIRMISH',
        options: [
          { value: 'SKIRMISH', text: 'SKIRMISH (STANDARD BATTLE)' },
          { value: 'DYNAMIC_THEATER', text: 'DYNAMIC THEATER (WAVE WINGS)' },
          { value: 'ATTACK', text: 'GROUND ATTACK (240x160 IADS)' }
        ]
      },
      difficulty: {
        default: 'VETERAN',
        options: [
          { value: 'CADET', text: 'PERMISSIVE SECTOR (0.50x)' }, { value: 'BUFFER', text: 'BUFFER ZONE (0.75x)' },
          { value: 'VETERAN', text: 'CONTESTED AIRSPACE (1.00x)' }, { value: 'ESCALATED', text: 'ESCALATED AIRSPACE (1.25x)' },
          { value: 'ELITE', text: 'HOSTILE AIRSPACE (1.50x)' }, { value: 'FORWARD', text: 'FORWARD COMBAT ZONE (1.75x)' },
          { value: 'ACE', text: 'HIGH-THREAT SECTOR (2.00x)' }, { value: 'FORTIFIED', text: 'FORTIFIED AIRSPACE (2.30x)' },
          { value: 'MASTER', text: 'AIR DENIAL ZONE (2.60x)' }, { value: 'LEGEND', text: 'EXTREME THREAT SECTOR (3.20x)' }
        ]
      },
      doctrine: { default: 'BALANCED', options: [{ value: 'BALANCED', text: 'BALANCED' }, { value: 'AGGRESSIVE', text: 'AGGRESSIVE' }, { value: 'STANDOFF', text: 'STANDOFF' }] },
      'blue-fleet': { default: 'HANGAR', options: [{ value: 'HANGAR', text: 'HANGAR FLEET' }, ...Object.entries(FLEET_DIFFICULTY_NAMES).map(([k, v]) => ({ value: k, text: v }))] },
      'blue-budget': { default: '400', options: STANDARD_BUDGET_TIERS.map(b => ({ value: String(b), text: `${b}M` })) },
      'red-fleet': { default: 'VETERAN', options: [...Object.entries(FLEET_DIFFICULTY_NAMES).map(([k, v]) => ({ value: k, text: v })), { value: 'HANGAR', text: 'HANGAR FLEET (MIRROR)' }] },
      'red-budget': { default: '265', options: STANDARD_BUDGET_TIERS.map(b => ({ value: String(b), text: `${b}M` })) },
      clouds: { default: 'SCATTERED', options: [{ value: 'CLEAR', text: 'CLEAR SKIES (0% RADAR ATTENUATION)' }, { value: 'LIGHT', text: 'LIGHT COVER (2 CLOUD CELLS)' }, { value: 'SCATTERED', text: 'SCATTERED (4 CLOUD CELLS)' }, { value: 'DENSE', text: 'DENSE OVERCAST (5 CLOUD CELLS)' }] },
      defenses: { default: 'FULL', options: [{ value: 'FULL', text: 'FULL IADS (SAMS + CIWS + EW)' }, { value: 'LIGHT', text: 'LIGHT DEFENSE (CIWS ONLY)' }, { value: 'OFF', text: 'NO GROUND DEFENSES' }] },
      civilians: { default: 'ON', options: [{ value: 'ON', text: 'ACTIVE (STRICT ROE)' }, { value: 'OFF', text: 'DISABLED (NO CIVILIAN FLIGHTS)' }] }
    };
  }

  static initDropdowns() {
    if (typeof CustomDropdown === 'undefined') return;
    const configs = this.getFieldConfigs();
    Object.entries(configs).forEach(([key, cfg]) => {
      CustomDropdown.setup(`cdd-me-${key}`, {
        value: cfg.default,
        options: cfg.options,
        onChange: (val) => {
          if (key === 'blue-fleet') this.updateBudgetDropdown('blue-fleet', 'blue-budget');
          if (key === 'red-fleet') this.updateBudgetDropdown('red-fleet', 'red-budget');
          if (key === 'blue-budget' && val === 'CUSTOM') this.promptCustomBudget('blue');
          if (key === 'red-budget' && val === 'CUSTOM') this.promptCustomBudget('red');
          this.updatePreview();
        }
      });
    });
  }

  static promptCustomBudget(teamKey) {
    const isBlue = (teamKey === 'blue');
    const fleetCdd = CustomDropdown.get(isBlue ? 'cdd-me-blue-fleet' : 'cdd-me-red-fleet');
    if (fleetCdd && fleetCdd.getValue() === 'HANGAR') return;
    const currentVal = this.customBudgets[teamKey] || (isBlue ? 400 : 265);
    const msg = 'Enter custom defense credit allocation in Millions (10M - 2500M):';
    const handleApply = (inputVal) => {
      const parsed = Math.round(Number(inputVal));
      if (Number.isFinite(parsed) && parsed >= 10 && parsed <= 2500) {
        this.customBudgets[teamKey] = parsed;
        this.setCustomBudget(teamKey, parsed);
      }
    };
    if (this.game && this.game.procurement && typeof this.game.procurement.showPromptModal === 'function') {
      this.game.procurement.showPromptModal(isBlue ? 'ALLIED BUDGET' : 'ENEMY BUDGET', msg, String(currentVal), handleApply);
    } else {
      const fallback = window.prompt(msg, String(currentVal));
      if (fallback !== null) handleApply(fallback);
    }
  }

  static setCustomBudget(teamKey, amount) {
    const isBlue = (teamKey === 'blue');
    const budgetCdd = CustomDropdown.get(`cdd-me-${isBlue ? 'blue-budget' : 'red-budget'}`);
    const fleetCdd = CustomDropdown.get(`cdd-me-${isBlue ? 'blue-fleet' : 'red-fleet'}`);
    if (!budgetCdd || !fleetCdd) return;
    const defaultBudget = DIFFICULTY_DEFAULT_BUDGETS[fleetCdd.getValue()] || (isBlue ? 400 : 265);
    const options = STANDARD_BUDGET_TIERS.map(b => ({ value: String(b), text: b === defaultBudget ? `${b}M (Default)` : `${b}M` }));
    const customStr = String(amount);
    if (!options.some(opt => opt.value === customStr)) options.push({ value: customStr, text: `${customStr}M (Custom)` });
    options.push({ value: 'CUSTOM', text: 'ENTER CUSTOM BUDGET...' });
    budgetCdd.setOptions(options, customStr);
    this.updatePreview();
  }

  static updateBudgetDropdown(fleetKey, budgetKey) {
    if (typeof CustomDropdown === 'undefined') return;
    const fleetCdd = CustomDropdown.get(`cdd-me-${fleetKey}`);
    const budgetCdd = CustomDropdown.get(`cdd-me-${budgetKey}`);
    if (!fleetCdd || !budgetCdd) return;
    const isBlue = fleetKey.includes('blue');
    const isHangar = (fleetCdd.getValue() === 'HANGAR');
    const hangarBudget = Math.round(this.game ? this.game.budgetMax : 400);
    const customBtn = document.querySelector(`.me-custom-btn[data-custom-budget="${isBlue ? 'blue' : 'red'}"]`);
    if (customBtn) customBtn.disabled = isHangar;

    if (isHangar) {
      budgetCdd.setOptions([{ value: String(hangarBudget), text: `${hangarBudget}M (Hangar)` }], String(hangarBudget));
      budgetCdd.setDisabled(true);
    } else {
      const defaultBudget = DIFFICULTY_DEFAULT_BUDGETS[fleetCdd.getValue()] || (isBlue ? 400 : 265);
      const options = STANDARD_BUDGET_TIERS.map(b => ({ value: String(b), text: b === defaultBudget ? `${b}M (Default)` : `${b}M` }));
      const activeCustom = this.customBudgets[isBlue ? 'blue' : 'red'];
      if (activeCustom && !options.some(o => o.value === String(activeCustom))) options.push({ value: String(activeCustom), text: `${activeCustom}M (Custom)` });
      options.push({ value: 'CUSTOM', text: 'ENTER CUSTOM BUDGET...' });
      budgetCdd.setDisabled(false);
      budgetCdd.setOptions(options, String(defaultBudget));
    }
  }

  static syncStandardValues() {
    if (!this.game) return;
    this.ensureModal();
    const values = {
      scenario: this.game.scenarioMode,
      difficulty: this.game.aiDifficulty,
      doctrine: this.game.aiDoctrine,
      'blue-fleet': 'HANGAR',
      'red-fleet': this.game.aiDifficulty
    };
    Object.entries(values).forEach(([key, val]) => {
      const cdd = CustomDropdown.get(`cdd-me-${key}`);
      if (cdd) cdd.setValue(val);
    });
    this.updateBudgetDropdown('blue-fleet', 'blue-budget');
    this.updateBudgetDropdown('red-fleet', 'red-budget');
  }

  static resetDraft() {
    this.ensureModal();
    this.customBudgets = { blue: null, red: null };
    const configs = this.getFieldConfigs();
    Object.entries(configs).forEach(([key, cfg]) => {
      const cdd = CustomDropdown.get(`cdd-me-${key}`);
      if (cdd) { cdd.setValue(cfg.default); cdd.setDisabled(false); }
      const button = document.querySelector(`.mission-editor-random-toggle[data-random-for="${key}"]`);
      if (button) button.setAttribute('aria-pressed', 'false');
    });
    this.updateBudgetDropdown('blue-fleet', 'blue-budget');
    this.updateBudgetDropdown('red-fleet', 'red-budget');
    const inspectionToggle = document.getElementById('me-inspection-mode');
    if (inspectionToggle) {
      inspectionToggle.setAttribute('aria-pressed', 'false');
      inspectionToggle.textContent = 'OFF';
      inspectionToggle.classList.remove('is-active');
    }
    if (this.game) {
      this.game.pendingMissionEditorSettings = null;
      if (this.game.procurement) this.game.procurement.updateUI();
    }
    this.updateStateLabel('STANDARD MISSION', false);
    this.updatePreview();
  }

  static readDraft() {
    this.ensureModal();
    const configs = this.getFieldConfigs();
    const values = {}, randomize = {};
    Object.keys(configs).forEach(key => {
      const cdd = CustomDropdown.get(`cdd-me-${key}`);
      const button = document.querySelector(`.mission-editor-random-toggle[data-random-for="${key}"]`);
      values[key] = cdd ? cdd.getValue() : configs[key].default;
      randomize[key] = Boolean(button && button.getAttribute('aria-pressed') === 'true');
    });
    const inspectionToggle = document.getElementById('me-inspection-mode');
    return { values, randomize, inspectionMode: Boolean(inspectionToggle && inspectionToggle.getAttribute('aria-pressed') === 'true') };
  }

  static applyDraft() {
    if (!this.game) return;
    this.game.pendingMissionEditorSettings = this.readDraft();
    this.updateStateLabel('EDITOR CONFIG ARMED', true);
    this.renderPreview(true);
    if (this.game.procurement) this.game.procurement.updateUI();
    this.close();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  static updatePreview() {
    const draft = this.readDraft();
    Object.entries(draft.randomize).forEach(([key, randomize]) => {
      const cdd = CustomDropdown.get(`cdd-me-${key}`);
      if (cdd) {
        if (randomize) cdd.setDisabled(true);
        else if (key === 'blue-budget' && draft.values['blue-fleet'] === 'HANGAR') cdd.setDisabled(true);
        else if (key === 'red-budget' && draft.values['red-fleet'] === 'HANGAR') cdd.setDisabled(true);
        else cdd.setDisabled(false);
      }
      const button = document.querySelector(`.mission-editor-random-toggle[data-random-for="${key}"]`);
      if (button) {
        button.classList.toggle('is-active', Boolean(randomize));
        button.setAttribute('aria-pressed', randomize ? 'true' : 'false');
        button.textContent = randomize ? 'RANDOM: ON' : 'RANDOM';
      }
    });
    this.renderPreview(false);
  }

  static renderPreview(armed) {
    const preview = document.getElementById('mission-editor-preview');
    const statusEl = document.getElementById('me-preview-status');
    if (!preview) return;
    const draft = this.readDraft();
    const val = key => draft.randomize[key] ? 'RANDOM' : (draft.values[key] || 'STANDARD');
    const formatFleetTag = (f, b, isRed) => f === 'RANDOM' ? `RANDOM FLEET [${b}M]` : (f === 'HANGAR' ? (isRed ? 'HANGAR FLEET (MIRROR)' : 'HANGAR FLEET') : `${FLEET_DIFFICULTY_NAMES[f] || f} [${b}M]`);

    preview.innerHTML = [
      `<span class="me-preview-chip"><b>SCENARIO:</b> ${val('scenario')}</span>`,
      `<span class="me-preview-chip"><b>DIFFICULTY:</b> ${val('difficulty')}</span>`,
      `<span class="me-preview-chip"><b>DOCTRINE:</b> ${val('doctrine')}</span>`,
      `<span class="me-preview-chip"><b>BLUE FORCE:</b> ${formatFleetTag(val('blue-fleet'), val('blue-budget'), false)}</span>`,
      `<span class="me-preview-chip"><b>RED FORCE:</b> ${formatFleetTag(val('red-fleet'), val('red-budget'), true)}</span>`,
      `<span class="me-preview-chip"><b>WEATHER:</b> ${val('clouds')}</span>`,
      `<span class="me-preview-chip"><b>IADS:</b> ${val('defenses')}</span>`,
      `<span class="me-preview-chip"><b>CIVILIAN ROE:</b> ${val('civilians')}</span>`,
      `<span class="me-preview-chip" style="color:${draft.inspectionMode ? 'var(--stat-tier-2)' : 'var(--color-moon-mist)'};"><b>INSPECTION:</b> ${draft.inspectionMode ? 'ON' : 'OFF'}</span>`
    ].join('');

    if (statusEl) {
      statusEl.textContent = armed ? 'ARMED FOR NEXT SORTIE' : 'NOT APPLIED';
      statusEl.className = `me-preview-status ${armed ? 'armed' : 'unarmed'}`;
    }
  }

  static updateStateLabel(text, armed) {
    const label = document.getElementById('mission-editor-state');
    if (!label) return;
    label.textContent = text;
    label.classList.toggle('armed', Boolean(armed));
  }

  static canProvideRandomSquadron(game) {
    const settings = game && game.pendingMissionEditorSettings;
    return Boolean(settings && settings.values && (settings.values['blue-fleet'] !== 'HANGAR' || settings.randomize['blue-fleet']));
  }

  static restoreBaseSettings(game) {
    const base = game && game.missionEditorBaseSettings;
    if (!base) return false;
    game.scenarioMode = base.scenarioMode;
    game.aiDifficulty = base.aiDifficulty;
    game.aiDoctrine = base.aiDoctrine;
    const modeId = (base.scenarioMode === 'ATTACK') ? 'SP_ATTACK' : (base.scenarioMode === 'DYNAMIC_THEATER' ? 'SP_DYNAMIC' : (game.playerMode === '2P' ? 'TP_SKIRMISH' : 'SP_SKIRMISH'));
    game.setGameMode(modeId);
    const bTierData = window.BUDGET_TIERS[game.playerBudgetId];
    if (!bTierData) throw new Error(`Invalid playerBudgetId "${game.playerBudgetId}" restoring editor base settings.`);
    game.budgetMax = bTierData.budget;
    game.activeMissionEditorConfig = null;
    game.isMissionEditorMatch = false;
    game.inspectionModeEnabled = false;
    if (game.inspection) game.inspection.beginMission(false);
    game.missionEditorBaseSettings = null;
    this.updateStateLabel('STANDARD MISSION', false);
    if (game.procurement) game.procurement.updateUI();
    return true;
  }

  static consumeNextMission(game) {
    const settings = game && game.pendingMissionEditorSettings;
    if (!settings) {
      this.restoreBaseSettings(game);
      this.updateStateLabel('STANDARD MISSION', false);
      return null;
    }
    game.pendingMissionEditorSettings = null;
    const values = settings.values || {}, randomize = settings.randomize || {};
    const choose = (key, candidates) => (!randomize[key] ? values[key] : candidates[Math.floor(Math.random() * candidates.length)]);

    const scenarioMode = choose('scenario', ['SKIRMISH', 'DYNAMIC_THEATER', 'ATTACK']);
    const difficulty = choose('difficulty', Object.keys(DIFFICULTY_DEFAULT_BUDGETS));
    const doctrine = choose('doctrine', ['BALANCED', 'AGGRESSIVE', 'STANDOFF']);
    const blueFleet = choose('blue-fleet', ['HANGAR', ...Object.keys(DIFFICULTY_DEFAULT_BUDGETS)]);
    const blueBudgetRaw = choose('blue-budget', STANDARD_BUDGET_TIERS.map(String));
    const blueBudget = blueFleet === 'HANGAR' ? game.budgetMax : Number(blueBudgetRaw);
    const redFleet = choose('red-fleet', [...Object.keys(DIFFICULTY_DEFAULT_BUDGETS), 'HANGAR']);
    const redBudgetRaw = choose('red-budget', STANDARD_BUDGET_TIERS.map(String));
    const redBudget = redFleet === 'HANGAR' ? game.budgetMax : Number(redBudgetRaw);

    if (scenarioMode === 'ATTACK') {
      const attackKeys = Object.keys(window.ATTACK_DIFFICULTIES);
      const diffIdx = Object.keys(DIFFICULTY_DEFAULT_BUDGETS).indexOf(difficulty);
      if (diffIdx >= 0 && attackKeys[diffIdx]) game.attackDifficulty = attackKeys[diffIdx];
    }

    const clouds = choose('clouds', ['CLEAR', 'LIGHT', 'SCATTERED', 'DENSE']);
    const defenses = choose('defenses', ['FULL', 'LIGHT', 'OFF']);
    const civilians = choose('civilians', ['ON', 'OFF']);
    const inspectionMode = Boolean(settings.inspectionMode);

    this.updateStateLabel('EDITOR SORTIE - UNRANKED', true);
    return { scenarioMode, difficulty, doctrine, blueFleet, blueBudget, redFleet, redBudget, clouds, defenses, civilians, inspectionMode, unranked: true };
  }

  static createRandomSquadron(g, m) { return MissionBuilder.createRandomSquadron(g, m); }
}

window.MissionEditor = MissionEditor;
