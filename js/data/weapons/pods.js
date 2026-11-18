/**
 * js/data/weapons/pods.js - Electronic Warfare (ECM) jamming pods, towed repeaters, and decoy dispensers.
 */

window.WEAPONS_PODS = {
  'ADM-160B': {
    id: 'ADM-160B', name: 'ADM-160B MALD Decoy Drone (2x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 260, cost: 0.5, rangeKm: 110.0, speedMach: 0.80, damage: 0, isDecoyDrone: true,
    trait: 'RADAR_SIGNATURE_SPOOF', traitBadge: 'RADAR RCS MIRROR',
    behaviorDesc: 'Small Air-Launched Decoy drones (2x). Copies your aircraft radar signature and speed to fool enemy radars and draw missile fire.',
    ammoCount: 2, sigmaPylon: 0.02, category: 'POD', podGroup: 'DECOY',
    desc: 'Air-launched decoy drones (2x, Mach 0.80) matching your aircraft radar profile. Fits inside internal stealth bays or on external pylons.'
  },
  'BRITECLOUD-POD': {
    id: 'BRITECLOUD-POD', name: 'BriteCloud Active DRFM Decoy (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 165, cost: 0.8, rangeKm: 0.0, speedMach: 1.0, damage: 0, isDecoy: true,
    trait: 'DRFM_ACTIVE_DECOY', traitBadge: '1-SLOT 4x DRFM DECOY',
    behaviorDesc: 'Expendable active radar decoy dispenser (4x charges). Fits in 1 internal slot to pull active radar missiles off stealth and strike aircraft.',
    ammoCount: 4, sigmaPylon: 0.02, category: 'POD', podGroup: 'DECOY',
    desc: 'Compact 1-slot active radar decoy cartridge pod (4x charges) compatible with internal bays and light fighters.'
  },
  'ALE-55': {
    id: 'ALE-55', name: 'AN/ALE-55 FOTD Pod (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 380, cost: 0.8, rangeKm: 0.0, speedMach: 1.0, damage: 0, isDecoy: true,
    trait: 'FIBER_OPTIC_TOWED', traitBadge: '4x FOTD REPEATER',
    behaviorDesc: 'Fiber-Optic Towed Decoy pod (4x charges). Trails behind the aircraft and sends strong false radar signals to pull radar missiles away.',
    ammoCount: 4, sigmaPylon: 0.04, category: 'POD', podGroup: 'DECOY',
    desc: 'Towed fiber-optic decoy system (4x charges). Fits inside internal bays or external pylons.'
  },
  'AN-ALE-50': {
    id: 'AN-ALE-50', name: 'AN/ALE-50 Towed Decoy (6x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 240, cost: 0.7, rangeKm: 0.0, speedMach: 1.0, damage: 0, isDecoy: true,
    trait: 'TOWED_RF_REPEATER', traitBadge: '1-SLOT 6x REPEATER',
    behaviorDesc: 'Compact towed radar decoy reel (6x charges) occupying 1 external station. Pulls radar-guided SAM and air-to-air missiles off F-16V, F-18E, and B-1B crews.',
    ammoCount: 6, sigmaPylon: 0.05, category: 'POD', podGroup: 'DECOY',
    desc: 'Compact 1-slot towed radar decoy dispenser (6x charges) protecting strike and multirole aircraft against ARH missiles.'
  },
  'BOL-CHAFF-RAIL': {
    id: 'BOL-CHAFF-RAIL', name: 'BOL-518 Chaff & Flare Rail (8x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 150, cost: 0.6, rangeKm: 0.0, speedMach: 1.0, damage: 0, isDecoy: true,
    trait: 'HIGH_CAPACITY_CM', traitBadge: '1-SLOT 8x CHAFF POD',
    behaviorDesc: 'Wingtip missile-rail countermeasure dispenser (8x salvos). Gives extra chaff bursts across long dogfights and multi-SAM attack runs.',
    ammoCount: 8, sigmaPylon: 0.03, category: 'POD', podGroup: 'DECOY',
    desc: 'High-capacity 1-slot BOL wingtip chaff and flare dispenser (8x charges) built for sustained defense.'
  },
  'TALD-DECOY': {
    id: 'TALD-DECOY', name: 'ADM-141C ITALD Gliding Decoy (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 720, cost: 0.9, rangeKm: 115.0, speedMach: 0.85, damage: 0, isDecoyDrone: true,
    trait: 'RADAR_SIGNATURE_SPOOF', traitBadge: '4x SEAD BAIT GLIDERS',
    behaviorDesc: 'Powered tactical radar decoy gliders (4x, 115 km). Launched ahead of strike wings to bait S-400, Patriot, and Buk SAM batteries into wasting missiles and revealing positions.',
    ammoCount: 4, sigmaPylon: 0.09, category: 'POD', podGroup: 'DECOY',
    desc: 'Four-pack tactical gliding decoys (4x) made to soak up SAM fire during deep Attack missions.'
  },
  'AN-ALQ-165': {
    id: 'AN-ALQ-165', name: 'AN/ALQ-165 ASPJ Internal Jammer', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 210, cost: 0.9, rangeKm: 75.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.32,
    trait: 'INTERNAL_DRFM_ECM', traitBadge: 'INTERNAL 32% ECM',
    behaviorDesc: 'Internal self-protection radar jammer pod (32% radar suppression across 75 km). Fits inside stealth weapon bays without adding external radar reflection.',
    sigmaPylon: 0.03, category: 'POD', podGroup: 'ECM',
    desc: 'Internal-bay 1-slot jammer providing 32% electronic countermeasures while keeping VLO stealth clean.'
  },
  'AN-ALQ-184': {
    id: 'AN-ALQ-184', name: 'AN/ALQ-184 Electronic Countermeasure Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 310, cost: 0.7, rangeKm: 70.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.30,
    trait: 'COMPACT_SELF_ECM', traitBadge: '1-SLOT COMPACT ECM',
    behaviorDesc: 'Lightweight self-protection jammer pod. Jams nearby enemy radars and locks across 70 km (30% suppression).',
    sigmaPylon: 0.08, category: 'POD', podGroup: 'ECM',
    desc: 'Compact 1-slot self-protection ECM pod mounted on external fighter hardpoints.'
  },
  'AN-ALQ-131': {
    id: 'AN-ALQ-131', name: 'AN/ALQ-131 Strike ECM Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 320, cost: 0.8, rangeKm: 75.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.35,
    trait: 'STRIKE_SELF_ECM', traitBadge: '1-SLOT 35% STRIKE ECM',
    behaviorDesc: 'Tactical strike self-protection ECM pod (35% radar suppression across 75 km). Protects F-111F, Tornado, F-16V, and A-10C strike runs.',
    sigmaPylon: 0.08, category: 'POD', podGroup: 'ECM',
    desc: 'Modular 1-slot tactical strike jamming pod providing 35% radar suppression against ground SAM and fighter locks.'
  },
  'KHIBINY-L175': {
    id: 'KHIBINY-L175', name: 'L175V Khibiny Wingtip Jammer', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 300, cost: 1.0, rangeKm: 85.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.38,
    trait: 'WINGTIP_DRFM_ECM', traitBadge: '1-SLOT 38% KHIBINY ECM',
    behaviorDesc: 'Wingtip-mounted digital radar-deception jammer (38% radar suppression across 85 km). Built for Su-34, Su-30SM, Su-35S, and Su-24M2 strike runs.',
    sigmaPylon: 0.07, category: 'POD', podGroup: 'ECM',
    desc: 'Compact 1-slot wingtip electronic warfare container projecting 38% radar suppression across 85 km.'
  },
  'SORBTSIYA-L005': {
    id: 'SORBTSIYA-L005', name: 'L005 Sorbtsiya Wingtip Jammer', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 410, cost: 1.1, rangeKm: 90.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.42,
    trait: 'WINGTIP_DRFM_ECM', traitBadge: '90KM 42% DRFM ECM',
    behaviorDesc: 'Twin wingtip digital radar-deception jammer pods (42% suppression across 90 km). Weakens hostile search radars and SAM fire-control locks.',
    sigmaPylon: 0.11, category: 'POD', podGroup: 'ECM',
    desc: 'Dual wingtip electronic warfare pods projecting 42% radar suppression across 90 km.'
  },
  'AN-ALQ-99': {
    id: 'AN-ALQ-99', name: 'AN/ALQ-99 Jammer Pod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 720, cost: 1.2, rangeKm: 95.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.45,
    trait: 'BROADBAND_JAM', traitBadge: 'AREA ECM JAMMING',
    behaviorDesc: 'Emits wideband radar noise that weakens incoming radar locks and search arrays across 95 km (45% suppression).',
    sigmaPylon: 0.15, category: 'POD', podGroup: 'ECM',
    desc: 'Broadband radar jammer pod mounted on external pylons to degrade hostile radar detection.'
  },
  'SAP-14-POD': {
    id: 'SAP-14-POD', name: 'SAP-14 Tarantul Escort Jammer', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 940, cost: 1.9, rangeKm: 115.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.55,
    trait: 'AREA_ESCORT_ECM', traitBadge: '115KM 55% ESCORT ECM',
    behaviorDesc: 'Heavy escort jamming pod projecting 55% radar suppression out to 115 km to blind enemy early-warning and S-400 SAM belts.',
    sigmaPylon: 0.20, category: 'POD', podGroup: 'ECM',
    desc: 'Heavy standoff escort jammer pod providing wide-area 55% radar suppression across 115 km.'
  },
  'AN-ALQ-249': {
    id: 'AN-ALQ-249', name: 'AN/ALQ-249 NGJ-MB AESA Pod', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 980, cost: 2.2, rangeKm: 125.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.60,
    trait: 'AESA_STANDOFF_JAM', traitBadge: 'AESA GAN STANDOFF ECM',
    behaviorDesc: 'Next Generation Jammer Mid-Band with AESA transmitters. Delivers high-power beam jamming out to 125 km (60% suppression).',
    sigmaPylon: 0.20, category: 'POD', podGroup: 'ECM',
    desc: 'High-power GaN AESA jamming pod mounted externally on heavy weapon stations.'
  }
};
