// public/sw.js - Advanced Service Worker for Hiperliga Performance Optimization
const CACHE_VERSION = 'hiperliga-v7-performance'
const CACHE_NAMES = {
  STATIC: `${CACHE_VERSION}-static`,
  DYNAMIC: `${CACHE_VERSION}-dynamic`,
  IMAGES: `${CACHE_VERSION}-images`,
  DATA: `${CACHE_VERSION}-data`,
  FONTS: `${CACHE_VERSION}-fonts`
}

// Cache duration configurations (in milliseconds)
const CACHE_STRATEGIES = {
  STATIC_ASSETS: 365 * 24 * 60 * 60 * 1000, // 1 year
  DYNAMIC_CONTENT: 7 * 24 * 60 * 60 * 1000, // 7 days
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
  DATA: 24 * 60 * 60 * 1000, // 24 hours
  FONTS: 365 * 24 * 60 * 60 * 1000, // 1 year
  API: 60 * 60 * 1000 // 1 hour
}

// Performance monitoring
let performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  totalResponseTime: 0,
  startTime: Date.now()
}

// Critical resources to preload
const CRITICAL_RESOURCES = [
  '/',
  '/produtos',
  '/sobre',
  '/manifest.json',
  '/images/logo/hiperliga-logo.png',
  '/images/hero/hero-background.jpg',
  '/data/empresa.json'
]

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAMES.STATIC).then((cache) => {
        console.log('[SW] Caching critical resources')
        return cache.addAll(CRITICAL_RESOURCES.map(url => new Request(url, {
          cache: 'reload' // Force fresh fetch during install
        })))
      }),
      // Preload fonts
      caches.open(CACHE_NAMES.FONTS).then((cache) => {
        return cache.addAll([
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
          'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
        ])
      })
    ]).then(() => {
      console.log('[SW] Installation complete')
      // Skip waiting to activate new SW immediately
      return self.skipWaiting()
    })
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('hiperliga-') && 
              !Object.values(CACHE_NAMES).includes(cacheName)
            )
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      }),
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete')
    })
  )
})

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }

  // Performance tracking
  const startTime = performance.now()
  performanceMetrics.networkRequests++

  event.respondWith(
    handleRequest(request, startTime)
      .then(response => {
        const endTime = performance.now()
        performanceMetrics.totalResponseTime += (endTime - startTime)
        return response
      })
  )
})

// Main request handler with intelligent routing
async function handleRequest(request, startTime) {
  const url = new URL(request.url)
  
  try {
    // Route to appropriate strategy based on request type
    if (isStaticAsset(url)) {
      return await cacheFirst(request, CACHE_NAMES.STATIC, CACHE_STRATEGIES.STATIC_ASSETS)
    }
    
    if (isImageRequest(url)) {
      return await cacheFirst(request, CACHE_NAMES.IMAGES, CACHE_STRATEGIES.IMAGES, true)
    }
    
    if (isFontRequest(url)) {
      return await cacheFirst(request, CACHE_NAMES.FONTS, CACHE_STRATEGIES.FONTS)
    }
    
    if (isDataRequest(url)) {
      return await staleWhileRevalidate(request, CACHE_NAMES.DATA, CACHE_STRATEGIES.DATA)
    }
    
    if (isAPIRequest(url)) {
      return await networkFirst(request, CACHE_NAMES.DATA, CACHE_STRATEGIES.API)
    }
    
    // Default: stale-while-revalidate for HTML pages
    return await staleWhileRevalidate(request, CACHE_NAMES.DYNAMIC, CACHE_STRATEGIES.DYNAMIC_CONTENT)
    
  } catch (error) {
    console.error('[SW] Request handling error:', error)
    return await handleOffline(request)
  }
}

// Cache-first strategy (for static assets)
async function cacheFirst(request, cacheName, maxAge, optimizeImages = false) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  if (cached && !isExpired(cached, maxAge)) {
    performanceMetrics.cacheHits++
    return cached
  }
  
  performanceMetrics.cacheMisses++
  
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      // Clone response for caching
      const responseToCache = response.clone()
      
      // Add cache timestamp
      const headers = new Headers(responseToCache.headers)
      headers.set('sw-cache-timestamp', Date.now().toString())
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      })
      
      // Cache the response
      cache.put(request, cachedResponse)
    }
    
    return response
  } catch (error) {
    // Return cached version even if expired when network fails
    if (cached) {
      return cached
    }
    throw error
  }
}

// Network-first strategy (for API calls)
async function networkFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName)
  
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      const responseToCache = response.clone()
      const headers = new Headers(responseToCache.headers)
      headers.set('sw-cache-timestamp', Date.now().toString())
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      })
      
      cache.put(request, cachedResponse)
    }
    
    return response
  } catch (error) {
    // Fallback to cache
    const cached = await cache.match(request)
    if (cached && !isExpired(cached, maxAge)) {
      performanceMetrics.cacheHits++
      return cached
    }
    throw error
  }
}

// Stale-while-revalidate strategy (for dynamic content)
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  // Fetch and cache in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const responseToCache = response.clone()
      const headers = new Headers(responseToCache.headers)
      headers.set('sw-cache-timestamp', Date.now().toString())
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      })
      
      cache.put(request, cachedResponse)
    }
    return response
  }).catch(error => {
    console.warn('[SW] Background fetch failed:', error)
  })
  
  // Return cached version immediately if available
  if (cached) {
    performanceMetrics.cacheHits++
    
    // Only revalidate if cache is stale
    if (isExpired(cached, maxAge)) {
      fetchPromise // Fire and forget
    }
    
    return cached
  }
  
  // No cache, wait for network
  performanceMetrics.cacheMisses++
  return await fetchPromise
}

// Utility functions
function isStaticAsset(url) {
  return /\.(js|css|woff2?|ttf|eot)$/i.test(url.pathname) ||
         url.pathname.startsWith('/_next/static/')
}

function isImageRequest(url) {
  return /\.(png|jpg|jpeg|webp|avif|svg|gif|ico)$/i.test(url.pathname) ||
         url.pathname.startsWith('/images/') ||
         url.pathname.includes('image')
}

function isFontRequest(url) {
  return /\.(woff2?|ttf|eot)$/i.test(url.pathname) ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com'
}

function isDataRequest(url) {
  return /\.json$/i.test(url.pathname) ||
         url.pathname.startsWith('/data/')
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/')
}

function isExpired(response, maxAge) {
  const cacheTimestamp = response.headers.get('sw-cache-timestamp')
  if (!cacheTimestamp) return true
  
  const age = Date.now() - parseInt(cacheTimestamp)
  return age > maxAge
}

// Offline fallback
async function handleOffline(request) {
  const url = new URL(request.url)
  
  if (request.destination === 'document') {
    // Return cached homepage for navigation requests when offline
    const cache = await caches.open(CACHE_NAMES.DYNAMIC)
    const cached = await cache.match('/')
    if (cached) return cached
    
    // Create offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hiperliga - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 20px; }
            .offline { max-width: 400px; margin: 100px auto; }
            h1 { color: #1a365d; }
            p { color: #666; line-height: 1.5; }
            button { background: #1a365d; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; }
            button:hover { background: #2c5282; }
          </style>
        </head>
        <body>
          <div class="offline">
            <h1>🌐 Você está offline</h1>
            <p>Não foi possível conectar à internet. Verifique sua conexão e tente novamente.</p>
            <button onclick="window.location.reload()">Tentar novamente</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    })
  }
  
  // For other requests, try to return from cache
  const cache = await caches.open(CACHE_NAMES.STATIC)
  const cached = await cache.match(request)
  if (cached) return cached
  
  // Final fallback
  return new Response('Resource not available offline', { 
    status: 503,
    statusText: 'Service Unavailable'
  })
}

// Performance analytics
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    const runtime = Date.now() - performanceMetrics.startTime
    const avgResponseTime = performanceMetrics.networkRequests > 0 
      ? performanceMetrics.totalResponseTime / performanceMetrics.networkRequests 
      : 0
    
    const stats = {
      ...performanceMetrics,
      runtime,
      avgResponseTime: Math.round(avgResponseTime),
      cacheHitRate: performanceMetrics.networkRequests > 0 
        ? Math.round((performanceMetrics.cacheHits / performanceMetrics.networkRequests) * 100)
        : 0
    }
    
    event.ports[0].postMessage(stats)
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Background sync for performance metrics
self.addEventListener('sync', (event) => {
  if (event.tag === 'performance-metrics') {
    event.waitUntil(sendPerformanceMetrics())
  }
})

async function sendPerformanceMetrics() {
  if (performanceMetrics.networkRequests === 0) return
  
  const metrics = {
    cacheHitRate: Math.round((performanceMetrics.cacheHits / performanceMetrics.networkRequests) * 100),
    avgResponseTime: Math.round(performanceMetrics.totalResponseTime / performanceMetrics.networkRequests),
    totalRequests: performanceMetrics.networkRequests,
    timestamp: Date.now()
  }
  
  try {
    // Send to analytics if available
    if (self.gtag) {
      self.gtag('event', 'sw_performance', {
        event_category: 'service_worker',
        event_label: 'cache_performance',
        value: metrics.cacheHitRate,
        custom_parameter_1: metrics.avgResponseTime
      })
    }
    
    // Reset metrics after sending
    performanceMetrics = {
      cacheHits: 0,
      cacheMisses: 0,
      networkRequests: 0,
      totalResponseTime: 0,
      startTime: Date.now()
    }
  } catch (error) {
    console.warn('[SW] Failed to send performance metrics:', error)
  }
}

// Periodic cache cleanup (every 24 hours)
setInterval(async () => {
  try {
    const now = Date.now()
    
    for (const cacheName of Object.values(CACHE_NAMES)) {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()
      
      for (const request of requests) {
        const response = await cache.match(request)
        if (response) {
          const timestamp = response.headers.get('sw-cache-timestamp')
          if (timestamp) {
            const age = now - parseInt(timestamp)
            // Remove entries older than their max age + 24 hours buffer
            if (age > CACHE_STRATEGIES.STATIC_ASSETS + (24 * 60 * 60 * 1000)) {
              await cache.delete(request)
            }
          }
        }
      }
    }
    
    console.log('[SW] Cache cleanup completed')
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error)
  }
}, 24 * 60 * 60 * 1000) // 24 hours

console.log('[SW] Hiperliga Service Worker loaded - Version:', CACHE_VERSION)