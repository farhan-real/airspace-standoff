/* AIRSPACE STANDOFF: Custom Mission Editor Logic */

const DIFFICULTY_DEFAULT_BUDGETS = {
  CADET: 190,
  VETERAN: 330,
  ELITE: 450,
  ACE: 570,
  MASTER: 700,
  LEGEND: 820
};

const STANDARD_BUDGET_TIERS = [190, 250, 300, 330, 400, 450, 500, 570, 650, 700, 750, 800, 820, 900, 1000];

const FLEET_DIFFICULTY_NAMES = {
  CADET: 'PERMISSIVE SECTOR FLEET',
  VETERAN: 'CONTESTED AIRSPACE FLEET',
  ELITE: 'HOSTILE AIRSPACE FLEET',
  ACE: 'HIGH-THREAT SECTOR FLEET',
  MASTER: 'AIR DENIAL ZONE FLEET',
  LEGEND: 'EXTREME THREAT SECTOR FLEET'
};

class MissionEditor {
  static customBudgets = { blue: null, red: null };

  static init(game) {
    this.game = game;
    const modal = document.getElementById('mission-editor-modal');
    const openButton = document.getElementById('btn-open-mission-editor');
    const closeButton = document.getElementById('btn-close-mission-editor');
    const applyButton = document.getElementById('btn-apply-mission-editor');
    const resetButton = document.getElementById('btn-reset-mission-editor');
    const inspectionToggle = document.getElementById('me-inspection-mode');
    if (!modal || !openButton) return;

    this.initDropdowns();

    openButton.onclick = () => {
      if (!this.game.pendingMissionEditorSettings) this.syncStandardValues();
      modal.classList.add('active');
      this.updatePreview();
    };
    if (closeButton) closeButton.onclick = () => modal.classList.remove('active');
    if (modal) modal.addEventListener('click', event => {
      if (event.target === modal) modal.classList.remove('active');
    });
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
    this.updateStateLabel('STANDARD MISSION', false);
  }

  static getFieldConfigs() {
    return {
      scenario: {
        default: 'SKIRMISH',
        options: [
          { value: 'SKIRMISH', text: 'SKIRMISH (STANDARD BATTLE)' },
          { value: 'DYNAMIC_THEATER', text: 'DYNAMIC THEATER (WAVE WINGS)' }
        ]
      },
      difficulty: {
        default: 'VETERAN',
        options: [
          { value: 'CADET', text: 'PERMISSIVE SECTOR (0.50x)' },
          { value: 'VETERAN', text: 'CONTESTED AIRSPACE (1.00x)' },
          { value: 'ELITE', text: 'HOSTILE AIRSPACE (1.50x)' },
          { value: 'ACE', text: 'HIGH-THREAT SECTOR (2.00x)' },
          { value: 'MASTER', text: 'AIR DENIAL ZONE (2.60x)' },
          { value: 'LEGEND', text: 'EXTREME THREAT SECTOR (3.20x)' }
        ]
      },
      doctrine: {
        default: 'BALANCED',
        options: [
          { value: 'BALANCED', text: 'BALANCED (STANDARD ENGAGEMENT MIX)' },
          { value: 'AGGRESSIVE', text: 'AGGRESSIVE (HIGH-G DOGFIGHTING)' },
          { value: 'STANDOFF', text: 'STANDOFF (LONG-RANGE BVR PATROL)' }
        ]
      },
      'blue-fleet': {
        default: 'HANGAR',
        options: [
          { value: 'HANGAR', text: 'HANGAR FLEET' },
          { value: 'CADET', text: 'PERMISSIVE SECTOR FLEET' },
          { value: 'VETERAN', text: 'CONTESTED AIRSPACE FLEET' },
          { value: 'ELITE', text: 'HOSTILE AIRSPACE FLEET' },
          { value: 'ACE', text: 'HIGH-THREAT SECTOR FLEET' },
          { value: 'MASTER', text: 'AIR DENIAL ZONE FLEET' },
          { value: 'LEGEND', text: 'EXTREME THREAT SECTOR FLEET' }
        ]
      },
      'blue-budget': {
        default: '400',
        options: STANDARD_BUDGET_TIERS.map(b => ({ value: String(b), text: `${b}M` }))
      },
      'red-fleet': {
        default: 'VETERAN',
        options: [
          { value: 'VETERAN', text: 'CONTESTED AIRSPACE FLEET' },
          { value: 'CADET', text: 'PERMISSIVE SECTOR FLEET' },
          { value: 'ELITE', text: 'HOSTILE AIRSPACE FLEET' },
          { value: 'ACE', text: 'HIGH-THREAT SECTOR FLEET' },
          { value: 'MASTER', text: 'AIR DENIAL ZONE FLEET' },
          { value: 'LEGEND', text: 'EXTREME THREAT SECTOR FLEET' },
          { value: 'HANGAR', text: 'HANGAR FLEET (MIRROR)' }
        ]
      },
      'red-budget': {
        default: '330',
        options: STANDARD_BUDGET_TIERS.map(b => ({ value: String(b), text: `${b}M` }))
      },
      clouds: {
        default: 'SCATTERED',
        options: [
          { value: 'CLEAR', text: 'CLEAR SKIES (0% RADAR ATTENUATION)' },
          { value: 'LIGHT', text: 'LIGHT COVER (2 CLOUD CELLS)' },
          { value: 'SCATTERED', text: 'SCATTERED (4 CLOUD CELLS)' },
          { value: 'DENSE', text: 'DENSE OVERCAST (5 CLOUD CELLS)' }
        ]
      },
      defenses: {
        default: 'FULL',
        options: [
          { value: 'FULL', text: 'FULL IADS (S-400 + CIWS + EW)' },
          { value: 'LIGHT', text: 'LIGHT DEFENSE (CIWS ONLY)' },
          { value: 'OFF', text: 'NO GROUND DEFENSES' }
        ]
      },
      civilians: {
        default: 'ON',
        options: [
          { value: 'ON', text: 'ACTIVE (STRICT ROE - -600 VP UNVERIFIED)' },
          { value: 'OFF', text: 'DISABLED (NO CIVILIAN FLIGHTS)' }
        ]
      }
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

    const currentVal = this.customBudgets[teamKey] || (isBlue ? 400 : 330);
    const title = isBlue ? 'ALLIED DEFENSE BUDGET' : 'ENEMY DEFENSE BUDGET';
    const msg = `Enter custom defense credit allocation in Millions (10M - 2500M):`;

    const handleApply = (inputVal) => {
      const parsed = Math.round(Number(inputVal));
      if (Number.isFinite(parsed) && parsed >= 10 && parsed <= 2500) {
        this.customBudgets[teamKey] = parsed;
        this.setCustomBudget(teamKey, parsed);
      }
    };

    if (this.game && this.game.procurement && typeof this.game.procurement.showPromptModal === 'function') {
      this.game.procurement.showPromptModal(title, msg, String(currentVal), handleApply);
    } else {
      const fallback = window.prompt(msg, String(currentVal));
      if (fallback !== null) handleApply(fallback);
    }
  }

  static setCustomBudget(teamKey, amount) {
    const isBlue = (teamKey === 'blue');
    const budgetKey = isBlue ? 'blue-budget' : 'red-budget';
    const fleetKey = isBlue ? 'blue-fleet' : 'red-fleet';
    const budgetCdd = CustomDropdown.get(`cdd-me-${budgetKey}`);
    const fleetCdd = CustomDropdown.get(`cdd-me-${fleetKey}`);
    if (!budgetCdd || !fleetCdd) return;

    const fleetVal = fleetCdd.getValue();
    const defaultBudget = DIFFICULTY_DEFAULT_BUDGETS[fleetVal] || (isBlue ? 400 : 330);
    const options = STANDARD_BUDGET_TIERS.map(b => ({
      value: String(b),
      text: b === defaultBudget ? `${b}M (Default)` : `${b}M`
    }));

    const customValStr = String(amount);
    const exists = options.some(opt => opt.value === customValStr);
    if (!exists) {
      options.push({ value: customValStr, text: `${customValStr}M (Custom)` });
    } else {
      const opt = options.find(o => o.value === customValStr);
      if (opt && !opt.text.includes('Default')) opt.text += ' (Custom)';
    }
    options.push({ value: 'CUSTOM', text: 'ENTER CUSTOM BUDGET...' });

    budgetCdd.setOptions(options, customValStr);
    this.updatePreview();
  }

  static updateBudgetDropdown(fleetKey, budgetKey) {
    if (typeof CustomDropdown === 'undefined') return;
    const fleetCdd = CustomDropdown.get(`cdd-me-${fleetKey}`);
    const budgetCdd = CustomDropdown.get(`cdd-me-${budgetKey}`);
    if (!fleetCdd || !budgetCdd) return;

    const isBlue = fleetKey.includes('blue');
    const teamKey = isBlue ? 'blue' : 'red';
    const fleetVal = fleetCdd.getValue();
    const isHangar = (fleetVal === 'HANGAR');
    const hangarBudget = Math.round(this.game ? (this.game.budgetMax || 400) : 400);

    const customBtn = document.querySelector(`.me-custom-btn[data-custom-budget="${teamKey}"]`);
    if (customBtn) customBtn.disabled = isHangar;

    if (isHangar) {
      budgetCdd.setOptions([{ value: String(hangarBudget), text: `${hangarBudget}M (Hangar)` }], String(hangarBudget));
      budgetCdd.setDisabled(true);
    } else {
      const defaultBudget = DIFFICULTY_DEFAULT_BUDGETS[fleetVal] || (isBlue ? 400 : 330);
      const currentVal = budgetCdd.getValue();
      const options = STANDARD_BUDGET_TIERS.map(b => ({
        value: String(b),
        text: b === defaultBudget ? `${b}M (Default)` : `${b}M`
      }));

      const activeCustom = this.customBudgets[teamKey];
      if (activeCustom) {
        const customStr = String(activeCustom);
        if (!options.some(o => o.value === customStr)) {
          options.push({ value: customStr, text: `${customStr}M (Custom)` });
        }
      }
      options.push({ value: 'CUSTOM', text: 'ENTER CUSTOM BUDGET...' });

      budgetCdd.setDisabled(false);
      let chosenVal = String(defaultBudget);
      if (currentVal && currentVal !== String(hangarBudget) && currentVal !== 'CUSTOM') {
        chosenVal = currentVal;
      }
      budgetCdd.setOptions(options, chosenVal);
    }
  }

  static syncStandardValues() {
    if (!this.game) return;
    const values = {
      scenario: this.game.scenarioMode,
      difficulty: this.game.aiDifficulty,
      doctrine: this.game.aiDoctrine,
      'blue-fleet': 'HANGAR',
      'red-fleet': this.game.aiDifficulty || 'VETERAN'
    };
    Object.entries(values).forEach(([key, val]) => {
      const cdd = CustomDropdown.get(`cdd-me-${key}`);
      if (cdd) cdd.setValue(val);
    });
    this.updateBudgetDropdown('blue-fleet', 'blue-budget');
    this.updateBudgetDropdown('red-fleet', 'red-budget');
  }

  static resetDraft() {
    this.customBudgets = { blue: null, red: null };
    const configs = this.getFieldConfigs();
    Object.entries(configs).forEach(([key, cfg]) => {
      const cdd = CustomDropdown.get(`cdd-me-${key}`);
      if (cdd) {
        cdd.setValue(cfg.default);
        cdd.setDisabled(false);
      }
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
    const configs = this.getFieldConfigs();
    const values = {};
    const randomize = {};
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
    const modal = document.getElementById('mission-editor-modal');
    if (modal) modal.classList.remove('active');
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  static updatePreview() {
    const draft = this.readDraft();
    Object.entries(draft.randomize).forEach(([key, randomize]) => {
      const cdd = CustomDropdown.get(`cdd-me-${key}`);
      if (cdd) {
        if (randomize) {
          cdd.setDisabled(true);
        } else if (key === 'blue-budget' && draft.values['blue-fleet'] === 'HANGAR') {
          cdd.setDisabled(true);
        } else if (key === 'red-budget' && draft.values['red-fleet'] === 'HANGAR') {
          cdd.setDisabled(true);
        } else {
          cdd.setDisabled(false);
        }
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

    const diffNames = {
      CADET: 'PERMISSIVE SECTOR (0.50x)',
      VETERAN: 'CONTESTED AIRSPACE (1.00x)',
      ELITE: 'HOSTILE AIRSPACE (1.50x)',
      ACE: 'HIGH-THREAT SECTOR (2.00x)',
      MASTER: 'AIR DENIAL ZONE (2.60x)',
      LEGEND: 'EXTREME THREAT SECTOR (3.20x)'
    };
    const diffVal = val('difficulty');
    const diffTag = diffVal === 'RANDOM' ? 'RANDOM' : (diffNames[diffVal] || diffVal);

    const blueFleetVal = val('blue-fleet');
    const blueBudgetVal = val('blue-budget');
    const redFleetVal = val('red-fleet');
    const redBudgetVal = val('red-budget');

    const formatFleetTag = (fleetVal, budgetVal, isRed = false) => {
      if (fleetVal === 'RANDOM') return `RANDOM FLEET [${budgetVal}M]`;
      if (fleetVal === 'HANGAR') return isRed ? 'HANGAR FLEET (MIRROR)' : 'HANGAR FLEET';
      const name = FLEET_DIFFICULTY_NAMES[fleetVal] || `${fleetVal} FLEET`;
      return `${name} [${budgetVal}M]`;
    };

    const chips = [
      `<span class="me-preview-chip"><b>SCENARIO:</b> ${val('scenario')}</span>`,
      `<span class="me-preview-chip"><b>DIFFICULTY:</b> ${diffTag}</span>`,
      `<span class="me-preview-chip"><b>DOCTRINE:</b> ${val('doctrine')}</span>`,
      `<span class="me-preview-chip"><b>BLUE FORCE:</b> ${formatFleetTag(blueFleetVal, blueBudgetVal, false)}</span>`,
      `<span class="me-preview-chip"><b>RED FORCE:</b> ${formatFleetTag(redFleetVal, redBudgetVal, true)}</span>`,
      `<span class="me-preview-chip"><b>WEATHER:</b> ${val('clouds')}</span>`,
      `<span class="me-preview-chip"><b>IADS:</b> ${val('defenses')}</span>`,
      `<span class="me-preview-chip"><b>CIVILIAN ROE:</b> ${val('civilians')}</span>`,
      `<span class="me-preview-chip" style="color:${draft.inspectionMode ? 'var(--stat-tier-2)' : 'var(--color-moon-mist)'};"><b>INSPECTION:</b> ${draft.inspectionMode ? 'ON' : 'OFF'}</span>`
    ];

    preview.innerHTML = chips.join('');
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
    if (!settings) return false;
    return settings.values && (settings.values['blue-fleet'] !== 'HANGAR' || settings.randomize['blue-fleet']);
  }

  static restoreBaseSettings(game) {
    const base = game && game.missionEditorBaseSettings;
    if (!base) return false;
    game.scenarioMode = base.scenarioMode;
    game.aiDifficulty = base.aiDifficulty;
    game.aiDoctrine = base.aiDoctrine;
    const bTierData = (window.BUDGET_TIERS && window.BUDGET_TIERS[game.playerBudgetId]) || { budget: 400.0 };
    game.budgetMax = bTierData.budget || 400.0;
    game.activeMissionEditorConfig = null;
    game.isMissionEditorMatch = false;
    game.inspectionModeEnabled = false;
    if (game.inspection) game.inspection.beginMission(false);
    game.missionEditorBaseSettings = null;
    const skirmishButton = document.getElementById('scenario-btn-skirmish');
    const dynamicButton = document.getElementById('scenario-btn-dynamic');
    if (skirmishButton) skirmishButton.classList.toggle('active', game.scenarioMode === 'SKIRMISH');
    if (dynamicButton) dynamicButton.classList.toggle('active', game.scenarioMode === 'DYNAMIC_THEATER');
    if (window.CustomDropdown) {
      const difficulty = window.CustomDropdown.get('cdd-difficulty');
      const doctrine = window.CustomDropdown.get('cdd-doctrine');
      if (difficulty) difficulty.setValue(game.aiDifficulty);
      if (doctrine) doctrine.setValue(game.aiDoctrine);
    }
    if (typeof game.updateModeIndicator === 'function') game.updateModeIndicator();
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
    const values = settings.values || {};
    const randomize = settings.randomize || {};
    const choose = (key, candidates) => {
      const valid = candidates.filter(v => v !== undefined && v !== null);
      if (valid.length === 0) return values[key];
      if (!randomize[key]) return values[key] || valid[0];
      return valid[Math.floor(Math.random() * valid.length)];
    };

    const scenarioMode = choose('scenario', ['SKIRMISH', 'DYNAMIC_THEATER']);
    const difficulty = choose('difficulty', ['CADET', 'VETERAN', 'ELITE', 'ACE', 'MASTER', 'LEGEND']);
    const doctrine = choose('doctrine', ['BALANCED', 'AGGRESSIVE', 'STANDOFF']);

    const blueFleetOptions = ['HANGAR', 'CADET', 'VETERAN', 'ELITE', 'ACE', 'MASTER', 'LEGEND'];
    const blueFleet = choose('blue-fleet', blueFleetOptions);
    const blueBudgetRaw = choose('blue-budget', STANDARD_BUDGET_TIERS.map(String));
    const blueBudget = blueFleet === 'HANGAR' ? game.budgetMax : (Number(blueBudgetRaw) || DIFFICULTY_DEFAULT_BUDGETS[blueFleet] || 400);

    const redFleetOptions = ['VETERAN', 'CADET', 'ELITE', 'ACE', 'MASTER', 'LEGEND', 'HANGAR'];
    const redFleet = choose('red-fleet', redFleetOptions);
    const redBudgetRaw = choose('red-budget', STANDARD_BUDGET_TIERS.map(String));
    const redBudget = redFleet === 'HANGAR' ? game.budgetMax : (Number(redBudgetRaw) || DIFFICULTY_DEFAULT_BUDGETS[redFleet] || 330);

    const clouds = choose('clouds', ['CLEAR', 'LIGHT', 'SCATTERED', 'DENSE']);
    const defenses = choose('defenses', ['FULL', 'LIGHT', 'OFF']);
    const civilians = choose('civilians', ['ON', 'OFF']);
    const inspectionMode = Boolean(settings.inspectionMode);

    this.updateStateLabel('EDITOR SORTIE - UNRANKED', true);
    return {
      scenarioMode, difficulty, doctrine,
      blueFleet, blueBudget,
      redFleet, redBudget,
      clouds, defenses, civilians, inspectionMode, unranked: true
    };
  }

  static createRandomSquadron(g, m) { return window.MissionBuilder ? MissionBuilder.createRandomSquadron(g, m) : []; }
}

window.MissionEditor = MissionEditor;