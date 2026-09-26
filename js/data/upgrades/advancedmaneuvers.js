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
    whyToUse: 'BENEFIT: Invert 180 degrees, dive to break line-of-sight & regain speed (7.5s)',
    evasionBonus: 0.45,
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
      unit.activeManeuverTimer = 7.5;

      let bonus = 0.45;
      const agi = (typeof unit.getEffectiveAgility === 'function')
        ? unit.getEffectiveAgility()
        : ((unit.spec && unit.spec.AGI_0) ? unit.spec.AGI_0 : 0.85);
      bonus *= Math.max(0.40, Math.min(1.60, agi / 0.85));

      const sOpt = (typeof unit.getOptimalCornerSpeed === 'function')
        ? unit.getOptimalCornerSpeed()
        : ((unit.effectiveMaxSpeed || 0.95) * 0.65);
      const turnOptEff = unit.isCoffin
        ? 1.0
        : (typeof Physics !== 'undefined' ? Physics.calcTurnEfficiency(unit.speed || 0.8, sOpt) : 0.85);
      bonus *= Math.max(0.50, Math.min(1.25, 0.50 + 0.50 * turnOptEff));

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
    whyToUse: 'BENEFIT: Dense chaff corridor disrupts radar tracking (8s)',
    evasionBonus: 0.42,
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
      unit.cmTimer = 8.0;
      unit.activeManeuverTimer = 8.0;

      let bonus = 0.42;
      const agi = (typeof unit.getEffectiveAgility === 'function')
        ? unit.getEffectiveAgility()
        : ((unit.spec && unit.spec.AGI_0) ? unit.spec.AGI_0 : 0.85);
      bonus *= Math.max(0.50, Math.min(1.40, agi / 0.85));

      const sOpt = (typeof unit.getOptimalCornerSpeed === 'function')
        ? unit.getOptimalCornerSpeed()
        : ((unit.effectiveMaxSpeed || 0.95) * 0.65);
      const turnOptEff = unit.isCoffin
        ? 1.0
        : (typeof Physics !== 'undefined' ? Physics.calcTurnEfficiency(unit.speed || 0.8, sOpt) : 0.85);
      bonus *= Math.max(0.50, Math.min(1.25, 0.50 + 0.50 * turnOptEff));
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
    whyToUse: 'BENEFIT: Converts airspeed into +8,500ft altitude gain (8s)',
    evasionBonus: 0.38,
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
      unit.activeManeuverTimer = 8.0;

      let bonus = 0.38;
      const agi = (typeof unit.getEffectiveAgility === 'function')
        ? unit.getEffectiveAgility()
        : ((unit.spec && unit.spec.AGI_0) ? unit.spec.AGI_0 : 0.85);
      bonus *= Math.max(0.40, Math.min(1.50, agi / 0.85));

      const sOpt = (typeof unit.getOptimalCornerSpeed === 'function')
        ? unit.getOptimalCornerSpeed()
        : ((unit.effectiveMaxSpeed || 0.95) * 0.65);
      const turnOptEff = unit.isCoffin
        ? 1.0
        : (typeof Physics !== 'undefined' ? Physics.calcTurnEfficiency(unit.speed || 0.8, sOpt) : 0.85);
      bonus *= Math.max(0.50, Math.min(1.25, 0.50 + 0.50 * turnOptEff));
      unit.activeManeuverBonus = bonus;

      if (game && game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `ZOOM CLIMB (+${Math.round(bonus * 100)}% EVASION)`, '#38bdf8');
      }
    }
  }
];