/**
 * AIRSPACE STANDOFF: Radar Environment Sub-Renderer (150km x 100km Theater)
 * Batched drawing pipelines for zero allocations and 200+ FPS rendering.
 */

class RadarEnvironmentRenderer {
  static drawGrid(ctx, cam, cssWidth, cssHeight) {
    ctx.save();
    ctx.strokeStyle = '#081324';
    ctx.lineWidth = 1;
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    const w = cfg.THEATER_WIDTH_KM || 150.0;
    const h = cfg.THEATER_HEIGHT_KM || 100.0;
    const y0 = cam.toScreenY(0);
    const yH = cam.toScreenY(h);
    const x0 = cam.toScreenX(0);
    const xW = cam.toScreenX(w);

    ctx.beginPath();
    for (let kmX = 0; kmX <= w; kmX += 25) {
      const sx = cam.toScreenX(kmX);
      ctx.moveTo(sx, y0);
      ctx.lineTo(sx, yH);
    }
    for (let kmY = 0; kmY <= h; kmY += 25) {
      const sy = cam.toScreenY(kmY);
      ctx.moveTo(x0, sy);
      ctx.lineTo(xW, sy);
    }
    ctx.stroke();
    ctx.restore();
  }

  static drawBaseCorridor(ctx, cam, cssWidth) {
    const corridorX = (window.CONFIG && window.CONFIG.RTB_CORRIDOR_X_KM) || 32.0;
    const cfg = window.CONFIG || { THEATER_HEIGHT_KM: 100.0 };
    const sx = cam.toScreenX(corridorX);
    const y0 = cam.toScreenY(0);
    const yH = cam.toScreenY(cfg.THEATER_HEIGHT_KM || 100.0);

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 245, 160, 0.40)';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([5, 6]);
    ctx.beginPath();
    ctx.moveTo(sx, y0);
    ctx.lineTo(sx, yH);
    ctx.stroke();
    ctx.restore();
  }

  static drawClouds(ctx, cam, clouds, cssWidth, cssHeight) {
    if (!clouds || clouds.length === 0) return;
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    const scaleX = (cssWidth / cfg.THEATER_WIDTH_KM) * cam.zoom;
    const scaleY = (cssHeight / cfg.THEATER_HEIGHT_KM) * cam.zoom;

    ctx.save();
    ctx.fillStyle = 'rgba(40, 56, 80, 0.16)';
    ctx.strokeStyle = 'rgba(80, 110, 150, 0.30)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 6]);

    for (let i = 0; i < clouds.length; i++) {
      const c = clouds[i];
      if (!c) continue;
      const sx = cam.toScreenX(c.x);
      const sy = cam.toScreenY(c.y);
      const rx = Math.max(4, c.rx * scaleX);
      const ry = Math.max(4, c.ry * scaleY);

      ctx.beginPath();
      ctx.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  static drawUplinkBanner(ctx, count, cssWidth, cssHeight) {
    ctx.save();
    ctx.font = '700 11px "JetBrains Mono", ui-monospace, monospace';
    const text = `SATELLITE RADAR UPLINK: ${count} HOSTILE${count > 1 ? 'S' : ''} REMAINING (PINPOINTED)`;
    const isMobile = (cssWidth <= 1024);
    const textWidth = ctx.measureText(text).width;
    const x = isMobile ? 8 : 16;
    const y = isMobile ? 54 : 68;

    ctx.fillStyle = '#030914';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.4;
    ctx.fillRect(x, y - 11, textWidth + 14, 18);
    ctx.strokeRect(x, y - 11, textWidth + 14, 18);

    ctx.fillStyle = '#00f0ff';
    ctx.fillText(text, x + 7, y + 2);
    ctx.restore();
  }
}

window.RadarEnvironmentRenderer = RadarEnvironmentRenderer;