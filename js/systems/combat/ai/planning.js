/**
 * js/systems/combat/ai/planning.js - AI Mission Planning Subsystem
 * Flight paths, formation element pairing, doctrine posture thresholds, and role-based altitudes & vectors.
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
      baseAlt = diffKey === 'LEGEND' ? (unit.spec && unit.spec.id === 'DARKSTAR' ? 58000 : 50000)
        : (diffKey === 'MASTER' ? 46000 : (diffKey === 'FORTIFIED' ? 44000 : (diffKey === 'ACE' ? 42000 : (diffKey === 'FORWARD' ? 40000 : (diffKey === 'ELITE' ? 38000 : 36000)))));
    } else if (role === 'FLAGSHIP') {
      baseAlt = diffKey === 'LEGEND' ? 44000 : (diffKey === 'MASTER' ? 42000 : (diffKey === 'FORTIFIED' ? 40000 : 38000));
    } else if (role === 'INTERCEPT') {
      baseAlt = (diffKey === 'LEGEND' || diffKey === 'MASTER') ? 42000
        : (diffKey === 'FORTIFIED' ? 40000 : (diffKey === 'ACE' ? 38000 : (diffKey === 'FORWARD' ? 36000 : (diffKey === 'ELITE' ? 34000 : 32000))));
    } else if (role === 'DOGFIGHT') baseAlt = 20000;
    else if (role === 'SWARM') baseAlt = 18000;
    else if (role === 'ESCORT') baseAlt = 30000;
    else if (role === 'STRIKE') {
      baseAlt = diffKey === 'LEGEND' ? 5500 : (diffKey === 'MASTER' ? 8000 : (diffKey === 'FORTIFIED' ? 9500 : (diffKey === 'ACE' ? 11000 : (diffKey === 'FORWARD' ? 12000 : (diffKey === 'ELITE' ? 13000 : 15000)))));
    } else if (role === 'SEAD') {
      baseAlt = diffKey === 'LEGEND' ? 36000 : (diffKey === 'MASTER' ? 34000 : (diffKey === 'FORTIFIED' ? 33000 : (diffKey === 'ACE' ? 32000 : (diffKey === 'FORWARD' ? 31000 : 30000))));
    } else if (role === 'AMBUSH') {
      baseAlt = diffKey === 'LEGEND' ? 42000 : (diffKey === 'MASTER' ? 40000 : (diffKey === 'FORTIFIED' ? 38000 : (diffKey === 'ACE' ? 36000 : (diffKey === 'FORWARD' ? 34000 : 32000))));
    } else if (profile.formationDoctrine === 'HIGH_LOW_BRACKET' || profile.formationDoctrine === 'PINCER_BRACKET') {
      const isWingman = [...this.elementPairs.values()].includes(unit.id);
      baseAlt = isWingman ? 20000 : 34000;
    }

    return Math.max(5000, Math.min(58000, baseAlt + altBias));
  }

  getEscortVector(unit, target, dist) {
    const friendlies = (this.game.hostileAircraft || []).filter(h => h && h.id !== unit.id && h.hp > 0.05);
    const vip = friendlies.find(h => h.isAce || h.isFlightLead) ||
      friendlies.find(h => h.tacticalRole === 'STRIKE' || h.tacticalRole === 'SEAD');

    if (vip && target) {
      const vipDistToTgt = Math.hypot(target.x - vip.x, target.y - vip.y);
      const screenAngle = Math.atan2(target.y - vip.y, target.x - vip.x);
      const screenX = vip.x + Math.cos(screenAngle) * Math.min(12.0, vipDistToTgt * 0.45);
      const screenY = vip.y + Math.sin(screenAngle) * Math.min(12.0, vipDistToTgt * 0.45);
      if (Math.hypot(screenX - unit.x, screenY - unit.y) > 6.0 && dist > 26.0) {
        return { heading: Math.atan2(screenY - unit.y, screenX - unit.x), throttle: 0.78 };
      }
    }
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
    const sOpt = unit.getOptimalCornerSpeed();
    return { heading: directAngle, throttle: unit.speed > sOpt * 1.10 ? 0.50 : 0.72 };
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

  getTrackSearchParams(diffKey) {
    const tiers = {
      CADET:     { searchRangeKm: 42.0, reacquirePriority: 0.25, crankMidcourse: false, broadsideFlank: false, burnThroughPush: false, throttle: 0.50 },
      BUFFER:    { searchRangeKm: 50.0, reacquirePriority: 0.35, crankMidcourse: false, broadsideFlank: false, burnThroughPush: false, throttle: 0.54 },
      VETERAN:   { searchRangeKm: 65.0, reacquirePriority: 0.50, crankMidcourse: false, broadsideFlank: false, burnThroughPush: false, throttle: 0.58 },
      ESCALATED: { searchRangeKm: 78.0, reacquirePriority: 0.65, crankMidcourse: true,  broadsideFlank: false, burnThroughPush: false, throttle: 0.64 },
      ELITE:     { searchRangeKm: 92.0, reacquirePriority: 0.78, crankMidcourse: true,  broadsideFlank: false, burnThroughPush: true,  throttle: 0.70 },
      FORWARD:   { searchRangeKm: 105.0, reacquirePriority: 0.85, crankMidcourse: true, broadsideFlank: true,  burnThroughPush: true,  throttle: 0.74 },
      ACE:       { searchRangeKm: 120.0, reacquirePriority: 0.92, crankMidcourse: true, broadsideFlank: true,  burnThroughPush: true,  throttle: 0.78 },
      FORTIFIED: { searchRangeKm: 135.0, reacquirePriority: 0.96, crankMidcourse: true, broadsideFlank: true,  burnThroughPush: true,  throttle: 0.82 },
      MASTER:    { searchRangeKm: 150.0, reacquirePriority: 1.00, crankMidcourse: true, broadsideFlank: true,  burnThroughPush: true,  throttle: 0.85 },
      LEGEND:    { searchRangeKm: 180.0, reacquirePriority: 1.00, crankMidcourse: true, broadsideFlank: true,  burnThroughPush: true,  throttle: 0.90 }
    };
    return tiers[diffKey] || tiers.VETERAN;
  }

  hasActiveMidcourseMissiles(unit, allMissiles) {
    if (!unit || !allMissiles || allMissiles.length === 0) return false;
    for (let i = 0; i < allMissiles.length; i++) {
      const m = allMissiles[i];
      if (!m || !m.active || m.team !== unit.team || m.hasOwnSeekerLock) continue;
      if (m.guidanceMode === 'MIDCOURSE' && m.target && m.target.hp > 0.05) {
        if (m.source && m.source.id === unit.id) return m.target;
      }
    }
    return false;
  }

  getTrackAcquisitionVector(unit, trackedTargets, untrackedContacts, allMissiles, diffKey) {
    const params = this.getTrackSearchParams(diffKey);
    const midcourseTarget = params.crankMidcourse ? this.hasActiveMidcourseMissiles(unit, allMissiles) : false;

    if (midcourseTarget) {
      const dist = Math.hypot(midcourseTarget.x - unit.x, midcourseTarget.y - unit.y);
      const directAngle = Math.atan2(midcourseTarget.y - unit.y, midcourseTarget.x - unit.x);
      const halfConeRad = (((unit.spec && unit.spec.radarConeDeg) ? unit.spec.radarConeDeg : 120) / 2.0) * (Math.PI / 180.0);
      const crankOffset = Math.min(halfConeRad * 0.72, 0.72);
      const sign = (unit.id.charCodeAt(unit.id.length - 1) % 2 === 0) ? 1 : -1;
      unit._aiTrackOrder = 'F-POLE MIDCOURSE SUPPORT';
      return {
        target: midcourseTarget,
        heading: directAngle + sign * crankOffset,
        throttle: dist < 34.0 ? 0.45 : params.throttle,
        reason: 'F-POLE MIDCOURSE SUPPORT'
      };
    }

    if (!untrackedContacts || untrackedContacts.length === 0) {
      unit._aiTrackOrder = null;
      return null;
    }

    let best = null;
    let bestScore = -9999;
    for (let i = 0; i < untrackedContacts.length; i++) {
      const c = untrackedContacts[i];
      if (!c || c.hp <= 0.05) continue;
      const d = Math.hypot(c.x - unit.x, c.y - unit.y);
      if (d > params.searchRangeKm) continue;
      const isStale = Boolean(c.everIdentifiedByRed);
      const score = (isStale ? 55 * params.reacquirePriority : 15) - d * 0.65;
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    if (!best) {
      unit._aiTrackOrder = null;
      return null;
    }

    const dist = Math.hypot(best.x - unit.x, best.y - unit.y);
    const directAngle = Math.atan2(best.y - unit.y, best.x - unit.x);
    const isStealth = Boolean(best.spec && (best.spec.sigma_0 <= 0.01 || best.spec.category === 'STEALTH'));

    const isWingman = [...this.elementPairs.values()].includes(unit.id);
    if (params.broadsideFlank && isWingman && dist > 26.0) {
      const flankSign = (unit.id.charCodeAt(unit.id.length - 1) % 2 === 0) ? 1 : -1;
      unit._aiTrackOrder = best.everIdentifiedByRed ? 'FLANK RE-ACQUIRE STALE' : 'FLANK SWEEP BOGEY';
      return {
        target: best,
        heading: directAngle + flankSign * 0.52,
        throttle: params.throttle,
        reason: unit._aiTrackOrder
      };
    }

    const pushFast = params.burnThroughPush && (isStealth || best.jamEfficiency > 0 || best.isNotching) && dist > (unit.hasIRST ? (unit.irstRangeKm || 28.0) : 18.0);
    unit._aiTrackOrder = best.everIdentifiedByRed ? 'RE-ACQUIRING STALE TRACK' : 'SWEEP SEARCHING BOGEY';
    return {
      target: best,
      heading: directAngle,
      throttle: pushFast ? Math.min(0.96, params.throttle + 0.14) : params.throttle,
      reason: unit._aiTrackOrder
    };
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
