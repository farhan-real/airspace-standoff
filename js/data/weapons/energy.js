/**
 * AIRSPACE STANDOFF: Pulse Lasers, Continuous Directed Energy & Hyper-Velocity Railguns
 */

window.AUTOCANNONS_ENERGY = {
  'PLSL_LIGHT': {
    id: 'PLSL_LIGHT',
    name: 'PLSL-10 Light Pulse Laser',
    caliber: 'Directed Energy (Pulse Laser)',
    rpm: 1200,
    rangeKm: 12.5,
    damagePerSec: 2.0,
    roundsPerBurst: 3,
    damagePerRound: 0.38,
    damagePerBurst: 1.14,
    burstCooldown: 1.8,
    ammoPerBurst: 9,
    coneAngleDeg: 34,
    mass: 65,
    tracerColor: '#38bdf8',
    badge: '34 DEG PULSE LASER',
    lockedTo: [
      'MQ-99', 'MQ-101',
      'F-22A', 'YF-23', 'F-35A', 'Su-57', 'J-20', 'Su-75', 'FC-31', 'J-35', 'B-21', 'F-15EX', 'F-22C-COFFIN',
      'ADF-11F', 'ADFX-01', 'CFA-44', 'X-02S', 'DARKSTAR'
    ],
    defaultAmmo: 200,
    kineticConcussion: 0.0,
    thermalBloom: 1.4,
    cloudScattering: 0.70,
    desc: 'Lightweight tactical pulse laser firing 3-pulse bursts (1.14 HP total, 1.8s reload). Focused 34-degree cone; electrical discharge increases thermal bloom and beam scatters in clouds.'
  },
  'PLSL_MED': {
    id: 'PLSL_MED',
    name: 'PLSL-20 Tactical Pulse Laser',
    caliber: 'Directed Energy (Pulse Laser)',
    rpm: 900,
    rangeKm: 15.0,
    damagePerSec: 2.8,
    roundsPerBurst: 3,
    damagePerRound: 0.50,
    damagePerBurst: 1.50,
    burstCooldown: 2.0,
    ammoPerBurst: 12,
    coneAngleDeg: 30,
    mass: 135,
    tracerColor: '#00f0ff',
    badge: '30 DEG MEDIUM LASER',
    lockedTo: [
      'MQ-99', 'MQ-101',
      'ADF-11F', 'ADFX-01', 'CFA-44', 'X-02S', 'DARKSTAR'
    ],
    defaultAmmo: 180,
    kineticConcussion: 0.0,
    thermalBloom: 1.5,
    cloudScattering: 0.75,
    desc: 'Medium-tier optical pulse emitter firing 3-pulse bursts (1.50 HP total, 2.0s reload). Narrow 30-degree beam requires close boresight tracking; scattered by cloud moisture.'
  },
  'PLSL_HEAVY': {
    id: 'PLSL_HEAVY',
    name: 'PLSL-30 Heavy Pulse Laser',
    caliber: 'Heavy Directed Energy (DEW)',
    rpm: 600,
    rangeKm: 18.0,
    damagePerSec: 3.8,
    roundsPerBurst: 3,
    damagePerRound: 0.65,
    damagePerBurst: 1.95,
    burstCooldown: 2.5,
    ammoPerBurst: 15,
    coneAngleDeg: 26,
    mass: 240,
    tracerColor: '#c084fc',
    badge: '26 DEG HEAVY LASER',
    lockedTo: [
      'ADF-11F', 'ADFX-01', 'CFA-44', 'X-02S', 'DARKSTAR'
    ],
    defaultAmmo: 140,
    kineticConcussion: 0.0,
    thermalBloom: 1.7,
    cloudScattering: 0.80,
    desc: 'High-energy optical burst weapon firing 3-pulse bursts (1.95 HP total, 2.5s reload). Tight 26-degree pencil beam; heavy capacitor discharge spikes thermal signature.'
  },
  'DE-PULSE': {
    id: 'DE-PULSE',
    name: 'Solid-State Tactical Laser (80 kW)',
    caliber: 'Directed Energy (DEW)',
    rpm: 9999,
    rangeKm: 7.5,
    damagePerSec: 3.6,
    roundsPerBurst: 3,
    damagePerRound: 0.55,
    damagePerBurst: 1.65,
    burstCooldown: 2.4,
    ammoPerBurst: 12,
    coneAngleDeg: 28,
    mass: 220,
    tracerColor: '#00f0ff',
    badge: '28 DEG PENCIL BEAM',
    lockedTo: ['F-22A', 'Su-57', 'X-02S', 'B-21', 'J-20', 'F-15EX', 'FC-31', 'YF-23', 'ADF-11F', 'DARKSTAR', 'F-22C-COFFIN', 'Su-37-COFFIN', 'F-15-SMT-COFFIN', 'CFA-44'],
    defaultAmmo: 120,
    kineticConcussion: 0.0,
    thermalBloom: 1.6,
    cloudScattering: 0.75,
    desc: '80 kW solid-state pulsed fiber laser firing 3-pulse bursts (1.65 HP total, 2.4s reload). 7.5 km instant hitscan, narrow 28-degree beam; thermal bloom compromises stealth.'
  },
  'EML_GUN': {
    id: 'EML_GUN',
    name: 'EML Hyper-Velocity Railgun',
    caliber: 'Hyper-Velocity Kinetic',
    rpm: 120,
    rangeKm: 9.5,
    damagePerSec: 2.6,
    roundsPerBurst: 2,
    damagePerRound: 0.95,
    damagePerBurst: 1.90,
    burstCooldown: 2.8,
    ammoPerBurst: 2,
    coneAngleDeg: 22,
    mass: 320,
    tracerColor: '#38bdf8',
    badge: '22 DEG PINPOINT RAILGUN',
    lockedTo: ['CFA-44', 'X-02S', 'ADF-11F'],
    defaultAmmo: 24,
    kineticConcussion: 0.40,
    thermalBloom: 1.3,
    cloudScattering: 0.0,
    desc: 'Electromagnetic accelerator firing 2 hyper-velocity kinetic slugs (1.90 HP total, 2.8s reload). Out-ranges conventional cannons; tight 22-degree boresight requires pinpoint alignment.'
  }
};

window.AUTOCANNONS_CATALOG = Object.assign(
  window.AUTOCANNONS_CATALOG || {},
  window.AUTOCANNONS_ENERGY
);