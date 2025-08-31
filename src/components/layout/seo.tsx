import * as React from 'react'
import Head from 'next/head'
import { DEFAULT_SEO, SITE_CONFIG } from '@/lib/constants'
import type { SEOData } from '@/types'

interface SEOProps extends Partial<SEOData> {
  templateTitle?: string
}

export function SEO({
  title,
  description = DEFAULT_SEO.description,
  keywords = DEFAULT_SEO.keywords,
  ogTitle,
  ogDescription,
  ogImage = SITE_CONFIG.ogImage,
  canonical,
  noindex = false,
  nofollow = false,
  templateTitle
}: SEOProps) {
  // Generate full title with template
  const fullTitle = React.useMemo(() => {
    if (!title) return DEFAULT_SEO.title
    
    if (templateTitle) {
      return `${title} | ${templateTitle}`
    }
    
    return title === 'Hiperliga' ? DEFAULT_SEO.title : `${title} | Hiperliga`
  }, [title, templateTitle])

  // Generate full URL for canonical and OG
  const fullCanonical = canonical ? `${SITE_CONFIG.url}${canonical}` : undefined
  const fullOgImage = ogImage?.startsWith('http') ? ogImage : `${SITE_CONFIG.url}${ogImage}`

  // Convert keywords array to string
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Robots */}
      <meta
        name="robots"
        content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`}
      />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogTitle || fullTitle} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Gran Finelle" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="pt-BR" />
      <meta name="geo.region" content="BR-PR" />
      <meta name="geo.placename" content="Almirante Tamandaré" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#1a365d" />
      <meta name="msapplication-TileColor" content="#1a365d" />
      <meta name="theme-color" content="#ffffff" />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Additional Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Gran Finelle",
            "url": SITE_CONFIG.url,
            "logo": `${SITE_CONFIG.url}/images/01_brand/logo_hiperliga-optimized.webp`,
            "description": SITE_CONFIG.description,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Rua Antônio Camargo, 122",
              "addressLocality": "Almirante Tamandaré", 
              "addressRegion": "PR",
              "postalCode": "83514-140",
              "addressCountry": "BR"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+55-41-98522-0746",
              "contactType": "customer service",
              "availableLanguage": "pt-BR"
            },
            "sameAs": [
              SITE_CONFIG.links.instagram,
              SITE_CONFIG.links.facebook,
              SITE_CONFIG.links.youtube,
              SITE_CONFIG.links.linkedin
            ].filter(Boolean)
          })
        }}
      />
    </Head>
  )
}

export default SEO