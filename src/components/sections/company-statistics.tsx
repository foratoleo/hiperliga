'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  BuildingOffice2Icon,
  ClockIcon,
  MapIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline'
import { StatisticCard } from '@/components/ui/animated-counter'
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
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
}

export function CompanyStatistics() {
  const { company } = companyData
  
  // Extract numeric value from "3 milhões de m²" or similar
  const extractNumber = (text: string): number => {
    const match = text.match(/(\d+(?:\.\d+)?)\s*milh/i)
    if (match) {
      return parseFloat(match[1]) * 1000000
    }
    const numberMatch = text.match(/(\d+(?:\.\d+)?)/)
    return numberMatch ? parseFloat(numberMatch[1]) : 0
  }

  const statistics = [
    {
      value: extractNumber(company.achievements.totalArea),
      label: "Área Aplicada",
      suffix: " m²",
      description: "metros quadrados construídos com Hiperliga® e suporte técnico especializado",
      icon: BuildingOffice2Icon
    },
    {
      value: company.experienceYears,
      label: "Anos de Experiência",
      suffix: "+",
      description: "anos de atuação nas áreas de construção civil, mineração e química",
      icon: ClockIcon
    },
    {
      value: 3,
      label: "Áreas de Expertise",
      description: "construção civil, mineração e química com tecnologia avançada",
      icon: TrophyIcon
    },
    {
      value: 100,
      label: "Sustentabilidade",
      suffix: "%",
      description: "produto 100% sustentável na fabricação e aplicação",
      icon: MapIcon
    }
  ]

  return (
    <Section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Números que Comprovam Nossa Excelência
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Mais de uma década construindo o futuro da construção civil 
            com tecnologia, inovação e sustentabilidade.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren}
        >
          {statistics.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <StatisticCard
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
                description={stat.description}
                icon={stat.icon}
                index={index}
                className="text-white"
              />
            </Card>
          ))}
        </motion.div>

        {/* Additional Achievement Highlight */}
        <motion.div
          className="mt-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
            <h3 className="text-2xl font-bold mb-4">
              Reconhecimento no Mercado
            </h3>
            <p className="text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
              {company.history.currentStatus} Nossa trajetória é marcada pela 
              constante inovação e pelo compromisso com a excelência em 
              cada projeto executado.
            </p>
          </Card>
        </motion.div>
      </Container>
    </Section>
  )
}