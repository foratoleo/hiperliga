'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  CalculatorIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  GlobeAmericasIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types/product'
import { ProductUtils, formatArea, formatCurrency, formatNumber, formatTime } from '@/lib/produtos-utils'

interface YieldCalculatorProps {
  product: Product
  className?: string
}

const calculatorAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  }
}

const resultAnimation = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }
  }
}

export function YieldCalculator({ product, className = '' }: YieldCalculatorProps) {
  const [area, setArea] = React.useState<string>('')
  const [results, setResults] = React.useState<any>(null)
  const [showResults, setShowResults] = React.useState(false)

  // Calculate results when area changes
  const calculateResults = React.useCallback(() => {
    const targetArea = parseFloat(area)
    
    if (!targetArea || targetArea <= 0) {
      setResults(null)
      setShowResults(false)
      return
    }

    // Get required quantity
    const yieldData = ProductUtils.getRequiredQuantity(product, targetArea)
    
    // Calculate savings (only for Hiperliga products)
    const savings = product.category.slug === 'hiperliga' 
      ? ProductUtils.calculateSavings(targetArea, 'hiperliga')
      : null

    // Calculate application time
    const timeEstimate = ProductUtils.calculateApplicationTime(product, targetArea)

    setResults({
      area: targetArea,
      yield: yieldData,
      savings,
      time: timeEstimate
    })
    setShowResults(true)
  }, [area, product])

  // Handle input change
  const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setArea(value)
    }
  }

  // Handle calculate button click
  const handleCalculate = () => {
    calculateResults()
  }

  // Handle clear
  const handleClear = () => {
    setArea('')
    setResults(null)
    setShowResults(false)
  }

  return (
    <motion.div
      variants={calculatorAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      <Card className="overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <CalculatorIcon className="h-5 w-5 text-brand-primary" />
            <h3 className="text-lg font-semibold">Calculadora de Rendimento</h3>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <label htmlFor="area-input" className="block text-sm font-medium mb-2">
              Área a ser aplicada (m²):
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  id="area-input"
                  type="text"
                  value={area}
                  onChange={handleAreaChange}
                  placeholder="Ex: 50"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                />
              </div>
              <Button 
                onClick={handleCalculate}
                disabled={!area || parseFloat(area) <= 0}
                className="whitespace-nowrap"
              >
                Calcular
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {showResults && results && (
            <motion.div
              variants={resultAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Quantity Required */}
              <div className="p-4 bg-brand-primary/5 rounded-lg border border-brand-primary/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-brand-primary">
                  <CheckCircleIcon className="h-5 w-5" />
                  Quantidade Necessária
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantidade:</span>
                    <div className="font-bold text-lg text-brand-primary">
                      {results.yield.quantity} {results.yield.units}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cobertura total:</span>
                    <div className="font-medium">
                      {formatArea(results.yield.coverage)}
                    </div>
                  </div>
                  {results.yield.remainder > 0 && (
                    <div>
                      <span className="text-muted-foreground">Sobra:</span>
                      <div className="font-medium text-green-600">
                        +{formatArea(results.yield.remainder)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Estimate */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
                  <ClockIcon className="h-5 w-5" />
                  Tempo de Aplicação
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tempo estimado:</span>
                    <div className="font-bold text-blue-800">
                      {formatTime(results.time.estimatedHours)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ({results.time.estimatedDays} dia{results.time.estimatedDays > 1 ? 's' : ''} de trabalho)
                    </div>
                  </div>
                  {product.category.slug === 'hiperliga' && (
                    <div>
                      <span className="text-muted-foreground">Método tradicional:</span>
                      <div className="font-medium text-muted-foreground">
                        {formatTime(results.time.comparisonTraditional)}
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                        3x mais rápido
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Savings (Hiperliga only) */}
              {results.savings && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
                    <GlobeAmericasIcon className="h-5 w-5" />
                    Economia & Sustentabilidade
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Economia de custo:</span>
                      <div className="font-bold text-green-700 text-lg">
                        {formatCurrency(results.savings.costSavings)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Economia de água:</span>
                      <div className="font-bold text-blue-600">
                        {formatNumber(results.savings.waterSavings)}L
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tempo poupado:</span>
                      <div className="font-bold text-purple-600">
                        {formatTime(results.savings.timeSavings)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Menos transporte:</span>
                      <div className="font-bold text-orange-600">
                        {(results.savings.materialReduction).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button variant="outline" onClick={handleClear} className="flex-1">
                  Nova Calculação
                </Button>
                <Button className="flex-1" asChild>
                  <a href="/contato">
                    Solicitar Orçamento
                    <CurrencyDollarIcon className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Help Text */}
          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>💡 Dica:</strong> Os cálculos são estimativas baseadas nas especificações técnicas. 
              Para projetos específicos, consulte nossa equipe técnica para uma avaliação personalizada.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default YieldCalculator