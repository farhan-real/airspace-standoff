/**
 * js/systems/engine/pwa.js - PWA Service Worker registration, background diff check, and update toast.
 */

class PwaController {
  static init() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    const proto = window.location && window.location.protocol;
    if (proto !== 'http:' && proto !== 'https:') return;

    let updateToastShown = false;

    const showUpdateToast = (detailText = 'Updated game files are ready.') => {
      if (updateToastShown) return;
      updateToastShown = true;

      let toast = document.getElementById('pwa-update-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'pwa-update-toast';
        toast.className = 'pwa-update-toast';
        toast.innerHTML = `
          <div class="pwa-update-info">
            <span class="pwa-update-badge">UPDATE READY</span>
            <span class="pwa-update-text"></span>
          </div>
          <div class="pwa-update-actions">
            <button type="button" class="hud-btn small highlight" id="btn-pwa-reload">RELOAD</button>
            <button type="button" class="hud-btn small" id="btn-pwa-dismiss">LATER</button>
          </div>`;
        document.body.appendChild(toast);

        toast.querySelector('#btn-pwa-reload').onclick = () => window.location.reload();
        toast.querySelector('#btn-pwa-dismiss').onclick = () => toast.classList.remove('active');
      }

      const txt = toast.querySelector('.pwa-update-text');
      if (txt) txt.textContent = detailText;
      toast.classList.add('active');
    };

    navigator.serviceWorker.addEventListener('message', (event) => {
      const data = event && event.data;
      if (!data) return;
      if (data.type === 'PWA_FILES_UPDATED' && data.changedCount > 0) {
        const unit = data.changedCount === 1 ? 'file' : 'files';
        showUpdateToast(`${data.changedCount} updated ${unit} cached. Reload to apply.`);
      }
    });

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' })
        .then((registration) => {
          registration.addEventListener('updatefound', () => {
            const installing = registration.installing;
            if (!installing) return;
            installing.addEventListener('statechange', () => {
              if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateToast('New app version downloaded. Reload to apply.');
              }
            });
          });

          setTimeout(() => {
            if (!navigator.onLine) return;
            registration.update().catch(() => {});
            const targetSw = registration.active || navigator.serviceWorker.controller;
            if (targetSw) targetSw.postMessage({ type: 'CHECK_FOR_UPDATES' });
          }, 1200);
        })
        .catch((err) => {
          console.warn('Service Worker registration failed:', err);
        });
    }, { once: true });
  }
}

window.PwaController = PwaController;
PwaController.init();
