// Base types
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Navigation types
export interface NavigationItem {
  name: string
  href: string
  description?: string
  children?: NavigationItem[]
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter?: string
    github?: string
    instagram?: string
    facebook?: string
    linkedin?: string
    youtube?: string
  }
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  shortDescription?: string
  features: string[]
  technicalSpecs: TechnicalSpec[]
  applications: string[]
  benefits: string[]
  images: ProductImage[]
  videos?: ProductVideo[]
  category: ProductCategory
  packaging?: PackagingInfo
  sustainability?: SustainabilityInfo
  slug: string
}

export interface TechnicalSpec {
  name: string
  value: string
  unit?: string
  description?: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  caption?: string
  isPrimary?: boolean
}

export interface ProductVideo {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl: string
  duration?: number
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string
}

export interface PackagingInfo {
  weight: string
  dimensions?: string
  coverage: string
  shelfLife: string
  storage: string
}

export interface SustainabilityInfo {
  waterFree: boolean
  sandFree: boolean
  cementFree: boolean
  limeFree: boolean
  recycledContent?: number
  carbonFootprintReduction?: number
  certifications?: string[]
}

// Company types
export interface Company {
  name: string
  description: string
  foundedYear: number
  mission: string
  vision: string
  values: string[]
  certifications: string[]
  milestones: Milestone[]
  contact: ContactInfo
}

export interface Milestone {
  year: number
  title: string
  description: string
}

export interface ContactInfo {
  address: Address
  phones: Phone[]
  emails: string[]
  businessHours: BusinessHours
  socialMedia: SocialMediaLinks
}

export interface Address {
  street: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Phone {
  number: string
  type: 'mobile' | 'landline' | 'whatsapp'
  isPrimary?: boolean
}

export interface BusinessHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday?: string
  sunday?: string
}

export interface SocialMediaLinks {
  instagram?: string
  facebook?: string
  youtube?: string
  linkedin?: string
  twitter?: string
}

// FAQ types
export interface FAQ {
  id: string
  question: string
  answer: string
  category: FAQCategory
  order: number
  isPopular?: boolean
}

export interface FAQCategory {
  id: string
  name: string
  slug: string
  order: number
}

// Form types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  city?: string
  state?: string
  subject?: string
  message: string
}

export interface NewsletterFormData {
  email: string
  name?: string
  interests?: string[]
}

// SEO types
export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// API Response types
export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

// Animation types
export interface AnimationConfig {
  duration?: number
  delay?: number
  easing?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: Date
}

// Re-export testimonial types
export * from './testimonials'