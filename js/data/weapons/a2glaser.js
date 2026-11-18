/**
 * js/data/weapons/a2glaser.js - Semi-active laser-guided and dual-mode precision tactical bombs.
 */

window.WEAPONS_A2G_LASER = {
  'KAB-250L': {
    id: 'KAB-250L',
    name: 'KAB-250L Internal Laser Bomb (6x)',
    slots: 1, slotType: 'INTERNAL', minRating: 'Type S', mass: 1500, cost: 0.5,
    rangeKm: 18.0, speedMach: 0.84, seeker: 'LASER', rcs: 0.012,
    trait: 'LASER_GUIDED_BOMB', traitBadge: '1-SLOT COMPACT LGB',
    behaviorDesc: 'Slim 250kg laser-guided bomb (6x, 3.5 HP). Fits inside single-slot light bays on A-29B, MQ-20, and stealth platforms.',
    damage: 3.5, ammoCount: 6, minRangeKm: 1.8, sweetSpotMin: 4.5, sweetSpotMax: 15.0,
    lambda: 0.10, p: 1.0, T_0: 0.89,
    sigmaPylon: 0.06, category: 'A2G', a2gGroup: 'LASER_BOMBS',
    desc: 'Compact 1-slot 250kg laser-guided bombs (6x) engineered for internal stealth carriage and light attack wings.'
  },
  'GBU-12': {
    id: 'GBU-12',
    name: 'GBU-12 Paveway II 500lb (6x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type S', mass: 1650, cost: 0.6,
    rangeKm: 20.0, speedMach: 0.84, seeker: 'LASER', rcs: 0.015,
    trait: 'LASER_GUIDED_BOMB', traitBadge: 'LASER PRECISION 500LB',
    behaviorDesc: 'Compact 500lb laser-guided bomb (6x, 4 HP). High precision in clear air (+Targeting Pod synergy); weather clouds degrade laser tracking.',
    damage: 4, ammoCount: 6, minRangeKm: 2.0, sweetSpotMin: 5.0, sweetSpotMax: 17.0,
    lambda: 0.10, p: 1.0, T_0: 0.90,
    sigmaPylon: 0.10, category: 'A2G', a2gGroup: 'LASER_BOMBS',
    desc: 'Compact 500lb Paveway II laser-guided bombs (6x). Economical precision strike munition for Type S and internal bays.'
  },
  'KAB-500L': {
    id: 'KAB-500L',
    name: 'KAB-500L Laser Bomb (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 2100, cost: 0.6,
    rangeKm: 19.0, speedMach: 0.85, seeker: 'LASER', rcs: 0.03,
    trait: 'LASER_GUIDED_BOMB', traitBadge: '500KG LASER GUIDED',
    behaviorDesc: 'Semi-active laser-homing 500kg bomb (4x, 5 HP). Economical $0.6M precision strike against armored SAMs and depots.',
    damage: 5, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 5.0, sweetSpotMax: 16.0,
    lambda: 0.10, p: 1.0, T_0: 0.90,
    sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'LASER_BOMBS',
    desc: '500kg semi-active laser-guided precision bomb (4x, $0.6M) for tactical strike aircraft.'
  },
  'PAVEWAY-IV': {
    id: 'PAVEWAY-IV',
    name: 'Paveway IV Dual-Mode 500lb (4x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type S', mass: 920, cost: 0.8,
    rangeKm: 26.0, speedMach: 0.86, seeker: 'GPS_INS', rcs: 0.01,
    trait: 'DUAL_GPS_LASER', traitBadge: '26KM LIGHT ALL-WEATHER',
    behaviorDesc: 'Lightweight Type S dual GPS/INS and laser 500lb bomb (4x, 4.5 HP, 26 km). Retains precision through heavy cloud decks.',
    damage: 4.5, ammoCount: 4, minRangeKm: 2.2, sweetSpotMin: 6.0, sweetSpotMax: 22.0,
    lambda: 0.08, p: 1.0, T_0: 0.91, armorPiercing: 0.75,
    sigmaPylon: 0.08, category: 'A2G', a2gGroup: 'LASER_BOMBS',
    desc: 'Light Type S all-weather dual-mode GPS and laser bomb (4x, 26 km) immune to cloud laser scattering.'
  },
  'GBU-16': {
    id: 'GBU-16',
    name: 'GBU-16 Paveway II 1000lb (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 1820, cost: 1.0,
    rangeKm: 22.0, speedMach: 0.85, seeker: 'LASER', rcs: 0.03,
    trait: 'LASER_GUIDED_BOMB', traitBadge: '1000LB LASER PRECISION',
    behaviorDesc: 'Medium 1,000lb laser-guided bomb (4x, 6.5 HP = 26 HP total). Strong blast yield against hardened shelters and SAM batteries.',
    damage: 6.5, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 5.5, sweetSpotMax: 18.5,
    lambda: 0.10, p: 1.0, T_0: 0.90, armorPiercing: 0.70,
    sigmaPylon: 0.16, category: 'A2G', a2gGroup: 'LASER_BOMBS',
    desc: '1,000lb laser-guided precision bombs (4x, 6.5 HP) offering strong yield-to-weight balance.'
  },
  'GBU-54': {
    id: 'GBU-54',
    name: 'GBU-54 Laser JDAM (4x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type M', mass: 1020, cost: 1.1,
    rangeKm: 30.0, speedMach: 0.86, seeker: 'GPS_INS', rcs: 0.015,
    trait: 'DUAL_GPS_LASER', traitBadge: '30KM 6HP LASER JDAM',
    behaviorDesc: 'Heavy-warhead Laser JDAM (4x, 6.0 HP, 30 km, Type M). Harder punch and longer reach than Paveway IV while cutting cleanly through overcast.',
    damage: 6.0, ammoCount: 4, minRangeKm: 2.5, sweetSpotMin: 6.5, sweetSpotMax: 26.0,
    lambda: 0.08, p: 1.0, T_0: 0.93, armorPiercing: 0.75,
    sigmaPylon: 0.09, category: 'A2G', a2gGroup: 'LASER_BOMBS',
    desc: 'Dual-mode Laser JDAM precision bombs (4x, 30 km, 6 HP) for internal stealth bays and tactical interdictors.'
  },
  'GBU-10': {
    id: 'GBU-10',
    name: 'GBU-10 Paveway II 2000lb (2x)',
    slots: 3, slotType: 'EXTERNAL', minRating: 'Type H', mass: 1900, cost: 1.2,
    rangeKm: 24.0, speedMach: 0.86, seeker: 'LASER', rcs: 0.04,
    trait: 'LASER_PENETRATOR', traitBadge: '2000LB LASER PENETRATOR',
    behaviorDesc: 'Heavy 2,000lb laser-guided penetrator (2x, 10 HP). Penetrates reinforced runways and armored shelters when laser-designated.',
    damage: 10, ammoCount: 2, minRangeKm: 2.5, sweetSpotMin: 6.0, sweetSpotMax: 20.5,
    lambda: 0.08, p: 1.0, T_0: 0.90, isBunkerCracker: true,
    sigmaPylon: 0.22, category: 'A2G', a2gGroup: 'LASER_BOMBS',
    desc: 'Heavy 2,000lb laser-guided penetrator bombs (2x, 10 HP) for destroying runways and fortified shelters.'
  }
};
