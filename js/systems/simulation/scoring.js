/**
 * AIRSPACE STANDOFF: Simulation Scoring & Engagement Logging
 * Synchronized pilot scoring, exact math parity, mission time bonuses, and timeline tracking.
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
    const parTimeSec = 360;
    if (durSec < parTimeSec) {
      return Math.max(0, Math.round((parTimeSec - durSec) * 2.5));
    }
    return 0;
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

  recordBogeyFirePenalty(team, sourceUnit, targetEntity, weapon, penalty) {
    const srcName = sourceUnit ? (sourceUnit.callsign || sourceUnit.id || 'PILOT') : 'PILOT';
    const srcType = (sourceUnit && sourceUnit.spec) ? (sourceUnit.spec.id || sourceUnit.spec.name) : 'AIRCRAFT';
    const rawWpn = weapon ? (weapon.name || weapon.id || 'Missile') : 'Missile';
    const wpnName = String(rawWpn).replace(/\s*\(\d+x\)/gi, '').trim();
    const rawTgt = targetEntity ? (targetEntity.callsign || targetEntity.flightCode || targetEntity.name || 'BOGEY [?]') : 'BOGEY [?]';
    const tgtName = String(rawTgt).replace(/<[^>]*>/g, '');

    if (sourceUnit && sourceUnit.scorePoints !== undefined) {
      sourceUnit.scorePoints = Math.max(0, (sourceUnit.scorePoints || 0) - penalty);
    }

    this.timelineEvents.push({
      time: this.getElapsedTimeString(),
      type: 'roe_penalty',
      team: team,
      source: srcName,
      sourceType: srcType,
      target: tgtName,
      targetType: 'UNVERIFIED',
      weapon: wpnName,
      points: -penalty,
      reason: `RECKLESS ENGAGEMENT: Fired on unverified track [BOGEY ?] (${tgtName})`
    });
  }

  recordHitEvent(firingTeam, targetEntity, firingSource, details = {}) {
    if (!targetEntity || targetEntity.isGhost) return;

    const isDecoy = Boolean(targetEntity.isDecoyDrone);
    const rawTgtName = targetEntity.callsign || (targetEntity.spec ? targetEntity.spec.name : (targetEntity.name || 'TARGET'));
    const tgtName = String(rawTgtName).replace(/<[^>]*>/g, '');
    const tgtType = isDecoy ? 'DECOY DRONE' : (targetEntity.spec ? (targetEntity.spec.id || targetEntity.spec.name) : (targetEntity.type || 'SURFACE'));

    const rawSrcName = firingSource ? (firingSource.callsign || firingSource.name || firingSource.id || 'BASE') : 'BASE';
    const srcName = String(rawSrcName).replace(/<[^>]*>/g, '');
    const srcType = (firingSource && firingSource.spec) ? (firingSource.spec.id || firingSource.spec.name) : (firingSource && firingSource.name ? firingSource.name : 'AIRCRAFT');

    const rawWpnName = details.weapon ? (details.weapon.name || details.weapon.id) : (details.weaponName || 'Missile');
    const wpnName = String(rawWpnName).replace(/\s*\(\d+x\)/gi, '').replace(/\s*\(pack of \d+\)/gi, '').trim();

    const isSalvo = Boolean(details.isSalvo || (details.salvoCount > 1));
    const salvoCount = details.salvoCount || (isSalvo ? 2 : 1);
    const salvoBreakdown = details.salvoBreakdown || (isSalvo ? `x${salvoCount}` : '');
    const dmg = details.damage || 2;

    this.timelineEvents.push({
      time: this.getElapsedTimeString(),
      type: 'hit',
      team: firingTeam,
      source: srcName,
      sourceType: srcType,
      target: tgtName,
      targetType: tgtType,
      weapon: wpnName,
      damage: dmg,
      isSalvo: isSalvo,
      salvoCount: salvoCount,
      salvoBreakdown: salvoBreakdown
    });
    if (this.game.inspection && this.game.inspection.enabled) {
      this.game.inspection.recordEvent('DAMAGE', `${srcName} damaged ${tgtName}`, firingSource, targetEntity, {
        weapon: wpnName, damage: dmg, isSalvo, salvoCount, salvoBreakdown,
        remainingHp: targetEntity.hp, targetMaxHp: targetEntity.maxHp
      });
    }
  }

  recordKillEvent(firingTeam, targetEntity, firingSource, details = {}) {
    if (!targetEntity || targetEntity.isGhost) return;

    const isAircraft = (typeof Aircraft !== 'undefined') && (targetEntity instanceof Aircraft);
    const isDecoy = Boolean(targetEntity.isDecoyDrone);
    const isAce = Boolean(targetEntity.isAce);
    const isDrone = Boolean(targetEntity.spec && targetEntity.spec.isDrone);

    const rawTgtName = targetEntity.callsign || (targetEntity.spec ? targetEntity.spec.name : (targetEntity.name || 'TARGET'));
    const tgtName = String(rawTgtName).replace(/<[^>]*>/g, '');
    const tgtType = isDecoy ? 'DECOY DRONE' : (targetEntity.spec ? (targetEntity.spec.id || targetEntity.spec.name) : (targetEntity.type || 'SURFACE'));

    const rawSrcName = firingSource ? (firingSource.callsign || firingSource.name || firingSource.id || 'BASE') : 'BASE';
    const srcName = String(rawSrcName).replace(/<[^>]*>/g, '');
    const srcType = (firingSource && firingSource.spec) ? (firingSource.spec.id || firingSource.spec.name) : (firingSource && firingSource.name ? firingSource.name : 'AIRCRAFT');

    const rawWpnName = details.weapon ? (details.weapon.name || details.weapon.id) : (details.weaponName || 'Missile');
    const wpnName = String(rawWpnName).replace(/\s*\(\d+x\)/gi, '').replace(/\s*\(pack of \d+\)/gi, '').trim();

    const isSalvo = Boolean(details.isSalvo || (details.salvoCount > 1));
    const salvoCount = details.salvoCount || (isSalvo ? 2 : 1);
    const salvoBreakdown = details.salvoBreakdown || (isSalvo ? `x${salvoCount}` : '');
    const salvoTag = isSalvo ? ` [Salvo: ${salvoBreakdown}]` : '';

    const cfg = window.CONFIG || {};
    let pts = 250;
    if (isDecoy) {
      pts = 40;
    } else if (isDrone) {
      const droneBase = cfg.VP_DRONE_KILL_BASE || 80;
      const droneMult = cfg.VP_DRONE_COST_MULT || 12;
      pts = Math.round(droneBase + (((targetEntity.spec && targetEntity.spec.cost) || 5) * droneMult));
    } else if (isAircraft) {
      const acBase = cfg.VP_AIRCRAFT_KILL_BASE || 150;
      const acMult = cfg.VP_AIRCRAFT_COST_MULT || 10;
      pts = Math.round(acBase + (((targetEntity.spec && targetEntity.spec.cost) || 20) * acMult));
    } else if (targetEntity.type === 'BUNKER') {
      pts = cfg.VP_BUNKER_DESTROYED || 800;
    } else if (targetEntity.type === 'S-400') {
      pts = cfg.VP_SAM_DESTROYED || 300;
    } else if (targetEntity.type === 'RADAR_ARRAY') {
      pts = cfg.VP_RADAR_DESTROYED || 250;
    } else if (targetEntity.type === 'EW_JAMMER') {
      pts = cfg.VP_RADAR_DESTROYED || 250;
    } else if (targetEntity.type === 'PANTSIR') {
      pts = 200;
    } else if (targetEntity.type === 'FUEL_DEPOT') {
      pts = cfg.VP_FUEL_DEPOT_DESTROYED || 200;
    }

    if (targetEntity.isFlightLead) pts = Math.round(pts * 1.5);
    if (isAce) pts += (cfg.VP_ACE_FIGHTER_BOUNTY || 850);

    if (firingSource) {
      if (firingSource.kills !== undefined && !isDecoy) firingSource.kills++;
      if (firingSource.scorePoints !== undefined && !isDecoy) {
        firingSource.scorePoints = (firingSource.scorePoints || 0) + pts;
      }
    }

    const logDesc = `${srcName} (${srcType}) destroyed ${tgtName} (${tgtType}) using ${wpnName}${salvoTag}`.trim();

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
      salvoBreakdown: salvoBreakdown,
      points: pts
    });
  }

  recordCivilianHit(firingTeam, civilianFlight, firingSource, weapon) {
    const penalty = (window.CONFIG && window.CONFIG.VP_CIVILIAN_HIT_PENALTY) || 500;
    const srcName = firingSource && firingSource.spec && window.formatAircraftDisplayName
      ? window.formatAircraftDisplayName(firingSource)
      : (firingSource ? (firingSource.callsign || firingSource.name || firingSource.id || 'PILOT') : 'PILOT');
    const rawWpn = weapon ? (weapon.name || weapon.id || 'Weapon') : 'Weapon';
    const wpnName = String(rawWpn).replace(/\s*\(\d+x\)/gi, '').trim();

    if (firingSource && firingSource.scorePoints !== undefined) {
      firingSource.scorePoints = Math.max(0, (firingSource.scorePoints || 0) - penalty);
    }

    const logMsg = `ROE VIOLATION: Civilian flight struck (${civilianFlight.flightCode}) by ${srcName} [${wpnName}]`;
    this.logScoreEvent(firingTeam, -penalty, logMsg);

    this.timelineEvents.push({
      time: this.getElapsedTimeString(),
      type: 'roe_penalty',
      team: firingTeam,
      source: srcName,
      target: civilianFlight.flightCode,
      targetType: 'Airliner',
      weapon: wpnName,
      points: -penalty,
      reason: logMsg
    });

    if (window.Game && window.Game.radar) {
      window.Game.radar.spawnCombatText(civilianFlight.x, civilianFlight.y, `ROE VIOLATION: CIVILIAN STRUCK (-${penalty} VP)`, '#f97316');
    }
  }

  recordCivilianShootdown(firingTeam, civilianFlight, firingSource, weapon) {
    const penalty = (window.CONFIG && window.CONFIG.VP_CIVILIAN_DESTROYED_PENALTY) || 2000;
    const srcName = firingSource && firingSource.spec && window.formatAircraftDisplayName
      ? window.formatAircraftDisplayName(firingSource)
      : (firingSource ? (firingSource.callsign || firingSource.name || firingSource.id || 'PILOT') : 'PILOT');
    const rawWpn = weapon ? (weapon.name || weapon.id || 'Weapon') : 'Weapon';
    const wpnName = String(rawWpn).replace(/\s*\(\d+x\)/gi, '').trim();

    if (firingSource && firingSource.scorePoints !== undefined) {
      firingSource.scorePoints = Math.max(0, (firingSource.scorePoints || 0) - penalty);
    }

    const logMsg = `ROE VIOLATION: Civilian airliner destroyed (${civilianFlight.flightCode}) by ${srcName}`;
    this.logScoreEvent(firingTeam, -penalty, logMsg);

    this.timelineEvents.push({
      time: this.getElapsedTimeString(),
      type: 'roe_penalty',
      team: firingTeam,
      source: srcName,
      target: civilianFlight.flightCode,
      targetType: 'Airliner',
      weapon: wpnName,
      points: -penalty,
      reason: logMsg
    });

    if (window.Game && window.Game.radar) {
      window.Game.radar.spawnCombatText(civilianFlight.x, civilianFlight.y, `ROE VIOLATION: AIRLINER DESTROYED (-${penalty} VP)`, '#ff3366');
    }
  }
}

window.SimulationScoring = SimulationScoring;
