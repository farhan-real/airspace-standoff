/**
 * js/data/weapons/a2grockets.js - Unguided saturation rocket pods, high-velocity flechette pods, and laser-guided heavy rockets.
 */

window.WEAPONS_A2G_ROCKETS = {
  'HYDRA-70': {
    id: 'HYDRA-70', name: 'LAU-61 Hydra-70 Rockets (16x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 340, cost: 0.3, rangeKm: 11.0, speedMach: 2.0, seeker: 'UNGUIDED', rcs: 0.02,
    trait: 'ROCKET_SALVO', traitBadge: '16x SOFT SATURATION',
    behaviorDesc: 'Lightweight 70mm rocket pod (16 bursts, 1.5 HP, 11 km, 340 kg). Zero ECM vulnerability; 16 volleys clear soft AAA, radars, and decoys cheaply.',
    damage: 1.5, ammoCount: 16, minRangeKm: 0.8, sweetSpotMin: 1.5, sweetSpotMax: 9.0, lambda: 0.38, p: 1.3, T_0: 0.80,
    isRocketPod: true, sigmaPylon: 0.06, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'High-capacity 70mm rocket pod (16 bursts, 11 km) immune to radar jammers and chaff.'
  },
  'S-8KOM': {
    id: 'S-8KOM', name: 'B-8M1 S-8KOM Rockets (10x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 420, cost: 0.4, rangeKm: 11.5, speedMach: 2.1, seeker: 'UNGUIDED', rcs: 0.02,
    trait: 'SHAPED_CHARGE_ROCKET', traitBadge: 'HEAT SHAPED CHARGE',
    behaviorDesc: '20-tube 80mm HEAT shaped-charge rocket pod (10 bursts, 2.0 HP, 11.5 km, 85% AP). Punches through armored SHORAD and mobile SAMs.',
    damage: 2, ammoCount: 10, minRangeKm: 0.8, sweetSpotMin: 1.5, sweetSpotMax: 9.5, lambda: 0.36, p: 1.3, T_0: 0.80,
    isRocketPod: true, armorPiercing: 0.85, sigmaPylon: 0.07, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: '80mm shaped-charge anti-armor rocket pod (10 bursts, 11.5 km) ideal for fast CAS passes.'
  },
  'ZUNI-127': {
    id: 'ZUNI-127', name: 'LAU-10 Zuni 127mm Rockets (8x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 480, cost: 0.4, rangeKm: 13.5, speedMach: 2.3, seeker: 'UNGUIDED', rcs: 0.03,
    trait: 'HEAVY_ROCKET_POD', traitBadge: '127MM SUPERSONIC',
    behaviorDesc: 'Heavy 127mm Zuni rocket pod (8 bursts, 3.0 HP, 13.5 km, Mach 2.3). High velocity clears light CIWS reaction windows.',
    damage: 3, ammoCount: 8, minRangeKm: 1.0, sweetSpotMin: 2.0, sweetSpotMax: 11.0, lambda: 0.34, p: 1.3, T_0: 0.82,
    isRocketPod: true, armorPiercing: 0.75, sigmaPylon: 0.08, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'High-velocity 127mm heavy rocket pod (8 bursts, 13.5 km) for aggressive low-level suppression runs.'
  },
  'CRV7-MPSM': {
    id: 'CRV7-MPSM', name: 'CRV7-MPSM High-Velocity Rockets (12x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 440, cost: 0.5, rangeKm: 13.5, speedMach: 2.6, seeker: 'UNGUIDED', rcs: 0.02,
    trait: 'HIGH_VELOCITY_ROCKET', traitBadge: 'MACH 2.6 FLECHETTE POD',
    behaviorDesc: 'High-energy 70mm tungsten-flechette rocket pod (12 bursts, 2.5 HP, 13.5 km, Mach 2.6). Outpaces SHORAD and punches through armored SAMs.',
    damage: 2.5, ammoCount: 12, minRangeKm: 0.8, sweetSpotMin: 2.0, sweetSpotMax: 11.5, lambda: 0.32, p: 1.2, T_0: 0.84,
    isRocketPod: true, armorPiercing: 0.85, sigmaPylon: 0.06, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'High-velocity Mach 2.6 CRV7 anti-armor rocket pod (12 bursts, 13.5 km) built for fast supersonic CAS passes.'
  },
  'S-13OF': {
    id: 'S-13OF', name: 'B-13L S-13OF Heavy Rockets (8x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 720, cost: 0.6, rangeKm: 15.0, speedMach: 2.2, seeker: 'UNGUIDED', rcs: 0.04,
    trait: 'PENETRATING_ROCKET', traitBadge: '122MM BUNKER ROCKET',
    behaviorDesc: 'Heavy 122mm bunker-piercing rocket pod (8 bursts, 4.0 HP, 15 km). Damages concrete shelters and runways without relying on electronic guidance.',
    damage: 4, ammoCount: 8, minRangeKm: 1.2, sweetSpotMin: 2.5, sweetSpotMax: 12.5, lambda: 0.30, p: 1.2, T_0: 0.82,
    isRocketPod: true, isBunkerCracker: true, sigmaPylon: 0.11, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'Heavy 122mm penetrating rocket pod (8 bursts, 15 km) capable of damaging hardened aircraft shelters.'
  },
  'S-24B': {
    id: 'S-24B', name: 'S-24B 240mm Heavy Rockets (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 940, cost: 0.7, rangeKm: 16.5, speedMach: 2.4, seeker: 'UNGUIDED', rcs: 0.05,
    trait: 'HEAVY_ASSAULT_ROCKET', traitBadge: '240MM CONCRETE ROCKET',
    behaviorDesc: 'Heavy 240mm unguided assault rockets (4x, 6.0 HP, 16.5 km, Mach 2.4). Punches through hangars, SAM launchers, and fortified bunker doors.',
    damage: 6, ammoCount: 4, minRangeKm: 1.5, sweetSpotMin: 3.0, sweetSpotMax: 14.0, lambda: 0.26, p: 1.2, T_0: 0.84,
    isRocketPod: true, isBunkerCracker: true, armorPiercing: 0.85, sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'Heavy 240mm unguided bunker-busting assault rockets (4x, 16.5 km) immune to ECM and chaff countermeasures.'
  },
  'S-25OFM': {
    id: 'S-25OFM', name: 'S-25L/OFM 340mm Super Rockets (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 1480, cost: 0.9, rangeKm: 18.0, speedMach: 2.5, seeker: 'LASER', rcs: 0.05,
    trait: 'HEAVY_LASER_ROCKET', traitBadge: '340MM CONCRETE BREAKER',
    behaviorDesc: 'Massive 340mm laser-guided concrete-piercing heavy rockets (4x, 8.5 HP, 18 km, Mach 2.5). Cracks fortified shelters, runways, and armored SAMs from outside AAA range.',
    damage: 8.5, ammoCount: 4, minRangeKm: 1.8, sweetSpotMin: 3.5, sweetSpotMax: 15.5, lambda: 0.18, p: 1.1, T_0: 0.88,
    isRocketPod: true, isBunkerCracker: true, armorPiercing: 0.95, sigmaPylon: 0.15, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'Laser-guided 340mm heavy assault rockets (4x, 18 km, 8.5 HP) built for Frogfoot, Flogger, and fast CAS strikers.'
  },
  'APKWS-II': {
    id: 'APKWS-II', name: 'APKWS-II Laser Rockets (12x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 360, cost: 0.6, rangeKm: 17.0, speedMach: 2.2, seeker: 'LASER', rcs: 0.015,
    trait: 'LASER_ROCKET_SALVO', traitBadge: '12x GUIDED ROCKETS',
    behaviorDesc: 'Economical 12-round laser-guided 70mm rockets (12x, 2.0 HP, 17 km, Mach 2.2). High volume precision against soft radars, AAA, and decoys.',
    damage: 2.0, ammoCount: 12, minRangeKm: 1.0, sweetSpotMin: 2.5, sweetSpotMax: 14.5, lambda: 0.16, p: 1.1, T_0: 0.90,
    isRocketPod: true, sigmaPylon: 0.05, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'Precision 12-shot laser-guided rocket pods (17 km) delivering pinpoint suppression of AAA and radar vans.'
  },
  'CRV7-PG': {
    id: 'CRV7-PG', name: 'CRV7-PG Laser Anti-Armor (10x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 410, cost: 0.9, rangeKm: 19.0, speedMach: 2.5, seeker: 'LASER', rcs: 0.015,
    trait: 'LASER_ARMOR_ROCKET', traitBadge: '19KM 3HP AP ROCKETS',
    behaviorDesc: 'High-kinetic-velocity 70mm laser-guided anti-armor rockets (10x, 3.0 HP, 19 km, Mach 2.5, 90% AP). Hits 50% harder than APKWS-II against armored SAMs.',
    damage: 3.0, ammoCount: 10, minRangeKm: 1.0, sweetSpotMin: 3.0, sweetSpotMax: 16.5, lambda: 0.14, p: 1.1, T_0: 0.91,
    isRocketPod: true, armorPiercing: 0.90, sigmaPylon: 0.05, category: 'A2G', a2gGroup: 'ROCKETS',
    desc: 'High-velocity laser-guided anti-armor rockets (10x, 19 km, 3.0 HP) built for fast CAS and SHORAD hunting.'
  }
};
