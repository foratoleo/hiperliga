'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  ScaleIcon,
  PlusIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import ProductComparison from '@/components/ui/product-comparison'
import type { Product } from '@/types/product'

// Import the extracted product data
import productsData from '../../../../data/produtos-especificacoes.json'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
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

export default function CompareProductsPage() {
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([])
  const [showProductSelector, setShowProductSelector] = React.useState(false)
  
  const allProducts: Product[] = productsData.products as Product[]
  const availableProducts = allProducts.filter(
    product => !selectedProducts.find(selected => selected.id === product.id)
  )

  // Handle product selection
  const addProduct = (product: Product) => {
    if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, product])
      setShowProductSelector(false)
    }
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(product => product.id !== productId))
  }

  const clearAllProducts = () => {
    setSelectedProducts([])
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <Section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        <Container className="relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                <ScaleIcon className="mr-2 h-4 w-4" />
                Ferramenta de Comparação
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              Compare Produtos
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed"
              variants={fadeInUp}
            >
              Analise especificações técnicas lado a lado para escolher o produto ideal para seu projeto
            </motion.p>
          </motion.div>
        </Container>
      </Section>

      {/* Product Selector */}
      {showProductSelector && (
        <Section className="py-8 bg-muted/30">
          <Container>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Selecione um produto para comparar</h3>
                <Button 
                  variant="outline" 
                  onClick={() => setShowProductSelector(false)}
                >
                  Cancelar
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-brand-primary"
                    onClick={() => addProduct(product)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-brand-primary font-bold">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.category.name}
                        </p>
                      </div>
                      <PlusIcon className="h-5 w-5 text-brand-primary" />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </Container>
        </Section>
      )}

      {/* Comparison Section */}
      <Section className="py-12">
        <Container>
          <ProductComparison
            products={selectedProducts}
            onRemoveProduct={removeProduct}
            onAddProduct={() => setShowProductSelector(true)}
            maxProducts={3}
          />
        </Container>
      </Section>

      {/* Quick Add Section */}
      {selectedProducts.length === 0 && (
        <Section className="py-12 bg-muted/30">
          <Container>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Comparações Sugeridas
              </h2>
              <p className="text-muted-foreground mb-8">
                Clique nos grupos abaixo para comparar produtos relacionados
              </p>
            </motion.div>
            
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerChildren}
            >
              {/* Hiperliga Comparison */}
              <motion.div variants={fadeInUp}>
                <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-brand-primary">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      Produtos Hiperliga
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Compare diferentes versões da argamassa polimérica
                    </p>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {allProducts
                      .filter(p => p.category.slug === 'hiperliga')
                      .slice(0, 2)
                      .map((product) => (
                        <div key={product.id} className="flex items-center gap-2 text-sm">
                          <CheckIcon className="h-4 w-4 text-green-600" />
                          <span>{product.name}</span>
                        </div>
                      ))}
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={() => {
                      const hiperligaProducts = allProducts.filter(p => p.category.slug === 'hiperliga').slice(0, 2)
                      setSelectedProducts(hiperligaProducts)
                    }}
                  >
                    Comparar Hiperliga
                  </Button>
                </Card>
              </motion.div>

              {/* All Categories */}
              <motion.div variants={fadeInUp}>
                <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-brand-primary">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      Mix de Categorias
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Compare produtos de diferentes categorias
                    </p>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {allProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center gap-2 text-sm">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                        <span>{product.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {product.category.name}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedProducts(allProducts.slice(0, 3))
                    }}
                  >
                    Comparar Categorias
                  </Button>
                </Card>
              </motion.div>
            </motion.div>
          </Container>
        </Section>
      )}

      {/* Info Section */}
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
              Precisa de Ajuda na Escolha?
            </h2>
            <p className="text-lg mb-6 text-white/90">
              Nossa equipe técnica pode orientar você na seleção do produto mais adequado para seu projeto específico
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90" asChild>
                <a href="/contato">
                  Falar com Especialista
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <a href="/produtos">
                  Ver Todos os Produtos
                </a>
              </Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}

// Generate metadata for the comparison page
export function generateMetadata() {
  return {
    title: 'Comparar Produtos - Especificações Técnicas | Gran Finelle',
    description: 'Compare especificações técnicas dos produtos Gran Finelle lado a lado. Hiperliga, tintas, grafiatos - encontre o produto ideal para seu projeto.',
    keywords: [
      'comparar produtos',
      'especificações técnicas',
      'Gran Finelle',
      'Hiperliga',
      'argamassa polimérica',
      'tintas',
      'grafiato',
      'construção',
      'sustentável'
    ].join(', '),
    openGraph: {
      title: 'Comparar Produtos - Gran Finelle',
      description: 'Compare especificações técnicas dos produtos Gran Finelle lado a lado para escolher o ideal para seu projeto.',
      type: 'website',
    },
  }
}