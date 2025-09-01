'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Card } from './card'

interface TimelineItem {
  year?: number
  title: string
  description: string
  metric?: {
    value: string
    unit: string
    description: string
  }
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
}

export function Timeline({ items, className = '' }: TimelineProps) {
  return (
    <motion.div
      className={`relative max-w-4xl mx-auto ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerChildren}
    >
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-primary/20 hidden md:block" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="relative flex items-start gap-6"
            variants={scaleIn}
          >
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {item.year ? item.year : <CheckCircleIcon className="h-8 w-8" />}
            </div>
            
            <Card className="flex-1 p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-brand-primary">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                
                {item.metric && (
                  <div className="mt-4 p-4 bg-brand-primary/5 rounded-lg border-l-4 border-brand-primary">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-brand-primary">
                        {item.metric.value.includes('000') 
                          ? `${parseFloat(item.metric.value) / 1000000}M` 
                          : item.metric.value}
                      </span>
                      <span className="text-sm font-medium text-brand-secondary">
                        {item.metric.unit}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.metric.description}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}