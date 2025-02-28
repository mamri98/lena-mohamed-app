// This will be replaced by the workbox-generated service worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
  });
  
  self.addEventListener('fetch', (event) => {
    if (!navigator.onLine) {
      event.respondWith(
        caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
      );
    }
  });