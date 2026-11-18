/**
 * js/data/weapons/a2gglide.js - Precision GPS/INS bombs, winged glide kits, and small diameter bombs.
 */

window.WEAPONS_A2G_GLIDE = {
  'UMP-K': {
    id: 'UMP-K',
    name: 'FAB-500 UMPK Glide Kit (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 2100, cost: 0.6,
    rangeKm: 52.0, speedMach: 0.78, seeker: 'GPS_INS', rcs: 0.02,
    trait: 'BUDGET_GLIDE_BOMB', traitBadge: '52KM WINGED GLIDE',
    behaviorDesc: 'Pop-out wing kit strapped to 500kg bombs (4x, 52 km). Economical all-weather standoff, though subsonic profile is interceptable by CIWS.',
    damage: 4, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 14.0, sweetSpotMax: 46.0,
    lambda: 0.12, p: 1.0, T_0: 0.80,
    sigmaPylon: 0.16, category: 'A2G', a2gGroup: 'GLIDE_SDB',
    desc: 'Low-cost winged glide bomb conversions (4x, 52 km) enabling standoff drops beyond short-range SHORAD rings.'
  },
  'GBU-38': {
    id: 'GBU-38',
    name: 'GBU-38 JDAM 500lb (4x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type S', mass: 960, cost: 0.7,
    rangeKm: 28.0, speedMach: 0.84, seeker: 'GPS_INS', rcs: 0.015,
    trait: 'ALL_WEATHER_JDAM', traitBadge: 'ALL-WEATHER JDAM',
    behaviorDesc: 'Compact 500lb GPS/INS precision bomb (4x, 28 km). Penetrates heavy overcast clouds with zero weather scattering.',
    damage: 4, ammoCount: 4, minRangeKm: 2.5, sweetSpotMin: 6.0, sweetSpotMax: 24.0,
    lambda: 0.10, p: 1.0, T_0: 0.86,
    sigmaPylon: 0.08, category: 'A2G', a2gGroup: 'GLIDE_SDB',
    desc: 'Compact all-weather 500lb precision JDAM (4x). Fits internal stealth bays and Type S light wing stations.'
  },
  'GBU-32': {
    id: 'GBU-32',
    name: 'GBU-32 JDAM 1000lb (4x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type M', mass: 1860, cost: 0.9,
    rangeKm: 30.0, speedMach: 0.85, seeker: 'GPS_INS', rcs: 0.018,
    trait: 'ALL_WEATHER_JDAM', traitBadge: '1000LB ALL-WEATHER JDAM',
    behaviorDesc: 'Medium 1,000lb satellite-guided JDAM (4x, 6.5 HP, 30 km). Reliable all-weather demolition against armored SAMs, hangars, and fuel depots.',
    damage: 6.5, ammoCount: 4, minRangeKm: 2.8, sweetSpotMin: 6.5, sweetSpotMax: 26.0,
    lambda: 0.09, p: 1.0, T_0: 0.88, armorPiercing: 0.75,
    sigmaPylon: 0.12, category: 'A2G', a2gGroup: 'GLIDE_SDB',
    desc: 'Medium 1,000lb GPS/INS JDAM bombs (4x, 30 km) sized for stealth bomber bays and Type M hardpoints.'
  },
  'KAB-500S': {
    id: 'KAB-500S',
    name: 'KAB-500S GLONASS Bomb (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 2000, cost: 0.8,
    rangeKm: 26.0, speedMach: 0.84, seeker: 'GPS_INS', rcs: 0.03,
    trait: 'ALL_WEATHER_PRECISION', traitBadge: '500KG SATELLITE PRECISION',
    behaviorDesc: 'Satellite-guided 500kg high-explosive bomb (4x, 5 HP). Reliable all-weather punch against armored SAM sites and bridges.',
    damage: 5, ammoCount: 4, minRangeKm: 2.5, sweetSpotMin: 6.0, sweetSpotMax: 22.0,
    lambda: 0.10, p: 1.0, T_0: 0.86,
    sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'GLIDE_SDB',
    desc: 'Heavy 500kg satellite-guided bomb (4x) delivering reliable all-weather tactical strikes.'
  },
  'GBU-39': {
    id: 'GBU-39',
    name: 'GBU-39 SDB (8x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type M', mass: 1420, cost: 0.9,
    rangeKm: 55.0, speedMach: 0.80, seeker: 'GPS_INS', rcs: 0.005,
    trait: 'GLIDE_SATURATION', traitBadge: 'STANDOFF DISPERSAL',
    behaviorDesc: 'Gliding wing dispensers release 8 GPS penetrators simultaneously for standoff facility saturation at subsonic glide velocity (Mach 0.80).',
    damage: 3, ammoCount: 8, minRangeKm: 4.0, sweetSpotMin: 10.0, sweetSpotMax: 48.0,
    lambda: 0.10, p: 1.0, T_0: 0.85, isBunkerCracker: true,
    sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'GLIDE_SDB',
    desc: 'Precision stand-off glide bomb dispenser (8x, Mach 0.80). Designed for internal stealth bays and external multi-rack pylons.'
  },
  'SPEAR-3': {
    id: 'SPEAR-3',
    name: 'SPEAR-3 Mini-Cruise Glide (4x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type S', mass: 420, cost: 1.4,
    rangeKm: 62.0, speedMach: 0.90, seeker: 'MMW_IIR', rcs: 0.002, isStealthMissile: true,
    trait: 'POWERED_MINI_CRUISE', traitBadge: '62KM INTERNAL TURBOJET',
    behaviorDesc: 'Turbojet-powered compact glide missile (4x, 4.5 HP, 62 km). Fits inside Type S stealth bays and tracks mobile SAMs through thick clouds.',
    damage: 4.5, ammoCount: 4, minRangeKm: 4.0, sweetSpotMin: 10.0, sweetSpotMax: 56.0,
    lambda: 0.07, p: 1.0, T_0: 0.90, armorPiercing: 0.85,
    sigmaPylon: 0.06, category: 'A2G', a2gGroup: 'GLIDE_SDB',
    desc: 'Compact powered mini-cruise glide missiles (4x, 62 km) designed for internal carriage on stealth strikers and UCAVs.'
  },
  'GBU-53': {
    id: 'GBU-53',
    name: 'GBU-53 StormBreaker SDB-II (8x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type M', mass: 1150, cost: 1.5,
    rangeKm: 68.0, speedMach: 0.85, seeker: 'MMW_IIR', rcs: 0.003, isStealthMissile: true,
    trait: 'TRI_MODE_SDB', traitBadge: 'TRI-MODE 68KM SDB-II',
    behaviorDesc: 'Tri-mode MMW radar, IIR, and laser seeker SDB (8x, 68 km). Penetrates ground jamming and smoke to track mobile SAMs and radar vans.',
    damage: 4, ammoCount: 8, minRangeKm: 4.0, sweetSpotMin: 12.0, sweetSpotMax: 60.0,
    lambda: 0.08, p: 1.0, T_0: 0.90, isBunkerCracker: true,
    sigmaPylon: 0.10, category: 'A2G', a2gGroup: 'GLIDE_SDB',
    desc: 'Advanced tri-mode Small Diameter Bomb II (8x, 68 km) resistant to ground jamming and cloud cover.'
  },
  'GBU-31': {
    id: 'GBU-31',
    name: 'GBU-31 JDAM Penetrator (2x)',
    slots: 3, slotType: 'INTERNAL', minRating: 'Type H', mass: 1820, cost: 1.1,
    rangeKm: 32.0, speedMach: 0.86, seeker: 'GPS_INS', rcs: 0.02,
    trait: 'HARDENED_BLU109', traitBadge: '2000LB BLU-109 PENETRATOR',
    behaviorDesc: 'Hardened BLU-109 2,000lb steel-cased JDAM (2x, 9 HP). All-weather concrete penetrator for C2 bunkers, runways, and hardened shelters.',
    damage: 9, ammoCount: 2, minRangeKm: 3.0, sweetSpotMin: 7.0, sweetSpotMax: 28.0,
    lambda: 0.08, p: 1.0, T_0: 0.88, isBunkerCracker: true,
    sigmaPylon: 0.18, category: 'A2G', a2gGroup: 'GLIDE_SDB',
    desc: 'Heavy 2,000lb BLU-109 hardened penetrator JDAM (2x). Fits heavy bomber bays and Type H fighter pylons.'
  },
  'AGM-154C': {
    id: 'AGM-154C',
    name: 'AGM-154C JSOW-C BROACH (2x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type M', mass: 980, cost: 1.6,
    rangeKm: 78.0, speedMach: 0.86, seeker: 'IIR', rcs: 0.004, isStealthMissile: true,
    trait: 'BROACH_GLIDE_PENETRATOR', traitBadge: '78KM STEALTH PENETRATOR',
    behaviorDesc: 'Stealthy unpowered glide missile with tandem BROACH bunker-busting warhead (2x, 8 HP). Reaches 78 km cleanly from internal stealth bays.',
    damage: 8, ammoCount: 2, minRangeKm: 6.0, sweetSpotMin: 16.0, sweetSpotMax: 70.0,
    lambda: 0.06, p: 1.0, T_0: 0.90, isBunkerCracker: true,
    sigmaPylon: 0.12, category: 'A2G', a2gGroup: 'GLIDE_SDB',
    desc: 'Internal-bay stealth BROACH penetrator glide weapon (2x, 78 km) ideal for F-35A, F-22A, and B-21 bunker strikes.'
  }
};
