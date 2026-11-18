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
    desc: 'Carbon-composite light tailless delta ($12.0M, -$3M vs Tejas Mk2). Smaller payload and 2-slot centerline keep costs low for Astra and ASRAAM.'
  },
  'JAS-39C': {
    id: 'JAS-39C', name: 'JAS-39C Gripen', category: 'MULTIROLE', badge: 'EXPEDITIONARY CANARD',
    role: 'Economical Agile Network Fighter', cost: 13.5, hp: 3, AGI_0: 0.94, S_0: 1.10, sOpt: 0.76, R_0: 58.0,
    radarType: 'PS-05/A Mk4 Doppler', radarConeDeg: 115, lookDownBonus: 0.40, sigma_0: 0.85,
    beamSpike: 2.8, thermalBloom: 0.88, M_max: 4200, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'BK-27', allowedGuns: ['BK-27'], gunRounds: 120,
    internalSlots: 0, externalSlots: 6, hasCenterline: true, centerlineSlots: 2, totalSlots: 6,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'Cost-effective Gripen C ($13.5M, -$8.5M vs Gripen E). Retains 0.94 dogfight agility and 9G limits while using mechanical radar.'
  },
  'F-16C-B52': {
    id: 'F-16C-B52', name: 'F-16C Block 52+ Viper', category: 'MULTIROLE', badge: 'SEAD & MULTIROlE VIPER',
    role: 'Tactical Wild Weasel & Multirole', cost: 14.0, hp: 3, AGI_0: 0.90, S_0: 1.16, sOpt: 0.78, R_0: 58.0,
    radarType: 'APG-68v9 Pulse-Doppler', radarConeDeg: 110, lookDownBonus: 0.30, sigma_0: 1.25,
    beamSpike: 3.2, thermalBloom: 1.02, M_max: 4800, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2'], gunRounds: 510,
    internalSlots: 0, externalSlots: 6, hasCenterline: true, centerlineSlots: 4, totalSlots: 6,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'Classic Block 52+ Viper ($14.0M, -$2M vs F-16V). Slightly heavier payload haul (4,800 kg) with legacy radar for budget SEAD and patrol wings.'
  },
  'F-18C-PLUS': {
    id: 'F-18C-PLUS', name: 'F/A-18C+ Legacy Hornet', category: 'MULTIROLE', badge: 'AGILE LEGACY HORNET',
    role: 'High-AoA Carrier Multirole', cost: 15.0, hp: 4, AGI_0: 0.84, S_0: 0.98, sOpt: 0.70, R_0: 60.0,
    radarType: 'APG-73 Pulse-Doppler', radarConeDeg: 115, lookDownBonus: 0.38, sigma_0: 1.20,
    beamSpike: 3.1, thermalBloom: 1.04, M_max: 6200, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2'], gunRounds: 578,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Lighter, snappier Legacy Hornet ($15.0M, -$9M vs F-18E). High 0.84 nose-pointing agility and Type H wing stations at multirole bargain cost.'
  },
  'F-18F': {
    id: 'F-18F', name: 'F/A-18F Block III Rhino', category: 'MULTIROLE', badge: 'HEAVY CFT BLOCK III',
    role: 'Twin-Seat Heavy Carrier Multirole', cost: 28.5, hp: 5, AGI_0: 0.68, S_0: 0.96, sOpt: 0.70, R_0: 78.0,
    radarType: 'APG-79v4 GaN AESA', radarConeDeg: 125, lookDownBonus: 0.60, sigma_0: 0.85,
    beamSpike: 2.9, thermalBloom: 1.02, M_max: 8200, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'GAU-22'], gunRounds: 412,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 6, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Conformal-tank Block III Rhino ($28.5M, +$4.5M over F-18E). Trades agility (0.68) and sprint (0.96) for 5 HP armor, 78 km GaN radar, 8,200 kg haul, and 4 sockets.'
  },
  'J-10C': {
    id: 'J-10C', name: 'Chengdu J-10C Vigorous Dragon', category: 'MULTIROLE', badge: 'DSI CANARD AESA',
    role: 'High-Agility Canard-Delta Multirole', cost: 18.5, hp: 3, AGI_0: 1.02, S_0: 1.24, sOpt: 0.82, R_0: 72.0,
    radarType: 'KLJ-10A AESA + IRST', radarConeDeg: 120, lookDownBonus: 0.48, sigma_0: 0.90,
    beamSpike: 2.8, thermalBloom: 0.96, M_max: 5500, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-23L', allowedGuns: ['GSH-23L', 'GSH-30-1'], gunRounds: 200,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: '4.5-gen diverterless-inlet canard delta ($18.5M, 1.02 agility, 72 km AESA). Nimble mid-price bridge between F-16V ($16M) and Rafale-C ($28M).'
  },
  'Rafale-M': {
    id: 'Rafale-M', name: 'Dassault Rafale M (F4)', category: 'MULTIROLE', badge: 'HEAVY CARRIER F4',
    role: 'Navalized F4 Omnirole Strike Fighter', cost: 31.5, hp: 5, AGI_0: 1.06, S_0: 1.28, sOpt: 0.86, R_0: 84.0,
    radarType: 'RBE2-AA F4 AESA (+70% Clutter)', radarConeDeg: 125, lookDownBonus: 0.70, sigma_0: 0.35,
    beamSpike: 2.6, thermalBloom: 0.84, M_max: 7800, G_limit: 9.5, isDrone: false, thrustVector: false,
    builtInGun: 'BK-27', allowedGuns: ['BK-27', 'M61A2'], gunRounds: 125,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Reinforced F4 naval Rafale ($31.5M, +$3.5M over Rafale C). Carrier undercarriage trades speed (1.28) and agility (1.06) for 5 HP armor and 84 km RBE2-AA radar.'
  },
  'MiG-29SMT': {
    id: 'MiG-29SMT', name: 'MiG-29SMT Fulcrum-E', category: 'MULTIROLE', badge: 'STRIKE-TANK FULCRUM',
    role: 'Modernized Tactical Strike Fulcrum', cost: 15.5, hp: 4, AGI_0: 0.86, S_0: 1.16, sOpt: 0.78, R_0: 60.0,
    radarType: 'Zhuk-ME Slotted Array', radarConeDeg: 110, lookDownBonus: 0.30, sigma_0: 2.60,
    beamSpike: 3.5, thermalBloom: 1.20, M_max: 5600, G_limit: 8.5, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'GSH-23L'], gunRounds: 150,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'Dorsal-fuel-tank Fulcrum ($15.5M, -$2.5M vs MiG-29K). Sacrifices MiG-29K agility (0.86 vs 0.95) for lower cost and solid 4 HP strike carriage.'
  },
  'Mirage-F1EQ': {
    id: 'Mirage-F1EQ', name: 'Dassault Mirage F1EQ', category: 'MULTIROLE', badge: 'BUDGET SWEPT-WING FIGHTER',
    role: 'Lightweight Swept-Wing Multirole', cost: 10.5, hp: 3, AGI_0: 0.78, S_0: 1.18, sOpt: 0.80, R_0: 50.0,
    radarType: 'Cyrano IVM', radarConeDeg: 100, lookDownBonus: 0.22, sigma_0: 1.80,
    beamSpike: 3.3, thermalBloom: 1.08, M_max: 4000, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'BK-27', allowedGuns: ['BK-27'], gunRounds: 135,
    internalSlots: 0, externalSlots: 6, hasCenterline: true, centerlineSlots: 2, totalSlots: 6,
    maxPylonRating: 'Type M', upgradeSockets: 3,
    desc: 'Economical supersonic swept-wing multirole ($10.5M, Mach 1.18). Cheap fleet filler suited for light patrols, SEAD, and rocket passes.'
  },
  'F-5E-TIGER': {
    id: 'F-5E-TIGER', name: 'F-5EM Tiger II (AESA)', category: 'MULTIROLE', badge: 'ULTRA-LIGHT TINY RCS',
    role: 'Micro-Fighter Aggressor & Point Defense', cost: 9.5, hp: 3, AGI_0: 0.96, S_0: 0.96, sOpt: 0.68, R_0: 52.0,
    radarType: 'Grifo-F / Modernized Array', radarConeDeg: 105, lookDownBonus: 0.30, sigma_0: 0.65,
    beamSpike: 2.5, thermalBloom: 0.82, M_max: 3200, G_limit: 8.5, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'MICRO_GUN'], gunRounds: 280,
    internalSlots: 0, externalSlots: 6, hasCenterline: false, centerlineSlots: 0, totalSlots: 6,
    maxPylonRating: 'Type S', upgradeSockets: 3,
    desc: 'Ultra-cheap agile micro-fighter ($9.5M, 0.96 agility, 0.65m2 RCS). Tiny airframe and Type S pylons let light swarm wings punch above their cost.'
  }
};
