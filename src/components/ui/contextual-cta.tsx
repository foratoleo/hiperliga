'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  MessageCircle, 
  PlayCircle, 
  Download, 
  TrendingUp, 
  Users, 
  Clock,
  Shield,
  ArrowRight,
  Phone
} from 'lucide-react';
import { Button } from './button';
import { useUserJourney } from '@/hooks/use-user-journey';
import { getSmartCTA, generateWhatsAppLink, trackCTAPerformance, calculateLeadScore } from '@/lib/cta-logic';

interface ContextualCTAProps {
  className?: string;
  inline?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  showSecondary?: boolean;
  customContent?: {
    primary?: string;
    secondary?: string;
    whatsappMessage?: string;
  };
  onInteraction?: (action: string, data: any) => void;
  page?: 'home' | 'products' | 'about' | 'contact' | 'faq' | 'videos';
}

export const ContextualCTA: React.FC<ContextualCTAProps> = ({
  className = '',
  inline = false,
  variant = 'primary',
  showSecondary = true,
  customContent,
  onInteraction,
  page = 'home',
}) => {
  const { behavior, journeyStage, contextualCTA, trackInteraction, getABTestVariant } = useUserJourney();
  const [ctaContent, setCTAContent] = useState<any>(null);
  const [leadScore, setLeadScore] = useState(0);
  const [abTestVariant, setABTestVariant] = useState<string>('A');

  // Initialize A/B test variant
  useEffect(() => {
    const variant = getABTestVariant('contextual_cta_v1', ['A', 'B']);
    setABTestVariant(variant);
  }, [getABTestVariant]);

  // Calculate and update CTA content based on user behavior
  useEffect(() => {
    if (!contextualCTA) return;

    // Calculate lead score
    const score = calculateLeadScore(
      behavior.timeOnPage,
      behavior.scrollDepth,
      behavior.calculatorUsage,
      1, // page views (would be tracked across sessions)
      behavior.trafficSource,
      behavior.deviceType
    );
    setLeadScore(score);

    // Get smart CTA content
    const smartCTA = getSmartCTA(
      journeyStage.stage,
      behavior.scrollDepth,
      behavior.timeOnPage,
      behavior.deviceType,
      behavior.isReturningVisitor,
      behavior.calculatorUsage,
      abTestVariant
    );

    // Use custom content if provided, otherwise use smart CTA
    const finalContent = {
      primaryCTA: customContent?.primary || smartCTA.primaryCTA,
      secondaryCTA: customContent?.secondary || smartCTA.secondaryCTA,
      whatsappMessage: customContent?.whatsappMessage || smartCTA.whatsappMessage,
      stage: smartCTA.stage,
      urgency: smartCTA.urgency,
    };

    setCTAContent(finalContent);

    // Track impression
    trackCTAPerformance(
      `contextual_cta_${page}_${journeyStage.stage}`,
      journeyStage.stage,
      finalContent.primaryCTA,
      'impression'
    );
  }, [contextualCTA, behavior, journeyStage, abTestVariant, customContent, page]);

  // Page-specific CTA content
  const getPageSpecificContent = () => {
    const baseContent = ctaContent || {};
    
    switch (page) {
      case 'home':
        return {
          ...baseContent,
          icon: Calculator,
          action: () => handleCalculatorClick(),
          actionLabel: 'Calcular Economia',
        };
      case 'products':
        return {
          ...baseContent,
          icon: MessageCircle,
          action: () => handleWhatsAppClick(),
          actionLabel: 'Falar com Especialista',
        };
      case 'about':
        return {
          ...baseContent,
          icon: Users,
          action: () => handleWhatsAppClick(),
          actionLabel: 'Conhecer a Equipe',
        };
      case 'contact':
        return {
          ...baseContent,
          icon: Phone,
          action: () => handleWhatsAppClick(),
          actionLabel: 'Contato Imediato',
        };
      case 'videos':
        return {
          ...baseContent,
          icon: PlayCircle,
          action: () => handleVideoEngagement(),
          actionLabel: 'Ver Mais Vídeos',
        };
      case 'faq':
        return {
          ...baseContent,
          icon: MessageCircle,
          action: () => handleWhatsAppClick(),
          actionLabel: 'Tirar Dúvidas',
        };
      default:
        return {
          ...baseContent,
          icon: ArrowRight,
          action: () => handleWhatsAppClick(),
          actionLabel: 'Saiba Mais',
        };
    }
  };

  const handleCalculatorClick = () => {
    trackInteraction('calculator');
    trackCTAPerformance(
      `contextual_cta_${page}_${journeyStage.stage}`,
      journeyStage.stage,
      ctaContent?.primaryCTA || 'Calculator Click',
      'click'
    );

    if (onInteraction) {
      onInteraction('calculator_open', { leadScore, stage: journeyStage.stage });
    }

    // Scroll to calculator or open calculator modal
    const calculatorElement = document.getElementById('calculator-widget');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Open calculator in modal or navigate to calculator page
      window.location.hash = '#calculator';
    }
  };

  const handleWhatsAppClick = () => {
    if (!ctaContent) return;

    trackInteraction('click');
    trackCTAPerformance(
      `contextual_cta_${page}_${journeyStage.stage}`,
      journeyStage.stage,
      ctaContent.primaryCTA,
      'conversion'
    );

    const whatsappUrl = generateWhatsAppLink(ctaContent.whatsappMessage);
    
    if (onInteraction) {
      onInteraction('whatsapp_click', { 
        leadScore, 
        stage: journeyStage.stage,
        message: ctaContent.whatsappMessage 
      });
    }

    window.open(whatsappUrl, '_blank');
  };

  const handleSecondaryAction = () => {
    trackInteraction('click');
    trackCTAPerformance(
      `contextual_cta_secondary_${page}`,
      journeyStage.stage,
      ctaContent?.secondaryCTA || 'Secondary CTA',
      'click'
    );

    // Different secondary actions based on stage
    switch (journeyStage.stage) {
      case 'discovery':
        // Navigate to videos or demo
        window.location.href = '/videos';
        break;
      case 'interest':
        // Download technical specs
        window.location.href = '/docs/ficha-tecnica-hiperliga.pdf';
        break;
      case 'consideration':
        // Navigate to case studies
        window.location.href = '/cases';
        break;
      case 'decision':
        // Open contact form
        handleWhatsAppClick();
        break;
      default:
        window.location.href = '/products';
    }
  };

  const handleVideoEngagement = () => {
    trackInteraction('video');
    if (onInteraction) {
      onInteraction('video_engagement', { leadScore, stage: journeyStage.stage });
    }
  };

  const getUrgencyStyles = () => {
    const urgency = ctaContent?.urgency || 'low';
    
    switch (urgency) {
      case 'high':
        return {
          primary: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg animate-pulse',
          secondary: 'border-red-200 text-red-700 hover:bg-red-50',
          container: 'border-l-4 border-red-500 bg-red-50',
        };
      case 'medium':
        return {
          primary: 'bg-gradient-to-r from-hiperliga-600 to-blue-600 hover:from-hiperliga-700 hover:to-blue-700 shadow-md',
          secondary: 'border-hiperliga-200 text-hiperliga-700 hover:bg-hiperliga-50',
          container: 'border-l-4 border-hiperliga-500 bg-hiperliga-50',
        };
      default:
        return {
          primary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
          secondary: 'border-gray-200 text-gray-700 hover:bg-gray-50',
          container: 'border-l-4 border-gray-400 bg-gray-50',
        };
    }
  };

  if (!ctaContent) {
    return null;
  }

  const pageContent = getPageSpecificContent();
  const urgencyStyles = getUrgencyStyles();
  const Icon = pageContent.icon;

  const containerClass = inline 
    ? `p-4 rounded-lg ${urgencyStyles.container} ${className}`
    : `fixed bottom-6 right-6 z-40 max-w-sm ${className}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: inline ? 20 : 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: inline ? 20 : 100, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={containerClass}
      >
        {/* Lead Score Indicator (for high-score leads) */}
        {leadScore > 70 && !inline && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute -top-8 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
          >
            🔥 Lead Qualificado ({leadScore}%)
          </motion.div>
        )}

        <div className={inline ? '' : 'bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden'}>
          {/* Header (for floating CTAs) */}
          {!inline && (
            <div className="p-4 bg-gradient-to-r from-hiperliga-600 to-blue-600 text-white">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {journeyStage.stage === 'decision' ? 'Pronto para decidir?' : 
                   journeyStage.stage === 'consideration' ? 'Precisa de mais info?' :
                   journeyStage.stage === 'interest' ? 'Interessado?' : 'Descubra mais'}
                </span>
                <div className="ml-auto">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {journeyStage.confidence > 0.8 ? '🎯' : '💡'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className={inline ? '' : 'p-4'}>
            {/* Primary CTA */}
            <div className="space-y-3">
              <div className={inline ? 'mb-3' : ''}>
                <h4 className={`font-bold ${inline ? 'text-lg' : 'text-base'} text-gray-900 leading-tight`}>
                  {ctaContent.primaryCTA}
                </h4>
                {behavior.timeOnPage > 120 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Você está aqui há {Math.floor(behavior.timeOnPage / 60)} minutos. Vamos conversar?
                  </p>
                )}
              </div>

              <Button
                onClick={pageContent.action}
                className={`w-full text-sm font-semibold ${urgencyStyles.primary} text-white`}
                variant="sustainable"
              >
                <Icon className="w-4 h-4 mr-2" />
                {pageContent.actionLabel}
                {ctaContent.urgency === 'high' && (
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="ml-2"
                  >
                    🚀
                  </motion.span>
                )}
              </Button>

              {/* Secondary CTA */}
              {showSecondary && ctaContent.secondaryCTA && (
                <Button
                  onClick={handleSecondaryAction}
                  className={`w-full text-sm ${urgencyStyles.secondary} border-2`}
                  variant="secondary"
                >
                  {ctaContent.secondaryCTA}
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              )}
            </div>

            {/* Additional context for qualified leads */}
            {leadScore > 80 && inline && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm text-yellow-800">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Atendimento VIP disponível</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Para leads qualificados como você, oferecemos consultoria técnica gratuita.
                </p>
              </motion.div>
            )}
          </div>

          {/* Close button for floating CTAs */}
          {!inline && (
            <button
              onClick={() => {
                // Hide the CTA (you could add state management here)
                trackCTAPerformance(`contextual_cta_close_${page}`, journeyStage.stage, 'Close CTA', 'click');
              }}
              className="absolute top-2 right-2 text-white/60 hover:text-white/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};