/**
 * AIRSPACE STANDOFF: Preconfigured Loadouts: Air Superiority Interceptors
 */

window.TEMPLATES_SUPERIORITY = {
  'MiG-31BM Long-Range Intercept': {
    name: 'MiG-31BM Long-Range Intercept',
    specId: 'MiG-31BM',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-37M', 'PL-21', 'AIM-120D'],
    upgrades: ['SUPERCRUISE_VCE', 'ESM_PASSIVE_SUITE'],
    desc: 'Stratospheric intercept profile (Mach 1.88 sprint / Mach 2.83 dash) deploying hypersonic R-37M Axeheads from high altitude.'
  },
  'MiG-31BM Aero-Ballistic Strike': {
    name: 'MiG-31BM Aero-Ballistic Strike',
    specId: 'MiG-31BM',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KINZHAL', 'AIM-120D'],
    upgrades: ['EXTENDED_RANGE_TURBO', 'TITANIUM_COCKPIT'],
    desc: 'Heavy strategic strike configuration armed with the Mach 5.0 Kh-47M2 Kinzhal aero-ballistic bunker penetrator (8 of 8 slots exact).'
  },
  'F-15EX Heavy Air Superiority (CAP)': {
    name: 'F-15EX Heavy Air Superiority (CAP)',
    specId: 'F-15EX',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-260', 'AIM-120D', 'AIM-120D', 'METEOR', 'AIM-9X-2', 'AIM-9X-2'],
    upgrades: ['MADL_BATTLE_LINK', 'GAN_AESA_CORE'],
    desc: 'Heavy Combat Air Patrol missile truck utilizing 12 of 14 rails to deploy 24 air-to-air missiles with 2 stations clean for low-drag dash.'
  },
  'F-15EX Standoff Interdiction & SEAD': {
    name: 'F-15EX Standoff Interdiction & SEAD',
    specId: 'F-15EX',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'AGM-88G', 'GBU-39', 'AIM-120D', 'AN-ALQ-184', 'AIM-9X-2', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Heavy strike escort package utilizing 13 of 14 stations (~8,070 kg) combining stealth cruise missiles, anti-radiation HARMs, and SDB glide bombs.'
  },
  'F-15EX Hypersonic Theater Strike': {
    name: 'F-15EX Hypersonic Theater Strike',
    specId: 'F-15EX',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['KINZHAL', 'AGM-158B', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Extreme standoff strike configuration taking advantage of Type X pylons to deploy the Mach 5.0 Kh-47M2 Kinzhal (~93% payload).'
  },
  'Su-35S Tactical Air Superiority': {
    name: 'Su-35S Tactical Air Superiority',
    specId: 'Su-35S',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'PL-15E', 'R-73', 'PYTHON-5', 'AN-ALQ-99'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: '3D all-axis thrust vectoring using 8 of 10 stations (~4,400 kg) pairing post-stall pitch authority with active jamming and Archer IR missiles.'
  },
  'Su-35S BVR Intercept': {
    name: 'Su-35S BVR Intercept',
    specId: 'Su-35S',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-37M', 'PL-15E', 'PL-15E', 'AIM-120D'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE'],
    desc: 'Deep beyond-visual-range loadout using 9 of 10 stations pairing hypersonic R-37M missiles with dual-pulse PL-15E volleys.'
  },
  'Su-35S Apex Gun Dogfighter': {
    name: 'Su-35S Apex Gun Dogfighter',
    specId: 'Su-35S',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['SPPU-22', 'SPPU-22', 'R-73', 'R-73', 'PYTHON-5', 'PL-15E', 'AN-ALQ-184'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT', 'EOTS_DUAL_OPTICS'],
    desc: 'Close merge predator using 8 of 10 stations mounting dual 23mm gunpods (7.3 HP/s burst), snap-turns, and rearward Python-5s.'
  },
  'Eurofighter Air Dominance Sweep': {
    name: 'Eurofighter Air Dominance Sweep',
    specId: 'Eurofighter',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'METEOR', 'AIM-120D', 'IRIS-T'],
    upgrades: ['EOTS_DUAL_OPTICS', 'GAN_AESA_CORE'],
    desc: 'Canard-delta interceptor utilizing 7 of 8 stations fielding 8 ramjet Meteor missiles and 4 AMRAAMs with IRIS-T snap defense.'
  },
  'Eurofighter Ramjet Standoff Interceptor': {
    name: 'Eurofighter Ramjet Standoff Interceptor',
    specId: 'Eurofighter',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'METEOR', 'AIM-120D', 'IRIS-T'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS', 'SUPERCRUISE_VCE'],
    desc: 'Pure ramjet BVR sniper utilizing 7 of 8 stations (~3,800 kg) to launch zero-drag-decay Meteors from Mach 1.38 supercruise.'
  },
  'Eurofighter Multi-Role Strike': {
    name: 'Eurofighter Multi-Role Strike',
    specId: 'Eurofighter',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'GBU-39', 'GBU-39', 'IRIS-T'],
    upgrades: ['EXPANDED_CM_DISPENSER', 'EXTENDED_RANGE_TURBO'],
    desc: 'Balanced swing-role package using 7 of 8 stations pairing BVR air dominance with 16 standoff bunker-buster glide bombs.'
  },
  'Rafale C Omnirole Air Defense': {
    name: 'Rafale C Omnirole Air Defense',
    specId: 'Rafale-C',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'METEOR', 'AIM-120D', 'PYTHON-5'],
    upgrades: ['EOTS_DUAL_OPTICS', 'DAS_360_OPTIC'],
    desc: 'Extreme turn agility fighter using 7 of 8 stations combined with automated SPECTRA electronic protection and ramjet Meteor rails.'
  },
  'Rafale C Deep Strike Interdiction': {
    name: 'Rafale C Deep Strike Interdiction',
    specId: 'Rafale-C',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['AGM-158B', 'METEOR', 'PYTHON-5'],
    upgrades: ['TITANIUM_COCKPIT', 'ESM_PASSIVE_SUITE'],
    desc: 'Long-range strike configuration mounting low-observable cruise missiles and passive ESM sensors across 7 of 8 stations.'
  },
  'Su-30SM Multi-Mission Interceptor': {
    name: 'Su-30SM Multi-Mission Interceptor',
    specId: 'Su-30SM',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-15E', 'PL-15E', 'AIM-120D', 'R-73', 'AN-ALQ-99'],
    upgrades: ['THRUST_VECTOR', 'TITANIUM_COCKPIT'],
    desc: 'Tandem-seat multirole interceptor using 9 of 10 stations with canards and thrust vectoring for high-AoA flight regimes.'
  },
  'J-16 Standoff Counter-Air': {
    name: 'J-16 Standoff Counter-Air',
    specId: 'J-16',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-21', 'PL-15E', 'PL-15E', 'AN-ALQ-99', 'R-73'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Heavy tandem-seat interceptor utilizing 10 of 12 stations (~4,350 kg) to deploy extreme standoff PL-21 ramjets and dual-pulse rockets.'
  },
  'F-14D Fleet Air Defense (CAP)': {
    name: 'F-14D Fleet Air Defense (CAP)',
    specId: 'F-14D',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'AIM-9X-2', 'AIM-9X-2'],
    upgrades: ['MADL_BATTLE_LINK', 'SUPERCRUISE_VCE'],
    desc: 'Variable-sweep carrier defender using 6 of 10 stations providing 98km radar reach and BVR missile screening.'
  },
  'F-14D Outer Air Battle Fleet Defender': {
    name: 'F-14D Outer Air Battle Fleet Defender',
    specId: 'F-14D',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-120D', 'AIM-120D', 'METEOR', 'ALE-55'],
    upgrades: ['MADL_BATTLE_LINK', 'SUPERCRUISE_VCE'],
    desc: 'Classic naval perimeter defense using 8 of 10 stations (~3,520 kg • 38% NORMAL) deploying 16 BVR missiles and towed decoys.'
  }
};