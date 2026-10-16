/**
 * AIRSPACE STANDOFF: Theater Traffic, Weather Clouds & Atmosphere Generation
 * Procedural clouds, civilian flights, radar reflections, and dynamic wave reinforcements.
 */

class SimulationTrafficSystem {
  static createClouds(cloudCoverage) {
    const weatherClouds = [];
    const rng = window.PRNG.create(Date.now() ^ ((performance.now() * 1000) | 0));

    const coverageCounts = { CLEAR: 0, LIGHT: 2, SCATTERED: 4, DENSE: 5 };
    const configuredCount = coverageCounts[cloudCoverage];
    const roll = rng.next();
    const count = Number.isFinite(configuredCount) ? configuredCount : (roll < 0.15 ? 2 : (roll < 0.70 ? 3 : (roll < 0.92 ? 4 : 5)));
    const sizeProfiles = [{ rxMin: 25, rxMax: 32, ryMin: 16, ryMax: 22 }, { rxMin: 24, rxMax: 32, ryMin: 12, ryMax: 16 }, { rxMin: 18, rxMax: 25, ryMin: 13, ryMax: 18 }];
    const rawSectors = [
      { minX: 25, maxX: 65, minY: 18, maxY: 45 }, { minX: 85, maxX: 125, minY: 18, maxY: 45 },
      { minX: 55, maxX: 95, minY: 35, maxY: 65 }, { minX: 25, maxX: 65, minY: 55, maxY: 82 }, { minX: 85, maxX: 125, minY: 55, maxY: 82 }
    ];
    const sectors = rng.shuffle([...rawSectors]);

    for (let i = 0; i < count; i++) {
      const sec = sectors[i % sectors.length];
      const p = sizeProfiles[i % sizeProfiles.length];
      const cx = rng.range(sec.minX, sec.maxX);
      const cy = rng.range(sec.minY, sec.maxY);
      const rx = rng.range(p.rxMin, p.rxMax);
      const ry = rng.range(p.ryMin, p.ryMax);
      const angle = rng.range(0, Math.PI * 2);
      const spd = rng.range(0.15, 0.40);
      weatherClouds.push(new WeatherCloud(cx, cy, rx, ry, Math.cos(angle) * spd, Math.sin(angle) * spd * 0.6));
    }
    return weatherClouds;
  }

  static createGhostContact(weatherClouds) {
    if (!weatherClouds || weatherClouds.length === 0) return null;
    const targetCloud = window.PRNG.pick(weatherClouds);
    const gx = targetCloud.x + window.PRNG.range(-targetCloud.rx * 0.4, targetCloud.rx * 0.4);
    const gy = targetCloud.y + window.PRNG.range(-targetCloud.ry * 0.4, targetCloud.ry * 0.4);
    const hdg = Math.PI + window.PRNG.range(-0.2, 0.2);
    const spd = window.PRNG.range(0.80, 0.95);
    const altFt = 24000 + window.PRNG.int(0, 7) * 1000;
    return new GhostContact(gx, gy, hdg, spd, altFt);
  }

  static createCivilianFlight() {
    const pool = window.CIVILIAN_FLIGHTS || [{ code: 'CIV-401', name: 'Commercial Flight', speedMach: 0.78, altFt: 36000, rcs: 25.0 }];
    const data = window.PRNG.pick(pool);
    const fromLeft = window.PRNG.boolean();
    const w = window.CONFIG.THEATER_WIDTH_KM || 150.0;
    const h = window.CONFIG.THEATER_HEIGHT_KM || 100.0;
    const yCoord = window.PRNG.range(20, h - 20);
    return new CivilianAirliner(data, fromLeft ? -5 : (w + 5), yCoord, fromLeft ? 0.05 : (Math.PI - 0.05));
  }
}

window.SimulationTrafficSystem = SimulationTrafficSystem;