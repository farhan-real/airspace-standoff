/**
 * AIRSPACE STANDOFF: Procurement Equipment Actions, Desktop Drag-and-Drop & Hardpoint Mounting
 * Station-aware equipment router handling internal bay, external pylons, and centerline stations.
 */

class ProcurementEquipHandler {
  constructor(procurementManager) {
    this.pm = procurementManager;
    this.initDragAndDrop();
  }

  initDragAndDrop() {
    const catalogEl = document.getElementById('armory-catalog');
    const rosterEl = document.getElementById('squadron-list');
    if (!catalogEl || !rosterEl) return;

    catalogEl.addEventListener('dragstart', (e) => {
      const card = e.target.closest('[data-drag-type]');
      if (!card || card.getAttribute('draggable') === 'false') {
        e.preventDefault();
        return;
      }

      const type = card.dataset.dragType;
      const id = card.dataset.dragId;
      const name = card.dataset.dragName || id;

      this.pm.draggedItem = { type, id, name };

      try {
        e.dataTransfer.setData('application/json', JSON.stringify(this.pm.draggedItem));
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'copy';
      } catch (err) {}

      card.classList.add('dragging');
    });

    catalogEl.addEventListener('dragend', (e) => {
      const card = e.target.closest('[data-drag-type]');
      if (card) card.classList.remove('dragging');
      this.clearDropHighlights();
      this.pm.draggedItem = null;
    });

    rosterEl.addEventListener('dragover', (e) => {
      if (!this.pm.draggedItem) return;
      e.preventDefault();

      const unitCard = e.target.closest('.squad-unit-card');
      this.clearDropHighlights(unitCard);

      if (unitCard) {
        const sIdx = parseInt(unitCard.dataset.sidx, 10);
        const isValid = this.validateDrop(sIdx, this.pm.draggedItem);
        unitCard.classList.toggle('drag-target-valid', isValid);
        unitCard.classList.toggle('drag-target-invalid', !isValid);
        e.dataTransfer.dropEffect = isValid ? 'copy' : 'none';
      } else if (this.pm.draggedItem.type === 'airframe') {
        e.dataTransfer.dropEffect = 'copy';
      } else {
        e.dataTransfer.dropEffect = 'none';
      }
    });

    rosterEl.addEventListener('dragleave', (e) => {
      const related = e.relatedTarget;
      if (!related || !rosterEl.contains(related)) {
        this.clearDropHighlights();
      }
    });

    rosterEl.addEventListener('drop', (e) => {
      if (!this.pm.draggedItem) return;
      e.preventDefault();

      const itemData = this.pm.draggedItem;
      const unitCard = e.target.closest('.squad-unit-card');
      this.clearDropHighlights();
      this.pm.draggedItem = null;

      if (unitCard) {
        const sIdx = parseInt(unitCard.dataset.sidx, 10);
        if (!isNaN(sIdx)) {
          if (itemData.type === 'airframe') {
            this.addAirframe(itemData.id);
          } else {
            this.equipItemDataToSquadron(sIdx, itemData);
          }
        }
      } else if (itemData.type === 'airframe') {
        this.addAirframe(itemData.id);
      } else if (this.pm.game.procurementSquadron.length > 0) {
        this.equipItemDirectly(itemData);
      }
    });
  }

  validateDrop(sIdx, itemData) {
    if (!itemData) return false;
    const item = this.pm.game.procurementSquadron[sIdx];
    if (!item) return false;
    const spec = (window.AIRCRAFT_CATALOG || {})[item.specId];
    if (!spec) return false;

    if (itemData.type === 'gun') {
      const gun = (window.AUTOCANNONS_CATALOG || {})[itemData.id];
      if (!gun) return false;
      return window.AircraftRegistry && typeof window.AircraftRegistry.isGunCompatible === 'function'
        ? window.AircraftRegistry.isGunCompatible(spec, gun)
        : (!gun.lockedTo || gun.lockedTo.includes(spec.id));
    }

    if (itemData.type === 'weapon') {
      const wpn = (window.WEAPONS_CATALOG || {})[itemData.id];
      if (!wpn) return false;
      const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
      if (ratings.indexOf(wpn.minRating) > ratings.indexOf(spec.maxPylonRating || 'Type M')) return false;
      if (wpn.allowedAirframes && !wpn.allowedAirframes.includes(spec.id)) return false;

      const metrics = LoadoutMetrics.calculate(spec, item.weapons, item.upgrades, item.chosenGunId, item.isLead);
      const wSlotType = wpn.slotType || 'EXTERNAL';

      if (wSlotType === 'CENTERLINE') {
        return Boolean(metrics && metrics.hasCenterline && metrics.centerlineUsed === 0);
      }
      if (wSlotType === 'INTERNAL') {
        return Boolean(metrics && (metrics.remainingInternal >= wpn.slots || metrics.remainingExternal >= wpn.slots));
      }
      return Boolean(metrics && metrics.remainingExternal >= wpn.slots);
    }

    if (itemData.type === 'upgrade') {
      const upg = (window.UPGRADES_CATALOG || {})[itemData.id];
      if (!upg) return false;
      if ((item.upgrades || []).length >= (spec.upgradeSockets || 3)) return false;
      if ((item.upgrades || []).includes(itemData.id)) return false;
      return !upg.isAllowed || upg.isAllowed(spec);
    }

    if (itemData.type === 'airframe') {
      return (this.pm.game.procurementSquadron.length < 16);
    }

    return false;
  }

  clearDropHighlights(exceptCard = null) {
    document.querySelectorAll('.squad-unit-card').forEach(c => {
      if (c !== exceptCard) {
        c.classList.remove('drag-target-valid', 'drag-target-invalid');
      }
    });
  }

  equipItemDirectly(itemData) {
    if (this.pm.game.procurementSquadron.length === 0) {
      this.pm.showAlertModal('NO AIRCRAFT', 'Add an aircraft to your squadron before equipping weapons or systems.');
      return;
    }
    const sIdx = (this.pm.activeBayIndex !== undefined && this.pm.activeBayIndex < this.pm.game.procurementSquadron.length) ? this.pm.activeBayIndex : 0;
    this.equipItemDataToSquadron(sIdx, itemData, this.pm.targetEquipStation);
  }

  addAirframe(specId) {
    const spec = (window.AIRCRAFT_CATALOG || {})[specId];
    if (!spec) return;
    if (this.pm.game.budgetRemaining < (spec.cost || 0)) {
      this.pm.showAlertModal('INSUFFICIENT FUNDS', `Adding ${spec.name} ($${Number(spec.cost).toFixed(1)}M) exceeds available budget.`);
      return;
    }
    const maxUnits = (window.CONFIG && window.CONFIG.MAX_SQUADRON_SIZE) || 16;
    if (this.pm.game.procurementSquadron.length >= maxUnits) {
      this.pm.showAlertModal('LIMIT REACHED', `Maximum squadron capacity of ${maxUnits} aircraft reached.`);
      return;
    }
    const isFirst = (this.pm.game.procurementSquadron.length === 0);
    this.pm.game.procurementSquadron.push({
      specId: specId, chosenGunId: spec.builtInGun || 'M61A2', weapons: [], upgrades: [], isLead: isFirst
    });
    this.pm.activeBayIndex = this.pm.game.procurementSquadron.length - 1;
    this.pm.updateUI();
    this.pm.renderCatalog();
  }

  cloneAirframe(sIdx) {
    const item = this.pm.game.procurementSquadron[sIdx];
    if (!item) return;
    const maxUnits = (window.CONFIG && window.CONFIG.MAX_SQUADRON_SIZE) || 16;
    if (this.pm.game.procurementSquadron.length >= maxUnits) {
      this.pm.showAlertModal('LIMIT REACHED', `Maximum squadron capacity of ${maxUnits} aircraft reached.`);
      return;
    }
    this.pm.game.procurementSquadron.push({
      specId: item.specId, chosenGunId: item.chosenGunId, weapons: [...item.weapons], upgrades: [...item.upgrades], isLead: false
    });
    this.pm.activeBayIndex = this.pm.game.procurementSquadron.length - 1;
    this.pm.updateUI();
  }

  equipItemDataToSquadron(sIdx, itemData, targetStation = null) {
    const item = this.pm.game.procurementSquadron[sIdx];
    if (!item) return;

    if (itemData.type === 'gun') {
      const spec = (window.AIRCRAFT_CATALOG || {})[item.specId];
      const gun = (window.AUTOCANNONS_CATALOG || {})[itemData.id];
      const isComp = window.AircraftRegistry && typeof window.AircraftRegistry.isGunCompatible === 'function'
        ? window.AircraftRegistry.isGunCompatible(spec, gun)
        : (spec && spec.allowedGuns ? spec.allowedGuns.includes(itemData.id) : true);

      if (!isComp) {
        this.pm.showAlertModal('INCOMPATIBLE', `${itemData.name} is not compatible with this aircraft.`);
        return;
      }
      item.chosenGunId = itemData.id;
    } else if (itemData.type === 'weapon') {
      const wpn = (window.WEAPONS_CATALOG || {})[itemData.id];
      const spec = (window.AIRCRAFT_CATALOG || {})[item.specId];
      if (!wpn || !spec) return;

      const ratings = ['Type S', 'Type M', 'Type H', 'Type X'];
      if (ratings.indexOf(wpn.minRating) > ratings.indexOf(spec.maxPylonRating || 'Type M')) {
        this.pm.showAlertModal('RATING MISMATCH', `${wpn.name} requires ${wpn.minRating} pylons, but ${spec.name} only supports up to ${spec.maxPylonRating || 'Type M'}.`);
        return;
      }

      if (wpn.allowedAirframes && !wpn.allowedAirframes.includes(spec.id)) {
        this.pm.showAlertModal('RESTRICTED ORDNANCE', `${wpn.name} cannot be mounted on this airframe.`);
        return;
      }

      const metrics = LoadoutMetrics.calculate(spec, item.weapons, item.upgrades, item.chosenGunId, item.isLead);
      const wSlotType = wpn.slotType || 'EXTERNAL';
      let assignedStation = targetStation;

      if (wSlotType === 'CENTERLINE') {
        if (!metrics.hasCenterline || metrics.centerlineUsed > 0) {
          this.pm.showAlertModal('CENTERLINE OCCUPIED', `${wpn.name} mounts on the centerline fuselage station, which is either unavailable or already occupied.`);
          return;
        }
        assignedStation = 'CENTERLINE';
      } else if (!assignedStation) {
        if (wSlotType === 'INTERNAL' && (metrics.remainingInternal >= wpn.slots)) {
          assignedStation = 'INTERNAL';
        } else if (metrics.remainingExternal >= wpn.slots) {
          assignedStation = 'EXTERNAL';
        } else {
          this.pm.showAlertModal('HARDPOINTS FULL', `Mounting ${wpn.name} (${wpn.slots} slots) exceeds available capacity on Aircraft #${sIdx + 1}.`);
          return;
        }
      } else {
        if (assignedStation === 'INTERNAL') {
          if (wSlotType !== 'INTERNAL') {
            this.pm.showAlertModal('SLOT INCOMPATIBLE', `${wpn.name} is an external munition and cannot be mounted inside the internal weapon bay.`);
            return;
          }
          if (metrics.remainingInternal < wpn.slots) {
            this.pm.showAlertModal('INTERNAL BAY FULL', `Internal weapons bay only has ${metrics.remainingInternal} slots remaining (${wpn.slots} required).`);
            return;
          }
        } else if (assignedStation === 'EXTERNAL') {
          if (wSlotType === 'CENTERLINE') {
            this.pm.showAlertModal('CENTERLINE ONLY', `${wpn.name} can only be mounted on the centerline fuselage station.`);
            return;
          }
          if (metrics.remainingExternal < wpn.slots) {
            this.pm.showAlertModal('EXTERNAL PYLONS FULL', `External pylons only have ${metrics.remainingExternal} slots remaining (${wpn.slots} required).`);
            return;
          }
        }
      }

      item.weapons.push({ id: itemData.id, station: assignedStation });
      this.pm.targetEquipStation = null;
    } else if (itemData.type === 'upgrade') {
      const specU = (window.AIRCRAFT_CATALOG || {})[item.specId];
      if (item.upgrades.length >= (specU.upgradeSockets || 3)) {
        this.pm.showAlertModal('SLOTS FULL', `All component sockets on Aircraft #${sIdx + 1} are occupied.`);
        return;
      }
      if (item.upgrades.includes(itemData.id)) {
        this.pm.showAlertModal('ALREADY INSTALLED', 'This component is already installed on this aircraft.');
        return;
      }
      const upg = (window.UPGRADES_CATALOG || {})[itemData.id];
      if (upg && upg.isAllowed && !upg.isAllowed(specU)) {
        this.pm.showAlertModal('RESTRICTED SYSTEM', `${upg.name} is not compatible with this airframe class.`);
        return;
      }
      item.upgrades.push(itemData.id);
    }
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    this.pm.updateUI();
    this.pm.renderCatalog();
  }
}

window.ProcurementEquipHandler = ProcurementEquipHandler;