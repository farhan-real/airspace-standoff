/**
 * AIRSPACE STANDOFF: Sortie Replay Playback & Playback Controller
 * Zero-allocation in-place state interpolation, O(1) frame lookup, and throttled UI updates.
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
    if (this.archiveInstance) {
      this.archiveInstance.destroy();
      this.archiveInstance = null;
    }
  }

  static showArchived(root, replay, events = []) {
    this.stopArchived();
    if (!root) return;
    this.archiveInstance = new AfterActionReplay(root);
    const frames = (typeof AfterActionReplayCodec !== 'undefined') ? AfterActionReplayCodec.decode(replay) : [];
    this.archiveInstance.openFrames(frames, events, false);
    if (frames.length === 0 && this.archiveInstance.status) {
      this.archiveInstance.status.textContent = 'REPLAY UNAVAILABLE - NO FRAMES IN THIS ARCHIVE';
    }
  }

  static encode(frames, targetBytes) {
    return (typeof AfterActionReplayCodec !== 'undefined') ? AfterActionReplayCodec.encode(frames, targetBytes) : null;
  }

  static decode(replay) {
    return (typeof AfterActionReplayCodec !== 'undefined') ? AfterActionReplayCodec.decode(replay) : [];
  }

  constructor(root = document) {
    this.root = root;
    this.canvas = root.querySelector('.aar-replay-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d', { alpha: false }) : null;
    this.slider = root.querySelector('.aar-replay-slider');
    this.clock = root.querySelector('.aar-replay-clock');
    this.playButton = root.querySelector('.aar-replay-play');
    this.speedButton = root.querySelector('.aar-replay-speed');
    this.eventList = root.querySelector('.aar-replay-events');
    this.status = root.querySelector('.aar-replay-status');

    this.frames = [];
    this.startTime = 0;
    this.endTime = 0;
    this.currentTime = 0;
    this.speed = 1;
    this.speedOptions = [0.5, 1, 2];
    this.isPlaying = false;
    this.isUserDragging = false;
    this.animationFrameId = null;
    this.lastAnimationTime = 0;
    this.viewWidth = 800;
    this.viewHeight = 220;
    this.lastLeftIndex = 0;
    this.lastUiUpdateTime = -1;
    this.renderPending = false;

    // Zero-allocation reusable state buffers
    this.state = {
      time: 0,
      clouds: [],
      alliedAircraft: [],
      hostileAircraft: [],
      surfaceUnits: [],
      missiles: [],
      civilianTraffic: [],
      decoys: []
    };

    if (this.playButton) this.playButton.onclick = () => this.togglePlayback();
    if (this.speedButton) this.speedButton.onclick = () => this.cycleSpeed();

    this.onWindowPointerUp = () => { this.isUserDragging = false; };
    window.addEventListener('pointerup', this.onWindowPointerUp);
    window.addEventListener('pointercancel', this.onWindowPointerUp);

    if (this.slider) {
      this.slider.addEventListener('pointerdown', () => {
        this.isUserDragging = true;
        this.pause();
      });
      this.slider.oninput = () => {
        this.pause();
        const targetTime = Number(this.slider.value);
        this.currentTime = Math.max(this.startTime, Math.min(this.endTime, targetTime));
        if (!this.renderPending) {
          this.renderPending = true;
          requestAnimationFrame(() => {
            this.renderPending = false;
            this.drawAt(this.currentTime, false);
          });
        }
      };
    }

    const restartButton = root.querySelector('.aar-replay-restart');
    if (restartButton) restartButton.onclick = () => { this.pause(); this.seek(this.startTime, true); };

    this.onWindowResize = () => this.resizeCanvas();
    window.addEventListener('resize', this.onWindowResize);
  }

  destroy() {
    this.pause();
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('pointerup', this.onWindowPointerUp);
    window.removeEventListener('pointercancel', this.onWindowPointerUp);
  }

  open(game) {
    this.openFrames((game && game.simulation && game.simulation.replaySnapshots) || [],
      (game && game.simulation && game.simulation.timelineEvents) || [], true);
  }

  openFrames(frames, events = [], liveReplay = false) {
    this.pause();
    this.frames = Array.isArray(frames) ? frames : [];
    this.startTime = this.frames.length ? this.frames[0].time : 0;
    this.endTime = this.frames.length ? this.frames[this.frames.length - 1].time : 0;
    this.currentTime = this.startTime;
    this.speed = 1;
    this.lastLeftIndex = 0;
    this.lastUiUpdateTime = -1;

    if (this.slider) {
      this.slider.min = String(this.startTime);
      this.slider.max = String(Math.max(this.endTime, this.startTime + 0.1));
      this.slider.step = '0.05';
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
    this.resizeCanvas();
    requestAnimationFrame(() => {
      this.resizeCanvas();
      this.drawAt(this.currentTime, true);
    });
  }

  renderEventJumps(events) {
    if (!this.eventList) return;
    this.eventList.replaceChildren();
    const keyEvents = events
      .filter(ev => ev && ['kill', 'ace-kill', 'hit', 'roe_penalty'].includes(ev.type))
      .map(ev => ({
        event: ev,
        time: (typeof ev.timeSec === 'number' && Number.isFinite(ev.timeSec))
          ? ev.timeSec
          : this.parseEventTime(ev.time)
      }))
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
      button.onclick = () => {
        this.pause();
        this.seek(Math.max(this.startTime, time - 1.0), true);
      };
      this.eventList.appendChild(button);
    });
  }

  parseEventTime(val) {
    if (typeof val !== 'string') return NaN;
    const parts = val.split(':').map(Number);
    if (parts.length !== 2 || parts.some(p => !Number.isFinite(p))) return NaN;
    return parts[0] * 60 + parts[1];
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.pause();
      return;
    }
    if (this.frames.length < 2 || this.endTime <= this.startTime) return;
    if (this.currentTime >= this.endTime) this.seek(this.startTime, true);
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
        this.drawAt(this.currentTime, true);
        this.pause();
        return;
      }
    }
    this.lastAnimationTime = now;
    this.drawAt(this.currentTime, true);
    this.animationFrameId = requestAnimationFrame(time => this.advance(time));
  }

  seek(time, syncSlider = true) {
    this.currentTime = Math.max(this.startTime, Math.min(this.endTime, Number(time) || 0));
    this.drawAt(this.currentTime, syncSlider);
  }

  cycleSpeed() {
    const idx = this.speedOptions.indexOf(this.speed);
    this.speed = this.speedOptions[(idx + 1) % this.speedOptions.length];
    this.updateButtons();
  }

  updateButtons() {
    if (this.playButton) this.playButton.textContent = this.isPlaying ? 'PAUSE' : 'PLAY';
    if (this.speedButton) this.speedButton.textContent = `${this.speed}x SPEED`;
    const available = this.frames.length > 1 && this.endTime > this.startTime;
    if (this.playButton) this.playButton.disabled = !available;
    if (this.slider) this.slider.disabled = !available;
    const restartBtn = this.root.querySelector('.aar-replay-restart');
    if (restartBtn) restartBtn.disabled = !available;
    if (this.speedButton) this.speedButton.disabled = !available;
  }

  drawAt(time, syncSlider = false) {
    if (!this.ctx || !this.canvas || this.frames.length === 0) return;

    if (this.canvas.clientWidth > 0 && Math.abs(this.canvas.clientWidth - this.viewWidth) > 2) {
      this.resizeCanvas();
    }

    const state = this.interpolateFrame(time);
    if (typeof ReplayMapRenderer !== 'undefined') {
      ReplayMapRenderer.drawMap(this.ctx, state, this.viewWidth, this.viewHeight, this.startTime);
    }

    // Throttle DOM slider and clock updates to avoid layout thrashing at 60 FPS
    if (syncSlider && (!this.lastUiUpdateTime || Math.abs(time - this.lastUiUpdateTime) >= 0.1 || time >= this.endTime)) {
      this.lastUiUpdateTime = time;
      if (this.slider && !this.isUserDragging) {
        this.slider.value = String(time);
      }
      if (this.clock) {
        const fmt = (typeof ReplayMapRenderer !== 'undefined') ? ReplayMapRenderer.formatTime : s => String(Math.floor(s));
        this.clock.textContent = `${fmt(time - this.startTime)} / ${fmt(this.endTime - this.startTime)}`;
      }
    }
  }

  findLeftIndex(time) {
    const frames = this.frames;
    const len = frames.length;
    if (len <= 2) return 0;

    let idx = this.lastLeftIndex || 0;
    if (idx >= len - 2) idx = len - 2;

    if (time >= frames[idx].time) {
      if (idx + 1 < len && time < frames[idx + 1].time) return idx;
      if (idx + 2 < len && time >= frames[idx + 1].time && time < frames[idx + 2].time) {
        this.lastLeftIndex = idx + 1;
        return idx + 1;
      }
    }

    let low = 0, high = len - 2;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (frames[mid + 1].time <= time) low = mid + 1;
      else if (frames[mid].time > time) high = mid - 1;
      else {
        this.lastLeftIndex = mid;
        return mid;
      }
    }
    const res = Math.max(0, Math.min(len - 2, low));
    this.lastLeftIndex = res;
    return res;
  }

  interpolateFrame(time) {
    if (this.frames.length === 1) return this.frames[0];

    const leftIdx = this.findLeftIndex(time);
    const left = this.frames[leftIdx];
    const right = this.frames[Math.min(leftIdx + 1, this.frames.length - 1)];
    const span = right.time - left.time;
    const amount = span > 0 ? Math.max(0, Math.min(1, (time - left.time) / span)) : 0;

    if (amount <= 0.001) return left;
    if (amount >= 0.999) return right;

    const s = this.state;
    s.time = time;
    s.clouds = left.clouds || [];
    s.surfaceUnits = right.surfaceUnits || left.surfaceUnits || [];
    s.missiles = (amount >= 0.50 ? right.missiles : left.missiles) || [];

    this.interpolateAircraftArray(left.alliedAircraft, right.alliedAircraft, s.alliedAircraft, amount);
    this.interpolateAircraftArray(left.hostileAircraft, right.hostileAircraft, s.hostileAircraft, amount);
    this.interpolateGenericEntities(left.civilianTraffic, right.civilianTraffic, s.civilianTraffic, amount);
    this.interpolateGenericEntities(left.decoys, right.decoys, s.decoys, amount);

    return s;
  }

  interpolateAircraftArray(leftArr, rightArr, targetArr, amount) {
    const len = rightArr ? rightArr.length : (leftArr ? leftArr.length : 0);
    targetArr.length = len;

    for (let i = 0; i < len; i++) {
      const prev = leftArr ? leftArr[i] : null;
      const next = rightArr ? rightArr[i] : null;

      if (!prev && next) { targetArr[i] = next; continue; }
      if (prev && !next) { targetArr[i] = prev; continue; }
      if (!prev && !next) continue;

      let item = targetArr[i];
      if (!item) {
        item = {};
        targetArr[i] = item;
      }

      item.id = next.id;
      item.callsign = next.callsign;
      item.cleanCallsign = next.cleanCallsign || next.callsign;
      item.model = next.model;
      item.category = next.category;
      item.maxHp = next.maxHp;
      item.team = next.team;
      item.isAce = next.isAce;
      item.isFlightLead = next.isFlightLead;
      item.isCoffin = next.isCoffin;
      item.isRTB = next.isRTB;
      item.identified = next.identified;

      item.x = prev.x + (next.x - prev.x) * amount;
      item.y = prev.y + (next.y - prev.y) * amount;
      item.speed = prev.speed + (next.speed - prev.speed) * amount;
      item.altFt = prev.altFt + (next.altFt - prev.altFt) * amount;
      item.hp = (next.hp <= 0.05 && prev.hp > 0.05)
        ? (amount >= 0.70 ? 0 : prev.hp)
        : (prev.hp + (next.hp - prev.hp) * amount);

      let diff = next.heading - prev.heading;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      item.heading = prev.heading + diff * amount;
    }
  }

  interpolateGenericEntities(leftArr, rightArr, targetArr, amount) {
    const len = rightArr ? rightArr.length : (leftArr ? leftArr.length : 0);
    targetArr.length = len;

    for (let i = 0; i < len; i++) {
      const prev = leftArr ? leftArr[i] : null;
      const next = rightArr ? rightArr[i] : null;

      if (!prev && next) { targetArr[i] = next; continue; }
      if (prev && !next) { targetArr[i] = prev; continue; }
      if (!prev && !next) continue;

      let item = targetArr[i];
      if (!item) {
        item = {};
        targetArr[i] = item;
      }

      Object.assign(item, next);
      item.x = prev.x + (next.x - prev.x) * amount;
      item.y = prev.y + (next.y - prev.y) * amount;

      if (Number.isFinite(prev.heading) && Number.isFinite(next.heading)) {
        let diff = next.heading - prev.heading;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        item.heading = prev.heading + diff * amount;
      }
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const pixelWidth = Math.round(width * ratio);
    const pixelHeight = Math.round(height * ratio);

    this.viewWidth = width;
    this.viewHeight = height;

    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
    }
    if (this.ctx) {
      this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }
}

window.AfterActionReplay = AfterActionReplay;