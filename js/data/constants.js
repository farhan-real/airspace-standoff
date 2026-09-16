/**
 * APEX VECTOR // Scaled 150km x 100km Theater, Budget Tiers, Keybinds & Flight Lead Buffs
 * Flight Lead buffs tailored to fix weaknesses and boost survivability per aircraft type.
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
  VP_WIN_THRESHOLD: 1600,
  VP_BUNKER_DESTROYED: 600,
  VP_SAM_DESTROYED: 250,
  VP_RADAR_DESTROYED: 200,
  VP_CIVILIAN_DEPOT_DESTROYED: 150,
  VP_FUEL_DEPOT_DESTROYED: 180,
  VP_AMMO_DUMP_DESTROYED: 200,
  VP_RADAR_VAN_DESTROYED: 120,
  VP_AIRBASE_HANGAR_DESTROYED: 250,
  VP_MISSILE_INTERCEPT: 40,
  VP_CIVILIAN_DESTROYED_PENALTY: 800,
  VP_UNIDENTIFIED_FIRE_PENALTY: 250,
  VP_ACE_FIGHTER_BOUNTY: 850,
  AUTO_GUN_MAX_RANGE_KM: 4.8,
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
  CLOUD_COUNT: 3,
  CLOUD_RADAR_ATTENUATION: 0.18,
  CLOUD_IR_TIME_TO_LOSE_SEC: 8.0,
  CORNER_SPEED_OPT_RATIO: 0.65
};

window.BUDGET_TIERS = {
  BUDGET_200: { id: 'BUDGET_200', name: 'Hardcore (200M CR)', budget: 200.0, multiplier: 1.50, desc: 'Severe defense budget austerity' },
  BUDGET_300: { id: 'BUDGET_300', name: 'Restricted (300M CR)', budget: 300.0, multiplier: 1.25, desc: 'Tight operational defense budget' },
  BUDGET_400: { id: 'BUDGET_400', name: 'Standard (400M CR)', budget: 400.0, multiplier: 1.00, desc: 'Standard theater allocation' },
  BUDGET_500: { id: 'BUDGET_500', name: 'Expanded (500M CR)', budget: 500.0, multiplier: 0.85, desc: 'High defense coalition funding' },
  BUDGET_650: { id: 'BUDGET_650', name: 'Unlimited (650M CR)', budget: 650.0, multiplier: 0.70, desc: 'Maximum coalition expenditure' }
};

window.LEAD_BUFFS = {
  STEALTH: {
    title: 'GHOST COMMAND & VLO SENSOR HUB',
    role: 'Stealth Air Dominance Leader',
    weaknessFixed: 'Mitigates vulnerable 3.2x broadside beam exposure spike by 50% with conformal RAM.',
    survivability: '+20% innate missile evasion and +1 Armor HP.',
    buffs: [
      { label: 'MISSILE EVASION', val: '+20% Missile Evasion', desc: 'Low-RCS terminal seeker spoofing' },
      { label: 'BEAM SPIKE REDUCTION', val: '-50% Broadside RCS', desc: 'Mitigates 90° turning detection vulnerability' },
      { label: 'SENSOR REACH', val: '+15.0 km Radar Range', desc: 'Enhanced GaN transmitter power' },
      { label: 'ARMOR & BUS', val: '+1 HP & +0.25 Tok/s', desc: 'Reinforced bulkheads and passive bus regen' }
    ],
    summary: 'Fixes broadside stealth vulnerability while boosting missile evasion and extending deep sensor reach.'
  },
  SUPERIORITY: {
    title: 'ENERGY DOMINANCE & HEAVY INTERCEPTOR',
    role: 'Air Superiority Leader',
    weaknessFixed: 'Fixes giant radar footprint (-40% base RCS) and high-G pilot stress buildup.',
    survivability: '+25% break-turn missile evasion and +2 Armor HP reinforcement.',
    buffs: [
      { label: 'MISSILE EVASION', val: '+25% Break Evasion', desc: 'High-G kinetic escape maneuverability' },
      { label: 'RADAR FOOTPRINT', val: '-40% Base RCS', desc: 'Suppresses massive unstealthed radar return' },
      { label: 'PILOT RESILIENCE', val: '-50% G-LOC Stress', desc: 'Veteran flight discipline delays fatigue' },
      { label: 'ARMOR & WEAPONS', val: '+2 HP & +12% P_k', desc: 'Heavy structural armor and terminal accuracy' }
    ],
    summary: 'Eliminates high radar observability, halves pilot stress, and provides +25% kinetic missile evasion.'
  },
  MULTIROLE: {
    title: 'TACTICAL SURVIVABILITY & AGILITY MASTER',
    role: 'Multirole Flight Leader',
    weaknessFixed: 'Fixes average airframe durability (+2 HP) and accelerates turn speed.',
    survivability: '+25% missile evasion, +3 Chaff charges, and +2 Armor HP.',
    buffs: [
      { label: 'MISSILE EVASION', val: '+25% Turn Evasion', desc: 'Agile defensive break turns' },
      { label: 'TURN AGILITY', val: '+20% Turn Rate', desc: 'Superior instantaneous nose-pointing' },
      { label: 'LOGISTICS SPEED', val: '-40% RTB Duration', desc: 'Priority turnaround rearming and repair' },
      { label: 'ARMOR & DEFENSE', val: '+2 HP & +3 Chaff', desc: 'Cockpit armor and emergency decoy reserve' }
    ],
    summary: 'Fixes moderate baseline durability with +2 HP and unlocks +20% visual turn agility and +25% evasion.'
  },
  STRIKE: {
    title: 'TITANIUM FORTRESS & PAYLOAD JUGGERNAUT',
    role: 'Dedicated Strike Leader',
    weaknessFixed: 'Fixes sluggish loaded airspeed (-40% payload drag) and vulnerability to ground fire.',
    survivability: '+3 Armor HP, -1 damage from incoming missiles, and 60% gun deflection.',
    buffs: [
      { label: 'DAMAGE RESISTANCE', val: '-1 Damage / Missile', desc: 'Reinforced explosive composite armor' },
      { label: 'ARMOR INTEGRITY', val: '+3 Max HP Armor', desc: 'Heavy titanium bathtub cockpit enclosure' },
      { label: 'DEADWEIGHT DRAG', val: '-40% Payload Drag', desc: 'Eliminates speed penalties when fully loaded' },
      { label: 'GUN DEFLECTION', val: '60% Gun Resistance', desc: 'Absorbs close-range autocannon strafes' }
    ],
    summary: 'Transforms strike craft into an armored juggernaut (+3 HP, -1 missile damage) and eliminates payload drag.'
  },
  EW: {
    title: 'ELECTROMAGNETIC SHIELD & JAMMING AURA',
    role: 'Electronic Warfare Escort Leader',
    weaknessFixed: 'Fixes fragile airframe durability (+2 HP) and suppresses active radar tracking.',
    survivability: '+30% missile evasion vs radar-guided weapons and amplified jammer aura.',
    buffs: [
      { label: 'MISSILE EVASION', val: '+30% vs Radar/ARH', desc: 'Electromagnetic false-echo lock breaking' },
      { label: 'JAMMING AURA', val: '+25% Jammer Power', desc: 'Blinds enemy radar arrays and incoming SAMs' },
      { label: 'SENSOR REACH', val: '+25.0 km ESM Range', desc: 'Instantly geolocates surface radar emitters' },
      { label: 'ARMOR & COUNTER', val: '+2 HP & +3 Chaff', desc: 'Hardened airframe and expanded decoy store' }
    ],
    summary: 'Protects fragile EW escort with +2 HP and projects an electronic shield delivering +30% radar missile evasion.'
  },
  DRONES: {
    title: 'HIVEMIND QUEEN & 20G EVASION ROUTER',
    role: 'Autonomous Drone Lead',
    weaknessFixed: 'Fixes paper-thin 1-2 HP drone fragility (+2 HP) and enhances swarm guidance.',
    survivability: '+35% extreme missile dodge (full 20G envelope) and +2 free MALD decoy drones.',
    buffs: [
      { label: 'EXTREME DODGE', val: '+35% Missile Dodge', desc: 'Instantaneous 20G structural break turns' },
      { label: 'AIRFRAME INTEGRITY', val: '+2 Max HP Armor', desc: 'Fixes fragile 1-2 HP drone weakness' },
      { label: 'DECOY SYSTEM', val: '+2 MALD Decoys', desc: 'Deploys autonomous radar-signature decoys' },
      { label: 'SWARM GUIDANCE', val: '+12% Missile P_k', desc: 'High-frequency predictive AI computation' }
    ],
    summary: 'Triples fragile drone survivability (+2 HP, +2 MALD decoys) and unlocks ruthless +35% 20G missile evasion.'
  },
  EXPERIMENTAL: {
    title: 'NEURAL APEX & POST-STALL DEMONSTRATOR',
    role: 'Experimental Technology Leader',
    weaknessFixed: 'Fixes heavy engine heat vulnerability (-40% thermal bloom) and adds +2 HP armor.',
    survivability: '+30% neural reflex missile evasion and rapid direct-energy weapon cooling.',
    buffs: [
      { label: 'EXTREME EVASION', val: '+30% Neural Evasion', desc: 'Electro-neural flight control breaks' },
      { label: 'THERMAL SHIELD', val: '-40% Thermal Bloom', desc: 'Suppresses heat-seeking missile tracking' },
      { label: 'ENERGY WEAPONS', val: '+25% Beam Cooling', desc: 'Rapid capacitor recharge for DE-Pulse/EML' },
      { label: 'ARMOR & BUS', val: '+2 HP & +0.30 Tok/s', desc: 'Titanium framing and neural command bridge' }
    ],
    summary: 'Fixes engine heat bloom (-40%), reinforces armor (+2 HP), and provides +30% neural missile evasion.'
  }
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