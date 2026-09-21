/**
 * AIRSPACE STANDOFF: Flight Lead Modifications & Tactical Dossier Registry
 * Modular application of category flight lead enhancements.
 */

window.LEAD_BUFFS = {
  STEALTH: {
    role: 'Stealth Air Dominance Lead',
    title: 'VLO RAM Edge Mitigation Suite',
    survivability: '+1 HP Armor Bulkhead & -50% Beam Radar Return',
    weaknessFixed: 'Eliminates broadside 90° radar cross-section spike via radar-absorbent edge treatments.',
    summary: 'Central formation anchor. Enhances sensor range, cuts 90° broadside radar return by 50%, and improves squadron datalink.',
    buffs: [
      { label: 'BEAM SPIKE CUT', val: '-50%', desc: 'Cuts broadside radar reflection spike by 50%.' },
      { label: 'RADAR EXPANSION', val: '+15.0 km', desc: 'Extended instrumented radar tracking envelope.' },
      { label: 'ARMOR BULKHEAD', val: '+1 HP', desc: 'Reinforced internal carbon-titanium frame.' },
      { label: 'MISSILE EVASION', val: '+15%', desc: 'Passive seeker cross-section spoofing.' }
    ]
  },
  SUPERIORITY: {
    role: 'Air Superiority Formation Commander',
    title: 'High-G Intercept & Energy Suite',
    survivability: '+2 HP Titanium Spars & 50% Pilot G-Fatigue Delay',
    weaknessFixed: 'Delays high-G physiological pilot fatigue and increases missile hit probability.',
    summary: 'Flies in central formation slot. Boosts missile P_k, dampens pilot G-fatigue by 50%, and strengthens airframe.',
    buffs: [
      { label: 'AIRFRAME INTEGRITY', val: '+2 HP', desc: 'Titanium framework reinforcement.' },
      { label: 'G-STRESS RESISTANCE', val: '+50%', desc: 'Pressurized environmental control delays blackout.' },
      { label: 'MISSILE ACCURACY', val: '+12% P_k', desc: 'Targeting computer cueing enhancement.' },
      { label: 'BREAK-TURN EVASION', val: '+18%', desc: 'High-alpha evasive maneuver bonus.' }
    ]
  },
  MULTIROLE: {
    role: 'Multirole Squadron Flight Lead',
    title: 'Adaptive Fly-By-Wire & Turnaround Suite',
    survivability: '+2 HP Composite Plating & Rapid Base Replenishment',
    weaknessFixed: 'Accelerates turnaround and increases instantaneous turn authority.',
    summary: 'Balanced formation anchor. Grants +20% turn agility, accelerated RTB reload, and extra countermeasure charges.',
    buffs: [
      { label: 'DURABILITY BONUS', val: '+2 HP', desc: 'Composite armor layer protection.' },
      { label: 'TURN RATE BOOST', val: '+20%', desc: 'Optimized digital fly-by-wire gain schedule.' },
      { label: 'EXPANDED CHAFF', val: '+3 CHARGES', desc: 'Expanded defensive countermeasure magazine.' },
      { label: 'RAPID RTB REARM', val: 'ACTIVE', desc: 'Faster reload duration at central depots.' }
    ]
  },
  STRIKE: {
    role: 'Heavy Strike Package Commander',
    title: 'Titanium Bathtub & Ordnance Relief',
    survivability: '+3 HP Armor, 60% Cannon Deflection & -1 Missile Damage',
    weaknessFixed: 'Dampens kinetic ordnance drag penalty and reduces damage from all impacts.',
    summary: 'Heavy strike lead. Bathtub armor deflects 60% of cannon strafe damage and mitigates ordnance weight penalties.',
    buffs: [
      { label: 'HEAVY ARMOR TUB', val: '+3 HP', desc: 'Welded titanium cockpit bathtub enclosure.' },
      { label: 'MISSILE SHOCK ABSORPTION', val: '-1 DMG', desc: 'Reduces damage from direct missile hits.' },
      { label: 'CANNON DEFLECTION', val: '60%', desc: 'Deflects hostile close-range autocannon fire.' },
      { label: 'DRAG RELIEF', val: '-40%', desc: 'Reduces aerodynamic drag penalties from heavy ordnance.' }
    ]
  },
  EW: {
    role: 'Electronic Warfare Escort Lead',
    title: 'Broadband High-Power Jamming Umbrella',
    survivability: '+2 HP Durability & Wideband Threat Warning',
    weaknessFixed: 'Increases electronic jamming efficiency to 95% and extends threat warning range.',
    summary: 'High-power EW node. Shields surrounding squadron aircraft with a jamming umbrella and early warning sensors.',
    buffs: [
      { label: 'JAMMING UMBRELLA', val: '+25% EFF', desc: 'High-gain microwave jamming power.' },
      { label: 'ARMOR REINFORCEMENT', val: '+2 HP', desc: 'Composite protective airframe skin.' },
      { label: 'DEFENSIVE CHAFF', val: '+3 CHARGES', desc: 'Expanded RF decoy salvo capacity.' },
      { label: 'PASSIVE ESM', val: 'ACTIVE', desc: 'Immediate classification of hostile radar emitters.' }
    ]
  },
  DRONES: {
    role: 'Autonomous UCAV Swarm Master Node',
    title: 'Neural Datalink & Decoy Array',
    survivability: '+2 HP Hull Durability & Dual MALD Decoy System',
    weaknessFixed: 'Grants autonomous swarm resilience and deploys miniature air-launched decoys.',
    summary: 'Unmanned swarm lead. Grants +15% dodge agility, carries 2 autonomous MALD decoys, and coordinates BVR volleys.',
    buffs: [
      { label: 'HULL REINFORCEMENT', val: '+2 HP', desc: 'High-stress carbon composite frame.' },
      { label: 'MALD DECOY DRONES', val: '2x MALD', desc: 'Deploys autonomous decoys mirroring host radar signature.' },
      { label: 'SWARM DODGE', val: '+20%', desc: 'High-G autonomous defensive breaks.' },
      { label: 'TARGETING ACCURACY', val: '+12% P_k', desc: 'Coordinated sensor telemetry calculation.' }
    ]
  },
  EXPERIMENTAL: {
    role: 'Flagship Technology Demonstrator Lead',
    title: 'Optical Datalink & Thermal Masking Core',
    survivability: '+2 HP Exotic Alloy Frame & -40% Thermal Exhaust Bloom',
    weaknessFixed: 'Suppresses thermal exhaust blooms and boosts squadron-wide token regeneration.',
    summary: 'Advanced prototype flagship. Masks infrared signature, grants +15% missile evasion, and expands datalink regeneration.',
    buffs: [
      { label: 'EXOTIC BULKHEAD', val: '+2 HP', desc: 'Titanium-matrix composite construction.' },
      { label: 'THERMAL CONCEALMENT', val: '-40% IR', desc: 'Cooled exhaust conduit reduces IR lock range.' },
      { label: 'DATALINK BUS', val: '+0.30 TOK/s', desc: 'Accelerates command token regeneration.' },
      { label: 'EVASIVE MANEUVER', val: '+15%', desc: 'Digital flight control evasion response.' }
    ]
  }
};

class AircraftLeadBuffs {
  static apply(aircraft) {
    const cat = (aircraft.spec && aircraft.spec.category) || 'MULTIROLE';
    aircraft.leadExtraCm = 2;
    aircraft.leadEvasionBonus = 0.15;

    switch (cat) {
      case 'STEALTH':
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 1;
        if (aircraft.spec.sigma_0) aircraft.spec.sigma_0 *= 0.65;
        aircraft.beamSpikeReduction = 0.50;
        if (aircraft.spec.R_0) aircraft.spec.R_0 += 15.0;
        aircraft.datalinkBonus = (aircraft.datalinkBonus || 0) + 0.25;
        aircraft.radarIdentifySpeed = 1.6;
        aircraft.leadEvasionBonus = 0.15;
        break;
      case 'SUPERIORITY':
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 2;
        if (aircraft.spec.sigma_0) aircraft.spec.sigma_0 *= 0.60;
        if (aircraft.spec.S_0) aircraft.spec.S_0 *= 1.10;
        aircraft.pkBonus = (aircraft.pkBonus || 0) + 0.12;
        aircraft.leadStressMitigation = 0.50;
        aircraft.leadEvasionBonus = 0.18;
        break;
      case 'MULTIROLE':
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 2;
        aircraft.turnBonus = (aircraft.turnBonus || 0) + 0.20;
        aircraft.datalinkBonus = (aircraft.datalinkBonus || 0) + 0.20;
        aircraft.hasFastRTB = true;
        aircraft.leadExtraCm = 3;
        aircraft.leadEvasionBonus = 0.18;
        break;
      case 'STRIKE':
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 3;
        aircraft.heavyLeadDragMitigation = 0.40;
        aircraft.autocannonResistance = 0.60;
        aircraft.missileDamageReduction = 1;
        aircraft.leadEvasionBonus = 0.12;
        break;
      case 'EW':
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 2;
        aircraft.jamEfficiency = Math.min(0.95, (aircraft.jamEfficiency || 0.45) + 0.25);
        aircraft.hasESM = true;
        aircraft.leadExtraCm = 3;
        aircraft.leadEvasionBonus = 0.20;
        break;
      case 'DRONES':
        aircraft.spec.hp = (aircraft.spec.hp || 2) + 2;
        aircraft.droneDodgeBonus = (aircraft.droneDodgeBonus || 0) + 0.15;
        aircraft.hasMaldDecoy = true;
        aircraft.maldDecoyCharges = (aircraft.maldDecoyCharges || 0) + 2;
        aircraft.pkBonus = (aircraft.pkBonus || 0) + 0.12;
        aircraft.leadEvasionBonus = 0.20;
        break;
      case 'EXPERIMENTAL':
      default:
        aircraft.spec.hp = (aircraft.spec.hp || 4) + 2;
        aircraft.datalinkBonus = (aircraft.datalinkBonus || 0) + 0.30;
        aircraft.thermalBloom = 0.60;
        aircraft.leadEvasionBonus = 0.15;
        break;
    }
  }
}

window.AircraftLeadBuffs = AircraftLeadBuffs;