'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { 
  ArrowLeftIcon,
  ShareIcon,
  CheckIcon,
  GlobeAmericasIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import TechnicalSpecsTable from '@/components/ui/technical-specs-table'
import YieldCalculator from '@/components/ui/yield-calculator'
import ProductCardDetailed from '@/components/ui/product-card-detailed'
import type { Product } from '@/types/product'
import { ProductUtils, formatArea, formatCurrency } from '@/lib/produtos-utils'

// Import the extracted product data
import productsData from '../../../../data/produtos-especificacoes.json'

interface ProductPageProps {
  params: {
    slug: string
  }
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
  }
}

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  }
}

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const allProducts: Product[] = productsData.products as Product[]
  const product = ProductUtils.getProductBySlug(allProducts, params.slug)
  
  if (!product) {
    notFound()
  }
  
  const relatedProducts = ProductUtils.getRelatedProducts(product, allProducts, 3)
  const sustainability = ProductUtils.getSustainabilityScore(product)
  const coverage = ProductUtils.calculateCoverage(product)
  const equivalence = ProductUtils.calculateEquivalence(product)
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": primaryImage?.url,
    "brand": {
      "@type": "Brand",
      "name": "Gran Finelle"
    },
    "category": product.category.name,
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="overflow-x-hidden">
        {/* Breadcrumb Navigation */}
        <Section className="py-4 bg-muted/30 border-b">
          <Container>
            <motion.nav 
              className="flex items-center gap-2 text-sm text-muted-foreground"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Link href="/" className="hover:text-brand-primary transition-colors">
                Início
              </Link>
              <ChevronRightIcon className="h-4 w-4" />
              <Link href="/produtos" className="hover:text-brand-primary transition-colors">
                Produtos
              </Link>
              <ChevronRightIcon className="h-4 w-4" />
              <span className="font-medium text-foreground">{product.name}</span>
            </motion.nav>
          </Container>
        </Section>

        {/* Product Header */}
        <Section className="py-8">
          <Container>
            <div className="flex items-start justify-between mb-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={slideInLeft}
              >
                <Link href="/produtos">
                  <Button variant="outline" size="sm">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Voltar aos Produtos
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                className="flex gap-2"
                initial="hidden"
                animate="visible"
                variants={slideInRight}
              >
                <Button variant="outline" size="sm">
                  <ShareIcon className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
                <Button variant="outline" size="sm">
                  <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
                  Ficha Técnica
                </Button>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Product Images */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideInLeft}
              >
                <div className="sticky top-8">
                  {primaryImage && (
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  )}
                  
                  {/* Additional Images */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((image, index) => (
                        <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover hover:scale-105 transition-transform cursor-pointer"
                            sizes="100px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Product Information */}
              <motion.div
                className="space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerChildren}
              >
                {/* Category & Sustainability */}
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                  <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
                    {product.category.name}
                  </Badge>
                  {sustainability.score > 60 && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <GlobeAmericasIcon className="h-3 w-3 mr-1" />
                      {sustainability.description}
                    </Badge>
                  )}
                </motion.div>
                
                {/* Product Name & Description */}
                <motion.div variants={fadeInUp}>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {product.description}
                  </p>
                </motion.div>
                
                {/* Key Metrics */}
                <motion.div variants={fadeInUp}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    {coverage > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-brand-primary">
                          {formatArea(coverage)}
                        </div>
                        <div className="text-xs text-muted-foreground">Rendimento</div>
                      </div>
                    )}
                    {equivalence > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {equivalence}kg
                        </div>
                        <div className="text-xs text-muted-foreground">Equivalência</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {product.packaging.weight}
                      </div>
                      <div className="text-xs text-muted-foreground">Embalagem</div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Features */}
                <motion.div variants={fadeInUp}>
                  <h3 className="font-semibold mb-4">Principais características:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                
                {/* Benefits */}
                <motion.div variants={fadeInUp}>
                  <h3 className="font-semibold mb-4">Principais benefícios:</h3>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                
                {/* Applications */}
                <motion.div variants={fadeInUp}>
                  <h3 className="font-semibold mb-4">Aplicações recomendadas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.applications.map((application, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {application}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
                
                {/* CTA Buttons */}
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="flex-1" asChild>
                    <Link href="/contato">
                      <CurrencyDollarIcon className="mr-2 h-5 w-5" />
                      Solicitar Orçamento
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="#calculadora">
                      Usar Calculadora
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </Container>
        </Section>

        {/* Technical Specifications */}
        <Section className="py-12 bg-muted/30">
          <Container>
            <motion.div
              className="max-w-6xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
            >
              <TechnicalSpecsTable
                product={product}
                showSustainability={true}
              />
            </motion.div>
          </Container>
        </Section>

        {/* Yield Calculator */}
        <Section className="py-12" id="calculadora">
          <Container>
            <motion.div
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
            >
              <YieldCalculator product={product} />
            </motion.div>
          </Container>
        </Section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Section className="py-12 bg-muted/30">
            <Container>
              <motion.div
                className="text-center mb-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Produtos Relacionados
                </h2>
                <p className="text-muted-foreground">
                  Outros produtos que podem interessar você
                </p>
              </motion.div>
              
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerChildren}
              >
                {relatedProducts.map((relatedProduct) => (
                  <ProductCardDetailed
                    key={relatedProduct.id}
                    product={relatedProduct}
                    showCalculator={false}
                    showSustainability={true}
                  />
                ))}
              </motion.div>
            </Container>
          </Section>
        )}

        {/* Final CTA */}
        <Section className="py-12 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
          <Container>
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ficou interessado no {product.name}?
              </h2>
              <p className="text-lg mb-6 text-white/90">
                Nossa equipe pode fornecer orientação técnica especializada e orçamento personalizado
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90" asChild>
                  <Link href="/contato">
                    Falar com Especialista
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/produtos">
                    Ver Outros Produtos
                  </Link>
                </Button>
              </div>
            </motion.div>
          </Container>
        </Section>
      </div>
    </>
  )
}

// Generate static params for all products
export async function generateStaticParams() {
  const allProducts: Product[] = productsData.products as Product[]
  
  return allProducts.map((product) => ({
    slug: product.slug,
  }))
}

// Generate metadata for each product page
export async function generateMetadata({ params }: ProductPageProps) {
  const allProducts: Product[] = productsData.products as Product[]
  const product = ProductUtils.getProductBySlug(allProducts, params.slug)
  
  if (!product) {
    return {
      title: 'Produto não encontrado - Gran Finelle',
    }
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]

  return {
    title: `${product.name} - Especificações Técnicas | Gran Finelle`,
    description: `${product.shortDescription} Veja especificações técnicas completas, aplicações e benefícios do ${product.name} da Gran Finelle.`,
    keywords: [
      product.name,
      product.category.name,
      'Gran Finelle',
      'especificações técnicas',
      'construção',
      'argamassa',
      'sustentável',
      ...product.features.slice(0, 3).map(f => f.toLowerCase())
    ].join(', '),
    openGraph: {
      title: `${product.name} - Gran Finelle`,
      description: product.shortDescription,
      images: primaryImage ? [primaryImage.url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - Gran Finelle`,
      description: product.shortDescription,
      images: primaryImage ? [primaryImage.url] : [],
    },
  }
}