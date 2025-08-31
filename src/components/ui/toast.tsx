'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

const toastVariants = cva(
  'relative flex w-full items-center space-x-4 overflow-hidden rounded-xl border p-6 pr-8 shadow-premium transition-all duration-500 transform-gpu',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-200 text-gray-900',
        destructive: 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800',
        success: 'bg-gradient-sustainable border-green-200 text-white shadow-glow-green',
        warning: 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800',
        info: 'bg-gradient-innovation border-blue-200 text-white shadow-glow-blue',
        
        // Premium variants
        luxury: 'bg-gradient-professional border-brand-primary/20 text-white shadow-luxury',
        glass: 'bg-glass-effect backdrop-blur-premium border-white/20 text-brand-primary',
        premium: 'bg-gradient-to-br from-white/95 via-brand-primary/5 to-white/90 border-brand-primary/10 shadow-depth',
      },
      size: {
        sm: 'p-3 text-sm',
        default: 'p-6 text-base',
        lg: 'p-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  closable?: boolean
  onClose?: () => void
  duration?: number
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    className, 
    variant, 
    size, 
    title, 
    description, 
    icon, 
    action, 
    closable = true, 
    onClose,
    duration = 5000,
    ...props 
  }, ref) => {
    const [visible, setVisible] = React.useState(true)
    const [progress, setProgress] = React.useState(100)

    React.useEffect(() => {
      if (!duration) return

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50))
          if (newProgress <= 0) {
            clearInterval(progressInterval)
            handleClose()
            return 0
          }
          return newProgress
        })
      }, 50)

      return () => clearInterval(progressInterval)
    }, [duration])

    const handleClose = () => {
      setVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300)
    }

    const getIcon = () => {
      if (icon) return icon

      switch (variant) {
        case 'success':
          return <CheckCircleIcon className="h-6 w-6 text-white" />
        case 'destructive':
          return <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
        case 'warning':
          return <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
        case 'info':
          return <InformationCircleIcon className="h-6 w-6 text-white" />
        case 'luxury':
          return <CheckCircleIcon className="h-6 w-6 text-white" />
        default:
          return <InformationCircleIcon className="h-6 w-6 text-gray-600" />
      }
    }

    if (!visible) return null

    return (
      <div
        ref={ref}
        className={cn(
          toastVariants({ variant, size }),
          'animate-slide-up',
          !visible && 'animate-fade-out',
          className
        )}
        {...props}
      >
        {/* Progress bar */}
        {duration && (
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-30 transition-all duration-100 ease-linear"
               style={{ width: `${progress}%` }} />
        )}

        {/* Icon */}
        <div className="flex-shrink-0">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-semibold mb-1">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm opacity-90">
              {description}
            </div>
          )}
        </div>

        {/* Action */}
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}

        {/* Close button */}
        {closable && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 flex-shrink-0 rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-current transition-colors"
            aria-label="Fechar notificação"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}

        {/* Shine effect for premium variants */}
        {(variant === 'luxury' || variant === 'premium') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
      </div>
    )
  }
)
Toast.displayName = 'Toast'

// Toast context and provider
interface ToastContextType {
  showToast: (props: Omit<ToastProps, 'onClose'>) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
  maxToasts?: number
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([])

  const showToast = React.useCallback((props: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...props, id }

    setToasts(prev => {
      const updated = [newToast, ...prev].slice(0, maxToasts)
      return updated
    })
  }, [maxToasts])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const contextValue = React.useMemo(() => ({
    showToast,
  }), [showToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-4 max-w-md">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export { Toast, toastVariants }