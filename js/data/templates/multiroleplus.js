/**
 * js/data/templates/multiroleplus.js - Preconfigured Loadouts: Light & Carrier Multirole Fighters.
 */

window.TEMPLATES_MULTIROLE_PLUS = {
  'JF-17 Block III Light AESA': {
    name: 'JF-17 Block III Light AESA',
    specId: 'JF-17-B3',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-15E', 'PL-10', 'SPPU-22'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Budget AESA multirole carrying dual-pulse PL-15Es, PL-10 dogfighters, and a 23mm gunpod.'
  },
  'JF-17 Block III Economical SD-10 CAP': {
    name: 'JF-17 Block III Economical SD-10 CAP',
    specId: 'JF-17-B3',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-12', 'I-DERBY-ER', 'PL-10E-ER', 'R-60M', 'BOL-CHAFF-RAIL'],
    upgrades: ['GAN_AESA_CORE'],
    desc: 'Low-cost swarm fighter stacking Mach 3.6 PL-12 and 1-slot I-Derby ER BVR with extended PL-10E and BOL chaff.'
  },
  'FA-50 Block 20 Light Multirole': {
    name: 'FA-50 Block 20 Light Multirole',
    specId: 'FA-50-B20',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-9X-2', 'GBU-38'],
    upgrades: ['MADL_BATTLE_LINK'],
    desc: 'Economical supersonic light fighter combining AMRAAM self-escort with 4 JDAM 500lb bombs.'
  },
  'FA-50 Block 20 Light Interceptor': {
    name: 'FA-50 Block 20 Light Interceptor',
    specId: 'FA-50-B20',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120C-7', 'I-DERBY-ER', 'AIM-9X-B3', 'SUU-23A', 'AN-ALQ-184'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Agile light interceptor pairing PhantomStrike AESA with clipped-fin AMRAAMs, I-Derby ER, Vulcan pod, and ALQ-184.'
  },
  'HAL Tejas Mk1A Light Interceptor': {
    name: 'HAL Tejas Mk1A Light Interceptor',
    specId: 'Tejas-MK1A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['ASTRA-MK1', 'I-DERBY-ER', 'ASRAAM', 'PIRATE-IRST-POD', 'BOL-CHAFF-RAIL'],
    upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Lightweight 1-slot missile carrier fielding 8 BVR missiles, Mach 3.2 ASRAAMs, passive IRST pod, and 6x BOL chaff.'
  },
  'JAS-39C Expeditionary Patrol': {
    name: 'JAS-39C Expeditionary Patrol',
    specId: 'JAS-39C',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'IRIS-T', 'BRITECLOUD-POD'],
    upgrades: ['MADL_BATTLE_LINK', 'RTB_HOMING_BEACON'],
    desc: 'Agile 9G Gripen C pairing ramjet Meteors with BriteCloud DRFM active decoys.'
  },
  'JAS-39C Skyflash & Gunpod CAP': {
    name: 'JAS-39C Skyflash & Gunpod CAP',
    specId: 'JAS-39C',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'BK-27',
    weapons: ['SKYFLASH', 'I-DERBY-ER', 'IRIS-T-LR', 'DEFA-554-POD'],
    upgrades: ['MADL_BATTLE_LINK', 'EOTS_DUAL_OPTICS'],
    desc: 'Budget Gripen C interceptor mixing monopulse Skyflash and I-Derby ER with 62 km IRIS-T SLX and a 30mm DEFA gunpod.'
  },
  'F-16C Block 52+ Wild Weasel': {
    name: 'F-16C Block 52+ Wild Weasel',
    specId: 'F-16C-B52',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AGM-88C', 'AIM-9X-2'],
    upgrades: ['SEAD_HTS_POD', 'CCIP_BALLISTIC_COMP'],
    desc: 'Classic SEAD Viper equipped with HARM Targeting System (HTS) and 4 AGM-88C radar killers.'
  },
  'F-16C Block 52+ Sparrow & Vulcan CAP': {
    name: 'F-16C Block 52+ Sparrow & Vulcan CAP',
    specId: 'F-16C-B52',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-7P', 'AIM-120C-7', 'AIM-9M', 'SUU-23A'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Economical Viper CAP mixing Block II Sparrows and clipped-fin AMRAAMs with Sidewinders and an external Vulcan pod.'
  },
  'F/A-18C+ Hornet Strike': {
    name: 'F/A-18C+ Hornet Strike',
    specId: 'F-18C-PLUS',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'GBU-32', 'AIM-9X-2', 'AN-ASQ-228'],
    upgrades: ['MADL_BATTLE_LINK'],
    desc: 'Agile carrier Hornet pairing ATFLIR targeting with 1,000lb JDAMs and AMRAAM defense.'
  },
  'F/A-18C+ Legacy Hornet CAP': {
    name: 'F/A-18C+ Legacy Hornet CAP',
    specId: 'F-18C-PLUS',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-174B', 'AIM-120C-7', 'AIM-9M', 'SUU-23A', 'BOL-CHAFF-RAIL'],
    upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE'],
    desc: 'High-agility carrier Legacy Hornet carrying 132 km AIM-174B missiles alongside AMRAAMs and Vulcan strafe support.'
  },
  'F/A-18F Block III Fleet Defender': {
    name: 'F/A-18F Block III Fleet Defender',
    specId: 'F-18F',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-174B', 'AIM-120D-3', 'AIM-9X-B3', 'IRST-21-POD', 'AN-ALE-50'],
    upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Block III Rhino fielding 132 km AIM-174B missiles, F3R AMRAAMs, Block III Sidewinders, IRST21, and ALE-50 towed decoys.'
  },
  'Chengdu J-10C Vigorous Dragon': {
    name: 'Chengdu J-10C Vigorous Dragon',
    specId: 'J-10C',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-15', 'PL-15E', 'PL-10E-ER', 'CACM-6', 'KHIBINY-L175'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Nimble 1.02-agility canard-delta blending domestic PL-15, extended PL-10E, 6x CACM micro-IR, and Khibiny ECM.'
  },
  'Dassault Rafale M (F4 Carrier)': {
    name: 'Dassault Rafale M (F4 Carrier)',
    specId: 'Rafale-M',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['FMRAAM', 'METEOR', 'MICA-EM', 'MICA-IR', 'BRITECLOUD-POD', 'DAMOCLES-POD'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS', 'DAS_360_OPTIC'],
    desc: '5 HP carrier Rafale F4 combining FMRAAM and Meteor standoff with MICA-EM/IR, BriteCloud DRFM, and Damocles recon.'
  },
  'MiG-29SMT Tactical Strike': {
    name: 'MiG-29SMT Tactical Strike',
    specId: 'MiG-29SMT',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-77-1', 'R-77-1', 'R-73', 'KAB-500L'],
    upgrades: ['TITANIUM_COCKPIT'],
    desc: 'Modernized Fulcrum-E delivering 8 BVR Adders alongside 500kg laser precision bombs.'
  },
  'MiG-29SMT Alamo & Adder CAP': {
    name: 'MiG-29SMT Alamo & Adder CAP',
    specId: 'MiG-29SMT',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-27R', 'R-27T', 'R-77', 'R-73', 'SPPU-22'],
    upgrades: ['EOTS_DUAL_OPTICS', 'TITANIUM_COCKPIT'],
    desc: 'Economical Fulcrum-E patrol pairing R-27R/T Alamos and R-77 Adders with Archer IR and a twin 23mm gunpod.'
  },
  'Mirage F1EQ Budget Striker': {
    name: 'Mirage F1EQ Budget Striker',
    specId: 'Mirage-F1EQ',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['MICA-EM', 'MICA-IR', 'DEFA-554-POD', 'MK-83'],
    upgrades: ['CCIP_BALLISTIC_COMP'],
    desc: 'Low-cost Mach 1.18 swept-wing fighter armed with 1,000lb CCIP bombs and 30mm gunpods.'
  },
  'Mirage F1EQ Super 530D Interceptor': {
    name: 'Mirage F1EQ Super 530D Interceptor',
    specId: 'Mirage-F1EQ',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['SUPER-530D', 'MAGIC-2', 'MAGIC-2', 'DEFA-554-POD', 'AN-ALQ-184'],
    upgrades: ['SUPERCRUISE_VCE'],
    desc: 'Classic Mach 4.5 Super 530D interceptor backed by 8 Magic 2 dogfighters, 30mm DEFA pod, and ALQ-184 ECM.'
  },
  'F-5EM Tiger II Micro-Swarm': {
    name: 'F-5EM Tiger II Micro-Swarm',
    specId: 'F-5E-TIGER',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-9X-2', 'PYTHON-5', 'HYDRA-70', 'BOL-CHAFF-RAIL'],
    upgrades: ['EOTS_DUAL_OPTICS'],
    desc: 'Ultra-cheap 0.65m2 RCS micro-fighter using IRST tracking, Python-5s, and 8x BOL chaff rails.'
  },
  'F-5EM Aspide & Starstreak Interceptor': {
    name: 'F-5EM Aspide & Starstreak Interceptor',
    specId: 'F-5E-TIGER',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['ASPIDE-MK1', 'I-DERBY-ER', 'STARSTREAK-A2A', 'AIM-9M', 'BOL-CHAFF-RAIL', 'AN-ALQ-184'],
    upgrades: ['EOTS_DUAL_OPTICS', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Full 6-slot Type S micro-interceptor combining Aspide and I-Derby ER BVR with Mach 3.8 Starstreak darts and ALQ-184.'
  }
};
