/**
 * AIRSPACE STANDOFF // Tactical Weather Cloud Entity
 */

class WeatherCloud {
  constructor(x, y, rx, ry, driftVx, driftVy) {
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
}

window.WeatherCloud = WeatherCloud;