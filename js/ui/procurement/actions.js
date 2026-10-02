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

    let lastShelfY = 0;
    let lastRosterY = 0;
    let ticking = false;

    const handleScroll = (el, getLastY, setLastY) => {
      if (!el || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const currentY = el.scrollTop;
        const delta = currentY - getLastY();
        setLastY(currentY);

        if (document.querySelector('.custom-dropdown.open')) return;

        if (delta > 18 && currentY > 36) {
          if (!win.classList.contains('header-hidden')) {
            win.classList.add('header-hidden');
          }
        } else if (delta < -12 || currentY <= 15) {
          if (win.classList.contains('header-hidden')) {
            win.classList.remove('header-hidden');
          }
        }
      });
    };

    const attachScrollListeners = () => {
      const shelf = document.getElementById('armory-catalog') || document.getElementById('proc-hanger-shelf');
      const roster = document.getElementById('squadron-list') || document.getElementById('proc-flight-roster');

      if (shelf && !shelf._scrollBound) {
        shelf._scrollBound = true;
        shelf.addEventListener('scroll', () => handleScroll(shelf, () => lastShelfY, y => { lastShelfY = y; }), { passive: true });
      }
      if (roster && !roster._scrollBound) {
        roster._scrollBound = true;
        roster.addEventListener('scroll', () => handleScroll(roster, () => lastRosterY, y => { lastRosterY = y; }), { passive: true });
      }
    };

    attachScrollListeners();
    setTimeout(attachScrollListeners, 200);

    const mobileTabs = document.getElementById('procurement-mobile-tabs');
    if (mobileTabs) {
      mobileTabs.addEventListener('click', () => {
        win.classList.remove('header-hidden');
      });
    }
  }
}

window.ProcurementActionDispatcher = ProcurementActionDispatcher;