/**
 * AIRSPACE STANDOFF: Radar Tactical Sub-Renderer: Locks, Trajectories & Volleys
 */

class RadarTacticalRenderer {
  static _salvoGroupMap = new Map();
  static _salvoActiveGroups = [];
  static _visibleMissilesPool = [];
  static _clusterPool = [];

  static drawSurface(...args) {
    if (typeof RadarTacticalSurfaceRenderer !== 'undefined') RadarTacticalSurfaceRenderer.drawSurface(...args);
  }

  static drawCivilianTraffic(...args) {
    if (typeof RadarTacticalSurfaceRenderer !== 'undefined') RadarTacticalSurfaceRenderer.drawCivilianTraffic(...args);
  }

  static drawRadarLocks(ctx, cam, craftA, craftB, activeUnit, team, detectedSet) {
    let listA = craftA, listB = null, active = activeUnit, commanderTeam = team, detSet = detectedSet;
    if (Array.isArray(craftB)) listB = craftB;
    else { active = craftB; commanderTeam = activeUnit; detSet = team; }

    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 4]);

    this.renderLocksForList(ctx, cam, listA, active, commanderTeam, detSet);
    if (listB) this.renderLocksForList(ctx, cam, listB, active, commanderTeam, detSet);

    ctx.restore();
  }

  static renderLocksForList(ctx, cam, list, activeUnit, team, detectedSet) {
    if (!list || list.length === 0) return;
    for (let i = 0; i < list.length; i++) {
      const source = list[i];
      if (!source || source.hp <= 0.05 || !source.radarLockedTarget || typeof source.x !== 'number') continue;
      const tgt = source.radarLockedTarget;
      if (!tgt || tgt.hp <= 0.05 || typeof tgt.x !== 'number') continue;
      if (source.team !== team && detectedSet && !detectedSet.has(source.id)) continue;

      const p1x = Math.round(cam.toScreenX ? cam.toScreenX(source.x) : cam.toScreen(source.x, source.y).x);
      const p1y = Math.round(cam.toScreenY ? cam.toScreenY(source.y) : cam.toScreen(source.x, source.y).y);
      const p2x = Math.round(cam.toScreenX ? cam.toScreenX(tgt.x) : cam.toScreen(tgt.x, tgt.y).x);
      const p2y = Math.round(cam.toScreenY ? cam.toScreenY(tgt.y) : cam.toScreen(tgt.x, tgt.y).y);

      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.strokeStyle = (activeUnit && activeUnit.id === source.id)
        ? '#00f0ff'
        : (source.team !== team && tgt.team === team ? '#ef4444' : 'rgba(0, 240, 255, 0.35)');
      ctx.stroke();
    }
  }

  static drawSalvoCoordinations(ctx, cam, missiles, commanderTeam) {
    if (!missiles || missiles.length === 0) return;
    const team = commanderTeam || (window.Game && window.Game.currentPvpCommander) || 'friendly';
    const groupMap = this._salvoGroupMap;
    const activeGroups = this._salvoActiveGroups;
    activeGroups.length = 0;

    for (let i = 0; i < missiles.length; i++) {
      const m = missiles[i];
      if (!m || !m.active || !m.target || m.target.hp <= 0.05 || typeof m.target.x !== 'number') continue;
      let group = groupMap.get(m.target.id);
      if (!group) {
        group = { target: m.target, missiles: [] };
        groupMap.set(m.target.id, group);
      }
      if (group.missiles.length === 0) activeGroups.push(group);
      group.missiles.push(m);
    }

    if (activeGroups.length === 0) return;
    const detectedSet = (window.Game && team === 'friendly') ? window.Game.detectedByBlue : (window.Game ? window.Game.detectedByRed : null);

    ctx.save();
    ctx.lineWidth = 1.0;

    for (let g = 0; g < activeGroups.length; g++) {
      const group = activeGroups[g];
      const tgt = group.target;
      const tx = Math.round(cam.toScreenX ? cam.toScreenX(tgt.x) : cam.toScreen(tgt.x, tgt.y).x);
      const ty = Math.round(cam.toScreenY ? cam.toScreenY(tgt.y) : cam.toScreen(tgt.x, tgt.y).y);
      let friendlyCount = 0, enemyCount = 0;

      for (let mIdx = 0; mIdx < group.missiles.length; mIdx++) {
        const m = group.missiles[mIdx];
        const isOwn = (m.team === team);
        if (!isOwn && m.isPassiveRadar && m.distanceToTarget > (m.pathRevealDistance || 20.0)) continue;
        if (!isOwn && detectedSet && !detectedSet.has(m.id)) continue;

        const pMx = Math.round(cam.toScreenX ? cam.toScreenX(m.x) : cam.toScreen(m.x, m.y).x);
        const pMy = Math.round(cam.toScreenY ? cam.toScreenY(m.y) : cam.toScreen(m.x, m.y).y);

        ctx.beginPath();
        ctx.moveTo(pMx, pMy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = isOwn ? '#00f0ff' : '#ef4444';
        ctx.setLineDash(isOwn ? [3, 3] : [2, 4]);
        ctx.stroke();

        if (isOwn) friendlyCount++; else enemyCount++;
      }

      if (friendlyCount > 1 || enemyCount > 1) {
        ctx.font = '700 10px monospace';
        if (friendlyCount > 1) { ctx.fillStyle = '#00f0ff'; ctx.fillText('SALVO x' + friendlyCount, tx - 22, ty - 14); }
        if (enemyCount > 1) { ctx.fillStyle = '#ef4444'; ctx.fillText('INBOUND x' + enemyCount, tx - 22, ty + (friendlyCount > 1 ? 22 : -14)); }
      }
      group.missiles.length = 0;
    }
    ctx.restore();
  }

  static drawMissiles(ctx, cam, missiles, team, detectedSet, declutterMode, cleanFn) {
    if (!missiles || missiles.length === 0) return;
    const visPool = this._visibleMissilesPool;
    let visibleCount = 0;

    for (let i = 0; i < missiles.length; i++) {
      const m = missiles[i];
      if (!m || m.isDead || typeof m.x !== 'number') continue;
      const isOwn = (m.team === team);
      if (!isOwn && m.isPassiveRadar && m.age < (m.launchStealthDuration || 3.2) && m.distanceToTarget > (m.pathRevealDistance || 20.0)) continue;
      if (!isOwn && !detectedSet.has(m.id)) continue;

      const px = Math.round(cam.toScreenX ? cam.toScreenX(m.x) : cam.toScreen(m.x, m.y).x);
      const py = Math.round(cam.toScreenY ? cam.toScreenY(m.y) : cam.toScreen(m.x, m.y).y);

      let visItem = visPool[visibleCount];
      if (!visItem) {
        visItem = { m: null, px: 0, py: 0 };
        visPool[visibleCount] = visItem;
      }
      visItem.m = m;
      visItem.px = px;
      visItem.py = py;
      visibleCount++;

      if (m.trail && m.trail.length > 1) {
        ctx.save();
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = m.team === 'friendly' ? 'rgba(0, 240, 255, 0.45)' : 'rgba(239, 68, 68, 0.45)';
        ctx.beginPath();
        for (let t = 0; t < m.trail.length; t++) {
          const pt = m.trail[t];
          const tpx = Math.round(cam.toScreenX ? cam.toScreenX(pt.x) : cam.toScreen(pt.x, pt.y).x);
          const tpy = Math.round(cam.toScreenY ? cam.toScreenY(pt.y) : cam.toScreen(pt.x, pt.y).y);
          if (t === 0) ctx.moveTo(tpx, tpy);
          else ctx.lineTo(tpx, tpy);
        }
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(m.heading || 0);
      ctx.fillStyle = m.team === 'friendly' ? '#00f0ff' : '#ef4444';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(8, 0); ctx.lineTo(2, -2.5); ctx.lineTo(-5, -2.5); ctx.lineTo(-6, 0); ctx.lineTo(-5, 2.5); ctx.lineTo(2, 2.5);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    if (visibleCount > 0) {
      const clPool = this._clusterPool;
      let clusterCount = 0;

      for (let i = 0; i < visibleCount; i++) {
        const item = visPool[i], m = item.m, px = item.px, py = item.py;
        const isBlue = (m.team === 'friendly');
        const isIdentified = isBlue || (typeof m.isIdentifiedBy === 'function' ? m.isIdentifiedBy(team) : m.isIdentified);
        const sourceId = (m.source && m.source.id) ? m.source.id : 'src';
        const weaponId = (m.weapon && m.weapon.id) ? m.weapon.id : 'MSL';
        const distVal = Math.round(m.distanceToTarget || 0);
        const mSpeed = m.speed || 2.4;
        const mStage = m.stage || 'BOOST';

        let cluster = null;
        for (let c = 0; c < clusterCount; c++) {
          const cand = clPool[c];
          if (cand.sourceId === sourceId && cand.weaponId === weaponId && cand.isBlue === isBlue && cand.isIdentified === isIdentified) {
            const dx = cand.px - px, dy = cand.py - py;
            if (dx * dx + dy * dy < 34 * 34) { cluster = cand; break; }
          }
        }

        if (cluster) {
          cluster.count++;
          if (distVal < cluster.minDist) cluster.minDist = distVal;
          if (mSpeed > cluster.speed) { cluster.speed = mSpeed; cluster.stage = mStage; }
        } else {
          let cl = clPool[clusterCount];
          if (!cl) {
            cl = { sourceId: '', weaponId: '', weaponName: '', isBlue: false, isIdentified: false, count: 0, minDist: 0, speed: 0, stage: '', px: 0, py: 0 };
            clPool[clusterCount] = cl;
          }
          cl.sourceId = sourceId; cl.weaponId = weaponId;
          cl.weaponName = (m.weapon && (m.weapon.id || m.weapon.name)) ? (m.weapon.id || m.weapon.name) : 'MSL';
          cl.isBlue = isBlue; cl.isIdentified = isIdentified; cl.count = 1; cl.minDist = distVal; cl.speed = mSpeed; cl.stage = mStage; cl.px = px; cl.py = py;
          clusterCount++;
        }
      }

      ctx.save();
      for (let c = 0; c < clusterCount; c++) {
        const cl = clPool[c];
        const countTag = cl.count > 1 ? ` x${cl.count}` : '';
        const mslLabel = cl.isIdentified ? cleanFn(cl.weaponName) : 'RADAR TRACK [?]';
        const distTag = declutterMode ? '' : ` [${cl.minDist}km]`;
        const speedTag = `M ${cl.speed.toFixed(1)} [${cl.stage}]`;

        ctx.font = '800 10px monospace';
        ctx.fillStyle = cl.isBlue ? '#00f0ff' : (cl.isIdentified ? '#ef4444' : '#f97316');
        ctx.fillText(cleanFn(`${mslLabel}${countTag}`), cl.px + 8, cl.py - 5);

        ctx.font = '700 9px monospace';
        ctx.fillStyle = cl.isBlue ? '#00f5a0' : (cl.isIdentified ? '#fca5a5' : '#fed7aa');
        ctx.fillText(cleanFn(`${speedTag}${distTag}`), cl.px + 8, cl.py + 6);
      }
      ctx.restore();

      for (let i = 0; i < visibleCount; i++) visPool[i].m = null;
    }
  }

  static drawHoverReticle(ctx, cam, contact) {
    if (!contact || typeof contact.x !== 'number') return;
    const px = Math.round(cam.toScreenX ? cam.toScreenX(contact.x) : cam.toScreen(contact.x, contact.y).x);
    const py = Math.round(cam.toScreenY ? cam.toScreenY(contact.y) : cam.toScreen(contact.x, contact.y).y);
    ctx.save();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(px, py, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  static drawTargetReticle(ctx, cam, target) {
    if (!target || typeof target.x !== 'number') return;
    const px = Math.round(cam.toScreenX ? cam.toScreenX(target.x) : cam.toScreen(target.x, target.y).x);
    const py = Math.round(cam.toScreenY ? cam.toScreenY(target.y) : cam.toScreen(target.x, target.y).y);
    const commanderTeam = (window.Game && window.Game.currentPvpCommander) || 'friendly';
    const isKnown = (target.team === commanderTeam) ||
      (typeof target.isIdentifiedBy === 'function' ? target.isIdentifiedBy(commanderTeam) : target.isIdentified);
    const isHostile = target.team === 'hostile';
    const isAce = Boolean(target.isAce);

    ctx.save();
    let reticleColor = '#f97316';
    if (isKnown) {
      if (isAce) reticleColor = '#ffd700';
      else if (isHostile) reticleColor = '#ef4444';
      else if (target.isCivilian) reticleColor = '#38bdf8';
      else reticleColor = '#00f0ff';
    }
    ctx.strokeStyle = reticleColor;
    ctx.lineWidth = 1.8;
    const s = 12;
    ctx.beginPath();
    ctx.moveTo(px - s, py - s + 4); ctx.lineTo(px - s, py - s); ctx.lineTo(px - s + 4, py - s);
    ctx.moveTo(px + s - 4, py - s); ctx.lineTo(px + s, py - s); ctx.lineTo(px + s, py - s + 4);
    ctx.moveTo(px + s, py + s - 4); ctx.lineTo(px + s, py + s); ctx.lineTo(px - s + 4, py + s);
    ctx.moveTo(px - s + 4, py + s); ctx.lineTo(px - s, py + s); ctx.lineTo(px - s, py + s - 4);
    ctx.stroke();
    ctx.restore();
  }
}

window.RadarTacticalRenderer = RadarTacticalRenderer;