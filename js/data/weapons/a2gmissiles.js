/**
 * js/data/weapons/a2gmissiles.js - Tactical Air-to-Ground Missiles (ATGMs) for anti-armor and pinpoint strike.
 */

window.WEAPONS_A2G_MISSILES = {
  'AGM-114L': {
    id: 'AGM-114L', name: 'AGM-114L Longbow Hellfire (8x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 440, cost: 0.7, rangeKm: 14.0, speedMach: 1.3, seeker: 'MMW', rcs: 0.015,
    trait: 'FIRE_AND_FORGET_MMW', traitBadge: 'ALL-WEATHER MMW ATGM',
    behaviorDesc: 'Millimeter-wave fire-and-forget tactical missiles (8x, 3.5 HP). Penetrates heavy smoke and weather clouds to destroy armored SHORAD and AAA.',
    damage: 3.5, ammoCount: 8, minRangeKm: 1.0, sweetSpotMin: 2.5, sweetSpotMax: 12.0, lambda: 0.16, p: 1.1, T_0: 0.88,
    armorPiercing: 0.95, sigmaPylon: 0.06, category: 'A2G', a2gGroup: 'ATGM',
    desc: 'Quad-rail millimeter-wave Hellfire ATGMs (8x, 14 km) for rapid saturation of armored ground defenses.'
  },
  'AGM-179': {
    id: 'AGM-179', name: 'AGM-179A JAGM Dual-Mode (6x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 490, cost: 1.0, rangeKm: 20.0, speedMach: 1.5, seeker: 'MMW_IIR', rcs: 0.015,
    trait: 'DUAL_MODE_ATGM', traitBadge: 'MMW + LASER 20KM ATGM',
    behaviorDesc: 'Dual-mode MMW radar and semi-active laser ATGM (6x, 4.5 HP, 20 km). Cuts through cloud cover and ground jamming.',
    damage: 4.5, ammoCount: 6, minRangeKm: 1.5, sweetSpotMin: 3.5, sweetSpotMax: 17.5, lambda: 0.14, p: 1.1, T_0: 0.90,
    armorPiercing: 0.95, sigmaPylon: 0.06, category: 'A2G', a2gGroup: 'ATGM',
    desc: 'Next-generation dual-mode Joint Air-to-Ground Missiles (6x, 20 km) engineered for armored SAM and radar hunting.'
  },
  'KH-25ML': {
    id: 'KH-25ML', name: 'Kh-25ML Tactical Laser ATGM (4x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 1200, cost: 0.6, rangeKm: 20.0, speedMach: 2.3, seeker: 'LASER', rcs: 0.02,
    trait: 'SUPERSONIC_COMPACT_ATGM', traitBadge: '1-SLOT MACH 2.3 ATGM',
    behaviorDesc: 'Agile 1-slot supersonic laser-guided missile (4x, 4.5 HP, Mach 2.3). Outpaces slow AAA turrets and penetrates armored SHORAD.',
    damage: 4.5, ammoCount: 4, minRangeKm: 1.5, sweetSpotMin: 4.0, sweetSpotMax: 17.5, lambda: 0.16, p: 1.1, T_0: 0.88,
    armorPiercing: 0.85, sigmaPylon: 0.09, category: 'A2G', a2gGroup: 'ATGM',
    desc: 'Compact 1-slot Mach 2.3 tactical laser missiles (4x, 20 km) suited for close support and interdictor wing stations.'
  },
  'AGM-65E': {
    id: 'AGM-65E', name: 'AGM-65E2 Laser Maverick (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 1180, cost: 0.9, rangeKm: 24.0, speedMach: 1.2, seeker: 'LASER', rcs: 0.03,
    trait: 'HEAVY_LASER_ATGM', traitBadge: '300LB LASER PENETRATOR',
    behaviorDesc: 'Heavy 300lb blast-fragmentation laser Maverick (4x, 6.0 HP, 24 km). Designated via Targeting Pod for pinpoint strikes on fortified shelters and SAMs.',
    damage: 6, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 4.5, sweetSpotMax: 20.5, lambda: 0.15, p: 1.1, T_0: 0.90,
    isBunkerCracker: true, sigmaPylon: 0.12, category: 'A2G', a2gGroup: 'ATGM',
    desc: 'Laser-guided heavy 300lb Maverick tactical missiles (4x, 24 km) engineered for hardened point targets.'
  },
  'AGM-65G': {
    id: 'AGM-65G', name: 'AGM-65G Heavy Maverick (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 1220, cost: 0.9, rangeKm: 26.0, speedMach: 1.2, seeker: 'IIR', rcs: 0.03,
    trait: 'HEAVY_SHAPED_WARHEAD', traitBadge: '300LB HEAVY ATGM',
    behaviorDesc: 'Imaging-infrared heavy tactical missile (4x, 6.0 HP, 26 km). High-blast warhead neutralizes armored SAMs, shelters, and fuel dumps.',
    damage: 6, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 5.0, sweetSpotMax: 22.0, lambda: 0.16, p: 1.1, T_0: 0.88,
    isBunkerCracker: true, sigmaPylon: 0.12, category: 'A2G', a2gGroup: 'ATGM',
    desc: 'Heavy infrared tactical air-to-surface missiles (4x, 26 km) used by A-10C and F-16V strike crews.'
  },
  'SPIKE-NLOS': {
    id: 'SPIKE-NLOS', name: 'Spike-NLOS Standoff EO (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 285, cost: 1.1, rangeKm: 32.0, speedMach: 0.80, seeker: 'EO', rcs: 0.008,
    trait: 'STANDOFF_OPTICAL_ATGM', traitBadge: '1-SLOT 32KM EO ATGM',
    behaviorDesc: 'Electro-optical fiber-datalink tactical missile (4x, 4.5 HP, 32 km). Outranges all AAA and SHORAD while operating immune to RF radar jamming.',
    damage: 4.5, ammoCount: 4, minRangeKm: 1.5, sweetSpotMin: 5.0, sweetSpotMax: 29.0, lambda: 0.10, p: 1.0, T_0: 0.92,
    armorPiercing: 0.95, sigmaPylon: 0.04, category: 'A2G', a2gGroup: 'ATGM',
    desc: 'Lightweight 1-slot 32 km electro-optical anti-armor missiles (4x) ideal for light attack and stealth UCAVs.'
  },
  'BRIMSTONE-II': {
    id: 'BRIMSTONE-II', name: 'Brimstone II Triple Rack (6x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 480, cost: 1.2, rangeKm: 36.0, speedMach: 1.5, seeker: 'MMW', rcs: 0.01,
    trait: 'STANDOFF_MMW_SALVO', traitBadge: '36KM STANDOFF ATGM',
    behaviorDesc: 'Extended-range supersonic MMW tactical missile (6x, 4.0 HP, 36 km). Outranges all AAA and SHORAD batteries in any weather.',
    damage: 4, ammoCount: 6, minRangeKm: 2.0, sweetSpotMin: 6.0, sweetSpotMax: 32.0, lambda: 0.12, p: 1.1, T_0: 0.90,
    armorPiercing: 0.95, sigmaPylon: 0.06, category: 'A2G', a2gGroup: 'ATGM',
    desc: 'Long-reach supersonic anti-armor missiles (6x, 36 km) capable of rippling multiple armored targets per pass.'
  },
  'KH-29T': {
    id: 'KH-29T', name: 'Kh-29TE Heavy Tactical (4x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 2600, cost: 1.0, rangeKm: 28.0, speedMach: 2.2, seeker: 'EO', rcs: 0.06,
    trait: 'HEAVY_SUPERSONIC_ATGM', traitBadge: '320KG WARHEAD M2.2',
    behaviorDesc: 'Supersonic 320kg-warhead electro-optical missile (4x, 8.0 HP, Mach 2.2). High terminal velocity bypasses AAA and damages fortified structures.',
    damage: 8, ammoCount: 4, minRangeKm: 2.5, sweetSpotMin: 6.0, sweetSpotMax: 24.0, lambda: 0.16, p: 1.2, T_0: 0.88,
    isBunkerCracker: true, sigmaPylon: 0.18, category: 'A2G', a2gGroup: 'ATGM',
    desc: 'Heavy supersonic tactical missiles (4x, 28 km) engineered to destroy shelters, bridges, and armored SAMs.'
  },
  'KH-38ML': {
    id: 'KH-38ML', name: 'Kh-38ML Supersonic Strike (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 2080, cost: 1.4, rangeKm: 42.0, speedMach: 2.4, seeker: 'LASER', rcs: 0.03,
    trait: 'SUPERSONIC_LASER_ATGM', traitBadge: '42KM MACH 2.4 STRIKE',
    behaviorDesc: 'Fast Mach 2.4 modular laser-guided missile (4x, 7.0 HP, 42 km). Too fast for most CIWS guns when paired with a Targeting Pod.',
    damage: 7, ammoCount: 4, minRangeKm: 3.0, sweetSpotMin: 8.0, sweetSpotMax: 36.0, lambda: 0.14, p: 1.2, T_0: 0.90,
    isBunkerCracker: true, sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'ATGM',
    desc: 'Supersonic 42 km modular tactical missiles (4x) able to penetrate CIWS envelopes at high speed.'
  }
};
