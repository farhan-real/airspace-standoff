/**
 * js/data/weapons/a2alegacy.js - Legacy Semi-Active/Heavy BVR and Silent Long-Range Infrared BVR A2A Missiles.
 */

window.WEAPONS_A2A_LEGACY = {
  'AIM-7M': {
    id: 'AIM-7M', name: 'AIM-7M Sparrow (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 920, cost: 0.5, rangeKm: 52.0, speedMach: 3.5, seeker: 'ARH', rcs: 0.08,
    trait: 'LEGACY_BVR', traitBadge: 'BUDGET 52KM BVR',
    behaviorDesc: 'Economical medium BVR missile (4x, 3 HP, 52 km, Mach 3.5). Vulnerable to Doppler notching and chaff, ideal for budget 4th-gen wings.',
    damage: 3, ammoCount: 4, minRangeKm: 3.0, sweetSpotMin: 10.0, sweetSpotMax: 40.0,
    lambda: 0.46, p: 1.0, T_0: 0.68, sigmaPylon: 0.10, category: 'A2A', a2aGroup: 'LEGACY_SARH',
    desc: 'Classic budget Sparrow BVR missiles (4x, 52 km) for F-16C, F-18C+, F-14B, and F-4E.'
  },
  'AIM-7P': {
    id: 'AIM-7P', name: 'AIM-7P Sparrow Block II (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 925, cost: 0.7, rangeKm: 62.0, speedMach: 3.8, seeker: 'ARH', rcs: 0.07,
    trait: 'NETWORKED_LOAL', traitBadge: '62KM UPGRADED SPARROW',
    behaviorDesc: 'Upgraded datalink Sparrow (4x, 3 HP, 62 km, Mach 3.8). Improved computer guidance and low-altitude clutter filtering.',
    damage: 3, ammoCount: 4, minRangeKm: 3.0, sweetSpotMin: 12.0, sweetSpotMax: 48.0,
    lambda: 0.42, p: 1.0, T_0: 0.72, sigmaPylon: 0.09, category: 'A2A', a2aGroup: 'LEGACY_SARH',
    desc: 'Block II datalink-upgraded Sparrow missiles (4x, 62 km) delivering low-cost BVR coverage.'
  },
  'SKYFLASH': {
    id: 'SKYFLASH', name: 'BAe Skyflash SuperTEMP (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 830, cost: 0.6, rangeKm: 56.0, speedMach: 3.7, seeker: 'ARH', rcs: 0.07,
    trait: 'LEGACY_BVR', traitBadge: 'MONOPULSE CLUTTER FILTER',
    behaviorDesc: 'Inverse-monopulse BVR missile (4x, 3 HP, 56 km, Mach 3.7). Resists ground clutter better than early Sparrows.',
    damage: 3, ammoCount: 4, minRangeKm: 2.8, sweetSpotMin: 10.0, sweetSpotMax: 44.0,
    lambda: 0.43, p: 1.0, T_0: 0.71, antiNotchBonus: 0.10, sigmaPylon: 0.09, category: 'A2A', a2aGroup: 'LEGACY_SARH',
    desc: 'British inverse-monopulse medium BVR missiles (4x, 56 km) suited for Tornado and Eurofighter wings.'
  },
  'ASPIDE-MK1': {
    id: 'ASPIDE-MK1', name: 'Selenia Aspide Mk1 (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 880, cost: 0.5, rangeKm: 50.0, speedMach: 3.6, seeker: 'ARH', rcs: 0.07,
    trait: 'LEGACY_BVR', traitBadge: '50KM LIGHT BVR',
    behaviorDesc: 'Economical European monopulse BVR missile (4x, 3 HP, 50 km, Mach 3.6) for budget interceptors.',
    damage: 3, ammoCount: 4, minRangeKm: 2.5, sweetSpotMin: 9.0, sweetSpotMax: 39.0,
    lambda: 0.45, p: 1.0, T_0: 0.69, sigmaPylon: 0.09, category: 'A2A', a2aGroup: 'LEGACY_SARH',
    desc: 'Low-cost medium-range BVR interceptor missiles (4x, 50 km).'
  },
  'SUPER-530D': {
    id: 'SUPER-530D', name: 'Matra Super 530D (2x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 540, cost: 0.6, rangeKm: 55.0, speedMach: 4.5, seeker: 'ARH', rcs: 0.06,
    trait: 'HIGH_MACH_SPRINT', traitBadge: 'MACH 4.5 LEGACY SPRINT',
    behaviorDesc: 'High-speed French interceptor missile (2x, 3.5 HP, 55 km, Mach 4.5). Out-sprints fast bombers at high altitude.',
    damage: 3.5, ammoCount: 2, minRangeKm: 3.0, sweetSpotMin: 11.0, sweetSpotMax: 44.0,
    lambda: 0.38, p: 1.1, T_0: 0.72, sigmaPylon: 0.08, category: 'A2A', a2aGroup: 'LEGACY_SARH',
    desc: 'Mach 4.5 heavy-warhead interceptor missiles (2x, 55 km) paired with Mirage 2000 and F1 wings.'
  },
  'R-27R': {
    id: 'R-27R', name: 'R-27R Alamo-A (2x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 510, cost: 0.6, rangeKm: 56.0, speedMach: 3.8, seeker: 'ARH', rcs: 0.08,
    trait: 'LEGACY_BVR', traitBadge: '3.5 HP BUDGET ALAMO',
    behaviorDesc: 'Heavy-warhead Eastern BVR missile (2x, 3.5 HP, 56 km, Mach 3.8) delivering strong damage per hit.',
    damage: 3.5, ammoCount: 2, minRangeKm: 3.0, sweetSpotMin: 10.0, sweetSpotMax: 44.0,
    lambda: 0.44, p: 1.0, T_0: 0.70, sigmaPylon: 0.09, category: 'A2A', a2aGroup: 'LEGACY_SARH',
    desc: 'Standard heavy-warhead Alamo-A BVR missiles (2x, 56 km) for MiG-29 and Flanker pylons.'
  },
  'R-27ER': {
    id: 'R-27ER', name: 'R-27ER Alamo-C Extended (2x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 700, cost: 1.0, rangeKm: 80.0, speedMach: 4.5, seeker: 'ARH', rcs: 0.09,
    trait: 'HIGH_MACH_SPRINT', traitBadge: '80KM MACH 4.5 ALAMO',
    behaviorDesc: 'Extended-burn Alamo interceptor (2x, 4 HP, 80 km, Mach 4.5). High kinetic speed and 4 HP warhead threaten heavy fighters.',
    damage: 4, ammoCount: 2, minRangeKm: 4.5, sweetSpotMin: 16.0, sweetSpotMax: 64.0,
    lambda: 0.36, p: 1.1, T_0: 0.74, sigmaPylon: 0.11, category: 'A2A', a2aGroup: 'LEGACY_SARH',
    desc: 'Long-burn Mach 4.5 heavy interceptor missiles (2x, 80 km, 4 HP) for Su-27, Su-30, and MiG-29.'
  },
  'AIM-54C': {
    id: 'AIM-54C', name: 'AIM-54C Phoenix (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 940, cost: 1.6, rangeKm: 108.0, speedMach: 4.6, seeker: 'ARH', rcs: 0.14,
    trait: 'LOFTED_HYPERSONIC', traitBadge: '108KM FLEET PHOENIX',
    behaviorDesc: 'Heavy fleet-defense interceptor missile (2x, 5 HP, 108 km, Mach 4.6). Lofts high to ambush bombers and loaded strikers (+25% Pk vs heavy Wr).',
    damage: 5, ammoCount: 2, minRangeKm: 8.0, sweetSpotMin: 22.0, sweetSpotMax: 92.0,
    lambda: 0.28, p: 1.2, T_0: 0.73, heavyTargetBonus: true, sigmaPylon: 0.18, category: 'A2A', a2aGroup: 'LEGACY_SARH',
    allowedAirframes: ['F-14D', 'F-14B'],
    desc: 'Iconic heavy fleet-defense Tomcat missile (2x, 108 km, 5 HP) restricted to F-14B and F-14D.'
  },
  'R-27T': {
    id: 'R-27T', name: 'R-27T Alamo-B Silent IR (2x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 500, cost: 0.7, rangeKm: 44.0, speedMach: 3.6, seeker: 'IIR', rcs: 0.06,
    trait: 'SILENT_IR_BVR', traitBadge: '44KM SILENT IR',
    behaviorDesc: 'Medium-range passive infrared BVR missile (2x, 3.5 HP, 44 km, Mach 3.6). Gives zero RWR radar warning and ignores chaff and Doppler notching.',
    damage: 3.5, ammoCount: 2, minRangeKm: 2.0, sweetSpotMin: 8.0, sweetSpotMax: 36.0,
    lambda: 0.36, p: 1.0, T_0: 0.80, decoyResistance: 0.55, sigmaPylon: 0.08, category: 'A2A', a2aGroup: 'PASSIVE_IR',
    desc: 'Silent medium-range infrared Alamo-B missiles (2x, 44 km) for stealthy BVR ambushes.'
  },
  'R-27ET': {
    id: 'R-27ET', name: 'R-27ET Alamo-D Extended IR (2x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 690, cost: 1.1, rangeKm: 64.0, speedMach: 4.2, seeker: 'IIR', rcs: 0.07,
    trait: 'SILENT_IR_BVR', traitBadge: '64KM SILENT IR BVR',
    behaviorDesc: 'Extended-burn passive infrared BVR missile (2x, 4 HP, 64 km, Mach 4.2). Zero RWR alert; locks onto hot afterburning jets from BVR range.',
    damage: 4, ammoCount: 2, minRangeKm: 3.0, sweetSpotMin: 12.0, sweetSpotMax: 54.0,
    lambda: 0.28, p: 1.1, T_0: 0.82, decoyResistance: 0.65, sigmaPylon: 0.10, category: 'A2A', a2aGroup: 'PASSIVE_IR',
    desc: 'Long-range Mach 4.2 silent thermal ambush missile (2x, 64 km, 4 HP) immune to radar jamming.'
  },
  'R-77T': {
    id: 'R-77T', name: 'RVV-AE-T Thermal Adder (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 750, cost: 1.4, rangeKm: 58.0, speedMach: 3.8, seeker: 'IIR', rcs: 0.035,
    trait: 'SILENT_IR_BVR', traitBadge: '58KM INTERNAL IR BVR',
    behaviorDesc: 'Imaging-infrared seeker fitted to an R-77 airframe (4x, 3 HP, 58 km, Mach 3.8). Fires silently from internal stealth bays with zero RWR alert.',
    damage: 3, ammoCount: 4, minRangeKm: 2.5, sweetSpotMin: 10.0, sweetSpotMax: 48.0,
    lambda: 0.30, p: 1.0, T_0: 0.83, decoyResistance: 0.72, sigmaPylon: 0.06, category: 'A2A', a2aGroup: 'PASSIVE_IR',
    desc: 'Internal-bay compatible silent infrared BVR missiles (4x, 58 km) immune to chaff and Doppler notch.'
  },
  'AIM-9X-B3': {
    id: 'AIM-9X-B3', name: 'AIM-9X Block III Long-IR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 470, cost: 1.2, rangeKm: 48.0, speedMach: 2.9, seeker: 'IIR', rcs: 0.025,
    trait: 'HOBS_VANE', traitBadge: '1-SLOT 48KM HOBS IR',
    behaviorDesc: 'Extended-range 1-slot Sidewinder (4x, 2.5 HP, 48 km, Mach 2.9). Combines 90-degree HOBS turns with silent BVR infrared reach.',
    damage: 2.5, ammoCount: 4, minRangeKm: 0.8, sweetSpotMin: 3.0, sweetSpotMax: 40.0,
    lambda: 0.42, p: 1.0, T_0: 0.86, decoyResistance: 0.78, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'PASSIVE_IR',
    desc: '1-slot extended-range silent IIR missile (4x, 48 km) fitting compact internal stealth wing bays.'
  },
  'PL-10E-ER': {
    id: 'PL-10E-ER', name: 'PL-10E Extended IIR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 450, cost: 1.1, rangeKm: 46.0, speedMach: 3.1, seeker: 'IIR', rcs: 0.025,
    trait: 'HOBS_VANE', traitBadge: '1-SLOT 46KM IIR',
    behaviorDesc: 'Booster-stretched PL-10 (4x, 2.5 HP, 46 km, Mach 3.1). Gives light fighters silent mid-range IR ambush capability in 1 slot.',
    damage: 2.5, ammoCount: 4, minRangeKm: 0.8, sweetSpotMin: 3.0, sweetSpotMax: 38.0,
    lambda: 0.44, p: 1.0, T_0: 0.85, decoyResistance: 0.75, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'PASSIVE_IR',
    desc: '1-slot extended-reach Mach 3.1 imaging infrared missile (4x, 46 km) for stealth and multirole wings.'
  },
  'IRIS-T-LR': {
    id: 'IRIS-T-LR', name: 'IRIS-T SLX Long-IR (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 680, cost: 1.5, rangeKm: 62.0, speedMach: 3.4, seeker: 'IIR', rcs: 0.03,
    trait: 'IMAGE_RECOGNITION', traitBadge: '62KM SILHOUETTE IIR',
    behaviorDesc: 'Dual-stage boosted IRIS-T (4x, 3 HP, 62 km, Mach 3.4) with 3D silhouette recognition rejecting 82% of countermeasures.',
    damage: 3, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 8.0, sweetSpotMax: 52.0,
    lambda: 0.30, p: 1.0, T_0: 0.86, decoyResistance: 0.82, sigmaPylon: 0.05, category: 'A2A', a2aGroup: 'PASSIVE_IR',
    desc: 'Long-range European silent imaging-infrared BVR missile (4x, 62 km) immune to radar jamming.'
  }
};
