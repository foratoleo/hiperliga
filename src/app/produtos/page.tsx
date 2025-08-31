'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon,
  PaintBrushIcon,
  SwatchIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  CheckIcon,
  GlobeAmericasIcon,
  RocketLaunchIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

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
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  }
}

const products = [
  {
    id: 'hiperliga',
    name: 'Hiperliga',
    description: 'Argamassa polimérica revolucionária para alvenaria estrutural e de vedação',
    detailedDescription: 'A Hiperliga é nossa solução principal, uma argamassa polimérica 100% sustentável que elimina completamente o uso de água, areia, cimento e cal. Ideal para construção de alvenaria estrutural e de vedação.',
    icon: SparklesIcon,
    image: '/images/03_products/hiperliga/hiperliga-1-optimized.webp',
    features: [
      '100% sustentável - 0% água, areia, cimento ou cal',
      '3x mais rápida que métodos tradicionais',
      'Até 35% de economia em custos',
      'Alta resistência e durabilidade',
      'Aplicação em alvenaria estrutural e vedação'
    ],
    applications: [
      'Alvenaria estrutural',
      'Paredes de vedação',
      'Muros e divisórias',
      'Estruturas residenciais e comerciais'
    ],
    benefits: [
      { icon: GlobeAmericasIcon, title: 'Sustentabilidade', description: 'Zero desperdício de recursos naturais' },
      { icon: RocketLaunchIcon, title: 'Rapidez', description: '3x mais rápida na aplicação' },
      { icon: CurrencyDollarIcon, title: 'Economia', description: 'Redução de até 35% nos custos' }
    ]
  },
  {
    id: 'texturas',
    name: 'Texturas',
    description: 'Acabamentos texturizados com alta durabilidade e resistência às intempéries',
    detailedDescription: 'Nossa linha de texturas oferece acabamentos únicos e duráveis, desenvolvidos com tecnologia avançada para resistir às mais diversas condições climáticas, mantendo a beleza e proteção da sua obra.',
    icon: PaintBrushIcon,
    image: '/images/03_products/hiperliga/versatilidade-usar-optimized.webp',
    features: [
      'Alta resistência às intempéries',
      'Variedade de texturas e padrões',
      'Fácil aplicação e manutenção',
      'Proteção UV e impermeabilização',
      'Acabamento profissional duradouro'
    ],
    applications: [
      'Fachadas residenciais',
      'Edifícios comerciais',
      'Muros e paredes externas',
      'Ambientes internos decorativos'
    ],
    benefits: [
      { icon: PaintBrushIcon, title: 'Estética', description: 'Acabamentos únicos e personalizados' },
      { icon: SparklesIcon, title: 'Durabilidade', description: 'Resistência superior às intempéries' },
      { icon: CheckIcon, title: 'Facilidade', description: 'Aplicação simples e eficiente' }
    ]
  },
  {
    id: 'grafiatos',
    name: 'Grafiatos',
    description: 'Revestimentos decorativos com efeitos únicos e acabamento profissional',
    detailedDescription: 'Os Grafiatos Gran Finelle proporcionam efeitos decorativos sofisticados, combinando funcionalidade e beleza. Perfeitos para criar ambientes únicos com acabamento profissional de alta qualidade.',
    icon: SwatchIcon,
    image: '/images/03_products/hiperliga/desempenho-e-durabilidade-usar-1024x1024-optimized.webp',
    features: [
      'Efeitos decorativos únicos',
      'Acabamento profissional',
      'Resistência e durabilidade',
      'Fácil aplicação com rolo ou desempenadeira',
      'Variação de granulometrias e cores'
    ],
    applications: [
      'Paredes internas decorativas',
      'Fachadas com efeito especial',
      'Ambientes comerciais',
      'Projetos arquitetônicos diferenciados'
    ],
    benefits: [
      { icon: SwatchIcon, title: 'Design', description: 'Efeitos visuais impressionantes' },
      { icon: SparklesIcon, title: 'Qualidade', description: 'Acabamento profissional duradouro' },
      { icon: PaintBrushIcon, title: 'Versatilidade', description: 'Múltiplas opções de aplicação' }
    ]
  },
  {
    id: 'tintas',
    name: 'Tintas',
    description: 'Tintas especiais com tecnologia avançada para proteção e beleza duradouras',
    detailedDescription: 'Nossa linha de tintas especiais combina tecnologia de ponta com sustentabilidade, oferecendo proteção superior e cores vibrantes que mantêm a beleza da sua obra por muito mais tempo.',
    icon: BuildingOffice2Icon,
    image: '/images/03_products/hiperliga/economia-de-espaco-e-material-usar-optimized.webp',
    features: [
      'Tecnologia avançada em pigmentação',
      'Alta cobertura e rendimento',
      'Proteção UV e antimanchas',
      'Secagem rápida e uniforme',
      'Baixo odor e eco-friendly'
    ],
    applications: [
      'Paredes internas e externas',
      'Fachadas e estruturas metálicas',
      'Ambientes residenciais e comerciais',
      'Projetos que exigem alta durabilidade'
    ],
    benefits: [
      { icon: BuildingOffice2Icon, title: 'Proteção', description: 'Defesa superior contra intempéries' },
      { icon: SparklesIcon, title: 'Beleza', description: 'Cores vibrantes e duradouras' },
      { icon: GlobeAmericasIcon, title: 'Sustentável', description: 'Fórmula eco-friendly' }
    ]
  }
]

export default function ProductsPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <Section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary text-white overflow-hidden">
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
                🏗️ Soluções Completas para Construção
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              Nossos Produtos
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed"
              variants={fadeInUp}
            >
              Descubra nossa linha completa de produtos inovadores para todas as etapas da sua construção
            </motion.p>
          </motion.div>
        </Container>
      </Section>

      {/* Products Grid Section */}
      <Section>
        <Container>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {products.map((product) => {
              const IconComponent = product.icon
              return (
                <motion.div key={product.id} variants={scaleIn}>
                  <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Product Image */}
                      <div className="relative aspect-square rounded-xl overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                        />
                        <div className="absolute top-3 right-3">
                          <div className="p-2 rounded-sm bg-white/90 backdrop-blur">
                            <IconComponent className="h-6 w-6 text-brand-primary" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-brand-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {product.detailedDescription}
                          </p>
                        </div>
                        
                        {/* Features */}
                        <div>
                          <h4 className="font-semibold mb-3">Características principais:</h4>
                          <ul className="space-y-2">
                            {product.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* CTA */}
                        <div className="pt-4">
                          <Link href={`/produtos/${product.id}`}>
                            <Button className="w-full group/btn">
                              Saiba mais sobre {product.name}
                              <ArrowRightIcon className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </Container>
      </Section>

      {/* Benefits Comparison Section */}
      <Section className="bg-muted/30">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vantagens dos Produtos Gran Finelle
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Todos os nossos produtos compartilham os mesmos compromissos com qualidade, sustentabilidade e inovação
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            <motion.div variants={scaleIn}>
              <Card className="p-6 text-center h-full">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-sm bg-green-100 text-green-600">
                    <GlobeAmericasIcon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Sustentabilidade</h3>
                <p className="text-muted-foreground">
                  Produtos desenvolvidos com consciência ambiental, reduzindo o impacto na natureza
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card className="p-6 text-center h-full">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-sm bg-blue-100 text-blue-600">
                    <SparklesIcon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Qualidade Superior</h3>
                <p className="text-muted-foreground">
                  Tecnologia avançada garantindo resultados profissionais e duradouros
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card className="p-6 text-center h-full">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-sm bg-yellow-100 text-yellow-600">
                    <CurrencyDollarIcon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Custo-Benefício</h3>
                <p className="text-muted-foreground">
                  Economia real com produtos que oferecem maior rendimento e eficiência
                </p>
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
              Precisa de Ajuda para Escolher?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Nossa equipe especializada está pronta para orientar você na escolha do produto ideal para seu projeto
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                  <ArrowRightIcon className="mr-2 h-5 w-5" />
                  Solicitar Orientação
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Ver Catálogo Completo
              </Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}