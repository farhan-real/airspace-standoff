/**
 * AIRSPACE STANDOFF: Hardpoint Station Badges & Munition Mount Cards
 */

class RosterStationsRenderer {
  static normalizeWeapons(item, spec) {
    if (!item || !item.weapons) return;
    const weaponsMap = window.WEAPONS_CATALOG || {};
    const intCap = Number(spec.internalSlots || 0);
    const extCap = Number(spec.externalSlots !== undefined ? spec.externalSlots : (spec.totalSlots || 6));
    const ctrCap = Number(spec.centerlineSlots !== undefined ? spec.centerlineSlots : (spec.hasCenterline ? 6 : 0));

    let intUsed = 0;
    let extUsed = 0;
    let ctrUsed = 0;

    item.weapons = item.weapons.map(wEntry => {
      const wId = (typeof wEntry === 'object' && wEntry !== null) ? (wEntry.id || wEntry.specId) : wEntry;
      const w = weaponsMap[wId];
      if (!w) return null;

      const wSlots = Number(w.slots || 1);
      let assignedStation = (typeof wEntry === 'object' && wEntry !== null && wEntry.station) ? wEntry.station : null;

      if (!assignedStation) {
        if (w.slotType === 'CENTERLINE' && spec.hasCenterline && ctrUsed + wSlots <= ctrCap) {
          assignedStation = 'CENTERLINE';
        } else if (w.slotType === 'INTERNAL' && intUsed + wSlots <= intCap) {
          assignedStation = 'INTERNAL';
        } else if (extUsed + wSlots <= extCap) {
          assignedStation = 'EXTERNAL';
        } else if (spec.hasCenterline && ctrUsed + wSlots <= ctrCap) {
          assignedStation = 'CENTERLINE';
        } else {
          assignedStation = 'EXTERNAL';
        }
      }

      if (assignedStation === 'INTERNAL') intUsed += wSlots;
      else if (assignedStation === 'CENTERLINE') ctrUsed += wSlots;
      else extUsed += wSlots;

      return { id: wId, station: assignedStation };
    }).filter(Boolean);
  }

  static renderStations(pm, card, item, sIdx, metrics) {
    const weaponsMap = window.WEAPONS_CATALOG || {};
    const spec = (window.AIRCRAFT_CATALOG || {})[item.specId] || {};
    this.normalizeWeapons(item, spec);

    const intCap = metrics ? (metrics.internalCapacity || 0) : (spec.internalSlots || 0);
    const extCap = metrics ? (metrics.externalCapacity || 6) : (spec.externalSlots !== undefined ? spec.externalSlots : (spec.totalSlots || 6));
    const ctrCap = metrics ? (metrics.centerlineCapacity || 6) : (spec.centerlineSlots || 6);

    const internalItems = [];
    const externalItems = [];
    const centerlineItems = [];

    let intUsed = 0;
    let extUsed = 0;
    let ctrUsed = 0;

    item.weapons.forEach((entry, wIdx) => {
      const w = weaponsMap[entry.id];
      if (!w) return;
      const wSlots = Number(w.slots || 1);
      const data = { wId: entry.id, w, wIdx, station: entry.station, slots: wSlots };

      if (entry.station === 'INTERNAL') {
        intUsed += wSlots;
        internalItems.push(data);
      } else if (entry.station === 'CENTERLINE') {
        ctrUsed += wSlots;
        centerlineItems.push(data);
      } else {
        extUsed += wSlots;
        externalItems.push(data);
      }
    });

    const remInternal = Math.max(0, intCap - intUsed);
    const remExternal = Math.max(0, extCap - extUsed);
    const remCenterline = Math.max(0, ctrCap - ctrUsed);

    const renderCard = (data, canUp, canDown) => {
      const w = data.w;
      const wIdx = data.wIdx;
      const dmg = w.damage !== undefined ? w.damage : 2;
      const itemSlotWord = data.slots === 1 ? 'SLOT' : 'SLOTS';
      let seekerTag = w.seeker || 'GUIDED';
      if (w.isJammerPod) seekerTag = 'ECM';
      else if (w.isDecoyDrone) seekerTag = 'MALD';
      else if (w.isDecoy) seekerTag = 'DECOY';
      else if (w.isLaser) seekerTag = 'LASER';
      else if (seekerTag === 'PASSIVE_RADAR') seekerTag = 'ARM';
      else if (seekerTag === 'GPS_INS') seekerTag = 'GPS/INS';
      else if (seekerTag === 'INS' || seekerTag === 'INS_RADAR') seekerTag = 'INS';
      else if (seekerTag === 'DIRECT_FIRE') seekerTag = 'DIRECT';

      return `
        <div class="installed-item-card station-${data.station.toLowerCase()}" data-sidx="${sIdx}" data-widx="${wIdx}">
          <div class="iic-reorder-group">
            <button type="button" class="btn-reorder-item btn-move-up" data-sidx="${sIdx}" data-widx="${wIdx}" ${canUp ? '' : 'disabled'} title="${canUp ? 'Move up / shift station' : 'Cannot move up'}">
              <img src="icons/arrowup.svg" width="9" height="9" alt="Up">
            </button>
            <button type="button" class="btn-reorder-item btn-move-down" data-sidx="${sIdx}" data-widx="${wIdx}" ${canDown ? '' : 'disabled'} title="${canDown ? 'Move down / shift station' : 'Cannot move down'}">
              <img src="icons/arrowdown.svg" width="9" height="9" alt="Down">
            </button>
          </div>
          <div class="iic-title-group">
            <span class="iic-title" title="${w.name}">${w.name}</span>
          </div>
          <div class="iic-right-group">
            <span class="iic-details"><span class="iic-slots">${data.slots}<span class="iic-slots-word"> ${itemSlotWord}</span><span class="iic-slots-short">S</span></span> &bull; <b class="iic-hp">${dmg} HP</b> &bull; <span class="iic-seeker">${seekerTag}</span></span>
            <button type="button" class="spec-inspect-btn small" data-inspect-type="weapon" data-inspect-id="${w.id}">SPECS</button>
            <button type="button" class="btn-dismount-item" data-sidx="${sIdx}" data-widx="${wIdx}" title="Dismount weapon">
              <img src="icons/close.svg" width="8" height="8" alt="Remove">
            </button>
          </div>
        </div>`;
    };

    let internalBayHtml = '';
    if (intCap > 0) {
      const cardsHtml = internalItems.map((itemData, i) => {
        const canUp = (i > 0);
        let canDown = (i < internalItems.length - 1);
        if (!canDown) {
          if (remExternal >= itemData.slots) canDown = true;
          else if (externalItems.length > 0) {
            const firstExtW = weaponsMap[externalItems[0].wId];
            if (firstExtW && firstExtW.slotType === 'INTERNAL') {
              canDown = (intUsed - itemData.slots + (firstExtW.slots || 1) <= intCap && extUsed - (firstExtW.slots || 1) + itemData.slots <= extCap);
            }
          }
        }
        return renderCard(itemData, canUp, canDown);
      }).join('');

      const emptyPrompt = (remInternal > 0)
        ? `<div class="empty-internal-slot" data-sidx="${sIdx}" data-station="INTERNAL" title="Equip internal missile">EQUIP INTERNAL WEAPON (${remInternal} SLOTS OPEN)</div>`
        : '';

      internalBayHtml = `
        <div class="station-section internal-bay-group">
          <div class="station-header-row">
            <span class="station-title"><img src="icons/diamond.svg" width="10" height="10" alt="Internal" class="manual-inline-ico"> INTERNAL WEAPONS BAY: <b>${intUsed} / ${intCap} SLOTS</b></span>
            <span class="station-tag stealth-tag">VLO ZERO DRAG</span>
          </div>
          <div class="station-items-container">
            ${cardsHtml}
            ${emptyPrompt}
          </div>
        </div>`;
    }

    const extCardsHtml = externalItems.map((itemData, j) => {
      let canUp = (j > 0);
      if (!canUp && itemData.w.slotType === 'INTERNAL') {
        if (remInternal >= itemData.slots) canUp = true;
        else if (internalItems.length > 0) {
          const lastIntW = weaponsMap[internalItems[internalItems.length - 1].wId];
          if (lastIntW) {
            canUp = (intUsed - (lastIntW.slots || 1) + itemData.slots <= intCap && extUsed - itemData.slots + (lastIntW.slots || 1) <= extCap);
          }
        }
      }
      const canDown = (j < externalItems.length - 1) || (spec.hasCenterline && itemData.w.slotType === 'CENTERLINE' && remCenterline >= itemData.slots);
      return renderCard(itemData, canUp, canDown);
    }).join('');

    const addExtBtn = (remExternal > 0)
      ? `<button type="button" class="slot-action-btn btn-add-external-slot" data-sidx="${sIdx}" data-station="EXTERNAL">ADD EXTERNAL WEAPONS (${remExternal} SLOTS REMAINING)</button>`
      : '';

    const externalPylonsHtml = `
      <div class="station-section external-pylons-group">
        <div class="station-header-row">
          <span class="station-title">EXTERNAL WING PYLONS: <b>${extUsed} / ${extCap} SLOTS</b></span>
          <span class="station-tag external-tag">STANDARD PYLONS</span>
        </div>
        <div class="station-items-container">
          ${extCardsHtml || (remExternal === extCap ? `<div class="empty-bay-indicator" data-sidx="${sIdx}" data-station="EXTERNAL">NO EXTERNAL PYLONS EQUIPPED (${extCap} SLOTS AVAILABLE)</div>` : '')}
          ${addExtBtn}
        </div>
      </div>`;

    let centerlineHtml = '';
    if (centerlineItems.length > 0 || (metrics && metrics.hasCenterline)) {
      const ctrCardsHtml = centerlineItems.map((itemData, k) => {
        const canUp = (k > 0) || (itemData.w.slotType !== 'CENTERLINE' && remExternal >= itemData.slots);
        const canDown = (k < centerlineItems.length - 1);
        return renderCard(itemData, canUp, canDown);
      }).join('');

      centerlineHtml = `
        <div class="station-section centerline-station-group">
          <div class="station-header-row">
            <span class="station-title" style="color:#f59e0b;">CENTERLINE FUSELAGE STATION: <b>${ctrUsed} / ${ctrCap} SLOTS</b></span>
            <span class="station-tag centerline-tag">HEAVY HYPERSONIC</span>
          </div>
          <div class="station-items-container">
            ${ctrCardsHtml || `<div class="empty-bay-indicator" data-sidx="${sIdx}" data-station="CENTERLINE">EMPTY CENTERLINE STATION (${ctrCap} SLOTS)</div>`}
          </div>
        </div>`;
    }

    return `
      <div class="stores-stations-wrapper">
        ${internalBayHtml}
        ${externalPylonsHtml}
        ${centerlineHtml}
      </div>`;
  }

  static shiftWeapon(pm, sIdx, wIdx, direction) {
    const item = pm.game.procurementSquadron[sIdx];
    if (!item || !item.weapons || wIdx < 0 || wIdx >= item.weapons.length) return;
    const spec = (window.AIRCRAFT_CATALOG || {})[item.specId] || {};
    this.normalizeWeapons(item, spec);

    const weaponsMap = window.WEAPONS_CATALOG || {};
    const targetEntry = item.weapons[wIdx];
    const w = weaponsMap[targetEntry.id];
    if (!w) return;

    const intCap = Number(spec.internalSlots || 0);
    const extCap = Number(spec.externalSlots !== undefined ? spec.externalSlots : (spec.totalSlots || 6));
    const ctrCap = Number(spec.centerlineSlots !== undefined ? spec.centerlineSlots : (spec.hasCenterline ? 6 : 0));

    const internalItems = item.weapons.filter(e => e.station === 'INTERNAL');
    const externalItems = item.weapons.filter(e => e.station === 'EXTERNAL');
    const centerlineItems = item.weapons.filter(e => e.station === 'CENTERLINE');

    const intUsed = internalItems.reduce((sum, e) => sum + Number((weaponsMap[e.id] || {}).slots || 1), 0);
    const extUsed = externalItems.reduce((sum, e) => sum + Number((weaponsMap[e.id] || {}).slots || 1), 0);
    const remInternal = Math.max(0, intCap - intUsed);
    const remExternal = Math.max(0, extCap - extUsed);

    if (direction < 0) {
      if (targetEntry.station === 'INTERNAL') {
        const i = internalItems.indexOf(targetEntry);
        if (i > 0) {
          const prev = internalItems[i - 1];
          const [a, b] = [item.weapons.indexOf(targetEntry), item.weapons.indexOf(prev)];
          [item.weapons[a], item.weapons[b]] = [item.weapons[b], item.weapons[a]];
        }
      } else if (targetEntry.station === 'EXTERNAL') {
        const j = externalItems.indexOf(targetEntry);
        if (j > 0) {
          const prev = externalItems[j - 1];
          const [a, b] = [item.weapons.indexOf(targetEntry), item.weapons.indexOf(prev)];
          [item.weapons[a], item.weapons[b]] = [item.weapons[b], item.weapons[a]];
        } else if (j === 0 && w.slotType === 'INTERNAL') {
          if (remInternal >= (w.slots || 1)) {
            targetEntry.station = 'INTERNAL';
            const [removed] = item.weapons.splice(wIdx, 1);
            const lastIntIdx = item.weapons.map(e => e.station).lastIndexOf('INTERNAL');
            item.weapons.splice(lastIntIdx + 1, 0, removed);
          } else if (internalItems.length > 0) {
            const lastInt = internalItems[internalItems.length - 1];
            const lastIntW = weaponsMap[lastInt.id];
            if (lastIntW && intUsed - (lastIntW.slots || 1) + (w.slots || 1) <= intCap && extUsed - (w.slots || 1) + (lastIntW.slots || 1) <= extCap) {
              targetEntry.station = 'INTERNAL';
              lastInt.station = 'EXTERNAL';
              const [a, b] = [item.weapons.indexOf(targetEntry), item.weapons.indexOf(lastInt)];
              [item.weapons[a], item.weapons[b]] = [item.weapons[b], item.weapons[a]];
            }
          }
        }
      } else if (targetEntry.station === 'CENTERLINE') {
        const k = centerlineItems.indexOf(targetEntry);
        if (k > 0) {
          const prev = centerlineItems[k - 1];
          const [a, b] = [item.weapons.indexOf(targetEntry), item.weapons.indexOf(prev)];
          [item.weapons[a], item.weapons[b]] = [item.weapons[b], item.weapons[a]];
        } else if (k === 0 && w.slotType !== 'CENTERLINE' && remExternal >= (w.slots || 1)) {
          targetEntry.station = 'EXTERNAL';
          const [removed] = item.weapons.splice(wIdx, 1);
          const lastExtIdx = item.weapons.map(e => e.station).lastIndexOf('EXTERNAL');
          item.weapons.splice(lastExtIdx + 1, 0, removed);
        }
      }
    } else {
      if (targetEntry.station === 'INTERNAL') {
        const i = internalItems.indexOf(targetEntry);
        if (i < internalItems.length - 1) {
          const next = internalItems[i + 1];
          const [a, b] = [item.weapons.indexOf(targetEntry), item.weapons.indexOf(next)];
          [item.weapons[a], item.weapons[b]] = [item.weapons[b], item.weapons[a]];
        } else if (i === internalItems.length - 1) {
          if (remExternal >= (w.slots || 1)) {
            targetEntry.station = 'EXTERNAL';
            const [removed] = item.weapons.splice(wIdx, 1);
            const firstExtIdx = item.weapons.findIndex(e => e.station === 'EXTERNAL');
            if (firstExtIdx === -1) item.weapons.push(removed);
            else item.weapons.splice(firstExtIdx, 0, removed);
          } else if (externalItems.length > 0) {
            const firstExt = externalItems[0];
            const firstExtW = weaponsMap[firstExt.id];
            if (firstExtW && firstExtW.slotType === 'INTERNAL' && intUsed - (w.slots || 1) + (firstExtW.slots || 1) <= intCap && extUsed - (firstExtW.slots || 1) + (w.slots || 1) <= extCap) {
              targetEntry.station = 'EXTERNAL';
              firstExt.station = 'INTERNAL';
              const [a, b] = [item.weapons.indexOf(targetEntry), item.weapons.indexOf(firstExt)];
              [item.weapons[a], item.weapons[b]] = [item.weapons[b], item.weapons[a]];
            }
          }
        }
      } else if (targetEntry.station === 'EXTERNAL') {
        const j = externalItems.indexOf(targetEntry);
        if (j < externalItems.length - 1) {
          const next = externalItems[j + 1];
          const [a, b] = [item.weapons.indexOf(targetEntry), item.weapons.indexOf(next)];
          [item.weapons[a], item.weapons[b]] = [item.weapons[b], item.weapons[a]];
        } else if (j === externalItems.length - 1 && spec.hasCenterline && (w.slotType === 'CENTERLINE' || w.slots <= ctrCap)) {
          targetEntry.station = 'CENTERLINE';
          const [removed] = item.weapons.splice(wIdx, 1);
          item.weapons.push(removed);
        }
      } else if (targetEntry.station === 'CENTERLINE') {
        const k = centerlineItems.indexOf(targetEntry);
        if (k < centerlineItems.length - 1) {
          const next = centerlineItems[k + 1];
          const [a, b] = [item.weapons.indexOf(targetEntry), item.weapons.indexOf(next)];
          [item.weapons[a], item.weapons[b]] = [item.weapons[b], item.weapons[a]];
        }
      }
    }

    pm.updateSquadronCard(sIdx);
    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  static moveWeaponUp(pm, sIdx, wIdx) {
    this.shiftWeapon(pm, sIdx, wIdx, -1);
  }

  static moveWeaponDown(pm, sIdx, wIdx) {
    this.shiftWeapon(pm, sIdx, wIdx, 1);
  }
}

window.RosterStationsRenderer = RosterStationsRenderer;