/**
 * js/data/templates/a2g/stealth.js - Extensive A2G and SEAD presets for 5th-gen and 6th-gen stealth airframes.
 */

window.TEMPLATES_A2G_STEALTH = {
  'F-22A Stealth StormBreaker & SEAD': {
    name: 'F-22A Stealth StormBreaker & SEAD',
    specId: 'F-22A',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GAU-22',
    weapons: ['GBU-53', 'AGM-88G', 'AIM-260'],
    upgrades: ['RAM_NANO_COATING', 'SEAD_HTS_POD', 'INTERNAL_LASER_SPOT'],
    desc: 'Clean internal-bay Raptor pairing 8 tri-mode StormBreakers with AARGM-ER radar hunters and AIM-260 defense.'
  },
  'F-22A Internal JSOW-C Penetrator': {
    name: 'F-22A Internal JSOW-C Penetrator',
    specId: 'F-22A',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-154C', 'GBU-38', 'AIM-120D'],
    upgrades: ['RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR'],
    desc: 'VLO supercruising bunker striker deploying BROACH JSOW-C glide penetrators and JDAMs from closed bays.'
  },
  'YF-23 Black Widow Stealth Glide Strike': {
    name: 'YF-23 Black Widow Stealth Glide Strike',
    specId: 'YF-23',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['GBU-39', 'AGM-154C', 'AIM-260'],
    upgrades: ['RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: 'Mach 1.65 supercruise VLO stealth bomber releasing standoff SDBs and JSOW-C from high altitude.'
  },
  'YF-23 Black Widow Stealth SEAD Escort': {
    name: 'YF-23 Black Widow Stealth SEAD Escort',
    specId: 'YF-23',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['SPEAR-EW', 'SPEAR-3', 'AIM-260', 'AN-ALQ-165'],
    upgrades: ['SEAD_HTS_POD', 'RAM_NANO_COATING', 'SUPERCRUISE_VCE'],
    desc: 'High-speed stealth SEAD hunter deploying SPEAR-EW radar killers, SPEAR-3 mini-cruise, and internal ASPJ.'
  },
  'F-35A Beast-Mode Heavy Strike': {
    name: 'F-35A Beast-Mode Heavy Strike',
    specId: 'F-35A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-154C', 'GBU-53', 'GBU-24', 'AN-ALQ-218-POD'],
    upgrades: ['INTERNAL_LASER_SPOT', 'HEAVY_PYLON_FAIRINGS', 'MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR'],
    desc: 'Loaded JSF pairing internal JSOW-C and StormBreakers with an external 2,000lb GBU-24 and ELINT pod.'
  },
  'F-35A Stealth DEAD & AARGM-ER': {
    name: 'F-35A Stealth DEAD & AARGM-ER',
    specId: 'F-35A',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-88G', 'SPEAR-EW', 'AN-AAQ-33', 'AIM-9X-2'],
    upgrades: ['SEAD_HTS_POD', 'RAM_NANO_COATING', 'EOTS_DUAL_OPTICS', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Dedicated Destruction of Enemy Air Defenses Lightning II hunting EMCON SAMs and exposing ground decoys.'
  },
  'F-35B STOVL Forward Precision Strike': {
    name: 'F-35B STOVL Forward Precision Strike',
    specId: 'F-35B',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['SPEAR-3', 'GBU-54', 'APKWS-II', 'AN-ASQ-228', 'AIM-9X-2'],
    upgrades: ['INTERNAL_LASER_SPOT', 'TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP', 'DIRCM_IR_TURRET'],
    desc: 'Expeditionary STOVL JSF configured for tactical precision strikes with SPEAR-3, Laser JDAMs, and APKWS-II.'
  },
  'F-35C Carrier LRASM & Bunker Strike': {
    name: 'F-35C Carrier LRASM & Bunker Strike',
    specId: 'F-35C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-154C', 'GBU-53', 'AGM-158C', 'AGM-88G', 'AIM-9X-2'],
    upgrades: ['MITL_DATALINK_TRANSCEIVER', 'SEAD_HTS_POD', 'HEAVY_PYLON_FAIRINGS', 'RAM_NANO_COATING'],
    desc: 'Heavy 5 HP Carrier Lightning II hauling internal JSOW-C and SDB-IIs backed by external LRASM and AARGM-ER.'
  },
  'F-22A+ Super Raptor Deep SEAD & Strike': {
    name: 'F-22A+ Super Raptor Deep SEAD & Strike',
    specId: 'F-22-SUPER',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-154C', 'GBU-53', 'AGM-88G', 'AIM-260'],
    upgrades: ['RAM_NANO_COATING', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: 'Upgraded Super Raptor carrying internal JSOW-C, StormBreakers, and AARGM-ERs with DE-Pulse point defense.'
  },
  'Su-57 Felon Stealth Cruise Strike': {
    name: 'Su-57 Felon Stealth Cruise Strike',
    specId: 'Su-57',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-59MK2', 'R-74M2', 'KH-58USHKE', 'SAPSAN-E'],
    upgrades: ['RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR'],
    desc: '5th-gen Felon pairing internal Kh-59MK2 stealth cruise missiles with Kh-58UShKE ARMs and Sapsan-E optics.'
  },
  'Su-57 Felon Internal SEAD & Assault': {
    name: 'Su-57 Felon Internal SEAD & Assault',
    specId: 'Su-57',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-58USHKE', 'KAB-250L', 'R-74M2', 'KH-38ML', 'KHIBINY-L175'],
    upgrades: ['SEAD_HTS_POD', 'INTERNAL_LASER_SPOT', 'RAM_NANO_COATING'],
    desc: 'Aggressive Felon SEAD loadout blending internal ARMs and laser bombs with Mach 2.4 Kh-38ML strikes.'
  },
  'J-20 Stealth SEAD & Standoff Strike': {
    name: 'J-20 Stealth SEAD & Standoff Strike',
    specId: 'J-20',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-58USHKE', 'KAB-250L', 'PL-10', 'KH-59MK2', 'SAPSAN-E'],
    upgrades: ['SEAD_HTS_POD', 'RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR'],
    desc: 'Long-range Mighty Dragon penetrating IADS perimeters with anti-EMCON ARMs and stealth standoff missiles.'
  },
  'J-20B WS-15 Stealth Penetrator': {
    name: 'J-20B WS-15 Stealth Penetrator',
    specId: 'J-20B',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-59MK2', 'PL-10', 'AGM-88G', 'SAPSAN-E'],
    upgrades: ['RAM_NANO_COATING', 'SUPERCRUISE_VCE', 'INTERNAL_LASER_SPOT', 'SEAD_HTS_POD'],
    desc: 'Supercruising WS-15 J-20B configured for high-speed stealth interdiction and SAM suppression.'
  },
  'J-20S Twin-Seat Stealth Strike Coordinator': {
    name: 'J-20S Twin-Seat Stealth Strike Coordinator',
    specId: 'J-20S',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['SOM-J', 'GBU-53', 'KH-38ML', 'AN-ALQ-218-POD'],
    upgrades: ['MITL_DATALINK_TRANSCEIVER', 'SEAD_HTS_POD', 'INTERNAL_LASER_SPOT', 'MADL_BATTLE_LINK'],
    desc: 'Twin-crew stealth coordinator launching internal SOM-J cruise salvos and StormBreakers with ELINT recon.'
  },
  'Su-75 Checkmate Stealth Precision Strike': {
    name: 'Su-75 Checkmate Stealth Precision Strike',
    specId: 'Su-75',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KAB-250L', 'KH-58USHKE', 'R-74M2', 'SAPSAN-E'],
    upgrades: ['RAM_NANO_COATING', 'INTERNAL_LASER_SPOT', 'TFR_TERRAIN_RADAR'],
    desc: 'Economical single-engine stealth striker with internal KAB-250L laser bombs and Kh-58UShKE radar killers.'
  },
  'FC-31 Gyrfalcon Stealth Glide Strike': {
    name: 'FC-31 Gyrfalcon Stealth Glide Strike',
    specId: 'FC-31',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-23L',
    weapons: ['SOM-J', 'KAB-250L', 'PL-10', 'KH-25ML', 'SAPSAN-E'],
    upgrades: ['RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: 'Naval medium stealth strike fighter pairing internal SOM-J cruise saturation with laser ATGMs.'
  },
  'J-35 Carrier Stealth SEAD & Strike': {
    name: 'J-35 Carrier Stealth SEAD & Strike',
    specId: 'J-35',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-23L',
    weapons: ['SOM-J', 'KAB-250L', 'PL-10', 'KH-58USHKE', 'SAPSAN-E'],
    upgrades: ['RAM_NANO_COATING', 'SEAD_HTS_POD', 'INTERNAL_LASER_SPOT'],
    desc: 'Carrier stealth multirole deploying 4 internal SOM-J stealth cruise missiles and anti-EMCON ARMs.'
  },
  'TAI TF Kaan Stealth SOM-J Penetrator': {
    name: 'TAI TF Kaan Stealth SOM-J Penetrator',
    specId: 'KAAN',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['SOM-J', 'SPEAR-3', 'AGM-88G', 'AN-AAQ-33'],
    upgrades: ['RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: 'Twin-engine 5th-gen Kaan fielding internal SOM-J stealth cruise and SPEAR-3 precision mini-cruise missiles.'
  },
  'KF-21EX Stealth SEAD & SDB Strike': {
    name: 'KF-21EX Stealth SEAD & SDB Strike',
    specId: 'KF-21EX',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88G', 'GBU-53', 'AN-AAQ-33', 'TALD-DECOY'],
    upgrades: ['SEAD_HTS_POD', 'RAM_NANO_COATING', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Block III stealth Boramae pairing internal AARGM-ERs and SDB-IIs with ITALD SAM-baiting gliders.'
  },
  'HAL AMCA Mk1 Stealth Laser & SEAD': {
    name: 'HAL AMCA Mk1 Stealth Laser & SEAD',
    specId: 'AMCA-MK1',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-23L',
    weapons: ['SPEAR-3', 'PAVEWAY-IV', 'AGM-88G', 'AN-AAQ-28'],
    upgrades: ['RAM_NANO_COATING', 'INTERNAL_LASER_SPOT', 'SEAD_HTS_POD'],
    desc: 'Agile 5th-gen AMCA combining internal SPEAR-3 and Paveway IV precision strikes with external AARGM-ERs.'
  },
  'GCAP Tempest Stealth SPEAR & Storm Shadow': {
    name: 'GCAP Tempest Stealth SPEAR & Storm Shadow',
    specId: 'TEMPEST',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['SPEAR-3', 'SPEAR-EW', 'AGM-154C', 'AN-AAQ-33'],
    upgrades: ['RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'SEAD_HTS_POD', 'INTERNAL_LASER_SPOT'],
    desc: '6th-gen Tempest carrying full 6-slot internal SPEAR-3, SPEAR-EW, and JSOW-C standoff strike munitions.'
  },
  'FCAS NGF Stealth Precision Penetrator': {
    name: 'FCAS NGF Stealth Precision Penetrator',
    specId: 'FCAS-NGF',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-154C', 'SPEAR-3', 'SPEAR-EW', 'DAMOCLES-POD'],
    upgrades: ['RAM_NANO_COATING', 'INTERNAL_LASER_SPOT', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Tailless 6th-gen NGF combining 0.0001m2 stealth with internal BROACH penetrators and SEAD drones.'
  },
  'J-36 Heavy 6th-Gen Bunker & Cruise': {
    name: 'J-36 Heavy 6th-Gen Bunker & Cruise',
    specId: 'J-36',
    roleCategory: 'STRIKE',
    chosenGunId: 'PLSL_MED',
    weapons: ['AGM-158C', 'KH-59MK2', 'KH-58USHKE', 'AN-AAQ-33'],
    upgrades: ['RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'SEAD_HTS_POD', 'INTERNAL_LASER_SPOT'],
    desc: 'Tri-jet 8-slot internal stealth cruiser launching LRASM, Kh-59MK2, and Kh-58UShKE strikes from supercruise.'
  },
  'J-50 Tailless Stealth Strike & SEAD': {
    name: 'J-50 Tailless Stealth Strike & SEAD',
    specId: 'J-50',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['SOM-J', 'KH-58USHKE', 'GBU-53', 'SAPSAN-E'],
    upgrades: ['RAM_NANO_COATING', 'SEAD_HTS_POD', 'INTERNAL_LASER_SPOT'],
    desc: 'Lambdoid 6-slot stealth striker packing SOM-J cruise missiles, StormBreakers, and internal SEAD ARMs.'
  }
};
