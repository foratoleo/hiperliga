import type { Product, ProductCategory, TechnicalSpec } from '@/types/product'

// Product utilities and helper functions
export class ProductUtils {
  /**
   * Calculate coverage area based on product and quantity
   */
  static calculateCoverage(product: Product, quantity: number = 1): number {
    const coverageSpec = product.technicalSpecs.find(
      spec => spec.name.toLowerCase().includes('rendimento')
    )
    
    if (coverageSpec) {
      const coverage = parseFloat(coverageSpec.value.toString())
      return coverage * quantity
    }
    
    // Fallback based on packaging info
    if (product.packaging.coverage) {
      const match = product.packaging.coverage.match(/(\d+(\.\d+)?)/g)
      if (match) {
        const coverage = parseFloat(match[0])
        return coverage * quantity
      }
    }
    
    return 0
  }

  /**
   * Calculate equivalent traditional material weight
   */
  static calculateEquivalence(product: Product, quantity: number = 1): number {
    const equivalenceSpec = product.technicalSpecs.find(
      spec => spec.name.toLowerCase().includes('equivalência')
    )
    
    if (equivalenceSpec) {
      const equivalence = parseFloat(equivalenceSpec.value.toString())
      return equivalence * quantity
    }
    
    return 0
  }

  /**
   * Calculate cost savings based on traditional vs Hiperliga materials
   */
  static calculateSavings(
    area: number, 
    productType: 'hiperliga' | 'traditional' = 'hiperliga'
  ): {
    waterSavings: number
    costSavings: number
    timeSavings: number
    materialReduction: number
  } {
    // Based on real Hiperliga data
    const hiperligaCostPerM2 = 12.50 // Approximate cost per m²
    const traditionalCostPerM2 = 18.00 // Traditional argamassa cost per m²
    
    const waterSavingsLitersPerM2 = 25 // Liters saved per m² (21x reduction)
    const timeSavingsHoursPerM2 = 0.5 // Hours saved per m² (3x faster)
    
    return {
      waterSavings: area * waterSavingsLitersPerM2,
      costSavings: area * (traditionalCostPerM2 - hiperligaCostPerM2),
      timeSavings: area * timeSavingsHoursPerM2,
      materialReduction: area * 0.85 // 85% less material transport
    }
  }

  /**
   * Get required quantity for a given area
   */
  static getRequiredQuantity(product: Product, targetArea: number): {
    quantity: number
    coverage: number
    remainder: number
    units: string
  } {
    const coveragePerUnit = this.calculateCoverage(product, 1)
    
    if (coveragePerUnit === 0) {
      return {
        quantity: 0,
        coverage: 0,
        remainder: targetArea,
        units: product.packaging.weight
      }
    }
    
    const quantity = Math.ceil(targetArea / coveragePerUnit)
    const totalCoverage = quantity * coveragePerUnit
    const remainder = totalCoverage - targetArea
    
    return {
      quantity,
      coverage: totalCoverage,
      remainder,
      units: product.packaging.weight
    }
  }

  /**
   * Filter products by category
   */
  static filterByCategory(products: Product[], categorySlug: string): Product[] {
    if (categorySlug === 'todos' || !categorySlug) {
      return products
    }
    
    return products.filter(product => 
      product.category.slug === categorySlug
    )
  }

  /**
   * Search products by query
   */
  static searchProducts(products: Product[], query: string): Product[] {
    if (!query.trim()) {
      return products
    }
    
    const searchTerm = query.toLowerCase().trim()
    
    return products.filter(product => {
      // Search in name and description
      const matchesName = product.name.toLowerCase().includes(searchTerm)
      const matchesDescription = product.description.toLowerCase().includes(searchTerm)
      const matchesShortDescription = product.shortDescription.toLowerCase().includes(searchTerm)
      
      // Search in features
      const matchesFeatures = product.features.some(feature => 
        feature.toLowerCase().includes(searchTerm)
      )
      
      // Search in applications
      const matchesApplications = product.applications.some(application => 
        application.toLowerCase().includes(searchTerm)
      )
      
      // Search in category
      const matchesCategory = product.category.name.toLowerCase().includes(searchTerm)
      
      return matchesName || matchesDescription || matchesShortDescription || 
             matchesFeatures || matchesApplications || matchesCategory
    })
  }

  /**
   * Sort products by different criteria
   */
  static sortProducts(
    products: Product[], 
    sortBy: 'name' | 'category' | 'coverage' | 'price'
  ): Product[] {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'pt-BR')
          
        case 'category':
          return a.category.name.localeCompare(b.category.name, 'pt-BR')
          
        case 'coverage':
          const coverageA = this.calculateCoverage(a)
          const coverageB = this.calculateCoverage(b)
          return coverageB - coverageA // Descending order
          
        case 'price':
          // Since we don't have price data, sort by coverage as proxy
          const priceProxyA = this.calculateCoverage(a)
          const priceProxyB = this.calculateCoverage(b)
          return priceProxyA - priceProxyB // Ascending order
          
        default:
          return 0
      }
    })
  }

  /**
   * Get related products by category or features
   */
  static getRelatedProducts(
    currentProduct: Product, 
    allProducts: Product[], 
    limit: number = 3
  ): Product[] {
    // Filter out current product
    const otherProducts = allProducts.filter(p => p.id !== currentProduct.id)
    
    // First, get products from same category
    const sameCategory = otherProducts.filter(p => 
      p.category.id === currentProduct.category.id
    )
    
    // If not enough from same category, get from other categories
    let related = sameCategory.slice(0, limit)
    
    if (related.length < limit) {
      const remaining = limit - related.length
      const otherCategories = otherProducts
        .filter(p => p.category.id !== currentProduct.category.id)
        .slice(0, remaining)
      
      related = [...related, ...otherCategories]
    }
    
    return related
  }

  /**
   * Get sustainability score based on product features
   */
  static getSustainabilityScore(product: Product): {
    score: number
    features: string[]
    description: string
  } {
    const sustainability = product.sustainability
    let score = 0
    const features: string[] = []
    
    if (sustainability.waterFree) {
      score += 25
      features.push('Livre de água')
    }
    
    if (sustainability.sandFree) {
      score += 20
      features.push('Livre de areia')
    }
    
    if (sustainability.cementFree) {
      score += 20
      features.push('Livre de cimento')
    }
    
    if (sustainability.limeFree) {
      score += 15
      features.push('Livre de cal')
    }
    
    if (sustainability.carbonFootprintReduction > 0) {
      score += sustainability.carbonFootprintReduction / 2
      features.push(`${sustainability.carbonFootprintReduction}% menos CO2`)
    }
    
    if (sustainability.recycledContent > 0) {
      score += sustainability.recycledContent / 2
      features.push(`${sustainability.recycledContent}% reciclado`)
    }
    
    // Cap at 100
    score = Math.min(100, Math.round(score))
    
    let description = ''
    if (score >= 80) description = 'Altamente sustentável'
    else if (score >= 60) description = 'Moderadamente sustentável'
    else if (score >= 40) description = 'Parcialmente sustentável'
    else description = 'Sustentabilidade básica'
    
    return { score, features, description }
  }

  /**
   * Format technical specifications for display
   */
  static formatTechnicalSpec(spec: TechnicalSpec): string {
    if (spec.unit) {
      return `${spec.value}${spec.unit}`
    }
    return spec.value.toString()
  }

  /**
   * Get product by slug
   */
  static getProductBySlug(products: Product[], slug: string): Product | undefined {
    return products.find(product => product.slug === slug)
  }

  /**
   * Generate product URL slug from name
   */
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove duplicate hyphens
      .trim()
  }

  /**
   * Calculate application time estimate
   */
  static calculateApplicationTime(
    product: Product, 
    area: number
  ): {
    estimatedHours: number
    estimatedDays: number
    comparisonTraditional: number
  } {
    // Base application rates (m² per hour)
    const baseRates: Record<string, number> = {
      hiperliga: 15, // m² per hour (3x faster)
      tintas: 25,
      grafiato: 12
    }
    
    let rate = 15 // Default rate
    
    if (product.category.slug === 'hiperliga') {
      rate = baseRates.hiperliga
    } else if (product.category.slug === 'tintas') {
      rate = baseRates.tintas
    } else if (product.category.slug === 'grafiato') {
      rate = baseRates.grafiato
    }
    
    const estimatedHours = Math.ceil(area / rate)
    const estimatedDays = Math.ceil(estimatedHours / 8) // 8-hour work days
    const comparisonTraditional = product.category.slug === 'hiperliga' ? estimatedHours * 3 : estimatedHours
    
    return {
      estimatedHours,
      estimatedDays,
      comparisonTraditional
    }
  }

  /**
   * Get unique categories from products
   */
  static getCategories(products: Product[]): ProductCategory[] {
    const categoriesMap = new Map<string, ProductCategory>()
    
    products.forEach(product => {
      if (!categoriesMap.has(product.category.id)) {
        categoriesMap.set(product.category.id, product.category)
      }
    })
    
    return Array.from(categoriesMap.values()).sort((a, b) => {
      // Use order if available, otherwise sort by name
      const orderA = (a as any).order || 999
      const orderB = (b as any).order || 999
      return orderA - orderB
    })
  }
}

// Utility functions for formatting
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatArea(value: number): string {
  return `${formatNumber(value)}m²`
}

export function formatWeight(value: number, unit: string = 'kg'): string {
  return `${formatNumber(value)}${unit}`
}

export function formatTime(hours: number): string {
  if (hours < 24) {
    return `${hours}h`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  
  if (remainingHours === 0) {
    return `${days} dia${days > 1 ? 's' : ''}`
  }
  
  return `${days} dia${days > 1 ? 's' : ''} e ${remainingHours}h`
}