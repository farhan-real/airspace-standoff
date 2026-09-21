/**
 * AIRSPACE STANDOFF: Radar Environment Sub-Renderer (150km x 100km Theater)
 * Grid, boundary corridor, weather clouds, and orbital uplink status banner.
 */

class RadarEnvironmentRenderer {
  static drawGrid(ctx, cam, cssWidth, cssHeight) {
    ctx.save();
    ctx.strokeStyle = '#081324';
    ctx.lineWidth = 1;
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    for (let kmX = 0; kmX <= cfg.THEATER_WIDTH_KM; kmX += 25) {
      const pT = cam.toScreen(kmX, 0);
      const pB = cam.toScreen(kmX, cfg.THEATER_HEIGHT_KM);
      ctx.beginPath();
      ctx.moveTo(Math.round(pT.x), Math.round(pT.y));
      ctx.lineTo(Math.round(pB.x), Math.round(pB.y));
      ctx.stroke();
    }
    for (let kmY = 0; kmY <= cfg.THEATER_HEIGHT_KM; kmY += 25) {
      const pL = cam.toScreen(0, kmY);
      const pR = cam.toScreen(cfg.THEATER_WIDTH_KM, kmY);
      ctx.beginPath();
      ctx.moveTo(Math.round(pL.x), Math.round(pL.y));
      ctx.lineTo(Math.round(pR.x), Math.round(pR.y));
      ctx.stroke();
    }
    ctx.restore();
  }

  static drawBaseCorridor(ctx, cam, cssWidth) {
    const corridorX = (window.CONFIG && window.CONFIG.RTB_CORRIDOR_X_KM) || 32.0;
    const cfg = window.CONFIG || { THEATER_HEIGHT_KM: 100.0 };
    const pTop = cam.toScreen(corridorX, 0);
    const pBottom = cam.toScreen(corridorX, cfg.THEATER_HEIGHT_KM);

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 245, 160, 0.40)';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([5, 6]);
    ctx.beginPath();
    ctx.moveTo(Math.round(pTop.x), Math.round(pTop.y));
    ctx.lineTo(Math.round(pBottom.x), Math.round(pBottom.y));
    ctx.stroke();
    ctx.restore();
  }

  static drawClouds(ctx, cam, clouds, cssWidth, cssHeight) {
    if (!clouds || clouds.length === 0) return;
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    for (const c of clouds) {
      if (!c || typeof c.x !== 'number') continue;
      const pos = cam.toScreen(c.x, c.y);
      const rx = (c.rx / cfg.THEATER_WIDTH_KM) * cssWidth * cam.zoom;
      const ry = (c.ry / cfg.THEATER_HEIGHT_KM) * cssHeight * cam.zoom;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(Math.round(pos.x), Math.round(pos.y), Math.max(4, rx), Math.max(4, ry), 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40, 56, 80, 0.16)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(80, 110, 150, 0.30)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.restore();
    }
  }

  static drawUplinkBanner(ctx, count, cssWidth, cssHeight) {
    ctx.save();
    ctx.font = '800 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Consolas", monospace';
    const text = `SATELLITE RADAR UPLINK: ${count} HOSTILE${count > 1 ? 'S' : ''} REMAINING (PINPOINTED)`;
    const textWidth = ctx.measureText(text).width;
    const x = Math.round((cssWidth - textWidth) / 2);
    const y = cssHeight - 16;

    ctx.fillStyle = 'rgba(3, 9, 20, 0.94)';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.4;
    ctx.fillRect(x - 10, y - 14, textWidth + 20, 20);
    ctx.strokeRect(x - 10, y - 14, textWidth + 20, 20);

    ctx.fillStyle = '#00f0ff';
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}

window.RadarEnvironmentRenderer = RadarEnvironmentRenderer;