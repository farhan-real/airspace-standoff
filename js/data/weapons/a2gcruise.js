/**
 * js/data/weapons/a2gcruise.js - Standoff subsonic, stealth, supersonic ramjet, and hypersonic cruise missiles.
 */

window.WEAPONS_A2G_CRUISE = {
  'SOM-J': {
    id: 'SOM-J', name: 'SOM-J Compact Stealth Cruise (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 2160, cost: 1.6, rangeKm: 85.0, speedMach: 0.85, seeker: 'IIR', rcs: 0.0008, isStealthMissile: true,
    trait: 'STEALTH_CRUISE', traitBadge: '4x INTERNAL CRUISE',
    behaviorDesc: 'Compact low-observable cruise missile (4x, 6 HP, 85 km). Fits inside F-35A and J-20 internal bays for high-volume stealth salvo saturation.',
    damage: 6, ammoCount: 4, minRangeKm: 8.0, sweetSpotMin: 20.0, sweetSpotMax: 78.0, lambda: 0.05, p: 1.0, T_0: 0.90,
    isBunkerCracker: true, sigmaPylon: 0.16, category: 'A2G', a2gGroup: 'CRUISE',
    desc: 'Compact stealth standoff cruise missiles (4x, 85 km) built to saturate CIWS defenses from internal bays.'
  },
  'AGM-84H': {
    id: 'AGM-84H', name: 'AGM-84H SLAM-ER (2x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1350, cost: 1.4, rangeKm: 88.0, speedMach: 0.85, seeker: 'IIR', rcs: 0.02,
    trait: 'DATALINK_STANDOFF', traitBadge: '88KM PRECISION CRUISE',
    behaviorDesc: 'Man-in-the-loop standoff cruise missile (2x, 8 HP, 88 km). Strong precision warhead at economical standoff cost.',
    damage: 8, ammoCount: 2, minRangeKm: 8.0, sweetSpotMin: 20.0, sweetSpotMax: 80.0, lambda: 0.05, p: 1.0, T_0: 0.89,
    isBunkerCracker: true, sigmaPylon: 0.24, category: 'A2G', a2gGroup: 'CRUISE',
    desc: 'Economical heavy standoff cruise missiles (2x, 88 km) for multirole carrier and strike platforms.'
  },
  'KH-59MK2': {
    id: 'KH-59MK2', name: 'Kh-59MK2 Stealth Cruise (2x)', slots: 3, slotType: 'INTERNAL', minRating: 'Type H',
    mass: 1800, cost: 1.8, rangeKm: 96.0, speedMach: 0.85, seeker: 'IIR', rcs: 0.0008, isStealthMissile: true,
    trait: 'STEALTH_CRUISE', traitBadge: '96KM STEALTH PENETRATOR',
    behaviorDesc: 'Square-section stealth airframe (2x, 9 HP, 96 km). Low radar cross-section delays CIWS detection until terminal dive.',
    damage: 9, ammoCount: 2, minRangeKm: 8.0, sweetSpotMin: 22.0, sweetSpotMax: 88.0, lambda: 0.05, p: 1.0, T_0: 0.90,
    isBunkerCracker: true, sigmaPylon: 0.24, category: 'A2G', a2gGroup: 'CRUISE',
    desc: 'Low-observable tactical standoff cruise missile (2x, 96 km) sized for Su-57 internal bays and Flanker pylons.'
  },
  'STORM-SHADOW': {
    id: 'STORM-SHADOW', name: 'Storm Shadow SCALP-EG (2x)', slots: 4, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 2600, cost: 2.3, rangeKm: 105.0, speedMach: 0.88, seeker: 'IIR', rcs: 0.001, isStealthMissile: true,
    trait: 'STEALTH_CRUISE', traitBadge: 'BROACH 12HP CRUISE',
    behaviorDesc: 'Stealthy deep-strike cruise missile with tandem BROACH penetrator (2x, 12 HP, 105 km). Neutralizes C2 bunkers and runways from standoff range.',
    damage: 12, ammoCount: 2, minRangeKm: 10.0, sweetSpotMin: 24.0, sweetSpotMax: 95.0, lambda: 0.05, p: 1.0, T_0: 0.92,
    isBunkerCracker: true, sigmaPylon: 0.30, category: 'A2G', a2gGroup: 'CRUISE',
    desc: 'Long-range European stealth penetrator cruise missiles (2x, 105 km) built for fortified infrastructure.'
  },
  'AGM-158B': {
    id: 'AGM-158B', name: 'AGM-158B JASSM-ER (2x)', slots: 4, slotType: 'INTERNAL', minRating: 'Type H',
    mass: 2600, cost: 2.6, rangeKm: 110.0, speedMach: 0.85, seeker: 'IIR', rcs: 0.0005, isStealthMissile: true,
    trait: 'STEALTH_CRUISE', traitBadge: '0.0005m2 STEALTH CRUISE',
    behaviorDesc: 'Low-observable cruise body penetrates surface SAM rings undetected in low-altitude subsonic cruise (Mach 0.85) until terminal descent.',
    damage: 10, ammoCount: 2, minRangeKm: 10.0, sweetSpotMin: 25.0, sweetSpotMax: 100.0, lambda: 0.05, p: 1.0, T_0: 0.92,
    isBunkerCracker: true, sigmaPylon: 0.35, category: 'A2G', a2gGroup: 'CRUISE',
    desc: 'Heavy long-range subsonic stealth cruise missiles (2x, Mach 0.85). Fits inside stealth bomber rotary bays or mounts on external heavy pylons.'
  },
  'AGM-158C': {
    id: 'AGM-158C', name: 'AGM-158C LRASM Autonomous (2x)', slots: 3, slotType: 'INTERNAL', minRating: 'Type H',
    mass: 2500, cost: 2.9, rangeKm: 120.0, speedMach: 0.88, seeker: 'MMW_IIR', rcs: 0.0005, isStealthMissile: true,
    trait: 'STEALTH_CRUISE', traitBadge: '120KM MULTI-SENSOR STEALTH',
    behaviorDesc: 'Autonomous multi-sensor stealth cruise missile (2x, 11 HP, 120 km). Cuts through heavy ground jamming and weather clouds to neutralize hardened sites.',
    damage: 11, ammoCount: 2, minRangeKm: 10.0, sweetSpotMin: 26.0, sweetSpotMax: 110.0, lambda: 0.04, p: 1.0, T_0: 0.93,
    isBunkerCracker: true, sigmaPylon: 0.32, category: 'A2G', a2gGroup: 'CRUISE',
    desc: 'Autonomous stealth multi-mode standoff cruise missiles (2x, 120 km) compatible with heavy bays and external pylons.'
  },
  'KH-101': {
    id: 'KH-101', name: 'Kh-101 Strategic VLO Cruise (2x)', slots: 4, slotType: 'INTERNAL', minRating: 'Type X',
    mass: 4800, cost: 2.8, rangeKm: 145.0, speedMach: 0.82, seeker: 'IIR', rcs: 0.0006, isStealthMissile: true,
    trait: 'STEALTH_CRUISE', traitBadge: '145KM STRATEGIC CRUISE',
    behaviorDesc: 'Ultra-long-range strategic VLO cruise missile (2x, 14 HP, 145 km). Strikes deep rear C2 bunkers and runways from friendly airspace.',
    damage: 14, ammoCount: 2, minRangeKm: 12.0, sweetSpotMin: 30.0, sweetSpotMax: 135.0, lambda: 0.04, p: 1.0, T_0: 0.92,
    isBunkerCracker: true, sigmaPylon: 0.40, category: 'A2G', a2gGroup: 'CRUISE',
    allowedAirframes: ['Tu-160M', 'B-1B', 'B-52H', 'B-21', 'B-2A'],
    desc: 'Strategic heavy stealth cruise missiles (2x, 145 km) restricted to Type X strategic heavy bombers.'
  },
  'BRAHMOS-A': {
    id: 'BRAHMOS-A', name: 'BrahMos-A Supersonic Ramjet (1x)', slots: 6, slotType: 'CENTERLINE', minRating: 'Type H',
    mass: 2550, cost: 3.2, rangeKm: 125.0, speedMach: 3.0, seeker: 'INS', rcs: 0.08,
    trait: 'SUPERSONIC_CRUISE_RAMJET', traitBadge: 'MACH 3.0 RAMJET CRUISE',
    behaviorDesc: 'Supersonic Mach 3.0 sea-skimming ramjet cruise missile (1x, 16 HP, 125 km). High kinetic velocity penetrates SeaRAM and Pantsir defense zones.',
    damage: 16, ammoCount: 1, minRangeKm: 12.0, sweetSpotMin: 25.0, sweetSpotMax: 115.0, lambda: 0.04, p: 2.0, T_0: 0.94,
    isBunkerCracker: true, sigmaPylon: 0.45, category: 'A2G', a2gGroup: 'CRUISE',
    allowedAirframes: ['Su-30SM', 'Su-34', 'Su-35S', 'Su-24M2', 'Tu-160M', 'MiG-31BM', 'J-16'],
    desc: 'Centerline Mach 3.0 supersonic ramjet standoff missile (1x, 16 HP) resisting CIWS point defenses.'
  },
  'KH-32': {
    id: 'KH-32', name: 'Kh-32 Mach 4.6 Heavy Standoff (1x)', slots: 6, slotType: 'CENTERLINE', minRating: 'Type X',
    mass: 5800, cost: 3.8, rangeKm: 140.0, speedMach: 4.6, seeker: 'INS', rcs: 0.22,
    trait: 'LOFTED_HYPERSONIC', traitBadge: 'MACH 4.6 DIVE CRUISE',
    behaviorDesc: 'High-altitude rocket-cruise missile (1x, 18 HP, 140 km). Cruises near stratosphere before diving at Mach 4.6, bypassing medium SAMs and CIWS.',
    damage: 18, ammoCount: 1, minRangeKm: 15.0, sweetSpotMin: 30.0, sweetSpotMax: 130.0, lambda: 0.04, p: 1.2, T_0: 0.94,
    isBunkerCracker: true, sigmaPylon: 0.65, category: 'A2G', a2gGroup: 'CRUISE',
    allowedAirframes: ['Tu-160M', 'Su-34', 'MiG-31BM', 'B-1B', 'B-52H'],
    desc: 'Heavy centerline Mach 4.6 high-altitude standoff cruise missile (1x, 18 HP) for strategic interdiction.'
  },
  'KINZHAL': {
    id: 'KINZHAL', name: 'Kh-47M2 Kinzhal (2x)', slots: 6, slotType: 'CENTERLINE', minRating: 'Type X',
    mass: 8800, cost: 4.2, rangeKm: 135.0, speedMach: 6.2, seeker: 'INS', rcs: 0.25,
    trait: 'HYPERSONIC_IMPACT', traitBadge: 'MACH 6.2 KINETIC SHOCK',
    behaviorDesc: 'Inertial Navigation System (INS) with active radar terminal correlation. Lofts into the stratosphere, then dives at hypersonic Mach 6.2 neutralizing heavy bunkers.',
    damage: 16, ammoCount: 2, minRangeKm: 15.0, sweetSpotMin: 30.0, sweetSpotMax: 125.0, lambda: 0.05, p: 1.0, T_0: 0.95,
    isBunkerCracker: true, sigmaPylon: 0.80, category: 'A2G', a2gGroup: 'CRUISE',
    allowedAirframes: ['MiG-31BM', 'Tu-160M', 'Su-34', 'F-15EX', 'J-16', 'B-1B', 'B-52H'],
    desc: 'Hypersonic aero-ballistic heavy missile (2x, Mach 6.2). Mounts exclusively on the aircraft centerline fuselage station.'
  }
};
