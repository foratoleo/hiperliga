'use client'

import * as React from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatItem {
  value: string | number
  label: string
  description?: string
  details?: string
  icon?: React.ReactNode
  color?: string
  prefix?: string
  suffix?: string
  animate?: boolean
  animationDuration?: number
  formatValue?: (value: number) => string
  hoverDetails?: {
    title: string
    description: string
    metrics?: Array<{
      label: string
      value: string
    }>
  }
}

interface InteractiveStatsProps {
  stats: StatItem[]
  className?: string
  columns?: 2 | 3 | 4 | 5
  variant?: 'default' | 'card' | 'minimal' | 'gradient'
  showTooltips?: boolean
  animateOnView?: boolean
  stagger?: boolean
}

// Counter animation hook
function useCounter(
  endValue: number, 
  duration: number = 2000, 
  startAnimation: boolean = false,
  formatValue?: (value: number) => string
) {
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    if (!startAnimation) return
    
    let startTime: number
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (startTime === undefined) startTime = currentTime
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      
      // Easing function for more natural animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(easeOutCubic * endValue)
      
      setCount(currentValue)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [endValue, duration, startAnimation])
  
  return formatValue ? formatValue(count) : count
}

// Tooltip component
function StatTooltip({ 
  children, 
  content, 
  isVisible, 
  onVisibilityChange 
}: {
  children: React.ReactNode
  content: StatItem['hoverDetails']
  isVisible: boolean
  onVisibilityChange: (visible: boolean) => void
}) {
  if (!content) return <>{children}</>

  return (
    <div className="relative">
      <div
        onMouseEnter={() => onVisibilityChange(true)}
        onMouseLeave={() => onVisibilityChange(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2",
            "w-80 p-4 bg-popover border border-border rounded-lg shadow-lg",
            "backdrop-blur-md"
          )}
        >
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">{content.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {content.description}
            </p>
            
            {content.metrics && content.metrics.length > 0 && (
              <div className="pt-3 border-t border-border space-y-2">
                {content.metrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                    <span className="text-xs font-medium text-foreground">{metric.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-popover border-b border-r border-border rotate-45 transform -translate-y-1"></div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Individual stat component
function StatItem({ 
  stat, 
  index, 
  variant, 
  animateOnView, 
  stagger,
  showTooltips = false
}: {
  stat: StatItem
  index: number
  variant: InteractiveStatsProps['variant']
  animateOnView: boolean
  stagger: boolean
  showTooltips: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })
  const [tooltipVisible, setTooltipVisible] = React.useState(false)
  
  const shouldAnimate = animateOnView ? isInView : true
  const numericValue = typeof stat.value === 'number' ? stat.value : parseInt(stat.value.toString())
  const hasNumericValue = !isNaN(numericValue) && stat.animate !== false
  
  const animatedValue = useCounter(
    hasNumericValue ? numericValue : 0,
    stat.animationDuration || 2000,
    shouldAnimate && hasNumericValue,
    stat.formatValue
  )
  
  const displayValue = hasNumericValue && shouldAnimate ? animatedValue : stat.value
  
  const cardVariants = {
    default: "p-6 text-center",
    card: cn(
      "p-6 text-center bg-card border border-border rounded-xl shadow-sm",
      "hover:shadow-md hover:border-brand-primary/30 transition-all duration-300"
    ),
    minimal: "p-4 text-center",
    gradient: cn(
      "p-6 text-center bg-gradient-to-br from-card to-card/80 border border-border/50",
      "rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
      "hover:border-brand-primary/30"
    )
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  }

  const StatContent = (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      transition={{
        duration: 0.5,
        delay: stagger ? index * 0.1 : 0,
        ease: "easeOut"
      }}
      className={cn(
        cardVariants[variant || 'default'],
        "group cursor-default relative"
      )}
      whileHover={{ 
        y: variant === 'card' || variant === 'gradient' ? -4 : 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      }}
    >
      {/* Icon */}
      {stat.icon && (
        <motion.div 
          className={cn(
            "w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center",
            stat.color ? `text-${stat.color}` : "text-brand-primary",
            variant === 'gradient' && "bg-white/10 backdrop-blur-sm"
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {stat.icon}
        </motion.div>
      )}

      {/* Value */}
      <motion.div 
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-bold mb-2",
          stat.color ? `text-${stat.color}` : "text-brand-primary"
        )}
        initial={{ scale: 0.5 }}
        animate={{ scale: shouldAnimate ? 1 : 0.5 }}
        transition={{ 
          duration: 0.3, 
          delay: stagger ? index * 0.1 + 0.2 : 0.2,
          type: 'spring',
          stiffness: 300
        }}
      >
        {stat.prefix}{displayValue}{stat.suffix}
      </motion.div>

      {/* Label */}
      <h3 className={cn(
        "text-sm font-medium mb-1",
        "text-muted-foreground group-hover:text-foreground transition-colors"
      )}>
        {stat.label}
      </h3>

      {/* Description */}
      {stat.description && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {stat.description}
        </p>
      )}

      {/* Hover indicator */}
      {showTooltips && stat.hoverDetails && (
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 bg-brand-primary/40 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Pulse animation for active stats */}
      {shouldAnimate && hasNumericValue && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-brand-primary/20"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ 
            scale: [1, 1.05, 1], 
            opacity: [0, 0.3, 0] 
          }}
          transition={{ 
            duration: 2, 
            delay: stagger ? index * 0.1 : 0,
            repeat: Infinity, 
            repeatDelay: 3 
          }}
        />
      )}
    </motion.div>
  )

  if (showTooltips && stat.hoverDetails) {
    return (
      <StatTooltip
        content={stat.hoverDetails}
        isVisible={tooltipVisible}
        onVisibilityChange={setTooltipVisible}
      >
        {StatContent}
      </StatTooltip>
    )
  }

  return StatContent
}

export function InteractiveStats({
  stats,
  className,
  columns = 4,
  variant = 'default',
  showTooltips = false,
  animateOnView = true,
  stagger = true
}: InteractiveStatsProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
  }

  return (
    <div className={cn(
      "grid gap-6",
      gridCols[columns],
      className
    )}>
      {stats.map((stat, index) => (
        <StatItem
          key={index}
          stat={stat}
          index={index}
          variant={variant}
          animateOnView={animateOnView}
          stagger={stagger}
          showTooltips={showTooltips}
        />
      ))}
    </div>
  )
}

export default InteractiveStats