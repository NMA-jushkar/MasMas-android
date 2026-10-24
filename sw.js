// Offline cache for حضور و غیاب مس‌مس (android v1.0.1)
const CACHE = "masmas-hozoor-android-1.0.1-0045dcefda";
const ASSETS = ["./", "index.html", "app.js", "app.css", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "fonts/vazirmatn-arabic-400-normal.woff2", "fonts/vazirmatn-latin-400-normal.woff2", "fonts/vazirmatn-arabic-500-normal.woff2", "fonts/vazirmatn-latin-500-normal.woff2", "fonts/vazirmatn-arabic-700-normal.woff2", "fonts/vazirmatn-latin-700-normal.woff2", "fonts/vazirmatn-arabic-800-normal.woff2", "fonts/vazirmatn-latin-800-normal.woff2", "fonts/lalezar-arabic-400-normal.woff2", "fonts/lalezar-latin-400-normal.woff2"];
self.addEventListener("install", e => {
  // cache: "reload" skips the browser's HTTP cache, so an update never mixes old and new files
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, {cache: "reload"})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("masmas-hozoor-android-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => req.mode === "navigate" ? caches.match("index.html") : Response.error()))
  );
});
