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
import { useBreakpoint } from '@/hooks/use-media-query'

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
            {/* Badge - Simplified for mobile */}
            <motion.div variants={isDesktop ? fadeInUp : {}}>
              <Badge className='mb-4 sm:mb-6 bg-white/20 text-white border-white/30 text-xs sm:text-sm'>
                {isMobile ? '🏆 3M+ m² aplicados' : '🏆 Mais de 10 anos - 3M + m² aplicados com suporte técnico especializado'}
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
            
            {/* Description - Concise for mobile */}
            <motion.p 
              className='text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed'
              variants={isDesktop ? fadeInUp : {}}
            >
              {isMobile 
                ? 'Construa 3x mais rápido com 35% de economia. A solução sustentável e pronta para uso que sua obra precisa.'
                : 'Argamassa polimérica 100% sustentável: 0% água, areia, cimento. Uma bisnaga de 3kg equivale a 60kg de cimento tradicional. Construa 3x mais rápido com 35% de economia.'
              }
            </motion.p>
            
            {/* CTAs - Mobile-first approach */}
            <motion.div 
              className='flex flex-col gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-none mx-auto sm:flex-row'
              variants={isDesktop ? fadeInUp : {}}
            >
              <Link href='/produtos/hiperliga' className='w-full sm:w-auto'>
                <Button size={isMobile ? 'lg' : 'xl'} variant='luxury' className='w-full text-white shadow-luxury'>
                  Conheça a Hiperliga
                  <ArrowRightIcon className='ml-2 h-4 w-4 sm:h-5 sm:w-5' />
                </Button>
              </Link>
              
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

      {/* Benefits Section - Mobile-First Redesigned */}
      <Section>
        <Container>
          <motion.div
            className='text-center mb-8 sm:mb-12 lg:mb-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={isDesktop ? fadeInUp : {}}
          >
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4'>
              Por que escolher a Hiperliga?
            </h2>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto'>
              {isMobile 
                ? 'A escolha inteligente para uma obra mais rápida, econômica e sustentável.'
                : 'Descubra os benefícios que tornam a Hiperliga a escolha inteligente para sua obra'
              }
            </p>
          </motion.div>
          
          {/* Grid: Mobile-first 1 column, then 2, then 4 */}
          <motion.div
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={isDesktop ? staggerChildren : {}}
          >
            <motion.div variants={isDesktop ? scaleIn : {}}>
              <Card variant='sustainable' className={`p-4 sm:p-6 lg:p-8 h-full text-center ${isDesktop ? 'group hover:hover-lift' : ''}`}>
                <div className='mb-4 sm:mb-6 flex justify-center'>
                  <div className={`w-12 h-12 sm:w-16 sm:w-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center bg-green-100 ${isDesktop ? 'group-hover:scale-110 transition-transform duration-300' : ''}`}>
                    <GlobeAmericasIcon className='w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-600' />
                  </div>
                </div>
                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3'>
                  {isMobile ? 'Sustentável' : 'Sustentabilidade Ambiental'}
                </h3>
                <p className='text-xs sm:text-sm lg:text-base text-muted-foreground'>
                  {isMobile 
                    ? '0% água, areia, cimento ou cal'
                    : 'Produzida e aplicada de maneira totalmente sustentável, sem água, areia, cimento ou cal.'
                  }
                </p>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card variant='innovation' hover='lift' className='p-8 h-full text-center group'>
                <div className='mb-6 flex justify-center'>
                  <div className='relative w-20 h-20 rounded-2xl overflow-hidden shadow-glow-blue group-hover:scale-110 group-hover:rotate-3 transition-all duration-500'>
                    <img
                      src="/images/official/versatilidade.png"
                      alt="3x Mais Rápida - Versatilidade e velocidade na aplicação"
                      width={80}
                      height={80}
                      className="object-cover rounded-2xl"
                    />
                  </div>
                </div>
                <h3 className='text-2xl font-bold mb-4 group-hover:text-brand-tech-dark transition-colors'>Praticidade e Pronto para Uso</h3>
                <p className='text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors'>
                  Elimina a necessidade de adicionar água ou aditivos, simplificando o processo de aplicação. Está pronta para ser utilizada diretamente da embalagem.
                </p>
                <div className="absolute top-4 right-4 w-2 h-2 bg-brand-tech-medium rounded-sm opacity-0 group-hover:opacity-60 transition-all duration-700 animate-float" />
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card variant='luxury' hover='premium' className='p-8 h-full text-center group'>
                <div className='mb-6 flex justify-center'>
                  <div className='relative w-20 h-20 rounded-2xl overflow-hidden shadow-premium group-hover:scale-110 group-hover:rotate-3 transition-all duration-500'>
                    <img
                      src="/images/official/economia-de-espaco-e-material-usar.png"
                      alt="Até 35% de Economia - Economia de espaço e material"
                      width={80}
                      height={80}
                      className="object-cover rounded-2xl"
                    />
                  </div>
                </div>
                <h3 className='text-2xl font-bold mb-4 group-hover:text-brand-primary transition-colors'>Economia de Material e Espaço</h3>
                <p className='text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors'>
                  Uma bisnaga de 3kg de Hiperliga equivale a 60kg de cimento tradicional, proporcionando economia substancial de material e espaço.
                </p>
                <div className="absolute inset-0 bg-gradient-to-br from-card/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card variant='glass' hover='float' className='p-8 h-full text-center group'>
                <div className='mb-6 flex justify-center'>
                  <div className='relative w-20 h-20 rounded-2xl overflow-hidden shadow-premium group-hover:scale-110 group-hover:rotate-3 transition-all duration-500'>
                    <img
                      src="/images/official/desempenho-durabilidade.png"
                      alt="Desempenho e Durabilidade Superior - Hiperliga"
                      width={80}
                      height={80}
                      className="object-cover rounded-2xl"
                    />
                  </div>
                </div>
                <h3 className='text-2xl font-bold mb-4 group-hover:text-purple-700 transition-colors'>Desempenho e Durabilidade Superior</h3>
                <p className='text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors'>
                  Graças à sua composição avançada, oferece aderência e durabilidade excepcionais, garantindo resultados de alta qualidade.
                </p>
                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-400 rounded-sm opacity-0 group-hover:opacity-50 transition-all duration-600 animate-float" />
              </Card>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

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
                A Hiperliga é a argamassa polimérica revolucionária desenvolvida para máxima eficiência e responsabilidade ambiental. Reduza prazos de projeto e custos enquanto supera os padrões modernos de sustentabilidade.
              </p>
              
              {/* Key Benefits List */}
              <ul className='space-y-4 mb-8'>
                <li className='flex items-center'>
                  <RocketLaunchIcon className='w-6 h-6 text-brand-primary mr-3' />
                  <span className='text-foreground font-medium'>Até 3x mais rápida na aplicação</span>
                </li>
                <li className='flex items-center'>
                  <GlobeAmericasIcon className='w-6 h-6 text-sustainable-600 mr-3' />
                  <span className='text-foreground font-medium'>21x menos consumo de água</span>
                </li>
                <li className='flex items-center'>
                  <CheckBadgeIcon className='w-6 h-6 text-brand-accent mr-3' />
                  <span className='text-foreground font-medium'>Durabilidade e aderência superiores</span>
                </li>
                <li className='flex items-center'>
                  <CurrencyDollarIcon className='w-6 h-6 text-yellow-600 mr-3' />
                  <span className='text-foreground font-medium'>Até 35% de economia no projeto</span>
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
                    <span><strong className='text-foreground'>+3M m²</strong> construídos</span>
                  </div>
                  <div className='flex items-center'>
                    <CheckBadgeIcon className='w-4 h-4 mr-2 text-sustainable-600' />
                    <span><strong className='text-foreground'>10+ anos</strong> no mercado</span>
                  </div>
                  <div className='flex items-center'>
                    <SparklesIcon className='w-4 h-4 mr-2 text-brand-accent' />
                    <span><strong className='text-foreground'>100%</strong> sustentável</span>
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
                composta por agregados minerais e aditivos químicos. Desenvolvida com tecnologia avançada, 
                ela revoluciona a construção civil ao oferecer mais praticidade, rapidez e economia.
              </p>
              <p className='text-lg text-muted-foreground mb-8 leading-relaxed'>
                Hiperliga une experiência em construção, mineração e química para criar argamassas 
                tecnológicas que tornam sua obra mais prática, rápida e econômica. 100% sustentável 
                na fabricação e na aplicação: 0% de água, 0% de areia, 0% de cimento e 0% de cal.
              </p>
              
              <div className='space-y-4 mb-8'>
                <div className='flex items-center gap-3'>
                  <CheckBadgeIcon className='h-6 w-6 text-green-600' />
                  <span>Mais de 10 anos - 3M + m² aplicados</span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckBadgeIcon className='h-6 w-6 text-green-600' />
                  <span>Suporte técnico e especializado</span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckBadgeIcon className='h-6 w-6 text-green-600' />
                  <span>Certificação de qualidade e sustentabilidade</span>
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
            className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            <motion.div variants={scaleIn}>
              <Link href='/produtos/hiperliga'>
                <Card className='p-6 h-full hover:shadow-lg transition-all duration-300 group cursor-pointer'>
                  <div className='relative aspect-square mb-4 rounded-lg overflow-hidden'>
                    <Image
                      src='/images/official/hiperliga-1.png'
                      alt='Hiperliga'
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px'
                    />
                  </div>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors'>Hiperliga</h3>
                  <p className='text-muted-foreground mb-4 text-sm leading-relaxed'>
                    Argamassa polimérica de alto desempenho, pronta para uso, ideal para assentamento de tijolos e blocos.
                  </p>
                  <div className='flex items-center text-brand-primary font-medium'>
                    <span>Saiba mais</span>
                    <ArrowRightIcon className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                  </div>
                </Card>
              </Link>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Link href='/produtos/texturas'>
                <Card className='p-6 h-full hover:shadow-lg transition-all duration-300 group cursor-pointer'>
                  <div className='relative aspect-square mb-4 rounded-lg overflow-hidden'>
                    <Image
                      src='/images/03_products/grafiato-textura-rustica.webp'
                      alt='Texturas - Grafiato Textura Rústica'
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px'
                    />
                    <div className='absolute top-2 right-2'>
                      <PaintBrushIcon className='h-6 w-6 text-white drop-shadow' />
                    </div>
                  </div>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors'>Texturas</h3>
                  <p className='text-muted-foreground mb-4 text-sm leading-relaxed'>
                    Revestimentos acrílicos texturizados para acabamentos decorativos de paredes internas e externas.
                  </p>
                  <div className='flex items-center text-brand-primary font-medium'>
                    <span>Saiba mais</span>
                    <ArrowRightIcon className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                  </div>
                </Card>
              </Link>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Link href='/produtos/grafiatos'>
                <Card className='p-6 h-full hover:shadow-lg transition-all duration-300 group cursor-pointer'>
                  <div className='relative aspect-square mb-4 rounded-lg overflow-hidden'>
                    <Image
                      src='/images/03_products/grafiato-acrilico-riscado.webp'
                      alt='Grafiatos - Revestimento Acrílico Riscado'
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px'
                    />
                    <div className='absolute top-2 right-2'>
                      <SwatchIcon className='h-6 w-6 text-white drop-shadow' />
                    </div>
                  </div>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors'>Grafiatos</h3>
                  <p className='text-muted-foreground mb-4 text-sm leading-relaxed'>
                    Grafiato acrílico riscado, revestimento texturizado decorativo para paredes com efeito rústico.
                  </p>
                  <div className='flex items-center text-brand-primary font-medium'>
                    <span>Saiba mais</span>
                    <ArrowRightIcon className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                  </div>
                </Card>
              </Link>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Link href='/produtos/tintas'>
                <Card className='p-6 h-full hover:shadow-lg transition-all duration-300 group cursor-pointer'>
                  <div className='relative aspect-square mb-4 rounded-lg overflow-hidden'>
                    <Image
                      src='/images/03_products/tinta-emborrachada.webp'
                      alt='Tintas - Tinta Emborrachada'
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px'
                    />
                    <div className='absolute top-2 right-2'>
                      <BuildingOffice2Icon className='h-6 w-6 text-white drop-shadow' />
                    </div>
                  </div>
                  <h3 className='text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors'>Tintas</h3>
                  <p className='text-muted-foreground mb-4 text-sm leading-relaxed'>
                    Tintas acrílicas e emborrachadas com alta resistência e flexibilidade para superfícies internas e externas.
                  </p>
                  <div className='flex items-center text-brand-primary font-medium'>
                    <span>Saiba mais</span>
                    <ArrowRightIcon className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                  </div>
                </Card>
              </Link>
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

      {/* Stats Section */}
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
          
          <motion.div
            className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
          >
            <motion.div variants={scaleIn}>
              <Card className='p-8 text-center hover:shadow-lg transition-shadow'>
                <div className='text-4xl lg:text-5xl font-bold text-brand-primary mb-2'>
                  +{squareMeters}M
                </div>
                <div className='text-sm uppercase tracking-wider text-muted-foreground font-medium'>
                  m² aplicados
                </div>
                <div className='text-xs text-muted-foreground mt-2'>
                  com sucesso comprovado
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card className='p-8 text-center hover:shadow-lg transition-shadow'>
                <div className='text-4xl lg:text-5xl font-bold text-brand-primary mb-2'>
                  {speedMultiplier}x
                </div>
                <div className='text-sm uppercase tracking-wider text-muted-foreground font-medium'>
                  mais rápida
                </div>
                <div className='text-xs text-muted-foreground mt-2'>
                  que métodos tradicionais
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card className='p-8 text-center hover:shadow-lg transition-shadow'>
                <div className='text-4xl lg:text-5xl font-bold text-brand-primary mb-2'>
                  {savings}%
                </div>
                <div className='text-sm uppercase tracking-wider text-muted-foreground font-medium'>
                  de economia
                </div>
                <div className='text-xs text-muted-foreground mt-2'>
                  em custos de material
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={scaleIn}>
              <Card className='p-8 text-center hover:shadow-lg transition-shadow'>
                <div className='text-4xl lg:text-5xl font-bold text-brand-primary mb-2'>
                  {waterSavings}x
                </div>
                <div className='text-sm uppercase tracking-wider text-muted-foreground font-medium'>
                  menos água
                </div>
                <div className='text-xs text-muted-foreground mt-2'>
                  Consumo 21x menor de água
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Final CTA Section - Optimized Layout Based on Gemini Analysis */}
      <Section className='bg-gradient-to-br from-brand-primary to-brand-secondary py-16 sm:py-24'>
        <Container>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-x-12 gap-y-12 items-center'>
            
            {/* Section 1: Primary CTA (Lead Generation) - 60% width */}
            <motion.div 
              className='lg:col-span-3 text-center lg:text-left'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4'>
                Construa o futuro com Hiperliga.
              </h2>
              <p className='text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 mb-8'>
                Receba uma proposta detalhada para o seu projeto. Nossos especialistas estão prontos para ajudar você a integrar a construção sustentável em sua próxima obra.
              </p>
              
              <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-x-6 gap-y-4'>
                <Link href='/contato?orcamento=true'>
                  <Button 
                    size='xl' 
                    className='bg-white hover:bg-gray-100 text-brand-primary shadow-lg hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-white transition-all duration-300 w-full sm:w-auto font-bold'
                  >
                    Solicitar Orçamento
                  </Button>
                </Link>
                
                <a 
                  href='tel:+5511999998888' 
                  className='inline-flex items-center text-base font-medium text-white hover:text-white/80 w-full sm:w-auto justify-center transition-colors'
                >
                  <svg className='w-5 h-5 mr-2' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z' />
                  </svg>
                  Ligar agora
                </a>
              </div>
            </motion.div>

            {/* Section 2: Secondary CTA (Newsletter Signup) - 40% width */}
            <motion.div 
              className='lg:col-span-2'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <div className='bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20'>
                <h3 className='font-bold text-white text-xl mb-1'>Fique por dentro</h3>
                <p className='text-white/80 text-sm mb-6'>
                  Assine nossa newsletter para receber estudos de caso, inovações e notícias do setor.
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className='flex flex-col gap-4'>
                  <div>
                    <label htmlFor='email-address' className='sr-only'>Email</label>
                    <input 
                      type='email' 
                      name='email-address' 
                      id='email-address' 
                      autoComplete='email' 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className='w-full px-4 py-3 rounded-md bg-white/95 text-gray-900 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-accent placeholder-gray-500'
                      placeholder='seu.email@empresa.com'
                    />
                  </div>
                  <Button 
                    type='submit'
                    className='w-full px-4 py-3 rounded-md bg-brand-accent hover:bg-hiperliga-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-accent transition-colors'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Inscrevendo...' : 'Inscrever-se'}
                  </Button>
                </form>
                
                <p className='text-xs text-white/60 mt-4 text-center'>
                  Nós respeitamos sua privacidade. Sem spam.
                </p>
                
                {submitMessage && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    submitMessage.includes('sucesso') ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </Container>
      </Section>
    </div>
  )
}