/**
 * js/data/weapons/a2gcluster.js - Area-saturation cluster dispensers and sensor-fuzed anti-armor munitions.
 */

window.WEAPONS_A2G_CLUSTER = {
  'CBU-87': {
    id: 'CBU-87',
    name: 'CBU-87 CEM Cluster (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 1720, cost: 0.7,
    rangeKm: 15.0, speedMach: 0.82, seeker: 'UNGUIDED', rcs: 0.04,
    trait: 'CLUSTER_SUBMUNITIONS', traitBadge: '5.5KM CLUSTER AOE',
    behaviorDesc: 'Combined Effects Munition dispersing 202 bomblets across a 5.5 km footprint. Clears dense AAA, radar vans, and fuel farms in one pass.',
    damage: 3, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 4.0, sweetSpotMax: 12.5,
    lambda: 0.28, p: 1.2, T_0: 0.82, isCluster: true, clusterRadiusKm: 5.5, clusterDamage: 3.0,
    sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'CLUSTER',
    desc: 'Area-saturation cluster dispensers (4x) scattering fragmentation and incendiary submunitions across wide target clusters.'
  },
  'RBK-500': {
    id: 'RBK-500',
    name: 'RBK-500 SPBE-D Cluster (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 2000, cost: 0.8,
    rangeKm: 17.0, speedMach: 0.84, seeker: 'UNGUIDED', rcs: 0.04,
    trait: 'ANTI_ARMOR_CLUSTER', traitBadge: '6.0KM ANTI-ARMOR AOE',
    behaviorDesc: 'Sensor-fuzed anti-armor submunition dispenser (6.0 km splash). Targets armored SAM TELARs and mobile command posts.',
    damage: 4, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 4.5, sweetSpotMax: 14.5,
    lambda: 0.25, p: 1.2, T_0: 0.84, isCluster: true, clusterRadiusKm: 6.0, clusterDamage: 3.5, armorPiercing: 0.80,
    sigmaPylon: 0.15, category: 'A2G', a2gGroup: 'CLUSTER',
    desc: 'Anti-armor cluster bombs (4x) designed to neutralize armored SAM batteries and vehicle columns.'
  },
  'CBU-97': {
    id: 'CBU-97',
    name: 'CBU-97 Sensor Fuzed SFW (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 1680, cost: 1.0,
    rangeKm: 18.0, speedMach: 0.84, seeker: 'UNGUIDED', rcs: 0.04,
    trait: 'SENSOR_FUZED_CLUSTER', traitBadge: '6.2KM SKEET ANTI-ARMOR',
    behaviorDesc: 'Unpowered dispenser releasing 40 IR-guided Skeet warheads (6.2 km splash). High armor penetration against clustered SAM batteries and parked jets.',
    damage: 4.5, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 4.5, sweetSpotMax: 15.5,
    lambda: 0.22, p: 1.2, T_0: 0.86, isCluster: true, clusterRadiusKm: 6.2, clusterDamage: 4.0, armorPiercing: 0.90,
    sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'CLUSTER',
    desc: 'Smart anti-armor cluster bombs (4x) deploying dual-band infrared Skeet projectiles over fortified air-defense belts.'
  },
  'RBK-500-PTAB': {
    id: 'RBK-500-PTAB',
    name: 'RBK-500U PTAB-1M Anti-Tank (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 2040, cost: 0.9,
    rangeKm: 16.5, speedMach: 0.84, seeker: 'UNGUIDED', rcs: 0.04,
    trait: 'ANTI_ARMOR_CLUSTER', traitBadge: '5.8KM SHAPED-CHARGE AOE',
    behaviorDesc: 'High-density dispenser scattering 268 shaped-charge bomblets across a 5.8 km zone. Strips AAA guns, open airfield pads, and armored SAM launchers.',
    damage: 4, ammoCount: 4, minRangeKm: 2.0, sweetSpotMin: 4.0, sweetSpotMax: 14.0,
    lambda: 0.24, p: 1.2, T_0: 0.85, isCluster: true, clusterRadiusKm: 5.8, clusterDamage: 3.8, armorPiercing: 0.85,
    sigmaPylon: 0.15, category: 'A2G', a2gGroup: 'CLUSTER',
    desc: 'Shaped-charge anti-armor cluster bombs (4x) saturated for multi-target airfield and air-defense sweeps.'
  },
  'CBU-105': {
    id: 'CBU-105',
    name: 'CBU-105 WCMD SFW (4x)',
    slots: 2, slotType: 'EXTERNAL', minRating: 'Type M', mass: 1800, cost: 1.3,
    rangeKm: 28.0, speedMach: 0.85, seeker: 'GPS_INS', rcs: 0.04,
    trait: 'SENSOR_FUZED_CLUSTER', traitBadge: '7.0KM SMART SFW AOE',
    behaviorDesc: 'Wind-Corrected Munitions Dispenser with IR/Laser sensor-fuzed submunitions (7.0 km radius). Seeks armored vehicles and radars across dense defense clusters.',
    damage: 5, ammoCount: 4, minRangeKm: 3.0, sweetSpotMin: 6.0, sweetSpotMax: 24.0,
    lambda: 0.12, p: 1.1, T_0: 0.88, isCluster: true, clusterRadiusKm: 7.0, clusterDamage: 4.5, armorPiercing: 0.90,
    sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'CLUSTER',
    desc: 'GPS-corrected sensor-fuzed cluster dispensers (4x) delivering wide-area anti-armor strikes from medium standoff.'
  },
  'AGM-154A': {
    id: 'AGM-154A',
    name: 'AGM-154A JSOW-A Cluster (4x)',
    slots: 2, slotType: 'INTERNAL', minRating: 'Type M', mass: 1940, cost: 1.5,
    rangeKm: 74.0, speedMach: 0.85, seeker: 'GPS_INS', rcs: 0.008, isStealthMissile: true,
    trait: 'STANDOFF_CLUSTER_GLIDE', traitBadge: '74KM CLUSTER GLIDE',
    behaviorDesc: 'Low-observable standoff glide dispenser carrying 145 BLU-97 submunitions (6.5 km AOE). Saturates SAM batteries from outside medium SAM range.',
    damage: 4, ammoCount: 4, minRangeKm: 6.0, sweetSpotMin: 16.0, sweetSpotMax: 66.0,
    lambda: 0.08, p: 1.0, T_0: 0.86, isCluster: true, clusterRadiusKm: 6.5, clusterDamage: 4.0,
    sigmaPylon: 0.14, category: 'A2G', a2gGroup: 'CLUSTER',
    desc: 'Standoff cluster glide bombs (4x, 74 km) compatible with internal stealth bays and external racks.'
  }
};
