/**
 * AIRSPACE STANDOFF: Squadron Roster Stations Submodule
 * Internal bay, external pylons, and centerline stations builder with weapon item reordering.
 */

class RosterStationsRenderer {
  static renderStations(pm, card, item, sIdx, metrics) {
    const weaponsMap = window.WEAPONS_CATALOG || {};
    const spec = (window.AIRCRAFT_CATALOG || {})[item.specId] || {};
    const internalCapacity = metrics ? (metrics.internalCapacity || 0) : (spec.internalSlots || 0);
    const externalCapacity = metrics ? (metrics.externalCapacity || 6) : (spec.externalSlots !== undefined ? spec.externalSlots : (spec.totalSlots || 6));
    const internalUsed = metrics ? (metrics.internalUsed || 0) : 0;
    const externalUsed = metrics ? (metrics.externalUsed || 0) : 0;
    const centerlineUsed = metrics ? (metrics.centerlineUsed || 0) : 0;
    const centerlineCapacity = metrics ? (metrics.centerlineCapacity || 6) : (spec.centerlineSlots || 6);
    const remInternal = Math.max(0, internalCapacity - internalUsed);
    const remExternal = Math.max(0, externalCapacity - externalUsed);

    let internalItems = [];
    let externalItems = [];
    let centerlineItems = [];

    let currentInternalUsed = 0;
    (item.weapons || []).forEach((wEntry, wIdx) => {
      const wId = (typeof wEntry === 'object' && wEntry !== null) ? (wEntry.id || wEntry.specId) : wEntry;
      const w = weaponsMap[wId];
      if (!w) return;

      const wSlots = Number(w.slots || 1);
      let assignedStation = (typeof wEntry === 'object' && wEntry !== null && wEntry.station) ? wEntry.station : null;

      if (!assignedStation) {
        if (w.slotType === 'CENTERLINE') assignedStation = 'CENTERLINE';
        else if (w.slotType === 'INTERNAL' && (currentInternalUsed + wSlots <= internalCapacity)) {
          assignedStation = 'INTERNAL';
          currentInternalUsed += wSlots;
        } else {
          assignedStation = 'EXTERNAL';
        }
      }

      const itemData = { wId, w, wIdx, station: assignedStation, slots: wSlots };
      if (assignedStation === 'INTERNAL') internalItems.push(itemData);
      else if (assignedStation === 'CENTERLINE') centerlineItems.push(itemData);
      else externalItems.push(itemData);
    });

    const renderWeaponCard = (data) => {
      const w = data.w;
      const wIdx = data.wIdx;
      const damageHP = w.damage !== undefined ? w.damage : 2;
      const slots = data.slots;
      const itemSlotWord = slots === 1 ? 'SLOT' : 'SLOTS';
      const seeker = w.seeker || 'GUIDED';
      let seekerTag = seeker;
      if (w.isJammerPod) seekerTag = 'ECM';
      else if (w.isDecoyDrone) seekerTag = 'MALD';
      else if (w.isDecoy) seekerTag = 'DECOY';
      else if (w.isLaser) seekerTag = 'LASER';
      else if (seeker === 'PASSIVE_RADAR') seekerTag = 'ARM';
      else if (seeker === 'GPS_INS') seekerTag = 'GPS/INS';
      else if (seeker === 'INS' || seeker === 'INS_RADAR') seekerTag = 'INS';
      else if (seeker === 'DIRECT_FIRE') seekerTag = 'DIRECT';

      return `
        <div class="installed-item-card station-${data.station.toLowerCase()}" data-sidx="${sIdx}" data-widx="${wIdx}">
          <div class="iic-reorder-group">
            <button type="button" class="btn-reorder-item btn-move-up" data-sidx="${sIdx}" data-widx="${wIdx}" title="Move weapon up">
              <img src="icons/arrowup.svg" width="9" height="9" alt="Up">
            </button>
            <button type="button" class="btn-reorder-item btn-move-down" data-sidx="${sIdx}" data-widx="${wIdx}" title="Move weapon down">
              <img src="icons/arrowdown.svg" width="9" height="9" alt="Down">
            </button>
          </div>
          <div class="iic-title-group">
            <span class="iic-title" title="${w.name}">${w.name}</span>
          </div>
          <div class="iic-right-group">
            <span class="iic-details"><span class="iic-slots">${slots}<span class="iic-slots-word"> ${itemSlotWord}</span><span class="iic-slots-short">S</span></span> &bull; <b class="iic-hp">${damageHP} HP</b> &bull; <span class="iic-seeker">${seekerTag}</span></span>
            <button type="button" class="spec-inspect-btn small" data-inspect-type="weapon" data-inspect-id="${w.id}">SPECS</button>
            <button class="btn-dismount-item" data-sidx="${sIdx}" data-widx="${wIdx}" title="Dismount weapon">
              <img src="icons/close.svg" width="8" height="8" alt="Remove">
            </button>
          </div>
        </div>`;
    };

    let internalBayHtml = '';
    if (internalCapacity > 0) {
      const internalCards = internalItems.map(renderWeaponCard).join('');
      const emptyInternalCards = (remInternal > 0)
        ? `<div class="empty-internal-slot" data-sidx="${sIdx}" data-station="INTERNAL" title="Equip internal missile">+ [EMPTY INTERNAL BAY: ${remInternal} SLOTS OPEN &bull; ZERO DRAG &amp; ZERO EXTRA RCS]</div>`
        : '';

      internalBayHtml = `
        <div class="station-section internal-bay-group">
          <div class="station-header-row">
            <span class="station-title"><img src="icons/diamond.svg" width="10" height="10" alt="Internal" class="manual-inline-ico"> INTERNAL WEAPONS BAY: <b>${internalUsed} / ${internalCapacity} SLOTS</b></span>
            <span class="station-tag stealth-tag">VLO ZERO DRAG</span>
          </div>
          <div class="station-items-container">
            ${internalCards}
            ${emptyInternalCards}
          </div>
        </div>
      `;
    }

    const externalCards = externalItems.map(renderWeaponCard).join('');
    const addExternalBtn = (remExternal > 0)
      ? `<button type="button" class="slot-action-btn btn-add-external-slot" data-sidx="${sIdx}" data-station="EXTERNAL">+ ADD EXTERNAL WEAPONS (${remExternal} SLOTS REMAINING)</button>`
      : '';

    const externalPylonsHtml = `
      <div class="station-section external-pylons-group">
        <div class="station-header-row">
          <span class="station-title">EXTERNAL WING PYLONS: <b>${externalUsed} / ${externalCapacity} SLOTS</b></span>
          <span class="station-tag external-tag">STANDARD PYLONS</span>
        </div>
        <div class="station-items-container">
          ${externalCards || (remExternal === externalCapacity ? `<div class="empty-bay-indicator" data-sidx="${sIdx}" data-station="EXTERNAL">NO EXTERNAL PYLONS EQUIPPED (${externalCapacity} SLOTS OPEN)</div>` : '')}
          ${addExternalBtn}
        </div>
      </div>
    `;

    let centerlineHtml = '';
    if (centerlineItems.length > 0 || (metrics && metrics.hasCenterline)) {
      const centerlineCards = centerlineItems.map(renderWeaponCard).join('');
      centerlineHtml = `
        <div class="station-section centerline-station-group">
          <div class="station-header-row">
            <span class="station-title" style="color:#f59e0b;">CENTERLINE FUSELAGE STATION: <b>${centerlineUsed} / ${centerlineCapacity} SLOTS</b></span>
            <span class="station-tag centerline-tag">HEAVY HYPERSONIC</span>
          </div>
          <div class="station-items-container">
            ${centerlineCards || `<div class="empty-bay-indicator" data-sidx="${sIdx}" data-station="CENTERLINE">EMPTY CENTERLINE STATION (${centerlineCapacity} SLOTS)</div>`}
          </div>
        </div>
      `;
    }

    return `
      <div class="stores-stations-wrapper">
        ${internalBayHtml}
        ${externalPylonsHtml}
        ${centerlineHtml}
      </div>
    `;
  }
}

window.RosterStationsRenderer = RosterStationsRenderer;