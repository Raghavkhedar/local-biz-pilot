
const CACHE_VERSION = '1.1.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const DATA_CACHE = `data-${CACHE_VERSION}`;
const ASSET_CACHE = `assets-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-152x152.png',
  '/icon-180x180.png',
  '/icon-167x167.png',
  '/favicon.ico',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

const OFFLINE_FALLBACK = '/offline.html';
const API_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Install event - cache static assets and create offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DATA_CACHE),
      caches.open(ASSET_CACHE),
      // Create offline fallback page
      fetch(OFFLINE_FALLBACK).catch(() => {
        return new Response(
          '<html><head><title>Offline</title></head><body><h1>Offline</h1><p>You are currently offline. Please check your internet connection.</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
    ])
  );
  // Force activation
  self.skipWaiting();
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, DATA_CACHE, ASSET_CACHE];
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event with improved caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API calls
  if (request.url.includes('/api/')) {
    event.respondWith(
      handleApiRequest(request)
    );
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      handleStaticAsset(request)
    );
    return;
  }

  // Handle other requests
  event.respondWith(
    handleOtherRequest(request)
  );
});

// API request handler with network-first strategy and timed cache
async function handleApiRequest(request) {
  const cache = await caches.open(DATA_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clonedResponse = response.clone();
      cache.put(request, clonedResponse);
      return response;
    }
  } catch (error) {
    console.log('Fetch failed; returning offline data instead', error);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // Check if cached response is still valid
      const cachedTime = new Date(cachedResponse.headers.get('sw-cache-timestamp'));
      if (Date.now() - cachedTime.getTime() < API_CACHE_DURATION) {
        return cachedResponse;
      }
    }
    // If no valid cached response, store request for background sync
    await storeForBackgroundSync(request);
    throw error;
  }
}

// Static asset handler with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Static asset not available offline', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Other request handler with network-first strategy
async function handleOtherRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match(OFFLINE_FALLBACK);
    }
    return new Response('Content not available offline', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  const db = await openIndexedDB();
  const stores = ['offlineInvoices', 'offlineProducts', 'offlineCustomers', 'offlineExpenses'];
  
  for (const store of stores) {
    const tx = db.transaction(store, 'readwrite');
    const offlineData = await tx.objectStore(store).getAll();
    
    for (const item of offlineData) {
      try {
        const response = await fetch(`/api/${store.replace('offline', '').toLowerCase()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        
        if (response.ok) {
          await tx.objectStore(store).delete(item.id);
        }
      } catch (error) {
        console.error(`Error syncing ${store}:`, error);
      }
    }
  }
}

// Helper function to open IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BusinessDB', 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const stores = [
        'offlineInvoices',
        'offlineProducts',
        'offlineCustomers',
        'offlineExpenses'
      ];
      
      stores.forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' });
        }
      });
    };
  });
}

// Store failed requests for background sync
async function storeForBackgroundSync(request) {
  const db = await openIndexedDB();
  const storeName = getStoreNameFromRequest(request);
  if (!storeName) return;
  
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  
  const requestData = await request.json();
  await store.add({
    ...requestData,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  });
}

function getStoreNameFromRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.split('/').pop();
  
  const storeMap = {
    'invoices': 'offlineInvoices',
    'products': 'offlineProducts',
    'customers': 'offlineCustomers',
    'expenses': 'offlineExpenses'
  };
  
  return storeMap[path];
}

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ],
    tag: 'business-notification',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification('Business Pilot', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((windowClients) => {
        for (let client of windowClients) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow('/');
      })
    );
  }
});
