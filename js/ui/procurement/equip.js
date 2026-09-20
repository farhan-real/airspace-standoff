/**
 * AIRSPACE STANDOFF // Procurement Equipment Actions & Hardpoint Mounting Submodule
 */

class ProcurementEquipHandler {
  constructor(procurementManager) {
    this.pm = procurementManager;
  }

  equipItemDirectly(itemData) {
    if (this.pm.game.procurementSquadron.length === 0) {
      this.pm.showAlertModal('NO AIRCRAFT', 'Add an aircraft to your squadron before equipping weapons or systems.');
      return;
    }
    const sIdx = (this.pm.activeBayIndex !== undefined && this.pm.activeBayIndex < this.pm.game.procurementSquadron.length) ? this.pm.activeBayIndex : 0;
    this.equipItemDataToSquadron(sIdx, itemData);
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

  equipItemDataToSquadron(sIdx, itemData) {
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

      const curSlots = item.weapons.reduce((sum, wId) => sum + ((window.WEAPONS_CATALOG[wId] || {}).slots || 1), 0);
      if (curSlots + (wpn.slots || 1) > (spec.totalSlots || 6)) {
        this.pm.showAlertModal('HARDPOINTS FULL', `Mounting ${wpn.name} exceeds remaining hardpoint capacity on Aircraft #${sIdx + 1}.`);
        return;
      }
      item.weapons.push(itemData.id);
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