/**
 * js/data/templates/experimental.js - Preconfigured Loadouts: Demonstrator & COFFIN Aircraft.
 */

window.TEMPLATES_EXPERIMENTAL = {
  'ADF-11F Advanced Air Superiority Prototype': {
    name: 'ADF-11F Advanced Air Superiority Prototype',
    specId: 'ADF-11F',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-260', 'AIM-120D-3', 'METEOR', 'AIM-9X-B3'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'ZOE_NEURAL_PROCESSOR', 'GAN_AESA_CORE', 'RAM_NANO_COATING'],
    desc: 'Flagship air superiority testbed. 20.0G envelope, hitscan DE-Pulse laser, AIM-260, Meteor, F3R AMRAAM, and Block III Sidewinders.'
  },
  'ADF-11F Swarm Suppression': {
    name: 'ADF-11F Swarm Suppression',
    specId: 'ADF-11F',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['ADMM', 'ADMM-S', 'AIM-260', 'PYTHON-5'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'ZOE_NEURAL_PROCESSOR', 'DAS_360_OPTIC', 'EOTS_DUAL_OPTICS'],
    desc: 'Multi-target area defense combining external ADMM and internal ADMM-S omni-packs (20x total) with AIM-260 and Python-5.'
  },
  'ADF-11F Heavy MPBM-II Area Denial': {
    name: 'ADF-11F Heavy MPBM-II Area Denial',
    specId: 'ADF-11F',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'PLSL_HEAVY',
    weapons: ['MPBM-II', 'ADMM-S', 'AIM-260', 'CACM-6'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'ZOE_NEURAL_PROCESSOR', 'GAN_AESA_CORE', 'RAM_NANO_COATING'],
    desc: 'Heavy shockwave Raven fielding 10.5 km blast MPBM-II missiles alongside internal ADMM-S, AIM-260, and CACM micro-IR.'
  },
  'ADF-11F Directed Energy Intercept Prototype': {
    name: 'ADF-11F Directed Energy Intercept Prototype',
    specId: 'ADF-11F',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['TLS_POD', 'AIM-260', 'METEOR'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'SUPERCRUISE_VCE', 'GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Pure directed energy loadout. TLS chemical laser pod delivers 12 hitscan pulses supported by AIM-260 and ramjet Meteor missiles.'
  },
  'ADF-11F Kinetic Standoff Interceptor': {
    name: 'ADF-11F Kinetic Standoff Interceptor',
    specId: 'ADF-11F',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'EML_GUN',
    weapons: ['PL-21', 'AIM-260', 'AIM-9X-2', 'ALE-55'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'ZOE_NEURAL_PROCESSOR', 'SUPERCRUISE_VCE', 'RAM_NANO_COATING'],
    desc: 'High-velocity electromagnetic kinetic railgun paired with extreme standoff PL-21 hypersonic missiles and towed decoys.'
  },
  'ADF-11F Deep Precision Interdiction': {
    name: 'ADF-11F Deep Precision Interdiction',
    specId: 'ADF-11F',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-158B', 'GBU-39', 'AIM-120D'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'RAM_NANO_COATING', 'GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Low-observable deep penetration package carrying stealth AGM-158B JASSM-ER cruise missiles and GBU-39 SDB glide bombs.'
  },
  'F-22C [COFFIN] Advanced Air Superiority': {
    name: 'F-22C [COFFIN] Advanced Air Superiority',
    specId: 'F-22C-COFFIN',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-260B-HOJ', 'JNAAM', 'AIM-120D-3', 'AIM-9X-B3'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE'],
    desc: 'Advanced 6th-Gen COFFIN conversion (0.00005m2 RCS, 18G) carrying Home-On-Jam JATM, JNAAM ramjets, and F3R AMRAAMs.'
  },
  'F-22C [COFFIN] Internal Saturation': {
    name: 'F-22C [COFFIN] Internal Saturation',
    specId: 'F-22C-COFFIN',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['ADMM-S', 'CUDA-SAC', 'AIM-260', 'CACM-6'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'High-density COFFIN Raptor II fielding 20 internal BVR and omni-directional missiles backed by close-combat CACM-6.'
  },
  'Su-37 [COFFIN] Air Dominance Interceptor': {
    name: 'Su-37 [COFFIN] Air Dominance Interceptor',
    specId: 'Su-37-COFFIN',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['R-37M', 'K-77ME', 'R-77T', 'R-74M2', 'PYTHON-5'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'RAM_NANO_COATING'],
    desc: 'COFFIN airframe fielding hypersonic R-37M, Mach 4.5 K-77ME, silent thermal R-77T, R-74M2, and rearward Python-5s.'
  },
  'F-15 S/MT [COFFIN] Strike Interceptor': {
    name: 'F-15 S/MT [COFFIN] Strike Interceptor',
    specId: 'F-15-SMT-COFFIN',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'M61A2',
    weapons: ['GPU-5A', 'AGM-158B', 'AGM-88G', 'AIM-260'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'MADL_BATTLE_LINK'],
    desc: 'Heavy strike superiority with armored COFFIN shell pairing 30mm gunpod with cruise missiles.'
  },
  'F-15 S/MT [COFFIN] Fleet Interceptor': {
    name: 'F-15 S/MT [COFFIN] Fleet Interceptor',
    specId: 'F-15-SMT-COFFIN',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-174B', 'FMRAAM', 'AIM-120D-3', 'AIM-9X-B3', 'PLSL_POD'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: '16G COFFIN Eagle pairing 132 km AIM-174B and FMRAAM ramjets with F3R AMRAAMs and a Pulse Laser pod.'
  },
  'F-15 S/MTD Maneuver Technology Demonstrator': {
    name: 'F-15 S/MTD Maneuver Technology Demonstrator',
    specId: 'F-15-SMTD',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-174B', 'AIM-120D-3', 'METEOR', 'AIM-9X-B3', 'IRST-21-POD'],
    upgrades: ['THRUST_VECTOR', 'SUPERCRUISE_VCE'],
    desc: 'Canard 2D TVC demonstrator deploying 132 km AIM-174B, F3R AMRAAMs, Meteor ramjets, and IRST21 tracking.'
  },
  'Su-47 High-AoA Technology Demonstrator': {
    name: 'Su-47 High-AoA Technology Demonstrator',
    specId: 'Su-47',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['K-77ME', 'R-77M', 'R-27ET', 'R-74M2'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: 'Forward-swept wing demonstrator delivering 1.28 agility with internal K-77ME, R-77M, silent 64 km R-27ET, and R-74M2.'
  },
  'Su-37 Thrust Vectoring Demonstrator': {
    name: 'Su-37 Thrust Vectoring Demonstrator',
    specId: 'Su-37',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['KS-172', 'RVV-AE-PD', 'R-77T', 'R-74M2'],
    upgrades: ['THRUST_VECTOR', 'EOTS_DUAL_OPTICS'],
    desc: 'Canard 3D TVC Kulbit loop demonstrator pairing 140 km KS-172 with RVV-AE-PD ramjets and silent thermal R-77T.'
  },
  'X-29A Forward-Swept Wing Demonstrator': {
    name: 'X-29A Forward-Swept Wing Demonstrator',
    specId: 'X-29A',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['I-DERBY-ER', 'AIM-120C-7', 'AIM-9X-B3', 'PYTHON-5', 'PIRATE-IRST-POD'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Lightweight forward-swept demonstrator carrying I-Derby ER, lightweight AMRAAMs, Block III Sidewinders, and Skyward IRST.'
  }
};
