/**
 * AIRSPACE STANDOFF: Radar Tactical Sub-Renderer: Locks, Trajectories & Volleys
 */

class RadarCombatRenderer {
  static _salvoGroupMap = new Map();
  static _salvoActiveGroups = [];
  static _visibleMissilesPool = [];
  static _clusterPool = [];

  static drawSurface(...args) {
    if (typeof RadarSurfaceRenderer !== 'undefined') RadarSurfaceRenderer.drawSurface(...args);
  }

  static drawCivilianTraffic(...args) {
    if (typeof RadarSurfaceRenderer !== 'undefined') RadarSurfaceRenderer.drawCivilianTraffic(...args);
  }

  static drawRadarLocks(ctx, cam, craftA, craftB, activeUnit, team, detectedSet) {
    let listA = craftA, listB = null, active = activeUnit, commanderTeam = team, detSet = detectedSet;
    if (Array.isArray(craftB)) listB = craftB;
    else { active = craftB; commanderTeam = activeUnit; detSet = team; }

    ctx.save();
    ctx.lineWidth = 1.3;
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

      const p1x = cam.toScreenX ? cam.toScreenX(source.x) : cam.toScreen(source.x, source.y).x;
      const p1y = cam.toScreenY ? cam.toScreenY(source.y) : cam.toScreen(source.x, source.y).y;
      const p2x = cam.toScreenX ? cam.toScreenX(tgt.x) : cam.toScreen(tgt.x, tgt.y).x;
      const p2y = cam.toScreenY ? cam.toScreenY(tgt.y) : cam.toScreen(tgt.x, tgt.y).y;

      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.strokeStyle = (activeUnit && activeUnit.id === source.id)
        ? '#00f0ff'
        : (source.team !== team && tgt.team === team ? '#ef4444' : 'rgba(0, 240, 255, 0.40)');
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
    ctx.lineWidth = 1.2;

    for (let g = 0; g < activeGroups.length; g++) {
      const group = activeGroups[g];
      const tgt = group.target;
      const tx = cam.toScreenX ? cam.toScreenX(tgt.x) : cam.toScreen(tgt.x, tgt.y).x;
      const ty = cam.toScreenY ? cam.toScreenY(tgt.y) : cam.toScreen(tgt.x, tgt.y).y;
      let friendlyCount = 0, enemyCount = 0;
      let friendlyLostGuid = 0, enemyLostGuid = 0;
      let farthestOwnMsl = null, farthestOwnDist = -1;

      for (let mIdx = 0; mIdx < group.missiles.length; mIdx++) {
        const m = group.missiles[mIdx];
        const isOwn = (m.team === team);
        if (!isOwn && m.isPassiveRadar && m.distanceToTarget > (m.pathRevealDistance || 20.0)) continue;
        if (!isOwn && detectedSet && !detectedSet.has(m.id)) continue;

        const pMx = cam.toScreenX ? cam.toScreenX(m.x) : cam.toScreen(m.x, m.y).x;
        const pMy = cam.toScreenY ? cam.toScreenY(m.y) : cam.toScreen(m.x, m.y).y;

        ctx.beginPath();
        ctx.moveTo(pMx, pMy);
        ctx.lineTo(tx, ty);
        if (m.guidanceMode === 'COAST_INERTIAL') {
          ctx.strokeStyle = isOwn ? 'rgba(245, 158, 11, 0.48)' : 'rgba(251, 146, 60, 0.42)';
          ctx.setLineDash([2, 5]);
        } else if (m.guidanceMode === 'ACTIVE_SEEKER') {
          ctx.strokeStyle = isOwn ? 'rgba(0, 245, 160, 0.68)' : 'rgba(251, 113, 133, 0.68)';
          ctx.setLineDash([4, 2]);
        } else {
          ctx.strokeStyle = isOwn ? '#38bdf8' : '#fb7185';
          ctx.setLineDash(isOwn ? [3, 3] : [2, 4]);
        }
        ctx.stroke();

        if (isOwn) {
          friendlyCount++;
          if (m.guidanceMode === 'COAST_INERTIAL') friendlyLostGuid++;
          const w = m.weapon || {};
          const seekerKm = m.effectiveSeekerRangeKm || m.seekerRangeKm || 0;
          if (seekerKm > 0 && w.seeker !== 'GPS_INS' && w.seeker !== 'UNGUIDED') {
            const dKm = Math.hypot(tgt.x - m.x, tgt.y - m.y);
            if (dKm > farthestOwnDist) {
              farthestOwnDist = dKm;
              farthestOwnMsl = m;
            }
          }
        } else {
          enemyCount++;
          if (m.guidanceMode === 'COAST_INERTIAL') enemyLostGuid++;
        }
      }

      if (farthestOwnMsl && farthestOwnDist > 0.2) {
        const seekerKm = farthestOwnMsl.effectiveSeekerRangeKm || farthestOwnMsl.seekerRangeKm || 0;
        const ux = (tgt.x - farthestOwnMsl.x) / farthestOwnDist;
        const uy = (tgt.y - farthestOwnMsl.y) / farthestOwnDist;
        const reachKm = Math.min(farthestOwnDist, seekerKm);
        const sxKm = farthestOwnMsl.x + ux * reachKm;
        const syKm = farthestOwnMsl.y + uy * reachKm;
        const pMx = cam.toScreenX ? cam.toScreenX(farthestOwnMsl.x) : cam.toScreen(farthestOwnMsl.x, farthestOwnMsl.y).x;
        const pMy = cam.toScreenY ? cam.toScreenY(farthestOwnMsl.y) : cam.toScreen(farthestOwnMsl.x, farthestOwnMsl.y).y;
        const pSx = cam.toScreenX ? cam.toScreenX(sxKm) : cam.toScreen(sxKm, syKm).x;
        const pSy = cam.toScreenY ? cam.toScreenY(syKm) : cam.toScreen(sxKm, syKm).y;

        ctx.save();
        ctx.setLineDash([]);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = farthestOwnMsl.hasOwnSeekerLock
          ? 'rgba(0, 245, 160, 0.50)'
          : (farthestOwnMsl.guidanceMode === 'COAST_INERTIAL' ? 'rgba(245, 158, 11, 0.42)' : 'rgba(0, 240, 255, 0.34)');
        ctx.beginPath();
        ctx.moveTo(pMx, pMy);
        ctx.lineTo(pSx, pSy);
        ctx.stroke();

        const scrLen = Math.hypot(pSx - pMx, pSy - pMy);
        if (scrLen > 4.0) {
          const nx = -(pSy - pMy) / scrLen;
          const ny = (pSx - pMx) / scrLen;
          ctx.beginPath();
          ctx.moveTo(pSx - nx * 3.5, pSy - ny * 3.5);
          ctx.lineTo(pSx + nx * 3.5, pSy + ny * 3.5);
          ctx.stroke();
        }
        ctx.restore();
      }

      if (friendlyCount > 1 || enemyCount > 1 || friendlyLostGuid > 0 || enemyLostGuid > 0) {
        ctx.font = '700 10.5px "JetBrains Mono", ui-monospace, monospace';
        if (friendlyCount > 1) {
          if (friendlyLostGuid === friendlyCount) {
            ctx.fillStyle = '#f59e0b';
            ctx.fillText(`SALVO x${friendlyCount} [NO GUIDANCE]`, tx - 38, ty - 15);
          } else if (friendlyLostGuid > 0) {
            ctx.fillStyle = '#fbbf24';
            ctx.fillText(`SALVO x${friendlyCount} [${friendlyLostGuid} NO GUID]`, tx - 38, ty - 15);
          } else {
            ctx.fillStyle = '#38bdf8';
            ctx.fillText('SALVO x' + friendlyCount, tx - 24, ty - 15);
          }
        } else if (friendlyCount === 1 && friendlyLostGuid === 1) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('NO GUIDANCE', tx - 28, ty - 15);
        }
        if (enemyCount > 1) {
          const yOff = (friendlyCount > 0) ? 24 : -15;
          if (enemyLostGuid === enemyCount) {
            ctx.fillStyle = '#fb923c';
            ctx.fillText(`INBOUND x${enemyCount} [NO GUIDANCE]`, tx - 38, ty + yOff);
          } else if (enemyLostGuid > 0) {
            ctx.fillStyle = '#fb923c';
            ctx.fillText(`INBOUND x${enemyCount} [${enemyLostGuid} NO GUID]`, tx - 38, ty + yOff);
          } else {
            ctx.fillStyle = '#fb7185';
            ctx.fillText('INBOUND x' + enemyCount, tx - 24, ty + yOff);
          }
        } else if (enemyCount === 1 && enemyLostGuid === 1) {
          ctx.fillStyle = '#fb923c';
          ctx.fillText('INBOUND [NO GUID]', tx - 32, ty + (friendlyCount > 0 ? 24 : -15));
        }
      }
      group.missiles.length = 0;
    }
    ctx.restore();
  }

  static drawMissiles(ctx, cam, missiles, team, detectedSet, declutterMode) {
    if (!missiles || missiles.length === 0) return;
    const visPool = this._visibleMissilesPool;
    let visibleCount = 0;

    for (let i = 0; i < missiles.length; i++) {
      const m = missiles[i];
      if (!m || m.isDead || typeof m.x !== 'number') continue;
      const isOwn = (m.team === team);
      if (!isOwn && m.isPassiveRadar && m.age < (m.launchStealthDuration || 3.2) && m.distanceToTarget > (m.pathRevealDistance || 20.0)) continue;
      if (!isOwn && detectedSet && !detectedSet.has(m.id)) continue;

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

      const isLostTrack = (m.state === 'LOST_TRACK');
      const isInertialCoast = (!isLostTrack && m.guidanceMode === 'COAST_INERTIAL');

      if (m.trail && m.trail.length > 1) {
        ctx.save();
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = isLostTrack
          ? 'rgba(148, 163, 184, 0.35)'
          : (isInertialCoast ? 'rgba(245, 158, 11, 0.50)' : (m.team === 'friendly' ? 'rgba(56, 189, 248, 0.65)' : 'rgba(251, 113, 133, 0.65)'));
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

      const isPowered = !isLostTrack && (m.stage === 'BOOST' || m.stage === 'PULSE 2' || m.stage === 'RAMJET' || m.stage === 'SUSTAIN' || m.stage === 'DIVE');

      ctx.save();
      ctx.translate(px, py);
      if (isLostTrack) ctx.globalAlpha = 0.62;
      ctx.rotate(m.heading || 0);

      if (isPowered) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(-5.6, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(-5.2, 0, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      const mColor = isLostTrack ? '#64748b' : (isInertialCoast ? '#f59e0b' : (m.team === 'friendly' ? '#38bdf8' : '#fb7185'));
      ctx.fillStyle = mColor;
      ctx.strokeStyle = isLostTrack ? '#f97316' : '#ffffff';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(7.2, 0);
      ctx.lineTo(1.6, -2.4);
      ctx.lineTo(-4.8, -2.4);
      ctx.lineTo(-5.6, 0);
      ctx.lineTo(-4.8, 2.4);
      ctx.lineTo(1.6, 2.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      if (isInertialCoast) {
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.78)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(px, py, 8.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (isLostTrack) {
        ctx.save();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(px - 5, py - 5); ctx.lineTo(px + 5, py + 5);
        ctx.moveTo(px + 5, py - 5); ctx.lineTo(px - 5, py + 5);
        ctx.stroke();
        ctx.restore();
      }
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
        const guidStatus = (m.state === 'LOST_TRACK') ? 'LOST' : (m.guidanceMode === 'COAST_INERTIAL' ? 'INERTIAL' : 'GUIDED');

        let cluster = null;
        for (let c = 0; c < clusterCount; c++) {
          const cand = clPool[c];
          if (cand.sourceId === sourceId && cand.weaponId === weaponId && cand.isBlue === isBlue && cand.isIdentified === isIdentified && cand.guidStatus === guidStatus) {
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
            cl = { sourceId: '', weaponId: '', weaponName: '', isBlue: false, isIdentified: false, guidStatus: 'GUIDED', count: 0, minDist: 0, speed: 0, stage: '', px: 0, py: 0 };
            clPool[clusterCount] = cl;
          }
          cl.sourceId = sourceId; cl.weaponId = weaponId;
          cl.weaponName = (m.weapon && (m.weapon.id || m.weapon.name)) ? (m.weapon.id || m.weapon.name) : 'MSL';
          cl.isBlue = isBlue; cl.isIdentified = isIdentified; cl.guidStatus = guidStatus;
          cl.count = 1; cl.minDist = distVal; cl.speed = mSpeed; cl.stage = mStage; cl.px = px; cl.py = py;
          clusterCount++;
        }
      }

      ctx.save();
      for (let c = 0; c < clusterCount; c++) {
        const cl = clPool[c];
        const countTag = cl.count > 1 ? ` x${cl.count}` : '';
        const baseName = cl.isIdentified ? RadarRenderer.cleanText(cl.weaponName) : 'RADAR TRACK [?]';
        const statusSuffix = cl.guidStatus === 'LOST' ? ' [LOST]' : (cl.guidStatus === 'INERTIAL' ? ' [NO GUID]' : '');
        const distTag = declutterMode ? '' : ` [${cl.minDist}km]`;
        const speedTag = cl.guidStatus === 'LOST'
          ? 'NO GUIDANCE'
          : (cl.guidStatus === 'INERTIAL' ? `M ${cl.speed.toFixed(1)} [INERTIAL]` : `M ${cl.speed.toFixed(1)} [${cl.stage}]`);

        ctx.font = '700 10.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = cl.guidStatus === 'LOST'
          ? '#94a3b8'
          : (cl.guidStatus === 'INERTIAL' ? '#fbbf24' : (cl.isBlue ? '#38bdf8' : (cl.isIdentified ? '#fb7185' : '#f97316')));
        ctx.fillText(RadarRenderer.cleanText(`${baseName}${countTag}${statusSuffix}`), cl.px + 9, cl.py - 5);

        ctx.font = '600 9.5px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = cl.guidStatus === 'LOST'
          ? '#f97316'
          : (cl.guidStatus === 'INERTIAL' ? '#fde68a' : (cl.isBlue ? '#7dd3fc' : (cl.isIdentified ? '#fca5a5' : '#fed7aa')));
        ctx.fillText(RadarRenderer.cleanText(`${speedTag}${cl.guidStatus === 'LOST' ? '' : distTag}`), cl.px + 9, cl.py + 7);
      }
      ctx.restore();

      for (let i = 0; i < visibleCount; i++) visPool[i].m = null;
    }
  }

  static drawHoverReticle(ctx, cam, contact) {
    if (!contact || typeof contact.x !== 'number') return;
    const px = cam.toScreenX ? cam.toScreenX(contact.x) : cam.toScreen(contact.x, contact.y).x;
    const py = cam.toScreenY ? cam.toScreenY(contact.y) : cam.toScreen(contact.x, contact.y).y;
    ctx.save();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(px, py, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  static drawTargetReticle(ctx, cam, target) {
    if (!target || typeof target.x !== 'number') return;
    const px = cam.toScreenX ? cam.toScreenX(target.x) : cam.toScreen(target.x, target.y).x;
    const py = cam.toScreenY ? cam.toScreenY(target.y) : cam.toScreen(target.x, target.y).y;
    const commanderTeam = (window.Game && window.Game.currentPvpCommander) || 'friendly';
    const trackState = (target.team === commanderTeam) ? 'TRACKED' : (typeof target.getTrackState === 'function' ? target.getTrackState(commanderTeam) : ((typeof target.isIdentifiedBy === 'function' ? target.isIdentifiedBy(commanderTeam) : target.isIdentified) ? 'TRACKED' : 'BOGEY'));
    const isKnown = (trackState === 'TRACKED' || trackState === 'DECAYING');
    const isStale = (trackState === 'STALE');
    const isHostile = target.team === 'hostile';
    const isAce = Boolean(target.isAce);

    ctx.save();
    let reticleColor = isStale ? '#fb7185' : '#f97316';
    if (isKnown) {
      if (isAce) reticleColor = '#ffd700';
      else if (isHostile) reticleColor = '#ef4444';
      else if (target.isCivilian) reticleColor = '#38bdf8';
      else reticleColor = '#00f0ff';
    }
    ctx.strokeStyle = reticleColor;
    ctx.lineWidth = 2.0;
    const s = 13;
    ctx.beginPath();
    ctx.moveTo(px - s, py - s + 4); ctx.lineTo(px - s, py - s); ctx.lineTo(px - s + 4, py - s);
    ctx.moveTo(px + s - 4, py - s); ctx.lineTo(px + s, py - s); ctx.lineTo(px + s, py - s + 4);
    ctx.moveTo(px + s, py + s - 4); ctx.lineTo(px + s, py + s); ctx.lineTo(px - s + 4, py + s);
    ctx.moveTo(px - s + 4, py + s); ctx.lineTo(px - s, py + s); ctx.lineTo(px - s, py + s - 4);
    ctx.stroke();
    ctx.restore();
  }
}

window.RadarCombatRenderer = RadarCombatRenderer;
