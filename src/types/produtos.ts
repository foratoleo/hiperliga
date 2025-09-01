// Product-specific types extending the base types from index.ts
import { Product, ProductCategory, TechnicalSpec, SustainabilityInfo } from './index'

export interface ProductDatabase {
  products: Product[]
  categories: ProductCategory[]
  metadata: DatabaseMetadata
}

export interface DatabaseMetadata {
  extractedAt: string
  sourceUrl: string
  totalProducts: number
  version: string
}

// Extended product interfaces with additional fields specific to Hiperliga
export interface HiperligaProduct extends Product {
  equivalencia?: {
    traditional_weight: number
    hiperliga_weight: number
    description: string
  }
  surface_compatibility?: string[]
  application_time?: {
    touch_dry: string
    between_coats: string
    final_dry: string
  }
}

export interface ProductSpecification {
  nome: string
  descricao: string
  peso: string
  rendimento: string
  aplicacao: string[]
  beneficios: string[]
  modo_uso: string
  categoria: 'hiperliga' | 'tintas' | 'grafiato' | 'texturas'
  sustentabilidade: boolean
  composicao: string
  tempo_cura?: string
  validade: string
  armazenamento: string
}

// Utility types for filtering and searching
export type ProductCategoryType = 'hiperliga' | 'gran-finalle-tintas' | 'gran-finalle-grafiato'
export type ApplicationType = 'assentamento' | 'reboco' | 'reparos' | 'impermeabilizacao' | 'decorativo'
export type SurfaceType = 'concreto' | 'ceramica' | 'ferro' | 'aluminio' | 'vidro' | 'pedra' | 'madeira' | 'alvenaria'

// Search and filter interfaces
export interface ProductFilter {
  category?: ProductCategoryType
  application?: ApplicationType
  surface?: SurfaceType
  sustainable?: boolean
  minCoverage?: number
  maxCoverage?: number
  weight?: string
}

export interface ProductSearchOptions {
  query?: string
  filters?: ProductFilter
  sortBy?: 'name' | 'category' | 'coverage' | 'weight'
  sortOrder?: 'asc' | 'desc'
  limit?: number
}

// Company and brand information
export interface BrandInfo {
  name: string
  description: string
  founded: number
  location: {
    city: string
    state: string
    country: string
  }
  certifications: string[]
  sustainability_commitment: string
}

// Product comparison interface
export interface ProductComparison {
  products: Product[]
  comparisonFields: Array<{
    field: keyof Product
    label: string
    type: 'text' | 'number' | 'array' | 'boolean'
  }>
}

// Technical specifications extended
export interface ExtendedTechnicalSpec extends TechnicalSpec {
  category?: 'performance' | 'application' | 'sustainability' | 'storage'
  importance?: 'high' | 'medium' | 'low'
  displayOrder?: number
}

// Sustainability metrics
export interface SustainabilityMetrics extends SustainabilityInfo {
  water_savings?: number
  co2_reduction?: number
  waste_reduction?: number
  energy_savings?: number
  recyclability_score?: number
}