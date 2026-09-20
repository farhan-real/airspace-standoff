/**
 * AIRSPACE STANDOFF // 150km x 100km Theater Constants, Budget Tiers & Flight Lead Modifications
 * Realistic aerospace specifications, radar signatures, and rebalanced combat scoring.
 */

window.CONFIG = {
  THEATER_WIDTH_KM: 150.0,
  THEATER_HEIGHT_KM: 100.0,
  TICK_RATE_HZ: 10,
  DELTA_TIME: 0.10,
  BUDGET_MAX_MILLIONS: 400.0,
  MAX_SQUADRON_SIZE: 16,
  TOKEN_MAX: 8.0,
  TOKEN_BASE_REGEN: 2.50,
  TOKEN_PER_AIRCRAFT_REGEN: 0.25,
  TOKEN_ACTION_COST: 0.70,
  VP_WIN_THRESHOLD: 3000,
  VP_AIRCRAFT_KILL_BASE: 150,
  VP_AIRCRAFT_COST_MULT: 10,
  VP_DRONE_KILL_BASE: 80,
  VP_DRONE_COST_MULT: 12,
  VP_BUNKER_DESTROYED: 800,
  VP_SAM_DESTROYED: 300,
  VP_RADAR_DESTROYED: 250,
  VP_CIVILIAN_DEPOT_DESTROYED: 180,
  VP_FUEL_DEPOT_DESTROYED: 200,
  VP_AMMO_DUMP_DESTROYED: 250,
  VP_RADAR_VAN_DESTROYED: 150,
  VP_AIRBASE_HANGAR_DESTROYED: 300,
  VP_MISSILE_INTERCEPT: 40,
  VP_CIVILIAN_DESTROYED_PENALTY: 800,
  VP_UNIDENTIFIED_FIRE_PENALTY: 250,
  VP_ACE_FIGHTER_BOUNTY: 850,
  AUTO_GUN_MAX_RANGE_KM: 9.5,
  AUTO_GUN_COOLDOWN: 0.35,
  MIN_ALT_FT: 5000,
  MAX_ALT_FT: 65000,
  DIVE_ALT_DROP_FT: 7500,
  DIVE_SPEED_GAIN_MACH: 0.32,
  ZOOM_ALT_GAIN_FT: 8500,
  ZOOM_SPEED_COST_MACH: 0.28,
  SALVO_PK_BONUS_PER_EXTRA_MISSILE: 0.12,
  SALVO_MAX_PK_BONUS: 0.30,
  SALVO_EVASION_DEGRADATION_PER_EXTRA: 0.25,
  MIXED_SEEKER_SYNERGY_BONUS: 0.10,
  RADAR_IDENTIFY_BASE_SEC: 6.0,
  MISSILE_IDENTIFY_BASE_SEC: 3.5,
  STEALTH_IDENTIFY_PENALTY_MULT: 2.0,
  IDENTIFY_BURN_THROUGH_RATIO: 0.30,
  UPLINK_THRESHOLD_FIGHTERS: 3,
  RTB_CORRIDOR_X_KM: 32.0,
  RTB_REARM_DURATION_SEC: 2.0,
  CLOUD_COUNT: 5,
  CLOUD_RADAR_ATTENUATION: 0.18,
  CLOUD_IR_TIME_TO_LOSE_SEC: 8.0,
  CORNER_SPEED_OPT_RATIO: 0.65
};

window.BUDGET_TIERS = {
  BUDGET_200: { id: 'BUDGET_200', name: 'Austerity (200M CR)', budget: 200.0, multiplier: 1.50, desc: 'Restricted defense allocation requiring lightweight packages.' },
  BUDGET_300: { id: 'BUDGET_300', name: 'Restricted (300M CR)', budget: 300.0, multiplier: 1.25, desc: 'Constrained operational defense allocation.' },
  BUDGET_400: { id: 'BUDGET_400', name: 'Standard (400M CR)', budget: 400.0, multiplier: 1.00, desc: 'Standard theater squadron allocation.' },
  BUDGET_500: { id: 'BUDGET_500', name: 'Expanded (500M CR)', budget: 500.0, multiplier: 0.85, desc: 'Expanded coalition defense funding.' },
  BUDGET_650: { id: 'BUDGET_650', name: 'Full Readiness (650M CR)', budget: 650.0, multiplier: 0.70, desc: 'Maximum coalition expenditure allowance.' }
};

window.DEFAULT_KEYBINDS = {
  'STEER_LEFT': 'ArrowLeft',
  'STEER_RIGHT': 'ArrowRight',
  'NEXT_UNIT': 'ArrowDown',
  'PREV_UNIT': 'ArrowUp',
  'CYCLE_TARGET': 'KeyT',
  'AUTO_LOCK': 'Space',
  'FIRE_GUN': 'KeyG',
  'FIRE_PYLON_1': 'Digit1',
  'FIRE_PYLON_2': 'Digit2',
  'FIRE_PYLON_3': 'Digit3',
  'FIRE_PYLON_4': 'Digit4',
  'FIRE_PYLON_5': 'Digit5',
  'FIRE_PYLON_6': 'Digit6',
  'FIRE_PYLON_7': 'Digit7',
  'FIRE_PYLON_8': 'Digit8',
  'FIRE_PYLON_9': 'Digit9',
  'COUNTERMEASURES': 'KeyF',
  'DIVE': 'KeyX',
  'ZOOM': 'KeyZ',
  'RTB': 'KeyR',
  'TOGGLE_DECLUTTER': 'KeyV',
  'TOGGLE_GROUND': 'KeyB',
  'THROTTLE_UP': 'BracketRight',
  'THROTTLE_DOWN': 'BracketLeft',
  'PAUSE_TIME': 'KeyP',
  'CAMERA_RESET': 'Digit0',
  'CAMERA_TRACK': 'KeyC',
  'OPEN_SETTINGS': 'KeyO',
  'OPEN_MANUAL': 'KeyM'
};

window.CALLSIGN_POOL = [
  'Trigger', 'Mobius 1', 'Cipher', 'Viper', 'Ghost', 'Talon', 'Reaper', 'Hawk', 'Falcon', 'Spectre',
  'Bandit', 'Razor', 'Bulldog', 'Outlaw', 'Condor', 'Cobalt', 'Kilo', 'Bravo', 'Alpha', 'Tango',
  'Victor', 'Zulu', 'Havoc', 'Stalker', 'Shadow', 'Hunter', 'Nomad', 'Apex', 'Onyx', 'Saber',
  'Titan', 'Striker', 'Rogue', 'Fury', 'Warlock', 'Dagger', 'Lancer', 'Raven', 'Cobra', 'Sentry'
];

window.CIVILIAN_FLIGHTS = [
  { code: 'PACIFIC-412', name: 'Boeing 777-300ER Heavy', model: 'Boeing 777 Heavy', speedMach: 0.78, altFt: 36000, rcs: 28.0, desc: 'Commercial long-range widebody passenger flight transiting international airspace corridor.' },
  { code: 'AIRBUS-908', name: 'Airbus A350-900 Transit', model: 'Airbus A350 Transit', speedMach: 0.80, altFt: 38000, rcs: 25.0, desc: 'Twin-engine composite widebody civilian transit flight under civil ATC control.' },
  { code: 'CARGO-701', name: 'MD-11 Freight Transport', model: 'MD-11 Heavy Cargo', speedMach: 0.75, altFt: 32000, rcs: 32.0, desc: 'Tri-jet commercial freight cargo transporter flying designated civil logistics flight plan.' },
  { code: 'SKYWAY-214', name: 'Boeing 787 Dreamliner', model: 'Boeing 787 Transit', speedMach: 0.82, altFt: 40000, rcs: 22.0, desc: 'Commercial airliner operating scheduled international passage. Non-combatant status.' }
];

window.AI_DIFFICULTIES = {
  CADET: { name: 'Cadet', budgetCap: 180.0, scoreMultiplier: 0.60, reactionCooldown: 4.8, attentionSpanSec: 4.5, engagementRangeRatio: 0.55, evasionSkill: 0.25, blunderChance: 0.40, usesDopplerNotch: false, aceCount: 0, multiTarget: false, useAdvancedManeuvers: false },
  VETERAN: { name: 'Veteran', budgetCap: 260.0, scoreMultiplier: 1.00, reactionCooldown: 3.0, attentionSpanSec: 3.5, engagementRangeRatio: 0.75, evasionSkill: 0.50, blunderChance: 0.20, usesDopplerNotch: true, aceCount: 1, multiTarget: false, useAdvancedManeuvers: false },
  ELITE: { name: 'Elite', budgetCap: 360.0, scoreMultiplier: 1.40, reactionCooldown: 1.8, attentionSpanSec: 2.5, engagementRangeRatio: 0.88, evasionSkill: 0.72, blunderChance: 0.08, usesDopplerNotch: true, aceCount: 1, multiTarget: true, useAdvancedManeuvers: true },
  ACE: { name: 'Theater Ace', budgetCap: 450.0, scoreMultiplier: 1.80, reactionCooldown: 1.0, attentionSpanSec: 1.8, engagementRangeRatio: 0.95, evasionSkill: 0.88, blunderChance: 0.03, usesDopplerNotch: true, aceCount: 2, multiTarget: true, useAdvancedManeuvers: true },
  MASTER: { name: 'Supreme Master', budgetCap: 550.0, scoreMultiplier: 2.20, reactionCooldown: 0.65, attentionSpanSec: 1.3, engagementRangeRatio: 1.00, evasionSkill: 0.94, blunderChance: 0.01, usesDopplerNotch: true, aceCount: 2, multiTarget: true, useAdvancedManeuvers: true },
  LEGEND: { name: 'Apex Legend', budgetCap: 650.0, scoreMultiplier: 2.80, reactionCooldown: 0.35, attentionSpanSec: 0.9, engagementRangeRatio: 1.00, evasionSkill: 0.99, blunderChance: 0.00, usesDopplerNotch: true, aceCount: 3, multiTarget: true, useAdvancedManeuvers: true }
};