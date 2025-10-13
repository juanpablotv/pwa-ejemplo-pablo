
//1. Nombre del service worker y los archivos a cachear 
const CACHE_NAME = "mi-cache";
const BASE_PATH = "pwa-ejemplo-pablo/"
const urlsToCache = [
    `${BASE_PATH}manifest.json`,
    `${BASE_PATH}index.html`,
    `${BASE_PATH}style.css`,
    `${BASE_PATH}style.css`,
    `${BASE_PATH}app.js`,
    `${BASE_PATH}offline.html`,
    `${BASE_PATH}icons/icon-192x192.png`,
    `${BASE_PATH}icons/icon-512x512.png`,

];

//2. INSTALL -| se ejecuta al instalar el service worker 
//se cachean(se meten a cache) los recursos del PageSwapEvent
self.addEventListener("install", event => {
    console.log("Service Worker: Instalando..."); 
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Archivos cacheados");
            return cache.addAll(urlsToCache)
        })
    );
});

//3. ACTIVATE -> se ejecuta al activarse el service worker 
//limpiar el caché viejo, para mantener solo la versión actual de la caché
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter( key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
}); 

//4. FETCH -> intercepta peticiones de la app 
//Intercepta cada peticin de la PWA 
//Busca primero en cache 
//si no esta, busca en la red 
//En caso de falla muestra la pagina Offline.html 
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch (()=> caches.match(`${BASE_PATH}offline.html`));
        })
    );
});

//5. PUSH -> notificaciones en segundo plano
//   manejo de notificaciones push (opcional)
self.addEventListener("push", event => {
    const data = event.data ? event.data.text () : "Notifcación sin texto"
    event.waitUntil(
        self.registration.showNotification("Mi PWA", {body: data}) 
    );
});