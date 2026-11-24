/**
 * AIRSPACE STANDOFF: Radar Camera Controller (Pan, Zoom & Viewport Transforms)
 * Viewport starts centered in the middle of the theater (75km, 50km).
 * Declutter starts ON by default on mobile and OFF by default on desktop.
 */

class RadarCameraController {
  constructor(canvas, cssWidth, cssHeight) {
    if (!cssWidth || !cssHeight || cssWidth <= 0 || cssHeight <= 0) {
      throw new Error(`RadarCameraController requires positive initial dimensions, got ${cssWidth}x${cssHeight}`);
    }
    this.canvas = canvas;
    this.cssWidth = cssWidth;
    this.cssHeight = cssHeight;
    this.zoom = 1.0;
    this.minZoom = 0.65;
    this.maxZoom = 4.0;
    this.panX = 0;
    this.panY = 0;
    this.trackingUnit = null;

    this.effScaleX = 1.0;
    this.effScaleY = 1.0;

    const isMobile = (typeof window !== 'undefined') && (window.innerWidth <= 1024);
    this.declutterMode = isMobile;
    this.showGroundTargets = false;

    this.updateScales();
    this.centerTheater();
  }

  resize(w, h) {
    this.cssWidth = w;
    this.cssHeight = h;
    this.updateScales();
  }

  updateScales() {
    const cfg = window.CONFIG;
    if (!cfg || !cfg.THEATER_WIDTH_KM || !cfg.THEATER_HEIGHT_KM) {
      throw new Error('CONFIG.THEATER_WIDTH_KM and CONFIG.THEATER_HEIGHT_KM must be loaded.');
    }
    if (this.cssWidth <= 0 || this.cssHeight <= 0) {
      throw new Error(`RadarCameraController has non-positive viewport dimensions: ${this.cssWidth}x${this.cssHeight}`);
    }
    this.effScaleX = (this.cssWidth / cfg.THEATER_WIDTH_KM) * this.zoom;
    this.effScaleY = (this.cssHeight / cfg.THEATER_HEIGHT_KM) * this.zoom;
  }

  toggleGroundTargets() {
    this.showGroundTargets = !this.showGroundTargets;
    if (!this.showGroundTargets && window.Game) {
      const tgt = window.Game.selectedTarget;
      const isSurface = Boolean(tgt && ((typeof SurfaceUnit !== 'undefined' && tgt instanceof SurfaceUnit) || (tgt.type && !tgt.isCivilian && !tgt.weapon)));
      if (isSurface) {
        window.Game.selectedTarget = null;
        if (window.Game.activeUnit) window.Game.activeUnit.radarLockedTarget = null;
        const targetInfo = document.getElementById('selected-target-info');
        if (targetInfo) targetInfo.textContent = 'TARGET: NONE';
        if (window.Game.avionics) window.Game.avionics.updateActiveUnitMFD();
      }
    }
    return this.showGroundTargets;
  }

  toScreenX(kmX) {
    return (kmX - this.panX) * this.effScaleX;
  }

  toScreenY(kmY) {
    return (kmY - this.panY) * this.effScaleY;
  }

  toScreen(kmX, kmY) {
    return {
      x: (kmX - this.panX) * this.effScaleX,
      y: (kmY - this.panY) * this.effScaleY
    };
  }

  toKm(screenX, screenY) {
    return {
      x: (screenX / this.effScaleX) + this.panX,
      y: (screenY / this.effScaleY) + this.panY
    };
  }

  zoomAtCenter(factor) {
    const centerKm = this.toKm(this.cssWidth * 0.5, this.cssHeight * 0.5);
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));
    this.updateScales();
    this.panX = centerKm.x - ((this.cssWidth * 0.5) / this.effScaleX);
    this.panY = centerKm.y - ((this.cssHeight * 0.5) / this.effScaleY);
  }

  centerTheater() {
    const cfg = window.CONFIG;
    if (!cfg || !cfg.THEATER_WIDTH_KM || !cfg.THEATER_HEIGHT_KM) {
      throw new Error('CONFIG theater dimensions must be loaded before centerTheater.');
    }
    this.centerOnKm(cfg.THEATER_WIDTH_KM * 0.5, cfg.THEATER_HEIGHT_KM * 0.5);
    this.trackingUnit = null;
  }

  resetCamera() {
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.trackingUnit = null;
    this.updateScales();
    this.centerTheater();
  }

  centerOnKm(kmX, kmY) {
    this.updateScales();
    this.panX = kmX - ((this.cssWidth * 0.5) / this.effScaleX);
    this.panY = kmY - ((this.cssHeight * 0.5) / this.effScaleY);
  }

  trackActiveCraft(activeUnit) {
    if (activeUnit) {
      this.trackingUnit = activeUnit;
      this.centerOnKm(activeUnit.x, activeUnit.y);
    }
  }
}

window.RadarCameraController = RadarCameraController;
