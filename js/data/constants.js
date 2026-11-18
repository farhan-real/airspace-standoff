/**
 * AIRSPACE STANDOFF: Theater Constants, Game Modes, Budget Tiers & Keybinds
 */

window.CONFIG = {
  THEATER_WIDTH_KM: 150.0,
  THEATER_HEIGHT_KM: 100.0,
  SKIRMISH_WIDTH_KM: 150.0,
  SKIRMISH_HEIGHT_KM: 100.0,
  ATTACK_WIDTH_KM: 240.0,
  ATTACK_HEIGHT_KM: 160.0,
  BUDGET_MAX_MILLIONS: 400.0,
  MAX_SQUADRON_SIZE: 16,
  TOKEN_MAX: 8.0,
  TOKEN_BASE_REGEN: 2.50,
  TOKEN_PER_AIRCRAFT_REGEN: 0.25,
  TOKEN_ACTION_COST: 0.70,
  VP_AIRCRAFT_KILL_BASE: 150,
  VP_AIRCRAFT_COST_MULT: 10,
  VP_DRONE_KILL_BASE: 80,
  VP_DRONE_COST_MULT: 12,
  VP_BUNKER_DESTROYED: 800,
  VP_SAM_DESTROYED: 300,
  VP_RADAR_DESTROYED: 250,
  VP_FUEL_DEPOT_DESTROYED: 200,
  VP_RADAR_VAN_DESTROYED: 150,
  VP_AAA_DESTROYED: 120,
  VP_SHORAD_DESTROYED: 180,
  VP_MR_SAM_DESTROYED: 260,
  VP_LR_SAM_DESTROYED: 380,
  VP_CIWS_DESTROYED: 220,
  VP_COMMS_TOWER_DESTROYED: 240,
  VP_POWER_DESTROYED: 200,
  VP_ELINT_DESTROYED: 260,
  VP_RUNWAY_DESTROYED: 650,
  VP_HAS_DESTROYED: 420,
  VP_HANGAR_DESTROYED: 280,
  VP_MUNITION_DUMP_DESTROYED: 300,
  VP_BRIDGE_DESTROYED: 450,
  VP_FACTORY_DESTROYED: 550,
  VP_DECOY_WASTE: 25,
  VP_MISSILE_INTERCEPT: 40,
  VP_CIVILIAN_FIRE_PENALTY: 500,
  VP_CIVILIAN_HIT_PENALTY: 500,
  VP_CIVILIAN_DESTROYED_PENALTY: 2000,
  VP_UNIDENTIFIED_FIRE_PENALTY: 600,
  VP_ACE_FIGHTER_BOUNTY: 850,
  AUTO_GUN_COOLDOWN: 0.50,
  MIN_ALT_FT: 1000,
  MAX_ALT_FT: 65000,
  DIVE_ALT_DROP_FT: 7500,
  DIVE_SPEED_GAIN_MACH: 0.32,
  ZOOM_ALT_GAIN_FT: 8500,
  ZOOM_SPEED_COST_MACH: 0.28,
  MIXED_SEEKER_SYNERGY_BONUS: 0.25,
  RADAR_IDENTIFY_BASE_SEC: 5.5,
  MISSILE_IDENTIFY_BASE_SEC: 3.2,
  STEALTH_IDENTIFY_PENALTY_MULT: 2.0,
  UPLINK_THRESHOLD_FIGHTERS: 3,
  RTB_CORRIDOR_X_KM: 32.0,
  RTB_REARM_DURATION_SEC: 3.5,
  CLOUD_RADAR_ATTENUATION: 0.04
};

window.GAME_MODES = {
  SP_SKIRMISH: {
    id: 'SP_SKIRMISH',
    name: 'Single Player Skirmish',
    shortName: '1P SKIRMISH',
    playerMode: '1P',
    scenarioMode: 'SKIRMISH',
    theaterWidthKm: 150.0,
    theaterHeightKm: 100.0
  },
  TP_SKIRMISH: {
    id: 'TP_SKIRMISH',
    name: 'Two Player Skirmish',
    shortName: '2P SKIRMISH',
    playerMode: '2P',
    scenarioMode: 'SKIRMISH',
    theaterWidthKm: 150.0,
    theaterHeightKm: 100.0
  },
  SP_DYNAMIC: {
    id: 'SP_DYNAMIC',
    name: 'Single Player Dynamic',
    shortName: '1P DYNAMIC',
    playerMode: '1P',
    scenarioMode: 'DYNAMIC_THEATER',
    theaterWidthKm: 150.0,
    theaterHeightKm: 100.0
  },
  SP_ATTACK: {
    id: 'SP_ATTACK',
    name: 'Single Player Attack',
    shortName: '1P ATTACK',
    playerMode: '1P',
    scenarioMode: 'ATTACK',
    theaterWidthKm: 240.0,
    theaterHeightKm: 160.0
  }
};

window.BUDGET_TIERS = {
  BUDGET_200: { id: 'BUDGET_200', name: 'Austerity (200M CR)', budget: 200.0, multiplier: 1.75, desc: 'Restricted defense allocation requiring lightweight packages.' },
  BUDGET_300: { id: 'BUDGET_300', name: 'Restricted (300M CR)', budget: 300.0, multiplier: 1.30, desc: 'Constrained operational defense allocation.' },
  BUDGET_400: { id: 'BUDGET_400', name: 'Standard (400M CR)', budget: 400.0, multiplier: 1.00, desc: 'Standard theater squadron allocation.' },
  BUDGET_500: { id: 'BUDGET_500', name: 'Expanded (500M CR)', budget: 500.0, multiplier: 0.80, desc: 'Expanded coalition defense funding.' },
  BUDGET_650: { id: 'BUDGET_650', name: 'Full Readiness (650M CR)', budget: 650.0, multiplier: 0.60, desc: 'Maximum coalition expenditure allowance.' },
  BUDGET_750: { id: 'BUDGET_750', name: 'Strategic Reserve (750M CR)', budget: 750.0, multiplier: 0.55, desc: 'Advanced theater defense reserve allocation.' },
  BUDGET_800: { id: 'BUDGET_800', name: 'Heavy Coalition (800M CR)', budget: 800.0, multiplier: 0.50, desc: 'Heavy coalition expenditure allowance for reinforced wings.' },
  BUDGET_900: { id: 'BUDGET_900', name: 'Surge Fleet (900M CR)', budget: 900.0, multiplier: 0.45, desc: 'High-intensity coalition defense surge allocation.' },
  BUDGET_1000: { id: 'BUDGET_1000', name: 'Maximum Surge (1000M CR)', budget: 1000.0, multiplier: 0.40, desc: 'Maximum strategic defense surge allocation.' }
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
  'TIME_WARP_1X': 'KeyJ',
  'TIME_WARP_2X': 'KeyK',
  'TIME_WARP_4X': 'KeyL',
  'CAMERA_RESET': 'Digit0',
  'CAMERA_TRACK': 'KeyC',
  'OPEN_SETTINGS': 'KeyO',
  'OPEN_MANUAL': 'KeyM'
};

window.CALLSIGN_POOL = [
  'Trigger', 'Mobius', 'Cipher', 'Viper', 'Ghost', 'Talon', 'Reaper', 'Hawk', 'Falcon', 'Spectre',
  'Bandit', 'Razor', 'Bulldog', 'Outlaw', 'Condor', 'Cobalt', 'Kilo', 'Bravo', 'Alpha', 'Tango',
  'Victor', 'Zulu', 'Havoc', 'Stalker', 'Shadow', 'Hunter', 'Nomad', 'Phantom', 'Onyx', 'Saber',
  'Titan', 'Striker', 'Rogue', 'Fury', 'Warlock', 'Dagger', 'Lancer', 'Raven', 'Cobra', 'Sentry'
];

window.CIVILIAN_FLIGHTS = [
  { code: 'PACIFIC-412', name: 'Boeing 777-300ER Heavy', model: 'Boeing 777 Heavy', speedMach: 0.78, altFt: 36000, rcs: 28.0, desc: 'Commercial long-range widebody passenger flight transiting international airspace corridor.' },
  { code: 'AIRBUS-908', name: 'Airbus A350-900 Transit', model: 'Airbus A350 Transit', speedMach: 0.80, altFt: 38000, rcs: 25.0, desc: 'Twin-engine composite widebody civilian transit flight under civil ATC control.' },
  { code: 'CARGO-701', name: 'MD-11 Freight Transport', model: 'MD-11 Heavy Cargo', speedMach: 0.75, altFt: 32000, rcs: 32.0, desc: 'Tri-jet commercial freight cargo transporter flying designated civil logistics flight plan.' },
  { code: 'SKYWAY-214', name: 'Boeing 787 Dreamliner', model: 'Boeing 787 Transit', speedMach: 0.82, altFt: 40000, rcs: 22.0, desc: 'Commercial airliner operating scheduled international passage. Non-combatant status.' }
];
