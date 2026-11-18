/**
 * js/data/aircraft/stealthnext.js - 5th-Gen Stealth Variants and 6th-Gen Air Dominance Airframes.
 */

window.AIRCRAFT_STEALTH_NEXT = {
  'F-35B': {
    id: 'F-35B', name: 'F-35B Lightning II (STOVL)', category: 'STEALTH', badge: 'STOVL STEALTH VLO',
    role: 'Short-Takeoff Stealth Multirole', cost: 39.0, hp: 4, AGI_0: 0.72, S_0: 0.98, sOpt: 0.68, R_0: 90.0,
    radarType: 'APG-81 GaN AESA (+86% Clutter)', radarConeDeg: 120, lookDownBonus: 0.86, sigma_0: 0.0004,
    beamSpike: 2.2, thermalBloom: 0.74, M_max: 5200, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'GAU-22', allowedGuns: ['GAU-22', 'M61A2', 'PLSL_LIGHT'], gunRounds: 220,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'STOVL stealth variant ($39.0M, 1-segment runway capable). Swivel lift-fan nozzle limits sprint Mach to 0.98 while preserving VLO sensor fusion.'
  },
  'F-35C': {
    id: 'F-35C', name: 'F-35C Lightning II (Carrier)', category: 'STEALTH', badge: 'CARRIER VLO WING',
    role: 'Carrier-Borne Stealth Multirole', cost: 41.0, hp: 5, AGI_0: 0.78, S_0: 1.04, sOpt: 0.72, R_0: 96.0,
    radarType: 'APG-81 Naval GaN AESA', radarConeDeg: 120, lookDownBonus: 0.88, sigma_0: 0.0003,
    beamSpike: 2.1, thermalBloom: 0.68, M_max: 7200, G_limit: 8.0, isDrone: false, thrustVector: false,
    builtInGun: 'GAU-22', allowedGuns: ['GAU-22', 'M61A2', 'PLSL_LIGHT'], gunRounds: 220,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Broad-wing carrier stealth fighter ($41.0M, 5 HP, 7,200 kg payload). Enlarged wing area improves sustained turn rate and heavy internal bay haul.'
  },
  'F-22-SUPER': {
    id: 'F-22-SUPER', name: 'F-22A+ Super Raptor', category: 'STEALTH', badge: 'UPGRADED VLO DOMINANCE',
    role: 'Modernized 5th+ Gen Air Dominance', cost: 54.0, hp: 5, AGI_0: 1.20, S_0: 1.66, sOpt: 1.02, R_0: 96.0,
    radarType: 'APG-77v2 GaN AESA + IRST', radarConeDeg: 130, lookDownBonus: 0.85, sigma_0: 0.00008,
    beamSpike: 1.8, thermalBloom: 0.50, M_max: 5400, G_limit: 10.0, isDrone: false, thrustVector: true,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'GAU-22', 'DE-PULSE', 'PLSL_LIGHT'], gunRounds: 480,
    internalSlots: 6, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 10,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Mid-life modernized Raptor ($54.0M, 0.00008m2 RCS, Mach 1.66). Adds stealth IRST pods, low-drag external racks, and 10G thrust-vectoring agility.'
  },
  'J-20B': {
    id: 'J-20B', name: 'Chengdu J-20B (WS-15 TVC)', category: 'STEALTH', badge: 'WS-15 3D TVC STEALTH',
    role: 'Supercruising Stealth Air Superiority', cost: 46.0, hp: 5, AGI_0: 1.04, S_0: 1.52, sOpt: 0.96, R_0: 92.0,
    radarType: 'KLJ-5A GaN AESA', radarConeDeg: 130, lookDownBonus: 0.74, sigma_0: 0.0015,
    beamSpike: 2.2, thermalBloom: 0.68, M_max: 8000, G_limit: 9.5, isDrone: false, thrustVector: true,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'PLSL_LIGHT'], gunRounds: 150,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'WS-15 thrust-vectoring evolution of the Mighty Dragon ($46.0M). Raises agility to 1.04 and supercruise sprint to Mach 1.52 with refined LO shaping.'
  },
  'J-20S': {
    id: 'J-20S', name: 'Chengdu J-20S Twin-Seat', category: 'STEALTH', badge: 'TWIN-SEAT C2 STEALTH',
    role: 'Stealth Drone-Teaming & EW Coordinator', cost: 44.0, hp: 5, AGI_0: 0.86, S_0: 1.38, sOpt: 0.90, R_0: 96.0,
    radarType: 'Broadband Dual-Crew AESA', radarConeDeg: 135, lookDownBonus: 0.76, sigma_0: 0.002,
    beamSpike: 2.3, thermalBloom: 0.70, M_max: 7800, G_limit: 9.0, isDrone: false, thrustVector: true,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'PLSL_LIGHT'], gunRounds: 150,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Twin-seat stealth command fighter ($44.0M). Dedicated weapon systems officer extends radar tracking to 96 km and widens scan coverage to 135 deg.'
  },
  'KAAN': {
    id: 'KAAN', name: 'TAI TF Kaan', category: 'STEALTH', badge: 'TWIN-JET 5TH-GEN',
    role: '5th-Gen Twin-Engine Stealth Fighter', cost: 36.0, hp: 5, AGI_0: 0.90, S_0: 1.38, sOpt: 0.90, R_0: 84.0,
    radarType: 'MURAD GaN AESA + KARAT IRST', radarConeDeg: 125, lookDownBonus: 0.68, sigma_0: 0.004,
    beamSpike: 2.3, thermalBloom: 0.74, M_max: 7200, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'BK-27', 'PLSL_LIGHT'], gunRounds: 400,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Twin-engine 5th-gen air superiority stealth fighter ($36.0M). Balances Mach 1.38 speed, 5 HP durability, and Type H internal bays for Meteor and SOM-J.'
  },
  'KF-21EX': {
    id: 'KF-21EX', name: 'KAI KF-21EX Block III', category: 'STEALTH', badge: 'INTERNAL-BAY BORAMAE',
    role: 'Full-Stealth Internal-Bay Multirole', cost: 35.0, hp: 4, AGI_0: 0.84, S_0: 1.24, sOpt: 0.84, R_0: 82.0,
    radarType: 'Hanwha Block III GaN AESA', radarConeDeg: 120, lookDownBonus: 0.66, sigma_0: 0.003,
    beamSpike: 2.2, thermalBloom: 0.72, M_max: 6800, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'GAU-22', 'PLSL_LIGHT'], gunRounds: 412,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Block III stealth evolution of the Boramae ($35.0M, 0.003m2 RCS). Replaces semi-recessed stations with enclosed internal bays and 4 upgrade sockets.'
  },
  'AMCA-MK1': {
    id: 'AMCA-MK1', name: 'HAL AMCA Mk1', category: 'STEALTH', badge: 'DSI 5TH-GEN STEALTH',
    role: 'Medium Weight Stealth Dominance', cost: 34.0, hp: 4, AGI_0: 0.88, S_0: 1.26, sOpt: 0.84, R_0: 80.0,
    radarType: 'Uttam Mk2 GaN AESA', radarConeDeg: 120, lookDownBonus: 0.64, sigma_0: 0.002,
    beamSpike: 2.1, thermalBloom: 0.70, M_max: 6500, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-23L', allowedGuns: ['GSH-23L', 'GSH-30-1', 'BK-27', 'PLSL_LIGHT'], gunRounds: 220,
    internalSlots: 4, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Diverterless-inlet twin-engine 5th-gen fighter ($34.0M, 0.002m2 RCS). Certified for Astra Mk2/Mk3 SFDR, Meteor, and internal-bay precision glide strikes.'
  },
  'TEMPEST': {
    id: 'TEMPEST', name: 'BAE / GCAP Tempest', category: 'STEALTH', badge: '6TH-GEN SENSOR DOMINANCE',
    role: '6th-Gen Air Dominance & Laser Platform', cost: 56.0, hp: 5, AGI_0: 1.12, S_0: 1.60, sOpt: 1.00, R_0: 104.0,
    radarType: 'ISANKE Broadband Multi-Function Array', radarConeDeg: 140, lookDownBonus: 0.88, sigma_0: 0.00015,
    beamSpike: 1.7, thermalBloom: 0.46, M_max: 6800, G_limit: 10.0, isDrone: false, thrustVector: true,
    builtInGun: 'DE-PULSE', allowedGuns: ['DE-PULSE', 'BK-27', 'PLSL_LIGHT', 'PLSL_MED'], gunRounds: 150,
    internalSlots: 6, externalSlots: 2, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: '6th-gen stealth air dominance fighter ($56.0M, 104 km radar, 0.46x IR cooling). High electrical output drives solid-state lasers and deep internal bays.'
  },
  'FCAS-NGF': {
    id: 'FCAS-NGF', name: 'FCAS Next-Gen Fighter (NGF)', category: 'STEALTH', badge: '6TH-GEN TAILLESS DELTA',
    role: '6th-Gen Tailless Stealth Dominance', cost: 58.0, hp: 5, AGI_0: 1.18, S_0: 1.56, sOpt: 0.98, R_0: 102.0,
    radarType: 'Broadband Conformal GaN AESA', radarConeDeg: 140, lookDownBonus: 0.88, sigma_0: 0.0001,
    beamSpike: 1.6, thermalBloom: 0.44, M_max: 6500, G_limit: 10.5, isDrone: false, thrustVector: true,
    builtInGun: 'DE-PULSE', allowedGuns: ['DE-PULSE', 'BK-27', 'PLSL_LIGHT', 'PLSL_MED'], gunRounds: 150,
    internalSlots: 6, externalSlots: 2, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Tailless 6th-gen European stealth fighter ($58.0M, 0.0001m2 RCS, 1.18 agility). Eliminates vertical tail fin reflections while preserving 10.5G vector agility.'
  },
  'J-36': {
    id: 'J-36', name: 'Chengdu J-36 Heavy 6th-Gen', category: 'STEALTH', badge: 'TRI-JET 8-BAY 6TH-GEN',
    role: 'Heavy Tailless Stealth Dominance & Strike', cost: 60.0, hp: 6, AGI_0: 0.84, S_0: 1.62, sOpt: 1.00, R_0: 105.0,
    radarType: 'Wide-Aperture Triple-Array AESA', radarConeDeg: 135, lookDownBonus: 0.86, sigma_0: 0.00015,
    beamSpike: 1.5, thermalBloom: 0.48, M_max: 11500, G_limit: 8.5, isDrone: false, thrustVector: true,
    builtInGun: 'PLSL_MED', allowedGuns: ['PLSL_MED', 'PLSL_LIGHT', 'DE-PULSE', 'GSH-30-1'], gunRounds: 150,
    internalSlots: 8, externalSlots: 2, hasCenterline: false, centerlineSlots: 0, totalSlots: 10,
    maxPylonRating: 'Type X', upgradeSockets: 4,
    desc: 'Tri-jet tailless heavy stealth airframe ($60.0M, 6 HP, 11,500 kg payload). Huge Type X 8-slot internal bay carries heavy cruise strikes and long-range BVR cleanly.'
  },
  'J-50': {
    id: 'J-50', name: 'Shenyang J-50 Tailless', category: 'STEALTH', badge: '6TH-GEN LAMBDOID VLO',
    role: 'Tailless Carrier & Air Dominance Stealth', cost: 52.0, hp: 5, AGI_0: 1.16, S_0: 1.54, sOpt: 0.98, R_0: 98.0,
    radarType: 'Coherent GaN AESA + EOTS', radarConeDeg: 135, lookDownBonus: 0.82, sigma_0: 0.0002,
    beamSpike: 1.6, thermalBloom: 0.50, M_max: 6200, G_limit: 10.0, isDrone: false, thrustVector: true,
    builtInGun: 'DE-PULSE', allowedGuns: ['DE-PULSE', 'PLSL_LIGHT', 'PLSL_MED', 'GSH-30-1'], gunRounds: 150,
    internalSlots: 6, externalSlots: 2, hasCenterline: false, centerlineSlots: 0, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Tailless cranked-wing stealth fighter with pivoting wingtips ($52.0M, 0.0002m2 RCS, 1.16 agility). Combines 2D vectoring nozzles with 6 internal stealth bays.'
  }
};
