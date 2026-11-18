/**
 * js/data/weapons/a2gbunker.js - Deep hardened bunker penetrators and dedicated anti-runway cratering weapons.
 */

window.WEAPONS_A2G_BUNKER = {
  'BLU-107': {
    id: 'BLU-107',
    name: 'BLU-107 Durandal Anti-Runway (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 880, cost: 0.8,
    rangeKm: 13.0, speedMach: 1.15, seeker: 'UNGUIDED', rcs: 0.03,
    trait: 'RUNWAY_CRATERING_BOOSTER', traitBadge: '2x RUNWAY CRATERING',
    behaviorDesc: 'Parachute-braked rocket-boosted anti-runway bomb (4x, 4 HP). Fires a rocket booster downward to punch beneath runway concrete and heave slabs (2.0x vs runways).',
    damage: 4, ammoCount: 4, minRangeKm: 1.2, sweetSpotMin: 2.5, sweetSpotMax: 11.0,
    lambda: 0.24, p: 1.2, T_0: 0.84, isBunkerCracker: true, isAntiRunway: true,
    sigmaPylon: 0.12, category: 'A2G', a2gGroup: 'BUNKER_RUNWAY',
    desc: 'Dedicated rocket-boosted runway-cratering bombs (4x) dealing double structural damage against military runway strips.'
  },
  'BETAB-500SHP': {
    id: 'BETAB-500SHP',
    name: 'BetAB-500ShP Runway Penetrator (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 1520, cost: 0.9,
    rangeKm: 14.0, speedMach: 1.20, seeker: 'UNGUIDED', rcs: 0.04,
    trait: 'RUNWAY_CRATERING_BOOSTER', traitBadge: '2x CONCRETE CRATERING',
    behaviorDesc: 'Low-altitude rocket-accelerated concrete-piercing bomb (4x, 5 HP). Engineered to sever reinforced airbase strips and hardened shelter roofs (2.0x vs runways).',
    damage: 5, ammoCount: 4, minRangeKm: 1.4, sweetSpotMin: 3.0, sweetSpotMax: 12.0,
    lambda: 0.24, p: 1.2, T_0: 0.84, isBunkerCracker: true, isAntiRunway: true,
    sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'BUNKER_RUNWAY',
    desc: 'Rocket-assisted heavy concrete runway penetrator (4x) designed for fast low-level airbase denial passes.'
  },
  'JP233-DISP': {
    id: 'JP233-DISP',
    name: 'JP233 Anti-Runway Dispenser (2x)',
    slots: 3, slotType: 'EXTERNAL', minRating: 'Type H', mass: 4600, cost: 1.5,
    rangeKm: 16.0, speedMach: 0.85, seeker: 'UNGUIDED', rcs: 0.08,
    trait: 'MULTI_SEG_RUNWAY_CRATER', traitBadge: '4.5KM RUNWAY CLUSTER',
    behaviorDesc: 'Heavy runway-denial dispenser releasing 30 SG-357 cratering charges across a 4.5 km strip footprint (2.0x vs runways) plus mine submunitions against taxiing jets.',
    damage: 5, ammoCount: 2, minRangeKm: 1.5, sweetSpotMin: 3.5, sweetSpotMax: 14.0,
    lambda: 0.22, p: 1.2, T_0: 0.86, isBunkerCracker: true, isAntiRunway: true, isCluster: true, clusterRadiusKm: 4.5, clusterDamage: 3.5,
    sigmaPylon: 0.22, category: 'A2G', a2gGroup: 'BUNKER_RUNWAY',
    allowedAirframes: ['Tornado-GR4', 'Tornado-ECR', 'F-111F', 'F-15E', 'F-15EX', 'Su-24M2', 'Su-34', 'B-1B'],
    desc: 'Heavy low-altitude runway cratering cluster dispenser (2x) capable of crippling multiple runway segments in one flyover.'
  },
  'GBU-24': {
    id: 'GBU-24',
    name: 'GBU-24 Paveway III (2x)',
    slots: 3, slotType: 'EXTERNAL', minRating: 'Type H', mass: 2150, cost: 1.3,
    rangeKm: 30.0, speedMach: 0.88, seeker: 'LASER', rcs: 0.04,
    trait: 'LOW_LEVEL_LGB_PENETRATOR', traitBadge: '30KM BLU-109 LGB',
    behaviorDesc: 'Long-range proportional-nav Paveway III laser penetrator (2x, 12 HP, 30 km). Allows low-altitude ingress below LR SAM floors.',
    damage: 12, ammoCount: 2, minRangeKm: 3.0, sweetSpotMin: 7.0, sweetSpotMax: 26.0,
    lambda: 0.06, p: 1.0, T_0: 0.92, isBunkerCracker: true,
    sigmaPylon: 0.24, category: 'A2G', a2gGroup: 'BUNKER_RUNWAY',
    desc: 'Proportional-navigation Paveway III laser bunker penetrator (2x, 30 km) engineered for low-altitude approaches.'
  },
  'KAB-1500L': {
    id: 'KAB-1500L',
    name: 'KAB-1500L-Pr Penetrator (2x)',
    slots: 4, slotType: 'EXTERNAL', minRating: 'Type H', mass: 3100, cost: 1.6,
    rangeKm: 24.0, speedMach: 0.86, seeker: 'LASER', rcs: 0.06,
    trait: 'DEEP_CONCRETE_PENETRATOR', traitBadge: '1500KG CONCRETE PENETRATOR',
    behaviorDesc: 'Hardened 1,500kg laser concrete penetrator (2x, 14 HP). Penetrates 2 meters of reinforced C2 bunker concrete.',
    damage: 14, ammoCount: 2, minRangeKm: 2.5, sweetSpotMin: 6.0, sweetSpotMax: 21.0,
    lambda: 0.08, p: 1.0, T_0: 0.90, isBunkerCracker: true,
    sigmaPylon: 0.28, category: 'A2G', a2gGroup: 'BUNKER_RUNWAY',
    desc: 'Heavy 1,500kg laser-guided concrete bunker penetrator (2x) for fortified C2 command complexes.'
  },
  'GBU-28': {
    id: 'GBU-28',
    name: 'GBU-28/B Paveway III 5000lb (1x)',
    slots: 4, slotType: 'EXTERNAL', minRating: 'Type H', mass: 2270, cost: 1.9,
    rangeKm: 26.0, speedMach: 0.90, seeker: 'LASER', rcs: 0.05,
    trait: 'DEEP_EARTH_PENETRATOR', traitBadge: '5000LB PENETRATOR',
    behaviorDesc: 'Forged hardened-steel 5,000lb deep earth penetrator (1x, 18 HP). Penetrates hardened subterranean C2 bunkers in a single direct hit.',
    damage: 18, ammoCount: 1, minRangeKm: 3.0, sweetSpotMin: 6.5, sweetSpotMax: 22.0,
    lambda: 0.08, p: 1.0, T_0: 0.92, isBunkerCracker: true,
    sigmaPylon: 0.28, category: 'A2G', a2gGroup: 'BUNKER_RUNWAY',
    desc: 'Heavy 5,000lb laser-guided deep bunker penetrator (1x, 18 HP) certified for F-15E, F-111F, and heavy strike platforms.'
  },
  'GBU-57': {
    id: 'GBU-57',
    name: 'GBU-57A/B MOP 30000lb (1x)',
    slots: 6, slotType: 'INTERNAL', minRating: 'Type X', mass: 13600, cost: 3.4,
    rangeKm: 22.0, speedMach: 0.90, seeker: 'GPS_INS', rcs: 0.04,
    trait: 'MASSIVE_ORDNANCE_PENETRATOR', traitBadge: '28 HP DEEP PENETRATOR',
    behaviorDesc: 'Heavy 30,000lb Massive Ordnance Penetrator (1x, 28 HP). Neutralizes fortified subterranean C2 bunkers on impact; heavy mass reduces carrier speed.',
    damage: 28, ammoCount: 1, minRangeKm: 3.0, sweetSpotMin: 6.0, sweetSpotMax: 19.0,
    lambda: 0.08, p: 1.0, T_0: 0.94, isBunkerCracker: true,
    sigmaPylon: 0.35, category: 'A2G', a2gGroup: 'BUNKER_RUNWAY',
    allowedAirframes: ['B-21', 'B-2A', 'B-1B', 'B-52H', 'Tu-160M'],
    desc: 'Heavy 30,000lb deep bunker penetrator (1x, 28 HP) carried exclusively inside strategic heavy bomber bays.'
  },
  'TAURUS': {
    id: 'TAURUS',
    name: 'TAURUS KEPD-350 (2x)',
    slots: 4, slotType: 'EXTERNAL', minRating: 'Type H', mass: 2800, cost: 2.9,
    rangeKm: 115.0, speedMach: 0.90, seeker: 'IIR', rcs: 0.001, isStealthMissile: true,
    trait: 'MEPHISTO_BUNKER_CRUISE', traitBadge: '115KM MEPHISTO PENETRATOR',
    behaviorDesc: 'Low-observable standoff cruise missile with MEPHISTO void-sensing tandem penetrator (2x, 14 HP, 115 km). Neutralizes deep bunkers from outside SAM range.',
    damage: 14, ammoCount: 2, minRangeKm: 10.0, sweetSpotMin: 25.0, sweetSpotMax: 105.0,
    lambda: 0.04, p: 1.0, T_0: 0.92, isBunkerCracker: true,
    sigmaPylon: 0.32, category: 'A2G', a2gGroup: 'BUNKER_RUNWAY',
    desc: 'Standoff stealth penetrator cruise missiles (2x, 115 km) engineered for fortified C2 complexes from standoff range.'
  }
};
