/**
 * js/systems/engine/pwa.js - Automatic PWA Service Worker registration
 */

class PwaController {
  static init() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    const proto = window.location && window.location.protocol;
    if (proto !== 'http:' && proto !== 'https:') return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' })
        .then((registration) => {
          if (navigator.onLine) registration.update().catch(() => {});
        })
        .catch((err) => {
          console.warn('Service Worker registration failed:', err);
        });
    }, { once: true });
  }
}

window.PwaController = PwaController;
PwaController.init();
