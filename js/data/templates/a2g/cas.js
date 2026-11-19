/**
 * js/data/templates/a2g/cas.js - Extensive A2G and SEAD presets for CAS aircraft and tactical interdictors.
 */

window.TEMPLATES_A2G_CAS = {
  'A-10C Thunderbolt Tank Hunter': {
    name: 'A-10C Thunderbolt Tank Hunter',
    specId: 'A-10C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['BK-37-POD', 'AGM-179', 'AGM-65G', 'APKWS-II', 'AN-AAQ-28', 'AIM-9X-2'],
    upgrades: ['KEVLAR_BELLY_ARMOR', 'CCIP_BALLISTIC_COMP', 'DIRCM_IR_TURRET', 'TFR_TERRAIN_RADAR'],
    desc: 'Armored close air support setup pairing 30mm and 37mm tungsten cannons with JAGM, Maverick, and guided rockets.'
  },
  'A-10C Low-Level Runway & Bunker Strike': {
    name: 'A-10C Low-Level Runway & Bunker Strike',
    specId: 'A-10C',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-8',
    weapons: ['BLU-107', 'GBU-24', 'CBU-105', 'CRV7-MPSM', 'AN-AAQ-33', 'AN-ALQ-131'],
    upgrades: ['KEVLAR_BELLY_ARMOR', 'TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Low-altitude base-cratering load carrying Durandal runway bombs, BLU-109 laser penetrators, and Sniper XR.'
  },
  'Su-25SM3 Rocket & Cannon Assault': {
    name: 'Su-25SM3 Rocket & Cannon Assault',
    specId: 'Su-25SM3',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-2',
    weapons: ['GSH-30-2K', 'S-25OFM', 'S-13OF', 'S-8KOM', 'SAPSAN-E', 'R-73'],
    upgrades: ['KEVLAR_BELLY_ARMOR', 'CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR'],
    desc: 'Heavy twin-30mm Frogfoot assault pass saturated with 340mm, 122mm, and 80mm rocket salvos.'
  },
  'Su-25SM3 Runway Cratering & Cluster': {
    name: 'Su-25SM3 Runway Cratering & Cluster',
    specId: 'Su-25SM3',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-2',
    weapons: ['BETAB-500SHP', 'RBK-500-PTAB', 'KH-25ML', 'UPK-23-250', 'AN-ALQ-184', 'SAPSAN-E'],
    upgrades: ['KEVLAR_BELLY_ARMOR', 'CCIP_BALLISTIC_COMP', 'DIRCM_IR_TURRET'],
    desc: 'Anti-airfield Frogfoot packing concrete-piercing BetAB bombs, PTAB clusters, and supersonic Kh-25ML ATGMs.'
  },
  'Su-39 Heavy Missile & Flak Suppressor': {
    name: 'Su-39 Heavy Missile & Flak Suppressor',
    specId: 'Su-39',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-2',
    weapons: ['KH-38ML', 'KH-29T', 'S-24B', 'SAPSAN-E', 'KHIBINY-L175', 'R-73'],
    upgrades: ['KEVLAR_BELLY_ARMOR', 'DIRCM_IR_TURRET', 'TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP'],
    desc: 'All-weather Frogfoot-T deploying Mach 2.4 Kh-38ML standoff missiles and 320kg Kh-29T warheads.'
  },
  'AV-8B+ Harrier Precision LGB & Rocket': {
    name: 'AV-8B+ Harrier Precision LGB & Rocket',
    specId: 'AV-8B-PLUS',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-12',
    weapons: ['GBU-54', 'GBU-12', 'APKWS-II', 'AN-ASQ-228', 'AN-ALQ-184', 'AIM-9X-2'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'KEVLAR_BELLY_ARMOR'],
    desc: 'STOVL precision attacker blending dual-mode Laser JDAMs, Paveway IIs, and ATFLIR decoy spotting.'
  },
  'AV-8B+ Harrier SEAD & Flak Buster': {
    name: 'AV-8B+ Harrier SEAD & Flak Buster',
    specId: 'AV-8B-PLUS',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GAU-12',
    weapons: ['AGM-88E', 'AGM-114L', 'M230-POD', 'AN-ALQ-218-POD', 'AN-ALE-50', 'AIM-9X-2'],
    upgrades: ['SEAD_HTS_POD', 'DIRCM_IR_TURRET', 'RTB_HOMING_BEACON'],
    desc: 'Forward expeditionary SEAD Harrier combining ELINT emitter mapping with anti-EMCON AARGM and Hellfires.'
  },
  'MiG-27K Supersonic SEAD & Bunker Strike': {
    name: 'MiG-27K Supersonic SEAD & Bunker Strike',
    specId: 'MiG-27K',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-6-30',
    weapons: ['KH-31P', 'KAB-1500L', 'BETAB-500SHP', 'SAPSAN-E', 'KHIBINY-L175'],
    upgrades: ['SEAD_HTS_POD', 'KEVLAR_BELLY_ARMOR', 'TFR_TERRAIN_RADAR'],
    desc: 'Mach 1.42 armored Flogger delivering ramjet ARMs, 1,500kg concrete penetrators, and 6-barrel 30mm strafes.'
  },
  'A-16A Viper High-Speed SEAD & Cluster': {
    name: 'A-16A Viper High-Speed SEAD & Cluster',
    specId: 'A-16',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GAU-13',
    weapons: ['AGM-88G', 'CBU-105', 'BRIMSTONE-II', 'CRV7-PG', 'AN-AAQ-33', 'AN-ALQ-131', 'AIM-9X-2'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'KEVLAR_BELLY_ARMOR', 'CCIP_BALLISTIC_COMP'],
    desc: 'Supersonic 9G tank-buster pairing AARGM-ER radar killers with WCMD sensor-fuzed clusters and Brimstone salvos.'
  },
  'A-29B Super Tucano Precision Light CAS': {
    name: 'A-29B Super Tucano Precision Light CAS',
    specId: 'A-29B',
    roleCategory: 'STRIKE',
    chosenGunId: 'MICRO_GUN',
    weapons: ['SWITCHBLADE-600', 'SPIKE-NLOS', 'APKWS-II', 'M230-POD', 'HYDRA-70', 'AN-AAQ-28'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'DIRCM_IR_TURRET', 'RTB_HOMING_BEACON'],
    desc: 'Economical light attack platform fielding loitering anti-armor drones, Spike-NLOS, and 30mm strafe bursts.'
  },
  'A-29B Super Tucano Light SEAD & Recon': {
    name: 'A-29B Super Tucano Light SEAD & Recon',
    specId: 'A-29B',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'MICRO_GUN',
    weapons: ['AGM-45B', 'SWITCHBLADE-600', 'SPIKE-NLOS', 'HYDRA-70', 'AN-AAQ-28', 'BOL-CHAFF-RAIL'],
    upgrades: ['SEAD_HTS_POD', 'DIRCM_IR_TURRET', 'TFR_TERRAIN_RADAR'],
    desc: 'Low-heat turboprop scout and SHORAD hunter exposing ground decoys with LITENING and firing Shrike ARMs.'
  },
  'Jaguar GR.3A Low-Level Runway & Laser Strike': {
    name: 'Jaguar GR.3A Low-Level Runway & Laser Strike',
    specId: 'JAGUAR-GR3',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['BLU-107', 'GBU-16', 'CRV7-MPSM', 'DEFA-554-POD', 'AN-AAQ-28', 'ASRAAM'],
    upgrades: ['TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP', 'KEVLAR_BELLY_ARMOR'],
    desc: 'Supersonic low-level interdictor armed with Durandal runway craterers, 1,000lb LGBs, and 30mm cannon pods.'
  },
  'Jaguar GR.3A Fast SEAD & Cluster': {
    name: 'Jaguar GR.3A Fast SEAD & Cluster',
    specId: 'JAGUAR-GR3',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['ALARM-II', 'CBU-97', 'BRIMSTONE-II', 'AN-AAQ-28', 'AN-ALQ-184'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'DIRCM_IR_TURRET'],
    desc: 'High-speed SEAD Jaguar suppressing SAM emitters with anti-EMCON ALARM Mk2s and Skeet anti-armor clusters.'
  },
  'Mirage 2000D Storm Shadow Deep Strike': {
    name: 'Mirage 2000D Storm Shadow Deep Strike',
    specId: 'Mirage-2000D',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['STORM-SHADOW', 'GBU-12', 'DAMOCLES-POD', 'MICA-IR'],
    upgrades: ['TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Tailless delta penetrator carrying 105 km stealth Storm Shadow cruise missiles and Damocles laser pods.'
  },
  'Mirage 2000D Low-Level Runway & SEAD': {
    name: 'Mirage 2000D Low-Level Runway & SEAD',
    specId: 'Mirage-2000D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['MARTEL-AS37', 'BLU-107', 'PAVEWAY-IV', 'DAMOCLES-POD', 'AN-ALQ-184'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'DIRCM_IR_TURRET'],
    desc: 'Terrain-following strike delta combining heavy Martel ARMs with Durandal runway denial and Paveway IVs.'
  },
  'F-16XL Heavy Bunker & Cruise Penetrator': {
    name: 'F-16XL Heavy Bunker & Cruise Penetrator',
    specId: 'F-16XL',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-13',
    weapons: ['AGM-158B', 'GBU-24', 'GBU-54', 'AGM-88E', 'AN-AAQ-33'],
    upgrades: ['HEAVY_PYLON_FAIRINGS', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'SEAD_HTS_POD'],
    desc: 'Cranked-arrow Mach 1.48 penetrator hauling JASSM-ER stealth cruise missiles, GBU-24s, and AARGMs.'
  },
  'JH-7A Flying Leopard Budget Bomb & Rocket': {
    name: 'JH-7A Flying Leopard Budget Bomb & Rocket',
    specId: 'JH-7A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-23L',
    weapons: ['FAB-500', 'RBK-500', 'S-24B', 'KH-25ML', 'SAPSAN-E', 'PL-10'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'HEAVY_PYLON_FAIRINGS', 'KEVLAR_BELLY_ARMOR'],
    desc: 'Economical heavy tactical bomb truck delivering 500kg iron salvos, anti-armor clusters, and 240mm rockets.'
  },
  'JH-7A Maritime SEAD & Standoff Strike': {
    name: 'JH-7A Maritime SEAD & Standoff Strike',
    specId: 'JH-7A',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-23L',
    weapons: ['KH-31P', 'KH-59MK2', 'KH-38ML', 'KHIBINY-L175', 'SAPSAN-E', 'PL-10'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Standoff Leopard fielding supersonic Kh-31P ramjet ARMs, Kh-59MK2 stealth cruise, and Kh-38ML missiles.'
  },
  'Su-24M2 Fencer Runway & Cluster Sweep': {
    name: 'Su-24M2 Fencer Runway & Cluster Sweep',
    specId: 'Su-24M2',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-23L',
    weapons: ['BETAB-500SHP', 'RBK-500-PTAB', 'KAB-500L', 'S-13OF', 'SAPSAN-E', 'AN-ALQ-184'],
    upgrades: ['TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP', 'HEAVY_PYLON_FAIRINGS', 'DIRCM_IR_TURRET'],
    desc: 'Variable-sweep low-level interdictor saturating enemy airfields with BetAB penetrators and PTAB clusters.'
  },
  'Su-24M2 Heavy Bunker & SEAD Penetrator': {
    name: 'Su-24M2 Heavy Bunker & SEAD Penetrator',
    specId: 'Su-24M2',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-23L',
    weapons: ['KAB-1500L', 'KH-58USHKE', 'KH-59MK2', 'KHIBINY-L175'],
    upgrades: ['TFR_TERRAIN_RADAR', 'SEAD_HTS_POD', 'INTERNAL_LASER_SPOT', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'All-weather Fencer-D pairing 1,500kg concrete bunker busters with anti-EMCON ARMs and stealth cruise.'
  },
  'Tornado GR.4 JP233 Runway Denial': {
    name: 'Tornado GR.4 JP233 Runway Denial',
    specId: 'Tornado-GR4',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['JP233-DISP', 'ALARM-II', 'BRIMSTONE-II', 'PAVEWAY-IV', 'AN-AAQ-28'],
    upgrades: ['TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP', 'SEAD_HTS_POD', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Classic low-level Tornado runway-cratering package using JP233 dispensers, ALARM-II SEAD, and Brimstones.'
  },
  'Tornado GR.4 Storm Shadow & Brimstone': {
    name: 'Tornado GR.4 Storm Shadow & Brimstone',
    specId: 'Tornado-GR4',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['STORM-SHADOW', 'BRIMSTONE-II', 'SPEAR-3', 'DAMOCLES-POD', 'BRITECLOUD-POD'],
    upgrades: ['TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'DIRCM_IR_TURRET', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Standoff Tornado GR.4 delivering BROACH cruise missiles, SPEAR-3 mini-cruise, and DRFM active decoys.'
  },
  'F-111F Aardvark Deep Bunker Penetrator': {
    name: 'F-111F Aardvark Deep Bunker Penetrator',
    specId: 'F-111F',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-32', 'GBU-28', 'GBU-24', 'AGM-88E', 'LANTIRN-POD'],
    upgrades: ['TFR_TERRAIN_RADAR', 'HEAVY_PYLON_FAIRINGS', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'High-speed swing-wing penetrator hauling 5,000lb GBU-28 and 2,000lb GBU-24 concrete bunker busters.'
  },
  'F-111F Aardvark JP233 & Cluster Carpet': {
    name: 'F-111F Aardvark JP233 & Cluster Carpet',
    specId: 'F-111F',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-39', 'JP233-DISP', 'CBU-105', 'MK-84', 'AN-ALQ-131', 'AN-AAQ-28'],
    upgrades: ['TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP', 'KEVLAR_BELLY_ARMOR', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Heavy 12.7-ton Aardvark carpet-strike load clearing airbases and SAM belts in one high-speed pass.'
  },
  'F-117A Nighthawk Precision Laser Stealth': {
    name: 'F-117A Nighthawk Precision Laser Stealth',
    specId: 'F-117A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['PAVEWAY-IV', 'GBU-38'],
    upgrades: ['INTERNAL_LASER_SPOT', 'RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'EOTS_DUAL_OPTICS'],
    desc: 'Clean VLO Nighthawk carrying internal dual-mode Paveway IV and JDAM bombs with built-in IRADS optics.'
  },
  'F-117A Nighthawk Stealth SDB & SEAD': {
    name: 'F-117A Nighthawk Stealth SDB & SEAD',
    specId: 'F-117A',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GAU-22',
    weapons: ['GBU-53', 'SPEAR-EW'],
    upgrades: ['RAM_NANO_COATING', 'SEAD_HTS_POD', 'INTERNAL_LASER_SPOT', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Silent stealth Nighthawk pairing 8 StormBreaker tri-mode SDBs with loitering SPEAR-EW radar hunters.'
  },
  'F-15E Strike Eagle Deep Penetrator': {
    name: 'F-15E Strike Eagle Deep Penetrator',
    specId: 'F-15E',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-28', 'AGM-158B', 'GBU-54', 'AGM-88G', 'AN-AAQ-33'],
    upgrades: ['HEAVY_PYLON_FAIRINGS', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'SEAD_HTS_POD'],
    desc: 'Conformal Strike Eagle built to crack 18 HP C2 bunkers with GBU-28, JASSM-ER, and AARGM-ER escort.'
  },
  'F-15E Strike Eagle Cluster & Runway Assault': {
    name: 'F-15E Strike Eagle Cluster & Runway Assault',
    specId: 'F-15E',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['JP233-DISP', 'CBU-105', 'GBU-31', 'AGM-65G', 'AN-AAQ-28', 'AIM-9X-2'],
    upgrades: ['HEAVY_PYLON_FAIRINGS', 'CCIP_BALLISTIC_COMP', 'KEVLAR_BELLY_ARMOR', 'TFR_TERRAIN_RADAR'],
    desc: 'Heavy low-level airbase strike loadout combining JP233 dispensers, CBU-105 SFWs, and 2,000lb BLU-109 JDAMs.'
  }
};
