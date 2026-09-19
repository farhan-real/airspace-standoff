/**
 * AIRSPACE STANDOFF // Simulation Scoring & Engagement Logging
 * Objective military engagement reporting and RoE accounting.
 */

class SimulationScoring {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.scoreLog = [];
    this.timelineEvents = [];
  }

  reset() {
    this.scoreLog = [];
    this.timelineEvents = [];
  }

  getElapsedTimeString() {
    const durSec = Math.max(0, Math.floor((performance.now() - (this.game.matchStartTime || performance.now())) / 1000));
    const m = Math.floor(durSec / 60);
    const s = durSec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  getScoreMultipliers() {
    const diffKey = this.game.aiDifficulty || 'VETERAN';
    const diffData = (window.AI_DIFFICULTIES && window.AI_DIFFICULTIES[diffKey]) || { scoreMultiplier: 1.00 };
    const diffMult = diffData.scoreMultiplier || 1.00;

    const bTierKey = this.game.playerBudgetId || 'BUDGET_400';
    const bTierData = (window.BUDGET_TIERS && window.BUDGET_TIERS[bTierKey]) || { multiplier: 1.00, budget: 400.0 };
    const budgetMult = bTierData.multiplier || 1.00;
    const totalMult = Number((diffMult * budgetMult).toFixed(2));

    return {
      diffKey, diffMult,
      budgetTierKey: bTierKey, budgetCap: bTierData.budget || 400.0,
      budgetMult, totalMult
    };
  }

  logScoreEvent(team, points, reason) {
    if (team === 'friendly') {
      this.game.vpAlly = Math.max(0, this.game.vpAlly + points);
    } else {
      this.game.vpHostile = Math.max(0, this.game.vpHostile + points);
    }

    this.scoreLog.unshift({
      time: this.getElapsedTimeString(),
      team: team,
      points: points,
      reason: reason
    });

    if (this.scoreLog.length > 20) this.scoreLog.pop();
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

  recordKillEvent(firingTeam, targetEntity, firingSource, details = {}) {
    if (!targetEntity || targetEntity.isGhost) return;

    const isAircraft = (typeof Aircraft !== 'undefined') && (targetEntity instanceof Aircraft);
    const isDecoy = Boolean(targetEntity.isDecoyDrone);
    const isAce = Boolean(targetEntity.isAce);

    const rawTgtName = targetEntity.callsign || (targetEntity.spec ? targetEntity.spec.name : (targetEntity.name || 'TARGET'));
    const tgtName = String(rawTgtName).replace(/<[^>]*>/g, '');
    const tgtType = isDecoy ? 'DECOY DRONE' : (targetEntity.spec ? (targetEntity.spec.id || targetEntity.spec.name) : (targetEntity.type || 'SURFACE'));

    const rawSrcName = firingSource ? (firingSource.callsign || firingSource.id || 'BASE') : 'BASE';
    const srcName = String(rawSrcName).replace(/<[^>]*>/g, '');
    const srcType = (firingSource && firingSource.spec) ? (firingSource.spec.id || firingSource.spec.name) : 'AIRCRAFT';

    const wpnName = details.weapon ? (details.weapon.name || details.weapon.id) : (details.weaponName || 'Missile');
    const isSalvo = Boolean(details.isSalvo || (details.salvoCount > 1));
    const salvoCount = details.salvoCount || (isSalvo ? 2 : 1);
    const salvoTag = isSalvo ? `[Salvo x${salvoCount}]` : '';

    let pts = isDecoy ? 20 : (isAircraft ? Math.round(((targetEntity.spec && targetEntity.spec.cost) || 20) * 3) : 250);
    if (targetEntity.isFlightLead) pts *= 2;
    if (isAce) pts += ((window.CONFIG && window.CONFIG.VP_ACE_FIGHTER_BOUNTY) || 850);

    if (firingSource && firingSource.kills !== undefined && !isDecoy) {
      firingSource.kills++;
    }

    const logDesc = `${srcName} (${srcType}) destroyed ${tgtName} (${tgtType}) using ${wpnName} ${salvoTag}`.trim();

    if (firingTeam === 'friendly') {
      if (!isDecoy) this.game.stats.redLosses++;
      this.logScoreEvent('friendly', pts, logDesc);
    } else {
      if (!isDecoy) this.game.stats.blueLosses++;
      this.logScoreEvent('hostile', pts, logDesc);
    }

    this.timelineEvents.push({
      time: this.getElapsedTimeString(),
      type: isAce ? 'ace-kill' : 'kill',
      team: firingTeam,
      source: srcName,
      sourceType: srcType,
      target: tgtName,
      targetType: tgtType,
      weapon: wpnName,
      isSalvo: isSalvo,
      salvoCount: salvoCount,
      points: pts
    });
  }

  recordCivilianShootdown(firingTeam, civilianFlight) {
    const penalty = (window.CONFIG && window.CONFIG.VP_CIVILIAN_DESTROYED_PENALTY) || 800;

    if (firingTeam === 'friendly') {
      this.logScoreEvent('friendly', -penalty, 'ROE VIOLATION: Civilian flight destroyed (' + civilianFlight.flightCode + ')');
    } else {
      this.logScoreEvent('hostile', -penalty, 'Civilian flight destroyed (' + civilianFlight.flightCode + ')');
    }

    this.timelineEvents.push({
      time: this.getElapsedTimeString(),
      type: 'roe_penalty',
      team: firingTeam,
      target: civilianFlight.flightCode,
      targetType: 'Airliner',
      points: -penalty
    });

    if (window.Game && window.Game.radar) {
      window.Game.radar.spawnCombatText(civilianFlight.x, civilianFlight.y, 'ROE VIOLATION: -' + penalty + ' VP', '#ff3366');
    }
  }
}

window.SimulationScoring = SimulationScoring;
