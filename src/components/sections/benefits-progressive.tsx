'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  RocketLaunchIcon,
  GlobeAmericasIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  CheckBadgeIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ClockIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  ScaleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

import { ProgressiveReveal, BenefitsProgressiveReveal } from '@/components/ui/progressive-reveal'
import { HoverReveal, BenefitHoverReveal } from '@/components/ui/hover-reveal'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
  details: string
  highlight?: boolean
  technical?: Array<{
    metric: string
    value: string
    comparison?: string
  }>
}

const mainBenefits: Benefit[] = [
  {
    icon: <GlobeAmericasIcon className="w-6 h-6" />,
    title: "100% Sustentável",
    description: "Produto inovador na fabricação e aplicação: 0% de água, 0% de areia, 0% de cimento e 0% de cal.",
    details: "Nossa tecnologia polimérica revoluciona a construção civil ao eliminar completamente o uso de água durante a aplicação, reduzindo o impacto ambiental em até 95% comparado aos métodos tradicionais. Isso resulta em economia significativa de recursos naturais e redução da pegada de carbono.",
    highlight: true,
    technical: [
      { metric: "Redução de água", value: "100%", comparison: "vs. argamassa tradicional" },
      { metric: "Pegada de carbono", value: "-95%", comparison: "vs. cimento Portland" },
      { metric: "Resíduos gerados", value: "-80%", comparison: "vs. métodos convencionais" }
    ]
  },
  {
    icon: <RocketLaunchIcon className="w-6 h-6" />,
    title: "Aplicação 3x Mais Rápida",
    description: "Pronta para uso - não precisa adicionar água ou aditivos. Aplicação 3x mais rápida que métodos tradicionais.",
    details: "A fórmula avançada da Hiperliga permite aplicação direta sem necessidade de preparação, mistura ou cura prolongada. Isso reduz drasticamente o tempo de execução, permitindo que profissionais concluam projetos em um terço do tempo habitual, aumentando a produtividade e reduzindo custos de mão de obra.",
    technical: [
      { metric: "Tempo de aplicação", value: "66% menor", comparison: "vs. argamassa convencional" },
      { metric: "Tempo de cura", value: "72h", comparison: "vs. 7-14 dias tradicional" },
      { metric: "Produtividade", value: "+200%", comparison: "m²/hora por profissional" }
    ]
  },
  {
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    title: "Alto Rendimento - 1 bisnaga = 60kg",
    description: "1 bisnaga de 3kg equivale a 60kg de cimento tradicional. Rendimento de até 20m² por balde.",
    details: "O rendimento excepcional da Hiperliga proporciona economia substancial de até 35% nos custos finais da obra. A concentração da fórmula permite cobrir grandes áreas com pequenas quantidades do produto, otimizando logística, armazenamento e aplicação.",
    technical: [
      { metric: "Rendimento", value: "20m²/3kg", comparison: "vs. 3m²/25kg tradicional" },
      { metric: "Economia de custos", value: "até 35%", comparison: "custo final da obra" },
      { metric: "Eficiência material", value: "2000%", comparison: "maior que cimento comum" }
    ]
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: "Consumo 21x Menor de Água",
    description: "Redução de 21x no uso de água comparado aos métodos tradicionais. Aderência superior em múltiplas superfícies.",
    details: "A tecnologia polimérica da Hiperliga elimina praticamente o uso de água, contribuindo significativamente para a preservação deste recurso vital. Além disso, oferece aderência excepcional em concreto, cerâmica, ferro, alumínio, vidro, pedra e madeira, garantindo versatilidade única em aplicações diversas.",
    technical: [
      { metric: "Economia de água", value: "95%", comparison: "vs. argamassa tradicional" },
      { metric: "Aderência", value: "Superior", comparison: "em 8+ tipos de superfície" },
      { metric: "Resistência", value: "40 MPa", comparison: "vs. 25 MPa tradicional" }
    ]
  }
]

const additionalBenefits: Benefit[] = [
  {
    icon: <BeakerIcon className="w-6 h-6" />,
    title: "Tecnologia Polimérica Avançada",
    description: "Fórmula desenvolvida com base em pesquisa científica e mais de 10 anos de experiência no mercado.",
    details: "Nossa tecnologia polimérica é resultado de extensiva pesquisa e desenvolvimento, combinando conhecimento em construção civil, mineração e química. O produto utiliza agregados minerais com granulometria controlada e aditivos químicos de alta performance, garantindo propriedades superiores e desempenho consistente.",
    technical: [
      { metric: "Tempo de desenvolvimento", value: "10+ anos", comparison: "pesquisa contínua" },
      { metric: "Testes de qualidade", value: "100+", comparison: "laboratórios certificados" },
      { metric: "Durabilidade", value: "25+ anos", comparison: "vida útil estimada" }
    ]
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: "Resistência e Durabilidade Superiores",
    description: "Alta resistência mecânica e durabilidade, ideal para aplicações exigentes em ambientes internos e externos.",
    details: "A Hiperliga oferece resistência mecânica superior à argamassa tradicional, com excelente desempenho contra intempéries, variações térmicas e agentes químicos. Sua fórmula garante estabilidade dimensional e resistência à fissuração, assegurando longevidade da aplicação.",
    technical: [
      { metric: "Resistência à compressão", value: "40 MPa", comparison: "vs. 25 MPa tradicional" },
      { metric: "Resistência à flexão", value: "8 MPa", comparison: "vs. 5 MPa tradicional" },
      { metric: "Resistência ao intemperismo", value: "Excelente", comparison: "testes acelerados 1000h" }
    ]
  },
  {
    icon: <ClockIcon className="w-6 h-6" />,
    title: "Cura Rápida e Eficiente",
    description: "Endurecimento rápido que permite continuidade dos trabalhos sem longos períodos de espera.",
    details: "O processo de cura da Hiperliga é otimizado para permitir máxima produtividade. Em 72 horas, o produto atinge resistência total, ainda muito mais rápido que os métodos tradicionais que levam de 7-14 dias, permitindo cronogramas mais agressivos.",
    technical: [
      { metric: "Tempo para tráfego", value: "24h", comparison: "vs. 7-14 dias tradicional" },
      { metric: "Resistência inicial", value: "80%", comparison: "em 24h vs. 28 dias tradicional" },
      { metric: "Endurecimento final", value: "7 dias", comparison: "vs. 28 dias tradicional" }
    ]
  },
  {
    icon: <CubeIcon className="w-6 h-6" />,
    title: "Versatilidade de Aplicação",
    description: "Adequada para assentamento, revestimento, reparos e acabamentos em diversos tipos de superfície.",
    details: "A versatilidade da Hiperliga permite uso em múltiplas aplicações: assentamento de pisos e revestimentos, reparos estruturais, regularização de superfícies, e acabamentos decorativos. Sua excelente trabalhabilidade facilita a aplicação tanto por profissionais experientes quanto iniciantes.",
    technical: [
      { metric: "Tipos de aplicação", value: "8+", comparison: "vs. 2-3 tradicional" },
      { metric: "Superfícies compatíveis", value: "Todas", comparison: "concreto, cerâmica, metal, etc." },
      { metric: "Espessura aplicação", value: "1-50mm", comparison: "em única aplicação" }
    ]
  },
  {
    icon: <WrenchScrewdriverIcon className="w-6 h-6" />,
    title: "Facilidade de Aplicação",
    description: "Não requer equipamentos especiais ou mão de obra altamente especializada para aplicação eficiente.",
    details: "A Hiperliga foi desenvolvida pensando na praticidade. Sua consistência ideal e trabalhabilidade permitem aplicação com ferramentas convencionais, sem necessidade de equipamentos especiais ou treinamento extensivo. Isso democratiza o acesso à tecnologia avançada.",
    technical: [
      { metric: "Ferramentas necessárias", value: "Convencionais", comparison: "sem equipamentos especiais" },
      { metric: "Tempo de treinamento", value: "2h", comparison: "vs. 8h+ métodos especiais" },
      { metric: "Taxa de desperdício", value: "<5%", comparison: "vs. 15-20% tradicional" }
    ]
  },
  {
    icon: <ScaleIcon className="w-6 h-6" />,
    title: "Redução Significativa de Peso",
    description: "Produto leve que reduz cargas estruturais e facilita transporte e manuseio em obra.",
    details: "A densidade otimizada da Hiperliga resulta em significativa redução de peso comparada às argamassas tradicionais, diminuindo cargas sobre estruturas e facilitando o manuseio. Isso é especialmente valioso em reformas e aplicações onde o peso é crítico.",
    technical: [
      { metric: "Densidade", value: "1.4 kg/L", comparison: "vs. 2.0 kg/L tradicional" },
      { metric: "Redução de peso", value: "30%", comparison: "por m² aplicado" },
      { metric: "Facilidade manuseio", value: "Superior", comparison: "menos esforço físico" }
    ]
  },
  {
    icon: <EyeIcon className="w-6 h-6" />,
    title: "Acabamento de Qualidade Superior",
    description: "Superfície lisa e uniforme, ideal para receber qualquer tipo de acabamento final.",
    details: "A Hiperliga proporciona acabamento de qualidade superior, com superfície lisa, uniforme e sem imperfeições. Isso facilita a aplicação de revestimentos finais como tintas, texturas, cerâmicas e outros materiais, garantindo resultado estético excepcional.",
    technical: [
      { metric: "Planicidade", value: "±2mm/m", comparison: "vs. ±5mm/m tradicional" },
      { metric: "Rugosidade superficial", value: "Baixa", comparison: "ideal para acabamentos" },
      { metric: "Uniformidade", value: "Excelente", comparison: "sem variações de cor" }
    ]
  },
  {
    icon: <CheckBadgeIcon className="w-6 h-6" />,
    title: "Suporte Técnico Especializado",
    description: "Equipe técnica experiente oferece suporte completo desde o planejamento até a execução final.",
    details: "Nossa equipe de suporte técnico, com mais de 10 anos de experiência, oferece consultoria completa para otimizar o uso da Hiperliga em seu projeto. Desde cálculo de quantidades até acompanhamento de aplicação, garantimos o máximo aproveitamento dos benefícios do produto.",
    technical: [
      { metric: "Experiência da equipe", value: "10+ anos", comparison: "especialistas certificados" },
      { metric: "Tempo de resposta", value: "<2h", comparison: "suporte técnico" },
      { metric: "Taxa de sucesso", value: "98%", comparison: "projetos acompanhados" }
    ]
  }
]

interface BenefitsProgressiveSectionProps {
  className?: string
  variant?: 'default' | 'detailed' | 'comparison'
  showTechnicalSpecs?: boolean
  initialBenefits?: number
}

export function BenefitsProgressiveSection({
  className,
  variant = 'default',
  showTechnicalSpecs: initialShowTechnicalSpecs = false,
  initialBenefits = 4
}: BenefitsProgressiveSectionProps) {
  const [showTechnicalSpecs, setShowTechnicalSpecs] = React.useState(initialShowTechnicalSpecs)
  const [selectedBenefit, setSelectedBenefit] = React.useState<number | null>(null)
  const [showComparison, setShowComparison] = React.useState(false)

  const allBenefits = [...mainBenefits, ...additionalBenefits]

  return (
    <Section className={cn("relative", className)}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-brand-primary/10 text-brand-primary border-brand-primary/20">
            ✨ Tecnologia Avançada
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Por que escolher a Hiperliga?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubra todos os benefícios que tornam a Hiperliga a escolha inteligente 
            para uma obra mais rápida, econômica e sustentável
          </p>
        </motion.div>

        {variant === 'detailed' ? (
          <BenefitsProgressiveReveal
            benefits={allBenefits}
            initialCount={initialBenefits}
            title=""
            subtitle=""
          />
        ) : (
          <ProgressiveReveal
            initialItems={initialBenefits}
            revealIncrement={2}
            variant="stagger"
            showProgress={true}
            revealText="Ver mais benefícios"
            className="space-y-6"
          >
            {allBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="group"
                layout
              >
                <BenefitHoverReveal
                  benefit={benefit}
                  className={cn(
                    "transition-all duration-300",
                    benefit.highlight && "border-brand-primary/30 bg-brand-primary/5",
                    selectedBenefit === index && "ring-2 ring-brand-primary/20"
                  )}
                />

                {/* Technical Specifications Expansion */}
                {showTechnicalSpecs && benefit.technical && selectedBenefit === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-6 bg-muted/50 rounded-xl border border-border"
                  >
                    <h4 className="font-semibold text-foreground mb-4">
                      Especificações Técnicas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {benefit.technical.map((spec, specIndex) => (
                        <motion.div
                          key={specIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: specIndex * 0.1 }}
                          className="text-center p-4 bg-card rounded-lg border border-border"
                        >
                          <div className="text-2xl font-bold text-brand-primary mb-1">
                            {spec.value}
                          </div>
                          <div className="text-sm font-medium text-foreground mb-1">
                            {spec.metric}
                          </div>
                          {spec.comparison && (
                            <div className="text-xs text-muted-foreground">
                              {spec.comparison}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </ProgressiveReveal>
        )}

        {/* Interactive Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center gap-4"
        >
          <button
            onClick={() => setShowTechnicalSpecs(!showTechnicalSpecs)}
            className={cn(
              "px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200",
              showTechnicalSpecs
                ? "bg-brand-primary text-white shadow-lg"
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            )}
          >
            {showTechnicalSpecs ? 'Ocultar' : 'Mostrar'} Especificações Técnicas
          </button>
          
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={cn(
              "px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200",
              showComparison
                ? "bg-green-600 text-white shadow-lg"
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            )}
          >
            {showComparison ? 'Ocultar' : 'Mostrar'} Comparativo
          </button>
        </motion.div>

        {/* Comparison Table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-12 overflow-x-auto"
          >
            <div className="min-w-full bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-4 bg-muted/50 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Comparativo: Hiperliga vs. Métodos Tradicionais
                </h3>
              </div>
              <div className="divide-y divide-border">
                <div className="grid grid-cols-3 gap-4 px-6 py-4 font-medium text-sm">
                  <div className="text-muted-foreground">Característica</div>
                  <div className="text-brand-primary">Hiperliga</div>
                  <div className="text-muted-foreground">Tradicional</div>
                </div>
                {[
                  { feature: 'Tempo de aplicação', hiperliga: '3x mais rápido', traditional: 'Padrão' },
                  { feature: 'Uso de água', hiperliga: '21x menos', traditional: 'Alto consumo' },
                  { feature: 'Rendimento', hiperliga: '20m²/3kg', traditional: '3m²/25kg' },
                  { feature: 'Cura', hiperliga: '24h', traditional: '7-28 dias' },
                  { feature: 'Sustentabilidade', hiperliga: '100% sustentável', traditional: 'Limitada' },
                  { feature: 'Versatilidade', hiperliga: 'Múltiplas superfícies', traditional: 'Restrita' }
                ].map((row, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="grid grid-cols-3 gap-4 px-6 py-4 text-sm"
                  >
                    <div className="font-medium text-foreground">{row.feature}</div>
                    <div className="text-brand-primary font-medium">{row.hiperliga}</div>
                    <div className="text-muted-foreground">{row.traditional}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </Container>
    </Section>
  )
}

export default BenefitsProgressiveSection