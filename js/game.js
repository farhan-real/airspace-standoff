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
    this.playerMode = '1P';
    this.scenarioMode = 'SKIRMISH';
    this.aiDifficulty = 'VETERAN';
    this.aiDoctrine = 'BALANCED';
    this.pendingMissionEditorSettings = null;
    this.missionEditorBaseSettings = null;
    this.activeMissionEditorConfig = null;
    this.isMissionEditorMatch = false;
    this.inspectionModeEnabled = false;
    this.currentPvpCommander = 'friendly';

    this.playerBudgetId = 'BUDGET_400';
    this.budgetMax = 400.0;
    this.budgetRemaining = 400.0;

    let initialSquadronName = (window.Persistence && window.Persistence.getSquadronName()) || '7th Tactical Squadron';
    if (!initialSquadronName || initialSquadronName.toLowerCase().includes('wardog')) {
      initialSquadronName = '7th Tactical Squadron';
      if (window.Persistence) window.Persistence.saveSquadronName(initialSquadronName);
    }
    this.squadronName = initialSquadronName;

    const maxTok = (window.CONFIG && window.CONFIG.TOKEN_MAX) || 8.0;
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

    this.radar = (typeof TacticalRadarRenderer !== 'undefined') ? new TacticalRadarRenderer('radar-canvas') : null;
    this.deckManager = (typeof DeckManager !== 'undefined') ? new DeckManager(this) : null;
    this.ai = (typeof TacticalAICommander !== 'undefined') ? new TacticalAICommander(this) : null;
    this.combat = (typeof CombatSystem !== 'undefined') ? new CombatSystem(this) : null;
    this.simulation = (typeof SimulationSystem !== 'undefined') ? new SimulationSystem(this) : null;
    this.avionics = (typeof AvionicsUI !== 'undefined') ? new AvionicsUI(this) : null;
    this.settings = (typeof SettingsManager !== 'undefined') ? new SettingsManager(this) : null;
    window.Settings = this.settings;

    this.controls = (typeof ControlsSystem !== 'undefined') ? new ControlsSystem(this) : null;
    this.inspection = (typeof InspectionModeController !== 'undefined') ? new InspectionModeController(this) : null;
    this.procurement = (typeof ProcurementManager !== 'undefined') ? new ProcurementManager(this) : null;
    this.procurementSquadron = [];

    if (this.controls && this.controls.init) this.controls.init();
    if (this.procurement && this.procurement.init) {
      this.procurement.init();
      const saved = window.Persistence ? window.Persistence.getLastSquadron() : null;
      if (saved && saved.length > 0) {
        saved.forEach(item => {
          if (item && item.callsign && item.callsign.toLowerCase().includes('wardog')) {
            item.callsign = item.callsign.replace(/wardog/gi, 'Viper');
          }
        });
        this.procurementSquadron = saved;
        this.procurement.updateUI();
      } else {
        this.procurement.applyBuiltinPreset('stealth');
      }
      this.setSquadronName(this.squadronName);
    }
  }

  installModalDOMTemplates() {
    if (window.ModalDialogTemplates && typeof window.ModalDialogTemplates.install === 'function') window.ModalDialogTemplates.install();
    if (window.ModalEditorTemplate && typeof window.ModalEditorTemplate.install === 'function') window.ModalEditorTemplate.install();
    if (window.ModalDebriefTemplate && typeof window.ModalDebriefTemplate.install === 'function') window.ModalDebriefTemplate.install();
    if (window.ModalPanelsTemplates && typeof window.ModalPanelsTemplates.install === 'function') window.ModalPanelsTemplates.install();
    if (typeof window.initTacticalManual === 'function') window.initTacticalManual();
  }

  setPlayerBudgetTier(tierKey) {
    const tierData = (window.BUDGET_TIERS && window.BUDGET_TIERS[tierKey]) || { budget: 400.0, multiplier: 1.0 };
    this.playerBudgetId = tierKey;
    this.budgetMax = tierData.budget;
    const subtextEl = document.getElementById('proc-budget-subtext');
    if (subtextEl) subtextEl.textContent = `DEFENSE ALLOCATION: ${this.budgetMax.toFixed(1)}M CREDITS (${tierData.multiplier.toFixed(2)}x VP) UP TO 16 UNITS`;
    this.updateModeIndicator();
    if (this.procurement) this.procurement.updateUI();
  }

  setSquadronName(name) {
    if (!name || !name.trim()) return;
    let cleanName = name.trim();
    if (cleanName.toLowerCase().includes('wardog')) cleanName = '7th Tactical Squadron';
    this.squadronName = cleanName;
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
    const diffMap = {
      CADET: 'Permissive Sector (0.50x)',
      VETERAN: 'Contested Airspace (1.00x)',
      ELITE: 'Hostile Airspace (1.50x)',
      ACE: 'High-Threat Sector (2.00x)',
      MASTER: 'Air Denial Zone (2.60x)',
      LEGEND: 'Extreme Threat Sector (3.20x)'
    };
    const bMap = {
      BUDGET_200: '200M (1.75x)',
      BUDGET_300: '300M (1.30x)',
      BUDGET_400: '400M (1.00x)',
      BUDGET_500: '500M (0.80x)',
      BUDGET_650: '650M (0.60x)'
    };
    const diffTag = diffMap[this.aiDifficulty] || this.aiDifficulty;
    const bTag = bMap[this.playerBudgetId] || '400M (1.00x)';
    const modeTag = this.playerMode === '1P' ? (`1P VS AI [${diffTag}] [${bTag}]`) : '2P VERSUS';
    const scenarioTag = this.scenarioMode === 'DYNAMIC_THEATER' ? 'DYNAMIC THEATER' : 'SKIRMISH';
    ind.textContent = `${modeTag} ${scenarioTag}`;
  }

  canFirePylon(u, item, tgt) { return (this.combat && this.combat.canFire) ? this.combat.canFire(u, item, tgt) : false; }
  firePylon(u, idx, tgt) { if (this.combat && this.combat.fire) { this.combat.fire(u, idx, tgt); this.stats.missilesLaunched++; } }
  executeCard(card, u) { if (this.combat && this.combat.executeCard) this.combat.executeCard(card, u); }

  abortSortie() {
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    this.triggerGameOver(false, 'SORTIE ABORTED - WITHDRAWAL');
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  scrambleFlight() {
    if (typeof AudioSys !== 'undefined') AudioSys.ensureContext();
    if (typeof SortieSpawner !== 'undefined') {
      SortieSpawner.setupMission(this);
    }
    this.startLoop();
  }

  startLoop() {
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    this.isGameOver = false;
    if (this.simulation) this.simulation.captureReplayFrame(true);
    let lastTime = performance.now();
    let uiThrottle = 0;

    const loop = (currTime) => {
      const dt = Math.min(0.1, (currTime - lastTime) / 1000.0);
      lastTime = currTime;

      if (!this.isGameOver && this.simulation && this.simulation.step) this.simulation.step(dt);
      if (this.radar && this.radar.render) {
        this.radar.render({
          alliedAircraft: this.alliedAircraft, hostileAircraft: this.hostileAircraft,
          surfaceUnits: this.surfaceUnits, missiles: this.missiles,
          activeUnit: this.activeUnit, selectedTarget: this.selectedTarget,
          inspectionEntity: this.inspection && this.inspection.isOpen ? this.inspection.selectedEntity : null,
          inspectionMode: Boolean(this.inspection && this.inspection.isOpen)
        });
      }

      uiThrottle += dt;
      if (uiThrottle >= 0.12) {
        uiThrottle = 0;
        if (this.avionics) { this.avionics.updateActiveUnitMFD(); this.avionics.renderFlightRoster(); }
        if (this.inspection) this.inspection.update();
      }
      if (!this.isGameOver) this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  triggerGameOver(blueWon, msg) {
    this.isGameOver = true;
    if (this.inspection) this.inspection.recordEvent('MISSION END', msg || (blueWon ? 'Victory' : 'Defeat'), null, null, { result: blueWon ? 'VICTORY' : 'DEFEAT' });
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    if (this.simulation) this.simulation.captureReplayFrame(true);
    if (typeof AfterActionReportSystem !== 'undefined') AfterActionReportSystem.renderSortieSummary(this, blueWon, msg);
  }
}

window.AirspaceStandoffGame = AirspaceStandoffGame;
function initAirspaceStandoff() { if (!window.Game) window.Game = new AirspaceStandoffGame(); }
if (document.readyState === 'complete' || document.readyState === 'interactive') initAirspaceStandoff();
else window.addEventListener('DOMContentLoaded', initAirspaceStandoff);