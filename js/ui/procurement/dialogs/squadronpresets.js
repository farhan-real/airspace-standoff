/**
 * js/ui/procurement/dialogs/squadronpresets.js - Two-Column Collapsible Squadron Presets Modal Controller.
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

  buildPresetEntries() {
    const acMap = window.AIRCRAFT_CATALOG;
    const gunsMap = window.AUTOCANNONS_CATALOG;
    const wpnsMap = window.WEAPONS_CATALOG;
    if (!acMap || !gunsMap || !wpnsMap) {
      throw new Error('Aircraft, gun, and weapon catalogs must be loaded before opening Squadron Presets.');
    }

    const entries = [];

    ProcurementPresets.getBuiltinPresetCatalog().forEach(meta => {
      const units = ProcurementPresets.getBuiltinPreset(meta.id);
      entries.push({
        key: `builtin:${meta.id}`,
        id: meta.id,
        name: meta.name,
        desc: meta.desc,
        source: 'BUILTIN',
        units
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

        const weaponNames = (u.weapons || []).map(wEntry => {
          const wId = (typeof wEntry === 'object' && wEntry !== null) ? (wEntry.id || wEntry.specId) : wEntry;
          const wObj = wpnsMap[wId];
          if (!wObj) throw new Error(`Weapon "${wId}" in squadron preset "${entry.name}" does not exist.`);
          return wObj.name;
        });

        return {
          specName: spec.name,
          isLead,
          cost: metrics.totalCost,
          gunName: gunObj.name,
          weaponNames
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
    if (this.category !== 'ALL') {
      entries = entries.filter(e => e.source === this.category);
    }
    if (this.search) {
      entries = entries.filter(e => {
        const parts = [
          e.name,
          e.desc,
          ...e.aircraftDetails.map(a => `${a.specName} ${a.gunName} ${a.weaponNames.join(' ')}`)
        ].join(' ').toLowerCase();
        return parts.includes(this.search);
      });
    }

    if (entries.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px 10px; color: #8494ab; font-family: var(--font-mono); font-size: 0.74rem;"><b style="color:#00f0ff;">NO SQUADRON PRESETS MATCH THE SELECTED FILTER</b></div>`;
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
        ? `<button type="button" class="sq-preset-icon-btn btn-sq-rename" title="Rename squadron preset"><img src="icons/edit.svg" width="11" height="11" alt="Rename"></button>
           <button type="button" class="sq-preset-icon-btn alert btn-sq-delete" title="Delete squadron preset"><img src="icons/trash.svg" width="11" height="11" alt="Delete"></button>`
        : '';

      const miniCardsHtml = entry.aircraftDetails.map(ac => `
        <div class="sq-mini-card">
          <div class="sq-mini-top">
            <div class="sq-mini-name-wrap">
              <span class="sq-mini-name">${ac.specName}</span>
              ${ac.isLead ? '<span class="sq-mini-lead">LEAD</span>' : ''}
            </div>
            <span class="sq-mini-cost">$${ac.cost.toFixed(1)}M</span>
          </div>
          <div class="sq-mini-armaments">
            <div class="sq-mini-row">
              <span class="sq-mini-label">GUN:</span>
              <span class="sq-mini-gun">${ac.gunName}</span>
            </div>
            <div class="sq-mini-row">
              <span class="sq-mini-label">MISSILES:</span>
              <span class="sq-mini-missiles">${ac.weaponNames.length > 0 ? ac.weaponNames.join(', ') : 'None equipped'}</span>
            </div>
          </div>
        </div>
      `).join('');

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
                <span class="sq-preset-count">${entry.aircraftCount} ${entry.aircraftCount === 1 ? 'AIRCRAFT' : 'AIRCRAFT'}</span>
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
        </div>
      `;

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

      const loadBtn = card.querySelector('.sq-preset-load-btn');
      loadBtn.onclick = (e) => {
        e.stopPropagation();
        ProcurementPresets.activePreset = entry.key;
        if (entry.source === 'BUILTIN') this.pm.applyBuiltinPreset(entry.id);
        else this.pm.applyCustomPreset(entry.id);
        if (typeof AudioSys !== 'undefined') AudioSys.playClick();
        this.close();
      };

      const renameBtn = card.querySelector('.btn-sq-rename');
      if (renameBtn) {
        renameBtn.onclick = (e) => {
          e.stopPropagation();
          this.pm.showPromptModal('RENAME SQUADRON PRESET', `Enter a new name for "${entry.id}":`, entry.id, (newName) => {
            if (newName && newName.trim() && newName.trim() !== entry.id) {
              if (this.pm.customLoadouts.rename(entry.id, newName.trim())) {
                if (ProcurementPresets.activePreset === entry.key) {
                  ProcurementPresets.activePreset = `custom:${newName.trim()}`;
                }
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
            if (ProcurementPresets.activePreset === entry.key) {
              ProcurementPresets.activePreset = '';
            }
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
