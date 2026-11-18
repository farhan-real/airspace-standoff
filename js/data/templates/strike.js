/**
 * js/data/templates/strike.js - Preconfigured Loadouts: Close Air Support, Fast CAS Gunships & Heavy Strike Bombers.
 */

window.TEMPLATES_STRIKE = {
  'A-10C Close Air Support (Anti-Armor)': {
    name: 'A-10C Close Air Support (Anti-Armor)',
    specId: 'A-10C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['BK-37-POD', 'CRV7-MPSM', 'AGM-65G', 'CBU-105', 'AN-AAQ-28', 'AIM-9X-2'],
    upgrades: ['TITANIUM_COCKPIT', 'KEVLAR_BELLY_ARMOR', 'CCIP_BALLISTIC_COMP'],
    desc: 'Armored titanium CAS gunship (-80% flak damage with Kevlar Belly) pairing the GAU-8 30mm Gatling and BK-37 37mm pod with CRV7 rockets and Maverick ATGMs.'
  },
  'A-10C Rocket & Cluster Suppression': {
    name: 'A-10C Rocket & Cluster Suppression',
    specId: 'A-10C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['HYDRA-70', 'ZUNI-127', 'CBU-97', 'AGM-88G', 'AN-AAQ-28', 'AIM-9X-2'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'DIRCM_IR_TURRET', 'TFR_TERRAIN_RADAR'],
    desc: 'Low-altitude AAA and SHORAD sweeper saturated with Hydra-70/Zuni rockets, Sensor Fuzed cluster bombs, and HARMs.'
  },
  'Su-25SM3 Armored Ground Attack': {
    name: 'Su-25SM3 Armored Ground Attack',
    specId: 'Su-25SM3',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-2',
    weapons: ['GSH-30-2K', 'S-24B', 'S-8KOM', 'RBK-500', 'SAPSAN-E', 'R-73'],
    upgrades: ['KEVLAR_BELLY_ARMOR', 'CCIP_BALLISTIC_COMP', 'EXPANDED_CM_DISPENSER'],
    desc: 'Transonic titanium Frogfoot (Mach 0.84) pairing twin 30mm tank-buster cannons with heavy S-24B rockets and anti-armor clusters.'
  },
  'Su-39 Heavy Armor Tankbuster': {
    name: 'Su-39 Heavy Armor Tankbuster',
    specId: 'Su-39',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-2',
    weapons: ['GSH-30-2K', 'S-25OFM', 'KH-25ML', 'RBK-500', 'SAPSAN-E'],
    upgrades: ['KEVLAR_BELLY_ARMOR', 'CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR'],
    desc: 'All-weather Mach 0.96 armored tank-buster with built-in IR jammer, twin 30mm guns, 340mm S-25OFM bunker rockets, and supersonic Kh-25ML ATGMs.'
  },
  'Su-39 Low-Level SEAD & Rocket Hunter': {
    name: 'Su-39 Low-Level SEAD & Rocket Hunter',
    specId: 'Su-39',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-2',
    weapons: ['KH-58USHKE', 'AGM-88G', 'S-13OF', 'S-8KOM', 'AN-ALQ-184', 'R-73'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'DIRCM_IR_TURRET'],
    desc: 'Low-altitude armored SEAD platform pairing anti-EMCON ARMs and ECM jamming with heavy S-13/S-8 rocket salvos.'
  },
  'AV-8B+ Harrier STOL Close Support': {
    name: 'AV-8B+ Harrier STOL Close Support',
    specId: 'AV-8B-PLUS',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-12',
    weapons: ['GAU-12-POD', 'CRV7-MPSM', 'AGM-65E', 'AN-ASQ-228', 'AIM-9X-2'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'DIRCM_IR_TURRET'],
    desc: 'Transonic STOL CAS attacker (Mach 0.98) stacking twin 25mm GAU-12 rotary cannons with Mach 2.6 CRV7 rockets and Laser Mavericks.'
  },
  'MiG-27K Supersonic Rotary Gunship': {
    name: 'MiG-27K Supersonic Rotary Gunship',
    specId: 'MiG-27K',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-6-30',
    weapons: ['GSH-6-23-POD', 'S-25OFM', 'S-24B', 'KH-29T', 'SAPSAN-E'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'KEVLAR_BELLY_ARMOR'],
    desc: 'Mach 1.42 supersonic heavy gun-and-rocket attacker built around the 6-barrel 30mm GSh-6-30 rotary cannon, 340mm S-25 rockets, and heavy Kh-29T missiles.'
  },
  'A-16A High-Speed 30mm Tankbuster': {
    name: 'A-16A High-Speed 30mm Tankbuster',
    specId: 'A-16',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-13',
    weapons: ['GPU-5A', 'CRV7-MPSM', 'AGM-179', 'CBU-105', 'AN-AAQ-33', 'AIM-9X-2'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'KEVLAR_BELLY_ARMOR'],
    desc: 'Mach 1.32 agile USAF tank-buster combining internal GAU-13 and external GPU-5/A 30mm Gatlings with CRV7 rockets, JAGM ATGMs, and CBU-105 clusters.'
  },
  'Jaguar GR.3A Supersonic Rocket Striker': {
    name: 'Jaguar GR.3A Supersonic Rocket Striker',
    specId: 'JAGUAR-GR3',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['CRV7-PG', 'CRV7-MPSM', 'BRIMSTONE-II', 'PAVEWAY-IV', 'AN-AAQ-28', 'ASRAAM'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR'],
    desc: 'Mach 1.28 low-level CAS strike fighter armed with 22 CRV7 precision and flechette rockets, Brimstone salvos, and Paveway IV bombs.'
  },
  'F-16XL Cranked-Arrow Heavy CAS': {
    name: 'F-16XL Cranked-Arrow Heavy CAS',
    specId: 'F-16XL',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-13',
    weapons: ['BK-37-POD', 'ZUNI-127', 'APKWS-II', 'CBU-105', 'GBU-31', 'AN-AAQ-33', 'AIM-9X-2'],
    upgrades: ['HEAVY_PYLON_FAIRINGS', 'CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'KEVLAR_BELLY_ARMOR'],
    desc: 'Mach 1.48 supersonic heavy CAS truck hauling 30mm/37mm tungsten cannons, 18 rockets, CBU-105 clusters, and 2,000lb BLU-109 bunker bombs.'
  },
  'Su-34 Strike Fighter': {
    name: 'Su-34 Strike Fighter',
    specId: 'Su-34',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['AGM-158B', 'AGM-88G', 'GBU-39', 'AN-ALQ-99', 'R-73'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Armored cockpit with 11 of 12 stations filled mounting stealth cruise missiles, HARMs, and radar jammers.'
  },
  'Su-34 Strategic Standoff Strike': {
    name: 'Su-34 Strategic Standoff Strike',
    specId: 'Su-34',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-2',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39', 'AIM-120D'],
    upgrades: ['TITANIUM_COCKPIT', 'SUPERCRUISE_VCE'],
    desc: 'Strategic strike loadout deploying dual stealth JASSM-ER cruise missiles and 8 glide bombs across 12 of 12 stations.'
  },
  'B-1B Low-Altitude Heavy Bombardment': {
    name: 'B-1B Low-Altitude Heavy Bombardment',
    specId: 'B-1B',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39', 'GBU-39'],
    upgrades: ['TITANIUM_COCKPIT', 'EXTENDED_RANGE_TURBO'],
    desc: 'Variable-sweep supersonic bomber utilizing 12 of 14 stations deploying 4 cruise missiles and 16 glide bombs.'
  },
  'Tu-160M Strategic Missile Carrier': {
    name: 'Tu-160M Strategic Missile Carrier',
    specId: 'Tu-160M',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KINZHAL', 'KINZHAL', 'R-37M'],
    upgrades: ['SUPERCRUISE_VCE', 'TITANIUM_COCKPIT'],
    desc: '9 HP supersonic strategic bomber with 15 of 16 stations fielding dual Mach 6.2 Kh-47M2 Kinzhal aero-ballistic bunker penetrators.'
  },
  'B-21 Long-Range Strike Bomber (LRS-B)': {
    name: 'B-21 Long-Range Strike Bomber (LRS-B)',
    specId: 'B-21',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39', 'GBU-39'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'VLO flying-wing stealth penetrator using 12 of 16 stations carrying 4 cruise missiles and 16 SDBs.'
  },
  'B-2A Global Strike Penetrator': {
    name: 'B-2A Global Strike Penetrator',
    specId: 'B-2A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-158B', 'AGM-158B', 'GBU-39', 'GBU-39', 'GBU-39'],
    upgrades: ['RAM_NANO_COATING', 'EXTENDED_RANGE_TURBO'],
    desc: 'Heavy strategic stealth flying wing using 14 of 16 stations carrying 4 cruise missiles and 24 glide bombs.'
  }
};
