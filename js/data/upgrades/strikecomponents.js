/**
 * js/data/upgrades/strikecomponents.js - Dedicated Air-to-Ground, SEAD, and Attack survivability upgrades.
 */

window.STRIKE_UPGRADES_CATALOG = {
  'TFR_TERRAIN_RADAR': {
    id: 'TFR_TERRAIN_RADAR',
    name: 'AN/APQ-174 Terrain-Following Radar',
    cost: 1.6,
    mass: 95,
    category: 'STRIKE',
    desc: 'Low-altitude terrain-hugging radar system. When flying below 10,000 ft (FL100), raises enemy long/medium-range SAM minimum target altitude by +2,500 ft and cuts enemy look-down radar detection range by 25%.',
    apply: function(unit) {
      unit.hasTfrMasking = true;
      unit.tfrFloorBonusFt = 2500;
      unit.lowAltStealthMult = 0.75;
    },
    isAllowed: function(spec) { return spec.id !== 'DARKSTAR' && spec.id !== 'RQ-180'; }
  },
  'CCIP_BALLISTIC_COMP': {
    id: 'CCIP_BALLISTIC_COMP',
    name: 'Digital CCIP / CCRP Strike Computer',
    cost: 1.3,
    mass: 40,
    category: 'STRIKE',
    desc: 'Automated bombing computer (CCIP / CCRP) that calculates exact ground impact points. Boosts unguided iron bombs, cluster bombs, and rocket pods by +16% accuracy and +15% release range.',
    apply: function(unit) {
      unit.ccipBonus = 0.16;
      unit.bombRangeBonus = 1.15;
    },
    isAllowed: function() { return true; }
  },
  'SEAD_HTS_POD': {
    id: 'SEAD_HTS_POD',
    name: 'AN/ASQ-213 HARM Targeting System',
    cost: 1.8,
    mass: 65,
    category: 'SEAD',
    desc: 'SEAD radar-hunting targeting system. Extends Anti-Radiation Missile (ARM) range by +20%, adds +14% ARM accuracy, and detects and identifies active enemy ground radars out to 130 km.',
    apply: function(unit) {
      unit.hasHtsPod = true;
      unit.hasESM = true;
      unit.armRangeMult = 1.20;
      unit.armPkBonus = 0.14;
    },
    isAllowed: function() { return true; }
  },
  'HEAVY_PYLON_FAIRINGS': {
    id: 'HEAVY_PYLON_FAIRINGS',
    name: 'Low-Drag Conformal Ordnance Fairings',
    cost: 1.4,
    mass: 90,
    category: 'STRIKE',
    desc: 'Streamlined aerodynamic covers for external weapon racks. Cuts external weapon air-drag speed penalties by 40% and reduces heavy payload weight penalties by 20%.',
    apply: function(unit) {
      unit.pylonDragRelief = 0.40;
    },
    isAllowed: function() { return true; }
  },
  'KEVLAR_BELLY_ARMOR': {
    id: 'KEVLAR_BELLY_ARMOR',
    name: 'Titanium-Kevlar Belly Flak Shielding',
    cost: 1.5,
    mass: 320,
    category: 'ARMOR',
    desc: 'Armored titanium-kevlar belly plating. Adds +1 Max HP and reduces damage from enemy AAA flak and CIWS guns by 45% during low-altitude attack runs.',
    apply: function(unit) {
      unit.maxHp = (unit.maxHp || 4) + 1;
      unit.hp = Math.min(unit.maxHp, (unit.hp || 4) + 1);
      unit.aaaResistance = 0.45;
    },
    isAllowed: function(spec) { return !spec.isDrone; }
  },
  'INTERNAL_LASER_SPOT': {
    id: 'INTERNAL_LASER_SPOT',
    name: 'Integrated Gimbaled Laser Designator',
    cost: 1.6,
    mass: 55,
    category: 'STRIKE',
    desc: 'Built-in thermal camera and laser targeter that saves an external weapon pylon. Adds +15% air-to-ground accuracy and cuts cloud laser scattering penalties by 35%.',
    apply: function(unit) {
      unit.targetingPodBonus = Math.max(unit.targetingPodBonus || 0, 0.15);
      unit.cloudMitigation = Math.max(unit.cloudMitigation || 0, 0.35);
    },
    isAllowed: function() { return true; }
  },
  'MITL_DATALINK_TRANSCEIVER': {
    id: 'MITL_DATALINK_TRANSCEIVER',
    name: 'Two-Way Standoff Weapons Datalink',
    cost: 1.5,
    mass: 35,
    category: 'DATALINK',
    desc: 'Two-way guidance radio link to steer launched weapons in flight. Adds +14% accuracy to GPS/INS glide bombs, cruise missiles, and optical standoff weapons while cutting jamming interference by 50%.',
    apply: function(unit) {
      unit.mitlBonus = 0.14;
      unit.eccmBonus = Math.max(unit.eccmBonus || 0, 0.50);
    },
    isAllowed: function() { return true; }
  },
  'DIRCM_IR_TURRET': {
    id: 'DIRCM_IR_TURRET',
    name: 'DIRCM Infrared Jammer Turret',
    cost: 1.7,
    mass: 75,
    category: 'STEALTH',
    desc: 'Laser turret that blinds incoming heat-seeking missiles. Grants +24% evasion against passive IR SAMs (SHORAD) and heat-seeking A2A missiles, plus +2 countermeasures.',
    apply: function(unit) {
      unit.dircmEvasion = 0.24;
      unit.chaff = (unit.chaff || 4) + 2;
      unit.countermeasures = (unit.countermeasures || 4) + 2;
      unit.chaffFlares = (unit.chaffFlares || 4) + 2;
    },
    isAllowed: function() { return true; }
  }
};
