// Service Worker mínimo funcional

const CACHE_NAME = "mi-cache-v1";
const BASE_PATH = "pwa-ejemplo-pablo/";
const urlsToCache = [
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.json`,
  `${BASE_PATH}style.css`,
  `${BASE_PATH}offline.html`,
  `${BASE_PATH}icons/icon-192x192.png`,
  `${BASE_PATH}icons/icon-512x512.png`
];

// 1. INSTALL
self.addEventListener("install", (event) => {
  console.log("SW: Instalando...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("SW: Archivos cacheados");
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. ACTIVATE
self.addEventListener("activate", (event) => {
  console.log("SW: Activando...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 3. FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match(`${BASE_PATH}offline.html`))
      );
    })
  );
});

// 4. PUSH (opcional)
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "Notificación sin texto";
  event.waitUntil(
    self.registration.showNotification("Mi PWA", {
      body: data,
      icon: `${BASE_PATH}icons/icon-192x192.png`,
    })
  );
});
