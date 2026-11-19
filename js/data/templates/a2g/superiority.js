/**
 * js/data/templates/a2g/superiority.js - A2G and SEAD presets for heavy air superiority and interceptor airframes.
 */

window.TEMPLATES_A2G_SUPERIORITY = {
  'F-15EX Eagle II Heavy Bunker & JP233': {
    name: 'F-15EX Eagle II Heavy Bunker & JP233',
    specId: 'F-15EX',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['JP233-DISP', 'GBU-28', 'GBU-31', 'CBU-105', 'AN-AAQ-33', 'AIM-120D'],
    upgrades: ['HEAVY_PYLON_FAIRINGS', 'CCIP_BALLISTIC_COMP', 'KEVLAR_BELLY_ARMOR', 'TFR_TERRAIN_RADAR'],
    desc: '14-station Eagle II heavy airbase crusher combining JP233 runway denial, GBU-28, and BLU-109 JDAMs.'
  },
  'F-15EX Eagle II Mass AARGM-ER SEAD': {
    name: 'F-15EX Eagle II Mass AARGM-ER SEAD',
    specId: 'F-15EX',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88G', 'AGM-88G', 'AGM-158C', 'TALD-DECOY', 'AN-ALQ-249', 'AN-ALQ-218-POD'],
    upgrades: ['SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'ADAPTIVE_ECCM_SUITE', 'TFR_TERRAIN_RADAR'],
    desc: 'Theater IADS dismantling Eagle carrying 8 AARGM-ERs, ITALD bait gliders, LRASM, and NGJ jamming.'
  },
  'F-15C Golden Eagle Escort & SEAD': {
    name: 'F-15C Golden Eagle Escort & SEAD',
    specId: 'F-15C',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88G', 'GBU-53', 'AN-AAQ-33', 'AIM-120D', 'AIM-9X-2'],
    upgrades: ['SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: 'Fast Mach 1.50 Golden Eagle blending AARGM-ER radar hunting and StormBreaker SDBs with BVR escort.'
  },
  'F-15JSI Super Interceptor LRASM & SEAD': {
    name: 'F-15JSI Super Interceptor LRASM & SEAD',
    specId: 'F-15J-JSI',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158C', 'AGM-88G', 'GBU-54', 'AN-AAQ-33', 'AAM-4B'],
    upgrades: ['SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'HEAVY_PYLON_FAIRINGS', 'TFR_TERRAIN_RADAR'],
    desc: 'Heavy 10.2-ton Pac-Rim Eagle delivering autonomous LRASM cruise strikes alongside AARGM-ER and Laser JDAMs.'
  },
  'Su-35S Flanker-E BrahMos & SEAD': {
    name: 'Su-35S Flanker-E BrahMos & SEAD',
    specId: 'Su-35S',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['BRAHMOS-A', 'KH-58USHKE', 'KH-38ML', 'SAPSAN-E', 'KHIBINY-L175', 'R-73'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: '3D TVC Flanker-E launching Mach 3.0 BrahMos-A centerline cruise missiles and anti-EMCON ARMs.'
  },
  'Su-30SM Flanker-H Laser & Anti-Runway': {
    name: 'Su-30SM Flanker-H Laser & Anti-Runway',
    specId: 'Su-30SM',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KAB-1500L', 'BETAB-500SHP', 'S-25OFM', 'SAPSAN-E', 'R-73'],
    upgrades: ['KEVLAR_BELLY_ARMOR', 'TFR_TERRAIN_RADAR', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Tandem-seat Flanker-H outfitted for fortified shelter destruction with KAB-1500L, BetAB, and S-25 rockets.'
  },
  'Su-30MKI Heavy SEAD & Kh-59MK2': {
    name: 'Su-30MKI Heavy SEAD & Kh-59MK2',
    specId: 'Su-30MKI',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-59MK2', 'KH-58USHKE', 'KH-31P', 'SAPSAN-E', 'R-73'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Canard-TVC Flanker blending Kh-59MK2 stealth cruise with dual ramjet and anti-EMCON ARM salvos.'
  },
  'Su-27SM3 Flanker Budget Bomb & Rocket': {
    name: 'Su-27SM3 Flanker Budget Bomb & Rocket',
    specId: 'Su-27SM3',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['FAB-500', 'RBK-500', 'S-24B', 'SAPSAN-E', 'R-73'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'INTERNAL_LASER_SPOT'],
    desc: 'Economical heavy Flanker saturating border SAM belts with FAB-500s, RBK-500 clusters, and 240mm rockets.'
  },
  'Eurofighter Storm Shadow & Brimstone': {
    name: 'Eurofighter Storm Shadow & Brimstone',
    specId: 'Eurofighter',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['STORM-SHADOW', 'BRIMSTONE-II', 'DAMOCLES-POD', 'IRIS-T'],
    upgrades: ['MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Swing-role Typhoon combining 105 km Storm Shadow cruise strikes with Brimstone II anti-armor salvos.'
  },
  'Typhoon Tranche 4 Taurus & SEAD': {
    name: 'Typhoon Tranche 4 Taurus & SEAD',
    specId: 'TYPHOON-T4',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['TAURUS', 'SPEAR-EW', 'SPEAR-3', 'DAMOCLES-POD'],
    upgrades: ['SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'ECRS Mk2 EW Typhoon deploying 115 km Taurus bunker penetrators behind SPEAR-EW radar suppressors.'
  },
  'Rafale C Precision Storm Shadow & SEAD': {
    name: 'Rafale C Precision Storm Shadow & SEAD',
    specId: 'Rafale-C',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['STORM-SHADOW', 'ALARM-II', 'PAVEWAY-IV', 'DAMOCLES-POD', 'MICA-IR'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'DIRCM_IR_TURRET'],
    desc: 'Omnirole Rafale C delivering Storm Shadow, ALARM-II SEAD, and dual-mode Paveway IV precision bombs.'
  },
  'J-16 Red Eagle BrahMos & Bunker Strike': {
    name: 'J-16 Red Eagle BrahMos & Bunker Strike',
    specId: 'J-16',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['BRAHMOS-A', 'KAB-1500L', 'KH-38ML', 'SAPSAN-E', 'PL-10'],
    upgrades: ['KEVLAR_BELLY_ARMOR', 'TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP'],
    desc: 'Heavy Type X Red Eagle pairing Mach 3.0 BrahMos-A centerline strike with 1,500kg concrete penetrators.'
  },
  'J-15T Carrier Anti-IADS Strike': {
    name: 'J-15T Carrier Anti-IADS Strike',
    specId: 'J-15T',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-59MK2', 'KH-31P', 'S-25OFM', 'SAPSAN-E', 'PL-10'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Catapult-launched carrier Flanker deploying Kh-59MK2 cruise missiles, Kh-31P ARMs, and 340mm rockets.'
  },
  'J-11BG AESA Tactical Glide & SEAD': {
    name: 'J-11BG AESA Tactical Glide & SEAD',
    specId: 'J-11BG',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['UMP-K', 'KH-58USHKE', 'RBK-500', 'SAPSAN-E', 'PL-10'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Single-seat AESA Flanker carrying 52 km UMPK winged glide bombs, Kh-58UShKE ARMs, and RBK-500 clusters.'
  },
  'MiG-35S Fulcrum-F Precision Strike': {
    name: 'MiG-35S Fulcrum-F Precision Strike',
    specId: 'MiG-35S',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-38ML', 'KAB-500S', 'KH-58USHKE', 'SAPSAN-E', 'R-74M2'],
    upgrades: ['TFR_TERRAIN_RADAR', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Thrust-vectored 4++ gen Fulcrum-F combining Mach 2.4 Kh-38ML strikes, GLONASS bombs, and SEAD.'
  },
  'Mirage 4000 Heavy Storm Shadow & SEAD': {
    name: 'Mirage 4000 Heavy Storm Shadow & SEAD',
    specId: 'Mirage-4000',
    roleCategory: 'STRIKE',
    chosenGunId: 'BK-27',
    weapons: ['STORM-SHADOW', 'MARTEL-AS37', 'GBU-16', 'DAMOCLES-POD', 'MICA-IR'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Heavy twin-engine Mirage 4000 packing Storm Shadow cruise, Martel ARMs, and 1,000lb laser bombs.'
  },
  'F-4E Terminator 2020 Bunker & SEAD': {
    name: 'F-4E Terminator 2020 Bunker & SEAD',
    specId: 'F-4E-2020',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-24', 'AGM-88C', 'MK-83', 'LANTIRN-POD', 'AN-ALQ-184'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'SEAD_HTS_POD', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Economical 5 HP Terminator Phantom hauling 2,000lb GBU-24s, HARM missiles, and 1,000lb iron bombs.'
  },
  'F-14D Super Tomcat Bombcat Strike': {
    name: 'F-14D Super Tomcat Bombcat Strike',
    specId: 'F-14D',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-24', 'GBU-16', 'AGM-154C', 'LANTIRN-POD', 'AIM-9X-2'],
    upgrades: ['TFR_TERRAIN_RADAR', 'HEAVY_PYLON_FAIRINGS', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Fleet Bombcat loadout pairing LANTIRN precision laser bombs with 78 km JSOW-C BROACH penetrators.'
  },
  'F-14B Bombcat LANTIRN Laser & Cluster': {
    name: 'F-14B Bombcat LANTIRN Laser & Cluster',
    specId: 'F-14B',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-16', 'CBU-97', 'GBU-12', 'LANTIRN-POD', 'AIM-9M'],
    upgrades: ['TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Budget swing-wing Bombcat carrying 1,000lb and 500lb LGBs plus Sensor Fuzed anti-armor clusters.'
  }
};
