'use client'

import * as React from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({ 
  value, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className = '' 
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  
  const spring = useSpring(0, { 
    stiffness: 100, 
    damping: 30,
    duration: duration 
  })
  
  const display = useTransform(spring, (current) => 
    Math.floor(current).toLocaleString('pt-BR')
  )

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

interface StatisticCardProps {
  value: number
  label: string
  suffix?: string
  prefix?: string
  description?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  index?: number
  className?: string
}

export function StatisticCard({
  value,
  label,
  suffix = '',
  prefix = '',
  description,
  icon: Icon,
  index = 0,
  className = ''
}: StatisticCardProps) {
  return (
    <motion.div
      className={`text-center p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {Icon && (
        <div className="mb-4 flex justify-center">
          <div className="p-3 rounded-full bg-brand-primary/10">
            <Icon className="h-8 w-8 text-brand-primary" />
          </div>
        </div>
      )}
      
      <div className="mb-2">
        <AnimatedCounter
          value={value}
          suffix={suffix}
          prefix={prefix}
          className="text-3xl md:text-4xl font-bold text-brand-primary"
        />
      </div>
      
      <h4 className="text-lg font-semibold mb-2">{label}</h4>
      
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  )
}