/**
 * AIRSPACE STANDOFF: Attack Mode IADS AI Director & Airbase Scramble Coordinator
 * Applies ATTACK_DOCTRINES modifiers to initial CAP, EMCON radar discipline, and airbase dispatch.
 */

class AttackDirector {
  static getValidatedProfile(game) {
    if (!game) throw new Error('AttackDirector requires a valid game instance.');
    if (!window.ATTACK_DIFFICULTIES) throw new Error('ATTACK_DIFFICULTIES table is not loaded.');
    if (!window.ATTACK_DOCTRINES) throw new Error('ATTACK_DOCTRINES table is not loaded.');
    const profile = window.ATTACK_DIFFICULTIES[game.attackDifficulty];
    if (!profile) throw new Error(`Invalid attackDifficulty "${game.attackDifficulty}" in AttackDirector.`);
    const docProfile = window.ATTACK_DOCTRINES[game.attackDoctrine];
    if (!docProfile) throw new Error(`Invalid attackDoctrine "${game.attackDoctrine}" in AttackDirector.`);
    return { profile, doctrine: game.attackDoctrine, docProfile };
  }

  static initMission(game) {
    const { profile, docProfile } = this.getValidatedProfile(game);
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

    const initialCount = profile.qraInitialCount + docProfile.extraInitialCap;
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

    const { profile, doctrine, docProfile } = this.getValidatedProfile(game);
    this.evaluateEmconResponses(game, profile, docProfile);
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
          if (game.inspection && game.inspection.enabled) {
            game.inspection.recordEvent('RUNWAY NEUTRALIZED', `${anchor.airbaseId} rendered unusable for manned QRA launches (+450 VP)`, null, anchor, { airbaseId: anchor.airbaseId, bonusVp: 450 });
          }
          if (game.radar) game.radar.spawnCombatText(anchor.x, anchor.y, 'RUNWAY INCAPACITATED (+450 VP)', '#00f5a0');
        }
      }
    }
  }

  static evaluateEmconResponses(game, profile, docProfile) {
    let emconChance = Math.max(0, Math.min(0.85, profile.emconChance + docProfile.emconBonus));
    if (emconChance <= 0) return;

    const c2Alive = game.surfaceUnits.some(s => s.team === 'hostile' && s.isCommandNode && s.hp > 0.05);
    if (!c2Alive) emconChance *= 0.60;

    const incomingArms = game.missiles.filter(m => m.active && m.weapon && m.weapon.isAntiRadiation && m.target && m.target.team === 'hostile');
    for (const m of incomingArms) {
      const tgt = m.target;
      if (!tgt || tgt.hp <= 0.05 || !tgt.isEmitter || tgt.emconTimer > 0) continue;
      if (m.distanceToTarget > docProfile.armTriggerKm) continue;

      const evalKey = `${m.id}:${tgt.id}`;
      if (game.attackState.emconEvaluatedMissiles.has(evalKey)) continue;
      game.attackState.emconEvaluatedMissiles.add(evalKey);

      if (Math.random() < emconChance) {
        tgt.emconTimer = profile.emconCooldownSec * docProfile.emconDurationMult;
        if (game.inspection && game.inspection.enabled) {
          game.inspection.recordEvent('EMCON SHUTDOWN', `${tgt.name} silenced emitter vs ${m.weapon.name} (${tgt.emconTimer.toFixed(1)}s)`, m, tgt, {
            emconDurationSec: tgt.emconTimer, triggerDistanceKm: m.distanceToTarget, armAntiEmcon: Boolean(m.weapon.antiEmcon), c2Online: c2Alive
          });
        }
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
