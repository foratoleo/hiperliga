'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Timeline } from '@/components/ui/timeline'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import type { CompanyData } from '@/types/company'
import companyData from '@/data/empresa.json'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
}

export function CompanyHistory() {
  const { company } = companyData
  
  // Convert company milestones to timeline format
  const timelineItems = [
    {
      year: company.foundedYear,
      title: "Fundação da Empresa",
      description: company.history.foundation
    },
    {
      title: "Desenvolvimento Tecnológico", 
      description: company.history.development
    },
    {
      title: "Status Atual",
      description: company.history.currentStatus,
      metric: {
        value: "3000000",
        unit: "m²",
        description: "metros quadrados aplicados com suporte técnico especializado"
      }
    },
    // Add specific milestones from the data
    ...company.milestones.filter(milestone => milestone.metric).map(milestone => ({
      title: "Marco Histórico",
      description: milestone.description,
      metric: milestone.metric
    }))
  ]

  return (
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
            Uma história de inovação, tecnologia e compromisso com a sustentabilidade 
            na construção civil brasileira.
          </p>
        </motion.div>

        <Timeline items={timelineItems} />

        {/* Company Development Story */}
        <motion.div
          className="mt-16 text-center max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <div className="p-8 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-lg border border-brand-primary/20">
            <h3 className="text-2xl font-bold mb-4 text-brand-primary">
              Inovação e Tecnologia
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {company.history.development} Nossa empresa se destaca pela 
              combinação única de <strong>economia, rapidez e praticidade</strong>, 
              oferecendo soluções que transformam a forma de construir.
            </p>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}