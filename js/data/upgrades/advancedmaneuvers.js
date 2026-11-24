/**
 * AIRSPACE STANDOFF: Advanced Combat Maneuver Cards
 * High-altitude split-S dives, emergency countermeasure clouds, and energy zoom climbs.
 */

window.ADVANCED_MANEUVER_CARDS = [
  {
    id: 'SPLIT_S',
    name: 'Split-S Dive',
    badge: 'DIVE ESCAPE',
    whenToUse: 'TRIGGER: High-altitude missile volley',
    whyToUse: 'BENEFIT: Invert 180 degrees, dive to break line-of-sight & regain speed (8.5s)',
    evasionBonus: 0.52,
    cost: 0.7,
    isRecommended: function(unit, game) {
      if (!unit || unit.alt < 0.22 || !game.missiles) return false;
      return game.missiles.filter(function(m) {
        return m.active && m.target && m.target.id === unit.id;
      }).length >= 2;
    },
    checkPrereq: function(unit) {
      return unit && unit.alt >= 0.18 && unit.glocTimer <= 0;
    },
    execute: function(unit) {
      const game = window.Game;
      unit.isNotching = false;
      unit.activeManeuverId = 'SPLIT_S';
      unit.dive();
      unit.heading = (unit.heading + Math.PI) % (Math.PI * 2);
      unit.activeManeuverTimer = 8.5;

      let bonus = 0.52;
      const agi = unit.getEffectiveAgility();
      bonus *= Math.max(0.55, Math.min(1.55, agi / 0.85));

      const sOpt = unit.getOptimalCornerSpeed();
      const turnOptEff = unit.isCoffin ? 1.0 : Physics.calcTurnEfficiency(unit.speed, sOpt);
      bonus *= Math.max(0.62, Math.min(1.25, 0.62 + 0.38 * turnOptEff));

      if (unit.stress >= 0.65) bonus *= 0.75;
      if (unit.isCoffin) bonus += 0.10;
      unit.activeManeuverBonus = bonus;

      if (game && game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `SPLIT-S DIVE (+${Math.round(bonus * 100)}% EVASION)`, '#10b981');
        game.radar.spawnShockwave(unit.x, unit.y, '#10b981', 32);
      }
    }
  },
  {
    id: 'EMERGENCY_CM',
    name: 'Emergency Chaff Salvo',
    badge: 'CHAFF SCREEN',
    whenToUse: 'TRIGGER: Active radar missile lock',
    whyToUse: 'BENEFIT: Dense chaff corridor disrupts radar tracking (9s)',
    evasionBonus: 0.50,
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
      const game = window.Game;
      unit.isNotching = false;
      unit.activeManeuverId = 'EMERGENCY_CM';
      unit.deployCountermeasures();
      unit.cmTimer = 9.0;
      unit.activeManeuverTimer = 9.0;

      let bonus = 0.50;
      const agi = unit.getEffectiveAgility();
      bonus *= Math.max(0.60, Math.min(1.40, agi / 0.85));

      const sOpt = unit.getOptimalCornerSpeed();
      const turnOptEff = unit.isCoffin ? 1.0 : Physics.calcTurnEfficiency(unit.speed, sOpt);
      bonus *= Math.max(0.62, Math.min(1.25, 0.62 + 0.38 * turnOptEff));
      unit.activeManeuverBonus = bonus;

      if (game && game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `CHAFF SALVO (+${Math.round(bonus * 100)}% EVASION)`, '#f59e0b');
        game.radar.spawnShockwave(unit.x, unit.y, '#f59e0b', 30);
      }
    }
  },
  {
    id: 'ZOOM_CLIMB',
    name: 'Zoom Climb',
    badge: 'ENERGY CLIMB',
    whenToUse: 'TRIGGER: Speed > Mach 0.7 in level flight',
    whyToUse: 'BENEFIT: Converts airspeed into +8,500ft altitude gain (9s)',
    evasionBonus: 0.46,
    cost: 0.7,
    isRecommended: function(unit, game) {
      return unit && unit.speed >= 0.70 && unit.alt < 0.45;
    },
    checkPrereq: function(unit) {
      return unit && unit.speed >= 0.65 && unit.glocTimer <= 0;
    },
    execute: function(unit) {
      const game = window.Game;
      unit.isNotching = false;
      unit.activeManeuverId = 'ZOOM_CLIMB';
      unit.zoomClimb();
      unit.activeManeuverTimer = 9.0;

      let bonus = 0.46;
      const agi = unit.getEffectiveAgility();
      bonus *= Math.max(0.55, Math.min(1.50, agi / 0.85));

      const sOpt = unit.getOptimalCornerSpeed();
      const turnOptEff = unit.isCoffin ? 1.0 : Physics.calcTurnEfficiency(unit.speed, sOpt);
      bonus *= Math.max(0.62, Math.min(1.25, 0.62 + 0.38 * turnOptEff));
      unit.activeManeuverBonus = bonus;

      if (game && game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `ZOOM CLIMB (+${Math.round(bonus * 100)}% EVASION)`, '#38bdf8');
      }
    }
  }
];