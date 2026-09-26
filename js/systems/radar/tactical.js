/**
 * AIRSPACE STANDOFF: Radar Tactical Sub-Renderer: Radar Locks, Paths & Missile Volleys
 */

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
      if (source.isPassiveRadarOnlyEngagement) continue;

      if (source.team !== team && detectedSet && !detectedSet.has(source.id)) continue;

      if (source.heading !== undefined && source.spec && source.spec.radarConeDeg < 360) {
        let angleDiff = Math.abs(source.heading - Math.atan2(tgt.y - source.y, tgt.x - source.x));
        while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
        if (angleDiff > (source.spec.radarConeDeg / 2.0) * (Math.PI / 180.0)) {
          continue;
        }
      }

      const p1 = cam.toScreen(source.x, source.y);
      const p2 = cam.toScreen(tgt.x, tgt.y);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(Math.round(p1.x), Math.round(p1.y));
      ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
      ctx.strokeStyle = (activeUnit && activeUnit.id === source.id)
        ? '#00f0ff'
        : (source.team !== team && tgt.team === team ? '#ef4444' : 'rgba(0, 240, 255, 0.35)');
      ctx.lineWidth = 1.4;
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.restore();
    }
  }

  static drawSalvoCoordinations(ctx, cam, missiles, commanderTeam) {
    const team = commanderTeam || (window.Game && window.Game.currentPvpCommander) || 'friendly';
    const targets = {};

    for (const m of missiles) {
      if (!m || !m.active || !m.target || m.target.hp <= 0 || typeof m.target.x !== 'number') continue;
      if (!targets[m.target.id]) targets[m.target.id] = [];
      targets[m.target.id].push(m);
    }

    Object.keys(targets).forEach(tid => {
      const group = targets[tid];
      if (group.length === 0 || !group[0].target) return;
      const tgt = group[0].target;
      const pT = cam.toScreen(tgt.x, tgt.y);
      const tx = Math.round(pT.x);
      const ty = Math.round(pT.y);

      let friendlyCount = 0;
      let enemyCount = 0;

      for (const m of group) {
        if (typeof m.x !== 'number' || typeof m.y !== 'number') continue;
        const isOwn = (m.team === team);

        if (!isOwn && m.isPassiveRadar && m.distanceToTarget > (m.pathRevealDistance || 20.0)) continue;

        if (!isOwn && window.Game) {
          const detectedSet = (team === 'friendly') ? window.Game.detectedByBlue : window.Game.detectedByRed;
          if (detectedSet && !detectedSet.has(m.id)) continue;
        }

        const pM = cam.toScreen(m.x, m.y);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(Math.round(pM.x), Math.round(pM.y));
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = isOwn ? '#00f0ff' : '#ef4444';
        ctx.lineWidth = isOwn ? 1.3 : 1.0;
        ctx.setLineDash(isOwn ? [3, 3] : [2, 4]);
        ctx.stroke();
        ctx.restore();

        if (isOwn) friendlyCount++;
        else enemyCount++;
      }

      if (friendlyCount > 1) {
        ctx.save();
        ctx.font = '700 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('SALVO x' + friendlyCount, tx - 22, ty - 14);
        ctx.restore();
      } else if (enemyCount > 1) {
        ctx.save();
        ctx.font = '700 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('INBOUND x' + enemyCount, tx - 22, ty - 14);
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
      if (!m || m.isDead || typeof m.x !== 'number') continue;
      const isOwn = (m.team === team);

      if (!isOwn && m.isPassiveRadar && m.age < (m.launchStealthDuration || 3.2) && m.distanceToTarget > (m.pathRevealDistance || 20.0)) {
        continue;
      }
      if (!isOwn && !detectedSet.has(m.id)) continue;

      const pos = cam.toScreen(m.x, m.y);
      const px = Math.round(pos.x);
      const py = Math.round(pos.y);
      visibleMissiles.push({ m, px, py });

      if (m.trail && m.trail.length > 1) {
        for (let t = 0; t < m.trail.length - 1; t++) {
          if (m.trail[t] && m.trail[t + 1]) {
            const p1 = cam.toScreen(m.trail[t].x, m.trail[t].y);
            const p2 = cam.toScreen(m.trail[t + 1].x, m.trail[t + 1].y);
            ctx.strokeStyle = m.team === 'friendly'
              ? ('rgba(0, 240, 255, ' + m.trail[t].alpha + ')')
              : ('rgba(239, 68, 68, ' + m.trail[t].alpha + ')');
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(Math.round(p1.x), Math.round(p1.y));
            ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
            ctx.stroke();
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
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
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
        const mSpeed = (typeof m.speed === 'number' && !isNaN(m.speed)) ? m.speed : 2.4;
        const mStage = m.stage || 'BOOST';

        let cluster = clusters.find(cl => cl.sourceId === sourceId && cl.weaponId === weaponId && cl.isBlue === isBlue && cl.isIdentified === isIdentified && Math.hypot(cl.px - px, cl.py - py) < 34);

        if (cluster) {
          cluster.count++;
          if (distVal < cluster.minDist) cluster.minDist = distVal;
          if (mSpeed > cluster.speed) { cluster.speed = mSpeed; cluster.stage = mStage; }
        } else {
          clusters.push({
            sourceId, weaponId, weaponName: (m.weapon && (m.weapon.id || m.weapon.name)) ? (m.weapon.id || m.weapon.name) : 'MSL',
            isBlue, isIdentified, isPassiveRadar: Boolean(m.isPassiveRadar), count: 1, minDist: distVal, speed: mSpeed, stage: mStage, px, py
          });
        }
      }

      for (const cl of clusters) {
        const countTag = cl.count > 1 ? ` x${cl.count}` : '';
        const mslLabel = cl.isIdentified ? cleanFn(cl.weaponName) : 'FAST TRACK [?]';
        const hideDist = (!cl.isBlue && cl.isPassiveRadar && cl.minDist > 20);
        const distTag = (declutterMode || hideDist) ? '' : ` [${cl.minDist}km]`;
        const speedTag = `M ${cl.speed.toFixed(1)} [${cl.stage}]`;

        ctx.font = '800 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = cl.isBlue ? '#00f0ff' : (cl.isIdentified ? '#ef4444' : '#f97316');
        ctx.fillText(cleanFn(`${mslLabel}${countTag}`), cl.px + 8, cl.py - 5);

        ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
        ctx.fillStyle = cl.isBlue ? '#00f5a0' : (cl.isIdentified ? '#fca5a5' : '#fed7aa');
        ctx.fillText(cleanFn(`${speedTag}${distTag}`), cl.px + 8, cl.py + 6);
      }
    }
    ctx.restore();
  }

  static drawHoverReticle(ctx, cam, contact) {
    if (!contact || typeof contact.x !== 'number') return;
    const pos = cam.toScreen(contact.x, contact.y);
    const px = Math.round(pos.x);
    const py = Math.round(pos.y);
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