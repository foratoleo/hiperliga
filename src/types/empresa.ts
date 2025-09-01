// TypeScript interfaces for company/corporate data

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
}

export interface ContactInfo {
  phone?: string;
  whatsapp: string;
  email?: string;
  website: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
}

export interface ExperienceArea {
  id: string;
  name: string;
  description: string;
}

export interface CompanyMilestone {
  year?: number;
  description: string;
  metric?: {
    value: string;
    unit: string;
    description: string;
  };
}

export interface ProductHighlight {
  name: string;
  description: string;
  benefits: string[];
  keyFeatures: string[];
}

export interface CompanyValues {
  mission?: string;
  vision?: string;
  values: string[];
  differentials: string[];
}

export interface CompanyInfo {
  legalName: string;
  tradeName: string;
  foundedYear?: number;
  experienceYears: number;
  address: Address;
  contact: ContactInfo;
  experienceAreas: ExperienceArea[];
  history: {
    foundation: string;
    development: string;
    currentStatus: string;
  };
  milestones: CompanyMilestone[];
  mainProducts: ProductHighlight[];
  values: CompanyValues;
  achievements: {
    totalArea: string;
    yearsExperience: string;
    technicalSupport: boolean;
  };
}

export interface ImageAsset {
  id: string;
  url: string;
  category: 'logo' | 'product' | 'company' | 'certificate' | 'other';
  description: string;
  alt: string;
  filename: string;
}

export interface CorporateDatabase {
  company: CompanyInfo;
  images: ImageAsset[];
  lastUpdated: string;
  source: string;
}