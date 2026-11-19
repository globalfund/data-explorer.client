let CACHE_NAME = "my-app-cache-v1";
const urlsToCache = ["/", "/index.html"];

// Listen for version message from index.tsx
self.addEventListener("message", (event) => {
  if (event.data.type === "SET_VERSION") {
    const newCacheName = `my-app-cache-v${event.data.version}`;
    if (newCacheName !== CACHE_NAME) {
      CACHE_NAME = newCacheName;
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        ),
      );
    }
  }
});

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
  // Immediately move to the next phase
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
