'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const loadingVariants = cva(
  'relative flex items-center justify-center',
  {
    variants: {
      variant: {
        // Basic spinners
        default: 'animate-spin rounded-sm border-2 border-gray-300 border-t-brand-primary',
        dots: 'flex space-x-1',
        pulse: 'animate-pulse bg-brand-primary rounded-sm',
        
        // Premium variants
        premium: 'animate-spin rounded-sm bg-gradient-conic from-brand-primary via-brand-secondary to-brand-accent',
        sustainable: 'animate-spin rounded-sm bg-gradient-sustainable shadow-glow-green',
        innovation: 'animate-spin rounded-sm bg-gradient-innovation shadow-glow-blue',
        luxury: 'animate-spin rounded-sm bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent shadow-luxury',
        glass: 'animate-spin rounded-sm bg-glass-effect backdrop-blur-glass border border-white/20',
        shimmer: 'animate-spin rounded-sm bg-gradient-professional relative overflow-hidden',
        
        // Specialized loaders
        orbit: 'animate-spin relative',
        wave: 'flex items-end space-x-1',
        skeleton: 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
      },
      size: {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4', 
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
        '2xl': 'w-16 h-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string
  overlay?: boolean
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant, size, text, overlay, ...props }, ref) => {
    if (variant === 'dots') {
      return (
        <div
          ref={ref}
          className={cn(loadingVariants({ variant, className }))}
          {...props}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'bg-brand-primary rounded-sm animate-loading-dots',
                size === 'xs' && 'w-1 h-1',
                size === 'sm' && 'w-1.5 h-1.5',
                size === 'md' && 'w-2 h-2',
                size === 'lg' && 'w-3 h-3',
                size === 'xl' && 'w-4 h-4',
                size === '2xl' && 'w-5 h-5'
              )}
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )
    }
    
    if (variant === 'wave') {
      return (
        <div
          ref={ref}
          className={cn(loadingVariants({ variant, className }))}
          {...props}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'bg-brand-primary animate-bounce',
                size === 'xs' && 'w-1 h-2',
                size === 'sm' && 'w-1.5 h-3',
                size === 'md' && 'w-2 h-4',
                size === 'lg' && 'w-3 h-6',
                size === 'xl' && 'w-4 h-8',
                size === '2xl' && 'w-5 h-10'
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      )
    }
    
    if (variant === 'orbit') {
      return (
        <div
          ref={ref}
          className={cn(loadingVariants({ variant, className }))}
          {...props}
        >
          <div className={cn('absolute inset-0 rounded-sm border-2 border-gray-300 border-t-brand-primary animate-spin')} />
          <div className={cn('absolute inset-1 rounded-sm border border-gray-200 border-r-brand-secondary animate-spin-slow')} />
          <div className={cn('absolute inset-2 rounded-sm bg-brand-primary/20')} />
        </div>
      )
    }

    if (variant === 'shimmer') {
      return (
        <div
          ref={ref}
          className={cn(loadingVariants({ variant, size, className }))}
          {...props}
        >
          <div className="absolute inset-0 bg-shimmer-effect animate-shimmer opacity-50" />
        </div>
      )
    }
    
    const LoadingComponent = (
      <div
        ref={ref}
        className={cn(loadingVariants({ variant, size, className }))}
        {...props}
      />
    )

    if (overlay) {
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-luxury flex flex-col items-center space-y-4">
            {LoadingComponent}
            {text && (
              <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                {text}
              </p>
            )}
          </div>
        </div>
      )
    }

    if (text) {
      return (
        <div className="flex flex-col items-center space-y-2">
          {LoadingComponent}
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
            {text}
          </p>
        </div>
      )
    }

    return LoadingComponent
  }
)

Loading.displayName = 'Loading'

// Skeleton component for content loading
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  rounded?: boolean
  lines?: number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, rounded = false, lines = 1, ...props }, ref) => {
    if (lines > 1) {
      return (
        <div className="space-y-2">
          {[...Array(lines)].map((_, i) => (
            <div
              key={i}
              ref={i === 0 ? ref : undefined}
              className={cn(
                'animate-pulse bg-gray-200 dark:bg-gray-700',
                rounded ? 'rounded-sm' : 'rounded',
                className
              )}
              style={{
                width: i === lines - 1 ? '75%' : width || '100%',
                height: height || '1rem',
              }}
              {...(i === 0 ? props : {})}
            />
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-gray-200 dark:bg-gray-700',
          rounded ? 'rounded-sm' : 'rounded',
          className
        )}
        style={{
          width: width || '100%',
          height: height || '1rem',
        }}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Loading Button component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
  loadingText?: string
  loadingVariant?: VariantProps<typeof loadingVariants>['variant']
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, children, loadingText, loadingVariant = 'default', className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn('relative flex items-center justify-center space-x-2', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loading
          variant={loadingVariant}
          size="sm"
          className="mr-2"
        />
      )}
      <span className={loading ? 'opacity-70' : ''}>
        {loading && loadingText ? loadingText : children}
      </span>
    </button>
  )
)

LoadingButton.displayName = 'LoadingButton'

export { Loading, Skeleton, LoadingButton, loadingVariants }