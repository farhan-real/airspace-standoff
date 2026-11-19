/**
 * js/data/templates/ew.js - Preconfigured Loadouts: Electronic Warfare & SEAD Escorts.
 */

window.TEMPLATES_EW = {
  'EA-18G Airborne Electronic Attack (AEA)': {
    name: 'EA-18G Airborne Electronic Attack (AEA)',
    specId: 'EA-18G',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AN-ALQ-249', 'AGM-88G', 'AIM-120D', 'ADM-160B'],
    upgrades: ['ADAPTIVE_ECCM_SUITE', 'ESM_PASSIVE_SUITE'],
    desc: 'Fleet electronic attack escort. GaN AESA jamming umbrella blinds hostile radar while AGM-88G HARMs crack SAM emitters.'
  },
  'EA-18G Dedicated SEAD Escort': {
    name: 'EA-18G Dedicated SEAD Escort',
    specId: 'EA-18G',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88G', 'AGM-88G', 'AIM-120D', 'ALE-55'],
    upgrades: ['ESM_PASSIVE_SUITE', 'ADAPTIVE_ECCM_SUITE', 'MADL_BATTLE_LINK'],
    desc: 'Dedicated radar hunting package fielding 8 AGM-88G anti-radiation missiles to permanently blind enemy IADS networks.'
  },
  'Tornado-ECR Defense Suppression': {
    name: 'Tornado-ECR Defense Suppression',
    specId: 'Tornado-ECR',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['AGM-88G', 'AIM-120D', 'ALE-55'],
    upgrades: ['ESM_PASSIVE_SUITE', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Low-level terrain-penetration SEAD specialist. Rapidly geolocates surface radar emitters and fires 3x damage ARM volleys.'
  },
  'Tornado-ECR Radar Jamming Escort': {
    name: 'Tornado-ECR Radar Jamming Escort',
    specId: 'Tornado-ECR',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['AN-ALQ-99', 'AGM-88G', 'AIM-120D'],
    upgrades: ['ESM_PASSIVE_SUITE', 'EXTENDED_RANGE_TURBO'],
    desc: 'Affordable strike package escort providing broadband microwave radar noise jamming.'
  },
  'Tornado-ECR Anti-EMCON ALARM & Spear': {
    name: 'Tornado-ECR Anti-EMCON ALARM & Spear',
    specId: 'Tornado-ECR',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['ALARM-II', 'SPEAR-EW', 'AN-ALQ-131', 'AN-AAQ-28', 'BRITECLOUD-POD', 'IRIS-T'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Low-level European Wild Weasel pairing ALARM-II and SPEAR-EW radar hunters with BriteCloud DRFM decoys.'
  },
  'Tornado-ECR ITALD Bait & Standoff Jammer': {
    name: 'Tornado-ECR ITALD Bait & Standoff Jammer',
    specId: 'Tornado-ECR',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['AN-ALQ-249', 'TALD-DECOY', 'AGM-88E', 'AN-ALQ-218-POD'],
    upgrades: ['ESM_PASSIVE_SUITE', 'ADAPTIVE_ECCM_SUITE', 'DIRCM_IR_TURRET'],
    desc: 'Suppression Tornado projecting 125 km NGJ jamming while launching ITALD gliders to exhaust SAM ready racks.'
  },
  'EF-111A Penetration Jamming System': {
    name: 'EF-111A Penetration Jamming System',
    specId: 'EF-111A',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AN-ALQ-99', 'AIM-120D', 'ALE-55'],
    upgrades: ['SUPERCRUISE_VCE', 'ESM_PASSIVE_SUITE'],
    desc: 'Mach 1.28 supersonic penetration jammer designed to fly alongside strike packages and suppress early warning radars.'
  },
  'EF-111A Standoff Electronic Screening': {
    name: 'EF-111A Standoff Electronic Screening',
    specId: 'EF-111A',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AN-ALQ-249', 'AIM-120D', 'ALE-55'],
    upgrades: ['ADAPTIVE_ECCM_SUITE', 'SUPERCRUISE_VCE'],
    desc: 'Equipped with next-generation GaN AESA jamming pods to project directional jamming beams from 120km out.'
  },
  'Su-24MP Fencer-F Broadband Jamming Escort': {
    name: 'Su-24MP Fencer-F Broadband Jamming Escort',
    specId: 'Su-24MP',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-23L',
    weapons: ['SAP-14-POD', 'KH-58USHKE', 'R-27EP', 'KHIBINY-L175', 'R-73'],
    upgrades: ['ADAPTIVE_ECCM_SUITE', 'ESM_PASSIVE_SUITE', 'TFR_TERRAIN_RADAR', 'DIRCM_IR_TURRET'],
    desc: 'Standoff EW Fencer combining 45% innate jamming, Tarantul and Khibiny pods, and 95 km R-27EP anti-EW missiles.'
  },
  'Su-24MP Fencer-F Anti-Radar & Decoy Screen': {
    name: 'Su-24MP Fencer-F Anti-Radar & Decoy Screen',
    specId: 'Su-24MP',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-23L',
    weapons: ['KH-31P', 'KH-31P', 'TALD-DECOY', 'ADM-160B', 'SAPSAN-E'],
    upgrades: ['SEAD_HTS_POD', 'ADAPTIVE_ECCM_SUITE', 'EXPANDED_CM_DISPENSER', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'High-volume SEAD Fencer carrying 8 ramjet Kh-31P ARMs alongside ITALD and MALD decoys plus Sapsan-E optics.'
  },
  'Su-24MP Fencer-F Passive ELINT & HOJ': {
    name: 'Su-24MP Fencer-F Passive ELINT & HOJ',
    specId: 'Su-24MP',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-23L',
    weapons: ['SORBTSIYA-L005', 'R-27P', 'R-27EP', 'AN-ALQ-218-POD', 'BRITECLOUD-POD'],
    upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE', 'MADL_BATTLE_LINK', 'RTB_HOMING_BEACON'],
    desc: 'Lightweight 30% Wr Fencer-F hunting enemy radars silently with ELINT receivers and passive R-27P/EP seekers.'
  },
  'J-15D Carrier Growler Fleet Jammer & HOJ': {
    name: 'J-15D Carrier Growler Fleet Jammer & HOJ',
    specId: 'J-15D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['AN-ALQ-249', 'PL-15-HOJ', 'PL-15-HOJ', 'PL-10', 'KHIBINY-L175', 'AN-ALE-50'],
    upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE', 'MADL_BATTLE_LINK', 'EOTS_DUAL_OPTICS'],
    desc: 'Naval carrier EW escort pairing 125 km NGJ jamming with 8 Home-On-Jam PL-15 missiles and towed repeaters.'
  },
  'J-15D Carrier Growler Anti-IADS Swarm': {
    name: 'J-15D Carrier Growler Anti-IADS Swarm',
    specId: 'J-15D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-58USHKE', 'KH-31P', 'TALD-DECOY', 'SAPSAN-E', 'SORBTSIYA-L005', 'PL-10'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'DIRCM_IR_TURRET', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Carrier DEAD package combining Sorbtsiya jamming and ITALD decoys with dual-type ARM radar suppression.'
  },
  'J-15D Carrier Growler Long-Reach Escort': {
    name: 'J-15D Carrier Growler Long-Reach Escort',
    specId: 'J-15D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['SAP-14-POD', 'R-27EP', 'PL-15-HOJ', 'AN-ALQ-218-POD', 'ADM-160B', 'PL-10'],
    upgrades: ['ADAPTIVE_ECCM_SUITE', 'GAN_AESA_CORE', 'MALD_DECOY_SYSTEM', 'SUPERCRUISE_VCE'],
    desc: 'Long-range maritime EW escort screening strike wings with 115 km Tarantul jamming, ELINT, and MALD decoys.'
  },
  'J-16D Electronic Warfare Escort': {
    name: 'J-16D Electronic Warfare Escort',
    specId: 'J-16D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['AN-ALQ-99', 'AGM-88G', 'AGM-88G', 'PL-15E'],
    upgrades: ['ADAPTIVE_ECCM_SUITE', 'GAN_AESA_CORE'],
    desc: 'Heavy electronic attack fighter equipped with wingtip wideband ESM pods and 10 stations for anti-radiation volleys.'
  },
  'J-16D Standoff SEAD Interdiction': {
    name: 'J-16D Standoff SEAD Interdiction',
    specId: 'J-16D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['AN-ALQ-249', 'PL-15E', 'PL-15E', 'R-73'],
    upgrades: ['ADAPTIVE_ECCM_SUITE', 'MADL_BATTLE_LINK'],
    desc: 'High-power standoff electronic attack fighter shielding friendly strike wings while engaging hostile escorts.'
  },
  'EA-36 Airborne Electronic Attack & SEAD': {
    name: 'EA-36 Airborne Electronic Attack & SEAD',
    specId: 'EA-36',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'DE-PULSE',
    weapons: ['AN-ALQ-249', 'AGM-88G', 'AIM-120D', 'ADM-160B'],
    upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE', 'ESM_PASSIVE_SUITE', 'SUPERCRUISE_VCE'],
    desc: 'Electronic warfare package combining GaN AESA jamming pods, anti-radiation HARMs, and internal AMRAAMs.'
  },
  'EA-36 Standoff Radar Jamming Escort': {
    name: 'EA-36 Standoff Radar Jamming Escort',
    specId: 'EA-36',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['AN-ALQ-249', 'AGM-88G', 'METEOR', 'ALE-55'],
    upgrades: ['GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE', 'MADL_BATTLE_LINK', 'SUPERCRUISE_VCE'],
    desc: 'Fleet escort pairing GaN AESA jamming with ramjet Meteor missiles and towed decoys.'
  }
};
