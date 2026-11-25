/**
 * js/ui/procurement/dialogs/conflict.js - Side-by-Side Duplicate Preset Comparison & Resolution Modal.
 */

class PresetConflictModal {
  static escapeHtml(str) {
    return String(str === undefined || str === null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  static weaponToken(wEntry) {
    if (typeof wEntry === 'string') return wEntry;
    if (wEntry && typeof wEntry === 'object') {
      const id = wEntry.id || wEntry.specId || '';
      return wEntry.station ? `${id}@${wEntry.station}` : id;
    }
    return '';
  }

  static weaponDisplay(wEntry, wpnsMap) {
    const id = (typeof wEntry === 'object' && wEntry !== null) ? (wEntry.id || wEntry.specId) : wEntry;
    const w = wpnsMap[id];
    const label = w ? w.name : id;
    const st = (typeof wEntry === 'object' && wEntry !== null && wEntry.station) ? ` [${wEntry.station.slice(0, 3)}]` : '';
    return `${label}${st}`;
  }

  static diffMultiset(listA, listB, tokenFn) {
    const countB = new Map();
    listB.forEach(item => {
      const k = tokenFn(item);
      countB.set(k, (countB.get(k) || 0) + 1);
    });
    const markA = listA.map(item => {
      const k = tokenFn(item);
      const rem = countB.get(k) || 0;
      if (rem > 0) { countB.set(k, rem - 1); return { item, state: 'same' }; }
      return { item, state: 'only-a' };
    });

    const countA = new Map();
    listA.forEach(item => {
      const k = tokenFn(item);
      countA.set(k, (countA.get(k) || 0) + 1);
    });
    const markB = listB.map(item => {
      const k = tokenFn(item);
      const rem = countA.get(k) || 0;
      if (rem > 0) { countA.set(k, rem - 1); return { item, state: 'same' }; }
      return { item, state: 'only-b' };
    });

    return { markA, markB };
  }

  static computeAircraftCost(tpl) {
    const acMap = window.AIRCRAFT_CATALOG || {};
    const wpnsMap = window.WEAPONS_CATALOG || {};
    const upgMap = window.UPGRADES_CATALOG || {};
    const spec = acMap[tpl.specId];
    if (!spec) return 0;
    if (typeof LoadoutMetrics !== 'undefined') {
      return LoadoutMetrics.calculate(spec, tpl.weapons || [], tpl.upgrades || [], tpl.chosenGunId, Boolean(tpl.isLead)).totalCost;
    }
    return Number(spec.cost || 0)
      + (tpl.weapons || []).reduce((s, w) => s + ((wpnsMap[(w && w.id) || w] || {}).cost || 0), 0)
      + (tpl.upgrades || []).reduce((s, u) => s + ((upgMap[u] || {}).cost || 0), 0);
  }

  static renderAircraftSide(side, otherSide, isIncoming) {
    const acMap = window.AIRCRAFT_CATALOG || {};
    const gunsMap = window.AUTOCANNONS_CATALOG || {};
    const wpnsMap = window.WEAPONS_CATALOG || {};
    const upgMap = window.UPGRADES_CATALOG || {};

    const a = side.data;
    const b = otherSide.data;
    const specA = acMap[a.specId] || {};
    const gunIdA = a.chosenGunId || specA.builtInGun || '';
    const gunIdB = b.chosenGunId || (acMap[b.specId] || {}).builtInGun || '';
    const gunNameA = (gunsMap[gunIdA] || {}).name || gunIdA || 'NONE';

    const nameDiff = side.name.trim().toLowerCase() !== otherSide.name.trim().toLowerCase();
    const specDiff = a.specId !== b.specId;
    const gunDiff = gunIdA !== gunIdB;
    const costA = this.computeAircraftCost(a);
    const costB = this.computeAircraftCost(b);
    const costDiff = Math.abs(costA - costB) > 0.05;

    const { markA: wpnsA, markB: wpnsB } = this.diffMultiset(a.weapons || [], b.weapons || [], w => this.weaponToken(w));
    const { markA: upgsA, markB: upgsB } = this.diffMultiset(a.upgrades || [], b.upgrades || [], u => String(u));
    const wMarks = isIncoming ? wpnsB : wpnsA;
    const uMarks = isIncoming ? upgsB : upgsA;
    const diffClass = isIncoming ? 'diff-new' : 'diff-old';

    const wHtml = wMarks.length > 0
      ? wMarks.map(m => `<span class="conflict-pill ${m.state === 'same' ? 'same' : diffClass}">${this.escapeHtml(this.weaponDisplay(m.item, wpnsMap))}</span>`).join('')
      : '<span class="conflict-empty">NONE</span>';
    const uHtml = uMarks.length > 0
      ? uMarks.map(m => {
          const uObj = upgMap[m.item];
          return `<span class="conflict-pill ${m.state === 'same' ? 'same' : diffClass}">${this.escapeHtml(uObj ? uObj.name : m.item)}</span>`;
        }).join('')
      : '<span class="conflict-empty">NONE</span>';

    const badge = side.source === 'BUILTIN'
      ? '<span class="sq-preset-badge builtin">BUILTIN</span>'
      : (isIncoming ? '<span class="conflict-badge-new">INCOMING</span>' : '<span class="sq-preset-badge user">EXISTING</span>');

    return `
      <div class="conflict-col ${isIncoming ? 'incoming' : 'existing'}">
        <div class="conflict-col-head">
          ${badge}
          <span class="conflict-col-cost ${costDiff ? 'is-diff' : ''}">$${costA.toFixed(1)}M</span>
        </div>
        <div class="conflict-field ${nameDiff ? diffClass : ''}">
          <span class="cf-label">NAME</span>
          <b class="cf-val">${this.escapeHtml(side.name)}</b>
        </div>
        <div class="conflict-field ${specDiff ? diffClass : ''}">
          <span class="cf-label">AIRFRAME</span>
          <b class="cf-val">${this.escapeHtml(specA.name || a.specId)}</b>
        </div>
        <div class="conflict-field ${gunDiff ? diffClass : ''}">
          <span class="cf-label">AUTOCANNON</span>
          <b class="cf-val">${this.escapeHtml(gunNameA)}</b>
        </div>
        <div class="conflict-section">
          <span class="cf-label">WEAPONS (${(a.weapons || []).length})</span>
          <div class="conflict-pills">${wHtml}</div>
        </div>
        <div class="conflict-section">
          <span class="cf-label">SYSTEMS (${(a.upgrades || []).length})</span>
          <div class="conflict-pills">${uHtml}</div>
        </div>
      </div>`;
  }

  static renderSquadronUnitDiff(unit, peer, wpnsMap, gunsMap, acMap, isIncoming) {
    const diffClass = isIncoming ? 'diff-new' : 'diff-old';
    if (!unit) {
      return `<div class="conflict-unit-card missing"><span>NOT PRESENT</span></div>`;
    }
    const spec = acMap[unit.specId] || {};
    const gunId = unit.chosenGunId || spec.builtInGun || '';
    const gunName = (gunsMap[gunId] || {}).name || gunId;
    const isDifferentWhole = !peer;
    const specDiff = isDifferentWhole || unit.specId !== peer.specId;
    const gunDiff = isDifferentWhole || gunId !== (peer.chosenGunId || (acMap[peer.specId] || {}).builtInGun || '');
    const leadDiff = isDifferentWhole || Boolean(unit.isLead) !== Boolean(peer.isLead);

    const peerWpns = peer ? (peer.weapons || []) : [];
    const peerUpgs = peer ? (peer.upgrades || []) : [];
    const { markA: wA, markB: wB } = isIncoming
      ? this.diffMultiset(peerWpns, unit.weapons || [], w => this.weaponToken(w))
      : this.diffMultiset(unit.weapons || [], peerWpns, w => this.weaponToken(w));
    const wMarks = isIncoming ? wB : wA;

    const { markA: uA, markB: uB } = isIncoming
      ? this.diffMultiset(peerUpgs, unit.upgrades || [], u => String(u))
      : this.diffMultiset(unit.upgrades || [], peerUpgs, u => String(u));
    const uMarks = isIncoming ? uB : uA;

    const wHtml = wMarks.length > 0
      ? wMarks.map(m => `<span class="conflict-pill ${m.state === 'same' ? 'same' : diffClass}">${this.escapeHtml(this.weaponDisplay(m.item, wpnsMap))}</span>`).join('')
      : '<span class="conflict-empty">NO WEAPONS</span>';
    const uHtml = uMarks.map(m => `<span class="conflict-pill ${m.state === 'same' ? 'same' : diffClass}">${this.escapeHtml(m.item)}</span>`).join('');

    return `
      <div class="conflict-unit-card ${isDifferentWhole ? diffClass : ''}">
        <div class="conflict-unit-top">
          <b class="${specDiff ? diffClass + '-text' : ''}">${this.escapeHtml(spec.name || unit.specId)}</b>
          ${unit.isLead ? `<span class="sq-mini-lead ${leadDiff ? diffClass : ''}">LEAD</span>` : ''}
          <span class="conflict-unit-gun ${gunDiff ? diffClass + '-text' : ''}">${this.escapeHtml(gunName)}</span>
        </div>
        <div class="conflict-pills">${wHtml}${uHtml}</div>
      </div>`;
  }

  static renderSquadronSide(side, otherSide, isIncoming) {
    const acMap = window.AIRCRAFT_CATALOG || {};
    const gunsMap = window.AUTOCANNONS_CATALOG || {};
    const wpnsMap = window.WEAPONS_CATALOG || {};
    const unitsA = side.data || [];
    const unitsB = otherSide.data || [];
    const totalA = unitsA.reduce((s, u) => s + this.computeAircraftCost(u), 0);
    const totalB = unitsB.reduce((s, u) => s + this.computeAircraftCost(u), 0);

    const nameDiff = side.name.trim().toLowerCase() !== otherSide.name.trim().toLowerCase();
    const countDiff = unitsA.length !== unitsB.length;
    const costDiff = Math.abs(totalA - totalB) > 0.05;
    const diffClass = isIncoming ? 'diff-new' : 'diff-old';

    const maxLen = Math.max(unitsA.length, unitsB.length);
    const rows = [];
    for (let i = 0; i < maxLen; i++) {
      rows.push(this.renderSquadronUnitDiff(unitsA[i] || null, unitsB[i] || null, wpnsMap, gunsMap, acMap, isIncoming));
    }

    const badge = side.source === 'BUILTIN'
      ? '<span class="sq-preset-badge builtin">BUILTIN</span>'
      : (isIncoming ? '<span class="conflict-badge-new">INCOMING</span>' : '<span class="sq-preset-badge user">EXISTING</span>');

    return `
      <div class="conflict-col ${isIncoming ? 'incoming' : 'existing'}">
        <div class="conflict-col-head">
          ${badge}
          <span class="conflict-col-cost ${costDiff ? 'is-diff' : ''}">${unitsA.length} AIRCRAFT &bull; $${totalA.toFixed(1)}M</span>
        </div>
        <div class="conflict-field ${nameDiff ? diffClass : ''}">
          <span class="cf-label">SQUADRON NAME</span>
          <b class="cf-val">${this.escapeHtml(side.name)}</b>
        </div>
        <div class="conflict-field ${countDiff ? diffClass : ''}">
          <span class="cf-label">ROSTER SLOTS</span>
          <b class="cf-val">${unitsA.length} UNIT${unitsA.length === 1 ? '' : 'S'}</b>
        </div>
        <div class="conflict-unit-list">${rows.join('')}</div>
      </div>`;
  }

  static prompt(conflict) {
    if (window.ModalDialogTemplates && typeof window.ModalDialogTemplates.ensure === 'function') {
      window.ModalDialogTemplates.ensure('preset-conflict-modal');
    }
    const modal = document.getElementById('preset-conflict-modal');
    if (!modal) throw new Error('preset-conflict-modal failed to initialize.');

    const titleEl = document.getElementById('preset-conflict-title');
    const summaryEl = document.getElementById('preset-conflict-summary');
    const bodyEl = document.getElementById('preset-conflict-grid');
    const keepExistingBtn = document.getElementById('btn-conflict-keep-existing');
    const keepNewBtn = document.getElementById('btn-conflict-keep-new');
    const cancelBtn = document.getElementById('btn-conflict-cancel');
    const closeBtn = document.getElementById('btn-close-preset-conflict');

    const reasonLabel = conflict.reason === 'NAME_AND_CONFIG'
      ? 'EXACT DUPLICATE (SAME NAME & CONFIGURATION)'
      : (conflict.reason === 'NAME' ? 'DUPLICATE PRESET NAME' : 'IDENTICAL CONFIGURATION UNDER DIFFERENT NAME');

    if (titleEl) {
      titleEl.textContent = conflict.kind === 'squadron' ? 'DUPLICATE SQUADRON PRESET' : 'DUPLICATE AIRCRAFT PRESET';
    }
    if (summaryEl) {
      const lockNote = conflict.existing.source === 'BUILTIN'
        ? ' Built-in presets are permanent and cannot be overwritten.'
        : (conflict.secondaryNote ? ` ${conflict.secondaryNote}` : ' Choose which preset to keep.');
      summaryEl.innerHTML = `<span class="conflict-reason-pill">${reasonLabel}</span><span class="conflict-legend"><span class="legend-old">ONLY IN EXISTING</span><span class="legend-new">ONLY IN NEW</span></span><span class="conflict-note">${this.escapeHtml(lockNote)}</span>`;
    }

    if (bodyEl) {
      if (conflict.kind === 'squadron') {
        bodyEl.innerHTML = this.renderSquadronSide(conflict.existing, conflict.incoming, false)
          + this.renderSquadronSide(conflict.incoming, conflict.existing, true);
      } else {
        bodyEl.innerHTML = this.renderAircraftSide(conflict.existing, conflict.incoming, false)
          + this.renderAircraftSide(conflict.incoming, conflict.existing, true);
      }
    }

    const canReplace = (conflict.existing.source !== 'BUILTIN') && !conflict.blockReplace;
    if (keepExistingBtn) {
      keepExistingBtn.textContent = conflict.existing.source === 'BUILTIN' ? 'KEEP BUILTIN (SKIP)' : 'KEEP EXISTING';
    }
    if (keepNewBtn) {
      keepNewBtn.style.display = canReplace ? '' : 'none';
      keepNewBtn.textContent = conflict.reason === 'CONFIG' ? 'KEEP NEW (REPLACE EXISTING)' : 'KEEP NEW';
    }

    modal.classList.add('active');

    return new Promise((resolve) => {
      const finish = (choice) => {
        modal.classList.remove('active');
        resolve(choice);
      };
      if (keepExistingBtn) keepExistingBtn.onclick = () => finish('existing');
      if (keepNewBtn) keepNewBtn.onclick = () => finish('incoming');
      if (cancelBtn) cancelBtn.onclick = () => finish('cancel');
      if (closeBtn) closeBtn.onclick = () => finish('cancel');
      modal.onclick = (e) => { if (e.target === modal) finish('cancel'); };
    });
  }
}

window.PresetConflictModal = PresetConflictModal;
