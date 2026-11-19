/**
 * js/data/templates/superfighters.js - Preconfigured Loadouts: Fictional Superfighters.
 */

window.TEMPLATES_SUPERFIGHTERS = {
  'X-02S Variable-Geometry Strike Fighter': {
    name: 'X-02S Variable-Geometry Strike Fighter',
    specId: 'X-02S',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'ADMM-S', 'JNAAM', 'AIM-9X-B3'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR'],
    desc: 'Variable-geometry stealth superfighter deploying internal AIM-260 and ADMM-S omni-packs with JNAAM AESA ramjets.'
  },
  'X-02S Wyvern MPBM-II Area Denial': {
    name: 'X-02S Wyvern MPBM-II Area Denial',
    specId: 'X-02S',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'EML_GUN',
    weapons: ['MPBM-II', 'ADMM-S', 'AIM-260', 'CACM-6'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR'],
    desc: 'Area-denial Strike Wyvern combining 10.5 km blast MPBM-II shockwaves with internal ADMM-S, AIM-260, and EML railgun.'
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
    weapons: ['AIM-260', 'METEOR', 'AIM-120D-3', 'AIM-9X-B3'],
    upgrades: ['SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'Railgun interceptor pairing EML slugs with AIM-260, ramjet Meteor, F3R AMRAAMs, and Block III Sidewinders.'
  },
  'ADFX-01 Standoff Multi-Mission Prototype': {
    name: 'ADFX-01 Standoff Multi-Mission Prototype',
    specId: 'ADFX-01',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'M61A2',
    weapons: ['MPBM-II', 'ADMM-S', 'AIM-120D-3', 'AIM-9X-B3'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'SUPERCRUISE_VCE', 'EXPANDED_CM_DISPENSER'],
    desc: 'Forward-canted canard prototype deploying 10.5 km blast MPBM-II missiles alongside internal ADMM-S and F3R AMRAAMs.'
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
    weapons: ['ADMM', 'ADMM-S', 'AIM-260', 'PYTHON-5', 'AIM-9X-B3'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Carrier defense package combining EML railgun, 20x ADMM/ADMM-S omni-missiles, AIM-260, and rearward Python-5.'
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
    weapons: ['AIM-260B-HOJ', 'ADMM-S', 'FMRAAM', 'PL-15-HOJ', 'AIM-9X-B3'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'GAN_AESA_CORE'],
    desc: 'Counter-jamming carrier interceptor pairing Home-On-Jam JATM and PL-15B with FMRAAM ramjets and internal ADMM-S.'
  },
  'DARKSTAR Hypersonic High-Altitude Penetrator': {
    name: 'DARKSTAR Hypersonic High-Altitude Penetrator',
    specId: 'DARKSTAR',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-158B', 'AIM-260'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Scramjet penetrator cruising above FL580, out-pacing standard surface SAM engagement envelopes.'
  },
  'X-40 Stealth Air Dominance': {
    name: 'X-40 Stealth Air Dominance',
    specId: 'X-40',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'EML_GUN',
    weapons: ['AIM-260', 'ADMM-S', 'JNAAM', 'AIM-9X-B3', 'PYTHON-5'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Stealth dominance package pairing internal EML railgun, AIM-260, and ADMM-S with external JNAAM ramjets and Python-5.'
  },
  'X-40 Laser UAV & Railgun Intercept': {
    name: 'X-40 Laser UAV & Railgun Intercept',
    specId: 'X-40',
    roleCategory: 'COFFIN & FLAGSHIPS',
    chosenGunId: 'EML_GUN',
    weapons: ['ADMM', 'AIM-260', 'TLS_POD'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'THRUST_VECTOR', 'SUPERCRUISE_VCE'],
    desc: 'Interceptor package combining internal EML railgun with ADMM micro-missiles and tactical laser fire.'
  },
  'X-40 Precision Standoff Strike': {
    name: 'X-40 Precision Standoff Strike',
    specId: 'X-40',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-158B', 'GBU-39', 'AIM-260'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS', 'SUPERCRUISE_VCE'],
    desc: 'Stealth strike package deploying AGM-158B cruise missiles and standoff glide bombs with BVR defense.'
  },
  'XFA-36B Fleet Air Superiority': {
    name: 'XFA-36B Fleet Air Superiority',
    specId: 'XFA-36B',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'ADMM-S', 'FMRAAM', 'AIM-120D-3', 'AIM-9X-B3'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR', 'EOTS_DUAL_OPTICS'],
    desc: 'Carrier air superiority package pairing pivoting wingtips and 3D TVC with AIM-260, ADMM-S, FMRAAM, and F3R AMRAAMs.'
  },
  'XFA-36B Kinetic Railgun Intercept': {
    name: 'XFA-36B Kinetic Railgun Intercept',
    specId: 'XFA-36B',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'EML_GUN',
    weapons: ['AIM-260', 'METEOR', 'PYTHON-5', 'ALE-55'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'THRUST_VECTOR', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Interceptor package pairing EML railgun with stealth AIM-260 missiles and rearward Python-5 defense.'
  },
  'XFA-36B Multirole Carrier Strike': {
    name: 'XFA-36B Multirole Carrier Strike',
    specId: 'XFA-36B',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-158B', 'GBU-39', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['SUPERCRUISE_VCE', 'TITANIUM_COCKPIT', 'THRUST_VECTOR', 'EOTS_DUAL_OPTICS'],
    desc: 'Carrier strike loadout featuring 8 precision glide bombs and cruise missiles with pulse laser defense.'
  }
};
