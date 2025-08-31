'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon,
  SwatchIcon,
  ArrowLeftIcon,
  SparklesIcon,
  PaintBrushIcon,
  CubeIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
}

export default function GrafiatosPage() {
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
            <span className="text-foreground">Grafiatos</span>
          </div>
        </Container>
      </Section>

      {/* Hero Section */}
      <Section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary text-white">
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <Link href="/produtos" className="inline-flex items-center gap-2 mb-6 text-white/90 hover:text-white">
                <ArrowLeftIcon className="h-4 w-4" />
                Voltar aos Produtos
              </Link>
              
              <Badge className="mb-6 bg-white/20 text-white border-white/30">
                ✨ Efeitos Decorativos
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Grafiatos</h1>
              
              <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
                Revestimentos decorativos com efeitos únicos e acabamento profissional. 
                Crie ambientes sofisticados com nossa tecnologia exclusiva.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                  Solicitar Orçamento
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Ver Galeria
                </Button>
              </div>
            </motion.div>
            
            <motion.div className="relative" initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/03_products/hiperliga/desempenho-e-durabilidade-usar-1024x1024-optimized.webp"
                  alt="Grafiatos Gran Finelle"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Features */}
      <Section>
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <Card className="p-6 text-center">
              <SparklesIcon className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Efeitos Únicos</h3>
              <p className="text-muted-foreground">Crie efeitos visuais impressionantes com nossa tecnologia exclusiva.</p>
            </Card>
            
            <Card className="p-6 text-center">
              <PaintBrushIcon className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Fácil Aplicação</h3>
              <p className="text-muted-foreground">Aplicação simples com rolo ou desempenadeira, resultado profissional garantido.</p>
            </Card>
            
            <Card className="p-6 text-center">
              <CubeIcon className="h-12 w-12 text-brand-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Múltiplas Granulometrias</h3>
              <p className="text-muted-foreground">Variedade de granulometrias para diferentes efeitos e necessidades.</p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <SwatchIcon className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Desperte a Criatividade</h2>
            <p className="text-xl mb-8 text-white/90">
              Explore todas as possibilidades dos nossos grafiatos decorativos
            </p>
            <Link href="/contato">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                <ArrowRightIcon className="mr-2 h-5 w-5" />
                Consultar Especialista
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  )
}