export interface Company {
  legalName: string
  tradeName: string
  foundedYear: number
  experienceYears: number
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    fullAddress: string
  }
  contact: {
    whatsapp: string
    website: string
    socialMedia: {
      facebook: string
      instagram: string
      whatsapp: string
    }
  }
  experienceAreas: {
    id: string
    name: string
    description: string
  }[]
  history: {
    foundation: string
    development: string
    currentStatus: string
  }
  milestones: {
    year?: number
    description: string
    metric?: {
      value: string
      unit: string
      description: string
    }
  }[]
  mainProducts: {
    name: string
    description: string
    benefits: string[]
    keyFeatures: string[]
  }[]
  values: {
    mission: string
    values: string[]
    differentials: string[]
  }
  achievements: {
    totalArea: string
    yearsExperience: string
    technicalSupport: boolean
  }
}

export interface CompanyData {
  company: Company
  images: {
    id: string
    url: string
    category: string
    description: string
    alt: string
    filename: string
  }[]
  lastUpdated: string
  source: string
}