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
    id: 'ASTRA-MK2', name: 'Astra Mk2 Dual-Pulse (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 740, cost: 1.6, rangeKm: 88.0, speedMach: 4.1, seeker: 'ARH', rcs: 0.04,
    trait: 'DUAL_PULSE_SURGE', traitBadge: '88KM DUAL-PULSE BVR',
    behaviorDesc: 'Long-range dual-pulse active radar missile (4x, 88 km, Mach 4.1). Terminal boost surge counters high-speed interceptor disengagements.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 18.0, sweetSpotMax: 74.0,
    lambda: 0.18, p: 1.6, T_0: 0.80, sigmaPylon: 0.09,
    category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Long-range dual-pulse BVR interceptor missile (4x, 88 km) for multirole and air superiority fighters.'
  }
};
