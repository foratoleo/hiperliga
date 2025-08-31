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
  animationType?: 'fade' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale'
  animationDelay?: number
  once?: boolean
}

const LazySectionWrapper: React.FC<LazySectionProps> = ({
  children,
  className,
  threshold = 0.1,
  rootMargin = '50px',
  fallback = null,
  animationType = 'slideUp',
  animationDelay = 0,
  once = true
}) => {
  const [isInView, setIsInView] = React.useState(false)
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const sectionRef = React.useRef<HTMLDivElement>(null)

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