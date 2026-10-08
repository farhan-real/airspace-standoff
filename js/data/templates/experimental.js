/**
 * AIRSPACE STANDOFF: Preconfigured Loadouts: Demonstrator & COFFIN Aircraft
 */

window.TEMPLATES_EXPERIMENTAL = {
  'ADF-11F Advanced Air Superiority Prototype': {
    name: 'ADF-11F Advanced Air Superiority Prototype',
    specId: 'ADF-11F',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-260', 'AIM-120D', 'METEOR', 'AIM-9X-2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'ZOE_NEURAL_PROCESSOR', 'GAN_AESA_CORE', 'RAM_NANO_COATING'],
    desc: 'Apex air superiority testbed ($60.0M). 20.0G structural envelope, hitscan DE-Pulse laser, diverse BVR and dogfight missiles with zero pilot stress and +25% evasive dodge bonus.'
  },
  'ADF-11F Swarm Suppression': {
    name: 'ADF-11F Swarm Suppression',
    specId: 'ADF-11F',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['ADMM', 'AIM-260', 'AIM-9X-2', 'PYTHON-5'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'ZOE_NEURAL_PROCESSOR', 'DAS_360_OPTIC', 'EOTS_DUAL_OPTICS'],
    desc: 'Multi-target area defense package. Carries an ADMM micro-missile pod (12x) paired with stealth BVR and over-the-shoulder Python-5 missiles.'
  },
  'ADF-11F Directed Energy Intercept Prototype': {
    name: 'ADF-11F Directed Energy Intercept Prototype',
    specId: 'ADF-11F',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['TLS_POD', 'AIM-260', 'METEOR'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'SUPERCRUISE_VCE', 'GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Pure directed energy loadout. TLS chemical laser pod delivers 24 hitscan beams supported by AIM-260 and ramjet Meteor BVR missiles.'
  },
  'ADF-11F Kinetic Standoff Interceptor': {
    name: 'ADF-11F Kinetic Standoff Interceptor',
    specId: 'ADF-11F',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'EML_GUN',
    weapons: ['PL-21', 'AIM-260', 'AIM-9X-2', 'ALE-55'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'ZOE_NEURAL_PROCESSOR', 'SUPERCRUISE_VCE', 'RAM_NANO_COATING'],
    desc: 'High-velocity electromagnetic kinetic railgun (24 slugs) paired with extreme standoff PL-21 hypersonic missiles and towed decoys.'
  },
  'ADF-11F Deep Precision Interdiction': {
    name: 'ADF-11F Deep Precision Interdiction',
    specId: 'ADF-11F',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-158B', 'GBU-39', 'AIM-120D'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'RAM_NANO_COATING', 'GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Low-observable deep penetration package carrying stealth AGM-158B JASSM-ER cruise missiles and GBU-39 SDB glide bombs (8x).'
  },
  'F-22C [COFFIN] Advanced Air Superiority': {
    name: 'F-22C [COFFIN] Advanced Air Superiority',
    specId: 'F-22C-COFFIN',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-260', 'METEOR', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE'],
    desc: 'Apex 6th-Gen manual COFFIN conversion ($62.0M). Optical shell yields 0.00005m2 ghost RCS, 18.0G envelope, hitscan DE-Pulse laser, and +28% evasive dodge bonus.'
  },
  'Su-37 [COFFIN] Air Dominance Interceptor': {
    name: 'Su-37 [COFFIN] Air Dominance Interceptor',
    specId: 'Su-37-COFFIN',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['R-37M', 'PL-15E', 'PL-15E', 'PYTHON-5', 'R-73'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'RAM_NANO_COATING'],
    desc: 'COFFIN airframe fielding hypersonic R-37M, dual-pulse PL-15E, and rearward Python-5s.'
  },
  'F-15 S/MT [COFFIN] Strike Interceptor': {
    name: 'F-15 S/MT [COFFIN] Strike Interceptor',
    specId: 'F-15-SMT-COFFIN',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'M61A2',
    weapons: ['GPU-5A', 'AGM-158B', 'AGM-88G', 'AIM-260'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'MADL_BATTLE_LINK'],
    desc: 'Heavy strike superiority with armored COFFIN shell ($45.0M) pairing 30mm gunpod with cruise missiles.'
  },
  'F-15 S/MTD Maneuver Technology Demonstrator': {
    name: 'F-15 S/MTD Maneuver Technology Demonstrator',
    specId: 'F-15-SMTD',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'METEOR', 'AIM-9X-2', 'AIM-9X-2'],
    upgrades: ['THRUST_VECTOR', 'SUPERCRUISE_VCE'],
    desc: 'Canard 2D TVC demonstrator deploying 12 BVR missiles and 8 Sidewinders.'
  },
  'Su-47 High-AoA Technology Demonstrator': {
    name: 'Su-47 High-AoA Technology Demonstrator',
    specId: 'Su-47',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'PL-15E', 'AIM-120D', 'R-73'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: 'Forward-swept wing demonstrator delivering 0.99 turn agility and 12 BVR missiles.'
  },
  'Su-37 Thrust Vectoring Demonstrator': {
    name: 'Su-37 Thrust Vectoring Demonstrator',
    specId: 'Su-37',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-37M', 'PL-15E', 'PL-15E', 'R-73'],
    upgrades: ['THRUST_VECTOR', 'EOTS_DUAL_OPTICS'],
    desc: 'Canard 3D TVC Kulbit loop demonstrator pairing hypersonic R-37M with dual-pulse rockets.'
  },
  'X-29A Forward-Swept Wing Demonstrator': {
    name: 'X-29A Forward-Swept Wing Demonstrator',
    specId: 'X-29A',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-9X-2', 'PYTHON-5'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Lightweight forward-swept technology demonstrator with extreme high-AoA pitch authority.'
  }
};