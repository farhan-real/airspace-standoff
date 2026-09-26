/**
 * AIRSPACE STANDOFF: Tactical Audio Sound Synthesizers
 * Procedural synthesizers for weapons, impacts, laser emitters, and explosions.
 */

class TacticalAudioSynthesizer {
  static playClick(ctx, dest, masterVol, fxVol) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.012);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(600, now);

    const vol = 0.05 * masterVol * fxVol;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.015);
  }

  static playGunBurst(ctx, dest, masterVol, fxVol) {
    const now = ctx.currentTime;
    const burstRounds = 4;
    const roundSpacing = 0.040;

    for (let i = 0; i < burstRounds; i++) {
      const roundTime = now + (i * roundSpacing);

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, roundTime);
      osc.frequency.exponentialRampToValueAtTime(40, roundTime + 0.028);

      const thumpVol = 0.16 * masterVol * fxVol;
      oscGain.gain.setValueAtTime(thumpVol, roundTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, roundTime + 0.032);

      osc.connect(oscGain);
      oscGain.connect(dest);
      osc.start(roundTime);
      osc.stop(roundTime + 0.035);

      const noiseSize = Math.floor(ctx.sampleRate * 0.022);
      const buffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < noiseSize; j++) data[j] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(1500, roundTime);
      snapFilter.Q.setValueAtTime(3.2, roundTime);

      const snapGain = ctx.createGain();
      snapGain.gain.setValueAtTime(0.12 * masterVol * fxVol, roundTime);
      snapGain.gain.exponentialRampToValueAtTime(0.001, roundTime + 0.022);

      noise.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(dest);

      noise.start(roundTime);
      noise.stop(roundTime + 0.025);
    }
  }

  static playLaunch(ctx, dest, masterVol, fxVol) {
    const now = ctx.currentTime;
    const duration = 0.55;

    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(95, now);
    thump.frequency.exponentialRampToValueAtTime(25, now + 0.08);

    thumpGain.gain.setValueAtTime(0.22 * masterVol * fxVol, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    thump.connect(thumpGain);
    thumpGain.connect(dest);
    thump.start(now);
    thump.stop(now + 0.10);

    const noiseSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < noiseSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandFilter = ctx.createBiquadFilter();
    bandFilter.type = 'bandpass';
    bandFilter.frequency.setValueAtTime(280, now);
    bandFilter.frequency.exponentialRampToValueAtTime(650, now + 0.12);
    bandFilter.frequency.exponentialRampToValueAtTime(140, now + duration);
    bandFilter.Q.setValueAtTime(2.2, now);

    const roarGain = ctx.createGain();
    roarGain.gain.setValueAtTime(0.02, now);
    roarGain.gain.linearRampToValueAtTime(0.20 * masterVol * fxVol, now + 0.08);
    roarGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(bandFilter);
    bandFilter.connect(roarGain);
    roarGain.connect(dest);

    noise.start(now);
    noise.stop(now + duration);
  }

  static playMissileLost(ctx, dest, masterVol, fxVol) {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1350, now);
    gain1.gain.setValueAtTime(0.08 * masterVol * fxVol, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc1.connect(gain1);
    gain1.connect(dest);
    osc1.start(now);
    osc1.stop(now + 0.065);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(850, now + 0.065);
    gain2.gain.setValueAtTime(0.07 * masterVol * fxVol, now + 0.065);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc2.connect(gain2);
    gain2.connect(dest);
    osc2.start(now + 0.065);
    osc2.stop(now + 0.17);
  }

  static playExplosion(ctx, dest, masterVol, fxVol, isLarge = false) {
    const now = ctx.currentTime;
    const duration = isLarge ? 1.1 : 0.65;

    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'sawtooth';
    snapOsc.frequency.setValueAtTime(240, now);
    snapOsc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

    snapGain.gain.setValueAtTime((isLarge ? 0.35 : 0.22) * masterVol * fxVol, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    snapOsc.connect(snapGain);
    snapGain.connect(dest);
    snapOsc.start(now);
    snapOsc.stop(now + 0.055);

    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(isLarge ? 55 : 75, now);
    subOsc.frequency.exponentialRampToValueAtTime(20, now + (duration * 0.5));

    const subVol = (isLarge ? 0.38 : 0.24) * masterVol * fxVol;
    subGain.gain.setValueAtTime(subVol, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + (duration * 0.6));

    subOsc.connect(subGain);
    subGain.connect(dest);
    subOsc.start(now);
    subOsc.stop(now + duration);

    const noiseSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < noiseSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const lowFilter = ctx.createBiquadFilter();
    lowFilter.type = 'lowpass';
    lowFilter.frequency.setValueAtTime(isLarge ? 320 : 220, now);
    lowFilter.frequency.exponentialRampToValueAtTime(25, now + duration);
    lowFilter.Q.setValueAtTime(isLarge ? 3.5 : 2.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime((isLarge ? 0.40 : 0.26) * masterVol * fxVol, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(lowFilter);
    lowFilter.connect(noiseGain);
    noiseGain.connect(dest);

    noise.start(now);
    noise.stop(now + duration);
  }

  static playLaser(ctx, dest, masterVol, fxVol) {
    const now = ctx.currentTime;
    const duration = 0.24;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2800, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + duration);

    const vol = 0.16 * masterVol * fxVol;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + duration + 0.01);

    const snap = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snap.type = 'square';
    snap.frequency.setValueAtTime(4200, now);
    snap.frequency.exponentialRampToValueAtTime(600, now + 0.02);
    snapGain.gain.setValueAtTime(0.08 * masterVol * fxVol, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    snap.connect(snapGain);
    snapGain.connect(dest);
    snap.start(now);
    snap.stop(now + 0.03);
  }
}

window.TacticalAudioSynthesizer = TacticalAudioSynthesizer;