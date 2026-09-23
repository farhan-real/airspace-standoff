/**
 * AIRSPACE STANDOFF: Preconfigured Loadouts: UCAVs & Collaborative Combat Drones
 */

window.TEMPLATES_DRONES = {
  'MQ-99 Expendable Decoy & Recon': {
    name: 'MQ-99 Expendable Decoy & Recon',
    specId: 'MQ-99',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'PLSL_LIGHT',
    weapons: ['MAM'],
    upgrades: ['SWARM_AI_COPROCESSOR'],
    desc: 'Low-cost 18G swarm drone ($3.5M). Armed with PLSL-10 pulse laser and MAM micro-missiles to draw hostile fire.'
  },
  'MQ-99 Tactical Micro-Missile Swarm': {
    name: 'MQ-99 Tactical Micro-Missile Swarm',
    specId: 'MQ-99',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'PLSL_LIGHT',
    weapons: ['MAM', 'MAM'],
    upgrades: ['SWARM_AI_COPROCESSOR'],
    desc: 'Pulse laser armed drone with double micro-missile saturation payload (16x) to overwhelm hostile defenses.'
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

  'XQ-58A Loyal Wingman Escort': {
    name: 'XQ-58A Loyal Wingman Escort',
    specId: 'XQ-58A',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'MICRO_GUN',
    weapons: ['AIM-120D', 'ADM-160B'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'MALD_DECOY_SYSTEM'],
    desc: 'Cost-effective stealth wingman ($7.5M). Carries internal BVR missiles and launches MALD decoy drones.'
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
    weapons: ['AIM-120D', 'AIM-9X-2'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'GAN_AESA_CORE'],
    desc: 'Carrier-capable supersonic UCAV ($9.5M). Internal weapon bay, AESA radar, and 16G combat breaks.'
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
    desc: '20-ton heavy stealth flying-wing UCAV. Capable of internal heavy standoff anti-radiation missile volleys.'
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
    weapons: ['AIM-120D', 'AIM-9X-2'],
    upgrades: ['SWARM_AI_COPROCESSOR', 'MADL_BATTLE_LINK'],
    desc: 'Collaborative combat aircraft providing low-cost sensor extension and BVR missile screening.'
  },
  'RQ-180 High-Altitude Reconnaissance (HALE)': {
    name: 'RQ-180 High-Altitude Reconnaissance (HALE)',
    specId: 'RQ-180',
    roleCategory: 'SWARM & DRONES',
    chosenGunId: 'MICRO_GUN',
    weapons: ['ADM-160B', 'MAM'],
    upgrades: ['GAN_AESA_CORE', 'MADL_BATTLE_LINK'],
    desc: 'Stratospheric flying-wing drone (0.0001m2 RCS, $16.0M). Operates as a dedicated high-altitude squadron sensor gateway.'
  }
};