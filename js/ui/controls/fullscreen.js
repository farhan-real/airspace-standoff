/**
 * AIRSPACE STANDOFF: Fullscreen Controls Handler
 * Detects native Android APK vs browser, handles mobile browser vendor prefixes,
 * provides CSS pseudo-fullscreen fallback for iOS and unsupported mobile devices.
 */

class FullscreenHandler {
  constructor(controlsSys) {
    this.sys = controlsSys;
    this.game = controlsSys ? controlsSys.game : null;
    this.isPseudoFullscreen = false;
  }

  isAndroidApk() {
    try {
      if (typeof window.AndroidAppBridge !== 'undefined') return true;
      if (typeof window.AndroidApp !== 'undefined') return true;
      const ua = (navigator && navigator.userAgent) ? navigator.userAgent : '';
      if (ua.includes('AirspaceStandoffAPK') || ua.includes('AirspaceStandoffApp')) return true;
      const href = (window.location && window.location.href) ? window.location.href : '';
      if (href.startsWith('file:///android_asset/')) return true;
    } catch (e) {}
    return false;
  }

  hasNativeSupport() {
    const doc = document;
    return Boolean(
      doc.fullscreenEnabled ||
      doc.webkitFullscreenEnabled ||
      doc.mozFullScreenEnabled ||
      doc.msFullscreenEnabled
    );
  }

  isActive() {
    const doc = document;
    const isNative = Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.webkitCurrentFullScreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
    return isNative || this.isPseudoFullscreen;
  }

  async requestNativeFullscreen() {
    const elem = document.documentElement;
    const body = document.body;
    const targets = [elem, body];

    for (const target of targets) {
      if (!target) continue;
      try {
        if (target.requestFullscreen) {
          try {
            await target.requestFullscreen({ navigationUI: 'hide' });
            return true;
          } catch (optErr) {
            await target.requestFullscreen();
            return true;
          }
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen();
          return true;
        } else if (target.webkitRequestFullScreen) {
          target.webkitRequestFullScreen();
          return true;
        } else if (target.mozRequestFullScreen) {
          target.mozRequestFullScreen();
          return true;
        } else if (target.msRequestFullscreen) {
          target.msRequestFullscreen();
          return true;
        }
      } catch (err) {
        console.warn('Native fullscreen request rejected on element', target, err);
      }
    }
    return false;
  }

  async exitNativeFullscreen() {
    const doc = document;
    try {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
        return true;
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
        return true;
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
        return true;
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
        return true;
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
        return true;
      }
    } catch (err) {
      console.warn('Exit native fullscreen failed', err);
    }
    return false;
  }

  enterPseudoFullscreen() {
    this.isPseudoFullscreen = true;
    if (document.documentElement) document.documentElement.classList.add('pseudo-fullscreen');
    if (document.body) document.body.classList.add('pseudo-fullscreen');
    try { window.scrollTo(0, 0); } catch (e) {}
    this.triggerViewportResize();
    this.updateUI();
  }

  exitPseudoFullscreen() {
    this.isPseudoFullscreen = false;
    if (document.documentElement) document.documentElement.classList.remove('pseudo-fullscreen');
    if (document.body) document.body.classList.remove('pseudo-fullscreen');
    this.triggerViewportResize();
    this.updateUI();
  }

  triggerViewportResize() {
    window.dispatchEvent(new Event('resize'));
    if (window.Game && window.Game.radar && typeof window.Game.radar.resize === 'function') {
      window.Game.radar.resize();
    }
  }

  async toggle() {
    if (this.isAndroidApk()) return;

    if (this.isActive()) {
      if (this.isPseudoFullscreen) {
        this.exitPseudoFullscreen();
      }
      await this.exitNativeFullscreen();
    } else {
      let succeeded = false;
      if (this.hasNativeSupport()) {
        succeeded = await this.requestNativeFullscreen();
      }
      if (!succeeded) {
        this.enterPseudoFullscreen();
      }
    }

    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
    this.updateUI();
  }

  updateUI() {
    if (this.isAndroidApk()) {
      const btnProc = document.getElementById('btn-proc-fullscreen');
      const btnHud = document.getElementById('btn-fullscreen-toggle');
      const btnCfg = document.getElementById('btn-cfg-fullscreen');
      if (btnProc) btnProc.style.display = 'none';
      if (btnHud) btnHud.style.display = 'none';
      if (btnCfg) btnCfg.style.display = 'none';
      return;
    }

    const active = this.isActive();
    const label = active ? 'EXIT FULL' : 'FULLSCREEN';

    const btnProc = document.getElementById('btn-proc-fullscreen');
    const btnHud = document.getElementById('btn-fullscreen-toggle');
    const btnCfg = document.getElementById('btn-cfg-fullscreen');

    const updateBtn = (btn, isSmall) => {
      if (!btn) return;
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = label;
      } else {
        const iconSize = isSmall ? 11 : 13;
        btn.innerHTML = `<img src="icons/fullscreen.svg" class="btn-vector-ico" width="${iconSize}" height="${iconSize}" alt="Fullscreen"><span>${label}</span>`;
      }
      btn.classList.toggle('active', active);
    };

    updateBtn(btnProc, false);
    updateBtn(btnHud, true);
    if (btnCfg) {
      btnCfg.textContent = label;
      btnCfg.classList.toggle('highlight', active);
    }
  }

  init() {
    if (this.isAndroidApk()) {
      if (document.documentElement) {
        document.documentElement.classList.add('is-android-apk');
      }
      this.updateUI();
      return;
    }

    const bindButton = (id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.onclick = () => {
        this.toggle();
      };
    };

    bindButton('btn-proc-fullscreen');
    bindButton('btn-fullscreen-toggle');
    bindButton('btn-cfg-fullscreen');

    const eventNames = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    eventNames.forEach(evt => {
      document.addEventListener(evt, () => {
        if (!this.hasNativeSupport() || !Boolean(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        )) {
          if (!this.isPseudoFullscreen) {
            this.updateUI();
          }
        } else {
          this.isPseudoFullscreen = false;
          if (document.documentElement) document.documentElement.classList.remove('pseudo-fullscreen');
          if (document.body) document.body.classList.remove('pseudo-fullscreen');
          this.updateUI();
        }
        this.triggerViewportResize();
      });
    });

    window.addEventListener('resize', () => this.updateUI());
    this.updateUI();
  }
}

window.FullscreenHandler = FullscreenHandler;