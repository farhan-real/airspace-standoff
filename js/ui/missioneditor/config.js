/**
 * AIRSPACE STANDOFF: Mission Editor Field Definitions & Scenario Synchronization
 * Dynamically switches Difficulty and Doctrine dropdowns between Air Combat and Attack Mode.
 */

class MissionEditorConfig {
  static DIFFICULTY_DEFAULT_BUDGETS = {
    CADET: 150, BUFFER: 205, VETERAN: 265, ESCALATED: 315, ELITE: 360,
    FORWARD: 400, ACE: 445, FORTIFIED: 490, MASTER: 540, LEGEND: 600
  };

  static STANDARD_BUDGET_TIERS = [150, 200, 205, 250, 265, 300, 315, 360, 400, 445, 490, 500, 540, 600, 650, 750, 800, 900, 1000];

  static FLEET_DIFFICULTY_NAMES = {
    CADET: 'PERMISSIVE SECTOR FLEET', BUFFER: 'BUFFER ZONE FLEET', VETERAN: 'CONTESTED AIRSPACE FLEET',
    ESCALATED: 'ESCALATED AIRSPACE FLEET', ELITE: 'HOSTILE AIRSPACE FLEET', FORWARD: 'FORWARD COMBAT ZONE FLEET',
    ACE: 'HIGH-THREAT SECTOR FLEET', FORTIFIED: 'FORTIFIED AIRSPACE FLEET', MASTER: 'AIR DENIAL ZONE FLEET',
    LEGEND: 'EXTREME THREAT SECTOR FLEET'
  };

  static AIR_TO_ATTACK_DOCTRINE_MAP = {
    BALANCED: 'BALANCED',
    AGGRESSIVE: 'INTERCEPTOR_SCREEN',
    STANDOFF: 'LAYERED_SAM_WALL',
    STEALTH_AMBUSH: 'AMBUSH_IADS',
    DRONE_SWARM: 'ATTRITION_AAA',
    RADAR_JAMMING: 'ELECTRONIC_SHIELD',
    DEFENSIVE_HOLD: 'POINT_DEFENSE'
  };

  static getAirDifficultyOptions() {
    if (!window.AI_DIFFICULTIES) throw new Error('AI_DIFFICULTIES is not loaded.');
    return Object.entries(window.AI_DIFFICULTIES).map(([k, d]) => ({
      value: k,
      text: `${d.name.toUpperCase()} (${d.scoreMultiplier.toFixed(2)}x)`
    }));
  }

  static getAttackDifficultyOptions() {
    if (!window.ATTACK_DIFFICULTIES) throw new Error('ATTACK_DIFFICULTIES is not loaded.');
    return Object.entries(window.ATTACK_DIFFICULTIES).map(([k, d]) => ({
      value: k,
      text: `${d.name.toUpperCase()} (${d.scoreMultiplier.toFixed(2)}x)`
    }));
  }

  static getAirDoctrineOptions() {
    if (!window.AIR_DOCTRINES) throw new Error('AIR_DOCTRINES is not loaded.');
    return Object.values(window.AIR_DOCTRINES).map(d => ({
      value: d.id,
      text: d.name.toUpperCase()
    }));
  }

  static getAttackDoctrineOptions() {
    if (!window.ATTACK_DOCTRINES) throw new Error('ATTACK_DOCTRINES is not loaded.');
    return Object.values(window.ATTACK_DOCTRINES).map(d => ({
      value: d.id,
      text: d.name.toUpperCase()
    }));
  }

  static getFieldConfigs(scenarioMode = 'SKIRMISH') {
    const isAttack = (scenarioMode === 'ATTACK');
    return {
      scenario: {
        default: 'SKIRMISH',
        options: [
          { value: 'SKIRMISH', text: 'SKIRMISH (STANDARD BATTLE)' },
          { value: 'DYNAMIC_THEATER', text: 'DYNAMIC THEATER (WAVE WINGS)' },
          { value: 'ATTACK', text: 'GROUND ATTACK (240x160 IADS)' }
        ]
      },
      difficulty: {
        default: isAttack ? 'FORWARD_GARRISON' : 'VETERAN',
        options: isAttack ? this.getAttackDifficultyOptions() : this.getAirDifficultyOptions()
      },
      doctrine: {
        default: 'BALANCED',
        options: isAttack ? this.getAttackDoctrineOptions() : this.getAirDoctrineOptions()
      },
      'blue-fleet': {
        default: 'HANGAR',
        options: [{ value: 'HANGAR', text: 'HANGAR FLEET' }, ...Object.entries(this.FLEET_DIFFICULTY_NAMES).map(([k, v]) => ({ value: k, text: v }))]
      },
      'blue-budget': {
        default: '400',
        options: this.STANDARD_BUDGET_TIERS.map(b => ({ value: String(b), text: `${b}M` }))
      },
      'red-fleet': {
        default: 'VETERAN',
        options: [...Object.entries(this.FLEET_DIFFICULTY_NAMES).map(([k, v]) => ({ value: k, text: v })), { value: 'HANGAR', text: 'HANGAR FLEET (MIRROR)' }]
      },
      'red-budget': {
        default: '265',
        options: this.STANDARD_BUDGET_TIERS.map(b => ({ value: String(b), text: `${b}M` }))
      },
      clouds: {
        default: 'SCATTERED',
        options: [
          { value: 'CLEAR', text: 'CLEAR SKIES (0% RADAR ATTENUATION)' },
          { value: 'LIGHT', text: 'LIGHT COVER (2 CLOUD CELLS)' },
          { value: 'SCATTERED', text: 'SCATTERED (4 CLOUD CELLS)' },
          { value: 'DENSE', text: 'DENSE OVERCAST (5 CLOUD CELLS)' }
        ]
      },
      defenses: {
        default: 'FULL',
        options: [
          { value: 'FULL', text: 'FULL IADS (SAMS + CIWS + EW)' },
          { value: 'LIGHT', text: 'LIGHT DEFENSE (CIWS ONLY)' },
          { value: 'OFF', text: 'NO GROUND DEFENSES' }
        ]
      },
      civilians: {
        default: 'ON',
        options: [
          { value: 'ON', text: 'ACTIVE (STRICT ROE)' },
          { value: 'OFF', text: 'DISABLED (NO CIVILIAN FLIGHTS)' }
        ]
      }
    };
  }

  static syncScenarioDropdowns(scenarioMode, game) {
    if (typeof CustomDropdown === 'undefined') return;
    const isAttack = (scenarioMode === 'ATTACK');
    const diffCdd = CustomDropdown.get('cdd-me-difficulty');
    const docCdd = CustomDropdown.get('cdd-me-doctrine');

    if (diffCdd) {
      const targetDiff = isAttack
        ? (window.ATTACK_DIFFICULTIES[diffCdd.getValue()] ? diffCdd.getValue() : (game ? game.attackDifficulty : 'FORWARD_GARRISON'))
        : (window.AI_DIFFICULTIES[diffCdd.getValue()] ? diffCdd.getValue() : (game ? game.aiDifficulty : 'VETERAN'));
      diffCdd.setOptions(isAttack ? this.getAttackDifficultyOptions() : this.getAirDifficultyOptions(), targetDiff);
    }

    if (docCdd) {
      const targetDoc = isAttack
        ? (window.ATTACK_DOCTRINES[docCdd.getValue()] ? docCdd.getValue() : (game ? game.attackDoctrine : 'BALANCED'))
        : (window.AIR_DOCTRINES[docCdd.getValue()] ? docCdd.getValue() : (game ? game.aiDoctrine : 'BALANCED'));
      docCdd.setOptions(isAttack ? this.getAttackDoctrineOptions() : this.getAirDoctrineOptions(), targetDoc);
    }
  }

  static formatDoctrineLabel(scenarioMode, docKey) {
    if (!docKey || docKey === 'RANDOM') return docKey;
    if (scenarioMode === 'ATTACK' && window.ATTACK_DOCTRINES && window.ATTACK_DOCTRINES[docKey]) {
      return window.ATTACK_DOCTRINES[docKey].name.toUpperCase();
    }
    if (window.AIR_DOCTRINES && window.AIR_DOCTRINES[docKey]) {
      return window.AIR_DOCTRINES[docKey].name.toUpperCase();
    }
    return docKey;
  }
}

window.MissionEditorConfig = MissionEditorConfig;
