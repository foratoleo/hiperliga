
// src/components/ui/optimized-image.tsx
'use client'

import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import { Loading } from '@/components/ui/loading'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  category?: 'hero' | 'product' | 'benefit' | 'gallery' | 'brand' | 'misc'
  showLoader?: boolean
  blurDataURL?: string
  enableBlur?: boolean
  quality?: number
  format?: 'webp' | 'avif' | 'auto'
  onInView?: () => void
}

export function OptimizedImage({
  src,
  alt,
  category = 'misc', 
  className,
  loading = 'lazy',
  showLoader = true,
  priority,
  blurDataURL,
  enableBlur = true,
  quality,
  format = 'auto',
  onInView,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading and analytics
  useEffect(() => {
    if (!imgRef.current || priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          onInView?.()
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [priority, onInView])

  // Remove loading prop if priority is set to avoid conflicts
  const imageProps = { ...props } as any
  if (priority) {
    delete imageProps.loading
  }

  // Generate optimized quality based on category
  const getOptimizedQuality = () => {
    if (quality) return quality
    switch (category) {
      case 'hero':
        return 85
      case 'product':
        return 80
      case 'benefit':
      case 'gallery':
        return 75
      case 'brand':
        return 90
      default:
        return 75
    }
  }

  // Generate blur placeholder for better UX
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL
    if (!enableBlur) return undefined
    
    // Generate simple blur placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNGMUY1RjkiLz48L3N2Zz4='
  }

  // Determine responsive sizes based on category
  const getSizes = () => {
    switch (category) {
      case 'hero':
        return '100vw'
      case 'product':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
      case 'benefit':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px'
      case 'gallery':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px'
      case 'brand':
        return '200px'
      default:
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
    }
  }

  if (hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-gray-100 text-gray-400 text-sm',
        className
      )}>
        Imagem não disponível
      </div>
    )
  }

  // Only render if in view or priority
  const shouldLoad = priority || isInView

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      {isLoading && showLoader && shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
          <Loading variant="sustainable" size="sm" />
        </div>
      )}
      
      {shouldLoad ? (
        <Image
          src={src}
          alt={alt}
          className={cn(
            'transition-all duration-500 ease-out',
            isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
            'hover:scale-105 transition-transform duration-300',
            className
          )}
          sizes={getSizes()}
          priority={priority}
          quality={getOptimizedQuality()}
          loading={priority ? undefined : loading}
          placeholder={enableBlur && getBlurDataURL() ? 'blur' : 'empty'}
          blurDataURL={getBlurDataURL()}
          onLoad={() => {
            setIsLoading(false)
            // Track image load performance
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'image_loaded', {
                event_category: 'performance',
                event_label: category,
                custom_parameter_1: src
              })
            }
          }}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
            // Track image errors
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'image_error', {
                event_category: 'performance',
                event_label: src
              })
            }
          }}
          {...imageProps}
        />
      ) : (
        <div 
          className={cn(
            'bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse',
            className
          )}
          style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : '16/9' }}
        />
      )}
    </div>
  )
}
