/**
 * AIRSPACE STANDOFF: Theater Traffic, Weather Clouds & Atmosphere Generation
 * Procedural clouds, civilian flights, radar reflections, and dynamic wave reinforcements.
 */

class SimulationTrafficSystem {
  static createClouds(cloudCoverage) {
    const weatherClouds = [];
    let s = (Date.now() ^ ((performance.now() * 1000) | 0)) >>> 0;
    const rng = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const coverageCounts = { CLEAR: 0, LIGHT: 2, SCATTERED: 4, DENSE: 5 };
    const configuredCount = coverageCounts[cloudCoverage];
    const count = Number.isFinite(configuredCount) ? configuredCount : (rng() < 0.15 ? 2 : (rng() < 0.70 ? 3 : (rng() < 0.92 ? 4 : 5)));
    const sizeProfiles = [{ rxMin: 25, rxMax: 32, ryMin: 16, ryMax: 22 }, { rxMin: 24, rxMax: 32, ryMin: 12, ryMax: 16 }, { rxMin: 18, rxMax: 25, ryMin: 13, ryMax: 18 }];
    const sectors = [
      { minX: 25, maxX: 65, minY: 18, maxY: 45 }, { minX: 85, maxX: 125, minY: 18, maxY: 45 },
      { minX: 55, maxX: 95, minY: 35, maxY: 65 }, { minX: 25, maxX: 65, minY: 55, maxY: 82 }, { minX: 85, maxX: 125, minY: 55, maxY: 82 }
    ].sort(() => rng() - 0.5);

    for (let i = 0; i < count; i++) {
      const sec = sectors[i % sectors.length];
      const p = sizeProfiles[i % sizeProfiles.length];
      const cx = sec.minX + rng() * (sec.maxX - sec.minX);
      const cy = sec.minY + rng() * (sec.maxY - sec.minY);
      const rx = p.rxMin + rng() * (p.rxMax - p.rxMin);
      const ry = p.ryMin + rng() * (p.ryMax - p.ryMin);
      const angle = rng() * Math.PI * 2;
      const spd = 0.15 + rng() * 0.25;
      weatherClouds.push(new WeatherCloud(cx, cy, rx, ry, Math.cos(angle) * spd, Math.sin(angle) * spd * 0.6));
    }
    return weatherClouds;
  }

  static createGhostContact(weatherClouds) {
    if (!weatherClouds || weatherClouds.length === 0) return null;
    const targetCloud = weatherClouds[Math.floor(Math.random() * weatherClouds.length)];
    const gx = targetCloud.x + (Math.random() * targetCloud.rx * 0.8 - targetCloud.rx * 0.4);
    const gy = targetCloud.y + (Math.random() * targetCloud.ry * 0.8 - targetCloud.ry * 0.4);
    return new GhostContact(gx, gy, Math.PI + (Math.random() * 0.4 - 0.2), 0.80, 24000);
  }

  static createCivilianFlight() {
    const pool = window.CIVILIAN_FLIGHTS || [{ code: 'CIV-401', name: 'Commercial Flight', speedMach: 0.78, altFt: 36000, rcs: 25.0 }];
    const data = pool[Math.floor(Math.random() * pool.length)];
    const fromLeft = Math.random() < 0.5;
    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    return new CivilianAirliner(data, fromLeft ? -5 : (w + 5), 20 + Math.random() * (h - 40), fromLeft ? 0.05 : (Math.PI - 0.05));
  }
}

window.SimulationTrafficSystem = SimulationTrafficSystem;