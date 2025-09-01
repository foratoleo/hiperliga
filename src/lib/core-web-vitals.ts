// Core Web Vitals optimization utilities

// Largest Contentful Paint (LCP) optimization
export class LCPOptimizer {
  private preloadedImages = new Set<string>()
  private observer?: PerformanceObserver

  constructor() {
    this.initializeLCPMonitoring()
  }

  // Monitor LCP elements and optimize them
  private initializeLCPMonitoring() {
    if (typeof window === 'undefined') return

    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[]
        const lcpEntry = entries[entries.length - 1]

        if (lcpEntry?.element) {
          this.optimizeLCPElement(lcpEntry.element)
        }
      })

      this.observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('LCP monitoring not supported:', error)
    }
  }

  // Optimize the LCP element
  private optimizeLCPElement(element: HTMLElement) {
    if (element.tagName === 'IMG') {
      const img = element as HTMLImageElement
      
      // Ensure the image is preloaded for next time
      if (!this.preloadedImages.has(img.src)) {
        this.preloadImage(img.src)
      }

      // Add high priority loading
      img.setAttribute('loading', 'eager')
      img.setAttribute('fetchpriority', 'high')
      
      console.info('LCP image optimized:', img.src)
    }
  }

  // Preload critical images
  preloadImage(src: string) {
    if (this.preloadedImages.has(src)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.setAttribute('fetchpriority', 'high')
    
    document.head.appendChild(link)
    this.preloadedImages.add(src)
    
    console.info('Image preloaded for LCP:', src)
  }

  // Preload hero images that are likely to be LCP
  preloadHeroImages(images: string[]) {
    images.forEach(src => this.preloadImage(src))
  }

  // Cleanup
  disconnect() {
    this.observer?.disconnect()
  }
}

// First Input Delay (FID) optimization  
export class FIDOptimizer {
  private scheduledTasks = new Set<() => void>()
  private isIdle = false

  constructor() {
    this.initializeIdleDetection()
    this.optimizeMainThread()
  }

  // Detect when main thread is idle
  private initializeIdleDetection() {
    if (typeof window === 'undefined') return

    // Use requestIdleCallback if available
    if ('requestIdleCallback' in window) {
      const checkIdle = () => {
        requestIdleCallback((deadline) => {
          this.isIdle = deadline.timeRemaining() > 0
          
          // Process scheduled tasks when idle
          if (this.isIdle && this.scheduledTasks.size > 0) {
            this.processScheduledTasks(deadline)
          }
          
          checkIdle() // Continue checking
        })
      }
      checkIdle()
    } else {
      // Fallback with setTimeout
      setInterval(() => {
        this.isIdle = true
        setTimeout(() => { this.isIdle = false }, 1)
      }, 50)
    }
  }

  // Optimize main thread performance
  private optimizeMainThread() {
    // Break up long tasks into smaller chunks
    this.chunkLongTasks()
    
    // Defer non-critical JavaScript
    this.deferNonCriticalScripts()
    
    // Optimize event listeners
    this.optimizeEventListeners()
  }

  // Schedule tasks to run when main thread is idle
  scheduleTask(task: () => void, priority: 'high' | 'low' = 'low') {
    if (priority === 'high' || this.isIdle) {
      task()
    } else {
      this.scheduledTasks.add(task)
    }
  }

  // Process scheduled tasks during idle time
  private processScheduledTasks(deadline: IdleDeadline) {
    for (const task of this.scheduledTasks) {
      if (deadline.timeRemaining() <= 0) break
      
      try {
        task()
        this.scheduledTasks.delete(task)
      } catch (error) {
        console.error('Scheduled task failed:', error)
        this.scheduledTasks.delete(task)
      }
    }
  }

  // Break up long-running tasks
  private chunkLongTasks() {
    // Override setTimeout for better task scheduling
    const originalSetTimeout = window.setTimeout
    
    window.setTimeout = (callback: TimerHandler, delay: number = 0, ...args: any[]) => {
      if (delay === 0) {
        // Use scheduler.postTask if available, otherwise fall back
        if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
          return (window as any).scheduler.postTask(() => {
            if (typeof callback === 'function') {
              return callback(...args)
            } else if (typeof callback === 'string') {
              return eval(callback)
            }
          }, { priority: 'user-blocking' })
        }
      }
      
      return originalSetTimeout(callback, delay, ...args)
    }
  }

  // Defer non-critical JavaScript
  private deferNonCriticalScripts() {
    const scripts = document.querySelectorAll('script[data-defer="true"]')
    
    scripts.forEach(script => {
      const newScript = document.createElement('script')
      newScript.src = (script as HTMLScriptElement).src
      newScript.async = true
      
      // Load after main thread is free
      this.scheduleTask(() => {
        document.head.appendChild(newScript)
      }, 'low')
    })
  }

  // Optimize event listeners to be passive where possible
  private optimizeEventListeners() {
    const passiveEvents = ['touchstart', 'touchmove', 'scroll', 'mousewheel']
    
    // Override addEventListener to add passive option by default
    const originalAddEventListener = EventTarget.prototype.addEventListener
    
    EventTarget.prototype.addEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      if (passiveEvents.includes(type) && typeof options === 'undefined') {
        options = { passive: true }
      }
      
      return originalAddEventListener.call(this, type, listener, options)
    }
  }

  // Measure input delay
  measureInputDelay(callback?: (delay: number) => void) {
    if (typeof window === 'undefined') return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[]
        
        entries.forEach(entry => {
          const delay = entry.processingStart - entry.startTime
          console.info('Input delay measured:', `${delay.toFixed(2)}ms`)
          callback?.(delay)
        })
      })

      observer.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('FID monitoring not supported:', error)
    }
  }
}

// Cumulative Layout Shift (CLS) optimization
export class CLSOptimizer {
  private observer?: PerformanceObserver
  private clsScore = 0
  private shiftingElements = new Set<Element>()

  constructor() {
    this.initializeCLSMonitoring()
    this.implementPreventionStrategies()
  }

  // Monitor layout shifts
  private initializeCLSMonitoring() {
    if (typeof window === 'undefined') return

    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[]
        
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            this.clsScore += entry.value
            
            // Track elements causing shifts
            entry.sources?.forEach((source: any) => {
              if (source.node) {
                this.shiftingElements.add(source.node)
                this.optimizeShiftingElement(source.node)
              }
            })
            
            console.warn('Layout shift detected:', {
              score: entry.value,
              cumulativeScore: this.clsScore,
              sources: entry.sources?.map((s: any) => s.node?.tagName) || []
            })
          }
        })
      })

      this.observer.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.warn('CLS monitoring not supported:', error)
    }
  }

  // Implement CLS prevention strategies
  private implementPreventionStrategies() {
    // Reserve space for images
    this.reserveImageSpace()
    
    // Prevent font swap layout shifts
    this.preventFontLayoutShifts()
    
    // Handle dynamic content insertion
    this.handleDynamicContent()
    
    // Optimize CSS animations
    this.optimizeAnimations()
  }

  // Reserve space for images to prevent shifts
  private reserveImageSpace() {
    const images = document.querySelectorAll('img:not([width]):not([height]):not([style*="aspect-ratio"])')
    
    images.forEach(img => {
      const image = img as HTMLImageElement
      
      // Add aspect-ratio CSS property if dimensions are known
      if (image.naturalWidth && image.naturalHeight) {
        const aspectRatio = image.naturalWidth / image.naturalHeight
        image.style.aspectRatio = aspectRatio.toString()
      } else {
        // Use default aspect ratio
        image.style.aspectRatio = '16 / 9'
      }
    })
  }

  // Prevent font-related layout shifts
  private preventFontLayoutShifts() {
    // Add font fallbacks with similar metrics
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'Inter Fallback';
        font-style: normal;
        font-weight: 100 900;
        src: local('Arial');
        ascent-override: 87.55%;
        descent-override: 20.66%;
        line-gap-override: 0%;
        size-adjust: 100%;
      }
      
      @font-face {
        font-family: 'Roboto Fallback';
        font-style: normal;
        font-weight: 100 900;
        src: local('Arial');
        ascent-override: 92.78%;
        descent-override: 24.43%;
        line-gap-override: 0%;
        size-adjust: 100%;
      }
    `
    
    document.head.appendChild(style)
  }

  // Handle dynamic content insertion
  private handleDynamicContent() {
    // Use ResizeObserver to detect size changes
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entry => {
          if (this.shiftingElements.has(entry.target)) {
            console.info('Shifting element resized:', entry.target.tagName)
          }
        })
      })

      // Observe dynamic content containers
      const containers = document.querySelectorAll('[data-dynamic-content]')
      containers.forEach(container => {
        resizeObserver.observe(container)
      })
    }
  }

  // Optimize animations to prevent layout shifts
  private optimizeAnimations() {
    // Find elements with animations that might cause layout shifts
    const animatedElements = document.querySelectorAll('[data-animate], .animate-*')
    
    animatedElements.forEach(element => {
      const htmlElement = element as HTMLElement
      
      // Ensure animations use transform/opacity instead of layout properties
      const computedStyle = getComputedStyle(htmlElement)
      const willChange = computedStyle.willChange
      
      if (!willChange || willChange === 'auto') {
        htmlElement.style.willChange = 'transform, opacity'
      }
    })
  }

  // Optimize specific shifting element
  private optimizeShiftingElement(element: Element) {
    const htmlElement = element as HTMLElement
    
    console.warn('Optimizing shifting element:', element.tagName, element.className)
    
    // Add CSS containment
    htmlElement.style.contain = 'layout style'
    
    // Reserve space if possible
    if (!htmlElement.style.minHeight) {
      const rect = htmlElement.getBoundingClientRect()
      if (rect.height > 0) {
        htmlElement.style.minHeight = `${rect.height}px`
      }
    }
  }

  // Get current CLS score
  getCLSScore() {
    return this.clsScore
  }

  // Reset CLS score
  resetCLSScore() {
    this.clsScore = 0
  }

  // Cleanup
  disconnect() {
    this.observer?.disconnect()
  }
}

// Main Core Web Vitals optimizer
export class CoreWebVitalsOptimizer {
  private lcpOptimizer: LCPOptimizer
  private fidOptimizer: FIDOptimizer
  private clsOptimizer: CLSOptimizer

  constructor() {
    this.lcpOptimizer = new LCPOptimizer()
    this.fidOptimizer = new FIDOptimizer()
    this.clsOptimizer = new CLSOptimizer()
    
    console.info('Core Web Vitals optimization initialized')
  }

  // Preload critical resources for better LCP
  preloadCriticalResources(images: string[], fonts: string[] = []) {
    this.lcpOptimizer.preloadHeroImages(images)
    
    fonts.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.href = font
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  // Schedule non-critical tasks for better FID
  scheduleNonCriticalTask(task: () => void) {
    this.fidOptimizer.scheduleTask(task, 'low')
  }

  // Get current Web Vitals scores
  getScores() {
    return {
      cls: this.clsOptimizer.getCLSScore(),
      // LCP and FID would be populated by their respective observers
    }
  }

  // Cleanup all optimizers
  disconnect() {
    this.lcpOptimizer.disconnect()
    this.clsOptimizer.disconnect()
  }
}

// Singleton instance
export const coreWebVitalsOptimizer = new CoreWebVitalsOptimizer()

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      coreWebVitalsOptimizer
    })
  } else {
    // DOM is already loaded
    coreWebVitalsOptimizer
  }
}