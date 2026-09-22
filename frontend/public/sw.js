self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // A simple pass-through fetch handler is required by some browsers to trigger the PWA install prompt.
  // It just fetches the network request normally.
  event.respondWith(fetch(event.request));
});
