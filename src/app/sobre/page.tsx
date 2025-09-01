'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { CompanyHero } from '@/components/sections/company-hero'
import { CompanyHistory } from '@/components/sections/company-history'
import { CompanyValues } from '@/components/sections/company-values'
import { CompanyStatistics } from '@/components/sections/company-statistics'
import type { CompanyData } from '@/types/company'
import companyData from '@/data/empresa.json'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
}

export default function AboutPage() {
  const { company } = companyData

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

      {/* Hero Section with Real Company Data */}
      <CompanyHero />

      {/* Company History Timeline */}
      <CompanyHistory />

      {/* Mission, Vision & Values */}
      <CompanyValues />

      {/* Corporate Statistics */}
      <CompanyStatistics />

      {/* Sustainability Commitment with Real Data */}
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
                {company.mainProducts[0].description} Com benefícios revolucionários 
                que transformam a construção civil de forma sustentável.
              </p>
              
              <div className="space-y-4">
                {company.mainProducts[0].benefits.slice(0, 4).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
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
              <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <BuildingOffice2Icon className="h-16 w-16 text-green-600 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Nossa Sede</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>{company.address.street}, {company.address.number}</p>
                  <p>{company.address.neighborhood}</p>
                  <p>{company.address.city} - {company.address.state}</p>
                  <p>CEP: {company.address.zipCode}</p>
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-semibold text-brand-primary">WhatsApp:</p>
                    <p>+55 41 98888-3365</p>
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
              {company.values.mission} Conheça nossos produtos 
              ou fale conosco para transformarmos juntos a construção civil.
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