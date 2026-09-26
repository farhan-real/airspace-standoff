/**
 * AIRSPACE STANDOFF: Procurement Action Dispatcher Submodule
 */

class ProcurementActionDispatcher {
  static setLeadAirframe(procurementManager, sIdx) {
    procurementManager.game.procurementSquadron.forEach((item, idx) => { item.isLead = (idx === sIdx); });
    procurementManager.activeBayIndex = sIdx;
    procurementManager.updateUI();
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  static saveSquadronBayConfig(procurementManager, sIdx, callback) {
    const item = procurementManager.game.procurementSquadron[sIdx];
    if (!item) return;
    const spec = (window.AIRCRAFT_CATALOG || {})[item.specId] || {};
    const defName = `${item.callsign || spec.name} Config`;

    procurementManager.showPromptModal('SAVE PRESET', `Save Aircraft #${sIdx + 1} configuration as a preset:`, defName, (name) => {
      if (name && name.trim()) {
        procurementManager.customLoadouts.saveTemplate(name.trim(), {
          name: name.trim(), specId: item.specId, roleCategory: 'CUSTOM', chosenGunId: item.chosenGunId || 'M61A2',
          weapons: [...(item.weapons || [])], upgrades: [...(item.upgrades || [])],
          desc: `User configuration based on ${spec.name} (${item.callsign}).`
        });
        procurementManager.showAlertModal('PRESET SAVED', `Configuration "${name.trim()}" saved to preset library.`);
        if (callback) callback();
      }
    });
  }

  static applyBuiltinPreset(procurementManager, type) {
    procurementManager.game.procurementSquadron = ProcurementPresets.getBuiltinPreset(type);
    if (procurementManager.game.procurementSquadron.length > 0 && !procurementManager.game.procurementSquadron.some(it => it && it.isLead)) {
      procurementManager.game.procurementSquadron[0].isLead = true;
    }
    procurementManager.activeBayIndex = 0;
    procurementManager.updateUI();
    procurementManager.renderCatalog();
  }

  static applyCustomPreset(procurementManager, name) {
    const data = procurementManager.customLoadouts.load(name);
    if (data) {
      procurementManager.game.procurementSquadron = data;
      if (procurementManager.game.procurementSquadron.length > 0 && !procurementManager.game.procurementSquadron.some(it => it && it.isLead)) {
        procurementManager.game.procurementSquadron[0].isLead = true;
      }
      procurementManager.activeBayIndex = 0;
      procurementManager.updateUI();
      procurementManager.renderCatalog();
    }
  }

  static clearSquadron(procurementManager) {
    procurementManager.game.procurementSquadron = [];
    procurementManager.activeBayIndex = 0;
    procurementManager.updateUI();
    procurementManager.renderCatalog();
  }
}

window.ProcurementActionDispatcher = ProcurementActionDispatcher;