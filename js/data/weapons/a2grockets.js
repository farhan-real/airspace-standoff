/**
 * js/data/weapons/a2grockets.js - Unguided saturation rocket pods and laser-guided precision rockets.
 */

window.WEAPONS_A2G_ROCKETS = {
  'HYDRA-70': {
    id: 'HYDRA-70', name: 'LAU-61 Hydra-70 Rockets (12x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 380, cost: 0.3, rangeKm: 8.5, speedMach: 1.9, seeker: 'UNGUIDED', rcs: 0.02,
    trait: 'ROCKET_SALVO', traitBadge: 'IMMUNE TO ECM',
    behaviorDesc: '19-tube 70mm folding-fin rocket pod (12 bursts, Mach 1.9). Zero ECM vulnerability; rapidly clears AAA, radar vans, and decoys at close range.',
    damage: 1.5, ammoCount: 12, minRangeKm: 0.8, sweetSpotMin: 1.5, sweetSpotMax: 7.0, lambda: 0.45, p: 1.4, T_0: 0.78,
    isRocketPod: true, sigmaPylon: 0.06, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'Compact 70mm rocket pod (12 bursts) immune to radar jammers and chaff.'
  },
  'S-8KOM': {
    id: 'S-8KOM', name: 'B-8M1 S-8KOM Rockets (12x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 420, cost: 0.3, rangeKm: 9.0, speedMach: 2.0, seeker: 'UNGUIDED', rcs: 0.02,
    trait: 'SHAPED_CHARGE_ROCKET', traitBadge: 'HEAT SHAPED CHARGE',
    behaviorDesc: '20-tube 80mm HEAT shaped-charge rocket pod (12 bursts, 2.0 HP, Mach 2.0). Penetrates lightly armored SHORAD and mobile SAMs.',
    damage: 2, ammoCount: 12, minRangeKm: 0.8, sweetSpotMin: 1.5, sweetSpotMax: 7.5, lambda: 0.42, p: 1.4, T_0: 0.78,
    isRocketPod: true, armorPiercing: 0.80, sigmaPylon: 0.07, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: '80mm shaped-charge rocket pod (12 bursts) ideal for close air support against armored air defenses.'
  },
  'ZUNI-127': {
    id: 'ZUNI-127', name: 'LAU-10 Zuni 127mm Rockets (8x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 480, cost: 0.4, rangeKm: 11.0, speedMach: 2.2, seeker: 'UNGUIDED', rcs: 0.03,
    trait: 'HEAVY_ROCKET_POD', traitBadge: '127MM SUPERSONIC',
    behaviorDesc: 'Heavy 127mm Zuni rocket pod (8 bursts, 3.0 HP, Mach 2.2). High velocity clears light CIWS reaction windows.',
    damage: 3, ammoCount: 8, minRangeKm: 1.0, sweetSpotMin: 2.0, sweetSpotMax: 9.0, lambda: 0.40, p: 1.4, T_0: 0.80,
    isRocketPod: true, armorPiercing: 0.75, sigmaPylon: 0.08, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'High-velocity 127mm heavy rocket pod (8 bursts) for aggressive low-level suppression runs.'
  },
  'S-13OF': {
    id: 'S-13OF', name: 'B-13L S-13OF Heavy Rockets (8x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 720, cost: 0.6, rangeKm: 12.5, speedMach: 2.1, seeker: 'UNGUIDED', rcs: 0.04,
    trait: 'PENETRATING_ROCKET', traitBadge: '122MM BUNKER ROCKET',
    behaviorDesc: 'Heavy 122mm bunker-piercing rocket pod (8 bursts, 4.0 HP). Damages concrete shelters and runways without relying on electronic guidance.',
    damage: 4, ammoCount: 8, minRangeKm: 1.2, sweetSpotMin: 2.5, sweetSpotMax: 10.5, lambda: 0.36, p: 1.3, T_0: 0.80,
    isRocketPod: true, isBunkerCracker: true, sigmaPylon: 0.11, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'Heavy 122mm penetrating rocket pod (8 bursts) capable of damaging hardened aircraft shelters.'
  },
  'S-24B': {
    id: 'S-24B', name: 'S-24B 240mm Heavy Rockets (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 940, cost: 0.7, rangeKm: 14.0, speedMach: 2.3, seeker: 'UNGUIDED', rcs: 0.05,
    trait: 'HEAVY_ASSAULT_ROCKET', traitBadge: '240MM CONCRETE ROCKET',
    behaviorDesc: 'Unpowered-warhead 240mm unguided assault rockets (4x, 6.0 HP, Mach 2.3). Punches through hangars, SAM launchers, and fortified bunker doors.',
    damage: 6, ammoCount: 4, minRangeKm: 1.5, sweetSpotMin: 3.0, sweetSpotMax: 11.5, lambda: 0.30, p: 1.3, T_0: 0.82,
    isRocketPod: true, isBunkerCracker: true, armorPiercing: 0.85, sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'Heavy 240mm unguided bunker-busting assault rockets (4x) immune to ECM and chaff countermeasures.'
  },
  'APKWS-II': {
    id: 'APKWS-II', name: 'APKWS-II Laser Rockets (10x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 360, cost: 0.7, rangeKm: 15.0, speedMach: 2.1, seeker: 'LASER', rcs: 0.015,
    trait: 'LASER_ROCKET_SALVO', traitBadge: 'GUIDED 15KM ROCKETS',
    behaviorDesc: 'Precision laser-guided 70mm rockets (10 rounds, 2.5 HP, Mach 2.1). High accuracy against AAA, SHORAD, and decoys; amplified by Targeting Pods.',
    damage: 2.5, ammoCount: 10, minRangeKm: 1.0, sweetSpotMin: 2.5, sweetSpotMax: 13.0, lambda: 0.18, p: 1.1, T_0: 0.90,
    isRocketPod: true, sigmaPylon: 0.05, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'Precision laser-guided rocket pods (10x, 15 km) delivering pinpoint suppression of mobile AAA and radar vans.'
  },
  'CRV7-PG': {
    id: 'CRV7-PG', name: 'CRV7-PG Laser Anti-Armor (10x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 410, cost: 0.8, rangeKm: 16.5, speedMach: 2.4, seeker: 'LASER', rcs: 0.015,
    trait: 'LASER_ARMOR_ROCKET', traitBadge: '16.5KM AP ROCKETS',
    behaviorDesc: 'High-kinetic-velocity 70mm laser-guided anti-armor rockets (10x, 3.0 HP, Mach 2.4). High armor piercing capability against armored SAM TELARs.',
    damage: 3.0, ammoCount: 10, minRangeKm: 1.0, sweetSpotMin: 3.0, sweetSpotMax: 14.5, lambda: 0.16, p: 1.1, T_0: 0.91,
    isRocketPod: true, armorPiercing: 0.90, sigmaPylon: 0.05, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'High-velocity laser-guided anti-armor rockets (10x, 16.5 km) built for close air support and SHORAD hunting.'
  }
};
