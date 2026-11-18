/**
 * js/data/templates/stealthnext.js - Preconfigured Loadouts for 5th-Gen Variants & 6th-Gen Stealth Airframes.
 */

window.TEMPLATES_STEALTH_NEXT = {
  'F-35B STOVL Forward Stealth': {
    name: 'F-35B STOVL Forward Stealth',
    specId: 'F-35B',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GAU-22',
    weapons: ['AIM-260', 'AIM-9X-2', 'GBU-39', 'AIM-120D'],
    upgrades: ['EOTS_DUAL_OPTICS', 'MADL_BATTLE_LINK'],
    desc: 'Short-takeoff stealth expeditionary loadout ($39.0M) blending internal AIM-260s with external SDB strike power.'
  },
  'F-35C Carrier Air Wing Stealth': {
    name: 'F-35C Carrier Air Wing Stealth',
    specId: 'F-35C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AIM-260', 'METEOR', 'GBU-53', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'DAS_360_OPTIC', 'MADL_BATTLE_LINK'],
    desc: 'Heavy carrier stealth wingman carrying internal stealth BVR alongside 8 StormBreaker tri-mode SDBs.'
  },
  'F-22A+ Super Raptor Air Dominance': {
    name: 'F-22A+ Super Raptor Air Dominance',
    specId: 'F-22-SUPER',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-260', 'METEOR', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Upgraded 0.00008m2 Super Raptor mounting solid-state laser defense and 12 sustained BVR missiles.'
  },
  'J-20B WS-15 Air Superiority': {
    name: 'J-20B WS-15 Air Superiority',
    specId: 'J-20B',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'PL-10', 'PL-17'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: '3D TVC supercruising Dragon combining internal PL-15E stealth bays with external PL-17 ultra-long-range missiles.'
  },
  'J-20S Stealth EW & Strike Lead': {
    name: 'J-20S Stealth EW & Strike Lead',
    specId: 'J-20S',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'PL-10', 'AN-ALQ-165', 'KH-59MK2'],
    upgrades: ['MADL_BATTLE_LINK', 'ADAPTIVE_ECCM_SUITE', 'ESM_PASSIVE_SUITE'],
    desc: 'Twin-seat stealth command aircraft fielding internal ASPJ ECM jamming and Kh-59MK2 stealth cruise strikes.'
  },
  'TAI TF Kaan Air Superiority': {
    name: 'TAI TF Kaan Air Superiority',
    specId: 'KAAN',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['METEOR', 'AIM-120D', 'IRIS-T'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Twin-jet 5th-gen fighter ($36.0M) keeping pure internal VLO stealth with 8 BVR missiles and IRIS-T defense.'
  },
  'KF-21EX Block III Stealth Strike': {
    name: 'KF-21EX Block III Stealth Strike',
    specId: 'KF-21EX',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['METEOR', 'AIM-120D', 'AIM-9X-2', 'SOM-J'],
    upgrades: ['RAM_NANO_COATING', 'EOTS_DUAL_OPTICS'],
    desc: 'Internal-bay Boramae pairing stealthy BVR defense with 4 compact SOM-J standoff cruise missiles.'
  },
  'HAL AMCA Mk1 Stealth Interceptor': {
    name: 'HAL AMCA Mk1 Stealth Interceptor',
    specId: 'AMCA-MK1',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['ASTRA-MK3', 'ASTRA-MK2', 'ASRAAM'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Clean internal-bay 5th-gen interceptor carrying Gandiva SFDR ramjets, Astra Mk2, and Mach 3.2 ASRAAMs.'
  },
  'GCAP Tempest 6th-Gen Dominance': {
    name: 'GCAP Tempest 6th-Gen Dominance',
    specId: 'TEMPEST',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['METEOR', 'AIM-260', 'SPEAR-3', 'ASRAAM'],
    upgrades: ['GAN_AESA_CORE', 'DAS_360_OPTIC', 'ADAPTIVE_ECCM_SUITE'],
    desc: '6th-gen sensor flagship ($56.0M, 104 km radar) armed with hitscan laser fire, Meteors, AIM-260s, and SPEAR-3s.'
  },
  'FCAS NGF Tailless Stealth': {
    name: 'FCAS NGF Tailless Stealth',
    specId: 'FCAS-NGF',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['METEOR', 'AIM-260', 'MICA-EM', 'MICA-IR'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Pure internal-bay tailless 6th-gen air dominance fighter (0.0001m2 RCS, 1.18 agility, 16 internal missiles).'
  },
  'J-36 Heavy 6th-Gen Arsenal': {
    name: 'J-36 Heavy 6th-Gen Arsenal',
    specId: 'J-36',
    roleCategory: 'STRIKE',
    chosenGunId: 'PLSL_MED',
    weapons: ['PL-15E', 'PL-15E', 'KH-59MK2', 'PL-10', 'PL-15E'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Tri-jet 8-slot internal bay stealth arsenal pairing deep standoff stealth cruise missiles with 12 PL-15E BVR.'
  },
  'J-50 Tailless Lambdoid Intercept': {
    name: 'J-50 Tailless Lambdoid Intercept',
    specId: 'J-50',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['PL-15E', 'R-77M', 'PL-10', 'R-74M2'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'High-agility tailless stealth interceptor keeping all 16 BVR and HOBS IR missiles concealed internally.'
  }
};
