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

  static initCollapsibleHeader(pm) {
    const win = document.querySelector('.procurement-window');
    const catalogEl = document.getElementById('armory-catalog');
    const rosterEl = document.getElementById('squadron-list');
    if (!win) return;

    let lastCatalogScroll = 0;
    let lastRosterScroll = 0;
    let accumulatedDown = 0;

    const setHeaderState = (hide) => {
      const isHidden = win.classList.contains('header-hidden');
      if (hide === isHidden) return;
      if (hide) {
        win.classList.add('header-hidden');
        if (typeof CustomDropdown !== 'undefined') CustomDropdown.closeAll();
      } else {
        win.classList.remove('header-hidden');
      }
    };

    const handleScroll = (el, getLast, setLast) => {
      if (!el) return;
      const currentScroll = el.scrollTop;
      const diff = currentScroll - getLast();
      setLast(currentScroll);

      if (currentScroll <= 10) {
        accumulatedDown = 0;
        setHeaderState(false);
      } else if (diff > 0) {
        accumulatedDown += diff;
        if (accumulatedDown >= 25 && currentScroll > 35) {
          setHeaderState(true);
        }
      }
    };

    const attachRafScroll = (element, getFn, setFn) => {
      let ticking = false;
      element.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll(element, getFn, setFn);
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    };

    if (catalogEl) attachRafScroll(catalogEl, () => lastCatalogScroll, v => { lastCatalogScroll = v; });
    if (rosterEl) attachRafScroll(rosterEl, () => lastRosterScroll, v => { lastRosterScroll = v; });

    const btnShelf = document.getElementById('btn-tab-hanger-shelf');
    const btnRoster = document.getElementById('btn-tab-flight-roster');
    const revealAll = () => {
      accumulatedDown = 0;
      setHeaderState(false);
    };

    if (btnShelf) btnShelf.addEventListener('click', revealAll);
    if (btnRoster) btnRoster.addEventListener('click', revealAll);
  }
}

window.ProcurementActionDispatcher = ProcurementActionDispatcher;