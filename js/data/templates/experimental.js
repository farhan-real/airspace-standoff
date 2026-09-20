/**
 * AIRSPACE STANDOFF // Preconfigured Loadouts: Experimental Superfighters & Manual COFFIN Units
 */

window.TEMPLATES_EXPERIMENTAL = {
  'ADF-11F Advanced Air Superiority Prototype': {
    name: 'ADF-11F Advanced Air Superiority Prototype',
    specId: 'ADF-11F',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-260', 'AIM-120D', 'METEOR', 'AIM-9X-2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'ZOE_NEURAL_PROCESSOR', 'GAN_AESA_CORE', 'RAM_NANO_COATING'],
    desc: 'Apex air superiority testbed ($60.0M). 20.0G structural envelope, hitscan DE-Pulse laser, diverse BVR and dogfight missiles with zero pilot stress and +8% evasive dodge bonus.'
  },
  'ADF-11F Tactical Swarm Suppression': {
    name: 'ADF-11F Tactical Swarm Suppression',
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
    desc: 'High-velocity electromagnetic kinetic railgun (120 slugs) paired with extreme standoff PL-21 hypersonic missiles and towed decoys.'
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
  'ADF-11F Defense Suppression (SEAD)': {
    name: 'ADF-11F Defense Suppression (SEAD)',
    specId: 'ADF-11F',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'DE-PULSE',
    weapons: ['AN-ALQ-249', 'AGM-88G', 'AIM-260', 'ADM-160B'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'ADAPTIVE_ECCM_SUITE', 'ESM_PASSIVE_SUITE', 'GAN_AESA_CORE'],
    desc: 'Suppression of Enemy Air Defenses escort. High-power GaN AESA jamming pod and AGM-88G anti-radiation missiles to blind and eliminate SAM radars.'
  },
  'CFA-44 Advanced Fleet Air Defense': {
    name: 'CFA-44 Advanced Fleet Air Defense',
    specId: 'CFA-44',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'EML_GUN',
    weapons: ['ADMM', 'AIM-260', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Heavy carrier air defense package. Built-in EML hyper-velocity railgun (120 slugs), an ADMM micro-missile pod (12x), and long-range BVR missiles.'
  },
  'CFA-44 Thermobaric Standoff Attack': {
    name: 'CFA-44 Thermobaric Standoff Attack',
    specId: 'CFA-44',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'EML_GUN',
    weapons: ['MPBM', 'AIM-260', 'METEOR'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: 'Heavy standoff area-denial loadout armed with high-yield thermobaric MPBM burst missiles (2x) and EML kinetic railgun.'
  },
  'CFA-44 Precision Fleet Interceptor': {
    name: 'CFA-44 Precision Fleet Interceptor',
    specId: 'CFA-44',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-260', 'METEOR', 'PL-15E', 'AIM-9X-2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE'],
    desc: 'Balanced long-range carrier interceptor pairing AIM-260 stealth BVR volleys with ramjet Meteor and dual-pulse rockets.'
  },
  'ADFX-01 Standoff Multi-Mission Prototype': {
    name: 'ADFX-01 Standoff Multi-Mission Prototype',
    specId: 'ADFX-01',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'M61A2',
    weapons: ['MPBM', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'SUPERCRUISE_VCE', 'EXPANDED_CM_DISPENSER'],
    desc: 'Forward-canted canard prototype superfighter ($48.0M) deploying high-yield MPBM thermobaric shockwave missiles (2x).'
  },
  'ADFX-01 Directed Energy Testbed': {
    name: 'ADFX-01 Directed Energy Testbed',
    specId: 'ADFX-01',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['TLS_POD', 'AIM-120D', 'PYTHON-5'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE'],
    desc: 'Equipped with the high-energy chemical TLS tactical laser pod delivering instantaneous hitscan thermal damage.'
  },
  'X-02S Variable-Geometry Strike Fighter': {
    name: 'X-02S Variable-Geometry Strike Fighter',
    specId: 'X-02S',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR'],
    desc: 'Variable-geometry stealth superfighter ($46.0M). Transitions from high-speed dash to forward-swept dogfight configuration.'
  },
  'X-02S Kinetic Standoff Intercept': {
    name: 'X-02S Kinetic Standoff Intercept',
    specId: 'X-02S',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'EML_GUN',
    weapons: ['AIM-260', 'METEOR', 'AIM-9X-2'],
    upgrades: ['SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'Extreme-speed railgun interceptor pairing EML kinetic slugs with ramjet Meteor missiles.'
  },
  'F-22C [COFFIN] Advanced Air Superiority': {
    name: 'F-22C [COFFIN] Advanced Air Superiority',
    specId: 'F-22C-COFFIN',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-260', 'METEOR', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE'],
    desc: 'Apex 6th-Gen manual COFFIN conversion ($62.0M). Optical shell yields 0.00005m2 ghost RCS, 18.0G envelope, hitscan DE-Pulse laser, and +8% evasive dodge bonus.'
  },
  'Su-37 [COFFIN] Tactical Interceptor': {
    name: 'Su-37 [COFFIN] Tactical Interceptor',
    specId: 'Su-37-COFFIN',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['R-37M', 'PL-15E', 'R-73'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'RAM_NANO_COATING'],
    desc: 'Optical shell eliminates G-LOC, granting sustained 16G post-stall turns, reduced radar signature, and +8% evasive dodge bonus.'
  },
  'F-15 S/MT [COFFIN] Strike Interceptor': {
    name: 'F-15 S/MT [COFFIN] Strike Interceptor',
    specId: 'F-15-SMT-COFFIN',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AGM-88G', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'MADL_BATTLE_LINK'],
    desc: 'Heavy strike superiority with armored COFFIN shell ($45.0M). 16.0G structural limit with reduced radar cross-section.'
  },
  'DARKSTAR Hypersonic High-Altitude Penetrator': {
    name: 'DARKSTAR Hypersonic High-Altitude Penetrator',
    specId: 'DARKSTAR',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-158B', 'AIM-260'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Scramjet penetrator ($56.0M) cruising at Mach 3.20 above FL580, completely out-pacing standard surface SAM engagement envelopes.'
  },
  'F-15 S/MTD Maneuver Technology Demonstrator': {
    name: 'F-15 S/MTD Maneuver Technology Demonstrator',
    specId: 'F-15-SMTD',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-9X-2', 'AIM-9X-2'],
    upgrades: ['THRUST_VECTOR', 'SUPERCRUISE_VCE'],
    desc: 'Canard foreplanes paired with 2D rectangular TVC nozzles for exceptional pitch response.'
  },
  'Su-47 High-AoA Technology Demonstrator': {
    name: 'Su-47 High-AoA Technology Demonstrator',
    specId: 'Su-47',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-73', 'PYTHON-5', 'AIM-120D'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: 'Forward-swept carbon composite wings providing instantaneous 0.99 turn agility for close-in gun merges.'
  },
  'Su-37 Thrust Vectoring Demonstrator': {
    name: 'Su-37 Thrust Vectoring Demonstrator',
    specId: 'Su-37',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'R-73', 'R-73'],
    upgrades: ['THRUST_VECTOR', 'EOTS_DUAL_OPTICS'],
    desc: 'Canard foreplanes and 3D TVC nozzles optimized for post-stall 360-degree Kulbit loops.'
  },
  'X-29A Forward-Swept Wing Demonstrator': {
    name: 'X-29A Forward-Swept Wing Demonstrator',
    specId: 'X-29A',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-9X-2', 'PYTHON-5'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Lightweight forward-swept technology demonstrator with extreme high-AoA pitch authority.'
  }
};