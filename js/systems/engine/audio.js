/**
 * AIRSPACE STANDOFF: Advanced Web Audio Synthesizer Core
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
    if (!this.ctx || typeof TacticalAudioSynthesizer === 'undefined') return;
    try {
      TacticalAudioSynthesizer.playClick(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume);
    } catch (e) {}
  }

  playGunBurst() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || typeof TacticalAudioSynthesizer === 'undefined') return;
    try {
      TacticalAudioSynthesizer.playGunBurst(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume);
    } catch (e) {}
  }

  playLaunch() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || typeof TacticalAudioSynthesizer === 'undefined') return;
    try {
      TacticalAudioSynthesizer.playLaunch(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume);
    } catch (e) {}
  }

  playMissileLost() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || typeof TacticalAudioSynthesizer === 'undefined') return;
    try {
      TacticalAudioSynthesizer.playMissileLost(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume);
    } catch (e) {}
  }

  playExplosion(isLarge = false) {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || typeof TacticalAudioSynthesizer === 'undefined') return;
    try {
      TacticalAudioSynthesizer.playExplosion(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume, isLarge);
    } catch (e) {}
  }

  playLaser() {
    if (!this.enabled || this.masterVolume <= 0) return;
    this.ensureContext();
    if (!this.ctx || typeof TacticalAudioSynthesizer === 'undefined') return;
    try {
      TacticalAudioSynthesizer.playLaser(this.ctx, this.getMasterDestination(), this.masterVolume, this.fxVolume);
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