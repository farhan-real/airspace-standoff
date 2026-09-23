/**
 * AIRSPACE STANDOFF: Preconfigured Loadouts: Electronic Warfare & SEAD Escorts
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
  'Tornado-ECR Tactical Jamming Escort': {
    name: 'Tornado-ECR Tactical Jamming Escort',
    specId: 'Tornado-ECR',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['AN-ALQ-99', 'AGM-88G', 'AIM-120D'],
    upgrades: ['ESM_PASSIVE_SUITE', 'EXTENDED_RANGE_TURBO'],
    desc: 'Affordable strike package escort providing broadband microwave radar noise jamming.'
  },

  'EF-111A Tactical Jamming System': {
    name: 'EF-111A Tactical Jamming System',
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
  }
};