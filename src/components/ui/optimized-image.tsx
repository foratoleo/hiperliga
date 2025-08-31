
// src/components/ui/optimized-image.tsx
'use client'

import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Loading } from '@/components/ui/loading'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  category?: 'hero' | 'product' | 'benefit' | 'gallery' | 'brand' | 'misc'
  loading?: 'eager' | 'lazy'
  showLoader?: boolean
}

export function OptimizedImage({
  src,
  alt,
  category = 'misc', 
  className,
  loading = 'lazy',
  showLoader = true,
  priority,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Remove loading prop if priority is set to avoid conflicts
  const imageProps = { ...props }
  if (priority) {
    delete imageProps.loading
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

  return (
    <div className="relative">
      {isLoading && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <Loading variant="sustainable" size="sm" />
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        sizes={getSizes()}
        priority={priority}
        loading={priority ? undefined : loading}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        {...imageProps}
      />
    </div>
  )
}
