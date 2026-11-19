/**
 * js/data/templates/a2g/bombers.js - Extensive A2G and SEAD presets for heavy strike and strategic bombers.
 */

window.TEMPLATES_A2G_BOMBERS = {
  'Su-34 Fullback Anti-Runway & Bunker': {
    name: 'Su-34 Fullback Anti-Runway & Bunker',
    specId: 'Su-34',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-2',
    weapons: ['FAB-3000', 'KAB-1500L', 'BETAB-500SHP', 'KH-38ML', 'SAPSAN-E', 'KHIBINY-L175'],
    upgrades: ['HEAVY_PYLON_FAIRINGS', 'TFR_TERRAIN_RADAR', 'KEVLAR_BELLY_ARMOR', 'CCIP_BALLISTIC_COMP'],
    desc: 'Heavy armored Fullback carrying the 22 HP FAB-3000 centerline bomb alongside concrete runway penetrators.'
  },
  'Su-34 Fullback BrahMos & SEAD Escort': {
    name: 'Su-34 Fullback BrahMos & SEAD Escort',
    specId: 'Su-34',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['BRAHMOS-A', 'KH-58USHKE', 'KH-59MK2', 'KH-31P', 'SAPSAN-E', 'R-73'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Supersonic standoff Fullback firing Mach 3.0 BrahMos-A cruise missiles behind dual anti-radiation salvos.'
  },
  'B-52H Strategic Cruise Arsenal': {
    name: 'B-52H Strategic Cruise Arsenal',
    specId: 'B-52H',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'AGM-158B', 'AGM-158C', 'AGM-158C', 'TAURUS', 'AN-AAQ-33'],
    upgrades: ['MITL_DATALINK_TRANSCEIVER', 'HEAVY_PYLON_FAIRINGS', 'ADAPTIVE_ECCM_SUITE', 'GAN_AESA_CORE'],
    desc: 'Stand-off strategic cruise truck saturating enemy CIWS domes with 10 stealth JASSM, LRASM, and Taurus strikes.'
  },
  'B-52H Heavy Carpet & Bunker MOP': {
    name: 'B-52H Heavy Carpet & Bunker MOP',
    specId: 'B-52H',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-57', 'GBU-31', 'MK-84', 'CBU-105', 'GBU-28', 'AN-AAQ-28'],
    upgrades: ['CCIP_BALLISTIC_COMP', 'HEAVY_PYLON_FAIRINGS', 'KEVLAR_BELLY_ARMOR', 'DIRCM_IR_TURRET'],
    desc: 'Maximum-tonnage heavy bomber hauling the 30,000lb GBU-57 MOP, GBU-28 penetrator, Mk-84s, and CBU-105s.'
  },
  'B-52H Mass SDB & SEAD Saturation': {
    name: 'B-52H Mass SDB & SEAD Saturation',
    specId: 'B-52H',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-39', 'GBU-39', 'GBU-53', 'GBU-53', 'AGM-88G', 'AGM-88G', 'AN-ALQ-249'],
    upgrades: ['SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'GAN_AESA_CORE', 'DIRCM_IR_TURRET'],
    desc: '32-bomb glide saturation arsenal paired with 8 AARGM-ERs and a high-power NGJ standoff jamming pod.'
  },
  'B-1B Lancer Strategic Penetrator': {
    name: 'B-1B Lancer Strategic Penetrator',
    specId: 'B-1B',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'GBU-53', 'AGM-158C', 'GBU-28', 'AN-AAQ-33'],
    upgrades: ['TFR_TERRAIN_RADAR', 'HEAVY_PYLON_FAIRINGS', 'MITL_DATALINK_TRANSCEIVER', 'DIRCM_IR_TURRET'],
    desc: 'Low-altitude supersonic Bone combining stealth cruise missiles, StormBreakers, and 5,000lb GBU-28 bunker busters.'
  },
  'B-1B Lancer Supersonic Carpet Strike': {
    name: 'B-1B Lancer Supersonic Carpet Strike',
    specId: 'B-1B',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-57', 'CBU-105', 'GBU-38', 'AN-ALQ-131'],
    upgrades: ['TFR_TERRAIN_RADAR', 'CCIP_BALLISTIC_COMP', 'KEVLAR_BELLY_ARMOR', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Internal 28 HP Massive Ordnance Penetrator backed by sensor-fuzed cluster sweeps and 500lb JDAMs.'
  },
  'B-1B Lancer SEAD & Cruise Saturation': {
    name: 'B-1B Lancer SEAD & Cruise Saturation',
    specId: 'B-1B',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-158B', 'AGM-88G', 'AGM-88G', 'HAROP-AL', 'AN-ALQ-249', 'TALD-DECOY'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'ADAPTIVE_ECCM_SUITE', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Heavy IADS breaker using ITALD gliders, NGJ jamming, 8 AARGM-ERs, and Harop anti-EMCON drones.'
  },
  'Tu-160M Kh-101 Strategic Stealth Cruise': {
    name: 'Tu-160M Kh-101 Strategic Stealth Cruise',
    specId: 'Tu-160M',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-101', 'KH-101', 'KH-59MK2', 'KH-58USHKE', 'SAPSAN-E'],
    upgrades: ['MITL_DATALINK_TRANSCEIVER', 'HEAVY_PYLON_FAIRINGS', 'SEAD_HTS_POD', 'DIRCM_IR_TURRET'],
    desc: 'Mach 1.48 White Swan firing 145 km Kh-101 strategic stealth cruise missiles from safe rear airspace.'
  },
  'Tu-160M Heavy Bunker & Hypersonic Strike': {
    name: 'Tu-160M Heavy Bunker & Hypersonic Strike',
    specId: 'Tu-160M',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-59MK2', 'KH-59MK2', 'FAB-3000', 'KH-32', 'KAB-1500L', 'SAP-14-POD'],
    upgrades: ['HEAVY_PYLON_FAIRINGS', 'CCIP_BALLISTIC_COMP', 'TFR_TERRAIN_RADAR', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Strategic theater breaker fielding Mach 4.6 Kh-32, FAB-3000, KAB-1500L penetrators, and Tarantul ECM.'
  },
  'B-2A Spirit MOP Bunker Buster': {
    name: 'B-2A Spirit MOP Bunker Buster',
    specId: 'B-2A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['GBU-57', 'GBU-53', 'GBU-53', 'SPEAR-3', 'SPEAR-EW'],
    upgrades: ['RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT', 'SEAD_HTS_POD'],
    desc: 'VLO flying wing carrying the 30,000lb GBU-57 MOP alongside 16 StormBreakers and SPEAR-EW radar hunters.'
  },
  'B-2A Spirit Stealth JDAM & Cluster Saturation': {
    name: 'B-2A Spirit Stealth JDAM & Cluster Saturation',
    specId: 'B-2A',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['GBU-31', 'GBU-31', 'AGM-154A', 'AGM-154C', 'GBU-39', 'GBU-53', 'AGM-88G'],
    upgrades: ['RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT', 'SEAD_HTS_POD'],
    desc: 'Full 16-slot internal rotary stealth loadout combining BLU-109 JDAMs, JSOW cluster/BROACH, and SDBs.'
  },
  'FB-22 Strike Raptor Stealth Supercruise': {
    name: 'FB-22 Strike Raptor Stealth Supercruise',
    specId: 'FB-22',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-158B', 'AGM-154C', 'GBU-53', 'AIM-260', 'AN-AAQ-33'],
    upgrades: ['RAM_NANO_COATING', 'SUPERCRUISE_VCE', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT'],
    desc: 'Supersonic Mach 1.46 stealth delta bomber delivering internal JASSM-ER and JSOW-C strikes with BVR escort.'
  },
  'FB-22 Strike Raptor Heavy Bunker & SEAD': {
    name: 'FB-22 Strike Raptor Heavy Bunker & SEAD',
    specId: 'FB-22',
    roleCategory: 'STRIKE',
    chosenGunId: 'M61A2',
    weapons: ['GBU-31', 'AGM-158C', 'AGM-88G', 'SPEAR-EW', 'GBU-28'],
    upgrades: ['HEAVY_PYLON_FAIRINGS', 'SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'RAM_NANO_COATING'],
    desc: 'Heavy Strike Raptor configuration pairing internal LRASM and AARGM-ERs with an external 5,000lb GBU-28.'
  },
  'B-21 Raider Deep Stealth SEAD & Strike': {
    name: 'B-21 Raider Deep Stealth SEAD & Strike',
    specId: 'B-21',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['AGM-158C', 'AGM-158C', 'AGM-88G', 'AGM-88G', 'SPEAR-EW', 'GBU-53', 'AIM-260'],
    upgrades: ['RAM_NANO_COATING', 'SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'GAN_AESA_CORE'],
    desc: 'Next-gen 0.00008m2 VLO Raider penetrating deep IADS belts with LRASM, AARGM-ER, and SPEAR-EW salvos.'
  },
  'B-21 Raider Stealth SDB & Cruise Arsenal': {
    name: 'B-21 Raider Stealth SDB & Cruise Arsenal',
    specId: 'B-21',
    roleCategory: 'STRIKE',
    chosenGunId: 'GAU-22',
    weapons: ['KH-101', 'AGM-158B', 'AGM-154C', 'GBU-53', 'GBU-39', 'SPEAR-3'],
    upgrades: ['RAM_NANO_COATING', 'MITL_DATALINK_TRANSCEIVER', 'INTERNAL_LASER_SPOT', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Pure internal stealth standoff package saturated with strategic cruise missiles, JSOW-C, and 20 glide bombs.'
  }
};
