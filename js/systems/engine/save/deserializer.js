/**
 * js/systems/engine/save/deserializer.js - Full Mid-Sortie State Restoration Engine.
 */

class SaveGameDeserializer {
  static restoreAircraft(sAc) {
    const ac = new Aircraft(
      sAc.specId, sAc.team, sAc.x, sAc.y, sAc.heading, sAc.gunId,
      sAc.callsign, sAc.squadronName, sAc.isFlightLead, sAc.isAce, sAc.altFt
    );
    ac.id = sAc.id;
    (sAc.equippedUpgrades || []).forEach(uId => ac.installUpgrade(uId));
    (sAc.equippedWeapons || []).forEach((wEntry, idx) => {
      ac.installWeapon(wEntry.id, wEntry.station);
      if (ac.equippedWeapons[idx]) {
        ac.equippedWeapons[idx].ammo = wEntry.ammo;
        ac.equippedWeapons[idx].maxAmmo = wEntry.maxAmmo;
        ac.equippedWeapons[idx].cooldown = wEntry.cooldown;
      }
    });

    const scalarFields = [
      'hp', 'maxHp', 'targetAltFt', 'vsiFpm', 'alt', 'prevAltFt', 'altTrend',
      'engineAlpha', 'speed', 'prevSpeed', 'speedTrend', 'energy', 'stress', 'glocTimer',
      'activeManeuverTimer', 'activeManeuverBonus', 'activeManeuverId', 'isNotching',
      'chaff', 'countermeasures', 'chaffFlares', 'cmTimer', 'gunAmmo', 'gunCooldown',
      'thermalBloomTimer', 'thermalBloom', 'isRTB', 'rtbTimer', 'tacticalRole',
      'hasMaldDecoy', 'maldDecoyCharges', 'distanceTraveled', 'flightHistory', 'historySampleTimer',
      'trackDurationBlue', 'trackDurationRed', 'identifiedByBlue', 'identifiedByRed',
      'kills', 'scorePoints', 'missilesLaunchedCount', 'missilesEvadedCount', 'firstDetectedTime',
      'groundPhase', 'airbaseId', 'takeoffSegmentsReq', 'rollHeading'
    ];
    scalarFields.forEach(k => { if (sAc[k] !== undefined) ac[k] = sAc[k]; });
    ac.recalculateWeight();
    ac.speed = sAc.speed;
    ac.prevSpeed = sAc.prevSpeed;
    ac.speedTrend = sAc.speedTrend;
    return ac;
  }

  static restoreSurface(sSu) {
    const su = new SurfaceUnit(sSu.type, sSu.team, sSu.x, sSu.y, {
      heading: sSu.heading, customName: sSu.name, hp: sSu.maxHp,
      airbaseId: sSu.airbaseId, segmentIndex: sSu.segmentIndex, totalSegments: sSu.totalSegments,
      parkedAircraft: sSu.parkedAircraft || [], isPrimaryObjective: sSu.isPrimaryObjective,
      preRevealed: sSu.isRevealedToBlue
    });
    su.id = sSu.id;
    su.hp = sSu.hp;
    su.fireCooldown = sSu.fireCooldown;
    su.aaaCooldown = sSu.aaaCooldown;
    su.pdCooldown = sSu.pdCooldown;
    su.ammo = sSu.ammo;
    su.readyAmmo = sSu.readyAmmo;
    su.rackReloadTimer = sSu.rackReloadTimer;
    su.targetAcquireTimers = new Map(sSu.targetAcquireTimers || []);
    su.jamEfficiency = sSu.jamEfficiency;
    su.isAirbaseObjectiveAnchor = Boolean(sSu.isAirbaseObjectiveAnchor);
    su.isAirbaseNeutralized = Boolean(sSu.isAirbaseNeutralized);
    su.emconTimer = sSu.emconTimer;
    su.hasEmitted = Boolean(sSu.hasEmitted);
    su.isRevealedToBlue = Boolean(sSu.isRevealedToBlue);
    su.identifiedByBlue = Boolean(sSu.identifiedByBlue);
    su.identifiedByRed = Boolean(sSu.identifiedByRed);
    su.trackDurationBlue = sSu.trackDurationBlue;
    return su;
  }

  static restoreMissile(sM, entityMap) {
    const weapon = (sM.weaponId && window.WEAPONS_CATALOG && window.WEAPONS_CATALOG[sM.weaponId])
      ? window.WEAPONS_CATALOG[sM.weaponId]
      : sM.weaponSpec;
    if (!weapon) throw new Error(`Cannot restore missile "${sM.id}": missing weapon definition "${sM.weaponId}".`);

    const m = Object.create(MissileEntity.prototype);
    Object.assign(m, {
      id: sM.id, weapon, source: entityMap.get(sM.sourceId) || null, target: entityMap.get(sM.targetId) || null,
      team: sM.team, x: sM.x, y: sM.y, alt: sM.alt, heading: sM.heading, speed: sM.speed,
      launchSpeed: sM.launchSpeed, peakSpeed: sM.peakSpeed, distanceTraveled: sM.distanceTraveled,
      distanceToTarget: sM.distanceToTarget, prevDistanceToTarget: sM.prevDistanceToTarget,
      minDistanceReached: sM.minDistanceReached, hasStartedClosing: sM.hasStartedClosing,
      cumulativeTurn: sM.cumulativeTurn, maxRangeKm: sM.maxRangeKm, launchDistKm: sM.launchDistKm,
      launchTgpBonus: sM.launchTgpBonus, launchCcipBonus: sM.launchCcipBonus, launchArmPkBonus: sM.launchArmPkBonus,
      launchMitlBonus: sM.launchMitlBonus, launchCloudMitigation: sM.launchCloudMitigation,
      launchEccmBonus: sM.launchEccmBonus, launchAltFt: sM.launchAltFt, launchCloudHits: sM.launchCloudHits,
      rcs: sM.rcs, isStealthMissile: sM.isStealthMissile, active: sM.active, isDead: sM.isDead,
      age: sM.age, stage: sM.stage, boostDuration: sM.boostDuration, accelMultiplier: sM.accelMultiplier,
      hasSustainedThrust: sM.hasSustainedThrust, hasIgnitedPulseTwo: sM.hasIgnitedPulseTwo,
      pulseTwoTimer: sM.pulseTwoTimer, isLofting: sM.isLofting, initialAlt: sM.initialAlt,
      isPassiveRadar: sM.isPassiveRadar, launchStealthDuration: sM.launchStealthDuration,
      pathRevealDistance: sM.pathRevealDistance, trackDurationBlue: sM.trackDurationBlue,
      trackDurationRed: sM.trackDurationRed, trackHoldBlue: sM.trackHoldBlue,
      identifiedByBlue: sM.identifiedByBlue, identifiedByRed: sM.identifiedByRed,
      state: sM.state, trail: sM.trail || [], lostTimer: sM.lostTimer, lostReason: sM.lostReason,
      _pdTestedBy: new Set(sM.pdTestedBy || [])
    });
    return m;
  }

  static restoreIntoGame(game, save) {
    if (!game || !save || save.version !== 1) throw new Error('Invalid or unsupported save file format.');
    if (save.isCompleted) throw new Error('Cannot load a completed game.');
    if (game.animFrameId) { cancelAnimationFrame(game.animFrameId); game.animFrameId = null; }

    game.activeSaveId = save.id;
    game.gameMode = save.gameMode;
    game.playerMode = save.playerMode;
    game.scenarioMode = save.scenarioMode;
    game.aiDifficulty = save.aiDifficulty;
    game.aiDoctrine = save.aiDoctrine;
    game.attackDifficulty = save.attackDifficulty;
    game.attackDoctrine = save.attackDoctrine;
    game.playerBudgetId = save.playerBudgetId;
    game.budgetMax = save.budgetMax;
    game.budgetRemaining = save.budgetRemaining;
    game.maxSquadronSize = save.maxSquadronSize;
    window.CONFIG.MAX_SQUADRON_SIZE = game.maxSquadronSize;

    const isAttackMode = (game.scenarioMode === 'ATTACK');
    window.CONFIG.THEATER_WIDTH_KM = isAttackMode ? window.CONFIG.ATTACK_WIDTH_KM : window.CONFIG.SKIRMISH_WIDTH_KM;
    window.CONFIG.THEATER_HEIGHT_KM = isAttackMode ? window.CONFIG.ATTACK_HEIGHT_KM : window.CONFIG.SKIRMISH_HEIGHT_KM;

    game.setSquadronName(save.squadronName);
    game.currentPvpCommander = save.currentPvpCommander || 'friendly';
    game.tokenBucketBlue = save.tokenBucketBlue;
    game.tokenBucketRed = save.tokenBucketRed;
    game.vpAlly = save.vpAlly;
    game.vpHostile = save.vpHostile;
    game.isGameOver = false;
    game.stats = { ...save.stats };
    game.detectedByBlue = new Set(save.detectedByBlue || []);
    game.detectedByRed = new Set(save.detectedByRed || []);
    game.isMissionEditorMatch = Boolean(save.isMissionEditorMatch);
    game.inspectionModeEnabled = Boolean(save.inspectionModeEnabled);
    game.activeMissionEditorConfig = save.activeMissionEditorConfig || null;
    game.missionEditorBaseSettings = save.missionEditorBaseSettings || null;
    game.pendingMissionEditorSettings = save.pendingMissionEditorSettings || null;
    if (Array.isArray(save.procurementSquadron) && save.procurementSquadron.length > 0) {
      game.procurementSquadron = save.procurementSquadron;
    }
    game.airbaseTimers = save.airbaseTimers ? { ...save.airbaseTimers } : null;
    game.attackState = save.attackState ? {
      emconEvaluatedMissiles: new Set(save.attackState.emconEvaluatedMissiles || []),
      neutralizedBases: new Set(save.attackState.neutralizedBases || [])
    } : null;

    const entityMap = new Map();
    game.alliedAircraft = (save.alliedAircraft || []).map(sAc => { const ac = this.restoreAircraft(sAc); entityMap.set(ac.id, ac); return ac; });
    game.hostileAircraft = (save.hostileAircraft || []).map(sAc => { const ac = this.restoreAircraft(sAc); entityMap.set(ac.id, ac); return ac; });
    game.surfaceUnits = (save.surfaceUnits || []).map(sSu => { const su = this.restoreSurface(sSu); entityMap.set(su.id, su); return su; });

    const sim = game.simulation;
    const sSim = save.simulation;
    sim.weatherClouds = (save.weatherClouds || []).map(c => {
      const cl = new WeatherCloud(c.x, c.y, c.rx, c.ry, c.vx, c.vy);
      cl.id = c.id;
      return cl;
    });
    sim.civilianTraffic = (save.civilianTraffic || []).map(sc => {
      const civ = new CivilianAirliner({ code: sc.flightCode, name: sc.name, model: sc.model, speedMach: sc.speed, altFt: sc.altFt, rcs: sc.effectiveRcs, desc: sc.desc }, sc.x, sc.y, sc.heading);
      Object.assign(civ, { id: sc.id, hp: sc.hp, maxHp: sc.maxHp, identifiedByBlue: sc.identifiedByBlue, identifiedByRed: sc.identifiedByRed, trackDuration: sc.trackDuration, trackDurationBlue: sc.trackDurationBlue, trackDurationRed: sc.trackDurationRed, lastPenaltyTime: sc.lastPenaltyTime });
      entityMap.set(civ.id, civ);
      return civ;
    });
    sim.ghostContacts = (save.ghostContacts || []).map(sg => {
      const gh = new GhostContact(sg.x, sg.y, sg.heading, sg.speed, sg.altFt);
      Object.assign(gh, sg);
      entityMap.set(gh.id, gh);
      return gh;
    });
    sim.decoyDrones = (save.decoyDrones || []).map(sd => {
      const parent = entityMap.get(sd.parentUnitId) || { id: sd.parentUnitId, team: sd.team, x: sd.x, y: sd.y, heading: sd.heading, speed: sd.speed, altFt: sd.altFt, effectiveRcs: sd.effectiveRcs, spec: { id: sd.mirroredModel }, callsign: sd.mirroredCallsign };
      const dd = new DecoyDrone(parent, sd.heading);
      Object.assign(dd, { id: sd.id, x: sd.x, y: sd.y, speed: sd.speed, hp: sd.hp, lifespan: sd.lifespan, age: sd.age, trackDurationBlue: sd.trackDurationBlue, trackDurationRed: sd.trackDurationRed, identifiedByBlue: sd.identifiedByBlue, identifiedByRed: sd.identifiedByRed });
      entityMap.set(dd.id, dd);
      return dd;
    });

    (save.alliedAircraft || []).concat(save.hostileAircraft || []).forEach(sAc => {
      const ac = entityMap.get(sAc.id);
      if (!ac) return;
      ac.radarLockedTarget = sAc.radarLockedTargetId ? (entityMap.get(sAc.radarLockedTargetId) || null) : null;
      ac.taxiTargetSeg = sAc.taxiTargetSegId ? (entityMap.get(sAc.taxiTargetSegId) || null) : null;
      ac.rollEndSeg = sAc.rollEndSegId ? (entityMap.get(sAc.rollEndSegId) || null) : null;
      ac.rollSegs = Array.isArray(sAc.rollSegIds) ? sAc.rollSegIds.map(id => entityMap.get(id)).filter(Boolean) : null;
    });

    game.missiles = (save.missiles || []).map(sM => this.restoreMissile(sM, entityMap));

    sim.elapsedTimeSec = sSim.elapsedTimeSec;
    sim.cloudCoverage = sSim.cloudCoverage;
    sim.civilianTrafficEnabled = Boolean(sSim.civilianTrafficEnabled);
    sim.civilianSpawnTimer = sSim.civilianSpawnTimer;
    sim.waveSpawnTimer = sSim.waveSpawnTimer;
    sim.ghostSpawnTimer = sSim.ghostSpawnTimer;
    sim.currentWave = sSim.currentWave;
    sim._satelliteUplinkAnnouncedBlue = Boolean(sSim.satelliteUplinkAnnouncedBlue);
    sim.victoryDelayTimer = sSim.victoryDelayTimer || 0;
    sim.pendingGameOver = sSim.pendingGameOver || null;
    sim.scoring.scoreLog = sSim.scoreLog || [];
    sim.scoring.timelineEvents = sSim.timelineEvents || [];
    sim.fleetStrengthHistory = sSim.fleetStrengthHistory || [];
    sim.fleetStrengthTimer = sSim.fleetStrengthTimer || 0;
    sim.replayCaptureAccumulator = sSim.replayCaptureAccumulator || 0;
    sim.replaySnapshots = (sSim.encodedReplay && typeof AfterActionReplayCodec !== 'undefined')
      ? AfterActionReplayCodec.decode(sSim.encodedReplay) : [];

    if (save.ai && game.ai) {
      game.ai.focusedUnitIds = [...(save.ai.focusedUnitIds || [])];
      game.ai.focusTimers = new Map(save.ai.focusTimers || []);
      game.ai.actionCooldown = save.ai.actionCooldown;
      game.ai.aceSalvoTimer = save.ai.aceSalvoTimer;
      game.ai.planning.successionTimers = new Map((save.ai.planning && save.ai.planning.successionTimers) || []);
      game.ai.planning.elementPairs = new Map((save.ai.planning && save.ai.planning.elementPairs) || []);
      game.ai.planning.posture = (save.ai.planning && save.ai.planning.posture) || 'OFFENSIVE_SWEEP';
      game.ai.planning.postureTimer = (save.ai.planning && save.ai.planning.postureTimer) || 0;
    }

    game.activeUnit = (save.activeUnitId && entityMap.get(save.activeUnitId)) || game.alliedAircraft.find(a => a.hp > 0.05) || game.alliedAircraft[0] || null;
    game.selectedTarget = save.selectedTargetId ? (entityMap.get(save.selectedTargetId) || null) : null;

    this.applyLoadedUI(game, save, entityMap);
  }

  static applyLoadedUI(game, save, entityMap) {
    const procModal = document.getElementById('procurement-modal');
    const hudContainer = document.getElementById('hud-container');
    if (procModal) { procModal.classList.remove('active'); procModal.classList.add('hidden'); }
    if (hudContainer) hudContainer.classList.remove('hidden');

    ['save-load-modal', 'system-inspect-modal', 'glossary-modal', 'settings-modal', 'rwr-briefing-modal', 'abort-confirm-modal', 'game-over-modal', 'pause-modal', 'dialog-modal'].forEach(id => {
      const m = document.getElementById(id);
      if (m) m.classList.remove('active');
    });

    const is2P = (game.playerMode === '2P') && (game.scenarioMode !== 'ATTACK');
    const pvpSwitcher = document.getElementById('pvp-switcher-bar');
    if (pvpSwitcher) pvpSwitcher.classList.toggle('hidden', !is2P);
    const btnBlue = document.getElementById('btn-switch-blue'), btnRed = document.getElementById('btn-switch-red');
    if (btnBlue && btnRed) {
      btnBlue.classList.toggle('active', game.currentPvpCommander === 'friendly');
      btnRed.classList.toggle('active', game.currentPvpCommander === 'hostile');
    }

    if (game.radar) {
      game.radar.fx.particles = [];
      game.radar.fx.floatingTexts = [];
      game.radar.fx.shockwaves = [];
      game.radar.fx.tracers = [];
      if (save.camera && game.radar.cam) {
        game.radar.cam.zoom = save.camera.zoom;
        game.radar.cam.panX = save.camera.panX;
        game.radar.cam.panY = save.camera.panY;
        game.radar.cam.declutterMode = Boolean(save.camera.declutterMode);
        game.radar.cam.showGroundTargets = Boolean(save.camera.showGroundTargets);
        game.radar.cam.trackingUnit = save.camera.trackingUnitId ? (entityMap.get(save.camera.trackingUnitId) || null) : null;
      }
      game.radar.resize();
      game.radar.syncControlButtons();
    }

    game.simulation.scoring.renderScoreLog();
    game.simulation.setTimeWarp(save.simulation.timeWarp || 1);
    const clockEl = document.getElementById('mission-clock');
    if (clockEl) clockEl.textContent = game.simulation.getElapsedTimeString();

    if (game.avionics) {
      game.avionics._cachedTexts = {};
      game.avionics.rosterDisplay.cachedRosterIds = '';
      if (game.deckManager) {
        game.deckManager.maneuverDeck.currentUnitId = null;
        game.deckManager.pylonBay.lastFingerprint = null;
      }
      game.avionics.renderFlightRoster();
      game.avionics.updateActiveUnitMFD();
      game.avionics.updateRWRState();
    }

    if (game.inspection) {
      game.inspection.beginMission(game.inspectionModeEnabled);
      if (save.inspection && game.inspectionModeEnabled) {
        game.inspection.events = save.inspection.events || [];
        game.inspection.setEnemyDetails(save.inspection.showEnemyDetails);
        game.inspection.activeTab = save.inspection.activeTab || 'OVERVIEW';
        game.inspection.selectedEntity = save.inspection.selectedEntityId ? (entityMap.get(save.inspection.selectedEntityId) || game.activeUnit) : game.activeUnit;
        if (save.inspection.isOpen) game.inspection.open();
        else game.inspection.close();
        game.inspection.render(true);
      }
    }
    game.startLoop();
  }
}

window.SaveGameDeserializer = SaveGameDeserializer;
