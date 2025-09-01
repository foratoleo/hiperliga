'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product, TechnicalSpec } from '@/types/product'
import { ProductUtils } from '@/lib/produtos-utils'

interface TechnicalSpecsTableProps {
  product: Product
  className?: string
  showSustainability?: boolean
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

export function TechnicalSpecsTable({ 
  product, 
  className = '',
  showSustainability = true
}: TechnicalSpecsTableProps) {
  const sustainability = ProductUtils.getSustainabilityScore(product)
  
  // Format specification value for display
  const formatSpecValue = (spec: TechnicalSpec): string => {
    if (spec.unit) {
      return `${spec.value}${spec.unit}`
    }
    return spec.value.toString()
  }

  return (
    <motion.div
      variants={tableAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <InformationCircleIcon className="h-5 w-5 text-brand-primary" />
            <h3 className="text-lg font-semibold">Especificações Técnicas</h3>
          </div>

          {/* Technical Specifications Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-medium text-muted-foreground text-sm">
                    Especificação
                  </th>
                  <th className="text-left py-3 font-medium text-muted-foreground text-sm">
                    Valor
                  </th>
                  <th className="text-left py-3 font-medium text-muted-foreground text-sm">
                    Detalhes
                  </th>
                </tr>
              </thead>
              <tbody>
                {product.technicalSpecs.map((spec, index) => (
                  <motion.tr
                    key={index}
                    custom={index}
                    variants={rowAnimation}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 font-medium">
                      {spec.name}
                    </td>
                    <td className="py-4">
                      <Badge variant="outline" className="font-mono">
                        {formatSpecValue(spec)}
                      </Badge>
                    </td>
                    <td className="py-4 text-muted-foreground text-sm">
                      {spec.description || '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Packaging Information */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              📦 Embalagem e Armazenamento
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Peso:</span>
                  <span className="font-medium">{product.packaging.weight}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Dimensões:</span>
                  <span className="font-medium">{product.packaging.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cobertura:</span>
                  <span className="font-medium">{product.packaging.coverage}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Validade:</span>
                  <span className="font-medium">{product.packaging.shelfLife}</span>
                </div>
                <div className="text-muted-foreground text-xs mt-2">
                  <strong>Armazenamento:</strong> {product.packaging.storage}
                </div>
              </div>
            </div>
          </div>

          {/* Sustainability Information */}
          {showSustainability && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
                <CheckCircleIcon className="h-5 w-5" />
                Sustentabilidade - {sustainability.description}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Sustainability Features */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {sustainability.features.map((feature, idx) => (
                      <Badge key={idx} className="bg-green-100 text-green-800 border-green-300 text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Sustainability Score */}
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                    <span className="text-sm text-green-700">Pontuação:</span>
                    <span className="text-lg font-bold text-green-800">{sustainability.score}/100</span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              {product.sustainability.certifications.length > 0 && (
                <div className="pt-3 border-t border-green-200">
                  <span className="text-sm text-green-700 font-medium">Certificações: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.sustainability.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white text-green-700 border-green-300 text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Applications */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-3 text-blue-800">
              🔧 Aplicações Recomendadas
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {product.applications.map((application, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                  {application}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TechnicalSpecsTable