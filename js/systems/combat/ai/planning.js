/**
 * AIRSPACE STANDOFF: AI Mission Planning Subsystem
 * Ingress profiles, formation element pairing, role-based tasking, and command succession.
 */

class AIPlanningSystem {
  constructor(commander) {
    this.cmd = commander;
    this.game = commander.game;
    this.successionTimers = new Map();
    this.elementPairs = new Map();
    this.ingressWaypoints = new Map();
    this.posture = 'OFFENSIVE_SWEEP';
    this.postureTimer = 0.0;
  }

  reset() {
    this.successionTimers.clear();
    this.elementPairs.clear();
    this.ingressWaypoints.clear();
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

    const spacingKm = (profile.formationDoctrine === 'HIGH_LOW_BRACKET' || profile.formationDoctrine === 'PINCER_PAIRS') ? 7.0 : 4.5;
    const perpAngle = (lead.heading || 0) + Math.PI / 2;
    return {
      x: lead.x + Math.cos(perpAngle) * spacingKm,
      y: lead.y + Math.sin(perpAngle) * spacingKm,
      leadAltFt: lead.altFt || 28000
    };
  }

  getPlannedAltitude(unit, profile, diffKey) {
    if (!profile.verticalCombat) return unit.altFt || 28000;
    const spec = unit.spec || {};
    const cat = spec.category || 'MULTIROLE';

    if (cat === 'SUPERIORITY' || cat === 'STEALTH' || spec.id === 'DARKSTAR') {
      return 38000;
    }
    if (cat === 'STRIKE' || cat === 'CAS') {
      return 14000;
    }
    if (profile.formationDoctrine === 'HIGH_LOW_BRACKET') {
      const isWingman = [...this.elementPairs.values()].includes(unit.id);
      return isWingman ? 18000 : 34000;
    }
    return 26000;
  }

  getCoveredEgressHeading(unit) {
    const mapW = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const mapH = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const friendlySurface = (this.game.surfaceUnits || []).filter(s => s.team === 'hostile' && s.hp > 0 && (s.type === 'PANTSIR' || s.type === 'S-400' || s.type === 'BUNKER'));

    if (friendlySurface.length > 0) {
      const nearest = friendlySurface.reduce((min, s) => {
        const d = Math.hypot(s.x - unit.x, s.y - unit.y);
        return d < min.d ? { s, d } : min;
      }, { s: friendlySurface[0], d: 999 }).s;
      return Math.atan2(nearest.y - unit.y, nearest.x - unit.x);
    }
    return Math.atan2((mapH / 2) - unit.y, (mapW - 10) - unit.x);
  }
}

window.AIPlanningSystem = AIPlanningSystem;