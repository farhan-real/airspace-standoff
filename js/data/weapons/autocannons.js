/**
 * APEX VECTOR // Built-In & Podded Autocannons (Substantially Increased Ammo Capacity)
 */

window.AUTOCANNONS_CATALOG = {
  'M61A2': {
    id: 'M61A2',
    name: 'M61A2 Vulcan 20mm Gatling',
    caliber: '20mm Rotary',
    rpm: 6000,
    rangeKm: 4.8,
    damagePerSec: 2.4,
    coneAngleDeg: 55,
    mass: 115,
    tracerColor: '#fbbf24',
    badge: 'RAPID ROTARY (6000 RPM)',
    defaultAmmo: 3200,
    desc: 'High-cyclic 6-barrel Gatling cannon. Deep 3,200 round drum capacity and 55 degree engagement arc for close merges.'
  },
  'GSH-30-1': {
    id: 'GSH-30-1',
    name: 'GSh-30-1 30mm Autocannon',
    caliber: '30mm Heavy',
    rpm: 1800,
    rangeKm: 5.0,
    damagePerSec: 3.2,
    coneAngleDeg: 35,
    mass: 46,
    tracerColor: '#f97316',
    badge: 'SNIPER CANNON (30MM HE)',
    defaultAmmo: 1800,
    desc: 'Precision single-barrel cannon firing heavy 30mm high-explosive rounds with 1,800 round magazine.'
  },
  'BK-27': {
    id: 'BK-27',
    name: 'BK-27 27mm Revolver Cannon',
    caliber: '27mm Revolver',
    rpm: 1700,
    rangeKm: 4.8,
    damagePerSec: 2.8,
    coneAngleDeg: 40,
    mass: 100,
    tracerColor: '#facc15',
    badge: 'REVOLVER PRECISION',
    defaultAmmo: 2400,
    desc: 'Gas-operated revolver cannon with 2,400 round capacity balancing high single-shot impact with tight grouping.'
  },
  'GAU-8': {
    id: 'GAU-8',
    name: 'GAU-8/A Avenger 30mm Gatling',
    caliber: '30mm Tank Buster',
    rpm: 3900,
    rangeKm: 5.4,
    damagePerSec: 4.8,
    coneAngleDeg: 38,
    mass: 281,
    tracerColor: '#ef4444',
    badge: 'DEPLETED URANIUM PENETRATOR',
    lockedTo: ['A-10C', 'Su-34', 'Su-25SM3'],
    defaultAmmo: 4800,
    desc: '7-barrel hydraulic Gatling firing depleted-uranium armor penetrators. 4,800 rounds shred ground bunkers and heavy armor.'
  },
  'GAU-22': {
    id: 'GAU-22',
    name: 'GAU-22/A 25mm Equalizer',
    caliber: '25mm 4-Barrel',
    rpm: 3300,
    rangeKm: 4.6,
    damagePerSec: 2.7,
    coneAngleDeg: 45,
    mass: 105,
    tracerColor: '#38bdf8',
    badge: 'STEALTH GATLING',
    defaultAmmo: 2600,
    desc: '4-barrel lightweight Gatling engineered for stealth bays with 2,600 round magazine.'
  },
  'GSH-23L': {
    id: 'GSH-23L',
    name: 'GSh-23L Twin 23mm Autocannon',
    caliber: '23mm Twin',
    rpm: 3400,
    rangeKm: 4.2,
    damagePerSec: 2.2,
    coneAngleDeg: 50,
    mass: 50,
    tracerColor: '#fb923c',
    badge: 'GAST PRINCIPLE TWIN',
    defaultAmmo: 2800,
    desc: 'Gast-principle twin-barrel cannon firing alternating bursts with 2,800 rounds.'
  },
  'DE-PULSE': {
    id: 'DE-PULSE',
    name: 'Tactical DE-Pulse Laser Gun',
    caliber: 'Laser 80kW Pulse',
    rpm: 9999,
    rangeKm: 6.8,
    damagePerSec: 4.0,
    coneAngleDeg: 40,
    mass: 220,
    tracerColor: '#00f0ff',
    badge: 'DIRECTED ENERGY (HITSCAN)',
    lockedTo: ['F-22A', 'Su-57', 'X-02S', 'B-21', 'J-20', 'F-15EX', 'FC-31', 'YF-23', 'ADF-11F', 'DARKSTAR', 'F-22C-COFFIN', 'Su-37-COFFIN', 'F-15-SMT-COFFIN', 'CFA-44'],
    defaultAmmo: 300, // 300 pulses
    desc: 'High-energy pulsed chemical laser with 300 pulses providing instantaneous speed-of-light thermal damage.'
  },
  'EML_GUN': {
    id: 'EML_GUN',
    name: 'EML Hyper-Velocity Railgun',
    caliber: 'Hyper-Velocity Slug',
    rpm: 120,
    rangeKm: 8.8,
    damagePerSec: 4.6,
    coneAngleDeg: 25,
    mass: 320,
    tracerColor: '#38bdf8',
    badge: 'RAILGUN PENETRATOR',
    lockedTo: ['CFA-44', 'X-02S', 'ADF-11F'],
    defaultAmmo: 120, // 120 slugs
    desc: 'Electromagnetic accelerator firing 120 hyper-velocity kinetic slugs with direct penetrative impact at extreme merge range.'
  },
  'MICRO_GUN': {
    id: 'MICRO_GUN',
    name: 'Drone Micro-Gun 12.7mm',
    caliber: '12.7mm Micro',
    rpm: 2600,
    rangeKm: 3.8,
    damagePerSec: 1.6,
    coneAngleDeg: 60,
    mass: 35,
    tracerColor: '#a855f7',
    badge: 'DRONE SPEC (ZERO DRAG)',
    defaultAmmo: 3600,
    desc: 'Ultra-lightweight micro-gun pod engineered for unmanned combat drones with 3,600 round reserve.'
  }
};  