/**
 * APEX VECTOR // Preconfigured Loadouts: Tactical Multirole Workhorses
 */

window.TEMPLATES_MULTIROLE = {
  // Mirage 2000-5
  'Mirage 2000-5 Air Defense Fighter': {
    name: 'Mirage 2000-5 Air Defense Fighter',
    specId: 'Mirage-2000',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'BK-27',
    weapons: ['PYTHON-5', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Cost-effective delta fighter ($11.5M). Responsive roll rate authority and Python-5 rear engagement capability.'
  },
  'Mirage 2000-5 High-Speed Intercept': {
    name: 'Mirage 2000-5 High-Speed Intercept',
    specId: 'Mirage-2000',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['AIM-120D', 'PYTHON-5'],
    upgrades: ['SUPERCRUISE_VCE', 'EXPANDED_CM_DISPENSER'],
    desc: 'High-speed interceptor configuration offering beyond-visual-range radar missile capability on a strict budget.'
  },

  // F-16V Viper
  'F-16V Tactical Multi-Role': {
    name: 'F-16V Tactical Multi-Role',
    specId: 'F-16V',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-9X-2'],
    upgrades: ['SUPERCRUISE_VCE', 'DAS_360_OPTIC'],
    desc: 'Affordable, reliable 9G multirole fighter pairing SABR AESA radar with helmet-cued Sidewinders.'
  },
  'F-16V BVR Intercept & Strike': {
    name: 'F-16V BVR Intercept & Strike',
    specId: 'F-16V',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Networked BVR multirole loadout utilizing GaN AESA radar upgrade to maximize AMRAAM tracking baskets.'
  },

  // HAL Tejas Mk2
  'Tejas Mk2 Tactical Air Defense': {
    name: 'Tejas Mk2 Tactical Air Defense',
    specId: 'Tejas-MK2',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['AIM-120D', 'R-73'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Compact canard-delta platform ($13.0M). Features low clean radar signature (0.75m2 RCS) and Uttam AESA radar.'
  },
  'Tejas Mk2 Close Support Attack': {
    name: 'Tejas Mk2 Close Support Attack',
    specId: 'Tejas-MK2',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-23L',
    weapons: ['R-73', 'PYTHON-5'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'High-maneuverability visual dogfight setup exploiting compact airframe dimensions and Archer snap turns.'
  },

  // JAS-39E Gripen
  'JAS-39E Electronic Recon & Mesh': {
    name: 'JAS-39E Electronic Recon & Mesh',
    specId: 'JAS-39E',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['AN-ALQ-184', 'METEOR', 'IRIS-T'],
    upgrades: ['MADL_BATTLE_LINK', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Networked canard-delta interceptor with compact self-protection ECM and passive datalink Command Bus bonuses.'
  },
  'JAS-39E Standoff Intercept': {
    name: 'JAS-39E Standoff Intercept',
    specId: 'JAS-39E',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'METEOR', 'IRIS-T'],
    upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE'],
    desc: 'Dedicated BVR ramjet missile carrier designed to link targeting telemetry across squadron wingmen.'
  },

  // F/A-18E, F-2A, KF-21 & MiG-29K
  'F/A-18E Carrier Air Patrol (CAP)': {
    name: 'F/A-18E Carrier Air Patrol (CAP)',
    specId: 'F-18E',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2', 'ALE-55'],
    upgrades: ['MADL_BATTLE_LINK', 'TITANIUM_COCKPIT'],
    desc: 'Rugged carrier strike platform ($17.5M). 8 stations, APG-79 AESA radar, and high-alpha nose-pointing control.'
  },
  'F-2A Maritime Interdiction': {
    name: 'F-2A Maritime Interdiction',
    specId: 'F-2A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Enlarged carbon-composite wing platform with 8 hardpoints and specialized long-range radar search envelopes.'
  },
  'KF-21 Advanced Multi-Role (Block 1)': {
    name: 'KF-21 Advanced Multi-Role (Block 1)',
    specId: 'KF-21',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['METEOR', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: '4.5+ gen multirole airframe ($22.0M). Reduced frontal RCS (0.15m2) with conformal weapon stations and Meteor synergy.'
  },
  'MiG-29K Naval Combat Intercept': {
    name: 'MiG-29K Naval Combat Intercept',
    specId: 'MiG-29K',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'R-73', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'SUPERCRUISE_VCE'],
    desc: 'High thrust-to-weight carrier dogfighter ($14.5M). Delivers 4 HP durability and 8 weapon stations at a competitive cost.'
  }
};