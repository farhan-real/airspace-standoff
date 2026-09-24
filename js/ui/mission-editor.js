/* AIRSPACE STANDOFF: Mission Editor Controls and Scenario Preparation */

class MissionEditor {
  static init(game) {
    this.game = game;
    const modal = document.getElementById('mission-editor-modal');
    const openButton = document.getElementById('btn-open-mission-editor');
    const closeButton = document.getElementById('btn-close-mission-editor');
    const applyButton = document.getElementById('btn-apply-mission-editor');
    const resetButton = document.getElementById('btn-reset-mission-editor');
    if (!modal || !openButton) return;

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
    modal.querySelectorAll('select').forEach(input => {
      input.addEventListener('change', () => this.updatePreview());
    });
    modal.querySelectorAll('.mission-editor-random-toggle').forEach(button => {
      button.addEventListener('click', () => {
        button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        this.updatePreview();
      });
    });
    this.updateStateLabel('STANDARD MISSION', false);
  }

  static syncStandardValues() {
    if (!this.game) return;
    const values = {
      scenario: this.game.scenarioMode,
      difficulty: this.game.aiDifficulty,
      doctrine: this.game.aiDoctrine,
      'red-size': ({ CADET: '5', VETERAN: '7', ELITE: '9' })[this.game.aiDifficulty] || '11'
    };
    Object.entries(values).forEach(([key, value]) => {
      const select = document.getElementById(`me-${key}`);
      if (select && [...select.options].some(option => option.value === value)) select.value = value;
    });
  }

  static resetDraft() {
    const defaults = {
      scenario: 'SKIRMISH', difficulty: 'VETERAN', doctrine: 'BALANCED',
      'blue-squadron': 'HANGAR', 'blue-weapons': 'HANGAR', 'red-size': '7',
      'red-weapons': 'DOCTRINE', clouds: 'SCATTERED', defenses: 'FULL', civilians: 'ON'
    };
    Object.entries(defaults).forEach(([key, value]) => {
      const select = document.getElementById(`me-${key}`);
      if (select) select.value = value;
      const button = document.querySelector(`.mission-editor-random-toggle[data-random-for="${key}"]`);
      if (button) button.setAttribute('aria-pressed', 'false');
    });
    if (this.game) {
      this.game.pendingMissionEditorSettings = null;
      if (this.game.procurement) this.game.procurement.updateUI();
    }
    this.updateStateLabel('STANDARD MISSION', false);
    this.updatePreview();
  }

  static readDraft() {
    const keys = ['scenario', 'difficulty', 'doctrine', 'blue-squadron', 'blue-weapons', 'red-size', 'red-weapons', 'clouds', 'defenses', 'civilians'];
    const values = {};
    const randomize = {};
    keys.forEach(key => {
      const select = document.getElementById(`me-${key}`);
      const button = document.querySelector(`.mission-editor-random-toggle[data-random-for="${key}"]`);
      values[key] = select ? select.value : '';
      randomize[key] = Boolean(button && button.getAttribute('aria-pressed') === 'true');
    });
    return { values, randomize };
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
      const select = document.getElementById(`me-${key}`);
      if (select) select.disabled = Boolean(randomize);
      const button = document.querySelector(`.mission-editor-random-toggle[data-random-for="${key}"]`);
      if (button) {
        button.classList.toggle('is-active', Boolean(randomize));
        button.setAttribute('aria-pressed', randomize ? 'true' : 'false');
        button.textContent = randomize ? 'RANDOM ON' : 'RANDOM';
        const fieldLabel = button.closest('.mission-editor-field')?.querySelector('label')?.textContent.trim() || key;
        button.setAttribute('aria-label', `${randomize ? 'Random is on for' : 'Randomize'} ${fieldLabel}`);
      }
    });
    this.renderPreview(false);
  }

  static renderPreview(armed) {
    const preview = document.getElementById('mission-editor-preview');
    if (!preview) return;
    const draft = this.readDraft();
    const valueFor = key => {
      if (draft.randomize[key]) return 'Random';
      const select = document.getElementById(`me-${key}`);
      const option = select && select.options[select.selectedIndex];
      return option ? option.textContent.trim() : '—';
    };
    const lines = [
      `MISSION  ·  Scenario: ${valueFor('scenario')}  ·  Difficulty: ${valueFor('difficulty')}  ·  Enemy style: ${valueFor('doctrine')}`,
      `FORCES  ·  Your squadron: ${valueFor('blue-squadron')}  ·  Your weapons: ${valueFor('blue-weapons')}  ·  Enemy size: ${valueFor('red-size')}  ·  Enemy weapons: ${valueFor('red-weapons')}`,
      `CONDITIONS  ·  Clouds: ${valueFor('clouds')}  ·  Air defenses: ${valueFor('defenses')}  ·  Civilian traffic: ${valueFor('civilians')}`
    ];
    preview.classList.toggle('armed', Boolean(armed));
    preview.textContent = `${armed ? 'NEXT SORTIE · UNRANKED' : 'PREVIEW · NOT APPLIED'}\n${lines.join('\n')}\n${armed ? 'This sortie will not appear on the leaderboard.' : 'Use this setup to apply it to your next sortie.'}`;
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
    return settings.values && settings.randomize
      && (settings.values['blue-squadron'] === 'RANDOM' || settings.randomize['blue-squadron']);
  }

  static restoreBaseSettings(game) {
    const base = game && game.missionEditorBaseSettings;
    if (!base) return false;
    game.scenarioMode = base.scenarioMode;
    game.aiDifficulty = base.aiDifficulty;
    game.aiDoctrine = base.aiDoctrine;
    game.activeMissionEditorConfig = null;
    game.isMissionEditorMatch = false;
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
      const validCandidates = candidates.filter(value => value !== undefined && value !== null);
      if (validCandidates.length === 0) return values[key];
      if (!randomize[key]) return values[key] || validCandidates[0];
      return validCandidates[Math.floor(Math.random() * validCandidates.length)];
    };
    const hasAffordableHangarRoster = Array.isArray(game.procurementSquadron)
      && game.procurementSquadron.length > 0 && game.budgetRemaining >= 0;
    const blueSquadronOptions = hasAffordableHangarRoster ? ['HANGAR', 'RANDOM'] : ['RANDOM'];
    const scenarioMode = choose('scenario', ['SKIRMISH', 'DYNAMIC_THEATER']);
    const difficulty = choose('difficulty', ['CADET', 'VETERAN', 'ELITE', 'ACE', 'MASTER', 'LEGEND']);
    const doctrine = choose('doctrine', ['BALANCED', 'AGGRESSIVE', 'STANDOFF']);
    const blueSquadron = choose('blue-squadron', blueSquadronOptions);
    const blueWeapons = choose('blue-weapons', ['HANGAR', 'STANDARD', 'RANDOM']);
    const redSize = Math.max(3, Math.min(15, parseInt(choose('red-size', ['3', '5', '7', '9', '11', '13', '15']), 10) || 7));
    const redWeapons = choose('red-weapons', ['DOCTRINE', 'RANDOM']);
    const clouds = choose('clouds', ['CLEAR', 'LIGHT', 'SCATTERED', 'DENSE']);
    const defenses = choose('defenses', ['FULL', 'LIGHT', 'OFF']);
    const civilians = choose('civilians', ['ON', 'OFF']);
    this.updateStateLabel('EDITOR SORTIE · UNRANKED', true);
    return { scenarioMode, difficulty, doctrine, blueSquadron, blueWeapons, redSize, redWeapons, clouds, defenses, civilians, unranked: true };
  }

  static createRandomSquadron(game, mission) {
    const catalog = Object.values(window.AIRCRAFT_CATALOG || {}).filter(spec => spec && spec.id && !spec.isDrone && Number(spec.cost) > 0);
    if (catalog.length === 0 || typeof FleetGenerator === 'undefined') return [];
    const budget = Math.max(1, Number(game.budgetMax) || 400);
    let remaining = budget;
    const requested = 3 + Math.floor(Math.random() * 6);
    const roster = [];
    const callsigns = [...(window.CALLSIGN_POOL || ['Viper', 'Ghost', 'Talon', 'Saber'])];

    while (roster.length < requested && roster.length < 16) {
      const affordable = catalog.filter(spec => Number(spec.cost) <= remaining);
      if (affordable.length === 0) break;
      const spec = affordable[Math.floor(Math.random() * affordable.length)];
      const planned = FleetGenerator.planAircraftLoadout(spec, false, mission.doctrine, mission.difficulty, Math.random);
      const loadoutCost = Number(planned.totalCost) || Number(spec.cost) || 20;
      if (loadoutCost > remaining) {
        const light = affordable.filter(candidate => Number(candidate.cost) <= remaining)
          .sort((a, b) => Number(a.cost) - Number(b.cost))[0];
        if (!light) break;
        roster.push({
          specId: light.id, chosenGunId: light.builtInGun || 'M61A2', callsign: callsigns.pop() || `Flight ${roster.length + 1}`,
          isLead: roster.length === 0, weapons: [], upgrades: []
        });
        remaining -= Number(light.cost) || 20;
        continue;
      }
      roster.push({
        specId: spec.id, chosenGunId: spec.builtInGun || 'M61A2', callsign: callsigns.pop() || `Flight ${roster.length + 1}`,
        isLead: roster.length === 0, weapons: planned.weapons || [], upgrades: planned.upgrades || []
      });
      remaining -= loadoutCost;
    }
    return roster;
  }

  static applyStandardWeapons(aircraft, mission) {
    if (!aircraft || typeof FleetGenerator === 'undefined') return;
    const spec = aircraft.spec || (window.AIRCRAFT_CATALOG || {})[aircraft.specId];
    if (!spec) return;
    const plan = FleetGenerator.planAircraftLoadout(spec, aircraft.isAce, mission.doctrine, mission.difficulty, Math.random);
    this.replaceAircraftWeapons(aircraft, plan.weapons || []);
  }

  static applyRandomWeapons(aircraft) {
    if (!aircraft) return;
    const weaponPool = Object.values(window.WEAPONS_CATALOG || {}).filter(weapon =>
      weapon && weapon.category === 'A2A' && !weapon.isJammerPod && !weapon.isDecoy && !weapon.isDecoyDrone
    );
    if (weaponPool.length === 0) return;
    this.replaceAircraftWeapons(aircraft, []);
    const shuffled = [...weaponPool].sort(() => Math.random() - 0.5);
    const targetCount = 2 + Math.floor(Math.random() * 5);
    let installed = 0;
    for (const weapon of shuffled) {
      if (installed >= targetCount) break;
      if (aircraft.installWeapon(weapon.id)) installed++;
    }
    if (installed === 0 && typeof FleetGenerator !== 'undefined') {
      const fallback = FleetGenerator.planAircraftLoadout(aircraft.spec, aircraft.isAce, 'BALANCED', 'VETERAN', Math.random);
      this.replaceAircraftWeapons(aircraft, fallback.weapons || []);
    }
    aircraft.recalculateWeight();
  }

  static replaceAircraftWeapons(aircraft, weapons) {
    if (!aircraft) return;
    aircraft.equippedWeapons = [];
    aircraft.jamEfficiency = 0;
    aircraft.hasMaldDecoy = false;
    aircraft.maldDecoyCharges = 0;
    (weapons || []).forEach(item => {
      const id = typeof item === 'string' ? item : (item && (item.id || item.specId));
      if (id) aircraft.installWeapon(id, item && typeof item === 'object' ? item.station : null);
    });
    aircraft.recalculateWeight();
  }

  static randomizeWeaponsForFleet(fleet) {
    (fleet || []).forEach(aircraft => this.applyRandomWeapons(aircraft));
  }
}

window.MissionEditor = MissionEditor;
