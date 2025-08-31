'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  TrophyIcon,
  GlobeAmericasIcon,
  SparklesIcon,
  CheckCircleIcon
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

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } }
}

export default function AboutPage() {
  const milestones = [
    {
      year: "2008",
      title: "Fundação da Gran Finelle",
      description: "Início das atividades focadas em revestimentos para construção civil"
    },
    {
      year: "2015",
      title: "Desenvolvimento da Hiperliga",
      description: "Criação da argamassa polimérica revolucionária"
    },
    {
      year: "2018",
      title: "Lançamento Comercial",
      description: "Hiperliga entra oficialmente no mercado"
    },
    {
      year: "2023",
      title: "3 Milhões de m²",
      description: "Marco histórico de área construída com Hiperliga"
    }
  ]

  const values = [
    {
      icon: SparklesIcon,
      title: "Inovação",
      description: "Desenvolvemos soluções tecnológicas que revolucionam a construção civil"
    },
    {
      icon: GlobeAmericasIcon,
      title: "Sustentabilidade", 
      description: "Compromisso com o meio ambiente em todos os nossos produtos"
    },
    {
      icon: TrophyIcon,
      title: "Qualidade",
      description: "Excelência em produtos e serviços, superando expectativas"
    }
  ]

  return (
    <div className="overflow-x-hidden">
      {/* Breadcrumb */}
      <Section className="py-4 border-b">
        <Container>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">Sobre Nós</span>
          </div>
        </Container>
      </Section>

      {/* Hero Section */}
      <Section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary text-white">
        <Container className="relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              🏢 Gran Finelle
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Sobre a Empresa</h1>
            
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
              Com mais de 15 anos no mercado de construção civil, a Gran Finelle orgulha-se 
              em oferecer produtos inovadores e sustentáveis que revolucionam o modo de construir.
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* Company Story */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Nossa História</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Fundada em 2008 em Almirante Tamandaré, Paraná, a Gran Finelle nasceu 
                com o propósito de transformar a indústria da construção civil através 
                da inovação e sustentabilidade.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Nossa jornada começou com o desenvolvimento de revestimentos de alta 
                qualidade, sempre buscando soluções que oferecessem maior eficiência 
                e menor impacto ambiental.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                O marco definitivo veio com o desenvolvimento da Hiperliga, uma 
                argamassa polimérica que elimina completamente o uso de água, areia, 
                cimento e cal, representando uma verdadeira revolução no setor.
              </p>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Card className="p-8 bg-muted/50">
                <BuildingOffice2Icon className="h-16 w-16 text-brand-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4">Nossa Sede</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Rua Antônio Camargo, 122 – Areias</p>
                  <p>Almirante Tamandaré - PR</p>
                  <p>CEP 83514-140</p>
                  <p className="pt-2">Telefones:</p>
                  <p>(41) 98522-0746</p>
                  <p>(41) 99501-5557</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Mission, Vision, Values */}
      <Section className="bg-muted/30">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Missão, Visão e Valores</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Os pilares que guiam nossa empresa na criação de soluções inovadoras
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
            >
              <Card className="p-8 h-full">
                <h3 className="text-2xl font-bold mb-4 text-brand-primary">Missão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Desenvolver e fornecer soluções inovadoras e sustentáveis para a 
                  construção civil, contribuindo para um futuro mais eficiente e 
                  ambientalmente responsável.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
            >
              <Card className="p-8 h-full">
                <h3 className="text-2xl font-bold mb-4 text-brand-primary">Visão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ser reconhecida como a empresa líder em inovação sustentável 
                  para construção civil no Brasil, transformando a indústria 
                  através de produtos revolucionários.
                </p>
              </Card>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="p-6 text-center h-full">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-sm bg-brand-primary/10">
                        <IconComponent className="h-8 w-8 text-brand-primary" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                    <p className="text-muted-foreground">{value.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section>
        <Container>
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossa Trajetória</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Marcos importantes que definiram nossa jornada de inovação
            </p>
          </motion.div>

          <motion.div
            className="relative max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-primary/20 hidden md:block" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className="relative flex items-start gap-6"
                  variants={scaleIn}
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-brand-primary rounded-sm flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                  
                  <Card className="flex-1 p-6">
                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Commitments */}
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
                Compromisso com a Sustentabilidade
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Nosso compromisso com o meio ambiente vai além dos produtos. 
                Buscamos constantemente formas de reduzir nosso impacto ambiental 
                e contribuir para um futuro mais sustentável.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Produtos que eliminam o desperdício de recursos naturais</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Processos produtivos com menor pegada de carbono</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Pesquisa contínua em tecnologias sustentáveis</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Certificações ambientais e de qualidade</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <GlobeAmericasIcon className="h-16 w-16 text-green-600 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Impacto Ambiental</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Redução no consumo de água:</span>
                    <span className="font-bold text-green-600">21x menor</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Eliminação de cimento:</span>
                    <span className="font-bold text-green-600">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Redução de resíduos:</span>
                    <span className="font-bold text-green-600">Significativa</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <Container>
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <UserGroupIcon className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Construindo o Futuro Juntos
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Somos movidos pela inovação e qualidade. Conheça nossos produtos 
              ou fale conosco para juntos construirmos o futuro da construção civil.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/produtos">
                <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                  <ArrowRightIcon className="mr-2 h-5 w-5" />
                  Conheça Nossos Produtos
                </Button>
              </Link>
              <Link href="/contato">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Entre em Contato
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}