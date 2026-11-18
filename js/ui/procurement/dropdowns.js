/**
 * AIRSPACE STANDOFF: Hangar Header Dropdown Initialization & Sync
 * Populates mode, budget, difficulty, and separated Air vs. Attack doctrine menus.
 */

class ProcurementHeaderDropdowns {
  static getAirDifficultyOptions() {
    if (!window.AI_DIFFICULTIES) throw new Error('AI_DIFFICULTIES is not loaded.');
    return Object.entries(window.AI_DIFFICULTIES).map(([key, d]) => ({
      value: key,
      text: `${d.name.toUpperCase()} (${d.scoreMultiplier.toFixed(2)}x)`
    }));
  }

  static getAttackDifficultyOptions() {
    if (!window.ATTACK_DIFFICULTIES) throw new Error('ATTACK_DIFFICULTIES is not loaded.');
    return Object.entries(window.ATTACK_DIFFICULTIES).map(([key, d]) => ({
      value: key,
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

  static init(pm) {
    if (typeof CustomDropdown === 'undefined') return;
    const game = pm.game;

    CustomDropdown.setup('cdd-gamemode', {
      label: 'MODE',
      value: game.gameMode,
      options: [
        { value: 'SP_SKIRMISH', text: 'SINGLE PLAYER SKIRMISH' },
        { value: 'TP_SKIRMISH', text: 'TWO PLAYER SKIRMISH' },
        { value: 'SP_DYNAMIC', text: 'SINGLE PLAYER DYNAMIC' },
        { value: 'SP_ATTACK', text: 'SINGLE PLAYER ATTACK' }
      ],
      onChange: (val) => game.setGameMode(val)
    });

    CustomDropdown.setup('cdd-budget', {
      label: 'BUDGET',
      value: game.playerBudgetId,
      options: [
        { value: 'BUDGET_200', text: '200M (1.75x)' },
        { value: 'BUDGET_300', text: '300M (1.30x)' },
        { value: 'BUDGET_400', text: '400M (1.00x)' },
        { value: 'BUDGET_500', text: '500M (0.80x)' },
        { value: 'BUDGET_650', text: '650M (0.60x)' },
        { value: 'BUDGET_750', text: '750M (0.55x)' },
        { value: 'BUDGET_800', text: '800M (0.50x)' },
        { value: 'BUDGET_900', text: '900M (0.45x)' },
        { value: 'BUDGET_1000', text: '1000M (0.40x)' }
      ],
      onChange: (val) => game.setPlayerBudgetTier(val)
    });

    const isAttack = (game.scenarioMode === 'ATTACK');
    CustomDropdown.setup('cdd-difficulty', {
      label: 'DIFFICULTY',
      value: isAttack ? game.attackDifficulty : game.aiDifficulty,
      options: isAttack ? this.getAttackDifficultyOptions() : this.getAirDifficultyOptions(),
      onChange: (val) => {
        if (game.scenarioMode === 'ATTACK') game.attackDifficulty = val;
        else game.aiDifficulty = val;
        game.updateModeIndicator();
        game.saveGameplaySettings();
      }
    });

    CustomDropdown.setup('cdd-doctrine', {
      label: 'DOCTRINE',
      value: isAttack ? game.attackDoctrine : game.aiDoctrine,
      options: isAttack ? this.getAttackDoctrineOptions() : this.getAirDoctrineOptions(),
      onChange: (val) => {
        if (game.scenarioMode === 'ATTACK') game.attackDoctrine = val;
        else game.aiDoctrine = val;
        game.updateModeIndicator();
        game.saveGameplaySettings();
      }
    });
  }

  static syncModeDropdowns(pm) {
    if (typeof CustomDropdown === 'undefined') return;
    const game = pm.game;

    const modeCdd = CustomDropdown.get('cdd-gamemode');
    if (modeCdd && modeCdd.getValue() !== game.gameMode) {
      modeCdd.setValue(game.gameMode, false);
    }

    const isAttack = (game.scenarioMode === 'ATTACK');
    const diffCdd = CustomDropdown.get('cdd-difficulty');
    if (diffCdd) {
      diffCdd.setOptions(
        isAttack ? this.getAttackDifficultyOptions() : this.getAirDifficultyOptions(),
        isAttack ? game.attackDifficulty : game.aiDifficulty
      );
    }

    const docCdd = CustomDropdown.get('cdd-doctrine');
    if (docCdd) {
      docCdd.setOptions(
        isAttack ? this.getAttackDoctrineOptions() : this.getAirDoctrineOptions(),
        isAttack ? game.attackDoctrine : game.aiDoctrine
      );
    }
  }
}

window.ProcurementHeaderDropdowns = ProcurementHeaderDropdowns;
