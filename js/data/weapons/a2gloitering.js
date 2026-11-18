/**
 * js/data/weapons/a2gloitering.js - Air-launched loitering munitions and autonomous standoff strike drones.
 */

window.WEAPONS_A2G_LOITERING = {
  'SWITCHBLADE-600': {
    id: 'SWITCHBLADE-600',
    name: 'Switchblade 600 Air-Launched (4x)',
    slots: 1, slotType: 'INTERNAL', minRating: 'Type S', mass: 220, cost: 0.8,
    rangeKm: 45.0, speedMach: 0.40, seeker: 'EO', rcs: 0.002, isStealthMissile: true,
    trait: 'LOITERING_ANTI_ARMOR', traitBadge: '45KM ANTI-ARMOR DRONE',
    behaviorDesc: 'Compact Javelin-warhead loitering suicide drone (4x, 4.5 HP, 45 km). Fits inside Type S bays on A-29B and UCAVs to hunt armored SAMs and AAA.',
    damage: 4.5, ammoCount: 4, minRangeKm: 3.0, sweetSpotMin: 8.0, sweetSpotMax: 40.0,
    lambda: 0.05, p: 1.0, T_0: 0.90, armorPiercing: 0.95,
    sigmaPylon: 0.03, category: 'A2G', a2gGroup: 'LOITERING',
    desc: 'Lightweight 1-slot loitering anti-armor munitions (4x, 45 km) with electro-optical terminal guidance.'
  },
  'SPEAR-EW': {
    id: 'SPEAR-EW',
    name: 'SPEAR-EW Loitering SEAD (4x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type S', mass: 460, cost: 1.5,
    rangeKm: 78.0, speedMach: 0.80, seeker: 'PASSIVE_RADAR', rcs: 0.001, isStealthMissile: true,
    trait: 'EMITTER_KILLER', traitBadge: '78KM INTERNAL SEAD DRONE',
    behaviorDesc: 'Stealthy internal-bay loitering SEAD drone (4x, 3.5 HP, 78 km). Tracks emitters with anti-EMCON memory and deals 3x damage to surface radar arrays.',
    damage: 3.5, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 14.0, sweetSpotMax: 70.0,
    lambda: 0.06, p: 1.0, T_0: 0.89, isAntiRadiation: true, antiEmcon: true,
    sigmaPylon: 0.04, category: 'A2G', a2gGroup: 'LOITERING',
    desc: 'Internal-bay stealth loitering SEAD munition (4x, 78 km) saturating enemy IADS radars.'
  },
  'DELILAH-AL': {
    id: 'DELILAH-AL',
    name: 'Delilah Loitering Cruise (2x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 540, cost: 1.7,
    rangeKm: 82.0, speedMach: 0.85, seeker: 'IIR', rcs: 0.006, isStealthMissile: true,
    trait: 'LOITERING_CRUISE', traitBadge: '82KM HIGH-PRECISION EO',
    behaviorDesc: 'Turbojet loitering cruise missile (2x, 7 HP, 82 km). High-resolution IIR/CCD terminal homing cuts through ground jamming with 92% base accuracy.',
    damage: 7, ammoCount: 2, minRangeKm: 6.0, sweetSpotMin: 16.0, sweetSpotMax: 74.0,
    lambda: 0.05, p: 1.0, T_0: 0.92, isBunkerCracker: true,
    sigmaPylon: 0.10, category: 'A2G', a2gGroup: 'LOITERING',
    desc: 'Turbojet standoff loitering strike missile (2x, 82 km) delivering pinpoint strikes on high-value IADS targets.'
  },
  'HAROP-AL': {
    id: 'HAROP-AL',
    name: 'IAI Harop Loitering SEAD (2x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 380, cost: 1.9,
    rangeKm: 95.0, speedMach: 0.45, seeker: 'PASSIVE_RADAR', rcs: 0.004, isStealthMissile: true,
    trait: 'EMITTER_KILLER', traitBadge: '95KM ANTI-EMCON HAROP',
    behaviorDesc: 'Long-range air-launched suicide SEAD drone (2x, 5 HP, 95 km). Retains coordinates through EMCON shutdowns and inflicts 3x damage to SAM and EW radars.',
    damage: 5, ammoCount: 2, minRangeKm: 6.0, sweetSpotMin: 18.0, sweetSpotMax: 85.0,
    lambda: 0.04, p: 1.0, T_0: 0.92, isAntiRadiation: true, antiEmcon: true,
    sigmaPylon: 0.08, category: 'A2G', a2gGroup: 'LOITERING',
    desc: 'Standoff autonomous SEAD hunter drone (2x, 95 km) engineered to dismantle long-range SAM networks.'
  }
};
