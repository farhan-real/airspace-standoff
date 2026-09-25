/**
 * AIRSPACE STANDOFF: Preconfigured Loadouts: Multirole Workhorses
 */

window.TEMPLATES_MULTIROLE = {
  'Mirage 2000-5 Air Defense Fighter': {
    name: 'Mirage 2000-5 Air Defense Fighter',
    specId: 'Mirage-2000',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'BK-27',
    weapons: ['AIM-120D', 'PYTHON-5', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Agile delta fighter balancing 4 AMRAAMs with Python-5 rear engagement.'
  },
  'Mirage 2000-5 High-Speed Intercept': {
    name: 'Mirage 2000-5 High-Speed Intercept',
    specId: 'Mirage-2000',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['AIM-120D', 'METEOR', 'PYTHON-5'],
    upgrades: ['SUPERCRUISE_VCE', 'EXPANDED_CM_DISPENSER'],
    desc: 'High-speed interceptor configuration offering 8 BVR missiles including sustained ramjet Meteors.'
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
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Networked BVR multirole loadout with GaN AESA radar upgrade to maximize missile tracking baskets.'
  },
  'Tejas Mk2 Air Defense Patrol': {
    name: 'Tejas Mk2 Air Defense Patrol',
    specId: 'Tejas-MK2',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['AIM-120D', 'AIM-120D', 'R-73'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Compact canard-delta platform with Uttam AESA radar and 8 AMRAAMs.'
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
    weapons: ['METEOR', 'METEOR', 'IRIS-T'],
    upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE'],
    desc: 'Dedicated BVR ramjet carrier fielding 8 sustained Meteors.'
  },
  'F/A-18E Carrier Air Patrol (CAP)': {
    name: 'F/A-18E Carrier Air Patrol (CAP)',
    specId: 'F-18E',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2', 'ALE-55'],
    upgrades: ['MADL_BATTLE_LINK', 'TITANIUM_COCKPIT'],
    desc: 'Rugged carrier strike platform pairing 8 AMRAAMs with towed decoys.'
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
  'KF-21 Advanced Multi-Role (Block 1)': {
    name: 'KF-21 Advanced Multi-Role (Block 1)',
    specId: 'KF-21',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['METEOR', 'AIM-120D', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: '4.5+ gen multirole airframe with conformal stations and 12 BVR missiles.'
  },
  'MiG-29K Naval Combat Intercept': {
    name: 'MiG-29K Naval Combat Intercept',
    specId: 'MiG-29K',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'PL-15E', 'AIM-120D', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'SUPERCRUISE_VCE'],
    desc: 'High thrust-to-weight carrier dogfighter fielding 12 BVR missiles.'
  }
};