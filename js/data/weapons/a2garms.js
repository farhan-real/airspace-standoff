/**
 * js/data/weapons/a2garms.js - Anti-Radiation Missiles (ARM) for SEAD radar and SAM suppression.
 */

window.WEAPONS_A2G_ARMS = {
  'AGM-45B': {
    id: 'AGM-45B', name: 'AGM-45B Shrike Legacy (4x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 720, cost: 0.5, rangeKm: 34.0, speedMach: 2.0, seeker: 'PASSIVE_RADAR', rcs: 0.04,
    trait: 'EMITTER_KILLER', traitBadge: '3x RADAR DAMAGE',
    behaviorDesc: 'Lightweight legacy anti-radiation missile (4x, 34 km, Mach 2.0). Loses track if radar enters EMCON shutdown, forcing SAM suppression.',
    damage: 3, ammoCount: 4, minRangeKm: 3.0, sweetSpotMin: 8.0, sweetSpotMax: 29.0, lambda: 0.28, p: 1.2, T_0: 0.78,
    isAntiRadiation: true, sigmaPylon: 0.08, category: 'A2G', a2gGroup: 'ARM',
    desc: 'Economical 1-slot anti-radiation missile (4x) suited for light multirole fighters suppressing older radars.'
  },
  'MAR-1': {
    id: 'MAR-1', name: 'MAR-1 Agile Tactical ARM (4x)', slots: 1, slotType: 'EXTERNAL', minRating: 'Type S',
    mass: 1090, cost: 0.7, rangeKm: 42.0, speedMach: 2.3, seeker: 'PASSIVE_RADAR', rcs: 0.03,
    trait: 'EMITTER_KILLER', traitBadge: '1-SLOT 42KM ARM',
    behaviorDesc: 'Compact 1-slot tactical anti-radiation missile (4x, 3.5 HP, 42 km). Built for light attack aircraft and drones hunting mobile SAM radars.',
    damage: 3.5, ammoCount: 4, minRangeKm: 3.5, sweetSpotMin: 9.0, sweetSpotMax: 36.0, lambda: 0.24, p: 1.2, T_0: 0.82,
    isAntiRadiation: true, sigmaPylon: 0.09, category: 'A2G', a2gGroup: 'ARM',
    desc: 'Lightweight 1-slot Mach 2.3 anti-radiation missiles (4x, 42 km) for light strike and SEAD aircraft.'
  },
  'MARTEL-AS37': {
    id: 'MARTEL-AS37', name: 'AS.37 Martel Heavy ARM (2x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 1060, cost: 0.9, rangeKm: 56.0, speedMach: 2.0, seeker: 'PASSIVE_RADAR', rcs: 0.06,
    trait: 'EMITTER_KILLER', traitBadge: '6.5 HP HEAVY ARM',
    behaviorDesc: 'Heavy-warhead anti-radiation missile (2x, 6.5 HP, 56 km). Inflicts massive blast damage to fortified radar installations and command nodes.',
    damage: 6.5, ammoCount: 2, minRangeKm: 4.5, sweetSpotMin: 11.0, sweetSpotMax: 48.0, lambda: 0.22, p: 1.2, T_0: 0.83,
    isAntiRadiation: true, sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'ARM',
    desc: 'Heavy-warhead SEAD anti-radiation missiles (2x, 56 km) used by Tornado and Mirage interdictors.'
  },
  'KH-31P': {
    id: 'KH-31P', name: 'Kh-31P Ramjet ARM (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 2400, cost: 1.0, rangeKm: 62.0, speedMach: 3.1, seeker: 'PASSIVE_RADAR', rcs: 0.06,
    trait: 'EMITTER_KILLER', traitBadge: '3x SAM DAMAGE RAMJET',
    behaviorDesc: 'Supersonic ramjet anti-radiation missile (4x, 62 km, Mach 3.1). Sustained ramjet thrust closes rapidly before CIWS or EMCON reacts.',
    damage: 5, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 12.0, sweetSpotMax: 54.0, lambda: 0.14, p: 2.0, T_0: 0.84,
    isAntiRadiation: true, sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'ARM',
    desc: 'High-speed ramjet anti-radiation missile (4x, 62 km) delivering 3x damage against emitting radars and SAMs.'
  },
  'AGM-88C': {
    id: 'AGM-88C', name: 'AGM-88C HARM Standard (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 1440, cost: 1.1, rangeKm: 68.0, speedMach: 3.0, seeker: 'PASSIVE_RADAR', rcs: 0.05,
    trait: 'EMITTER_KILLER', traitBadge: '3x SAM DAMAGE',
    behaviorDesc: 'Standard supersonic SEAD missile (4x, 68 km, Mach 3.0). Deals 3x damage to emitting radars; defeated if skilled SAM crews shut down in EMCON.',
    damage: 5, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 14.0, sweetSpotMax: 60.0, lambda: 0.24, p: 1.4, T_0: 0.84,
    isAntiRadiation: true, sigmaPylon: 0.12, category: 'A2G', a2gGroup: 'ARM',
    desc: 'Standard tactical SEAD anti-radiation missile (4x, 68 km) for radar suppression and emitter neutralization.'
  },
  'AGM-88E': {
    id: 'AGM-88E', name: 'AGM-88E AARGM Dual-Seeker (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 1440, cost: 1.3, rangeKm: 78.0, speedMach: 3.2, seeker: 'PASSIVE_RADAR', rcs: 0.04,
    trait: 'EMITTER_KILLER', traitBadge: 'ANTI-EMCON MMW HARM',
    behaviorDesc: 'Upgraded HARM pairing passive RF homing with active millimeter-wave terminal radar (4x, 78 km). Defeats EMCON radar shutdowns on external pylons.',
    damage: 5, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 15.0, sweetSpotMax: 68.0, lambda: 0.20, p: 1.4, T_0: 0.87,
    isAntiRadiation: true, antiEmcon: true, sigmaPylon: 0.12, category: 'A2G', a2gGroup: 'ARM',
    desc: 'Dual-seeker AARGM anti-radiation missiles (4x, 78 km) maintaining target lock through EMCON shutdowns.'
  },
  'ALARM-II': {
    id: 'ALARM-II', name: 'ALARM Mk2 Loitering ARM (4x)', slots: 2, slotType: 'EXTERNAL', minRating: 'Type M',
    mass: 1080, cost: 1.3, rangeKm: 75.0, speedMach: 2.4, seeker: 'PASSIVE_RADAR', rcs: 0.04,
    trait: 'EMITTER_KILLER', traitBadge: 'ANTI-EMCON MEMORY',
    behaviorDesc: 'Loitering anti-radiation missile (4x, 75 km). Inertial memory retains emitter coordinates if the radar shuts down into EMCON.',
    damage: 5, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 15.0, sweetSpotMax: 66.0, lambda: 0.18, p: 1.4, T_0: 0.86,
    isAntiRadiation: true, antiEmcon: true, sigmaPylon: 0.10, category: 'A2G', a2gGroup: 'ARM',
    desc: 'Inertial-memory SEAD missile (4x, 75 km) retaining target track memory through adversary EMCON radar shutdowns.'
  },
  'KH-58USHKE': {
    id: 'KH-58USHKE', name: 'Kh-58UShKE Internal ARM (2x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 1300, cost: 1.5, rangeKm: 95.0, speedMach: 3.6, seeker: 'PASSIVE_RADAR', rcs: 0.02,
    trait: 'EMITTER_KILLER', traitBadge: 'INTERNAL 95KM ARM',
    behaviorDesc: 'Folding-fin stealth-bay supersonic ARM (2x, 95 km, Mach 3.6). Inertial backup locks last emitter position against EMCON shutdowns.',
    damage: 6, ammoCount: 2, minRangeKm: 6.0, sweetSpotMin: 18.0, sweetSpotMax: 85.0, lambda: 0.18, p: 1.5, T_0: 0.88,
    isAntiRadiation: true, antiEmcon: true, sigmaPylon: 0.10, category: 'A2G', a2gGroup: 'ARM',
    desc: 'Internal-bay compatible Mach 3.6 anti-radiation missile (2x, 95 km) defeating EMCON radar shutdowns.'
  },
  'AGM-88G': {
    id: 'AGM-88G', name: 'AGM-88G AARGM-ER (4x)', slots: 2, slotType: 'INTERNAL', minRating: 'Type M',
    mass: 2100, cost: 1.6, rangeKm: 90.0, speedMach: 3.6, seeker: 'PASSIVE_RADAR', rcs: 0.06,
    trait: 'EMITTER_KILLER', traitBadge: '3x SAM + MMW TERMINAL',
    behaviorDesc: 'Passive RF seeker with terminal MMW radar (4x, Mach 3.6). Retains lock through EMCON shutdowns and deals 3x damage to SAMs and jammers.',
    damage: 5, ammoCount: 4, minRangeKm: 5.0, sweetSpotMin: 15.0, sweetSpotMax: 80.0, lambda: 0.20, p: 1.5, T_0: 0.88,
    isAntiRadiation: true, antiEmcon: true, sigmaPylon: 0.12, category: 'A2G', a2gGroup: 'ARM',
    desc: 'Extended-range anti-radiation missile (4x, 90 km, Mach 3.6) with MMW terminal homing that overcomes EMCON shutdowns.'
  }
};
