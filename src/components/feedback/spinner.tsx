import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    color: {
      default: 'text-foreground',
      primary: 'text-brand-primary',
      secondary: 'text-brand-secondary',
      muted: 'text-muted-foreground',
      white: 'text-white',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
})

export interface SpinnerProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  spinning?: boolean
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size, color, spinning = true, className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn(
          spinnerVariants({ size, color }),
          !spinning && 'animate-none',
          className
        )}
        fill="none"
        viewBox="0 0 24 24"
        role="progressbar"
        aria-label="Carregando..."
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )
  }
)
Spinner.displayName = 'Spinner'

// Loading Dots - alternative spinner
interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'white'
}

const LoadingDots = React.forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ size = 'md', color = 'default', className, ...props }, ref) => {
    const dotSizes = {
      sm: 'h-1 w-1',
      md: 'h-2 w-2',
      lg: 'h-3 w-3',
    }

    const dotColors = {
      default: 'bg-foreground',
      primary: 'bg-brand-primary', 
      white: 'bg-white',
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center space-x-1', className)}
        role="progressbar"
        aria-label="Carregando..."
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'rounded-sm animate-bounce',
              dotSizes[size],
              dotColors[color]
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1.4s',
            }}
          />
        ))}
      </div>
    )
  }
)
LoadingDots.displayName = 'LoadingDots'

// Loading Skeleton - for content placeholders
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  height?: number | string
  width?: number | string
  avatar?: boolean
  rounded?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    lines = 1, 
    height, 
    width = '100%',
    avatar = false,
    rounded = false,
    className, 
    ...props 
  }, ref) => {
    if (avatar) {
      return (
        <div
          ref={ref}
          className={cn(
            'animate-pulse bg-muted rounded-sm',
            'h-10 w-10',
            className
          )}
          {...props}
        />
      )
    }

    if (lines === 1) {
      return (
        <div
          ref={ref}
          className={cn(
            'animate-pulse bg-muted',
            rounded ? 'rounded-md' : 'rounded',
            className
          )}
          style={{ 
            height: height || '1rem', 
            width 
          }}
          {...props}
        />
      )
    }

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              'animate-pulse bg-muted',
              rounded ? 'rounded-md' : 'rounded'
            )}
            style={{
              height: height || '1rem',
              width: i === lines - 1 ? '75%' : width,
            }}
          />
        ))}
      </div>
    )
  }
)
Skeleton.displayName = 'Skeleton'

// Loading Overlay - covers content while loading
interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  loading: boolean
  children?: React.ReactNode
  spinnerSize?: VariantProps<typeof spinnerVariants>['size']
  text?: string
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ 
    loading, 
    children, 
    spinnerSize = 'lg',
    text = 'Carregando...',
    className, 
    ...props 
  }, ref) => {
    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {children}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <Spinner size={spinnerSize} />
            {text && (
              <p className="mt-4 text-sm text-muted-foreground">
                {text}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
LoadingOverlay.displayName = 'LoadingOverlay'

// Button Loading State - shows spinner inside button
interface ButtonSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ButtonSpinner = React.forwardRef<HTMLDivElement, ButtonSpinnerProps>(
  ({ size = 'sm', className }, ref) => {
    const spinnerSizes = {
      sm: 'xs' as const,
      md: 'sm' as const, 
      lg: 'md' as const,
    }

    return (
      <div ref={ref} className={cn('flex items-center', className)}>
        <Spinner 
          size={spinnerSizes[size]} 
          color="white"
          className="mr-2"
        />
        <span>Carregando...</span>
      </div>
    )
  }
)
ButtonSpinner.displayName = 'ButtonSpinner'

export {
  Spinner,
  spinnerVariants,
  LoadingDots,
  Skeleton,
  LoadingOverlay,
  ButtonSpinner
}