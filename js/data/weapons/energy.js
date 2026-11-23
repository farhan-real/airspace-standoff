/**
 * js/data/weapons/energy.js - Built-in pulse lasers, solid-state directed-energy beams, and electromagnetic railguns.
 */

window.AUTOCANNONS_ENERGY = {
  'PLSL_LIGHT': {
    id: 'PLSL_LIGHT', name: 'PLSL-10 Light Pulse Laser', caliber: 'Directed Energy (Pulse Laser)', gunGroup: 'ENERGY',
    rpm: 1200, rangeKm: 12.5, damagePerSec: 2.0, roundsPerBurst: 3, damagePerRound: 0.38,
    damagePerBurst: 1.14, burstCooldown: 1.8, ammoPerBurst: 3, coneAngleDeg: 34, mass: 130,
    tracerColor: '#38bdf8', badge: '34 DEG PULSE LASER', defaultAmmo: 18,
    groundDamageMult: 1.0, armorPiercing: 0.40,
    lockedTo: [
      'MQ-99', 'MQ-101', 'F-22A', 'F-22-SUPER', 'FB-22', 'YF-23', 'F-35A', 'F-35B', 'F-35C',
      'Su-57', 'J-20', 'J-20B', 'J-20S', 'Su-75', 'FC-31', 'J-35', 'KAAN', 'KF-21EX', 'AMCA-MK1',
      'TEMPEST', 'FCAS-NGF', 'J-36', 'J-50', 'TYPHOON-T4', 'F-15J-JSI',
      'B-21', 'F-15EX', 'F-22C-COFFIN', 'ADF-11F', 'ADFX-01', 'CFA-44',
      'X-02S', 'DARKSTAR', 'X-40', 'XFA-36B', 'EA-36'
    ],
    kineticConcussion: 0.0, thermalBloom: 1.4, cloudScattering: 0.70, speedPenalty: 0.04, rcsPenalty: 0.25,
    desc: 'Lightweight pulse laser firing 3-pulse bursts (1.14 HP total, 1.8s reload). 18 pulses allow 6 bursts. Integrated turret aperture and power bleed cut sprint speed (-4%), raise airframe RCS (+25%), spike thermal bloom, and scatter in clouds.'
  },
  'PLSL_MED': {
    id: 'PLSL_MED', name: 'PLSL-20 Pulse Laser', caliber: 'Directed Energy (Pulse Laser)', gunGroup: 'ENERGY',
    rpm: 900, rangeKm: 15.0, damagePerSec: 2.8, roundsPerBurst: 3, damagePerRound: 0.50,
    damagePerBurst: 1.50, burstCooldown: 2.0, ammoPerBurst: 3, coneAngleDeg: 30, mass: 300,
    tracerColor: '#00f0ff', badge: '30 DEG MEDIUM LASER', defaultAmmo: 15,
    groundDamageMult: 1.0, armorPiercing: 0.50,
    lockedTo: ['MQ-99', 'MQ-101', 'TEMPEST', 'FCAS-NGF', 'J-36', 'J-50', 'ADF-11F', 'ADFX-01', 'CFA-44', 'X-02S', 'DARKSTAR', 'X-40', 'XFA-36B'],
    kineticConcussion: 0.0, thermalBloom: 1.5, cloudScattering: 0.75, speedPenalty: 0.06, rcsPenalty: 0.45,
    desc: 'Medium-tier optical pulse emitter firing 3-pulse bursts (1.50 HP total, 2.0s reload). 15 pulses allow 5 focused bursts. Heavy capacitor bank (+300 kg), generator drag (-6% speed), and optical window (+45% RCS) penalize stealth and kinematics.'
  },
  'PLSL_HEAVY': {
    id: 'PLSL_HEAVY', name: 'PLSL-30 Heavy Pulse Laser', caliber: 'Heavy Directed Energy (DEW)', gunGroup: 'ENERGY',
    rpm: 600, rangeKm: 18.0, damagePerSec: 3.8, roundsPerBurst: 3, damagePerRound: 0.65,
    damagePerBurst: 1.95, burstCooldown: 2.5, ammoPerBurst: 3, coneAngleDeg: 26, mass: 520,
    tracerColor: '#c084fc', badge: '26 DEG HEAVY LASER', defaultAmmo: 12,
    groundDamageMult: 1.15, armorPiercing: 0.60,
    lockedTo: ['ADF-11F', 'ADFX-01', 'CFA-44', 'X-02S', 'DARKSTAR', 'X-40'],
    kineticConcussion: 0.0, thermalBloom: 1.7, cloudScattering: 0.80, speedPenalty: 0.09, rcsPenalty: 0.85,
    desc: 'High-energy optical burst weapon firing 3-pulse bursts (1.95 HP total, 2.5s reload). Massive 520 kg cooling/capacitor plant, -9% sprint drag, and large +85% RCS emitter aperture noticeably degrade airframe stealth and top speed.'
  },
  'DE-PULSE': {
    id: 'DE-PULSE', name: 'Solid-State Laser (80 kW)', caliber: 'Directed Energy (DEW)', gunGroup: 'ENERGY',
    rpm: 9999, rangeKm: 7.5, damagePerSec: 3.6, roundsPerBurst: 3, damagePerRound: 0.55,
    damagePerBurst: 1.65, burstCooldown: 2.4, ammoPerBurst: 3, coneAngleDeg: 28, mass: 440,
    tracerColor: '#00f0ff', badge: '28 DEG PENCIL BEAM', defaultAmmo: 15,
    groundDamageMult: 1.0, armorPiercing: 0.50,
    lockedTo: [
      'F-22A', 'F-22-SUPER', 'TEMPEST', 'FCAS-NGF', 'J-36', 'J-50',
      'Su-57', 'X-02S', 'B-21', 'J-20', 'F-15EX', 'FC-31', 'YF-23', 'ADF-11F',
      'ADFX-01', 'DARKSTAR', 'F-22C-COFFIN', 'Su-37-COFFIN', 'F-15-SMT-COFFIN', 'CFA-44', 'X-40', 'XFA-36B', 'EA-36'
    ],
    kineticConcussion: 0.0, thermalBloom: 1.6, cloudScattering: 0.75, speedPenalty: 0.07, rcsPenalty: 0.60,
    desc: '80 kW solid-state pulsed fiber laser firing 3-pulse bursts (1.65 HP total, 2.4s reload). Heavy 440 kg thermal plant, -7% generator/turret speed loss, and +60% RCS optical aperture compromise stealth vs flush cannons.'
  },
  'EML_GUN': {
    id: 'EML_GUN', name: 'EML Railgun', caliber: 'Electromagnetic Railgun', gunGroup: 'ENERGY',
    rpm: 120, rangeKm: 9.5, damagePerSec: 2.6, roundsPerBurst: 2, damagePerRound: 0.95,
    damagePerBurst: 1.90, burstCooldown: 2.8, ammoPerBurst: 2, coneAngleDeg: 22, mass: 320,
    tracerColor: '#38bdf8', badge: '22 DEG PINPOINT RAILGUN', defaultAmmo: 8,
    groundDamageMult: 1.40, armorPiercing: 0.90,
    lockedTo: ['CFA-44', 'X-02S', 'ADF-11F', 'ADFX-01', 'X-40', 'XFA-36B'],
    kineticConcussion: 0.40, thermalBloom: 1.3, cloudScattering: 0.0, speedPenalty: 0.0, rcsPenalty: 0.0,
    desc: 'Electromagnetic railgun firing 2 kinetic slugs (1.90 HP total, 2.8s reload). 8 slugs permit 4 sniper shots. Out-ranges conventional cannons; tight 22-degree boresight.'
  }
};

window.AUTOCANNONS_CATALOG = Object.assign(
  window.AUTOCANNONS_CATALOG || {},
  window.AUTOCANNONS_ENERGY
);
