/* Service worker — offline-first cache. Bump VERSION on every deploy so
   clients pick up new question banks and app code. */
const VERSION = "v4-declutter";
const CACHE = "lcsw-prep-" + VERSION;

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k.startsWith("lcsw-prep-") && k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for everything same-origin: you always get the newest deploy
// when online, and the full app (all banks, trainers) when offline.
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return resp;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: false })
        .then(hit => hit || caches.match("./index.html")))
  );
});
