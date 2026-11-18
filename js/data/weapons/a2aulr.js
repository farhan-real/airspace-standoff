/**
 * js/data/weapons/a2aulr.js - Ultra-Long-Range BVR, Hypersonic, and Area-Shockwave Air-to-Air missiles.
 */

window.WEAPONS_A2A_ULR = {
  'AIM-260': {
    id: 'AIM-260', name: 'AIM-260 JATM Stealth (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 820, cost: 3.4, rangeKm: 115.0, speedMach: 4.2, seeker: 'ARH', rcs: 0.0005, isStealthMissile: true,
    trait: 'STEALTH_SEEKER', traitBadge: 'LOW-RCS STEALTH BVR',
    behaviorDesc: 'Advanced low-observable casing (0.0005m2 RCS) with boost-sustain motor. Delivers 115 km deep BVR reach at Mach 4.2 and denies early RWR warning.',
    damage: 3, ammoCount: 4, minRangeKm: 7.0, sweetSpotMin: 20.0, sweetSpotMax: 95.0,
    lambda: 0.16, p: 1.8, T_0: 0.86, antiNotchBonus: 0.35, sigmaPylon: 0.04,
    category: 'A2A', a2aGroup: 'ULR_BVR',
    desc: 'Next-generation air dominance stealth missile (4x, Mach 4.2). Sized for internal stealth bays; can also be mounted on external pylons.'
  },
  'R-37M': {
    id: 'R-37M', name: 'R-37M Axehead (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1280, cost: 2.8, rangeKm: 125.0, speedMach: 5.8, seeker: 'ARH', rcs: 0.18,
    trait: 'LOFTED_HYPERSONIC', traitBadge: 'STRATOSPHERE DIVE',
    behaviorDesc: 'Hypersonic aero-ballistic trajectory. Lofts to stratosphere before plunging in a terminal dive at Mach 5.8; deals +50% damage against heavy aircraft.',
    damage: 6, ammoCount: 2, minRangeKm: 10.0, sweetSpotMin: 25.0, sweetSpotMax: 105.0,
    lambda: 0.30, p: 1.2, T_0: 0.70, heavyTargetBonus: true, sigmaPylon: 0.20,
    category: 'A2A', a2aGroup: 'ULR_BVR',
    desc: 'Heavy hypersonic deep interceptor (2x, Mach 5.8). Requires external heavy pylons; cannot be mounted in standard internal bays.'
  },
  'PL-21': {
    id: 'PL-21', name: 'PL-21 Hypersonic BVR (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1350, cost: 3.0, rangeKm: 130.0, speedMach: 4.5, seeker: 'ARH', rcs: 0.06,
    trait: 'EXTREME_STANDOFF', traitBadge: '130KM STANDOFF REACH',
    behaviorDesc: 'Ultra-long-range ramjet missile providing theater-wide perimeter interception at sustained Mach 4.5 against high-value targets.',
    damage: 5, ammoCount: 2, minRangeKm: 12.0, sweetSpotMin: 28.0, sweetSpotMax: 110.0,
    lambda: 0.20, p: 1.6, T_0: 0.75, sigmaPylon: 0.18,
    category: 'A2A', a2aGroup: 'ULR_BVR',
    desc: 'Extreme standoff ramjet interceptor (2x, Mach 4.5). Requires external heavy pylons due to oversized ramjet airframe length.'
  },
  'AIM-174B': {
    id: 'AIM-174B', name: 'AIM-174B Air-Launched SM-6 (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1720, cost: 3.1, rangeKm: 132.0, speedMach: 4.8, seeker: 'ARH', rcs: 0.12,
    trait: 'LOFTED_HYPERSONIC', traitBadge: '132KM FLEET DEFENDER',
    behaviorDesc: 'Air-launched Standard Missile-6 interceptor (2x, 5 HP, Mach 4.8). Lofts high to ambush standoff bombers, jammers, and high-altitude interceptors.',
    damage: 5, ammoCount: 2, minRangeKm: 11.0, sweetSpotMin: 28.0, sweetSpotMax: 115.0,
    lambda: 0.22, p: 1.4, T_0: 0.78, heavyTargetBonus: true, sigmaPylon: 0.22,
    category: 'A2A', a2aGroup: 'ULR_BVR',
    allowedAirframes: ['F-18E', 'F-15EX', 'F-15E', 'F-14D', 'EA-18G', 'F-15-SMTD', 'F-15-SMT-COFFIN'],
    desc: 'Heavy fleet-defense ultra-long-range missile (2x, 132 km) certified for heavy Super Hornets and Eagles.'
  },
  'KS-172': {
    id: 'KS-172', name: 'KS-172 Novator Standoff (2x)', slots: 4, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1500, cost: 2.9, rangeKm: 140.0, speedMach: 4.6, seeker: 'ARH', rcs: 0.16,
    trait: 'EXTREME_STANDOFF', traitBadge: '140KM AWACS KILLER',
    behaviorDesc: 'Two-stage ultra-long-range air-to-air missile (2x, 5 HP, 140 km). Reaches across the theater to eliminate standoff jammers and bombers.',
    damage: 5, ammoCount: 2, minRangeKm: 14.0, sweetSpotMin: 30.0, sweetSpotMax: 122.0,
    lambda: 0.24, p: 1.3, T_0: 0.74, heavyTargetBonus: true, sigmaPylon: 0.24,
    category: 'A2A', a2aGroup: 'ULR_BVR',
    allowedAirframes: ['MiG-31BM', 'Su-35S', 'Su-30SM', 'Su-37', 'Su-34', 'J-16'],
    desc: 'Ultra-long-range heavy interceptor missile (2x, 140 km) carried on heavy Flanker and Foxhound stations.'
  },
  'MPBM': {
    id: 'MPBM', name: 'MPBM Burst Missile (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1450, cost: 3.2, rangeKm: 70.0, speedMach: 3.2, seeker: 'ARH', rcs: 0.08,
    trait: 'SHOCKWAVE_DETONATION', traitBadge: 'AREA SHOCKWAVE (AOE)',
    behaviorDesc: 'High-yield thermobaric warhead detonates on terminal intercept (7 HP damage) at Mach 3.2, inflicting secondary blast damage across an 8.5 km radius.',
    damage: 7, ammoCount: 2, minRangeKm: 6.0, sweetSpotMin: 15.0, sweetSpotMax: 60.0,
    lambda: 0.35, p: 1.2, T_0: 0.78, sigmaPylon: 0.16,
    category: 'A2A', a2aGroup: 'ULR_BVR',
    allowedAirframes: ['ADFX-01', 'CFA-44', 'X-02S', 'F-15EX', 'F-22C-COFFIN', 'X-40', 'XFA-36B'],
    desc: 'Multi-Purpose Burst Missile (2x, Mach 3.2) providing standoff area shockwave destruction (8.5 km radius). Carried externally on heavy pylons.'
  }
};
