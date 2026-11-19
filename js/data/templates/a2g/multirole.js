/**
 * js/data/templates/a2g/multirole.js - Extensive A2G and SEAD presets across all 20 multirole airframes.
 */

window.TEMPLATES_A2G_MULTIROLE = {
  'Mirage 2000-5 Precision Paveway & Rocket': {
    name: 'Mirage 2000-5 Precision Paveway & Rocket',
    specId: 'Mirage-2000',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['PAVEWAY-IV', 'CRV7-PG', 'APKWS-II', 'DAMOCLES-POD', 'MICA-IR'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Agile delta multirole configured with dual-mode Paveway IVs, 22 laser rockets, and Damocles targeting.'
  },
  'Mirage 2000-5 Standoff SEAD & Glide': {
    name: 'Mirage 2000-5 Standoff SEAD & Glide',
    specId: 'Mirage-2000',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['ALARM-II', 'SPEAR-3', 'DEFA-554-POD', 'AN-ALQ-184'],
    upgrades: ['SEAD_HTS_POD', 'INTERNAL_LASER_SPOT', 'DIRCM_IR_TURRET'],
    desc: 'Lightweight delta SEAD hunter pairing ALARM Mk2 ARMs with SPEAR-3 mini-cruise and a 30mm gunpod.'
  },
  'Tejas Mk2 Precision Strike & TGP': {
    name: 'Tejas Mk2 Precision Strike & TGP',
    specId: 'Tejas-MK2',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-23L',
    weapons: ['GBU-54', 'CRV7-PG', 'SPIKE-NLOS', 'AN-AAQ-28', 'ASTRA-MK1'],
    upgrades: ['INTERNAL_LASER_SPOT', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Compact canard strike multirole armed with Laser JDAMs, Spike-NLOS ATGMs, and LITENING recon.'
  },
  'Tejas Mk2 Tactical SEAD & Cluster': {
    name: 'Tejas Mk2 Tactical SEAD & Cluster',
    specId: 'Tejas-MK2',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-23L',
    weapons: ['AGM-88E', 'CBU-105', 'AN-ALQ-218-POD', 'R-73'],
    upgrades: ['SEAD_HTS_POD', 'ADAPTIVE_ECCM_SUITE', 'DIRCM_IR_TURRET'],
    desc: 'Tactical IADS suppression Tejas using ELINT receiver mapping, AARGM anti-EMCON missiles, and WCMD clusters.'
  },
  'F-16V Viper Wild Weasel SEAD': {
    name: 'F-16V Viper Wild Weasel SEAD',
    specId: 'F-16V',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88G', 'SPEAR-EW', 'AN-ALQ-218-POD', 'AN-ALQ-131'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Modernized Wild Weasel Viper combining AARGM-ER and SPEAR-EW missiles with ELINT and strike ECM pods.'
  },
  'F-16V Viper SDB-II & JAGM Strike': {
    name: 'F-16V Viper SDB-II & JAGM Strike',
    specId: 'F-16V',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-53', 'AGM-179', 'AN-AAQ-33', 'AIM-9X-2'],
    upgrades: ['TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'All-weather precision Viper carrying 8 tri-mode StormBreakers, 6 JAGM ATGMs, and Sniper XR.'
  },
  'MiG-29K Naval Laser & Rocket Assault': {
    name: 'MiG-29K Naval Laser & Rocket Assault',
    specId: 'MiG-29K',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KAB-250L', 'S-25OFM', 'S-13OF', 'SAPSAN-E', 'R-73'],
    upgrades: ['KEVLAR_BELLY_ARMOR', 'CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR'],
    desc: 'Carrier Fulcrum delivering 340mm concrete-piercing S-25OFM rockets, S-13OF pods, and KAB-250L bombs.'
  },
  'MiG-29K Anti-Radar SEAD & Cluster': {
    name: 'MiG-29K Anti-Radar SEAD & Cluster',
    specId: 'MiG-29K',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-31P', 'KH-58USHKE', 'KHIBINY-L175', 'R-73'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'High-speed SEAD Fulcrum carrying both Kh-31P ramjet and Kh-58UShKE anti-EMCON radar killers.'
  },
  'JAS-39E Gripen Precision Brimstone & SPEAR': {
    name: 'JAS-39E Gripen Precision Brimstone & SPEAR',
    specId: 'JAS-39E',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['SPEAR-3', 'BRIMSTONE-II', 'DAMOCLES-POD', 'IRIS-T'],
    upgrades: ['TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: 'Agile networked Gripen E packing SPEAR-3 mini-cruise and triple-rack Brimstone anti-armor salvos.'
  },
  'JAS-39E Gripen Networked SEAD': {
    name: 'JAS-39E Gripen Networked SEAD',
    specId: 'JAS-39E',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['SPEAR-EW', 'AGM-88G', 'AN-ALQ-218-POD', 'BRITECLOUD-POD'],
    upgrades: ['SEAD_HTS_POD', 'MADL_BATTLE_LINK', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Electronic warfare Gripen E firing SPEAR-EW and AARGM-ER salvos while projecting BriteCloud decoys.'
  },
  'F/A-18E Super Hornet SLAM-ER Strike': {
    name: 'F/A-18E Super Hornet SLAM-ER Strike',
    specId: 'F-18E',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-84H', 'AGM-154C', 'AN-ASQ-228', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Carrier standoff Super Hornet pairing SLAM-ER cruise and JSOW-C penetrators with AMRAAM self-escort.'
  },
  'F/A-18E Super Hornet Carrier SEAD & Cluster': {
    name: 'F/A-18E Super Hornet Carrier SEAD & Cluster',
    specId: 'F-18E',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88G', 'CBU-105', 'GBU-32', 'AN-ALQ-131', 'AN-ASQ-228'],
    upgrades: ['SEAD_HTS_POD', 'CCIP_BALLISTIC_COMP', 'KEVLAR_BELLY_ARMOR'],
    desc: 'Multi-mission carrier SEAD Rhino dismantling SAM belts with AARGM-ER, CBU-105 clusters, and JDAMs.'
  },
  'F-2A Viper Zero Standoff Strike & SEAD': {
    name: 'F-2A Viper Zero Standoff Strike & SEAD',
    specId: 'F-2A',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158C', 'GBU-38', 'AGM-88E', 'AN-AAQ-33', 'AAM-5B'],
    upgrades: ['MITL_DATALINK_TRANSCEIVER', 'SEAD_HTS_POD', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Composite-wing F-2A deploying 120 km LRASM stealth cruise, AARGMs, and Sniper XR precision JDAMs.'
  },
  'KF-21 Boramae Semi-Stealth Glide & SEAD': {
    name: 'KF-21 Boramae Semi-Stealth Glide & SEAD',
    specId: 'KF-21',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['SPEAR-3', 'AGM-88G', 'TAURUS', 'AN-AAQ-33'],
    upgrades: ['MITL_DATALINK_TRANSCEIVER', 'SEAD_HTS_POD', 'TFR_TERRAIN_RADAR'],
    desc: 'Semi-stealth Boramae pairing conformal AARGM-ER and SPEAR-3 rails with a 115 km Taurus bunker penetrator.'
  },
  'JF-17 Block III Anti-Radar & Glide': {
    name: 'JF-17 Block III Anti-Radar & Glide',
    specId: 'JF-17-B3',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-23L',
    weapons: ['MAR-1', 'KH-58USHKE', 'S-13OF', 'SAPSAN-E', 'PL-10'],
    upgrades: ['SEAD_HTS_POD', 'CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR'],
    desc: 'Cost-effective Thunder SEAD package carrying MAR-1 and Kh-58UShKE ARMs plus 122mm bunker rockets.'
  },
  'FA-50 Block 20 Precision Strike & Rocket': {
    name: 'FA-50 Block 20 Precision Strike & Rocket',
    specId: 'FA-50-B20',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-39', 'AGM-65G', 'APKWS-II', 'AN-AAQ-33'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Economical supersonic light strike fighter packing 8 GBU-39 SDBs, Heavy Mavericks, and guided rockets.'
  },
  'HAL Tejas Mk1A Laser Bomb & Rocket Support': {
    name: 'HAL Tejas Mk1A Laser Bomb & Rocket Support',
    specId: 'Tejas-MK1A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-23L',
    weapons: ['PAVEWAY-IV', 'CRV7-PG', 'SPIKE-NLOS', 'AN-AAQ-28', 'ASRAAM'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'INTERNAL_LASER_SPOT'],
    desc: 'Budget composite delta delivering dual-mode Paveway IV bombs, laser rockets, and 32 km Spike-NLOS.'
  },
  'JAS-39C Gripen Low-Level Brimstone & LGB': {
    name: 'JAS-39C Gripen Low-Level Brimstone & LGB',
    specId: 'JAS-39C',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['BRIMSTONE-II', 'PAVEWAY-IV', 'AN-AAQ-28', 'IRIS-T'],
    upgrades: ['TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP', 'DIRCM_IR_TURRET'],
    desc: 'Expeditionary Gripen C configured for low-altitude anti-armor Brimstone salvos and laser strikes.'
  },
  'F-16C Block 52+ Precision JDAM & Cluster': {
    name: 'F-16C Block 52+ Precision JDAM & Cluster',
    specId: 'F-16C-B52',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['CBU-105', 'GBU-32', 'AN-AAQ-28', 'AIM-9X-2'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'INTERNAL_LASER_SPOT'],
    desc: 'Classic Viper strike load pairing 4 1,000lb GBU-32 JDAMs with smart CBU-105 sensor-fuzed dispensers.'
  },
  'F/A-18C+ Hornet Carrier SEAD & Bomb': {
    name: 'F/A-18C+ Hornet Carrier SEAD & Bomb',
    specId: 'F-18C-PLUS',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88E', 'AGM-154C', 'GBU-54', 'AN-ASQ-228', 'AIM-9X-2'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Agile legacy Hornet blending anti-EMCON AARGM suppression with JSOW-C and Laser JDAM precision.'
  },
  'F/A-18F Block III Heavy LRASM & SEAD': {
    name: 'F/A-18F Block III Heavy LRASM & SEAD',
    specId: 'F-18F',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158C', 'AGM-88G', 'GBU-31', 'AN-ASQ-228', 'AN-ALQ-131'],
    upgrades: ['MITL_DATALINK_TRANSCEIVER', 'SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Twin-seat 5 HP Rhino carrying stealth LRASMs, AARGM-ERs, and 2,000lb BLU-109 bunker penetrators.'
  },
  'J-10C Vigorous Dragon Precision Strike & SEAD': {
    name: 'J-10C Vigorous Dragon Precision Strike & SEAD',
    specId: 'J-10C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-23L',
    weapons: ['KH-38ML', 'KH-58USHKE', 'S-13OF', 'SAPSAN-E', 'PL-10'],
    upgrades: ['TFR_TERRAIN_RADAR', 'SEAD_HTS_POD', 'CCIP_BALLISTIC_COMP'],
    desc: 'Agile canard-delta J-10C delivering Mach 2.4 Kh-38ML tactical strikes and anti-EMCON Kh-58UShKE.'
  },
  'Rafale M F4 Storm Shadow & Paveway': {
    name: 'Rafale M F4 Storm Shadow & Paveway',
    specId: 'Rafale-M',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['STORM-SHADOW', 'PAVEWAY-IV', 'DAMOCLES-POD', 'MICA-IR'],
    upgrades: ['TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'SEAD_HTS_POD', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Reinforced 5 HP carrier Rafale M pairing 105 km Storm Shadow penetrators with Damocles designation.'
  },
  'MiG-29SMT Guided Rocket & SEAD': {
    name: 'MiG-29SMT Guided Rocket & SEAD',
    specId: 'MiG-29SMT',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-31P', 'S-25OFM', 'S-8KOM', 'SAPSAN-E', 'KHIBINY-L175'],
    upgrades: ['SEAD_HTS_POD', 'CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR'],
    desc: 'Strike-tank Fulcrum-E hunting radars with Kh-31P ramjets before finishing batteries with S-25OFM rockets.'
  },
  'Mirage F1EQ Low-Level Rocket & Runway': {
    name: 'Mirage F1EQ Low-Level Rocket & Runway',
    specId: 'Mirage-F1EQ',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['BLU-107', 'CRV7-MPSM', 'CBU-87', 'LANTIRN-POD'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'KEVLAR_BELLY_ARMOR'],
    desc: 'Bargain supersonic swept-wing striker built for low-altitude Durandal runway cuts and cluster passes.'
  },
  'F-5EM Tiger II Light CAS & Anti-Radar': {
    name: 'F-5EM Tiger II Light CAS & Anti-Radar',
    specId: 'F-5E-TIGER',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-45B', 'SPIKE-NLOS', 'APKWS-II', 'M230-POD', 'LANTIRN-POD', 'AIM-9M'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'SEAD_HTS_POD', 'DIRCM_IR_TURRET'],
    desc: 'Tiny-RCS micro-attacker fielding Shrike ARMs, 32 km Spike-NLOS, APKWS-II rockets, and 30mm strafe pods.'
  }
};
