/**
 * AIRSPACE STANDOFF: Radar Visual FX (Particles, Tracers, Shockwaves & Combat Text)
 */

class RadarEffectsSystem {
  constructor(camera) {
    this.cam = camera;
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
    this.tracers = [];
  }

  spawnExplosionFX(kmX, kmY, isLarge) {
    var count = isLarge ? 28 : 16;
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var spd = (Math.random() * 26 + 12) * (isLarge ? 1.6 : 1.0);
      this.particles.push({
        x: kmX, y: kmY,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 0.65, maxLife: 0.65,
        color: i % 2 === 0 ? '#f59e0b' : '#f43f5e'
      });
    }
  }

  spawnShockwave(kmX, kmY, color, maxRadiusPx) {
    this.shockwaves.push({
      kmX: kmX, kmY: kmY,
      radius: 4,
      maxRadius: maxRadiusPx || 35,
      color: color || '#38bdf8',
      alpha: 1.0
    });
  }

  spawnGunTracer(fromKmX, fromKmY, toKmX, toKmY, color) {
    this.tracers.push({
      fromX: fromKmX, fromY: fromKmY,
      toX: toKmX, toY: toKmY,
      life: 0.22, maxLife: 0.22,
      color: color || '#fbbf24'
    });
  }

  spawnCombatText(kmX, kmY, text, color) {
    this.floatingTexts.push({
      x: kmX, y: kmY,
      text: text,
      color: color || '#10b981',
      life: 1.4, maxLife: 1.4
    });
  }

  draw(ctx, dt) {
    for (var i = this.tracers.length - 1; i >= 0; i--) {
      var tr = this.tracers[i];
      tr.life -= dt;
      if (tr.life <= 0) { this.tracers.splice(i, 1); continue; }
      var p1 = this.cam.toScreen(tr.fromX, tr.fromY);
      var p2 = this.cam.toScreen(tr.toX, tr.toY);
      ctx.strokeStyle = tr.color || '#fbbf24';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    for (var j = this.shockwaves.length - 1; j >= 0; j--) {
      var sw = this.shockwaves[j];
      sw.radius += 90 * dt * this.cam.zoom;
      sw.alpha -= 1.8 * dt;
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius * this.cam.zoom) {
        this.shockwaves.splice(j, 1); continue;
      }
      var pos = this.cam.toScreen(sw.kmX, sw.kmY);
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.lineWidth = 2.0;
      ctx.stroke();
      ctx.restore();
    }

    for (var k = this.particles.length - 1; k >= 0; k--) {
      var p = this.particles[k];
      p.life -= dt;
      if (p.life <= 0) { this.particles.splice(k, 1); continue; }
      p.x += p.vx * dt * 0.15;
      p.y += p.vy * dt * 0.15;
      var sPos = this.cam.toScreen(p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillRect(sPos.x, sPos.y, 2.5, 2.5);
    }
    ctx.globalAlpha = 1.0;

    for (var m = this.floatingTexts.length - 1; m >= 0; m--) {
      var ft = this.floatingTexts[m];
      ft.life -= dt;
      if (ft.life <= 0) { this.floatingTexts.splice(m, 1); continue; }
      ft.y -= 2.0 * dt;
      var fPos = this.cam.toScreen(ft.x, ft.y);
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.fillText(ft.text, fPos.x, fPos.y);
    }
    ctx.globalAlpha = 1.0;
  }
}

window.RadarEffectsSystem = RadarEffectsSystem;