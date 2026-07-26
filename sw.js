const CACHE_NAME = 'mit-vlab-cache-v29';

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/login.html',
    '/dashboard.html',
    '/vlab.html',
    '/admin.html',
    '/teacher.html',
    '/style.css',
    '/vlab.css',
    '/landing.css',
    '/locked-overlay.css',
    '/main.js',
    '/vlab.js',
    '/vlabData.js',
    '/engine.js',
    '/evaluate.js'
];

// Install Event
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.warn('[Service Worker] Pre-caching warning:', err);
            });
        })
    );
});

// Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // Skip Firebase APIs
    if (url.host.includes('firestore.googleapis.com') || url.host.includes('identitytoolkit.googleapis.com') || url.host.includes('securetoken.googleapis.com')) {
        return;
    }

    // Network-First Strategy for local files so changes render instantly
    if (url.origin === location.origin) {
        event.respondWith(
            fetch(event.request).then(networkResponse => {
                if (networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            }).catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-First Strategy for external CDN resources
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request).then(networkResponse => {
                if (networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            });
        })
    );
});
