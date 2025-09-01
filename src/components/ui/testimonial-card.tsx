'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import { Card } from './card'
import type { TestimonialCardProps } from '@/types/testimonials'
import { cn } from '@/lib/utils'

export function TestimonialCard({ 
  depoimento, 
  className 
}: TestimonialCardProps) {
  return (
    <Card 
      className={cn(
        'h-full flex flex-col justify-between p-6 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700',
        'hover:border-hiperliga-300 dark:hover:border-hiperliga-400 hover:shadow-lg transition-all duration-300',
        'transform hover:-translate-y-1',
        className
      )}
    >
      {/* Reviews stars */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                'h-4 w-4',
                i < Math.min(depoimento.reviews, 5)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              )}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({depoimento.reviews} {depoimento.reviews === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      {/* Testimonial text */}
      <blockquote className="flex-1 mb-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
          "{depoimento.depoimento}"
        </p>
      </blockquote>

      {/* Customer info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {depoimento.nome}
          </h4>
          <p className="text-sm text-hiperliga-600 dark:text-hiperliga-400 font-medium">
            {depoimento.localizacao}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hiperliga-50 dark:bg-hiperliga-900/20 text-hiperliga-700 dark:text-hiperliga-400">
            {depoimento.categoria}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default TestimonialCard