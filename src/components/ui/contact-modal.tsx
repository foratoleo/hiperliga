'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from './button';
import { useUserJourney } from '@/hooks/use-user-journey';
import { calculateLeadScore, generateWhatsAppLink, trackCTAPerformance, PRODUCT_DATA } from '@/lib/cta-logic';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'quote' | 'contact' | 'consultation' | 'sample';
  prefilledData?: {
    area?: number;
    projectType?: string;
    urgency?: string;
  };
  onSubmit?: (data: ContactFormData) => void;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  projectArea: string;
  location: string;
  timeline: string;
  budget: string;
  message: string;
  source: string;
  leadScore: number;
}

const PROJECT_TYPES = [
  'Residencial - Casa',
  'Residencial - Apartamento',
  'Comercial - Escritório',
  'Comercial - Loja',
  'Industrial - Galpão',
  'Industrial - Fábrica',
  'Reforma e Retrofit',
  'Outro'
];

const TIMELINES = [
  'Urgente (próximos 15 dias)',
  'Curto prazo (1-3 meses)',
  'Médio prazo (3-6 meses)',
  'Longo prazo (6+ meses)',
  'Ainda não definido'
];

const BUDGET_RANGES = [
  'Até R$ 10.000',
  'R$ 10.000 - R$ 50.000',
  'R$ 50.000 - R$ 100.000',
  'R$ 100.000 - R$ 500.000',
  'Acima de R$ 500.000',
  'Prefiro não informar'
];

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  variant = 'contact',
  prefilledData,
  onSubmit,
}) => {
  const { behavior, journeyStage, trackInteraction } = useUserJourney();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    projectArea: prefilledData?.area?.toString() || '',
    location: '',
    timeline: prefilledData?.urgency || '',
    budget: '',
    message: '',
    source: 'website',
    leadScore: 0,
  });

  // Calculate lead score when modal opens
  useEffect(() => {
    if (isOpen) {
      const score = calculateLeadScore(
        behavior.timeOnPage,
        behavior.scrollDepth,
        behavior.calculatorUsage,
        1,
        behavior.trafficSource,
        behavior.deviceType
      );
      setFormData(prev => ({ ...prev, leadScore: score }));
      
      trackCTAPerformance(`contact_modal_${variant}`, journeyStage.stage, 'Modal Opened', 'impression');
    }
  }, [isOpen, behavior, journeyStage.stage, variant]);

  const getModalConfig = () => {
    switch (variant) {
      case 'quote':
        return {
          title: 'Solicitar Orçamento',
          subtitle: 'Receba uma proposta personalizada para seu projeto',
          icon: Building,
          color: 'from-green-600 to-green-700',
          submitText: 'Solicitar Orçamento',
        };
      case 'consultation':
        return {
          title: 'Consultoria Técnica Gratuita',
          subtitle: 'Fale com nossos especialistas sem compromisso',
          icon: User,
          color: 'from-blue-600 to-blue-700',
          submitText: 'Agendar Consultoria',
        };
      case 'sample':
        return {
          title: 'Solicitar Amostra Grátis',
          subtitle: 'Teste o Hiperliga no seu projeto',
          icon: CheckCircle,
          color: 'from-orange-600 to-orange-700',
          submitText: 'Solicitar Amostra',
        };
      default:
        return {
          title: 'Entre em Contato',
          subtitle: 'Vamos conversar sobre seu projeto',
          icon: MessageCircle,
          color: 'from-hiperliga-600 to-hiperliga-700',
          submitText: 'Enviar Mensagem',
        };
    }
  };

  const config = getModalConfig();
  const Icon = config.icon;
  const totalSteps = variant === 'contact' ? 2 : 3;

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.email && formData.phone);
      case 2:
        return !!(formData.projectType && formData.location);
      case 3:
        return !!(formData.timeline);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    trackInteraction('form');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would send to your CRM/database
      console.log('Form submitted:', formData);
      
      if (onSubmit) {
        onSubmit(formData);
      }

      trackCTAPerformance(`contact_modal_submit_${variant}`, journeyStage.stage, 'Form Submitted', 'conversion');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Erro ao enviar formulário. Tente novamente ou entre em contato via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppFallback = () => {
    const message = `Olá! Tentei preencher o formulário no site, mas gostaria de falar diretamente. 

Meu projeto:
- Tipo: ${formData.projectType || 'Não informado'}
- Área: ${formData.projectArea || 'Não informado'}m²
- Local: ${formData.location || 'Não informado'}
- Prazo: ${formData.timeline || 'Não informado'}

${formData.message ? `Observações: ${formData.message}` : ''}`;

    const whatsappUrl = generateWhatsAppLink(message);
    trackCTAPerformance('whatsapp_fallback', journeyStage.stage, 'WhatsApp Fallback', 'conversion');
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${config.color} text-white p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">{config.title}</h2>
                  <p className="text-white/90">{config.subtitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Etapa {currentStep} de {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  className="bg-white h-2 rounded-full transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isSubmitted ? (
              // Success State
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-green-500 mb-4"
                >
                  <CheckCircle className="w-16 h-16 mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Mensagem Enviada com Sucesso!
                </h3>
                <p className="text-gray-600 mb-6">
                  Nossa equipe entrará em contato em até 2 horas úteis.
                  Para atendimento imediato, use o WhatsApp.
                </p>
                <div className="space-y-3">
                  <Button onClick={handleWhatsAppFallback} className="w-full" variant="sustainable">
                    💬 Continuar no WhatsApp
                  </Button>
                  <Button onClick={onClose} variant="secondary">
                    Fechar
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Form Steps
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Suas informações de contato
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Nome completo *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500"
                            placeholder="Seu nome completo"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Building className="w-4 h-4 inline mr-2" />
                            Empresa (opcional)
                          </label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500"
                            placeholder="Nome da empresa"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500"
                            placeholder="seu@email.com"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Telefone/WhatsApp *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500"
                            placeholder="(41) 99999-9999"
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Project Information */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Detalhes do seu projeto
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de projeto *
                          </label>
                          <select
                            value={formData.projectType}
                            onChange={(e) => handleInputChange('projectType', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500"
                            required
                          >
                            <option value="">Selecione...</option>
                            {PROJECT_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Área aproximada (m²)
                          </label>
                          <input
                            type="number"
                            value={formData.projectArea}
                            onChange={(e) => handleInputChange('projectArea', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500"
                            placeholder="100"
                            min="1"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Localização do projeto *
                          </label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500"
                            placeholder="Cidade - Estado"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mensagem adicional (opcional)
                          </label>
                          <textarea
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500"
                            rows={3}
                            placeholder="Descreva detalhes específicos do seu projeto..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Timeline & Budget (for quote/consultation) */}
                  {currentStep === 3 && variant !== 'contact' && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Cronograma e orçamento
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Prazo do projeto *
                          </label>
                          <select
                            value={formData.timeline}
                            onChange={(e) => handleInputChange('timeline', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500"
                            required
                          >
                            <option value="">Selecione...</option>
                            {TIMELINES.map(timeline => (
                              <option key={timeline} value={timeline}>{timeline}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Orçamento estimado
                          </label>
                          <select
                            value={formData.budget}
                            onChange={(e) => handleInputChange('budget', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500"
                          >
                            <option value="">Selecione...</option>
                            {BUDGET_RANGES.map(range => (
                              <option key={range} value={range}>{range}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Lead Score Display (for high-value leads) */}
                      {formData.leadScore > 70 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-50 border-2 border-green-200 rounded-xl p-4"
                        >
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Lead Prioritário</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            Seu perfil indica alto interesse. Nossa equipe especializada entrará em contato prioritariamente.
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      onClick={handleBack}
                      variant="secondary"
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                  )}

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!validateStep(currentStep)}
                      className="flex-1"
                      variant="sustainable"
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !validateStep(currentStep)}
                      className="flex-1"
                      variant="sustainable"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Enviando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          {config.submitText}
                        </div>
                      )}
                    </Button>
                  )}
                </div>

                {/* WhatsApp Alternative */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Prefere falar diretamente? Use o WhatsApp:
                  </p>
                  <Button
                    type="button"
                    onClick={handleWhatsAppFallback}
                    variant="ghost"
                    className="text-green-600 hover:text-green-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp: ({PRODUCT_DATA.contact.whatsapp.slice(0, 2)}) {PRODUCT_DATA.contact.whatsapp.slice(2, 7)}-{PRODUCT_DATA.contact.whatsapp.slice(7)}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};