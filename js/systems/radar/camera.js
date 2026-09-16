/**
 * APEX VECTOR // Radar Camera Controller (Pan, Zoom & Viewport Transforms)
 * Viewport starts centered in the middle of the theater (75km, 50km).
 * Declutter starts ON on phones, OFF on desktop. Ground targets start always OFF.
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

    // Declutter on at start in phones, off at start in desktop
    const isPhone = (typeof window !== 'undefined') && (window.innerWidth <= 1024);
    this.declutterMode = isPhone;

    // Ground targets always off at start
    this.showGroundTargets = false;

    this.centerTheater();
  }

  resize(w, h) {
    this.cssWidth = w;
    this.cssHeight = h;
  }

  toggleGroundTargets() {
    this.showGroundTargets = !this.showGroundTargets;
    return this.showGroundTargets;
  }

  toScreen(kmX, kmY) {
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    const effScaleX = (this.cssWidth / cfg.THEATER_WIDTH_KM) * this.zoom;
    const effScaleY = (this.cssHeight / cfg.THEATER_HEIGHT_KM) * this.zoom;
    return {
      x: (kmX - this.panX) * effScaleX,
      y: (kmY - this.panY) * effScaleY
    };
  }

  toKm(screenX, screenY) {
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    const effScaleX = (this.cssWidth / cfg.THEATER_WIDTH_KM) * this.zoom;
    const effScaleY = (this.cssHeight / cfg.THEATER_HEIGHT_KM) * this.zoom;
    return {
      x: (screenX / effScaleX) + this.panX,
      y: (screenY / effScaleY) + this.panY
    };
  }

  zoomAtCenter(factor) {
    const centerKm = this.toKm(this.cssWidth / 2, this.cssHeight / 2);
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    const effScaleX = (this.cssWidth / cfg.THEATER_WIDTH_KM) * this.zoom;
    const effScaleY = (this.cssHeight / cfg.THEATER_HEIGHT_KM) * this.zoom;
    this.panX = centerKm.x - ((this.cssWidth / 2) / effScaleX);
    this.panY = centerKm.y - ((this.cssHeight / 2) / effScaleY);
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
    this.centerTheater();
  }

  centerOnKm(kmX, kmY) {
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    const effScaleX = (this.cssWidth / cfg.THEATER_WIDTH_KM) * this.zoom;
    const effScaleY = (this.cssHeight / cfg.THEATER_HEIGHT_KM) * this.zoom;
    this.panX = kmX - ((this.cssWidth / 2) / effScaleX);
    this.panY = kmY - ((this.cssHeight / 2) / effScaleY);
  }

  trackActiveCraft(activeUnit) {
    if (activeUnit) {
      this.trackingUnit = activeUnit;
      this.centerOnKm(activeUnit.x, activeUnit.y);
    }
  }
}

window.RadarCameraController = RadarCameraController;
