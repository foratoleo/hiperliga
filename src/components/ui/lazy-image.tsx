'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function LazyImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false, 
  quality = 75,
  sizes,
  fill,
  loading = 'lazy',
  placeholder = 'empty',
  blurDataURL,
  ...props 
}: LazyImageProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  // Generate low-quality placeholder for better UX
  const generateBlurDataURL = (w: number, h: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#f1f5f9"/>
        <circle cx="${w/2}" cy="${h/2}" r="20" fill="#cbd5e1" opacity="0.5"/>
      </svg>`
    ).toString('base64')}`
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  // Error fallback
  if (hasError) {
    return (
      <div 
        className={cn(
          'bg-muted flex items-center justify-center text-muted-foreground text-sm',
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="mb-2">📷</div>
          <div>Imagem não disponível</div>
        </div>
      </div>
    )
  }

  const imageProps = {
    src,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    quality,
    loading,
    placeholder: placeholder === 'blur' ? 'blur' as const : 'empty' as const,
    blurDataURL: blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined),
    className: cn(
      'transition-opacity duration-300',
      isLoading ? 'opacity-0' : 'opacity-100',
      className
    ),
    // Mobile-optimized sizes
    sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    ...props
  }

  if (fill) {
    return (
      <div className="relative overflow-hidden">
        <Image
          {...imageProps}
          fill
          priority={priority}
        />
        {isLoading && (
          <div className={cn(
            'absolute inset-0 bg-muted animate-pulse flex items-center justify-center',
            className
          )}>
            <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <Image
        {...imageProps}
        width={width}
        height={height}
        priority={priority}
      />
      {isLoading && (
        <div className={cn(
          'absolute inset-0 bg-muted animate-pulse flex items-center justify-center',
          className
        )}
        style={{ width, height }}
        >
          <div className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default LazyImage