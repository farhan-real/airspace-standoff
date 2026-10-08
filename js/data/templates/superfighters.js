/**
 * AIRSPACE STANDOFF: Preconfigured Loadouts: Fictional Superfighters
 */

window.TEMPLATES_SUPERFIGHTERS = {
  'X-02S Variable-Geometry Strike Fighter': {
    name: 'X-02S Variable-Geometry Strike Fighter',
    specId: 'X-02S',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-120D', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR'],
    desc: 'Variable-geometry stealth superfighter deploying 12 BVR missiles and Sidewinders.'
  },
  'X-02S Stealth Strike Wyvern': {
    name: 'X-02S Stealth Strike Wyvern',
    specId: 'X-02S',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'AIM-260', 'AIM-9X-2'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Low-observable deep penetrator pairing stealth JASSM-ER cruise missiles with BVR defense.'
  },
  'X-02S Kinetic Standoff Intercept': {
    name: 'X-02S Kinetic Standoff Intercept',
    specId: 'X-02S',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'EML_GUN',
    weapons: ['AIM-260', 'METEOR', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'Railgun interceptor pairing EML kinetic slugs with ramjet Meteor and AMRAAM missiles.'
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
  'CFA-44 Advanced Fleet Air Defense': {
    name: 'CFA-44 Advanced Fleet Air Defense',
    specId: 'CFA-44',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'EML_GUN',
    weapons: ['ADMM', 'AIM-260', 'AIM-120D', 'PYTHON-5', 'AIM-9X-2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Carrier defense package combining EML railgun, ADMM pod (12x), BVR missiles, and rearward Python-5.'
  },
  'CFA-44 Thermobaric Area Denial': {
    name: 'CFA-44 Thermobaric Area Denial',
    specId: 'CFA-44',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'EML_GUN',
    weapons: ['MPBM', 'ADMM', 'AIM-260', 'PYTHON-5'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: 'Thermobaric area denial pairing MPBM shockwave missiles with ADMM 360-degree volleys.'
  },
  'CFA-44 Precision Fleet Interceptor': {
    name: 'CFA-44 Precision Fleet Interceptor',
    specId: 'CFA-44',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AIM-260', 'METEOR', 'PL-15E', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE'],
    desc: 'Long-range carrier interceptor pairing AIM-260 stealth BVR volleys with ramjet Meteor and dual-pulse rockets.'
  },
  'DARKSTAR Hypersonic High-Altitude Penetrator': {
    name: 'DARKSTAR Hypersonic High-Altitude Penetrator',
    specId: 'DARKSTAR',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-158B', 'AIM-260'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Scramjet penetrator ($56.0M) cruising at Mach 3.20 above FL580, out-pacing standard surface SAM engagement envelopes.'
  },
  'X-40 Apex Air Dominance': {
    name: 'X-40 Apex Air Dominance',
    specId: 'X-40',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'EML_GUN',
    weapons: ['AIM-260', 'METEOR', 'AIM-9X-2', 'PYTHON-5'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Sixth-generation stealth air dominance package ($58.0M). High-velocity EML railgun paired with internal stealth BVR missiles, ramjet Meteors, and all-aspect dogfight defense.'
  },
  'X-40 Laser UAV & Railgun Intercept': {
    name: 'X-40 Laser UAV & Railgun Intercept',
    specId: 'X-40',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'EML_GUN',
    weapons: ['ADMM', 'AIM-260', 'TLS_POD'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'THRUST_VECTOR', 'SUPERCRUISE_VCE'],
    desc: 'Experimental high-threat interceptor combining an EML hyper-velocity railgun with ADMM micro-missile volleys and tactical high-energy laser fire.'
  },
  'X-40 Precision Standoff Strike': {
    name: 'X-40 Precision Standoff Strike',
    specId: 'X-40',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-158B', 'GBU-39', 'AIM-260'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS', 'SUPERCRUISE_VCE'],
    desc: 'Deep penetration stealth strike package deploying low-observable AGM-158B cruise missiles and standoff glide bombs while defending with stealth BVR missiles.'
  },
  'XFA-36B Fleet Air Superiority': {
    name: 'XFA-36B Fleet Air Superiority',
    specId: 'XFA-36B',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'METEOR', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR', 'EOTS_DUAL_OPTICS'],
    desc: 'Tailless carrier air superiority package ($50.0M) utilizing pivoting wingtips and 3D TVC nozzles to out-turn adversary fighters across all speed regimes.'
  },
  'XFA-36B Kinetic Railgun Intercept': {
    name: 'XFA-36B Kinetic Railgun Intercept',
    specId: 'XFA-36B',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'EML_GUN',
    weapons: ['AIM-260', 'METEOR', 'PYTHON-5', 'ALE-55'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'High-speed interceptor package pairing hyper-velocity EML railgun slugs with stealth AIM-260 volleys and rearward Python-5 dogfight defense.'
  },
  'XFA-36B Multirole Carrier Strike': {
    name: 'XFA-36B Multirole Carrier Strike',
    specId: 'XFA-36B',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-158B', 'GBU-39', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['SUPERCRUISE_VCE', 'TITANIUM_COCKPIT', 'THRUST_VECTOR', 'EOTS_DUAL_OPTICS'],
    desc: 'Carrier-borne multirole strike loadout featuring 8 precision glide bombs and stealth cruise missiles with pulse laser close-range defense.'
  }
};