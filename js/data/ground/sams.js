/**
 * AIRSPACE STANDOFF: Long, Medium, Short Range SAMs, CIWS & Low-Altitude AAA Batteries
 */

window.GROUND_SAMS = {
  'S-400': {
    id: 'S-400', name: 'S-400 Triumf Battery', role: 'Long-Range Area Denial SAM',
    category: 'LR_SAM', armorClass: 'ARMORED', hp: 8, rangeKm: 82.0, cooldownMax: 6.5,
    minAltFt: 6500, cuedMinAltFt: 3500, requiresEwCue: true, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 380,
    missileSpec: { id: '48N6DM_SAM', name: '48N6DM Long-Range SAM', rangeKm: 82.0, speedMach: 5.4, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', rcs: 0.14, lambda: 0.24, p: 1.0, damage: 4, T_0: 0.74 },
    desc: 'Strategic area-denial SAM (82 km range, Mach 5.4). Effective above 6,500 ft; low-altitude attackers can terrain-mask unless cued by a Gap-Filler radar.'
  },
  'SAM_HQ9': {
    id: 'SAM_HQ9', name: 'HQ-9B Long-Range SAM', role: 'Track-Via-Missile Area Denial SAM',
    category: 'LR_SAM', armorClass: 'ARMORED', hp: 8, rangeKm: 76.0, cooldownMax: 6.0,
    minAltFt: 5500, cuedMinAltFt: 3000, requiresEwCue: true, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 370,
    missileSpec: { id: 'HQ9B_SAM', name: 'HQ-9B Active AESA SAM', rangeKm: 76.0, speedMach: 4.8, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', antiNotchBonus: 0.20, rcs: 0.12, lambda: 0.22, p: 1.1, damage: 4, T_0: 0.76 },
    desc: 'AESA track-via-missile long-range SAM (76 km range, Mach 4.8). Higher mid-course guidance resistance makes Doppler notching harder.'
  },
  'SAM_PATRIOT': {
    id: 'SAM_PATRIOT', name: 'MIM-104F Patriot PAC-3', role: 'High-Agility Long-Range SAM',
    category: 'LR_SAM', armorClass: 'ARMORED', hp: 7, rangeKm: 68.0, cooldownMax: 5.8,
    minAltFt: 4500, cuedMinAltFt: 2500, requiresEwCue: true, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 360,
    missileSpec: { id: 'PAC3_MSE_SAM', name: 'PAC-3 MSE Hit-to-Kill SAM', rangeKm: 68.0, speedMach: 4.9, seeker: 'ARH', category: 'SAM', trait: 'DUAL_PULSE_SURGE', antiNotchBonus: 0.25, rcs: 0.10, lambda: 0.18, p: 1.2, damage: 3, T_0: 0.80 },
    desc: 'Agile hit-to-kill long-range SAM (68 km range). Higher terminal maneuver authority makes Doppler notching harder inside 28 km.'
  },
  'SAM_S300V': {
    id: 'SAM_S300V', name: 'S-300V4 Antey-2500', role: 'Extreme-Standoff Heavy SAM',
    category: 'LR_SAM', armorClass: 'ARMORED', hp: 9, rangeKm: 92.0, cooldownMax: 8.2,
    minAltFt: 8000, cuedMinAltFt: 4500, requiresEwCue: true, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 400,
    missileSpec: { id: '9M82M_SAM', name: '9M82M Heavy Hypersonic SAM', rangeKm: 92.0, speedMach: 6.0, seeker: 'ARH', category: 'SAM', trait: 'LOFTED_HYPERSONIC', rcs: 0.22, lambda: 0.22, p: 1.1, damage: 5, T_0: 0.70 },
    desc: 'Extreme standoff heavy SAM (92 km, Mach 6.0). Effective against high-altitude aircraft, while wide turning radius allows agile fighters to notch perpendicular.'
  },
  'SAM_BUK': {
    id: 'SAM_BUK', name: '9K37M3 Buk-M3 TELAR', role: 'Self-Contained Medium-Range SAM',
    category: 'MR_SAM', armorClass: 'ARMORED', hp: 6, rangeKm: 46.0, cooldownMax: 5.2,
    minAltFt: 2500, cuedMinAltFt: 1500, requiresEwCue: false, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 280,
    missileSpec: { id: '9M317M_SAM', name: '9M317M Active Medium SAM', rangeKm: 46.0, speedMach: 3.6, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', rcs: 0.09, lambda: 0.25, p: 1.0, damage: 3, T_0: 0.75 },
    desc: 'Mobile medium-range TELAR with organic fire-control radar (46 km). Continues engaging independently even after sector EW radars are destroyed.'
  },
  'SAM_NASAMS': {
    id: 'SAM_NASAMS', name: 'NASAMS-3 AMRAAM-ER', role: 'Networked Active Medium SAM',
    category: 'MR_SAM', armorClass: 'ARMORED', hp: 5, rangeKm: 40.0, cooldownMax: 4.5,
    minAltFt: 2200, cuedMinAltFt: 1500, requiresEwCue: false, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 260,
    missileSpec: { id: 'AMRAAM_ER_SAM', name: 'Surface-Launched AMRAAM-ER', rangeKm: 40.0, speedMach: 3.5, seeker: 'ARH', category: 'SAM', trait: 'NETWORKED_LOAL', rcs: 0.05, lambda: 0.26, p: 1.0, damage: 3, T_0: 0.77 },
    desc: 'Rapid-firing medium SAM launcher (40 km). Fires low-RCS AMRAAM-ER interceptors with short reload cycles.'
  },
  'SAM_HAWK': {
    id: 'SAM_HAWK', name: 'MIM-23 Hawk Phase III', role: 'Upgraded Medium-Range SAM',
    category: 'MR_SAM', armorClass: 'SOFT', hp: 4, rangeKm: 36.0, cooldownMax: 5.8,
    minAltFt: 2400, cuedMinAltFt: 1600, requiresEwCue: false, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 230,
    missileSpec: { id: 'MIM23K_SAM', name: 'MIM-23K Upgraded SAM', rangeKm: 36.0, speedMach: 2.9, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', rcs: 0.12, lambda: 0.30, p: 1.0, damage: 3, T_0: 0.70 },
    desc: 'Modernized medium-range SAM battery (36 km, Mach 2.9). Guards border sectors and forward airbases.'
  },
  'SAM_KUB': {
    id: 'SAM_KUB', name: '2K12 Kub (SA-6 Gainful)', role: 'Legacy Semi-Active Medium SAM',
    category: 'MR_SAM', armorClass: 'SOFT', hp: 4, rangeKm: 32.0, cooldownMax: 6.5,
    minAltFt: 2800, cuedMinAltFt: 2000, requiresEwCue: false, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 220,
    missileSpec: { id: '3M9_SAM', name: '3M9 Semi-Active SAM', rangeKm: 32.0, speedMach: 2.8, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', rcs: 0.14, lambda: 0.35, p: 1.0, damage: 3, T_0: 0.66 },
    desc: 'Legacy semi-active medium SAM (32 km). Vulnerable to chaff clouds and ECM jamming pods.'
  },
  'SAM_TOR': {
    id: 'SAM_TOR', name: '9K332 Tor-M2 SHORAD', role: 'All-Weather Short-Range Point Defense',
    category: 'SR_SAM', armorClass: 'ARMORED', hp: 5, rangeKm: 18.0, cooldownMax: 3.6,
    minAltFt: 1000, cuedMinAltFt: 1000, requiresEwCue: false, canAttack: true, canInterceptMissiles: true, interceptAccuracy: 0.55, isEmitter: true, concealedUntilActive: true, vpValue: 200,
    missileSpec: { id: '9M338_SAM', name: '9M338 Cold-Launch SHORAD', rangeKm: 18.0, speedMach: 2.8, seeker: 'ARH', category: 'SAM', trait: 'HOBS_VANE', rcs: 0.04, lambda: 0.25, p: 1.0, damage: 2, T_0: 0.78 },
    desc: 'Tracked SHORAD battery (18 km). Tracks aircraft down to deck altitude and intercepts incoming cruise missiles and glide bombs.'
  },
  'SAM_RAPIER': {
    id: 'SAM_RAPIER', name: 'Rapier Optical SHORAD', role: 'Passive Electro-Optical Short SAM',
    category: 'SR_SAM', armorClass: 'SOFT', hp: 4, rangeKm: 15.0, cooldownMax: 4.2,
    minAltFt: 1000, cuedMinAltFt: 1000, requiresEwCue: false, canAttack: true, isEmitter: false, concealedUntilActive: true, vpValue: 190,
    missileSpec: { id: 'RAPIER_MK2', name: 'Rapier Optical-Command SAM', rangeKm: 15.0, speedMach: 2.5, seeker: 'EO', category: 'SAM', trait: 'HOBS_VANE', rcs: 0.03, lambda: 0.25, p: 1.0, damage: 2, T_0: 0.76 },
    desc: 'Passive optical-tracked SHORAD (15 km). Emits zero radar signal, giving no RWR warning and remaining immune to Anti-Radiation Missiles.'
  },
  'SAM_AVENGER': {
    id: 'SAM_AVENGER', name: 'Strela-10M / Avenger IR', role: 'Passive Infrared Low-Altitude SHORAD',
    category: 'SR_SAM', armorClass: 'SOFT', hp: 3, rangeKm: 11.0, cooldownMax: 4.0,
    minAltFt: 1000, cuedMinAltFt: 1000, requiresEwCue: false, canAttack: true, isEmitter: false, concealedUntilActive: true, vpValue: 160,
    missileSpec: { id: 'STRELA_IR_SAM', name: 'IR Heat-Seeking SHORAD', rangeKm: 11.0, speedMach: 2.3, seeker: 'IIR', category: 'SAM', trait: 'SNAP_TURN', rcs: 0.02, lambda: 0.30, p: 1.0, damage: 2, T_0: 0.74 },
    desc: 'Passive infrared SHORAD protecting fuel and munition dumps (11 km). Zero RWR alert; idle throttle and cloud cover degrade seeker tracking.'
  },
  'PANTSIR': {
    id: 'PANTSIR', name: 'Pantsir-S1 Hybrid CIWS', role: 'Point-Defense Missile & Twin 30mm System',
    category: 'CIWS', armorClass: 'ARMORED', hp: 6, rangeKm: 18.0, cooldownMax: 1.8,
    minAltFt: 1000, cuedMinAltFt: 1000, canAttack: true, canInterceptMissiles: true, interceptAccuracy: 0.65,
    aaaRangeKm: 7.0, aaaMaxAltFt: 12000, aaaDamage: 1.0, isEmitter: true, concealedUntilActive: true, vpValue: 220,
    desc: 'Point-defense CIWS (7.5 km munition intercept dome). Intercepts incoming bombs and cruise missiles while firing 30mm guns at low-flying attackers.'
  },
  'CIWS_SEARAM': {
    id: 'CIWS_SEARAM', name: 'SeaRAM / Land Phalanx CIWS', role: 'Autonomous Munition Interceptor',
    category: 'CIWS', armorClass: 'ARMORED', hp: 5, rangeKm: 14.0, cooldownMax: 1.5,
    minAltFt: 1000, cuedMinAltFt: 1000, canAttack: false, canInterceptMissiles: true, interceptAccuracy: 0.72,
    isEmitter: true, concealedUntilActive: true, vpValue: 220,
    desc: 'Rapid-cycling SeaRAM point-defense turret (7.5 km intercept perimeter). Dedicated counter-PGM defense targeting SDBs, glide bombs, and subsonic cruise missiles.'
  },
  'AAA_TUNGUSKA': {
    id: 'AAA_TUNGUSKA', name: '2K22M Tunguska Hybrid AAA', role: 'Twin 30mm SPAAG & 9M311 SHORAD',
    category: 'AAA', armorClass: 'ARMORED', hp: 5, rangeKm: 11.5, cooldownMax: 2.2,
    minAltFt: 1000, cuedMinAltFt: 1000, requiresEwCue: false, aaaRangeKm: 6.5, aaaMaxAltFt: 14500, aaaDamage: 1.1,
    isAaaGun: true, canAttack: true, canInterceptMissiles: true, interceptAccuracy: 0.45, isEmitter: true, concealedUntilActive: true, vpValue: 185,
    missileSpec: { id: '9M311_SAM', name: '9M311 Optical Command SAM', rangeKm: 11.5, speedMach: 2.8, seeker: 'EO', category: 'SAM', trait: 'HOBS_VANE', rcs: 0.03, lambda: 0.28, p: 1.0, damage: 2, T_0: 0.74 },
    desc: 'Armored hybrid anti-aircraft system pairing twin 30mm flak cannons (6.5 km) with optical 9M311 missiles (11.5 km) and 45% glide-bomb interception.'
  },
  'AAA_SHILKA': {
    id: 'AAA_SHILKA', name: 'ZSU-23-4M4 Shilka AAA', role: 'Low-Altitude Quad 23mm Autocannon',
    category: 'AAA', armorClass: 'SOFT', hp: 4, rangeKm: 7.5, cooldownMax: 2.2,
    minAltFt: 1000, aaaMaxAltFt: 14000, aaaDamage: 0.9, isAaaGun: true, canAttack: true, isEmitter: false, concealedUntilActive: true, vpValue: 120,
    desc: 'Quad 23mm low-altitude radar-optical AAA (7.5 km slant range, up to 14,000 ft). Engages low-altitude bombing and strafing passes.'
  },
  'AAA_GEPARD': {
    id: 'AAA_GEPARD', name: 'Gepard Twin 35mm SPAAG', role: 'Armored 35mm Dual-Role AAA',
    category: 'AAA', armorClass: 'ARMORED', hp: 5, rangeKm: 9.5, cooldownMax: 2.0,
    minAltFt: 1000, aaaMaxAltFt: 16500, aaaDamage: 1.2, isAaaGun: true, canAttack: true, canInterceptMissiles: true, interceptAccuracy: 0.40, isEmitter: true, concealedUntilActive: true, vpValue: 150,
    desc: 'Twin 35mm armored flak vehicle (9.5 km slant range, up to 16,500 ft). Engages low-altitude attackers and intercepts slow glide munitions.'
  },
  'AAA_FLAK57': {
    id: 'AAA_FLAK57', name: 'S-60 / 57mm Proximity Flak', role: 'Medium-Ceiling Proximity Airburst AAA',
    category: 'AAA', armorClass: 'SOFT', hp: 4, rangeKm: 12.0, cooldownMax: 2.8,
    minAltFt: 1000, aaaMaxAltFt: 22000, aaaDamage: 1.4, isAaaGun: true, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 140,
    desc: 'Heavy 57mm proximity-fuzed flak battery (12 km range, up to 22,000 ft). Threatens slow bombers and medium-altitude LGB delivery passes.'
  }
};
