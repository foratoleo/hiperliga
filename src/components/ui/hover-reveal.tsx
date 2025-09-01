'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HoverRevealProps {
  children: React.ReactNode
  revealContent: React.ReactNode
  className?: string
  trigger?: 'hover' | 'click' | 'focus'
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  variant?: 'overlay' | 'expand' | 'slide' | 'fade' | 'scale'
  delay?: number
  duration?: number
  disabled?: boolean
  keepMounted?: boolean
  onReveal?: () => void
  onHide?: () => void
}

// Animation variants for different reveal directions and types
const revealVariants = {
  overlay: {
    top: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 }
    },
    bottom: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    },
    left: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 }
    },
    right: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 }
    },
    center: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 }
    }
  },
  expand: {
    top: {
      hidden: { opacity: 0, scaleY: 0, originY: 1 },
      visible: { opacity: 1, scaleY: 1, originY: 1 }
    },
    bottom: {
      hidden: { opacity: 0, scaleY: 0, originY: 0 },
      visible: { opacity: 1, scaleY: 1, originY: 0 }
    },
    left: {
      hidden: { opacity: 0, scaleX: 0, originX: 1 },
      visible: { opacity: 1, scaleX: 1, originX: 1 }
    },
    right: {
      hidden: { opacity: 0, scaleX: 0, originX: 0 },
      visible: { opacity: 1, scaleX: 1, originX: 0 }
    },
    center: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 }
    }
  },
  slide: {
    top: {
      hidden: { height: 0, opacity: 0, y: -10 },
      visible: { height: 'auto', opacity: 1, y: 0 }
    },
    bottom: {
      hidden: { height: 0, opacity: 0, y: 10 },
      visible: { height: 'auto', opacity: 1, y: 0 }
    },
    left: {
      hidden: { width: 0, opacity: 0, x: -10 },
      visible: { width: 'auto', opacity: 1, x: 0 }
    },
    right: {
      hidden: { width: 0, opacity: 0, x: 10 },
      visible: { width: 'auto', opacity: 1, x: 0 }
    },
    center: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    }
  },
  fade: {
    top: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    bottom: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    left: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    right: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    center: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  },
  scale: {
    top: {
      hidden: { opacity: 0, scale: 0.7, y: -10 },
      visible: { opacity: 1, scale: 1, y: 0 }
    },
    bottom: {
      hidden: { opacity: 0, scale: 0.7, y: 10 },
      visible: { opacity: 1, scale: 1, y: 0 }
    },
    left: {
      hidden: { opacity: 0, scale: 0.7, x: -10 },
      visible: { opacity: 1, scale: 1, x: 0 }
    },
    right: {
      hidden: { opacity: 0, scale: 0.7, x: 10 },
      visible: { opacity: 1, scale: 1, x: 0 }
    },
    center: {
      hidden: { opacity: 0, scale: 0.3 },
      visible: { opacity: 1, scale: 1 }
    }
  }
}

export function HoverReveal({
  children,
  revealContent,
  className,
  trigger = 'hover',
  direction = 'bottom',
  variant = 'overlay',
  delay = 0,
  duration = 0.3,
  disabled = false,
  keepMounted = false,
  onReveal,
  onHide
}: HoverRevealProps) {
  const [isRevealed, setIsRevealed] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(keepMounted)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const handleShow = React.useCallback(() => {
    if (disabled) return
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsRevealed(true)
      setIsMounted(true)
      onReveal?.()
    }, delay)
  }, [disabled, delay, onReveal])

  const handleHide = React.useCallback(() => {
    if (disabled) return
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsRevealed(false)
    onHide?.()
    
    if (!keepMounted) {
      setTimeout(() => setIsMounted(false), duration * 1000 + 100)
    }
  }, [disabled, keepMounted, duration, onHide])

  const handleClick = React.useCallback(() => {
    if (disabled) return
    
    if (isRevealed) {
      handleHide()
    } else {
      handleShow()
    }
  }, [disabled, isRevealed, handleShow, handleHide])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const variants = revealVariants[variant][direction]
  
  const interactionProps = React.useMemo(() => {
    switch (trigger) {
      case 'hover':
        return {
          onMouseEnter: handleShow,
          onMouseLeave: handleHide
        }
      case 'click':
        return {
          onClick: handleClick
        }
      case 'focus':
        return {
          onFocus: handleShow,
          onBlur: handleHide
        }
      default:
        return {}
    }
  }, [trigger, handleShow, handleHide, handleClick])

  return (
    <div 
      className={cn("relative", className)}
      {...interactionProps}
    >
      {/* Main content */}
      <motion.div
        whileHover={trigger === 'hover' && !disabled ? { scale: 1.02 } : undefined}
        whileTap={trigger === 'click' && !disabled ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.div>

      {/* Revealed content */}
      <AnimatePresence mode="wait">
        {(isRevealed || keepMounted) && isMounted && (
          <motion.div
            initial="hidden"
            animate={isRevealed ? "visible" : "hidden"}
            exit="hidden"
            variants={variants}
            transition={{
              duration,
              ease: [0.4, 0, 0.2, 1]
            }}
            className={cn(
              "absolute z-10",
              variant === 'overlay' && "inset-0 flex items-center justify-center bg-black/80 rounded-lg",
              variant === 'expand' && direction === 'top' && "bottom-full left-0 right-0 mb-2",
              variant === 'expand' && direction === 'bottom' && "top-full left-0 right-0 mt-2",
              variant === 'expand' && direction === 'left' && "right-full top-0 bottom-0 mr-2",
              variant === 'expand' && direction === 'right' && "left-full top-0 bottom-0 ml-2",
              variant === 'expand' && direction === 'center' && "inset-0",
              variant === 'slide' && "overflow-hidden",
              variant === 'fade' && direction === 'top' && "bottom-full left-0 right-0 mb-2",
              variant === 'fade' && direction === 'bottom' && "top-full left-0 right-0 mt-2",
              variant === 'fade' && direction === 'left' && "right-full top-0 bottom-0 mr-2",
              variant === 'fade' && direction === 'right' && "left-full top-0 bottom-0 ml-2",
              variant === 'fade' && direction === 'center' && "inset-0",
              variant === 'scale' && direction === 'top' && "bottom-full left-0 right-0 mb-2",
              variant === 'scale' && direction === 'bottom' && "top-full left-0 right-0 mt-2",
              variant === 'scale' && direction === 'left' && "right-full top-0 bottom-0 mr-2",
              variant === 'scale' && direction === 'right' && "left-full top-0 bottom-0 ml-2",
              variant === 'scale' && direction === 'center' && "inset-0"
            )}
          >
            {revealContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Specialized hover reveal components
interface ProductHoverRevealProps {
  product: {
    name: string
    image: string
    price?: string
    specs?: Array<{ label: string; value: string }>
  }
  className?: string
}

export function ProductHoverReveal({ product, className }: ProductHoverRevealProps) {
  return (
    <HoverReveal
      className={cn("group", className)}
      variant="overlay"
      direction="center"
      duration={0.25}
      revealContent={
        <div className="text-white p-4 space-y-3">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          {product.price && (
            <p className="text-sm opacity-90">{product.price}</p>
          )}
          {product.specs && product.specs.length > 0 && (
            <div className="space-y-1">
              {product.specs.map((spec, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="opacity-80">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    >
      <div className="aspect-square rounded-lg overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    </HoverReveal>
  )
}

interface BenefitHoverRevealProps {
  benefit: {
    icon: React.ReactNode
    title: string
    description: string
    details?: string
  }
  className?: string
}

export function BenefitHoverReveal({ benefit, className }: BenefitHoverRevealProps) {
  return (
    <HoverReveal
      className={cn("p-6 rounded-xl border border-border bg-card group", className)}
      variant="expand"
      direction="bottom"
      duration={0.3}
      revealContent={
        <div className="bg-muted/50 p-4 rounded-lg mt-4 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {benefit.details || 'Detalhes adicionais sobre este benefício estarão disponíveis em breve.'}
          </p>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-200">
          {benefit.icon}
        </div>
        <h3 className="font-semibold text-foreground">{benefit.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </HoverReveal>
  )
}

interface StatHoverRevealProps {
  stat: {
    value: string
    label: string
    description: string
    context?: string
  }
  className?: string
}

export function StatHoverReveal({ stat, className }: StatHoverRevealProps) {
  return (
    <HoverReveal
      className={cn("text-center p-6 group", className)}
      variant="fade"
      direction="bottom"
      duration={0.2}
      revealContent={
        <div className="absolute inset-x-0 top-full mt-2 bg-popover border border-border rounded-lg p-3 shadow-lg z-20">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {stat.context || 'Contexto adicional sobre esta estatística.'}
          </p>
        </div>
      }
    >
      <div className="space-y-2">
        <div className="text-3xl font-bold text-brand-primary group-hover:scale-110 transition-transform duration-200">
          {stat.value}
        </div>
        <h3 className="font-medium text-foreground">{stat.label}</h3>
        <p className="text-sm text-muted-foreground">{stat.description}</p>
      </div>
    </HoverReveal>
  )
}

export default HoverReveal