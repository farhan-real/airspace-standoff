/**
 * js/data/templates/drones.js - Preconfigured Loadouts: UCAVs & Collaborative Combat Drones.
 */

window.TEMPLATES_DRONES = {
  'MQ-99 Expendable Decoy & Recon': {
    name: 'MQ-99 Expendable Decoy & Recon',
    specId: 'MQ-99',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'PLSL_LIGHT',
    weapons: ['MAM'],
    upgrades: ['SWARM_AI_COPROCESSOR'],
    desc: 'Low-cost 18G swarm drone. Armed with PLSL-10 pulse laser and MAM micro-missiles to draw hostile fire.'
  },
  'MQ-99 Micro-Missile Swarm': {
    name: 'MQ-99 Micro-Missile Swarm',
    specId: 'MQ-99',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'PLSL_LIGHT',
    weapons: ['MAM', 'MAM'],
    upgrades: ['SWARM_AI_COPROCESSOR'],
    desc: 'Pulse laser armed drone with double micro-missile saturation payload (16x) to overwhelm hostile defenses.'
  },
  'MQ-99 Close-Combat Micro-IR': {
    name: 'MQ-99 Close-Combat Micro-IR',
    specId: 'MQ-99',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'MICRO_GUN',
    weapons: ['CACM-6', 'SADM-8'],
    upgrades: ['SWARM_AI_COPROCESSOR'],
    desc: '18G close-combat UCAV carrying 6 HOBS CACM micro-IRs and 8 SADM active-radar drone killers internally.'
  },
  'MQ-101 Collaborative Combat Aircraft (CCA)': {
    name: 'MQ-101 Collaborative Combat Aircraft (CCA)',
    specId: 'MQ-101',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'PLSL_LIGHT',
    weapons: ['MAM'],
    upgrades: ['SWARM_AI_COPROCESSOR'],
    desc: 'Supersonic interceptor drone (Mach 1.22). Armed with PLSL-10 pulse laser and 20G structural limits.'
  },
  'MQ-101 High-G Intercept Drone': {
    name: 'MQ-101 High-G Intercept Drone',
    specId: 'MQ-101',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'PLSL_MED',
    weapons: ['MAM', 'MAM'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'SUPERCRUISE_VCE'],
    desc: 'High-speed 20G autonomous interceptor mounting the PLSL-20 medium pulse laser for medium-range directed-energy fire.'
  },
  'MQ-101 High-G Micro-BVR Interceptor': {
    name: 'MQ-101 High-G Micro-BVR Interceptor',
    specId: 'MQ-101',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'PLSL_LIGHT',
    weapons: ['SADM-8', 'CACM-6'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'GAN_AESA_CORE'],
    desc: 'Supersonic 20G interceptor drone packing 14 internal radar and HOBS IR micro-missiles with GaN AESA tracking.'
  },
  'XQ-58A Loyal Wingman Escort': {
    name: 'XQ-58A Loyal Wingman Escort',
    specId: 'XQ-58A',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'MICRO_GUN',
    weapons: ['AIM-120D', 'ADM-160B'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'MALD_DECOY_SYSTEM'],
    desc: 'Cost-effective stealth wingman. Carries internal BVR missiles and launches MALD decoy drones.'
  },
  'XQ-58A Peregrine Micro-BVR Wingman': {
    name: 'XQ-58A Peregrine Micro-BVR Wingman',
    specId: 'XQ-58A',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'MICRO_GUN',
    weapons: ['PEREGRINE', 'CACM-6', 'BRITECLOUD-POD'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'GAN_AESA_CORE'],
    desc: 'Stealth wingman packing 6 Peregrine 52 km mini-BVR missiles, 6 CACM HOBS IRs, and BriteCloud DRFM decoys.'
  },
  'XQ-58A Forward Missile Magazine': {
    name: 'XQ-58A Forward Missile Magazine',
    specId: 'XQ-58A',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'MICRO_GUN',
    weapons: ['AIM-120D', 'AIM-120D'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'MADL_BATTLE_LINK'],
    desc: 'Collaborative combat aircraft fielding 8 internal AMRAAM missiles to extend the squadron missile magazine.'
  },
  'Kizilelma Carrier Combat UCAV': {
    name: 'Kizilelma Carrier Combat UCAV',
    specId: 'Kizilelma',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'BK-27',
    weapons: ['GOKHAN', 'BOZDOGAN', 'CACM-6'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'GAN_AESA_CORE'],
    desc: 'Carrier-capable supersonic UCAV pairing internal Gokhan ramjets with Bozdogan HOBS IR and CACM micro-IR.'
  },
  'Kizilelma Standoff Intercept UCAV': {
    name: 'Kizilelma Standoff Intercept UCAV',
    specId: 'Kizilelma',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'BK-27',
    weapons: ['METEOR', 'AIM-9X-2'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'SUPERCRUISE_VCE'],
    desc: 'Ramjet Meteor armed autonomous carrier fighter capable of 16G maneuvers without biological pilot fatigue.'
  },
  'S-70 Heavy Strike UCAV': {
    name: 'S-70 Heavy Strike UCAV',
    specId: 'S-70',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'GSH-30-1',
    weapons: ['AGM-88G', 'PL-15E'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'RAM_NANO_COATING'],
    desc: '20-ton heavy stealth flying-wing UCAV capable of internal heavy standoff anti-radiation missile volleys.'
  },
  'S-70 Heavy Stealth BVR Wingman': {
    name: 'S-70 Heavy Stealth BVR Wingman',
    specId: 'S-70',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'GSH-30-1',
    weapons: ['R-77M', 'R-77T', 'R-74M2'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'RAM_NANO_COATING', 'GAN_AESA_CORE'],
    desc: 'Stealth flying-wing BVR escort packing internal R-77M radar and silent thermal R-77T missiles backed by R-74M2.'
  },
  'S-70 Penetration Interdiction': {
    name: 'S-70 Penetration Interdiction',
    specId: 'S-70',
    roleCategory: 'STRIKE',
    chosenGunId: 'GSH-30-1',
    weapons: ['AGM-158B', 'PL-15E'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'RAM_NANO_COATING'],
    desc: 'Internal carriage of stealth cruise missiles to penetrate heavy enemy air defenses and destroy command nodes.'
  },
  'MQ-28 Collaborative Air Combat Node': {
    name: 'MQ-28 Collaborative Air Combat Node',
    specId: 'MQ-28',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'MICRO_GUN',
    weapons: ['CUDA-SAC', 'SADM-8', 'BRITECLOUD-POD'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'MADL_BATTLE_LINK'],
    desc: 'Collaborative wingman packing 8 hit-to-kill CUDA micro-BVR, 8 SADM drone killers, and BriteCloud DRFM decoys.'
  },
  'RQ-180 High-Altitude Reconnaissance (HALE)': {
    name: 'RQ-180 High-Altitude Reconnaissance (HALE)',
    specId: 'RQ-180',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'MICRO_GUN',
    weapons: ['ADM-160B', 'MAM'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Stratospheric flying-wing drone (0.0001m2 RCS). Operates as a dedicated high-altitude squadron sensor gateway.'
  }
};
