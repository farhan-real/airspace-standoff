/**
 * AIRSPACE STANDOFF // Master Game Orchestrator (150km x 100km Arena & Full Persistence)
 * Flight Lead spawns in the formation center (middle of squadron) with command buffs.
 * In 2P mode, mutual full detection & identification active from start.
 * Aircraft altitude initialized cleanly to prevent false climb/dive states.
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
      const savedSquadron = window.Persistence ? window.Persistence.getLastSquadron() : null;
      if (savedSquadron && savedSquadron.length > 0) {
        this.procurementSquadron = savedSquadron;
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
    if (subtextEl) {
      subtextEl.textContent = `DEFENSE ALLOCATION: ${this.budgetMax.toFixed(1)}M CREDITS (${tierData.multiplier.toFixed(2)}x VP) â€¢ UP TO 16 UNITS`;
    }
    this.updateModeIndicator();
    if (this.procurement) this.procurement.updateUI();
  }

  setSquadronName(name) {
    if (!name || !name.trim()) return;
    this.squadronName = name.trim();
    const dispEl = document.getElementById('display-squadron-name');
    if (dispEl) dispEl.textContent = this.squadronName;
    const headerEl = document.getElementById('header-squadron-name');
    if (headerEl) headerEl.textContent = `${this.squadronName.toUpperCase()} â€¢ FLIGHT DATA`;
    if (this.alliedAircraft) {
      this.alliedAircraft.forEach(ac => { ac.squadronName = this.squadronName; });
    }
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
      CADET: 'Cadet (0.6x)', VETERAN: 'Veteran (1.0x)', ELITE: 'Elite (1.4x)',
      ACE: 'Theater Ace (1.8x)', MASTER: 'Supreme Master (2.2x)', LEGEND: 'Apex Legend (2.8x)'
    };
    const bMap = {
      BUDGET_200: '200M (1.5x)', BUDGET_300: '300M (1.25x)', BUDGET_400: '400M (1.0x)',
      BUDGET_500: '500M (0.85x)', BUDGET_650: '650M (0.7x)'
    };
    const diffTag = diffMap[this.aiDifficulty] || this.aiDifficulty;
    const bTag = bMap[this.playerBudgetId] || '400M';
    const modeTag = this.playerMode === '1P' ? (`1P VS AI [${diffTag}] â€¢ [${bTag}]`) : '2P VERSUS';
    const scenarioTag = this.scenarioMode === 'DYNAMIC_THEATER' ? 'DYNAMIC SQUADRON THEATER' : 'SKIRMISH';
    ind.textContent = `${modeTag} â€¢ ${scenarioTag}`;
  }

  canFirePylon(u, item, tgt) {
    return (this.combat && this.combat.canFire) ? this.combat.canFire(u, item, tgt) : false;
  }

  firePylon(u, idx, tgt) {
    if (this.combat && this.combat.fire) {
      this.combat.fire(u, idx, tgt);
      this.stats.missilesLaunched++;
    }
  }

  executeCard(card, u) {
    if (this.combat && this.combat.executeCard) this.combat.executeCard(card, u);
  }

  abortSortie() {
    if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    this.triggerGameOver(false, 'SORTIE ABORTED // TACTICAL WITHDRAWAL');
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
      this.simulation.setTimeWarp(1);
    }
    const scoreLogEl = document.getElementById('combat-score-log-list');
    if (scoreLogEl) scoreLogEl.innerHTML = '';
    const aarTimelineEl = document.getElementById('aar-timeline-list');
    if (aarTimelineEl) aarTimelineEl.innerHTML = '';

    const targetInfo = document.getElementById('selected-target-info');
    if (targetInfo) targetInfo.textContent = 'TARGET: NONE';

    if (!this.procurementSquadron || this.procurementSquadron.length === 0) {
      if (typeof ProcurementPresets !== 'undefined') {
        this.procurementSquadron = ProcurementPresets.getBuiltinPreset('stealth');
      }
    }

    const mapW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const callsignPool = [...(window.CALLSIGN_POOL || ['Trigger', 'Mobius 1', 'Cipher', 'Viper', 'Ghost', 'Talon'])];
    const takeCallsign = () => callsignPool.length ? callsignPool.splice(Math.floor(Math.random() * callsignPool.length), 1)[0] : 'Viper';

    this.alliedAircraft = [];
    const fleetTotal = this.procurementSquadron.length || 1;

    let chosenLeadIdx = this.procurementSquadron.findIndex(it => it && it.isLead);
    if (chosenLeadIdx === -1) chosenLeadIdx = 0;

    const leadItem = this.procurementSquadron[chosenLeadIdx] || this.procurementSquadron[0];
    const wingmenItems = this.procurementSquadron.filter((_, idx) => idx !== chosenLeadIdx);

    const midY = mapH / 2.0;
    const formationSpanY = Math.min(mapH - 24.0, Math.max(16.0, (fleetTotal - 1) * 7.5));
    const startY = midY - (formationSpanY / 2.0);
    const stepY = (fleetTotal > 1) ? (formationSpanY / (fleetTotal - 1)) : 0;
    const middleSlot = Math.floor(fleetTotal / 2);

    const spawnPlan = [];
    let wingmanCursor = 0;

    for (let slot = 0; slot < fleetTotal; slot++) {
      const slotBaseY = (fleetTotal === 1) ? midY : (startY + slot * stepY);
      const finalY = Math.max(10.0, Math.min(mapH - 10.0, slotBaseY + (Math.random() * 3.0 - 1.5)));

      if (slot === middleSlot) {
        const spawnX = 14.0 + Math.random() * 2.5;
        spawnPlan.push({ item: leadItem, isLead: true, x: spawnX, y: finalY });
      } else {
        const wItem = wingmenItems[wingmanCursor++];
        const distFromMid = Math.abs(slot - middleSlot);
        const spawnX = Math.max(6.0, 14.0 - distFromMid * 1.5 + (Math.random() * 2.0 - 1.0));
        spawnPlan.push({ item: wItem, isLead: false, x: spawnX, y: finalY });
      }
    }

    spawnPlan.forEach(plan => {
      const item = plan.item;
      if (!item) return;
      const heading = (Math.random() * 0.2 - 0.1);
      const initialAltFt = (item.specId === 'DARKSTAR') ? 58000 : (24000 + Math.floor(Math.random() * 8) * 1000);

      const ac = new Aircraft(
        item.specId, 'friendly', plan.x, plan.y, heading, item.chosenGunId,
        item.callsign || takeCallsign(), this.squadronName || 'Wardog Squadron',
        plan.isLead, false, initialAltFt
      );

      (item.upgrades || []).forEach(uItem => {
        const uId = (typeof uItem === 'object' && uItem !== null) ? (uItem.id || uItem.specId) : uItem;
        if (uId) ac.installUpgrade(uId);
      });
      (item.weapons || []).forEach(wItem => {
        const wId = (typeof wItem === 'object' && wItem !== null) ? (wItem.id || wItem.specId) : wItem;
        if (wId) ac.installWeapon(wId);
      });
      this.alliedAircraft.push(ac);
    });

    this.hostileAircraft = (typeof FleetGenerator !== 'undefined')
      ? FleetGenerator.generateHostileFleet(this.aiDifficulty, this.aiDoctrine, mapW, mapH)
      : [];

    // IN 2P MODE: Mutual detection and identification from the start
    if (this.playerMode === '2P') {
      this.alliedAircraft.forEach(a => {
        a.identifiedByBlue = true;
        a.identifiedByRed = true;
        a.isIdentified = true;
        this.detectedByBlue.add(a.id);
        this.detectedByRed.add(a.id);
      });
      this.hostileAircraft.forEach(h => {
        h.identifiedByBlue = true;
        h.identifiedByRed = true;
        h.isIdentified = true;
        this.detectedByBlue.add(h.id);
        this.detectedByRed.add(h.id);
      });
    }

    this.surfaceUnits = [
      new SurfaceUnit('BUNKER', 'friendly', 8, mapH / 2),
      new SurfaceUnit('RADAR_ARRAY', 'friendly', 10, mapH / 2 - 10),
      new SurfaceUnit('EW_JAMMER', 'friendly', 16, mapH / 2 - 20),
      new SurfaceUnit('S-400', 'friendly', 16, 22),
      new SurfaceUnit('PANTSIR', 'friendly', 14, mapH / 2 + 10),
      new SurfaceUnit('FUEL_DEPOT', 'friendly', 12, 16),
      new SurfaceUnit('AMMO_DUMP', 'friendly', 36, mapH / 2 - 10),

      new SurfaceUnit('BUNKER', 'hostile', mapW - 8, mapH / 2),
      new SurfaceUnit('RADAR_ARRAY', 'hostile', mapW - 10, mapH / 2 - 10),
      new SurfaceUnit('EW_JAMMER', 'hostile', mapW - 16, mapH / 2 - 20),
      new SurfaceUnit('S-400', 'hostile', mapW - 16, 22),
      new SurfaceUnit('PANTSIR', 'hostile', mapW - 14, mapH / 2 + 10),
      new SurfaceUnit('FUEL_DEPOT', 'hostile', mapW - 12, 16),
      new SurfaceUnit('AMMO_DUMP', 'hostile', mapW - 36, mapH / 2 + 10),
      new SurfaceUnit('RADAR_VAN', 'hostile', mapW - 20, 36)
    ];

    if (this.simulation) {
      this.simulation.civilianTraffic = [];
      this.simulation.civilianSpawnTimer = 0.0;
      this.simulation.waveSpawnTimer = 0.0;
      this.simulation.currentWave = 1;
      this.simulation.spawnCivilianFlight();
    }

    this.activeUnit = this.alliedAircraft.find(a => a.isFlightLead) || this.alliedAircraft[0] || null;
    this.currentPvpCommander = 'friendly';

    if (this.radar) {
      this.radar.resize();
      this.radar.resetCamera();
    }
    if (this.avionics) {
      this.avionics.renderFlightRoster();
      this.avionics.updateActiveUnitMFD();
    }
    this.startLoop();
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
    if (typeof AfterActionReportSystem !== 'undefined') {
      AfterActionReportSystem.renderSortieSummary(this, blueWon, msg);
    }
  }
}

window.AirspaceStandoffGame = AirspaceStandoffGame;

function initAirspaceStandoff() {
  if (!window.Game) window.Game = new AirspaceStandoffGame();
}
if (document.readyState === 'complete' || document.readyState === 'interactive') initAirspaceStandoff();
else window.addEventListener('DOMContentLoaded', initAirspaceStandoff);