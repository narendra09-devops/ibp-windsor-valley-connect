const CACHE_NAME = "ibp-windsor-valley-rwa-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./documents-repository.html",
  "./documents-repository.css",
  "./documents-repository.js",
  "./admin-documents.html",
  "./document-form.html",
  "./notice-board.html",
  "./notice-board.css",
  "./notice-board.js",
  "./admin-notices.html",
  "./notice-form.html",
  "./events.html",
  "./events.css",
  "./events.js",
  "./admin-login.html",
  "./admin-dashboard.html",
  "./admin-events.html",
  "./admin-event-form.html",
  "./reports.html",
  "./reports.css",
  "./reports.js",
  "./reports-data.json",
  "./emergency-services.html",
  "./emergency-services.css",
  "./emergency-services.js",
  "./emergency-services.json",
  "./css/style.css",
  "./js/app.js",
  "./manifest.json",
  "./data/public-data.json",
  "./data/documents.json",
  "./data/documents-public.json",
  "./data/documents-admin.json",
  "./data/notices.json",
  "./data/notices-public.json",
  "./data/notices-admin.json",
  "./data/events.json",
  "./data/events-public.json",
  "./data/events-admin.json",
  "./js/admin-auth.js",
  "./js/admin-documents.js",
  "./js/admin-events.js",
  "./js/admin-notices.js",
  "./assets/images/rwa-logo.png",
  "./assets/images/RWA-Society-Account-UPI.jpeg",
  "./assets/images/Prepaid-meter-Account-details.png",
  "./assets/documents/RWA_Windsor_Valley_Certificate.pdf",
  "./assets/documents/Prepaid_recharge_manual.pdf"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
    )
  );
});
