/**
 * APEX VECTOR // Preconfigured Loadouts: Stealth & 5th-Gen Airframes
 * Authentic military operational nomenclature & balanced weapon loadouts
 */

window.TEMPLATES_STEALTH = {
  // F-22A Raptor
  'F-22A Air Superiority (OCA)': {
    name: 'F-22A Air Superiority (OCA)',
    specId: 'F-22A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-120D', 'METEOR', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Offensive Counter-Air stealth sweep. Low-observable RAM coating paired with long-range AIM-260 JATM and ramjet Meteor for deep BVR intercept.'
  },
  'F-22A Precision Strike & Interdiction': {
    name: 'F-22A Precision Strike & Interdiction',
    specId: 'F-22A',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-39', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'EOTS_DUAL_OPTICS'],
    desc: 'Low-observable deep interdiction configuration. Glides 8 GBU-39 SDB penetrators into contested IADS rings with AMRAAM self-defense.'
  },
  'F-22A Defensive Counter-Air (DCA)': {
    name: 'F-22A Defensive Counter-Air (DCA)',
    specId: 'F-22A',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-9X-2', 'PYTHON-5'],
    upgrades: ['THRUST_VECTOR', 'EOTS_DUAL_OPTICS', 'EXPANDED_CM_DISPENSER'],
    desc: 'Close-in air superiority package exploiting 2D thrust vectoring, helmet-cued Sidewinders, and Python-5 rear-hemisphere engagement.'
  },

  // YF-23 Black Widow II
  'YF-23 High-Altitude Intercept': {
    name: 'YF-23 High-Altitude Intercept',
    specId: 'YF-23',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'METEOR', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'SUPERCRUISE_VCE'],
    desc: 'High-speed interceptor package (Mach 1.15 supercruise). 0.0001m2 VLO airframe profile for long-range supersonic missile launches.'
  },
  'YF-23 Long-Range Penetration': {
    name: 'YF-23 Long-Range Penetration',
    specId: 'YF-23',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'Supercruising perimeter fighter pairing GaN AESA radar with beyond-visual-range missile volleys.'
  },

  // F-35A Lightning II
  'F-35A Strike Fighter (JSF)': {
    name: 'F-35A Strike Fighter (JSF)',
    specId: 'F-35A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GAU-22',
    weapons: ['AIM-260', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['EOTS_DUAL_OPTICS', 'DAS_360_OPTIC', 'MADL_BATTLE_LINK'],
    desc: 'C4ISR battlefield networking suite ($38.0M). APG-81 radar (+45% clutter filter) detects terrain-masking contacts and shares tracks via MADL.'
  },
  'F-35A Precision Interdiction': {
    name: 'F-35A Precision Interdiction',
    specId: 'F-35A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['GBU-39', 'GBU-39', 'AIM-120D'],
    upgrades: ['RAM_NANO_COATING', 'EOTS_DUAL_OPTICS'],
    desc: 'Precision strike loadout carrying 16 GBU-39 Small Diameter Bombs to saturate hardened surface installations and command facilities.'
  },

  // Su-57 Felon
  'Su-57 Air Superiority Sweep': {
    name: 'Su-57 Air Superiority Sweep',
    specId: 'Su-57',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-37M', 'PL-15E', 'R-73', 'ADM-160B'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE'],
    desc: 'Long-range air superiority package. Hypersonic R-37M Axehead and dual-pulse PL-15E supported by a decoy drone dispenser.'
  },
  'Su-57 Close Combat Maneuver': {
    name: 'Su-57 Close Combat Maneuver',
    specId: 'Su-57',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'R-73', 'PYTHON-5'],
    upgrades: ['THRUST_VECTOR', 'EOTS_DUAL_OPTICS', 'TITANIUM_COCKPIT'],
    desc: '3D all-axis thrust vectoring setup optimized for post-stall Pugachev Cobra maneuvers and high-off-boresight Archer missile shots.'
  },

  // J-20 Mighty Dragon
  'J-20 Long-Range Intercept': {
    name: 'J-20 Long-Range Intercept',
    specId: 'J-20',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-21', 'PL-15E', 'PYTHON-5'],
    upgrades: ['SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'Canard-delta heavy interceptor mounting the PL-21 ramjet missile and PL-15E dual-pulse rockets for long-range perimeter coverage.'
  },
  'J-20 Tactical Theater Strike': {
    name: 'J-20 Tactical Theater Strike',
    specId: 'J-20',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['AGM-158B', 'PL-15E', 'PYTHON-5'],
    upgrades: ['RAM_NANO_COATING', 'EXTENDED_RANGE_TURBO'],
    desc: 'Standoff strike package pairing low-observable cruise missiles with supersonic dash egress capability.'
  },

  // Su-75 Checkmate & FC-31 & J-35
  'Su-75 Lightweight Intercept': {
    name: 'Su-75 Lightweight Intercept',
    specId: 'Su-75',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['AIM-120D', 'R-73'],
    upgrades: ['RAM_NANO_COATING', 'THRUST_VECTOR'],
    desc: 'Cost-effective 5th-Gen air defense configuration ($24.0M) featuring 0.007m2 RCS and 3D TVC post-stall maneuverability.'
  },
  'FC-31 Naval Air Defense': {
    name: 'FC-31 Naval Air Defense',
    specId: 'FC-31',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-15E', 'AIM-120D', 'R-73'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Carrier-borne multirole airframe with internal bays and conformal electronic warfare sensors.'
  },
  'J-35 Carrier Air Wing OCA': {
    name: 'J-35 Carrier Air Wing OCA',
    specId: 'J-35',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-15E', 'PL-15E', 'R-73'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Naval fleet defense package featuring AESA radar, BVR missile capability, and carrier launch durability.'
  }
};