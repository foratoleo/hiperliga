'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor'
import { useServiceWorker } from '@/hooks/use-service-worker'
import { performanceBudgetMonitor, getPageTypeBudget } from '@/lib/performance-budgets'
import { monitorImagePerformance, preloadCriticalImages } from '@/lib/image-optimization'
import { optimizeWebFonts } from '@/lib/font-optimization'

interface PerformanceContextValue {
  isMonitoringEnabled: boolean
  budgetViolations: number
  performanceScore: number
  isServiceWorkerActive: boolean
}

const PerformanceContext = createContext<PerformanceContextValue>({
  isMonitoringEnabled: false,
  budgetViolations: 0,
  performanceScore: 0,
  isServiceWorkerActive: false,
})

export const usePerformanceContext = () => useContext(PerformanceContext)

interface PerformanceProviderProps {
  children: ReactNode
  enableMonitoring?: boolean
  enableBudgetReporting?: boolean
  reportingEndpoint?: string
}

export function PerformanceProvider({ 
  children, 
  enableMonitoring = process.env.NODE_ENV === 'production',
  enableBudgetReporting = false,
  reportingEndpoint = '/api/performance'
}: PerformanceProviderProps) {
  const pathname = usePathname()
  
  // Initialize performance monitoring
  const performanceMonitor = usePerformanceMonitor({
    enableLogging: process.env.NODE_ENV === 'development',
    enableReporting: enableBudgetReporting,
    reportEndpoint: reportingEndpoint,
  })

  // Initialize service worker
  const serviceWorker = useServiceWorker({
    onSuccess: (registration) => {
      console.log('Service Worker ready for performance caching')
    },
    onError: (error) => {
      console.warn('Service Worker failed, performance may be affected:', error)
    },
    onUpdate: (registration) => {
      console.log('Service Worker updated - new performance optimizations available')
    }
  })

  useEffect(() => {
    if (!enableMonitoring) return

    // Initialize performance optimizations
    optimizeWebFonts()
    monitorImagePerformance()

    // Preload critical images based on page type
    const criticalImages = getCriticalImagesForPage(pathname)
    if (criticalImages.length > 0) {
      preloadCriticalImages(criticalImages)
    }

    // Monitor performance budgets
    const checkPerformanceBudgets = () => {
      const pageType = getPageTypeFromPath(pathname)
      const budget = getPageTypeBudget(pathname)
      
      // Collect current metrics
      const metrics = collectCurrentMetrics()
      
      // Check against budget
      const isWithinBudget = performanceBudgetMonitor.checkBudget(pageType, metrics)
      
      if (!isWithinBudget) {
        const report = performanceBudgetMonitor.generateReport(pageType, metrics)
        console.warn('Performance budget violations detected:', report)
        
        // Send to analytics if enabled
        if (enableBudgetReporting && reportingEndpoint) {
          fetch(reportingEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'budget-violation',
              pathname,
              report,
            }),
          }).catch(error => console.warn('Failed to report budget violation:', error))
        }
      }
    }

    // Check budgets after page load
    const checkTimeout = setTimeout(checkPerformanceBudgets, 3000)

    // Set up performance event listeners
    const handlePerformanceViolation = (event: CustomEvent) => {
      console.warn('Performance violation:', event.detail)
    }

    window.addEventListener('performance-budget-violation', handlePerformanceViolation as EventListener)

    // Resource loading monitoring
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[]
      
      entries.forEach(entry => {
        // Check for slow loading resources
        const loadTime = entry.responseEnd - entry.startTime
        
        if (loadTime > 2000) { // Resources taking longer than 2s
          console.warn('Slow resource loading:', {
            name: entry.name,
            loadTime: Math.round(loadTime),
            type: entry.initiatorType,
            size: entry.transferSize,
          })
        }
        
        // Check for large resources
        if (entry.transferSize > 500 * 1024) { // Resources larger than 500KB
          console.warn('Large resource detected:', {
            name: entry.name,
            size: Math.round(entry.transferSize / 1024) + ' KB',
            type: entry.initiatorType,
          })
        }
      })
    })

    try {
      resourceObserver.observe({ entryTypes: ['resource'] })
    } catch (error) {
      console.warn('Resource monitoring not supported:', error)
    }

    // Cleanup
    return () => {
      clearTimeout(checkTimeout)
      window.removeEventListener('performance-budget-violation', handlePerformanceViolation as EventListener)
      resourceObserver.disconnect()
    }
  }, [pathname, enableMonitoring, enableBudgetReporting, reportingEndpoint])

  const contextValue: PerformanceContextValue = {
    isMonitoringEnabled: enableMonitoring,
    budgetViolations: performanceBudgetMonitor.getViolations('error').length,
    performanceScore: calculateCurrentPerformanceScore(pathname),
    isServiceWorkerActive: serviceWorker.isRegistered,
  }

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  )
}

// Helper functions
function getPageTypeFromPath(pathname: string): string {
  if (pathname === '/') return 'homepage'
  if (pathname.startsWith('/produtos/')) return 'product'
  if (pathname === '/contato') return 'form'
  return 'content'
}

function getCriticalImagesForPage(pathname: string): string[] {
  const commonImages = ['/images/01_brand/logo_hiperliga-optimized.webp']
  
  switch (getPageTypeFromPath(pathname)) {
    case 'homepage':
      return [
        ...commonImages,
        '/images/03_products/image_11-optimized.webp',
        '/images/03_products/hiperliga/hiperliga-1-optimized.webp',
        '/images/03_products/image_11-optimized.webp',
      ]
    case 'product':
      if (pathname.includes('hiperliga')) {
        return [
          ...commonImages,
          '/images/03_products/image_11-optimized.webp',
        ]
      }
      return commonImages
    default:
      return commonImages
  }
}

function collectCurrentMetrics() {
  // Collect current page metrics
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  // Calculate asset sizes
  const jsSize = resources
    .filter(r => r.name.includes('.js'))
    .reduce((total, r) => total + (r.transferSize || 0), 0) / 1024 // Convert to KB
    
  const cssSize = resources
    .filter(r => r.name.includes('.css'))
    .reduce((total, r) => total + (r.transferSize || 0), 0) / 1024
    
  const imageSize = resources
    .filter(r => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(r.name))
    .reduce((total, r) => Math.max(total, (r.transferSize || 0) / 1024), 0) // Largest image
    
  const totalSize = resources.reduce((total, r) => total + (r.transferSize || 0), 0) / 1024

  // Count requests
  const requestCounts = {
    total: resources.length,
    fonts: resources.filter(r => /\.(woff2?|eot|ttf|otf)$/i.test(r.name)).length,
    images: resources.filter(r => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(r.name)).length,
    scripts: resources.filter(r => r.name.includes('.js')).length,
    stylesheets: resources.filter(r => r.name.includes('.css')).length,
  }

  return {
    assets: {
      javascript: jsSize,
      css: cssSize,
      images: imageSize,
      fonts: 0, // Would need additional tracking
      total: totalSize,
    },
    timing: {
      lcp: 0, // Would be populated by LCP observer
      fcp: 0, // Would be populated by FCP observer
      cls: 0, // Would be populated by CLS observer
      fid: 0, // Would be populated by FID observer
      ttfb: navigation ? navigation.responseStart - navigation.requestStart : 0,
      tti: 0, // Would need additional calculation
    },
    requests: requestCounts,
  }
}

function calculateCurrentPerformanceScore(pathname: string): number {
  const metrics = collectCurrentMetrics()
  return performanceBudgetMonitor.calculateScore(getPageTypeFromPath(pathname), metrics)
}

// Development-only performance debugging component
export function PerformanceDebugger() {
  const context = usePerformanceContext()
  
  if (process.env.NODE_ENV !== 'development' || !context.isMonitoringEnabled) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm font-mono z-50">
      <div>Performance Score: {context.performanceScore}/100</div>
      <div>Budget Violations: {context.budgetViolations}</div>
      <div>Service Worker: {context.isServiceWorkerActive ? '✅' : '❌'}</div>
    </div>
  )
}