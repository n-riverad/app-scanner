const CACHE_NAME = 'particiones-scanner-cache-v2';
const URLS_TO_CACHE = [
  '/',
  'index.html',
  'logo-particiones.jpg',
  'logo-500x500.png',
  'manifest.json'
];

// Instala el Service Worker y guarda los archivos base en el caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Activa el Service Worker y limpia cachés viejos si los hay
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta las solicitudes de red (estrategia "Cache First")
self.addEventListener('fetch', event => {
  // Solo interceptamos las solicitudes GET (no las que envían datos a Google)
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en el caché, lo devolvemos desde ahí
        if (response) {
          return response;
        }

        // Si no está en el caché, lo pedimos a la red
        return fetch(event.request)
          .then(networkResponse => {
            // Y opcionalmente, lo guardamos en el caché para la próxima vez
            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
          });
      })
      .catch(() => {
        // Si todo falla, podrías devolver una página de fallback offline
        // pero para esta app no es estrictamente necesario.
      })
  );
});
