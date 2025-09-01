'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  GlobeAmericasIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types/product'
import { ProductUtils, formatArea } from '@/lib/produtos-utils'

interface ProductCardDetailedProps {
  product: Product
  className?: string
  showCalculator?: boolean
  showSustainability?: boolean
  priority?: boolean
}

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  }
}

export function ProductCardDetailed({ 
  product, 
  className = '',
  showCalculator = true,
  showSustainability = true,
  priority = false
}: ProductCardDetailedProps) {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
  const coverage = ProductUtils.calculateCoverage(product)
  const equivalence = ProductUtils.calculateEquivalence(product)
  const sustainability = ProductUtils.getSustainabilityScore(product)
  
  // Get category-specific icon
  const getCategoryIcon = () => {
    switch (product.category.slug) {
      case 'hiperliga':
        return <SparklesIcon className="h-5 w-5" />
      case 'tintas':
        return <span className="text-sm font-bold">🎨</span>
      case 'grafiato':
        return <span className="text-sm font-bold">🏗️</span>
      default:
        return <SparklesIcon className="h-5 w-5" />
    }
  }

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
              priority={priority}
            />
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-brand-primary border-brand-primary/20 backdrop-blur-sm">
              <span className="flex items-center gap-1.5">
                {getCategoryIcon()}
                {product.category.name}
              </span>
            </Badge>
          </div>
          
          {/* Sustainability Score */}
          {showSustainability && sustainability.score > 60 && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <GlobeAmericasIcon className="h-3 w-3 mr-1" />
                {sustainability.score}% Sustentável
              </Badge>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Product Name & Short Description */}
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Key Specifications */}
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {coverage > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rendimento:</span>
                  <span className="font-medium">{formatArea(coverage)}</span>
                </div>
              )}
              {equivalence > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Equivale a:</span>
                  <span className="font-medium">{equivalence}kg tradicional</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Embalagem:</span>
                <span className="font-medium">{product.packaging.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Validade:</span>
                <span className="font-medium">{product.packaging.shelfLife}</span>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm">Principais características:</h4>
            <ul className="space-y-2">
              {product.features.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sustainability Features */}
          {showSustainability && sustainability.features.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <GlobeAmericasIcon className="h-4 w-4 text-green-600" />
                Sustentabilidade:
              </h4>
              <div className="flex flex-wrap gap-1">
                {sustainability.features.slice(0, 3).map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href={`/produtos/${product.slug}`} className="flex-1">
              <Button className="w-full group/btn">
                Ver Detalhes
                <ArrowRightIcon className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            {showCalculator && (
              <Button variant="outline" size="sm" className="sm:w-auto" asChild>
                <Link href={`/produtos/${product.slug}#calculadora`}>
                  <CalculatorIcon className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ProductCardDetailed