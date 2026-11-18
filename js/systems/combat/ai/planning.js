/**
 * AIRSPACE STANDOFF: AI Mission Planning Subsystem
 * Flight paths, formation element pairing, doctrine posture thresholds, and role-based altitudes.
 */

class AIPlanningSystem {
  constructor(commander) {
    this.cmd = commander;
    this.game = commander.game;
    this.successionTimers = new Map();
    this.elementPairs = new Map();
    this.flightWaypoints = new Map();
    this.posture = 'OFFENSIVE_SWEEP';
    this.postureTimer = 0.0;
  }

  reset() {
    this.successionTimers.clear();
    this.elementPairs.clear();
    this.flightWaypoints.clear();
    this.posture = 'OFFENSIVE_SWEEP';
    this.postureTimer = 0.0;
  }

  update(dt, aliveHostiles, profile, diffKey, airDoctrine) {
    this.updateSuccession(dt);
    this.updateSquadronPosture(dt, aliveHostiles, profile, diffKey, airDoctrine);
    this.updateElementPairs(aliveHostiles, profile);
  }

  updateSuccession(dt) {
    for (const [id, timer] of this.successionTimers.entries()) {
      const remaining = timer - dt;
      if (remaining <= 0) this.successionTimers.delete(id);
      else this.successionTimers.set(id, remaining);
    }
  }

  handleLeadDowned(downedUnit, aliveHostiles, diffKey) {
    if (!downedUnit || aliveHostiles.length === 0) return;
    const pauseTiers = {
      CADET: 6.0, BUFFER: 5.5, VETERAN: 5.0, ESCALATED: 4.5, ELITE: 4.0,
      FORWARD: 3.8, ACE: 3.5, FORTIFIED: 3.0, MASTER: 2.5, LEGEND: 1.8
    };
    const hesitationSec = pauseTiers[diffKey];
    aliveHostiles.forEach(h => { this.successionTimers.set(h.id, hesitationSec); });
    const nextLead = aliveHostiles.find(h => !h.isAce) || aliveHostiles[0];
    if (nextLead) nextLead.isFlightLead = true;

    const insp = this.game && this.game.inspection;
    if (insp && insp.enabled) {
      insp.recordEvent('COMMAND DISRUPTION', `Hostile lead ${window.formatCombatantDisplayName(downedUnit)} lost (${hesitationSec.toFixed(1)}s hesitation)`, downedUnit, nextLead || null, {
        hesitationSec, survivingHostiles: aliveHostiles.length, successorLead: nextLead ? window.formatCombatantDisplayName(nextLead) : 'None'
      });
    }
  }

  isHesitating(unitId) {
    return (this.successionTimers.get(unitId) || 0) > 0;
  }

  updateSquadronPosture(dt, aliveHostiles, profile, diffKey, airDoctrine) {
    this.postureTimer += dt;
    if (this.postureTimer < 4.0) return;
    this.postureTimer = 0.0;

    const initialCount = (this.game.hostileAircraft || []).length;
    if (initialCount === 0) return;
    const survivalRate = aliveHostiles.length / initialCount;
    const baseThreshold = ['FORTIFIED', 'MASTER', 'LEGEND'].includes(diffKey) ? 0.40 : 0.25;
    const threshold = Math.max(0.10, Math.min(0.70, baseThreshold + (airDoctrine ? airDoctrine.retreatThresholdBonus : 0)));

    const prevPosture = this.posture;
    this.posture = (survivalRate <= threshold) ? 'DEFENSIVE_HOLD' : 'OFFENSIVE_SWEEP';
    if (this.posture !== prevPosture && this.game && this.game.inspection && this.game.inspection.enabled) {
      this.game.inspection.recordEvent('POSTURE SHIFT', `Hostile squadron posture shifted from ${prevPosture} to ${this.posture}`, null, null, {
        previousPosture: prevPosture, newPosture: this.posture, survivalRatePct: Math.round(survivalRate * 100), thresholdPct: Math.round(threshold * 100)
      });
    }
  }

  updateElementPairs(aliveHostiles, profile) {
    if (profile.formationDoctrine === 'DISORGANIZED') {
      this.elementPairs.clear();
      return;
    }
    const currentAlive = new Set(aliveHostiles.map(h => h.id));
    for (const [leadId, wingId] of this.elementPairs.entries()) {
      if (!currentAlive.has(leadId) || !currentAlive.has(wingId)) this.elementPairs.delete(leadId);
    }
    if (this.elementPairs.size * 2 >= aliveHostiles.length - 1) return;

    const unpaired = aliveHostiles.filter(h => !this.elementPairs.has(h.id) && ![...this.elementPairs.values()].includes(h.id));
    for (let i = 0; i < unpaired.length - 1; i += 2) {
      this.elementPairs.set(unpaired[i].id, unpaired[i + 1].id);
    }
  }

  getWingmanOffset(unit, profile) {
    if (!unit) return null;
    let lead = null;
    for (const [leadId, wingId] of this.elementPairs.entries()) {
      if (wingId === unit.id) {
        lead = (this.game.hostileAircraft || []).find(h => h.id === leadId && h.hp > 0.05) || null;
        break;
      }
    }
    if (!lead) return null;

    const spacingKm = (profile.formationDoctrine === 'HIGH_LOW_BRACKET' || profile.formationDoctrine === 'CROSSFIRE_PAIRS' || profile.formationDoctrine === 'PINCER_BRACKET') ? 7.0 : 4.5;
    const perpAngle = (lead.heading || 0) + Math.PI / 2;
    return {
      x: lead.x + Math.cos(perpAngle) * spacingKm,
      y: lead.y + Math.sin(perpAngle) * spacingKm,
      leadAltFt: lead.altFt || 28000
    };
  }

  getPlannedAltitude(unit, profile, diffKey, airDoctrine) {
    if (!profile.verticalCombat) return unit.altFt || 28000;
    const role = unit.tacticalRole || (unit.spec && unit.spec.category === 'EW' ? 'SEAD' : 'SWEEP');
    const altBias = airDoctrine ? airDoctrine.altitudeBiasFt : 0;

    let baseAlt = 28000;
    if (role === 'SNIPER') {
      if (diffKey === 'LEGEND') baseAlt = unit.spec && unit.spec.id === 'DARKSTAR' ? 58000 : 50000;
      else if (diffKey === 'MASTER') baseAlt = 46000;
      else if (diffKey === 'FORTIFIED') baseAlt = 44000;
      else if (diffKey === 'ACE') baseAlt = 42000;
      else if (diffKey === 'FORWARD') baseAlt = 40000;
      else if (diffKey === 'ELITE') baseAlt = 38000;
      else baseAlt = 36000;
    } else if (role === 'INTERCEPT') {
      if (diffKey === 'LEGEND' || diffKey === 'MASTER') baseAlt = 42000;
      else if (diffKey === 'FORTIFIED') baseAlt = 40000;
      else if (diffKey === 'ACE') baseAlt = 38000;
      else if (diffKey === 'FORWARD') baseAlt = 36000;
      else if (diffKey === 'ELITE') baseAlt = 34000;
      else baseAlt = 32000;
    } else if (role === 'DOGFIGHT') baseAlt = 20000;
    else if (role === 'SWARM') baseAlt = 18000;
    else if (role === 'ESCORT') baseAlt = 28000;
    else if (role === 'STRIKE') {
      if (diffKey === 'LEGEND') baseAlt = 5500;
      else if (diffKey === 'MASTER') baseAlt = 8000;
      else if (diffKey === 'FORTIFIED') baseAlt = 9500;
      else if (diffKey === 'ACE') baseAlt = 11000;
      else if (diffKey === 'FORWARD') baseAlt = 12000;
      else if (diffKey === 'ELITE') baseAlt = 13000;
      else baseAlt = 15000;
    } else if (role === 'SEAD') {
      if (diffKey === 'LEGEND') baseAlt = 36000;
      else if (diffKey === 'MASTER') baseAlt = 34000;
      else if (diffKey === 'FORTIFIED') baseAlt = 33000;
      else if (diffKey === 'ACE') baseAlt = 32000;
      else if (diffKey === 'FORWARD') baseAlt = 31000;
      else baseAlt = 30000;
    } else if (role === 'AMBUSH') {
      if (diffKey === 'LEGEND') baseAlt = 42000;
      else if (diffKey === 'MASTER') baseAlt = 40000;
      else if (diffKey === 'FORTIFIED') baseAlt = 38000;
      else if (diffKey === 'ACE') baseAlt = 36000;
      else if (diffKey === 'FORWARD') baseAlt = 34000;
      else baseAlt = 32000;
    } else if (profile.formationDoctrine === 'HIGH_LOW_BRACKET' || profile.formationDoctrine === 'PINCER_BRACKET') {
      const isWingman = [...this.elementPairs.values()].includes(unit.id);
      baseAlt = isWingman ? 20000 : 34000;
    }

    return Math.max(5000, Math.min(58000, baseAlt + altBias));
  }

  getSniperVector(unit, target, dist, diffKey) {
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
    if (diffKey === 'LEGEND') {
      if (dist < 46.0) return { heading: directAngle + Math.PI, throttle: 1.0 };
      if (dist > 90.0) return { heading: directAngle, throttle: 0.90 };
      return { heading: directAngle + (Math.sin(unit.age || 0) > 0 ? 1.15 : -1.15), throttle: 0.65 };
    }
    if (diffKey === 'MASTER' || diffKey === 'FORTIFIED') {
      if (dist < 44.0) return { heading: directAngle + (Math.PI * 0.85), throttle: 0.85 };
      if (dist > 85.0) return { heading: directAngle, throttle: 0.85 };
      return { heading: directAngle + (Math.sin(unit.age || 0) > 0 ? 1.0 : -1.0), throttle: 0.60 };
    }
    if (diffKey === 'ACE' || diffKey === 'FORWARD') {
      if (dist < 42.0) return { heading: directAngle + (Math.PI * 0.75), throttle: 0.50 };
      if (dist > 80.0) return { heading: directAngle, throttle: 0.80 };
      return { heading: directAngle, throttle: 0.60 };
    }
    if (dist < 38.0) return { heading: directAngle + (Math.PI / 2), throttle: 0.50 };
    return { heading: directAngle, throttle: 0.65 };
  }

  getInterceptVector(unit, target, dist) {
    const interceptAngle = Physics.calcLeadInterceptAngle(unit.x, unit.y, unit.speed, target.x, target.y, target.heading || 0, target.speed || 0.8);
    return { heading: interceptAngle, throttle: dist > 30.0 ? 1.0 : 0.85 };
  }

  getDogfightVector(unit, target) {
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
    const sOpt = unit.getOptimalCornerSpeed();
    let targetThrottle = 0.65;
    if (unit.speed > sOpt * 1.10) targetThrottle = 0.35;
    else if (unit.speed < sOpt * 0.90) targetThrottle = 0.85;
    return { heading: directAngle, throttle: targetThrottle };
  }

  getAmbushVector(unit, target, dist, diffKey) {
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
    const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const corridorY = unit.y < mapH * 0.5 ? 14.0 : (mapH - 14.0);
    if (diffKey === 'LEGEND') {
      if (dist <= 30.0) return { heading: directAngle, throttle: 0.85 };
      return { heading: Math.atan2(corridorY - unit.y, target.x + 8.0 - unit.x), throttle: 0.80 };
    }
    if (diffKey === 'MASTER' || diffKey === 'FORTIFIED') {
      if (dist <= 34.0) return { heading: directAngle, throttle: 0.80 };
      return { heading: Math.atan2(corridorY - unit.y, target.x - unit.x), throttle: 0.75 };
    }
    if (diffKey === 'ACE' || diffKey === 'FORWARD') {
      if (dist <= 36.0) return { heading: directAngle, throttle: 0.75 };
      return { heading: Math.atan2(corridorY - unit.y, target.x - unit.x), throttle: 0.70 };
    }
    if (dist <= 35.0) return { heading: directAngle, throttle: 0.70 };
    return { heading: Math.atan2(corridorY - unit.y, target.x - unit.x), throttle: 0.65 };
  }

  getCoveredEgressHeading(unit) {
    const mapW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const isBlue = Boolean(unit && unit.team === 'friendly');
    const homeX = isBlue ? 10.0 : (mapW - 10.0);
    const homeY = mapH / 2.0;

    const teamUnits = (this.game.surfaceUnits || []).filter(s => s && s.team === unit.team && s.hp > 0.05);
    const airDefenses = teamUnits.filter(s => s.category === 'LR_SAM' || s.category === 'MR_SAM' || s.type === 'S-400' || s.type === 'PANTSIR');
    if (airDefenses.length > 0) {
      const nearest = airDefenses.reduce((best, s) => {
        const d = Math.hypot(s.x - unit.x, s.y - unit.y);
        return d < best.d ? { s, d } : best;
      }, { s: airDefenses[0], d: 9999 }).s;
      return Math.atan2(nearest.y - unit.y, nearest.x - unit.x);
    }
    const bases = teamUnits.filter(s => s.type === 'BUNKER' || s.type === 'AMMO_DUMP' || s.type === 'EW_JAMMER');
    if (bases.length > 0) {
      const nearest = bases.reduce((best, s) => {
        const d = Math.hypot(s.x - unit.x, s.y - unit.y);
        return d < best.d ? { s, d } : best;
      }, { s: bases[0], d: 9999 }).s;
      return Math.atan2(nearest.y - unit.y, nearest.x - unit.x);
    }
    return Math.atan2(homeY - unit.y, homeX - unit.x);
  }
}

window.AIPlanningSystem = AIPlanningSystem;
