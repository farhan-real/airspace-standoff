/**
 * AIRSPACE STANDOFF // Tactical Radar Viewport Renderer (Optimized 60-120 FPS Engine)
 * Smooth 2.0x Retina scaling without mobile overdraw or gradient garbage collection lag.
 */

class TacticalRadarRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: false, desynchronized: true }) : null;
    this.sweepAngle = 0;
    this.selectedTarget = null;
    this.hoveredContact = null;
    this.cssWidth = 800;
    this.cssHeight = 500;
    this.isMobile = (typeof window !== 'undefined') && (window.innerWidth <= 1024);

    // 2.0x DPR: perfectly sharp on retina/OLED without overworking mobile GPUs
    const rawDpr = window.devicePixelRatio || 1;
    this.dpr = Math.min(Math.max(rawDpr, 1.75), 2.0);

    this.cam = new RadarCameraController(this.canvas, this.cssWidth, this.cssHeight);
    this.fx = new RadarEffectsSystem(this.cam);

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.resize(), 60);
    });
    this.initCameraControls();
  }

  get zoom() { return this.cam.zoom; }
  set zoom(v) { this.cam.zoom = v; }
  get panX() { return this.cam.panX; }
  set panX(v) { this.cam.panX = v; }
  get panY() { return this.cam.panY; }
  set panY(v) { this.cam.panY = v; }
  get trackingUnit() { return this.cam.trackingUnit; }
  set trackingUnit(v) { this.cam.trackingUnit = v; }
  get declutterMode() { return this.cam.declutterMode; }
  set declutterMode(v) { this.cam.declutterMode = v; }
  get showGroundTargets() { return this.cam.showGroundTargets; }
  set showGroundTargets(v) { this.cam.showGroundTargets = v; }

  toScreen(x, y) { return this.cam.toScreen(x, y); }
  toKm(x, y) { return this.cam.toKm(x, y); }
  resetCamera() { this.cam.resetCamera(); }
  trackActiveCraft() { this.cam.trackActiveCraft(window.Game ? window.Game.activeUnit : null); }
  spawnExplosionFX(x, y, l) { this.fx.spawnExplosionFX(x, y, l); }
  spawnShockwave(x, y, c, r) { this.fx.spawnShockwave(x, y, c, r); }
  spawnGunTracer(fx, fy, tx, ty, c) { this.fx.spawnGunTracer(fx, fy, tx, ty, c); }
  spawnCombatText(x, y, t, c) { this.fx.spawnCombatText(x, y, t, c); }

  cleanCanvasText(str) {
    if (str === undefined || str === null) return '';
    const s = String(str);
    if (!s.includes('<') && !s.includes('\\') && !s.includes('{') && !s.includes('katex')) {
      return s;
    }
    return s
      .replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/katex[a-z-]*/gi, '')
      .replace(/[\{\}\\]/g, '')
      .trim();
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const w = (parent && parent.clientWidth > 0) ? parent.clientWidth : 800;
    const h = (parent && parent.clientHeight > 0) ? parent.clientHeight : 500;
    this.cssWidth = w;
    this.cssHeight = h;
    this.cam.resize(w, h);
    this.isMobile = (w <= 1024);

    const rawDpr = window.devicePixelRatio || 1;
    this.dpr = Math.min(Math.max(rawDpr, 1.75), 2.0);

    this.canvas.width = Math.round(this.cssWidth * this.dpr);
    this.canvas.height = Math.round(this.cssHeight * this.dpr);
    this.canvas.style.width = this.cssWidth + 'px';
    this.canvas.style.height = this.cssHeight + 'px';

    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'medium';
    }
  }

  syncControlButtons() {
    const isDecluttered = this.cam.declutterMode;
    ['cam-btn-declutter', 'cam-btn-declutter-mob'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.toggle('active', isDecluttered);
        btn.textContent = isDecluttered ? 'DECLUTTER: ON' : 'DECLUTTER: OFF';
      }
    });

    const isGroundShown = this.cam.showGroundTargets;
    ['cam-btn-ground', 'cam-btn-ground-mob'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.toggle('active', isGroundShown);
        btn.textContent = isGroundShown ? 'GROUND: ON' : 'GROUND: OFF';
      }
    });
  }

  initCameraControls() {
    if (!this.canvas) return;

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const kmBefore = this.toKm(e.clientX - rect.left, e.clientY - rect.top);
      this.cam.zoom = Math.max(this.cam.minZoom, Math.min(this.cam.maxZoom, this.cam.zoom * (e.deltaY < 0 ? 1.15 : 0.87)));
      const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
      const effScaleX = (this.cssWidth / cfg.THEATER_WIDTH_KM) * this.cam.zoom;
      const effScaleY = (this.cssHeight / cfg.THEATER_HEIGHT_KM) * this.cam.zoom;
      this.cam.panX = kmBefore.x - ((e.clientX - rect.left) / effScaleX);
      this.cam.panY = kmBefore.y - ((e.clientY - rect.top) / effScaleY);
    }, { passive: false });

    this.syncControlButtons();

    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.onclick = (e) => { e.stopPropagation(); fn(); };
    };

    bind('cam-btn-zoom-in', () => this.cam.zoomAtCenter(1.25));
    bind('cam-btn-zoom-out', () => this.cam.zoomAtCenter(0.80));
    bind('cam-btn-reset', () => this.cam.resetCamera());
    bind('cam-btn-track', () => this.trackActiveCraft());

    const toggleDeclutter = () => {
      this.cam.declutterMode = !this.cam.declutterMode;
      this.syncControlButtons();
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    };
    bind('cam-btn-declutter', toggleDeclutter);
    bind('cam-btn-declutter-mob', toggleDeclutter);

    const toggleGround = () => {
      this.cam.toggleGroundTargets();
      this.syncControlButtons();
      if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    };
    bind('cam-btn-ground', toggleGround);
    bind('cam-btn-ground-mob', toggleGround);
  }

  render(state) {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.cssWidth;
    const h = this.cssHeight;

    const allied = (state && state.alliedAircraft) || [];
    const hostiles = (state && state.hostileAircraft) || [];
    const surface = (state && state.surfaceUnits) || [];
    const missiles = (state && state.missiles) || [];
    const civilians = (window.Game && window.Game.simulation && window.Game.simulation.civilianTraffic) || [];
    const ghosts = (window.Game && window.Game.simulation && window.Game.simulation.ghostContacts) || [];
    const decoys = (window.Game && window.Game.simulation && window.Game.simulation.decoyDrones) || [];
    const clouds = (window.Game && window.Game.simulation && window.Game.simulation.weatherClouds) || [];

    const activeUnit = state ? state.activeUnit : null;
    this.selectedTarget = state ? state.selectedTarget : null;

    if (this.cam.trackingUnit) {
      if (this.cam.trackingUnit.hp > 0) this.cam.centerOnKm(this.cam.trackingUnit.x, this.cam.trackingUnit.y);
      else this.cam.trackingUnit = null;
    }

    const commanderTeam = (window.Game && window.Game.currentPvpCommander) || 'friendly';
    const detectedSet = (commanderTeam === 'friendly')
      ? (window.Game && window.Game.detectedByBlue ? window.Game.detectedByBlue : new Set())
      : (window.Game && window.Game.detectedByRed ? window.Game.detectedByRed : new Set());

    ctx.fillStyle = '#02050e';
    ctx.fillRect(0, 0, w, h);

    if (typeof RadarEnvironmentRenderer !== 'undefined') {
      RadarEnvironmentRenderer.drawGrid(ctx, this.cam, w, h);
      RadarEnvironmentRenderer.drawBaseCorridor(ctx, this.cam, w);
      RadarEnvironmentRenderer.drawClouds(ctx, this.cam, clouds, w, h);

      this.sweepAngle += 0.035;
      if (this.sweepAngle > Math.PI * 2) this.sweepAngle = 0;
      RadarEnvironmentRenderer.drawSweep(ctx, this.cam, this.sweepAngle, w, h, this.isMobile);
    }

    if (typeof RadarTacticalRenderer !== 'undefined') {
      RadarTacticalRenderer.drawSurface(ctx, this.cam, surface, commanderTeam, detectedSet, activeUnit, this.selectedTarget, w, this.declutterMode, this.cleanCanvasText.bind(this));
      RadarTacticalRenderer.drawCivilianTraffic(ctx, this.cam, civilians, detectedSet, activeUnit, this.declutterMode, w, this.cleanCanvasText.bind(this));
      RadarTacticalRenderer.drawRadarLocks(ctx, this.cam, allied.concat(hostiles), activeUnit, commanderTeam, detectedSet);
      RadarTacticalRenderer.drawSalvoCoordinations(ctx, this.cam, missiles);
      RadarTacticalRenderer.drawMissiles(ctx, this.cam, missiles, commanderTeam, detectedSet, this.declutterMode, this.cleanCanvasText.bind(this));
    }

    if (typeof RadarContactsRenderer !== 'undefined') {
      RadarContactsRenderer.drawGhostContacts(ctx, this.cam, ghosts, detectedSet, this.selectedTarget, activeUnit, this.zoom, this.cleanCanvasText.bind(this));
      RadarContactsRenderer.drawDecoyDrones(ctx, this.cam, decoys, detectedSet, commanderTeam, activeUnit, this.cleanCanvasText.bind(this));
      RadarContactsRenderer.drawAircraft(ctx, this.cam, hostiles, 'hostile', activeUnit, this.selectedTarget, commanderTeam, detectedSet, w, this.declutterMode, this.cleanCanvasText.bind(this));
      RadarContactsRenderer.drawAircraft(ctx, this.cam, allied, 'friendly', activeUnit, this.selectedTarget, commanderTeam, detectedSet, w, this.declutterMode, this.cleanCanvasText.bind(this));
    }

    const liveHostiles = hostiles.filter(a => a && a.hp > 0);
    const uplinkThreshold = (window.CONFIG && window.CONFIG.UPLINK_THRESHOLD_FIGHTERS !== undefined) ? window.CONFIG.UPLINK_THRESHOLD_FIGHTERS : 3;
    if (commanderTeam === 'friendly' && liveHostiles.length > 0 && liveHostiles.length <= uplinkThreshold && typeof RadarEnvironmentRenderer !== 'undefined') {
      RadarEnvironmentRenderer.drawUplinkBanner(ctx, liveHostiles.length, w, h);
    }

    if (this.hoveredContact && this.hoveredContact.hp > 0 && typeof this.hoveredContact.x === 'number' && typeof RadarTacticalRenderer !== 'undefined') {
      RadarTacticalRenderer.drawHoverReticle(ctx, this.cam, this.hoveredContact);
    }
    if (this.selectedTarget && this.selectedTarget.hp > 0 && typeof this.selectedTarget.x === 'number' && typeof RadarTacticalRenderer !== 'undefined') {
      RadarTacticalRenderer.drawTargetReticle(ctx, this.cam, this.selectedTarget);
    }

    this.fx.draw(ctx, 0.016);
  }
}

window.TacticalRadarRenderer = TacticalRadarRenderer;