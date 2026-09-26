/**
 * AIRSPACE STANDOFF: Sortie Spawner Submodule
 * Prepares squadrons, surface defenses, and arena dimensions for combat sorties.
 */

class SortieSpawner {
  static setupMission(game) {
    if (game.pendingMissionEditorSettings) {
      game.missionEditorBaseSettings = {
        scenarioMode: game.scenarioMode,
        aiDifficulty: game.aiDifficulty,
        aiDoctrine: game.aiDoctrine
      };
    }
    const editorMission = window.MissionEditor && typeof window.MissionEditor.consumeNextMission === 'function'
      ? window.MissionEditor.consumeNextMission(game)
      : null;
    game.activeMissionEditorConfig = editorMission;
    game.isMissionEditorMatch = Boolean(editorMission && editorMission.unranked);
    game.inspectionModeEnabled = Boolean(editorMission && editorMission.inspectionMode);

    if (editorMission) {
      game.scenarioMode = editorMission.scenarioMode;
      game.aiDifficulty = editorMission.difficulty;
      game.aiDoctrine = editorMission.doctrine;
      const skirmishButton = document.getElementById('scenario-btn-skirmish');
      const dynamicButton = document.getElementById('scenario-btn-dynamic');
      if (skirmishButton) skirmishButton.classList.toggle('active', game.scenarioMode === 'SKIRMISH');
      if (dynamicButton) dynamicButton.classList.toggle('active', game.scenarioMode === 'DYNAMIC_THEATER');
      game.updateModeIndicator();
    }
    if (game.procurement) game.procurement.updateUI();
    ['system-inspect-modal', 'glossary-modal', 'settings-modal', 'rwr-briefing-modal', 'abort-confirm-modal', 'game-over-modal', 'procurement-modal', 'pause-modal'].forEach(id => {
      const m = document.getElementById(id); if (m) m.classList.remove('active');
    });

    const maxTok = (window.CONFIG && window.CONFIG.TOKEN_MAX) || 8.0;
    game.tokenBucketBlue = maxTok;
    game.tokenBucketRed = maxTok;
    game.missiles = [];
    game.vpAlly = 0;
    game.vpHostile = 0;
    game.isGameOver = false;
    game.selectedTarget = null;
    game.matchStartTime = performance.now();
    game.stats = { blueLosses: 0, redLosses: 0, missilesLaunched: 0, salvoCoordinatedHits: 0, defensiveIntercepts: 0 };
    game.detectedByBlue = new Set();
    game.detectedByRed = new Set();

    if (game.simulation) {
      game.simulation.scoreLog = [];
      game.simulation.timelineEvents = [];
      game.simulation.ghostContacts = [];
      game.simulation.decoyDrones = [];
      game.simulation.ghostSpawnTimer = 0.0;
      game.simulation._satelliteUplinkAnnouncedBlue = false;
      game.simulation.setTimeWarp(1);
      game.simulation.resetReplay();
      game.simulation.cloudCoverage = editorMission ? editorMission.clouds : 'RANDOM';
      game.simulation.civilianTrafficEnabled = editorMission ? editorMission.civilians === 'ON' : true;
      game.simulation.initWeatherClouds();
    }
    const scoreLogEl = document.getElementById('combat-score-log-list');
    if (scoreLogEl) scoreLogEl.innerHTML = '';
    const aarTimelineEl = document.getElementById('aar-timeline-list');
    if (aarTimelineEl) aarTimelineEl.innerHTML = '';

    let launchSquadron = game.procurementSquadron || [];
    if (editorMission && editorMission.blueSquadron === 'RANDOM' && window.MissionEditor) {
      launchSquadron = window.MissionEditor.createRandomSquadron(game, editorMission);
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
      if (!editorMission) game.procurementSquadron = fallbackSquadron;
      launchSquadron = fallbackSquadron;
    }

    const mapW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const callsignPool = [...(window.CALLSIGN_POOL || ['Trigger', 'Mobius 1', 'Cipher', 'Viper', 'Ghost', 'Talon'])].sort(() => Math.random() - 0.5);
    const takeCallsign = () => callsignPool.length ? callsignPool.pop() : 'Viper';

    game.alliedAircraft = [];
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
        item.callsign || takeCallsign(), game.squadronName || '7th Tactical Squadron',
        plan.isLead, false, initialAltFt
      );
      (item.upgrades || []).forEach(u => ac.installUpgrade((typeof u === 'object' && u !== null) ? (u.id || u.specId) : u));
      (item.weapons || []).forEach(w => {
        const wId = (typeof w === 'object' && w !== null) ? (w.id || w.specId) : w;
        const targetStation = (typeof w === 'object' && w !== null) ? w.station : null;
        ac.installWeapon(wId, targetStation);
      });
      ac.recalculateWeight();
      if (editorMission && editorMission.blueWeapons === 'RANDOM' && window.MissionEditor) {
        window.MissionEditor.applyRandomWeapons(ac);
      }
      ac.speed = ac.getTargetMach();
      ac.prevSpeed = ac.speed;
      ac.speedTrend = '--';
      game.alliedAircraft.push(ac);
    });

    game.hostileAircraft = (typeof FleetGenerator !== 'undefined')
      ? FleetGenerator.generateHostileFleet(game.aiDifficulty, game.aiDoctrine, mapW, mapH,
        editorMission ? { aircraftCount: editorMission.redSize } : {}) : [];

    game.hostileAircraft.forEach(h => {
      h.recalculateWeight();
      if (editorMission && editorMission.redWeapons === 'RANDOM' && window.MissionEditor) {
        window.MissionEditor.applyRandomWeapons(h);
      }
      h.speed = h.getTargetMach();
      h.prevSpeed = h.speed;
      h.speedTrend = '--';
    });
    SortieSpawner.ensureUniqueAircraftCallsigns(game);

    if (game.playerMode === '2P') {
      [...game.alliedAircraft, ...game.hostileAircraft].forEach(unit => {
        unit.identifiedByBlue = true; unit.identifiedByRed = true; unit.isIdentified = true;
        game.detectedByBlue.add(unit.id); game.detectedByRed.add(unit.id);
      });
    }

    SortieSpawner.initSurfaceFacilities(game, mapW, mapH);
    if (editorMission && editorMission.defenses === 'LIGHT') {
      game.surfaceUnits = game.surfaceUnits.filter(unit => unit.type !== 'S-400');
    } else if (editorMission && editorMission.defenses === 'OFF') {
      game.surfaceUnits = game.surfaceUnits.filter(unit => unit.type !== 'S-400' && unit.type !== 'PANTSIR');
    }
    if (game.simulation) {
      game.simulation.civilianTraffic = [];
      game.simulation.civilianSpawnTimer = 0.0;
      game.simulation.waveSpawnTimer = 0.0;
      game.simulation.currentWave = 1;
      game.simulation.spawnCivilianFlight();
    }

    game.activeUnit = game.alliedAircraft.find(a => a.isFlightLead) || game.alliedAircraft[0] || null;
    game.currentPvpCommander = 'friendly';
    if (game.radar) { game.radar.resize(); game.radar.resetCamera(); }
    if (game.avionics) { game.avionics.renderFlightRoster(); game.avionics.updateActiveUnitMFD(); }
    if (game.inspection) game.inspection.beginMission(game.inspectionModeEnabled);
  }

  static ensureUniqueAircraftCallsigns(game) {
    const used = new Set();
    const aircraft = [...(game.alliedAircraft || []), ...(game.hostileAircraft || [])];
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

  static initSurfaceFacilities(game, mapW, mapH) {
    game.surfaceUnits = [
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
}

window.SortieSpawner = SortieSpawner;