'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  ScaleIcon,
  XMarkIcon,
  CheckIcon,
  GlobeAmericasIcon,
  ArrowRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types/product'
import { ProductUtils, formatArea } from '@/lib/produtos-utils'

interface ProductComparisonProps {
  products: Product[]
  onRemoveProduct?: (productId: string) => void
  onAddProduct?: () => void
  maxProducts?: number
  className?: string
}

const tableAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  }
}

const rowAnimation = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const
    }
  })
}

export function ProductComparison({ 
  products, 
  onRemoveProduct,
  onAddProduct,
  maxProducts = 3,
  className = ''
}: ProductComparisonProps) {
  if (products.length === 0) {
    return (
      <motion.div
        className={`text-center py-12 ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={tableAnimation}
      >
        <ScaleIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Nenhum produto selecionado</h3>
        <p className="text-muted-foreground mb-4">
          Adicione produtos para comparar suas especificações
        </p>
        {onAddProduct && (
          <Button onClick={onAddProduct}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Button>
        )}
      </motion.div>
    )
  }

  // Get comparison data for each product
  const comparisonData = products.map(product => {
    const coverage = ProductUtils.calculateCoverage(product)
    const equivalence = ProductUtils.calculateEquivalence(product)
    const sustainability = ProductUtils.getSustainabilityScore(product)
    
    return {
      product,
      coverage,
      equivalence,
      sustainability
    }
  })

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={tableAnimation}
    >
      <Card className="overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ScaleIcon className="h-5 w-5 text-brand-primary" />
              <h3 className="text-lg font-semibold">Comparação de Produtos</h3>
            </div>
            {onAddProduct && products.length < maxProducts && (
              <Button variant="outline" onClick={onAddProduct} size="sm">
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar ({products.length}/{maxProducts})
              </Button>
            )}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Product Headers */}
              <thead>
                <tr>
                  <th className="text-left py-4 px-2 font-medium text-sm text-muted-foreground min-w-[150px]">
                    Especificação
                  </th>
                  {comparisonData.map((data, index) => (
                    <th key={data.product.id} className="text-left py-4 px-4 min-w-[200px]">
                      <div className="relative">
                        {onRemoveProduct && (
                          <button
                            onClick={() => onRemoveProduct(data.product.id)}
                            className="absolute -top-2 -right-2 p-1 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
                            aria-label={`Remover ${data.product.name}`}
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        )}
                        <div className="text-base font-semibold mb-1">
                          {data.product.name}
                        </div>
                        <Badge className="text-xs">
                          {data.product.category.name}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border/50">
                {/* Basic Information */}
                <motion.tr
                  custom={0}
                  variants={rowAnimation}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-2 font-medium">Descrição</td>
                  {comparisonData.map((data) => (
                    <td key={data.product.id} className="py-4 px-4 text-sm">
                      {data.product.shortDescription}
                    </td>
                  ))}
                </motion.tr>

                {/* Coverage */}
                <motion.tr
                  custom={1}
                  variants={rowAnimation}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-2 font-medium">Rendimento</td>
                  {comparisonData.map((data) => (
                    <td key={data.product.id} className="py-4 px-4">
                      <div className="font-bold text-brand-primary">
                        {data.coverage > 0 ? formatArea(data.coverage) : 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        por {data.product.packaging.weight}
                      </div>
                    </td>
                  ))}
                </motion.tr>

                {/* Equivalence */}
                <motion.tr
                  custom={2}
                  variants={rowAnimation}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-2 font-medium">Equivalência</td>
                  {comparisonData.map((data) => (
                    <td key={data.product.id} className="py-4 px-4">
                      {data.equivalence > 0 ? (
                        <div>
                          <div className="font-bold text-green-600">
                            {data.equivalence}kg
                          </div>
                          <div className="text-xs text-muted-foreground">
                            argamassa tradicional
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </td>
                  ))}
                </motion.tr>

                {/* Applications */}
                <motion.tr
                  custom={3}
                  variants={rowAnimation}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-2 font-medium">Aplicações</td>
                  {comparisonData.map((data) => (
                    <td key={data.product.id} className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {data.product.applications.slice(0, 2).map((app, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                        {data.product.applications.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{data.product.applications.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                  ))}
                </motion.tr>
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>💡 Dica:</strong> Compare características técnicas para escolher o produto ideal para seu projeto.
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <a href="/contato">
                    Solicitar Consultoria
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ProductComparison