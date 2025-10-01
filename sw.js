const CACHE_NAME = 'app-scanner-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html'
];

// Evento de instalación: se guarda la app en caché.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento de "fetch": intercepta las solicitudes de red.
self.addEventListener('fetch', event => {
  // Intenta obtener el recurso de la red primero.
  // Si falla (estás sin conexión), lo busca en el caché.
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
