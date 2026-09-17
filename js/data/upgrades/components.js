/**
 * AIRSPACE STANDOFF // Aircraft Subsystem Upgrades, Components, AI Cores & ECCM Defenses
 */

window.UPGRADES_CATALOG = {
  'MALD_DECOY_SYSTEM': {
    id: 'MALD_DECOY_SYSTEM',
    name: 'ADM-160 MALD Decoy Deployer (2x)',
    cost: 1.4,
    mass: 120,
    category: 'AVIONICS',
    desc: 'Miniature Air-Launched Decoy deployer (2x MALD drones). Deploys autonomous decoy drones that replicate the host airframe radar cross-section and speed profile to deceive enemy radars.',
    apply: function(unit) {
      unit.hasMaldDecoy = true;
      unit.maldDecoyCharges = 2;
    },
    isAllowed: function() { return true; }
  },
  'ADAPTIVE_ECCM_SUITE': {
    id: 'ADAPTIVE_ECCM_SUITE',
    name: 'Adaptive Digital ECCM Processor',
    cost: 1.6,
    mass: 55,
    category: 'AVIONICS',
    desc: 'Electronic Counter-Countermeasures (ECCM) system. Frequency-hopping algorithms reduce enemy jamming degradation by 60% and accelerate radar burn-through against noise.',
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
    desc: '+12% turn rate authority; enables post-stall pitch maneuvers. Adds +180kg structural weight.',
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
    desc: '+10% maximum sprint speed and +12% dry acceleration. Slightly increases thermal infrared signature.',
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
    desc: 'Reduces aerodynamic drag coefficient by 15%. Reduces top sprint speed by -4%.',
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
    desc: '+20% radar detection range and improved burn-through against noise jamming. Halves target non-cooperative classification delay.',
    apply: function(unit) {
      if (unit.spec && unit.spec.R_0) unit.spec.R_0 *= 1.20;
      unit.radarIdentifySpeed = 2.0;
      unit.hasGaNAESA = true;
    },
    isAllowed: function() { return true; }
  },
  'EOTS_DUAL_OPTICS': {
    id: 'EOTS_DUAL_OPTICS',
    name: 'Dual-Band Electro-Optical IRST',
    cost: 1.8,
    mass: 50,
    category: 'AVIONICS',
    desc: 'Passive electro-optical tracking sensor. Maintains target tracking when targets execute Doppler notching or deploy RF jammers.',
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
    desc: 'Doubles threat warning range against incoming radar locks; immediately classifies hostile surface radar arrays and active airborne emitters.',
    apply: function(unit) {
      unit.hasESM = true;
    },
    isAllowed: function() { return true; }
  },
  'DAS_360_OPTIC': {
    id: 'DAS_360_OPTIC',
    name: 'Distributed Aperture Optical Suite',
    cost: 1.5,
    mass: 45,
    category: 'AVIONICS',
    desc: 'Spherical optical sensor array. Provides +10% passive evasion against guided missiles and provides early launch detection.',
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
    desc: '+1 Max HP and raises G-LOC fatigue threshold to 1.05. Adds +380kg structural weight (-5% base agility).',
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
    name: 'Radar-Absorbent Material (RAM) Coating',
    cost: 2.2,
    mass: 60,
    category: 'STEALTH',
    desc: 'Reduces base radar cross-section (RCS) by 45%. Slightly increases skin friction heat retention (+10% IR seeker susceptibility).',
    apply: function(unit) {
      if (unit.spec && unit.spec.sigma_0) unit.spec.sigma_0 *= 0.55;
      unit.irPenalty = 0.10;
    },
    isAllowed: function() { return true; }
  },
  'EXPANDED_CM_DISPENSER': {
    id: 'EXPANDED_CM_DISPENSER',
    name: 'Expanded Countermeasure Dispenser',
    cost: 0.6,
    mass: 80,
    category: 'STEALTH',
    desc: 'Expands onboard countermeasure magazine capacity from 4 to 8 defensive salvos.',
    apply: function(unit) {
      unit.chaff = (unit.chaff || 4) + 4;
      unit.countermeasures = (unit.countermeasures || 4) + 4;
      unit.chaffFlares = (unit.chaffFlares || 4) + 4;
    },
    isAllowed: function() { return true; }
  },
  'ZOE_NEURAL_PROCESSOR': {
    id: 'ZOE_NEURAL_PROCESSOR',
    name: 'Z.O.E. Autonomous Flight Computer',
    cost: 2.0,
    mass: 30,
    category: 'DATALINK',
    desc: 'High-speed mission coprocessor for autonomous airframes. Reduces reaction latency by 40% and computes predictive intercept solutions (+12% missile P_k).',
    apply: function(unit) {
      unit.hasZoeCore = true;
      unit.aiReactionBonus = 0.40;
      unit.pkBonus = (unit.pkBonus || 0) + 0.12;
    },
    isAllowed: function(spec) { return spec.isDrone || spec.isAutonomous || spec.isCoffin; }
  },
  'COFFIN_OPTICAL_BUS': {
    id: 'COFFIN_OPTICAL_BUS',
    name: 'COFFIN Synthetic Vision System (Manual)',
    cost: 2.4,
    mass: 45,
    category: 'DATALINK',
    desc: 'Armored enclosed cockpit with multi-camera synthetic vision for 100% manual player flight. Eliminates pilot G-fatigue blackout, grants +15% turn rate authority, and provides +25% high-rate evasive break bonus.',
    apply: function(unit) {
      if (unit.spec && unit.spec.AGI_0) unit.spec.AGI_0 *= 1.15;
      unit.glocThreshold = 999.0;
      unit.isCoffin = true;
      unit.isAutonomous = false;
      unit.coffinDodgeBonus = 0.25;
    },
    isAllowed: function(spec) { return spec.isDrone || spec.isAutonomous || spec.isCoffin || spec.category === 'EXPERIMENTAL'; }
  },
  'SWARM_AI_COPROCESSOR': {
    id: 'SWARM_AI_COPROCESSOR',
    name: 'Autonomous Swarm Datalink Processor',
    cost: 1.0,
    mass: 25,
    category: 'DATALINK',
    desc: 'UCAVs only. Provides distributed mesh communication resilience against EW jamming and grants +15% evasive agility during defensive turns.',
    apply: function(unit) {
      unit.immuneJamming = true;
      unit.droneDodgeBonus = 0.15;
    },
    isAllowed: function(spec) { return spec.isDrone === true || spec.isAutonomous === true; }
  },
  'MADL_BATTLE_LINK': {
    id: 'MADL_BATTLE_LINK',
    name: 'Multifunction Advanced Data Link (MADL)',
    cost: 1.0,
    mass: 30,
    category: 'DATALINK',
    desc: 'Shares sensor targeting tracks across the squadron via directional, low-probability-of-intercept data links; adds +0.10 Token/sec command regeneration.',
    apply: function(unit) {
      unit.datalinkBonus = (unit.datalinkBonus || 0) + 0.10;
    },
    isAllowed: function() { return true; }
  },
  'RTB_HOMING_BEACON': {
    id: 'RTB_HOMING_BEACON',
    name: 'TACAN Egress Navigation Beacon',
    cost: 0.5,
    mass: 15,
    category: 'AVIONICS',
    desc: 'Provides automated home base transit routing and accelerates field re-arming turnaround duration by 50%.',
    apply: function(unit) {
      unit.hasFastRTB = true;
    },
    isAllowed: function() { return true; }
  }
};