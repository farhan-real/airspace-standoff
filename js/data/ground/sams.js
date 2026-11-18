/**
 * js/data/ground/sams.js - Long, Medium, Short Range SAMs, CIWS & Low-Altitude AAA Batteries.
 */

window.GROUND_SAMS = {
  'S-400': {
    id: 'S-400', name: 'S-400 Triumf Battery', role: 'Long-Range Area Denial SAM',
    category: 'LR_SAM', armorClass: 'ARMORED', hp: 8, rangeKm: 66.0, cooldownMax: 12.0,
    maxAmmo: 12, readyRackSize: 4, rackReloadSec: 28.0, maxActiveMissiles: 2,
    minAltFt: 8000, cuedMinAltFt: 4800, requiresEwCue: true, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 380,
    missileSpec: { id: '48N6DM_SAM', name: '48N6DM Long-Range SAM', rangeKm: 66.0, speedMach: 4.8, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', rcs: 0.14, lambda: 0.30, p: 1.0, damage: 3.5, T_0: 0.62 },
    desc: 'Strategic area-denial SAM (66 km range, 12 missiles / 4 ready-rack). Effective above 8,000 ft (4,800 ft with Gap-Filler); low-altitude aircraft and ECM pods disrupt its fire-control radar.'
  },
  'SAM_HQ9': {
    id: 'SAM_HQ9', name: 'HQ-9B Long-Range SAM', role: 'Track-Via-Missile Area Denial SAM',
    category: 'LR_SAM', armorClass: 'ARMORED', hp: 8, rangeKm: 60.0, cooldownMax: 11.0,
    maxAmmo: 12, readyRackSize: 4, rackReloadSec: 26.0, maxActiveMissiles: 2,
    minAltFt: 7000, cuedMinAltFt: 4200, requiresEwCue: true, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 370,
    missileSpec: { id: 'HQ9B_SAM', name: 'HQ-9B Active AESA SAM', rangeKm: 60.0, speedMach: 4.4, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', antiNotchBonus: 0.14, rcs: 0.12, lambda: 0.28, p: 1.1, damage: 3, T_0: 0.64 },
    desc: 'AESA track-via-missile long-range SAM (60 km range, 12 missiles / 4 ready-rack). Slightly resists Doppler notching while vulnerable to low-altitude masking and standoff ECM jamming.'
  },
  'SAM_PATRIOT': {
    id: 'SAM_PATRIOT', name: 'MIM-104F Patriot PAC-3', role: 'High-Agility Long-Range SAM',
    category: 'LR_SAM', armorClass: 'ARMORED', hp: 7, rangeKm: 56.0, cooldownMax: 10.5,
    maxAmmo: 12, readyRackSize: 4, rackReloadSec: 26.0, maxActiveMissiles: 2,
    minAltFt: 6000, cuedMinAltFt: 3600, requiresEwCue: true, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 360,
    missileSpec: { id: 'PAC3_MSE_SAM', name: 'PAC-3 MSE Hit-to-Kill SAM', rangeKm: 56.0, speedMach: 4.5, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', antiNotchBonus: 0.16, rcs: 0.10, lambda: 0.24, p: 1.2, damage: 3, T_0: 0.66 },
    desc: 'Agile hit-to-kill long-range SAM (56 km range, 12 missiles / 4 ready-rack). Enters a 26s reload cycle once its 4 ready-rack launchers empty.'
  },
  'SAM_S300V': {
    id: 'SAM_S300V', name: 'S-300V4 Antey-2500', role: 'Extreme-Standoff Heavy SAM',
    category: 'LR_SAM', armorClass: 'ARMORED', hp: 9, rangeKm: 74.0, cooldownMax: 14.0,
    maxAmmo: 8, readyRackSize: 4, rackReloadSec: 32.0, maxActiveMissiles: 1,
    minAltFt: 9500, cuedMinAltFt: 6000, requiresEwCue: true, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 400,
    missileSpec: { id: '9M82M_SAM', name: '9M82M Heavy Hypersonic SAM', rangeKm: 74.0, speedMach: 5.2, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', rcs: 0.22, lambda: 0.28, p: 1.1, damage: 4, T_0: 0.58 },
    desc: 'Heavy standoff SAM (74 km, 8 missiles / 4 ready-rack). Guides 1 interceptor at a time against high-altitude aircraft; wide turn radius allows agile jets to notch perpendicular.'
  },
  'SAM_BUK': {
    id: 'SAM_BUK', name: '9K37M3 Buk-M3 TELAR', role: 'Self-Contained Medium-Range SAM',
    category: 'MR_SAM', armorClass: 'ARMORED', hp: 6, rangeKm: 38.0, cooldownMax: 10.0,
    maxAmmo: 8, readyRackSize: 4, rackReloadSec: 24.0, maxActiveMissiles: 1,
    minAltFt: 3500, cuedMinAltFt: 2400, requiresEwCue: false, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 280,
    missileSpec: { id: '9M317M_SAM', name: '9M317M Active Medium SAM', rangeKm: 38.0, speedMach: 3.3, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', rcs: 0.09, lambda: 0.30, p: 1.0, damage: 2.5, T_0: 0.64 },
    desc: 'Mobile medium-range TELAR with organic fire-control radar (38 km, 8 missiles / 4 ready-rack). Guides 1 active missile at a time and operates independently of sector EW radars.'
  },
  'SAM_NASAMS': {
    id: 'SAM_NASAMS', name: 'NASAMS-3 AMRAAM-ER', role: 'Networked Active Medium SAM',
    category: 'MR_SAM', armorClass: 'ARMORED', hp: 5, rangeKm: 34.0, cooldownMax: 9.0,
    maxAmmo: 12, readyRackSize: 6, rackReloadSec: 24.0, maxActiveMissiles: 2,
    minAltFt: 3200, cuedMinAltFt: 2200, requiresEwCue: false, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 260,
    missileSpec: { id: 'AMRAAM_ER_SAM', name: 'Surface-Launched AMRAAM-ER', rangeKm: 34.0, speedMach: 3.2, seeker: 'ARH', category: 'SAM', trait: 'NETWORKED_LOAL', rcs: 0.05, lambda: 0.30, p: 1.0, damage: 2.5, T_0: 0.65 },
    desc: 'Networked 6-cell medium SAM launcher (34 km, 12 missiles / 6 ready-rack). Fires low-RCS AMRAAM-ER interceptors across two engagement channels.'
  },
  'SAM_HAWK': {
    id: 'SAM_HAWK', name: 'MIM-23 Hawk Phase III', role: 'Upgraded Medium-Range SAM',
    category: 'MR_SAM', armorClass: 'SOFT', hp: 4, rangeKm: 30.0, cooldownMax: 11.0,
    maxAmmo: 6, readyRackSize: 3, rackReloadSec: 26.0, maxActiveMissiles: 1,
    minAltFt: 3400, cuedMinAltFt: 2400, requiresEwCue: false, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 230,
    missileSpec: { id: 'MIM23K_SAM', name: 'MIM-23K Upgraded SAM', rangeKm: 30.0, speedMach: 2.7, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', rcs: 0.12, lambda: 0.34, p: 1.0, damage: 2.5, T_0: 0.60 },
    desc: 'Modernized medium-range SAM battery (30 km, 6 missiles / 3 ready-rack). Guards border approaches and forward outposts.'
  },
  'SAM_KUB': {
    id: 'SAM_KUB', name: '2K12 Kub (SA-6 Gainful)', role: 'Legacy Semi-Active Medium SAM',
    category: 'MR_SAM', armorClass: 'SOFT', hp: 4, rangeKm: 26.0, cooldownMax: 12.5,
    maxAmmo: 6, readyRackSize: 3, rackReloadSec: 28.0, maxActiveMissiles: 1,
    minAltFt: 3600, cuedMinAltFt: 2600, requiresEwCue: false, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 220,
    missileSpec: { id: '3M9_SAM', name: '3M9 Semi-Active SAM', rangeKm: 26.0, speedMach: 2.6, seeker: 'ARH', category: 'SAM', trait: 'SURFACE_SAM', rcs: 0.14, lambda: 0.38, p: 1.0, damage: 2.5, T_0: 0.56 },
    desc: 'Legacy semi-active medium SAM (26 km, 6 missiles / 3 ready-rack). Vulnerable to chaff clouds and ECM jamming pods.'
  },
  'SAM_TOR': {
    id: 'SAM_TOR', name: '9K332 Tor-M2 SHORAD', role: 'All-Weather Short-Range Point Defense',
    category: 'SR_SAM', armorClass: 'ARMORED', hp: 5, rangeKm: 16.0, cooldownMax: 8.0,
    maxAmmo: 8, readyRackSize: 4, rackReloadSec: 22.0, maxActiveMissiles: 1,
    minAltFt: 1000, cuedMinAltFt: 1000, requiresEwCue: false, canAttack: true, canInterceptMissiles: true, interceptAccuracy: 0.45, isEmitter: true, concealedUntilActive: true, vpValue: 200,
    missileSpec: { id: '9M338_SAM', name: '9M338 Cold-Launch SHORAD', rangeKm: 16.0, speedMach: 2.6, seeker: 'ARH', category: 'SAM', trait: 'HOBS_VANE', rcs: 0.04, lambda: 0.30, p: 1.0, damage: 1.5, T_0: 0.64 },
    desc: 'Tracked SHORAD battery (16 km, 8 missiles / 4 ready-rack). Defends against low-altitude aircraft and intercepts incoming slow glide bombs.'
  },
  'SAM_RAPIER': {
    id: 'SAM_RAPIER', name: 'Rapier Optical SHORAD', role: 'Passive Electro-Optical Short SAM',
    category: 'SR_SAM', armorClass: 'SOFT', hp: 4, rangeKm: 14.0, cooldownMax: 8.5,
    maxAmmo: 8, readyRackSize: 4, rackReloadSec: 22.0, maxActiveMissiles: 1,
    minAltFt: 1000, cuedMinAltFt: 1000, requiresEwCue: false, canAttack: true, isEmitter: false, concealedUntilActive: true, vpValue: 190,
    missileSpec: { id: 'RAPIER_MK2', name: 'Rapier Optical-Command SAM', rangeKm: 14.0, speedMach: 2.4, seeker: 'EO', category: 'SAM', trait: 'HOBS_VANE', rcs: 0.03, lambda: 0.30, p: 1.0, damage: 1.5, T_0: 0.64 },
    desc: 'Passive optical-tracked SHORAD (14 km, 8 missiles / 4 ready-rack). Emits zero radar signal, giving no RWR warning and remaining immune to ARMs.'
  },
  'SAM_AVENGER': {
    id: 'SAM_AVENGER', name: 'Strela-10M / Avenger IR', role: 'Passive Infrared Low-Altitude SHORAD',
    category: 'SR_SAM', armorClass: 'SOFT', hp: 3, rangeKm: 10.5, cooldownMax: 8.0,
    maxAmmo: 8, readyRackSize: 4, rackReloadSec: 20.0, maxActiveMissiles: 1,
    minAltFt: 1000, cuedMinAltFt: 1000, requiresEwCue: false, canAttack: true, isEmitter: false, concealedUntilActive: true, vpValue: 160,
    missileSpec: { id: 'STRELA_IR_SAM', name: 'IR Heat-Seeking SHORAD', rangeKm: 10.5, speedMach: 2.2, seeker: 'IIR', category: 'SAM', trait: 'SNAP_TURN', rcs: 0.02, lambda: 0.34, p: 1.0, damage: 1.5, T_0: 0.62 },
    desc: 'Passive infrared SHORAD protecting depots (10.5 km, 8 missiles / 4 ready-rack). Zero RWR alert; idle throttle, cloud cover, and DIRCM turrets degrade tracking.'
  },
  'PANTSIR': {
    id: 'PANTSIR', name: 'Pantsir-S1 Hybrid CIWS', role: 'Point-Defense Missile & Twin 30mm System',
    category: 'CIWS', armorClass: 'ARMORED', hp: 6, rangeKm: 16.0, cooldownMax: 2.8, aaaCooldownMax: 3.2,
    minAltFt: 1000, cuedMinAltFt: 1000, canAttack: true, canInterceptMissiles: true, interceptAccuracy: 0.55,
    aaaRangeKm: 6.5, aaaMaxAltFt: 11000, aaaDamage: 0.8, isEmitter: true, concealedUntilActive: true, vpValue: 220,
    desc: 'Point-defense CIWS (7.5 km munition intercept dome). Intercepts incoming bombs and cruise missiles while firing 30mm guns at low-flying attackers.'
  },
  'CIWS_SEARAM': {
    id: 'CIWS_SEARAM', name: 'SeaRAM / Land Phalanx CIWS', role: 'Autonomous Munition Interceptor',
    category: 'CIWS', armorClass: 'ARMORED', hp: 5, rangeKm: 14.0, cooldownMax: 2.4,
    minAltFt: 1000, cuedMinAltFt: 1000, canAttack: false, canInterceptMissiles: true, interceptAccuracy: 0.62,
    isEmitter: true, concealedUntilActive: true, vpValue: 220,
    desc: 'Rapid-cycling SeaRAM point-defense turret (7.5 km intercept perimeter). Dedicated counter-PGM defense targeting slow SDBs, glide bombs, and subsonic cruise missiles.'
  },
  'AAA_TUNGUSKA': {
    id: 'AAA_TUNGUSKA', name: '2K22M Tunguska Hybrid AAA', role: 'Twin 30mm SPAAG & 9M311 SHORAD',
    category: 'AAA', armorClass: 'ARMORED', hp: 5, rangeKm: 10.5, cooldownMax: 8.5, aaaCooldownMax: 3.4,
    maxAmmo: 8, readyRackSize: 4, rackReloadSec: 22.0, maxActiveMissiles: 1,
    minAltFt: 1000, cuedMinAltFt: 1000, requiresEwCue: false, aaaRangeKm: 6.0, aaaMaxAltFt: 13500, aaaDamage: 0.9,
    isAaaGun: true, canAttack: true, canInterceptMissiles: true, interceptAccuracy: 0.38, isEmitter: true, concealedUntilActive: true, vpValue: 185,
    missileSpec: { id: '9M311_SAM', name: '9M311 Optical Command SAM', rangeKm: 10.5, speedMach: 2.6, seeker: 'EO', category: 'SAM', trait: 'HOBS_VANE', rcs: 0.03, lambda: 0.32, p: 1.0, damage: 1.5, T_0: 0.62 },
    desc: 'Armored hybrid anti-aircraft system pairing twin 30mm flak cannons (6.0 km) with 8 optical 9M311 missiles (10.5 km) and 38% glide-bomb interception.'
  },
  'AAA_SHILKA': {
    id: 'AAA_SHILKA', name: 'ZSU-23-4M4 Shilka AAA', role: 'Low-Altitude Quad 23mm Autocannon',
    category: 'AAA', armorClass: 'SOFT', hp: 4, rangeKm: 7.0, cooldownMax: 3.4, aaaCooldownMax: 3.4,
    minAltFt: 1000, aaaMaxAltFt: 12500, aaaDamage: 0.7, isAaaGun: true, canAttack: true, isEmitter: false, concealedUntilActive: true, vpValue: 120,
    desc: 'Quad 23mm low-altitude radar-optical AAA (7.0 km slant range, up to 12,500 ft). Engages low-altitude bombing and strafing passes.'
  },
  'AAA_GEPARD': {
    id: 'AAA_GEPARD', name: 'Gepard Twin 35mm SPAAG', role: 'Armored 35mm Dual-Role AAA',
    category: 'AAA', armorClass: 'ARMORED', hp: 5, rangeKm: 8.5, cooldownMax: 3.2, aaaCooldownMax: 3.2,
    minAltFt: 1000, aaaMaxAltFt: 15000, aaaDamage: 0.95, isAaaGun: true, canAttack: true, canInterceptMissiles: true, interceptAccuracy: 0.32, isEmitter: true, concealedUntilActive: true, vpValue: 150,
    desc: 'Twin 35mm armored flak vehicle (8.5 km slant range, up to 15,000 ft). Engages low-altitude attackers and intercepts slow glide munitions.'
  },
  'AAA_FLAK57': {
    id: 'AAA_FLAK57', name: 'S-60 / 57mm Proximity Flak', role: 'Medium-Ceiling Proximity Airburst AAA',
    category: 'AAA', armorClass: 'SOFT', hp: 4, rangeKm: 11.0, cooldownMax: 3.8, aaaCooldownMax: 3.8,
    minAltFt: 1000, aaaMaxAltFt: 20000, aaaDamage: 1.1, isAaaGun: true, canAttack: true, isEmitter: true, concealedUntilActive: true, vpValue: 140,
    desc: 'Heavy 57mm proximity-fuzed flak battery (11 km range, up to 20,000 ft). Threatens slow bombers and medium-altitude LGB delivery passes.'
  }
};
