/**
 * AIRSPACE STANDOFF: Sortie Replay Playback and Tactical Map Renderer
 */

class AfterActionReplay {
  static show(game) {
    if (!this.instance) this.instance = new AfterActionReplay(document.getElementById('game-over-modal') || document);
    this.instance.open(game);
  }

  static stop() {
    if (this.instance) this.instance.pause();
    this.stopArchived();
  }

  static stopArchived() {
    if (this.archiveInstance) this.archiveInstance.pause();
    this.archiveInstance = null;
  }

  static showArchived(root, replay, events = []) {
    this.stopArchived();
    if (!root) return;
    this.archiveInstance = new AfterActionReplay(root);
    const frames = this.decode(replay);
    this.archiveInstance.openFrames(frames, events, false);
    if (frames.length === 0 && this.archiveInstance.status) {
      this.archiveInstance.status.textContent = 'REPLAY UNAVAILABLE - NO FRAMES IN THIS ARCHIVE';
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

  constructor(root = document) {
    this.root = root;
    this.canvas = root.querySelector('.aar-replay-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.slider = root.querySelector('.aar-replay-slider');
    this.clock = root.querySelector('.aar-replay-clock');
    this.playButton = root.querySelector('.aar-replay-play');
    this.speedButton = root.querySelector('.aar-replay-speed');
    this.eventList = root.querySelector('.aar-replay-events');
    this.status = root.querySelector('.aar-replay-status');
    this.game = null;
    this.frames = [];
    this.startTime = 0;
    this.endTime = 0;
    this.currentTime = 0;
    this.speed = 1;
    this.speedOptions = [0.5, 1, 2];
    this.isPlaying = false;
    this.animationFrameId = null;
    this.lastAnimationTime = 0;
    this.pixelWidth = 0;
    this.pixelHeight = 0;
    this.pixelRatio = 1;

    if (this.playButton) this.playButton.onclick = () => this.togglePlayback();
    if (this.speedButton) this.speedButton.onclick = () => this.cycleSpeed();
    if (this.slider) {
      this.slider.oninput = () => {
        this.pause();
        this.seek(Number(this.slider.value));
      };
    }
    const restartButton = root.querySelector('.aar-replay-restart');
    if (restartButton) restartButton.onclick = () => { this.pause(); this.seek(this.startTime); };
  }

  open(game) {
    this.game = game;
    this.openFrames((game && game.simulation && game.simulation.replaySnapshots) || [],
      (game && game.simulation && game.simulation.timelineEvents) || [], true);
  }

  openFrames(frames, events = [], liveReplay = false) {
    this.pause();
    this.game = null;
    this.frames = Array.isArray(frames) ? frames : [];
    this.startTime = this.frames.length ? this.frames[0].time : 0;
    this.endTime = this.frames.length ? this.frames[this.frames.length - 1].time : 0;
    this.currentTime = this.startTime;
    this.speed = 1;

    if (this.slider) {
      this.slider.min = String(this.startTime);
      this.slider.max = String(Math.max(this.endTime, this.startTime + 0.1));
      this.slider.step = '0.1';
      this.slider.value = String(this.currentTime);
      this.slider.disabled = this.frames.length < 2;
    }
    if (this.status) {
      this.status.textContent = this.frames.length > 1
        ? `${liveReplay ? 'SORTIE PLAYBACK' : 'ARCHIVED SORTIE PLAYBACK'} - DRAG THE TIMELINE OR SELECT AN EVENT`
        : 'NO REPLAY DATA WAS SAVED FOR THIS SORTIE';
    }
    this.updateButtons();
    this.renderEventJumps(events);
    this.drawAt(this.currentTime);
  }

  renderEventJumps(events) {
    if (!this.eventList) return;
    this.eventList.replaceChildren();
    const keyEvents = events
      .filter(event => event && ['kill', 'ace-kill', 'hit', 'roe_penalty'].includes(event.type))
      .map(event => ({ event, time: this.parseEventTime(event.time) }))
      .filter(item => Number.isFinite(item.time))
      .sort((a, b) => a.time - b.time)
      .slice(0, 12);

    if (keyEvents.length === 0) {
      const empty = document.createElement('span');
      empty.className = 'aar-replay-no-events';
      empty.textContent = 'No key engagements recorded';
      this.eventList.appendChild(empty);
      return;
    }

    keyEvents.forEach(({ event, time }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'aar-replay-event';
      const tag = event.type === 'roe_penalty' ? 'ROE' : (event.type === 'hit' ? 'HIT' : 'KILL');
      button.textContent = `[${event.time || '00:00'}] ${tag} - ${event.target || event.reason || 'CONTACT'}`;
      button.title = event.reason || `${event.source || 'Unit'} engaged ${event.target || 'target'}`;
      button.onclick = () => { this.pause(); this.seek(time); };
      this.eventList.appendChild(button);
    });
  }

  parseEventTime(value) {
    if (typeof value !== 'string') return NaN;
    const parts = value.split(':').map(Number);
    if (parts.length !== 2 || parts.some(part => !Number.isFinite(part))) return NaN;
    return parts[0] * 60 + parts[1];
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.pause();
      return;
    }
    if (this.frames.length < 2 || this.endTime <= this.startTime) return;
    if (this.currentTime >= this.endTime) this.seek(this.startTime);
    this.isPlaying = true;
    this.lastAnimationTime = 0;
    this.updateButtons();
    this.animationFrameId = requestAnimationFrame(time => this.advance(time));
  }

  pause() {
    this.isPlaying = false;
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    this.lastAnimationTime = 0;
    this.updateButtons();
  }

  advance(now) {
    if (!this.isPlaying) return;
    if (this.lastAnimationTime > 0) {
      this.currentTime += ((now - this.lastAnimationTime) / 1000) * this.speed;
      if (this.currentTime >= this.endTime) {
        this.currentTime = this.endTime;
        this.drawAt(this.currentTime);
        this.pause();
        return;
      }
    }
    this.lastAnimationTime = now;
    this.drawAt(this.currentTime);
    this.animationFrameId = requestAnimationFrame(time => this.advance(time));
  }

  seek(time) {
    this.currentTime = Math.max(this.startTime, Math.min(this.endTime, Number(time) || 0));
    this.drawAt(this.currentTime);
  }

  cycleSpeed() {
    const currentIndex = this.speedOptions.indexOf(this.speed);
    this.speed = this.speedOptions[(currentIndex + 1) % this.speedOptions.length];
    this.updateButtons();
  }

  updateButtons() {
    if (this.playButton) this.playButton.textContent = this.isPlaying ? 'PAUSE' : 'PLAY';
    if (this.speedButton) this.speedButton.textContent = `${this.speed}x SPEED`;
    const replayAvailable = this.frames.length > 1 && this.endTime > this.startTime;
    if (this.playButton) this.playButton.disabled = !replayAvailable;
    if (this.slider) this.slider.disabled = !replayAvailable;
    const restartButton = this.root.querySelector('.aar-replay-restart');
    if (restartButton) restartButton.disabled = !replayAvailable;
    if (this.speedButton) this.speedButton.disabled = !replayAvailable;
  }

  drawAt(time) {
    if (!this.ctx || !this.canvas || this.frames.length === 0) return;
    const state = this.interpolateFrame(time);
    this.resizeCanvas();
    this.drawMap(state);
    if (this.slider) this.slider.value = String(time);
    if (this.clock) this.clock.textContent = `${this.formatTime(time - this.startTime)} / ${this.formatTime(this.endTime - this.startTime)}`;
  }

  interpolateFrame(time) {
    let leftIndex = 0;
    while (leftIndex < this.frames.length - 2 && this.frames[leftIndex + 1].time < time) leftIndex++;
    const left = this.frames[leftIndex];
    const right = this.frames[Math.min(leftIndex + 1, this.frames.length - 1)];
    const span = right.time - left.time;
    const amount = span > 0 ? Math.max(0, Math.min(1, (time - left.time) / span)) : 0;
    const state = { time, clouds: this.interpolateClouds(left.clouds || [], right.clouds || [], amount) };

    ['alliedAircraft', 'hostileAircraft', 'surfaceUnits', 'missiles', 'civilianTraffic', 'decoys'].forEach(key => {
      state[key] = this.interpolateEntities(left[key] || [], right[key] || [], amount);
    });
    return state;
  }

  interpolateEntities(left, right, amount) {
    const rightById = new Map(right.map(entity => [entity.id, entity]));
    const leftIds = new Set(left.map(entity => entity.id));
    const entities = left.map(previous => {
      const next = rightById.get(previous.id);
      if (!next) return amount < 0.5 ? previous : null;
      const result = { ...next };
      ['x', 'y', 'hp', 'speed'].forEach(key => {
        if (Number.isFinite(previous[key]) && Number.isFinite(next[key])) {
          result[key] = previous[key] + (next[key] - previous[key]) * amount;
        }
      });
      if (Number.isFinite(previous.heading) && Number.isFinite(next.heading)) {
        let delta = ((next.heading - previous.heading + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
        result.heading = previous.heading + delta * amount;
      }
      return result;
    }).filter(Boolean);

    right.forEach(entity => {
      if (!leftIds.has(entity.id) && amount >= 0.5) entities.push(entity);
    });
    return entities;
  }

  interpolateClouds(left, right, amount) {
    return right.map((cloud, index) => {
      const previous = left[index];
      if (!previous) return cloud;
      return {
        x: previous.x + (cloud.x - previous.x) * amount,
        y: previous.y + (cloud.y - previous.y) * amount,
        rx: previous.rx + (cloud.rx - previous.rx) * amount,
        ry: previous.ry + (cloud.ry - previous.ry) * amount
      };
    });
  }

  resizeCanvas() {
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(width * ratio);
    const pixelHeight = Math.round(height * ratio);
    if (pixelWidth !== this.pixelWidth || pixelHeight !== this.pixelHeight || ratio !== this.pixelRatio) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
      this.pixelWidth = pixelWidth;
      this.pixelHeight = pixelHeight;
      this.pixelRatio = ratio;
    }
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  drawMap(state) {
    const ctx = this.ctx;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const config = window.CONFIG || {};
    const mapWidth = config.THEATER_WIDTH_KM || 150;
    const mapHeight = config.THEATER_HEIGHT_KM || 100;
    const padding = 22;
    const scaleX = (width - padding * 2) / mapWidth;
    const scaleY = (height - padding * 2) / mapHeight;
    const fieldWidth = mapWidth * scaleX;
    const fieldHeight = mapHeight * scaleY;
    const left = padding;
    const top = padding;
    const point = (x, y) => ({ x: left + x * scaleX, y: top + y * scaleY });

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#020711';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#050d19';
    ctx.fillRect(left, top, fieldWidth, fieldHeight);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= mapWidth; x += 25) {
      const pTop = point(x, 0), pBottom = point(x, mapHeight);
      ctx.beginPath(); ctx.moveTo(pTop.x, pTop.y); ctx.lineTo(pBottom.x, pBottom.y); ctx.stroke();
    }
    for (let y = 0; y <= mapHeight; y += 25) {
      const pLeft = point(0, y), pRight = point(mapWidth, y);
      ctx.beginPath(); ctx.moveTo(pLeft.x, pLeft.y); ctx.lineTo(pRight.x, pRight.y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
    ctx.strokeRect(left, top, fieldWidth, fieldHeight);

    (state.clouds || []).forEach(cloud => {
      const p = point(cloud.x, cloud.y);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, Math.max(3, cloud.rx * scaleX), Math.max(3, cloud.ry * scaleY), 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(71, 85, 105, 0.19)'; ctx.fill();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.23)'; ctx.setLineDash([4, 5]); ctx.stroke(); ctx.setLineDash([]);
    });

    (state.surfaceUnits || []).forEach(unit => {
      const p = point(unit.x, unit.y);
      ctx.strokeStyle = unit.hp <= 0 ? '#475569' : (unit.team === 'hostile' ? '#ef4444' : '#38bdf8');
      ctx.lineWidth = 1.4;
      ctx.strokeRect(p.x - 4, p.y - 4, 8, 8);
      if (unit.hp > 0) {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      }
    });

    (state.missiles || []).forEach(missile => {
      const color = missile.team === 'friendly' ? '#67e8f9' : '#fb7185';
      if (missile.trail && missile.trail.length > 1) {
        ctx.beginPath();
        missile.trail.slice().reverse().forEach((trailPoint, index) => {
          const p = point(trailPoint.x, trailPoint.y);
          if (index === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        const head = point(missile.x, missile.y);
        ctx.lineTo(head.x, head.y);
        ctx.strokeStyle = color; ctx.globalAlpha = 0.6; ctx.lineWidth = 1.3; ctx.stroke(); ctx.globalAlpha = 1;
      }
      this.drawAircraftMarker(point(missile.x, missile.y), missile.heading, color, 3.6);
    });

    (state.civilianTraffic || []).forEach(civilian => {
      if (civilian.hp <= 0) return;
      const p = point(civilian.x, civilian.y);
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#7dd3fc'; ctx.fill();
    });

    (state.decoys || []).forEach(decoy => {
      if (decoy.hp <= 0) return;
      const p = point(decoy.x, decoy.y);
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.4, 0, Math.PI * 2);
      ctx.strokeStyle = '#c084fc'; ctx.setLineDash([2, 2]); ctx.stroke(); ctx.setLineDash([]);
    });

    [...(state.alliedAircraft || []), ...(state.hostileAircraft || [])].forEach(aircraft => {
      const p = point(aircraft.x, aircraft.y);
      if (aircraft.hp <= 0.05) {
        ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(p.x - 3, p.y - 3); ctx.lineTo(p.x + 3, p.y + 3);
        ctx.moveTo(p.x + 3, p.y - 3); ctx.lineTo(p.x - 3, p.y + 3); ctx.stroke();
        return;
      }
      const color = aircraft.isAce ? '#fbbf24' : (aircraft.team === 'friendly' ? '#38bdf8' : '#f87171');
      this.drawAircraftMarker(p, aircraft.heading, color, aircraft.isAce ? 6 : 5);
      if (width >= 500) {
        ctx.font = '600 8px ui-monospace, monospace';
        ctx.fillStyle = color;
        ctx.fillText(aircraft.identified
          ? (window.formatAircraftDisplayName ? window.formatAircraftDisplayName(aircraft) : `${aircraft.callsign || 'PILOT'} - ${aircraft.model || 'AIRCRAFT'}`)
          : 'BOGEY', p.x + 7, p.y - 5);
      }
    });

    ctx.font = '700 9px ui-monospace, monospace';
    ctx.fillStyle = '#bae6fd';
    ctx.fillText(`SORTIE REPLAY - ${this.formatTime(state.time - this.startTime)}`, 9, 15);
    ctx.fillStyle = '#64748b';
    ctx.fillText('BLUE', width - 70, 15);
    ctx.fillStyle = '#38bdf8'; ctx.fillRect(width - 91, 9, 12, 2);
    ctx.fillStyle = '#ef4444'; ctx.fillRect(width - 44, 9, 12, 2);
    ctx.fillStyle = '#64748b';
    ctx.fillText('RED', width - 28, 15);
  }

  drawAircraftMarker(position, heading, color, size) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.rotate(heading || 0);
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.7, -size * 0.55);
    ctx.lineTo(-size * 0.35, 0);
    ctx.lineTo(-size * 0.7, size * 0.55);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  formatTime(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds || 0));
    return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(safeSeconds % 60).padStart(2, '0')}`;
  }
}

window.AfterActionReplay = AfterActionReplay;