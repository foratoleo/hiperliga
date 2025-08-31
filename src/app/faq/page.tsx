'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronDownIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  CogIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // Produto
  {
    id: '1',
    category: 'Produto',
    question: 'O que é a Hiperliga e como ela funciona?',
    answer: 'A Hiperliga é uma argamassa polimérica revolucionária que substitui completamente os materiais tradicionais como cimento, areia, cal e água. Ela funciona através de uma fórmula polimérica que garante aderência, resistência e durabilidade superiores, sendo aplicada diretamente sem necessidade de preparo com água.'
  },
  {
    id: '2',
    category: 'Produto',
    question: 'Qual a diferença entre Hiperliga e argamassa tradicional?',
    answer: 'A principal diferença está na composição: a Hiperliga não utiliza água, areia, cimento ou cal em sua formulação. Isso resulta em aplicação 3x mais rápida, maior resistência, zero desperdício de água e economia de até 35% nos custos totais da obra.'
  },
  {
    id: '3',
    category: 'Produto',
    question: 'A Hiperliga é realmente sustentável?',
    answer: 'Sim! A Hiperliga é 100% sustentável pois elimina o uso de recursos naturais escassos como água e areia, não gera resíduos durante a aplicação, reduz o transporte de materiais (menor volume) e possui certificações ambientais que comprovam seu baixo impacto ecológico.'
  },
  // Aplicação
  {
    id: '4',
    category: 'Aplicação',
    question: 'Como aplicar a Hiperliga?',
    answer: 'A aplicação é simples e direta: abra o produto, aplique com desempenadeira ou colher de pedreiro diretamente na superfície preparada. Não requer mistura com água nem preparo adicional. O tempo de pega é rápido, permitindo sequência imediata dos trabalhos.'
  },
  {
    id: '5',
    category: 'Aplicação',
    question: 'Preciso de treinamento específico para usar?',
    answer: 'Não é necessário treinamento extenso. A Gran Finelle oferece orientação técnica gratuita para profissionais. A aplicação é intuitiva para quem já trabalha com argamassas, mas recomendamos acompanhamento inicial para otimizar o rendimento.'
  },
  {
    id: '6',
    category: 'Aplicação',
    question: 'Qual o rendimento da Hiperliga?',
    answer: 'O rendimento varia conforme a aplicação: para alvenaria estrutural, aproximadamente 25kg/m², para vedação 20kg/m² e para revestimentos 15kg/m². O rendimento é superior às argamassas tradicionais devido à maior densidade e zero desperdício.'
  },
  // Custos
  {
    id: '7',
    category: 'Custos',
    question: 'Quanto custa a Hiperliga comparada à argamassa tradicional?',
    answer: 'Embora o custo inicial por kg seja superior, a economia total da obra chega a 35% devido ao menor consumo, maior rendimento, rapidez na aplicação (redução de mão de obra) e eliminação de custos com água, areia e cimento.'
  },
  {
    id: '8',
    category: 'Custos',
    question: 'Como calcular a economia real no meu projeto?',
    answer: 'Nossa equipe técnica oferece consultoria gratuita para cálculo personalizado. Consideramos: metragem da obra, tipo de aplicação, custos locais de materiais tradicionais, mão de obra e prazos. Entre em contato para uma análise detalhada do seu projeto.'
  },
  // Qualidade
  {
    id: '9',
    category: 'Qualidade',
    question: 'A Hiperliga tem a mesma resistência que argamassa comum?',
    answer: 'A resistência da Hiperliga é superior à argamassa tradicional. Testes laboratoriais comprovam resistência à compressão de até 40 MPa, aderência superior e maior durabilidade. Possui certificações técnicas que garantem performance estrutural.'
  },
  {
    id: '10',
    category: 'Qualidade',
    question: 'Qual a durabilidade esperada?',
    answer: 'A Hiperliga tem durabilidade superior a 50 anos quando aplicada corretamente. Sua formulação polimérica oferece maior resistência a intempéries, fissuras, infiltrações e desgaste natural, superando argamassas convencionais.'
  },
  // Logística
  {
    id: '11',
    category: 'Logística',
    question: 'Como é feita a entrega dos produtos?',
    answer: 'Trabalhamos com logística própria e parceiros especializados. Entregas em São Paulo capital e região metropolitana em até 48h. Para outros estados, consulte disponibilidade. Produtos são acondicionados em embalagens especiais que preservam a qualidade.'
  },
  {
    id: '12',
    category: 'Logística',
    question: 'Qual o prazo de validade dos produtos?',
    answer: 'A Hiperliga tem validade de 24 meses quando armazenada adequadamente (local seco, temperatura ambiente, embalagem fechada). Após abertura, deve ser utilizada em até 30 dias. As condições de armazenamento são simples e não requerem refrigeração.'
  }
]

const categories = [
  { name: 'Produto', icon: LightBulbIcon, count: 3 },
  { name: 'Aplicação', icon: CogIcon, count: 3 },
  { name: 'Custos', icon: CurrencyDollarIcon, count: 2 },
  { name: 'Qualidade', icon: ShieldCheckIcon, count: 2 },
  { name: 'Logística', icon: TruckIcon, count: 2 }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('Todas')
  const [openItems, setOpenItems] = React.useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todas' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <Section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/images/03_products/hiperliga/pattern-bg2-optimized.webp')] opacity-10" />
        
        <Container className="relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                ❓ Dúvidas Frequentes
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              Perguntas Frequentes
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed"
              variants={fadeInUp}
            >
              Encontre respostas para as principais dúvidas sobre nossos produtos e serviços
            </motion.p>

            {/* Search */}
            <motion.div 
              className="relative max-w-md mx-auto"
              variants={fadeInUp}
            >
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                type="text"
                placeholder="Buscar dúvidas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Categories */}
      <Section className="bg-muted/30">
        <Container>
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">Categorias</h2>
            <p className="text-muted-foreground">Navegue pelas categorias ou use a busca acima</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp}>
              <Button
                variant={selectedCategory === 'Todas' ? 'default' : 'outline'}
                className="w-full h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setSelectedCategory('Todas')}
              >
                <QuestionMarkCircleIcon className="h-6 w-6" />
                <div>
                  <div className="font-medium">Todas</div>
                  <div className="text-xs opacity-70">{faqData.length} itens</div>
                </div>
              </Button>
            </motion.div>

            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <motion.div key={category.name} variants={fadeInUp}>
                  <Button
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    className="w-full h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <IconComponent className="h-6 w-6" />
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs opacity-70">{category.count} itens</div>
                    </div>
                  </Button>
                </motion.div>
              )
            })}
          </motion.div>
        </Container>
      </Section>

      {/* FAQ Items */}
      <Section>
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerChildren}
          >
            {filteredFAQs.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-4">
                {filteredFAQs.map((faq) => {
                  const isOpen = openItems.includes(faq.id)
                  return (
                    <motion.div key={faq.id} variants={fadeInUp}>
                      <Card className="overflow-hidden">
                        <button
                          onClick={() => toggleItem(faq.id)}
                          className="w-full text-left p-6 hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
                        >
                          <div>
                            <Badge className="mb-2 text-xs">{faq.category}</Badge>
                            <h3 className="font-semibold text-lg">{faq.question}</h3>
                          </div>
                          <ChevronDownIcon 
                            className={`h-6 w-6 text-muted-foreground transition-transform flex-shrink-0 ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t"
                          >
                            <div className="p-6 pt-4 text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <motion.div 
                className="text-center py-12"
                variants={fadeInUp}
              >
                <QuestionMarkCircleIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma pergunta encontrada</h3>
                <p className="text-muted-foreground mb-6">
                  Tente ajustar sua busca ou selecionar uma categoria diferente
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('Todas')
                }}>
                  Limpar Filtros
                </Button>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <Container>
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Não encontrou sua resposta?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Nossa equipe técnica está pronta para esclarecer qualquer dúvida sobre nossos produtos
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                Falar com Especialista
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Solicitar Orçamento
              </Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}