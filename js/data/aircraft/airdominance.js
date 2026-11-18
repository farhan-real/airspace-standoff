/**
 * js/data/aircraft/airdominance.js - Additional Air Superiority Fighters and Heavy Interceptors.
 */

window.AIRCRAFT_AIR_DOMINANCE = {
  'F-15C': {
    id: 'F-15C', name: 'F-15C Golden Eagle', category: 'SUPERIORITY', badge: 'APG-63V3 SUPERIORITY',
    role: 'Pure Air Superiority Fighter', cost: 24.0, hp: 5, AGI_0: 0.84, S_0: 1.50, sOpt: 0.96, R_0: 88.0,
    radarType: 'APG-63(v)3 AESA', radarConeDeg: 120, lookDownBonus: 0.58, sigma_0: 6.5,
    beamSpike: 3.8, thermalBloom: 1.22, M_max: 9000, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2'], gunRounds: 940,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Lighter, more agile air-to-air specialist Eagle ($24.0M, 0.84 agility, Mach 1.50). Pairs APG-63(v)3 AESA radar with 8 external stations and centerline mount.'
  },
  'F-15J-JSI': {
    id: 'F-15J-JSI', name: 'F-15JSI Super Interceptor', category: 'SUPERIORITY', badge: 'PAC-RIM AESA EAGLE',
    role: 'Modernized Heavy Fleet Interceptor', cost: 27.5, hp: 5, AGI_0: 0.80, S_0: 1.52, sOpt: 0.96, R_0: 92.0,
    radarType: 'APG-82v1 AESA + EPAWSS', radarConeDeg: 125, lookDownBonus: 0.62, sigma_0: 6.0,
    beamSpike: 3.7, thermalBloom: 1.20, M_max: 10200, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2', 'PLSL_LIGHT'], gunRounds: 940,
    internalSlots: 0, externalSlots: 10, hasCenterline: true, centerlineSlots: 4, totalSlots: 10,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Upgraded Japanese Super Interceptor ($27.5M, 92 km AESA). Integrates 4 upgrade sockets with 10 external pylons for AAM-4B, AIM-174B, and JASSM-ER standoff.'
  },
  'Su-27SM3': {
    id: 'Su-27SM3', name: 'Su-27SM3 Flanker-B Mod', category: 'SUPERIORITY', badge: 'AGILE CLASSIC FLANKER',
    role: 'Air Superiority Heavy Dogfighter', cost: 19.0, hp: 5, AGI_0: 1.04, S_0: 1.36, sOpt: 0.90, R_0: 72.0,
    radarType: 'N001VEP-M Doppler', radarConeDeg: 120, lookDownBonus: 0.36, sigma_0: 3.2,
    beamSpike: 3.6, thermalBloom: 1.24, M_max: 7600, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'GSH-23L'], gunRounds: 150,
    internalSlots: 0, externalSlots: 10, hasCenterline: true, centerlineSlots: 4, totalSlots: 10,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Economical modernized Flanker ($19.0M, 1.04 agility, Mach 1.36). Delivers 10 external stations and classic Flanker dogfight energy without TVC price overhead.'
  },
  'Su-30MKI': {
    id: 'Su-30MKI', name: 'Su-30MKI Flanker-H+', category: 'SUPERIORITY', badge: 'CANARD TVC + BRAHMOS',
    role: 'Thrust-Vectored Heavy Superiority', cost: 23.5, hp: 5, AGI_0: 1.08, S_0: 1.28, sOpt: 0.86, R_0: 78.0,
    radarType: 'N011M Bars PESA + OLS-30', radarConeDeg: 125, lookDownBonus: 0.44, sigma_0: 3.0,
    beamSpike: 3.6, thermalBloom: 1.24, M_max: 8400, G_limit: 9.0, isDrone: false, thrustVector: true,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'GSH-23L'], gunRounds: 150,
    internalSlots: 0, externalSlots: 10, hasCenterline: true, centerlineSlots: 6, totalSlots: 10,
    maxPylonRating: 'Type X', upgradeSockets: 3,
    desc: 'Canard-equipped TVC Flanker ($23.5M, 1.08 agility). Type X reinforced centerline carries BrahMos-A Mach 3.0 missiles while Astra/R-77M cover air superiority.'
  },
  'J-11BG': {
    id: 'J-11BG', name: 'Shenyang J-11BG Flanker', category: 'SUPERIORITY', badge: 'AESA SINGLE-SEAT FLANKER',
    role: 'Modernized AESA Air Superiority', cost: 22.5, hp: 5, AGI_0: 1.04, S_0: 1.38, sOpt: 0.90, R_0: 82.0,
    radarType: 'Type 1493G AESA', radarConeDeg: 125, lookDownBonus: 0.54, sigma_0: 2.6,
    beamSpike: 3.5, thermalBloom: 1.20, M_max: 8000, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'GSH-23L'], gunRounds: 150,
    internalSlots: 0, externalSlots: 10, hasCenterline: true, centerlineSlots: 4, totalSlots: 10,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Single-seat AESA Flanker ($22.5M, 82 km radar, 1.04 agility). Lighter single-crew frame accelerates faster than twin-seat variants while firing PL-15E and PL-17.'
  },
  'J-15T': {
    id: 'J-15T', name: 'Shenyang J-15T Flying Shark', category: 'SUPERIORITY', badge: 'CATOBAR CARRIER FLANKER',
    role: 'Heavy Carrier Air Superiority', cost: 23.0, hp: 5, AGI_0: 1.00, S_0: 1.26, sOpt: 0.84, R_0: 80.0,
    radarType: 'Naval AESA + IRST', radarConeDeg: 125, lookDownBonus: 0.56, sigma_0: 3.0,
    beamSpike: 3.6, thermalBloom: 1.22, M_max: 8500, G_limit: 8.5, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'GSH-23L'], gunRounds: 150,
    internalSlots: 0, externalSlots: 10, hasCenterline: true, centerlineSlots: 6, totalSlots: 10,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Catapult-ready carrier Flanker ($23.0M, 5 HP, 8,500 kg payload). Canard lift and strengthened naval undercarriage support heavy BVR fleet defense.'
  },
  'MiG-25PD': {
    id: 'MiG-25PD', name: 'MiG-25PD Foxbat-E', category: 'SUPERIORITY', badge: 'MACH 2.05 STRATO SPRINT',
    role: 'High-Altitude Pure Speed Interceptor', cost: 17.5, hp: 5, AGI_0: 0.34, S_0: 2.05, sOpt: 1.18, R_0: 82.0,
    radarType: 'Sapfir-25 Look-Down', radarConeDeg: 115, lookDownBonus: 0.28, sigma_0: 12.0,
    beamSpike: 4.4, thermalBloom: 1.55, M_max: 6200, G_limit: 5.5, isDrone: false, thrustVector: false,
    builtInGun: 'GSH-23L', allowedGuns: ['GSH-23L'], gunRounds: 200,
    internalSlots: 0, externalSlots: 4, hasCenterline: false, centerlineSlots: 0, totalSlots: 4,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Budget Mach 2.05 stratospheric sprinter ($17.5M). Massive R-15BD turbojets produce 1.55x thermal bloom and wide 5.5G turns, trading dogfight agility for raw intercept speed.'
  },
  'MiG-35S': {
    id: 'MiG-35S', name: 'MiG-35S Fulcrum-F', category: 'SUPERIORITY', badge: 'AESA VECTOR FULCRUM',
    role: 'High-Agility Light Air Superiority', cost: 21.0, hp: 4, AGI_0: 1.10, S_0: 1.26, sOpt: 0.84, R_0: 76.0,
    radarType: 'Zhuk-AE AESA + OLS-UEM', radarConeDeg: 125, lookDownBonus: 0.50, sigma_0: 1.2,
    beamSpike: 3.1, thermalBloom: 1.10, M_max: 6500, G_limit: 9.0, isDrone: false, thrustVector: true,
    builtInGun: 'GSH-30-1', allowedGuns: ['GSH-30-1', 'GSH-23L'], gunRounds: 150,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: '4++ gen Fulcrum flagship ($21.0M, 1.10 agility, TVC). Integrates Zhuk-AE AESA radar with 8 external stations and optical nose tracking.'
  },
  'F-4E-2020': {
    id: 'F-4E-2020', name: 'F-4E Terminator 2020', category: 'SUPERIORITY', badge: 'HEAVY TWIN-JET PHANTOM',
    role: 'Economical Heavy BVR & Strike Fighter', cost: 13.5, hp: 5, AGI_0: 0.56, S_0: 1.32, sOpt: 0.86, R_0: 66.0,
    radarType: 'EL/M-2032 Multi-Mode', radarConeDeg: 115, lookDownBonus: 0.34, sigma_0: 6.2,
    beamSpike: 4.0, thermalBloom: 1.32, M_max: 7600, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2'], gunRounds: 640,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Upgraded budget Phantom ($13.5M, 5 HP, Mach 1.32). Heavy twin-J79 airframe hauls 7,600 kg across 8 Type H external stations at bargain cost.'
  },
  'Mirage-4000': {
    id: 'Mirage-4000', name: 'Super Mirage 4000', category: 'SUPERIORITY', badge: 'HEAVY TWIN CANARD-DELTA',
    role: 'Heavy Twin-Engine Delta Interceptor', cost: 23.0, hp: 5, AGI_0: 1.06, S_0: 1.44, sOpt: 0.92, R_0: 80.0,
    radarType: 'RDM-7 Heavy Doppler', radarConeDeg: 120, lookDownBonus: 0.42, sigma_0: 2.2,
    beamSpike: 3.4, thermalBloom: 1.15, M_max: 8000, G_limit: 9.0, isDrone: false, thrustVector: false,
    builtInGun: 'BK-27', allowedGuns: ['BK-27', 'M61A2'], gunRounds: 250,
    internalSlots: 0, externalSlots: 12, hasCenterline: true, centerlineSlots: 4, totalSlots: 12,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'French heavy twin-engine canard-delta interceptor ($23.0M, Mach 1.44, 1.06 agility). Offers 12 external stations and rapid climb performance.'
  },
  'F-14B': {
    id: 'F-14B', name: 'F-14B Bombcat', category: 'SUPERIORITY', badge: 'BUDGET SWING-WING CAP',
    role: 'Long-Range Fleet Defender & Strike', cost: 16.5, hp: 5, AGI_0: 0.66, S_0: 1.34, sOpt: 0.88, R_0: 90.0,
    radarType: 'AWG-9 Pulse-Doppler', radarConeDeg: 130, lookDownBonus: 0.30, sigma_0: 4.2,
    beamSpike: 4.0, thermalBloom: 1.30, M_max: 8200, G_limit: 7.5, isDrone: false, thrustVector: false,
    builtInGun: 'M61A2', allowedGuns: ['M61A2'], gunRounds: 675,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 6, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 3,
    desc: 'Re-engined F110 Tomcat ($16.5M, 90 km AWG-9 reach). Cheaper fleet interceptor pairing long-range BVR coverage with LANTIRN strike rails.'
  },
  'TYPHOON-T4': {
    id: 'TYPHOON-T4', name: 'Eurofighter Tranche 4', category: 'SUPERIORITY', badge: 'ECRS MK2 SWIVEL AESA',
    role: 'Advanced Canard-Delta Dominance', cost: 30.0, hp: 4, AGI_0: 1.14, S_0: 1.42, sOpt: 0.94, R_0: 86.0,
    radarType: 'Captor-E ECRS Mk2 (140 deg)', radarConeDeg: 140, lookDownBonus: 0.68, sigma_0: 0.42,
    beamSpike: 2.6, thermalBloom: 0.88, M_max: 7800, G_limit: 9.5, isDrone: false, thrustVector: false,
    builtInGun: 'BK-27', allowedGuns: ['BK-27', 'M61A2', 'PLSL_LIGHT'], gunRounds: 150,
    internalSlots: 0, externalSlots: 8, hasCenterline: true, centerlineSlots: 4, totalSlots: 8,
    maxPylonRating: 'Type H', upgradeSockets: 4,
    desc: 'Swashplate ECRS Mk2 Typhoon ($30.0M, 140 deg scan cone, 9.5G). Tracks targets at extreme cranking angles while supercruising with Meteor salvos.'
  }
};
