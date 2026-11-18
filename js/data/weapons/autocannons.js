/**
 * js/data/weapons/autocannons.js - Built-in conventional ballistic aircraft autocannons and heavy CAS tank-buster guns.
 */

window.AUTOCANNONS_BALLISTIC = {
  'M61A2': {
    id: 'M61A2', name: 'M61A2 Vulcan 20mm Gatling', caliber: '20mm Rotary', gunGroup: 'INTERNAL',
    rpm: 6000, rangeKm: 4.6, damagePerSec: 2.8, roundsPerBurst: 4, damagePerRound: 0.35,
    damagePerBurst: 1.40, burstCooldown: 1.6, ammoPerBurst: 4, coneAngleDeg: 55, mass: 115,
    tracerColor: '#fbbf24', badge: '55 DEG SNAPSHOT CONE', defaultAmmo: 24,
    groundDamageMult: 1.0, armorPiercing: 0.30,
    kineticConcussion: 0.30, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: 'High-cyclic 20mm Gatling firing a rapid 4-round burst (1.40 HP total, 1.6s reload). Compact 24-round magazine allows 6 concentrated bursts. Zero thermal bloom preserves VLO stealth; 100% cloud penetration.'
  },
  'GSH-30-1': {
    id: 'GSH-30-1', name: 'GSh-30-1 30mm Autocannon', caliber: '30mm Heavy', gunGroup: 'INTERNAL',
    rpm: 1800, rangeKm: 5.2, damagePerSec: 3.4, roundsPerBurst: 3, damagePerRound: 0.55,
    damagePerBurst: 1.65, burstCooldown: 1.8, ammoPerBurst: 3, coneAngleDeg: 38, mass: 46,
    tracerColor: '#f97316', badge: '30MM HIGH-EXPLOSIVE', defaultAmmo: 18,
    groundDamageMult: 1.25, armorPiercing: 0.55,
    kineticConcussion: 0.35, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: 'Heavy 30mm cannon firing a punchy 3-round high-explosive burst (1.65 HP total, 1.8s reload). 18-round capacity permits 6 high-impact bursts. Heavy kinetic knockback drains target energy; unaffected by clouds.'
  },
  'BK-27': {
    id: 'BK-27', name: 'BK-27 27mm Revolver Cannon', caliber: '27mm Revolver', gunGroup: 'INTERNAL',
    rpm: 1700, rangeKm: 5.0, damagePerSec: 3.0, roundsPerBurst: 4, damagePerRound: 0.38,
    damagePerBurst: 1.52, burstCooldown: 1.7, ammoPerBurst: 4, coneAngleDeg: 42, mass: 100,
    tracerColor: '#facc15', badge: '27MM REVOLVER CANNON', defaultAmmo: 24,
    groundDamageMult: 1.20, armorPiercing: 0.50,
    kineticConcussion: 0.32, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: 'Revolver cannon balancing high muzzle velocity with a tight 4-round burst (1.52 HP total, 1.7s reload). 24 rounds allow 6 concentrated bursts. Zero thermal signature and 100% all-weather penetration.'
  },
  'GAU-12': {
    id: 'GAU-12', name: 'GAU-12/U 25mm Equalizer CAS', caliber: '25mm 5-Barrel Rotary', gunGroup: 'INTERNAL',
    rpm: 3600, rangeKm: 5.2, damagePerSec: 3.8, roundsPerBurst: 4, damagePerRound: 0.45,
    damagePerBurst: 1.80, burstCooldown: 1.6, ammoPerBurst: 4, coneAngleDeg: 48, mass: 122,
    tracerColor: '#38bdf8', badge: '25MM 5-BARREL CAS EQUALIZER', defaultAmmo: 36,
    lockedTo: ['AV-8B-PLUS', 'A-16', 'F-16XL', 'F-16V', 'F-18E', 'F-35A'],
    groundDamageMult: 1.55, armorPiercing: 0.85,
    kineticConcussion: 0.35, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: '5-barrel 25mm CAS rotary cannon firing 4-round API bursts (1.80 HP base, 1.55x ground damage, 1.6s reload). 36-round drum sustains 9 strafing passes against armored vehicles and AAA.'
  },
  'GAU-13': {
    id: 'GAU-13', name: 'GAU-13/A 30mm 4-Barrel CAS Gatling', caliber: '30mm 4-Barrel Gatling', gunGroup: 'INTERNAL',
    rpm: 2400, rangeKm: 5.6, damagePerSec: 4.5, roundsPerBurst: 4, damagePerRound: 0.56,
    damagePerBurst: 2.24, burstCooldown: 1.9, ammoPerBurst: 4, coneAngleDeg: 45, mass: 150,
    tracerColor: '#facc15', badge: '30MM HIGH-SPEED CAS GATLING', defaultAmmo: 40,
    lockedTo: ['A-16', 'F-16XL', 'A-10C', 'F-15E'],
    groundDamageMult: 1.65, armorPiercing: 0.90,
    kineticConcussion: 0.42, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: 'Lightweight 4-barrel derivative of the GAU-8 built for high-speed supersonic CAS aircraft (2.24 HP base, 1.65x vs ground, 40 rounds for 10 heavy armor-piercing bursts).'
  },
  'GSH-30-2': {
    id: 'GSH-30-2', name: 'GSh-30-2 Twin 30mm Tank-Buster', caliber: '30mm Twin Gast', gunGroup: 'INTERNAL',
    rpm: 3000, rangeKm: 5.6, damagePerSec: 4.4, roundsPerBurst: 4, damagePerRound: 0.55,
    damagePerBurst: 2.20, burstCooldown: 1.8, ammoPerBurst: 4, coneAngleDeg: 44, mass: 115,
    tracerColor: '#fb923c', badge: 'TWIN 30MM ARMOR-PIERCING', defaultAmmo: 40,
    lockedTo: ['Su-39', 'Su-25SM3', 'Su-34', 'Su-24M2', 'MiG-27K'],
    groundDamageMult: 1.65, armorPiercing: 0.90,
    kineticConcussion: 0.40, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: 'Heavy twin-barrel 30mm Frogfoot tank-buster cannon firing 4-round API bursts (2.20 HP base, 1.65x vs ground, 40 rounds for 10 bursts). Shreds armored SAMs and AAA batteries.'
  },
  'GAU-8': {
    id: 'GAU-8', name: 'GAU-8/A Avenger 30mm Gatling', caliber: '30mm Heavy Gatling', gunGroup: 'INTERNAL',
    rpm: 3900, rangeKm: 5.8, damagePerSec: 4.8, roundsPerBurst: 5, damagePerRound: 0.48,
    damagePerBurst: 2.40, burstCooldown: 2.0, ammoPerBurst: 5, coneAngleDeg: 44, mass: 281,
    tracerColor: '#ef4444', badge: '30MM ARMOR-PIERCING', defaultAmmo: 40,
    lockedTo: ['A-10C', 'Su-34', 'Su-25SM3', 'F-16XL', 'A-16'],
    groundDamageMult: 1.65, armorPiercing: 0.90,
    kineticConcussion: 0.45, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: '7-barrel hydraulic Gatling firing 5-round depleted-uranium bursts (2.40 HP base, 1.65x ground damage, 2.0s reload). 40-round drum delivers 8 armor-piercing bursts.'
  },
  'GSH-6-30': {
    id: 'GSH-6-30', name: 'GSh-6-30 30mm 6-Barrel Rotary', caliber: '30mm 6-Barrel Rotary', gunGroup: 'INTERNAL',
    rpm: 5000, rangeKm: 6.0, damagePerSec: 5.2, roundsPerBurst: 5, damagePerRound: 0.50,
    damagePerBurst: 2.50, burstCooldown: 2.0, ammoPerBurst: 5, coneAngleDeg: 40, mass: 160,
    tracerColor: '#f97316', badge: '30MM 6-BARREL CAS ROTARY', defaultAmmo: 40,
    lockedTo: ['MiG-27K', 'Su-39', 'Su-25SM3'],
    groundDamageMult: 1.70, armorPiercing: 0.92,
    kineticConcussion: 0.45, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: 'High-cyclic 6-barrel 30mm rotary cannon engineered for supersonic MiG-27K gun runs (2.50 HP base, 1.70x vs ground, 6.0 km reach, 40 rounds for 8 bursts).'
  },
  'GAU-22': {
    id: 'GAU-22', name: 'GAU-22/A 25mm Equalizer', caliber: '25mm 4-Barrel', gunGroup: 'INTERNAL',
    rpm: 3300, rangeKm: 4.8, damagePerSec: 2.9, roundsPerBurst: 4, damagePerRound: 0.38,
    damagePerBurst: 1.52, burstCooldown: 1.6, ammoPerBurst: 4, coneAngleDeg: 48, mass: 105,
    tracerColor: '#38bdf8', badge: 'STEALTH BORESIGHT 25MM', defaultAmmo: 20,
    groundDamageMult: 1.15, armorPiercing: 0.45,
    kineticConcussion: 0.32, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: '4-barrel Gatling engineered for stealth bays firing a 4-round burst (1.52 HP total, 1.6s reload). 20-round magazine grants 5 precision bursts. Zero thermal emission preserves stealth.'
  },
  'GSH-23L': {
    id: 'GSH-23L', name: 'GSh-23L Twin 23mm Autocannon', caliber: '23mm Twin', gunGroup: 'INTERNAL',
    rpm: 3400, rangeKm: 4.2, damagePerSec: 2.4, roundsPerBurst: 4, damagePerRound: 0.32,
    damagePerBurst: 1.28, burstCooldown: 1.5, ammoPerBurst: 4, coneAngleDeg: 52, mass: 50,
    tracerColor: '#fb923c', badge: '52 DEG TWIN SNAPSHOT', defaultAmmo: 20,
    groundDamageMult: 1.0, armorPiercing: 0.30,
    kineticConcussion: 0.25, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: 'Gast-principle twin 23mm cannon firing rapid 4-round bursts (1.28 HP total, 1.5s reload). 20 rounds provide 5 dogfight snapshot bursts. Generous 52-degree spread with zero thermal bloom.'
  },
  'MICRO_GUN': {
    id: 'MICRO_GUN', name: 'UCAV Micro-Gun 12.7mm', caliber: '12.7mm Lightweight', gunGroup: 'INTERNAL',
    rpm: 2600, rangeKm: 3.6, damagePerSec: 1.8, roundsPerBurst: 4, damagePerRound: 0.22,
    damagePerBurst: 0.88, burstCooldown: 1.3, ammoPerBurst: 4, coneAngleDeg: 60, mass: 35,
    tracerColor: '#a855f7', badge: '60 DEG UCAV SNAPSHOT', defaultAmmo: 16,
    groundDamageMult: 1.0, armorPiercing: 0.20,
    kineticConcussion: 0.20, thermalBloom: 1.0, cloudScattering: 0.0,
    desc: 'Ultra-wide 60-degree cone machine gun firing 4-round bursts (0.88 HP total, 1.3s reload). 16-round lightweight magazine permits 4 snapshot bursts with zero electrical generator drain.'
  }
};

window.AUTOCANNONS_CATALOG = Object.assign(
  window.AUTOCANNONS_CATALOG || {},
  window.AUTOCANNONS_BALLISTIC
);
