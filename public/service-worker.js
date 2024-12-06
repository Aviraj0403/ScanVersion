const CACHE_NAME = 'restaurant-app-cache-v1';

// List of URLs to be cached during installation
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/assets/images/hero-banner.png',
  '/assets/images/hero-banner-bg.png',
  '/assets/images/hero-bg.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', // External CDN assets
];

// Install event - Cache the defined assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - Clean up outdated caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);  // Delete old cache versions
          }
        })
      );
    })
  );
});

// Fetch event - Serve from cache if available, else fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return the cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from the network
        return fetch(event.request).then((response) => {
          // Only cache certain types of assets (like images, scripts, styles, etc.)
          if (event.request.url.includes('/assets/') || event.request.url.includes('/images/')) {
            caches.open(CACHE_NAME).then((cache) => {
              // Cache dynamic resources for future use
              cache.put(event.request, response.clone());
            });
          }
          return response;
        });
      }).catch((err) => {
        console.log('Error fetching resource:', err);
        // Optionally, you can return a fallback page or cached version if the request fails
      })
  );
});
