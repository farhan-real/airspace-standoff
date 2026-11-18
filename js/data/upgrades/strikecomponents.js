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
    desc: 'Automated nap-of-the-earth contour system. Raises hostile LR/MR SAM engagement altitude floors by +2,500 ft below FL100 and cuts enemy look-down radar range by 25%.',
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
    desc: 'Continuously Computed Impact Point processor. Boosts unguided iron bombs, cluster dispensers, and rocket pods by +16% accuracy and +15% release range.',
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
    desc: 'Dedicated SEAD emitter geolocation suite. Extends Anti-Radiation Missile range by +20%, adds +14% ARM accuracy, and classifies active ground emitters out to 130 km.',
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
    desc: 'Streamlined external pylon fairings. Cuts external ordnance wave drag penalties by 40% and reduces effective payload weight ratio penalties by 20%.',
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
    desc: 'Reinforced lower-hemisphere strike plating. Grants +1 Max HP and reduces incoming AAA and CIWS gun damage by 45% during low-altitude passes.',
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
    desc: 'Internal FLIR and laser spot designator without occupying an external pylon. Adds +15% A2G accuracy and 35% cloud laser scatter mitigation.',
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
    desc: 'Man-in-the-loop terminal guidance link. Adds +14% accuracy to GPS/INS glide bombs, cruise missiles, and optical standoff munitions while cutting jamming interference by 50%.',
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
    desc: 'Directional infrared laser countermeasure turret protecting strike airframes. Grants +24% evasion against passive IR SHORAD and IIR seekers plus +2 countermeasures.',
    apply: function(unit) {
      unit.dircmEvasion = 0.24;
      unit.chaff = (unit.chaff || 4) + 2;
      unit.countermeasures = (unit.countermeasures || 4) + 2;
      unit.chaffFlares = (unit.chaffFlares || 4) + 2;
    },
    isAllowed: function() { return true; }
  }
};
