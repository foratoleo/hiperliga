import { Product, ProductCategory, TechnicalSpec } from '@/types'
import { 
  ProductDatabase, 
  ProductFilter, 
  ProductSearchOptions, 
  ProductCategoryType,
  ApplicationType,
  SurfaceType,
  ProductSpecification 
} from '@/types/produtos'

// Import the static data
import produtosData from '@/../../data/produtos-especificacoes.json'

/**
 * Get all products from the database
 */
export function getAllProducts(): Product[] {
  return (produtosData as ProductDatabase).products
}

/**
 * Get all product categories
 */
export function getAllCategories(): ProductCategory[] {
  return (produtosData as ProductDatabase).categories
}

/**
 * Get a single product by ID
 */
export function getProductById(id: string): Product | null {
  const products = getAllProducts()
  return products.find(product => product.id === id) || null
}

/**
 * Get a single product by slug
 */
export function getProductBySlug(slug: string): Product | null {
  const products = getAllProducts()
  return products.find(product => product.slug === slug) || null
}

/**
 * Get products by category
 */
export function getProductsByCategory(categoryId: string): Product[] {
  const products = getAllProducts()
  return products.filter(product => product.category.id === categoryId)
}

/**
 * Search and filter products
 */
export function searchProducts(options: ProductSearchOptions = {}): Product[] {
  let products = getAllProducts()
  
  // Apply filters
  if (options.filters) {
    products = filterProducts(products, options.filters)
  }
  
  // Apply text search
  if (options.query) {
    const query = options.query.toLowerCase()
    products = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.features.some(feature => feature.toLowerCase().includes(query)) ||
      product.benefits.some(benefit => benefit.toLowerCase().includes(query))
    )
  }
  
  // Apply sorting
  if (options.sortBy) {
    products = sortProducts(products, options.sortBy, options.sortOrder || 'asc')
  }
  
  // Apply limit
  if (options.limit) {
    products = products.slice(0, options.limit)
  }
  
  return products
}

/**
 * Filter products by specific criteria
 */
export function filterProducts(products: Product[], filters: ProductFilter): Product[] {
  return products.filter(product => {
    // Category filter
    if (filters.category && product.category.id !== filters.category) {
      return false
    }
    
    // Application filter
    if (filters.application) {
      const hasApplication = product.applications.some(app => 
        app.toLowerCase().includes(filters.application!)
      )
      if (!hasApplication) return false
    }
    
    // Surface compatibility filter
    if (filters.surface) {
      const hasSurface = product.applications.some(app => 
        app.toLowerCase().includes(filters.surface!)
      )
      if (!hasSurface) return false
    }
    
    // Sustainability filter
    if (filters.sustainable !== undefined) {
      if (product.sustainability?.waterFree !== filters.sustainable) {
        return false
      }
    }
    
    // Coverage filters
    if (filters.minCoverage || filters.maxCoverage) {
      const coverageSpec = product.technicalSpecs.find(spec => 
        spec.name.toLowerCase().includes('rendimento')
      )
      if (coverageSpec) {
        const coverage = parseFloat(coverageSpec.value.toString())
        if (filters.minCoverage && coverage < filters.minCoverage) return false
        if (filters.maxCoverage && coverage > filters.maxCoverage) return false
      }
    }
    
    // Weight filter
    if (filters.weight && product.packaging?.weight !== filters.weight) {
      return false
    }
    
    return true
  })
}

/**
 * Sort products by specified field
 */
export function sortProducts(
  products: Product[], 
  sortBy: 'name' | 'category' | 'coverage' | 'weight',
  sortOrder: 'asc' | 'desc' = 'asc'
): Product[] {
  return [...products].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'category':
        comparison = a.category.name.localeCompare(b.category.name)
        break
      case 'coverage':
        const aCoverage = getCoverageValue(a)
        const bCoverage = getCoverageValue(b)
        comparison = aCoverage - bCoverage
        break
      case 'weight':
        const aWeight = getWeightValue(a.packaging?.weight)
        const bWeight = getWeightValue(b.packaging?.weight)
        comparison = aWeight - bWeight
        break
    }
    
    return sortOrder === 'desc' ? -comparison : comparison
  })
}

/**
 * Get featured products (first 3 products for now)
 */
export function getFeaturedProducts(limit: number = 3): Product[] {
  const products = getAllProducts()
  return products.slice(0, limit)
}

/**
 * Get products by sustainability criteria
 */
export function getSustainableProducts(): Product[] {
  const products = getAllProducts()
  return products.filter(product => 
    product.sustainability?.waterFree || 
    product.sustainability?.carbonFootprintReduction
  )
}

/**
 * Get related products based on category or applications
 */
export function getRelatedProducts(product: Product, limit: number = 3): Product[] {
  const allProducts = getAllProducts()
  
  // Filter out the current product and find related ones
  const related = allProducts
    .filter(p => p.id !== product.id)
    .filter(p => 
      p.category.id === product.category.id || 
      p.applications.some(app => product.applications.includes(app))
    )
    .slice(0, limit)
    
  return related
}

/**
 * Get product technical specifications by category
 */
export function getTechnicalSpecsByCategory(product: Product): Record<string, TechnicalSpec[]> {
  const specs = product.technicalSpecs
  const categorized: Record<string, TechnicalSpec[]> = {
    performance: [],
    application: [],
    sustainability: [],
    storage: []
  }
  
  specs.forEach(spec => {
    const specName = spec.name.toLowerCase()
    if (specName.includes('rendimento') || specName.includes('equivalência') || specName.includes('secagem')) {
      categorized.performance.push(spec)
    } else if (specName.includes('aplicação') || specName.includes('tempo')) {
      categorized.application.push(spec)
    } else if (specName.includes('sustenta') || specName.includes('água') || specName.includes('co2')) {
      categorized.sustainability.push(spec)
    } else {
      categorized.storage.push(spec)
    }
  })
  
  return categorized
}

/**
 * Convert Product to ProductSpecification format
 */
export function productToSpecification(product: Product): ProductSpecification {
  return {
    nome: product.name,
    descricao: product.description,
    peso: product.packaging?.weight || '',
    rendimento: product.packaging?.coverage || '',
    aplicacao: product.applications,
    beneficios: product.benefits,
    modo_uso: getUsageInstructions(product),
    categoria: mapCategoryToType(product.category.id),
    sustentabilidade: product.sustainability?.waterFree || false,
    composicao: getComposition(product),
    tempo_cura: getCureTime(product),
    validade: product.packaging?.shelfLife || '',
    armazenamento: product.packaging?.storage || ''
  }
}

/**
 * Get database metadata
 */
export function getDatabaseMetadata() {
  return (produtosData as ProductDatabase).metadata
}

// Helper functions

/**
 * Extract coverage value from technical specs
 */
function getCoverageValue(product: Product): number {
  const coverageSpec = product.technicalSpecs.find(spec => 
    spec.name.toLowerCase().includes('rendimento')
  )
  return coverageSpec ? parseFloat(coverageSpec.value.toString()) : 0
}

/**
 * Extract weight value from packaging weight string
 */
function getWeightValue(weight?: string): number {
  if (!weight) return 0
  const match = weight.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0
}

/**
 * Get usage instructions from technical specs
 */
function getUsageInstructions(product: Product): string {
  const usageSpec = product.technicalSpecs.find(spec => 
    spec.name.toLowerCase().includes('aplicação') || 
    spec.description?.toLowerCase().includes('aplicar')
  )
  return usageSpec?.description || 'Consulte as instruções na embalagem'
}

/**
 * Map category ID to ProductSpecification category type
 */
function mapCategoryToType(categoryId: string): ProductSpecification['categoria'] {
  switch (categoryId) {
    case 'hiperliga': return 'hiperliga'
    case 'gran-finalle-tintas': return 'tintas'
    case 'gran-finalle-grafiato': return 'grafiato'
    default: return 'texturas'
  }
}

/**
 * Get composition from technical specs
 */
function getComposition(product: Product): string {
  const compositionSpec = product.technicalSpecs.find(spec => 
    spec.name.toLowerCase().includes('composição')
  )
  return compositionSpec?.value.toString() || compositionSpec?.description || ''
}

/**
 * Get cure time from technical specs
 */
function getCureTime(product: Product): string {
  const cureSpec = product.technicalSpecs.find(spec => 
    spec.name.toLowerCase().includes('cura')
  )
  return cureSpec ? `${cureSpec.value} ${cureSpec.unit}` : ''
}

/**
 * Statistics and analytics functions
 */
export function getProductStats() {
  const products = getAllProducts()
  const categories = getAllCategories()
  
  return {
    totalProducts: products.length,
    totalCategories: categories.length,
    sustainableProducts: getSustainableProducts().length,
    productsByCategory: categories.map(cat => ({
      category: cat.name,
      count: getProductsByCategory(cat.id).length
    }))
  }
}