/**
 * js/data/templates/airdominance.js - Preconfigured Loadouts: Expanded Air Superiority & Interceptors.
 */

window.TEMPLATES_AIR_DOMINANCE = {
  'F-15C Golden Eagle CAP': {
    name: 'F-15C Golden Eagle CAP',
    specId: 'F-15C',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D-3', 'AIM-120D-3', 'AIM-260', 'AIM-9X-B3'],
    upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Pure air-to-air Golden Eagle deploying APG-63(v)3 radar with F3R AMRAAMs, AIM-260 JATM, and Block III Sidewinders.'
  },
  'F-15C Fleet Interceptor (AIM-174B)': {
    name: 'F-15C Fleet Interceptor (AIM-174B)',
    specId: 'F-15C',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-174B', 'AIM-120D-3', 'IRST-21-POD', 'AIM-9X-B3', 'AN-ALQ-184'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Long-reach Golden Eagle pairing 132 km AIM-174B missiles with passive IRST21 stealth tracking and ALQ-184 ECM.'
  },
  'F-15JSI Pac-Rim Interceptor': {
    name: 'F-15JSI Pac-Rim Interceptor',
    specId: 'F-15J-JSI',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['JNAAM', 'AAM-4B', 'AIM-174B', 'AAM-5B', 'AN-ASG-34'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'MADL_BATTLE_LINK'],
    desc: 'Modernized Super Interceptor pairing JNAAM AESA ramjets and AAM-4B with 132 km AIM-174B and Legion IRST.'
  },
  'Su-27SM3 Flanker Air Sweep': {
    name: 'Su-27SM3 Flanker Air Sweep',
    specId: 'Su-27SM3',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-77-1', 'R-77-1', 'R-73', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Economical heavy Flanker fielding 8 BVR Adders and 8 Archer IR dogfight missiles.'
  },
  'Su-27SM3 Alamo Long-IR Ambush': {
    name: 'Su-27SM3 Alamo Long-IR Ambush',
    specId: 'Su-27SM3',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-27ER', 'R-27ET', 'R-27T', 'R-73', 'SORBTSIYA-L005'],
    upgrades: ['EOTS_DUAL_OPTICS', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Classic heavy Alamo Flanker pairing Mach 4.5 R-27ER with silent 64 km R-27ET thermal shots and Sorbtsiya wingtip ECM.'
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
    weapons: ['PL-17', 'PL-15', 'PL-15-HOJ', 'PL-10E-ER'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Single-seat AESA Flanker built around 135 km PL-17 sniping, domestic PL-15, Home-On-Jam PL-15B, and extended PL-10E.'
  },
  'J-15T Carrier Flanker CAP': {
    name: 'J-15T Carrier Flanker CAP',
    specId: 'J-15T',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15', 'PL-15E', 'PL-17', 'PL-10'],
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
    desc: 'Bargain Mach 2.05 stratospheric interceptor built to launch hypersonic R-37M missiles fast.'
  },
  'MiG-25PD Classic R-33S Interceptor': {
    name: 'MiG-25PD Classic R-33S Interceptor',
    specId: 'MiG-25PD',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['R-33S', 'R-60M'],
    upgrades: ['SUPERCRUISE_VCE'],
    desc: 'Economical high-altitude Foxbat interceptor armed with 112 km R-33S missiles and lightweight 6x R-60M Aphids.'
  },
  'MiG-35S AESA Agile Fulcrum': {
    name: 'MiG-35S AESA Agile Fulcrum',
    specId: 'MiG-35S',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['K-77ME', 'R-77M', 'R-74M2', 'KHIBINY-L175', 'SPPU-22'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE'],
    desc: 'High-agility Fulcrum-F combining K-77ME and R-77M BVR rails with Khibiny ECM, R-74M2, and a twin 23mm gunpod.'
  },
  'F-4E Terminator 2020 BVR Truck': {
    name: 'F-4E Terminator 2020 BVR Truck',
    specId: 'F-4E-2020',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-7P', 'AIM-120C-7', 'AIM-9M', 'SUU-23A', 'AN-ALQ-184'],
    upgrades: ['TITANIUM_COCKPIT'],
    desc: 'Budget 5 HP Phantom interceptor fielding Block II Sparrows, lightweight AMRAAMs, Sidewinders, Vulcan pod, and ALQ-184.'
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
  'Super Mirage 4000 Matra Classic': {
    name: 'Super Mirage 4000 Matra Classic',
    specId: 'Mirage-4000',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'BK-27',
    weapons: ['SUPER-530D', 'SUPER-530D', 'MAGIC-2', 'MAGIC-2', 'DEFA-554-POD', 'AN-ALQ-184'],
    upgrades: ['SUPERCRUISE_VCE', 'TITANIUM_COCKPIT'],
    desc: 'Budget twin-delta interceptor pairing Mach 4.5 Super 530Ds with Magic 2 dogfighters and a 30mm DEFA gunpod.'
  },
  'F-14B Fleet Defender': {
    name: 'F-14B Fleet Defender',
    specId: 'F-14B',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-54C', 'AIM-7P', 'AIM-9M', 'AIM-9M', 'LANTIRN-POD'],
    upgrades: ['MADL_BATTLE_LINK'],
    desc: 'Economical AWG-9 fleet defender pairing 108 km AIM-54C Phoenixes and AIM-7P Sparrows with Sidewinders and LANTIRN.'
  },
  'Eurofighter Tranche 4 ECRS Mk2': {
    name: 'Eurofighter Tranche 4 ECRS Mk2',
    specId: 'TYPHOON-T4',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['JNAAM', 'FMRAAM', 'IRIS-T-LR', 'ASRAAM', 'BRITECLOUD-POD'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Wide-cone 140 deg ECRS Mk2 Typhoon pairing JNAAM and FMRAAM ramjets with 62 km IRIS-T SLX, ASRAAM, and BriteCloud.'
  }
};
