// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import empresaData from '@/data/empresa.json'

const baseUrl = 'https://hiperliga.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()
  
  // Static pages with priority and change frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/produtos`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    }
  ]

  // Product pages - dynamically generated from data
  const products = [
    {
      slug: 'hiperliga-argamassa-polimerica',
      name: 'Hiperliga - Argamassa Polimérica',
      priority: 0.9,
      changeFrequency: 'weekly' as const
    },
    {
      slug: 'texturas-decorativas',
      name: 'Texturas Decorativas',
      priority: 0.8,
      changeFrequency: 'monthly' as const
    },
    {
      slug: 'grafiatos-especiais',
      name: 'Grafiatos Especiais',
      priority: 0.8,
      changeFrequency: 'monthly' as const
    },
    {
      slug: 'tintas-acrilicas',
      name: 'Tintas Acrílicas',
      priority: 0.8,
      changeFrequency: 'monthly' as const
    },
    {
      slug: 'kit-completo',
      name: 'Kit Completo Hiperliga',
      priority: 0.7,
      changeFrequency: 'monthly' as const
    }
  ]

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/produtos/${product.slug}`,
    lastModified: currentDate,
    changeFrequency: product.changeFrequency,
    priority: product.priority,
  }))

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/produtos/argamassas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produtos/texturas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/produtos/tintas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  ]

  // Additional content pages that might exist
  const contentPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/como-aplicar`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sustentabilidade`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/calculadora`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/onde-comprar`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    }
  ]

  // Combine all pages
  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...contentPages,
  ]
}

// Generate robots.txt
export async function GET() {
  const robotsTxt = `User-agent: *
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
Disallow: /*.json$

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for politeness
Crawl-delay: 1

# Additional directives for performance
Request-rate: 1/10s`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24 hours
    },
  })
}