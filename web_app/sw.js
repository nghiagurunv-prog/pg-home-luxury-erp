/**
 * PG HOME LUXURY - PWA SERVICE WORKER
 * Cache-first for offline agility and instantaneous launch
 */

// Legacy compatibility marker: "pghome-v12.2-clean-ui-2026"
const CACHE_NAME = "pghome-v14.5-flash50-atelier-2026";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./modules/w41_luxury_gold_theme_tokens.css",
  "./modules/w42_print_a4_stylesheet.css",
  "./modules/w50_master_hub_loader.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[PWA] Đang tạo bộ nhớ đệm cho PG Home Luxury...");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            console.log("[PWA] Dọn dẹp cache cũ:", k);
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Network first with cache: no-store to guarantee freshest Italian Atelier UI & financial data
  e.respondWith(
    fetch(e.request, { cache: "no-store" }).catch(() => {
      return caches.match(e.request);
    })
  );
});
