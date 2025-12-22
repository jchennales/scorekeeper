const CACHE_NAME = 'scorekeeper-cache-v1_1.0.0';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of ASSETS) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('SW: failed to cache', url, err);
        }
      }
    })()
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// FETCH
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
