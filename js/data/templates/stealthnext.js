/**
 * js/data/templates/stealthnext.js - Preconfigured Loadouts: 5th-Gen Variants & 6th-Gen Stealth Airframes.
 */

window.TEMPLATES_STEALTH_NEXT = {
  'F-35B STOVL Forward Stealth': {
    name: 'F-35B STOVL Forward Stealth',
    specId: 'F-35B',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GAU-22',
    weapons: ['AIM-260', 'AIM-9X-B3', 'GBU-39', 'AIM-120D-3'],
    upgrades: ['EOTS_DUAL_OPTICS', 'MADL_BATTLE_LINK'],
    desc: 'Short-takeoff stealth expeditionary loadout blending internal AIM-260 and SDBs with external F3R AMRAAM and Block III Sidewinders.'
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
  'F-35C Carrier Air Wing CAP': {
    name: 'F-35C Carrier Air Wing CAP',
    specId: 'F-35C',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GAU-22',
    weapons: ['AIM-260', 'AIM-9X-B3', 'AN-ALQ-165', 'FMRAAM', 'AIM-120D-3', 'IRST-21-POD'],
    upgrades: ['RAM_NANO_COATING', 'DAS_360_OPTIC', 'GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Heavy 10-station naval fleet defender stacking internal AIM-260 and ASPJ with external FMRAAM, F3R AMRAAM, and IRST21.'
  },
  'F-22A+ Super Raptor Air Dominance': {
    name: 'F-22A+ Super Raptor Air Dominance',
    specId: 'F-22-SUPER',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-260', 'JNAAM', 'AIM-120D-3', 'AIM-9X-B3', 'BRITECLOUD-POD'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Modernized Super Raptor mounting solid-state laser defense, JNAAM AESA ramjets, F3R AMRAAMs, and BriteCloud active decoys.'
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
  'J-20B Counter-EW Stealth Intercept': {
    name: 'J-20B Counter-EW Stealth Intercept',
    specId: 'J-20B',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15', 'PL-15-HOJ', 'PL-17', 'PL-10E-ER'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE', 'SUPERCRUISE_VCE'],
    desc: 'Anti-jammer WS-15 Dragon pairing internal PL-15 and Home-On-Jam PL-15B with external 135 km PL-17 and extended PL-10E.'
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
    weapons: ['GOKHAN', 'GOKDOGAN', 'BOZDOGAN', 'AN-ALQ-165'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Twin-jet 5th-gen Kaan fielding domestic Gokhan ramjets, Gokdogan BVR, Bozdogan HOBS IR, and internal ASPJ self-protection.'
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
  'KF-21EX Block III Air Dominance': {
    name: 'KF-21EX Block III Air Dominance',
    specId: 'KF-21EX',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['METEOR', 'AIM-120D-3', 'AIM-9X-B3', 'BRITECLOUD-POD'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Stealth Boramae interceptor pairing internal Meteor and F3R AMRAAMs with Block III Sidewinders and BriteCloud DRFM decoys.'
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
  'HAL AMCA Mk1 Dual-Pulse & Silent IR': {
    name: 'HAL AMCA Mk1 Dual-Pulse & Silent IR',
    specId: 'AMCA-MK1',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-23L',
    weapons: ['ASTRA-MK2', 'I-DERBY-ER', 'ASRAAM', 'R-77T'],
    upgrades: ['RAM_NANO_COATING', 'EOTS_DUAL_OPTICS', 'GAN_AESA_CORE'],
    desc: 'Agile medium stealth fighter mixing internal Astra Mk2, I-Derby ER, and ASRAAM with external 56 km thermal R-77T ambushes.'
  },
  'GCAP Tempest 6th-Gen Dominance': {
    name: 'GCAP Tempest 6th-Gen Dominance',
    specId: 'TEMPEST',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['METEOR', 'AIM-260', 'SPEAR-3', 'ASRAAM'],
    upgrades: ['GAN_AESA_CORE', 'DAS_360_OPTIC', 'ADAPTIVE_ECCM_SUITE'],
    desc: '6th-gen sensor flagship (104 km radar) armed with hitscan laser fire, Meteors, AIM-260s, and SPEAR-3s.'
  },
  'GCAP Tempest Micro-Swarm & HOJ': {
    name: 'GCAP Tempest Micro-Swarm & HOJ',
    specId: 'TEMPEST',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['FMRAAM', 'AIM-260B-HOJ', 'ADMM-S', 'CACM-6', 'SADM-8'],
    upgrades: ['GAN_AESA_CORE', 'DAS_360_OPTIC', 'ADAPTIVE_ECCM_SUITE', 'SUPERCRUISE_VCE'],
    desc: 'Next-gen saturation Tempest blending FMRAAM and HOJ JATM with internal ADMM-S omni-packs and 14x close-combat micro-missiles.'
  },
  'FCAS NGF Tailless Stealth': {
    name: 'FCAS NGF Tailless Stealth',
    specId: 'FCAS-NGF',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['FMRAAM', 'AIM-260', 'MICA-EM', 'MICA-IR'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Pure internal-bay tailless 6th-gen air dominance fighter (0.0001m2 RCS, 1.18 agility) carrying FMRAAM, AIM-260, and MICA-EM/IR.'
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
  'J-36 Heavy 6th-Gen Air Dominance': {
    name: 'J-36 Heavy 6th-Gen Air Dominance',
    specId: 'J-36',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'PLSL_MED',
    weapons: ['PL-15', 'PL-15-HOJ', 'ADMM-S', 'PL-10E-ER', 'CACM-6', 'PEREGRINE'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE', 'SUPERCRUISE_VCE'],
    desc: 'Tri-jet stealth fleet dominator packing 8 internal slots of PL-15, HOJ, ADMM-S, and micro-IR backed by external Peregrines.'
  },
  'J-50 Tailless Lambdoid Intercept': {
    name: 'J-50 Tailless Lambdoid Intercept',
    specId: 'J-50',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['PL-15', 'K-77ME', 'PL-10E-ER', 'R-74M2'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'High-agility tailless stealth interceptor keeping domestic PL-15, Mach 4.5 K-77ME, and extended HOBS IR concealed internally.'
  }
};
