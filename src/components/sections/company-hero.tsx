'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { BuildingOffice2Icon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import type { CompanyData } from '@/types/company'
import companyData from '@/data/empresa.json'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
}

export function CompanyHero() {
  const { company } = companyData
  
  return (
    <Section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary text-white">
      <Container className="relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            🏢 Fundada em {company.foundedYear}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {company.legalName}
          </h1>
          
          <div className="mb-8">
            <p className="text-2xl md:text-3xl font-semibold mb-4 text-white/95">
              {company.tradeName}
            </p>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              {company.history.foundation}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {company.experienceAreas.map((area, index) => (
              <motion.div
                key={area.id}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
              >
                <div className="mb-3">
                  <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {area.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{area.name}</h3>
                <p className="text-sm text-white/80">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>

      {/* Company Info Card */}
      <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card className="p-8 bg-background shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <BuildingOffice2Icon className="h-8 w-8 text-brand-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Experiência</h4>
                    <p className="text-muted-foreground">{company.experienceYears}+ anos</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <MapPinIcon className="h-8 w-8 text-brand-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Localização</h4>
                    <p className="text-muted-foreground">{company.address.city} - {company.address.state}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <PhoneIcon className="h-8 w-8 text-brand-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Contato</h4>
                    <p className="text-muted-foreground">WhatsApp Disponível</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </div>
    </Section>
  )
}