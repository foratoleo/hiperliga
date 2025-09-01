// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://hiperliga.com.br'
  
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/produtos',
        '/sobre', 
        '/contato',
        '/faq',
        '/videos',
        '/produtos/*',
        '/como-aplicar',
        '/sustentabilidade',
        '/calculadora',
        '/onde-comprar'
      ],
      disallow: [
        '/api/',
        '/_next/',
        '/admin/',
        '/temp/',
        '/*.json$',
        '/private/',
        '/test/',
        '/*?*utm_*',  // Block UTM parameters for cleaner indexing
        '/*?*fbclid*', // Block Facebook click IDs
        '/*?*gclid*'   // Block Google click IDs
      ],
      crawlDelay: 1
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}