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

  isNativeFullscreen() {
    const doc = document;
    return Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.webkitCurrentFullScreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }

  isActive() {
    return this.isNativeFullscreen() || this.isPseudoFullscreen;
  }

  async requestNativeFullscreen() {
    const target = document.documentElement || document.body;
    if (!target) return false;

    const req = target.requestFullscreen ||
      target.webkitRequestFullscreen ||
      target.webkitRequestFullScreen ||
      target.mozRequestFullScreen ||
      target.msRequestFullscreen;

    if (!req) return false;

    try {
      const res = req.call(target);
      if (res && typeof res.then === 'function') {
        await res;
      }
      return true;
    } catch (err) {
      console.warn('DocumentElement requestFullscreen failed, attempting body fallback', err);
      if (target !== document.body && document.body) {
        const bodyReq = document.body.requestFullscreen || document.body.webkitRequestFullscreen;
        if (bodyReq) {
          try {
            const bodyRes = bodyReq.call(document.body);
            if (bodyRes && typeof bodyRes.then === 'function') {
              await bodyRes;
            }
            return true;
          } catch (bErr) {
            console.warn('Body requestFullscreen failed', bErr);
          }
        }
      }
    }
    return false;
  }

  async exitNativeFullscreen() {
    const doc = document;
    const exit = doc.exitFullscreen ||
      doc.webkitExitFullscreen ||
      doc.webkitCancelFullScreen ||
      doc.mozCancelFullScreen ||
      doc.msExitFullscreen;

    if (!exit) return false;

    try {
      const res = exit.call(doc);
      if (res && typeof res.then === 'function') {
        await res;
      }
      return true;
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
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (window.Game && window.Game.radar && typeof window.Game.radar.resize === 'function') {
        window.Game.radar.resize();
      }
    }, 120);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (window.Game && window.Game.radar && typeof window.Game.radar.resize === 'function') {
        window.Game.radar.resize();
      }
    }, 320);
  }

  async toggle() {
    if (this.isAndroidApk()) return;

    if (this.isActive()) {
      if (this.isPseudoFullscreen) {
        this.exitPseudoFullscreen();
      }
      if (this.isNativeFullscreen()) {
        await this.exitNativeFullscreen();
      }
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
    this.triggerViewportResize();
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

  bindElement(btn) {
    if (!btn || btn._fsBound) return;
    btn._fsBound = true;
    let lastAction = 0;
    const executeToggle = (e) => {
      const now = Date.now();
      if (now - lastAction < 350) return;
      lastAction = now;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.toggle();
    };

    btn.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') executeToggle(e);
    });
    btn.addEventListener('click', executeToggle);
  }

  init() {
    if (this.isAndroidApk()) {
      if (document.documentElement) {
        document.documentElement.classList.add('is-android-apk');
      }
      this.updateUI();
      return;
    }

    ['btn-proc-fullscreen', 'btn-fullscreen-toggle', 'btn-cfg-fullscreen'].forEach(id => {
      this.bindElement(document.getElementById(id));
    });

    let lastDelegated = 0;
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#btn-proc-fullscreen, #btn-fullscreen-toggle, #btn-cfg-fullscreen');
      if (btn && !btn._fsBound) {
        const now = Date.now();
        if (now - lastDelegated < 350) return;
        lastDelegated = now;
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
      }
    });

    const eventNames = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    eventNames.forEach(evt => {
      document.addEventListener(evt, () => {
        const isNative = this.isNativeFullscreen();
        if (isNative) {
          this.isPseudoFullscreen = false;
          if (document.documentElement) document.documentElement.classList.remove('pseudo-fullscreen');
          if (document.body) document.body.classList.remove('pseudo-fullscreen');
        }
        this.updateUI();
        this.triggerViewportResize();
      });
    });

    window.addEventListener('resize', () => this.updateUI());
    this.updateUI();
  }
}

window.FullscreenHandler = FullscreenHandler;