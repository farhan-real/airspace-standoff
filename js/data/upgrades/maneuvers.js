/**
 * APEX VECTOR // Balanced Tactical Maneuver Cards (Affected by Stress & COFFIN Dodge)
 */

window.MANEUVER_CARDS = [
  {
    id: 'DOPPLER_NOTCH',
    name: 'Doppler Notch & Chaff',
    badge: 'RADAR BREAK',
    whenToUse: 'TRIGGER: Active Radar (ARH) lock detected',
    whyToUse: 'BENEFIT: Beams radar 90 degrees, cuts closure rate & pops chaff',
    evasionBonus: 0.30,
    cost: 0.7,
    isRecommended: function(unit, game) {
      if (!unit || !game.missiles) return false;
      return game.missiles.some(function(m) {
        return m.active && m.target && m.target.id === unit.id && m.weapon && m.weapon.seeker === 'ARH';
      });
    },
    checkPrereq: function(unit) {
      return unit && unit.speed >= 0.30 && unit.glocTimer <= 0;
    },
    execute: function(unit) {
      unit.isNotching = true;
      unit.activeManeuverTimer = 3.5;
      let bonus = 0.30;
      if (unit.stress >= 0.65) bonus *= 0.70; // High-stress degradation
      if (unit.isCoffin) bonus += 0.15; // COFFIN extreme maneuver bonus
      unit.activeManeuverBonus = bonus;
      unit.deployCountermeasures();
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnCombatText(unit.x, unit.y, 'NOTCH BEAM (+30% EVASION)', '#38bdf8');
        window.Game.radar.spawnShockwave(unit.x, unit.y, '#38bdf8', 30);
      }
    }
  },
  {
    id: 'BARREL_ROLL',
    name: 'High-G Barrel Roll',
    badge: 'KINETIC DODGE',
    whenToUse: 'TRIGGER: Inbound missile within 25km',
    whyToUse: 'BENEFIT: High-G 3D spiral disrupts missile proportional lead pursuit',
    evasionBonus: 0.25,
    cost: 0.7,
    isRecommended: function(unit, game) {
      if (!unit || !game.missiles) return false;
      return game.missiles.some(function(m) {
        return m.active && m.target && m.target.id === unit.id && m.distanceToTarget < 25.0;
      });
    },
    checkPrereq: function(unit) {
      return unit && unit.alt >= 0.12 && unit.glocTimer <= 0;
    },
    execute: function(unit) {
      unit.activeManeuverTimer = 3.0;
      let bonus = 0.25;
      if (unit.stress >= 0.65) bonus *= 0.70;
      if (unit.isCoffin) bonus += 0.15;
      unit.activeManeuverBonus = bonus;
      unit.speed = Math.max(0.20, unit.speed - 0.10);
      unit.applyActionStress(0.20);
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnCombatText(unit.x, unit.y, 'BARREL ROLL (+25% EVASION)', '#38bdf8');
        window.Game.radar.spawnShockwave(unit.x, unit.y, '#38bdf8', 25);
      }
    }
  },
  {
    id: 'PUSH_COBRA',
    name: 'Pugachev Push Cobra',
    badge: 'SUPER-MANEUVER',
    whenToUse: 'TRIGGER: Tailgater or close launch (<15km)',
    whyToUse: 'BENEFIT: Pitch up to 110 degrees creates immediate closure mismatch',
    evasionBonus: 0.38,
    cost: 0.8,
    isRecommended: function(unit, game) {
      if (!unit || !unit.thrustVector || !game.missiles) return false;
      return game.missiles.some(function(m) {
        return m.active && m.target && m.target.id === unit.id && m.distanceToTarget < 15.0;
      });
    },
    checkPrereq: function(unit) {
      return unit && unit.thrustVector === true && unit.glocTimer <= 0;
    },
    execute: function(unit) {
      unit.activeManeuverTimer = 2.5;
      let bonus = 0.38;
      if (unit.stress >= 0.65) bonus *= 0.70;
      if (unit.isCoffin) bonus += 0.20;
      unit.activeManeuverBonus = bonus;
      unit.speed = Math.max(0.18, unit.speed * 0.45);
      unit.applyActionStress(0.35);
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnCombatText(unit.x, unit.y, 'PUGACHEV COBRA (+38% EVASION)', '#a855f7');
        window.Game.radar.spawnShockwave(unit.x, unit.y, '#a855f7', 35);
      }
    }
  },
  {
    id: 'SPLIT_S',
    name: 'Split-S Kinetic Escape',
    badge: 'DIVE ESCAPE',
    whenToUse: 'TRIGGER: High altitude flight under heavy missile fire',
    whyToUse: 'BENEFIT: Invert and dive to gain Mach speed out of envelope',
    evasionBonus: 0.28,
    cost: 0.7,
    isRecommended: function(unit, game) {
      if (!unit || unit.alt < 0.25 || !game.missiles) return false;
      return game.missiles.filter(function(m) {
        return m.active && m.target && m.target.id === unit.id;
      }).length >= 2;
    },
    checkPrereq: function(unit) {
      return unit && unit.alt >= 0.20 && unit.glocTimer <= 0;
    },
    execute: function(unit) {
      unit.dive();
      unit.heading = (unit.heading + Math.PI) % (Math.PI * 2);
      unit.activeManeuverTimer = 3.0;
      let bonus = 0.28;
      if (unit.stress >= 0.65) bonus *= 0.70;
      if (unit.isCoffin) bonus += 0.15;
      unit.activeManeuverBonus = bonus;
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnCombatText(unit.x, unit.y, 'SPLIT-S DIVE (+28% EVASION)', '#10b981');
        window.Game.radar.spawnShockwave(unit.x, unit.y, '#10b981', 28);
      }
    }
  },
  {
    id: 'EMERGENCY_CM',
    name: 'Emergency Chaff Salvo',
    badge: 'CHAFF DECOY',
    whenToUse: 'TRIGGER: Active missile threat or radar lock tracking',
    whyToUse: 'BENEFIT: High-density chaff cloud disrupts radar tracking and guidance',
    evasionBonus: 0.30,
    cost: 0.7,
    isRecommended: function(unit, game) {
      if (!unit || !game.missiles) return false;
      return game.missiles.some(function(m) {
        return m.active && m.target && m.target.id === unit.id;
      });
    },
    checkPrereq: function(unit) {
      return unit && ((unit.chaff > 0) || (unit.countermeasures > 0) || (unit.chaffFlares > 0));
    },
    execute: function(unit) {
      unit.deployCountermeasures();
      unit.activeManeuverTimer = 3.0;
      unit.activeManeuverBonus = 0.30;
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnCombatText(unit.x, unit.y, 'CHAFF SALVO (+30% EVASION)', '#f59e0b');
        window.Game.radar.spawnShockwave(unit.x, unit.y, '#f59e0b', 25);
      }
    }
  },
  {
    id: 'ZOOM_CLIMB',
    name: 'Zoom Climb to Perch',
    badge: 'ENERGY PERCH',
    whenToUse: 'TRIGGER: Speed above Mach 0.8 in level flight',
    whyToUse: 'BENEFIT: Converts airspeed into high altitude perch',
    evasionBonus: 0.20,
    cost: 0.7,
    isRecommended: function(unit, game) {
      return unit && unit.speed >= 0.80 && unit.alt < 0.45;
    },
    checkPrereq: function(unit) {
      return unit && unit.speed >= 0.70 && unit.glocTimer <= 0;
    },
    execute: function(unit) {
      unit.zoomClimb();
      unit.activeManeuverTimer = 2.5;
      unit.activeManeuverBonus = 0.20;
      if (window.Game && window.Game.radar) {
        window.Game.radar.spawnCombatText(unit.x, unit.y, 'ZOOM PERCH (+20% EVASION)', '#38bdf8');
      }
    }
  }
];
  