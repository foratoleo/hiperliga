// src/lib/seo-utils.ts
import { Metadata } from 'next'
import empresaData from '@/data/empresa.json'

interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  imageAlt?: string
  canonical?: string
  noindex?: boolean
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  category?: string
  price?: {
    amount: number
    currency: string
  }
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
}

const siteConfig = {
  name: 'Hiperliga',
  title: 'Hiperliga - Argamassa Polimérica Inovadora | Sustentável e Econômica',
  description: 'Hiperliga: argamassa 100% sustentável que economiza até 35% nos custos, aplica 3x mais rápido e não usa água, areia, cimento ou cal. Mais de 3 milhões de m² aplicados.',
  url: 'https://hiperliga.com.br',
  logo: '/images/logo/hiperliga-logo.png',
  favicon: '/favicon.ico',
  company: empresaData.company,
  contact: empresaData.company.contact,
  keywords: [
    'argamassa polimérica',
    'construção sustentável',
    'Hiperliga',
    'argamassa ecológica',
    'construção civil',
    'materiais de construção',
    'sustentabilidade',
    'economia na obra',
    'argamassa sem água',
    'materiais inovadores',
    'Gran Finelle',
    'argamassa rápida',
    'construção verde'
  ]
}

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    keywords = siteConfig.keywords,
    image = `${siteConfig.url}${siteConfig.logo}`,
    imageAlt = `${siteConfig.name} - Logotipo`,
    canonical,
    noindex = false,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    category
  } = config

  const metaTitle = title 
    ? `${title} | ${siteConfig.name}` 
    : siteConfig.title

  const metaDescription = description.length > 160 
    ? `${description.substring(0, 157)}...` 
    : description

  const keywordString = Array.isArray(keywords) 
    ? keywords.join(', ') 
    : keywords

  const canonicalUrl = canonical 
    ? `${siteConfig.url}${canonical}` 
    : siteConfig.url

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: keywordString,
    authors: author ? [{ name: author }] : [{ name: siteConfig.company.tradeName }],
    creator: siteConfig.company.tradeName,
    publisher: siteConfig.company.legalName,
    robots: noindex ? 'noindex,nofollow' : 'index,follow',
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      locale: 'pt_BR',
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: 'image/png'
        }
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(category && { section: category })
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [image],
      creator: '@hiperliga',
      site: '@hiperliga'
    },
    other: {
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
      'facebook-domain-verification': process.env.FACEBOOK_DOMAIN_VERIFICATION || '',
      'contact:phone_number': siteConfig.contact.whatsapp,
      'contact:country_name': 'Brasil',
      'contact:region': 'Paraná',
      'contact:locality': siteConfig.company.address.city
    }
  }

  return metadata
}

// Structured Data Generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.company.legalName,
    alternateName: siteConfig.company.tradeName,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    foundingDate: siteConfig.company.foundedYear.toString(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${siteConfig.company.address.street}, ${siteConfig.company.address.number}`,
      addressLocality: siteConfig.company.address.city,
      addressRegion: siteConfig.company.address.state,
      postalCode: siteConfig.company.address.zipCode,
      addressCountry: 'BR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.whatsapp,
      contactType: 'customer service',
      availableLanguage: 'Portuguese'
    },
    sameAs: [
      siteConfig.contact.socialMedia.facebook,
      siteConfig.contact.socialMedia.instagram,
      siteConfig.contact.socialMedia.whatsapp
    ]
  }
}

export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  category: string
  brand?: string
  sku?: string
  gtin?: string
  price?: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `${siteConfig.url}${product.image}`,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: product.brand || siteConfig.company.tradeName
    },
    manufacturer: {
      '@type': 'Organization',
      name: siteConfig.company.legalName
    }
  }

  if (product.sku) schema.sku = product.sku
  if (product.gtin) schema.gtin = product.gtin

  if (product.price && product.currency) {
    schema.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: siteConfig.company.legalName
      }
    }
  }

  return schema
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.url}`
    }))
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.company.legalName,
    alternateName: siteConfig.company.tradeName,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    image: `${siteConfig.url}${siteConfig.logo}`,
    telephone: siteConfig.contact.whatsapp,
    email: 'contato@hiperliga.com.br',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${siteConfig.company.address.street}, ${siteConfig.company.address.number}`,
      addressLocality: siteConfig.company.address.city,
      addressRegion: siteConfig.company.address.state,
      postalCode: siteConfig.company.address.zipCode,
      addressCountry: 'BR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-25.32144',  // Approximate for Almirante Tamandaré
      longitude: '-49.31047'
    },
    openingHours: 'Mo-Fr 08:00-18:00, Sa 08:00-12:00',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, PIX',
    currenciesAccepted: 'BRL',
    priceRange: '$$',
    foundingDate: siteConfig.company.foundedYear.toString(),
    sameAs: [
      siteConfig.contact.socialMedia.facebook,
      siteConfig.contact.socialMedia.instagram
    ]
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      '@id': `${siteConfig.url}#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/buscar?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'pt-BR'
  }
}

// Page-specific metadata generators
export const pageMetadata = {
  home: () => generateMetadata({
    title: 'Página Inicial',
    description: 'Hiperliga: a argamassa polimérica que revoluciona a construção civil. 100% sustentável, economiza até 35% e aplica 3x mais rápido. Conheça nossa tecnologia inovadora.',
    keywords: [...siteConfig.keywords, 'página inicial', 'home', 'construção sustentável'],
    canonical: '/'
  }),

  produtos: () => generateMetadata({
    title: 'Produtos - Argamassas Poliméricas Sustentáveis',
    description: 'Conheça toda a linha Hiperliga: argamassas poliméricas, texturas, grafiatos e tintas. Produtos 100% sustentáveis que transformam sua obra.',
    keywords: [...siteConfig.keywords, 'produtos', 'argamassa', 'textura', 'grafiato', 'tinta'],
    canonical: '/produtos'
  }),

  sobre: () => generateMetadata({
    title: 'Sobre a Hiperliga - História e Inovação',
    description: `Conheça a história da ${siteConfig.company.tradeName}, fundada em ${siteConfig.company.foundedYear}. Mais de ${siteConfig.company.experienceYears} anos desenvolvendo soluções sustentáveis para construção civil.`,
    keywords: [...siteConfig.keywords, 'sobre', 'história', 'empresa', 'inovação'],
    canonical: '/sobre'
  }),

  contato: () => generateMetadata({
    title: 'Contato - Fale Conosco',
    description: `Entre em contato com a Hiperliga. Estamos em ${siteConfig.company.address.city}-${siteConfig.company.address.state}. WhatsApp, telefone e formulário de contato disponíveis.`,
    keywords: [...siteConfig.keywords, 'contato', 'telefone', 'whatsapp', 'endereço'],
    canonical: '/contato'
  }),

  faq: () => generateMetadata({
    title: 'Perguntas Frequentes - FAQ',
    description: 'Tire todas suas dúvidas sobre a Hiperliga. Respostas às perguntas mais frequentes sobre nossa argamassa polimérica sustentável.',
    keywords: [...siteConfig.keywords, 'FAQ', 'dúvidas', 'perguntas frequentes', 'ajuda'],
    canonical: '/faq'
  }),

  videos: () => generateMetadata({
    title: 'Vídeos Demonstrativos - Como Aplicar',
    description: 'Assista aos vídeos demonstrativos da Hiperliga. Aprenda como aplicar nossa argamassa polimérica de forma correta e eficiente.',
    keywords: [...siteConfig.keywords, 'vídeos', 'demonstração', 'como aplicar', 'tutorial'],
    canonical: '/videos'
  })
}

// Performance and analytics tracking
export function trackSEOMetrics(page: string, loadTime?: number) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'page_load_complete', {
    event_category: 'seo',
    event_label: page,
    value: loadTime ? Math.round(loadTime) : undefined,
    custom_parameter_1: 'seo_optimized'
  })
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Optimize crawling for important pages
Allow: /produtos
Allow: /sobre
Allow: /contato
Allow: /faq
Allow: /videos

# Block unnecessary pages
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /temp/

# Sitemap location
Sitemap: ${siteConfig.url}/sitemap.xml

# Crawl delay for politeness
Crawl-delay: 1`
}

export { siteConfig }