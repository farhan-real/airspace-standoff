/**
 * js/data/aircraft/stealthnext.js - 5th-Gen Stealth Variants and 6th-Gen Air Dominance Airframes.
 */

window.AIRCRAFT_STEALTH_NEXT = {
  'F-35B': {
    id: 'F-35B', name: 'F-35B Lightning II (STOVL)', category: 'STEALTH', badge: 'STOVL STEALTH VLO',
    role: 'Short-Takeoff Stealth Multirole', cost: 36.5, hp: 4, AGI_0: 0.74, S_0: 0.98, sOpt: 0.68, R_0: 88.0,
    radarType: 'APG-81 GaN AESA (+84% Clutter)', radarConeDeg: 120, lookDownBonus: 0.84, sigma_0: 0.0004,
    beamSpike: 2.2, thermalBloom: 0.76, M_max: 5200, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'GAU-22', allowedGuns: ['GAU-22', 'M61A2', 'PLSL_LIGHT'], gunRounds: 220,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Budget STOVL stealth variant ($36.5M, 1-segment runway capable). Lift-fan nozzle trims sprint speed and G-limit vs F-35A while saving $1.5M per frame.'
  },
  'F-35C': {
    id: 'F-35C', name: 'F-35C Lightning II (Carrier)', category: 'STEALTH', badge: 'HEAVY CARRIER VLO',
    role: 'Heavy Carrier-Borne Stealth Strike', cost: 42.0, hp: 5, AGI_0: 0.74, S_0: 1.02, sOpt: 0.70, R_0: 96.0,
    radarType: 'APG-81 Naval GaN AESA', radarConeDeg: 120, lookDownBonus: 0.88, sigma_0: 0.0004,
    beamSpike: 2.1, thermalBloom: 0.68, M_max: 7600, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'GAU-22', allowedGuns: ['GAU-22', 'M61A2', 'PLSL_LIGHT'], gunRounds: 220,
    internalSlots: 4, externalSlots: 6, hasCenterline: false, centerlineSlots: 0, totalSlots: 10,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Broad-wing heavy carrier stealth fighter ($42.0M, 5 HP, 7,600 kg, 10 stations). Trades F-35A agility and 9G snap for +1 HP armor and 2 extra external pylons.'
  },
  'F-22-SUPER': {
    id: 'F-22-SUPER', name: 'F-22A+ Super Raptor', category: 'STEALTH', badge: 'SENSOR-HEAVY VLO RAPTOR',
    role: 'Modernized Heavy Sensor Raptor', cost: 56.0, hp: 5, AGI_0: 1.12, S_0: 1.64, sOpt: 1.02, R_0: 96.0,
    radarType: 'APG-77v2 GaN AESA + IRST', radarConeDeg: 130, lookDownBonus: 0.86, sigma_0: 0.00015,
    beamSpike: 1.9, thermalBloom: 0.52, M_max: 5800, G_limit: 9.5, isDrone: false, thrustVector: true,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'GAU-22', 'DE-PULSE', 'PLSL_LIGHT'], gunRounds: 480,
    internalSlots: 6, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 10,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Modernized Raptor ($56.0M, +$8M over F-22A). Sensor-heavy airframe trades slight weight (AGI 1.12, 0.00015m2 RCS) for 96 km radar, 10 stations, 4 sockets, and DE-Pulse.'
  },
  'J-20B': {
    id: 'J-20B', name: 'Chengdu J-20B (WS-15 TVC)', category: 'STEALTH', badge: 'WS-15 3D TVC STEALTH',
    role: 'Supercruising Stealth Air Superiority', cost: 48.0, hp: 5, AGI_0: 1.06, S_0: 1.54, sOpt: 0.96, R_0: 92.0,
    radarType: 'KLJ-5A GaN AESA', radarConeDeg: 130, lookDownBonus: 0.74, sigma_0: 0.0015,
    beamSpike: 2.2, thermalBloom: 0.68, M_max: 8000, G_limit: 9.5, isDrone: false, thrustVector: true,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'PLSL_LIGHT'], gunRounds: 150,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'WS-15 thrust-vectoring upgrade ($48.0M, +$8M over base J-20). Major jump in supercruise speed (Mach 1.54) and dogfight agility (1.06) matching F-22A pricing.'
  },
  'J-20S': {
    id: 'J-20S', name: 'Chengdu J-20S Twin-Seat', category: 'STEALTH', badge: 'TWIN-SEAT C2 STEALTH EW',
    role: 'Stealth Electronic Attack & Coordinator', cost: 44.0, hp: 5, AGI_0: 0.80, S_0: 1.34, sOpt: 0.88, R_0: 98.0,
    radarType: 'Broadband Dual-Crew AESA', radarConeDeg: 135, lookDownBonus: 0.78, sigma_0: 0.003,
    beamSpike: 2.4, thermalBloom: 0.72, M_max: 7800, G_limit: 8.5, isDrone: false, isEW: true, jamEfficiency: 0.25, hasESM: true, thrustVector: true,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'PLSL_LIGHT'], gunRounds: 150,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Twin-seat stealth EW coordinator ($44.0M). Larger canopy trades slight agility and RCS vs J-20 for 98 km radar, 135 deg cone, passive ESM, and 25% built-in jamming.'
  },
  'KAAN': {
    id: 'KAAN', name: 'TAI TF Kaan', category: 'STEALTH', badge: 'HEAVY TWIN-JET 5TH-GEN',
    role: 'Heavy 5th-Gen Twin-Engine Stealth', cost: 39.0, hp: 5, AGI_0: 0.84, S_0: 1.36, sOpt: 0.88, R_0: 84.0,
    radarType: 'MURAD GaN AESA + KARAT IRST', radarConeDeg: 125, lookDownBonus: 0.68, sigma_0: 0.005,
    beamSpike: 2.3, thermalBloom: 0.75, M_max: 7400, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'BK-27', 'PLSL_LIGHT'], gunRounds: 400,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Heavy 5 HP twin-engine stealth fighter ($39.0M). Cheaper and slightly less stealthy than J-20 ($40M), trading TVC and a 4th socket for Western/Turkish stores compatibility.'
  },
  'KF-21EX': {
    id: 'KF-21EX', name: 'KAI KF-21EX Block III', category: 'STEALTH', badge: 'INTERNAL-BAY BORAMAE',
    role: 'Modular Internal-Bay Stealth Multirole', cost: 35.0, hp: 4, AGI_0: 0.82, S_0: 1.22, sOpt: 0.82, R_0: 80.0,
    radarType: 'Hanwha Block III GaN AESA', radarConeDeg: 120, lookDownBonus: 0.66, sigma_0: 0.004,
    beamSpike: 2.2, thermalBloom: 0.72, M_max: 6400, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'GAU-22', 'PLSL_LIGHT'], gunRounds: 412,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Block III stealth evolution ($35.0M, +$7M over KF-21). Trades centerline rail for true enclosed internal VLO bays (0.004m2 RCS) and 4 upgrade sockets.'
  },
  'AMCA-MK1': {
    id: 'AMCA-MK1', name: 'HAL AMCA Mk1', category: 'STEALTH', badge: 'AGILE 5TH-GEN STEALTH',
    role: 'Medium Weight Stealth Interceptor', cost: 34.0, hp: 4, AGI_0: 0.88, S_0: 1.24, sOpt: 0.84, R_0: 78.0,
    radarType: 'Uttam Mk2 GaN AESA', radarConeDeg: 120, lookDownBonus: 0.64, sigma_0: 0.002,
    beamSpike: 2.1, thermalBloom: 0.70, M_max: 5800, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-23L', allowedGuns: ['GSH-23L', 'GSH-30-1', 'BK-27', 'PLSL_LIGHT'], gunRounds: 220,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Nimble medium-weight stealth fighter ($34.0M). More agile (0.88) and stealthier (0.002m2) than J-35, trading radar reach (78 km) and max payload (5,800 kg).'
  },
  'TEMPEST': {
    id: 'TEMPEST', name: 'BAE / GCAP Tempest', category: 'STEALTH', badge: '6TH-GEN SENSOR DOMINANCE',
    role: '6th-Gen Air Dominance & Laser Platform', cost: 58.0, hp: 5, AGI_0: 1.08, S_0: 1.58, sOpt: 0.98, R_0: 104.0,
    radarType: 'ISANKE Broadband Multi-Function Array', radarConeDeg: 140, lookDownBonus: 0.88, sigma_0: 0.00015,
    beamSpike: 1.7, thermalBloom: 0.46, M_max: 6800, G_limit: 10.0, isDrone: false, thrustVector: true,
    builtInGun: 'DE-PULSE', allowedGuns: ['DE-PULSE', 'BK-27', 'PLSL_LIGHT', 'PLSL_MED'], gunRounds: 150,
    internalSlots: 6, externalSlots: 2, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: '6th-gen sensor flagship ($58.0M, 104 km radar, 140 deg cone, 0.46x IR cooling). Prioritizes unmatched radar awareness and 6 internal bays over raw turn agility.'
  },
  'FCAS-NGF': {
    id: 'FCAS-NGF', name: 'FCAS Next-Gen Fighter (NGF)', category: 'STEALTH', badge: '6TH-GEN TAILLESS DELTA',
    role: '6th-Gen Tailless Stealth Dominance', cost: 60.0, hp: 5, AGI_0: 1.18, S_0: 1.54, sOpt: 0.98, R_0: 100.0,
    radarType: 'Broadband Conformal GaN AESA', radarConeDeg: 140, lookDownBonus: 0.88, sigma_0: 0.0001,
    beamSpike: 1.6, thermalBloom: 0.44, M_max: 6200, G_limit: 10.5, isDrone: false, thrustVector: true,
    builtInGun: 'DE-PULSE', allowedGuns: ['DE-PULSE', 'BK-27', 'PLSL_LIGHT', 'PLSL_MED'], gunRounds: 150,
    internalSlots: 6, externalSlots: 2, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Tailless 6th-gen stealth dogfighter ($60.0M, 0.0001m2 RCS, 1.18 agility). Costs $12M more than F-22A for 100 km 140 deg radar, 4 sockets, and extreme IR cooling.'
  },
  'J-36': {
    id: 'J-36', name: 'Chengdu J-36 Heavy 6th-Gen', category: 'STEALTH', badge: 'TRI-JET 8-BAY 6TH-GEN',
    role: 'Heavy Tailless Stealth Dominance & Strike', cost: 62.0, hp: 6, AGI_0: 0.80, S_0: 1.60, sOpt: 1.00, R_0: 105.0,
    radarType: 'Wide-Aperture Triple-Array AESA', radarConeDeg: 135, lookDownBonus: 0.86, sigma_0: 0.0002,
    beamSpike: 1.5, thermalBloom: 0.50, M_max: 11500, G_limit: 8.5, isDrone: false, thrustVector: true,
    builtInGun: 'PLSL_MED', allowedGuns: ['PLSL_MED', 'PLSL_LIGHT', 'DE-PULSE', 'GSH-30-1'], gunRounds: 150,
    internalSlots: 8, externalSlots: 2, hasCenterline: false, centerlineSlots: 0, totalSlots: 10,
    maxPylonRating: 'Type X', upgradeSockets: 4,
    desc: 'Tri-jet heavy stealth cruiser ($62.0M, 6 HP, 11,500 kg). Trades agile dogfighting (0.80) for Type X 8-slot internal bays, 105 km radar, and Mach 1.60 supercruise.'
  },
  'J-50': {
    id: 'J-50', name: 'Shenyang J-50 Tailless', category: 'STEALTH', badge: '6TH-GEN LAMBDOID VLO',
    role: 'Tailless Air Dominance Stealth Fighter', cost: 52.0, hp: 5, AGI_0: 1.16, S_0: 1.50, sOpt: 0.96, R_0: 94.0,
    radarType: 'Coherent GaN AESA + EOTS', radarConeDeg: 135, lookDownBonus: 0.82, sigma_0: 0.0002,
    beamSpike: 1.6, thermalBloom: 0.50, M_max: 5800, G_limit: 10.0, isDrone: false, thrustVector: true,
    builtInGun: 'DE-PULSE', allowedGuns: ['DE-PULSE', 'PLSL_LIGHT', 'PLSL_MED', 'GSH-30-1'], gunRounds: 150,
    internalSlots: 6, externalSlots: 2, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Nimble tailless stealth interceptor ($52.0M, 0.0002m2 RCS, 1.16 agility). Cheaper than TEMPEST/FCAS-NGF by trimming radar to 94 km and sockets to 3.'
  }
};
