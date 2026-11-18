/**
 * AIRSPACE STANDOFF: Sortie Spawner Submodule
 * Prepares squadrons, surface defenses, Attack IADS theaters, and transitions cleanly between Hangar and Battle modes.
 */

class SortieSpawner {
  static setupMission(game) {
    if (!game) throw new Error('SortieSpawner.setupMission requires game instance.');
    if (!window.CONFIG || !window.AIRCRAFT_CATALOG || !window.AI_DIFFICULTIES || !window.ATTACK_DIFFICULTIES) {
      throw new Error('Core data tables must be loaded before SortieSpawner.setupMission.');
    }
    if (!Array.isArray(window.CALLSIGN_POOL)) throw new Error('CALLSIGN_POOL is not loaded.');

    const prng = window.PRNG;

    if (game.pendingMissionEditorSettings) {
      game.missionEditorBaseSettings = {
        scenarioMode: game.scenarioMode,
        aiDifficulty: game.aiDifficulty,
        aiDoctrine: game.aiDoctrine
      };
    }
    const editorMission = window.MissionEditor ? window.MissionEditor.consumeNextMission(game) : null;
    game.activeMissionEditorConfig = editorMission;
    game.isMissionEditorMatch = Boolean(editorMission && editorMission.unranked);
    game.inspectionModeEnabled = Boolean(editorMission && editorMission.inspectionMode);

    if (editorMission) {
      game.scenarioMode = editorMission.scenarioMode;
      game.aiDifficulty = editorMission.difficulty;
      game.aiDoctrine = editorMission.doctrine;
      game.updateModeIndicator();
    }

    const isAttackMode = (game.scenarioMode === 'ATTACK');
    window.CONFIG.THEATER_WIDTH_KM = isAttackMode ? window.CONFIG.ATTACK_WIDTH_KM : window.CONFIG.SKIRMISH_WIDTH_KM;
    window.CONFIG.THEATER_HEIGHT_KM = isAttackMode ? window.CONFIG.ATTACK_HEIGHT_KM : window.CONFIG.SKIRMISH_HEIGHT_KM;

    if (game.procurement) game.procurement.updateUI();

    const procModal = document.getElementById('procurement-modal');
    const hudContainer = document.getElementById('hud-container');
    if (procModal) {
      procModal.classList.remove('active');
      procModal.classList.add('hidden');
    }
    if (hudContainer) hudContainer.classList.remove('hidden');

    ['system-inspect-modal', 'glossary-modal', 'settings-modal', 'rwr-briefing-modal', 'abort-confirm-modal', 'game-over-modal', 'pause-modal', 'dialog-modal', 'tactical-dialog-modal'].forEach(id => {
      const m = document.getElementById(id); if (m) m.classList.remove('active');
    });

    const maxTok = window.CONFIG.TOKEN_MAX;
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
      game.simulation.civilianTrafficEnabled = editorMission ? editorMission.civilians === 'ON' : !isAttackMode;
      game.simulation.initWeatherClouds();
    }
    const scoreLogEl = document.getElementById('combat-score-log-list');
    if (scoreLogEl) scoreLogEl.innerHTML = '';
    const aarTimelineEl = document.getElementById('aar-timeline-list');
    if (aarTimelineEl) aarTimelineEl.innerHTML = '';

    const mapW = window.CONFIG.THEATER_WIDTH_KM;
    const mapH = window.CONFIG.THEATER_HEIGHT_KM;
    const midY = mapH / 2.0;
    const callsignPool = prng.shuffle([...window.CALLSIGN_POOL]);
    const takeCallsign = () => callsignPool.length ? callsignPool.pop() : 'Viper';

    game.alliedAircraft = [];
    game.hostileAircraft = [];

    const is2P = (game.playerMode === '2P') && !isAttackMode;
    const isBlueProcedural = !is2P && editorMission && editorMission.blueFleet && editorMission.blueFleet !== 'HANGAR';

    if (isBlueProcedural) {
      game.alliedAircraft = FleetGenerator.generateFleet('friendly', editorMission.blueFleet, editorMission.doctrine, mapW, mapH, {
        budget: editorMission.blueBudget,
        squadronName: game.squadronName
      });
    } else {
      const launchSquadron = game.procurementSquadron;
      if (!Array.isArray(launchSquadron) || launchSquadron.length === 0) {
        throw new Error('Cannot launch sortie with an empty squadron.');
      }
      let chosenLeadIdx = launchSquadron.findIndex(it => it && it.isLead);
      if (chosenLeadIdx === -1) chosenLeadIdx = 0;
      launchSquadron.forEach((it, idx) => { if (it) it.isLead = (idx === chosenLeadIdx); });

      const spawnPlans = FormationPlanner.calculateFormationSpawns(launchSquadron, 'friendly', mapW, mapH, prng);
      spawnPlans.forEach(plan => {
        const item = plan.item;
        if (!item) return;
        const heading = prng.range(-0.08, 0.08);
        const initialAltFt = (item.specId === 'DARKSTAR') ? 58000 : (20000 + prng.int(0, 17) * 1000);
        const spawnY = plan.isLead ? midY : plan.y;

        const ac = new Aircraft(
          item.specId, 'friendly', plan.x, spawnY, heading, item.chosenGunId,
          item.callsign || takeCallsign(), game.squadronName,
          plan.isLead, false, initialAltFt
        );
        (item.upgrades || []).forEach(u => ac.installUpgrade((typeof u === 'object' && u !== null) ? (u.id || u.specId) : u));
        (item.weapons || []).forEach(w => {
          const wId = (typeof w === 'object' && w !== null) ? (w.id || w.specId) : w;
          const targetStation = (typeof w === 'object' && w !== null) ? w.station : null;
          ac.installWeapon(wId, targetStation);
        });
        ac.recalculateWeight();
        ac.speed = ac.getTargetMach();
        ac.prevSpeed = ac.speed;
        ac.speedTrend = '--';
        game.alliedAircraft.push(ac);
      });
    }

    if (isAttackMode) {
      if (typeof AttackTheaterGenerator === 'undefined' || typeof AttackDirector === 'undefined') {
        throw new Error('AttackTheaterGenerator and AttackDirector must be loaded for ATTACK mode.');
      }
      AttackTheaterGenerator.generate(game, game.attackDifficulty, game.attackDoctrine);
      AttackDirector.initMission(game);
      if (editorMission && editorMission.defenses === 'OFF') {
        game.surfaceUnits = game.surfaceUnits.filter(unit => unit.isPrimaryObjective || unit.type === 'AMMO_DUMP');
      }
    } else if (is2P) {
      const redRosterSource = game.procurementSquadron;
      let chosenLeadIdx = redRosterSource.findIndex(it => it && it.isLead);
      if (chosenLeadIdx === -1) chosenLeadIdx = 0;
      redRosterSource.forEach((it, idx) => { if (it) it.isLead = (idx === chosenLeadIdx); });

      const clonedRedRoster = redRosterSource.map((item, originalIdx) => ({
        specId: item.specId,
        chosenGunId: item.chosenGunId,
        weapons: Array.isArray(item.weapons) ? item.weapons.map(w => (typeof w === 'object' && w !== null ? { ...w } : w)) : [],
        upgrades: Array.isArray(item.upgrades) ? [...item.upgrades] : [],
        callsign: item.callsign ? (item.callsign.startsWith('Red ') ? item.callsign : `Red ${item.callsign}`) : `Red Viper ${originalIdx + 1}`,
        isLead: Boolean(item.isLead),
        isAce: false
      }));

      const randomizedRedRoster = prng.shuffle([...clonedRedRoster]);
      const redSpawnPlans = FormationPlanner.calculateFormationSpawns(randomizedRedRoster, 'hostile', mapW, mapH, prng);
      redSpawnPlans.forEach(plan => {
        const item = plan.item;
        if (!item) return;
        const heading = Math.PI + prng.range(-0.08, 0.08);
        const initialAltFt = (item.specId === 'DARKSTAR') ? 58000 : (20000 + prng.int(0, 17) * 1000);
        const spawnY = plan.isLead ? midY : plan.y;

        const ac = new Aircraft(item.specId, 'hostile', plan.x, spawnY, heading, item.chosenGunId, item.callsign, 'Red Squadron', item.isLead, false, initialAltFt);
        (item.upgrades || []).forEach(u => ac.installUpgrade((typeof u === 'object' && u !== null) ? (u.id || u.specId) : u));
        (item.weapons || []).forEach(w => {
          const wId = (typeof w === 'object' && w !== null) ? (w.id || w.specId) : w;
          const targetStation = (typeof w === 'object' && w !== null) ? w.station : null;
          ac.installWeapon(wId, targetStation);
        });
        ac.recalculateWeight();
        ac.speed = ac.getTargetMach();
        ac.prevSpeed = ac.speed;
        ac.speedTrend = '--';
        game.hostileAircraft.push(ac);
      });
      SortieSpawner.initSurfaceFacilities(game, mapW, mapH);
    } else if (editorMission && editorMission.redFleet === 'HANGAR') {
      const mirrorSquadron = game.procurementSquadron;
      if (mirrorSquadron.length === 0) {
        const redDiff = editorMission.difficulty;
        const redBudget = Number(editorMission.redBudget);
        game.hostileAircraft = FleetGenerator.generateHostileFleet(redDiff, game.aiDoctrine, mapW, mapH, { budget: redBudget });
      } else {
        const spawnPlans = FormationPlanner.calculateFormationSpawns(mirrorSquadron, 'hostile', mapW, mapH, prng);
        spawnPlans.forEach(plan => {
          const item = plan.item;
          if (!item) return;
          const heading = Math.PI + prng.range(-0.08, 0.08);
          const initialAltFt = (item.specId === 'DARKSTAR') ? 58000 : (20000 + prng.int(0, 17) * 1000);
          const spawnY = plan.isLead ? midY : plan.y;

          const ac = new Aircraft(item.specId, 'hostile', plan.x, spawnY, heading, item.chosenGunId, `Red ${item.callsign || 'Bandit'}`, 'Red Aggressor Wing', plan.isLead, false, initialAltFt);
          (item.upgrades || []).forEach(u => ac.installUpgrade((typeof u === 'object' && u !== null) ? (u.id || u.specId) : u));
          (item.weapons || []).forEach(w => {
            const wId = (typeof w === 'object' && w !== null) ? (w.id || w.specId) : w;
            const targetStation = (typeof w === 'object' && w !== null) ? w.station : null;
            ac.installWeapon(wId, targetStation);
          });
          ac.recalculateWeight();
          ac.speed = ac.getTargetMach();
          ac.prevSpeed = ac.speed;
          ac.speedTrend = '--';
          game.hostileAircraft.push(ac);
        });
      }
      SortieSpawner.initSurfaceFacilities(game, mapW, mapH);
    } else {
      const redDiff = (editorMission && editorMission.redFleet) ? editorMission.redFleet : game.aiDifficulty;
      const redBudget = (editorMission && editorMission.redBudget) ? Number(editorMission.redBudget) : null;
      game.hostileAircraft = FleetGenerator.generateHostileFleet(redDiff, game.aiDoctrine, mapW, mapH, { budget: redBudget });
      SortieSpawner.initSurfaceFacilities(game, mapW, mapH);
    }

    if (!isAttackMode && editorMission && editorMission.defenses === 'OFF') {
      game.surfaceUnits = game.surfaceUnits.filter(unit => unit.type === 'BUNKER' || unit.type === 'AMMO_DUMP');
    }

    game.hostileAircraft.forEach(h => {
      h.recalculateWeight();
      h.speed = h.getTargetMach();
      h.prevSpeed = h.speed;
      h.speedTrend = '--';
    });
    SortieSpawner.ensureUniqueAircraftCallsigns(game);

    if (is2P) {
      [...game.alliedAircraft, ...game.hostileAircraft].forEach(unit => {
        unit.identifiedByBlue = true; unit.identifiedByRed = true; unit.isIdentified = true;
        game.detectedByBlue.add(unit.id); game.detectedByRed.add(unit.id);
      });
    }

    if (game.simulation) {
      game.simulation.civilianTraffic = [];
      game.simulation.civilianSpawnTimer = 0.0;
      game.simulation.waveSpawnTimer = 0.0;
      game.simulation.currentWave = 1;
      game.simulation.spawnCivilianFlight();
    }

    game.activeUnit = game.alliedAircraft.find(a => a.hp > 0.05 && a.isFlightLead) || game.alliedAircraft.find(a => a.hp > 0.05) || game.alliedAircraft[0];
    game.currentPvpCommander = 'friendly';

    const pvpSwitcher = document.getElementById('pvp-switcher-bar');
    if (pvpSwitcher) pvpSwitcher.classList.toggle('hidden', !is2P);

    const btnBlue = document.getElementById('btn-switch-blue');
    const btnRed = document.getElementById('btn-switch-red');
    if (btnBlue && btnRed) {
      btnBlue.classList.add('active');
      btnRed.classList.remove('active');
    }

    if (game.radar) {
      game.radar.cam.showGroundTargets = isAttackMode;
      game.radar.resize();
      game.radar.resetCamera();
      game.radar.syncControlButtons();
    }
    game.avionics.renderFlightRoster();
    game.avionics.updateActiveUnitMFD();
    if (game.inspection) game.inspection.beginMission(game.inspectionModeEnabled);
  }

  static ensureUniqueAircraftCallsigns(game) {
    const used = new Set();
    const aircraft = [...game.alliedAircraft, ...game.hostileAircraft];
    aircraft.forEach((unit, index) => {
      if (!unit) return;
      const base = String(unit.callsign || `Pilot ${index + 1}`).trim();
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
      new SurfaceUnit('FUEL_DEPOT', 'friendly', 12, 16),
      new SurfaceUnit('AMMO_DUMP', 'friendly', 32, mapH / 2 - 10),
      new SurfaceUnit('BUNKER', 'hostile', mapW - 8, mapH / 2),
      new SurfaceUnit('RADAR_ARRAY', 'hostile', mapW - 10, mapH / 2 - 10),
      new SurfaceUnit('EW_JAMMER', 'hostile', mapW - 16, mapH / 2 - 20),
      new SurfaceUnit('FUEL_DEPOT', 'hostile', mapW - 12, 16),
      new SurfaceUnit('AMMO_DUMP', 'hostile', mapW - 32, mapH / 2 + 10),
      new SurfaceUnit('RADAR_VAN', 'hostile', mapW - 20, 36)
    ];
  }
}

window.SortieSpawner = SortieSpawner;
