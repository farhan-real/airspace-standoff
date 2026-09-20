/* AIRSPACE STANDOFF: Radar Tactical Sub-Renderer: Radar Locks & Missile Volleys */

class RadarTacticalRenderer {
  static drawSurface(...args) {
    if (typeof RadarTacticalSurfaceRenderer !== 'undefined') {
      RadarTacticalSurfaceRenderer.drawSurface(...args);
    }
  }

  static drawCivilianTraffic(...args) {
    if (typeof RadarTacticalSurfaceRenderer !== 'undefined') {
      RadarTacticalSurfaceRenderer.drawCivilianTraffic(...args);
    }
  }

  static drawRadarLocks(ctx, cam, allCraft, activeUnit, team, detectedSet) {
    for (const source of allCraft) {
      if (!source || source.hp <= 0 || !source.radarLockedTarget || typeof source.x !== 'number') continue;
      const tgt = source.radarLockedTarget;
      if (!tgt || tgt.hp <= 0 || typeof tgt.x !== 'number') continue;
      const p1 = cam.toScreen(source.x, source.y);
      const p2 = cam.toScreen(tgt.x, tgt.y);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(Math.round(p1.x), Math.round(p1.y));
      ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
      ctx.strokeStyle = (activeUnit && activeUnit.id === source.id) ? '#00f0ff' : (source.team !== team && tgt.team === team ? '#ef4444' : 'rgba(0, 240, 255, 0.35)');
      ctx.lineWidth = 1.4; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.restore();
    }
  }

  static drawSalvoCoordinations(ctx, cam, missiles) {
    const salvos = {};
    for (const m of missiles) {
      if (!m || !m.active || !m.target || m.target.hp <= 0 || typeof m.target.x !== 'number') continue;
      if (!salvos[m.target.id]) salvos[m.target.id] = [];
      salvos[m.target.id].push(m);
    }
    Object.keys(salvos).forEach(tid => {
      const group = salvos[tid];
      if (group.length > 1 && group[0].target) {
        const pT = cam.toScreen(group[0].target.x, group[0].target.y);
        const tx = Math.round(pT.x);
        const ty = Math.round(pT.y);
        ctx.save(); ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 1.0; ctx.setLineDash([2, 4]);
        for (const m of group) {
          if (typeof m.x === 'number') {
            const pM = cam.toScreen(m.x, m.y);
            ctx.beginPath(); ctx.moveTo(Math.round(pM.x), Math.round(pM.y)); ctx.lineTo(tx, ty); ctx.stroke();
          }
        }
        ctx.font = '700 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('SALVO x' + group.length, tx - 22, ty - 14);
        ctx.restore();
      }
    });
  }

  static drawMissiles(ctx, cam, missiles, team, detectedSet, declutterMode, cleanFn) {
    const isMobile = (cam.cssWidth < 800);
    ctx.save();
    if (!isMobile) { ctx.shadowColor = '#000000'; ctx.shadowBlur = 2; }

    const visibleMissiles = [];

    for (const m of missiles) {
      if (!m || m.isDead || typeof m.x !== 'number' || (m.team !== team && !detectedSet.has(m.id))) continue;
      const pos = cam.toScreen(m.x, m.y);
      const px = Math.round(pos.x);
      const py = Math.round(pos.y);
      visibleMissiles.push({ m: m, px: px, py: py });

      if (m.trail && m.trail.length > 1) {
        for (let t = 0; t < m.trail.length - 1; t++) {
          if (m.trail[t] && m.trail[t + 1]) {
            const p1 = cam.toScreen(m.trail[t].x, m.trail[t].y);
            const p2 = cam.toScreen(m.trail[t + 1].x, m.trail[t + 1].y);
            ctx.strokeStyle = m.team === 'friendly' ? ('rgba(0, 240, 255, ' + m.trail[t].alpha + ')') : ('rgba(239, 68, 68, ' + m.trail[t].alpha + ')');
            ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(Math.round(p1.x), Math.round(p1.y)); ctx.lineTo(Math.round(p2.x), Math.round(p2.y)); ctx.stroke();
          }
        }
      }

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(m.heading || 0);
      const isBlue = (m.team === 'friendly');
      ctx.fillStyle = isBlue ? '#00f0ff' : '#ef4444';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(8, 0); ctx.lineTo(2, -2.5); ctx.lineTo(-5, -2.5); ctx.lineTo(-6, 0); ctx.lineTo(-5, 2.5); ctx.lineTo(2, 2.5);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    if (visibleMissiles.length > 0) {
      const clusters = [];

      for (const item of visibleMissiles) {
        const m = item.m;
        const px = item.px;
        const py = item.py;
        const isBlue = (m.team === 'friendly');
        const isIdentified = isBlue || (typeof m.isIdentifiedBy === 'function' ? m.isIdentifiedBy(team) : m.isIdentified);
        const sourceId = (m.source && m.source.id) ? m.source.id : 'src';
        const weaponId = (m.weapon && m.weapon.id) ? m.weapon.id : 'MSL';
        const distVal = (typeof m.distanceToTarget === 'number' && !isNaN(m.distanceToTarget)) ? Math.round(m.distanceToTarget) : 0;

        let cluster = null;
        for (const cl of clusters) {
          if (cl.sourceId === sourceId && cl.weaponId === weaponId && cl.isBlue === isBlue && cl.isIdentified === isIdentified) {
            if (Math.hypot(cl.px - px, cl.py - py) < 34) { cluster = cl; break; }
          }
        }

        if (cluster) {
          cluster.count++;
          if (distVal < cluster.minDist) {
            cluster.minDist = distVal;
          }
        } else {
          clusters.push({
            sourceId: sourceId,
            weaponId: weaponId,
            weaponName: (m.weapon && (m.weapon.id || m.weapon.name)) ? (m.weapon.id || m.weapon.name) : 'MSL',
            isBlue: isBlue,
            isIdentified: isIdentified,
            count: 1,
            minDist: distVal,
            px: px,
            py: py
          });
        }
      }

      ctx.font = '700 9.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
      for (const cl of clusters) {
        ctx.fillStyle = cl.isBlue ? '#7dd3fc' : '#ef4444';
        const countTag = cl.count > 1 ? ` x${cl.count}` : '';
        const mslLabel = cl.isIdentified ? cleanFn(cl.weaponName) : 'FAST TRACK [?]';
        const distTag = declutterMode ? '' : ` [${cl.minDist}km]`;
        ctx.fillText(cleanFn(`${mslLabel}${countTag}${distTag}`), cl.px + 8, cl.py - 2);
      }
    }
    ctx.restore();
  }

  static drawHoverReticle(ctx, cam, contact) {
    if (!contact || typeof contact.x !== 'number') return;
    const pos = cam.toScreen(contact.x, contact.y);
    const px = Math.round(pos.x);
    const py = Math.round(pos.y);
    ctx.save(); ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }

  static drawTargetReticle(ctx, cam, target) {
    if (!target || typeof target.x !== 'number') return;
    const pos = cam.toScreen(target.x, target.y);
    const px = Math.round(pos.x);
    const py = Math.round(pos.y);
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