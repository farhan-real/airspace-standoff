/**
 * AIRSPACE STANDOFF: Radar Camera Controller (Pan, Zoom & Viewport Transforms)
 * Viewport starts centered in the middle of the theater (75km, 50km).
 * Declutter starts ON by default on mobile and OFF by default on desktop.
 */

class RadarCameraController {
  constructor(canvas, cssWidth, cssHeight) {
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

    // Declutter is ON by default on mobile devices, and OFF by default on desktop
    const isMobile = (typeof window !== 'undefined') && (window.innerWidth <= 1024);
    this.declutterMode = isMobile;

    // Ground targets start OFF by default
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
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    const mapW = cfg.THEATER_WIDTH_KM || 150.0;
    const mapH = cfg.THEATER_HEIGHT_KM || 100.0;
    this.effScaleX = (this.cssWidth / mapW) * this.zoom;
    this.effScaleY = (this.cssHeight / mapH) * this.zoom;
  }

  toggleGroundTargets() {
    this.showGroundTargets = !this.showGroundTargets;
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
    const scaleX = this.effScaleX > 0 ? this.effScaleX : 1.0;
    const scaleY = this.effScaleY > 0 ? this.effScaleY : 1.0;
    return {
      x: (screenX / scaleX) + this.panX,
      y: (screenY / scaleY) + this.panY
    };
  }

  zoomAtCenter(factor) {
    const centerKm = this.toKm(this.cssWidth / 2, this.cssHeight / 2);
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));
    this.updateScales();
    this.panX = centerKm.x - ((this.cssWidth / 2) / this.effScaleX);
    this.panY = centerKm.y - ((this.cssHeight / 2) / this.effScaleY);
  }

  centerTheater() {
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    this.centerOnKm(cfg.THEATER_WIDTH_KM / 2, cfg.THEATER_HEIGHT_KM / 2);
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
    this.panX = kmX - ((this.cssWidth / 2) / this.effScaleX);
    this.panY = kmY - ((this.cssHeight / 2) / this.effScaleY);
  }

  trackActiveCraft(activeUnit) {
    if (activeUnit) {
      this.trackingUnit = activeUnit;
      this.centerOnKm(activeUnit.x, activeUnit.y);
    }
  }
}

window.RadarCameraController = RadarCameraController;