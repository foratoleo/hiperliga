'use client'

import * as React from 'react'
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface ProgressiveRevealProps {
  children: React.ReactNode
  className?: string
  initialItems?: number
  revealIncrement?: number
  revealText?: string
  collapseText?: string
  showProgress?: boolean
  variant?: 'default' | 'fade' | 'slide' | 'stagger'
  trigger?: 'manual' | 'scroll' | 'auto'
  autoDelay?: number
  onReveal?: (newCount: number) => void
  onComplete?: () => void
}

// Animation variants for different reveal types
const revealVariants = {
  default: {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto', 
      marginBottom: '1rem'
    }
  },
  fade: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1
    }
  },
  slide: {
    hidden: { opacity: 0, y: 20, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto'
    }
  },
  stagger: {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1
    })
  }
}

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export function ProgressiveReveal({
  children,
  className,
  initialItems = 3,
  revealIncrement = 3,
  revealText = "Ver mais",
  collapseText = "Ver menos",
  showProgress = false,
  variant = 'default',
  trigger = 'manual',
  autoDelay = 2000,
  onReveal,
  onComplete
}: ProgressiveRevealProps) {
  const controls = useAnimation()
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })
  
  const childrenArray = React.Children.toArray(children)
  const totalItems = childrenArray.length
  
  const [visibleCount, setVisibleCount] = React.useState(initialItems)
  const [isRevealing, setIsRevealing] = React.useState(false)
  const [showAll, setShowAll] = React.useState(false)

  // Auto-reveal based on trigger
  React.useEffect(() => {
    if (trigger === 'auto') {
      const timer = setTimeout(() => {
        handleRevealMore()
      }, autoDelay)
      return () => clearTimeout(timer)
    }
  }, [trigger, autoDelay])

  // Scroll-triggered reveal
  React.useEffect(() => {
    if (trigger === 'scroll' && isInView && visibleCount <= initialItems) {
      handleRevealMore()
    }
  }, [isInView, trigger, visibleCount, initialItems])

  const handleRevealMore = React.useCallback(() => {
    if (isRevealing) return
    
    setIsRevealing(true)
    const newCount = Math.min(visibleCount + revealIncrement, totalItems)
    
    setTimeout(() => {
      setVisibleCount(newCount)
      setIsRevealing(false)
      
      onReveal?.(newCount)
      
      if (newCount >= totalItems) {
        setShowAll(true)
        onComplete?.()
      }
    }, 100)
  }, [visibleCount, revealIncrement, totalItems, isRevealing, onReveal, onComplete])

  const handleShowLess = React.useCallback(() => {
    setVisibleCount(initialItems)
    setShowAll(false)
  }, [initialItems])

  const progress = totalItems > 0 ? (visibleCount / totalItems) * 100 : 0

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {childrenArray.slice(0, visibleCount).map((child, index) => {
            const itemVariant = revealVariants[variant]
            
            return (
              <motion.div
                key={index}
                variants={itemVariant}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layout
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "overflow-hidden",
                  index >= initialItems && "newly-revealed"
                )}
              >
                {child}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Progress Indicator */}
      {showProgress && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{visibleCount} de {totalItems} itens</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-primary rounded-full"
              initial={{ width: `${(initialItems / totalItems) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
      )}

      {/* Control Buttons */}
      {trigger === 'manual' && totalItems > initialItems && (
        <div className="mt-6 flex justify-center">
          {!showAll ? (
            <motion.button
              onClick={handleRevealMore}
              disabled={isRevealing}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                "bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary",
                "font-medium text-sm transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "border border-brand-primary/20 hover:border-brand-primary/30"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRevealing ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-brand-primary/30 border-t-brand-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Revelando...
                </>
              ) : (
                <>
                  {revealText} ({totalItems - visibleCount})
                  <ChevronDownIcon className="w-4 h-4" />
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              onClick={handleShowLess}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground",
                "font-medium text-sm transition-all duration-200",
                "border border-border hover:border-border/80"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {collapseText}
              <ChevronDownIcon className="w-4 h-4 rotate-180" />
            </motion.button>
          )}
        </div>
      )}

      {/* Auto-reveal indicator */}
      {trigger === 'auto' && !showAll && (
        <motion.div
          className="mt-4 text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Mais conteúdo será revelado automaticamente...
        </motion.div>
      )}
    </div>
  )
}

// Specialized Benefits Progressive Reveal
interface BenefitsProgressiveRevealProps {
  benefits: Array<{
    icon?: React.ReactNode
    title: string
    description: string
    details?: string
    highlight?: boolean
  }>
  className?: string
  initialCount?: number
  title?: string
  subtitle?: string
}

export function BenefitsProgressiveReveal({
  benefits,
  className,
  initialCount = 4,
  title = "Principais Benefícios",
  subtitle = "Descubra todas as vantagens"
}: BenefitsProgressiveRevealProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {title && (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
      
      <ProgressiveReveal
        initialItems={initialCount}
        variant="stagger"
        revealText="Ver mais benefícios"
        showProgress={true}
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className={cn(
              "p-6 rounded-xl border border-border bg-card",
              "hover:border-brand-primary/30 hover:shadow-md transition-all duration-300",
              benefit.highlight && "border-brand-primary/50 bg-brand-primary/5"
            )}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start gap-4">
              {benefit.icon && (
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                  benefit.highlight 
                    ? "bg-brand-primary/20 text-brand-primary" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {benefit.icon}
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {benefit.description}
                </p>
                {benefit.details && (
                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    {benefit.details}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </ProgressiveReveal>
    </div>
  )
}

export default ProgressiveReveal