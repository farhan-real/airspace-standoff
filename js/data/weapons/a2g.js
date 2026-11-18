/**
 * js/data/weapons/a2g.js - Unguided general-purpose iron bombs and heavy demolition ordnance.
 */

window.WEAPONS_A2G = {
  'OFAB-250': {
    id: 'OFAB-250',
    name: 'OFAB-250-270 Frag Iron (8x)',
    slots: 1, slotType: 'EXTERNAL', minRating: 'Type S', mass: 2120, cost: 0.3,
    rangeKm: 8.5, speedMach: 0.80, seeker: 'UNGUIDED', rcs: 0.03,
    trait: 'HIGH_FRAG_IRON', traitBadge: '1-SLOT 250KG FRAG',
    behaviorDesc: 'High-fragmentation 250kg unguided bombs (8x, 2 HP). Occupies 1 external slot and resists all ECM jamming during close-in passes.',
    damage: 2, ammoCount: 8, minRangeKm: 1.0, sweetSpotMin: 2.0, sweetSpotMax: 7.0,
    lambda: 0.36, p: 1.4, T_0: 0.72,
    sigmaPylon: 0.10, category: 'A2G', a2gGroup: 'DUMB_BOMBS',
    desc: 'Compact 1-slot 250kg fragmentation iron bombs (8x) built for light attack aircraft and CAS sorties.'
  },
  'MK-82': {
    id: 'MK-82',
    name: 'Mk-82 Snakeye 500lb (8x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type S', mass: 1840, cost: 0.3,
    rangeKm: 9.0, speedMach: 0.80, seeker: 'UNGUIDED', rcs: 0.04,
    trait: 'HIGH_DRAG_IRON', traitBadge: 'LOW-ALT IRON BOMB',
    behaviorDesc: 'Retarded-fin general-purpose 500lb dumb bombs (8x). Immune to ECM and chaff, requiring close low-level ingress; lighter than OFAB-250.',
    damage: 2, ammoCount: 8, minRangeKm: 1.2, sweetSpotMin: 2.5, sweetSpotMax: 7.5,
    lambda: 0.35, p: 1.4, T_0: 0.72,
    sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'DUMB_BOMBS',
    desc: 'Low-cost 500lb retarded iron bombs (8x). Built for high-speed low-altitude passes against AAA, radars, and depots.'
  },
  'MK-83': {
    id: 'MK-83',
    name: 'Mk-83 1000lb Iron Bomb (6x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 2700, cost: 0.4,
    rangeKm: 10.0, speedMach: 0.82, seeker: 'UNGUIDED', rcs: 0.05,
    trait: 'HEAVY_BLAST_IRON', traitBadge: '1000LB 65% AP IRON',
    behaviorDesc: 'Medium 1,000lb unguided iron bombs (6x, 3.5 HP, 65% AP). Lighter than FAB-500 with 50% concrete penetration against fortified sites.',
    damage: 3.5, ammoCount: 6, minRangeKm: 1.4, sweetSpotMin: 2.8, sweetSpotMax: 8.2,
    lambda: 0.34, p: 1.4, T_0: 0.73, armorPiercing: 0.65,
    sigmaPylon: 0.16, category: 'A2G', a2gGroup: 'DUMB_BOMBS',
    desc: 'Medium 1,000lb general-purpose demolition bombs (6x) with semi-piercing casings.'
  },
  'FAB-500': {
    id: 'FAB-500',
    name: 'FAB-500M-62 Heavy Iron (6x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 3000, cost: 0.5,
    rangeKm: 10.5, speedMach: 0.80, seeker: 'UNGUIDED', rcs: 0.05,
    trait: 'HEAVY_BLAST_IRON', traitBadge: '500KG HIGH-EXPLOSIVE',
    behaviorDesc: 'Heavy 500kg high-explosive iron bombs (6x, 4 HP = 24 HP total). High blast yield per drop against armored SAMs and depots.',
    damage: 4, ammoCount: 6, minRangeKm: 1.5, sweetSpotMin: 3.0, sweetSpotMax: 8.5,
    lambda: 0.35, p: 1.4, T_0: 0.72,
    sigmaPylon: 0.18, category: 'A2G', a2gGroup: 'DUMB_BOMBS',
    desc: 'Rugged 500kg unguided blast bombs (6x, 4 HP each). Heavy demolition payload for frontline strike fighters.'
  },
  'MK-84': {
    id: 'MK-84',
    name: 'Mk-84 2000lb Demolition (4x)',
    slots: 3, slotType: 'EXTERNAL', minRating: 'Type H', mass: 3600, cost: 0.6,
    rangeKm: 11.5, speedMach: 0.82, seeker: 'UNGUIDED', rcs: 0.08,
    trait: 'HEAVY_BLAST_IRON', traitBadge: '2000LB BLAST SHOCK',
    behaviorDesc: 'Heavy 2,000lb unguided demolition bombs (4x, 7 HP each). High-explosive blast against armored SAMs and hangars with partial structural shock transfer.',
    damage: 7, ammoCount: 4, minRangeKm: 1.8, sweetSpotMin: 3.5, sweetSpotMax: 9.5,
    lambda: 0.32, p: 1.4, T_0: 0.74, armorPiercing: 0.65,
    sigmaPylon: 0.24, category: 'A2G', a2gGroup: 'DUMB_BOMBS',
    desc: 'Heavy 2,000lb unguided demolition bombs (4x) for heavy hardpoint fighters and bombers.'
  },
  'FAB-1500': {
    id: 'FAB-1500',
    name: 'FAB-1500-M54 Heavy Penetrator (2x)',
    slots: 4, slotType: 'EXTERNAL', minRating: 'Type H', mass: 3100, cost: 0.8,
    rangeKm: 12.0, speedMach: 0.82, seeker: 'UNGUIDED', rcs: 0.10,
    trait: 'HEAVY_PENETRATOR', traitBadge: '1500KG OVERPRESSURE',
    behaviorDesc: 'Heavy 1,500kg demolition bombs (2x, 11 HP). Blast overpressure penetrates fortified roofs and destroys hardened shelters.',
    damage: 11, ammoCount: 2, minRangeKm: 2.0, sweetSpotMin: 4.0, sweetSpotMax: 10.0,
    lambda: 0.30, p: 1.3, T_0: 0.74, isBunkerCracker: true,
    sigmaPylon: 0.28, category: 'A2G', a2gGroup: 'DUMB_BOMBS',
    desc: 'Heavy 1,500kg demolition bombs (2x) capable of penetrating fortified concrete bunkers on direct flyover.'
  },
  'FAB-3000': {
    id: 'FAB-3000',
    name: 'FAB-3000M-54 Super-Heavy (1x)',
    slots: 6, slotType: 'CENTERLINE', minRating: 'Type X', mass: 3000, cost: 1.1,
    rangeKm: 12.5, speedMach: 0.80, seeker: 'UNGUIDED', rcs: 0.14,
    trait: 'SUPER_HEAVY_BLAST', traitBadge: '3000KG 22 HP CRATERING',
    behaviorDesc: 'Massive 3,000kg centerline demolition bomb (1x, 22 HP). Destroys subterranean C2 bunkers or cratered facilities in a single direct pass.',
    damage: 22, ammoCount: 1, minRangeKm: 2.2, sweetSpotMin: 4.5, sweetSpotMax: 10.5,
    lambda: 0.28, p: 1.2, T_0: 0.75, isBunkerCracker: true,
    sigmaPylon: 0.36, category: 'A2G', a2gGroup: 'DUMB_BOMBS',
    allowedAirframes: ['Tu-160M', 'Su-34', 'B-52H', 'B-1B', 'F-111F', 'Su-24M2'],
    desc: 'Colossal 3,000kg heavy demolition bomb (1x, 22 HP) restricted to Type X centerline stations.'
  }
};
