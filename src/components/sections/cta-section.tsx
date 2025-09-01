'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  MessageCircle, 
  PlayCircle, 
  Download, 
  TrendingUp, 
  Users, 
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '../ui/button';
import { ContextualCTA } from '../ui/contextual-cta';
import { CalculatorWidget } from '../ui/calculator-widget';
import { ContactModal } from '../ui/contact-modal';
import { useUserJourney } from '@/hooks/use-user-journey';
import { generateWhatsAppLink, PRODUCT_DATA } from '@/lib/cta-logic';

interface CTASectionProps {
  variant: 'discovery' | 'interest' | 'consideration' | 'decision';
  className?: string;
  showCalculator?: boolean;
  customContent?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
  };
  page?: 'home' | 'products' | 'about' | 'contact' | 'faq' | 'videos';
}

export const CTASection: React.FC<CTASectionProps> = ({
  variant,
  className = '',
  showCalculator = false,
  customContent,
  page = 'home',
}) => {
  const { behavior, journeyStage, trackInteraction } = useUserJourney();
  const [showContactModal, setShowContactModal] = useState(false);
  const [modalVariant, setModalVariant] = useState<'quote' | 'contact' | 'consultation' | 'sample'>('contact');

  const getSectionConfig = () => {
    switch (variant) {
      case 'discovery':
        return {
          title: customContent?.title || 'Revolução na Construção Civil',
          subtitle: customContent?.subtitle || 'Descubra como o Hiperliga está transformando obras em todo o Brasil',
          primaryCTA: 'Veja o Hiperliga em Ação',
          secondaryCTA: 'Baixar Apresentação',
          icon: PlayCircle,
          bgGradient: 'from-blue-600 via-blue-700 to-indigo-800',
          features: [
            { icon: TrendingUp, text: '35% de economia comprovada' },
            { icon: Clock, text: '3x mais rápido que métodos tradicionais' },
            { icon: CheckCircle, text: '21x menos água necessária' },
            { icon: Star, text: 'Mais de 3 milhões de m² construídos' },
          ],
          action: () => {
            trackInteraction('video');
            window.location.href = '/videos';
          },
          secondaryAction: () => {
            trackInteraction('click');
            window.location.href = '/docs/apresentacao-hiperliga.pdf';
          },
        };

      case 'interest':
        return {
          title: customContent?.title || 'Calcule Sua Economia Agora',
          subtitle: customContent?.subtitle || 'Veja quanto você pode economizar no seu projeto',
          primaryCTA: 'Usar Calculadora',
          secondaryCTA: 'Comparar com Tradicional',
          icon: Calculator,
          bgGradient: 'from-green-600 via-emerald-700 to-teal-800',
          features: [
            { icon: Calculator, text: 'Cálculo personalizado instantâneo' },
            { icon: TrendingUp, text: 'Economia real do seu projeto' },
            { icon: Clock, text: 'Tempo de execução otimizado' },
            { icon: CheckCircle, text: 'Quantidade exata de material' },
          ],
          action: () => {
            trackInteraction('calculator');
            const calculator = document.getElementById('calculator-widget');
            if (calculator) {
              calculator.scrollIntoView({ behavior: 'smooth' });
            }
          },
          secondaryAction: () => {
            trackInteraction('click');
            window.location.href = '/products/comparacao';
          },
        };

      case 'consideration':
        return {
          title: customContent?.title || 'Fale com Nossos Especialistas',
          subtitle: customContent?.subtitle || 'Tire suas dúvidas e receba orientação técnica personalizada',
          primaryCTA: 'Consultoria Gratuita',
          secondaryCTA: 'Ver Cases de Sucesso',
          icon: Users,
          bgGradient: 'from-orange-600 via-red-600 to-pink-700',
          features: [
            { icon: Users, text: '10+ anos de experiência' },
            { icon: Star, text: 'Equipe técnica especializada' },
            { icon: CheckCircle, text: 'Consultoria sem compromisso' },
            { icon: Phone, text: 'Suporte técnico completo' },
          ],
          action: () => {
            setModalVariant('consultation');
            setShowContactModal(true);
          },
          secondaryAction: () => {
            trackInteraction('click');
            window.location.href = '/cases';
          },
        };

      case 'decision':
        return {
          title: customContent?.title || 'Pronto para Transformar Sua Obra?',
          subtitle: customContent?.subtitle || 'Solicite seu orçamento e comece a economizar hoje mesmo',
          primaryCTA: 'Solicitar Orçamento',
          secondaryCTA: 'WhatsApp Direto',
          icon: MessageCircle,
          bgGradient: 'from-purple-600 via-indigo-700 to-blue-800',
          features: [
            { icon: CheckCircle, text: 'Orçamento sem compromisso' },
            { icon: Clock, text: 'Resposta em até 2 horas' },
            { icon: Star, text: 'Condições especiais disponíveis' },
            { icon: Users, text: 'Suporte técnico incluso' },
          ],
          action: () => {
            setModalVariant('quote');
            setShowContactModal(true);
          },
          secondaryAction: () => {
            trackInteraction('click');
            const message = `Olá! Estou no site da Hiperliga e gostaria de solicitar um orçamento. 

Informações do meu interesse:
- Página: ${page}
- Tempo no site: ${Math.floor(behavior.timeOnPage / 60)} minutos
- Interesse: Alto

Aguardo contato!`;
            const whatsappUrl = generateWhatsAppLink(message);
            window.open(whatsappUrl, '_blank');
          },
        };

      default:
        return {
          title: 'Entre em Contato',
          subtitle: 'Vamos conversar sobre seu projeto',
          primaryCTA: 'Falar Conosco',
          secondaryCTA: 'Saiba Mais',
          icon: MessageCircle,
          bgGradient: 'from-gray-600 to-gray-800',
          features: [],
          action: () => setShowContactModal(true),
          secondaryAction: () => {},
        };
    }
  };

  const config = getSectionConfig();
  const Icon = config.icon;

  return (
    <>
      <section className={`relative py-16 overflow-hidden ${className}`}>
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`}>
          <div className="absolute inset-0 bg-black/20" />
          {/* Animated background elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm"
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              {config.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
            >
              {config.subtitle}
            </motion.p>

            {/* Features */}
            {config.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
              >
                {config.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                  >
                    <feature.icon className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white/90 text-sm font-medium">
                      {feature.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <Button
                onClick={config.action}
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold min-w-[200px] group"
              >
                {config.primaryCTA}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                onClick={config.secondaryAction}
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold min-w-[200px] bg-transparent"
                variant="secondary"
              >
                {config.secondaryCTA}
              </Button>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-white/80 text-sm"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: ({PRODUCT_DATA.contact.whatsapp.slice(0, 2)}) {PRODUCT_DATA.contact.whatsapp.slice(2, 7)}-{PRODUCT_DATA.contact.whatsapp.slice(7)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{PRODUCT_DATA.contact.experience} • {PRODUCT_DATA.contact.projectsBuilt} construídos</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Calculator Integration */}
          {showCalculator && variant === 'interest' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-4xl mx-auto"
              id="calculator-widget"
            >
              <CalculatorWidget
                variant="comprehensive"
                className="bg-white/95 backdrop-blur-sm"
                onCalculate={(result) => {
                  trackInteraction('calculator');
                  // Could trigger additional CTAs based on calculation
                }}
              />
            </motion.div>
          )}

          {/* Contextual CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <ContextualCTA
              inline={true}
              className="bg-white/10 backdrop-blur-sm text-white border-white/20"
              showSecondary={false}
              page={page}
              customContent={{
                primary: variant === 'decision' ? 'Últimos minutos para decidir!' : undefined,
              }}
            />
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        variant={modalVariant}
        onSubmit={(data) => {
          console.log('Contact form submitted:', data);
          // Handle form submission
        }}
      />
    </>
  );
};

// Individual CTA Section Components for specific use cases
export const DiscoveryCTASection: React.FC<Omit<CTASectionProps, 'variant'>> = (props) => (
  <CTASection variant="discovery" {...props} />
);

export const InterestCTASection: React.FC<Omit<CTASectionProps, 'variant'>> = (props) => (
  <CTASection variant="interest" showCalculator={true} {...props} />
);

export const ConsiderationCTASection: React.FC<Omit<CTASectionProps, 'variant'>> = (props) => (
  <CTASection variant="consideration" {...props} />
);

export const DecisionCTASection: React.FC<Omit<CTASectionProps, 'variant'>> = (props) => (
  <CTASection variant="decision" {...props} />
);