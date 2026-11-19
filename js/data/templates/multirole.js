/**
 * js/data/templates/multirole.js - Preconfigured Loadouts: Multirole Workhorses.
 */

window.TEMPLATES_MULTIROLE = {
  'Mirage 2000-5 Air Defense Fighter': {
    name: 'Mirage 2000-5 Air Defense Fighter',
    specId: 'Mirage-2000',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'BK-27',
    weapons: ['MICA-EM', 'MICA-EM', 'MICA-IR', 'MAGIC-2', 'DEFA-554-POD'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Agile delta fighter packing 8 compact MICA-EM, 4 silent MICA-IR, 4 Magic 2 dogfighters, and a 30mm DEFA pod.'
  },
  'Mirage 2000-5 High-Speed Intercept': {
    name: 'Mirage 2000-5 High-Speed Intercept',
    specId: 'Mirage-2000',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['AIM-120C-7', 'METEOR', 'PYTHON-5'],
    upgrades: ['SUPERCRUISE_VCE', 'EXPANDED_CM_DISPENSER'],
    desc: 'High-speed interceptor configuration offering lightweight AMRAAMs, sustained ramjet Meteors, and rear-aspect Python-5s.'
  },
  'F-16V Multirole Fighter': {
    name: 'F-16V Multirole Fighter',
    specId: 'F-16V',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['SUPERCRUISE_VCE', 'DAS_360_OPTIC'],
    desc: 'Agile 9G multirole fighter pairing 8 AMRAAMs with helmet-cued Sidewinders.'
  },
  'F-16V BVR Intercept & Strike': {
    name: 'F-16V BVR Intercept & Strike',
    specId: 'F-16V',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D-3', 'AIM-120D-3', 'AIM-9X-B3', 'IRST-21-POD'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Networked BVR Viper pairing GaN AESA radar with F3R AMRAAMs, Block III Sidewinders, and passive IRST21 tracking.'
  },
  'F-16V Micro-BVR & Vulcan CAP': {
    name: 'F-16V Micro-BVR & Vulcan CAP',
    specId: 'F-16V',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['PEREGRINE', 'SADM-8', 'AIM-9X-B3', 'SUU-23A', 'BOL-CHAFF-RAIL'],
    upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'High-capacity anti-swarm Viper carrying 6 Peregrine mini-BVR, 8 SADM micro-missiles, SUU-23A gunpod, and BOL chaff.'
  },
  'Tejas Mk2 Air Defense Patrol': {
    name: 'Tejas Mk2 Air Defense Patrol',
    specId: 'Tejas-MK2',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['ASTRA-MK2', 'ASTRA-MK1', 'I-DERBY-ER', 'ASRAAM', 'PIRATE-IRST-POD'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Compact canard-delta interceptor fielding Astra Mk2/Mk1, I-Derby ER dual-pulse, Mach 3.2 ASRAAMs, and Skyward IRST.'
  },
  'Tejas Mk2 Close Support Attack': {
    name: 'Tejas Mk2 Close Support Attack',
    specId: 'Tejas-MK2',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-23L',
    weapons: ['GBU-39', 'AIM-120D', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Close-support strike loadout carrying 8 glide bombs and AMRAAMs.'
  },
  'JAS-39E Electronic Recon & Mesh': {
    name: 'JAS-39E Electronic Recon & Mesh',
    specId: 'JAS-39E',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['AN-ALQ-184', 'METEOR', 'IRIS-T'],
    upgrades: ['MADL_BATTLE_LINK', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Networked canard-delta interceptor with self-protection ECM and passive datalink Command Bus bonuses.'
  },
  'JAS-39E Standoff Intercept': {
    name: 'JAS-39E Standoff Intercept',
    specId: 'JAS-39E',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['FMRAAM', 'METEOR', 'IRIS-T', 'BRITECLOUD-POD'],
    upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE'],
    desc: 'Dedicated BVR ramjet carrier fielding 4 FMRAAM and 4 Meteor missiles backed by IRIS-T and BriteCloud DRFM decoys.'
  },
  'F/A-18E Carrier Air Patrol (CAP)': {
    name: 'F/A-18E Carrier Air Patrol (CAP)',
    specId: 'F-18E',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-174B', 'AIM-120D-3', 'AIM-9X-B3', 'IRST-21-POD', 'AN-ALE-50'],
    upgrades: ['MADL_BATTLE_LINK', 'TITANIUM_COCKPIT'],
    desc: 'Carrier fleet defender pairing 132 km AIM-174B missiles and F3R AMRAAMs with IRST21 tracking and AN/ALE-50 towed decoys.'
  },
  'F-2A Maritime Interdiction': {
    name: 'F-2A Maritime Interdiction',
    specId: 'F-2A',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Maritime standoff strike loadout carrying stealth cruise missiles.'
  },
  'F-2A AESA Fleet Air Defense': {
    name: 'F-2A AESA Fleet Air Defense',
    specId: 'F-2A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AAM-4B', 'AAM-4B', 'AAM-5B', 'AAM-3', 'AN-ALQ-184'],
    upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Composite-wing air defense Viper Zero fielding 8 AESA-guided AAM-4B missiles, dual-band AAM-5B/3 IRs, and ALQ-184.'
  },
  'KF-21 Advanced Multi-Role (Block 1)': {
    name: 'KF-21 Advanced Multi-Role (Block 1)',
    specId: 'KF-21',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['METEOR', 'AIM-120D-3', 'IRIS-T-LR', 'AIM-9X-B3'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: '4.5+ gen multirole airframe pairing conformal Meteor and F3R AMRAAM bays with silent 62 km IRIS-T SLX and AIM-9X Block III.'
  },
  'MiG-29K Naval Combat Intercept': {
    name: 'MiG-29K Naval Combat Intercept',
    specId: 'MiG-29K',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-77M', 'R-27R', 'R-27T', 'R-73', 'SPPU-22'],
    upgrades: ['TITANIUM_COCKPIT', 'SUPERCRUISE_VCE'],
    desc: 'Carrier Fulcrum mixing R-77M dual-pulse and Alamo radar/IR BVR missiles with R-73s and a twin 23mm gunpod.'
  }
};
