/**
 * APEX VECTOR // Aircraft Subsystem Upgrades, Components, AI Cores & ECCM Defenses
 */

window.UPGRADES_CATALOG = {
  'MALD_DECOY_SYSTEM': {
    id: 'MALD_DECOY_SYSTEM',
    name: 'ADM-160 MALD Decoy Deployer (2x)',
    cost: 1.4,
    mass: 120,
    category: 'AVIONICS',
    desc: 'Miniature Air-Launched Decoy deployer (2x MALD drones). Launches autonomous decoy drones mirroring this airframe\'s exact radar cross-section to seduce enemy sensors and missiles.',
    apply: function(unit) {
      unit.hasMaldDecoy = true;
      unit.maldDecoyCharges = 2;
    },
    isAllowed: function() { return true; }
  },
  'ADAPTIVE_ECCM_SUITE': {
    id: 'ADAPTIVE_ECCM_SUITE',
    name: 'Adaptive Digital ECCM Core',
    cost: 1.6,
    mass: 55,
    category: 'AVIONICS',
    desc: 'Electronic Counter-Countermeasures (ECCM) processor. Frequency-hopping cuts enemy jamming degradation by 60% and accelerates radar burn-through against noise.',
    apply: function(unit) {
      unit.hasECCM = true;
      unit.eccmBonus = 0.60;
    },
    isAllowed: function() { return true; }
  },
  'THRUST_VECTOR': {
    id: 'THRUST_VECTOR',
    name: '3D Thrust-Vectoring Nozzles',
    cost: 2.2,
    mass: 180,
    category: 'ENGINE',
    desc: '+12% turn rate authority; enables post-stall Pugachev Cobra. TRADE-OFF: Adds +180kg deadweight.',
    apply: function(unit) {
      unit.thrustVector = true;
      unit.turnBonus = (unit.turnBonus || 0) + 0.12;
      unit.stressTurnMultiplier = 1.10;
    },
    isAllowed: function(spec) { return !spec.isDrone && !spec.isCoffin; }
  },
  'SUPERCRUISE_VCE': {
    id: 'SUPERCRUISE_VCE',
    name: 'Variable-Cycle Supercruise Core',
    cost: 2.5,
    mass: 240,
    category: 'ENGINE',
    desc: '+10% max sprint speed and +12% acceleration. TRADE-OFF: Slightly higher thermal IR signature.',
    apply: function(unit) {
      if (unit.spec && unit.spec.S_0) unit.spec.S_0 *= 1.10;
      unit.accelBonus = (unit.accelBonus || 0) + 0.12;
      unit.thermalBloom = 1.10;
    },
    isAllowed: function() { return true; }
  },
  'EXTENDED_RANGE_TURBO': {
    id: 'EXTENDED_RANGE_TURBO',
    name: 'High-Bypass Fuel-Conservation Core',
    cost: 1.2,
    mass: 150,
    category: 'ENGINE',
    desc: 'Reduces aerodynamic drag penalty coefficient by 15%. TRADE-OFF: Lowers top sprint speed by -4%.',
    apply: function(unit) {
      unit.dragMitigation = 0.15;
      if (unit.spec && unit.spec.S_0) unit.spec.S_0 *= 0.96;
    },
    isAllowed: function() { return true; }
  },
  'GAN_AESA_CORE': {
    id: 'GAN_AESA_CORE',
    name: 'GaN AESA Radar Array Core',
    cost: 2.0,
    mass: 85,
    category: 'AVIONICS',
    desc: '+20% radar detection reach and burn-through against noise jamming. Cuts target identification delay in half.',
    apply: function(unit) {
      if (unit.spec && unit.spec.R_0) unit.spec.R_0 *= 1.20;
      unit.radarIdentifySpeed = 2.0;
      unit.hasGaNAESA = true;
    },
    isAllowed: function() { return true; }
  },
  'EOTS_DUAL_OPTICS': {
    id: 'EOTS_DUAL_OPTICS',
    name: 'Legion-EOTS Dual-Band IRST',
    cost: 1.8,
    mass: 50,
    category: 'AVIONICS',
    desc: 'Passive electro-optical tracker. Retains target tracking even if the enemy Doppler notches radar emissions or activates RF jammer pods.',
    apply: function(unit) {
      unit.hasIRST = true;
    },
    isAllowed: function() { return true; }
  },
  'ESM_PASSIVE_SUITE': {
    id: 'ESM_PASSIVE_SUITE',
    name: 'Wide-Band ESM Receiver Suite',
    cost: 1.2,
    mass: 35,
    category: 'AVIONICS',
    desc: 'Doubles threat warning distance against incoming radar locks; immediately classifies surface radar emitters and active airborne jammers.',
    apply: function(unit) {
      unit.hasESM = true;
    },
    isAllowed: function() { return true; }
  },
  'DAS_360_OPTIC': {
    id: 'DAS_360_OPTIC',
    name: 'DAS 360-Degree Optical Mesh',
    cost: 1.5,
    mass: 45,
    category: 'AVIONICS',
    desc: 'Spherical optical aperture mesh. Grants +10% passive evasion vs guided missiles and detects stealth missile launches early.',
    apply: function(unit) {
      unit.dasEvasion = 0.10;
      unit.hasDAS = true;
    },
    isAllowed: function() { return true; }
  },
  'TITANIUM_COCKPIT': {
    id: 'TITANIUM_COCKPIT',
    name: 'Titanium-Kevlar Cockpit Tub',
    cost: 1.5,
    mass: 380,
    category: 'ARMOR',
    desc: '+1 Max HP and raises G-LOC threshold to 1.05. TRADE-OFF: Adds +380kg deadweight (-5% agility).',
    apply: function(unit) {
      unit.maxHp = (unit.maxHp || 4) + 1;
      unit.hp = Math.min(unit.maxHp, (unit.hp || 4) + 1);
      unit.glocThreshold = 1.05;
      if (unit.spec && unit.spec.AGI_0) unit.spec.AGI_0 *= 0.95;
    },
    isAllowed: function(spec) { return !spec.isDrone && !spec.isCoffin; }
  },
  'RAM_NANO_COATING': {
    id: 'RAM_NANO_COATING',
    name: 'RAM Stealth Nano-Coating',
    cost: 2.2,
    mass: 60,
    category: 'STEALTH',
    desc: 'Cuts base radar cross-section (RCS) by 45%. TRADE-OFF: Slightly retains skin heat (+10% IR seeker susceptibility).',
    apply: function(unit) {
      if (unit.spec && unit.spec.sigma_0) unit.spec.sigma_0 *= 0.55;
      unit.irPenalty = 0.10;
    },
    isAllowed: function() { return true; }
  },
  'EXPANDED_CM_DISPENSER': {
    id: 'EXPANDED_CM_DISPENSER',
    name: 'Expanded Chaff Decoy Magazine',
    cost: 0.6,
    mass: 80,
    category: 'STEALTH',
    desc: 'Increases available countermeasure charges from 4 to 8 salvos.',
    apply: function(unit) {
      unit.chaff = (unit.chaff || 4) + 4;
      unit.countermeasures = (unit.countermeasures || 4) + 4;
      unit.chaffFlares = (unit.chaffFlares || 4) + 4;
    },
    isAllowed: function() { return true; }
  },
  'ZOE_NEURAL_PROCESSOR': {
    id: 'ZOE_NEURAL_PROCESSOR',
    name: 'Z.O.E. Tactical Neural Core',
    cost: 2.0,
    mass: 30,
    category: 'DATALINK',
    desc: 'Autonomous AI upgrade. Cuts reaction latency by 40% and computes predictive intercept solutions (+12% missile P_k).',
    apply: function(unit) {
      unit.hasZoeCore = true;
      unit.aiReactionBonus = 0.40;
      unit.pkBonus = (unit.pkBonus || 0) + 0.12;
    },
    isAllowed: function(spec) { return spec.isDrone || spec.isAutonomous || spec.isCoffin; }
  },
  'COFFIN_OPTICAL_BUS': {
    id: 'COFFIN_OPTICAL_BUS',
    name: 'COFFIN Opto-Neural Interface (Manual)',
    cost: 2.4,
    mass: 45,
    category: 'DATALINK',
    desc: 'Replaces canopy with an armored optical shell for 100% manual player flight. Zero pilot stress, immune to G-LOC blackout, +15% turn rate, and +25% extreme maneuver dodge bonus.',
    apply: function(unit) {
      if (unit.spec && unit.spec.AGI_0) unit.spec.AGI_0 *= 1.15;
      unit.glocThreshold = 999.0;
      unit.isCoffin = true;
      unit.isAutonomous = false; // Player-piloted
      unit.coffinDodgeBonus = 0.25;
    },
    isAllowed: function(spec) { return spec.isDrone || spec.isAutonomous || spec.isCoffin || spec.category === 'EXPERIMENTAL'; }
  },
  'SWARM_AI_COPROCESSOR': {
    id: 'SWARM_AI_COPROCESSOR',
    name: 'Hivemind Swarm Co-Processor',
    cost: 1.0,
    mass: 25,
    category: 'DATALINK',
    desc: 'Drones & UCAVs only. Immunizes unit to EW datalink severance and grants +15% dodge agility during defensive breaks.',
    apply: function(unit) {
      unit.immuneJamming = true;
      unit.droneDodgeBonus = 0.15;
    },
    isAllowed: function(spec) { return spec.isDrone === true || spec.isAutonomous === true; }
  },
  'MADL_BATTLE_LINK': {
    id: 'MADL_BATTLE_LINK',
    name: 'Multi-Function Advanced Datalink',
    cost: 1.0,
    mass: 30,
    category: 'DATALINK',
    desc: 'Passively shares target tracks across the fleet; adds +0.10 Token/sec Command Bus regeneration.',
    apply: function(unit) {
      unit.datalinkBonus = (unit.datalinkBonus || 0) + 0.10;
    },
    isAllowed: function() { return true; }
  },
  'RTB_HOMING_BEACON': {
    id: 'RTB_HOMING_BEACON',
    name: 'TACAN RTB Auto-Navigator',
    cost: 0.5,
    mass: 15,
    category: 'AVIONICS',
    desc: 'Enables rapid automatic home base egress and cuts base re-arm replenishment duration by 50%.',
    apply: function(unit) {
      unit.hasFastRTB = true;
    },
    isAllowed: function() { return true; }
  }
};
