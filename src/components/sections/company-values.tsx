'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  SparklesIcon,
  GlobeAmericasIcon,
  TrophyIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline'
import { ValueCard } from '@/components/ui/value-card'
import { Card } from '@/components/ui/card'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import type { CompanyData } from '@/types/company'
import companyData from '@/data/empresa.json'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const } }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } }
}

export function CompanyValues() {
  const { company } = companyData
  
  // Map company values to icons
  const valueIcons = {
    "Inovação tecnológica": SparklesIcon,
    "Sustentabilidade ambiental": GlobeAmericasIcon,
    "Qualidade e durabilidade": TrophyIcon,
    "Suporte técnico especializado": WrenchScrewdriverIcon,
    "Eficiência e praticidade": LightBulbIcon
  }

  const valuesWithIcons = company.values.values.map((value, index) => ({
    title: value.split(' ')[0], // First word as title
    description: value,
    icon: valueIcons[value as keyof typeof valueIcons] || SparklesIcon
  }))

  return (
    <Section className="bg-muted/30">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Missão e Valores</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Os pilares que guiam nossa empresa na criação de soluções inovadoras 
            para a construção civil brasileira.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleIn}
        >
          <Card className="p-8 text-center bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
            <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
            <p className="text-xl leading-relaxed font-medium">
              "{company.values.mission}"
            </p>
          </Card>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren}
        >
          {valuesWithIcons.map((value, index) => (
            <ValueCard
              key={index}
              title={value.title}
              description={value.description}
              icon={value.icon}
              index={index}
            />
          ))}
        </motion.div>

        {/* Company Differentials */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <Card className="p-8 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20">
            <h3 className="text-2xl font-bold mb-6 text-center text-brand-primary">
              Nossos Diferenciais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.values.differentials.map((differential, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <div className="p-4 rounded-lg bg-white shadow-sm">
                    <p className="font-medium text-muted-foreground">
                      {differential}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </Container>
    </Section>
  )
}