/**
 * js/data/weapons/targetingpods.js - Optical targeting, passive IRST tracking, ESM ELINT, and ground recon pods.
 */

window.WEAPONS_TARGETING_PODS = {
  'LANTIRN-POD': {
    id: 'LANTIRN-POD', name: 'AN/AAQ-14 LANTIRN Strike Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 245, cost: 0.5, rangeKm: 32.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.15, spotRangeKm: 32.0, cloudMitigation: 0.18, exposesDecoys: true,
    trait: 'LASER_CCIP_POD', traitBadge: '+15% A2G Pk & 32KM RECON',
    behaviorDesc: 'Budget night-attack thermal camera and laser targeter pod. Adds +15% A2G strike accuracy and exposes RF radar decoys out to 32 km.',
    sigmaPylon: 0.05, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'Economical 1-slot low-altitude FLIR targeting pod ($0.5M) for early interdictors and light attack aircraft.'
  },
  'AN-AAQ-28': {
    id: 'AN-AAQ-28', name: 'AN/AAQ-28 LITENING Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 200, cost: 0.8, rangeKm: 38.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.18, spotRangeKm: 38.0, cloudMitigation: 0.25, exposesDecoys: true,
    trait: 'LASER_CCIP_POD', traitBadge: '+18% A2G Pk & 38KM RECON',
    behaviorDesc: 'Optical thermal camera and laser designator pod. Boosts all LGB, rocket, bomb, and ATGM accuracy by +18% and exposes RF radar decoys within 38 km.',
    sigmaPylon: 0.04, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'Compact 1-slot tactical targeting pod providing laser designation, CCIP bomb computation, and decoy spotting.'
  },
  'SAPSAN-E': {
    id: 'SAPSAN-E', name: 'Sapsan-E Optical Targeting Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 250, cost: 1.0, rangeKm: 44.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.20, spotRangeKm: 44.0, cloudMitigation: 0.32, exposesDecoys: true,
    trait: 'OPTICAL_RECON_POD', traitBadge: '+20% A2G Pk & 44KM RECON',
    behaviorDesc: 'Day/night camera and laser targeting pod. Grants +20% A2G accuracy and exposes both Radar and Thermal Decoys out to 44 km.',
    sigmaPylon: 0.06, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'All-weather optical targeting pod providing +20% A2G guidance boost and 44 km ground decoy spotting.'
  },
  'AN-ASQ-228': {
    id: 'AN-ASQ-228', name: 'AN/ASQ-228 ATFLIR Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 195, cost: 1.2, rangeKm: 48.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.22, spotRangeKm: 48.0, cloudMitigation: 0.38, exposesDecoys: true,
    trait: 'CARRIER_ATFLIR_POD', traitBadge: '+22% A2G Pk & 48KM RECON',
    behaviorDesc: 'Lightweight 195 kg naval thermal camera and laser tracker. Boosts A2G accuracy by +22%, cuts cloud scatter by 38%, and exposes Thermal Decoys at 48 km.',
    sigmaPylon: 0.05, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'Carrier-certified advanced FLIR targeting pod enhancing precision strike accuracy and optical target recognition.'
  },
  'DAMOCLES-POD': {
    id: 'DAMOCLES-POD', name: 'Thales Damocles Targeting Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 265, cost: 1.4, rangeKm: 53.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.24, spotRangeKm: 53.0, cloudMitigation: 0.44, exposesDecoys: true,
    trait: 'LONG_STANDOFF_TGP', traitBadge: '+24% A2G Pk & 53KM RECON',
    behaviorDesc: 'High-definition day/night laser targeting pod. Grants +24% A2G accuracy, cuts cloud laser attenuation by 44%, and exposes decoys out to 53 km.',
    sigmaPylon: 0.05, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'Long-range multirole targeting pod tailored for Rafale, Mirage, and Tornado strike missions.'
  },
  'AN-AAQ-33': {
    id: 'AN-AAQ-33', name: 'AN/AAQ-33 Sniper XR Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 202, cost: 1.7, rangeKm: 58.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.28, spotRangeKm: 58.0, cloudMitigation: 0.55, exposesDecoys: true,
    trait: 'SNIPER_XR_POD', traitBadge: '+28% A2G Pk & 58KM RECON',
    behaviorDesc: 'Top-tier stabilized camera and laser sniper pod. Adds +28% A2G Pk, cuts cloud laser scattering by 55%, and exposes all decoys and silent SHORAD at 58 km.',
    sigmaPylon: 0.04, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'Long-standoff precision targeting pod ($1.7M) maximizing laser bomb reach and long-range optical decoy detection.'
  },
  'AN-ASG-34': {
    id: 'AN-ASG-34', name: 'AN/ASG-34 Legion IRST + Laser Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 230, cost: 1.8, rangeKm: 56.0, damage: 0, isTargetingPod: true, grantsIRST: true, irstRangeKm: 32.0, airTrackSpeedMult: 1.35, a2aPkBonus: 0.05,
    a2gPkBonus: 0.20, spotRangeKm: 56.0, cloudMitigation: 0.35, exposesDecoys: true,
    trait: 'DUAL_AIR_GROUND_IRST', traitBadge: 'PASSIVE IRST + 56KM RECON',
    behaviorDesc: 'Combined passive air-to-air infrared tracker (IRST) and ground laser designator. Grants silent anti-stealth air tracking plus +20% A2G Pk and 56 km ground recon.',
    sigmaPylon: 0.05, category: 'POD', podGroup: 'RECON_IRST', a2gGroup: 'TARGETING_POD',
    desc: 'Dual-role IRST and laser targeting pod providing silent air-to-air stealth detection alongside ground decoy exposure.'
  },
  'PIRATE-IRST-POD': {
    id: 'PIRATE-IRST-POD', name: 'Skyward-G Passive IRST Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 110, cost: 0.9, rangeKm: 40.0, damage: 0, isTargetingPod: true, grantsIRST: true, irstRangeKm: 30.0, airTrackSpeedMult: 1.25, a2aPkBonus: 0.04,
    a2gPkBonus: 0.08, spotRangeKm: 40.0, cloudMitigation: 0.15, exposesDecoys: true,
    trait: 'PASSIVE_IRST_POD', traitBadge: '1-SLOT PASSIVE IRST',
    behaviorDesc: 'Lightweight passive infrared air-to-air search pod. Enables silent anti-stealth and anti-notch tracking plus +8% A2G Pk and 40 km optical ground spotting.',
    sigmaPylon: 0.03, category: 'POD', podGroup: 'AIR_COMBAT',
    desc: 'Compact 1-slot passive infrared tracking pod built for legacy 4th-Gen interceptors and light fighters.'
  },
  'IRST-21-POD': {
    id: 'IRST-21-POD', name: 'AN/ASG-34B IRST21 Air Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 160, cost: 1.2, rangeKm: 50.0, damage: 0, isTargetingPod: true, grantsIRST: true, irstRangeKm: 34.0, airTrackSpeedMult: 1.40, a2aPkBonus: 0.05,
    a2gPkBonus: 0.0, spotRangeKm: 32.0, cloudMitigation: 0.0, exposesDecoys: false,
    trait: 'PASSIVE_IRST_POD', traitBadge: 'LONG-WAVE AIR IRST',
    behaviorDesc: 'Dedicated passive infrared air-to-air sensor pod. Detects stealth fighters silently at 28 km burn-through and keeps tracking targets when they try to Doppler notch.',
    sigmaPylon: 0.04, category: 'POD', podGroup: 'AIR_COMBAT',
    desc: 'Centerline IRST21 pod upgrading F/A-18E, F-15EX, and F-16V airframes with silent stealth tracking.'
  },
  'AN-ALQ-218-POD': {
    id: 'AN-ALQ-218-POD', name: 'AN/ALQ-218 Tactical ELINT Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 215, cost: 1.3, rangeKm: 135.0, damage: 0, isTargetingPod: true, grantsESM: true, armRangeBoost: 1.15,
    a2gPkBonus: 0.0, spotRangeKm: 135.0, cloudMitigation: 0.0, exposesDecoys: false,
    trait: 'PASSIVE_ELINT_ESM', traitBadge: '135KM ESM + 15% ARM RNG',
    behaviorDesc: 'Passive radar-warning (ESM/ELINT) receiver pod. Immediately exposes active enemy ground SAMs and radars out to 135 km and extends Anti-Radiation Missile range by +15%.',
    sigmaPylon: 0.05, category: 'POD', podGroup: 'RECON_IRST',
    desc: 'Passive radar-detecting pod converting multirole and strike fighters into agile SEAD radar hunters.'
  },
  'TARPS-RECON-POD': {
    id: 'TARPS-RECON-POD', name: 'RAPTOR / ATARS Standoff Recon Pod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 480, cost: 1.5, rangeKm: 68.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.14, spotRangeKm: 68.0, cloudMitigation: 0.30, exposesDecoys: true,
    trait: 'STANDOFF_SAR_RECON', traitBadge: '68KM GROUND RECON +14% Pk',
    behaviorDesc: 'Long-range ground-mapping radar and optical reconnaissance pod. Exposes hidden decoys and silent optical SHORAD out to 68 km while adding +14% A2G Pk and 30% cloud mitigation.',
    sigmaPylon: 0.08, category: 'POD', podGroup: 'RECON_IRST', a2gGroup: 'TARGETING_POD',
    desc: 'Long-range aerial recon pod (68 km) mapping enemy ground defenses and spotting radar decoys from safe distance.'
  },
  'OLS-35-POD': {
    id: 'OLS-35-POD', name: 'OLS-35M Air Combat IRST Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 145, cost: 1.0, rangeKm: 36.0, damage: 0, isTargetingPod: true, grantsIRST: true,
    irstRangeKm: 34.0, airTrackSpeedMult: 1.30, a2aPkBonus: 0.05,
    a2gPkBonus: 0.06, spotRangeKm: 36.0, cloudMitigation: 0.12, exposesDecoys: true,
    trait: 'AIR_COMBAT_IRST', traitBadge: '34KM IRST +5% A2A Pk',
    behaviorDesc: 'Compact air-to-air optical/infrared tracker and laser rangefinder pod. Burns through stealth out to 34 km, speeds air classification by +30%, and adds +5% A2A lock Pk.',
    sigmaPylon: 0.03, category: 'POD', podGroup: 'AIR_COMBAT',
    desc: 'Affordable 1-slot air combat IRST pod for light and legacy fighters hunting stealth targets.'
  },
  'LITENING-AT-A2A': {
    id: 'LITENING-AT-A2A', name: 'LITENING-5 Air-Combat EO Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 190, cost: 1.2, rangeKm: 42.0, damage: 0, isTargetingPod: true, grantsIRST: true,
    irstRangeKm: 30.0, airTrackSpeedMult: 1.45, a2aPkBonus: 0.06,
    a2gPkBonus: 0.14, spotRangeKm: 42.0, cloudMitigation: 0.25, exposesDecoys: true,
    trait: 'AIR_COMBAT_EO_ID', traitBadge: '+45% AIR ID & +6% A2A Pk',
    behaviorDesc: 'Tactical air-to-air optical identification pod for Type S multirole pylons. Speeds target classification by +45%, adds 30 km passive IRST tracking, +6% A2A Pk, and +14% A2G Pk.',
    sigmaPylon: 0.04, category: 'POD', podGroup: 'AIR_COMBAT', a2gGroup: 'TARGETING_POD',
    desc: 'Dual-role air combat identification and precision optical pod tailored for agile multirole fighters.'
  },
  'SNIPER-ATP-A2A': {
    id: 'SNIPER-ATP-A2A', name: 'AN/AAQ-33A Sniper Air-Track Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 205, cost: 1.5, rangeKm: 52.0, damage: 0, isTargetingPod: true, grantsIRST: true,
    irstRangeKm: 32.0, airTrackSpeedMult: 1.55, a2aPkBonus: 0.07,
    a2gPkBonus: 0.16, spotRangeKm: 52.0, cloudMitigation: 0.35, exposesDecoys: true,
    trait: 'AIR_COMBAT_TWS_OPTIC', traitBadge: '+55% AIR ID & +7% A2A Pk',
    behaviorDesc: 'Long-range air-to-air optical recognition pod. Accelerates air track ID by +55%, provides 32 km passive IRST burn-through, +7% A2A Pk, and 52 km ground decoy spotting.',
    sigmaPylon: 0.04, category: 'POD', podGroup: 'AIR_COMBAT', a2gGroup: 'TARGETING_POD',
    desc: 'High-zoom air combat electro-optical tracker classifying distant bogeys and stale contacts rapidly.'
  },
  'LEGION-POD-BLK2': {
    id: 'LEGION-POD-BLK2', name: 'Legion Block II Networked IRST Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 225, cost: 2.1, rangeKm: 46.0, damage: 0, isTargetingPod: true, grantsIRST: true,
    irstRangeKm: 38.0, airTrackSpeedMult: 1.65, a2aPkBonus: 0.08, a2aEccmBonus: 0.20, grantsDatalinkRelay: true,
    a2gPkBonus: 0.10, spotRangeKm: 46.0, cloudMitigation: 0.20, exposesDecoys: true,
    trait: 'NETWORKED_AIR_IRST', traitBadge: '38KM IRST + RELAY +8% A2A',
    behaviorDesc: 'Networked long-wave IRST pod with optical crosslink relay. Tracks stealth aircraft silently at 38 km, speeds ID by +65%, adds +8% A2A Pk, +20% ECCM, and boosts command datalink.',
    sigmaPylon: 0.04, category: 'POD', podGroup: 'AIR_COMBAT',
    desc: 'Next-gen networked air superiority IRST pod built to counter stealth and heavy ECM brackets.'
  },
  'EOTS-POD-VLO': {
    id: 'EOTS-POD-VLO', name: 'Conformal EOTS-X Internal Air Sensor', slots: 1, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 175, cost: 2.3, rangeKm: 48.0, damage: 0, isTargetingPod: true, grantsIRST: true,
    irstRangeKm: 36.0, airTrackSpeedMult: 1.70, a2aPkBonus: 0.09, a2aEccmBonus: 0.25,
    a2gPkBonus: 0.12, spotRangeKm: 48.0, cloudMitigation: 0.30, exposesDecoys: true,
    trait: 'INTERNAL_VLO_EOTS', traitBadge: 'INTERNAL 36KM IRST +9% A2A',
    behaviorDesc: 'Flush internal-bay air combat EOTS sensor. Fits inside stealth weapon bays with near-zero RCS penalty, delivering 36 km IRST stealth tracking, +70% ID speed, +9% A2A Pk, and +25% ECCM.',
    sigmaPylon: 0.015, category: 'POD', podGroup: 'AIR_COMBAT',
    desc: 'VLO internal-bay air combat sensor module giving stealth airframes long-range passive optical tracking.'
  },
  'COBRA-STARE-360': {
    id: 'COBRA-STARE-360', name: 'Cobra-Stare 360 Optical Combat Pod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 340, cost: 2.6, rangeKm: 44.0, damage: 0, isTargetingPod: true, grantsIRST: true,
    irstRangeKm: 42.0, airTrackSpeedMult: 1.85, a2aPkBonus: 0.10, a2aEccmBonus: 0.30, grantsDatalinkRelay: true, a2aEvasionBonus: 0.08,
    a2gPkBonus: 0.08, spotRangeKm: 44.0, cloudMitigation: 0.25, exposesDecoys: true,
    trait: 'WIDE_APERTURE_AIR_POD', traitBadge: '42KM IRST +10% A2A +8% DODGE',
    behaviorDesc: 'Heavy 2-slot wide-aperture optical combat pod. Delivers 42 km passive stealth burn-through, +85% air ID speed, +10% A2A Pk, +30% ECCM, datalink relay, and +8% missile-approach dodge.',
    sigmaPylon: 0.06, category: 'POD', podGroup: 'AIR_COMBAT',
    desc: 'Heavy air-dominance optical suite converting heavy interceptors into long-reach stealth hunters.'
  }
};
