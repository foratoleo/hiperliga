'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Card } from './card'
import { LucideIcon } from 'lucide-react'

interface ValueCardProps {
  title: string
  description: string
  icon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>
  className?: string
  index?: number
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } }
}

export function ValueCard({ title, description, icon: Icon, className = '', index = 0 }: ValueCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        transition: { duration: 0.2, ease: "easeInOut" }
      }}
      className={className}
    >
      <Card className="p-6 text-center h-full group hover:shadow-lg transition-all duration-300 border-l-4 border-l-brand-primary">
        {Icon && (
          <div className="mb-4 flex justify-center">
            <div className="p-3 rounded-full bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors duration-300">
              <Icon className="h-8 w-8 text-brand-primary" />
            </div>
          </div>
        )}
        
        <h4 className="text-xl font-bold mb-3 text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
          {title}
        </h4>
        
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </Card>
    </motion.div>
  )
}