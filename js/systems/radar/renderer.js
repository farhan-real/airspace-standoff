/* AIRSPACE STANDOFF: Radar Viewport Renderer Engine */

class RadarRenderer {
  static cleanText(str) {
    if (!str) return '';
    const s = String(str);
    if (!s.includes('<') && !s.includes('\\') && !s.includes('{')) return s;
    return s.replace(/<[^>]*>/g, '').replace(/[\{\}\\]/g, '').replace(/\s+/g, ' ').trim();
  }

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) throw new Error(`Radar canvas element "${canvasId}" not found.`);
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) throw new Error(`Failed to acquire 2D rendering context for "${canvasId}".`);

    if (typeof RadarCameraController === 'undefined') throw new Error('RadarCameraController is not loaded.');
    if (typeof RadarEffectsSystem === 'undefined') throw new Error('RadarEffectsSystem is not loaded.');
    if (typeof RadarEnvironmentRenderer === 'undefined') throw new Error('RadarEnvironmentRenderer is not loaded.');
    if (typeof RadarSurfaceRenderer === 'undefined') throw new Error('RadarSurfaceRenderer is not loaded.');
    if (typeof RadarCombatRenderer === 'undefined') throw new Error('RadarCombatRenderer is not loaded.');
    if (typeof RadarContactsAuxRenderer === 'undefined') throw new Error('RadarContactsAuxRenderer is not loaded.');
    if (typeof RadarContactsRenderer === 'undefined') throw new Error('RadarContactsRenderer is not loaded.');

    this.selectedTarget = null;
    this.hoveredContact = null;
    this.cssWidth = 0;
    this.cssHeight = 0;
    this.isMobile = (window.innerWidth <= 1024);

    const rawDpr = window.devicePixelRatio || 1;
    this.dpr = Math.max(1, Math.min(rawDpr, 1.5));

    this.cam = new RadarCameraController(this.canvas, 800, 500);
    this.fx = new RadarEffectsSystem(this.cam);

    this.inspectionDetectedSet = new Set();
    this._uplinkBannerEl = document.getElementById('radar-uplink-banner');
    this._lastUplinkKey = '';

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
    return RadarRenderer.cleanText(str);
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) throw new Error('Radar canvas has no parent element.');

    if (parent.clientWidth <= 0 || parent.clientHeight <= 0) {
      const hud = document.getElementById('hud-container');
      if (hud && hud.classList.contains('hidden')) return;
      throw new Error(`Radar viewport has invalid layout dimensions: ${parent.clientWidth}x${parent.clientHeight}`);
    }

    const nextW = Math.round(parent.clientWidth);
    const nextH = Math.round(parent.clientHeight);
    const rawDpr = window.devicePixelRatio || 1;
    const nextDpr = Math.max(1, Math.min(rawDpr, 1.5));
    const pixelW = Math.round(nextW * nextDpr);
    const pixelH = Math.round(nextH * nextDpr);

    this.dpr = nextDpr;
    this.cssWidth = nextW;
    this.cssHeight = nextH;
    this.isMobile = (this.cssWidth <= 1024);
    this.cam.resize(this.cssWidth, this.cssHeight);

    if (this.canvas.width !== pixelW || this.canvas.height !== pixelH) {
      this.canvas.width = pixelW;
      this.canvas.height = pixelH;
    }

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = true;
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
    if (!state) throw new Error('RadarRenderer.render requires a state object.');
    if (!window.Game || !window.Game.simulation) throw new Error('Game simulation must be initialized before radar render.');

    const parent = this.canvas.parentElement;
    if (!parent) throw new Error('Radar canvas has no parent element.');
    if (parent.clientWidth > 0 && parent.clientHeight > 0 &&
        (Math.abs(parent.clientWidth - this.cssWidth) > 2 || Math.abs(parent.clientHeight - this.cssHeight) > 2)) {
      this.resize();
    }
    if (this.cssWidth <= 0 || this.cssHeight <= 0) {
      throw new Error(`Radar viewport has invalid dimensions during render: ${this.cssWidth}x${this.cssHeight}`);
    }

    const ctx = this.ctx, w = this.cssWidth, h = this.cssHeight;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.cam.updateScales();

    const allied = state.alliedAircraft;
    const hostiles = state.hostileAircraft;
    const surface = state.surfaceUnits;
    const missiles = state.missiles;
    if (!Array.isArray(allied) || !Array.isArray(hostiles) || !Array.isArray(surface) || !Array.isArray(missiles)) {
      throw new Error('RadarRenderer.render received invalid entity arrays in state.');
    }

    const sim = window.Game.simulation;
    const civilians = sim.civilianTraffic;
    const ghosts = sim.ghostContacts;
    const decoys = sim.decoyDrones;
    const clouds = sim.weatherClouds;

    const activeUnit = state.activeUnit;
    this.selectedTarget = state.inspectionEntity || state.selectedTarget;

    if (this.cam.trackingUnit) {
      if (this.cam.trackingUnit.hp > 0.05) this.cam.centerOnKm(this.cam.trackingUnit.x, this.cam.trackingUnit.y);
      else this.cam.trackingUnit = null;
    }

    const commanderTeam = window.Game.currentPvpCommander;
    const is2P = (window.Game.playerMode === '2P');

    let detectedSet;
    if (is2P || state.inspectionMode) {
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
      detectedSet = window.Game.detectedByBlue;
    } else {
      detectedSet = window.Game.detectedByRed;
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    RadarEnvironmentRenderer.drawGrid(ctx, this.cam, w, h);
    RadarEnvironmentRenderer.drawBaseCorridor(ctx, this.cam, w);
    RadarEnvironmentRenderer.drawClouds(ctx, this.cam, clouds, w, h);

    RadarSurfaceRenderer.drawSurface(ctx, this.cam, surface, commanderTeam, detectedSet, activeUnit, this.selectedTarget, w, this.declutterMode);
    RadarSurfaceRenderer.drawCivilianTraffic(ctx, this.cam, civilians, detectedSet, activeUnit, this.declutterMode, w);

    RadarCombatRenderer.drawRadarLocks(ctx, this.cam, allied, hostiles, activeUnit, commanderTeam, detectedSet);
    RadarCombatRenderer.drawSalvoCoordinations(ctx, this.cam, missiles, commanderTeam);
    RadarCombatRenderer.drawMissiles(ctx, this.cam, missiles, commanderTeam, detectedSet, this.declutterMode);

    RadarContactsAuxRenderer.drawGhostContacts(ctx, this.cam, ghosts, detectedSet, this.selectedTarget, activeUnit, this.zoom);
    RadarContactsAuxRenderer.drawDecoyDrones(ctx, this.cam, decoys, detectedSet, commanderTeam, activeUnit);

    RadarContactsRenderer.drawAircraft(ctx, this.cam, hostiles, 'hostile', activeUnit, this.selectedTarget, commanderTeam, detectedSet, w, this.declutterMode);
    RadarContactsRenderer.drawAircraft(ctx, this.cam, allied, 'friendly', activeUnit, this.selectedTarget, commanderTeam, detectedSet, w, this.declutterMode);

    const isAttackMode = (window.Game.scenarioMode === 'ATTACK');
    const uplinkBannerEl = this._uplinkBannerEl;

    if (uplinkBannerEl) {
      if (isAttackMode) {
        const obj = AttackDirector.getObjectiveSummary(window.Game);
        const key = `ATK:${obj.remaining}:${obj.total}`;
        if (this._lastUplinkKey !== key) {
          this._lastUplinkKey = key;
          uplinkBannerEl.textContent = `PRIMARY STRIKE OBJECTIVES: ${obj.remaining} / ${obj.total} ACTIVE`;
          uplinkBannerEl.style.borderColor = obj.remaining === 0 ? '#00f5a0' : '#ffd700';
          uplinkBannerEl.style.color = obj.remaining === 0 ? '#00f5a0' : '#fef08a';
          uplinkBannerEl.classList.remove('hidden');
        }
      } else {
        let liveHostileCount = 0;
        for (let i = 0; i < hostiles.length; i++) {
          if (hostiles[i] && hostiles[i].hp > 0.05) liveHostileCount++;
        }
        const shouldShowUplink = (!is2P && commanderTeam === 'friendly' && liveHostileCount > 0 && liveHostileCount <= 3);
        const key = shouldShowUplink ? `UP:${liveHostileCount}` : 'HIDE';
        if (this._lastUplinkKey !== key) {
          this._lastUplinkKey = key;
          if (shouldShowUplink) {
            uplinkBannerEl.textContent = `SATELLITE RADAR UPLINK: ${liveHostileCount} HOSTILE${liveHostileCount > 1 ? 'S' : ''} REMAINING (PINPOINTED)`;
            uplinkBannerEl.style.borderColor = '';
            uplinkBannerEl.style.color = '';
            uplinkBannerEl.classList.remove('hidden');
          } else {
            uplinkBannerEl.classList.add('hidden');
          }
        }
      }
    }

    const isInspection = Boolean(state.inspectionMode);
    const showGround = Boolean(this.cam.showGroundTargets);
    const isSurfaceObj = (obj) => Boolean(obj && ((typeof SurfaceUnit !== 'undefined' && obj instanceof SurfaceUnit) || (obj.type && !obj.isCivilian && !obj.weapon)));

    if (this.hoveredContact && typeof this.hoveredContact.x === 'number') {
      const isMsl = Boolean(this.hoveredContact.weapon && this.hoveredContact.target);
      const isGnd = isSurfaceObj(this.hoveredContact);
      if ((!isMsl || isInspection) && (!isGnd || showGround) && (this.hoveredContact.hp === undefined || this.hoveredContact.hp > 0.05)) {
        RadarCombatRenderer.drawHoverReticle(ctx, this.cam, this.hoveredContact);
      }
    }
    if (this.selectedTarget && typeof this.selectedTarget.x === 'number') {
      const isMsl = Boolean(this.selectedTarget.weapon && this.selectedTarget.target);
      const isGnd = isSurfaceObj(this.selectedTarget);
      if ((!isMsl || isInspection) && (!isGnd || showGround) && (this.selectedTarget.hp === undefined || this.selectedTarget.hp > 0.05)) {
        RadarCombatRenderer.drawTargetReticle(ctx, this.cam, this.selectedTarget);
      }
    }

    this.fx.draw(ctx, 0.016);
  }
}

window.RadarRenderer = RadarRenderer;
