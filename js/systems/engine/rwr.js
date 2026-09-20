/**
 * AIRSPACE STANDOFF // Tactical RWR Audio Tone Modulation Engine
 */

class TacticalRWRAudio {
  constructor() {
    this.lastRwrState = 'clean';
    this.rwrPulseTimer = null;
  }

  stop() {
    if (this.rwrPulseTimer) {
      clearInterval(this.rwrPulseTimer);
      this.rwrPulseTimer = null;
    }
    this.lastRwrState = 'clean';
  }

  update(threatState, ctx, dest, masterVol, rwrVol) {
    if (threatState === this.lastRwrState) return;
    this.lastRwrState = threatState;

    if (this.rwrPulseTimer) {
      clearInterval(this.rwrPulseTimer);
      this.rwrPulseTimer = null;
    }

    if (threatState === 'lock') {
      const playMilLockPulse = () => {
        if (this.lastRwrState !== 'lock' || !ctx) return;
        try {
          const now = ctx.currentTime;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(1400, now);
          osc1.frequency.exponentialRampToValueAtTime(1150, now + 0.06);
          osc2.frequency.setValueAtTime(920, now);
          osc2.frequency.exponentialRampToValueAtTime(800, now + 0.06);

          const vol = 0.045 * masterVol * rwrVol;
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(dest);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.075);
          osc2.stop(now + 0.075);
        } catch (e) {}
      };

      playMilLockPulse();
      this.rwrPulseTimer = setInterval(playMilLockPulse, 320);
    } else if (threatState === 'sweep') {
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1250, now);
        osc.frequency.exponentialRampToValueAtTime(1050, now + 0.045);

        const vol = 0.035 * masterVol * rwrVol;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.055);
      } catch (e) {}
    }
  }
}

window.TacticalRWRAudio = TacticalRWRAudio;