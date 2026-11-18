/**
 * js/data/aircraft/multiroleplus.js - Additional Light, Carrier, and Modern Multirole Fighters.
 */

window.AIRCRAFT_MULTIROLE_PLUS = {
  'JF-17-B3': {
    id: 'JF-17-B3', name: 'JF-17 Block III Thunder', category: 'MULTIROLE', badge: 'BUDGET AESA THUNDER',
    role: 'Light Economical AESA Multirole', cost: 12.5, hp: 3, AGI_0: 0.88, S_0: 1.06, sOpt: 0.74, R_0: 64.0,
    radarType: 'KLJ-7A Liquid-Cooled AESA', radarConeDeg: 115, lookDownBonus: 0.42, sigma_0: 0.95,
    beamSpike: 2.8, thermalBloom: 0.95, M_max: 4200, G_limit: 8.5, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-23L', allowedGuns: ['GSH-23L', 'GSH-30-1'], gunRounds: 180,
    internalSlots: 0, externalSlots: 6, hasCenterline: true, centerlineSlots: 4, totalSlots: 6,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'High-value lightweight AESA fighter ($12.5M, 64 km radar). Brings modern PL-15E and PL-10 BVR/WVR firepower to budget-restricted squadrons.'
  },
  'FA-50-B20': {
    id: 'FA-50-B20', name: 'KAI FA-50 Block 20', category: 'MULTIROLE', badge: 'LIGHT AESA FIGHTER',
    role: 'Lightweight Supersonic Multirole', cost: 11.0, hp: 3, AGI_0: 0.90, S_0: 1.02, sOpt: 0.70, R_0: 58.0,
    radarType: 'PhantomStrike Compact AESA', radarConeDeg: 110, lookDownBonus: 0.40, sigma_0: 0.85,
    beamSpike: 2.7, thermalBloom: 0.90, M_max: 3900, G_limit: 8.0, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'BK-27'], gunRounds: 205,
    internalSlots: 0, externalSlots: 6, hasCenterline: true, centerlineSlots: 2, totalSlots: 6,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'Agile light fighter ($11.0M, 0.90 agility). Integrates PhantomStrike AESA radar, AIM-120D BVR rails, and Sniper XR targeting support.'
  },
  'Tejas-MK1A': {
    id: 'Tejas-MK1A', name: 'HAL Tejas Mk1A', category: 'MULTIROLE', badge: 'LIGHT COMPOSITE DELTA',
    role: 'Light Composite Delta Multirole', cost: 12.0, hp: 3, AGI_0: 0.86, S_0: 1.04, sOpt: 0.72, R_0: 60.0,
    radarType: 'EL/M-2052 AESA', radarConeDeg: 115, lookDownBonus: 0.38, sigma_0: 0.80,
    beamSpike: 2.7, thermalBloom: 0.92, M_max: 4000, G_limit: 8.5, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-23L', allowedGuns: ['GSH-23L'], gunRounds: 220,
    internalSlots: 0, externalSlots: 6, hasCenterline: true, centerlineSlots: 2, totalSlots: 6,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'Carbon-composite light tailless delta ($12.0M, 0.80m2 RCS). Pairs EL/M-2052 AESA tracking with Astra, I-Derby ER, and ASRAAM missiles.'
  },
  'JAS-39C': {
    id: 'JAS-39C', name: 'JAS-39C Gripen', category: 'MULTIROLE', badge: 'EXPEDITIONARY CANARD',
    role: 'Economical Agile Network Fighter', cost: 13.5, hp: 3, AGI_0: 0.94, S_0: 1.10, sOpt: 0.76, R_0: 58.0,
    radarType: 'PS-05/A Mk4 Doppler', radarConeDeg: 115, lookDownBonus: 0.40, sigma_0: 0.85,
    beamSpike: 2.8, thermalBloom: 0.88, M_max: 4200, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'BK-27', allowedGuns: ['BK-27'], gunRounds: 120,
    internalSlots: 0, externalSlots: 6, hasCenterline: true, centerlineSlots: 2, totalSlots: 6,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'Cost-effective Gripen C ($13.5M, 0.94 agility, 9G). Compact RM12 engine yields low 0.88x thermal bloom with 6 external stations and centerline mount.'
  },
  'F-16C-B52': {
    id: 'F-16C-B52', name: 'F-16C Block 52+ Viper', category: 'MULTIROLE', badge: 'SEAD & MULTIROlE VIPER',
    role: 'Tactical Wild Weasel & Multirole', cost: 14.5, hp: 3, AGI_0: 0.92, S_0: 1.16, sOpt: 0.78, R_0: 60.0,
    radarType: 'APG-68v9 Pulse-Doppler', radarConeDeg: 110, lookDownBonus: 0.34, sigma_0: 1.25,
    beamSpike: 3.2, thermalBloom: 1.02, M_max: 4800, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2'], gunRounds: 510,
    internalSlots: 0, externalSlots: 6, hasCenterline: true, centerlineSlots: 4, totalSlots: 6,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'Classic Block 52+ Fighting Falcon ($14.5M, 9G). Cheaper workhorse than the F-16V, widely flown with HTS pods and HARM SEAD loadouts.'
  },
  'F-18C-PLUS': {
    id: 'F-18C-PLUS', name: 'F/A-18C+ Legacy Hornet', category: 'MULTIROLE', badge: 'AGILE LEGACY HORNET',
    role: 'High-AoA Carrier Multirole', cost: 15.0, hp: 4, AGI_0: 0.84, S_0: 0.98, sOpt: 0.70, R_0: 60.0,
    radarType: 'APG-73 Pulse-Doppler', radarConeDeg: 115, lookDownBonus: 0.38, sigma_0: 1.20,
    beamSpike: 3.1, thermalBloom: 1.04, M_max: 6200, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2'], gunRounds: 578,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Lighter, snappier Legacy Hornet ($15.0M, 0.84 agility, 4 HP). Retains Type H external wing stations for heavy bombs and Maverick/ATFLIR strike roles.'
  },
  'F-18F': {
    id: 'F-18F', name: 'F/A-18F Block III Rhino', category: 'MULTIROLE', badge: 'BLOCK III DUAL-SEAT CFT',
    role: 'Twin-Seat Heavy Carrier Multirole', cost: 26.5, hp: 5, AGI_0: 0.74, S_0: 1.02, sOpt: 0.72, R_0: 76.0,
    radarType: 'APG-79v4 GaN AESA', radarConeDeg: 125, lookDownBonus: 0.58, sigma_0: 0.85,
    beamSpike: 2.9, thermalBloom: 1.02, M_max: 8000, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'GAU-22'], gunRounds: 412,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 6, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Block III Super Hornet ($26.5M, 5 HP, 8,000 kg payload). Upgraded GaN APG-79v4 radar and 4 upgrade sockets handle AIM-174B fleet defense and deep strike.'
  },
  'J-10C': {
    id: 'J-10C', name: 'Chengdu J-10C Vigorous Dragon', category: 'MULTIROLE', badge: 'DSI CANARD AESA',
    role: 'High-Agility Canard-Delta Multirole', cost: 18.5, hp: 3, AGI_0: 1.02, S_0: 1.24, sOpt: 0.82, R_0: 72.0,
    radarType: 'KLJ-10A AESA + IRST', radarConeDeg: 120, lookDownBonus: 0.48, sigma_0: 0.90,
    beamSpike: 2.8, thermalBloom: 0.96, M_max: 5500, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-23L', allowedGuns: ['GSH-23L', 'GSH-30-1'], gunRounds: 200,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: '4.5-gen diverterless-inlet canard delta ($18.5M, 1.02 agility, 72 km AESA). Excels in nimble BVR/WVR merges with PL-15E, PL-10, and Khibiny pods.'
  },
  'Rafale-M': {
    id: 'Rafale-M', name: 'Dassault Rafale M (F4)', category: 'MULTIROLE', badge: 'CARRIER F4 OMNIROLE',
    role: 'Navalized F4 Omnirole Strike Fighter', cost: 29.0, hp: 5, AGI_0: 1.12, S_0: 1.32, sOpt: 0.88, R_0: 82.0,
    radarType: 'RBE2-AA F4 AESA (+70% Clutter)', radarConeDeg: 125, lookDownBonus: 0.70, sigma_0: 0.35,
    beamSpike: 2.6, thermalBloom: 0.84, M_max: 7600, G_limit: 9.5, isDrone: false, thrustVector: false,
    builtInGun: 'BK-27', allowedGuns: ['BK-27', 'M61A2'], gunRounds: 125,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Reinforced F4-standard carrier Rafale ($29.0M, 5 HP, 1.12 agility). Blends 0.35m2 RCS shaping, SPECTRA EW integration, and 2-segment carrier deck launches.'
  },
  'MiG-29SMT': {
    id: 'MiG-29SMT', name: 'MiG-29SMT Fulcrum-E', category: 'MULTIROLE', badge: 'EXTENDED-RANGE FULCRUM',
    role: 'Modernized Tactical Strike Fulcrum', cost: 15.5, hp: 4, AGI_0: 0.92, S_0: 1.22, sOpt: 0.82, R_0: 62.0,
    radarType: 'Zhuk-ME Slotted Array', radarConeDeg: 110, lookDownBonus: 0.30, sigma_0: 2.40,
    beamSpike: 3.5, thermalBloom: 1.20, M_max: 5000, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'GSH-23L'], gunRounds: 150,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'Upgraded spine-tank Fulcrum ($15.5M, 4 HP, 0.92 agility). Expands air-to-ground precision weapon compatibility while keeping agile dogfight energy.'
  },
  'Mirage-F1EQ': {
    id: 'Mirage-F1EQ', name: 'Dassault Mirage F1EQ', category: 'MULTIROLE', badge: 'BUDGET SWEPT-WING FIGHTER',
    role: 'Lightweight Swept-Wing Multirole', cost: 10.5, hp: 3, AGI_0: 0.78, S_0: 1.18, sOpt: 0.80, R_0: 50.0,
    radarType: 'Cyrano IVM', radarConeDeg: 100, lookDownBonus: 0.22, sigma_0: 1.80,
    beamSpike: 3.3, thermalBloom: 1.08, M_max: 4000, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'BK-27', allowedGuns: ['BK-27'], gunRounds: 135,
    internalSlots: 0, externalSlots: 6, hasCenterline: true, centerlineSlots: 2, totalSlots: 6,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'Economical supersonic swept-wing multirole ($10.5M, Mach 1.18). Cheap fleet filler suited for light patrols, Exocet/Armat SEAD, and rocket passes.'
  },
  'F-5E-TIGER': {
    id: 'F-5E-TIGER', name: 'F-5EM Tiger II (AESA)', category: 'MULTIROLE', badge: 'ULTRA-LIGHT TINY RCS',
    role: 'Micro-Fighter Aggressor & Point Defense', cost: 9.5, hp: 3, AGI_0: 0.96, S_0: 0.96, sOpt: 0.68, R_0: 52.0,
    radarType: 'Grifo-F / Modernized Array', radarConeDeg: 105, lookDownBonus: 0.30, sigma_0: 0.65,
    beamSpike: 2.5, thermalBloom: 0.82, M_max: 3200, G_limit: 8.5, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'MICRO_GUN'], gunRounds: 280,
    internalSlots: 0, externalSlots: 6, hasCenterline: false, centerlineSlots: 0, totalSlots: 6,
    maxPylonRating: 'Type S', upgradeSockets: 3,
    desc: 'Ultra-cheap agile micro-fighter ($9.5M, 0.96 agility, 0.65m2 RCS). Tiny airframe and cool twin J85 engines let light swarm wings punch above their cost.'
  }
};
