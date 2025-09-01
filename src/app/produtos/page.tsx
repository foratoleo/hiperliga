'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  FunnelIcon,
  MagnifyingGlassIcon,
  Bars3BottomLeftIcon,
  ViewColumnsIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import ProductCardDetailed from '@/components/ui/product-card-detailed'
import type { Product, ProductFilters } from '@/types/product'
import { ProductUtils } from '@/lib/produtos-utils'

// Import the extracted product data
import productsData from '../../../data/produtos-especificacoes.json'

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

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }
  }
}

// Load products from extracted data
const allProducts: Product[] = productsData.products as Product[]
const categories = ProductUtils.getCategories(allProducts)

export default function ProductsPage() {
  const [filters, setFilters] = React.useState<ProductFilters>({
    category: 'todos',
    search: '',
    sortBy: 'name'
  })
  const [showFilters, setShowFilters] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  
  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let filtered = allProducts
    
    // Apply category filter
    if (filters.category && filters.category !== 'todos') {
      filtered = ProductUtils.filterByCategory(filtered, filters.category)
    }
    
    // Apply search filter
    if (filters.search) {
      filtered = ProductUtils.searchProducts(filtered, filters.search)
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filtered = ProductUtils.sortProducts(filtered, filters.sortBy)
    }
    
    return filtered
  }, [filters])
  
  // Handle filter changes
  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }
  
  const clearFilters = () => {
    setFilters({ category: 'todos', search: '', sortBy: 'name' })
  }
  
  const activeFiltersCount = [
    filters.category !== 'todos' ? 1 : 0,
    filters.search ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <Section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/images/03_products/hiperliga/pattern-bg2-optimized.webp')] opacity-10" />
        
        <Container className="relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                🏗️ {allProducts.length} Produtos Disponíveis
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              Catálogo de Produtos
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed"
              variants={fadeInUp}
            >
              Linha completa de produtos inovadores com especificações técnicas detalhadas
            </motion.p>
          </motion.div>
        </Container>
      </Section>

      {/* Filters and Search Section */}
      <Section className="py-8 bg-muted/30">
        <Container>
          <motion.div
            className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideIn}
          >
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                />
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors bg-white"
              >
                <option value="todos">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors bg-white"
              >
                <option value="name">Ordenar por nome</option>
                <option value="category">Ordenar por categoria</option>
                <option value="coverage">Ordenar por rendimento</option>
              </select>
              
              {/* View Mode */}
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-brand-primary text-white' 
                      : 'bg-white hover:bg-muted/50'
                  }`}
                >
                  <ViewColumnsIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-brand-primary text-white' 
                      : 'bg-white hover:bg-muted/50'
                  }`}
                >
                  <Bars3BottomLeftIcon className="h-4 w-4" />
                </button>
              </div>
              
              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Limpar ({activeFiltersCount})
                </Button>
              )}
            </div>
          </motion.div>
          
          {/* Results Summary */}
          <motion.div
            className="mt-4 flex items-center justify-between text-sm text-muted-foreground"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideIn}
          >
            <span>
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              {filters.search && (
                <> para "<strong>{filters.search}</strong>"
                </>
              )}
            </span>
          </motion.div>
        </Container>
      </Section>
      
      {/* Products Grid/List Section */}
      <Section>
        <Container>
          {filteredProducts.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <div className="mb-4 text-muted-foreground">
                <MagnifyingGlassIcon className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar seus filtros ou termos de busca
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerChildren}
            >
              {filteredProducts.map((product, index) => (
                <ProductCardDetailed
                  key={product.id}
                  product={product}
                  priority={index < 3}
                  showCalculator={true}
                  showSustainability={true}
                />
              ))}
            </motion.div>
          )}
        </Container>
      </Section>

      {/* Statistics Section */}
      <Section className="bg-muted/30">
        <Container>
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos Produtos em Números
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Dados reais extraídos de especificações técnicas e casos de uso
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            <motion.div variants={slideIn}>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-brand-primary mb-2">
                  {allProducts.length}
                </div>
                <div className="text-sm text-muted-foreground">Produtos</div>
                <div className="text-xs text-muted-foreground mt-1">Disponíveis</div>
              </Card>
            </motion.div>
            
            <motion.div variants={slideIn}>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {categories.length}
                </div>
                <div className="text-sm text-muted-foreground">Categorias</div>
                <div className="text-xs text-muted-foreground mt-1">Diferentes</div>
              </Card>
            </motion.div>
            
            <motion.div variants={slideIn}>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  21x
                </div>
                <div className="text-sm text-muted-foreground">Menos Água</div>
                <div className="text-xs text-muted-foreground mt-1">Hiperliga</div>
              </Card>
            </motion.div>
            
            <motion.div variants={slideIn}>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  35%
                </div>
                <div className="text-sm text-muted-foreground">Economia</div>
                <div className="text-xs text-muted-foreground mt-1">Média</div>
              </Card>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <Container>
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Precisa de Mais Informações?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Nossa equipe técnica pode ajudar com especificações detalhadas, cálculos personalizados e orientações de aplicação
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90" asChild>
                <a href="/contato">
                  Falar com Especialista
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <a href="/faq">
                  Ver Perguntas Frequentes
                </a>
              </Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}