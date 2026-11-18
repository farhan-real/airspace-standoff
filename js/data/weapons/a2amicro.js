/**
 * js/data/weapons/a2amicro.js - High-Density Swarm Micro-Missiles and Area-Burst / Special A2A Weapons.
 */

window.WEAPONS_A2A_MICRO = {
  'MAM': {
    id: 'MAM', name: 'MAM Micro-Missiles (8x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 120, cost: 0.4, rangeKm: 20.0, speedMach: 1.8, seeker: 'OPT', rcs: 0.01,
    trait: 'SWARM_RIPPLE', traitBadge: 'SWARM SATURATION',
    behaviorDesc: 'High-density ripple salvos accelerate to Mach 1.8 to bypass point defenses and saturate close-range targets.',
    damage: 1, ammoCount: 8, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 16.0,
    lambda: 0.80, p: 1.0, T_0: 0.70, sigmaPylon: 0.01, category: 'A2A', a2aGroup: 'SWARM_MICRO',
    allowedAirframes: [
      'MQ-99', 'MQ-101', 'XQ-58A', 'Kizilelma', 'S-70', 'MQ-28', 'MQ-20', 'AKINCI', 'RQ-180',
      'JAS-39E', 'JAS-39C', 'F-16V', 'F-16C-B52', 'Tejas-MK2', 'Tejas-MK1A', 'Mirage-2000',
      'JF-17-B3', 'FA-50-B20', 'F-5E-TIGER', 'CFA-44'
    ],
    desc: 'Ultra-lightweight micro-missile (8x, Mach 1.8) designed for UCAV internal weapon bays and lightweight external pylon racks.'
  },
  'PEREGRINE': {
    id: 'PEREGRINE', name: 'AIM-260X Peregrine Micro-BVR (6x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 480, cost: 1.4, rangeKm: 52.0, speedMach: 3.4, seeker: 'ARH', rcs: 0.015,
    trait: 'SWARM_RIPPLE', traitBadge: '6x INTERNAL MINI-BVR',
    behaviorDesc: 'Half-length active-radar BVR missile (6x, 2 HP, 52 km, Mach 3.4). Doubles internal stealth bay capacity for high-volume air-to-air saturation.',
    damage: 2, ammoCount: 6, minRangeKm: 2.0, sweetSpotMin: 8.0, sweetSpotMax: 44.0,
    lambda: 0.44, p: 1.0, T_0: 0.82, sigmaPylon: 0.04, category: 'A2A', a2aGroup: 'SWARM_MICRO',
    desc: 'Compact half-size active-radar BVR missiles (6x, 52 km) expanding internal stealth bay loadout depth.'
  },
  'CUDA-SAC': {
    id: 'CUDA-SAC', name: 'CUDA Hit-to-Kill Micro-BVR (8x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 520, cost: 1.8, rangeKm: 44.0, speedMach: 3.5, seeker: 'ARH', rcs: 0.01,
    trait: 'SWARM_RIPPLE', traitBadge: '8x INTERNAL HIT-TO-KILL',
    behaviorDesc: 'Half-length hit-to-kill internal stealth interceptor (8x, 2 HP, 44 km, Mach 3.5) doubling Raptor and 6th-gen bay missile density.',
    damage: 2, ammoCount: 8, minRangeKm: 1.5, sweetSpotMin: 6.0, sweetSpotMax: 38.0,
    lambda: 0.40, p: 1.0, T_0: 0.84, isHitToKill: true, sigmaPylon: 0.03, category: 'A2A', a2aGroup: 'SWARM_MICRO',
    desc: '8-round half-length hit-to-kill active radar missiles (44 km) maximizing internal stealth bay magazine depth.'
  },
  'SADM-8': {
    id: 'SADM-8', name: 'SADM-8 Mini Active Radar (8x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 310, cost: 1.5, rangeKm: 34.0, speedMach: 3.2, seeker: 'ARH', rcs: 0.012,
    trait: 'SWARM_RIPPLE', traitBadge: '1-SLOT 8x MINI-ARH',
    behaviorDesc: 'Compact 1-slot 8-round active radar drone-killer (8x, 1.5 HP, 34 km, Mach 3.2). Shreds UCAV swarms and MALD decoys efficiently.',
    damage: 1.5, ammoCount: 8, minRangeKm: 1.2, sweetSpotMin: 4.0, sweetSpotMax: 28.0,
    lambda: 0.48, p: 1.0, T_0: 0.82, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'SWARM_MICRO',
    desc: '1-slot 8-round active-radar micro-missiles (34 km) engineered for anti-swarm defense.'
  },
  'CACM-6': {
    id: 'CACM-6', name: 'CACM Close-Combat Mini-IR (6x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 290, cost: 1.2, rangeKm: 28.0, speedMach: 3.0, seeker: 'IIR', rcs: 0.012,
    trait: 'HOBS_VANE', traitBadge: '1-SLOT 6x HOBS IR',
    behaviorDesc: 'Miniature 90-degree HOBS imaging-infrared interceptor (6x, 2 HP, 28 km, Mach 3.0) packing 6 dogfight shots into 1 internal slot.',
    damage: 2, ammoCount: 6, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 22.0,
    lambda: 0.64, p: 1.0, T_0: 0.87, decoyResistance: 0.70, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'SWARM_MICRO',
    desc: '1-slot 6-round close-air combat IR micro-missiles (28 km) for dense dogfight merges.'
  },
  'STARSTREAK-A2A': {
    id: 'STARSTREAK-A2A', name: 'ATASK Starstreak Optical (6x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 240, cost: 1.0, rangeKm: 16.0, speedMach: 3.8, seeker: 'EO', rcs: 0.01,
    trait: 'SWARM_RIPPLE', traitBadge: 'MACH 3.8 OPTICAL DART',
    behaviorDesc: 'Beam-riding Mach 3.8 kinetic tungsten darts (6x, 2 HP, 16 km). Completely immune to chaff, flares, and ECM jamming in close merges.',
    damage: 2, ammoCount: 6, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 13.5,
    lambda: 0.45, p: 1.0, T_0: 0.86, decoyResistance: 0.90, sigmaPylon: 0.03, category: 'A2A', a2aGroup: 'SWARM_MICRO',
    desc: 'High-velocity Mach 3.8 optical beam-riding close-combat darts (6x, 16 km) unaffected by flares.'
  },
  'MPBM': {
    id: 'MPBM', name: 'MPBM Burst Missile (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1450, cost: 3.2, rangeKm: 70.0, speedMach: 3.2, seeker: 'ARH', rcs: 0.08,
    trait: 'SHOCKWAVE_DETONATION', traitBadge: '8.5KM AREA SHOCKWAVE',
    behaviorDesc: 'High-yield thermobaric warhead detonates on terminal intercept (7 HP damage) at Mach 3.2, inflicting secondary blast damage across an 8.5 km radius.',
    damage: 7, ammoCount: 2, minRangeKm: 6.0, sweetSpotMin: 15.0, sweetSpotMax: 60.0,
    lambda: 0.35, p: 1.2, T_0: 0.78, aoeRadiusKm: 8.5, aoeDamage: 5.0, sigmaPylon: 0.16, category: 'A2A', a2aGroup: 'AOE_SPECIAL',
    allowedAirframes: ['ADFX-01', 'CFA-44', 'X-02S', 'F-15EX', 'F-22C-COFFIN', 'X-40', 'XFA-36B'],
    desc: 'Multi-Purpose Burst Missile (2x, Mach 3.2) providing standoff area shockwave destruction (8.5 km radius).'
  },
  'MPBM-II': {
    id: 'MPBM-II', name: 'MPBM-II Heavy Shockwave (2x)', slots: 4, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1650, cost: 3.8, rangeKm: 84.0, speedMach: 3.6, seeker: 'ARH', rcs: 0.09,
    trait: 'SHOCKWAVE_DETONATION', traitBadge: '10.5KM HEAVY SHOCKWAVE',
    behaviorDesc: 'Upgraded thermobaric area-denial missile (2x, 8 HP, 84 km, Mach 3.6). Generates a massive 10.5 km blast radius (up to 6 HP splash) clearing tight formations.',
    damage: 8, ammoCount: 2, minRangeKm: 7.0, sweetSpotMin: 18.0, sweetSpotMax: 72.0,
    lambda: 0.30, p: 1.2, T_0: 0.81, aoeRadiusKm: 10.5, aoeDamage: 6.0, sigmaPylon: 0.18, category: 'A2A', a2aGroup: 'AOE_SPECIAL',
    allowedAirframes: ['ADFX-01', 'CFA-44', 'X-02S', 'F-15EX', 'F-22C-COFFIN', 'X-40', 'XFA-36B', 'ADF-11F'],
    desc: 'Heavy 84 km thermobaric shockwave missile (2x, 8 HP) decimating clustered squadrons and drone swarms.'
  },
  'ADMM': {
    id: 'ADMM', name: 'ADMM Micro-Missile Pod (12x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1150, cost: 2.6, rangeKm: 36.0, speedMach: 2.5, seeker: 'OPT', rcs: 0.02,
    trait: 'ALL_ASPECT_BURST', traitBadge: 'ALL-ASPECT VOLLEY (12x)',
    behaviorDesc: 'Omni-directional micro-missiles launched in a spherical 360-degree pattern at Mach 2.5 to engage multiple nearby targets simultaneously.',
    damage: 2, ammoCount: 12, minRangeKm: 1.0, sweetSpotMin: 3.0, sweetSpotMax: 30.0,
    lambda: 0.70, p: 1.0, T_0: 0.88, sigmaPylon: 0.08, category: 'A2A', a2aGroup: 'AOE_SPECIAL',
    allowedAirframes: ['CFA-44', 'ADF-11F', 'ADFX-01', 'F-22C-COFFIN', 'Su-37-COFFIN', 'F-15-SMT-COFFIN', 'X-02S'],
    desc: 'All-Direction Multi-Purpose Missile pod (12x, Mach 2.5) mounted externally on heavy pylons of advanced superfighters.'
  },
  'ADMM-S': {
    id: 'ADMM-S', name: 'ADMM-S Internal Omni-Pack (8x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 680, cost: 2.2, rangeKm: 34.0, speedMach: 2.6, seeker: 'OPT', rcs: 0.008, isStealthMissile: true,
    trait: 'ALL_ASPECT_BURST', traitBadge: 'INTERNAL 360 DEG VOLLEY',
    behaviorDesc: 'Stealth-bay conformal omni-directional missile rack (8x, 2 HP, 34 km, Mach 2.6) firing at any target angle without opening external pylons.',
    damage: 2, ammoCount: 8, minRangeKm: 1.0, sweetSpotMin: 3.0, sweetSpotMax: 28.0,
    lambda: 0.65, p: 1.0, T_0: 0.88, sigmaPylon: 0.04, category: 'A2A', a2aGroup: 'AOE_SPECIAL',
    allowedAirframes: ['CFA-44', 'ADF-11F', 'ADFX-01', 'F-22C-COFFIN', 'Su-37-COFFIN', 'F-15-SMT-COFFIN', 'X-02S', 'X-40', 'XFA-36B', 'TEMPEST', 'FCAS-NGF', 'J-36', 'J-50'],
    desc: 'Internal stealth bay all-aspect micro-missile rack (8x, 34 km) for superfighters and 6th-gen air dominance.'
  }
};
