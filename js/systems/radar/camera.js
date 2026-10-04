/**
 * AIRSPACE STANDOFF: Radar Camera Controller (Smooth Pan, Zoom & Viewport Transforms)
 * Features smooth exponential-decay interpolation for zooming, panning, and target tracking.
 */

class RadarCameraController {
  constructor(canvas, cssWidth, cssHeight) {
    this.canvas = canvas;
    this.cssWidth = cssWidth;
    this.cssHeight = cssHeight;
    this.zoom = 1.0;
    this.targetZoom = 1.0;
    this.minZoom = 0.65;
    this.maxZoom = 4.0;
    this.panX = 0;
    this.panY = 0;
    this.targetPanX = 0;
    this.targetPanY = 0;
    this.trackingUnit = null;

    this.effScaleX = 1.0;
    this.effScaleY = 1.0;

    const isMobile = (typeof window !== 'undefined') && (window.innerWidth <= 1024);
    this.declutterMode = isMobile;
    this.showGroundTargets = false;

    this.updateScales();
    this.centerTheater(true);
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

  zoomAt(screenX, screenY, factor) {
    const anchorKm = this.toKm(screenX, screenY);
    const nextZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.targetZoom * factor));
    if (Math.abs(nextZoom - this.targetZoom) < 0.0001) return;

    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    const nextScaleX = (this.cssWidth / cfg.THEATER_WIDTH_KM) * nextZoom;
    const nextScaleY = (this.cssHeight / cfg.THEATER_HEIGHT_KM) * nextZoom;

    this.targetZoom = nextZoom;
    this.targetPanX = anchorKm.x - (screenX / nextScaleX);
    this.targetPanY = anchorKm.y - (screenY / nextScaleY);
  }

  zoomAtCenter(factor) {
    this.zoomAt(this.cssWidth / 2, this.cssHeight / 2, factor);
  }

  centerTheater(immediate = false) {
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    this.centerOnKm(cfg.THEATER_WIDTH_KM / 2, cfg.THEATER_HEIGHT_KM / 2, immediate);
    this.trackingUnit = null;
  }

  resetCamera() {
    this.targetZoom = 1.0;
    this.trackingUnit = null;
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    this.centerOnKm(cfg.THEATER_WIDTH_KM / 2, cfg.THEATER_HEIGHT_KM / 2, false);
  }

  centerOnKm(kmX, kmY, immediate = false) {
    const cfg = window.CONFIG || { THEATER_WIDTH_KM: 150.0, THEATER_HEIGHT_KM: 100.0 };
    const scaleX = (this.cssWidth / cfg.THEATER_WIDTH_KM) * this.targetZoom;
    const scaleY = (this.cssHeight / cfg.THEATER_HEIGHT_KM) * this.targetZoom;

    const targetX = kmX - ((this.cssWidth / 2) / scaleX);
    const targetY = kmY - ((this.cssHeight / 2) / scaleY);

    this.targetPanX = targetX;
    this.targetPanY = targetY;

    if (immediate) {
      this.panX = targetX;
      this.panY = targetY;
      this.updateScales();
    }
  }

  trackActiveCraft(activeUnit) {
    if (activeUnit) {
      this.trackingUnit = activeUnit;
      this.centerOnKm(activeUnit.x, activeUnit.y, false);
    }
  }

  update(dt = 0.016) {
    const zoomDiff = this.targetZoom - this.zoom;
    if (Math.abs(zoomDiff) > 0.0005) {
      this.zoom += zoomDiff * Math.min(1.0, 14.0 * dt);
      this.updateScales();
    } else if (this.zoom !== this.targetZoom) {
      this.zoom = this.targetZoom;
      this.updateScales();
    }

    if (this.trackingUnit) {
      if (this.trackingUnit.hp > 0.05) {
        const targetX = this.trackingUnit.x - ((this.cssWidth / 2) / this.effScaleX);
        const targetY = this.trackingUnit.y - ((this.cssHeight / 2) / this.effScaleY);
        this.targetPanX = targetX;
        this.targetPanY = targetY;
      } else {
        this.trackingUnit = null;
      }
    }

    const panXDiff = this.targetPanX - this.panX;
    const panYDiff = this.targetPanY - this.panY;
    if (Math.abs(panXDiff) > 0.005 || Math.abs(panYDiff) > 0.005) {
      const rate = Math.min(1.0, 14.0 * dt);
      this.panX += panXDiff * rate;
      this.panY += panYDiff * rate;
    } else {
      this.panX = this.targetPanX;
      this.panY = this.targetPanY;
    }
  }
}

window.RadarCameraController = RadarCameraController;