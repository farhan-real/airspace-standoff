/**
 * js/data/templates/stealth.js - Preconfigured Loadouts: Stealth & 5th-Gen Air Dominance.
 */

window.TEMPLATES_STEALTH = {
  'F-22A Air Superiority (OCA)': {
    name: 'F-22A Air Superiority (OCA)',
    specId: 'F-22A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-120D-3', 'METEOR', 'AIM-9X-B3'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Offensive Counter-Air sweep using 7 of 8 stations. RAM coating paired with AIM-260, F3R AMRAAM, Meteor, and extended AIM-9X Block III.'
  },
  'F-22A High-Density Micro-BVR': {
    name: 'F-22A High-Density Micro-BVR',
    specId: 'F-22A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'CUDA-SAC', 'PEREGRINE', 'AIM-9X-B3'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Deep-magazine stealth interceptor packing 18 internal BVR missiles (AIM-260, CUDA hit-to-kill, Peregrine) plus Block III Sidewinders.'
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
    weapons: ['JNAAM', 'AIM-120D-3', 'AIM-120D-3', 'PYTHON-5'],
    upgrades: ['THRUST_VECTOR', 'EOTS_DUAL_OPTICS', 'EXPANDED_CM_DISPENSER'],
    desc: 'Air superiority package exploiting 2D TVC, AESA-guided JNAAM ramjets, F3R AMRAAMs, and rear-hemisphere Python-5 defense.'
  },
  'YF-23 High-Altitude Intercept': {
    name: 'YF-23 High-Altitude Intercept',
    specId: 'YF-23',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-120D-3', 'METEOR', 'AIM-9X-B3'],
    upgrades: ['RAM_NANO_COATING', 'SUPERCRUISE_VCE'],
    desc: 'High-speed interceptor package (Mach 1.65 supercruise) using 7 of 8 stations with 0.0001m2 VLO airframe profile.'
  },
  'YF-23 Long-Range Penetration': {
    name: 'YF-23 Long-Range Penetration',
    specId: 'YF-23',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'JNAAM', 'FMRAAM', 'AIM-9X-B3'],
    upgrades: ['SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'Supercruising perimeter fighter packing internal AIM-260, JNAAM, and FMRAAM sustained ramjets across 6 internal and 1 external slot.'
  },
  'YF-23 High-Altitude Stealth Interceptor': {
    name: 'YF-23 High-Altitude Stealth Interceptor',
    specId: 'YF-23',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'M61A2',
    weapons: ['AIM-260', 'AIM-260', 'AIM-120D-3', 'AIM-9X-2'],
    upgrades: ['RAM_NANO_COATING', 'SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'High-altitude interceptor firing 8 stealth AIM-260 missiles and 4 F3R AMRAAMs above FL500 without early RWR warnings.'
  },
  'YF-23 Silent Thermal Ambush': {
    name: 'YF-23 Silent Thermal Ambush',
    specId: 'YF-23',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'M61A2',
    weapons: ['IRIS-T-LR', 'PEREGRINE', 'AIM-9X-B3', 'AN-ALQ-165'],
    upgrades: ['RAM_NANO_COATING', 'SUPERCRUISE_VCE', 'EOTS_DUAL_OPTICS'],
    desc: 'Pure internal-bay silent stealth ambush (0.45x IR bloom) using 62 km IRIS-T SLX, Peregrine, Block III Sidewinders, and internal ASPJ.'
  },
  'F-35A Strike Fighter (JSF)': {
    name: 'F-35A Strike Fighter (JSF)',
    specId: 'F-35A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GAU-22',
    weapons: ['AIM-260', 'AIM-120D-3', 'AIM-9X-B3', 'AN-ALQ-165'],
    upgrades: ['EOTS_DUAL_OPTICS', 'DAS_360_OPTIC', 'MADL_BATTLE_LINK'],
    desc: 'Sensor fusion suite pairing APG-81 clutter filtering with internal AIM-260, internal ASPJ jamming, F3R AMRAAMs, and Block III Sidewinders.'
  },
  'F-35A Beast-Mode Air Dominance': {
    name: 'F-35A Beast-Mode Air Dominance',
    specId: 'F-35A',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GAU-22',
    weapons: ['AIM-260', 'AIM-9X-B3', 'AN-ALQ-165', 'FMRAAM', 'AIM-120D-3'],
    upgrades: ['RAM_NANO_COATING', 'EOTS_DUAL_OPTICS', 'DAS_360_OPTIC', 'MADL_BATTLE_LINK'],
    desc: 'Full 8-slot air dominance Lightning II stacking internal AIM-260 and ASPJ with external FMRAAM ramjets and F3R AMRAAMs.'
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
    weapons: ['R-37M', 'R-77M', 'R-74M2', 'ADM-160B'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE'],
    desc: 'Long-range air superiority package pairing external hypersonic R-37M with internal R-77M, R-74M2, and MALD decoy drones.'
  },
  'Su-57 Close Combat Maneuver': {
    name: 'Su-57 Close Combat Maneuver',
    specId: 'Su-57',
    roleCategory: 'DOGFIGHT',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-77M', 'R-77T', 'R-74M2', 'PYTHON-5'],
    upgrades: ['THRUST_VECTOR', 'EOTS_DUAL_OPTICS', 'TITANIUM_COCKPIT'],
    desc: '3D all-axis TVC setup combining internal R-77M and thermal R-77T BVR missiles with R-74M2 and rearward Python-5 defense.'
  },
  'Su-57 Multi-Tier BVR Sweeper': {
    name: 'Su-57 Multi-Tier BVR Sweeper',
    specId: 'Su-57',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-37M', 'RVV-AE-PD', 'R-77M', 'R-74M2'],
    upgrades: ['THRUST_VECTOR', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Multi-layer BVR interceptor blending Mach 5.8 R-37M shots with internal RVV-AE-PD ramjets and R-77M dual-pulse missiles.'
  },
  'J-20 Long-Range Intercept': {
    name: 'J-20 Long-Range Intercept',
    specId: 'J-20',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-21', 'PL-15', 'PL-15E', 'PL-10'],
    upgrades: ['SUPERCRUISE_VCE', 'GAN_AESA_CORE'],
    desc: 'Canard-delta heavy interceptor mounting external 130 km PL-21 ramjets alongside internal PL-15, PL-15E, and PL-10 defense.'
  },
  'J-20 Long-Range Air Defense Interceptor': {
    name: 'J-20 Long-Range Air Defense Interceptor',
    specId: 'J-20',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-30-1',
    weapons: ['PL-17', 'PL-15', 'PL-15-HOJ', 'PL-10E-ER'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Perimeter denial package fielding 135 km PL-17 standoff missiles, domestic PL-15, Home-On-Jam PL-15B, and extended PL-10E.'
  },
  'J-20 Maritime & Strike Interdiction': {
    name: 'J-20 Maritime & Strike Interdiction',
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
    weapons: ['R-77M', 'R-77T', 'R-74M2'],
    upgrades: ['RAM_NANO_COATING', 'THRUST_VECTOR'],
    desc: 'Cost-effective 5th-Gen interceptor pairing internal dual-pulse R-77M and silent thermal R-77T with external R-74M2.'
  },
  'FC-31 Naval Air Defense': {
    name: 'FC-31 Naval Air Defense',
    specId: 'FC-31',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-15', 'PL-12', 'PL-10', 'SADM-8'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Carrier-borne multirole airframe blending internal PL-15 and PL-12 BVR rails with PL-10 and 8x SADM anti-swarm micro-missiles.'
  },
  'J-35 Carrier Air Wing OCA': {
    name: 'J-35 Carrier Air Wing OCA',
    specId: 'J-35',
    roleCategory: 'AIR DOMINANCE',
    chosenGunId: 'GSH-23L',
    weapons: ['PL-15', 'PL-15-HOJ', 'PL-10E-ER', 'AN-ALQ-165'],
    upgrades: ['GAN_AESA_CORE', 'SUPERCRUISE_VCE'],
    desc: 'Naval fleet defense package featuring AESA radar, domestic PL-15, counter-jamming PL-15B HOJ, and internal ASPJ protection.'
  }
};
