/**
 * AIRSPACE STANDOFF: Theater Traffic, Weather Clouds & Atmosphere Generation
 * Procedural clouds, civilian flights, radar reflections, and dynamic wave reinforcements.
 */

class SimulationTrafficSystem {
  static createClouds(cloudCoverage) {
    const weatherClouds = [];
    const rng = (window.PRNG && typeof window.PRNG.create === 'function')
      ? window.PRNG.create(Date.now() ^ ((performance.now() * 1000) | 0))
      : (window.PRNG || Math);

    const coverageCounts = { CLEAR: 0, LIGHT: 2, SCATTERED: 4, DENSE: 5 };
    const configuredCount = coverageCounts[cloudCoverage];
    const roll = rng.next ? rng.next() : Math.random();
    const count = Number.isFinite(configuredCount) ? configuredCount : (roll < 0.15 ? 2 : (roll < 0.70 ? 3 : (roll < 0.92 ? 4 : 5)));
    const sizeProfiles = [{ rxMin: 25, rxMax: 32, ryMin: 16, ryMax: 22 }, { rxMin: 24, rxMax: 32, ryMin: 12, ryMax: 16 }, { rxMin: 18, rxMax: 25, ryMin: 13, ryMax: 18 }];
    const rawSectors = [
      { minX: 25, maxX: 65, minY: 18, maxY: 45 }, { minX: 85, maxX: 125, minY: 18, maxY: 45 },
      { minX: 55, maxX: 95, minY: 35, maxY: 65 }, { minX: 25, maxX: 65, minY: 55, maxY: 82 }, { minX: 85, maxX: 125, minY: 55, maxY: 82 }
    ];
    const sectors = rng.shuffle ? rng.shuffle([...rawSectors]) : rawSectors.sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
      const sec = sectors[i % sectors.length];
      const p = sizeProfiles[i % sizeProfiles.length];
      const cx = rng.range ? rng.range(sec.minX, sec.maxX) : (sec.minX + Math.random() * (sec.maxX - sec.minX));
      const cy = rng.range ? rng.range(sec.minY, sec.maxY) : (sec.minY + Math.random() * (sec.maxY - sec.minY));
      const rx = rng.range ? rng.range(p.rxMin, p.rxMax) : (p.rxMin + Math.random() * (p.rxMax - p.rxMin));
      const ry = rng.range ? rng.range(p.ryMin, p.ryMax) : (p.ryMin + Math.random() * (p.ryMax - p.ryMin));
      const angle = rng.range ? rng.range(0, Math.PI * 2) : (Math.random() * Math.PI * 2);
      const spd = rng.range ? rng.range(0.15, 0.40) : (0.15 + Math.random() * 0.25);
      weatherClouds.push(new WeatherCloud(cx, cy, rx, ry, Math.cos(angle) * spd, Math.sin(angle) * spd * 0.6));
    }
    return weatherClouds;
  }

  static createGhostContact(weatherClouds) {
    if (!weatherClouds || weatherClouds.length === 0) return null;
    const rng = window.PRNG || Math;
    const targetCloud = rng.pick ? rng.pick(weatherClouds) : weatherClouds[Math.floor(Math.random() * weatherClouds.length)];
    const gx = targetCloud.x + (rng.range ? rng.range(-targetCloud.rx * 0.4, targetCloud.rx * 0.4) : (Math.random() * targetCloud.rx * 0.8 - targetCloud.rx * 0.4));
    const gy = targetCloud.y + (rng.range ? rng.range(-targetCloud.ry * 0.4, targetCloud.ry * 0.4) : (Math.random() * targetCloud.ry * 0.8 - targetCloud.ry * 0.4));
    const hdg = Math.PI + (rng.range ? rng.range(-0.2, 0.2) : (Math.random() * 0.4 - 0.2));
    const spd = rng.range ? rng.range(0.80, 0.95) : (0.80 + Math.random() * 0.15);
    const altFt = 24000 + (rng.int ? rng.int(0, 7) : Math.floor(Math.random() * 8)) * 1000;
    return new GhostContact(gx, gy, hdg, spd, altFt);
  }

  static createCivilianFlight() {
    const rng = window.PRNG || Math;
    const pool = window.CIVILIAN_FLIGHTS || [{ code: 'CIV-401', name: 'Commercial Flight', speedMach: 0.78, altFt: 36000, rcs: 25.0 }];
    const data = rng.pick ? rng.pick(pool) : pool[Math.floor(Math.random() * pool.length)];
    const fromLeft = rng.boolean ? rng.boolean() : (Math.random() < 0.5);
    const w = (window.CONFIG && window.CONFIG.THEATER_WIDTH_KM) || 150.0;
    const h = (window.CONFIG && window.CONFIG.THEATER_HEIGHT_KM) || 100.0;
    const yCoord = rng.range ? rng.range(20, h - 20) : (20 + Math.random() * (h - 40));
    return new CivilianAirliner(data, fromLeft ? -5 : (w + 5), yCoord, fromLeft ? 0.05 : (Math.PI - 0.05));
  }
}

window.SimulationTrafficSystem = SimulationTrafficSystem;