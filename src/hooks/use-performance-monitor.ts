'use client'

import { useEffect, useCallback } from 'react'

interface PerformanceMetrics {
  lcp?: number      // Largest Contentful Paint
  fcp?: number      // First Contentful Paint  
  cls?: number      // Cumulative Layout Shift
  fid?: number      // First Input Delay
  ttfb?: number     // Time to First Byte
  inp?: number      // Interaction to Next Paint
}

interface PerformanceConfig {
  enableLogging?: boolean
  enableReporting?: boolean
  reportEndpoint?: string
  thresholds?: {
    lcp?: number
    fcp?: number
    cls?: number
    fid?: number
    ttfb?: number
    inp?: number
  }
}

const DEFAULT_THRESHOLDS = {
  lcp: 2500,    // Good: <2.5s
  fcp: 1800,    // Good: <1.8s  
  cls: 0.1,     // Good: <0.1
  fid: 100,     // Good: <100ms
  ttfb: 800,    // Good: <800ms
  inp: 200,     // Good: <200ms
}

export function usePerformanceMonitor(config: PerformanceConfig = {}) {
  const {
    enableLogging = process.env.NODE_ENV === 'development',
    enableReporting = false,
    reportEndpoint = '/api/performance',
    thresholds = DEFAULT_THRESHOLDS
  } = config

  const reportMetric = useCallback(async (metric: { name: string; value: number; rating: string }) => {
    if (enableLogging) {
      console.info(`Performance metric: ${metric.name}`, {
        value: metric.value,
        rating: metric.rating,
        threshold: thresholds[metric.name as keyof typeof thresholds]
      })
    }

    if (enableReporting && reportEndpoint) {
      try {
        await fetch(reportEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...metric,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          })
        })
      } catch (error) {
        console.warn('Failed to report performance metric:', error)
      }
    }
  }, [enableLogging, enableReporting, reportEndpoint, thresholds])

  const getRating = useCallback((value: number, threshold: number, reversed = false): string => {
    if (reversed) {
      return value <= threshold ? 'good' : value <= threshold * 2 ? 'needs-improvement' : 'poor'
    }
    return value >= threshold ? 'good' : value >= threshold * 0.75 ? 'needs-improvement' : 'poor'
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const metrics: PerformanceMetrics = {}

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lcpEntry = entries[entries.length - 1] as any
        
        if (lcpEntry) {
          const value = lcpEntry.renderTime || lcpEntry.loadTime
          metrics.lcp = value
          
          reportMetric({
            name: 'lcp',
            value,
            rating: getRating(value, thresholds.lcp!)
          })
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('LCP monitoring not supported')
    }

    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            const value = entry.startTime
            metrics.fcp = value
            
            reportMetric({
              name: 'fcp',
              value,
              rating: getRating(value, thresholds.fcp!)
            })
          }
        })
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
    } catch (error) {
      console.warn('FCP monitoring not supported')
    }

    // Cumulative Layout Shift (CLS) 
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // Report CLS on page unload
      const reportCLS = () => {
        metrics.cls = clsValue
        reportMetric({
          name: 'cls',
          value: clsValue,
          rating: getRating(clsValue, thresholds.cls!, true)
        })
      }

      window.addEventListener('beforeunload', reportCLS)
      
      // Also report after 5 seconds for SPA navigation
      setTimeout(reportCLS, 5000)
    } catch (error) {
      console.warn('CLS monitoring not supported')
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          const value = entry.processingStart - entry.startTime
          metrics.fid = value
          
          reportMetric({
            name: 'fid',
            value,
            rating: getRating(value, thresholds.fid!, true)
          })
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('FID monitoring not supported')
    }

    // Interaction to Next Paint (INP) - newer metric
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          const value = entry.duration
          metrics.inp = value
          
          reportMetric({
            name: 'inp', 
            value,
            rating: getRating(value, thresholds.inp!, true)
          })
        })
      })
      inpObserver.observe({ entryTypes: ['event'] })
    } catch (error) {
      console.warn('INP monitoring not supported')
    }

    // Time to First Byte (TTFB)
    try {
      const navigationEntries = performance.getEntriesByType('navigation')
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0] as PerformanceNavigationTiming
        const value = navEntry.responseStart - navEntry.requestStart
        metrics.ttfb = value
        
        reportMetric({
          name: 'ttfb',
          value,
          rating: getRating(value, thresholds.ttfb!, true)
        })
      }
    } catch (error) {
      console.warn('TTFB monitoring not supported')
    }

    // Resource loading performance
    const monitorResources = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      resources.forEach(resource => {
        if (resource.name.includes('.jpg') || resource.name.includes('.png') || resource.name.includes('.webp')) {
          const loadTime = resource.responseEnd - resource.startTime
          if (loadTime > 1000) { // Images taking longer than 1s
            console.warn('Slow image loading:', {
              url: resource.name,
              loadTime,
              size: resource.transferSize
            })
          }
        }
      })
    }

    // Monitor resources after page load
    window.addEventListener('load', () => {
      setTimeout(monitorResources, 1000)
    })

    // Cleanup function
    return () => {
      // Performance observers are automatically cleaned up
    }
  }, [reportMetric, getRating, thresholds])

  return {
    // Utility function to measure custom metrics
    measureCustomMetric: useCallback((name: string, fn: () => void) => {
      const start = performance.now()
      fn()
      const duration = performance.now() - start
      
      reportMetric({
        name: `custom-${name}`,
        value: duration,
        rating: duration < 16 ? 'good' : duration < 50 ? 'needs-improvement' : 'poor'
      })
    }, [reportMetric]),

    // Get current performance metrics
    getMetrics: useCallback(() => {
      return {
        navigation: performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming,
        paint: performance.getEntriesByType('paint'),
        resource: performance.getEntriesByType('resource'),
      }
    }, [])
  }
}