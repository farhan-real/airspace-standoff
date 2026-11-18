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
    lambda: 0.42, p: 1.0, T_0: 0.78, sigmaPylon: 0.04, category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Compact 1-slot active radar BVR/WVR missile (4x, 58 km) with thrust-vector agility for light fighters and interdictors.'
  },
  'R-77': {
    id: 'R-77', name: 'R-77 Base Adder (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 700, cost: 0.7, rangeKm: 56.0, speedMach: 3.4, seeker: 'ARH', rcs: 0.045,
    trait: 'NETWORKED_LOAL', traitBadge: 'BUDGET ADDER BVR',
    behaviorDesc: 'Baseline lattice-fin active radar missile (4x, 3 HP, 56 km, Mach 3.4). Lowest-cost fire-and-forget active BVR option.',
    damage: 3, ammoCount: 4, minRangeKm: 3.0, sweetSpotMin: 11.0, sweetSpotMax: 43.0,
    lambda: 0.44, p: 1.0, T_0: 0.72, sigmaPylon: 0.06, category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Cost-effective baseline active radar Adder missiles (4x, 56 km).'
  },
  'ASTRA-MK1': {
    id: 'ASTRA-MK1', name: 'Astra Mk1 Active BVR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 615, cost: 1.0, rangeKm: 62.0, speedMach: 4.5, seeker: 'ARH', rcs: 0.035,
    trait: 'HIGH_MACH_SPRINT', traitBadge: '1-SLOT MACH 4.5 BVR',
    behaviorDesc: 'High-speed smokeless active radar BVR missile (4x, 3 HP, 62 km, Mach 4.5). Occupies 1 slot with strong ECCM resistance.',
    damage: 3, ammoCount: 4, minRangeKm: 2.5, sweetSpotMin: 11.0, sweetSpotMax: 50.0,
    lambda: 0.36, p: 1.1, T_0: 0.77, sigmaPylon: 0.05, category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Compact high-velocity Mach 4.5 medium BVR missile (4x, 62 km) fitted for Tejas, Flankers, and light multirole fighters.'
  },
  'PL-12': {
    id: 'PL-12', name: 'PL-12 / SD-10A Active BVR (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 790, cost: 0.9, rangeKm: 64.0, speedMach: 3.6, seeker: 'ARH', rcs: 0.04,
    trait: 'NETWORKED_LOAL', traitBadge: '64KM BUDGET ACTIVE BVR',
    behaviorDesc: 'Fast active-radar medium BVR missile (4x, 3 HP, 64 km, Mach 3.6). Heavier than AIM-120C-7 (790 kg) for slightly lower cost.',
    damage: 3, ammoCount: 4, minRangeKm: 3.0, sweetSpotMin: 12.0, sweetSpotMax: 50.0,
    lambda: 0.42, p: 1.0, T_0: 0.74, sigmaPylon: 0.06, category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Economical Mach 3.6 active-radar BVR missiles (4x, 64 km) certified for internal bays and multirole pylons.'
  },
  'AIM-120C-7': {
    id: 'AIM-120C-7', name: 'AIM-120C-7 AMRAAM (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 640, cost: 1.0, rangeKm: 66.0, speedMach: 3.4, seeker: 'ARH', rcs: 0.03,
    trait: 'NETWORKED_LOAL', traitBadge: 'LIGHTWEIGHT AMRAAM',
    behaviorDesc: 'Clipped-fin lightweight AMRAAM (4x, 3 HP, 66 km, 640 kg). Lighter carriage mass and lower 0.03m2 RCS than PL-12 or R-77-1.',
    damage: 3, ammoCount: 4, minRangeKm: 3.5, sweetSpotMin: 12.0, sweetSpotMax: 52.0,
    lambda: 0.41, p: 1.0, T_0: 0.75, sigmaPylon: 0.05, category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Lightweight clipped-fin medium BVR AMRAAM (4x, 66 km) saving $0.2M and 120 kg over AIM-120D.'
  },
  'GOKDOGAN': {
    id: 'GOKDOGAN', name: 'Goktug Gokdogan BVR (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 720, cost: 1.1, rangeKm: 66.0, speedMach: 3.7, seeker: 'ARH', rcs: 0.03,
    trait: 'NETWORKED_LOAL', traitBadge: '66KM SOLID-STATE BVR',
    behaviorDesc: 'Solid-state active radar BVR missile with smokeless motor (4x, 3 HP, 66 km, Mach 3.7) built for TF Kaan and F-16V.',
    damage: 3, ammoCount: 4, minRangeKm: 3.0, sweetSpotMin: 12.0, sweetSpotMax: 53.0,
    lambda: 0.39, p: 1.0, T_0: 0.76, sigmaPylon: 0.05, category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Smokeless solid-state active-radar BVR missiles (4x, 66 km) compatible with internal stealth bays.'
  },
  'R-77-1': {
    id: 'R-77-1', name: 'R-77-1 Adder BVR (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 760, cost: 1.1, rangeKm: 68.0, speedMach: 3.5, seeker: 'ARH', rcs: 0.04,
    trait: 'NETWORKED_LOAL', traitBadge: 'GRID-FIN BVR',
    behaviorDesc: 'Active radar homing BVR missile with lattice grid fins (4x, 68 km, Mach 3.5). Maintains crisp terminal agility during close-in BVR intercepts.',
    damage: 3, ammoCount: 4, minRangeKm: 3.5, sweetSpotMin: 13.0, sweetSpotMax: 52.0,
    lambda: 0.40, p: 1.0, T_0: 0.75, sigmaPylon: 0.06, category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Standard Eastern active radar BVR missile (4x, Mach 3.5) compatible with internal bays and external racks.'
  },
  'AAM-4': {
    id: 'AAM-4', name: 'Type 99 AAM-4 Active BVR (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 880, cost: 1.2, rangeKm: 70.0, speedMach: 3.8, seeker: 'ARH', rcs: 0.04,
    trait: 'NETWORKED_LOAL', traitBadge: '70KM MACH 3.8 BVR',
    behaviorDesc: 'High-speed medium active-radar missile (4x, 3 HP, 70 km, Mach 3.8) engineered for F-2A and F-15J.',
    damage: 3, ammoCount: 4, minRangeKm: 3.5, sweetSpotMin: 14.0, sweetSpotMax: 56.0,
    lambda: 0.36, p: 1.1, T_0: 0.77, sigmaPylon: 0.07, category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Mach 3.8 medium-range active radar BVR missiles (4x, 70 km).'
  },
  'I-DERBY-ER': {
    id: 'I-DERBY-ER', name: 'I-Derby ER Dual-Pulse (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 472, cost: 1.3, rangeKm: 70.0, speedMach: 4.0, seeker: 'ARH', rcs: 0.025,
    trait: 'DUAL_PULSE_SURGE', traitBadge: '1-SLOT DUAL-PULSE',
    behaviorDesc: 'Lightweight 1-slot dual-pulse active radar missile (4x, 2.5 HP, 70 km, Mach 4.0). Terminal pulse surge defeats late notch maneuvers.',
    damage: 2.5, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 12.0, sweetSpotMax: 58.0,
    lambda: 0.25, p: 1.4, T_0: 0.79, sigmaPylon: 0.04, category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Compact 1-slot dual-pulse BVR interceptor (4x, 70 km) engineered for Tejas, Gripen, and F-16V wing rails.'
  },
  'AIM-120D': {
    id: 'AIM-120D', name: 'AIM-120D AMRAAM (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 760, cost: 1.2, rangeKm: 72.0, speedMach: 3.4, seeker: 'ARH', rcs: 0.04,
    trait: 'NETWORKED_LOAL', traitBadge: 'DATALINK LOAL',
    behaviorDesc: 'Standard medium BVR missile. Solid booster accelerates to Mach 3.4 before coasting; receives mid-course datalink updates from friendly aircraft.',
    damage: 3, ammoCount: 4, minRangeKm: 4.0, sweetSpotMin: 14.0, sweetSpotMax: 55.0,
    lambda: 0.40, p: 1.0, T_0: 0.75, sigmaPylon: 0.06, category: 'A2A', a2aGroup: 'MR_BVR',
    desc: 'Fleet standard medium BVR active radar homing missile (4x, Mach 3.4). Compatible with internal stealth bays and external wing pylons.'
  },
  'PL-15E': {
    id: 'PL-15E', name: 'PL-15E Dual-Pulse (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 880, cost: 1.5, rangeKm: 78.0, speedMach: 3.6, seeker: 'ARH', rcs: 0.04,
    trait: 'DUAL_PULSE_SURGE', traitBadge: 'TERMINAL BOOST (+0.9M)',
    behaviorDesc: 'Dual-pulse rocket motor. Pulse 1 boosts to Mach 3.6, then coasts; second pulse ignites at 22km from target (surging to Mach 4.5) to defeat evasive breaks.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 16.0, sweetSpotMax: 62.0,
    lambda: 0.22, p: 1.5, T_0: 0.78, sigmaPylon: 0.08, category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Dual-pulse rocket maintaining high terminal kinetic energy (4x, Mach 3.6 to 4.5). Compatible with internal weapon bays and external pylons.'
  },
  'TC-2C': {
    id: 'TC-2C', name: 'Sky Sword II-C Extended (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 740, cost: 1.4, rangeKm: 80.0, speedMach: 4.0, seeker: 'ARH', rcs: 0.04,
    trait: 'HIGH_MACH_SPRINT', traitBadge: '80KM MACH 4.0 BVR',
    behaviorDesc: 'Extended-burn Mach 4.0 active radar missile (4x, 3 HP, 80 km) offering economical external-pylon long-range interception.',
    damage: 3, ammoCount: 4, minRangeKm: 4.0, sweetSpotMin: 15.0, sweetSpotMax: 64.0,
    lambda: 0.26, p: 1.3, T_0: 0.78, sigmaPylon: 0.07, category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Long-range Mach 4.0 active radar interceptor missiles (4x, 80 km).'
  },
  'AAM-4B': {
    id: 'AAM-4B', name: 'Type 99 AAM-4B AESA BVR (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 880, cost: 1.7, rangeKm: 82.0, speedMach: 4.0, seeker: 'ARH', rcs: 0.035,
    trait: 'AESA_ANTI_NOTCH', traitBadge: 'AESA MICRO-SEEKER',
    behaviorDesc: 'Active Phased Array seeker BVR missile (4x, 3 HP, 82 km, Mach 4.0). Resists Doppler notching and chaff decoys during terminal intercept.',
    damage: 3, ammoCount: 4, minRangeKm: 4.5, sweetSpotMin: 16.0, sweetSpotMax: 66.0,
    lambda: 0.20, p: 1.5, T_0: 0.82, antiNotchBonus: 0.30, decoyResistance: 0.50, sigmaPylon: 0.08, category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'AESA-radar-guided long-range air-to-air missile (4x, 82 km) defeating chaff and Doppler beam maneuvers.'
  },
  'ASTRA-MK2': {
    id: 'ASTRA-MK2', name: 'Astra Mk2 Dual-Pulse (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 740, cost: 1.6, rangeKm: 88.0, speedMach: 4.2, seeker: 'ARH', rcs: 0.03,
    trait: 'DUAL_PULSE_SURGE', traitBadge: '88KM DUAL-PULSE BVR',
    behaviorDesc: 'Long-range dual-pulse active radar missile (4x, 88 km, Mach 4.2). Terminal boost surge counters high-speed interceptor disengagements.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 18.0, sweetSpotMax: 74.0,
    lambda: 0.18, p: 1.6, T_0: 0.80, antiNotchBonus: 0.20, sigmaPylon: 0.07, category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Long-range dual-pulse BVR interceptor missile (4x, 88 km) compatible with internal stealth bays and external racks.'
  },
  'AIM-120D-3': {
    id: 'AIM-120D-3', name: 'AIM-120D-3 F3R AMRAAM (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 775, cost: 1.8, rangeKm: 88.0, speedMach: 3.9, seeker: 'ARH', rcs: 0.03,
    trait: 'AESA_ANTI_NOTCH', traitBadge: '88KM F3R ANTI-NOTCH',
    behaviorDesc: 'Form, Fit, Function Refresh AMRAAM (4x, 3 HP, 88 km, Mach 3.9). Upgraded guidance cards add +25% notch resistance and +40% decoy rejection.',
    damage: 3, ammoCount: 4, minRangeKm: 4.5, sweetSpotMin: 18.0, sweetSpotMax: 74.0,
    lambda: 0.20, p: 1.4, T_0: 0.82, antiNotchBonus: 0.25, decoyResistance: 0.40, sigmaPylon: 0.06, category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Modernized F3R AMRAAM (4x, 88 km) with enhanced anti-notch and countermeasure discrimination.'
  },
  'R-77M': {
    id: 'R-77M', name: 'R-77M Izdeliye 180 (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 790, cost: 1.8, rangeKm: 92.0, speedMach: 4.3, seeker: 'ARH', rcs: 0.02,
    trait: 'DUAL_PULSE_SURGE', traitBadge: '92KM INTERNAL DUAL-PULSE',
    behaviorDesc: 'Conventional-fin stealth-bay dual-pulse BVR missile (4x, 92 km, Mach 4.3). Upgraded AESA seeker penetrates jamming to lock fleeing fighters.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 20.0, sweetSpotMax: 78.0,
    lambda: 0.16, p: 1.6, T_0: 0.82, antiNotchBonus: 0.25, sigmaPylon: 0.06, category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Internal-bay stealth dual-pulse BVR missile (4x, 92 km) built for Su-57, Su-75, and modernized Flankers.'
  },
  'PL-15': {
    id: 'PL-15', name: 'PL-15 Domestic Long-BVR (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 890, cost: 2.1, rangeKm: 98.0, speedMach: 4.2, seeker: 'ARH', rcs: 0.03,
    trait: 'DUAL_PULSE_SURGE', traitBadge: '98KM 3.5HP DUAL-PULSE',
    behaviorDesc: 'Full-length domestic AESA dual-pulse missile (4x, 3.5 HP, 98 km, Mach 4.2). Heavier 890 kg mass adds +0.5 HP warhead punch vs PL-15E.',
    damage: 3.5, ammoCount: 4, minRangeKm: 5.5, sweetSpotMin: 20.0, sweetSpotMax: 82.0,
    lambda: 0.16, p: 1.5, T_0: 0.82, antiNotchBonus: 0.25, sigmaPylon: 0.07, category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Long-range AESA dual-pulse BVR missile (4x, 98 km, 3.5 HP) fitted for J-20, J-35, and J-16.'
  },
  'K-77ME': {
    id: 'K-77ME', name: 'K-77ME Extended Dual-Pulse (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 860, cost: 2.4, rangeKm: 104.0, speedMach: 4.5, seeker: 'ARH', rcs: 0.02,
    trait: 'DUAL_PULSE_SURGE', traitBadge: '104KM MACH 4.5 DUAL-PULSE',
    behaviorDesc: 'Premium extended-reach Mach 4.5 AESA dual-pulse missile (4x, 3.5 HP, 104 km). Major standoff and terminal speed jump over R-77M ($1.8M -> $2.4M).',
    damage: 3.5, ammoCount: 4, minRangeKm: 6.0, sweetSpotMin: 22.0, sweetSpotMax: 88.0,
    lambda: 0.14, p: 1.5, T_0: 0.84, antiNotchBonus: 0.30, sigmaPylon: 0.06, category: 'A2A', a2aGroup: 'LR_BVR',
    desc: 'Extended Mach 4.5 dual-pulse stealth-bay BVR missile (4x, 104 km, 3.5 HP) for 5th-Gen interceptors.'
  }
};
