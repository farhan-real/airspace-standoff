/* sw.js - AIRSPACE STANDOFF Offline-First Service Worker with Single-Manifest Diff Updates */

const CACHE_NAME = 'airspace-standoff-app-v2';
const FONT_CACHE = 'airspace-standoff-fonts-v1';

const CORE_ASSETS = [
  "./",
  "./asset-manifest.json",
  "./css/core/base.css",
  "./css/core/codex.css",
  "./css/core/dialogs/dialogs.css",
  "./css/core/dialogs/saveload.css",
  "./css/core/dialogs/settings.css",
  "./css/core/dialogs/specs.css",
  "./css/core/dropdown.css",
  "./css/core/manual.css",
  "./css/core/theme.css",
  "./css/core/tooltips.css",
  "./css/debrief/debrief.css",
  "./css/debrief/debriefroster.css",
  "./css/debrief/replay.css",
  "./css/debrief/timeline.css",
  "./css/editor/editor.css",
  "./css/editor/editorpreview.css",
  "./css/hud/banner.css",
  "./css/hud/combat/deck.css",
  "./css/hud/combat/sms.css",
  "./css/hud/flight/mfd.css",
  "./css/hud/flight/roster.css",
  "./css/hud/flight/tape.css",
  "./css/hud/inspection/cards.css",
  "./css/hud/inspection/factors.css",
  "./css/hud/inspection/graphs.css",
  "./css/hud/inspection/layout.css",
  "./css/hud/radar.css",
  "./css/hud/workspace.css",
  "./css/leaderboard/dossier.css",
  "./css/leaderboard/leaderboard.css",
  "./css/procurement/catalog/armory.css",
  "./css/procurement/catalog/cards.css",
  "./css/procurement/catalog/preconfig.css",
  "./css/procurement/header.css",
  "./css/procurement/layout.css",
  "./css/procurement/presets.css",
  "./css/procurement/squadron/hardware.css",
  "./css/procurement/squadron/loadout.css",
  "./css/procurement/squadron/stations.css",
  "./favicon.svg",
  "./icons/arrowdown.svg",
  "./icons/arrowleft.svg",
  "./icons/arrowright.svg",
  "./icons/arrowup.svg",
  "./icons/chevron.svg",
  "./icons/close.svg",
  "./icons/degree.svg",
  "./icons/diamond.svg",
  "./icons/dot.svg",
  "./icons/edit.svg",
  "./icons/fullscreen.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/leaderboard.svg",
  "./icons/manual.svg",
  "./icons/pause.svg",
  "./icons/plusminus.svg",
  "./icons/settings.svg",
  "./icons/star.svg",
  "./icons/trash.svg",
  "./index.html",
  "./js/data/aidifficulties.js",
  "./js/data/aircraft.js",
  "./js/data/aircraft/airdominance.js",
  "./js/data/aircraft/cas.js",
  "./js/data/aircraft/coffin.js",
  "./js/data/aircraft/drones.js",
  "./js/data/aircraft/ew.js",
  "./js/data/aircraft/experimental.js",
  "./js/data/aircraft/interdictors.js",
  "./js/data/aircraft/multirole.js",
  "./js/data/aircraft/multiroleplus.js",
  "./js/data/aircraft/stealth.js",
  "./js/data/aircraft/stealthnext.js",
  "./js/data/aircraft/strike.js",
  "./js/data/aircraft/superfighters.js",
  "./js/data/aircraft/superiority.js",
  "./js/data/attackdifficulties.js",
  "./js/data/constants.js",
  "./js/data/doctrines.js",
  "./js/data/ground/bases.js",
  "./js/data/ground/radars.js",
  "./js/data/ground/sams.js",
  "./js/data/groundunits.js",
  "./js/data/manual.js",
  "./js/data/manual/attack.js",
  "./js/data/manual/basics.js",
  "./js/data/manual/combat.js",
  "./js/data/manual/controls.js",
  "./js/data/manual/doctrines.js",
  "./js/data/manual/ground.js",
  "./js/data/manual/groundtactics.js",
  "./js/data/manual/militarybasics.js",
  "./js/data/manual/militarydata.js",
  "./js/data/manual/operations.js",
  "./js/data/manual/sensors.js",
  "./js/data/manual/systems.js",
  "./js/data/manual/theater.js",
  "./js/data/manual/theaterdata.js",
  "./js/data/templates.js",
  "./js/data/templates/a2g/bombers.js",
  "./js/data/templates/a2g/cas.js",
  "./js/data/templates/a2g/multirole.js",
  "./js/data/templates/a2g/specials.js",
  "./js/data/templates/a2g/stealth.js",
  "./js/data/templates/a2g/superiority.js",
  "./js/data/templates/airdominance.js",
  "./js/data/templates/drones.js",
  "./js/data/templates/ew.js",
  "./js/data/templates/ewplus.js",
  "./js/data/templates/experimental.js",
  "./js/data/templates/multirole.js",
  "./js/data/templates/multiroleplus.js",
  "./js/data/templates/stealth.js",
  "./js/data/templates/stealthnext.js",
  "./js/data/templates/strike.js",
  "./js/data/templates/superfighters.js",
  "./js/data/templates/superiority.js",
  "./js/data/upgrades.js",
  "./js/data/upgrades/advancedmaneuvers.js",
  "./js/data/upgrades/components.js",
  "./js/data/upgrades/maneuvers.js",
  "./js/data/upgrades/strikecomponents.js",
  "./js/data/weapons.js",
  "./js/data/weapons/a2a.js",
  "./js/data/weapons/a2acannons.js",
  "./js/data/weapons/a2alegacy.js",
  "./js/data/weapons/a2amicro.js",
  "./js/data/weapons/a2aramjet.js",
  "./js/data/weapons/a2aulr.js",
  "./js/data/weapons/a2g.js",
  "./js/data/weapons/a2garms.js",
  "./js/data/weapons/a2gbunker.js",
  "./js/data/weapons/a2gcannons.js",
  "./js/data/weapons/a2gcluster.js",
  "./js/data/weapons/a2gcruise.js",
  "./js/data/weapons/a2gglide.js",
  "./js/data/weapons/a2glaser.js",
  "./js/data/weapons/a2gloitering.js",
  "./js/data/weapons/a2gmissiles.js",
  "./js/data/weapons/a2grockets.js",
  "./js/data/weapons/autocannons.js",
  "./js/data/weapons/energy.js",
  "./js/data/weapons/pods.js",
  "./js/data/weapons/targetingpods.js",
  "./js/data/weapons/wvr.js",
  "./js/game.js",
  "./js/systems/combat/ai/commander.js",
  "./js/systems/combat/ai/evasion.js",
  "./js/systems/combat/ai/navigation.js",
  "./js/systems/combat/ai/planning.js",
  "./js/systems/combat/ai/salvo.js",
  "./js/systems/combat/ai/tactics.js",
  "./js/systems/combat/airbase.js",
  "./js/systems/combat/attackdirector.js",
  "./js/systems/combat/attackgenerator.js",
  "./js/systems/combat/combat.js",
  "./js/systems/combat/fleet.js",
  "./js/systems/combat/formation.js",
  "./js/systems/combat/guns.js",
  "./js/systems/combat/outfitter.js",
  "./js/systems/combat/waves.js",
  "./js/systems/engine/audio.js",
  "./js/systems/engine/persistence.js",
  "./js/systems/engine/physics.js",
  "./js/systems/engine/prng.js",
  "./js/systems/engine/pwa.js",
  "./js/systems/engine/rwr.js",
  "./js/systems/engine/save/deserializer.js",
  "./js/systems/engine/save/manager.js",
  "./js/systems/engine/save/serializer.js",
  "./js/systems/engine/spawner.js",
  "./js/systems/engine/synth.js",
  "./js/systems/entities.js",
  "./js/systems/entities/aircraft.js",
  "./js/systems/entities/aircraftcombat.js",
  "./js/systems/entities/aircraftkinematics.js",
  "./js/systems/entities/buffs.js",
  "./js/systems/entities/civilian.js",
  "./js/systems/entities/cloud.js",
  "./js/systems/entities/decoy.js",
  "./js/systems/entities/ghost.js",
  "./js/systems/entities/missile.js",
  "./js/systems/entities/surface.js",
  "./js/systems/entities/surfacecombat.js",
  "./js/systems/missiles/guidance.js",
  "./js/systems/missiles/impact.js",
  "./js/systems/missiles/kinetics.js",
  "./js/systems/radar.js",
  "./js/systems/radar/auxcontacts.js",
  "./js/systems/radar/camera.js",
  "./js/systems/radar/contacts.js",
  "./js/systems/radar/effects.js",
  "./js/systems/radar/engagement.js",
  "./js/systems/radar/environment.js",
  "./js/systems/radar/renderer.js",
  "./js/systems/radar/surfacezones.js",
  "./js/systems/simulation.js",
  "./js/systems/simulation/atmosphere.js",
  "./js/systems/simulation/debrief/aarstats.js",
  "./js/systems/simulation/debrief/report.js",
  "./js/systems/simulation/debrief/timeline.js",
  "./js/systems/simulation/detection.js",
  "./js/systems/simulation/replay/codec.js",
  "./js/systems/simulation/replay/map.js",
  "./js/systems/simulation/replay/player.js",
  "./js/systems/simulation/rules.js",
  "./js/systems/simulation/scoring.js",
  "./js/ui/avionics/avionics.js",
  "./js/ui/avionics/roster.js",
  "./js/ui/cards.js",
  "./js/ui/cards/autocannon.js",
  "./js/ui/cards/autocannonfire.js",
  "./js/ui/cards/deck.js",
  "./js/ui/cards/pylons.js",
  "./js/ui/cards/target.js",
  "./js/ui/cards/updater.js",
  "./js/ui/controls.js",
  "./js/ui/controls/fullscreen.js",
  "./js/ui/controls/keyboard.js",
  "./js/ui/controls/pointer.js",
  "./js/ui/controls/targeting.js",
  "./js/ui/dropdown.js",
  "./js/ui/inspection/cognition.js",
  "./js/ui/inspection/controller.js",
  "./js/ui/inspection/events.js",
  "./js/ui/inspection/graphs.js",
  "./js/ui/inspection/graphs/dlz.js",
  "./js/ui/inspection/graphs/fleetpower.js",
  "./js/ui/inspection/graphs/history.js",
  "./js/ui/inspection/graphs/polar.js",
  "./js/ui/inspection/graphs/surfacegraphs.js",
  "./js/ui/inspection/graphs/turngauge.js",
  "./js/ui/inspection/overview.js",
  "./js/ui/inspection/radar.js",
  "./js/ui/inspection/rawdata.js",
  "./js/ui/inspection/solutions.js",
  "./js/ui/inspection/surfaceoverview.js",
  "./js/ui/inspection/surfaceradar.js",
  "./js/ui/inspection/surfaceweapons.js",
  "./js/ui/inspection/telemetry.js",
  "./js/ui/inspection/views.js",
  "./js/ui/inspection/weapons.js",
  "./js/ui/leaderboard/dossier.js",
  "./js/ui/leaderboard/leaderboard.js",
  "./js/ui/missioneditor/builder.js",
  "./js/ui/missioneditor/config.js",
  "./js/ui/missioneditor/editor.js",
  "./js/ui/modals/debrief.js",
  "./js/ui/modals/dialogs.js",
  "./js/ui/modals/editor.js",
  "./js/ui/modals/panels.js",
  "./js/ui/modals/saveload.js",
  "./js/ui/modals/savemap.js",
  "./js/ui/procurement.js",
  "./js/ui/procurement/actions.js",
  "./js/ui/procurement/catalog/airframes.js",
  "./js/ui/procurement/catalog/presets.js",
  "./js/ui/procurement/catalog/shelf.js",
  "./js/ui/procurement/catalog/shelfcards.js",
  "./js/ui/procurement/dialogs/cards.js",
  "./js/ui/procurement/dialogs/dialog.js",
  "./js/ui/procurement/dialogs/preconfig.js",
  "./js/ui/procurement/dialogs/squadronpresets.js",
  "./js/ui/procurement/dropdowns.js",
  "./js/ui/procurement/equip.js",
  "./js/ui/procurement/loadoutmetrics.js",
  "./js/ui/procurement/presetmatcher.js",
  "./js/ui/procurement/specs/behaviors.js",
  "./js/ui/procurement/specs/eval.js",
  "./js/ui/procurement/specs/facilities.js",
  "./js/ui/procurement/specs/modal.js",
  "./js/ui/procurement/specs/specs.js",
  "./js/ui/procurement/specs/views.js",
  "./js/ui/procurement/specs/weaponbehaviors.js",
  "./js/ui/procurement/squadron/card.js",
  "./js/ui/procurement/squadron/loadouts.js",
  "./js/ui/procurement/squadron/roster.js",
  "./js/ui/procurement/squadron/stations.js",
  "./js/ui/settings.js",
  "./manifest.webmanifest"
];

let isCheckingUpdates = false;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const batchSize = 16;
      for (let i = 0; i < CORE_ASSETS.length; i += batchSize) {
        const slice = CORE_ASSETS.slice(i, i + batchSize);
        await Promise.all(slice.map(async (url) => {
          try {
            const req = new Request(url, { cache: 'reload' });
            const res = await fetch(req);
            if (res && res.ok) await cache.put(url, res);
          } catch (_) {}
        }));
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME && k !== FONT_CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

function isFontRequest(url) {
  return url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com';
}

function isIgnoredLocalPath(pathname) {
  return pathname.endsWith('/sw.js') ||
    pathname.endsWith('/script.sh') ||
    pathname.endsWith('/push.sh') ||
    pathname.endsWith('/inspect_output.txt');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (isFontRequest(url)) {
    event.respondWith((async () => {
      const cache = await caches.open(FONT_CACHE);
      const cached = await cache.match(req);
      const netPromise = fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      if (cached) {
        event.waitUntil(netPromise);
        return cached;
      }
      const netRes = await netPromise;
      return netRes || new Response('', { status: 504 });
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;
  if (isIgnoredLocalPath(url.pathname)) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = (await cache.match('./index.html')) || (await cache.match('./'));
      if (cached) return cached;
      const res = await fetch(req);
      if (res && res.ok) await cache.put('./index.html', res.clone());
      return res;
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) return cached;
    const res = await fetch(req);
    if (res && res.ok) await cache.put(req, res.clone());
    return res;
  })());
});

async function checkAndSyncFiles() {
  if (isCheckingUpdates) return;
  isCheckingUpdates = true;
  let changedCount = 0;

  try {
    const cache = await caches.open(CACHE_NAME);
    let netManifestRes;
    try {
      netManifestRes = await fetch('./asset-manifest.json', { cache: 'no-store' });
    } catch (_) {
      return;
    }
    if (!netManifestRes || !netManifestRes.ok) return;

    const netText = await netManifestRes.clone().text();
    const netMap = JSON.parse(netText);

    let oldMap = {};
    const cachedManifest = await cache.match('./asset-manifest.json');
    if (cachedManifest) {
      try { oldMap = await cachedManifest.clone().json(); } catch (_) {}
    }

    const changedUrls = [];
    for (const [url, hash] of Object.entries(netMap)) {
      const hasCached = Boolean(await cache.match(url));
      if (!hasCached || oldMap[url] !== hash) {
        changedUrls.push(url);
      }
    }

    const removedUrls = Object.keys(oldMap).filter(u => !(u in netMap));

    if (changedUrls.length === 0 && removedUrls.length === 0) {
      if (!cachedManifest) await cache.put('./asset-manifest.json', netManifestRes);
      return;
    }

    const batchSize = 8;
    for (let i = 0; i < changedUrls.length; i += batchSize) {
      const slice = changedUrls.slice(i, i + batchSize);
      await Promise.all(slice.map(async (url) => {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (res && res.ok) {
            await cache.put(url, res.clone());
            if (url === './index.html') await cache.put('./', res);
            changedCount++;
          }
        } catch (_) {}
      }));
    }

    for (const url of removedUrls) {
      if (await cache.delete(url)) changedCount++;
    }

    await cache.put('./asset-manifest.json', netManifestRes);

    if (changedCount > 0) {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      clients.forEach(c => c.postMessage({ type: 'PWA_FILES_UPDATED', changedCount }));
    }
  } finally {
    isCheckingUpdates = false;
  }
}

self.addEventListener('message', (event) => {
  if (event && event.data && event.data.type === 'CHECK_FOR_UPDATES') {
    event.waitUntil(checkAndSyncFiles());
  }
});
