/**
 * js/data/weapons/wvr.js - Within-Visual-Range (WVR) Dogfight Air-to-Air Missiles.
 */

window.WEAPONS_A2A_WVR = {
  'R-60M': {
    id: 'R-60M', name: 'R-60M Aphid (6x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 265, cost: 0.3, rangeKm: 14.0, speedMach: 2.5, seeker: 'IIR', rcs: 0.02,
    trait: 'SNAP_TURN', traitBadge: '1-SLOT 6x BUDGET IR',
    behaviorDesc: 'Ultra-lightweight close-in infrared dogfight missile (6x, 1.5 HP, 14 km, Mach 2.5). Packs 6 rapid IR shots on 1 light pylon.',
    damage: 1.5, ammoCount: 6, minRangeKm: 0.5, sweetSpotMin: 1.0, sweetSpotMax: 11.0,
    lambda: 0.75, p: 1.0, T_0: 0.82, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Budget 6-pack short-range infrared dogfight missiles (14 km) for light and legacy fighters.'
  },
  'AIM-9M': {
    id: 'AIM-9M', name: 'AIM-9M Sidewinder (4x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 350, cost: 0.3, rangeKm: 22.0, speedMach: 2.5, seeker: 'IIR', rcs: 0.025,
    trait: 'SNAP_TURN', traitBadge: 'BUDGET ALL-ASPECT IR',
    behaviorDesc: 'Economical smokeless all-aspect Sidewinder (4x, 2 HP, 22 km, Mach 2.5) with basic IR countermeasure rejection.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.2, sweetSpotMax: 18.0,
    lambda: 0.72, p: 1.0, T_0: 0.84, decoyResistance: 0.40, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Economical all-aspect Sidewinder IR missiles (4x, 22 km) for budget multirole and legacy airframes.'
  },
  'MAGIC-2': {
    id: 'MAGIC-2', name: 'Matra R.550 Magic 2 (4x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 360, cost: 0.4, rangeKm: 20.0, speedMach: 2.7, seeker: 'IIR', rcs: 0.025,
    trait: 'SNAP_TURN', traitBadge: 'DELTA SNAP-TURN IR',
    behaviorDesc: 'High-acceleration French dogfight missile (4x, 2 HP, 20 km, Mach 2.7) tuned for Mirage and Rafale merges.',
    damage: 2, ammoCount: 4, minRangeKm: 0.5, sweetSpotMin: 1.2, sweetSpotMax: 16.5,
    lambda: 0.72, p: 1.0, T_0: 0.85, decoyResistance: 0.45, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Agile Mach 2.7 French short-range infrared missiles (4x, 20 km).'
  },
  'PYTHON-4': {
    id: 'PYTHON-4', name: 'Rafael Python-4 HOBS (4x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 420, cost: 0.5, rangeKm: 24.0, speedMach: 3.0, seeker: 'IIR', rcs: 0.025,
    trait: 'HOBS_VANE', traitBadge: 'MACH 3.0 90 DEG HOBS',
    behaviorDesc: 'High-off-boresight Mach 3.0 dogfight missile (4x, 2 HP, 24 km) with helmet-cueing snap capability.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.2, sweetSpotMax: 19.5,
    lambda: 0.68, p: 1.0, T_0: 0.87, decoyResistance: 0.55, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Helmet-cued Mach 3.0 high-off-boresight IR dogfight missiles (4x, 24 km).'
  },
  'AAM-3': {
    id: 'AAM-3', name: 'Type 90 AAM-3 (4x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 365, cost: 0.5, rangeKm: 26.0, speedMach: 2.6, seeker: 'IIR', rcs: 0.025,
    trait: 'HOBS_VANE', traitBadge: 'WIDE-CONE FLARE RESIST',
    behaviorDesc: 'Forward-canard agile IR dogfighter (4x, 2 HP, 26 km, Mach 2.6) with upgraded dual-band flare rejection.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.4, sweetSpotMax: 21.0,
    lambda: 0.68, p: 1.0, T_0: 0.87, decoyResistance: 0.60, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Agile Japanese dual-band IR dogfight missiles (4x, 26 km) for F-2A and F-15J.'
  },
  'R-73': {
    id: 'R-73', name: 'R-73 Archer (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 520, cost: 0.5, rangeKm: 30.0, speedMach: 2.5, seeker: 'IIR', rcs: 0.03,
    trait: 'SNAP_TURN', traitBadge: '60 DEG RAIL SNAP-TURN',
    behaviorDesc: 'Gas-vane thrust vectoring executes an immediate 60 degree turn off the rail, accelerating to Mach 2.5 in 1.2s. Immune to RF countermeasures.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.2, sweetSpotMax: 24.0,
    lambda: 0.75, p: 1.0, T_0: 0.88, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Gas-vane dogfight missile (4x, Mach 2.5) with immediate 60-degree snap turns. Mounts internally in stealth wing roots or externally.'
  },
  'BOZDOGAN': {
    id: 'BOZDOGAN', name: 'Goktug Bozdogan HOBS (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 400, cost: 0.5, rangeKm: 28.0, speedMach: 2.9, seeker: 'IIR', rcs: 0.025,
    trait: 'HOBS_VANE', traitBadge: 'LIGHT 90 DEG HOBS IR',
    behaviorDesc: 'Compact 400 kg thrust-vectoring HOBS dogfighter (4x, 2 HP, 28 km, Mach 2.9). Cheaper, lighter internal-bay HOBS option vs PL-10 and AIM-9X.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.4, sweetSpotMax: 23.0,
    lambda: 0.68, p: 1.0, T_0: 0.87, decoyResistance: 0.64, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Economical 400 kg Mach 2.9 internal-bay HOBS IIR missiles (4x, 28 km).'
  },
  'PL-10': {
    id: 'PL-10', name: 'PL-10 HOBS Imaging IR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 420, cost: 0.6, rangeKm: 32.0, speedMach: 3.0, seeker: 'IIR', rcs: 0.025,
    trait: 'HOBS_VANE', traitBadge: '90 DEG INTERNAL IIR',
    behaviorDesc: 'Thrust-vectoring imaging-infrared dogfighter (4x, 32 km, Mach 3.0). Clipped fins fit lateral stealth bays with strong countermeasure rejection.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 26.0,
    lambda: 0.68, p: 1.0, T_0: 0.89, decoyResistance: 0.72, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Agile 90-degree off-boresight IIR missile (4x, Mach 3.0) built for J-20, J-35, and Flanker close merges.'
  },
  'PYTHON-5': {
    id: 'PYTHON-5', name: 'Python-5 (4x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 500, cost: 0.7, rangeKm: 32.0, speedMach: 2.7, seeker: 'EO', rcs: 0.03,
    trait: 'REAR_ENGAGE', traitBadge: '180 DEG REAR ENGAGE',
    behaviorDesc: 'Full-sphere optical matrix seeker allows launching 180 degrees backwards at pursuing fighters, accelerating to Mach 2.7 without turning.',
    damage: 2, ammoCount: 4, minRangeKm: 0.8, sweetSpotMin: 2.0, sweetSpotMax: 26.0,
    lambda: 0.65, p: 1.0, T_0: 0.90, sigmaPylon: 0.03, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Electro-optical matrix seeker for rearward over-the-shoulder launches (4x, Mach 2.7). Carried externally on wing/fuselage pylons.'
  },
  'AIM-9X-2': {
    id: 'AIM-9X-2', name: 'AIM-9X Sidewinder (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 440, cost: 0.6, rangeKm: 34.0, speedMach: 2.5, seeker: 'IIR', rcs: 0.03,
    trait: 'HOBS_VANE', traitBadge: '90 DEG OFF-BORESIGHT',
    behaviorDesc: 'Thrust-vectored jet vanes snap to 90 degree high-off-boresight angles; booster accelerates to Mach 2.5 in 1.2s. Immune to RF radar jamming and Doppler notching.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 26.0,
    lambda: 0.70, p: 1.0, T_0: 0.88, decoyResistance: 0.65, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'High off-boresight infrared dogfight missile (4x, Mach 2.5). Fits stealth side internal bays or external wingtip rails.'
  },
  'R-74M2': {
    id: 'R-74M2', name: 'R-74M2 Internal HOBS IR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 430, cost: 0.7, rangeKm: 34.0, speedMach: 2.8, seeker: 'IIR', rcs: 0.02,
    trait: 'HOBS_VANE', traitBadge: '34KM INTERNAL ARCHER',
    behaviorDesc: 'Stealth-bay conformal Archer upgrade (4x, 34 km, Mach 2.8). Combines 90-degree HOBS gimbal tracking with digital IR decoy rejection.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 27.0,
    lambda: 0.66, p: 1.0, T_0: 0.90, decoyResistance: 0.74, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Internal-bay conformal high-off-boresight IR missile (4x, 34 km) engineered for 5th-Gen Russian fighters.'
  },
  'AAM-5B': {
    id: 'AAM-5B', name: 'Type 04 AAM-5B IIR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 440, cost: 0.7, rangeKm: 35.0, speedMach: 2.9, seeker: 'IIR', rcs: 0.025,
    trait: 'IMAGE_RECOGNITION', traitBadge: 'TVC ANTI-FLARE WVR',
    behaviorDesc: 'Dual-band focal-plane array IR dogfighter with thrust vectoring (4x, 35 km, Mach 2.9). Maintains lock through heavy flare clouds.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 28.0,
    lambda: 0.65, p: 1.0, T_0: 0.90, decoyResistance: 0.80, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Thrust-vectored dual-band imaging infrared missile (4x, 35 km) with superior decoy resistance.'
  },
  'IRIS-T': {
    id: 'IRIS-T', name: 'IRIS-T Dogfight (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 460, cost: 0.6, rangeKm: 35.0, speedMach: 2.6, seeker: 'IIR', rcs: 0.03,
    trait: 'IMAGE_RECOGNITION', traitBadge: 'SILHOUETTE FILTER',
    behaviorDesc: 'Image recognition seeker filters false decoys by matching 3D aircraft silhouettes. Reaches Mach 2.6 with high terminal turn rate.',
    damage: 2, ammoCount: 4, minRangeKm: 0.8, sweetSpotMin: 2.0, sweetSpotMax: 28.0,
    lambda: 0.68, p: 1.0, T_0: 0.90, decoyResistance: 0.80, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Advanced European dogfight missile (4x, Mach 2.6) with optical image processing. Mounts in internal bays or external pylons.'
  },
  'ASRAAM': {
    id: 'ASRAAM', name: 'AIM-132 ASRAAM Sprint (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 440, cost: 0.7, rangeKm: 36.0, speedMach: 3.2, seeker: 'IIR', rcs: 0.03,
    trait: 'HOBS_VANE', traitBadge: 'MACH 3.2 SPRINT WVR',
    behaviorDesc: 'High-acceleration Mach 3.2 infrared dogfight missile (4x, 36 km). Out-runs fleeing jets inside close visual combat merges.',
    damage: 2, ammoCount: 4, minRangeKm: 0.8, sweetSpotMin: 2.0, sweetSpotMax: 30.0,
    lambda: 0.62, p: 1.0, T_0: 0.89, decoyResistance: 0.70, sigmaPylon: 0.02, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Mach 3.2 high-speed infrared dogfight missile (4x, 36 km) built for rapid close-in intercepts.'
  },
  'MICA-IR': {
    id: 'MICA-IR', name: 'MICA-IR Long-WVR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 450, cost: 0.8, rangeKm: 38.0, speedMach: 3.0, seeker: 'IIR', rcs: 0.03,
    trait: 'IMAGE_RECOGNITION', traitBadge: '38KM SILENT IIR',
    behaviorDesc: 'Extended-range imaging-infrared interceptor missile (4x, 38 km, Mach 3.0). Allows silent passive BVR ambushes without emitting radar warnings.',
    damage: 2, ammoCount: 4, minRangeKm: 0.8, sweetSpotMin: 2.5, sweetSpotMax: 32.0,
    lambda: 0.58, p: 1.0, T_0: 0.88, decoyResistance: 0.75, sigmaPylon: 0.03, category: 'A2A', a2aGroup: 'WVR',
    desc: 'Long-reach silent imaging-infrared dogfight missile (4x, 38 km) denying RWR launch warnings.'
  }
};
