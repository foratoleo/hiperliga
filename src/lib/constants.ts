import type { SiteConfig, ContactInfo, NavigationItem } from '@/types'

// Site configuration
export const SITE_CONFIG: SiteConfig = {
  name: 'Hiperliga',
  description: 'Argamassa Polimérica Inovadora - 100% sustentável, 3x mais rápida, economia de até 35%',
  url: process.env.NODE_ENV === 'production' ? 'https://hiperliga.com.br' : 'http://localhost:3000',
  ogImage: '/images/og-image.jpg',
  links: {
    instagram: 'https://instagram.com/hiperliga',
    facebook: 'https://facebook.com/hiperliga',
    youtube: 'https://youtube.com/@hiperliga',
    linkedin: 'https://linkedin.com/company/granfinelle',
  },
}

// Company information
export const COMPANY_INFO = {
  name: 'Gran Finelle',
  productName: 'Hiperliga',
  foundedYear: 2008,
  yearsInMarket: new Date().getFullYear() - 2008,
  squareMetersBuilt: '3.000.000+',
}

// Contact information
export const CONTACT_INFO: ContactInfo = {
  address: {
    street: 'Rua Antônio Camargo, 122',
    neighborhood: 'Areias',
    city: 'Almirante Tamandaré',
    state: 'PR',
    zipCode: '83514-140',
    country: 'Brasil',
  },
  phones: [
    {
      number: '(41) 98522-0746',
      type: 'whatsapp',
      isPrimary: true,
    },
    {
      number: '(41) 99501-5557',
      type: 'mobile',
    },
  ],
  emails: ['contato@hiperliga.com.br', 'comercial@granfinelle.com.br'],
  businessHours: {
    monday: '07:30 - 17:30',
    tuesday: '07:30 - 17:30',
    wednesday: '07:30 - 17:30',
    thursday: '07:30 - 17:30',
    friday: '07:30 - 16:30',
    saturday: 'Fechado',
    sunday: 'Fechado',
  },
  socialMedia: SITE_CONFIG.links,
}

// Navigation menu
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    name: 'Início',
    href: '/',
  },
  {
    name: 'Produtos',
    href: '/produtos',
    children: [
      {
        name: 'Hiperliga',
        href: '/produtos/hiperliga',
        description: 'Argamassa Polimérica Inovadora',
      },
      {
        name: 'Texturas & Grafiatos',
        href: '/produtos/texturas',
        description: 'Revestimentos Texturizados Gran Finelle',
      },
      {
        name: 'Tintas',
        href: '/produtos/tintas',
        description: 'Linha de Tintas Imobiliárias',
      },
    ],
  },
  {
    name: 'Sobre Nós',
    href: '/sobre',
  },
  {
    name: 'FAQ',
    href: '/faq',
  },
  {
    name: 'Vídeos',
    href: '/videos',
  },
  {
    name: 'Contato',
    href: '/contato',
  },
]

// Product benefits and features
export const HIPERLIGA_BENEFITS = [
  {
    icon: '💧',
    title: '100% Sustentável',
    description: '0% água, areia, cimento ou cal na fabricação e aplicação',
  },
  {
    icon: '⚡',
    title: '3x Mais Rápida',
    description: 'Aplicação até 3 vezes mais rápida que argamassa tradicional',
  },
  {
    icon: '💰',
    title: 'Economia de 35%',
    description: 'Redução de custos de até 35% por m² construído',
  },
  {
    icon: '🔧',
    title: 'Versátil',
    description: 'Ideal para assentamento, reboco e reparos em diversos tipos de alvenaria',
  },
]

export const GRAN_FINELLE_PRODUCTS = [
  {
    name: 'Texturas',
    description: 'Revestimentos texturizados de alta qualidade',
    image: '/images/03_products/hiperliga/versatilidade-usar-optimized.webp',
    href: '/produtos/texturas',
  },
  {
    name: 'Grafiatos',
    description: 'Acabamentos decorativos para fachadas e interiores',
    image: '/images/03_products/hiperliga/desempenho-e-durabilidade-usar-1024x1024-optimized.webp',
    href: '/produtos/texturas#grafiatos',
  },
  {
    name: 'Tintas',
    description: 'Linha completa de tintas imobiliárias',
    image: '/images/03_products/hiperliga/economia-de-espaco-e-material-usar-optimized.webp',
    href: '/produtos/tintas',
  },
]

// Technical specifications
export const HIPERLIGA_SPECS = [
  {
    name: 'Rendimento',
    value: '1 bisnaga (3kg)',
    description: 'Equivale a aproximadamente 60kg de argamassa comum',
  },
  {
    name: 'Tempo de Cura',
    value: '24h',
    description: 'Tempo para cura completa em condições normais',
  },
  {
    name: 'Temperatura de Aplicação',
    value: '5°C a 40°C',
    description: 'Faixa ideal de temperatura para aplicação',
  },
  {
    name: 'Validade',
    value: '12 meses',
    description: 'Prazo de validade do produto fechado',
  },
]

// SEO and metadata
export const DEFAULT_SEO = {
  title: 'Hiperliga - Argamassa Polimérica Inovadora | Gran Finelle',
  description:
    'Revolucione sua obra com Hiperliga: argamassa polimérica 100% sustentável, 3x mais rápida e econômica. Mais de 3 milhões de m² construídos.',
  keywords: [
    'hiperliga',
    'argamassa polimérica',
    'construção sustentável',
    'gran finelle',
    'argamassa inovadora',
    'construção civil',
    'alvenaria',
    'sustentabilidade',
    'economia na obra',
    'argamassa sem água',
    'argamassa sem cimento',
  ],
}

// Animation settings
export const ANIMATION_SETTINGS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// Form validation messages
export const VALIDATION_MESSAGES = {
  required: 'Este campo é obrigatório',
  email: 'Por favor, insira um email válido',
  phone: 'Por favor, insira um telefone válido',
  minLength: (min: number) => `Mínimo de ${min} caracteres`,
  maxLength: (max: number) => `Máximo de ${max} caracteres`,
}

// API endpoints
export const API_ENDPOINTS = {
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  products: '/api/products',
  faqs: '/api/faqs',
}

// External services
export const EXTERNAL_SERVICES = {
  googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
  googleMaps: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  recaptcha: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
}