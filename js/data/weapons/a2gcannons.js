/**
 * js/data/weapons/a2gcannons.js - Dedicated air-to-ground strafe and armor-piercing cannon pods.
 */

window.WEAPONS_A2G_CANNONS = {
  'M230-POD': {
    id: 'M230-POD', name: 'M230LF 30mm Chain Gun Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 240, cost: 0.4, rangeKm: 4.5, speedMach: 2.8, seeker: 'DIRECT_FIRE',
    trait: 'GROUND_STRAFE_POD', traitBadge: '30MM ANTI-ARMOR STRAFE',
    behaviorDesc: 'Lightweight 30mm chain gun pod firing 4-round HEDP bursts (1.40 HP base, 1.5x ground, 1.4s reload).',
    damage: 2, roundsPerBurst: 4, damagePerRound: 0.35, damagePerBurst: 1.40, damagePerSec: 2.5,
    burstCooldown: 1.4, ammoCount: 24, ammoPerBurst: 4, isGunpod: true, isA2GGunpod: true,
    groundDamageMult: 1.5, armorPiercing: 0.70, sigmaPylon: 0.06, category: 'GUN', gunGroup: 'A2G_POD', tracerColor: '#fbbf24',
    desc: 'Lightweight 30mm chain gun pod (24 rounds, 6 bursts) optimized for low-altitude AAA and convoy strafing.'
  },
  'UPK-23-250': {
    id: 'UPK-23-250', name: 'UPK-23-250 Twin 23mm Strafe Pod', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 280, cost: 0.4, rangeKm: 4.4, speedMach: 2.9, seeker: 'DIRECT_FIRE',
    trait: 'GROUND_STRAFE_POD', traitBadge: '1-SLOT TWIN 23MM CAS',
    behaviorDesc: 'Compact twin 23mm CAS strafe pod firing 4-round API bursts (1.44 HP base, 1.6x ground, 1.4s reload).',
    damage: 2, roundsPerBurst: 4, damagePerRound: 0.36, damagePerBurst: 1.44, damagePerSec: 2.6,
    burstCooldown: 1.4, ammoCount: 24, ammoPerBurst: 4, isGunpod: true, isA2GGunpod: true,
    groundDamageMult: 1.6, armorPiercing: 0.70, sigmaPylon: 0.07, category: 'GUN', gunGroup: 'A2G_POD', tracerColor: '#fb923c',
    desc: 'Compact 1-slot twin 23mm ground-attack pod (24 rounds, 6 bursts) built for light and fast CAS aircraft.'
  },
  'GAU-12-POD': {
    id: 'GAU-12-POD', name: 'GAU-12/U 25mm Strafe Gunpod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 680, cost: 0.6, rangeKm: 5.2, speedMach: 3.1, seeker: 'DIRECT_FIRE',
    trait: 'GROUND_STRAFE_POD', traitBadge: '25MM 5-BARREL AP POD',
    behaviorDesc: '5-barrel 25mm rotary strafe pod firing 4-round AP bursts (1.80 HP base, 1.7x ground, 1.6s reload).',
    damage: 2, roundsPerBurst: 4, damagePerRound: 0.45, damagePerBurst: 1.80, damagePerSec: 3.1,
    burstCooldown: 1.6, ammoCount: 24, ammoPerBurst: 4, isGunpod: true, isA2GGunpod: true,
    groundDamageMult: 1.7, armorPiercing: 0.85, sigmaPylon: 0.11, category: 'GUN', gunGroup: 'A2G_POD', tracerColor: '#38bdf8',
    desc: 'High-velocity 25mm 5-barrel gunpod (24 rounds, 6 bursts) engineered for low-level anti-armor strafing passes.'
  },
  'GSH-30-2K': {
    id: 'GSH-30-2K', name: 'GSh-30-2K Twin 30mm Strafe Pod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 980, cost: 0.7, rangeKm: 5.5, speedMach: 3.1, seeker: 'DIRECT_FIRE',
    trait: 'ARMOR_BURST', traitBadge: 'TWIN 30MM GROUND POD',
    behaviorDesc: 'Long-barrel twin 30mm cannon pod firing 4-round AP bursts (2.20 HP base, 1.75x ground, 1.8s reload).',
    damage: 2, roundsPerBurst: 4, damagePerRound: 0.55, damagePerBurst: 2.20, damagePerSec: 3.6,
    burstCooldown: 1.8, ammoCount: 24, ammoPerBurst: 4, isGunpod: true, isA2GGunpod: true,
    groundDamageMult: 1.75, armorPiercing: 0.90, sigmaPylon: 0.14, category: 'GUN', gunGroup: 'A2G_POD', tracerColor: '#f97316',
    desc: 'Heavy twin 30mm ground-attack cannon pod (24 rounds, 6 bursts) designed to neutralize armored SAMs and AAA batteries.'
  },
  'BK-37-POD': {
    id: 'BK-37-POD', name: 'BK-37 37mm Armor-Piercing Pod', slots: 2, slotType: 'EXTERNAL', minRating: 'Type H',
    mass: 1250, cost: 0.9, rangeKm: 5.8, speedMach: 3.5, seeker: 'DIRECT_FIRE',
    trait: 'ARMOR_PIERCING_37MM', traitBadge: '37MM TUNGSTEN PENETRATOR',
    behaviorDesc: 'High-velocity 37mm tungsten-core cannon pod firing 3-round bursts (3.00 HP base, 2.0x ground, 2.1s reload). Penetrates armored SAMs and fortified roofs.',
    damage: 3, roundsPerBurst: 3, damagePerRound: 1.00, damagePerBurst: 3.00, damagePerSec: 4.2,
    burstCooldown: 2.1, ammoCount: 18, ammoPerBurst: 3, isGunpod: true, isA2GGunpod: true,
    groundDamageMult: 2.0, armorPiercing: 1.0, isBunkerCracker: true, sigmaPylon: 0.18,
    category: 'GUN', gunGroup: 'A2G_POD', tracerColor: '#ef4444',
    allowedAirframes: [
      'A-10C', 'A-16', 'F-16XL', 'AV-8B-PLUS', 'JAGUAR-GR3', 'Su-25SM3', 'Su-39', 'MiG-27K',
      'Su-34', 'Su-24M2', 'F-15EX', 'F-15E', 'F-111F', 'F-18E', 'F-2A', 'J-16', 'Tornado-ECR', 'Tornado-GR4', 'B-1B'
    ],
    desc: 'Heavy 37mm tungsten-core armor-piercing cannon pod (18 rounds, 6 bursts) restricted to reinforced CAS and strike airframes.'
  }
};
