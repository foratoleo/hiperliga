// Image optimization utilities and configurations

export const IMAGE_QUALITY_SETTINGS = {
  // High quality for hero images and product showcases
  hero: 90,
  
  // Standard quality for content images  
  content: 85,
  
  // Lower quality for thumbnails and previews
  thumbnail: 75,
  
  // Placeholder quality for blur effects
  placeholder: 10,
} as const

export const IMAGE_SIZES = {
  // Responsive image sizes for different breakpoints
  hero: {
    mobile: 640,
    tablet: 1024, 
    desktop: 1920,
  },
  
  content: {
    small: 400,
    medium: 800,
    large: 1200,
  },
  
  thumbnail: {
    small: 150,
    medium: 300,
    large: 450,
  },
  
  // Common aspect ratios
  aspectRatios: {
    square: '1:1',
    landscape: '16:9', 
    portrait: '3:4',
    wide: '21:9',
  }
} as const

// Generate responsive image sizes string
export function generateImageSizes(breakpoints: Record<string, number>) {
  return Object.entries(breakpoints)
    .map(([key, size]) => {
      switch (key) {
        case 'mobile':
          return `(max-width: 768px) ${size}px`
        case 'tablet':
          return `(max-width: 1024px) ${size}px`
        case 'desktop':
          return `${size}px`
        default:
          return `${size}px`
      }
    })
    .join(', ')
}

// Generate blur placeholder data URL
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  // Create gradient for more natural blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(0.5, '#e5e7eb') 
  gradient.addColorStop(1, '#d1d5db')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL()
}

// Image format priorities (browser support)
export const IMAGE_FORMAT_PRIORITY = [
  'image/avif',    // Best compression
  'image/webp',    // Good compression + wide support
  'image/jpeg',    // Universal fallback
  'image/png',     // For images requiring transparency
] as const

// Critical image loading strategy
export const CRITICAL_IMAGES = {
  // Above-the-fold images that should be prioritized
  hero: {
    priority: true,
    loading: 'eager' as const,
    quality: IMAGE_QUALITY_SETTINGS.hero,
  },
  
  // Logo and branding
  logo: {
    priority: true,
    loading: 'eager' as const, 
    quality: IMAGE_QUALITY_SETTINGS.content,
  },
  
  // Content images
  content: {
    priority: false,
    loading: 'lazy' as const,
    quality: IMAGE_QUALITY_SETTINGS.content,
  },
  
  // Thumbnails and previews
  thumbnail: {
    priority: false,
    loading: 'lazy' as const,
    quality: IMAGE_QUALITY_SETTINGS.thumbnail,
  },
} as const

// Image optimization recommendations
export const OPTIMIZATION_RECOMMENDATIONS = {
  // File size budgets (in KB)
  budgets: {
    hero: 500,      // Hero images
    content: 200,   // Content images
    thumbnail: 50,  // Thumbnails
  },
  
  // Performance targets
  targets: {
    lcp: 2500,      // Largest Contentful Paint (ms)
    cls: 0.1,       // Cumulative Layout Shift
    fcp: 1800,      // First Contentful Paint (ms)
  },
  
  // Image dimensions for common use cases
  dimensions: {
    hero: { width: 1920, height: 1080 },
    productCard: { width: 400, height: 400 },
    thumbnail: { width: 150, height: 150 },
    gallery: { width: 800, height: 600 },
  },
} as const

// Generate optimized image props
export function getOptimizedImageProps(
  src: string,
  type: keyof typeof CRITICAL_IMAGES,
  alt: string,
  dimensions?: { width?: number; height?: number }
) {
  const config = CRITICAL_IMAGES[type]
  
  return {
    src,
    alt,
    quality: config.quality,
    priority: config.priority,
    loading: config.loading,
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(),
    sizes: type === 'hero' 
      ? generateImageSizes(IMAGE_SIZES.hero)
      : generateImageSizes(IMAGE_SIZES.content),
    ...dimensions,
  }
}

// Image loading performance monitor
export function monitorImagePerformance() {
  if (typeof window === 'undefined') return
  
  // Monitor Largest Contentful Paint
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lcpEntry = entries[entries.length - 1] as any
      
      if (lcpEntry?.element?.tagName === 'IMG') {
        console.info('LCP Image:', {
          element: lcpEntry.element,
          loadTime: lcpEntry.loadTime,
          renderTime: lcpEntry.renderTime,
          size: lcpEntry.size,
        })
      }
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  } catch (error) {
    console.warn('Performance monitoring not supported:', error)
  }
}

// Preload critical images
export function preloadCriticalImages(images: string[]) {
  if (typeof window === 'undefined') return
  
  images.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}