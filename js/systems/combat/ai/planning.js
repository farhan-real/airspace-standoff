/**
 * AIRSPACE STANDOFF: AI Mission Planning Subsystem
 * Flight paths, formation element pairing, role-based tasking, and difficulty-tiered flight vectors.
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

  update(dt, aliveHostiles, profile, diffKey) {
    this.updateSuccession(dt);
    this.updateSquadronPosture(dt, aliveHostiles, profile, diffKey);
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
      CADET: 6.0,
      VETERAN: 5.0,
      ELITE: 4.0,
      ACE: 3.5,
      MASTER: 2.5,
      LEGEND: 1.8
    };
    const hesitationSec = pauseTiers[diffKey] || 4.0;
    aliveHostiles.forEach(h => {
      this.successionTimers.set(h.id, hesitationSec);
    });

    const nextLead = aliveHostiles.find(h => !h.isAce) || aliveHostiles[0];
    if (nextLead) {
      nextLead.isFlightLead = true;
    }
  }

  isHesitating(unitId) {
    return (this.successionTimers.get(unitId) || 0) > 0;
  }

  updateSquadronPosture(dt, aliveHostiles, profile, diffKey) {
    this.postureTimer += dt;
    if (this.postureTimer < 4.0) return;
    this.postureTimer = 0.0;

    const initialCount = (this.game.hostileAircraft || []).length;
    if (initialCount === 0) return;
    const survivalRate = aliveHostiles.length / initialCount;

    if (['MASTER', 'LEGEND'].includes(diffKey) && survivalRate <= 0.40) {
      this.posture = 'DEFENSIVE_HOLD';
    } else if (survivalRate <= 0.25) {
      this.posture = 'DEFENSIVE_HOLD';
    } else {
      this.posture = 'OFFENSIVE_SWEEP';
    }
  }

  updateElementPairs(aliveHostiles, profile) {
    if (profile.formationDoctrine === 'DISORGANIZED') {
      this.elementPairs.clear();
      return;
    }
    const currentAlive = new Set(aliveHostiles.map(h => h.id));
    for (const [leadId, wingId] of this.elementPairs.entries()) {
      if (!currentAlive.has(leadId) || !currentAlive.has(wingId)) {
        this.elementPairs.delete(leadId);
      }
    }
    if (this.elementPairs.size * 2 >= aliveHostiles.length - 1) return;

    const unpaired = aliveHostiles.filter(h => !this.elementPairs.has(h.id) && ![...this.elementPairs.values()].includes(h.id));
    for (let i = 0; i < unpaired.length - 1; i += 2) {
      this.elementPairs.set(unpaired[i].id, unpaired[i + 1].id);
    }
  }

  getWingmanOffset(unit, profile) {
    if (!unit) return null;
    let isWingman = false;
    let lead = null;
    for (const [leadId, wingId] of this.elementPairs.entries()) {
      if (wingId === unit.id) {
        isWingman = true;
        lead = (this.game.hostileAircraft || []).find(h => h.id === leadId && h.hp > 0);
        break;
      }
    }
    if (!isWingman || !lead) return null;

    const spacingKm = (profile.formationDoctrine === 'HIGH_LOW_BRACKET' || profile.formationDoctrine === 'CROSSFIRE_PAIRS') ? 7.0 : 4.5;
    const perpAngle = (lead.heading || 0) + Math.PI / 2;
    return {
      x: lead.x + Math.cos(perpAngle) * spacingKm,
      y: lead.y + Math.sin(perpAngle) * spacingKm,
      leadAltFt: lead.altFt || 28000
    };
  }

  getPlannedAltitude(unit, profile, diffKey) {
    if (!profile.verticalCombat) return unit.altFt || 28000;
    const role = unit.tacticalRole || (unit.spec && unit.spec.category === 'EW' ? 'SEAD' : 'SWEEP');

    if (role === 'SNIPER') {
      if (diffKey === 'LEGEND') return unit.spec && unit.spec.id === 'DARKSTAR' ? 58000 : 50000;
      if (diffKey === 'MASTER') return 46000;
      if (diffKey === 'ACE') return 42000;
      return 38000;
    }

    if (role === 'INTERCEPT') {
      if (diffKey === 'LEGEND' || diffKey === 'MASTER') return 42000;
      if (diffKey === 'ACE') return 38000;
      return 34000;
    }

    if (role === 'DOGFIGHT') {
      return 20000;
    }

    if (role === 'SWARM') {
      return 18000;
    }

    if (role === 'ESCORT') {
      return 28000;
    }

    if (role === 'STRIKE') {
      if (diffKey === 'LEGEND') return 5500;
      if (diffKey === 'MASTER') return 8000;
      if (diffKey === 'ACE') return 11000;
      return 14000;
    }

    if (role === 'SEAD') {
      if (diffKey === 'LEGEND') return 36000;
      if (diffKey === 'MASTER') return 34000;
      if (diffKey === 'ACE') return 32000;
      return 30000;
    }

    if (role === 'AMBUSH') {
      if (diffKey === 'LEGEND') return 42000;
      if (diffKey === 'MASTER') return 40000;
      if (diffKey === 'ACE') return 36000;
      return 32000;
    }

    if (profile.formationDoctrine === 'HIGH_LOW_BRACKET') {
      const isWingman = [...this.elementPairs.values()].includes(unit.id);
      return isWingman ? 20000 : 34000;
    }

    return 28000;
  }

  getSniperVector(unit, target, dist, diffKey) {
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);

    if (diffKey === 'LEGEND') {
      if (dist < 46.0) {
        return { heading: directAngle + Math.PI, throttle: 1.0, isCrank: false };
      }
      if (dist > 90.0) {
        return { heading: directAngle, throttle: 0.90, isCrank: false };
      }
      const crankAngle = directAngle + (Math.sin(unit.age || 0) > 0 ? 1.15 : -1.15);
      return { heading: crankAngle, throttle: 0.65, isCrank: true };
    }

    if (diffKey === 'MASTER') {
      if (dist < 44.0) {
        const dragHeading = directAngle + (Math.PI * 0.85);
        return { heading: dragHeading, throttle: 0.85, isCrank: false };
      }
      if (dist > 85.0) {
        return { heading: directAngle, throttle: 0.85, isCrank: false };
      }
      const crankAngle = directAngle + (Math.sin(unit.age || 0) > 0 ? 1.0 : -1.0);
      return { heading: crankAngle, throttle: 0.60, isCrank: true };
    }

    if (diffKey === 'ACE') {
      if (dist < 42.0) {
        const retrogradeAngle = directAngle + (Math.PI * 0.75);
        return { heading: retrogradeAngle, throttle: 0.50, isCrank: false };
      }
      if (dist > 80.0) {
        return { heading: directAngle, throttle: 0.80, isCrank: false };
      }
      return { heading: directAngle, throttle: 0.60, isCrank: false };
    }

    if (dist < 38.0) {
      return { heading: directAngle + (Math.PI / 2), throttle: 0.50, isCrank: false };
    }
    return { heading: directAngle, throttle: 0.65, isCrank: false };
  }

  getInterceptVector(unit, target, dist) {
    const interceptAngle = (typeof Physics !== 'undefined')
      ? Physics.calcLeadInterceptAngle(unit.x, unit.y, unit.speed || 1.1, target.x, target.y, target.heading || 0, target.speed || 0.8)
      : Math.atan2(target.y - unit.y, target.x - unit.x);
    const sprintThrottle = dist > 30.0 ? 1.0 : 0.85;
    return { heading: interceptAngle, throttle: sprintThrottle };
  }

  getDogfightVector(unit, target, dist) {
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);
    const sOpt = (typeof unit.getOptimalCornerSpeed === 'function') ? unit.getOptimalCornerSpeed() : 0.75;
    let targetThrottle = 0.65;
    if (unit.speed > sOpt * 1.10) targetThrottle = 0.35;
    else if (unit.speed < sOpt * 0.90) targetThrottle = 0.85;
    return { heading: directAngle, throttle: targetThrottle };
  }

  getAmbushVector(unit, target, dist, diffKey) {
    const directAngle = Math.atan2(target.y - unit.y, target.x - unit.x);

    if (diffKey === 'LEGEND') {
      if (dist <= 30.0) return { heading: directAngle, throttle: 0.85 };
      const corridorY = unit.y < 50 ? 12.0 : 88.0;
      const flankTargetX = target.x + 8.0;
      return { heading: Math.atan2(corridorY - unit.y, flankTargetX - unit.x), throttle: 0.80 };
    }

    if (diffKey === 'MASTER') {
      if (dist <= 34.0) return { heading: directAngle, throttle: 0.80 };
      const corridorY = unit.y < 50 ? 14.0 : 86.0;
      return { heading: Math.atan2(corridorY - unit.y, target.x - unit.x), throttle: 0.75 };
    }

    if (diffKey === 'ACE') {
      if (dist <= 36.0) return { heading: directAngle, throttle: 0.75 };
      const corridorY = unit.y < 50 ? 16.0 : 84.0;
      return { heading: Math.atan2(corridorY - unit.y, target.x - unit.x), throttle: 0.70 };
    }

    if (dist <= 35.0) return { heading: directAngle, throttle: 0.70 };
    const corridorY = unit.y < 50 ? 18.0 : 82.0;
    return { heading: Math.atan2(corridorY - unit.y, target.x - unit.x), throttle: 0.65 };
  }

  getCoveredEgressHeading(unit) {
    const mapW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const isBlue = Boolean(unit && unit.team === 'friendly');
    const homeX = isBlue ? 10.0 : (mapW - 10.0);
    const homeY = mapH / 2.0;

    const teamUnits = (this.game.surfaceUnits || []).filter(s => s && s.team === unit.team && s.hp > 0);

    const airDefenses = teamUnits.filter(s => s.type === 'S-400' || s.type === 'PANTSIR');
    if (airDefenses.length > 0) {
      const nearestDefense = airDefenses.reduce((best, s) => {
        const d = Math.hypot(s.x - unit.x, s.y - unit.y);
        return d < best.d ? { s, d } : best;
      }, { s: airDefenses[0], d: 9999 }).s;
      return Math.atan2(nearestDefense.y - unit.y, nearestDefense.x - unit.x);
    }

    const baseInstallations = teamUnits.filter(s => s.type === 'BUNKER' || s.type === 'AMMO_DUMP' || s.type === 'EW_JAMMER');
    if (baseInstallations.length > 0) {
      const nearestBase = baseInstallations.reduce((best, s) => {
        const d = Math.hypot(s.x - unit.x, s.y - unit.y);
        return d < best.d ? { s, d } : best;
      }, { s: baseInstallations[0], d: 9999 }).s;
      return Math.atan2(nearestBase.y - unit.y, nearestBase.x - unit.x);
    }

    return Math.atan2(homeY - unit.y, homeX - unit.x);
  }
}

window.AIPlanningSystem = AIPlanningSystem;