/**
 * AIRSPACE STANDOFF: Weather Cloud Entity
 */

class WeatherCloud {
  constructor(x, y, rx, ry, driftVx, driftVy) {
    this.id = 'CLOUD_' + Math.random().toString(36).substr(2, 6);
    this.x = x;
    this.y = y;
    this.rx = rx;
    this.ry = ry;
    this.vx = driftVx;
    this.vy = driftVy;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) ? window.CONFIG.THEATER_WIDTH_KM : 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) ? window.CONFIG.THEATER_HEIGHT_KM : 100.0;
    if (this.x < -this.rx) this.x = w + this.rx;
    if (this.x > w + this.rx) this.x = -this.rx;
    if (this.y < -this.ry) this.y = h + this.ry;
    if (this.y > h + this.ry) this.y = -this.ry;
  }

  containsPoint(px, py) {
    const dx = (px - this.x) / this.rx;
    const dy = (py - this.y) / this.ry;
    return (dx * dx + dy * dy) <= 1.0;
  }

  intersectsSegment(x1, y1, x2, y2) {
    if (this.containsPoint(x1, y1) || this.containsPoint(x2, y2)) return true;

    const u1 = (x1 - this.x) / this.rx;
    const v1 = (y1 - this.y) / this.ry;
    const u2 = (x2 - this.x) / this.rx;
    const v2 = (y2 - this.y) / this.ry;

    const du = u2 - u1;
    const dv = v2 - v1;
    const lenSq = du * du + dv * dv;
    if (lenSq < 1e-9) return false;

    const t = -(u1 * du + v1 * dv) / lenSq;
    if (t <= 0 || t >= 1) return false;

    const cu = u1 + t * du;
    const cv = v1 + t * dv;
    return (cu * cu + cv * cv) <= 1.0;
  }
}

window.WeatherCloud = WeatherCloud;