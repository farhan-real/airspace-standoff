/**
 * AIRSPACE STANDOFF // Advanced Web Audio Synthesizer Core
 */

class TacticalAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.masterVolume = 1.0;
    this.rwrVolume = 0.70;
    this.fxVolume = 0.85;
    this.compressor = null;
    this.rwr = (typeof TacticalRWRAudio !== 'undefined') ? new TacticalRWRAudio() : null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.12, this.ctx.currentTime);
        this.compressor.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  getMasterDestination() {
    return this.compressor || (this.ctx ? this.ctx.destination : null);
  }

  toggle() {
    this.ensureContext();
    this.enabled = !this.enabled;
    if (!this.enabled && this.rwr) this.rwr.stop();
    return this.enabled;
  }

  setVolumes(master, rwr, fx) {
    if (master !== undefined) this.masterVolume = Math.max(0, Math.min(1, master));
    if (rwr !== undefined) this.rwrVolume = Math.max(0, Math.min(1, rwr));
    if (fx !== undefined) this.fxVolume = Math.max(0, Math.min(1, fx));
  }

  playClick() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.012);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(600, now);

      const vol = 0.05 * this.masterVolume * this.fxVolume;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.getMasterDestination());

      osc.start(now);
      osc.stop(now + 0.015);
    } catch (e) {}
  }

  playGunBurst() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const burstRounds = 3;
      const roundSpacing = 0.024;

      for (let i = 0; i < burstRounds; i++) {
        const roundTime = now + (i * roundSpacing);

        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, roundTime);
        osc.frequency.exponentialRampToValueAtTime(35, roundTime + 0.03);

        const thumpVol = 0.16 * this.masterVolume * this.fxVolume;
        oscGain.gain.setValueAtTime(thumpVol, roundTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, roundTime + 0.035);

        osc.connect(oscGain);
        oscGain.connect(this.getMasterDestination());
        osc.start(roundTime);
        osc.stop(roundTime + 0.04);

        const noiseSize = Math.floor(this.ctx.sampleRate * 0.025);
        const buffer = this.ctx.createBuffer(1, noiseSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < noiseSize; j++) data[j] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const snapFilter = this.ctx.createBiquadFilter();
        snapFilter.type = 'bandpass';
        snapFilter.frequency.setValueAtTime(1400, roundTime);
        snapFilter.Q.setValueAtTime(3.0, roundTime);

        const snapGain = this.ctx.createGain();
        snapGain.gain.setValueAtTime(0.12 * this.masterVolume * this.fxVolume, roundTime);
        snapGain.gain.exponentialRampToValueAtTime(0.001, roundTime + 0.025);

        noise.connect(snapFilter);
        snapFilter.connect(snapGain);
        snapGain.connect(this.getMasterDestination());

        noise.start(roundTime);
        noise.stop(roundTime + 0.028);
      }
    } catch (e) {}
  }

  playLaunch() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const duration = 0.55;

      const thump = this.ctx.createOscillator();
      const thumpGain = this.ctx.createGain();
      thump.type = 'sine';
      thump.frequency.setValueAtTime(95, now);
      thump.frequency.exponentialRampToValueAtTime(25, now + 0.08);

      thumpGain.gain.setValueAtTime(0.22 * this.masterVolume * this.fxVolume, now);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      thump.connect(thumpGain);
      thumpGain.connect(this.getMasterDestination());
      thump.start(now);
      thump.stop(now + 0.10);

      const noiseSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, noiseSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < noiseSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandFilter = this.ctx.createBiquadFilter();
      bandFilter.type = 'bandpass';
      bandFilter.frequency.setValueAtTime(280, now);
      bandFilter.frequency.exponentialRampToValueAtTime(650, now + 0.12);
      bandFilter.frequency.exponentialRampToValueAtTime(140, now + duration);
      bandFilter.Q.setValueAtTime(2.2, now);

      const roarGain = this.ctx.createGain();
      roarGain.gain.setValueAtTime(0.02, now);
      roarGain.gain.linearRampToValueAtTime(0.20 * this.masterVolume * this.fxVolume, now + 0.08);
      roarGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(bandFilter);
      bandFilter.connect(roarGain);
      roarGain.connect(this.getMasterDestination());

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {}
  }

  playMissileLost() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1350, now);
      gain1.gain.setValueAtTime(0.08 * this.masterVolume * this.fxVolume, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc1.connect(gain1);
      gain1.connect(this.getMasterDestination());
      osc1.start(now);
      osc1.stop(now + 0.065);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(850, now + 0.065);
      gain2.gain.setValueAtTime(0.07 * this.masterVolume * this.fxVolume, now + 0.065);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc2.connect(gain2);
      gain2.connect(this.getMasterDestination());
      osc2.start(now + 0.065);
      osc2.stop(now + 0.17);
    } catch (e) {}
  }

  playExplosion(isLarge = false) {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const duration = isLarge ? 1.1 : 0.65;

      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'sawtooth';
      snapOsc.frequency.setValueAtTime(240, now);
      snapOsc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

      snapGain.gain.setValueAtTime((isLarge ? 0.35 : 0.22) * this.masterVolume * this.fxVolume, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      snapOsc.connect(snapGain);
      snapGain.connect(this.getMasterDestination());
      snapOsc.start(now);
      snapOsc.stop(now + 0.055);

      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(isLarge ? 55 : 75, now);
      subOsc.frequency.exponentialRampToValueAtTime(20, now + (duration * 0.5));

      const subVol = (isLarge ? 0.38 : 0.24) * this.masterVolume * this.fxVolume;
      subGain.gain.setValueAtTime(subVol, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + (duration * 0.6));

      subOsc.connect(subGain);
      subGain.connect(this.getMasterDestination());
      subOsc.start(now);
      subOsc.stop(now + duration);

      const noiseSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, noiseSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < noiseSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const lowFilter = this.ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.setValueAtTime(isLarge ? 320 : 220, now);
      lowFilter.frequency.exponentialRampToValueAtTime(25, now + duration);
      lowFilter.Q.setValueAtTime(isLarge ? 3.5 : 2.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime((isLarge ? 0.40 : 0.26) * this.masterVolume * this.fxVolume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(lowFilter);
      lowFilter.connect(noiseGain);
      noiseGain.connect(this.getMasterDestination());

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {}
  }

  playLaser() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const duration = 0.24;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2800, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + duration);

      const vol = 0.16 * this.masterVolume * this.fxVolume;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.getMasterDestination());
      osc.start(now);
      osc.stop(now + duration + 0.01);

      const snap = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snap.type = 'square';
      snap.frequency.setValueAtTime(4200, now);
      snap.frequency.exponentialRampToValueAtTime(600, now + 0.02);
      snapGain.gain.setValueAtTime(0.08 * this.masterVolume * this.fxVolume, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      snap.connect(snapGain);
      snapGain.connect(this.getMasterDestination());
      snap.start(now);
      snap.stop(now + 0.03);
    } catch (e) {}
  }

  updateRWR(threatState) {
    if (!this.enabled || this.masterVolume <= 0 || this.rwrVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || !this.rwr) return;
    this.rwr.update(threatState, this.ctx, this.getMasterDestination(), this.masterVolume, this.rwrVolume);
  }
}

const AudioSys = new TacticalAudioEngine();
window.AudioSys = AudioSys;