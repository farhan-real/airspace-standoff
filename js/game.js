/**
 * AIRSPACE STANDOFF: Master Game Orchestrator (150km x 100km Arena & Full Persistence)
 */

if (typeof navigator !== 'undefined') {
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua) || (navigator.userAgentData && navigator.userAgentData.platform === 'Android')) {
    if (document.documentElement) document.documentElement.classList.add('is-android');
    if (document.body) document.body.classList.add('is-android');
  }
}

class AirspaceStandoffGame {
  constructor() {
    this.installModalDOMTemplates();

    if (!window.CONFIG) {
      throw new Error('CONFIG is not loaded. Ensure constants.js is loaded prior to game.js.');
    }
    if (!window.BUDGET_TIERS) {
      throw new Error('BUDGET_TIERS table is not loaded. Ensure constants.js is loaded prior to game.js.');
    }
    if (!window.AI_DIFFICULTIES) {
      throw new Error('AI_DIFFICULTIES table is not loaded. Ensure constants.js is loaded prior to game.js.');
    }

    const savedSettings = (window.Persistence && typeof window.Persistence.getGameplaySettings === 'function')
      ? window.Persistence.getGameplaySettings()
      : null;

    this.playerMode = (savedSettings && savedSettings.playerMode) ? savedSettings.playerMode : '1P';
    this.scenarioMode = (savedSettings && savedSettings.scenarioMode) ? savedSettings.scenarioMode : 'SKIRMISH';
    this.aiDifficulty = (savedSettings && savedSettings.aiDifficulty) ? savedSettings.aiDifficulty : 'VETERAN';
    this.aiDoctrine = (savedSettings && savedSettings.aiDoctrine) ? savedSettings.aiDoctrine : 'BALANCED';
    this.playerBudgetId = (savedSettings && savedSettings.playerBudgetId) ? savedSettings.playerBudgetId : 'BUDGET_400';

    const bTierData = window.BUDGET_TIERS[this.playerBudgetId];
    if (!bTierData || typeof bTierData.budget !== 'number') {
      throw new Error(`Invalid budget tier "${this.playerBudgetId}" in BUDGET_TIERS.`);
    }
    this.budgetMax = bTierData.budget;
    this.budgetRemaining = this.budgetMax;

    this.pendingMissionEditorSettings = null;
    this.missionEditorBaseSettings = null;
    this.activeMissionEditorConfig = null;
    this.isMissionEditorMatch = false;
    this.inspectionModeEnabled = false;
    this.currentPvpCommander = 'friendly';

    let initialSquadronName = (window.Persistence && window.Persistence.getSquadronName()) || '7th Tactical Squadron';
    if (!initialSquadronName.trim()) {
      initialSquadronName = '7th Tactical Squadron';
    }
    this.squadronName = initialSquadronName.trim();
    if (window.Persistence) window.Persistence.saveSquadronName(this.squadronName);

    const maxTok = window.CONFIG.TOKEN_MAX;
    if (typeof maxTok !== 'number') {
      throw new Error('CONFIG.TOKEN_MAX must be a valid number.');
    }
    this.tokenBucketBlue = maxTok;
    this.tokenBucketRed = maxTok;
    this.alliedAircraft = [];
    this.hostileAircraft = [];
    this.surfaceUnits = [];
    this.missiles = [];

    this.activeUnit = null;
    this.selectedTarget = null;
    this.vpAlly = 0;
    this.vpHostile = 0;
    this.isGameOver = false;
    this.animFrameId = null;
    this.matchStartTime = 0;

    this.stats = { blueLosses: 0, redLosses: 0, missilesLaunched: 0, salvoCoordinatedHits: 0, defensiveIntercepts: 0 };
    this.detectedByBlue = new Set();
    this.detectedByRed = new Set();

    if (typeof TacticalRadarRenderer === 'undefined') throw new Error('TacticalRadarRenderer class is not loaded.');
    if (typeof DeckManager === 'undefined') throw new Error('DeckManager class is not loaded.');
    if (typeof TacticalAICommander === 'undefined') throw new Error('TacticalAICommander class is not loaded.');
    if (typeof CombatSystem === 'undefined') throw new Error('CombatSystem class is not loaded.');
    if (typeof SimulationSystem === 'undefined') throw new Error('SimulationSystem class is not loaded.');
    if (typeof AvionicsUI === 'undefined') throw new Error('AvionicsUI class is not loaded.');
    if (typeof SettingsManager === 'undefined') throw new Error('SettingsManager class is not loaded.');
    if (typeof ControlsSystem === 'undefined') throw new Error('ControlsSystem class is not loaded.');
    if (typeof InspectionModeController === 'undefined') throw new Error('InspectionModeController class is not loaded.');
    if (typeof ProcurementManager === 'undefined') throw new Error('ProcurementManager class is not loaded.');

    this.radar = new TacticalRadarRenderer('radar-canvas');
    this.deckManager = new DeckManager(this);
    this.ai = new TacticalAICommander(this);
    this.combat = new CombatSystem(this);
    this.simulation = new SimulationSystem(this);
    this.avionics = new AvionicsUI(this);
    this.settings = new SettingsManager(this);
    window.Settings = this.settings;

    this.controls = new ControlsSystem(this);
    this.inspection = new InspectionModeController(this);
    this.procurement = new ProcurementManager(this);
    this.procurementSquadron = [];

    this.controls.init();
    this.procurement.init();

    const saved = window.Persistence ? window.Persistence.getLastSquadron() : null;
    if (saved && saved.length > 0) {
      this.procurementSquadron = saved;
      this.procurement.updateUI();
    } else {
      this.procurement.applyBuiltinPreset('stealth');
    }
    this.setSquadronName(this.squadronName);

    this.setPlayerBudgetTier(this.playerBudgetId);
    this.updateModeIndicator();
  }

  installModalDOMTemplates() {
    if (window.ModalDialogTemplates && typeof window.ModalDialogTemplates.install === 'function') window.ModalDialogTemplates.install();
    if (window.ModalEditorTemplate && typeof window.ModalEditorTemplate.install === 'function') window.ModalEditorTemplate.install();
    if (window.ModalDebriefTemplate && typeof window.ModalDebriefTemplate.install === 'function') window.ModalDebriefTemplate.install();
    if (window.ModalPanelsTemplates && typeof window.ModalPanelsTemplates.install === 'function') window.ModalPanelsTemplates.install();
    if (typeof window.initTacticalManual === 'function') window.initTacticalManual();
  }

  saveGameplaySettings() {
    if (!window.Persistence || typeof window.Persistence.saveGameplaySettings !== 'function') return;
    window.Persistence.saveGameplaySettings({
      playerMode: this.playerMode,
      scenarioMode: this.scenarioMode,
      aiDifficulty: this.aiDifficulty,
      aiDoctrine: this.aiDoctrine,
      playerBudgetId: this.playerBudgetId
    });
  }

  setPlayerBudgetTier(tierKey) {
    const tierData = window.BUDGET_TIERS[tierKey];
    if (!tierData || typeof tierData.budget !== 'number') {
      throw new Error(`Budget tier "${tierKey}" is not defined in BUDGET_TIERS.`);
    }
    this.playerBudgetId = tierKey;
    this.budgetMax = tierData.budget;
    const subtextEl = document.getElementById('proc-budget-subtext');
    if (subtextEl) {
      subtextEl.textContent = `DEFENSE ALLOCATION: ${this.budgetMax.toFixed(1)}M CREDITS (${tierData.multiplier.toFixed(2)}x VP) UP TO 16 UNITS`;
    }
    this.updateModeIndicator();
    this.saveGameplaySettings();
    if (this.procurement) this.procurement.updateUI();
  }

  setSquadronName(name) {
    if (!name || !name.trim()) {
      throw new Error('Squadron name cannot be empty.');
    }
    this.squadronName = name.trim();
    const dispEl = document.getElementById('display-squadron-name');
    if (dispEl) dispEl.textContent = this.squadronName;
    const headerEl = document.getElementById('header-squadron-name');
    if (headerEl) headerEl.textContent = this.squadronName.toUpperCase();
    if (this.alliedAircraft) {
      this.alliedAircraft.forEach(ac => { ac.squadronName = this.squadronName; });
    }
    if (window.Persistence) window.Persistence.saveSquadronName(this.squadronName);
  }

  getCurrentCommanderTokenBucket() {
    return this.currentPvpCommander === 'friendly' ? this.tokenBucketBlue : this.tokenBucketRed;
  }

  consumeCurrentCommanderTokens(amount) {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      throw new Error(`Invalid token deduction amount: ${amount}`);
    }
    if (this.currentPvpCommander === 'friendly') {
      if (this.tokenBucketBlue >= amount) { this.tokenBucketBlue -= amount; return true; }
    } else {
      if (this.tokenBucketRed >= amount) { this.tokenBucketRed -= amount; return true; }
    }
    return false;
  }

  updateModeIndicator() {
    const ind = document.getElementById('theater-mode-indicator');
    if (!ind) return;
    const diffData = window.AI_DIFFICULTIES[this.aiDifficulty];
    if (!diffData) {
      throw new Error(`Invalid aiDifficulty "${this.aiDifficulty}" - not in AI_DIFFICULTIES.`);
    }
    const bTierData = window.BUDGET_TIERS[this.playerBudgetId];
    if (!bTierData) {
      throw new Error(`Invalid playerBudgetId "${this.playerBudgetId}" - not in BUDGET_TIERS.`);
    }
    const diffTag = `${diffData.name} (${diffData.scoreMultiplier.toFixed(2)}x)`;
    const bTag = `${bTierData.budget.toFixed(0)}M (${bTierData.multiplier.toFixed(2)}x)`;
    const modeTag = this.playerMode === '1P' ? `1P VS AI [${diffTag}] [${bTag}]` : '2P VERSUS';
    const scenarioTag = this.scenarioMode === 'DYNAMIC_THEATER' ? 'DYNAMIC THEATER' : 'SKIRMISH';
    ind.textContent = `${modeTag} ${scenarioTag}`;
  }

  canFirePylon(u, item, tgt) { return this.combat.canFire(u, item, tgt); }
  firePylon(u, idx, tgt) { this.combat.fire(u, idx, tgt); this.stats.missilesLaunched++; }
  executeCard(card, u) { this.combat.executeCard(card, u); }

  abortSortie() {
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    this.triggerGameOver(false, 'SORTIE ABORTED - WITHDRAWAL');
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  scrambleFlight() {
    if (typeof AudioSys !== 'undefined') AudioSys.ensureContext();
    if (typeof SortieSpawner === 'undefined') throw new Error('SortieSpawner is not loaded.');
    SortieSpawner.setupMission(this);
    this.startLoop();
  }

  startLoop() {
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    this.isGameOver = false;
    this.simulation.captureReplayFrame(true);
    let lastTime = performance.now();
    let mfdThrottle = 0;
    let rosterThrottle = 0;

    const loop = (currTime) => {
      const dt = Math.min(0.08, (currTime - lastTime) / 1000.0);
      lastTime = currTime;

      if (!this.isGameOver) {
        this.simulation.step(dt);
      }

      this.radar.render({
        alliedAircraft: this.alliedAircraft,
        hostileAircraft: this.hostileAircraft,
        surfaceUnits: this.surfaceUnits,
        missiles: this.missiles,
        activeUnit: this.activeUnit,
        selectedTarget: this.selectedTarget,
        inspectionEntity: this.inspection && this.inspection.isOpen ? this.inspection.selectedEntity : null,
        inspectionMode: Boolean(this.inspection && this.inspection.isOpen)
      });

      mfdThrottle += dt;
      if (mfdThrottle >= 0.10) {
        mfdThrottle = 0;
        this.avionics.updateActiveUnitMFD();
        if (this.inspection && this.inspection.isOpen) this.inspection.update();
      }

      rosterThrottle += dt;
      if (rosterThrottle >= 0.25) {
        rosterThrottle = 0;
        this.avionics.renderFlightRoster();
      }

      if (!this.isGameOver) this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  triggerGameOver(blueWon, msg) {
    this.isGameOver = true;
    if (this.inspection) {
      this.inspection.recordEvent('MISSION END', msg || (blueWon ? 'Victory' : 'Defeat'), null, null, { result: blueWon ? 'VICTORY' : 'DEFEAT' });
    }
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    this.simulation.captureReplayFrame(true);
    if (typeof AfterActionReportSystem === 'undefined') throw new Error('AfterActionReportSystem is not loaded.');
    AfterActionReportSystem.renderSortieSummary(this, blueWon, msg);
  }
}

window.AirspaceStandoffGame = AirspaceStandoffGame;
function initAirspaceStandoff() { if (!window.Game) window.Game = new AirspaceStandoffGame(); }
if (document.readyState === 'complete' || document.readyState === 'interactive') initAirspaceStandoff();
else window.addEventListener('DOMContentLoaded', initAirspaceStandoff);