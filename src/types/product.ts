// Product type definitions

export interface TechnicalSpec {
  name: string
  value: string | number
  unit?: string
  description?: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  order?: number
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary?: boolean
}

export interface ProductPackaging {
  weight: string
  dimensions: string
  coverage: string
  shelfLife: string
  storage: string
}

export interface ProductSustainability {
  waterFree: boolean
  sandFree: boolean
  cementFree: boolean
  limeFree: boolean
  recycledContent: number
  carbonFootprintReduction: number
  certifications: string[]
}

export interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  features: string[]
  technicalSpecs: TechnicalSpec[]
  applications: string[]
  benefits: string[]
  images: ProductImage[]
  category: ProductCategory
  packaging: ProductPackaging
  sustainability: ProductSustainability
  slug: string
}

export interface ProductCatalogData {
  products: Product[]
  categories: ProductCategory[]
  metadata: {
    extractedAt: string
    sourceUrl: string
    totalProducts: number
    version: string
  }
}

// Filter and search types
export interface ProductFilters {
  category?: string
  search?: string
  sortBy?: 'name' | 'category' | 'coverage' | 'price'
  sustainability?: {
    waterFree?: boolean
    sandFree?: boolean
    cementFree?: boolean
    limeFree?: boolean
    minRecycledContent?: number
  }
}

// Calculator types
export interface YieldCalculation {
  quantity: number
  coverage: number
  remainder: number
  units: string
}

export interface SavingsCalculation {
  waterSavings: number
  costSavings: number
  timeSavings: number
  materialReduction: number
}

export interface ApplicationTimeEstimate {
  estimatedHours: number
  estimatedDays: number
  comparisonTraditional: number
}

export interface SustainabilityScore {
  score: number
  features: string[]
  description: string
}