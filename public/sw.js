const CACHE_NAME = 'cooking-cat-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled([
        cache.add('/'),
        cache.add('/logo.png'),
        cache.add('/loader.svg'),
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome extensions and external requests
  if (!url.origin.includes(self.location.origin)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      // Return cached version if available
      if (cached) return cached;

      // Fetch and cache new requests
      return fetch(request).then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Cache static assets and pages
        if (
          url.pathname.startsWith('/_next/static/') ||
          url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2?)$/) ||
          url.pathname.startsWith('/home') ||
          url.pathname.startsWith('/recipes') ||
          url.pathname.startsWith('/ingredients') ||
          url.pathname.startsWith('/tags') ||
          url.pathname.startsWith('/about')
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }

        return response;
      }).catch(() => {
        // Return cached page for navigation requests when offline
        if (request.mode === 'navigate') {
          // Try to return the specific cached page first
          return caches.match(request).then((match) => {
            if (match) return match;
            // Fallback to home page if available
            return caches.match('/home').then((homeMatch) => {
              if (homeMatch) return homeMatch;
              // Last resort: return root page
              return caches.match('/');
            });
          });
        }
      });
    })
  );
});
