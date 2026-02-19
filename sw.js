self.addEventListener('install', (e) => {
  console.log('Service Worker Installed');
});

self.addEventListener('fetch', (e) => {
  // Website ko smoothly load karne ke liye
  e.respondWith(fetch(e.request));
});
