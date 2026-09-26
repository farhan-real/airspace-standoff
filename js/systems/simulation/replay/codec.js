/**
 * AIRSPACE STANDOFF: Sortie Replay Frame Delta Codec & Storage Packer
 */

class AfterActionReplayCodec {
  static captureFrame(sim, force = false) {
    const lastFrame = sim.replaySnapshots[sim.replaySnapshots.length - 1];
    if (!force && lastFrame && sim.elapsedTimeSec - lastFrame.time < 1.0) return;

    const snapshotAircraft = (aircraft) => ({
      id: aircraft.id, team: aircraft.team, x: aircraft.x, y: aircraft.y,
      heading: aircraft.heading, speed: aircraft.speed, hp: aircraft.hp, maxHp: aircraft.maxHp,
      altFt: aircraft.altFt, callsign: aircraft.callsign,
      model: aircraft.spec ? (aircraft.spec.name || aircraft.spec.id) : 'AIRCRAFT',
      category: aircraft.spec ? aircraft.spec.category : 'MULTIROLE',
      isAce: Boolean(aircraft.isAce), isFlightLead: Boolean(aircraft.isFlightLead),
      isCoffin: Boolean(aircraft.isCoffin), isRTB: Boolean(aircraft.isRTB),
      identified: Boolean(aircraft.isIdentifiedBy ? aircraft.isIdentifiedBy('friendly') : aircraft.isIdentified)
    });

    const frame = {
      time: sim.elapsedTimeSec,
      alliedAircraft: sim.game.alliedAircraft.map(snapshotAircraft),
      hostileAircraft: sim.game.hostileAircraft.map(snapshotAircraft),
      surfaceUnits: sim.game.surfaceUnits.map(unit => ({
        id: unit.id, team: unit.team, type: unit.type, x: unit.x, y: unit.y,
        hp: unit.hp, maxHp: unit.maxHp, name: unit.name, isIndestructible: Boolean(unit.isIndestructible)
      })),
      missiles: sim.game.missiles.filter(m => !m.isDead).map(m => ({
        id: m.id, team: m.team, x: m.x, y: m.y, heading: m.heading,
        weapon: m.weapon ? (m.weapon.name || m.weapon.id) : 'MISSILE',
        stage: m.stage, speed: m.speed, active: m.active,
        trail: (m.trail || []).slice(0, 8).map(pt => ({ x: pt.x, y: pt.y }))
      })),
      civilianTraffic: sim.civilianTraffic.map(civ => ({
        id: civ.id, x: civ.x, y: civ.y, heading: civ.heading,
        speed: civ.speed, hp: civ.hp, flightCode: civ.flightCode, identified: Boolean(civ.isIdentified)
      })),
      clouds: sim.weatherClouds.map(c => ({ x: c.x, y: c.y, rx: c.rx, ry: c.ry })),
      decoys: sim.decoyDrones.map(d => ({
        id: d.id, team: d.team, x: d.x, y: d.y, heading: d.heading, speed: d.speed, hp: d.hp, model: d.mirroredModel || 'DECOY'
      }))
    };

    if (lastFrame && Math.abs(lastFrame.time - frame.time) < 0.001) {
      sim.replaySnapshots[sim.replaySnapshots.length - 1] = frame;
    } else {
      sim.replaySnapshots.push(frame);
      if (sim.replaySnapshots.length > 900) sim.replaySnapshots.shift();
    }
  }

  static encode(frames, targetBytes = 90 * 1024) {
    if (!Array.isArray(frames) || frames.length === 0) return null;

    const q = (value, factor = 10) => Number.isFinite(value) ? Math.round(value * factor) : 0;
    const strides = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 90, 120, 180, 300, 600];
    let best = null;

    for (const stride of strides) {
      const definitions = { aircraft: [], surfaces: [], missiles: [], civilians: [], decoys: [] };
      const indexes = { aircraft: new Map(), surfaces: new Map(), missiles: new Map(), civilians: new Map(), decoys: new Map() };

      const addDefinition = (group, entity, definition) => {
        const key = entity && entity.id !== undefined ? String(entity.id) : `${group}:${definitions[group].length}`;
        if (!indexes[group].has(key)) {
          indexes[group].set(key, definitions[group].length);
          definitions[group].push(definition(entity));
        }
        return indexes[group].get(key);
      };

      const packEntities = (list, group, pack) => (list || []).map((entity, index) => pack(entity, addDefinition(group, entity, pack.definition), index));
      const packAircraft = (entity, definitionIndex, index) => [
        definitionIndex, q(entity.x), q(entity.y), q(entity.heading, 1000), q(entity.speed, 100),
        q(entity.hp), q(entity.altFt, 1), (entity.isRTB ? 1 : 0) | (entity.identified ? 2 : 0),
        index
      ];
      packAircraft.definition = (entity) => [
        entity.callsign || '', entity.model || 'AIRCRAFT', entity.category || 'MULTIROLE',
        q(entity.maxHp), entity.team || 'hostile', entity.isAce ? 1 : 0,
        entity.isFlightLead ? 1 : 0, entity.isCoffin ? 1 : 0
      ];

      const groupConfig = {
        surfaces: { key: 'surfaceUnits', pack: (e, defIdx, i) => [defIdx, q(e.x), q(e.y), q(e.hp), i], definition: e => [e.team || 'hostile', e.type || '', e.name || '', q(e.maxHp), e.isIndestructible ? 1 : 0] },
        missiles: { key: 'missiles', pack: (e, defIdx, i) => [defIdx, q(e.x), q(e.y), q(e.heading, 1000), q(e.speed, 100), i], definition: e => [e.team || 'hostile', e.weapon || 'MISSILE'] },
        civilians: { key: 'civilianTraffic', pack: (e, defIdx, i) => [defIdx, q(e.x), q(e.y), q(e.heading, 1000), q(e.speed, 100), q(e.hp), e.identified ? 1 : 0, i], definition: e => [e.flightCode || 'CIVILIAN'] },
        decoys: { key: 'decoys', pack: (e, defIdx, i) => [defIdx, q(e.x), q(e.y), q(e.heading, 1000), q(e.speed, 100), q(e.hp), i], definition: e => [e.team || 'friendly', e.model || 'DECOY'] }
      };

      const sampleIndexes = [];
      for (let i = 0; i < frames.length; i += stride) sampleIndexes.push(i);
      if (sampleIndexes[sampleIndexes.length - 1] !== frames.length - 1) sampleIndexes.push(frames.length - 1);
      const packedFrames = sampleIndexes.map(index => {
        const frame = frames[index] || {};
        const row = [q(frame.time, 10),
          packEntities(frame.alliedAircraft, 'aircraft', packAircraft),
          packEntities(frame.hostileAircraft, 'aircraft', packAircraft)];
        Object.entries(groupConfig).forEach(([group, config]) => {
          row.push(packEntities(frame[config.key], group, Object.assign((entity, defIdx, entityIndex) => config.pack(entity, defIdx, entityIndex), { definition: config.definition })));
        });
        row.push((frame.clouds || []).map(cloud => [q(cloud.x), q(cloud.y), q(cloud.rx), q(cloud.ry)]));
        return row;
      });
      const candidate = { v: 1, stride, definitions, frames: packedFrames };
      const size = JSON.stringify(candidate).length;
      if (!best || size < best.size) best = { data: candidate, size };
      if (size <= targetBytes) return candidate;
    }
    return best ? best.data : null;
  }

  static decode(replay) {
    if (!replay || replay.v !== 1 || !Array.isArray(replay.frames) || !replay.definitions) return [];
    const defs = replay.definitions;
    const unpack = (rows, definitions, build) => (rows || []).map((row, idx) => {
      const definition = definitions[row[0]] || [];
      return build(definition, row, idx);
    });
    return replay.frames.map(row => {
      const aircraft = (rows, groupTag) => unpack(rows, defs.aircraft || [], (d, r, idx) => ({
        id: r[8] !== undefined ? `${groupTag}_${r[8]}` : `${groupTag}_${idx}`,
        callsign: d[0], model: d[1], category: d[2], maxHp: d[3] / 10,
        team: d[4], isAce: Boolean(d[5]), isFlightLead: Boolean(d[6]), isCoffin: Boolean(d[7]),
        x: r[1] / 10, y: r[2] / 10, heading: r[3] / 1000, speed: r[4] / 100,
        hp: r[5] / 10, altFt: r[6], isRTB: Boolean(r[7] & 1), identified: Boolean(r[7] & 2)
      }));
      const surfaces = unpack(row[3], defs.surfaces || [], (d, r, idx) => ({
        id: r[4] !== undefined ? `SURF_${r[4]}` : `SURF_${idx}`,
        team: d[0], type: d[1], name: d[2], maxHp: d[3] / 10,
        isIndestructible: Boolean(d[4]), x: r[1] / 10, y: r[2] / 10, hp: r[3] / 10
      }));
      const missiles = unpack(row[4], defs.missiles || [], (d, r, idx) => ({
        id: r[5] !== undefined ? `MSL_${r[5]}` : `MSL_${idx}`,
        team: d[0], weapon: d[1], x: r[1] / 10, y: r[2] / 10,
        heading: r[3] / 1000, speed: r[4] / 100
      }));
      const civilians = unpack(row[5], defs.civilians || [], (d, r, idx) => ({
        id: r[7] !== undefined ? `CIV_${r[7]}` : `CIV_${idx}`,
        flightCode: d[0], x: r[1] / 10, y: r[2] / 10,
        heading: r[3] / 1000, speed: r[4] / 100, hp: r[5] / 10, identified: Boolean(r[6])
      }));
      const decoys = unpack(row[6], defs.decoys || [], (d, r, idx) => ({
        id: r[6] !== undefined ? `DECOY_${r[6]}` : `DECOY_${idx}`,
        team: d[0], model: d[1], x: r[1] / 10, y: r[2] / 10,
        heading: r[3] / 1000, speed: r[4] / 100, hp: r[5] / 10
      }));
      return {
        time: row[0] / 10, alliedAircraft: aircraft(row[1], 'blue'), hostileAircraft: aircraft(row[2], 'red'),
        surfaceUnits: surfaces, missiles, civilianTraffic: civilians,
        clouds: (row[7] || []).map(c => ({ x: c[0] / 10, y: c[1] / 10, rx: c[2] / 10, ry: c[3] / 10 })),
        decoys
      };
    });
  }
}

window.AfterActionReplayCodec = AfterActionReplayCodec;