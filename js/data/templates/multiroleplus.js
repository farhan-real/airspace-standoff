/**
 * js/data/templates/multiroleplus.js - Preconfigured Loadouts for Expanded Light & Carrier Multirole Fighters.
 */

window.TEMPLATES_MULTIROLE_PLUS = {
  'JF-17 Block III Light AESA': {
    name: 'JF-17 Block III Light AESA',
    specId: 'JF-17-B3',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-15E', 'PL-10', 'SPPU-22'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Budget AESA multirole ($12.5M) carrying dual-pulse PL-15Es, PL-10 dogfighters, and a 23mm gunpod.'
  },
  'FA-50 Block 20 Light Multirole': {
    name: 'FA-50 Block 20 Light Multirole',
    specId: 'FA-50-B20',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-9X-2', 'GBU-38'],
    upgrades: ['MADL_BATTLE_LINK'],
    desc: 'Economical supersonic light fighter ($11.0M) combining AMRAAM self-escort with 4 JDAM 500lb bombs.'
  },
  'HAL Tejas Mk1A Light Interceptor': {
    name: 'HAL Tejas Mk1A Light Interceptor',
    specId: 'Tejas-MK1A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['ASTRA-MK1', 'I-DERBY-ER', 'ASRAAM'],
    upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Lightweight 1-slot missile carrier ($12.0M) fielding 8 BVR missiles and Mach 3.2 ASRAAMs.'
  },
  'JAS-39C Expeditionary Patrol': {
    name: 'JAS-39C Expeditionary Patrol',
    specId: 'JAS-39C',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'IRIS-T', 'BRITECLOUD-POD'],
    upgrades: ['MADL_BATTLE_LINK', 'RTB_HOMING_BEACON'],
    desc: 'Agile 9G Gripen C ($13.5M) pairing ramjet Meteors with BriteCloud DRFM active decoys.'
  },
  'F-16C Block 52+ Wild Weasel': {
    name: 'F-16C Block 52+ Wild Weasel',
    specId: 'F-16C-B52',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AGM-88C', 'AIM-9X-2'],
    upgrades: ['SEAD_HTS_POD', 'CCIP_BALLISTIC_COMP'],
    desc: 'Classic SEAD Viper ($14.5M) equipped with HARM Targeting System (HTS) and 4 AGM-88C radar killers.'
  },
  'F/A-18C+ Hornet Strike': {
    name: 'F/A-18C+ Hornet Strike',
    specId: 'F-18C-PLUS',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'GBU-32', 'AIM-9X-2', 'AN-ASQ-228'],
    upgrades: ['MADL_BATTLE_LINK'],
    desc: 'Agile carrier Hornet ($15.0M) pairing ATFLIR targeting with 1,000lb JDAMs and AMRAAM defense.'
  },
  'F/A-18F Block III Fleet Defender': {
    name: 'F/A-18F Block III Fleet Defender',
    specId: 'F-18F',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-174B', 'AIM-120D', 'AIM-9X-2', 'IRST-21-POD'],
    upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE'],
    desc: 'Block III Super Hornet fielding 132 km AIM-174B missiles with passive IRST21 anti-stealth tracking.'
  },
  'Chengdu J-10C Vigorous Dragon': {
    name: 'Chengdu J-10C Vigorous Dragon',
    specId: 'J-10C',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-15E', 'PL-15E', 'PL-10', 'KHIBINY-L175'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Nimble 1.02-agility canard-delta ($18.5M) blending 8 dual-pulse PL-15Es with Khibiny ECM jamming.'
  },
  'Dassault Rafale M (F4 Carrier)': {
    name: 'Dassault Rafale M (F4 Carrier)',
    specId: 'Rafale-M',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'MICA-EM', 'MICA-IR', 'DAMOCLES-POD'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS', 'DAS_360_OPTIC'],
    desc: '5 HP carrier Rafale F4 ($29.0M) combining Meteor standoff, silent MICA-IR, and Damocles recon.'
  },
  'MiG-29SMT Tactical Strike': {
    name: 'MiG-29SMT Tactical Strike',
    specId: 'MiG-29SMT',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-77-1', 'R-77-1', 'R-73', 'KAB-500L'],
    upgrades: ['TITANIUM_COCKPIT'],
    desc: 'Modernized Fulcrum-E ($15.5M, 4 HP) delivering 8 BVR Adders alongside 500kg laser precision bombs.'
  },
  'Mirage F1EQ Budget Striker': {
    name: 'Mirage F1EQ Budget Striker',
    specId: 'Mirage-F1EQ',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['MICA-EM', 'MICA-IR', 'DEFA-554-POD', 'MK-83'],
    upgrades: ['CCIP_BALLISTIC_COMP'],
    desc: 'Low-cost Mach 1.18 swept-wing fighter ($10.5M) armed with 1,000lb CCIP bombs and 30mm gunpods.'
  },
  'F-5EM Tiger II Micro-Swarm': {
    name: 'F-5EM Tiger II Micro-Swarm',
    specId: 'F-5E-TIGER',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-9X-2', 'PYTHON-5', 'HYDRA-70', 'BOL-CHAFF-RAIL'],
    upgrades: ['EOTS_DUAL_OPTICS'],
    desc: 'Ultra-cheap 0.65m2 RCS micro-fighter ($9.5M) using IRST tracking, Python-5s, and 8x BOL chaff rails.'
  }
};
