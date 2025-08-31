// Service Worker for Hiperliga website
// Implements caching strategies for better performance

const CACHE_NAME = 'hiperliga-v1'
const STATIC_CACHE_NAME = 'hiperliga-static-v1'
const DYNAMIC_CACHE_NAME = 'hiperliga-dynamic-v1'
const IMAGE_CACHE_NAME = 'hiperliga-images-v1'

// Define what to cache
const STATIC_ASSETS = [
  '/',
  '/produtos',
  '/contato',
  '/sobre',
  '/faq',
  '/manifest.json',
  '/images/logo-hiperliga.svg',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js',
]

const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: 'cache-first',
  
  // Network first for API calls and dynamic content
  NETWORK_FIRST: 'network-first',
  
  // Stale while revalidate for updated content
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  
  // Network only for critical updates
  NETWORK_ONLY: 'network-only',
}

// Cache TTL settings (in seconds)
const CACHE_TTL = {
  STATIC: 86400 * 30,    // 30 days for static assets
  DYNAMIC: 86400 * 7,    // 7 days for dynamic content
  IMAGES: 86400 * 14,    // 14 days for images
  API: 300,              // 5 minutes for API responses
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Static assets cached')
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Failed to cache static assets:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== IMAGE_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return
  }

  event.respondWith(handleRequest(request))
})

// Main request handler
async function handleRequest(request) {
  const url = new URL(request.url)
  
  try {
    // Route to appropriate strategy based on request type
    if (isStaticAsset(url)) {
      return cacheFirst(request, STATIC_CACHE_NAME)
    }
    
    if (isImage(url)) {
      return cacheFirst(request, IMAGE_CACHE_NAME)
    }
    
    if (isApiRequest(url)) {
      return networkFirst(request, DYNAMIC_CACHE_NAME)
    }
    
    if (isPageRequest(url)) {
      return staleWhileRevalidate(request, DYNAMIC_CACHE_NAME)
    }
    
    // Default to network first
    return networkFirst(request, DYNAMIC_CACHE_NAME)
    
  } catch (error) {
    console.error('Request failed:', error)
    return handleOffline(request)
  }
}

// Cache first strategy - for static assets
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    // Check if cache is still fresh
    const cacheTime = getCacheTime(cachedResponse)
    const now = Date.now()
    const maxAge = CACHE_TTL.STATIC * 1000
    
    if (now - cacheTime < maxAge) {
      return cachedResponse
    }
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName)
      
      // Add timestamp to response headers
      const responseWithTime = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...networkResponse.headers,
          'sw-cache-time': Date.now().toString()
        }
      })
      
      cache.put(request, responseWithTime.clone())
      return responseWithTime
    }
    
    return networkResponse
    
  } catch (error) {
    return cachedResponse || handleOffline(request)
  }
}

// Network first strategy - for dynamic content
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
    
  } catch (error) {
    const cachedResponse = await caches.match(request)
    return cachedResponse || handleOffline(request)
  }
}

// Stale while revalidate strategy - for pages
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request)
  
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse && networkResponse.status === 200) {
        const cache = caches.open(cacheName)
        cache.then(c => c.put(request, networkResponse.clone()))
      }
      return networkResponse
    })
    .catch(error => {
      console.warn('Network request failed:', error)
    })
  
  return cachedResponse || fetchPromise
}

// Helper functions
function isStaticAsset(url) {
  return url.pathname.startsWith('/_next/static/') ||
         url.pathname.startsWith('/static/') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.woff2') ||
         url.pathname.endsWith('.woff')
}

function isImage(url) {
  return url.pathname.startsWith('/images/') ||
         url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/')
}

function isPageRequest(url) {
  return url.pathname.endsWith('/') ||
         (!url.pathname.includes('.') && !url.pathname.startsWith('/api/'))
}

function getCacheTime(response) {
  const cacheTime = response.headers.get('sw-cache-time')
  return cacheTime ? parseInt(cacheTime) : 0
}

function handleOffline(request) {
  const url = new URL(request.url)
  
  // Return offline page for page requests
  if (isPageRequest(url)) {
    return caches.match('/offline') || 
           new Response('Offline - please check your connection', {
             status: 503,
             headers: { 'Content-Type': 'text/plain' }
           })
  }
  
  // Return placeholder for images
  if (isImage(url)) {
    return new Response('', {
      status: 503,
      headers: { 'Content-Type': 'image/svg+xml' }
    })
  }
  
  return new Response('Network error', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  })
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle background sync logic here
  console.log('Background sync triggered')
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/images/icon-192x192.png',
      badge: '/images/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: data.actions
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const url = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.openWindow(url)
  )
})