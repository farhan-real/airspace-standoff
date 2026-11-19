/**
 * js/data/templates/superiority.js - Preconfigured Loadouts: Air Superiority Interceptors.
 */

window.TEMPLATES_SUPERIORITY = {
  'MiG-31BM Long-Range Intercept': {
    name: 'MiG-31BM Long-Range Intercept',
    specId: 'MiG-31BM',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['K-100', 'R-37M', 'R-77M'],
    upgrades: ['SUPERCRUISE_VCE', 'ESM_PASSIVE_SUITE'],
    desc: 'Stratospheric intercept profile (Mach 1.88 sprint) pairing 145 km K-100 and hypersonic R-37M with centerline R-77M defense.'
  },
  'MiG-31BM Foxhound R-33S Patrol': {
    name: 'MiG-31BM Foxhound R-33S Patrol',
    specId: 'MiG-31BM',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-33S', 'R-33S', 'R-27ER'],
    upgrades: ['SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'Economical heavy outer-air-battle Foxhound carrying four 112 km R-33S bomber killers and Mach 4.5 R-27ER backups.'
  },
  'MiG-31BM Aero-Ballistic Strike': {
    name: 'MiG-31BM Aero-Ballistic Strike',
    specId: 'MiG-31BM',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KINZHAL', 'AIM-120D'],
    upgrades: ['EXTENDED_RANGE_TURBO', 'TITANIUM_COCKPIT'],
    desc: 'Heavy strategic strike configuration armed with the Mach 6.2 Kh-47M2 Kinzhal aero-ballistic bunker penetrator.'
  },
  'F-15EX Heavy Air Superiority (CAP)': {
    name: 'F-15EX Heavy Air Superiority (CAP)',
    specId: 'F-15EX',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-174B', 'AIM-260', 'AIM-120D-3', 'AIM-120D-3', 'FMRAAM', 'AIM-9X-B3', 'IRST-21-POD'],
    upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE'],
    desc: 'Heavy CAP missile truck fielding 132 km AIM-174B, AIM-260, F3R AMRAAMs, FMRAAM ramjets, and passive IRST21 anti-stealth.'
  },
  'F-15EX Standoff Interdiction & SEAD': {
    name: 'F-15EX Standoff Interdiction & SEAD',
    specId: 'F-15EX',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'AGM-88G', 'GBU-39', 'AIM-120D', 'AN-ALQ-184', 'AIM-9X-2', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Heavy strike escort package combining stealth cruise missiles, anti-radiation HARMs, and SDB glide bombs.'
  },
  'F-15EX Hypersonic Theater Strike': {
    name: 'F-15EX Hypersonic Theater Strike',
    specId: 'F-15EX',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['KINZHAL', 'AGM-158B', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Extreme standoff strike configuration taking advantage of Type X pylons to deploy the Mach 6.2 Kh-47M2 Kinzhal.'
  },
  'Su-35S Air Dominance Sweep': {
    name: 'Su-35S Air Dominance Sweep',
    specId: 'Su-35S',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'PL-15E', 'R-73', 'PYTHON-5', 'AN-ALQ-99'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: '3D all-axis thrust vectoring pairing post-stall pitch authority with active jamming and Archer IR missiles.'
  },
  'Su-35S BVR Intercept': {
    name: 'Su-35S BVR Intercept',
    specId: 'Su-35S',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KS-172', 'R-37M', 'K-77ME', 'R-74M2'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE'],
    desc: 'Deep beyond-visual-range loadout pairing 140 km KS-172 and R-37M heavy missiles with Mach 4.5 K-77ME and R-74M2.'
  },
  'Su-35S Close-Range Gunfighter': {
    name: 'Su-35S Close-Range Gunfighter',
    specId: 'Su-35S',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['GSH-6-23-POD', 'SPPU-22', 'R-74M2', 'R-73', 'PYTHON-5', 'R-77T', 'AN-ALQ-184'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Close merge brawler mounting 6-barrel and twin 23mm gunpods alongside thermal R-77T, R-74M2, and rearward Python-5s.'
  },
  'Eurofighter Air Dominance Sweep': {
    name: 'Eurofighter Air Dominance Sweep',
    specId: 'Eurofighter',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'METEOR', 'AIM-120D', 'IRIS-T'],
    upgrades: ['EOTS_DUAL_OPTICS', 'GAN_AESA_CORE'],
    desc: 'Canard-delta interceptor fielding 8 ramjet Meteor missiles and 4 AMRAAMs with IRIS-T snap defense.'
  },
  'Eurofighter Ramjet Standoff Interceptor': {
    name: 'Eurofighter Ramjet Standoff Interceptor',
    specId: 'Eurofighter',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['FMRAAM', 'METEOR', 'AIM-120D-3', 'IRIS-T-LR'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS', 'SUPERCRUISE_VCE'],
    desc: 'High-speed BVR Typhoon blending FMRAAM and Meteor ramjets with F3R AMRAAMs and 62 km silent IRIS-T SLX.'
  },
  'Eurofighter Multi-Role Strike': {
    name: 'Eurofighter Multi-Role Strike',
    specId: 'Eurofighter',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'GBU-39', 'GBU-39', 'IRIS-T'],
    upgrades: ['EXPANDED_CM_DISPENSER', 'EXTENDED_RANGE_TURBO'],
    desc: 'Balanced swing-role package pairing BVR air dominance with 16 standoff bunker-buster glide bombs.'
  },
  'Rafale C Omnirole Air Defense': {
    name: 'Rafale C Omnirole Air Defense',
    specId: 'Rafale-C',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'METEOR', 'MICA-EM', 'MICA-IR', 'DEFA-554-POD'],
    upgrades: ['EOTS_DUAL_OPTICS', 'DAS_360_OPTIC'],
    desc: 'High-agility Rafale C pairing 8 ramjet Meteors with compact MICA-EM/IR rails and a 30mm DEFA revolver gunpod.'
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
  'Su-30SM Multi-Mission Interceptor': {
    name: 'Su-30SM Multi-Mission Interceptor',
    specId: 'Su-30SM',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-33S', 'RVV-AE-PD', 'R-77T', 'R-74M2', 'KHIBINY-L175'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: 'Tandem-seat Flanker-H pairing R-33S standoff, RVV-AE-PD ramjets, thermal R-77T, and Khibiny wingtip ECM.'
  },
  'J-16 Standoff Counter-Air': {
    name: 'J-16 Standoff Counter-Air',
    specId: 'J-16',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-17', 'PL-15', 'PL-15-HOJ', 'AN-ALQ-99', 'PL-10E-ER'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Heavy tandem-seat interceptor deploying 135 km PL-17, domestic PL-15, Home-On-Jam PL-15B, and ALQ-99 jamming.'
  },
  'F-14D Fleet Air Defense (CAP)': {
    name: 'F-14D Fleet Air Defense (CAP)',
    specId: 'F-14D',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2', 'AIM-9X-2'],
    upgrades: ['MADL_BATTLE_LINK', 'SUPERCRUISE_VCE'],
    desc: 'Variable-sweep carrier defender providing 98 km radar reach and BVR missile screening.'
  },
  'F-14D Outer Air Battle Fleet Defender': {
    name: 'F-14D Outer Air Battle Fleet Defender',
    specId: 'F-14D',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-54C', 'AIM-54C', 'AIM-120D-3', 'AIM-9X-B3', 'IRST-21-POD'],
    upgrades: ['MADL_BATTLE_LINK', 'SUPERCRUISE_VCE'],
    desc: 'Iconic Outer Air Battle Tomcat carrying four 108 km AIM-54C Phoenixes, F3R AMRAAMs, Block III Sidewinders, and IRST21.'
  }
};
