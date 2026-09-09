const CACHE_NAME = "stockflow-shell-v1";

const APP_SHELL = [
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./assets/css/variables.css",
  "./assets/css/base.css",
  "./assets/css/layout.css",
  "./assets/css/components.css",
  "./assets/js/theme.js",
  "./assets/js/nav.js",
  "./assets/js/data.js",
  "./assets/js/modal.js",
  "./assets/js/kanban.js",
  "./assets/js/pwa.js",
  "./assets/icons/icon.svg",
  "./pages/dashboard.html",
  "./pages/projets.html",
  "./pages/projet-detail.html",
  "./pages/inventaire.html",
  "./pages/utilisateurs.html",
  "./pages/parametres.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") return caches.match("./offline.html");
          return cached;
        });

      return cached || network;
    })
  );
});
