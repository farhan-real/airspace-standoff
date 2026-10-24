/**
 * AIRSPACE STANDOFF: Advanced Web Audio Synthesizer Core
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.masterVolume = 1.0;
    this.rwrVolume = 0.70;
    this.fxVolume = 0.85;
    this.compressor = null;
    this.rwr = (typeof RWRAudio !== 'undefined') ? new RWRAudio() : null;
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
      this.ctx.resume().catch((err) => {
        console.warn('AudioContext resume deferred until user gesture:', err);
      });
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
    if (!this.ctx || typeof AudioSynthesizer === 'undefined') return;
    try {
      AudioSynthesizer.playClick(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume);
    } catch (e) {
      console.warn('Audio playClick failed:', e);
    }
  }

  playGunBurst() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || typeof AudioSynthesizer === 'undefined') return;
    try {
      AudioSynthesizer.playGunBurst(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume);
    } catch (e) {
      console.warn('Audio playGunBurst failed:', e);
    }
  }

  playLaunch() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || typeof AudioSynthesizer === 'undefined') return;
    try {
      AudioSynthesizer.playLaunch(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume);
    } catch (e) {
      console.warn('Audio playLaunch failed:', e);
    }
  }

  playMissileLost() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || typeof AudioSynthesizer === 'undefined') return;
    try {
      AudioSynthesizer.playMissileLost(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume);
    } catch (e) {
      console.warn('Audio playMissileLost failed:', e);
    }
  }

  playExplosion(isLarge = false) {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || typeof AudioSynthesizer === 'undefined') return;
    try {
      AudioSynthesizer.playExplosion(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume, isLarge);
    } catch (e) {
      console.warn('Audio playExplosion failed:', e);
    }
  }

  playLaser() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || typeof AudioSynthesizer === 'undefined') return;
    try {
      AudioSynthesizer.playLaser(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume);
    } catch (e) {
      console.warn('Audio playLaser failed:', e);
    }
  }

  updateRWR(threatState) {
    if (!this.enabled || this.masterVolume <= 0 || this.rwrVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || !this.rwr) return;
    this.rwr.update(threatState, this.ctx, this.getMasterDestination(), this.masterVolume, this.rwrVolume);
  }
}

const AudioSys = new AudioEngine();
window.AudioSys = AudioSys;