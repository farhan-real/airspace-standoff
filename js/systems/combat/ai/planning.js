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

  getPlannedAltitude(unit, profile, diffKey, airDoctrine, target = null) {
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

    if (typeof AIFlightProfile !== 'undefined') {
      const fp = AIFlightProfile.evaluate(unit, diffKey);
      if (fp.hasTfr && (role === 'STRIKE' || fp.a2gAmmo > 0)) {
        baseAlt = Math.round(AIFlightProfile.lerp(baseAlt, 8000, fp.precision));
      } else if (fp.outOfBvr && (fp.wvrAmmo > 0 || fp.hasEnergyGun) && role !== 'SNIPER') {
        const wvrTargetAlt = 26000 - Math.round(fp.agiScore * 6500);
        baseAlt = Math.round(AIFlightProfile.lerp(baseAlt, wvrTargetAlt, fp.precision));
      } else if (role !== 'STRIKE') {
        const climbBonus = (fp.speedScore * 5500 + fp.radarReachScore * 3500 + fp.useWeight * 2500) * fp.precision;
        if (fp.bvrAmmo > 0 && role !== 'DOGFIGHT') baseAlt += Math.round(climbBonus);
        if (target && (target.altFt || 28000) < 15000) {
          baseAlt -= Math.round((1.0 - fp.lookDownScore) * 6500 * fp.useLookDown);
        }
      }
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
    const halfConeRad = (((unit.spec && unit.spec.radarConeDeg) ? unit.spec.radarConeDeg : 120) / 2.0) * (Math.PI / 180.0);
    const p = (typeof AIFlightProfile !== 'undefined') ? AIFlightProfile.getPrecision(diffKey, Boolean(unit && unit.isAce)) : 0.50;
    const crankSign = (unit.id && unit.id.charCodeAt(unit.id.length - 1) % 2 === 0) ? 1 : -1;
    const maxCrank = Math.min(halfConeRad * 0.82, 0.95);
    const crankAngle = AIFlightProfile.lerp(0.50, maxCrank, p);

    const escapeDist = AIFlightProfile.lerp(36.0, 48.0, p);
    const pushDist = AIFlightProfile.lerp(75.0, 92.0, p);

    if (unit._aiSniperMode === 'ESCAPE') {
      if (dist >= escapeDist + 6.0) unit._aiSniperMode = 'CRANK';
    } else if (unit._aiSniperMode === 'PUSH') {
      if (dist <= pushDist - 6.0) unit._aiSniperMode = 'CRANK';
    } else {
      if (dist < escapeDist) unit._aiSniperMode = 'ESCAPE';
      else if (dist > pushDist) unit._aiSniperMode = 'PUSH';
      else unit._aiSniperMode = 'CRANK';
    }

    if (unit._aiSniperMode === 'ESCAPE') {
      const escapeHeading = directAngle + crankSign * AIFlightProfile.lerp(Math.PI * 0.55, Math.PI * 0.88, p);
      const escapeThrottle = AIFlightProfile.lerp(0.60, 1.00, p);
      return { heading: escapeHeading, throttle: escapeThrottle };
    }
    if (unit._aiSniperMode === 'PUSH') {
      return { heading: directAngle, throttle: AIFlightProfile.lerp(0.70, 0.92, p) };
    }
    return { heading: directAngle + crankSign * crankAngle, throttle: AIFlightProfile.lerp(0.68, 0.60, p) };
  }

  getInterceptVector(unit, target, dist) {
    const interceptAngle = Physics.calcLeadInterceptAngle(unit.x, unit.y, unit.speed, target.x, target.y, target.heading || 0, target.speed || 0.8);
    return { heading: interceptAngle, throttle: dist > 30.0 ? 1.0 : 0.85 };
  }

  getDogfightVector(unit, target, dist = 15.0, diffKey = 'ACE') {
    const fp = (typeof AIFlightProfile !== 'undefined') ? AIFlightProfile.evaluate(unit, diffKey) : null;
    if (fp && (1.0 - fp.agiScore) * fp.precision > 0.40 && fp.bvrAmmo > 0) {
      if (unit._aiDogfightEvade) {
        if (dist > 28.0) unit._aiDogfightEvade = false;
      } else if (dist < 22.0) {
        unit._aiDogfightEvade = true;
      }
      if (unit._aiDogfightEvade) {
        return { heading: Math.atan2(target.y - unit.y, target.x - unit.x) + Math.PI * 0.85, throttle: 0.92 };
      }
    } else {
      unit._aiDogfightEvade = false;
    }
    const pushThresh = (fp && fp.hasEnergyGun) ? Math.max(18.0, fp.gunRangeKm + 4.0) : 20.0;
    if (unit._aiDogfightPush) {
      if (dist < pushThresh - 4.0) unit._aiDogfightPush = false;
    } else if (dist > pushThresh + 2.0) {
      unit._aiDogfightPush = true;
    }
    if (unit._aiDogfightPush) {
      const leadAngle = Physics.calcLeadInterceptAngle(unit.x, unit.y, unit.speed, target.x, target.y, target.heading || 0, target.speed || 0.8);
      return { heading: leadAngle, throttle: fp ? AIFlightProfile.clamp(0.88 - fp.useWeight * 0.14, 0.68, 0.94) : 0.86 };
    }
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
    const cornerThrottle = fp ? AIFlightProfile.computeCornerThrottle(unit, fp.effMaxMach, fp.precision, 0.65) : 0.65;
    return { heading: directAngle, throttle: cornerThrottle };
  }

  getStatAwareSteering(unit, target, dist, diffKey) {
    if (typeof AIFlightProfile === 'undefined' || !target) return null;
    const fp = AIFlightProfile.evaluate(unit, diffKey);
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
    const crankSign = (unit.id && unit.id.charCodeAt(unit.id.length - 1) % 2 === 0) ? 1 : -1;
    const crankAngle = Math.min(fp.halfConeRad * 0.78, 0.92) * (1.0 - 0.35 * fp.useBeamSpike);

    // BVR-dry: blend smoothly into WVR / dogfight / gun merge
    if (fp.outOfBvr && (fp.wvrAmmo > 0 || fp.hasGunpod || fp.hasEnergyGun)) {
      if ((1.0 - fp.agiScore) * fp.precision > 0.40 && fp.wvrAmmo === 0 && dist < 22.0) {
        return { heading: directAngle + Math.PI * 0.85, throttle: 0.92 };
      }
      return this.getDogfightVector(unit, target, dist, diffKey);
    }

    // ECM Pod screening: continuous blend around umbrella bounds with hysteresis
    const ecmWeight = fp.jamPower * fp.precision;
    if (ecmWeight > 0.15 && fp.bvrAmmo > 0) {
      if (unit._aiEcmScreen) {
        if (dist < 27.0 || dist > 63.0) unit._aiEcmScreen = false;
      } else if (dist >= 32.0 && dist <= 58.0) {
        unit._aiEcmScreen = true;
      }
      if (unit._aiEcmScreen) {
        return { heading: directAngle + crankSign * Math.min(fp.halfConeRad * 0.72, 0.85), throttle: 0.64 };
      }
    } else {
      unit._aiEcmScreen = false;
    }

    // Silent IR BVR: drag/crank earlier with hysteresis
    const irDragWeight = fp.irBvrRatio * (1.0 - fp.arhRatio) * fp.precision;
    const irDragDist = fp.preferredEngageKm * AIFlightProfile.lerp(0.70, 0.90, irDragWeight);
    if (irDragWeight > 0.30) {
      if (unit._aiIrDrag) {
        if (dist > irDragDist + 6.0) unit._aiIrDrag = false;
      } else if (dist < irDragDist) {
        unit._aiIrDrag = true;
      }
      if (unit._aiIrDrag) {
        return { heading: directAngle + crankSign * (0.95 + 0.25 * fp.precision), throttle: 0.78 };
      }
    } else {
      unit._aiIrDrag = false;
    }

    // Heavy/stiff standoff drag: continuously computed threshold with hysteresis
    if (fp.bvrAmmo > 0) {
      const standOffBias = ((1.0 - fp.agiScore) * 0.55 + fp.useWeight * 0.45 + fp.useCaution * 0.60) * fp.precision;
      const minStandOff = fp.preferredEngageKm * AIFlightProfile.clamp(0.45 + 0.35 * standOffBias, 0.40, 0.88);
      if (standOffBias > 0.18) {
        if (unit._aiStandOffDrag) {
          if (dist >= minStandOff + 6.0) unit._aiStandOffDrag = false;
        } else if (dist < minStandOff) {
          unit._aiStandOffDrag = true;
        }
        if (unit._aiStandOffDrag) {
          const turnAwayAngle = directAngle + crankSign * AIFlightProfile.lerp(Math.PI * 0.60, Math.PI * 0.84, standOffBias);
          const escapeThrottle = AIFlightProfile.clamp(0.72 + fp.speedScore * 0.22, 0.70, 0.96);
          return { heading: turnAwayAngle, throttle: escapeThrottle };
        }
      } else {
        unit._aiStandOffDrag = false;
      }
      if (standOffBias > 0.12 && dist <= fp.preferredEngageKm * 1.15) {
        return { heading: directAngle + crankSign * (crankAngle * 0.88), throttle: AIFlightProfile.computeCornerThrottle(unit, fp.effMaxMach, fp.precision, 0.66) };
      }
    } else {
      unit._aiStandOffDrag = false;
    }

    // Stealth flanking: smooth flank taper as unit closes inside 32km
    if (fp.useStealth > 0.08 && dist > 26.0) {
      const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
      const nearEdge = unit.y < 18.0 || unit.y > (mapH - 18.0);
      const flankScale = nearEdge ? 0.0 : AIFlightProfile.smoothstep(26.0, 44.0, dist);
      const flankBias = unit.y < mapH * 0.5 ? -0.44 : 0.44;
      const throttle = AIFlightProfile.clamp(0.72 - fp.thermalVuln * 0.18, 0.50, 0.80);
      return { heading: directAngle + flankBias * fp.useStealth * flankScale, throttle };
    }

    // Nimble corner merge: scales with agility * (1 - weight) * precision
    const dogfightAffinity = fp.agiScore * (1.0 - fp.useWeight) * fp.precision;
    if (dogfightAffinity > 0.25 && dist <= AIFlightProfile.lerp(18.0, 30.0, dogfightAffinity)) {
      return this.getDogfightVector(unit, target, dist, diffKey);
    }

    // Long-distance BVR pursuit
    if (fp.bvrAmmo > 0 && dist > fp.preferredEngageKm && fp.speedScore * fp.precision > 0.15) {
      const leadAngle = Physics.calcLeadInterceptAngle(unit.x, unit.y, unit.speed, target.x, target.y, target.heading || 0, target.speed || 0.8);
      return { heading: leadAngle, throttle: AIFlightProfile.clamp(0.72 + fp.speedScore * 0.24 * fp.precision, 0.68, 0.98) };
    }

    return null;
  }

  getSwarmVector(unit, target, dist) {
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
    const flankSign = (unit.id && unit.id.charCodeAt(unit.id.length - 1) % 2 === 0) ? 1 : -1;
    const offset = dist > 22.0 ? (flankSign * 0.40) : 0.0;
    return { heading: directAngle + offset, throttle: dist > 22.0 ? 0.92 : 0.78 };
  }

  getSeadVector(unit, target, dist, airTargets = []) {
    const threat = (airTargets && airTargets.length > 0)
      ? airTargets.reduce((best, cur) => (Math.hypot(cur.x - unit.x, cur.y - unit.y) < Math.hypot(best.x - unit.x, best.y - unit.y) ? cur : best), airTargets[0])
      : target;
    const refDist = threat ? Math.hypot(threat.x - unit.x, threat.y - unit.y) : dist;
    const directAngle = Math.atan2((threat ? threat.y : target.y) - unit.y, (threat ? threat.x : target.x) - unit.x);
    const orbitSign = (unit.id && unit.id.charCodeAt(unit.id.length - 1) % 2 === 0) ? 1 : -1;
    if (unit._aiSeadMode === 'EGRESS') {
      if (refDist >= 42.0) unit._aiSeadMode = 'ORBIT';
    } else if (unit._aiSeadMode === 'ORBIT') {
      if (refDist < 36.0) unit._aiSeadMode = 'EGRESS';
      else if (refDist > 62.0) unit._aiSeadMode = 'INGRESS';
    } else {
      if (refDist < 36.0) unit._aiSeadMode = 'EGRESS';
      else if (refDist <= 56.0) unit._aiSeadMode = 'ORBIT';
      else unit._aiSeadMode = 'INGRESS';
    }
    if (unit._aiSeadMode === 'EGRESS') return { heading: directAngle + orbitSign * (Math.PI * 0.78), throttle: 0.72 };
    if (unit._aiSeadMode === 'ORBIT') return { heading: directAngle + orbitSign * (Math.PI / 2), throttle: 0.58 };
    return { heading: directAngle, throttle: 0.66 };
  }

  getStrikeVector(unit, target, dist, maxA2GRangeKm = 0) {
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
    if (maxA2GRangeKm >= 30.0) {
      if (unit._aiStrikeEgress) {
        if (dist >= 32.0) unit._aiStrikeEgress = false;
      } else if (dist < 26.0) {
        unit._aiStrikeEgress = true;
      }
      if (unit._aiStrikeEgress) return { heading: directAngle + Math.PI * 0.82, throttle: 0.86 };
      return { heading: directAngle, throttle: dist > 55.0 ? 0.82 : 0.68 };
    }
    return { heading: directAngle, throttle: dist > 18.0 ? 0.86 : 0.72 };
  }

  getAmbushVector(unit, target, dist, diffKey) {
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
    const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const corridorY = unit.y < mapH * 0.5 ? 18.0 : (mapH - 18.0);
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
