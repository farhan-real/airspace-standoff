/**
 * js/data/weapons/wvr.js - Within-Visual-Range (WVR) dogfight missiles and compact swarm micro-missiles.
 */

window.WEAPONS_A2A_WVR = {
  'R-73': {
    id: 'R-73', name: 'R-73 Archer (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 520, cost: 0.5, rangeKm: 30.0, speedMach: 2.5, seeker: 'IIR', rcs: 0.03,
    trait: 'SNAP_TURN', traitBadge: '60 DEG RAIL SNAP-TURN',
    behaviorDesc: 'Gas-vane thrust vectoring executes an immediate 60 degree turn off the rail, accelerating to Mach 2.5 in 1.2s. Immune to RF countermeasures.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.2, sweetSpotMax: 24.0,
    lambda: 0.75, p: 1.0, T_0: 0.88, sigmaPylon: 0.02,
    category: 'A2A', a2aGroup: 'WVR',
    desc: 'Gas-vane dogfight missile (4x, Mach 2.5) with immediate 60-degree snap turns. Mounts internally in stealth wing roots or externally.'
  },
  'AIM-9X-2': {
    id: 'AIM-9X-2', name: 'AIM-9X Sidewinder (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 440, cost: 0.6, rangeKm: 34.0, speedMach: 2.5, seeker: 'IIR', rcs: 0.03,
    trait: 'HOBS_VANE', traitBadge: '90 DEG OFF-BORESIGHT',
    behaviorDesc: 'Thrust-vectored jet vanes snap to 90 degree high-off-boresight angles; booster accelerates to Mach 2.5 in 1.2s. Immune to RF radar jamming and Doppler notching.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 26.0,
    lambda: 0.70, p: 1.0, T_0: 0.88, decoyResistance: 0.65, sigmaPylon: 0.02,
    category: 'A2A', a2aGroup: 'WVR',
    desc: 'High off-boresight infrared dogfight missile (4x, Mach 2.5). Fits stealth side internal bays or external wingtip rails.'
  },
  'PL-10': {
    id: 'PL-10', name: 'PL-10 HOBS Imaging IR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 420, cost: 0.6, rangeKm: 32.0, speedMach: 3.0, seeker: 'IIR', rcs: 0.025,
    trait: 'HOBS_VANE', traitBadge: '90 DEG INTERNAL IIR',
    behaviorDesc: 'Thrust-vectoring imaging-infrared dogfighter (4x, 32 km, Mach 3.0). Clipped fins fit lateral stealth bays with strong countermeasure rejection.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 26.0,
    lambda: 0.68, p: 1.0, T_0: 0.89, decoyResistance: 0.72, sigmaPylon: 0.02,
    category: 'A2A', a2aGroup: 'WVR',
    desc: 'Agile 90-degree off-boresight IIR missile (4x, Mach 3.0) built for J-20, J-35, and Flanker close merges.'
  },
  'R-74M2': {
    id: 'R-74M2', name: 'R-74M2 Internal HOBS IR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 430, cost: 0.7, rangeKm: 34.0, speedMach: 2.8, seeker: 'IIR', rcs: 0.02,
    trait: 'HOBS_VANE', traitBadge: '34KM INTERNAL ARCHER',
    behaviorDesc: 'Stealth-bay conformal Archer upgrade (4x, 34 km, Mach 2.8). Combines 90-degree HOBS gimbal tracking with digital IR decoy rejection.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 27.0,
    lambda: 0.66, p: 1.0, T_0: 0.90, decoyResistance: 0.74, sigmaPylon: 0.02,
    category: 'A2A', a2aGroup: 'WVR',
    desc: 'Internal-bay conformal high-off-boresight IR missile (4x, 34 km) engineered for 5th-Gen Russian fighters.'
  },
  'AAM-5B': {
    id: 'AAM-5B', name: 'Type 04 AAM-5B IIR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 440, cost: 0.7, rangeKm: 35.0, speedMach: 2.9, seeker: 'IIR', rcs: 0.025,
    trait: 'IMAGE_RECOGNITION', traitBadge: 'TVC ANTI-FLARE WVR',
    behaviorDesc: 'Dual-band focal-plane array IR dogfighter with thrust vectoring (4x, 35 km, Mach 2.9). Maintains lock through heavy flare clouds.',
    damage: 2, ammoCount: 4, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 28.0,
    lambda: 0.65, p: 1.0, T_0: 0.90, decoyResistance: 0.80, sigmaPylon: 0.02,
    category: 'A2A', a2aGroup: 'WVR',
    desc: 'Thrust-vectored dual-band imaging infrared missile (4x, 35 km) with superior decoy resistance.'
  },
  'IRIS-T': {
    id: 'IRIS-T', name: 'IRIS-T Dogfight (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 460, cost: 0.6, rangeKm: 35.0, speedMach: 2.6, seeker: 'IIR', rcs: 0.03,
    trait: 'IMAGE_RECOGNITION', traitBadge: 'SILHOUETTE FILTER',
    behaviorDesc: 'Image recognition seeker filters false decoys by matching 3D aircraft silhouettes. Reaches Mach 2.6 with high terminal turn rate.',
    damage: 2, ammoCount: 4, minRangeKm: 0.8, sweetSpotMin: 2.0, sweetSpotMax: 28.0,
    lambda: 0.68, p: 1.0, T_0: 0.90, decoyResistance: 0.80, sigmaPylon: 0.02,
    category: 'A2A', a2aGroup: 'WVR',
    desc: 'Advanced European dogfight missile (4x, Mach 2.6) with optical image processing. Mounts in internal bays or external pylons.'
  },
  'ASRAAM': {
    id: 'ASRAAM', name: 'AIM-132 ASRAAM Sprint (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 440, cost: 0.7, rangeKm: 36.0, speedMach: 3.2, seeker: 'IIR', rcs: 0.03,
    trait: 'HOBS_VANE', traitBadge: 'MACH 3.2 SPRINT WVR',
    behaviorDesc: 'High-acceleration Mach 3.2 infrared dogfight missile (4x, 36 km). Out-runs fleeing jets inside close visual combat merges.',
    damage: 2, ammoCount: 4, minRangeKm: 0.8, sweetSpotMin: 2.0, sweetSpotMax: 30.0,
    lambda: 0.62, p: 1.0, T_0: 0.89, decoyResistance: 0.70, sigmaPylon: 0.02,
    category: 'A2A', a2aGroup: 'WVR',
    desc: 'Mach 3.2 high-speed infrared dogfight missile (4x, 36 km) built for rapid close-in intercepts.'
  },
  'MICA-IR': {
    id: 'MICA-IR', name: 'MICA-IR Long-WVR (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 450, cost: 0.8, rangeKm: 38.0, speedMach: 3.0, seeker: 'IIR', rcs: 0.03,
    trait: 'IMAGE_RECOGNITION', traitBadge: '38KM SILENT IIR',
    behaviorDesc: 'Extended-range imaging-infrared interceptor missile (4x, 38 km, Mach 3.0). Allows silent passive BVR ambushes without emitting radar warnings.',
    damage: 2, ammoCount: 4, minRangeKm: 0.8, sweetSpotMin: 2.5, sweetSpotMax: 32.0,
    lambda: 0.58, p: 1.0, T_0: 0.88, decoyResistance: 0.75, sigmaPylon: 0.03,
    category: 'A2A', a2aGroup: 'WVR',
    desc: 'Long-reach silent imaging-infrared dogfight missile (4x, 38 km) denying RWR launch warnings.'
  },
  'PYTHON-5': {
    id: 'PYTHON-5', name: 'Python-5 (4x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 500, cost: 0.7, rangeKm: 32.0, speedMach: 2.7, seeker: 'EO', rcs: 0.03,
    trait: 'REAR_ENGAGE', traitBadge: '180 DEG REAR ENGAGE',
    behaviorDesc: 'Full-sphere optical matrix seeker allows launching 180 degrees backwards at pursuing fighters, accelerating to Mach 2.7 without turning.',
    damage: 2, ammoCount: 4, minRangeKm: 0.8, sweetSpotMin: 2.0, sweetSpotMax: 26.0,
    lambda: 0.65, p: 1.0, T_0: 0.90, sigmaPylon: 0.03,
    category: 'A2A', a2aGroup: 'WVR',
    desc: 'Electro-optical matrix seeker for rearward over-the-shoulder launches (4x, Mach 2.7). Carried externally on wing/fuselage pylons.'
  },
  'MAM': {
    id: 'MAM', name: 'MAM Micro-Missiles (8x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 120, cost: 0.4, rangeKm: 20.0, speedMach: 1.8, seeker: 'OPT', rcs: 0.01,
    trait: 'SWARM_RIPPLE', traitBadge: 'SWARM SATURATION',
    behaviorDesc: 'High-density ripple salvos accelerate to Mach 1.8 to bypass point defenses and saturate close-range targets.',
    damage: 1, ammoCount: 8, minRangeKm: 0.6, sweetSpotMin: 1.5, sweetSpotMax: 16.0,
    lambda: 0.80, p: 1.0, T_0: 0.70, sigmaPylon: 0.01,
    category: 'A2A', a2aGroup: 'SWARM_MICRO',
    allowedAirframes: ['MQ-99', 'MQ-101', 'XQ-58A', 'Kizilelma', 'S-70', 'MQ-28', 'MQ-20', 'AKINCI', 'RQ-180', 'JAS-39E', 'F-16V', 'Tejas-MK2', 'Mirage-2000', 'CFA-44'],
    desc: 'Ultra-lightweight micro-missile (8x, Mach 1.8) designed for UCAV internal weapon bays and lightweight external pylon racks.'
  },
  'PEREGRINE': {
    id: 'PEREGRINE', name: 'AIM-260X Peregrine Micro-BVR (6x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 480, cost: 1.4, rangeKm: 52.0, speedMach: 3.4, seeker: 'ARH', rcs: 0.015,
    trait: 'SWARM_RIPPLE', traitBadge: '6x INTERNAL MINI-BVR',
    behaviorDesc: 'Half-length active-radar BVR missile (6x, 2 HP, 52 km, Mach 3.4). Doubles internal stealth bay capacity for high-volume air-to-air saturation.',
    damage: 2, ammoCount: 6, minRangeKm: 2.0, sweetSpotMin: 8.0, sweetSpotMax: 44.0,
    lambda: 0.44, p: 1.0, T_0: 0.82, sigmaPylon: 0.04,
    category: 'A2A', a2aGroup: 'SWARM_MICRO',
    desc: 'Compact half-size active-radar BVR missiles (6x, 52 km) expanding internal stealth bay loadout depth.'
  },
  'ADMM': {
    id: 'ADMM', name: 'ADMM Micro-Missile Pod (12x)', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1150, cost: 2.6, rangeKm: 36.0, speedMach: 2.5, seeker: 'OPT', rcs: 0.02,
    trait: 'ALL_ASPECT_BURST', traitBadge: 'ALL-ASPECT VOLLEY (12x)',
    behaviorDesc: 'Omni-directional micro-missiles launched in a spherical 360-degree pattern at Mach 2.5 to engage multiple nearby targets simultaneously.',
    damage: 2, ammoCount: 12, minRangeKm: 1.0, sweetSpotMin: 3.0, sweetSpotMax: 30.0,
    lambda: 0.70, p: 1.0, T_0: 0.88, sigmaPylon: 0.08,
    category: 'A2A', a2aGroup: 'SWARM_MICRO',
    allowedAirframes: ['CFA-44', 'ADF-11F', 'ADFX-01', 'F-22C-COFFIN', 'Su-37-COFFIN', 'F-15-SMT-COFFIN', 'X-02S'],
    desc: 'All-Direction Multi-Purpose Missile pod (12x, Mach 2.5) mounted externally on heavy pylons of advanced superfighters.'
  }
};
