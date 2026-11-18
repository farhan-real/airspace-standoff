/**
 * js/data/weapons/a2a.js - Medium-Range and Long-Range Beyond-Visual-Range (BVR) Air-to-Air missiles.
 */

window.WEAPONS_A2A = {
  'MICA-EM': {
    id: 'MICA-EM', name: 'MICA-EM Active BVR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 450, cost: 1.0, rangeKm: 58.0, speedMach: 3.3, seeker: 'ARH', rcs: 0.03,
    trait: 'HOBS_VANE', traitBadge: '1-SLOT COMPACT BVR',
    behaviorDesc: 'Thrust-vectored active radar missile (4x, 2.5 HP, 58 km). Occupies 1 slot with high off-boresight launch capability for light fighters.',
    damage: 2.5, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 10.0, sweetSpotMax: 46.0,
    lambda: 0.42, p: 1.0, T_0: 0.78, sigmaPylon: 0.04,
    category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Compact 1-slot active radar BVR/WVR missile (4x, 58 km) with thrust-vector agility for light fighters and interdictors.'
  },
  'ASTRA-MK1': {
    id: 'ASTRA-MK1', name: 'Astra Mk1 Active BVR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 615, cost: 1.0, rangeKm: 62.0, speedMach: 4.5, seeker: 'ARH', rcs: 0.035,
    trait: 'HIGH_MACH_SPRINT', traitBadge: '1-SLOT MACH 4.5 BVR',
    behaviorDesc: 'High-speed smokeless active radar BVR missile (4x, 3 HP, 62 km, Mach 4.5). Occupies 1 slot with strong ECCM resistance.',
    damage: 3, ammoCount: 4, minRangeKm: 2.5, sweetSpotMin: 11.0, sweetSpotMax: 50.0,
    lambda: 0.36, p: 1.1, T_0: 0.77, sigmaPylon: 0.05,
    category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Compact high-velocity Mach 4.5 medium BVR missile (4x, 62 km) fitted for Tejas, Flankers, and light multirole fighters.'
  },
  'R-77-1': {
    id: 'R-77-1', name: 'R-77-1 Adder BVR (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 760, cost: 1.1, rangeKm: 68.0, speedMach: 3.5, seeker: 'ARH', rcs: 0.04,
    trait: 'NETWORKED_LOAL', traitBadge: 'GRID-FIN BVR',
    behaviorDesc: 'Active radar homing BVR missile with lattice grid fins (4x, 68 km, Mach 3.5). Maintains crisp terminal agility during close-in BVR intercepts.',
    damage: 3, ammoCount: 4, minRangeKm: 3.5, sweetSpotMin: 13.0, sweetSpotMax: 52.0,
    lambda: 0.40, p: 1.0, T_0: 0.75, sigmaPylon: 0.06,
    category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Standard Eastern active radar BVR missile (4x, Mach 3.5) compatible with internal bays and external racks.'
  },
  'I-DERBY-ER': {
    id: 'I-DERBY-ER', name: 'I-Derby ER Dual-Pulse (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 472, cost: 1.3, rangeKm: 70.0, speedMach: 4.0, seeker: 'ARH', rcs: 0.025,
    trait: 'DUAL_PULSE_SURGE', traitBadge: '1-SLOT DUAL-PULSE',
    behaviorDesc: 'Lightweight 1-slot dual-pulse active radar missile (4x, 2.5 HP, 70 km, Mach 4.0). Terminal pulse surge defeats late notch maneuvers.',
    damage: 2.5, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 12.0, sweetSpotMax: 58.0,
    lambda: 0.25, p: 1.4, T_0: 0.79, sigmaPylon: 0.04,
    category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Compact 1-slot dual-pulse BVR interceptor (4x, 70 km) engineered for Tejas, Gripen, and F-16V wing rails.'
  },
  'AIM-120D': {
    id: 'AIM-120D', name: 'AIM-120D AMRAAM (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 760, cost: 1.2, rangeKm: 72.0, speedMach: 3.4, seeker: 'ARH', rcs: 0.04,
    trait: 'NETWORKED_LOAL', traitBadge: 'DATALINK LOAL',
    behaviorDesc: 'Standard medium BVR missile. Solid booster accelerates to Mach 3.4 before coasting; receives mid-course datalink updates from friendly aircraft.',
    damage: 3, ammoCount: 4, minRangeKm: 4.0, sweetSpotMin: 14.0, sweetSpotMax: 55.0,
    lambda: 0.40, p: 1.0, T_0: 0.75, sigmaPylon: 0.06,
    category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Fleet standard medium BVR active radar homing missile (4x, Mach 3.4). Compatible with internal stealth bays and external wing pylons.'
  },
  'PL-15E': {
    id: 'PL-15E', name: 'PL-15E Dual-Pulse (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 880, cost: 1.5, rangeKm: 78.0, speedMach: 3.6, seeker: 'ARH', rcs: 0.04,
    trait: 'DUAL_PULSE_SURGE', traitBadge: 'TERMINAL BOOST (+0.9M)',
    behaviorDesc: 'Dual-pulse rocket motor. Pulse 1 boosts to Mach 3.6, then coasts; second pulse ignites at 22km from target (surging to Mach 4.5) to defeat evasive breaks.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 16.0, sweetSpotMax: 62.0,
    lambda: 0.22, p: 1.5, T_0: 0.78, sigmaPylon: 0.08,
    category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Dual-pulse rocket maintaining high terminal kinetic energy (4x, Mach 3.6 to 4.5). Compatible with internal weapon bays and external pylons.'
  },
  'AAM-4B': {
    id: 'AAM-4B', name: 'Type 99 AAM-4B AESA BVR (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 880, cost: 1.7, rangeKm: 82.0, speedMach: 4.0, seeker: 'ARH', rcs: 0.035,
    trait: 'AESA_ANTI_NOTCH', traitBadge: 'AESA MICRO-SEEKER',
    behaviorDesc: 'Active Phased Array seeker BVR missile (4x, 3 HP, 82 km, Mach 4.0). Resists Doppler notching and chaff decoys during terminal intercept.',
    damage: 3, ammoCount: 4, minRangeKm: 4.5, sweetSpotMin: 16.0, sweetSpotMax: 66.0,
    lambda: 0.20, p: 1.5, T_0: 0.82, antiNotchBonus: 0.30, decoyResistance: 0.50, sigmaPylon: 0.08,
    category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'AESA-radar-guided long-range air-to-air missile (4x, 82 km) defeating chaff and Doppler beam maneuvers.'
  },
  'METEOR': {
    id: 'METEOR', name: 'MBDA Meteor (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 860, cost: 1.9, rangeKm: 85.0, speedMach: 4.2, seeker: 'ARH', rcs: 0.04,
    trait: 'RAMJET_SUSTAINED', traitBadge: 'NO SPEED DECAY',
    behaviorDesc: 'Solid-fuel variable-flow ramjet maintains continuous thrust at Mach 4.2 with zero speed decay out to maximum engagement range.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 18.0, sweetSpotMax: 72.0,
    lambda: 0.04, p: 3.0, T_0: 0.84, sigmaPylon: 0.08,
    category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Ramjet-powered BVR missile (4x). Continuous Mach 4.2 cruise with zero drag decay; mounts internally or on external pylons.'
  },
  'ASTRA-MK2': {
    id: 'ASTRA-MK2', name: 'Astra Mk2 Dual-Pulse (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 740, cost: 1.6, rangeKm: 88.0, speedMach: 4.2, seeker: 'ARH', rcs: 0.03,
    trait: 'DUAL_PULSE_SURGE', traitBadge: '88KM DUAL-PULSE BVR',
    behaviorDesc: 'Long-range dual-pulse active radar missile (4x, 88 km, Mach 4.2). Terminal boost surge counters high-speed interceptor disengagements.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 18.0, sweetSpotMax: 74.0,
    lambda: 0.18, p: 1.6, T_0: 0.80, antiNotchBonus: 0.20, sigmaPylon: 0.07,
    category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Long-range dual-pulse BVR interceptor missile (4x, 88 km) compatible with internal stealth bays and external racks.'
  },
  'R-77M': {
    id: 'R-77M', name: 'R-77M Izdeliye 180 (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 790, cost: 1.8, rangeKm: 92.0, speedMach: 4.3, seeker: 'ARH', rcs: 0.02,
    trait: 'DUAL_PULSE_SURGE', traitBadge: '92KM INTERNAL DUAL-PULSE',
    behaviorDesc: 'Conventional-fin stealth-bay dual-pulse BVR missile (4x, 92 km, Mach 4.3). Upgraded AESA seeker penetrates jamming to lock fleeing fighters.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 20.0, sweetSpotMax: 78.0,
    lambda: 0.16, p: 1.6, T_0: 0.82, antiNotchBonus: 0.25, sigmaPylon: 0.06,
    category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Internal-bay stealth dual-pulse BVR missile (4x, 92 km) built for Su-57, Su-75, and modernized Flankers.'
  }
};
