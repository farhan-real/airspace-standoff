/**
 * AIRSPACE STANDOFF: Attack Mode IADS AI Director & Airbase Scramble Coordinator
 * Coordinates EMCON radar shutdowns, airbase taxi/takeoff operations, and objective tracking.
 */

class AttackDirector {
  static getValidatedProfile(game) {
    if (!game) throw new Error('AttackDirector requires a valid game instance.');
    if (!window.ATTACK_DIFFICULTIES) throw new Error('ATTACK_DIFFICULTIES table is not loaded.');
    if (!window.ATTACK_DOCTRINES) throw new Error('ATTACK_DOCTRINES table is not loaded.');
    const diffKey = game.attackDifficulty;
    const profile = window.ATTACK_DIFFICULTIES[diffKey];
    if (!profile) throw new Error(`Invalid attackDifficulty "${diffKey}" in AttackDirector.`);
    const doctrine = game.attackDoctrine;
    if (!window.ATTACK_DOCTRINES[doctrine]) throw new Error(`Invalid attackDoctrine "${doctrine}" in AttackDirector.`);
    return { profile, doctrine };
  }

  static initMission(game) {
    const { profile, doctrine } = this.getValidatedProfile(game);
    if (!window.AI_DIFFICULTIES || !window.AI_DIFFICULTIES[profile.qraDifficulty]) {
      throw new Error(`Invalid QRA difficulty "${profile.qraDifficulty}" on attack profile "${profile.id}".`);
    }
    if (!window.CONFIG || typeof window.CONFIG.ATTACK_WIDTH_KM !== 'number' || typeof window.CONFIG.ATTACK_HEIGHT_KM !== 'number') {
      throw new Error('ATTACK_WIDTH_KM and ATTACK_HEIGHT_KM must be configured in window.CONFIG.');
    }

    game.attackState = {
      emconEvaluatedMissiles: new Set(),
      neutralizedBases: new Set()
    };

    let initialCount = profile.qraInitialCount;
    if (typeof initialCount !== 'number') throw new Error(`Missing qraInitialCount on "${profile.id}".`);
    if (doctrine === 'INTERCEPTOR_SCREEN') initialCount += 1;

    game.aiDifficulty = profile.qraDifficulty;
    const runways = game.surfaceUnits.filter(s => s.team === 'hostile' && s.isAirbaseRunway);
    const mapW = window.CONFIG.ATTACK_WIDTH_KM;
    const mapH = window.CONFIG.ATTACK_HEIGHT_KM;

    for (let i = 0; i < initialCount; i++) {
      const rw = runways.length > 0 ? runways[i % runways.length] : null;
      const spawnX = rw ? rw.x - 10 : (mapW - 45);
      const spawnY = rw ? rw.y + ((i % 2 === 0 ? -1 : 1) * 10) : (mapH * 0.5 + (i - 1) * 18);
      this.spawnAirborneCap(game, spawnX, spawnY, profile, i === 0);
    }
  }

  static spawnAirborneCap(game, x, y, profile, isLead = false) {
    const pool = AirbaseSystem.getAirbaseRosterPool(profile.qraDifficulty);
    const specId = window.PRNG.pick(pool);
    const callsign = `CAP-${window.PRNG.int(10, 99)}`;
    const ac = new Aircraft(specId, 'hostile', x, y, Math.PI, null, callsign, 'Airbase CAP Wing', isLead, false, 26000);

    AirbaseSystem.equipQraLoadout(ac, profile.qraDifficulty, true);
    ac.tacticalRole = 'INTERCEPT';
    ac.recalculateWeight();
    game.hostileAircraft.push(ac);
    return ac;
  }

  static update(game, dt) {
    if (!game) throw new Error('AttackDirector.update requires game instance.');
    if (game.scenarioMode !== 'ATTACK' || game.isGameOver) return;
    if (!game.attackState) this.initMission(game);

    const { profile, doctrine } = this.getValidatedProfile(game);
    this.evaluateEmconResponses(game, profile, doctrine);
    if (typeof AirbaseSystem === 'undefined') throw new Error('AirbaseSystem is not loaded.');
    AirbaseSystem.updateAirbases(game, dt, profile, doctrine);
    this.checkAirbaseNeutralizations(game);
  }

  static checkAirbaseNeutralizations(game) {
    const anchors = game.surfaceUnits.filter(s => s.team === 'hostile' && s.isAirbaseObjectiveAnchor);
    for (const anchor of anchors) {
      if (anchor.isAirbaseNeutralized) continue;
      if (AirbaseSystem.isAirbaseNeutralized(game, anchor.airbaseId)) {
        anchor.isAirbaseNeutralized = true;
        if (!game.attackState.neutralizedBases.has(anchor.airbaseId)) {
          game.attackState.neutralizedBases.add(anchor.airbaseId);
          if (game.simulation) game.simulation.logScoreEvent('friendly', 450, `RUNWAY NEUTRALIZED: ${anchor.airbaseId} incapacitated`);
          if (game.radar) game.radar.spawnCombatText(anchor.x, anchor.y, 'RUNWAY INCAPACITATED (+450 VP)', '#00f5a0');
        }
      }
    }
  }

  static evaluateEmconResponses(game, profile, doctrine) {
    if (typeof profile.emconChance !== 'number' || typeof profile.emconCooldownSec !== 'number') {
      throw new Error(`Missing EMCON parameters on attack profile "${profile.id}".`);
    }
    let emconChance = profile.emconChance;
    if (doctrine === 'AMBUSH_IADS') emconChance = Math.min(0.82, emconChance + 0.16);
    if (emconChance <= 0) return;

    const c2Alive = game.surfaceUnits.some(s => s.team === 'hostile' && s.isCommandNode && s.hp > 0.05);
    if (!c2Alive) emconChance *= 0.60;

    const incomingArms = game.missiles.filter(m => m.active && m.weapon && m.weapon.isAntiRadiation && m.target && m.target.team === 'hostile');
    for (const m of incomingArms) {
      const tgt = m.target;
      if (!tgt || tgt.hp <= 0.05 || !tgt.isEmitter || tgt.emconTimer > 0) continue;
      if (m.distanceToTarget > 28.0) continue;

      const evalKey = `${m.id}:${tgt.id}`;
      if (game.attackState.emconEvaluatedMissiles.has(evalKey)) continue;
      game.attackState.emconEvaluatedMissiles.add(evalKey);

      if (Math.random() < emconChance) {
        tgt.emconTimer = profile.emconCooldownSec;
        if (game.radar) game.radar.spawnCombatText(tgt.x, tgt.y, `${tgt.name} EMCON SHUTDOWN`, '#fbbf24');
      }
    }
  }

  static getObjectiveSummary(game) {
    const objs = game.surfaceUnits.filter(s => s.team === 'hostile' && s.isPrimaryObjective);
    const alive = objs.filter(o => {
      if (o.isAirbaseObjectiveAnchor) return !o.isAirbaseNeutralized && !AirbaseSystem.isAirbaseNeutralized(game, o.airbaseId);
      return o.hp > 0.05;
    });
    return { total: objs.length, remaining: alive.length, destroyed: objs.length - alive.length };
  }
}

window.AttackDirector = AttackDirector;
