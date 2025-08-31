'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { StatusIcon } from '../ui/icon'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title?: string
  description: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Provider
interface ToastProviderProps {
  children: React.ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxToasts?: number
}

export const ToastProvider = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}: ToastProviderProps) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => {
      const updated = [newToast, ...prev].slice(0, maxToasts)
      return updated
    })

    // Auto remove toast after duration
    const duration = toast.duration ?? getDefaultDuration(toast.type)
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [maxToasts])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  }

  if (!mounted) return null

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      {createPortal(
        <div className={cn('fixed z-50 flex flex-col space-y-2', positionClasses[position])}>
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <ToastComponent
                key={toast.id}
                toast={toast}
                onRemove={() => removeToast(toast.id)}
              />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

// Individual Toast Component
interface ToastComponentProps {
  toast: Toast
  onRemove: () => void
}

const ToastComponent = ({ toast, onRemove }: ToastComponentProps) => {
  const getToastStyles = (type: ToastType) => {
    const styles = {
      success: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
      error: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
      warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
      info: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
    }
    return styles[type]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className={cn(
        'relative w-full max-w-sm p-4 border rounded-lg shadow-lg backdrop-blur-sm',
        getToastStyles(toast.type)
      )}
    >
      <div className="flex items-start space-x-3">
        <StatusIcon 
          status={toast.type === 'info' ? 'info' : toast.type} 
          size="sm"
          className="flex-shrink-0 mt-0.5"
        />
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-medium text-foreground">
              {toast.title}
            </p>
          )}
          <p className={cn(
            'text-sm text-muted-foreground',
            !toast.title && 'text-foreground'
          )}>
            {toast.description}
          </p>
          
          {toast.action && (
            <button
              onClick={() => {
                toast.action!.onClick()
                onRemove()
              }}
              className="mt-2 text-xs font-medium text-brand-primary hover:text-brand-secondary underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={onRemove}
          className="flex-shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Fechar notificação"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

// Helper function to get default duration based on toast type
const getDefaultDuration = (type: ToastType): number => {
  const durations = {
    success: 4000,
    info: 4000,
    warning: 6000,
    error: 0 // Don't auto-remove error toasts
  }
  return durations[type]
}

// Convenience hooks for different toast types
export const useToastHelpers = () => {
  const { addToast } = useToast()

  return {
    success: (message: string, title?: string) => 
      addToast({ type: 'success', description: message, title }),
    
    error: (message: string, title?: string) => 
      addToast({ type: 'error', description: message, title, duration: 0 }),
    
    warning: (message: string, title?: string) => 
      addToast({ type: 'warning', description: message, title }),
    
    info: (message: string, title?: string) => 
      addToast({ type: 'info', description: message, title }),
    
    promise: <T,>(
      promise: Promise<T>,
      messages: {
        loading?: string
        success?: string | ((data: T) => string)
        error?: string | ((error: Error) => string)
      }
    ) => {
      const loadingId = Math.random().toString(36).substring(2, 9)
      
      // Show loading toast
      if (messages.loading) {
        addToast({
          type: 'info',
          description: messages.loading,
          duration: 0
        })
      }

      return promise
        .then((data) => {
          const successMessage = typeof messages.success === 'function' 
            ? messages.success(data) 
            : messages.success || 'Operação realizada com sucesso!'
          
          addToast({
            type: 'success',
            description: successMessage
          })
          
          return data
        })
        .catch((error) => {
          const errorMessage = typeof messages.error === 'function'
            ? messages.error(error)
            : messages.error || 'Ocorreu um erro inesperado'
          
          addToast({
            type: 'error',
            description: errorMessage,
            duration: 0
          })
          
          throw error
        })
    }
  }
}

export { ToastProvider as default }