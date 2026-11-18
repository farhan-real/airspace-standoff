/**
 * AIRSPACE STANDOFF: Custom Mission Editor Logic
 */

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

  static initDropdowns() {
    if (typeof CustomDropdown === 'undefined' || typeof MissionEditorConfig === 'undefined') return;
    const initialScenario = this.game ? this.game.scenarioMode : 'SKIRMISH';
    const configs = MissionEditorConfig.getFieldConfigs(initialScenario);

    Object.entries(configs).forEach(([key, cfg]) => {
      CustomDropdown.setup(`cdd-me-${key}`, {
        value: cfg.default,
        options: cfg.options,
        onChange: (val) => {
          if (key === 'scenario') MissionEditorConfig.syncScenarioDropdowns(val, this.game);
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
    const defaultBudget = MissionEditorConfig.DIFFICULTY_DEFAULT_BUDGETS[fleetCdd.getValue()] || (isBlue ? 400 : 265);
    const options = MissionEditorConfig.STANDARD_BUDGET_TIERS.map(b => ({ value: String(b), text: b === defaultBudget ? `${b}M (Default)` : `${b}M` }));
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
      const defaultBudget = MissionEditorConfig.DIFFICULTY_DEFAULT_BUDGETS[fleetCdd.getValue()] || (isBlue ? 400 : 265);
      const options = MissionEditorConfig.STANDARD_BUDGET_TIERS.map(b => ({ value: String(b), text: b === defaultBudget ? `${b}M (Default)` : `${b}M` }));
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
    const isAttack = (this.game.scenarioMode === 'ATTACK');
    MissionEditorConfig.syncScenarioDropdowns(this.game.scenarioMode, this.game);

    const values = {
      scenario: this.game.scenarioMode,
      difficulty: isAttack ? this.game.attackDifficulty : this.game.aiDifficulty,
      doctrine: isAttack ? this.game.attackDoctrine : this.game.aiDoctrine,
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
    const configs = MissionEditorConfig.getFieldConfigs('SKIRMISH');
    MissionEditorConfig.syncScenarioDropdowns('SKIRMISH', this.game);
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
    const configs = MissionEditorConfig.getFieldConfigs(this.game ? this.game.scenarioMode : 'SKIRMISH');
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
    const isFixedAttack = !draft.randomize.scenario && draft.values.scenario === 'ATTACK';
    Object.entries(draft.randomize).forEach(([key, randomize]) => {
      const cdd = CustomDropdown.get(`cdd-me-${key}`);
      if (cdd) {
        if (randomize) cdd.setDisabled(true);
        else if (isFixedAttack && (key === 'red-fleet' || key === 'red-budget')) cdd.setDisabled(true);
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
    const val = key => draft.randomize[key] ? 'RANDOM' : draft.values[key];
    const scenarioVal = val('scenario');
    const formatFleetTag = (f, b, isRed) => (isRed && scenarioVal === 'ATTACK')
      ? 'IADS + QRA DEFENSE'
      : (f === 'RANDOM' ? `RANDOM FLEET [${b}M]` : (f === 'HANGAR' ? (isRed ? 'HANGAR FLEET (MIRROR)' : 'HANGAR FLEET') : `${MissionEditorConfig.FLEET_DIFFICULTY_NAMES[f] || f} [${b}M]`));

    preview.innerHTML = [
      `<span class="me-preview-chip"><b>SCENARIO:</b> ${scenarioVal}</span>`,
      `<span class="me-preview-chip"><b>DIFFICULTY:</b> ${val('difficulty')}</span>`,
      `<span class="me-preview-chip"><b>DOCTRINE:</b> ${MissionEditorConfig.formatDoctrineLabel(scenarioVal, val('doctrine'))}</span>`,
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
    game.attackDifficulty = base.attackDifficulty;
    game.attackDoctrine = base.attackDoctrine;
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
    const airDiffKeys = Object.keys(window.AI_DIFFICULTIES);
    const atkDiffKeys = Object.keys(window.ATTACK_DIFFICULTIES);
    const airDocKeys = Object.keys(window.AIR_DOCTRINES);
    const atkDocKeys = Object.keys(window.ATTACK_DOCTRINES);

    let difficulty;
    if (scenarioMode === 'ATTACK') {
      if (randomize.difficulty) difficulty = atkDiffKeys[Math.floor(Math.random() * atkDiffKeys.length)];
      else if (window.ATTACK_DIFFICULTIES[values.difficulty]) difficulty = values.difficulty;
      else difficulty = atkDiffKeys[Math.max(0, airDiffKeys.indexOf(values.difficulty))];
    } else {
      if (randomize.difficulty) difficulty = airDiffKeys[Math.floor(Math.random() * airDiffKeys.length)];
      else if (window.AI_DIFFICULTIES[values.difficulty]) difficulty = values.difficulty;
      else difficulty = airDiffKeys[Math.max(0, atkDiffKeys.indexOf(values.difficulty))];
    }

    let doctrine;
    if (scenarioMode === 'ATTACK') {
      if (randomize.doctrine) doctrine = atkDocKeys[Math.floor(Math.random() * atkDocKeys.length)];
      else if (window.ATTACK_DOCTRINES[values.doctrine]) doctrine = values.doctrine;
      else doctrine = MissionEditorConfig.AIR_TO_ATTACK_DOCTRINE_MAP[values.doctrine] || 'BALANCED';
    } else {
      if (randomize.doctrine) doctrine = airDocKeys[Math.floor(Math.random() * airDocKeys.length)];
      else if (window.AIR_DOCTRINES[values.doctrine]) doctrine = values.doctrine;
      else doctrine = 'BALANCED';
    }

    const airDoctrine = (scenarioMode === 'ATTACK') ? 'BALANCED' : doctrine;
    const blueFleet = choose('blue-fleet', ['HANGAR', ...airDiffKeys]);
    const blueBudget = blueFleet === 'HANGAR' ? game.budgetMax : Number(choose('blue-budget', MissionEditorConfig.STANDARD_BUDGET_TIERS.map(String)));
    const redFleet = choose('red-fleet', [...airDiffKeys, 'HANGAR']);
    const redBudget = redFleet === 'HANGAR' ? game.budgetMax : Number(choose('red-budget', MissionEditorConfig.STANDARD_BUDGET_TIERS.map(String)));
    const clouds = choose('clouds', ['CLEAR', 'LIGHT', 'SCATTERED', 'DENSE']);
    const defenses = choose('defenses', ['FULL', 'LIGHT', 'OFF']);
    const civilians = choose('civilians', ['ON', 'OFF']);
    const inspectionMode = Boolean(settings.inspectionMode);

    this.updateStateLabel('EDITOR SORTIE - UNRANKED', true);
    return { scenarioMode, difficulty, doctrine, airDoctrine, blueFleet, blueBudget, redFleet, redBudget, clouds, defenses, civilians, inspectionMode, unranked: true };
  }

  static createRandomSquadron(g, m) { return MissionBuilder.createRandomSquadron(g, m); }
}

window.MissionEditor = MissionEditor;
