/**
 * AIRSPACE STANDOFF: Fullscreen Controls Handler
 * Detects native Android APK vs browser and updates buttons while preserving vector icons.
 */

class FullscreenHandler {
  constructor(controlsSys) {
    this.sys = controlsSys;
    this.game = controlsSys.game;
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

  isActive() {
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  toggle() {
    if (this.isAndroidApk()) return;

    try {
      if (!this.isActive()) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(() => {});
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }

    if (typeof AudioSys !== 'undefined') AudioSys.playClick();
  }

  updateUI() {
    if (this.isAndroidApk()) {
      const btnProc = document.getElementById('btn-proc-fullscreen');
      const btnHud = document.getElementById('btn-fullscreen-toggle');
      if (btnProc) btnProc.style.display = 'none';
      if (btnHud) btnHud.style.display = 'none';
      return;
    }

    const active = this.isActive();
    const label = active ? 'EXIT FULL' : 'FULLSCREEN';

    const btnProc = document.getElementById('btn-proc-fullscreen');
    const btnHud = document.getElementById('btn-fullscreen-toggle');

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
  }

  init() {
    if (this.isAndroidApk()) {
      if (document.documentElement) {
        document.documentElement.classList.add('is-android-apk');
      }
      this.updateUI();
      return;
    }

    const btnProc = document.getElementById('btn-proc-fullscreen');
    const btnHud = document.getElementById('btn-fullscreen-toggle');

    if (btnProc) {
      btnProc.onclick = (e) => {
        e.preventDefault();
        this.toggle();
      };
    }

    if (btnHud) {
      btnHud.onclick = (e) => {
        e.preventDefault();
        this.toggle();
      };
    }

    const eventNames = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    eventNames.forEach(evt => {
      document.addEventListener(evt, () => this.updateUI());
    });

    this.updateUI();
  }
}

window.FullscreenHandler = FullscreenHandler;