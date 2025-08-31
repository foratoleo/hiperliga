'use client'

import { useEffect, useState } from 'react'

interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  isLoading: boolean
  registration: ServiceWorkerRegistration | null
  error: Error | null
}

interface ServiceWorkerOptions {
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onError?: (error: Error) => void
  onUpdate?: (registration: ServiceWorkerRegistration) => void
  enableNotifications?: boolean
  enableBackgroundSync?: boolean
}

export function useServiceWorker(options: ServiceWorkerOptions = {}) {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isLoading: false,
    registration: null,
    error: null,
  })

  const {
    onSuccess,
    onError,
    onUpdate,
    enableNotifications = false,
    enableBackgroundSync = false,
  } = options

  useEffect(() => {
    // Check if service worker is supported
    const isSupported = 'serviceWorker' in navigator

    if (!isSupported) {
      setState(prev => ({ ...prev, isSupported: false }))
      return
    }

    setState(prev => ({ ...prev, isSupported: true, isLoading: true }))

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none', // Always check for updates
        })

        console.log('Service Worker registered:', registration)

        setState(prev => ({
          ...prev,
          isRegistered: true,
          isLoading: false,
          registration,
          error: null,
        }))

        onSuccess?.(registration)

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker version available')
                onUpdate?.(registration)
              }
            })
          }
        })

        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('Message from service worker:', event.data)
          
          switch (event.data.type) {
            case 'CACHE_UPDATED':
              console.log('Cache updated for:', event.data.url)
              break
            case 'OFFLINE_FALLBACK':
              console.log('Using offline fallback')
              break
            default:
              break
          }
        })

        // Request notification permission if enabled
        if (enableNotifications && 'Notification' in window) {
          const permission = await Notification.requestPermission()
          console.log('Notification permission:', permission)
        }

        // Set up background sync if enabled
        if (enableBackgroundSync && 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
          // Background sync is available
          console.log('Background sync is available')
        }

      } catch (error) {
        const err = error as Error
        console.error('Service Worker registration failed:', err)
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err,
        }))
        
        onError?.(err)
      }
    }

    registerSW()

    // Check for existing service worker controller
    if (navigator.serviceWorker.controller) {
      setState(prev => ({ ...prev, isRegistered: true }))
    }

    // Listen for service worker controlling the page
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker controller changed')
      setState(prev => ({ ...prev, isRegistered: true }))
    })

  }, [onSuccess, onError, onUpdate, enableNotifications, enableBackgroundSync])

  // Update service worker
  const updateServiceWorker = async () => {
    if (state.registration) {
      try {
        await state.registration.update()
        console.log('Service worker update check triggered')
      } catch (error) {
        console.error('Service worker update failed:', error)
      }
    }
  }

  // Unregister service worker
  const unregisterServiceWorker = async () => {
    if (state.registration) {
      try {
        const success = await state.registration.unregister()
        if (success) {
          setState(prev => ({
            ...prev,
            isRegistered: false,
            registration: null,
          }))
          console.log('Service worker unregistered')
        }
      } catch (error) {
        console.error('Service worker unregistration failed:', error)
      }
    }
  }

  // Send message to service worker
  const sendMessage = (message: any) => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message)
    }
  }

  // Schedule background sync
  const scheduleBackgroundSync = async (tag: string) => {
    if (state.registration && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        // @ts-ignore - TypeScript doesn't have types for Background Sync yet
        await state.registration.sync.register(tag)
        console.log('Background sync scheduled:', tag)
      } catch (error) {
        console.error('Background sync registration failed:', error)
      }
    }
  }

  // Show notification
  const showNotification = async (title: string, options?: NotificationOptions) => {
    if (state.registration && 'showNotification' in state.registration) {
      try {
        await state.registration.showNotification(title, {
          icon: '/images/icon-192x192.png',
          badge: '/images/badge-72x72.png',
          ...options,
        })
      } catch (error) {
        console.error('Notification failed:', error)
      }
    }
  }

  // Cache management
  const clearCache = async (cacheName?: string) => {
    if ('caches' in window) {
      try {
        if (cacheName) {
          await caches.delete(cacheName)
          console.log(`Cache cleared: ${cacheName}`)
        } else {
          const cacheNames = await caches.keys()
          await Promise.all(cacheNames.map(name => caches.delete(name)))
          console.log('All caches cleared')
        }
      } catch (error) {
        console.error('Cache clearing failed:', error)
      }
    }
  }

  const getCacheInfo = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        const cacheInfo = await Promise.all(
          cacheNames.map(async name => {
            const cache = await caches.open(name)
            const keys = await cache.keys()
            return { name, size: keys.length }
          })
        )
        return cacheInfo
      } catch (error) {
        console.error('Cache info retrieval failed:', error)
        return []
      }
    }
    return []
  }

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker,
    sendMessage,
    scheduleBackgroundSync,
    showNotification,
    clearCache,
    getCacheInfo,
  }
}