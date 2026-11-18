/**
 * AIRSPACE STANDOFF: Simulation Scoring & Engagement Logging
 * Synchronized pilot scoring, Attack & Air difficulty multipliers, time bonuses, and timeline tracking.
 */

class SimulationScoring {
  constructor(gameEngine) {
    if (!gameEngine) throw new Error('SimulationScoring requires a gameEngine instance.');
    this.game = gameEngine;
    this.scoreLog = [];
    this.timelineEvents = [];
  }

  reset() {
    this.scoreLog = [];
    this.timelineEvents = [];
  }

  getElapsedTimeString() {
    const simulationTime = this.game.simulation && Number.isFinite(this.game.simulation.elapsedTimeSec)
      ? this.game.simulation.elapsedTimeSec
      : (performance.now() - (this.game.matchStartTime || performance.now())) / 1000;
    const durSec = Math.max(0, Math.floor(simulationTime));
    const m = Math.floor(durSec / 60);
    const s = durSec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  calcTimeBonus(durSec, blueWon) {
    if (!blueWon) return 0;
    const parTimeSec = (this.game.scenarioMode === 'ATTACK') ? 540 : 360;
    if (durSec < parTimeSec) {
      return Math.max(0, Math.round((parTimeSec - durSec) * 2.5));
    }
    return 0;
  }

  getScoreMultipliers() {
    const isAttack = (this.game.scenarioMode === 'ATTACK');
    const diffKey = isAttack ? this.game.attackDifficulty : this.game.aiDifficulty;
    const diffTable = isAttack ? window.ATTACK_DIFFICULTIES : window.AI_DIFFICULTIES;
    const diffData = diffTable && diffTable[diffKey];
    if (!diffData || typeof diffData.scoreMultiplier !== 'number') {
      throw new Error(`Difficulty "${diffKey}" is not defined in ${isAttack ? 'ATTACK_DIFFICULTIES' : 'AI_DIFFICULTIES'}.`);
    }
    const diffMult = diffData.scoreMultiplier;

    const bTierKey = this.game.playerBudgetId;
    const bTierData = window.BUDGET_TIERS[bTierKey];
    if (!bTierData || typeof bTierData.multiplier !== 'number') {
      throw new Error(`Budget tier "${bTierKey}" is not defined in BUDGET_TIERS.`);
    }
    const budgetMult = bTierData.multiplier;
    const totalMult = Number((diffMult * budgetMult).toFixed(2));

    return {
      diffKey,
      diffName: diffData.name,
      diffMult,
      budgetTierKey: bTierKey,
      budgetCap: bTierData.budget,
      budgetMult,
      totalMult
    };
  }

  logScoreEvent(team, points, reason) {
    if (typeof points !== 'number' || isNaN(points)) {
      throw new Error(`Invalid score points value: ${points}`);
    }
    if (team === 'friendly') this.game.vpAlly += points;
    else if (team === 'hostile') this.game.vpHostile += points;
    else throw new Error(`Invalid team "${team}" in logScoreEvent.`);

    this.scoreLog.unshift({ time: this.getElapsedTimeString(), team, points, reason });
    if (this.scoreLog.length > 20) this.scoreLog.pop();
    if (this.game.inspection && this.game.inspection.enabled) {
      this.game.inspection.recordEvent('SCORE CHANGE', reason, null, null, { team, points, blueScore: this.game.vpAlly, redScore: this.game.vpHostile });
    }
    this.renderScoreLog();
  }

  renderScoreLog() {
    const listEl = document.getElementById('combat-score-log-list');
    if (!listEl) return;
    listEl.innerHTML = this.scoreLog.slice(0, 10).map(item => {
      const isNegative = item.points < 0;
      const teamColor = item.team === 'friendly' ? '#00f0ff' : '#ff3366';
      const teamTag = item.team === 'friendly' ? 'BLUE' : 'RED';
      const ptsSign = isNegative ? '' : '+';
      return `<div class="score-log-entry"><span>[${item.time}] <b style="color:${teamColor};">[${teamTag}]</b> ${item.reason}</span> <b style="color:${isNegative ? '#ff3366' : teamColor};">${ptsSign}${item.points} VP</b></div>`;
    }).join('');
  }

  getCurrentExactTimeSec() {
    return this.game.simulation && Number.isFinite(this.game.simulation.elapsedTimeSec)
      ? Number(this.game.simulation.elapsedTimeSec.toFixed(2))
      : Number(((performance.now() - (this.game.matchStartTime || performance.now())) / 1000).toFixed(2));
  }

  recordBogeyFirePenalty(team, sourceUnit, targetEntity, weapon, penalty) {
    const srcName = sourceUnit ? (sourceUnit.callsign || sourceUnit.id) : 'PILOT';
    const srcType = (sourceUnit && sourceUnit.spec) ? (sourceUnit.spec.id || sourceUnit.spec.name) : 'AIRCRAFT';
    const wpnName = String(weapon ? (weapon.name || weapon.id) : 'Missile').replace(/\s*\(\d+x\)/gi, '').trim();
    const tgtName = String(targetEntity ? (targetEntity.callsign || targetEntity.flightCode || targetEntity.name || 'BOGEY [?]') : 'BOGEY [?]').replace(/<[^>]*>/g, '');

    if (sourceUnit && sourceUnit.scorePoints !== undefined) sourceUnit.scorePoints -= penalty;
    this.timelineEvents.push({
      time: this.getElapsedTimeString(), timeSec: this.getCurrentExactTimeSec(),
      type: 'roe_penalty', team, source: srcName, sourceType: srcType,
      target: tgtName, targetType: 'UNVERIFIED', weapon: wpnName, points: -penalty,
      reason: `ROE INFRACTION: Fired on unverified track [BOGEY ?] (${tgtName})`
    });
  }

  recordCivilianFirePenalty(team, sourceUnit, civilianFlight, weapon, penalty) {
    const srcName = sourceUnit ? (sourceUnit.callsign || sourceUnit.id) : 'PILOT';
    const srcType = (sourceUnit && sourceUnit.spec) ? (sourceUnit.spec.id || sourceUnit.spec.name) : 'AIRCRAFT';
    const wpnName = String(weapon ? (weapon.name || weapon.id) : 'Weapon').replace(/\s*\(\d+x\)/gi, '').trim();
    const tgtName = civilianFlight ? (civilianFlight.flightCode || civilianFlight.name) : 'Civilian Flight';

    if (sourceUnit && sourceUnit.scorePoints !== undefined) sourceUnit.scorePoints -= penalty;
    this.timelineEvents.push({
      time: this.getElapsedTimeString(), timeSec: this.getCurrentExactTimeSec(),
      type: 'roe_penalty', team, source: srcName, sourceType: srcType,
      target: tgtName, targetType: 'CIVILIAN', weapon: wpnName, points: -penalty,
      reason: `ROE VIOLATION: Fired weapon at civilian airliner (${tgtName})`
    });
  }

  recordHitEvent(firingTeam, targetEntity, firingSource, details = {}) {
    if (!targetEntity || targetEntity.isGhost) return;
    const isDecoy = Boolean(targetEntity.isDecoyDrone);
    const tgtName = String(targetEntity.callsign || (targetEntity.spec ? targetEntity.spec.name : targetEntity.name)).replace(/<[^>]*>/g, '');
    const tgtType = isDecoy ? 'DECOY DRONE' : (targetEntity.spec ? (targetEntity.spec.id || targetEntity.spec.name) : targetEntity.type);
    const srcName = String(firingSource ? (firingSource.callsign || firingSource.name || firingSource.id) : 'BASE').replace(/<[^>]*>/g, '');
    const srcType = (firingSource && firingSource.spec) ? (firingSource.spec.id || firingSource.spec.name) : (firingSource && firingSource.name ? firingSource.name : 'AIRCRAFT');
    const wpnName = String(details.weapon ? (details.weapon.name || details.weapon.id) : (details.weaponName || 'Missile')).replace(/\s*\(\d+x\)/gi, '').trim();
    const isSalvo = Boolean(details.isSalvo || (details.salvoCount > 1));
    const salvoCount = details.salvoCount || (isSalvo ? 2 : 1);
    const salvoBreakdown = details.salvoBreakdown || (isSalvo ? `x${salvoCount}` : '');
    const dmg = Number(Number(details.damage || 0).toFixed(1));

    this.timelineEvents.push({
      time: this.getElapsedTimeString(), timeSec: this.getCurrentExactTimeSec(),
      type: 'hit', team: firingTeam, source: srcName, sourceType: srcType,
      target: tgtName, targetType: tgtType, weapon: wpnName, damage: dmg,
      isSalvo, salvoCount, salvoBreakdown
    });
    if (this.game.inspection && this.game.inspection.enabled) {
      this.game.inspection.recordEvent('DAMAGE', `${srcName} damaged ${tgtName}`, firingSource, targetEntity, {
        weapon: wpnName, damage: dmg, isSalvo, salvoCount, salvoBreakdown, remainingHp: targetEntity.hp, targetMaxHp: targetEntity.maxHp
      });
    }
  }

  recordKillEvent(firingTeam, targetEntity, firingSource, details = {}) {
    if (!targetEntity || targetEntity.isGhost) return;

    const isAircraft = (typeof Aircraft !== 'undefined') && (targetEntity instanceof Aircraft);
    const isDecoy = Boolean(targetEntity.isDecoyDrone);
    const isAce = Boolean(targetEntity.isAce);
    const isDrone = Boolean(targetEntity.spec && targetEntity.spec.isDrone);

    const tgtName = String(targetEntity.callsign || (targetEntity.spec ? targetEntity.spec.name : targetEntity.name)).replace(/<[^>]*>/g, '');
    const tgtType = isDecoy ? 'DECOY DRONE' : (targetEntity.spec ? (targetEntity.spec.id || targetEntity.spec.name) : targetEntity.type);
    const srcName = String(firingSource ? (firingSource.callsign || firingSource.name || firingSource.id) : 'BASE').replace(/<[^>]*>/g, '');
    const srcType = (firingSource && firingSource.spec) ? (firingSource.spec.id || firingSource.spec.name) : (firingSource && firingSource.name ? firingSource.name : 'AIRCRAFT');
    const wpnName = String(details.weapon ? (details.weapon.name || details.weapon.id) : (details.weaponName || 'Missile')).replace(/\s*\(\d+x\)/gi, '').replace(/\s*\(pack of \d+\)/gi, '').trim();

    const isSalvo = Boolean(details.isSalvo || (details.salvoCount > 1));
    const salvoCount = details.salvoCount || (isSalvo ? 2 : 1);
    const salvoBreakdown = details.salvoBreakdown || (isSalvo ? `x${salvoCount}` : '');
    const salvoTag = isSalvo ? ` [Salvo: ${salvoBreakdown}]` : '';

    let pts;
    if (isDecoy) {
      pts = 40;
    } else if (isDrone) {
      pts = Math.round(window.CONFIG.VP_DRONE_KILL_BASE + (targetEntity.spec.cost * window.CONFIG.VP_DRONE_COST_MULT));
    } else if (isAircraft) {
      pts = Math.round(window.CONFIG.VP_AIRCRAFT_KILL_BASE + (targetEntity.spec.cost * window.CONFIG.VP_AIRCRAFT_COST_MULT));
    } else if (typeof targetEntity.vpValue === 'number' && !isNaN(targetEntity.vpValue)) {
      pts = targetEntity.vpValue;
    } else {
      throw new Error(`Target "${tgtName}" (${tgtType}) has missing or invalid vpValue.`);
    }

    if (targetEntity.isFlightLead) pts = Math.round(pts * 1.5);
    if (isAce) pts += window.CONFIG.VP_ACE_FIGHTER_BOUNTY;

    if (firingSource) {
      if (firingSource.kills !== undefined && !isDecoy) firingSource.kills++;
      if (firingSource.scorePoints !== undefined && !isDecoy && !targetEntity.isGroundDecoy) firingSource.scorePoints += pts;
    }

    const logDesc = `${srcName} (${srcType}) destroyed ${tgtName} (${tgtType}) using ${wpnName}${salvoTag}`.trim();
    if (firingTeam === 'friendly') {
      if (isAircraft && !isDecoy) this.game.stats.redLosses++;
      this.logScoreEvent('friendly', pts, logDesc);
    } else {
      if (isAircraft && !isDecoy) this.game.stats.blueLosses++;
      this.logScoreEvent('hostile', pts, logDesc);
    }

    this.timelineEvents.push({
      time: this.getElapsedTimeString(), timeSec: this.getCurrentExactTimeSec(),
      type: isAce ? 'ace-kill' : 'kill', team: firingTeam,
      source: srcName, sourceType: srcType, target: tgtName, targetType: tgtType,
      weapon: wpnName, isSalvo, salvoCount, salvoBreakdown, points: pts
    });

    if (this.game.simulation && typeof this.game.simulation.captureReplayFrame === 'function') {
      this.game.simulation.captureReplayFrame(true);
    }
  }

  recordCivilianHit(firingTeam, civilianFlight, firingSource, weapon) {
    const penalty = window.CONFIG.VP_CIVILIAN_HIT_PENALTY;
    const srcName = firingSource && firingSource.spec && window.formatAircraftDisplayName
      ? window.formatAircraftDisplayName(firingSource)
      : (firingSource ? (firingSource.callsign || firingSource.name || firingSource.id) : 'PILOT');
    const wpnName = String(weapon ? (weapon.name || weapon.id) : 'Weapon').replace(/\s*\(\d+x\)/gi, '').trim();

    if (firingSource && firingSource.scorePoints !== undefined) firingSource.scorePoints -= penalty;
    const logMsg = `ROE VIOLATION: Civilian flight struck (${civilianFlight.flightCode}) by ${srcName} [${wpnName}]`;
    this.logScoreEvent(firingTeam, -penalty, logMsg);

    this.timelineEvents.push({
      time: this.getElapsedTimeString(), timeSec: this.getCurrentExactTimeSec(),
      type: 'roe_penalty', team: firingTeam, source: srcName,
      target: civilianFlight.flightCode, targetType: 'Airliner', weapon: wpnName, points: -penalty, reason: logMsg
    });
    if (window.Game && window.Game.radar) window.Game.radar.spawnCombatText(civilianFlight.x, civilianFlight.y, `ROE VIOLATION: CIVILIAN STRUCK (-${penalty} VP)`, '#f97316');
  }

  recordCivilianShootdown(firingTeam, civilianFlight, firingSource, weapon) {
    const penalty = window.CONFIG.VP_CIVILIAN_DESTROYED_PENALTY;
    const srcName = firingSource && firingSource.spec && window.formatAircraftDisplayName
      ? window.formatAircraftDisplayName(firingSource)
      : (firingSource ? (firingSource.callsign || firingSource.name || firingSource.id) : 'PILOT');
    const wpnName = String(weapon ? (weapon.name || weapon.id) : 'Weapon').replace(/\s*\(\d+x\)/gi, '').trim();

    if (firingSource && firingSource.scorePoints !== undefined) firingSource.scorePoints -= penalty;
    const logMsg = `ROE VIOLATION: Civilian airliner destroyed (${civilianFlight.flightCode}) by ${srcName}`;
    this.logScoreEvent(firingTeam, -penalty, logMsg);

    this.timelineEvents.push({
      time: this.getElapsedTimeString(), timeSec: this.getCurrentExactTimeSec(),
      type: 'roe_penalty', team: firingTeam, source: srcName,
      target: civilianFlight.flightCode, targetType: 'Airliner', weapon: wpnName, points: -penalty, reason: logMsg
    });
    if (window.Game && window.Game.radar) window.Game.radar.spawnCombatText(civilianFlight.x, civilianFlight.y, `ROE VIOLATION: AIRLINER DESTROYED (-${penalty} VP)`, '#ff3366');
    if (this.game.simulation && typeof this.game.simulation.captureReplayFrame === 'function') this.game.simulation.captureReplayFrame(true);
  }
}

window.SimulationScoring = SimulationScoring;
