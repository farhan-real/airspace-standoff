/**
 * js/ui/procurement/dialogs/squadronpresets.js - Single-Column Squadron Presets with Two-Column Aircraft Cards.
 */

class SquadronPresetsModalController {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this.category = 'ALL';
    this.search = '';
    this.expandedKeys = new Set();
    this._listenersBound = false;
  }

  ensureModal() {
    if (document.getElementById('squadron-presets-modal')) return;
    if (window.ModalPanelsTemplates && typeof window.ModalPanelsTemplates.ensure === 'function') {
      window.ModalPanelsTemplates.ensure('squadron-presets-modal');
    }
    this.initListeners();
  }

  initListeners() {
    if (this._listenersBound) return;
    this._listenersBound = true;
    const modal = document.getElementById('squadron-presets-modal');
    const closeBtn = document.getElementById('btn-close-sq-presets');

    const closeModal = () => {
      if (modal) modal.classList.remove('active');
      if (this.pm.game.controls) this.pm.game.controls.autoUnpauseOnDialogClose();
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    const searchInput = document.getElementById('sq-presets-search-input');
    if (searchInput) {
      let timer = null;
      searchInput.oninput = (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.search = (e.target.value || '').trim().toLowerCase();
          this.renderGrid();
        }, 120);
      };
    }

    const saveBtn = document.getElementById('btn-save-current-squadron-modal');
    if (saveBtn) {
      saveBtn.onclick = () => {
        ProcurementPresets.promptSaveSquadron(this.pm, () => this.renderGrid());
      };
    }

    const exportBtn = document.getElementById('btn-export-sq-presets');
    if (exportBtn) {
      exportBtn.onclick = () => {
        if (typeof PresetExchange === 'undefined') throw new Error('PresetExchange is not loaded.');
        try {
          PresetExchange.exportAllSquadronPresets(this.pm.customLoadouts);
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        } catch (err) {
          this.pm.showAlertModal('EXPORT SQUADRON PRESETS', err.message || String(err));
        }
      };
    }

    const importBtn = document.getElementById('btn-import-sq-presets');
    if (importBtn) {
      importBtn.onclick = async () => {
        if (typeof DataExchange === 'undefined' || typeof PresetExchange === 'undefined' || typeof PresetConflictModal === 'undefined') {
          throw new Error('DataExchange, PresetExchange, and PresetConflictModal must be loaded.');
        }
        try {
          const picked = await DataExchange.pickJsonFile();
          if (!picked) return;
          const candidates = PresetExchange.parseSquadronPresetsPayload(picked.text, picked.name);
          const workingMap = Object.assign({}, this.pm.customLoadouts.getAll());
          const deletes = new Set();
          const additions = {};
          let skipped = 0;
          let replaced = 0;

          for (const item of candidates) {
            const conflict = PresetExchange.findSquadronConflict(item.name, item.units, workingMap);
            if (!conflict) {
              workingMap[item.name] = item.units;
              additions[item.name] = item.units;
              continue;
            }
            const choice = await PresetConflictModal.prompt(conflict);
            if (choice === 'cancel') return;
            if (choice === 'existing') { skipped++; continue; }
            delete workingMap[conflict.existing.key];
            if (additions[conflict.existing.key]) delete additions[conflict.existing.key];
            else deletes.add(conflict.existing.key);
            workingMap[item.name] = item.units;
            additions[item.name] = item.units;
            replaced++;
          }

          for (const delKey of deletes) this.pm.customLoadouts.delete(delKey);
          const addedKeys = Object.keys(additions);
          for (const k of addedKeys) this.pm.customLoadouts.save(k, additions[k]);

          this.renderGrid();
          if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          this.pm.showAlertModal('IMPORT COMPLETE', `Saved ${addedKeys.length} squadron preset(s) (${replaced} replaced, ${skipped} kept existing).`);
        } catch (err) {
          this.pm.showAlertModal('IMPORT FAILED', err.message || String(err));
        }
      };
    }

    const catPills = document.querySelectorAll('#sq-presets-category-pills .cat-pill-btn');
    catPills.forEach(btn => {
      btn.onclick = () => {
        catPills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.category = btn.getAttribute('data-sqcat') || 'ALL';
        this.renderGrid();
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };
    });
  }

  open() {
    this.ensureModal();
    const modal = document.getElementById('squadron-presets-modal');
    if (!modal) return;
    if (this.pm.game.controls) this.pm.game.controls.autoPauseOnDialogOpen();
    this.renderGrid();
    modal.classList.add('active');
  }

  close() {
    const modal = document.getElementById('squadron-presets-modal');
    if (modal) modal.classList.remove('active');
    if (this.pm.game.controls) this.pm.game.controls.autoUnpauseOnDialogClose();
  }

  resolveWeaponRows(weaponsList, spec, wpnsMap) {
    const intCap = Number(spec.internalSlots || 0);
    const extCap = Number(spec.externalSlots !== undefined ? spec.externalSlots : (spec.totalSlots !== undefined ? spec.totalSlots : 6));
    const ctrCap = Number(spec.centerlineSlots !== undefined ? spec.centerlineSlots : (spec.hasCenterline ? 6 : 0));
    let intUsed = 0, extUsed = 0, ctrUsed = 0;

    return (weaponsList || []).map(wEntry => {
      const wId = (typeof wEntry === 'object' && wEntry !== null) ? (wEntry.id || wEntry.specId) : wEntry;
      const w = wpnsMap[wId];
      if (!w) throw new Error(`Weapon "${wId}" does not exist in WEAPONS_CATALOG.`);

      const wSlots = Number(w.slots || 1);
      let station = (typeof wEntry === 'object' && wEntry !== null && wEntry.station) ? wEntry.station : null;
      if (!station) {
        if (w.slotType === 'CENTERLINE' && spec.hasCenterline && ctrUsed + wSlots <= ctrCap) station = 'CENTERLINE';
        else if (w.slotType === 'INTERNAL' && intUsed + wSlots <= intCap) station = 'INTERNAL';
        else if (extCap > 0 && extUsed + wSlots <= extCap) station = 'EXTERNAL';
        else if (spec.hasCenterline && ctrUsed + wSlots <= ctrCap) station = 'CENTERLINE';
        else station = extCap > 0 ? 'EXTERNAL' : 'INTERNAL';
      }

      if (station === 'INTERNAL') intUsed += wSlots;
      else if (station === 'CENTERLINE') ctrUsed += wSlots;
      else extUsed += wSlots;

      const stationTag = station === 'INTERNAL' ? 'INT' : (station === 'CENTERLINE' ? 'CTR' : 'EXT');
      const seekerTag = w.isTargetingPod ? 'TGP' : (w.isJammerPod ? 'ECM' : (w.isDecoyDrone ? 'MALD' : (w.isDecoy ? 'DECOY' : (w.seeker || 'GUIDED'))));
      return {
        name: w.name,
        stationClass: station.toLowerCase(),
        stationTag,
        seekerTag,
        slots: wSlots
      };
    });
  }

  buildPresetEntries() {
    const acMap = window.AIRCRAFT_CATALOG;
    const gunsMap = window.AUTOCANNONS_CATALOG;
    const wpnsMap = window.WEAPONS_CATALOG;
    if (!acMap || !gunsMap || !wpnsMap) {
      throw new Error('Aircraft, gun, and weapon catalogs must be loaded before opening Squadron Presets.');
    }

    const entries = [];

    ProcurementPresets.getBuiltinPresetCatalog().forEach(meta => {
      entries.push({
        key: `builtin:${meta.id}`,
        id: meta.id,
        name: meta.name,
        desc: meta.desc,
        source: 'BUILTIN',
        units: ProcurementPresets.getBuiltinPreset(meta.id)
      });
    });

    const customMap = this.pm.customLoadouts.getAll();
    Object.entries(customMap).forEach(([name, units]) => {
      entries.push({
        key: `custom:${name}`,
        id: name,
        name,
        desc: 'User-saved custom squadron configuration.',
        source: 'USER',
        units: Array.isArray(units) ? units : []
      });
    });

    return entries.map(entry => {
      const hasExplicitLead = entry.units.some(u => u && u.isLead);
      let totalCost = 0;

      const aircraftDetails = entry.units.map((u, idx) => {
        const spec = acMap[u.specId];
        if (!spec) throw new Error(`Aircraft spec "${u.specId}" in squadron preset "${entry.name}" does not exist.`);
        const isLead = Boolean(u.isLead || (!hasExplicitLead && idx === 0));
        const metrics = LoadoutMetrics.calculate(spec, u.weapons || [], u.upgrades || [], u.chosenGunId, isLead);
        totalCost += metrics.totalCost;

        const gunId = u.chosenGunId || spec.builtInGun;
        const gunObj = gunsMap[gunId];
        if (!gunObj) throw new Error(`Gun "${gunId}" in squadron preset "${entry.name}" does not exist.`);

        if (typeof PresetMatcher === 'undefined') throw new Error('PresetMatcher is not loaded.');
        const presetMatch = PresetMatcher.match(u.specId, u.weapons || [], gunId, u.upgrades || [], this.pm.customLoadouts);

        return {
          specName: spec.name,
          isLead,
          cost: metrics.totalCost,
          gunName: gunObj.name,
          presetMatch,
          weaponRows: this.resolveWeaponRows(u.weapons, spec, wpnsMap)
        };
      });

      return {
        ...entry,
        totalCost,
        aircraftCount: aircraftDetails.length,
        aircraftDetails
      };
    });
  }

  renderGrid() {
    this.ensureModal();
    const grid = document.getElementById('squadron-presets-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let entries = this.buildPresetEntries();
    if (this.category !== 'ALL') entries = entries.filter(e => e.source === this.category);
    if (this.search) {
      entries = entries.filter(e => {
        const parts = [
          e.name, e.desc,
          ...e.aircraftDetails.map(a => `${a.specName} ${a.presetMatch ? a.presetMatch.name : ''} ${a.gunName} ${a.weaponRows.map(r => r.name).join(' ')}`)
        ].join(' ').toLowerCase();
        return parts.includes(this.search);
      });
    }

    if (entries.length === 0) {
      grid.innerHTML = `<div style="text-align: center; padding: 40px 10px; color: #8494ab; font-family: var(--font-mono); font-size: 0.74rem;"><b style="color:#00f0ff;">NO SQUADRON PRESETS MATCH THE SELECTED FILTER</b></div>`;
      return;
    }

    const budgetMax = this.pm.game.budgetMax;
    const fragment = document.createDocumentFragment();

    entries.forEach(entry => {
      const card = document.createElement('div');
      const isOpen = this.expandedKeys.has(entry.key);
      const isOverBudget = entry.totalCost > budgetMax;
      card.className = `sq-preset-card${isOpen ? ' is-open' : ''}`;

      const userButtonsHtml = entry.source === 'USER'
        ? `<button type="button" class="sq-preset-icon-btn btn-sq-export" title="Export squadron preset JSON"><img src="icons/arrowdown.svg" width="11" height="11" alt="Export"></button>
           <button type="button" class="sq-preset-icon-btn btn-sq-rename" title="Rename squadron preset"><img src="icons/edit.svg" width="11" height="11" alt="Rename"></button>
           <button type="button" class="sq-preset-icon-btn alert btn-sq-delete" title="Delete squadron preset"><img src="icons/trash.svg" width="11" height="11" alt="Delete"></button>`
        : '';

      const miniCardsHtml = entry.aircraftDetails.map(ac => {
        const wpnLinesHtml = ac.weaponRows.length > 0
          ? ac.weaponRows.map(r => `
              <div class="sq-mini-wpn-row station-${r.stationClass}">
                <span class="sq-mini-wpn-name" title="${r.name}">${r.name}</span>
                <span class="sq-mini-wpn-meta">${r.slots}S &bull; ${r.seekerTag} <span class="sq-mini-wpn-st">[${r.stationTag}]</span></span>
              </div>`).join('')
          : '<div class="sq-mini-wpn-row"><span class="sq-mini-wpn-meta">No missiles or pods equipped</span></div>';

        const presetLineHtml = ac.presetMatch
          ? `<div class="sq-mini-preset-line">${PresetMatcher.renderMatchHtml(ac.presetMatch)}</div>`
          : '';

        return `
          <div class="sq-mini-card">
            <div class="sq-mini-head">
              <div class="sq-mini-top">
                <div class="sq-mini-name-wrap">
                  <span class="sq-mini-name">${ac.specName}</span>
                  ${ac.isLead ? '<span class="sq-mini-lead">LEAD</span>' : ''}
                </div>
                <span class="sq-mini-cost">$${ac.cost.toFixed(1)}M</span>
              </div>
              ${presetLineHtml}
            </div>
            <div class="sq-mini-gun-line">
              <span class="sq-mini-gun-label">GUN:</span>
              <span class="sq-mini-gun-name">${ac.gunName}</span>
            </div>
            <div class="sq-mini-wpn-list">${wpnLinesHtml}</div>
          </div>`;
      }).join('');

      card.innerHTML = `
        <div class="sq-preset-header" role="button" tabindex="0" aria-expanded="${isOpen}">
          <div class="sq-preset-head-left">
            <span class="sq-preset-chevron"><img src="icons/chevron.svg" width="10" height="10" alt="Toggle"></span>
            <div class="sq-preset-title-block">
              <div class="sq-preset-title-line">
                <span class="sq-preset-name">${entry.name}</span>
                <span class="sq-preset-badge ${entry.source === 'USER' ? 'user' : 'builtin'}">${entry.source}</span>
              </div>
              <div class="sq-preset-meta-line">
                <span class="sq-preset-cost${isOverBudget ? ' over' : ''}">$${entry.totalCost.toFixed(1)}M</span>
                <span class="sq-preset-count">${entry.aircraftCount} AIRCRAFT</span>
              </div>
            </div>
          </div>
          <div class="sq-preset-head-actions">
            ${userButtonsHtml}
            <button type="button" class="hud-btn highlight sq-preset-load-btn">LOAD</button>
          </div>
        </div>
        <div class="sq-preset-body">
          <div class="sq-preset-desc">${entry.desc}</div>
          <div class="sq-mini-list">${miniCardsHtml}</div>
        </div>`;

      const header = card.querySelector('.sq-preset-header');
      header.onclick = (e) => {
        if (e.target.closest('.sq-preset-head-actions')) return;
        const nextOpen = !card.classList.contains('is-open');
        card.classList.toggle('is-open', nextOpen);
        header.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
        if (nextOpen) this.expandedKeys.add(entry.key);
        else this.expandedKeys.delete(entry.key);
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
      };

      card.querySelector('.sq-preset-load-btn').onclick = (e) => {
        e.stopPropagation();
        ProcurementPresets.activePreset = entry.key;
        if (entry.source === 'BUILTIN') this.pm.applyBuiltinPreset(entry.id);
        else this.pm.applyCustomPreset(entry.id);
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        this.close();
      };

      const exportCardBtn = card.querySelector('.btn-sq-export');
      if (exportCardBtn) {
        exportCardBtn.onclick = (e) => {
          e.stopPropagation();
          if (typeof PresetExchange === 'undefined') throw new Error('PresetExchange is not loaded.');
          try {
            PresetExchange.exportSingleSquadronPreset(entry.id, entry.units);
            if (typeof AudioSys !== 'undefined') AudioSys.playClick();
          } catch (err) {
            this.pm.showAlertModal('EXPORT FAILED', err.message || String(err));
          }
        };
      }

      const renameBtn = card.querySelector('.btn-sq-rename');
      if (renameBtn) {
        renameBtn.onclick = (e) => {
          e.stopPropagation();
          this.pm.showPromptModal('RENAME SQUADRON PRESET', `Enter a new name for "${entry.id}":`, entry.id, (newName) => {
            if (newName && newName.trim() && newName.trim() !== entry.id) {
              if (this.pm.customLoadouts.rename(entry.id, newName.trim())) {
                if (ProcurementPresets.activePreset === entry.key) ProcurementPresets.activePreset = `custom:${newName.trim()}`;
                this.renderGrid();
              }
            }
          });
        };
      }

      const deleteBtn = card.querySelector('.btn-sq-delete');
      if (deleteBtn) {
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          this.pm.showConfirmModal('DELETE SQUADRON PRESET', `Delete preset configuration "${entry.id}"?`, () => {
            this.pm.customLoadouts.delete(entry.id);
            if (ProcurementPresets.activePreset === entry.key) ProcurementPresets.activePreset = '';
            this.renderGrid();
          });
        };
      }

      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }
}

window.SquadronPresetsModalController = SquadronPresetsModalController;
