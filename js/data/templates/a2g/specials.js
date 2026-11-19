/**
 * js/data/templates/a2g/specials.js - A2G and SEAD presets for EW escorts, UCAVs, experimentals, and COFFIN jets.
 */

window.TEMPLATES_A2G_SPECIALS = {
  'Su-24MP Fencer-F Jammer & SEAD': {
    name: 'Su-24MP Fencer-F Jammer & SEAD',
    specId: 'Su-24MP',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-23L',
    weapons: ['KH-58USHKE', 'KH-31P', 'SAPSAN-E', 'KHIBINY-L175', 'R-73'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'ADAPTIVE_ECCM_SUITE', 'DIRCM_IR_TURRET'],
    desc: 'Dedicated electronic-warfare Fencer combining 45% innate jamming with dual-type ARM radar suppression.'
  },
  'J-15D Carrier Growler SEAD & Strike': {
    name: 'J-15D Carrier Growler SEAD & Strike',
    specId: 'J-15D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['SAP-14-POD', 'KH-58USHKE', 'KH-38ML', 'SAPSAN-E', 'PL-10'],
    upgrades: ['SEAD_HTS_POD', 'ADAPTIVE_ECCM_SUITE', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Naval carrier EW escort projecting Tarantul jamming while hunting SAM sites with Kh-58UShKE and Kh-38ML.'
  },
  'EA-18G Growler DEAD & JSOW-C Strike': {
    name: 'EA-18G Growler DEAD & JSOW-C Strike',
    specId: 'EA-18G',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AN-ALQ-249', 'AGM-88G', 'AGM-154C', 'AN-ASQ-228'],
    upgrades: ['SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Carrier DEAD Growler pairing NGJ AESA jamming with AARGM-ER radar hunters and 78 km JSOW-C penetrators.'
  },
  'J-16D EW Striker Stealth Cruise & SEAD': {
    name: 'J-16D EW Striker Stealth Cruise & SEAD',
    specId: 'J-16D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['SAP-14-POD', 'KH-59MK2', 'KH-58USHKE', 'SAPSAN-E'],
    upgrades: ['SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Heavy standoff EW escort launching Kh-59MK2 stealth cruise strikes from beneath a 115 km jamming shield.'
  },
  'Tornado ECR Wild Weasel & Cluster': {
    name: 'Tornado ECR Wild Weasel & Cluster',
    specId: 'Tornado-ECR',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['ALARM-II', 'CBU-97', 'AN-ALQ-131', 'AN-AAQ-28'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'DIRCM_IR_TURRET'],
    desc: 'Low-level European Weasel hunting EMCON SAMs with ALARM Mk2s and finishing sites with Skeet clusters.'
  },
  'EA-36 Barricader Heavy DEAD & LRASM': {
    name: 'EA-36 Barricader Heavy DEAD & LRASM',
    specId: 'EA-36',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-88G', 'GBU-53', 'AN-ALQ-249', 'AGM-158C', 'TALD-DECOY'],
    upgrades: ['SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Flagship EW cruiser blending 60% NGJ jamming, ITALD SAM decoys, internal AARGM-ERs, and LRASM.'
  },
  'Akinci UCAV Loitering & ATGM': {
    name: 'Akinci UCAV Loitering & ATGM',
    specId: 'AKINCI',
    roleCategory: 'STRIKE',
    chosenGunId: 'MICRO_GUN',
    weapons: ['SPIKE-NLOS', 'SWITCHBLADE-600', 'APKWS-II', 'AN-AAQ-28'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'DIRCM_IR_TURRET', 'RTB_HOMING_BEACON'],
    desc: 'Low-heat endurance UCAV stalking SAM belts with Spike-NLOS, Switchblade 600s, and 12 laser rockets.'
  },
  'Akinci UCAV SEAD & Light Glide': {
    name: 'Akinci UCAV SEAD & Light Glide',
    specId: 'AKINCI',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'MICRO_GUN',
    weapons: ['SPEAR-EW', 'SPEAR-3', 'SPIKE-NLOS'],
    upgrades: ['INTERNAL_LASER_SPOT', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Autonomous standoff UCAV deploying SPEAR-EW radar hunters and 62 km SPEAR-3 mini-cruise missiles.'
  },
  'MQ-20 Avenger Stealth Bunker & SDB': {
    name: 'MQ-20 Avenger Stealth Bunker & SDB',
    specId: 'MQ-20',
    roleCategory: 'STRIKE',
    chosenGunId: 'MICRO_GUN',
    weapons: ['GBU-53', 'AGM-154C', 'AN-AAQ-28'],
    upgrades: ['RAM_NANO_COATING', 'SWARM_AI_COPROCESSOR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: '0.008m2 VLO jet UCAV delivering internal StormBreakers and 78 km JSOW-C BROACH penetrators.'
  },
  'MQ-20 Avenger Stealth SEAD Hunter': {
    name: 'MQ-20 Avenger Stealth SEAD Hunter',
    specId: 'MQ-20',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'MICRO_GUN',
    weapons: ['SPEAR-EW', 'SPEAR-3', 'MAR-1', 'SWITCHBLADE-600'],
    upgrades: ['SEAD_HTS_POD', 'SWARM_AI_COPROCESSOR', 'RAM_NANO_COATING'],
    desc: 'Stealth unmanned SEAD striker swarming emitters with SPEAR-EW, MAR-1 ARMs, and Switchblade 600s.'
  },
  'XQ-58A Valkyrie Stealth SDB Wingman': {
    name: 'XQ-58A Valkyrie Stealth SDB Wingman',
    specId: 'XQ-58A',
    roleCategory: 'STRIKE',
    chosenGunId: 'MICRO_GUN',
    weapons: ['SPEAR-3', 'SPIKE-NLOS', 'SWITCHBLADE-600'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'INTERNAL_LASER_SPOT'],
    desc: 'Low-cost stealth strike wingman carrying SPEAR-3, 32 km Spike-NLOS, and loitering anti-armor drones.'
  },
  'Kizilelma Supersonic SEAD & Strike': {
    name: 'Kizilelma Supersonic SEAD & Strike',
    specId: 'Kizilelma',
    roleCategory: 'STRIKE',
    chosenGunId: 'MICRO_GUN',
    weapons: ['SPEAR-EW', 'MAR-1', 'SPIKE-NLOS'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'SEAD_HTS_POD', 'RAM_NANO_COATING'],
    desc: 'Supersonic 16G unmanned striker combining internal SPEAR-EW radar hunting with MAR-1 and Spike-NLOS.'
  },
  'S-70 Okhotnik Heavy SEAD & Glide': {
    name: 'S-70 Okhotnik Heavy SEAD & Glide',
    specId: 'S-70',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-58USHKE', 'GBU-53', 'SAPSAN-E'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'SEAD_HTS_POD', 'RAM_NANO_COATING'],
    desc: '20-ton flying-wing UCAV pairing internal Kh-58UShKE ARMs and StormBreaker SDBs with Sapsan-E optics.'
  },
  'F-15 S/MTD Agile Bunker & SEAD': {
    name: 'F-15 S/MTD Agile Bunker & SEAD',
    specId: 'F-15-SMTD',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-24', 'AGM-88G', 'CBU-105', 'AN-AAQ-33', 'AIM-9X-2'],
    upgrades: ['TFR_TERRAIN_RADAR', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'CCIP_BALLISTIC_COMP'],
    desc: '2D TVC Eagle demonstrator combining high-agility evasion with GBU-24 penetrators, AARGM-ER, and CBU-105.'
  },
  'Su-47 Berkut High-AoA SEAD & Strike': {
    name: 'Su-47 Berkut High-AoA SEAD & Strike',
    specId: 'Su-47',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-58USHKE', 'KH-59MK2', 'KH-38ML', 'SAPSAN-E'],
    upgrades: ['TFR_TERRAIN_RADAR', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Forward-swept Berkut firing internal Kh-58UShKE ARMs and Kh-59MK2 stealth cruise missiles.'
  },
  'Su-37 Terminator Low-Level SEAD & Laser': {
    name: 'Su-37 Terminator Low-Level SEAD & Laser',
    specId: 'Su-37',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KAB-1500L', 'KH-31P', 'S-25OFM', 'SAPSAN-E'],
    upgrades: ['TFR_TERRAIN_RADAR', 'SEAD_HTS_POD', 'CCIP_BALLISTIC_COMP'],
    desc: '3D TVC Flanker delivering 1,500kg concrete bunker bombs, Kh-31P ramjets, and 340mm laser rockets.'
  },
  'F-15 S/MT [COFFIN] Heavy Bunker & SEAD': {
    name: 'F-15 S/MT [COFFIN] Heavy Bunker & SEAD',
    specId: 'F-15-SMT-COFFIN',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-28', 'AGM-158C', 'AGM-88G', 'AN-AAQ-33'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'TFR_TERRAIN_RADAR', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER'],
    desc: '16G COFFIN strike Eagle carrying 5,000lb GBU-28 bunker busters, LRASM cruise, and AARGM-ERs.'
  },
  'Su-37 [COFFIN] Deep SEAD & Kh-59MK2': {
    name: 'Su-37 [COFFIN] Deep SEAD & Kh-59MK2',
    specId: 'Su-37-COFFIN',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-59MK2', 'KH-58USHKE', 'KH-38ML', 'SAPSAN-E', 'R-74M2'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Zero-G-LOC 16G Flanker penetrating dense IADS corridors with Kh-59MK2, Kh-58UShKE, and Kh-38ML.'
  },
  'F-22C [COFFIN] Stealth SDB & AARGM-ER': {
    name: 'F-22C [COFFIN] Stealth SDB & AARGM-ER',
    specId: 'F-22C-COFFIN',
    roleCategory: 'STRIKE',
    chosenGunId: 'DE-PULSE',
    weapons: ['AGM-154C', 'GBU-53', 'SPEAR-EW', 'AN-AAQ-33'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'RAM_NANO_COATING', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER'],
    desc: '0.00005m2 COFFIN Raptor II combining internal JSOW-C, StormBreakers, and compact SPEAR-EW radar hunting.'
  },
  'ADF-11F Raven SEAD & StormBreaker': {
    name: 'ADF-11F Raven SEAD & StormBreaker',
    specId: 'ADF-11F',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'PLSL_HEAVY',
    weapons: ['AGM-88G', 'GBU-53', 'AGM-158C', 'AN-AAQ-33'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'ZOE_NEURAL_PROCESSOR'],
    desc: '20G COFFIN Raven deploying internal AARGM-ER and SDB-IIs alongside LRASM standoff strikes.'
  },
  'X-02S Wyvern Stealth DEAD & SDB-II': {
    name: 'X-02S Wyvern Stealth DEAD & SDB-II',
    specId: 'X-02S',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88G', 'GBU-53', 'SPEAR-3', 'AN-AAQ-33'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: 'Variable-geometry stealth Wyvern suppressing SAM networks with AARGM-ER, StormBreakers, and SPEAR-3.'
  },
  'ADFX-01 Morgan Standoff Bunker & SEAD': {
    name: 'ADFX-01 Morgan Standoff Bunker & SEAD',
    specId: 'ADFX-01',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['SPEAR-3', 'AGM-158C', 'AGM-88G', 'AN-AAQ-33'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Experimental Morgan carrying LRASM cruise missiles, AARGM-ERs, and SPEAR-3 precision strikes.'
  },
  'CFA-44 Nosferatu Railgun SEAD & LRASM': {
    name: 'CFA-44 Nosferatu Railgun SEAD & LRASM',
    specId: 'CFA-44',
    roleCategory: 'STRIKE',
    chosenGunId: 'EML_GUN',
    weapons: ['GBU-53', 'AGM-88G', 'AGM-158C', 'AN-AAQ-33'],
    upgrades: ['COFFIN_OPTICAL_BUS', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: 'Carrier Nosferatu pairing 90% AP electromagnetic railgun shots with StormBreakers, AARGM-ER, and LRASM.'
  },
  'X-40 Nightmare Stealth Cruise & SEAD': {
    name: 'X-40 Nightmare Stealth Cruise & SEAD',
    specId: 'X-40',
    roleCategory: 'STRIKE',
    chosenGunId: 'EML_GUN',
    weapons: ['AGM-88G', 'SPEAR-3', 'AGM-158C', 'GBU-31'],
    upgrades: ['RAM_NANO_COATING', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: '6th-gen X-40 superfighter combining armor-piercing EML railgun strafes with LRASM, GBU-31, and SEAD.'
  },
  'XFA-36B Game Carrier Stealth SEAD': {
    name: 'XFA-36B Game Carrier Stealth SEAD',
    specId: 'XFA-36B',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88G', 'GBU-53', 'STORM-SHADOW', 'AN-ASQ-228'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: 'Tailless 3D TVC carrier superfighter armed with Storm Shadow penetrators, AARGM-ER, and SDB-IIs.'
  }
};
