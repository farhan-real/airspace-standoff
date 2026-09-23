/**
 * AIRSPACE STANDOFF: Preconfigured Loadouts: Stealth & 5th-Gen Air Dominance
 */

window.TEMPLATES_STEALTH = {
  'F-22A Air Superiority (OCA)': {
    name: 'F-22A Air Superiority (OCA)',
    specId: 'F-22A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-120D', 'METEOR', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Offensive Counter-Air sweep using 7 of 8 stations. Low-observable RAM coating paired with AIM-260 and Meteor for deep BVR intercept.'
  },
  'F-22A Precision Strike & Interdiction': {
    name: 'F-22A Precision Strike & Interdiction',
    specId: 'F-22A',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-39', 'GBU-39', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'EOTS_DUAL_OPTICS'],
    desc: 'Deep penetration strike using 7 of 8 stations. Glides 16 GBU-39 SDB penetrators into contested IADS rings with AMRAAM self-defense.'
  },
  'F-22A Defensive Counter-Air (DCA)': {
    name: 'F-22A Defensive Counter-Air (DCA)',
    specId: 'F-22A',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'METEOR', 'PYTHON-5'],
    upgrades: ['THRUST_VECTOR', 'EOTS_DUAL_OPTICS', 'EXPANDED_CM_DISPENSER'],
    desc: 'Air superiority package using 7 of 8 stations exploiting 2D TVC, 12 BVR missiles, and rear-hemisphere Python-5 engagement.'
  },
  'YF-23 High-Altitude Intercept': {
    name: 'YF-23 High-Altitude Intercept',
    specId: 'YF-23',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-120D', 'METEOR', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'SUPERCRUISE_VCE'],
    desc: 'High-speed interceptor package (Mach 1.15 supercruise) using 7 of 8 stations with 0.0001m2 VLO airframe profile.'
  },
  'YF-23 Long-Range Penetration': {
    name: 'YF-23 Long-Range Penetration',
    specId: 'YF-23',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-120D', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'Supercruising perimeter fighter using 7 of 8 stations pairing GaN AESA radar with 16 beyond-visual-range missiles.'
  },
  'YF-23 Stratospheric Ghost Sniper': {
    name: 'YF-23 Stratospheric Ghost Sniper',
    specId: 'YF-23',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-260', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'High-altitude sniper using 7 of 8 stations (~2,840 kg • 67% HEAVY) firing 8 stealth AIM-260 missiles above FL500 without RWR warnings.'
  },
  'F-35A Strike Fighter (JSF)': {
    name: 'F-35A Strike Fighter (JSF)',
    specId: 'F-35A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GAU-22',
    weapons: ['AIM-260', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['EOTS_DUAL_OPTICS', 'DAS_360_OPTIC', 'MADL_BATTLE_LINK'],
    desc: 'Sensor fusion suite using 5 of 8 stations. APG-81 radar (+45% clutter filter) detects terrain-masking contacts and shares tracks via MADL.'
  },
  'F-35A Precision Interdiction': {
    name: 'F-35A Precision Interdiction',
    specId: 'F-35A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['GBU-39', 'GBU-39', 'AIM-120D'],
    upgrades: ['RAM_NANO_COATING', 'EOTS_DUAL_OPTICS'],
    desc: 'Precision strike loadout using 6 of 8 stations carrying 16 GBU-39 SDBs to saturate hardened command facilities.'
  },
  'Su-57 Air Superiority Sweep': {
    name: 'Su-57 Air Superiority Sweep',
    specId: 'Su-57',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-37M', 'PL-15E', 'R-73', 'ADM-160B'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE'],
    desc: 'Long-range air superiority package using 7 of 8 stations. Hypersonic R-37M and dual-pulse PL-15E supported by decoy drone.'
  },
  'Su-57 Close Combat Maneuver': {
    name: 'Su-57 Close Combat Maneuver',
    specId: 'Su-57',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'PL-15E', 'R-73', 'PYTHON-5'],
    upgrades: ['THRUST_VECTOR', 'EOTS_DUAL_OPTICS', 'TITANIUM_COCKPIT'],
    desc: '3D all-axis TVC setup using 6 of 8 stations optimized for post-stall Pugachev Cobras, 8 BVR missiles, and rear Python-5s.'
  },
  'Su-57 Multi-Tier BVR Sweeper': {
    name: 'Su-57 Multi-Tier BVR Sweeper',
    specId: 'Su-57',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-37M', 'PL-15E', 'AIM-120D', 'R-73'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Multi-layer BVR interceptor using 7 of 8 stations (~3,440 kg • 46% NORMAL) blending Mach 4.2 hypersonic kills with dual-pulse rockets.'
  },
  'J-20 Long-Range Intercept': {
    name: 'J-20 Long-Range Intercept',
    specId: 'J-20',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-21', 'PL-15E', 'PL-15E', 'PYTHON-5'],
    upgrades: ['SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'Canard-delta heavy interceptor using 8 of 8 stations mounting the PL-21 ramjet and 8 dual-pulse PL-15E rockets.'
  },
  'J-20 Extreme Standoff Perimeter Interceptor': {
    name: 'J-20 Extreme Standoff Perimeter Interceptor',
    specId: 'J-20',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-21', 'PL-15E', 'AIM-120D', 'PYTHON-5'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Perimeter denial package using 8 of 8 stations (~3,490 kg • 45% NORMAL) deploying 130 km PL-21 ramjets across the centerline.'
  },
  'J-20 Tactical Theater Strike': {
    name: 'J-20 Tactical Theater Strike',
    specId: 'J-20',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['AGM-158B', 'PL-15E', 'PYTHON-5'],
    upgrades: ['RAM_NANO_COATING', 'EXTENDED_RANGE_TURBO'],
    desc: 'Standoff strike package using 7 of 8 stations pairing low-observable cruise missiles with supersonic egress.'
  },
  'Su-75 Lightweight Intercept': {
    name: 'Su-75 Lightweight Intercept',
    specId: 'Su-75',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['AIM-120D', 'AIM-120D', 'R-73'],
    upgrades: ['RAM_NANO_COATING', 'THRUST_VECTOR'],
    desc: 'Cost-effective 5th-Gen air defense configuration using 5 of 6 stations fielding 8 BVR AMRAAMs and 3D TVC.'
  },
  'FC-31 Naval Air Defense': {
    name: 'FC-31 Naval Air Defense',
    specId: 'FC-31',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-15E', 'AIM-120D', 'R-73'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Carrier-borne multirole airframe using 5 of 8 stations with internal bays and conformal electronic warfare sensors.'
  },
  'J-35 Carrier Air Wing OCA': {
    name: 'J-35 Carrier Air Wing OCA',
    specId: 'J-35',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-15E', 'PL-15E', 'R-73'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Naval fleet defense package using 5 of 8 stations featuring AESA radar, 8 dual-pulse missiles, and carrier durability.'
  }
};