/**
 * AIRSPACE STANDOFF: Sortie Replay Playback & Playback Controller
 * Synchronized missile impacts and target kill moments with clean simple arrows and zero delay.
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
    this.isUserDragging = false;
    this.animationFrameId = null;
    this.lastAnimationTime = 0;
    this.viewWidth = 800;
    this.viewHeight = 220;
    this.pixelRatio = 1;

    if (this.playButton) this.playButton.onclick = () => this.togglePlayback();
    if (this.speedButton) this.speedButton.onclick = () => this.cycleSpeed();

    if (this.slider) {
      this.slider.addEventListener('pointerdown', () => {
        this.isUserDragging = true;
        this.pause();
      });
      const endDrag = () => {
        this.isUserDragging = false;
      };
      this.slider.addEventListener('pointerup', endDrag);
      this.slider.addEventListener('pointercancel', endDrag);

      this.slider.oninput = () => {
        this.pause();
        this.seek(Number(this.slider.value), false);
      };
    }

    const restartButton = root.querySelector('.aar-replay-restart');
    if (restartButton) restartButton.onclick = () => { this.pause(); this.seek(this.startTime, true); };

    window.addEventListener('resize', () => this.resizeCanvas());
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
    this.drawAt(this.currentTime, true);
  }

  renderEventJumps(events) {
    if (!this.eventList) return;
    this.eventList.replaceChildren();
    const keyEvents = events
      .filter(event => event && ['kill', 'ace-kill', 'hit', 'roe_penalty'].includes(event.type))
      .map(event => ({
        event,
        time: (typeof event.timeSec === 'number' && Number.isFinite(event.timeSec))
          ? event.timeSec
          : this.parseEventTime(event.time)
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
        const approachSeek = Math.max(this.startTime, time - 1.0);
        this.seek(approachSeek, true);
      };
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

  drawAt(time, syncSlider = false) {
    if (!this.ctx || !this.canvas || this.frames.length === 0) return;
    const state = this.interpolateFrame(time);
    if (typeof ReplayMapRenderer !== 'undefined') {
      ReplayMapRenderer.drawMap(this.ctx, state, this.viewWidth, this.viewHeight, this.startTime);
    }

    if (syncSlider && this.slider && !this.isUserDragging) {
      this.slider.value = String(time);
    }
    if (this.clock) {
      const formatTime = (typeof ReplayMapRenderer !== 'undefined') ? ReplayMapRenderer.formatTime : s => String(Math.floor(s));
      this.clock.textContent = `${formatTime(time - this.startTime)} / ${formatTime(this.endTime - this.startTime)}`;
    }
  }

  interpolateFrame(time) {
    if (this.frames.length === 1) return this.frames[0];

    let leftIndex = 0;
    while (leftIndex < this.frames.length - 2 && this.frames[leftIndex + 1].time < time) {
      leftIndex++;
    }
    const left = this.frames[leftIndex];
    const right = this.frames[Math.min(leftIndex + 1, this.frames.length - 1)];
    const span = right.time - left.time;
    const amount = span > 0 ? Math.max(0, Math.min(1, (time - left.time) / span)) : 0;
    const state = { time, clouds: this.interpolateClouds(left.clouds || [], right.clouds || [], amount) };

    ['alliedAircraft', 'hostileAircraft', 'surfaceUnits', 'missiles', 'civilianTraffic', 'decoys'].forEach(key => {
      state[key] = this.interpolateEntities(left[key] || [], right[key] || [], amount, span);
    });
    return state;
  }

  interpolateEntities(left, right, amount, span = 0.4) {
    if (!left || left.length === 0) return right || [];
    if (!right || right.length === 0) return left || [];
    if (amount <= 0.001) return left;
    if (amount >= 0.999) return right;

    const rightById = new Map();
    right.forEach(e => { if (e && e.id) rightById.set(e.id, e); });

    const result = [];
    const processedRightIds = new Set();

    left.forEach(prev => {
      if (!prev) return;
      const next = rightById.get(prev.id);
      if (next) {
        processedRightIds.add(next.id);
        const item = { ...next };
        if (Number.isFinite(prev.x) && Number.isFinite(next.x)) {
          item.x = prev.x + (next.x - prev.x) * amount;
        }
        if (Number.isFinite(prev.y) && Number.isFinite(next.y)) {
          item.y = prev.y + (next.y - prev.y) * amount;
        }
        if (Number.isFinite(prev.speed) && Number.isFinite(next.speed)) {
          item.speed = prev.speed + (next.speed - prev.speed) * amount;
        }

        if (Number.isFinite(prev.hp) && Number.isFinite(next.hp)) {
          if (next.hp <= 0.05 && prev.hp > 0.05) {
            item.hp = (amount >= 0.70) ? 0 : prev.hp;
          } else {
            item.hp = prev.hp + (next.hp - prev.hp) * amount;
          }
        }

        if (Number.isFinite(prev.heading) && Number.isFinite(next.heading)) {
          let diff = next.heading - prev.heading;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          item.heading = prev.heading + diff * amount;
        }
        result.push(item);
      } else {
        if (prev.weapon !== undefined || prev.stage !== undefined) {
          if (amount < 0.70) {
            const flightTime = Math.max(0.1, span) * amount;
            const dist = (prev.speed || 2.4) * 0.35 * flightTime;
            result.push({
              ...prev,
              x: prev.x + Math.cos(prev.heading || 0) * dist,
              y: prev.y + Math.sin(prev.heading || 0) * dist
            });
          }
        } else if (amount < 0.50 && prev.hp > 0.05) {
          result.push(prev);
        }
      }
    });

    right.forEach(next => {
      if (!processedRightIds.has(next.id) && amount >= 0.50) {
        result.push(next);
      }
    });

    return result;
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
    if (!this.canvas) return;
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const pixelWidth = Math.round(width * ratio);
    const pixelHeight = Math.round(height * ratio);

    this.viewWidth = width;
    this.viewHeight = height;
    this.pixelRatio = ratio;

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