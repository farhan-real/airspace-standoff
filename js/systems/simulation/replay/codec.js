/**
 * AIRSPACE STANDOFF: Sortie Replay Frame Delta Codec & Storage Packer
 */

class AfterActionReplayCodec {
  static captureFrame(sim, force = false) {
    const lastFrame = sim.replaySnapshots[sim.replaySnapshots.length - 1];
    if (!force && lastFrame && sim.elapsedTimeSec - lastFrame.time < 0.35) return;

    const snapshotAircraft = (aircraft) => ({
      id: aircraft.id,
      team: aircraft.team,
      x: aircraft.x,
      y: aircraft.y,
      heading: aircraft.heading,
      speed: aircraft.speed,
      hp: aircraft.hp,
      maxHp: aircraft.maxHp,
      altFt: aircraft.altFt,
      callsign: aircraft.callsign,
      model: aircraft.spec ? (aircraft.spec.name || aircraft.spec.id) : 'AIRCRAFT',
      category: aircraft.spec ? aircraft.spec.category : 'MULTIROLE',
      isAce: Boolean(aircraft.isAce),
      isFlightLead: Boolean(aircraft.isFlightLead),
      isCoffin: Boolean(aircraft.isCoffin),
      isRTB: Boolean(aircraft.isRTB),
      identified: Boolean(aircraft.isIdentifiedBy ? aircraft.isIdentifiedBy('friendly') : aircraft.isIdentified)
    });

    const frame = {
      time: sim.elapsedTimeSec,
      isKeyFrame: Boolean(force),
      alliedAircraft: sim.game.alliedAircraft.map(snapshotAircraft),
      hostileAircraft: sim.game.hostileAircraft.map(snapshotAircraft),
      surfaceUnits: sim.game.surfaceUnits.map(unit => ({
        id: unit.id, team: unit.team, type: unit.type, x: unit.x, y: unit.y,
        hp: unit.hp, maxHp: unit.maxHp, name: unit.name, isIndestructible: Boolean(unit.isIndestructible)
      })),
      missiles: sim.game.missiles.filter(m => !m.isDead).map(m => ({
        id: m.id, team: m.team, x: m.x, y: m.y, heading: m.heading,
        weapon: m.weapon ? (m.weapon.name || m.weapon.id) : 'MISSILE',
        stage: m.stage, speed: m.speed, active: m.active
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
      if (sim.replaySnapshots.length > 1500) sim.replaySnapshots.shift();
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

      const packEntities = (list, group, pack) => (list || []).map((entity) => pack(entity, addDefinition(group, entity, pack.definition)));
      const packAircraft = (entity, defIdx) => [
        defIdx, q(entity.x), q(entity.y), q(entity.heading, 1000), q(entity.speed, 100),
        q(entity.hp), q(entity.altFt, 1), (entity.isRTB ? 1 : 0) | (entity.identified ? 2 : 0)
      ];
      packAircraft.definition = (entity) => [
        entity.id || '', entity.callsign || '', entity.model || 'AIRCRAFT', entity.category || 'MULTIROLE',
        q(entity.maxHp), entity.team || 'hostile', entity.isAce ? 1 : 0,
        entity.isFlightLead ? 1 : 0, entity.isCoffin ? 1 : 0
      ];

      const groupConfig = {
        surfaces: { key: 'surfaceUnits', pack: (e, defIdx) => [defIdx, q(e.x), q(e.y), q(e.hp)], definition: e => [e.id || '', e.team || 'hostile', e.type || '', e.name || '', q(e.maxHp), e.isIndestructible ? 1 : 0] },
        missiles: { key: 'missiles', pack: (e, defIdx) => [defIdx, q(e.x), q(e.y), q(e.heading, 1000), q(e.speed, 100)], definition: e => [e.id || '', e.team || 'hostile', e.weapon || 'MISSILE'] },
        civilians: { key: 'civilianTraffic', pack: (e, defIdx) => [defIdx, q(e.x), q(e.y), q(e.heading, 1000), q(e.speed, 100), q(e.hp), e.identified ? 1 : 0], definition: e => [e.id || '', e.flightCode || 'CIVILIAN'] },
        decoys: { key: 'decoys', pack: (e, defIdx) => [defIdx, q(e.x), q(e.y), q(e.heading, 1000), q(e.speed, 100), q(e.hp)], definition: e => [e.id || '', e.team || 'friendly', e.model || 'DECOY'] }
      };

      const sampleIndexes = [];
      for (let i = 0; i < frames.length; i++) {
        if (i % stride === 0 || frames[i].isKeyFrame || i === frames.length - 1) {
          sampleIndexes.push(i);
        }
      }

      const packedFrames = sampleIndexes.map(index => {
        const frame = frames[index] || {};
        const row = [
          q(frame.time, 10),
          packEntities(frame.alliedAircraft, 'aircraft', packAircraft),
          packEntities(frame.hostileAircraft, 'aircraft', packAircraft)
        ];
        Object.entries(groupConfig).forEach(([group, config]) => {
          row.push(packEntities(frame[config.key], group, Object.assign((entity, defIdx) => config.pack(entity, defIdx), { definition: config.definition })));
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
      const aircraft = (rows, groupTag) => unpack(rows, defs.aircraft || [], (d, r, idx) => {
        const isV1FullDef = (d.length >= 9);
        const offset = isV1FullDef ? 1 : 0;
        const assignedId = isV1FullDef ? (d[0] || `${groupTag}_${r[0] !== undefined ? r[0] : idx}`) : `${groupTag}_${r[0] !== undefined ? r[0] : idx}`;
        const team = isV1FullDef ? (d[5] || (groupTag === 'blue' ? 'friendly' : 'hostile')) : (groupTag === 'blue' ? 'friendly' : 'hostile');

        return {
          id: assignedId,
          callsign: d[offset] || 'PILOT',
          model: d[offset + 1] || 'AIRCRAFT',
          category: d[offset + 2] || 'MULTIROLE',
          maxHp: (d[offset + 3] || 40) / 10,
          team: team,
          isAce: Boolean(d[offset + 5]),
          isFlightLead: Boolean(d[offset + 6]),
          isCoffin: Boolean(d[offset + 7]),
          x: r[1] / 10,
          y: r[2] / 10,
          heading: r[3] / 1000,
          speed: r[4] / 100,
          hp: r[5] / 10,
          altFt: r[6],
          isRTB: Boolean(r[7] & 1),
          identified: Boolean(r[7] & 2)
        };
      });

      const surfaces = unpack(row[3], defs.surfaces || [], (d, r, idx) => {
        const hasId = typeof d[0] === 'string' && d[0].startsWith('SURF_');
        const offset = hasId ? 1 : 0;
        return {
          id: hasId ? d[0] : `SURF_${r[0] !== undefined ? r[0] : idx}`,
          team: d[offset] || 'hostile',
          type: d[offset + 1] || 'INSTALLATION',
          name: d[offset + 2] || '',
          maxHp: (d[offset + 3] || 60) / 10,
          isIndestructible: Boolean(d[offset + 4]),
          x: r[1] / 10,
          y: r[2] / 10,
          hp: r[3] / 10
        };
      });

      const missiles = unpack(row[4], defs.missiles || [], (d, r, idx) => {
        const hasId = typeof d[0] === 'string' && d[0].startsWith('MSL_');
        const offset = hasId ? 1 : 0;
        return {
          id: hasId ? d[0] : `MSL_${r[0] !== undefined ? r[0] : idx}`,
          team: d[offset] || 'hostile',
          weapon: d[offset + 1] || 'MISSILE',
          x: r[1] / 10,
          y: r[2] / 10,
          heading: r[3] / 1000,
          speed: r[4] / 100
        };
      });

      const civilians = unpack(row[5], defs.civilians || [], (d, r, idx) => {
        const hasId = typeof d[0] === 'string' && d[0].startsWith('CIV_');
        const offset = hasId ? 1 : 0;
        return {
          id: hasId ? d[0] : `CIV_${r[0] !== undefined ? r[0] : idx}`,
          flightCode: d[offset] || 'CIVILIAN',
          x: r[1] / 10,
          y: r[2] / 10,
          heading: r[3] / 1000,
          speed: r[4] / 100,
          hp: r[5] / 10,
          identified: Boolean(r[6])
        };
      });

      const decoys = unpack(row[6], defs.decoys || [], (d, r, idx) => {
        const hasId = typeof d[0] === 'string' && d[0].startsWith('DECOY_');
        const offset = hasId ? 1 : 0;
        return {
          id: hasId ? d[0] : `DECOY_${r[0] !== undefined ? r[0] : idx}`,
          team: d[offset] || 'friendly',
          model: d[offset + 1] || 'DECOY',
          x: r[1] / 10,
          y: r[2] / 10,
          heading: r[3] / 1000,
          speed: r[4] / 100,
          hp: r[5] / 10
        };
      });

      return {
        time: row[0] / 10,
        alliedAircraft: aircraft(row[1], 'blue'),
        hostileAircraft: aircraft(row[2], 'red'),
        surfaceUnits: surfaces,
        missiles,
        civilianTraffic: civilians,
        clouds: (row[7] || []).map(c => ({ x: c[0] / 10, y: c[1] / 10, rx: c[2] / 10, ry: c[3] / 10 })),
        decoys
      };
    });
  }
}

window.AfterActionReplayCodec = AfterActionReplayCodec;