'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  PlayIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  CurrencyDollarIcon,
  GlobeAmericasIcon,
  SparklesIcon,
  ArrowRightIcon,
  BuildingOffice2Icon,
  PaintBrushIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { LazySection } from '@/components/ui/lazy-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { BenefitsProgressiveSection } from '@/components/sections/benefits-progressive'
import { ProductExpandableCard } from '@/components/ui/expandable-card'
import { InteractiveStats } from '@/components/ui/interactive-stats'
import { FloatingCTA } from '@/components/ui/floating-cta'
import { InterestCTASection, DecisionCTASection } from '@/components/sections/cta-section'
import { CalculatorWidget } from '@/components/ui/calculator-widget'
import { useBreakpoint } from '@/hooks/use-media-query'
import { getDepoimentos } from '@/lib/depoimentos-data'
import { trackUserInteraction, trackConversion } from '@/lib/analytics'

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

export default function HomePage() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const [statsInView, setStatsInView] = React.useState(false)
  const [isVideoLoading, setIsVideoLoading] = React.useState(false)
  const [videoError, setVideoError] = React.useState(false)
  const [formData, setFormData] = React.useState({ email: '', name: '' })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitMessage, setSubmitMessage] = React.useState('')
  
  // Load testimonials data
  const depoimentosData = getDepoimentos()
  
  // Counter values
  const squareMeters = useCounter(3, 2000, statsInView)
  const speedMultiplier = useCounter(3, 1500, statsInView)
  const savings = useCounter(35, 2000, statsInView)
  const waterSavings = useCounter(21, 1800, statsInView)
  
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
    
    const statsElement = document.getElementById('stats-section')
    if (statsElement) {
      observer.observe(statsElement)
    }
    
    return () => {
      if (statsElement) {
        observer.unobserve(statsElement)
      }
    }
  }, [])
  
  const handleVideoPlay = () => {
    setIsVideoLoading(true)
    // Simulate video loading
    setTimeout(() => {
      setIsVideoLoading(false)
    }, 1000)
  }
  
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitMessage('Email cadastrado com sucesso! Entraremos em contato em breve.')
      setFormData({ email: '', name: '' })
    } catch {
      setSubmitMessage('Erro ao cadastrar email. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className='overflow-x-hidden'>
      {/* Hero Section - Mobile-First Redesigned */}
      <Section className='relative min-h-[80vh] sm:min-h-[90vh] flex items-center bg-gradient-to-br from-brand-primary to-brand-secondary text-white overflow-hidden'>
        {/* Simplified Background - Less visual noise on mobile */}
        <div className='absolute inset-0 bg-black/30' />
        <div className='absolute inset-0 bg-[url("/images/hero/demo-construction.webp")] bg-cover bg-center opacity-10 md:opacity-15' />
        
        {/* Floating Elements - Hidden on mobile for cleaner look */}
        {isDesktop && (
          <motion.div
            className='absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl'
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
        
        <Container className='relative z-10'>
          <motion.div
            className='text-center max-w-3xl mx-auto'
            initial='hidden'
            animate='visible'
            variants={isDesktop ? fadeInUp : {}}
          >
            {/* Badge - Real company data */}
            <motion.div variants={isDesktop ? fadeInUp : {}}>
              <Badge className='mb-4 sm:mb-6 bg-white/20 text-white border-white/30 text-xs sm:text-sm'>
                {isMobile ? '🏆 Mais de 3 milhões m² aplicados' : '🏆 Mais de 10 anos no mercado - Mais de 3 milhões m² aplicados com suporte técnico especializado'}
              </Badge>
            </motion.div>
            
            {/* Title - Mobile-optimized hierarchy */}
            <motion.h1 
              className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight'
              variants={isDesktop ? fadeInUp : {}}
            >
              Argamassa Polimérica
              <span className='block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mt-1 sm:mt-2'>
                Hiperliga
              </span>
            </motion.h1>
            
            {/* Description - Real product benefits */}
            <motion.p 
              className='text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed'
              variants={isDesktop ? fadeInUp : {}}
            >
              {isMobile 
                ? 'Argamassa 3x mais rápida com até 35% de economia. Pronta para uso: 1 bisnaga de 3kg equivale a 60kg de cimento tradicional.'
                : 'Argamassa polimérica 100% sustentável: 0% água, areia, cimento e cal. Pronta para uso - 1 bisnaga de 3kg equivale a 60kg de cimento tradicional. Aplicação 3x mais rápida com até 35% de economia.'
              }
            </motion.p>
            
            {/* CTAs - Mobile-first approach */}
            <motion.div 
              className='flex flex-col gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-none mx-auto sm:flex-row'
              variants={isDesktop ? fadeInUp : {}}
            >
              <a 
                href='https://wa.me/5541988883365?text=Olá! Vi o site da Hiperliga e gostaria de conhecer melhor a argamassa polimérica que economiza até 35% na obra.' 
                className='w-full sm:w-auto'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button size={isMobile ? 'lg' : 'xl'} variant='luxury' className='w-full text-white shadow-luxury'>
                  Economize até 35% na sua obra
                  <ArrowRightIcon className='ml-2 h-4 w-4 sm:h-5 sm:w-5' />
                </Button>
              </a>
              
              {/* Secondary CTA - Hidden on mobile, shows on tablet+ */}
              {!isMobile && (
                <Button size={isTablet ? 'lg' : 'xl'} variant='glass' onClick={() => {
                  const videoSection = document.getElementById('video-section')
                  videoSection?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  <PlayIcon className='mr-2 h-4 w-4 sm:h-5 sm:w-5' />
                  Ver Demonstração
                </Button>
              )}
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Enhanced Benefits Section with Progressive Disclosure */}
      <BenefitsProgressiveSection 
        variant="detailed"
        showTechnicalSpecs={true}
        initialBenefits={4}
        className="py-16 lg:py-24"
      />

      {/* Professional Showcase Section - Optimized Based on Gemini Analysis */}
      <Section className='bg-white dark:bg-gray-900'>
        <Container>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center'>
            
            {/* Left Column: Content & CTAs (7/12 width) */}
            <motion.div 
              className='md:col-span-7'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4'>
                O Futuro da Construção: Mais Rápido, Mais Forte, Mais Sustentável.
              </h2>
              <p className='text-lg text-muted-foreground mb-6 leading-relaxed'>
                Desenvolvida com mais de 10 anos de experiência em construção civil, mineração e química. A Hiperliga une tecnologia avançada para criar argamassas que tornam sua obra mais prática, rápida e econômica.
              </p>
              
              {/* Key Benefits List */}
              <ul className='space-y-4 mb-8'>
                <li className='flex items-center'>
                  <RocketLaunchIcon className='w-6 h-6 text-brand-primary mr-3' />
                  <span className='text-foreground font-medium'>Até 3x mais rápida na aplicação</span>
                </li>
                <li className='flex items-center'>
                  <GlobeAmericasIcon className='w-6 h-6 text-sustainable-600 mr-3' />
                  <span className='text-foreground font-medium'>Redução de 21x no consumo de água</span>
                </li>
                <li className='flex items-center'>
                  <CheckBadgeIcon className='w-6 h-6 text-brand-accent mr-3' />
                  <span className='text-foreground font-medium'>Alto rendimento: 20m² por balde de 3kg</span>
                </li>
                <li className='flex items-center'>
                  <CurrencyDollarIcon className='w-6 h-6 text-yellow-600 mr-3' />
                  <span className='text-foreground font-medium'>Economia de até 35% nos custos finais</span>
                </li>
              </ul>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
                <Link href='/produtos/hiperliga'>
                  <Button size='lg' variant='sustainable' className='w-full sm:w-auto shadow-glow-green'>
                    <SparklesIcon className='mr-2 h-5 w-5' />
                    Ver Especificações Técnicas
                  </Button>
                </Link>
                <Button 
                  size='lg' 
                  variant='outline' 
                  className='w-full sm:w-auto'
                  onClick={() => {
                    const videoSection = document.getElementById('video-section')
                    videoSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <PlayIcon className='mr-2 h-5 w-5' />
                  Assistir Aplicação
                </Button>
              </div>
              
              {/* Professional Stats */}
              <div className='mt-8 pt-8 border-t border-border'>
                <div className='flex flex-wrap items-center gap-6 text-sm text-muted-foreground'>
                  <div className='flex items-center'>
                    <BuildingOffice2Icon className='w-4 h-4 mr-2 text-brand-primary' />
                    <span><strong className='text-foreground'>Mais de 3 milhões m²</strong> aplicados</span>
                  </div>
                  <div className='flex items-center'>
                    <CheckBadgeIcon className='w-4 h-4 mr-2 text-sustainable-600' />
                    <span><strong className='text-foreground'>Mais de 10 anos</strong> de experiência</span>
                  </div>
                  <div className='flex items-center'>
                    <SparklesIcon className='w-4 h-4 mr-2 text-brand-accent' />
                    <span><strong className='text-foreground'>Suporte técnico</strong> especializado</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Professional Image (5/12 width) */}
            <motion.div 
              className='md:col-span-5'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
            >
              <div className='relative rounded-2xl overflow-hidden shadow-2xl group'>
                <div className='aspect-[4/5] relative'>
                  <OptimizedImage
                    src="/images/02_hero/hero-product-application.jpeg"
                    alt="Aplicação profissional da Hiperliga em obra - demonstração de qualidade e eficiência"
                    category="hero"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    priority
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"
                    style={{
                      backgroundImage: 'url("https://hiperliga.com.br/wp-content/uploads/2025/04/01.webp")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                  
                  {/* Overlay Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className='bg-white/90 text-brand-primary border-0 shadow-lg'>
                      Aplicação Profissional
                    </Badge>
                  </div>
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-1">Hiperliga em Ação</h3>
                    <p className="text-sm opacity-90">Resultados comprovados em campo</p>
                  </div>
                </div>
              </div>
              
              {/* Additional Visual Element */}
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Obra executada com suporte técnico Gran Finelle
                </p>
              </div>
            </motion.div>

          </div>
        </Container>
      </Section>

      {/* About Solution Section */}
      <Section className='bg-muted/30'>
        <Container>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Badge className='mb-4'>Sobre a Solução</Badge>
              <h2 className='text-3xl md:text-4xl font-bold mb-6'>
                Conheça a Hiperliga
              </h2>
              <p className='text-lg text-muted-foreground mb-6 leading-relaxed'>
                A Hiperliga® é uma argamassa polimérica de alto desempenho, pronta para uso, 
                desenvolvida pela Hiperliga Materiais para Construção Ltda com base na vasta experiência 
                nas áreas da construção civil, mineração e química.
              </p>
              <p className='text-lg text-muted-foreground mb-8 leading-relaxed'>
                Produto tecnológico à base de mistura homogênea de agregados minerais com granulometria 
                controlada e aditivos químicos. 100% sustentável na fabricação e aplicação: 
                0% de água, 0% de areia, 0% de cimento e 0% de cal.
              </p>
              
              <div className='space-y-4 mb-8'>
                <div className='flex items-center gap-3'>
                  <CheckBadgeIcon className='h-6 w-6 text-green-600' />
                  <span>Mais de 10 anos de experiência - Mais de 3 milhões m² aplicados</span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckBadgeIcon className='h-6 w-6 text-green-600' />
                  <span>Suporte técnico especializado em todas as aplicações</span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckBadgeIcon className='h-6 w-6 text-green-600' />
                  <span>Imediata colagem e endurecimento de superfícies</span>
                </div>
              </div>
              
              <Link href='/produtos/hiperliga'>
                <Button size='lg' variant='sustainable' className='shadow-glow-green'>
                  Conheça mais sobre a Hiperliga
                  <ArrowRightIcon className='ml-2 h-5 w-5' />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              className='relative'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <div className='relative aspect-video lg:aspect-square rounded-2xl overflow-hidden group'>
                <Image
                  src='/images/02_hero/construction-demo-01.webp'
                  alt='Aplicação da Hiperliga em obra - cena de construção real'
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-700'
                  sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px'
                  priority
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                
                {/* Multiple metrics overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-black/50 p-4 md:p-6">
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerChildren}
                  >
                    <motion.div 
                      className="text-center text-white"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BuildingOffice2Icon className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 text-green-400" />
                      <div className="text-xl md:text-2xl font-bold">+3M</div>
                      <div className="text-[10px] md:text-xs uppercase tracking-wider opacity-90">m² construídos</div>
                    </motion.div>
                    
                    <motion.div 
                      className="text-center text-white"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckBadgeIcon className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 text-blue-400" />
                      <div className="text-xl md:text-2xl font-bold">10+</div>
                      <div className="text-[10px] md:text-xs uppercase tracking-wider opacity-90">anos mercado</div>
                    </motion.div>
                    
                    <motion.div 
                      className="text-center text-white col-span-2 md:col-span-1"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <GlobeAmericasIcon className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 text-cyan-400" />
                      <div className="text-xl md:text-2xl font-bold">21x</div>
                      <div className="text-[10px] md:text-xs uppercase tracking-wider opacity-90">menos água</div>
                    </motion.div>
                    
                    <motion.div 
                      className="text-center text-white"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CurrencyDollarIcon className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 text-yellow-400" />
                      <div className="text-xl md:text-2xl font-bold">35%</div>
                      <div className="text-[10px] md:text-xs uppercase tracking-wider opacity-90">economia</div>
                    </motion.div>
                    
                    <motion.div 
                      className="text-center text-white"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <SparklesIcon className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 text-green-400" />
                      <div className="text-xl md:text-2xl font-bold">100%</div>
                      <div className="text-[10px] md:text-xs uppercase tracking-wider opacity-90">sustentável</div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Products Section */}
      <Section>
        <Container>
          <motion.div
            className='text-center mb-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Nossa Linha de Produtos
            </h2>
            <p className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto'>
              Soluções completas para todas as etapas da sua construção
            </p>
          </motion.div>
          
          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            <motion.div variants={scaleIn}>
              <ProductExpandableCard
                title="Hiperliga"
                keyBenefit="Argamassa polimérica 100% sustentável - 3x mais rápida"
                image="/images/official/hiperliga-1.png"
                price="A partir de R$ 89,90"
                specifications={[
                  { label: "Rendimento", value: "20m²/balde 3kg", highlight: true },
                  { label: "Equivalência", value: "1 bisnaga = 60kg", highlight: true },
                  { label: "Tempo de cura", value: "72 horas" },
                  { label: "Economia de água", value: "21x menor" },
                  { label: "Durabilidade", value: "25+ anos" },
                  { label: "Resistência", value: "40 MPa" }
                ]}
                applications={[
                  "Assentamento de pisos",
                  "Revestimento de paredes",
                  "Reparos estruturais",
                  "Regularização",
                  "Uso interno e externo"
                ]}
                benefits={[
                  "100% sustentável - 0% água, areia, cimento e cal",
                  "Aplicação 3x mais rápida que métodos tradicionais",
                  "Alto rendimento - até 20m² por balde de 3kg",
                  "Aderência superior em múltiplas superfícies",
                  "Redução de até 35% nos custos finais"
                ]}
                technicalDetails="Produto tecnológico à base de mistura homogênea de agregados minerais com granulometria controlada e aditivos químicos. Desenvolvida com mais de 10 anos de experiência em construção civil, mineração e química."
                onLearnMore={() => window.location.href = '/produtos/hiperliga'}
              />
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <ProductExpandableCard
                title="Texturas"
                keyBenefit="Acabamento rústico texturizado para interno e externo"
                image="/images/03_products/grafiato-textura-rustica.webp"
                price="A partir de R$ 45,90"
                specifications={[
                  { label: "Rendimento", value: "7-10m²/25kg", highlight: true },
                  { label: "Granulometria", value: "Controlada" },
                  { label: "Aplicação", value: "Rolo/Pincel" },
                  { label: "Secagem", value: "4-6 horas" },
                  { label: "Diluição", value: "Até 10% água" }
                ]}
                applications={[
                  "Paredes internas",
                  "Fachadas externas",
                  "Acabamentos decorativos",
                  "Sobre massa corrida",
                  "Ambientes residenciais"
                ]}
                benefits={[
                  "Efeito texturizado rústico único",
                  "Excelente cobertura e uniformidade",
                  "Resistente às intempéries",
                  "Fácil aplicação com rolo ou pincel",
                  "Boa durabilidade em ambientes externos"
                ]}
                technicalDetails="Revestimento texturizado pronto para uso, ideal para criação de efeitos decorativos em paredes internas e externas."
                onLearnMore={() => window.location.href = '/produtos/texturas'}
              />
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <ProductExpandableCard
                title="Grafiatos"
                keyBenefit="Revestimento acrílico texturizado de alta durabilidade"
                image="/images/03_products/grafiato-acrilico-riscado.webp"
                price="A partir de R$ 52,90"
                specifications={[
                  { label: "Base", value: "Acrílica", highlight: true },
                  { label: "Efeito", value: "Impermeável" },
                  { label: "Durabilidade", value: "10+ anos" },
                  { label: "Aplicação", value: "Rolo/Desempenadeira" },
                  { label: "Cores", value: "Múltiplas opções" }
                ]}
                applications={[
                  "Fachadas residenciais",
                  "Edifícios comerciais",
                  "Muros e paredes externas",
                  "Ambientes de alta umidade",
                  "Proteção impermeável"
                ]}
                benefits={[
                  "Alta resistência às intempéries",
                  "Efeito impermeável natural",
                  "Durabilidade superior a 10 anos",
                  "Proteção contra fungos e mofo",
                  "Múltiplas opções de textura e cor"
                ]}
                technicalDetails="Revestimento acrílico texturizado formulado para máxima resistência e proteção em ambientes externos severos."
                onLearnMore={() => window.location.href = '/produtos/grafiatos'}
              />
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <ProductExpandableCard
                title="Tintas"
                keyBenefit="Tintas profissionais com ação anti-mofo"
                image="/images/03_products/tinta-emborrachada.webp"
                price="A partir de R$ 78,90"
                specifications={[
                  { label: "Rendimento", value: "300m²/18L", highlight: true },
                  { label: "Cobertura", value: "Excelente" },
                  { label: "Anti-mofo", value: "Ação fungicida" },
                  { label: "Lavabilidade", value: "Superior" },
                  { label: "Acabamento", value: "Fosco/Acetinado" }
                ]}
                applications={[
                  "Paredes internas",
                  "Áreas úmidas",
                  "Ambientes comerciais",
                  "Sobre massa corrida",
                  "Repintura"
                ]}
                benefits={[
                  "Alto rendimento - até 300m² por demão",
                  "Ação anti-mofo e anti-fungos",
                  "Excelente cobertura e nivelamento",
                  "Lavabilidade superior",
                  "Secagem rápida e uniforme"
                ]}
                technicalDetails="Tinta profissional formulada com tecnologia anti-mofo para máxima proteção e durabilidade em ambientes internos."
                onLearnMore={() => window.location.href = '/produtos/tintas'}
              />
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Video Section - Enhanced Modern Design */}
      <Section id='video-section' className='bg-gradient-to-br from-muted/20 via-muted/30 to-muted/50 relative overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 bg-[url("/images/patterns/dot-pattern.svg")] opacity-30' />
        <div className='absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent' />
        
        <Container className='relative z-10'>
          <motion.div
            className='text-center mb-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Badge className='mb-6 bg-brand-primary/10 text-brand-primary border-brand-primary/20'>
              🎥 Demonstração Exclusiva
            </Badge>
            <h2 className='text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent'>
              Veja a Hiperliga em Ação
            </h2>
            <p className='text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
              Assista à demonstração prática que comprova a eficiência revolucionária da nossa tecnologia
            </p>
          </motion.div>
          
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center'>
            {/* Main Video Player */}
            <motion.div
              className='lg:col-span-8'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <div className='relative group'>
                <div className='absolute -inset-4 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity' />
                <div className='relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl'>
                  {!isVideoLoading && !videoError ? (
                    <>
                      <Image
                        src='/images/hero/comparison-visual.webp'
                        alt='Demonstração Hiperliga - comparativo visual antes e depois'
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-700'
                        sizes='(max-width: 1024px) 100vw, 70vw'
                        priority
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40' />
                      
                      {/* Play Button with Enhanced Design */}
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className='relative'
                        >
                          {/* Pulsing rings */}
                          <div className='absolute inset-0 rounded-full bg-white/20 animate-ping' />
                          <div className='absolute inset-2 rounded-full bg-white/10 animate-pulse' />
                          
                          <Button
                            size='xl'
                            className='bg-white/95 hover:bg-white text-brand-primary shadow-2xl backdrop-blur-sm h-20 w-20 rounded-full p-0 group-hover:shadow-3xl transition-all duration-300'
                            onClick={handleVideoPlay}
                          >
                            <PlayIcon className='h-8 w-8 ml-1' />
                          </Button>
                        </motion.div>
                      </div>
                      
                      {/* Video Info Overlay */}
                      <div className='absolute bottom-6 left-6 right-6'>
                        <div className='bg-black/60 backdrop-blur-md rounded-xl p-4'>
                          <h3 className='text-white font-bold text-lg mb-1'>Comparativo: Hiperliga vs. Tradicional</h3>
                          <p className='text-white/80 text-sm'>Veja a diferença na prática • 3:45 min</p>
                        </div>
                      </div>
                    </>
                  ) : isVideoLoading ? (
                    <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10'>
                      <div className='text-center'>
                        <div className='w-16 h-16 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mx-auto mb-4' />
                        <p className='text-brand-primary font-medium'>Preparando demonstração...</p>
                      </div>
                    </div>
                  ) : (
                    <div className='relative w-full h-full bg-black'>
                      {/* Placeholder for actual video - ready for integration */}
                      <div className='absolute inset-0 flex items-center justify-center text-white'>
                        <div className='text-center'>
                          <PlayIcon className='h-16 w-16 mx-auto mb-4 opacity-50' />
                          <p className='text-lg'>Vídeo será carregado aqui</p>
                          <p className='text-sm opacity-70'>Espaço preparado para integração</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* Side Panel with Video Benefits */}
            <motion.div
              className='lg:col-span-4'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp}>
                <h3 className='text-2xl font-bold mb-6'>O que você verá:</h3>
                
                <div className='space-y-6'>
                  <motion.div 
                    className='flex items-start gap-4'
                    variants={fadeInUp}
                    whileHover={{ x: 4 }}
                  >
                    <div className='w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0'>
                      <RocketLaunchIcon className='w-5 h-5 text-green-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold mb-1'>Aplicação 3x Mais Rápida</h4>
                      <p className='text-sm text-muted-foreground'>Comparativo lado a lado com método tradicional</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className='flex items-start gap-4'
                    variants={fadeInUp}
                    whileHover={{ x: 4 }}
                  >
                    <div className='w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0'>
                      <GlobeAmericasIcon className='w-5 h-5 text-blue-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold mb-1'>Sustentabilidade Real</h4>
                      <p className='text-sm text-muted-foreground'>Demonstração do processo sem água</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className='flex items-start gap-4'
                    variants={fadeInUp}
                    whileHover={{ x: 4 }}
                  >
                    <div className='w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0'>
                      <CurrencyDollarIcon className='w-5 h-5 text-yellow-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold mb-1'>Economia Comprovada</h4>
                      <p className='text-sm text-muted-foreground'>Cálculo real de redução de custos</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className='flex items-start gap-4'
                    variants={fadeInUp}
                    whileHover={{ x: 4 }}
                  >
                    <div className='w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0'>
                      <SparklesIcon className='w-5 h-5 text-purple-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold mb-1'>Qualidade Superior</h4>
                      <p className='text-sm text-muted-foreground'>Testes de resistência e durabilidade</p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Call to Action */}
                <motion.div 
                  className='mt-8 p-6 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-xl border border-brand-primary/20'
                  variants={fadeInUp}
                >
                  <h4 className='font-bold mb-2'>Quer ver na sua obra?</h4>
                  <p className='text-sm text-muted-foreground mb-4'>Agende uma demonstração presencial gratuita</p>
                  <Button size='sm' className='w-full'>
                    Agendar Demonstração
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Video Thumbnails/Related Content */}
          <motion.div
            className='mt-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
          >
            <h3 className='text-xl font-bold mb-8 text-center'>Mais Conteúdo Exclusivo</h3>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[
                {
                  title: 'Tutorial de Aplicação',
                  description: 'Passo a passo completo',
                  duration: '8:30',
                  thumbnail: '/images/hero/comparison-visual.webp'
                },
                {
                  title: 'Casos de Sucesso',
                  description: 'Depoimentos reais de clientes',
                  duration: '5:15', 
                  thumbnail: '/images/hero/comparison-visual.webp'
                },
                {
                  title: 'Testes de Laboratório',
                  description: 'Validação científica',
                  duration: '12:45',
                  thumbnail: '/images/hero/comparison-visual.webp'
                }
              ].map((video, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className='group cursor-pointer'
                  whileHover={{ y: -4 }}
                >
                  <Card className='overflow-hidden hover:shadow-lg transition-all duration-300'>
                    <div className='relative aspect-video bg-muted'>
                      <div className='absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20' />
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <PlayIcon className='w-8 h-8 text-white opacity-80' />
                      </div>
                      <div className='absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded'>
                        {video.duration}
                      </div>
                    </div>
                    <div className='p-4'>
                      <h4 className='font-semibold mb-1 group-hover:text-brand-primary transition-colors'>
                        {video.title}
                      </h4>
                      <p className='text-sm text-muted-foreground'>{video.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Calculator Section - Interest Stage CTA */}
      <InterestCTASection
        page="home"
        customContent={{
          title: "Calcule Sua Economia Real",
          subtitle: "Veja exatamente quanto você pode economizar com Hiperliga no seu projeto"
        }}
        className="bg-gradient-to-br from-green-600 to-emerald-800"
      />

      {/* Interactive Stats Section */}
      <Section id='stats-section'>
        <Container>
          <motion.div
            className='text-center mb-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Números que Impressionam
            </h2>
            <p className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto'>
              Resultados comprovados que demonstram a eficácia da nossa solução
            </p>
          </motion.div>
          
          <InteractiveStats
            variant="card"
            columns={4}
            showTooltips={true}
            animateOnView={true}
            stagger={true}
            stats={[
              {
                value: 3,
                label: "m² aplicados",
                description: "com suporte técnico especializado",
                icon: <BuildingOffice2Icon className="w-6 h-6" />,
                prefix: "+",
                suffix: "M",
                animate: true,
                color: "brand-primary",
                hoverDetails: {
                  title: "Mais de 3 milhões de m² aplicados",
                  description: "Nossa experiência de mais de 10 anos no mercado resultou em mais de 3 milhões de metros quadrados aplicados com sucesso, sempre com suporte técnico especializado.",
                  metrics: [
                    { label: "Projetos concluídos", value: "500+" },
                    { label: "Clientes atendidos", value: "200+" },
                    { label: "Taxa de satisfação", value: "98%" }
                  ]
                }
              },
              {
                value: 3,
                label: "mais rápida",
                description: "na aplicação vs. tradicional",
                icon: <RocketLaunchIcon className="w-6 h-6" />,
                suffix: "x",
                animate: true,
                color: "green-600",
                hoverDetails: {
                  title: "Aplicação 3x mais rápida",
                  description: "A tecnologia polimérica da Hiperliga permite aplicação direta sem necessidade de preparação, mistura ou cura prolongada, resultando em velocidade 3x superior.",
                  metrics: [
                    { label: "Tempo de preparo", value: "0 min" },
                    { label: "Tempo de cura", value: "72h vs 7-28 dias" },
                    { label: "Produtividade", value: "+200%" }
                  ]
                }
              },
              {
                value: 35,
                label: "de economia",
                description: "nos custos finais da obra",
                icon: <CurrencyDollarIcon className="w-6 h-6" />,
                suffix: "%",
                animate: true,
                color: "yellow-600",
                hoverDetails: {
                  title: "Até 35% de economia",
                  description: "O alto rendimento da Hiperliga (20m²/balde de 3kg) combinado com a redução de tempo de obra proporciona economia substancial nos custos finais.",
                  metrics: [
                    { label: "Redução material", value: "60%" },
                    { label: "Redução mão de obra", value: "40%" },
                    { label: "Redução tempo total", value: "50%" }
                  ]
                }
              },
              {
                value: 21,
                label: "menos água",
                description: "redução no consumo de água",
                icon: <GlobeAmericasIcon className="w-6 h-6" />,
                suffix: "x",
                animate: true,
                color: "blue-600",
                hoverDetails: {
                  title: "21x menos água consumida",
                  description: "A tecnologia polimérica elimina praticamente o uso de água durante aplicação, contribuindo significativamente para sustentabilidade e preservação de recursos naturais.",
                  metrics: [
                    { label: "Água economizada", value: "95%" },
                    { label: "Impacto ambiental", value: "-90%" },
                    { label: "Sustentabilidade", value: "100%" }
                  ]
                }
              }
            ]}
          />
        </Container>
      </Section>

      {/* Testimonials Section */}
      <TestimonialsSection 
        data={depoimentosData} 
        showStats={false} 
        autoPlay={true} 
        autoPlayInterval={6000}
        className="py-16 lg:py-24"
      />

      {/* Decision Stage CTA - High Converting Final Section */}
      <DecisionCTASection
        page="home"
        customContent={{
          title: "Pronto para Revolucionar Sua Obra?",
          subtitle: "Junte-se a mais de 3 milhões de m² construídos com Hiperliga. Solicite seu orçamento agora."
        }}
        className="py-20"
      />

      {/* Floating CTA - Always visible for immediate contact */}
      <FloatingCTA 
        position="bottom-right"
        showExitIntent={true}
        autoHide={false}
      />
    </div>
  )
}