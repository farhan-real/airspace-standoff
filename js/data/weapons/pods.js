/**
 * js/data/weapons/pods.js - Electronic Warfare (ECM) jamming pods and radar decoy dispensers.
 */

window.WEAPONS_PODS = {
  'ADM-160B': {
    id: 'ADM-160B', name: 'ADM-160B MALD Decoy Drone (2x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 260, cost: 0.5, rangeKm: 110.0, speedMach: 0.80, damage: 0, isDecoyDrone: true,
    trait: 'RADAR_SIGNATURE_SPOOF', traitBadge: 'RADAR RCS MIRROR',
    behaviorDesc: 'Miniature Air-Launched Decoy drones (2x). Replicates host aircraft radar cross-section and speed profile to deceive enemy radars.',
    ammoCount: 2, sigmaPylon: 0.02, category: 'POD', podGroup: 'DECOY',
    desc: 'Air-launched decoy drones (2x, Mach 0.80) matching host radar profile. Mounts inside internal stealth bays or on external pylons.'
  },
  'ALE-55': {
    id: 'ALE-55', name: 'AN/ALE-55 FOTD Pod (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 380, cost: 0.8, rangeKm: 0.0, speedMach: 1.0, damage: 0, isDecoy: true,
    trait: 'FIBER_OPTIC_TOWED', traitBadge: '4x FOTD REPEATER',
    behaviorDesc: 'Fiber-Optic Towed Decoy dispenser pod (4x charges). Deploys high-power RF repeaters that decoy active radar missiles.',
    ammoCount: 4, sigmaPylon: 0.04, category: 'POD', podGroup: 'DECOY',
    desc: 'Towed fiber-optic decoy system (4x charges). Can be housed inside internal bays or mounted on external pylons.'
  },
  'TALD-DECOY': {
    id: 'TALD-DECOY', name: 'ADM-141C ITALD Gliding Decoy (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 720, cost: 0.9, rangeKm: 115.0, speedMach: 0.85, damage: 0, isDecoyDrone: true,
    trait: 'RADAR_SIGNATURE_SPOOF', traitBadge: '4x SEAD BAIT GLIDERS',
    behaviorDesc: 'Powered tactical radar decoy gliders (4x, 115 km). Launched ahead of strike wings to bait S-400, Patriot, and Buk SAM batteries into wasting salvos and revealing positions.',
    ammoCount: 4, sigmaPylon: 0.09, category: 'POD', podGroup: 'DECOY',
    desc: 'Four-pack tactical gliding decoys (4x) engineered to saturate SAM defense belts during deep Attack sorties.'
  },
  'AN-ALQ-184': {
    id: 'AN-ALQ-184', name: 'AN/ALQ-184 Electronic Countermeasure Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 310, cost: 0.7, rangeKm: 70.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.30,
    trait: 'COMPACT_SELF_ECM', traitBadge: '1-SLOT COMPACT ECM',
    behaviorDesc: 'Lightweight self-protection jammer pod. Emits directional RF pulse jamming against radar threats (30% suppression).',
    sigmaPylon: 0.08, category: 'POD', podGroup: 'ECM',
    desc: 'Compact 1-slot self-protection ECM pod mounted on external fighter hardpoints.'
  },
  'AN-ALQ-131': {
    id: 'AN-ALQ-131', name: 'AN/ALQ-131 Strike ECM Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 320, cost: 0.8, rangeKm: 75.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.35,
    trait: 'STRIKE_SELF_ECM', traitBadge: '1-SLOT 35% STRIKE ECM',
    behaviorDesc: 'Tactical strike self-protection ECM pod (35% radar suppression across 75 km). Optimized to protect F-111F, Tornado, F-16V, and A-10C strike corridors.',
    sigmaPylon: 0.08, category: 'POD', podGroup: 'ECM',
    desc: 'Modular 1-slot tactical strike jamming pod providing 35% radar suppression against ground SAM and interceptor tracks.'
  },
  'SORBTSIYA-L005': {
    id: 'SORBTSIYA-L005', name: 'L005 Sorbtsiya Wingtip Jammer', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 410, cost: 1.1, rangeKm: 90.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.42,
    trait: 'WINGTIP_DRFM_ECM', traitBadge: '90KM 42% DRFM ECM',
    behaviorDesc: 'Twin wingtip DRFM active deception jamming containers (42% suppression across 90 km). Degrades hostile search and SAM fire-control locks.',
    sigmaPylon: 0.11, category: 'POD', podGroup: 'ECM',
    desc: 'Dual wingtip electronic warfare pods projecting 42% radar suppression across 90 km.'
  },
  'AN-ALQ-99': {
    id: 'AN-ALQ-99', name: 'AN/ALQ-99 Jammer Pod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 720, cost: 1.2, rangeKm: 95.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.45,
    trait: 'BROADBAND_JAM', traitBadge: 'AREA ECM JAMMING',
    behaviorDesc: 'Emits broadband microwave noise that degrades incoming active radar locks and search arrays across 95 km (45% suppression).',
    sigmaPylon: 0.15, category: 'POD', podGroup: 'ECM',
    desc: 'Broadband radar jammer pod mounted on external pylons to degrade hostile radar detection.'
  },
  'AN-ALQ-249': {
    id: 'AN-ALQ-249', name: 'AN/ALQ-249 NGJ-MB AESA Pod', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 980, cost: 2.2, rangeKm: 125.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.60,
    trait: 'AESA_STANDOFF_JAM', traitBadge: 'AESA GAN STANDOFF ECM',
    behaviorDesc: 'Next Generation Jammer Mid-Band with GaN AESA transmitters. Delivers concentrated high-power beam jamming out to 125 km (60% suppression).',
    sigmaPylon: 0.20, category: 'POD', podGroup: 'ECM',
    desc: 'High-power GaN AESA jamming pod mounted externally on heavy weapon stations.'
  }
};
