/**
 * js/data/weapons/a2acannons.js - External air-to-air ballistic gunpods and tactical directed-energy laser pods.
 */

window.WEAPONS_A2A_CANNONS = {
  'DEFA-554-POD': {
    id: 'DEFA-554-POD', name: 'CC422 DEFA 30mm Gunpod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 390, cost: 0.5, rangeKm: 4.5, speedMach: 3.0, seeker: 'DIRECT_FIRE',
    trait: 'EXTRA_GUN_BATTERY', traitBadge: '1-SLOT 30MM POD',
    behaviorDesc: 'Lightweight 1-slot 30mm revolver cannon pod firing 3-round HEI bursts (1.65 HP total, 3.0 HP/s, 1.6s reload). Ideal for Mirage, Jaguar, Tejas, and light attackers.',
    damage: 2, roundsPerBurst: 3, damagePerRound: 0.55, damagePerBurst: 1.65, damagePerSec: 3.0,
    burstCooldown: 1.6, ammoCount: 18, ammoPerBurst: 3, isGunpod: true, sigmaPylon: 0.07,
    category: 'GUN', gunGroup: 'A2A_POD', tracerColor: '#facc15',
    allowedAirframes: [
      'Mirage-2000', 'Mirage-2000D', 'Mirage-F1EQ', 'Mirage-4000', 'Rafale-C', 'Rafale-M', 'Tejas-MK2', 'Tejas-MK1A',
      'JF-17-B3', 'FA-50-B20', 'F-5E-TIGER', 'A-29B', 'Tornado-GR4', 'Tornado-ECR', 'JAS-39E', 'JAS-39C',
      'F-16V', 'F-16C-B52', 'F-18E', 'F-18C-PLUS', 'TYPHOON-T4', 'JAGUAR-GR3', 'AV-8B-PLUS', 'A-16', 'F-16XL'
    ],
    desc: 'Compact 1-slot 30mm revolver gunpod (18 rounds, 6 bursts) certified for delta fighters and fast CAS platforms.'
  },
  'SUU-23A': {
    id: 'SUU-23A', name: 'SUU-23/A 20mm Vulcan Gunpod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 780, cost: 0.6, rangeKm: 4.8, speedMach: 3.2, seeker: 'DIRECT_FIRE',
    trait: 'EXTRA_GUN_BATTERY', traitBadge: '20MM ROTARY BATTERY',
    behaviorDesc: '20mm 6-barrel Vulcan rotary cannon pod firing 4-round bursts (1.40 HP total, 2.8 HP/s, 1.6s reload). Mounts on Western hardpoints.',
    damage: 2, roundsPerBurst: 4, damagePerRound: 0.35, damagePerBurst: 1.40, damagePerSec: 2.8,
    burstCooldown: 1.6, ammoCount: 20, ammoPerBurst: 4, isGunpod: true, sigmaPylon: 0.10,
    category: 'GUN', gunGroup: 'A2A_POD', tracerColor: '#fbbf24',
    allowedAirframes: [
      'F-16V', 'F-16C-B52', 'F-18E', 'F-18C-PLUS', 'F-18F', 'F-2A', 'F-4E-2020', 'F-5E-TIGER', 'FA-50-B20',
      'Mirage-2000', 'Mirage-2000D', 'Mirage-4000', 'F-15EX', 'F-15E', 'F-15C', 'F-15J-JSI', 'F-14D', 'F-14B',
      'Eurofighter', 'TYPHOON-T4', 'Rafale-C', 'Rafale-M', 'A-10C', 'B-1B', 'F-15-SMTD', 'F-15-SMT-COFFIN', 'F-111F',
      'Tornado-GR4', 'X-29A', 'ADFX-01', 'X-02S', 'KF-21', 'KF-21EX', 'XFA-36B', 'EA-36',
      'A-16', 'F-16XL', 'AV-8B-PLUS', 'JAGUAR-GR3'
    ],
    desc: 'Self-contained 20mm Vulcan Gatling pod (20 rounds, 5 bursts). Mounts on external wing or fuselage stations.'
  },
  'SPPU-22': {
    id: 'SPPU-22', name: 'SPPU-22-01 Twin 23mm Gunpod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 560, cost: 0.5, rangeKm: 4.2, speedMach: 3.0, seeker: 'DIRECT_FIRE',
    trait: 'EXTRA_GUN_BATTERY', traitBadge: 'TWIN 23MM BATTERY',
    behaviorDesc: 'Twin-barrel 23mm Gast-principle autocannon pod firing 4-round bursts (1.28 HP total, 2.4 HP/s, 1.5s reload). Certified for Eastern aircraft.',
    damage: 2, roundsPerBurst: 4, damagePerRound: 0.32, damagePerBurst: 1.28, damagePerSec: 2.4,
    burstCooldown: 1.5, ammoCount: 16, ammoPerBurst: 4, isGunpod: true, sigmaPylon: 0.08,
    category: 'GUN', gunGroup: 'A2A_POD', tracerColor: '#fb923c',
    allowedAirframes: [
      'Su-25SM3', 'Su-39', 'MiG-27K', 'Su-34', 'Su-35S', 'Su-30SM', 'Su-30MKI', 'Su-27SM3', 'Su-24M2', 'Su-24MP',
      'MiG-31BM', 'J-16', 'J-16D', 'J-15D', 'J-15T', 'J-11BG', 'J-10C', 'JF-17-B3', 'JH-7A',
      'MiG-29K', 'MiG-29SMT', 'MiG-35S', 'Tejas-MK2', 'Tejas-MK1A', 'AMCA-MK1',
      'Su-47', 'Su-37', 'Su-37-COFFIN', 'S-70', 'FC-31', 'J-35'
    ],
    desc: 'Twin 23mm autocannon pod (16 rounds, 4 bursts) certified for external hardpoints on Eastern strike fighters and Flankers.'
  },
  'GSH-6-23-POD': {
    id: 'GSH-6-23-POD', name: 'SPPU-6 Six-Barrel 23mm Pod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 840, cost: 0.8, rangeKm: 4.8, speedMach: 3.3, seeker: 'DIRECT_FIRE',
    trait: 'EXTRA_GUN_BATTERY', traitBadge: '9000 RPM ROTARY POD',
    behaviorDesc: 'Six-barrel 23mm rotary cannon pod firing 5-round high-cyclic bursts (1.90 HP total, 3.6 HP/s, 1.7s reload) for Flankers, Floggers, and Frogfoots.',
    damage: 2, roundsPerBurst: 5, damagePerRound: 0.38, damagePerBurst: 1.90, damagePerSec: 3.6,
    burstCooldown: 1.7, ammoCount: 25, ammoPerBurst: 5, isGunpod: true, sigmaPylon: 0.13,
    category: 'GUN', gunGroup: 'A2A_POD', tracerColor: '#f97316',
    allowedAirframes: ['Su-24M2', 'Su-24MP', 'Su-25SM3', 'Su-39', 'MiG-27K', 'Su-34', 'Su-35S', 'Su-30SM', 'Su-30MKI', 'Su-27SM3', 'MiG-31BM', 'J-16', 'J-15D', 'J-15T', 'J-11BG', 'JH-7A'],
    desc: 'High-rate 6-barrel 23mm Gatling pod (25 rounds, 5 bursts) devastating close dogfighters and soft ground targets.'
  },
  'GPU-5A': {
    id: 'GPU-5A', name: 'GPU-5/A 30mm Heavy Gunpod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 1350, cost: 0.8, rangeKm: 5.2, speedMach: 3.2, seeker: 'DIRECT_FIRE',
    trait: 'ARMOR_BURST', traitBadge: '30MM ROTARY BATTERY',
    behaviorDesc: 'Heavy 4-barrel 30mm rotary cannon pod firing 4-round bursts (2.00 HP total, 3.4 HP/s, 2.0s reload). Restricted to heavy strike and CAS airframes.',
    damage: 2, roundsPerBurst: 4, damagePerRound: 0.50, damagePerBurst: 2.00, damagePerSec: 3.4,
    burstCooldown: 2.0, ammoCount: 20, ammoPerBurst: 4, isGunpod: true, groundDamageMult: 1.45, armorPiercing: 0.85, sigmaPylon: 0.15,
    category: 'GUN', gunGroup: 'A2A_POD', tracerColor: '#f97316',
    allowedAirframes: [
      'A-10C', 'A-16', 'F-16XL', 'AV-8B-PLUS', 'Su-25SM3', 'Su-39', 'MiG-27K', 'Su-34', 'Su-24M2',
      'F-15EX', 'F-15E', 'F-15C', 'F-15J-JSI', 'F-18E', 'F-18F', 'F-2A', 'F-4E-2020', 'F-111F',
      'Tornado-GR4', 'J-16', 'J-11BG', 'Su-30SM', 'Su-30MKI', 'Su-27SM3', 'Su-35S', 'B-1B', 'F-15-SMTD', 'F-15-SMT-COFFIN'
    ],
    desc: 'Heavy 30mm rotary cannon pod (20 rounds, 5 bursts) restricted to reinforced external pylons on heavy strike and CAS airframes.'
  },
  'PLSL_POD': {
    id: 'PLSL_POD', name: 'PLSL Pulse Laser Pod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 650, cost: 1.6, rangeKm: 12.0, speedMach: 999.0, seeker: 'DIRECT_ENERGY',
    trait: 'EXTRA_GUN_BATTERY', traitBadge: 'PULSE LASER BATTERY',
    behaviorDesc: 'Dual coherent optical pulse laser emitter pod firing 3-pulse bursts (1.50 HP total, 2.0s reload). Requires high-voltage avionics buses.',
    damage: 2, roundsPerBurst: 3, damagePerRound: 0.50, damagePerBurst: 1.50, damagePerSec: 2.8,
    burstCooldown: 2.0, ammoCount: 15, ammoPerBurst: 3, isGunpod: true, isLaser: true, sigmaPylon: 0.12,
    category: 'GUN', gunGroup: 'ENERGY', tracerColor: '#00f0ff',
    allowedAirframes: [
      'ADF-11F', 'ADFX-01', 'CFA-44', 'X-02S', 'DARKSTAR', 'F-22C-COFFIN', 'Su-37-COFFIN', 'F-15-SMT-COFFIN',
      'F-22A', 'F-22-SUPER', 'FB-22', 'Su-57', 'J-20', 'J-20B', 'J-20S', 'F-35A', 'F-35B', 'F-35C',
      'KAAN', 'KF-21EX', 'AMCA-MK1', 'TEMPEST', 'FCAS-NGF', 'J-36', 'J-50',
      'F-15EX', 'Kizilelma', 'S-70', 'X-40', 'XFA-36B', 'EA-36'
    ],
    desc: 'Pulse laser pod (15 pulses, 5 bursts) restricted to external pylons on advanced 5th/6th-Gen platforms and superfighters.'
  },
  'DE_POD': {
    id: 'DE_POD', name: 'HEL Solid-State Laser Pod', slots: 3, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1180, cost: 2.4, rangeKm: 8.5, speedMach: 999.0, seeker: 'DIRECT_ENERGY',
    trait: 'EXTRA_GUN_BATTERY', traitBadge: 'HIGH-ENERGY LASER',
    behaviorDesc: 'High-energy solid-state thermal laser pod firing 3-pulse bursts (1.95 HP total, 2.5s reload). Requires heavy pylons on flagship superfighters.',
    damage: 3, roundsPerBurst: 3, damagePerRound: 0.65, damagePerBurst: 1.95, damagePerSec: 3.6,
    burstCooldown: 2.5, ammoCount: 12, ammoPerBurst: 3, isGunpod: true, isLaser: true, sigmaPylon: 0.20,
    category: 'GUN', gunGroup: 'ENERGY', tracerColor: '#38bdf8',
    allowedAirframes: [
      'ADF-11F', 'ADFX-01', 'CFA-44', 'X-02S', 'DARKSTAR', 'F-22C-COFFIN', 'Su-37-COFFIN', 'F-15-SMT-COFFIN',
      'F-15EX', 'Su-57', 'F-22A', 'F-22-SUPER', 'FB-22', 'J-20', 'J-20B', 'TEMPEST', 'FCAS-NGF', 'J-36', 'J-50',
      'B-21', 'Su-35S', 'X-40', 'XFA-36B'
    ],
    desc: 'High-power solid-state laser pod (12 pulses, 4 bursts) certified exclusively for external heavy pylons on experimental and 6th-gen flagships.'
  },
  'TLS_POD': {
    id: 'TLS_POD', name: 'TLS High-Energy Laser Pod', slots: 4, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1380, cost: 2.8, rangeKm: 9.0, speedMach: 999.0, seeker: 'DIRECT_ENERGY',
    trait: 'HITSCAN_THERMAL', traitBadge: 'SPEED-OF-LIGHT BEAM',
    behaviorDesc: 'Direct speed-of-light thermal hitscan beam firing 3-pulse bursts (3.0 HP total, 12 shots, 2.8s reload). Zero lead time required; scattered by clouds.',
    damage: 3, roundsPerBurst: 3, damagePerRound: 1.00, damagePerBurst: 3.0, cooldown: 2.8,
    burstCooldown: 2.8, ammoCount: 12, ammoPerBurst: 3, isLaser: true, isGunpod: true, sigmaPylon: 0.25,
    category: 'GUN', gunGroup: 'ENERGY',
    allowedAirframes: [
      'X-02S', 'Su-35S', 'Su-57', 'F-22A', 'F-22-SUPER', 'FB-22', 'B-21', 'F-15EX', 'J-20', 'J-20B', 'FC-31',
      'TEMPEST', 'FCAS-NGF', 'J-36', 'J-50', 'ADF-11F', 'CFA-44', 'DARKSTAR', 'F-22C-COFFIN', 'Su-37-COFFIN', 'ADFX-01', 'X-40', 'XFA-36B', 'EA-36'
    ],
    desc: 'High-energy chemical laser pod (12 pulses, 4 bursts) providing instantaneous thermal hitscan damage. Mounts externally on heavy pylons.'
  }
};
