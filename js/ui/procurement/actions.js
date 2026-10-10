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
    const win = document.querySelector('.procurement-window');
    if (win) win.classList.remove('header-hidden');
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
      const win = document.querySelector('.procurement-window');
      if (win) win.classList.remove('header-hidden');
      procurementManager.updateUI();
      procurementManager.renderCatalog();
    }
  }

  static clearSquadron(procurementManager) {
    procurementManager.game.procurementSquadron = [];
    procurementManager.activeBayIndex = 0;
    const win = document.querySelector('.procurement-window');
    if (win) win.classList.remove('header-hidden');
    procurementManager.updateUI();
    procurementManager.renderCatalog();
  }

  static initCollapsibleHeader(pm) {
    const win = document.querySelector('.procurement-window');
    if (!win) return;
    win.classList.remove('header-hidden');

    let ticking = false;

    const checkScrollState = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (document.querySelector('.custom-dropdown.open')) return;

        const shelf = document.getElementById('armory-catalog') || document.getElementById('proc-hanger-shelf');
        const roster = document.getElementById('squadron-list') || document.getElementById('proc-flight-roster');

        const shelfY = shelf ? shelf.scrollTop : 0;
        const rosterY = roster ? roster.scrollTop : 0;

        const bothAtTop = (shelfY <= 5) && (rosterY <= 5);

        if (bothAtTop) {
          if (win.classList.contains('header-hidden')) {
            win.classList.remove('header-hidden');
          }
        } else if (shelfY > 36 || rosterY > 36) {
          if (!win.classList.contains('header-hidden')) {
            win.classList.add('header-hidden');
          }
        }
      });
    };

    const attachScrollListeners = () => {
      const targets = [
        document.getElementById('armory-catalog'),
        document.getElementById('proc-hanger-shelf'),
        document.getElementById('squadron-list'),
        document.getElementById('proc-flight-roster')
      ];

      targets.forEach(el => {
        if (el && !el._scrollBound) {
          el._scrollBound = true;
          el.addEventListener('scroll', checkScrollState, { passive: true });
        }
      });
    };

    attachScrollListeners();
    setTimeout(attachScrollListeners, 250);

    const mobileTabs = document.getElementById('procurement-mobile-tabs');
    if (mobileTabs) {
      mobileTabs.addEventListener('click', () => {
        const shelf = document.getElementById('armory-catalog') || document.getElementById('proc-hanger-shelf');
        const roster = document.getElementById('squadron-list') || document.getElementById('proc-flight-roster');
        const shelfY = shelf ? shelf.scrollTop : 0;
        const rosterY = roster ? roster.scrollTop : 0;
        if (shelfY <= 5 && rosterY <= 5) {
          win.classList.remove('header-hidden');
        }
      });
    }
  }
}

window.ProcurementActionDispatcher = ProcurementActionDispatcher;