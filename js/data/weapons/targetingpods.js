/**
 * js/data/weapons/targetingpods.js - Optical targeting, passive IRST tracking, ESM ELINT, and ground recon pods.
 */

window.WEAPONS_TARGETING_PODS = {
  'LANTIRN-POD': {
    id: 'LANTIRN-POD', name: 'AN/AAQ-14 LANTIRN Strike Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 245, cost: 0.6, rangeKm: 34.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.16, spotRangeKm: 34.0, cloudMitigation: 0.20, exposesDecoys: true,
    trait: 'LASER_CCIP_POD', traitBadge: '+16% A2G Pk & 34KM RECON',
    behaviorDesc: 'Night-attack thermal camera and laser targeter pod. Adds +16% A2G strike accuracy and exposes ground radar decoys out to 34 km.',
    sigmaPylon: 0.05, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'Economical 1-slot low-altitude FLIR targeting pod for early interdictors and light attack aircraft.'
  },
  'AN-AAQ-28': {
    id: 'AN-AAQ-28', name: 'AN/AAQ-28 LITENING Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 200, cost: 0.8, rangeKm: 36.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.18, spotRangeKm: 36.0, cloudMitigation: 0.25, exposesDecoys: true,
    trait: 'LASER_CCIP_POD', traitBadge: '+18% A2G Pk & 36KM RECON',
    behaviorDesc: 'Optical thermal camera and laser designator pod. Boosts all LGB, rocket, bomb, and ATGM accuracy by +18% and exposes ground radar decoys within 36 km.',
    sigmaPylon: 0.04, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'Compact 1-slot tactical targeting pod providing laser designation, CCIP bomb computation, and decoy spotting.'
  },
  'SAPSAN-E': {
    id: 'SAPSAN-E', name: 'Sapsan-E Optical Targeting Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 250, cost: 1.0, rangeKm: 42.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.20, spotRangeKm: 42.0, cloudMitigation: 0.30, exposesDecoys: true,
    trait: 'OPTICAL_RECON_POD', traitBadge: '+20% A2G Pk & 42KM RECON',
    behaviorDesc: 'Day/night camera and laser targeting pod. Grants +20% A2G accuracy and identifies hidden ground threats out to 42 km.',
    sigmaPylon: 0.06, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'All-weather optical targeting pod providing +20% A2G guidance boost and 42 km ground decoy spotting.'
  },
  'AN-ASQ-228': {
    id: 'AN-ASQ-228', name: 'AN/ASQ-228 ATFLIR Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 195, cost: 1.1, rangeKm: 45.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.22, spotRangeKm: 45.0, cloudMitigation: 0.35, exposesDecoys: true,
    trait: 'CARRIER_ATFLIR_POD', traitBadge: '+22% A2G Pk & 45KM RECON',
    behaviorDesc: 'Naval high-resolution thermal camera and laser tracker. Boosts A2G accuracy by +22%, cuts cloud scatter penalties by 35%, and exposes passive SHORAD out to 45 km.',
    sigmaPylon: 0.05, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'Carrier-certified advanced FLIR targeting pod enhancing precision strike accuracy and optical target recognition.'
  },
  'DAMOCLES-POD': {
    id: 'DAMOCLES-POD', name: 'Thales Damocles Targeting Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 265, cost: 1.3, rangeKm: 52.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.24, spotRangeKm: 52.0, cloudMitigation: 0.42, exposesDecoys: true,
    trait: 'LONG_STANDOFF_TGP', traitBadge: '+24% A2G Pk & 52KM RECON',
    behaviorDesc: 'High-definition day/night laser targeting pod. Grants +24% A2G accuracy, cuts cloud laser attenuation by 42%, and exposes decoys out to 52 km.',
    sigmaPylon: 0.05, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'Long-range multirole targeting pod tailored for Rafale, Mirage, and Tornado strike missions.'
  },
  'AN-AAQ-33': {
    id: 'AN-AAQ-33', name: 'AN/AAQ-33 Sniper XR Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 202, cost: 1.4, rangeKm: 55.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.26, spotRangeKm: 55.0, cloudMitigation: 0.50, exposesDecoys: true,
    trait: 'SNIPER_XR_POD', traitBadge: '+26% A2G Pk & 55KM RECON',
    behaviorDesc: 'Long-range stabilized camera and laser sniper pod. Adds +26% A2G Pk, halves cloud laser scattering (50%), and exposes radar decoys and optical SHORAD at 55 km.',
    sigmaPylon: 0.04, category: 'POD', podGroup: 'TARGETING', a2gGroup: 'TARGETING_POD',
    desc: 'Long-standoff precision targeting pod maximizing laser bomb reach and long-range optical decoy detection.'
  },
  'AN-ASG-34': {
    id: 'AN-ASG-34', name: 'AN/ASG-34 Legion IRST + Laser Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 230, cost: 1.6, rangeKm: 58.0, damage: 0, isTargetingPod: true, grantsIRST: true,
    a2gPkBonus: 0.20, spotRangeKm: 58.0, cloudMitigation: 0.35, exposesDecoys: true,
    trait: 'DUAL_AIR_GROUND_IRST', traitBadge: 'PASSIVE IRST + 58KM RECON',
    behaviorDesc: 'Combined passive air-to-air infrared tracker (IRST) and ground laser designator. Grants silent anti-stealth air tracking plus +20% A2G Pk and 58 km ground recon.',
    sigmaPylon: 0.05, category: 'POD', podGroup: 'RECON_IRST', a2gGroup: 'TARGETING_POD',
    desc: 'Dual-role IRST and laser targeting pod providing silent air-to-air stealth detection alongside ground decoy exposure.'
  },
  'PIRATE-IRST-POD': {
    id: 'PIRATE-IRST-POD', name: 'Skyward-G Passive IRST Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 110, cost: 0.9, rangeKm: 40.0, damage: 0, isTargetingPod: true, grantsIRST: true,
    a2gPkBonus: 0.08, spotRangeKm: 40.0, cloudMitigation: 0.15, exposesDecoys: true,
    trait: 'PASSIVE_IRST_POD', traitBadge: '1-SLOT PASSIVE IRST',
    behaviorDesc: 'Lightweight passive infrared air-to-air search pod. Enables silent anti-stealth and anti-notch tracking plus +8% A2G Pk and 40 km optical ground spotting.',
    sigmaPylon: 0.03, category: 'POD', podGroup: 'RECON_IRST',
    desc: 'Compact 1-slot passive infrared tracking pod built for legacy 4th-Gen interceptors and light fighters.'
  },
  'IRST-21-POD': {
    id: 'IRST-21-POD', name: 'AN/ASG-34B IRST21 Air Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 160, cost: 1.2, rangeKm: 50.0, damage: 0, isTargetingPod: true, grantsIRST: true,
    a2gPkBonus: 0.0, spotRangeKm: 32.0, cloudMitigation: 0.0, exposesDecoys: false,
    trait: 'PASSIVE_IRST_POD', traitBadge: 'LONG-WAVE AIR IRST',
    behaviorDesc: 'Dedicated passive infrared air-to-air sensor pod. Detects stealth fighters silently at 28 km burn-through and keeps tracking targets when they try to Doppler notch.',
    sigmaPylon: 0.04, category: 'POD', podGroup: 'RECON_IRST',
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
    mass: 480, cost: 1.4, rangeKm: 65.0, damage: 0, isTargetingPod: true,
    a2gPkBonus: 0.14, spotRangeKm: 65.0, cloudMitigation: 0.30, exposesDecoys: true,
    trait: 'STANDOFF_SAR_RECON', traitBadge: '65KM GROUND RECON +14% Pk',
    behaviorDesc: 'Long-range ground-mapping radar and optical reconnaissance pod. Exposes hidden decoys and silent optical SHORAD out to 65 km while adding +14% A2G Pk and 30% cloud mitigation.',
    sigmaPylon: 0.08, category: 'POD', podGroup: 'RECON_IRST', a2gGroup: 'TARGETING_POD',
    desc: 'Long-range aerial recon pod mapping enemy ground defenses and spotting radar decoys from safe distance.'
  }
};
