/**
 * AIRSPACE STANDOFF: Balanced Tactical Maneuver Cards
 * Physical flight actions with maneuver evasion scaling directly with aircraft agility.
 */

window.MANEUVER_CARDS = [
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
    whyToUse: 'BENEFIT: 3D spiral displacement disrupts proportional lead pursuit (7s)',
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
      unit.activeManeuverId = 'BARREL_ROLL';
      unit.activeManeuverTimer = 7.0;

      let bonus = 0.45;
      const agi = (typeof unit.getEffectiveAgility === 'function')
        ? unit.getEffectiveAgility()
        : ((unit.spec && unit.spec.AGI_0) ? unit.spec.AGI_0 : 0.85);
      bonus *= Math.max(0.40, Math.min(1.60, agi / 0.85));

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
    name: 'Pugachev Push Cobra',
    badge: 'SUPER-MANEUVER',
    whenToUse: 'TRIGGER: Tailgater < 15km',
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
      unit.activeManeuverId = 'PUSH_COBRA';
      unit.activeManeuverTimer = 6.0;

      let bonus = 0.55;
      const agi = (typeof unit.getEffectiveAgility === 'function')
        ? unit.getEffectiveAgility()
        : ((unit.spec && unit.spec.AGI_0) ? unit.spec.AGI_0 : 0.85);
      bonus *= Math.max(0.40, Math.min(1.60, agi / 0.85));

      if (unit.stress >= 0.65) bonus *= 0.75;
      if (unit.isCoffin) bonus += 0.12;
      unit.activeManeuverBonus = bonus;

      unit.speed = Math.max(0.24, unit.speed * 0.55);

      unit.applyActionStress(0.25);
      if (game && game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `PUGACHEV COBRA (+${Math.round(bonus * 100)}% EVASION)`, '#a855f7');
        game.radar.spawnShockwave(unit.x, unit.y, '#a855f7', 38);
      }
    }
  },
  {
    id: 'SPLIT_S',
    name: 'Split-S Kinetic Escape',
    badge: 'DIVE ESCAPE',
    whenToUse: 'TRIGGER: High-altitude volley',
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
      unit.activeManeuverId = 'SPLIT_S';
      unit.dive();
      unit.heading = (unit.heading + Math.PI) % (Math.PI * 2);
      unit.activeManeuverTimer = 7.5;

      let bonus = 0.45;
      const agi = (typeof unit.getEffectiveAgility === 'function')
        ? unit.getEffectiveAgility()
        : ((unit.spec && unit.spec.AGI_0) ? unit.spec.AGI_0 : 0.85);
      bonus *= Math.max(0.40, Math.min(1.60, agi / 0.85));

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
    badge: 'CHAFF DECOY',
    whenToUse: 'TRIGGER: Active missile lock',
    whyToUse: 'BENEFIT: Dense chaff corridor disrupts radar tracking & active seekers (8s)',
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
      unit.activeManeuverId = 'EMERGENCY_CM';
      unit.deployCountermeasures();
      unit.cmTimer = 8.0;
      unit.activeManeuverTimer = 8.0;

      let bonus = 0.42;
      const agi = (typeof unit.getEffectiveAgility === 'function')
        ? unit.getEffectiveAgility()
        : ((unit.spec && unit.spec.AGI_0) ? unit.spec.AGI_0 : 0.85);
      bonus *= Math.max(0.50, Math.min(1.40, agi / 0.85));
      unit.activeManeuverBonus = bonus;

      if (game && game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `CHAFF SALVO (+${Math.round(bonus * 100)}% EVASION)`, '#f59e0b');
        game.radar.spawnShockwave(unit.x, unit.y, '#f59e0b', 30);
      }
    }
  },
  {
    id: 'ZOOM_CLIMB',
    name: 'Zoom Climb to Perch',
    badge: 'ENERGY PERCH',
    whenToUse: 'TRIGGER: Speed > Mach 0.7 in level flight',
    whyToUse: 'BENEFIT: Converts airspeed into +8,500ft perch; starves inbounds of energy (8s)',
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
      unit.activeManeuverId = 'ZOOM_CLIMB';
      unit.zoomClimb();
      unit.activeManeuverTimer = 8.0;

      let bonus = 0.38;
      const agi = (typeof unit.getEffectiveAgility === 'function')
        ? unit.getEffectiveAgility()
        : ((unit.spec && unit.spec.AGI_0) ? unit.spec.AGI_0 : 0.85);
      bonus *= Math.max(0.40, Math.min(1.50, agi / 0.85));
      unit.activeManeuverBonus = bonus;

      if (game && game.radar) {
        game.radar.spawnCombatText(unit.x, unit.y, `ZOOM PERCH (+${Math.round(bonus * 100)}% EVASION)`, '#38bdf8');
      }
    }
  }
];