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
  'BOL-CHAFF-RAIL': {
    id: 'BOL-CHAFF-RAIL', name: 'BOL-518 Chaff & Flare Rail (6x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 150, cost: 0.5, rangeKm: 0.0, speedMach: 1.0, damage: 0, isDecoy: true,
    trait: 'HIGH_CAPACITY_CM', traitBadge: '1-SLOT 6x CHAFF POD',
    behaviorDesc: 'Budget wingtip countermeasure dispenser (6x salvos, 150 kg). Independently triggers 4.5s chaff interference even when internal chaff runs dry.',
    ammoCount: 6, sigmaPylon: 0.03, category: 'POD', podGroup: 'DECOY',
    desc: 'Economical 1-slot BOL wingtip chaff and flare dispenser (6x independent charges) for budget defense.'
  },
  'BRITECLOUD-POD': {
    id: 'BRITECLOUD-POD', name: 'BriteCloud Active DRFM Decoy (4x)', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 165, cost: 0.7, rangeKm: 0.0, speedMach: 1.0, damage: 0, isDecoy: true,
    trait: 'DRFM_ACTIVE_DECOY', traitBadge: '1-SLOT 4x INTERNAL DRFM',
    behaviorDesc: 'Expendable internal-bay active radar decoy (4x independent charges). Fits inside stealth bays with zero drag to pull ARH missiles away.',
    ammoCount: 4, sigmaPylon: 0.02, category: 'POD', podGroup: 'DECOY',
    desc: 'Compact 1-slot active radar decoy cartridge pod (4x charges) compatible with internal stealth bays.'
  },
  'AN-ALE-50': {
    id: 'AN-ALE-50', name: 'AN/ALE-50 Towed Decoy (8x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 240, cost: 0.8, rangeKm: 0.0, speedMach: 1.0, damage: 0, isDecoy: true,
    trait: 'TOWED_RF_REPEATER', traitBadge: '1-SLOT 8x REPEATER',
    behaviorDesc: 'High-capacity 1-slot towed radar decoy reel (8x independent charges). Sustains long strike runs inside dense multi-SAM killboxes.',
    ammoCount: 8, sigmaPylon: 0.05, category: 'POD', podGroup: 'DECOY',
    desc: 'High-capacity 1-slot towed radar decoy dispenser (8x charges) protecting strike and multirole aircraft.'
  },
  'ALE-55': {
    id: 'ALE-55', name: 'AN/ALE-55 FOTD Pod (10x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 380, cost: 1.1, rangeKm: 0.0, speedMach: 1.0, damage: 0, isDecoy: true,
    trait: 'FIBER_OPTIC_TOWED', traitBadge: '10x INTERNAL FOTD REPEATER',
    behaviorDesc: 'Heavy Fiber-Optic Towed Decoy pod (10x independent charges, 2 slots INT/EXT). Maximum countermeasure endurance for contested airspace.',
    ammoCount: 10, sigmaPylon: 0.04, category: 'POD', podGroup: 'DECOY',
    desc: 'High-endurance towed fiber-optic decoy system (10x charges). Fits inside internal bays or external pylons.'
  },
  'TALD-DECOY': {
    id: 'TALD-DECOY', name: 'ADM-141C ITALD Gliding Decoy (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 720, cost: 0.9, rangeKm: 115.0, speedMach: 0.85, damage: 0, isDecoyDrone: true,
    trait: 'RADAR_SIGNATURE_SPOOF', traitBadge: '4x SEAD BAIT GLIDERS',
    behaviorDesc: 'Powered tactical radar decoy gliders (4x, 115 km). Launched ahead of strike wings to bait S-400, Patriot, and Buk SAM batteries into wasting missiles.',
    ammoCount: 4, sigmaPylon: 0.09, category: 'POD', podGroup: 'DECOY',
    desc: 'Four-pack tactical gliding decoys (4x) made to soak up SAM fire during deep Attack missions.'
  },
  'AN-ALQ-184': {
    id: 'AN-ALQ-184', name: 'AN/ALQ-184 Light ECM Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 260, cost: 0.6, rangeKm: 65.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.28,
    trait: 'COMPACT_SELF_ECM', traitBadge: '1-SLOT 28% LIGHT ECM',
    behaviorDesc: 'Lightweight budget self-protection jammer pod (260 kg). Jams nearby enemy radars and locks across 65 km (28% suppression).',
    sigmaPylon: 0.06, category: 'POD', podGroup: 'ECM',
    desc: 'Ultra-light budget 1-slot self-protection ECM pod ($0.6M) mounted on external fighter hardpoints.'
  },
  'AN-ALQ-131': {
    id: 'AN-ALQ-131', name: 'AN/ALQ-131 Strike ECM Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 360, cost: 0.9, rangeKm: 78.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.36,
    trait: 'STRIKE_SELF_ECM', traitBadge: '1-SLOT 36% STRIKE ECM',
    behaviorDesc: 'Tactical strike self-protection ECM pod (36% radar suppression across 78 km). Protects F-111F, Tornado, F-16V, and A-10C strike runs.',
    sigmaPylon: 0.09, category: 'POD', podGroup: 'ECM',
    desc: 'Modular 1-slot tactical strike jamming pod providing 36% radar suppression against ground SAM and fighter locks.'
  },
  'AN-ALQ-165': {
    id: 'AN-ALQ-165', name: 'AN/ALQ-165 ASPJ Internal Jammer', slots: 1, slotType: 'INTERNAL', minRating: 'Type S',
    mass: 210, cost: 1.0, rangeKm: 75.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.32,
    trait: 'INTERNAL_DRFM_ECM', traitBadge: 'INTERNAL 32% ECM',
    behaviorDesc: 'Internal self-protection radar jammer pod (32% radar suppression across 75 km). Fits inside stealth weapon bays without adding external radar reflection.',
    sigmaPylon: 0.03, category: 'POD', podGroup: 'ECM',
    desc: 'Internal-bay 1-slot jammer providing 32% electronic countermeasures while keeping VLO stealth clean.'
  },
  'KHIBINY-L175': {
    id: 'KHIBINY-L175', name: 'L175V Khibiny Wingtip Jammer', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 300, cost: 1.0, rangeKm: 85.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.38,
    trait: 'WINGTIP_DRFM_ECM', traitBadge: '1-SLOT 38% KHIBINY ECM',
    behaviorDesc: 'Wingtip-mounted 1-slot digital radar-deception jammer (38% radar suppression across 85 km). Built for Su-34, Su-30SM, Su-35S, and Su-24M2 strike runs.',
    sigmaPylon: 0.07, category: 'POD', podGroup: 'ECM',
    desc: 'Compact 1-slot wingtip electronic warfare container projecting 38% radar suppression across 85 km.'
  },
  'SORBTSIYA-L005': {
    id: 'SORBTSIYA-L005', name: 'L005 Sorbtsiya Wingtip Jammer', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 410, cost: 1.2, rangeKm: 95.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.44,
    trait: 'WINGTIP_DRFM_ECM', traitBadge: '95KM 44% DRFM ECM',
    behaviorDesc: 'Twin wingtip digital radar-deception jammer pods (44% suppression across 95 km). Lighter 410 kg alternative to AN/ALQ-99.',
    sigmaPylon: 0.11, category: 'POD', podGroup: 'ECM',
    desc: 'Dual wingtip electronic warfare pods projecting 44% radar suppression across 95 km.'
  },
  'AN-ALQ-99': {
    id: 'AN-ALQ-99', name: 'AN/ALQ-99 Jammer Pod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 720, cost: 1.4, rangeKm: 100.0, speedMach: 1.0, damage: 0, isJammerPod: true, jamEfficiency: 0.48,
    trait: 'BROADBAND_JAM', traitBadge: 'AREA ECM JAMMING (48%)',
    behaviorDesc: 'Emits high-power wideband radar noise weakening incoming radar locks and SAM arrays across 100 km (48% suppression).',
    sigmaPylon: 0.15, category: 'POD', podGroup: 'ECM',
    desc: 'Broadband radar jammer pod mounted on external pylons to degrade hostile radar detection across 100 km.'
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
