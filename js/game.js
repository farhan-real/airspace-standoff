/**
 * AIRSPACE STANDOFF: Master Game Orchestrator (150km x 100km Theater & Full Persistence)
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
      CADET: 'Low Threat Sector (0.50x)',
      VETERAN: 'Contested Sector (1.00x)',
      ELITE: 'High Threat Sector (1.50x)',
      ACE: 'Severe Threat Sector (2.00x)',
      MASTER: 'Air Defense Sector (2.60x)',
      LEGEND: 'Hostile Airspace (3.20x)'
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
    if (this.pendingMissionEditorSettings) {
      this.missionEditorBaseSettings = {
        scenarioMode: this.scenarioMode,
        aiDifficulty: this.aiDifficulty,
        aiDoctrine: this.aiDoctrine
      };
    }
    const editorMission = window.MissionEditor && typeof window.MissionEditor.consumeNextMission === 'function'
      ? window.MissionEditor.consumeNextMission(this)
      : null;
    this.activeMissionEditorConfig = editorMission;
    this.isMissionEditorMatch = Boolean(editorMission && editorMission.unranked);
    this.inspectionModeEnabled = Boolean(editorMission && editorMission.inspectionMode);
    if (editorMission) {
      this.scenarioMode = editorMission.scenarioMode;
      this.aiDifficulty = editorMission.difficulty;
      this.aiDoctrine = editorMission.doctrine;
      const skirmishButton = document.getElementById('scenario-btn-skirmish');
      const dynamicButton = document.getElementById('scenario-btn-dynamic');
      if (skirmishButton) skirmishButton.classList.toggle('active', this.scenarioMode === 'SKIRMISH');
      if (dynamicButton) dynamicButton.classList.toggle('active', this.scenarioMode === 'DYNAMIC_THEATER');
      this.updateModeIndicator();
    }
    if (this.procurement) this.procurement.updateUI();
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
    this.stats = { blueLosses: 0, redLosses: 0, missilesLaunched: 0, salvoCoordinatedHits: 0, defensiveIntercepts: 0 };
    this.detectedByBlue = new Set();
    this.detectedByRed = new Set();

    if (this.simulation) {
      this.simulation.scoreLog = [];
      this.simulation.timelineEvents = [];
      this.simulation.ghostContacts = [];
      this.simulation.decoyDrones = [];
      this.simulation.ghostSpawnTimer = 0.0;
      this.simulation.setTimeWarp(1);
      this.simulation.resetReplay();
      this.simulation.cloudCoverage = editorMission ? editorMission.clouds : 'RANDOM';
      this.simulation.civilianTrafficEnabled = editorMission ? editorMission.civilians === 'ON' : true;
      this.simulation.initWeatherClouds();
    }
    const scoreLogEl = document.getElementById('combat-score-log-list');
    if (scoreLogEl) scoreLogEl.innerHTML = '';
    const aarTimelineEl = document.getElementById('aar-timeline-list');
    if (aarTimelineEl) aarTimelineEl.innerHTML = '';

    let launchSquadron = this.procurementSquadron || [];
    if (editorMission && editorMission.blueSquadron === 'RANDOM' && window.MissionEditor) {
      launchSquadron = window.MissionEditor.createRandomSquadron(this, editorMission);
    }
    if (editorMission && editorMission.blueWeapons === 'STANDARD' && typeof FleetGenerator !== 'undefined') {
      launchSquadron = launchSquadron.map(item => {
        if (!item) return item;
        const spec = (window.AIRCRAFT_CATALOG || {})[item.specId];
        if (!spec) return item;
        const loadout = FleetGenerator.planAircraftLoadout(spec, false, editorMission.doctrine, editorMission.difficulty, Math.random);
        return { ...item, weapons: loadout.weapons || [] };
      });
    }
    if (launchSquadron.length === 0) {
      const fallbackSquadron = (typeof ProcurementPresets !== 'undefined')
        ? ProcurementPresets.getBuiltinPreset('stealth') : [];
      if (!editorMission) this.procurementSquadron = fallbackSquadron;
      launchSquadron = fallbackSquadron;
    }

    const mapW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const callsignPool = [...(window.CALLSIGN_POOL || ['Trigger', 'Mobius 1', 'Cipher', 'Viper', 'Ghost', 'Talon'])].sort(() => Math.random() - 0.5);
    const takeCallsign = () => callsignPool.length ? callsignPool.pop() : 'Viper';

    this.alliedAircraft = [];
    let chosenLeadIdx = launchSquadron.findIndex(it => it && it.isLead);
    if (chosenLeadIdx === -1) chosenLeadIdx = 0;
    launchSquadron.forEach((it, idx) => { if (it) it.isLead = (idx === chosenLeadIdx); });

    const spawnPlans = FleetGenerator.calculateFormationSpawns(launchSquadron, 'friendly', mapW, mapH);
    spawnPlans.forEach(plan => {
      const item = plan.item;
      if (!item) return;
      const heading = (Math.random() * 0.16 - 0.08);
      const initialAltFt = (item.specId === 'DARKSTAR') ? 58000 : (20000 + Math.floor(Math.random() * 18) * 1000);

      const ac = new Aircraft(
        item.specId, 'friendly', plan.x, plan.y, heading, item.chosenGunId,
        item.callsign || takeCallsign(), this.squadronName || '7th Tactical Squadron',
        plan.isLead, false, initialAltFt
      );
      (item.upgrades || []).forEach(u => ac.installUpgrade((typeof u === 'object' && u !== null) ? (u.id || u.specId) : u));
      (item.weapons || []).forEach(w => ac.installWeapon((typeof w === 'object' && w !== null) ? (w.id || w.specId) : w));
      ac.recalculateWeight();
      if (editorMission && editorMission.blueWeapons === 'RANDOM' && window.MissionEditor) {
        window.MissionEditor.applyRandomWeapons(ac);
      }
      ac.speed = ac.getTargetMach();
      ac.prevSpeed = ac.speed;
      ac.speedTrend = '--';
      this.alliedAircraft.push(ac);
    });

    this.hostileAircraft = (typeof FleetGenerator !== 'undefined')
      ? FleetGenerator.generateHostileFleet(this.aiDifficulty, this.aiDoctrine, mapW, mapH,
        editorMission ? { aircraftCount: editorMission.redSize } : {}) : [];

    this.hostileAircraft.forEach(h => {
      h.recalculateWeight();
      if (editorMission && editorMission.redWeapons === 'RANDOM' && window.MissionEditor) {
        window.MissionEditor.applyRandomWeapons(h);
      }
      h.speed = h.getTargetMach();
      h.prevSpeed = h.speed;
      h.speedTrend = '--';
    });
    this.ensureUniqueAircraftCallsigns();

    if (this.playerMode === '2P') {
      [...this.alliedAircraft, ...this.hostileAircraft].forEach(unit => {
        unit.identifiedByBlue = true; unit.identifiedByRed = true; unit.isIdentified = true;
        this.detectedByBlue.add(unit.id); this.detectedByRed.add(unit.id);
      });
    }

    this.initSurfaceFacilities(mapW, mapH);
    if (editorMission && editorMission.defenses === 'LIGHT') {
      this.surfaceUnits = this.surfaceUnits.filter(unit => unit.type !== 'S-400');
    } else if (editorMission && editorMission.defenses === 'OFF') {
      this.surfaceUnits = this.surfaceUnits.filter(unit => unit.type !== 'S-400' && unit.type !== 'PANTSIR');
    }
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
    if (this.inspection) this.inspection.beginMission(this.inspectionModeEnabled);
    this.startLoop();
  }

  ensureUniqueAircraftCallsigns() {
    const used = new Set();
    const aircraft = [...(this.alliedAircraft || []), ...(this.hostileAircraft || [])];
    aircraft.forEach((unit, index) => {
      if (!unit) return;
      const base = String(unit.callsign || `Pilot ${index + 1}`).trim() || `Pilot ${index + 1}`;
      let callsign = base;
      let suffix = 2;
      while (used.has(callsign.toLowerCase())) callsign = `${base} ${suffix++}`;
      unit.callsign = callsign;
      used.add(callsign.toLowerCase());
    });
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