/* AIRSPACE STANDOFF: Custom Mission Editor Logic */

class MissionEditor {
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
          { value: 'CADET', text: 'CADET (PERMISSIVE - 0.50x)' },
          { value: 'VETERAN', text: 'VETERAN (CONTESTED - 1.00x)' },
          { value: 'ELITE', text: 'ELITE (ACTIVE ZONE - 1.50x)' },
          { value: 'ACE', text: 'ACE (HIGH-THREAT - 2.00x)' },
          { value: 'MASTER', text: 'MASTER (AIR DENIAL - 2.60x)' },
          { value: 'LEGEND', text: 'LEGEND (FORTRESS - 3.20x)' }
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
      'blue-squadron': {
        default: 'HANGAR',
        options: [
          { value: 'HANGAR', text: 'USE HANGAR ROSTER' },
          { value: 'RANDOM', text: 'GENERATE RANDOM SQUADRON (3-8 UNITS)' }
        ]
      },
      'blue-weapons': {
        default: 'HANGAR',
        options: [
          { value: 'HANGAR', text: 'KEEP HANGAR STORES' },
          { value: 'STANDARD', text: 'STANDARD LOADOUTS' },
          { value: 'RANDOM', text: 'RANDOM LEGAL STORES' }
        ]
      },
      'red-size': {
        default: '7',
        options: [
          { value: '3', text: '3 AIRCRAFT (LIGHT FLIGHT)' },
          { value: '5', text: '5 AIRCRAFT (MEDIUM SQUAD)' },
          { value: '7', text: '7 AIRCRAFT (STANDARD WING)' },
          { value: '9', text: '9 AIRCRAFT (HEAVY REGIMENT)' },
          { value: '11', text: '11 AIRCRAFT (FULL BRIGADE)' },
          { value: '13', text: '13 AIRCRAFT (MASS INVASION)' },
          { value: '15', text: '15 AIRCRAFT (SATURATION FLEET)' }
        ]
      },
      'red-weapons': {
        default: 'DOCTRINE',
        options: [
          { value: 'DOCTRINE', text: 'DOCTRINE-BASED STORES' },
          { value: 'RANDOM', text: 'RANDOM LEGAL STORES' }
        ]
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
        onChange: () => this.updatePreview()
      });
    });
  }

  static syncStandardValues() {
    if (!this.game) return;
    const values = {
      scenario: this.game.scenarioMode,
      difficulty: this.game.aiDifficulty,
      doctrine: this.game.aiDoctrine,
      'red-size': ({ CADET: '5', VETERAN: '7', ELITE: '9', ACE: '11', MASTER: '11', LEGEND: '13' })[this.game.aiDifficulty] || '7'
    };
    Object.entries(values).forEach(([key, val]) => {
      const cdd = CustomDropdown.get(`cdd-me-${key}`);
      if (cdd) cdd.setValue(val);
    });
  }

  static resetDraft() {
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
      if (cdd) cdd.setDisabled(Boolean(randomize));
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

    const diffMultMap = { CADET: '0.5x', VETERAN: '1.0x', ELITE: '1.5x', ACE: '2.0x', MASTER: '2.6x', LEGEND: '3.2x' };
    const diffVal = val('difficulty');
    const diffTag = diffVal === 'RANDOM' ? 'RANDOM' : `${diffVal} [${diffMultMap[diffVal] || '1.0x'}]`;

    const chips = [
      `<span class="me-preview-chip"><b>SCENARIO:</b> ${val('scenario')}</span>`,
      `<span class="me-preview-chip"><b>THREAT:</b> ${diffTag}</span>`,
      `<span class="me-preview-chip"><b>DOCTRINE:</b> ${val('doctrine')}</span>`,
      `<span class="me-preview-chip"><b>BLUE FORCE:</b> ${val('blue-squadron')} [${val('blue-weapons')}]</span>`,
      `<span class="me-preview-chip"><b>RED FORCE:</b> ${val('red-size')} AC [${val('red-weapons')}]</span>`,
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
    const inspectionMode = Boolean(settings.inspectionMode);
    this.updateStateLabel('EDITOR SORTIE - UNRANKED', true);
    return { scenarioMode, difficulty, doctrine, blueSquadron, blueWeapons, redSize, redWeapons, clouds, defenses, civilians, inspectionMode, unranked: true };
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