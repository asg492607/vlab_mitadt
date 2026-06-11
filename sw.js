const CACHE_NAME = 'mit-vlab-cache-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/login.html',
    '/dashboard.html',
    '/vlab.html',
    '/teacher.html',
    '/style.css',
    '/vlab.css',
    '/landing.css',
    '/locked-overlay.css',
    '/main.js',
    '/vlab.js',
    '/vlabData.js',
    '/engine.js',
    '/evaluate.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js',
    'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.asm.js',
    'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.asm.wasm'
];

// Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[Service Worker] Pre-caching core assets');
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.warn('[Service Worker] Pre-caching warning (some CDN files might be offline during build):', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event
self.addEventListener('fetch', event => {
    // Skip non-GET requests (e.g. POST requests or Firebase sync calls)
    if (event.request.method !== 'GET') return;

    // Skip chrome-extension or third-party auth sockets/apis
    const url = new URL(event.request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    if (url.host.includes('firestore.googleapis.com') || url.host.includes('identitytoolkit.googleapis.com') || url.host.includes('securetoken.googleapis.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // Return cached asset, fetch a fresh copy in background to update cache (Stale-While-Revalidate)
                fetch(event.request).then(networkResponse => {
                    if (networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse);
                        });
                    }
                }).catch(() => {/* Ignore network errors on update */});
                return cachedResponse;
            }

            // Not in cache, fetch from network
            return fetch(event.request).then(networkResponse => {
                // Cache valid responses dynamically
                if (networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(err => {
                // If offline and request is an HTML page, fallback to cached index/vlab
                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/index.html') || caches.match('/vlab.html');
                }
                throw err;
            });
        })
    );
});
