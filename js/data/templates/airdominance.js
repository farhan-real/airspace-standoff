/**
 * js/data/templates/airdominance.js - Preconfigured Loadouts for Expanded Air Superiority & Interceptors.
 */

window.TEMPLATES_AIR_DOMINANCE = {
  'F-15C Golden Eagle CAP': {
    name: 'F-15C Golden Eagle CAP',
    specId: 'F-15C',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-260', 'AIM-9X-2'],
    upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Pure air-to-air Golden Eagle ($24.0M) deploying APG-63(v)3 radar with 12 BVR and 4 Sidewinders.'
  },
  'F-15JSI Pac-Rim Interceptor': {
    name: 'F-15JSI Pac-Rim Interceptor',
    specId: 'F-15J-JSI',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AAM-4B', 'AAM-4B', 'AIM-174B', 'AAM-5B'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'MADL_BATTLE_LINK'],
    desc: 'Modernized Super Interceptor pairing AESA AAM-4B missiles with 132 km AIM-174B fleet defense.'
  },
  'Su-27SM3 Flanker Air Sweep': {
    name: 'Su-27SM3 Flanker Air Sweep',
    specId: 'Su-27SM3',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-77-1', 'R-77-1', 'R-73', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Economical heavy Flanker ($19.0M) fielding 8 BVR Adders and 8 Archer IR dogfight missiles.'
  },
  'Su-30MKI BrahMos & Air Dominance': {
    name: 'Su-30MKI BrahMos & Air Dominance',
    specId: 'Su-30MKI',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['ASTRA-MK2', 'R-77M', 'BRAHMOS-A', 'R-73'],
    upgrades: ['THRUST_VECTOR', 'ESM_PASSIVE_SUITE'],
    desc: 'Canard-TVC Flanker pairing Mach 3.0 BrahMos-A centerline strike with long-range Astra Mk2 and R-77M.'
  },
  'J-11BG AESA Heavy Interceptor': {
    name: 'J-11BG AESA Heavy Interceptor',
    specId: 'J-11BG',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-17', 'PL-15E', 'PL-15E', 'PL-10'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Single-seat AESA Flanker ($22.5M) built around 135 km PL-17 standoff sniping and PL-15E sweeps.'
  },
  'J-15T Carrier Flanker CAP': {
    name: 'J-15T Carrier Flanker CAP',
    specId: 'J-15T',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'PL-15E', 'PL-17', 'PL-10'],
    upgrades: ['GAN_AESA_CORE', 'TITANIUM_COCKPIT'],
    desc: 'Heavy carrier-launched Flanker providing long-range fleet air defense with 10 BVR missiles.'
  },
  'MiG-25PD Mach 2.05 Sprint Interceptor': {
    name: 'MiG-25PD Mach 2.05 Sprint Interceptor',
    specId: 'MiG-25PD',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['R-37M', 'R-73'],
    upgrades: ['SUPERCRUISE_VCE', 'EXTENDED_RANGE_TURBO'],
    desc: 'Bargain Mach 2.05 stratospheric interceptor ($17.5M) built to launch hypersonic R-37M missiles fast.'
  },
  'MiG-35S AESA Agile Fulcrum': {
    name: 'MiG-35S AESA Agile Fulcrum',
    specId: 'MiG-35S',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-77M', 'R-77M', 'R-74M2', 'AN-ALQ-184'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE'],
    desc: 'High-agility 1.10 Fulcrum-F combining AESA tracking, self-protection ECM, and 8 R-77M BVR rails.'
  },
  'F-4E Terminator 2020 BVR Truck': {
    name: 'F-4E Terminator 2020 BVR Truck',
    specId: 'F-4E-2020',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2', 'AN-ALQ-184'],
    upgrades: ['TITANIUM_COCKPIT'],
    desc: 'Budget 5 HP Phantom interceptor ($13.5M) fielding 8 AMRAAMs, 4 Sidewinders, and ALQ-184 ECM.'
  },
  'Super Mirage 4000 Heavy Delta': {
    name: 'Super Mirage 4000 Heavy Delta',
    specId: 'Mirage-4000',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'METEOR', 'MICA-EM', 'MICA-IR'],
    upgrades: ['SUPERCRUISE_VCE', 'EOTS_DUAL_OPTICS'],
    desc: 'Mach 1.44 twin-engine delta interceptor fielding 8 ramjet Meteors and silent MICA-IR ambush rails.'
  },
  'F-14B Fleet Defender': {
    name: 'F-14B Fleet Defender',
    specId: 'F-14B',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2', 'LANTIRN-POD'],
    upgrades: ['MADL_BATTLE_LINK'],
    desc: 'Economical 90 km AWG-9 fleet defender ($16.5M) pairing 8 BVR AMRAAMs with night LANTIRN cueing.'
  },
  'Eurofighter Tranche 4 ECRS Mk2': {
    name: 'Eurofighter Tranche 4 ECRS Mk2',
    specId: 'TYPHOON-T4',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'METEOR', 'IRIS-T', 'SPEAR-3'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Wide-cone 140 deg ECRS Mk2 Typhoon pairing 8 Meteors with SPEAR-3 standoff mini-cruise missiles.'
  }
};
