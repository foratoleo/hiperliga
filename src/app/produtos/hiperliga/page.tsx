'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon,
  CheckIcon,
  GlobeAmericasIcon,
  RocketLaunchIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  TrophyIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PlayIcon,
  ArrowLeftIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { OptimizedImage } from '@/components/ui/optimized-image'

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

// Counter animation hook
function useCounter(endValue: number, duration: number = 2000, startAnimation: boolean = false) {
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    if (!startAnimation) return
    
    let startTime: number
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (startTime === undefined) startTime = currentTime
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      
      setCount(Math.floor(progress * endValue))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [endValue, duration, startAnimation])
  
  return count
}

export default function HiperligaPage() {
  const [statsInView, setStatsInView] = React.useState(false)

  // Counter values
  const squareMeters = useCounter(3, 2000, statsInView)
  const speedMultiplier = useCounter(3, 1500, statsInView)
  const savings = useCounter(35, 2000, statsInView)
  const resistance = useCounter(40, 1800, statsInView)

  // Intersection observer for stats animation
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true)
        }
      },
      { threshold: 0.3 }
    )
    
    const statsElement = document.getElementById('hiperliga-stats')
    if (statsElement) {
      observer.observe(statsElement)
    }
    
    return () => {
      if (statsElement) {
        observer.unobserve(statsElement)
      }
    }
  }, [])

  const benefits = [
    {
      icon: GlobeAmericasIcon,
      title: '100% Sustentável',
      description: '0% água, areia, cimento ou cal. Uma revolução ecológica na construção civil.',
      details: [
        'Consumo 21x menor de água na obra',
        'Não utiliza água, areia, cimento ou cal',
        'Reduz pegada de carbono da obra',
        'Certificação ambiental e sustentabilidade'
      ]
    },
    {
      icon: RocketLaunchIcon,
      title: '3x Mais Rápida',
      description: 'Aplicação ultrarrápida que acelera o cronograma da sua obra.',
      details: [
        'Pega imediata após aplicação',
        'Não requer tempo de cura tradicional',
        'Reduz cronograma da obra',
        'Maior produtividade da equipe'
      ]
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Até 35% Economia',
      description: 'Redução significativa nos custos totais do projeto.',
      details: [
        '1 bisnaga (3kg) rende como 60kg de argamassa comum',
        'Redução significativa de mão de obra',
        'Eliminação de custos com água, areia, cimento',
        'Menor transporte e logística'
      ]
    },
    {
      icon: SparklesIcon,
      title: 'Alta Resistência',
      description: 'Performance superior com resistência à compressão de até 40 MPa.',
      details: [
        'Resistência à compressão superior',
        'Excelente aderência',
        'Resistência a intempéries',
        'Durabilidade estendida'
      ]
    }
  ]

  const applications = [
    {
      title: 'Alvenaria Estrutural',
      description: 'Para construções que exigem alta resistência estrutural',
      image: '/images/03_products/hiperliga/desempenho-e-durabilidade-usar-1024x1024-optimized.webp'
    },
    {
      title: 'Paredes de Vedação',
      description: 'Vedação eficiente com excelente isolamento',
      image: '/images/03_products/hiperliga/versatilidade-usar-optimized.webp'
    },
    {
      title: 'Muros e Divisórias',
      description: 'Construção rápida de muros e divisórias internas',
      image: '/images/03_products/hiperliga/economia-de-espaco-e-material-usar-optimized.webp'
    },
    {
      title: 'Obras Comerciais',
      description: 'Ideal para grandes projetos comerciais e industriais',
      image: '/images/03_products/hiperliga/100-sustentavel-usar-optimized.webp'
    }
  ]

  const technicalSpecs = [
    { label: 'Resistência à Compressão', value: '≥ 40 MPa' },
    { label: 'Aderência', value: '≥ 1,0 MPa' },
    { label: 'Rendimento', value: '1 bisnaga (3kg) = ~60kg argamassa comum' },
    { label: 'Consumo de Água', value: '21x menor que argamassa tradicional' },
    { label: 'Tempo de Pega', value: '30 minutos' },
    { label: 'Temperatura de Aplicação', value: '5°C a 40°C' },
    { label: 'Validade', value: '24 meses (fechado)' }
  ]

  return (
    <div className="overflow-x-hidden">
      {/* Breadcrumb */}
      <Section className="py-4 border-b">
        <Container>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand-primary">Home</Link>
            <span>/</span>
            <Link href="/produtos" className="hover:text-brand-primary">Produtos</Link>
            <span>/</span>
            <span className="text-foreground">Hiperliga</span>
          </div>
        </Container>
      </Section>

      {/* Hero Section */}
      <Section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/images/hero/hiperliga-hero-1.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Link href="/produtos" className="inline-flex items-center gap-2 mb-6 text-white/90 hover:text-white">
                <ArrowLeftIcon className="h-4 w-4" />
                Voltar aos Produtos
              </Link>
              
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                🏆 Produto Principal
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Hiperliga
              </h1>
              
              <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
                A argamassa polimérica revolucionária que está transformando a construção civil. 
                100% sustentável, 3x mais rápida e até 35% mais econômica.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                  <DocumentTextIcon className="mr-2 h-5 w-5" />
                  Solicitar Orçamento
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <PlayIcon className="mr-2 h-5 w-5" />
                  Ver Demonstração
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <OptimizedImage
                  src="/images/03_products/hiperliga/hiperliga-1-optimized.webp"
                  alt="Hiperliga - Argamassa Polimérica"
                  category="product"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Benefits Section */}
      <Section>
        <Container>
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que a Hiperliga é Revolucionária?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubra os benefícios que fazem da Hiperliga a escolha inteligente para profissionais exigentes
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="p-8 h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-sm bg-brand-primary/10 flex-shrink-0">
                        <IconComponent className="h-8 w-8 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {benefit.description}
                        </p>
                        <ul className="space-y-2">
                          {benefit.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section id="hiperliga-stats" className="bg-muted/30">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Números que Comprovam a Eficácia
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Resultados mensuráveis que demonstram o sucesso da Hiperliga
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
          >
            <motion.div variants={scaleIn}>
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl lg:text-5xl font-bold text-brand-primary mb-2">
                  +{squareMeters}M
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
                  m² construídos
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  com Hiperliga
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl lg:text-5xl font-bold text-brand-primary mb-2">
                  {speedMultiplier}x
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
                  mais rápida
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  que argamassa tradicional
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl lg:text-5xl font-bold text-brand-primary mb-2">
                  {savings}%
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
                  de economia
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  nos custos totais
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl lg:text-5xl font-bold text-brand-primary mb-2">
                  {resistance}
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
                  MPa resistência
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  à compressão
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Applications */}
      <Section>
        <Container>
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Aplicações da Hiperliga
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Versátil e eficiente para diversos tipos de construção
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {applications.map((app, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <BuildingOffice2Icon className="h-12 w-12" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{app.title}</h3>
                  <p className="text-muted-foreground text-sm">{app.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Technical Specs */}
      <Section className="bg-muted/30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Especificações Técnicas
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Dados técnicos que garantem a qualidade e performance da Hiperliga
              </p>
              
              <div className="space-y-4">
                {technicalSpecs.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-border">
                    <span className="font-medium">{spec.label}</span>
                    <span className="text-brand-primary font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Card className="p-8 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                <TrophyIcon className="h-12 w-12 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Certificações de Qualidade</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5" />
                    <span>ABNT NBR 13281 - Argamassa para assentamento</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5" />
                    <span>ISO 9001 - Gestão da Qualidade</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5" />
                    <span>ISO 14001 - Gestão Ambiental</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5" />
                    <span>Certificação de Sustentabilidade</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <Container>
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <UserGroupIcon className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Revolucionar sua Obra?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Junte-se aos milhares de profissionais que já descobriram os benefícios da Hiperliga
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                  <ArrowRightIcon className="mr-2 h-5 w-5" />
                  Solicitar Orçamento
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <DocumentTextIcon className="mr-2 h-5 w-5" />
                Baixar Catálogo Técnico
              </Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}