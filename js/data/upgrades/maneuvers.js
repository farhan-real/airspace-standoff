/**
 * AIRSPACE STANDOFF: Combat Maneuver Cards
 * Aggregates core defensive break turns and high-G advanced maneuvers.
 */

window.CORE_MANEUVER_CARDS = [
  {
    id: 'DOPPLER_NOTCH',
    name: 'Doppler Notch & Chaff',
    badge: 'RADAR BREAK',
    whenToUse: 'TRIGGER: Active radar (ARH) lock',
    whyToUse: 'BENEFIT: Beams threat 90 degrees, cuts radial closure & deploys chaff (8s)',
    evasionBonus: 0.48,
    cost: 0.7,
    isRecommended: function(unit, game) {
      if (!unit || !game.missiles) return false;
      return game.missiles.some(function(m) {
        return m.active && m.target && m.target.id === unit.id && m.weapon && (m.weapon.seeker === 'ARH' || m.weapon.seeker === 'PASSIVE_RADAR');
      });
    },
    checkPrereq: function(unit) {
      return unit && unit.speed >= 0.30 && unit.glocTimer <= 0;
    },
    execute: function(unit) {
      const game = window.Game;
      unit.isNotching = true;
      unit.activeManeuverId = 'DOPPLER_NOTCH';
      unit.activeManeuverTimer = 8.0;

      let bonus = 0.48;
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

      let threatHeading = null;
      if (game && game.missiles) {
        const inbounds = game.missiles.filter(m => m.active && m.target && m.target.id === unit.id);
        if (inbounds.length > 0) {
          const nearest = inbounds.reduce((min, m) => m.distanceToTarget < min.distanceToTarget ? m : min, inbounds[0]);
          threatHeading = nearest.heading;
        }
      }
      if (threatHeading === null && unit.radarLockedTarget) {
        threatHeading = Math.atan2(unit.radarLockedTarget.y - unit.y, unit.radarLockedTarget.x - unit.x);
      }
      if (threatHeading !== null) {
        unit.heading = (threatHeading + Math.PI / 2) % (Math.PI * 2);
        if (unit.heading < 0) unit.heading += Math.PI * 2;
      }

      unit.deployCountermeasures();
      if (game && game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `DOPPLER NOTCH (+${Math.round(bonus * 100)}% EVASION)`, '#38bdf8');
        game.radar.spawnShockwave(unit.x, unit.y, '#38bdf8', 34);
      }
    }
  },
  {
    id: 'BARREL_ROLL',
    name: 'High-G Barrel Roll',
    badge: 'KINETIC DODGE',
    whenToUse: 'TRIGGER: Inbound missile < 25km',
    whyToUse: 'BENEFIT: Spiral displacement disrupts proportional lead pursuit (7s)',
    evasionBonus: 0.45,
    cost: 0.7,
    isRecommended: function(unit, game) {
      if (!unit || !game.missiles) return false;
      return game.missiles.some(function(m) {
        return m.active && m.target && m.target.id === unit.id && m.distanceToTarget < 25.0;
      });
    },
    checkPrereq: function(unit) {
      return unit && unit.alt >= 0.10 && unit.glocTimer <= 0;
    },
    execute: function(unit) {
      const game = window.Game;
      unit.isNotching = false;
      unit.activeManeuverId = 'BARREL_ROLL';
      unit.activeManeuverTimer = 7.0;

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

      unit.heading = (unit.heading + (Math.random() < 0.5 ? 0.75 : -0.75)) % (Math.PI * 2);
      if (unit.heading < 0) unit.heading += Math.PI * 2;

      unit.applyActionStress(0.16);
      if (game && game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `BARREL ROLL (+${Math.round(bonus * 100)}% EVASION)`, '#38bdf8');
        game.radar.spawnShockwave(unit.x, unit.y, '#38bdf8', 30);
      }
    }
  },
  {
    id: 'PUSH_COBRA',
    name: "Pugachev's Cobra",
    badge: 'SUPER-MANEUVER',
    whenToUse: 'TRIGGER: Hostile on tail < 15km',
    whyToUse: 'BENEFIT: High-alpha aerodynamic brake creates closure-rate mismatch (6s)',
    evasionBonus: 0.55,
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
      const game = window.Game;
      unit.isNotching = false;
      unit.activeManeuverId = 'PUSH_COBRA';
      unit.activeManeuverTimer = 6.0;

      let bonus = 0.55;
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
      if (unit.isCoffin) bonus += 0.12;
      unit.activeManeuverBonus = bonus;

      unit.speed = Math.max(0.24, unit.speed * 0.55);

      unit.applyActionStress(0.25);
      if (game && game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `COBRA (+${Math.round(bonus * 100)}% EVASION)`, '#a855f7');
        game.radar.spawnShockwave(unit.x, unit.y, '#a855f7', 38);
      }
    }
  }
];

window.MANEUVER_CARDS = [
  ...window.CORE_MANEUVER_CARDS,
  ...(window.ADVANCED_MANEUVER_CARDS || [])
];