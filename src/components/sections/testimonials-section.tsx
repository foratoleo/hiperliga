'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, UsersIcon, StarIcon } from '@heroicons/react/24/outline'
import { Container } from '@/components/layout'
import { TestimonialCard } from '@/components/ui/testimonial-card'
import { Button } from '@/components/ui/button'
import type { TestimonialsSectionProps } from '@/types/testimonials'
import { cn } from '@/lib/utils'

export function TestimonialsSection({
  data,
  showStats = true,
  autoPlay = true,
  autoPlayInterval = 5000,
  className
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  const { estatisticas, depoimentos } = data
  // Responsive items to show: 1 on mobile, 2 on tablet, 3 on desktop
  const getItemsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1 // mobile
      if (window.innerWidth < 1024) return 2 // tablet
    }
    return 3 // desktop
  }
  
  const [itemsToShow, setItemsToShow] = useState(getItemsToShow)
  const maxIndex = Math.max(0, depoimentos.length - itemsToShow)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newItemsToShow = getItemsToShow()
      setItemsToShow(newItemsToShow)
      setCurrentIndex(0) // Reset to first slide on resize
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isAutoPlaying, maxIndex, autoPlayInterval])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(autoPlay)

  return (
    <section className={cn('py-16 bg-gray-50 dark:bg-gray-900', className)}>
      <Container>
        {/* Statistics Section */}
        {showStats && (
          <div className="text-center mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-hiperliga-100 dark:bg-hiperliga-900/20 rounded-full flex items-center justify-center mb-4">
                  <UsersIcon className="h-8 w-8 text-hiperliga-600 dark:text-hiperliga-400" />
                </div>
                <div className="text-3xl font-bold text-hiperliga-600 dark:text-hiperliga-400 mb-2">
                  {estatisticas.anosDeMercado}+
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-center">
                  Anos de experiência no mercado
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-hiperliga-100 dark:bg-hiperliga-900/20 rounded-full flex items-center justify-center mb-4">
                  <StarIcon className="h-8 w-8 text-hiperliga-600 dark:text-hiperliga-400" />
                </div>
                <div className="text-3xl font-bold text-hiperliga-600 dark:text-hiperliga-400 mb-2">
                  {estatisticas.metrosQuadradosAplicados}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-center">
                  Metros quadrados aplicados
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-hiperliga-100 dark:bg-hiperliga-900/20 rounded-full flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-hiperliga-600 dark:bg-hiperliga-400 rounded-full flex items-center justify-center">
                    <span className="text-white dark:text-gray-900 font-bold text-xs">✓</span>
                  </div>
                </div>
                <div className="text-lg font-semibold text-hiperliga-600 dark:text-hiperliga-400 mb-2">
                  Qualidade
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-center">
                  {estatisticas.diferencial}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            O que dizem nossos clientes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Depoimentos reais de profissionais e consumidores que confiam na qualidade da Hiperliga
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="p-2 hover:bg-hiperliga-50 dark:hover:bg-hiperliga-900/20"
              disabled={depoimentos.length <= itemsToShow}
            >
              <ChevronLeftIcon className="h-6 w-6" />
              <span className="sr-only">Anterior</span>
            </Button>

            <div className="flex space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    index === currentIndex
                      ? 'bg-hiperliga-600 dark:bg-hiperliga-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  )}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="p-2 hover:bg-hiperliga-50 dark:hover:bg-hiperliga-900/20"
              disabled={depoimentos.length <= itemsToShow}
            >
              <ChevronRightIcon className="h-6 w-6" />
              <span className="sr-only">Próximo</span>
            </Button>
          </div>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
                width: `${Math.ceil(depoimentos.length / itemsToShow) * 100}%`
              }}
            >
              {depoimentos.map((depoimento, index) => (
                <div
                  key={`${depoimento.nome}-${index}`}
                  className="flex-shrink-0"
                  style={{ width: `${100 / Math.ceil(depoimentos.length / itemsToShow)}%` }}
                >
                  <TestimonialCard depoimento={depoimento} />
                </div>
              ))}
            </div>
          </div>

          {/* Auto-play indicator */}
          {autoPlay && (
            <div className="flex items-center justify-center mt-6">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isAutoPlaying ? '⏸️ Passe o mouse para pausar' : '▶️ Reprodução automática pausada'}
              </span>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export default TestimonialsSection