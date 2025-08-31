// Performance budgets configuration and monitoring

export interface PerformanceBudget {
  // File size budgets (in KB)
  assets: {
    javascript: number      // Total JS bundle size
    css: number            // Total CSS bundle size  
    images: number         // Per-image size limit
    fonts: number          // Total fonts size
    total: number          // Total page weight
  }
  
  // Runtime performance budgets (in milliseconds)
  timing: {
    lcp: number           // Largest Contentful Paint
    fcp: number           // First Contentful Paint
    cls: number           // Cumulative Layout Shift (score)
    fid: number           // First Input Delay
    ttfb: number          // Time to First Byte
    tti: number           // Time to Interactive
  }
  
  // Resource counts
  requests: {
    total: number         // Total HTTP requests
    fonts: number         // Font requests
    images: number        // Image requests
    scripts: number       // Script requests
    stylesheets: number   // CSS requests
  }
}

// Define performance budgets for different page types
export const PERFORMANCE_BUDGETS: Record<string, PerformanceBudget> = {
  // Homepage - most critical
  homepage: {
    assets: {
      javascript: 250,    // 250KB JS
      css: 50,           // 50KB CSS
      images: 200,       // 200KB per image
      fonts: 100,        // 100KB fonts
      total: 1000,       // 1MB total
    },
    timing: {
      lcp: 2500,         // 2.5s
      fcp: 1800,         // 1.8s
      cls: 0.1,          // 0.1 score
      fid: 100,          // 100ms
      ttfb: 600,         // 600ms
      tti: 3500,         // 3.5s
    },
    requests: {
      total: 20,         // 20 requests
      fonts: 2,          // 2 font files
      images: 8,         // 8 images
      scripts: 4,        // 4 script files
      stylesheets: 2,    // 2 CSS files
    }
  },
  
  // Product pages - balance of content and performance
  product: {
    assets: {
      javascript: 300,
      css: 60,
      images: 300,       // Larger images for product showcase
      fonts: 100,
      total: 1500,       // 1.5MB total
    },
    timing: {
      lcp: 3000,         // 3s (more images)
      fcp: 2000,         // 2s
      cls: 0.1,
      fid: 100,
      ttfb: 600,
      tti: 4000,         // 4s
    },
    requests: {
      total: 25,
      fonts: 2,
      images: 12,        // More product images
      scripts: 5,
      stylesheets: 2,
    }
  },
  
  // Content pages - focus on reading experience
  content: {
    assets: {
      javascript: 200,   // Less JS for content
      css: 40,
      images: 150,
      fonts: 100,
      total: 800,        // 800KB total
    },
    timing: {
      lcp: 2000,         // 2s (mostly text)
      fcp: 1500,         // 1.5s
      cls: 0.05,         // Stricter for reading
      fid: 80,           // 80ms
      ttfb: 500,         // 500ms
      tti: 3000,         // 3s
    },
    requests: {
      total: 15,
      fonts: 2,
      images: 5,         // Fewer images
      scripts: 3,
      stylesheets: 2,
    }
  },
  
  // Contact/forms - interactive focus
  form: {
    assets: {
      javascript: 280,   // More JS for form validation
      css: 45,
      images: 100,
      fonts: 100,
      total: 900,        // 900KB total
    },
    timing: {
      lcp: 2200,         // 2.2s
      fcp: 1600,         // 1.6s
      cls: 0.08,         // Low CLS for forms
      fid: 80,           // 80ms for interactions
      ttfb: 500,
      tti: 3200,         // 3.2s
    },
    requests: {
      total: 18,
      fonts: 2,
      images: 4,
      scripts: 4,        // Form validation scripts
      stylesheets: 2,
    }
  }
} as const

// Performance budget monitoring
export class PerformanceBudgetMonitor {
  private budgets: Record<string, PerformanceBudget>
  private violations: Array<{
    page: string
    category: string
    metric: string
    actual: number
    budget: number
    severity: 'warning' | 'error'
    timestamp: number
  }>

  constructor(budgets = PERFORMANCE_BUDGETS) {
    this.budgets = budgets
    this.violations = []
  }

  // Check if metrics violate budgets
  checkBudget(pageType: string, metrics: Partial<PerformanceBudget>): boolean {
    const budget = this.budgets[pageType]
    if (!budget) {
      console.warn(`No budget defined for page type: ${pageType}`)
      return true
    }

    let hasViolations = false

    // Check asset budgets
    if (metrics.assets) {
      for (const [metric, value] of Object.entries(metrics.assets)) {
        const budgetValue = budget.assets[metric as keyof typeof budget.assets]
        if (value > budgetValue) {
          this.addViolation(pageType, 'assets', metric, value, budgetValue, 
            value > budgetValue * 1.5 ? 'error' : 'warning')
          hasViolations = true
        }
      }
    }

    // Check timing budgets
    if (metrics.timing) {
      for (const [metric, value] of Object.entries(metrics.timing)) {
        const budgetValue = budget.timing[metric as keyof typeof budget.timing]
        if (value > budgetValue) {
          this.addViolation(pageType, 'timing', metric, value, budgetValue,
            value > budgetValue * 1.5 ? 'error' : 'warning')
          hasViolations = true
        }
      }
    }

    // Check request budgets
    if (metrics.requests) {
      for (const [metric, value] of Object.entries(metrics.requests)) {
        const budgetValue = budget.requests[metric as keyof typeof budget.requests]
        if (value > budgetValue) {
          this.addViolation(pageType, 'requests', metric, value, budgetValue,
            value > budgetValue * 1.2 ? 'error' : 'warning')
          hasViolations = true
        }
      }
    }

    return !hasViolations
  }

  private addViolation(
    page: string, 
    category: string, 
    metric: string, 
    actual: number, 
    budget: number, 
    severity: 'warning' | 'error'
  ) {
    const violation = {
      page,
      category,
      metric,
      actual,
      budget,
      severity,
      timestamp: Date.now(),
    }

    this.violations.push(violation)

    // Log violation
    const message = `Performance budget violation: ${page}.${category}.${metric} = ${actual} (budget: ${budget})`
    
    if (severity === 'error') {
      console.error(message, violation)
    } else {
      console.warn(message, violation)
    }

    // Trigger custom event for monitoring
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('performance-budget-violation', {
        detail: violation
      }))
    }
  }

  // Get all violations
  getViolations(severity?: 'warning' | 'error') {
    return severity 
      ? this.violations.filter(v => v.severity === severity)
      : this.violations
  }

  // Clear violations
  clearViolations() {
    this.violations = []
  }

  // Get budget for page type
  getBudget(pageType: string): PerformanceBudget | undefined {
    return this.budgets[pageType]
  }

  // Calculate budget score (0-100)
  calculateScore(pageType: string, metrics: Partial<PerformanceBudget>): number {
    const budget = this.budgets[pageType]
    if (!budget) return 0

    let totalChecks = 0
    let passedChecks = 0

    // Check all categories
    const categories = ['assets', 'timing', 'requests'] as const
    
    for (const category of categories) {
      if (metrics[category] && budget[category]) {
        for (const [metric, value] of Object.entries(metrics[category])) {
          totalChecks++
          const budgetValue = budget[category][metric as keyof typeof budget[category]]
          if (value <= budgetValue) {
            passedChecks++
          }
        }
      }
    }

    return totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0
  }

  // Generate performance report
  generateReport(pageType: string, metrics: Partial<PerformanceBudget>) {
    const budget = this.budgets[pageType]
    if (!budget) return null

    const score = this.calculateScore(pageType, metrics)
    const violations = this.getViolations().filter(v => v.page === pageType)

    return {
      pageType,
      score,
      budget,
      metrics,
      violations,
      recommendations: this.generateRecommendations(violations),
      timestamp: new Date().toISOString(),
    }
  }

  private generateRecommendations(violations: typeof this.violations) {
    const recommendations: string[] = []

    violations.forEach(violation => {
      switch (violation.category) {
        case 'assets':
          if (violation.metric === 'javascript') {
            recommendations.push('Consider code splitting and lazy loading for JavaScript bundles')
          } else if (violation.metric === 'images') {
            recommendations.push('Optimize images with WebP/AVIF formats and responsive sizing')
          } else if (violation.metric === 'fonts') {
            recommendations.push('Use font-display: swap and subset fonts to reduce size')
          }
          break
          
        case 'timing':
          if (violation.metric === 'lcp') {
            recommendations.push('Optimize Largest Contentful Paint with image optimization and preloading')
          } else if (violation.metric === 'cls') {
            recommendations.push('Reduce Cumulative Layout Shift by reserving space for dynamic content')
          } else if (violation.metric === 'fid') {
            recommendations.push('Improve First Input Delay by reducing JavaScript execution time')
          }
          break
          
        case 'requests':
          if (violation.metric === 'total') {
            recommendations.push('Reduce HTTP requests by bundling resources and using sprites')
          }
          break
      }
    })

    return [...new Set(recommendations)] // Remove duplicates
  }
}

// Singleton instance
export const performanceBudgetMonitor = new PerformanceBudgetMonitor()

// Utility functions
export function getPageTypeBudget(pathname: string): PerformanceBudget {
  if (pathname === '/') return PERFORMANCE_BUDGETS.homepage
  if (pathname.startsWith('/produtos/')) return PERFORMANCE_BUDGETS.product
  if (pathname === '/contato') return PERFORMANCE_BUDGETS.form
  return PERFORMANCE_BUDGETS.content
}

export function formatBudgetValue(category: string, value: number): string {
  switch (category) {
    case 'assets':
      return `${value} KB`
    case 'timing':
      return `${value} ms`
    case 'requests':
      return `${value} requests`
    default:
      return `${value}`
  }
}