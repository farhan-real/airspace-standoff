/**
 * js/data/templates/ewplus.js - Specialized EW, Home-On-Jam, Decoy Saturation, and DEAD Presets.
 */

window.TEMPLATES_EW_PLUS = {
  'EF-111A Raven Supersonic DEAD & Bait': {
    name: 'EF-111A Raven Supersonic DEAD & Bait',
    specId: 'EF-111A',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88G', 'AN-ALQ-249', 'TALD-DECOY', 'AN-ALQ-218-POD'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'SUPERCRUISE_VCE'],
    desc: 'Mach 1.28 supersonic penetration Raven pairing NGJ AESA jamming with ITALD SAM-baiting gliders and internal AARGM-ERs.'
  },
  'EF-111A Raven Anti-Jammer BVR Escort': {
    name: 'EF-111A Raven Anti-Jammer BVR Escort',
    specId: 'EF-111A',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AN-ALQ-165', 'ADM-160B', 'AIM-120D-HOJ', 'AN-ALQ-99', 'AIM-9X-2', 'AN-ALE-50'],
    upgrades: ['ADAPTIVE_ECCM_SUITE', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'Air-to-air EW escort projecting dual internal/external jamming, MALD decoys, and Home-On-Jam AMRAAMs.'
  },
  'EA-18G Growler Triple-Jammer Umbrella': {
    name: 'EA-18G Growler Triple-Jammer Umbrella',
    specId: 'EA-18G',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GAU-22',
    weapons: ['AN-ALQ-249', 'AN-ALQ-99', 'AN-ALQ-218-POD', 'AIM-120D-HOJ', 'AN-ALE-50'],
    upgrades: ['ADAPTIVE_ECCM_SUITE', 'GAN_AESA_CORE', 'ESM_PASSIVE_SUITE', 'MADL_BATTLE_LINK'],
    desc: 'Fleet airborne electronic attack umbrella combining NGJ and ALQ-99 pods with 135 km ELINT and HOJ defense.'
  },
  'EA-18G Growler Anti-EMCON & Harop': {
    name: 'EA-18G Growler Anti-EMCON & Harop',
    specId: 'EA-18G',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AGM-88G', 'HAROP-AL', 'TALD-DECOY', 'AN-ALQ-131', 'AN-ASQ-228'],
    upgrades: ['SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'DIRCM_IR_TURRET', 'TFR_TERRAIN_RADAR'],
    desc: 'Anti-EMCON Growler saturating SAM belts with ITALD gliders, AARGM-ERs, and 95 km Harop loitering killers.'
  },
  'EA-18G Growler Fleet Counter-Stealth EW': {
    name: 'EA-18G Growler Fleet Counter-Stealth EW',
    specId: 'EA-18G',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GAU-22',
    weapons: ['AN-ALQ-249', 'AIM-120D-HOJ', 'AIM-9X-B3', 'IRST-21-POD', 'BRITECLOUD-POD'],
    upgrades: ['GAN_AESA_CORE', 'EOTS_DUAL_OPTICS', 'ADAPTIVE_ECCM_SUITE', 'DAS_360_OPTIC'],
    desc: 'Counter-stealth EW escort combining GaN AESA jamming with passive IRST21 tracking and BriteCloud DRFM decoys.'
  },
  'J-16D Red Eagle Standoff Jammer & HOJ': {
    name: 'J-16D Red Eagle Standoff Jammer & HOJ',
    specId: 'J-16D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['SAP-14-POD', 'AN-ALQ-249', 'PL-15-HOJ', 'PL-10', 'AN-ALQ-218-POD'],
    upgrades: ['ADAPTIVE_ECCM_SUITE', 'GAN_AESA_CORE', 'ESM_PASSIVE_SUITE', 'MADL_BATTLE_LINK'],
    desc: 'Heavy twin-pod standoff jammer pairing Tarantul and NGJ pods with Home-On-Jam PL-15s and 135 km ELINT.'
  },
  'J-16D Red Eagle Heavy Anti-Radiation': {
    name: 'J-16D Red Eagle Heavy Anti-Radiation',
    specId: 'J-16D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-58USHKE', 'KH-58USHKE', 'AGM-88G', 'SAP-14-POD', 'SAPSAN-E'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER', 'HEAVY_PYLON_FAIRINGS'],
    desc: 'Dedicated IADS radar breaker hauling 6 anti-EMCON ARMs beneath a 115 km Tarantul jamming umbrella.'
  },
  'J-16D Red Eagle Decoy & Recon Screen': {
    name: 'J-16D Red Eagle Decoy & Recon Screen',
    specId: 'J-16D',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['KHIBINY-L175', 'TARPS-RECON-POD', 'TALD-DECOY', 'ADM-160B', 'PL-15-HOJ', 'R-74M2', 'ALE-55'],
    upgrades: ['MALD_DECOY_SYSTEM', 'EXPANDED_CM_DISPENSER', 'ADAPTIVE_ECCM_SUITE', 'EOTS_DUAL_OPTICS'],
    desc: 'Forward electronic screen deploying ITALD, MALD, and FOTD decoys while mapping ground traps with TARPS.'
  },
  'EA-36 Barricader Stealth ASPJ & HOJ': {
    name: 'EA-36 Barricader Stealth ASPJ & HOJ',
    specId: 'EA-36',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'DE-PULSE',
    weapons: ['AN-ALQ-165', 'AIM-260B-HOJ', 'AIM-9X-B3', 'JNAAM', 'AN-ALQ-218-POD', 'BRITECLOUD-POD'],
    upgrades: ['RAM_NANO_COATING', 'GAN_AESA_CORE', 'ADAPTIVE_ECCM_SUITE', 'SUPERCRUISE_VCE'],
    desc: 'Stealth EW dominance flagship combining 60% innate jamming, internal ASPJ, AIM-260B HOJ, and JNAAM ramjets.'
  },
  'EA-36 Barricader Stealth SEAD & Harop': {
    name: 'EA-36 Barricader Stealth SEAD & Harop',
    specId: 'EA-36',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'PLSL_LIGHT',
    weapons: ['SPEAR-EW', 'AGM-88G', 'HAROP-AL', 'AN-ALQ-249', 'AN-AAQ-33', 'TALD-DECOY'],
    upgrades: ['SEAD_HTS_POD', 'MITL_DATALINK_TRANSCEIVER', 'TFR_TERRAIN_RADAR', 'DIRCM_IR_TURRET'],
    desc: 'Heavy IADS suppression Barricader combining internal SPEAR-EW and AARGM-ERs with Harop drones and Sniper XR.'
  },
  'EA-36 Barricader Fleet Decoy & Recon Hub': {
    name: 'EA-36 Barricader Fleet Decoy & Recon Hub',
    specId: 'EA-36',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'M61A2',
    weapons: ['AN-ALQ-165', 'ADM-160B', 'AIM-260B-HOJ', 'AN-ALQ-249', 'TARPS-RECON-POD', 'AN-ASG-34', 'ALE-55'],
    upgrades: ['MADL_BATTLE_LINK', 'MALD_DECOY_SYSTEM', 'DAS_360_OPTIC', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Theater sensor and EW hub combining 68 km TARPS recon, Legion IRST, NGJ jamming, and 4x MALD decoys.'
  },
  'Eurofighter Tranche 4 Electronic Attack': {
    name: 'Eurofighter Tranche 4 Electronic Attack',
    specId: 'TYPHOON-T4',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['AN-ALQ-249', 'SPEAR-EW', 'METEOR', 'IRIS-T'],
    upgrades: ['ADAPTIVE_ECCM_SUITE', 'SEAD_HTS_POD', 'GAN_AESA_CORE', 'EOTS_DUAL_OPTICS'],
    desc: 'ECRS Mk2 Typhoon pairing 25% innate EW and NGJ pod suppression with SPEAR-EW and 140 deg Meteor cover.'
  },
  'Eurofighter Tranche 4 Wild Weasel Escort': {
    name: 'Eurofighter Tranche 4 Wild Weasel Escort',
    specId: 'TYPHOON-T4',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'BK-27',
    weapons: ['ALARM-II', 'AGM-88G', 'AN-ALQ-218-POD', 'AN-ALQ-131', 'BRITECLOUD-POD', 'ASRAAM'],
    upgrades: ['SEAD_HTS_POD', 'TFR_TERRAIN_RADAR', 'DIRCM_IR_TURRET', 'ADAPTIVE_ECCM_SUITE'],
    desc: 'Agile Tranche 4 SEAD escort hunting ground emitters with ALARM Mk2, AARGM-ER, and ELINT tracking.'
  },
  'J-20S Stealth EW Command & Decoy': {
    name: 'J-20S Stealth EW Command & Decoy',
    specId: 'J-20S',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['AN-ALQ-165', 'ADM-160B', 'PL-15-HOJ', 'AN-ALQ-249', 'PL-10'],
    upgrades: ['RAM_NANO_COATING', 'MALD_DECOY_SYSTEM', 'ADAPTIVE_ECCM_SUITE', 'MADL_BATTLE_LINK'],
    desc: 'Twin-seat stealth EW coordinator pairing internal ASPJ and MALD decoys with Home-On-Jam PL-15s.'
  },
  'J-20S Twin-Seat Stealth DEAD & ELINT': {
    name: 'J-20S Twin-Seat Stealth DEAD & ELINT',
    specId: 'J-20S',
    roleCategory: 'SEAD & EW',
    chosenGunId: 'GSH-30-1',
    weapons: ['KH-58USHKE', 'SPEAR-EW', 'AN-ALQ-218-POD', 'SAPSAN-E', 'TALD-DECOY'],
    upgrades: ['SEAD_HTS_POD', 'RAM_NANO_COATING', 'TFR_TERRAIN_RADAR', 'MITL_DATALINK_TRANSCEIVER'],
    desc: 'Low-observable twin-crew DEAD lead firing internal Kh-58UShKE and SPEAR-EW behind ITALD decoy gliders.'
  }
};
