'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  BuildingOffice2Icon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon
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

// Form validation
interface FormData {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
  projectType: string
  preferredContact: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
  projectType: '',
  preferredContact: 'email'
}

export default function ContactPage() {
  const [formData, setFormData] = React.useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitMessage, setSubmitMessage] = React.useState('')
  const [errors, setErrors] = React.useState<Partial<FormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
    if (!formData.subject.trim()) newErrors.subject = 'Assunto é obrigatório'
    if (!formData.message.trim()) newErrors.message = 'Mensagem é obrigatória'
    if (!formData.projectType) newErrors.projectType = 'Tipo de projeto é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.')
      setFormData(initialFormData)
      setErrors({})
    } catch {
      setSubmitMessage('Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Endereço',
      content: 'Rua Antônio Camargo, 122 – Areias\nAlmirante Tamandaré - PR\nCEP 83514-140',
      action: 'Ver no Google Maps'
    },
    {
      icon: PhoneIcon,
      title: 'Telefone',
      content: '(41) 98522-0746\n(41) 99501-5557 (WhatsApp)',
      action: 'Ligar agora'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'contato@hiperliga.com.br\nvendas@hiperliga.com.br',
      action: 'Enviar email'
    },
    {
      icon: ClockIcon,
      title: 'Horário',
      content: 'Segunda a Quinta: 07:30 às 17:30\nSexta: 07:30 às 16:30\nFim de semana: Fechado',
      action: null
    }
  ]

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
                💬 Estamos aqui para ajudar
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              Entre em Contato
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed"
              variants={fadeInUp}
            >
              Nossa equipe especializada está pronta para esclarecer dúvidas e ajudar com seu projeto
            </motion.p>
          </motion.div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <Card className="p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Solicite um Orçamento</h2>
                  <p className="text-muted-foreground">
                    Preencha o formulário abaixo com os detalhes do seu projeto. 
                    Responderemos o mais breve possível.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nome completo *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Seu nome completo"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="seu@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Telefone *
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Empresa
                      </label>
                      <div className="relative">
                        <BuildingOffice2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                          placeholder="Nome da empresa"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                        Tipo de projeto *
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                          errors.projectType ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="residencial">Residencial</option>
                        <option value="comercial">Comercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="reforma">Reforma/Renovação</option>
                        <option value="outro">Outro</option>
                      </select>
                      {errors.projectType && (
                        <p className="mt-1 text-sm text-red-600">{errors.projectType}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="preferredContact" className="block text-sm font-medium mb-2">
                        Forma preferida de contato
                      </label>
                      <select
                        id="preferredContact"
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Telefone</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Assunto *
                    </label>
                    <div className="relative">
                      <DocumentTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                          errors.subject ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Orçamento para Hiperliga - Projeto Residencial"
                      />
                    </div>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Descreva seu projeto, metragem aproximada, localização e outros detalhes relevantes..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-sm h-5 w-5 border-b-2 border-white mr-2" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar Solicitação'
                    )}
                  </Button>

                  {submitMessage && (
                    <motion.div
                      className={`p-4 rounded-lg flex items-start gap-3 ${
                        submitMessage.includes('sucesso') 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <CheckCircleIcon className={`h-6 w-6 mt-0.5 ${
                        submitMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <p>{submitMessage}</p>
                    </motion.div>
                  )}
                </form>
              </Card>
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerChildren}
            >
              <div className="space-y-6">
                <motion.div variants={scaleIn}>
                  <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>
                </motion.div>

                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <motion.div key={index} variants={scaleIn}>
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-sm bg-brand-primary/10">
                            <IconComponent className="h-6 w-6 text-brand-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{info.title}</h4>
                            <p className="text-muted-foreground whitespace-pre-line text-sm mb-3">
                              {info.content}
                            </p>
                            {info.action && (
                              <Button variant="ghost" className="p-0 h-auto text-sm">
                                {info.action}
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}

                {/* Quick Contact */}
                <motion.div variants={scaleIn}>
                  <Card className="p-6 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                    <h4 className="font-bold mb-4">Atendimento Rápido</h4>
                    <p className="text-white/90 text-sm mb-4">
                      Precisa de atendimento imediato? Entre em contato via WhatsApp.
                    </p>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                      WhatsApp: (41) 99501-5557
                    </Button>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  )
}