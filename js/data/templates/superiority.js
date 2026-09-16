/**
 * APEX VECTOR // Preconfigured Loadouts: Air Superiority Interceptors
 * Professional military designations and diversified weapon loadouts
 */

window.TEMPLATES_SUPERIORITY = {
  // MiG-31BM Foxhound
  'MiG-31BM Long-Range Intercept': {
    name: 'MiG-31BM Long-Range Intercept',
    specId: 'MiG-31BM',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-37M', 'PL-21', 'AIM-120D'],
    upgrades: ['SUPERCRUISE_VCE', 'ESM_PASSIVE_SUITE'],
    desc: 'Stratospheric intercept profile (Mach 1.34 cruise / Mach 2.83 dash) deploying hypersonic R-37M Axeheads from high altitude.'
  },
  'MiG-31BM Aero-Ballistic Strike': {
    name: 'MiG-31BM Aero-Ballistic Strike',
    specId: 'MiG-31BM',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KINZHAL', 'R-37M'],
    upgrades: ['EXTENDED_RANGE_TURBO', 'TITANIUM_COCKPIT'],
    desc: 'Heavy strategic strike configuration armed with the Mach 8.5 Kh-47M2 Kinzhal aero-ballistic bunker penetrator.'
  },

  // F-15EX Eagle II
  'F-15EX Heavy Air Superiority (CAP)': {
    name: 'F-15EX Heavy Air Superiority (CAP)',
    specId: 'F-15EX',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-120D', 'METEOR', 'AIM-9X-2', 'ALE-55'],
    upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE'],
    desc: 'Heavy missile carriage package utilizing 14 pylons to provide sustained fleet-wide BVR salvo saturation.'
  },
  'F-15EX Standoff Interdiction & SEAD': {
    name: 'F-15EX Standoff Interdiction & SEAD',
    specId: 'F-15EX',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'AGM-88G', 'GBU-39', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Heavy strike loadout combining stealth JASSM-ER cruise missiles, anti-radiation HARMs, and SDB glide bombs.'
  },

  // Su-35S Flanker-E
  'Su-35S Tactical Air Superiority': {
    name: 'Su-35S Tactical Air Superiority',
    specId: 'Su-35S',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'R-73', 'PYTHON-5', 'AN-ALQ-99'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: 'All-axis 3D thrust vectoring configuration pairing post-stall pitch authority with active jamming and Archer IR missiles.'
  },
  'Su-35S BVR Intercept': {
    name: 'Su-35S BVR Intercept',
    specId: 'Su-35S',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-37M', 'PL-15E', 'AIM-120D', 'R-73'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE'],
    desc: 'Deep beyond-visual-range loadout pairing hypersonic R-37M missiles with dual-pulse PL-15E volleys.'
  },

  // Eurofighter Typhoon
  'Eurofighter Air Dominance Sweep': {
    name: 'Eurofighter Air Dominance Sweep',
    specId: 'Eurofighter',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'AIM-120D', 'IRIS-T'],
    upgrades: ['EOTS_DUAL_OPTICS', 'GAN_AESA_CORE'],
    desc: 'Canard-delta air defense fighter. Ramjet Meteor missiles maintain Mach 4.6 with zero speed decay across the engagement envelope.'
  },
  'Eurofighter Multi-Role Strike': {
    name: 'Eurofighter Multi-Role Strike',
    specId: 'Eurofighter',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'GBU-39', 'IRIS-T'],
    upgrades: ['EXPANDED_CM_DISPENSER', 'EXTENDED_RANGE_TURBO'],
    desc: 'Balanced swing-role package pairing BVR air dominance with 8 standoff bunker-buster glide bombs.'
  },

  // Dassault Rafale C
  'Rafale C Omnirole Air Defense': {
    name: 'Rafale C Omnirole Air Defense',
    specId: 'Rafale-C',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'AIM-120D', 'PYTHON-5'],
    upgrades: ['EOTS_DUAL_OPTICS', 'DAS_360_OPTIC'],
    desc: '0.95 turn agility fighter combined with automated SPECTRA electronic protection and ramjet Meteor rails.'
  },
  'Rafale C Deep Strike Interdiction': {
    name: 'Rafale C Deep Strike Interdiction',
    specId: 'Rafale-C',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['AGM-158B', 'METEOR', 'PYTHON-5'],
    upgrades: ['TITANIUM_COCKPIT', 'ESM_PASSIVE_SUITE'],
    desc: 'Long-range strike configuration mounting low-observable cruise missiles and passive ESM sensors.'
  },

  // Su-30SM, J-16 & F-14D
  'Su-30SM Multi-Mission Interceptor': {
    name: 'Su-30SM Multi-Mission Interceptor',
    specId: 'Su-30SM',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'AIM-120D', 'R-73', 'AN-ALQ-99'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: 'Tandem-seat multirole interceptor with canard foreplanes and thrust vectoring for high-AoA flight regimes.'
  },
  'J-16 Standoff Counter-Air': {
    name: 'J-16 Standoff Counter-Air',
    specId: 'J-16',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-21', 'PL-15E', 'AIM-120D', 'R-73'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Heavy tandem-seat interceptor with 12 stations designed for coordinated long-range PL-15E and PL-21 missile salvos.'
  },
  'F-14D Fleet Air Defense (CAP)': {
    name: 'F-14D Fleet Air Defense (CAP)',
    specId: 'F-14D',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['MADL_BATTLE_LINK', 'SUPERCRUISE_VCE'],
    desc: 'Variable-sweep carrier defender providing 98km radar reach and BVR missile screening.'
  }
};