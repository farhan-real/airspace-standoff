/**
 * js/game.js - Master Game Orchestrator
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
    if (!window.CONFIG) throw new Error('CONFIG is not loaded. Ensure constants.js is loaded prior to game.js.');
    if (!window.GAME_MODES) throw new Error('GAME_MODES table is not loaded.');
    if (!window.BUDGET_TIERS) throw new Error('BUDGET_TIERS table is not loaded.');
    if (!window.AI_DIFFICULTIES) throw new Error('AI_DIFFICULTIES table is not loaded.');
    if (!window.ATTACK_DIFFICULTIES) throw new Error('ATTACK_DIFFICULTIES table is not loaded.');
    if (!window.AIR_DOCTRINES) throw new Error('AIR_DOCTRINES table is not loaded.');
    if (!window.ATTACK_DOCTRINES) throw new Error('ATTACK_DOCTRINES table is not loaded.');

    const saved = (window.Persistence && typeof window.Persistence.getGameplaySettings === 'function')
      ? window.Persistence.getGameplaySettings() : null;

    this.gameMode = (saved && saved.gameMode && window.GAME_MODES[saved.gameMode]) ? saved.gameMode : 'SP_SKIRMISH';
    const modeDef = window.GAME_MODES[this.gameMode];
    if (!modeDef) throw new Error(`Invalid initial gameMode "${this.gameMode}".`);

    this.playerMode = modeDef.playerMode;
    this.scenarioMode = modeDef.scenarioMode;
    this.aiDifficulty = (saved && saved.aiDifficulty && window.AI_DIFFICULTIES[saved.aiDifficulty]) ? saved.aiDifficulty : 'VETERAN';
    this.aiDoctrine = (saved && saved.aiDoctrine && window.AIR_DOCTRINES[saved.aiDoctrine]) ? saved.aiDoctrine : 'BALANCED';
    this.attackDifficulty = (saved && saved.attackDifficulty && window.ATTACK_DIFFICULTIES[saved.attackDifficulty]) ? saved.attackDifficulty : 'FORWARD_GARRISON';
    this.attackDoctrine = (saved && saved.attackDoctrine && window.ATTACK_DOCTRINES[saved.attackDoctrine]) ? saved.attackDoctrine : 'BALANCED';
    this.playerBudgetId = (saved && saved.playerBudgetId && window.BUDGET_TIERS[saved.playerBudgetId]) ? saved.playerBudgetId : 'BUDGET_400';

    const initTier = window.BUDGET_TIERS[this.playerBudgetId];
    this.budgetMax = initTier.budget;
    this.budgetRemaining = this.budgetMax;
    this.maxSquadronSize = initTier.maxSquadronSize;
    window.CONFIG.MAX_SQUADRON_SIZE = this.maxSquadronSize;

    this.pendingMissionEditorSettings = null;
    this.missionEditorBaseSettings = null;
    this.activeMissionEditorConfig = null;
    this.isMissionEditorMatch = false;
    this.inspectionModeEnabled = false;
    this.currentPvpCommander = 'friendly';

    const initialSquadronName = (window.Persistence && window.Persistence.getSquadronName()) || '7th Tactical Squadron';
    if (!initialSquadronName.trim()) throw new Error('Initial squadron name cannot be empty.');
    this.squadronName = initialSquadronName.trim();
    if (window.Persistence) window.Persistence.saveSquadronName(this.squadronName);

    const maxTok = window.CONFIG.TOKEN_MAX;
    this.tokenBucketBlue = maxTok;
    this.tokenBucketRed = maxTok;
    this.alliedAircraft = [];
    this.hostileAircraft = [];
    this.surfaceUnits = [];
    this.missiles = [];
    this.attackState = null;

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

    this.radar = new RadarRenderer('radar-canvas');
    this.deckManager = new DeckManager(this);
    this.ai = new AICommander(this);
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

    const lastSquadron = window.Persistence ? window.Persistence.getLastSquadron() : null;
    if (lastSquadron && lastSquadron.length > 0) {
      this.procurementSquadron = lastSquadron;
      this.procurement.updateUI();
    } else {
      this.procurement.applyBuiltinPreset('stealth');
    }
    this.setSquadronName(this.squadronName);
    this.setGameMode(this.gameMode);
    this.setPlayerBudgetTier(this.playerBudgetId);
  }

  getMaxSquadronSize() {
    if (!window.CONFIG || typeof window.CONFIG.getMaxSquadronSize !== 'function') {
      throw new Error('CONFIG.getMaxSquadronSize is not loaded.');
    }
    return window.CONFIG.getMaxSquadronSize(this.budgetMax);
  }

  setGameMode(modeId) {
    const modeDef = window.GAME_MODES[modeId];
    if (!modeDef) throw new Error(`Game mode "${modeId}" does not exist in GAME_MODES.`);
    this.gameMode = modeDef.id;
    this.playerMode = modeDef.playerMode;
    this.scenarioMode = modeDef.scenarioMode;

    window.CONFIG.THEATER_WIDTH_KM = modeDef.theaterWidthKm;
    window.CONFIG.THEATER_HEIGHT_KM = modeDef.theaterHeightKm;

    const aiPanel = document.getElementById('ai-config-panel');
    const pvpSwitcher = document.getElementById('pvp-switcher-bar');
    const is2P = (this.playerMode === '2P');

    if (aiPanel) aiPanel.style.display = is2P ? 'none' : 'flex';
    if (pvpSwitcher) pvpSwitcher.classList.toggle('hidden', !is2P);

    if (this.procurement && typeof this.procurement.syncModeDropdowns === 'function') {
      this.procurement.syncModeDropdowns();
    }

    this.updateModeIndicator();
    this.saveGameplaySettings();
  }

  saveGameplaySettings() {
    if (!window.Persistence || typeof window.Persistence.saveGameplaySettings !== 'function') return;
    window.Persistence.saveGameplaySettings({
      gameMode: this.gameMode,
      playerMode: this.playerMode,
      scenarioMode: this.scenarioMode,
      aiDifficulty: this.aiDifficulty,
      aiDoctrine: this.aiDoctrine,
      attackDifficulty: this.attackDifficulty,
      attackDoctrine: this.attackDoctrine,
      playerBudgetId: this.playerBudgetId
    });
  }

  setPlayerBudgetTier(tierKey) {
    const tierData = window.BUDGET_TIERS[tierKey];
    if (!tierData || typeof tierData.budget !== 'number' || typeof tierData.maxSquadronSize !== 'number') {
      throw new Error(`Budget tier "${tierKey}" is missing valid budget or maxSquadronSize in BUDGET_TIERS.`);
    }
    this.playerBudgetId = tierKey;
    this.budgetMax = tierData.budget;
    this.maxSquadronSize = tierData.maxSquadronSize;
    window.CONFIG.MAX_SQUADRON_SIZE = this.maxSquadronSize;

    const subtextEl = document.getElementById('proc-budget-subtext');
    if (subtextEl) {
      subtextEl.textContent = `DEFENSE ALLOCATION: ${this.budgetMax.toFixed(1)}M CREDITS (${tierData.multiplier.toFixed(2)}x VP) UP TO ${this.maxSquadronSize} UNITS`;
    }
    this.updateModeIndicator();
    this.saveGameplaySettings();
    if (this.procurement) {
      this.procurement.updateUI();
      this.procurement.renderCatalog();
    }
  }

  setSquadronName(name) {
    if (!name || !name.trim()) throw new Error('Squadron name cannot be empty.');
    this.squadronName = name.trim();
    const dispEl = document.getElementById('display-squadron-name');
    if (dispEl) dispEl.textContent = this.squadronName;
    const headerEl = document.getElementById('header-squadron-name');
    if (headerEl) headerEl.textContent = this.squadronName.toUpperCase();
    if (this.alliedAircraft) this.alliedAircraft.forEach(ac => { ac.squadronName = this.squadronName; });
    if (window.Persistence) window.Persistence.saveSquadronName(this.squadronName);
  }

  getCurrentCommanderTokenBucket() {
    return this.currentPvpCommander === 'friendly' ? this.tokenBucketBlue : this.tokenBucketRed;
  }

  consumeCurrentCommanderTokens(amount) {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) throw new Error(`Invalid token deduction amount: ${amount}`);
    if (this.currentPvpCommander === 'friendly') {
      if (this.tokenBucketBlue >= amount) { this.tokenBucketBlue -= amount; return true; }
    } else if (this.tokenBucketRed >= amount) {
      this.tokenBucketRed -= amount; return true;
    }
    return false;
  }

  updateModeIndicator() {
    const ind = document.getElementById('theater-mode-indicator');
    if (!ind) return;
    const isAttack = (this.scenarioMode === 'ATTACK');
    const diffData = isAttack ? window.ATTACK_DIFFICULTIES[this.attackDifficulty] : window.AI_DIFFICULTIES[this.aiDifficulty];
    const docData = isAttack ? window.ATTACK_DOCTRINES[this.attackDoctrine] : window.AIR_DOCTRINES[this.aiDoctrine];
    if (!diffData) throw new Error(`Invalid difficulty "${isAttack ? this.attackDifficulty : this.aiDifficulty}" in updateModeIndicator.`);
    if (!docData) throw new Error(`Invalid doctrine "${isAttack ? this.attackDoctrine : this.aiDoctrine}" in updateModeIndicator.`);
    const bTierData = window.BUDGET_TIERS[this.playerBudgetId];
    if (!bTierData) throw new Error(`Invalid playerBudgetId "${this.playerBudgetId}" in updateModeIndicator.`);
    const diffTag = `${diffData.name} (${diffData.scoreMultiplier.toFixed(2)}x)`;
    const bTag = `${bTierData.budget.toFixed(0)}M (${bTierData.multiplier.toFixed(2)}x)`;
    const modeTag = this.playerMode === '2P' ? '2P VERSUS' : (isAttack ? `ATTACK [${diffTag}] [${docData.name}] [${bTag}]` : `1P VS AI [${diffTag}] [${docData.name}] [${bTag}]`);
    const scenarioTag = isAttack ? '240x160 IADS' : (this.scenarioMode === 'DYNAMIC_THEATER' ? 'DYNAMIC THEATER' : 'SKIRMISH');
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

  returnToHangar() {
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    const hudContainer = document.getElementById('hud-container');
    const procModal = document.getElementById('procurement-modal');
    if (hudContainer) hudContainer.classList.add('hidden');
    if (procModal) { procModal.classList.remove('hidden'); procModal.classList.add('active'); }
    if (this.procurement) this.procurement.updateUI();
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
    let lastTime = performance.now(), mfdThrottle = 0, rosterThrottle = 0;
    const renderPayload = { alliedAircraft: this.alliedAircraft, hostileAircraft: this.hostileAircraft, surfaceUnits: this.surfaceUnits, missiles: this.missiles, activeUnit: null, selectedTarget: null, inspectionEntity: null, inspectionMode: false };

    const loop = (currTime) => {
      const dt = Math.min(0.08, (currTime - lastTime) / 1000.0);
      lastTime = currTime;
      if (!this.isGameOver) this.simulation.step(dt);

      renderPayload.alliedAircraft = this.alliedAircraft;
      renderPayload.hostileAircraft = this.hostileAircraft;
      renderPayload.surfaceUnits = this.surfaceUnits;
      renderPayload.missiles = this.missiles;
      renderPayload.activeUnit = this.activeUnit;
      renderPayload.selectedTarget = this.selectedTarget;
      renderPayload.inspectionEntity = this.inspection && this.inspection.isOpen ? this.inspection.selectedEntity : null;
      renderPayload.inspectionMode = Boolean(this.inspection && this.inspection.isOpen);
      this.radar.render(renderPayload);

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
    if (this.inspection) this.inspection.recordEvent('MISSION END', msg || (blueWon ? 'Victory' : 'Defeat'), null, null, { result: blueWon ? 'VICTORY' : 'DEFEAT' });
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    this.simulation.captureReplayFrame(true);
    if (typeof DebriefReportSystem === 'undefined') throw new Error('DebriefReportSystem is not loaded.');
    DebriefReportSystem.renderSortieSummary(this, blueWon, msg);
  }
}

window.AirspaceStandoffGame = AirspaceStandoffGame;
function initAirspaceStandoff() { if (!window.Game) window.Game = new AirspaceStandoffGame(); }
if (document.readyState === 'complete' || document.readyState === 'interactive') initAirspaceStandoff();
else window.addEventListener('DOMContentLoaded', initAirspaceStandoff);
