/**
 * js/data/weapons/a2aramjet.js - Sustained-Thrust Ramjet BVR and Home-On-Jam / Anti-Emitter A2A Missiles.
 */

window.WEAPONS_A2A_RAMJET = {
  'METEOR': {
    id: 'METEOR', name: 'MBDA Meteor (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 860, cost: 1.9, rangeKm: 85.0, speedMach: 4.2, seeker: 'ARH', rcs: 0.04,
    trait: 'RAMJET_SUSTAINED', traitBadge: 'NO SPEED DECAY',
    behaviorDesc: 'Solid-fuel variable-flow ramjet maintains continuous thrust at Mach 4.2 with zero speed decay out to maximum engagement range.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 18.0, sweetSpotMax: 72.0,
    lambda: 0.04, p: 3.0, T_0: 0.84, sigmaPylon: 0.08, category: 'A2A', a2aGroup: 'RAMJET_BVR',
    desc: 'Ramjet-powered BVR missile (4x). Continuous Mach 4.2 cruise with zero drag decay; mounts internally or on external pylons.'
  },
  'FMRAAM': {
    id: 'FMRAAM', name: 'BAe FMRAAM Ducted Ramjet (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 840, cost: 2.1, rangeKm: 92.0, speedMach: 4.3, seeker: 'ARH', rcs: 0.035,
    trait: 'RAMJET_SUSTAINED', traitBadge: '92KM RAMJET BVR',
    behaviorDesc: 'AMRAAM-sized solid-fuel ducted ramjet (4x, 3 HP, 92 km, Mach 4.3) sustaining terminal energy across wide BVR envelopes.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 18.0, sweetSpotMax: 80.0,
    lambda: 0.04, p: 3.0, T_0: 0.84, sigmaPylon: 0.07, category: 'A2A', a2aGroup: 'RAMJET_BVR',
    desc: 'Sustained-thrust Future Medium-Range Air-to-Air Ramjet (4x, 92 km) fitting internal stealth bays.'
  },
  'GOKHAN': {
    id: 'GOKHAN', name: 'Gokhan Ramjet BVR (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 850, cost: 2.0, rangeKm: 90.0, speedMach: 4.2, seeker: 'ARH', rcs: 0.035,
    trait: 'RAMJET_SUSTAINED', traitBadge: '90KM RAMJET BVR',
    behaviorDesc: 'Liquid/solid throttleable ramjet BVR missile (4x, 3 HP, 90 km, Mach 4.2) maintaining high late-stage energy for TF Kaan and F-16V.',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 18.0, sweetSpotMax: 78.0,
    lambda: 0.04, p: 3.0, T_0: 0.83, sigmaPylon: 0.07, category: 'A2A', a2aGroup: 'RAMJET_BVR',
    desc: 'Throttleable ramjet long-range air-to-air missiles (4x, 90 km) compatible with internal bays.'
  },
  'JNAAM': {
    id: 'JNAAM', name: 'JNAAM Meteor-AESA (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 870, cost: 2.4, rangeKm: 96.0, speedMach: 4.4, seeker: 'ARH', rcs: 0.03,
    trait: 'RAMJET_SUSTAINED', traitBadge: 'RAMJET + AESA ANTI-NOTCH',
    behaviorDesc: 'Joint New Air-to-Air Missile pairing Meteor ramjet propulsion with an AAM-4B micro-AESA seeker (4x, 3 HP, 96 km, +30% anti-notch).',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 20.0, sweetSpotMax: 84.0,
    lambda: 0.04, p: 3.0, T_0: 0.86, antiNotchBonus: 0.30, decoyResistance: 0.50, sigmaPylon: 0.07, category: 'A2A', a2aGroup: 'RAMJET_BVR',
    desc: 'AESA-guided ramjet BVR interceptor (4x, 96 km) resisting both speed decay and Doppler notching.'
  },
  'RVV-AE-PD': {
    id: 'RVV-AE-PD', name: 'RVV-AE-PD Ramjet Adder (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 890, cost: 2.2, rangeKm: 95.0, speedMach: 4.3, seeker: 'ARH', rcs: 0.035,
    trait: 'RAMJET_SUSTAINED', traitBadge: '95KM RAMJET ADDER',
    behaviorDesc: 'Four-intake ducted ramjet Adder derivative (4x, 3.5 HP, 95 km, Mach 4.3) sustaining terminal energy against agile fighters.',
    damage: 3.5, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 20.0, sweetSpotMax: 82.0,
    lambda: 0.04, p: 3.0, T_0: 0.84, sigmaPylon: 0.08, category: 'A2A', a2aGroup: 'RAMJET_BVR',
    desc: 'Ramjet-powered R-77 variant (4x, 95 km, 3.5 HP) engineered for Su-57, Su-35S, and MiG-35S.'
  },
  'ASTRA-MK3': {
    id: 'ASTRA-MK3', name: 'Astra Mk3 Gandiva SFDR (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 860, cost: 2.7, rangeKm: 115.0, speedMach: 4.5, seeker: 'ARH', rcs: 0.015,
    trait: 'RAMJET_SUSTAINED', traitBadge: '115KM SFDR RAMJET',
    behaviorDesc: 'Solid-Fuel Ducted Ramjet BVR missile (4x, 3.5 HP, 115 km, Mach 4.5). Zero cruise drag decay sustains high terminal energy across the entire theater.',
    damage: 3.5, ammoCount: 4, minRangeKm: 6.0, sweetSpotMin: 22.0, sweetSpotMax: 100.0,
    lambda: 0.04, p: 3.0, T_0: 0.85, antiNotchBonus: 0.25, sigmaPylon: 0.06, category: 'A2A', a2aGroup: 'RAMJET_BVR',
    desc: 'Solid-fuel ducted ramjet ultra-long-range BVR missile (4x, 115 km, Mach 4.5) with zero velocity decay.'
  },
  'AIM-152': {
    id: 'AIM-152', name: 'AIM-152 AAAM Dual-Mode (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1340, cost: 3.0, rangeKm: 130.0, speedMach: 5.0, seeker: 'ARH', rcs: 0.08,
    trait: 'RAMJET_SUSTAINED', traitBadge: 'MACH 5.0 RAMJET ULR',
    behaviorDesc: 'Integral rocket-ramjet heavy fleet interceptor (2x, 5 HP, 130 km, Mach 5.0). Maintains Mach 5.0 ramjet cruise to intercept bombers and supersonic fighters.',
    damage: 5, ammoCount: 2, minRangeKm: 10.0, sweetSpotMin: 26.0, sweetSpotMax: 112.0,
    lambda: 0.06, p: 2.5, T_0: 0.80, heavyTargetBonus: true, sigmaPylon: 0.18, category: 'A2A', a2aGroup: 'RAMJET_BVR',
    desc: 'High-speed Mach 5.0 fleet-defense ramjet interceptor (2x, 130 km) for heavy outer-air-battle patrols.'
  },
  'PL-21': {
    id: 'PL-21', name: 'PL-21 Hypersonic BVR (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1350, cost: 3.0, rangeKm: 130.0, speedMach: 4.5, seeker: 'ARH', rcs: 0.06,
    trait: 'EXTREME_STANDOFF', traitBadge: '130KM RAMJET STANDOFF',
    behaviorDesc: 'Ultra-long-range ramjet missile providing theater-wide perimeter interception at sustained Mach 4.5 against high-value targets.',
    damage: 5, ammoCount: 2, minRangeKm: 12.0, sweetSpotMin: 28.0, sweetSpotMax: 110.0,
    lambda: 0.06, p: 2.2, T_0: 0.78, sigmaPylon: 0.18, category: 'A2A', a2aGroup: 'RAMJET_BVR',
    desc: 'Extreme standoff ramjet interceptor (2x, Mach 4.5). Requires external heavy pylons due to oversized ramjet airframe length.'
  },
  'R-27P': {
    id: 'R-27P', name: 'R-27P Alamo Anti-Emitter (2x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 500, cost: 0.9, rangeKm: 68.0, speedMach: 4.0, seeker: 'PASSIVE_RADAR', rcs: 0.06,
    trait: 'HOME_ON_JAM', traitBadge: 'PASSIVE ANTI-RADAR A2A',
    behaviorDesc: 'Passive RF seeker missile (2x, 3.5 HP, 68 km, Mach 4.0) homing silently onto active enemy airborne radars and EW jammers (+15% Pk vs EW/Jammers).',
    damage: 3.5, ammoCount: 2, minRangeKm: 3.5, sweetSpotMin: 14.0, sweetSpotMax: 58.0,
    lambda: 0.28, p: 1.2, T_0: 0.76, hojBonus: 0.15, antiNotchBonus: 0.30, sigmaPylon: 0.08, category: 'A2A', a2aGroup: 'HOJ_A2A',
    desc: 'Passive anti-radiation air-to-air missiles (2x, 68 km) built to snipe EW escorts and active radars.'
  },
  'R-27EP': {
    id: 'R-27EP', name: 'R-27EP Extended Anti-EW (2x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 690, cost: 1.4, rangeKm: 95.0, speedMach: 4.5, seeker: 'PASSIVE_RADAR', rcs: 0.07,
    trait: 'HOME_ON_JAM', traitBadge: '95KM ANTI-JAMMER A2A',
    behaviorDesc: 'Long-range passive anti-radiation A2A missile (2x, 4.5 HP, 95 km, Mach 4.5). Punishes EW jammers and high-power interceptors (+18% Pk vs EW).',
    damage: 4.5, ammoCount: 2, minRangeKm: 5.0, sweetSpotMin: 20.0, sweetSpotMax: 84.0,
    lambda: 0.22, p: 1.2, T_0: 0.78, hojBonus: 0.18, antiNotchBonus: 0.35, sigmaPylon: 0.10, category: 'A2A', a2aGroup: 'HOJ_A2A',
    desc: 'Extended-range Mach 4.5 passive RF missile (2x, 95 km) designed to destroy standoff jammers.'
  },
  'AIM-120D-HOJ': {
    id: 'AIM-120D-HOJ', name: 'AIM-120D-HOJ Counter-EW (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 770, cost: 1.7, rangeKm: 78.0, speedMach: 3.6, seeker: 'ARH', rcs: 0.035,
    trait: 'HOME_ON_JAM', traitBadge: '+15% PK VS JAMMERS',
    behaviorDesc: 'Dedicated Home-On-Jam AMRAAM variant (4x, 3 HP, 78 km, Mach 3.6). Locks directly onto active jamming noise (+15% Pk vs EW, +35% anti-notch).',
    damage: 3, ammoCount: 4, minRangeKm: 4.0, sweetSpotMin: 16.0, sweetSpotMax: 66.0,
    lambda: 0.32, p: 1.2, T_0: 0.78, hojBonus: 0.15, antiNotchBonus: 0.35, sigmaPylon: 0.06, category: 'A2A', a2aGroup: 'HOJ_A2A',
    desc: 'Internal-bay Home-On-Jam BVR missile (4x, 78 km) countering EA-18G, J-16D, and EA-36 jamming screens.'
  },
  'PL-15-HOJ': {
    id: 'PL-15-HOJ', name: 'PL-15B Home-On-Jam (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 890, cost: 2.0, rangeKm: 88.0, speedMach: 4.0, seeker: 'ARH', rcs: 0.035,
    trait: 'HOME_ON_JAM', traitBadge: '88KM HOJ DUAL-PULSE',
    behaviorDesc: 'Broadband HOJ AESA seeker on a dual-pulse body (4x, 3 HP, 88 km, Mach 4.0). Turns enemy jamming emissions into a homing beacon (+16% Pk vs EW).',
    damage: 3, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 18.0, sweetSpotMax: 74.0,
    lambda: 0.20, p: 1.4, T_0: 0.80, hojBonus: 0.16, antiNotchBonus: 0.38, sigmaPylon: 0.07, category: 'A2A', a2aGroup: 'HOJ_A2A',
    desc: 'Home-On-Jam AESA dual-pulse BVR missiles (4x, 88 km) defeating electronic warfare escorts.'
  },
  'AIM-260B-HOJ': {
    id: 'AIM-260B-HOJ', name: 'AIM-260B Broad-Band HOJ (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 830, cost: 3.6, rangeKm: 118.0, speedMach: 4.4, seeker: 'ARH', rcs: 0.0005, isStealthMissile: true,
    trait: 'STEALTH_SEEKER', traitBadge: 'STEALTH + 118KM HOJ',
    behaviorDesc: 'VLO stealth BVR missile with passive/active broadband HOJ seeker (4x, 3.5 HP, 118 km). Combines 0.0005m2 stealth with +16% Pk against EW jammers.',
    damage: 3.5, ammoCount: 4, minRangeKm: 7.0, sweetSpotMin: 22.0, sweetSpotMax: 100.0,
    lambda: 0.14, p: 1.8, T_0: 0.86, hojBonus: 0.16, antiNotchBonus: 0.40, sigmaPylon: 0.04, category: 'A2A', a2aGroup: 'HOJ_A2A',
    desc: 'Next-gen stealth Home-On-Jam interceptor (4x, 118 km) sized for 5th/6th-gen internal bays.'
  }
};
