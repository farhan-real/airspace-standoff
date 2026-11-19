/**
 * js/systems/engine/save/serializer.js - Full Mid-Sortie State Serializer.
 */

class SaveGameSerializer {
  static clonePlain(obj) {
    if (obj === null || obj === undefined) return obj;
    return JSON.parse(JSON.stringify(obj));
  }

  static serialize(game, slotId) {
    if (!game || !game.simulation) throw new Error('SaveGameSerializer.serialize requires active game and simulation.');
    if (game.isGameOver) throw new Error('Cannot save a sortie after mission completion.');

    const sim = game.simulation;
    sim.captureReplayFrame(true);

    const encodedReplay = (typeof AfterActionReplayCodec !== 'undefined' && Array.isArray(sim.replaySnapshots) && sim.replaySnapshots.length > 0)
      ? AfterActionReplayCodec.encode(sim.replaySnapshots, 75 * 1024)
      : null;

    const ai = game.ai;
    const radarCam = (game.radar && game.radar.cam) ? game.radar.cam : null;
    const insp = game.inspection;

    return {
      version: 1,
      id: slotId,
      isCompleted: false,
      mapW: window.CONFIG.THEATER_WIDTH_KM,
      mapH: window.CONFIG.THEATER_HEIGHT_KM,
      savedAt: new Date().toISOString(),
      savedAtDisplay: new Date().toLocaleString(),
      elapsedClock: sim.getElapsedTimeString(),
      squadronName: game.squadronName,
      gameMode: game.gameMode,
      playerMode: game.playerMode,
      scenarioMode: game.scenarioMode,
      aiDifficulty: game.aiDifficulty,
      aiDoctrine: game.aiDoctrine,
      attackDifficulty: game.attackDifficulty,
      attackDoctrine: game.attackDoctrine,
      playerBudgetId: game.playerBudgetId,
      budgetMax: game.budgetMax,
      budgetRemaining: game.budgetRemaining,
      maxSquadronSize: game.maxSquadronSize,
      currentPvpCommander: game.currentPvpCommander,
      tokenBucketBlue: game.tokenBucketBlue,
      tokenBucketRed: game.tokenBucketRed,
      vpAlly: game.vpAlly,
      vpHostile: game.vpHostile,
      stats: { ...game.stats },
      detectedByBlue: Array.from(game.detectedByBlue || []),
      detectedByRed: Array.from(game.detectedByRed || []),
      activeUnitId: game.activeUnit ? game.activeUnit.id : null,
      selectedTargetId: game.selectedTarget ? game.selectedTarget.id : null,
      isMissionEditorMatch: Boolean(game.isMissionEditorMatch),
      inspectionModeEnabled: Boolean(game.inspectionModeEnabled),
      activeMissionEditorConfig: this.clonePlain(game.activeMissionEditorConfig),
      missionEditorBaseSettings: this.clonePlain(game.missionEditorBaseSettings),
      pendingMissionEditorSettings: this.clonePlain(game.pendingMissionEditorSettings),
      procurementSquadron: this.clonePlain(game.procurementSquadron || []),
      airbaseTimers: game.airbaseTimers ? { ...game.airbaseTimers } : null,
      attackState: game.attackState ? {
        emconEvaluatedMissiles: Array.from(game.attackState.emconEvaluatedMissiles || []),
        neutralizedBases: Array.from(game.attackState.neutralizedBases || [])
      } : null,
      simulation: {
        elapsedTimeSec: sim.elapsedTimeSec,
        timeWarp: sim.timeWarp,
        isPaused: Boolean(sim.isPaused),
        cloudCoverage: sim.cloudCoverage,
        civilianTrafficEnabled: Boolean(sim.civilianTrafficEnabled),
        civilianSpawnTimer: sim.civilianSpawnTimer,
        waveSpawnTimer: sim.waveSpawnTimer,
        ghostSpawnTimer: sim.ghostSpawnTimer,
        currentWave: sim.currentWave,
        satelliteUplinkAnnouncedBlue: Boolean(sim._satelliteUplinkAnnouncedBlue),
        victoryDelayTimer: sim.victoryDelayTimer,
        pendingGameOver: this.clonePlain(sim.pendingGameOver),
        scoreLog: this.clonePlain(sim.scoring.scoreLog || []),
        timelineEvents: this.clonePlain(sim.scoring.timelineEvents || []),
        fleetStrengthHistory: this.clonePlain(sim.fleetStrengthHistory || []),
        fleetStrengthTimer: sim.fleetStrengthTimer,
        replayCaptureAccumulator: sim.replayCaptureAccumulator,
        encodedReplay
      },
      weatherClouds: (sim.weatherClouds || []).map(c => ({ id: c.id, x: c.x, y: c.y, rx: c.rx, ry: c.ry, vx: c.vx, vy: c.vy })),
      civilianTraffic: (sim.civilianTraffic || []).map(c => ({
        id: c.id, name: c.name, flightCode: c.flightCode, model: c.model, x: c.x, y: c.y,
        heading: c.heading, altFt: c.altFt, speed: c.speed, effectiveRcs: c.effectiveRcs, desc: c.desc,
        hp: c.hp, maxHp: c.maxHp, identifiedByBlue: c.identifiedByBlue, identifiedByRed: c.identifiedByRed,
        trackDuration: c.trackDuration, trackDurationBlue: c.trackDurationBlue, trackDurationRed: c.trackDurationRed, lastPenaltyTime: c.lastPenaltyTime
      })),
      ghostContacts: (sim.ghostContacts || []).map(g => ({
        id: g.id, x: g.x, y: g.y, heading: g.heading, speed: g.speed, altFt: g.altFt, hp: g.hp,
        effectiveRcs: g.effectiveRcs, turnTimer: g.turnTimer, turnDirection: g.turnDirection,
        lifespan: g.lifespan, age: g.age, isDissolving: g.isDissolving, dissolveTimer: g.dissolveTimer,
        dissolveAlpha: g.dissolveAlpha, isDissolved: g.isDissolved, dissolveReason: g.dissolveReason,
        trackDurationBlue: g.trackDurationBlue, trackDurationRed: g.trackDurationRed,
        identifiedByBlue: g.identifiedByBlue, identifiedByRed: g.identifiedByRed, ghostType: g.ghostType
      })),
      decoyDrones: (sim.decoyDrones || []).map(d => ({
        id: d.id, parentUnitId: d.parentUnit ? d.parentUnit.id : null, team: d.team, hp: d.hp, maxHp: d.maxHp,
        x: d.x, y: d.y, heading: d.heading, speed: d.speed, altFt: d.altFt, effectiveRcs: d.effectiveRcs,
        mirroredModel: d.mirroredModel, mirroredCallsign: d.mirroredCallsign, lifespan: d.lifespan, age: d.age,
        trackDurationBlue: d.trackDurationBlue, trackDurationRed: d.trackDurationRed,
        identifiedByBlue: d.identifiedByBlue, identifiedByRed: d.identifiedByRed
      })),
      alliedAircraft: (game.alliedAircraft || []).map(a => this.serializeAircraft(a)),
      hostileAircraft: (game.hostileAircraft || []).map(a => this.serializeAircraft(a)),
      surfaceUnits: (game.surfaceUnits || []).map(s => this.serializeSurface(s)),
      missiles: (game.missiles || []).map(m => this.serializeMissile(m)),
      ai: ai ? {
        focusedUnitIds: [...(ai.focusedUnitIds || [])],
        focusTimers: Array.from(ai.focusTimers ? ai.focusTimers.entries() : []),
        actionCooldown: ai.actionCooldown,
        aceSalvoTimer: ai.aceSalvoTimer,
        planning: {
          successionTimers: Array.from(ai.planning.successionTimers ? ai.planning.successionTimers.entries() : []),
          elementPairs: Array.from(ai.planning.elementPairs ? ai.planning.elementPairs.entries() : []),
          posture: ai.planning.posture,
          postureTimer: ai.planning.postureTimer
        }
      } : null,
      camera: radarCam ? {
        zoom: radarCam.zoom, panX: radarCam.panX, panY: radarCam.panY,
        trackingUnitId: radarCam.trackingUnit ? radarCam.trackingUnit.id : null,
        declutterMode: Boolean(radarCam.declutterMode), showGroundTargets: Boolean(radarCam.showGroundTargets)
      } : null,
      inspection: insp ? {
        isOpen: Boolean(insp.isOpen), activeTab: insp.activeTab, showEnemyDetails: Boolean(insp.showEnemyDetails),
        selectedEntityId: insp.selectedEntity ? insp.selectedEntity.id : null,
        events: this.clonePlain((insp.events || []).slice(0, 150))
      } : null
    };
  }

  static serializeAircraft(a) {
    return {
      id: a.id, specId: a.spec.id, team: a.team, x: a.x, y: a.y, heading: a.heading,
      gunId: a.gun.id, callsign: a.callsign, squadronName: a.squadronName,
      isFlightLead: Boolean(a.isFlightLead), isAce: Boolean(a.isAce),
      altFt: a.altFt, targetAltFt: a.targetAltFt, vsiFpm: a.vsiFpm, alt: a.alt, prevAltFt: a.prevAltFt, altTrend: a.altTrend,
      hp: a.hp, maxHp: a.maxHp, engineAlpha: a.engineAlpha, speed: a.speed, prevSpeed: a.prevSpeed, speedTrend: a.speedTrend, energy: a.energy,
      stress: a.stress, glocTimer: a.glocTimer, activeManeuverTimer: a.activeManeuverTimer,
      activeManeuverBonus: a.activeManeuverBonus, activeManeuverId: a.activeManeuverId, isNotching: Boolean(a.isNotching),
      chaff: a.chaff, countermeasures: a.countermeasures, chaffFlares: a.chaffFlares, cmTimer: a.cmTimer,
      gunAmmo: a.gunAmmo, gunCooldown: a.gunCooldown, thermalBloomTimer: a.thermalBloomTimer, thermalBloom: a.thermalBloom,
      isRTB: Boolean(a.isRTB), rtbTimer: a.rtbTimer, tacticalRole: a.tacticalRole,
      hasMaldDecoy: Boolean(a.hasMaldDecoy), maldDecoyCharges: a.maldDecoyCharges,
      distanceTraveled: a.distanceTraveled, flightHistory: this.clonePlain(a.flightHistory || []), historySampleTimer: a.historySampleTimer,
      trackDurationBlue: a.trackDurationBlue, trackDurationRed: a.trackDurationRed,
      identifiedByBlue: Boolean(a.identifiedByBlue), identifiedByRed: Boolean(a.identifiedByRed),
      kills: a.kills, scorePoints: a.scorePoints, missilesLaunchedCount: a.missilesLaunchedCount,
      missilesEvadedCount: a.missilesEvadedCount, firstDetectedTime: a.firstDetectedTime,
      radarLockedTargetId: a.radarLockedTarget ? a.radarLockedTarget.id : null,
      groundPhase: a.groundPhase || null, airbaseId: a.airbaseId || null,
      takeoffSegmentsReq: a.takeoffSegmentsReq || 0, rollHeading: a.rollHeading || 0,
      taxiTargetSegId: a.taxiTargetSeg ? a.taxiTargetSeg.id : null,
      rollEndSegId: a.rollEndSeg ? a.rollEndSeg.id : null,
      rollSegIds: Array.isArray(a.rollSegs) ? a.rollSegs.map(s => s.id) : null,
      equippedUpgrades: [...(a.equippedUpgrades || [])],
      equippedWeapons: (a.equippedWeapons || []).map(w => ({
        id: w.id, station: w.station, ammo: w.ammo, maxAmmo: w.maxAmmo, cooldown: w.cooldown
      }))
    };
  }

  static serializeSurface(s) {
    return {
      id: s.id, type: s.type, team: s.team, x: s.x, y: s.y, heading: s.heading, name: s.name,
      hp: s.hp, maxHp: s.maxHp, fireCooldown: s.fireCooldown, aaaCooldown: s.aaaCooldown, pdCooldown: s.pdCooldown,
      ammo: s.ammo, readyAmmo: s.readyAmmo, rackReloadTimer: s.rackReloadTimer,
      targetAcquireTimers: Array.from(s.targetAcquireTimers ? s.targetAcquireTimers.entries() : []),
      jamEfficiency: s.jamEfficiency, airbaseId: s.airbaseId, segmentIndex: s.segmentIndex, totalSegments: s.totalSegments,
      parkedAircraft: this.clonePlain(s.parkedAircraft || []),
      isPrimaryObjective: Boolean(s.isPrimaryObjective), isAirbaseObjectiveAnchor: Boolean(s.isAirbaseObjectiveAnchor),
      isAirbaseNeutralized: Boolean(s.isAirbaseNeutralized), emconTimer: s.emconTimer, hasEmitted: Boolean(s.hasEmitted),
      isRevealedToBlue: Boolean(s.isRevealedToBlue), identifiedByBlue: Boolean(s.identifiedByBlue),
      identifiedByRed: Boolean(s.identifiedByRed), trackDurationBlue: s.trackDurationBlue
    };
  }

  static serializeMissile(m) {
    const inCatalog = Boolean(m.weapon && m.weapon.id && window.WEAPONS_CATALOG && window.WEAPONS_CATALOG[m.weapon.id]);
    return {
      id: m.id, weaponId: (m.weapon && m.weapon.id) ? m.weapon.id : null,
      weaponSpec: inCatalog ? null : this.clonePlain(m.weapon),
      sourceId: m.source ? m.source.id : null, targetId: m.target ? m.target.id : null, team: m.team,
      x: m.x, y: m.y, alt: m.alt, heading: m.heading, speed: m.speed, launchSpeed: m.launchSpeed, peakSpeed: m.peakSpeed,
      distanceTraveled: m.distanceTraveled, distanceToTarget: m.distanceToTarget, prevDistanceToTarget: m.prevDistanceToTarget,
      minDistanceReached: m.minDistanceReached, hasStartedClosing: Boolean(m.hasStartedClosing), cumulativeTurn: m.cumulativeTurn,
      maxRangeKm: m.maxRangeKm, launchDistKm: m.launchDistKm, launchTgpBonus: m.launchTgpBonus,
      launchCcipBonus: m.launchCcipBonus, launchArmPkBonus: m.launchArmPkBonus, launchMitlBonus: m.launchMitlBonus,
      launchCloudMitigation: m.launchCloudMitigation, launchEccmBonus: m.launchEccmBonus, launchAltFt: m.launchAltFt,
      launchCloudHits: m.launchCloudHits, rcs: m.rcs, isStealthMissile: Boolean(m.isStealthMissile),
      active: Boolean(m.active), isDead: Boolean(m.isDead), age: m.age, stage: m.stage,
      boostDuration: m.boostDuration, accelMultiplier: m.accelMultiplier, hasSustainedThrust: Boolean(m.hasSustainedThrust),
      hasIgnitedPulseTwo: Boolean(m.hasIgnitedPulseTwo), pulseTwoTimer: m.pulseTwoTimer, isLofting: Boolean(m.isLofting),
      initialAlt: m.initialAlt, isPassiveRadar: Boolean(m.isPassiveRadar), launchStealthDuration: m.launchStealthDuration,
      pathRevealDistance: m.pathRevealDistance, trackDurationBlue: m.trackDurationBlue, trackDurationRed: m.trackDurationRed,
      trackHoldBlue: m.trackHoldBlue, identifiedByBlue: Boolean(m.identifiedByBlue), identifiedByRed: Boolean(m.identifiedByRed),
      state: m.state, trail: this.clonePlain(m.trail || []), lostTimer: m.lostTimer, lostReason: m.lostReason,
      pdTestedBy: Array.from(m._pdTestedBy || [])
    };
  }
}

window.SaveGameSerializer = SaveGameSerializer;
