'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface ExpandableCardProps {
  children: React.ReactNode
  className?: string
  defaultExpanded?: boolean
  expandedHeight?: string
  trigger?: React.ReactNode
  expandIcon?: React.ReactNode
  collapseIcon?: React.ReactNode
  onExpandedChange?: (expanded: boolean) => void
  disabled?: boolean
  variant?: 'default' | 'product' | 'minimal'
  animation?: 'smooth' | 'spring' | 'fade'
}

// Animation variants for different animation types
const animationVariants = {
  smooth: {
    expanded: { 
      height: 'auto',
      opacity: 1
    },
    collapsed: { 
      height: 0,
      opacity: 0
    }
  },
  spring: {
    expanded: { 
      height: 'auto',
      opacity: 1
    },
    collapsed: { 
      height: 0,
      opacity: 0
    }
  },
  fade: {
    expanded: { 
      height: 'auto',
      opacity: 1,
      scale: 1
    },
    collapsed: { 
      height: 0,
      opacity: 0,
      scale: 0.98
    }
  }
}

const cardVariants = {
  default: "bg-card text-card-foreground border border-border rounded-lg shadow-sm",
  product: "bg-gradient-to-br from-card to-card/80 text-card-foreground border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-shadow",
  minimal: "bg-transparent border-0 shadow-none"
}

export function ExpandableCard({
  children,
  className,
  defaultExpanded = false,
  trigger,
  expandIcon,
  collapseIcon,
  onExpandedChange,
  disabled = false,
  variant = 'default',
  animation = 'smooth',
  ...props
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const [isAnimating, setIsAnimating] = React.useState(false)

  const handleToggle = React.useCallback(() => {
    if (disabled || isAnimating) return
    
    setIsAnimating(true)
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onExpandedChange?.(newExpanded)
    
    // Reset animation state
    setTimeout(() => setIsAnimating(false), 350)
  }, [disabled, isAnimating, isExpanded, onExpandedChange])

  const variants = animationVariants[animation]

  const defaultExpandIcon = expandIcon || (
    <ChevronDownIcon 
      className={cn(
        "h-5 w-5 transition-transform duration-200",
        isExpanded && "rotate-180"
      )} 
    />
  )

  const defaultCollapseIcon = collapseIcon || (
    <ChevronUpIcon className="h-5 w-5 transition-transform duration-200" />
  )

  return (
    <div className={cn(cardVariants[variant], className)} {...props}>
      {trigger && (
        <button
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between p-4 text-left",
            "hover:bg-muted/50 transition-colors rounded-t-lg",
            disabled && "opacity-50 cursor-not-allowed",
            variant === 'minimal' && "hover:bg-muted/20 rounded-lg"
          )}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse content' : 'Expand content'}
        >
          <div className="flex-1">{trigger}</div>
          <div className="flex-shrink-0 ml-2">
            {isExpanded ? (collapseIcon || defaultCollapseIcon) : defaultExpandIcon}
          </div>
        </button>
      )}

      <motion.div
        initial={isExpanded ? 'expanded' : 'collapsed'}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={variants}
        style={{ overflow: 'hidden' }}
      >
        <div className={cn(
          "px-4 pb-4",
          trigger && "pt-0",
          !trigger && "p-4"
        )}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// Specialized Product Card with Progressive Disclosure
interface ProductExpandableCardProps {
  title: string
  price?: string
  keyBenefit?: string
  image?: string
  specifications?: Array<{
    label: string
    value: string
    highlight?: boolean
  }>
  applications?: string[]
  benefits?: string[]
  technicalDetails?: string
  className?: string
  onLearnMore?: () => void
}

export function ProductExpandableCard({
  title,
  price,
  keyBenefit,
  image,
  specifications = [],
  applications = [],
  benefits = [],
  technicalDetails,
  className,
  onLearnMore,
}: ProductExpandableCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const triggerContent = (
    <div className="flex items-center gap-4">
      {image && (
        <motion.div 
          className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg text-foreground truncate">{title}</h3>
        {keyBenefit && (
          <p className="text-sm text-muted-foreground mt-1">{keyBenefit}</p>
        )}
        {price && (
          <p className="text-sm font-medium text-brand-primary mt-2">{price}</p>
        )}
      </div>
      {!isExpanded && (
        <motion.div 
          className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Ver especificações
        </motion.div>
      )}
    </div>
  )

  return (
    <ExpandableCard
      variant="product"
      animation="spring"
      trigger={triggerContent}
      className={cn("hover:border-brand-primary/30 transition-colors", className)}
      onExpandedChange={setIsExpanded}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Technical Specifications */}
        {specifications.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
              Especificações Técnicas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specifications.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                  className={cn(
                    "flex justify-between items-center p-3 rounded-lg",
                    spec.highlight 
                      ? "bg-brand-primary/5 border border-brand-primary/20" 
                      : "bg-muted/30"
                  )}
                >
                  <span className="text-sm text-muted-foreground">{spec.label}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    spec.highlight ? "text-brand-primary" : "text-foreground"
                  )}>
                    {spec.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Applications */}
        {applications.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Aplicações
            </h4>
            <div className="flex flex-wrap gap-2">
              {applications.map((app, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                  className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200"
                >
                  {app}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {benefits.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Principais Benefícios
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Technical Details */}
        {technicalDetails && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {technicalDetails}
            </p>
          </div>
        )}

        {/* Action Button */}
        {onLearnMore && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="pt-4"
          >
            <button
              onClick={onLearnMore}
              className="w-full px-4 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm font-medium"
            >
              Ver página completa do produto
            </button>
          </motion.div>
        )}
      </motion.div>
    </ExpandableCard>
  )
}

export default ExpandableCard