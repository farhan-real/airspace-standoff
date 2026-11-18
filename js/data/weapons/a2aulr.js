/**
 * js/data/weapons/a2aulr.js - Ultra-Long-Range (ULR) and Hypersonic Air-to-Air Interceptors.
 */

window.WEAPONS_A2A_ULR = {
  'R-33S': {
    id: 'R-33S', name: 'R-33S Foxhound Standoff (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 980, cost: 2.0, rangeKm: 112.0, speedMach: 4.5, seeker: 'ARH', rcs: 0.16,
    trait: 'LOFTED_HYPERSONIC', traitBadge: '112KM BOMBER KILLER',
    behaviorDesc: 'Heavy long-range interceptor missile (2x, 5 HP, 112 km, Mach 4.5). High warhead damage punishes bombers and loaded interceptors (+25% Pk vs heavy Wr).',
    damage: 5, ammoCount: 2, minRangeKm: 9.0, sweetSpotMin: 24.0, sweetSpotMax: 95.0,
    lambda: 0.28, p: 1.2, T_0: 0.72, heavyTargetBonus: true, sigmaPylon: 0.18, category: 'A2A', a2aGroup: 'ULR_BVR',
    allowedAirframes: ['MiG-31BM', 'MiG-25PD', 'Su-35S', 'Su-30SM', 'Su-30MKI', 'Su-27SM3'],
    desc: 'Economical heavy Mach 4.5 standoff missile (2x, 112 km, 5 HP) for Foxhound, Foxbat, and Flanker wings.'
  },
  'AIM-260': {
    id: 'AIM-260', name: 'AIM-260 JATM Stealth (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 820, cost: 3.4, rangeKm: 115.0, speedMach: 4.2, seeker: 'ARH', rcs: 0.0005, isStealthMissile: true,
    trait: 'STEALTH_SEEKER', traitBadge: 'LOW-RCS STEALTH BVR',
    behaviorDesc: 'Advanced low-observable casing (0.0005m2 RCS) with boost-sustain motor. Delivers 115 km deep BVR reach at Mach 4.2 and denies early RWR warning.',
    damage: 3, ammoCount: 4, minRangeKm: 7.0, sweetSpotMin: 20.0, sweetSpotMax: 95.0,
    lambda: 0.16, p: 1.8, T_0: 0.86, antiNotchBonus: 0.35, sigmaPylon: 0.04, category: 'A2A', a2aGroup: 'ULR_BVR',
    desc: 'Next-generation air dominance stealth missile (4x, Mach 4.2). Sized for internal stealth bays; can also be mounted on external pylons.'
  },
  'R-37M': {
    id: 'R-37M', name: 'R-37M Axehead (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1280, cost: 2.8, rangeKm: 125.0, speedMach: 5.8, seeker: 'ARH', rcs: 0.18,
    trait: 'LOFTED_HYPERSONIC', traitBadge: 'STRATOSPHERE DIVE',
    behaviorDesc: 'Hypersonic aero-ballistic trajectory. Lofts to stratosphere before plunging in a terminal dive at Mach 5.8; deals +50% damage against heavy aircraft.',
    damage: 6, ammoCount: 2, minRangeKm: 10.0, sweetSpotMin: 25.0, sweetSpotMax: 105.0,
    lambda: 0.30, p: 1.2, T_0: 0.70, heavyTargetBonus: true, sigmaPylon: 0.20, category: 'A2A', a2aGroup: 'ULR_BVR',
    desc: 'Heavy hypersonic deep interceptor (2x, Mach 5.8). Requires external heavy pylons; cannot be mounted in standard internal bays.'
  },
  'AIM-174B': {
    id: 'AIM-174B', name: 'AIM-174B Air-Launched SM-6 (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1720, cost: 3.1, rangeKm: 132.0, speedMach: 4.8, seeker: 'ARH', rcs: 0.12,
    trait: 'LOFTED_HYPERSONIC', traitBadge: '132KM FLEET DEFENDER',
    behaviorDesc: 'Air-launched Standard Missile-6 interceptor (2x, 5 HP, Mach 4.8). Lofts high to ambush standoff bombers, jammers, and high-altitude interceptors.',
    damage: 5, ammoCount: 2, minRangeKm: 11.0, sweetSpotMin: 28.0, sweetSpotMax: 115.0,
    lambda: 0.22, p: 1.4, T_0: 0.78, heavyTargetBonus: true, sigmaPylon: 0.22, category: 'A2A', a2aGroup: 'ULR_BVR',
    allowedAirframes: ['F-18E', 'F-18F', 'F-18C-PLUS', 'F-15EX', 'F-15E', 'F-15C', 'F-15J-JSI', 'F-14D', 'F-14B', 'EA-18G', 'F-15-SMTD', 'F-15-SMT-COFFIN'],
    desc: 'Heavy fleet-defense ultra-long-range missile (2x, 132 km) certified for heavy Hornets, Tomcats, and Eagles.'
  },
  'PL-17': {
    id: 'PL-17', name: 'PL-17 Very-Long-Range (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1420, cost: 3.1, rangeKm: 135.0, speedMach: 4.9, seeker: 'ARH', rcs: 0.05,
    trait: 'DUAL_PULSE_SURGE', traitBadge: '135KM DUAL-PULSE ULR',
    behaviorDesc: 'Extreme-range dual-pulse AESA interceptor (2x, 5 HP, 135 km, Mach 4.9). Built to snipe EW jammers, bombers, and high-value support aircraft.',
    damage: 5, ammoCount: 2, minRangeKm: 12.0, sweetSpotMin: 30.0, sweetSpotMax: 120.0,
    lambda: 0.16, p: 1.6, T_0: 0.79, heavyTargetBonus: true, antiNotchBonus: 0.25, sigmaPylon: 0.18, category: 'A2A', a2aGroup: 'ULR_BVR',
    allowedAirframes: ['J-16', 'J-16D', 'J-15D', 'J-15T', 'J-11BG', 'J-20', 'J-20B', 'J-20S', 'Su-35S', 'Su-30SM', 'Su-30MKI', 'Su-27SM3', 'Su-34'],
    desc: 'Very-long-range dual-pulse AESA interceptor (2x, 135 km) deployed by heavy Flankers and J-20s.'
  },
  'KS-172': {
    id: 'KS-172', name: 'KS-172 Novator Standoff (2x)', slots: 4, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1500, cost: 2.9, rangeKm: 140.0, speedMach: 4.6, seeker: 'ARH', rcs: 0.16,
    trait: 'EXTREME_STANDOFF', traitBadge: '140KM AWACS KILLER',
    behaviorDesc: 'Two-stage ultra-long-range air-to-air missile (2x, 5 HP, 140 km). Reaches across the theater to eliminate standoff jammers and bombers.',
    damage: 5, ammoCount: 2, minRangeKm: 14.0, sweetSpotMin: 30.0, sweetSpotMax: 122.0,
    lambda: 0.24, p: 1.3, T_0: 0.74, heavyTargetBonus: true, sigmaPylon: 0.24, category: 'A2A', a2aGroup: 'ULR_BVR',
    allowedAirframes: ['MiG-31BM', 'MiG-25PD', 'Su-35S', 'Su-30SM', 'Su-30MKI', 'Su-27SM3', 'Su-37', 'Su-34', 'J-16'],
    desc: 'Ultra-long-range heavy interceptor missile (2x, 140 km) carried on heavy Flanker and Foxhound stations.'
  },
  'K-100': {
    id: 'K-100', name: 'K-100-172M Hypersonic ULR (2x)', slots: 4, slotType: 'EXTERNAL', minRating: 'Type X',
    mass: 1560, cost: 3.3, rangeKm: 145.0, speedMach: 5.2, seeker: 'ARH', rcs: 0.14,
    trait: 'LOFTED_HYPERSONIC', traitBadge: '145KM MACH 5.2 KILLER',
    behaviorDesc: 'Upgraded two-stage Novator interceptor (2x, 6 HP, 145 km, Mach 5.2). Strikes across the entire theater against high-value assets (+25% Pk vs heavy Wr).',
    damage: 6, ammoCount: 2, minRangeKm: 14.0, sweetSpotMin: 32.0, sweetSpotMax: 128.0,
    lambda: 0.22, p: 1.3, T_0: 0.76, heavyTargetBonus: true, sigmaPylon: 0.24, category: 'A2A', a2aGroup: 'ULR_BVR',
    allowedAirframes: ['MiG-31BM', 'Su-35S', 'Su-30SM', 'Su-30MKI', 'Su-37', 'Su-34', 'J-16'],
    desc: '145 km Mach 5.2 heavy Type X interceptor missile (2x, 6 HP) built for strategic outer-air-battle sniping.'
  }
};
