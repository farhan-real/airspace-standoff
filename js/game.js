/**
 * AIRSPACE STANDOFF // Master Game Orchestrator (150km x 100km Arena & Full Persistence)
 * Flight Lead spawns in formation center; mutual full detection in 2P mode.
 */

class AirspaceStandoffGame {
  constructor() {
    this.playerMode = '1P';
    this.scenarioMode = 'SKIRMISH';
    this.aiDifficulty = 'VETERAN';
    this.aiDoctrine = 'BALANCED';
    this.currentPvpCommander = 'friendly';

    this.playerBudgetId = 'BUDGET_400';
    this.budgetMax = 400.0;
    this.budgetRemaining = 400.0;
    this.squadronName = (window.Persistence && window.Persistence.getSquadronName()) || 'Wardog Squadron';

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

    this.stats = { blueLosses: 0, redLosses: 0, missilesLaunched: 0, salvoCoordinatedHits: 0 };
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
    this.procurement = (typeof ProcurementManager !== 'undefined') ? new ProcurementManager(this) : null;
    this.procurementSquadron = [];

    if (this.controls && this.controls.init) this.controls.init();
    if (this.procurement && this.procurement.init) {
      this.procurement.init();
      const saved = window.Persistence ? window.Persistence.getLastSquadron() : null;
      if (saved && saved.length > 0) {
        this.procurementSquadron = saved;
        this.procurement.updateUI();
      } else {
        this.procurement.applyBuiltinPreset('stealth');
      }
      this.setSquadronName(this.squadronName);
    }
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
    this.squadronName = name.trim();
    const dispEl = document.getElementById('display-squadron-name');
    if (dispEl) dispEl.textContent = this.squadronName;
    const headerEl = document.getElementById('header-squadron-name');
    if (headerEl) headerEl.textContent = `${this.squadronName.toUpperCase()} FLIGHT DATA`;
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
      CADET: 'Permissive Sector (0.6x)',
      VETERAN: 'Contested Airspace (1.0x)',
      ELITE: 'Active Combat Zone (1.4x)',
      ACE: 'High-Threat Grid (1.8x)',
      MASTER: 'Air Denial Zone (2.2x)',
      LEGEND: 'Fortress Airspace (2.8x)'
    };
    const bMap = { BUDGET_200: '200M (1.5x)', BUDGET_300: '300M (1.25x)', BUDGET_400: '400M (1.0x)', BUDGET_500: '500M (0.85x)', BUDGET_650: '650M (0.7x)' };
    const diffTag = diffMap[this.aiDifficulty] || this.aiDifficulty;
    const bTag = bMap[this.playerBudgetId] || '400M';
    const modeTag = this.playerMode === '1P' ? (`1P VS AI [${diffTag}] [${bTag}]`) : '2P VERSUS';
    const scenarioTag = this.scenarioMode === 'DYNAMIC_THEATER' ? 'DYNAMIC SQUADRON THEATER' : 'SKIRMISH';
    ind.textContent = `${modeTag} ${scenarioTag}`;
  }

  canFirePylon(u, item, tgt) { return (this.combat && this.combat.canFire) ? this.combat.canFire(u, item, tgt) : false; }
  firePylon(u, idx, tgt) { if (this.combat && this.combat.fire) { this.combat.fire(u, idx, tgt); this.stats.missilesLaunched++; } }
  executeCard(card, u) { if (this.combat && this.combat.executeCard) this.combat.executeCard(card, u); }

  abortSortie() {
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    this.triggerGameOver(false, 'SORTIE ABORTED - TACTICAL WITHDRAWAL');
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  scrambleFlight() {
    if (typeof AudioSys !== 'undefined') AudioSys.ensureContext();
    ['system-inspect-modal', 'glossary-modal', 'settings-modal', 'rwr-briefing-modal', 'abort-confirm-modal', 'game-over-modal', 'procurement-modal', 'pause-modal'].forEach(id => {
      const m = document.getElementById(id); if (m) m.classList.remove('active');
    });

    const maxTok = (window.CONFIG && window.CONFIG.TOKEN_MAX) || 8.0;
    this.tokenBucketBlue = maxTok;
    this.tokenBucketRed = maxTok;
    this.missiles = [];
    this.vpAlly = 0;
    this.vpHostile = 0;
    this.isGameOver = false;
    this.selectedTarget = null;
    this.matchStartTime = performance.now();
    this.stats = { blueLosses: 0, redLosses: 0, missilesLaunched: 0, salvoCoordinatedHits: 0 };
    this.detectedByBlue = new Set();
    this.detectedByRed = new Set();

    if (this.simulation) {
      this.simulation.scoreLog = [];
      this.simulation.timelineEvents = [];
      this.simulation.ghostContacts = [];
      this.simulation.decoyDrones = [];
      this.simulation.ghostSpawnTimer = 0.0;
      this.simulation.setTimeWarp(1);
      this.simulation.initWeatherClouds();
    }
    const scoreLogEl = document.getElementById('combat-score-log-list');
    if (scoreLogEl) scoreLogEl.innerHTML = '';
    const aarTimelineEl = document.getElementById('aar-timeline-list');
    if (aarTimelineEl) aarTimelineEl.innerHTML = '';

    if (!this.procurementSquadron || this.procurementSquadron.length === 0) {
      if (typeof ProcurementPresets !== 'undefined') this.procurementSquadron = ProcurementPresets.getBuiltinPreset('stealth');
    }

    const mapW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const callsignPool = [...(window.CALLSIGN_POOL || ['Trigger', 'Mobius 1', 'Cipher', 'Viper', 'Ghost', 'Talon'])].sort(() => Math.random() - 0.5);
    const takeCallsign = () => callsignPool.length ? callsignPool.pop() : 'Viper';

    this.alliedAircraft = [];
    let chosenLeadIdx = this.procurementSquadron.findIndex(it => it && it.isLead);
    if (chosenLeadIdx === -1) chosenLeadIdx = 0;
    this.procurementSquadron.forEach((it, idx) => { it.isLead = (idx === chosenLeadIdx); });

    const spawnPlans = FleetGenerator.calculateFormationSpawns(this.procurementSquadron, 'friendly', mapW, mapH);
    spawnPlans.forEach(plan => {
      const item = plan.item;
      if (!item) return;
      const heading = (Math.random() * 0.16 - 0.08);
      const initialAltFt = (item.specId === 'DARKSTAR') ? 58000 : (20000 + Math.floor(Math.random() * 18) * 1000);

      const ac = new Aircraft(
        item.specId, 'friendly', plan.x, plan.y, heading, item.chosenGunId,
        item.callsign || takeCallsign(), this.squadronName || 'Wardog Squadron',
        plan.isLead, false, initialAltFt
      );
      (item.upgrades || []).forEach(u => ac.installUpgrade((typeof u === 'object' && u !== null) ? (u.id || u.specId) : u));
      (item.weapons || []).forEach(w => ac.installWeapon((typeof w === 'object' && w !== null) ? (w.id || w.specId) : w));
      this.alliedAircraft.push(ac);
    });

    this.hostileAircraft = (typeof FleetGenerator !== 'undefined')
      ? FleetGenerator.generateHostileFleet(this.aiDifficulty, this.aiDoctrine, mapW, mapH) : [];

    if (this.playerMode === '2P') {
      [...this.alliedAircraft, ...this.hostileAircraft].forEach(unit => {
        unit.identifiedByBlue = true; unit.identifiedByRed = true; unit.isIdentified = true;
        this.detectedByBlue.add(unit.id); this.detectedByRed.add(unit.id);
      });
    }

    this.initSurfaceFacilities(mapW, mapH);
    if (this.simulation) {
      this.simulation.civilianTraffic = [];
      this.simulation.civilianSpawnTimer = 0.0;
      this.simulation.waveSpawnTimer = 0.0;
      this.simulation.currentWave = 1;
      this.simulation.spawnCivilianFlight();
    }

    this.activeUnit = this.alliedAircraft.find(a => a.isFlightLead) || this.alliedAircraft[0] || null;
    this.currentPvpCommander = 'friendly';
    if (this.radar) { this.radar.resize(); this.radar.resetCamera(); }
    if (this.avionics) { this.avionics.renderFlightRoster(); this.avionics.updateActiveUnitMFD(); }
    this.startLoop();
  }

  initSurfaceFacilities(mapW, mapH) {
    this.surfaceUnits = [
      new SurfaceUnit('BUNKER', 'friendly', 8, mapH / 2),
      new SurfaceUnit('RADAR_ARRAY', 'friendly', 10, mapH / 2 - 10),
      new SurfaceUnit('EW_JAMMER', 'friendly', 16, mapH / 2 - 20),
      new SurfaceUnit('S-400', 'friendly', 16, 22),
      new SurfaceUnit('PANTSIR', 'friendly', 14, mapH / 2 + 10),
      new SurfaceUnit('FUEL_DEPOT', 'friendly', 12, 16),
      new SurfaceUnit('AMMO_DUMP', 'friendly', 32, mapH / 2 - 10),

      new SurfaceUnit('BUNKER', 'hostile', mapW - 8, mapH / 2),
      new SurfaceUnit('RADAR_ARRAY', 'hostile', mapW - 10, mapH / 2 - 10),
      new SurfaceUnit('EW_JAMMER', 'hostile', mapW - 16, mapH / 2 - 20),
      new SurfaceUnit('S-400', 'hostile', mapW - 16, 22),
      new SurfaceUnit('PANTSIR', 'hostile', mapW - 14, mapH / 2 + 10),
      new SurfaceUnit('FUEL_DEPOT', 'hostile', mapW - 12, 16),
      new SurfaceUnit('AMMO_DUMP', 'hostile', mapW - 32, mapH / 2 + 10),
      new SurfaceUnit('RADAR_VAN', 'hostile', mapW - 20, 36)
    ];
  }

  startLoop() {
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    this.isGameOver = false;
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
          activeUnit: this.activeUnit, selectedTarget: this.selectedTarget
        });
      }

      uiThrottle += dt;
      if (uiThrottle >= 0.12) {
        uiThrottle = 0;
        if (this.avionics) { this.avionics.updateActiveUnitMFD(); this.avionics.renderFlightRoster(); }
      }
      if (!this.isGameOver) this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  triggerGameOver(blueWon, msg) {
    this.isGameOver = true;
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    if (typeof AfterActionReportSystem !== 'undefined') AfterActionReportSystem.renderSortieSummary(this, blueWon, msg);
  }
}

window.AirspaceStandoffGame = AirspaceStandoffGame;
function initAirspaceStandoff() { if (!window.Game) window.Game = new AirspaceStandoffGame(); }
if (document.readyState === 'complete' || document.readyState === 'interactive') initAirspaceStandoff();
else window.addEventListener('DOMContentLoaded', initAirspaceStandoff);