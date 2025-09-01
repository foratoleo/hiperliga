'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LazySectionProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  fallback?: React.ReactNode
  animationType?: 'fade' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'stagger'
  animationDelay?: number
  once?: boolean
  preloadContent?: boolean
  onInView?: () => void
  onOutOfView?: () => void
  priority?: 'high' | 'medium' | 'low'
  trackPerformance?: boolean
}

const LazySectionWrapper: React.FC<LazySectionProps> = ({
  children,
  className,
  threshold = 0.1,
  rootMargin = '50px',
  fallback = null,
  animationType = 'slideUp',
  animationDelay = 0,
  once = true,
  preloadContent = false,
  onInView,
  onOutOfView,
  priority = 'medium',
  trackPerformance = false
}) => {
  const [isInView, setIsInView] = React.useState(preloadContent)
  const [hasLoaded, setHasLoaded] = React.useState(preloadContent)
  const [loadStartTime, setLoadStartTime] = React.useState<number>(0)
  const sectionRef = React.useRef<HTMLDivElement>(null)

  // Performance tracking
  const trackSectionPerformance = React.useCallback((action: string) => {
    if (!trackPerformance || typeof window === 'undefined') return
    
    const now = performance.now()
    if (action === 'view_start') {
      setLoadStartTime(now)
    } else if (action === 'view_complete' && loadStartTime > 0) {
      const duration = now - loadStartTime
      
      // Track with gtag if available
      if (window.gtag) {
        window.gtag('event', 'lazy_section_load', {
          event_category: 'performance',
          event_label: priority,
          value: Math.round(duration),
          custom_parameter_1: animationType
        })
      }
    }
  }, [trackPerformance, loadStartTime, priority, animationType])

  React.useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          setHasLoaded(true)
          if (once) {
            observer.disconnect()
          }
        } else if (!once) {
          setIsInView(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  // Animation variants
  const animations = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 }
    },
    stagger: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    }
  }

  const currentAnimation = animations[animationType]

  return (
    <div ref={sectionRef} className={className}>
      {isInView || hasLoaded ? (
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={currentAnimation}
          transition={{
            duration: 0.6,
            delay: animationDelay,
            ease: [0.4, 0, 0.2, 1] as const
          }}
        >
          {children}
        </motion.div>
      ) : (
        fallback || (
          <div className={cn('animate-pulse bg-muted rounded-lg', className)}>
            <div className="h-32 w-full" />
          </div>
        )
      )}
    </div>
  )
}

export { LazySectionWrapper as LazySection }
export type { LazySectionProps }