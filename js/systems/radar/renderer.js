/* AIRSPACE STANDOFF: Tactical Radar Viewport Renderer Engine */

class TacticalRadarRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: false, desynchronized: true }) : null;
    this.selectedTarget = null;
    this.hoveredContact = null;
    this.cssWidth = 800;
    this.cssHeight = 500;
    this.isMobile = (typeof window !== 'undefined') && (window.innerWidth <= 1024);

    const rawDpr = window.devicePixelRatio || 1;
    this.dpr = this.isMobile ? Math.min(rawDpr, 1.25) : Math.min(rawDpr, 1.5);

    this.cam = new RadarCameraController(this.canvas, this.cssWidth, this.cssHeight);
    this.fx = new RadarEffectsSystem(this.cam);

    this.inspectionDetectedSet = new Set();
    this.emptyDetectedSet = new Set();
    this.boundCleanCanvasText = this.cleanCanvasText.bind(this);

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 60), { passive: true });
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
    if (!s.includes('<') && !s.includes('\\') && !s.includes('{')) return s;
    return s.replace(/<[^>]*>/g, '').replace(/[\{\}\\]/g, '').replace(/\s+/g, ' ').trim();
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const nextW = (parent && parent.clientWidth > 0) ? parent.clientWidth : 800;
    const nextH = (parent && parent.clientHeight > 0) ? parent.clientHeight : 500;

    const rawDpr = window.devicePixelRatio || 1;
    const nextDpr = (nextW <= 1024) ? Math.min(rawDpr, 1.25) : Math.min(rawDpr, 1.5);

    if (this.cssWidth === nextW && this.cssHeight === nextH && this.dpr === nextDpr) return;

    this.cssWidth = nextW;
    this.cssHeight = nextH;
    this.isMobile = (this.cssWidth <= 1024);
    this.dpr = nextDpr;
    this.cam.resize(this.cssWidth, this.cssHeight);

    this.canvas.width = Math.round(this.cssWidth * this.dpr);
    this.canvas.height = Math.round(this.cssHeight * this.dpr);
    this.canvas.style.width = this.cssWidth + 'px';
    this.canvas.style.height = this.cssHeight + 'px';

    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
      this.ctx.imageSmoothingEnabled = false;
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
      this.cam.trackingUnit = null;
      const rect = this.canvas.getBoundingClientRect();
      const kmBefore = this.toKm(e.clientX - rect.left, e.clientY - rect.top);
      this.cam.zoom = Math.max(this.cam.minZoom, Math.min(this.cam.maxZoom, this.cam.zoom * (e.deltaY < 0 ? 1.15 : 0.87)));
      this.cam.updateScales();
      this.cam.panX = kmBefore.x - ((e.clientX - rect.left) / this.cam.effScaleX);
      this.cam.panY = kmBefore.y - ((e.clientY - rect.top) / this.cam.effScaleY);
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

  addEntityIds(set, list) {
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].id) set.add(list[i].id);
    }
  }

  render(state) {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.cssWidth;
    const h = this.cssHeight;

    this.cam.updateScales();

    const allied = (state && state.alliedAircraft) || [];
    const hostiles = (state && state.hostileAircraft) || [];
    const surface = (state && state.surfaceUnits) || [];
    const missiles = (state && state.missiles) || [];
    const sim = window.Game && window.Game.simulation;
    const civilians = (sim && sim.civilianTraffic) || [];
    const ghosts = (sim && sim.ghostContacts) || [];
    const decoys = (sim && sim.decoyDrones) || [];
    const clouds = (sim && sim.weatherClouds) || [];

    const activeUnit = state ? state.activeUnit : null;
    this.selectedTarget = state ? (state.inspectionEntity || state.selectedTarget) : null;

    if (this.cam.trackingUnit) {
      if (this.cam.trackingUnit.hp > 0.05) this.cam.centerOnKm(this.cam.trackingUnit.x, this.cam.trackingUnit.y);
      else this.cam.trackingUnit = null;
    }

    const commanderTeam = (window.Game && window.Game.currentPvpCommander) || 'friendly';
    const is2P = Boolean(window.Game && window.Game.playerMode === '2P');

    let detectedSet;
    if (is2P || (state && state.inspectionMode)) {
      this.inspectionDetectedSet.clear();
      this.addEntityIds(this.inspectionDetectedSet, allied);
      this.addEntityIds(this.inspectionDetectedSet, hostiles);
      this.addEntityIds(this.inspectionDetectedSet, surface);
      this.addEntityIds(this.inspectionDetectedSet, missiles);
      this.addEntityIds(this.inspectionDetectedSet, civilians);
      this.addEntityIds(this.inspectionDetectedSet, ghosts);
      this.addEntityIds(this.inspectionDetectedSet, decoys);
      detectedSet = this.inspectionDetectedSet;
    } else if (commanderTeam === 'friendly') {
      detectedSet = (window.Game && window.Game.detectedByBlue) ? window.Game.detectedByBlue : this.emptyDetectedSet;
    } else {
      detectedSet = (window.Game && window.Game.detectedByRed) ? window.Game.detectedByRed : this.emptyDetectedSet;
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    if (typeof RadarEnvironmentRenderer !== 'undefined') {
      RadarEnvironmentRenderer.drawGrid(ctx, this.cam, w, h);
      RadarEnvironmentRenderer.drawBaseCorridor(ctx, this.cam, w);
      RadarEnvironmentRenderer.drawClouds(ctx, this.cam, clouds, w, h);
    }

    if (typeof RadarTacticalSurfaceRenderer !== 'undefined') {
      RadarTacticalSurfaceRenderer.drawSurface(ctx, this.cam, surface, commanderTeam, detectedSet, activeUnit, this.selectedTarget, w, this.declutterMode, this.boundCleanCanvasText);
      RadarTacticalSurfaceRenderer.drawCivilianTraffic(ctx, this.cam, civilians, detectedSet, activeUnit, this.declutterMode, w, this.boundCleanCanvasText);
    }

    if (typeof RadarTacticalRenderer !== 'undefined') {
      RadarTacticalRenderer.drawRadarLocks(ctx, this.cam, allied, hostiles, activeUnit, commanderTeam, detectedSet);
      RadarTacticalRenderer.drawSalvoCoordinations(ctx, this.cam, missiles, commanderTeam);
      RadarTacticalRenderer.drawMissiles(ctx, this.cam, missiles, commanderTeam, detectedSet, this.declutterMode, this.boundCleanCanvasText);
    }

    if (typeof RadarContactsAuxRenderer !== 'undefined') {
      RadarContactsAuxRenderer.drawGhostContacts(ctx, this.cam, ghosts, detectedSet, this.selectedTarget, activeUnit, this.zoom, this.boundCleanCanvasText);
      RadarContactsAuxRenderer.drawDecoyDrones(ctx, this.cam, decoys, detectedSet, commanderTeam, activeUnit, this.boundCleanCanvasText);
    }

    if (typeof RadarContactsRenderer !== 'undefined') {
      RadarContactsRenderer.drawAircraft(ctx, this.cam, hostiles, 'hostile', activeUnit, this.selectedTarget, commanderTeam, detectedSet, w, this.declutterMode, this.boundCleanCanvasText);
      RadarContactsRenderer.drawAircraft(ctx, this.cam, allied, 'friendly', activeUnit, this.selectedTarget, commanderTeam, detectedSet, w, this.declutterMode, this.boundCleanCanvasText);
    }

    let liveHostileCount = 0;
    for (let i = 0; i < hostiles.length; i++) {
      if (hostiles[i] && hostiles[i].hp > 0.05) liveHostileCount++;
    }
    const shouldShowUplink = (!is2P && commanderTeam === 'friendly' && liveHostileCount > 0 && liveHostileCount <= 3);

    const uplinkBannerEl = document.getElementById('radar-uplink-banner');
    if (uplinkBannerEl) {
      if (shouldShowUplink) {
        uplinkBannerEl.textContent = `SATELLITE RADAR UPLINK: ${liveHostileCount} HOSTILE${liveHostileCount > 1 ? 'S' : ''} REMAINING (PINPOINTED)`;
        uplinkBannerEl.classList.remove('hidden');
      } else {
        uplinkBannerEl.classList.add('hidden');
      }
    } else if (shouldShowUplink && typeof RadarEnvironmentRenderer !== 'undefined') {
      RadarEnvironmentRenderer.drawUplinkBanner(ctx, liveHostileCount, w, h);
    }

    if (this.hoveredContact && (this.hoveredContact.hp === undefined || this.hoveredContact.hp > 0.05) && typeof this.hoveredContact.x === 'number' && typeof RadarTacticalRenderer !== 'undefined') {
      RadarTacticalRenderer.drawHoverReticle(ctx, this.cam, this.hoveredContact);
    }
    if (this.selectedTarget && (this.selectedTarget.hp === undefined || this.selectedTarget.hp > 0.05) && typeof this.selectedTarget.x === 'number' && typeof RadarTacticalRenderer !== 'undefined') {
      RadarTacticalRenderer.drawTargetReticle(ctx, this.cam, this.selectedTarget);
    }

    this.fx.draw(ctx, 0.016);
  }
}

window.TacticalRadarRenderer = TacticalRadarRenderer;