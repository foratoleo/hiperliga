// src/lib/analytics.ts
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

// Google Analytics configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ''

// Performance thresholds based on Google's recommendations
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needs_improvement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needs_improvement: 300 },   // First Input Delay
  CLS: { good: 0.1, needs_improvement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needs_improvement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needs_improvement: 1800 }  // Time to First Byte
}

// Performance metrics storage
interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
  timestamp: number
  page: string
  userAgent: string
  connection?: string
}

let performanceData: PerformanceMetrics = {
  timestamp: Date.now(),
  page: typeof window !== 'undefined' ? window.location.pathname : '',
  userAgent: typeof window !== 'undefined' ? navigator.userAgent : ''
}

// Initialize Google Analytics
export function initializeGA() {
  if (typeof window === 'undefined' || !GA_TRACKING_ID) return

  // Load GA script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
      custom_parameter_1: 'performance_metric',
      custom_parameter_2: 'cache_status',
      custom_parameter_3: 'optimization_level'
    }
  })

  console.log('[Analytics] Google Analytics initialized')
}

// Initialize Google Tag Manager
export function initializeGTM() {
  if (typeof window === 'undefined' || !GTM_ID) return

  // GTM script
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)

  console.log('[Analytics] Google Tag Manager initialized')
}

// Track Core Web Vitals
export function trackWebVitals() {
  if (typeof window === 'undefined') return

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  performanceData.connection = connection ? connection.effectiveType : 'unknown'

  // Track Largest Contentful Paint (LCP)
  onLCP((metric) => {
    performanceData.lcp = metric.value
    trackPerformanceMetric('LCP', metric.value, PERFORMANCE_THRESHOLDS.LCP)
    sendPerformanceData('lcp', metric.value)
  })

  // Track Interaction to Next Paint (INP) - replaces FID
  onINP((metric) => {
    performanceData.fid = metric.value
    trackPerformanceMetric('INP', metric.value, PERFORMANCE_THRESHOLDS.FID)
    sendPerformanceData('inp', metric.value)
  })

  // Track Cumulative Layout Shift (CLS)
  onCLS((metric) => {
    performanceData.cls = metric.value
    trackPerformanceMetric('CLS', metric.value, PERFORMANCE_THRESHOLDS.CLS)
    sendPerformanceData('cls', metric.value)
  })

  // Track First Contentful Paint (FCP)
  onFCP((metric) => {
    performanceData.fcp = metric.value
    trackPerformanceMetric('FCP', metric.value, PERFORMANCE_THRESHOLDS.FCP)
    sendPerformanceData('fcp', metric.value)
  })

  // Track Time to First Byte (TTFB)
  onTTFB((metric) => {
    performanceData.ttfb = metric.value
    trackPerformanceMetric('TTFB', metric.value, PERFORMANCE_THRESHOLDS.TTFB)
    sendPerformanceData('ttfb', metric.value)
  })

  console.log('[Analytics] Core Web Vitals tracking initialized')
}

// Track performance metric with threshold analysis
function trackPerformanceMetric(name: string, value: number, threshold: { good: number, needs_improvement: number }) {
  let rating = 'poor'
  if (value <= threshold.good) {
    rating = 'good'
  } else if (value <= threshold.needs_improvement) {
    rating = 'needs-improvement'
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'web_vitals', {
      event_category: 'performance',
      event_label: name.toLowerCase(),
      value: Math.round(value),
      custom_parameter_1: rating,
      custom_parameter_2: performanceData.connection,
      custom_parameter_3: performanceData.page
    })
  }

  // Store in session for performance budgets
  storePerformanceMetric(name, value, rating)
}

// Send performance data to analytics
function sendPerformanceData(metric: string, value: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_metric', {
      event_category: 'core_web_vitals',
      event_label: metric,
      value: Math.round(value),
      custom_parameter_1: performanceData.page,
      custom_parameter_2: performanceData.connection
    })
  }
}

// Store performance metrics in sessionStorage
function storePerformanceMetric(name: string, value: number, rating: string) {
  if (typeof window === 'undefined') return

  try {
    const stored = sessionStorage.getItem('hiperliga_performance') || '{}'
    const data = JSON.parse(stored)
    
    data[name.toLowerCase()] = {
      value,
      rating,
      timestamp: Date.now(),
      page: performanceData.page
    }

    sessionStorage.setItem('hiperliga_performance', JSON.stringify(data))
  } catch (error) {
    console.warn('[Analytics] Failed to store performance metric:', error)
  }
}

// Get stored performance metrics
export function getStoredPerformanceMetrics() {
  if (typeof window === 'undefined') return null

  try {
    const stored = sessionStorage.getItem('hiperliga_performance')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.warn('[Analytics] Failed to retrieve performance metrics:', error)
    return null
  }
}

// Track page views
export function trackPageView(url: string, title?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: title || document.title
    })

    window.gtag('event', 'page_view', {
      page_title: title || document.title,
      page_location: window.location.href,
      page_path: url,
      event_category: 'engagement'
    })
  }
}

// Track events
export function trackEvent(eventName: string, parameters: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: parameters.category || 'interaction',
      event_label: parameters.label,
      value: parameters.value,
      ...parameters
    })
  }
}

// Track user interactions
export function trackUserInteraction(action: string, element: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_interaction', {
      event_category: 'engagement',
      event_label: `${action}_${element}`,
      value: value || 1,
      custom_parameter_1: action,
      custom_parameter_2: element,
      custom_parameter_3: performanceData.page
    })
  }
}

// Track conversion events
export function trackConversion(type: string, value?: number, currency: string = 'BRL') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      event_category: 'business',
      event_label: type,
      value: value || 1,
      currency: currency,
      custom_parameter_1: type,
      custom_parameter_2: performanceData.page
    })
  }
}

// Track errors
export function trackError(error: Error, context?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      event_category: 'error',
      event_label: context || 'javascript_error',
      custom_parameter_1: error.name,
      custom_parameter_2: error.stack?.substring(0, 150) || 'no_stack',
      custom_parameter_3: performanceData.page
    })
  }

  console.error('[Analytics] Tracked error:', error, 'Context:', context)
}

// Performance budget monitoring
export class PerformanceBudget {
  private budgets: Record<string, number> = {
    lcp: 2500,    // 2.5s
    fid: 100,     // 100ms
    cls: 0.1,     // 0.1
    fcp: 1800,    // 1.8s
    ttfb: 800     // 800ms
  }

  private violations: Array<{ metric: string, value: number, budget: number, timestamp: number }> = []

  setBudget(metric: string, value: number) {
    this.budgets[metric.toLowerCase()] = value
  }

  checkBudget(metric: string, value: number): boolean {
    const budget = this.budgets[metric.toLowerCase()]
    if (!budget) return true

    const withinBudget = value <= budget

    if (!withinBudget) {
      this.violations.push({
        metric,
        value,
        budget,
        timestamp: Date.now()
      })

      // Track budget violation
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'performance_budget_violation', {
          event_category: 'performance',
          event_label: metric,
          value: Math.round(value),
          custom_parameter_1: budget.toString(),
          custom_parameter_2: ((value / budget) * 100).toFixed(0) + '%',
          custom_parameter_3: performanceData.page
        })
      }

      console.warn(`[Performance Budget] Violation: ${metric} ${value}ms exceeds budget of ${budget}ms`)
    }

    return withinBudget
  }

  getViolations() {
    return this.violations
  }

  getBudgetReport(): Record<string, { budget: number, current?: number, status: 'good' | 'warning' | 'violation' }> {
    const report: Record<string, any> = {}
    const stored = getStoredPerformanceMetrics()

    for (const [metric, budget] of Object.entries(this.budgets)) {
      const current = stored?.[metric]?.value
      let status: 'good' | 'warning' | 'violation' = 'good'

      if (current !== undefined) {
        if (current > budget) {
          status = 'violation'
        } else if (current > budget * 0.8) {
          status = 'warning'
        }
      }

      report[metric] = { budget, current, status }
    }

    return report
  }
}

// Service Worker performance tracking
export function trackServiceWorkerPerformance() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  navigator.serviceWorker.ready.then((registration) => {
    const messageChannel = new MessageChannel()
    
    messageChannel.port1.onmessage = (event) => {
      const stats = event.data
      
      if (window.gtag) {
        window.gtag('event', 'service_worker_stats', {
          event_category: 'performance',
          event_label: 'cache_performance',
          value: stats.cacheHitRate,
          custom_parameter_1: stats.avgResponseTime,
          custom_parameter_2: stats.totalRequests,
          custom_parameter_3: performanceData.page
        })
      }
    }

    registration.active?.postMessage(
      { type: 'GET_CACHE_STATS' },
      [messageChannel.port2]
    )
  })
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return

  console.log('[Analytics] Initializing performance monitoring...')

  // Initialize analytics services
  initializeGA()
  initializeGTM()

  // Start Core Web Vitals tracking
  trackWebVitals()

  // Track Service Worker performance
  trackServiceWorkerPerformance()

  // Track navigation timing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
        
        if (window.gtag) {
          window.gtag('event', 'page_load_timing', {
            event_category: 'performance',
            event_label: 'load_complete',
            value: Math.round(loadTime),
            custom_parameter_1: Math.round(domContentLoaded),
            custom_parameter_2: performanceData.page
          })
        }
      }
    }, 0)
  })

  // Track errors
  window.addEventListener('error', (event) => {
    trackError(event.error, 'global_error_handler')
  })

  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), 'unhandled_promise_rejection')
  })

  console.log('[Analytics] Performance monitoring initialized')
}

// Export performance budget instance
export const performanceBudget = new PerformanceBudget()

// Export performance data for external use
export { performanceData }

// Type definitions for window extensions
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}