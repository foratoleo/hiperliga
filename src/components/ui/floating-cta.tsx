'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Calculator, Phone, Mail, ArrowRight } from 'lucide-react';
import { useUserJourney } from '@/hooks/use-user-journey';
import { generateWhatsAppLink, trackCTAPerformance, PRODUCT_DATA } from '@/lib/cta-logic';

interface FloatingCTAProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  showExitIntent?: boolean;
  autoHide?: boolean;
  hideAfter?: number; // seconds
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({
  className = '',
  position = 'bottom-right',
  showExitIntent = true,
  autoHide = false,
  hideAfter = 30,
}) => {
  const { behavior, journeyStage, contextualCTA, trackInteraction } = useUserJourney();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Show CTA based on user behavior
  useEffect(() => {
    const shouldShow = 
      behavior.scrollDepth > 15 || 
      behavior.timeOnPage > 10 || 
      behavior.pageInteractions > 1;
    
    if (shouldShow && !isVisible) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [behavior.scrollDepth, behavior.timeOnPage, behavior.pageInteractions, isVisible]);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && isVisible && !hasInteracted) {
      const timer = setTimeout(() => {
        if (!hasInteracted) setIsVisible(false);
      }, hideAfter * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoHide, hideAfter, isVisible, hasInteracted]);

  // Exit intent modal
  useEffect(() => {
    if (!showExitIntent || behavior.deviceType === 'mobile') return;

    if (behavior.exitIntent && !hasInteracted && !showExitModal) {
      setShowExitModal(true);
      trackCTAPerformance('exit_intent_modal', journeyStage.stage, 'Exit Intent Triggered', 'impression');
    }
  }, [behavior.exitIntent, hasInteracted, showExitIntent, showExitModal, journeyStage.stage, behavior.deviceType]);

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
      default:
        return 'bottom-6 right-6';
    }
  };

  const handleWhatsAppClick = (source: 'main' | 'expanded' | 'exit') => {
    setHasInteracted(true);
    trackInteraction('click');
    trackCTAPerformance(`floating_whatsapp_${source}`, journeyStage.stage, 'WhatsApp Click', 'conversion');

    const message = getContextualMessage();
    const whatsappUrl = generateWhatsAppLink(message);
    window.open(whatsappUrl, '_blank');

    if (source === 'exit') {
      setShowExitModal(false);
    }
  };

  const getContextualMessage = () => {
    const baseMessage = `Olá! Vim do site da Hiperliga e gostaria de mais informações.`;
    
    if (behavior.calculatorUsage > 0) {
      return `${baseMessage} Já usei a calculadora e tenho interesse em orçamento.`;
    }
    
    switch (journeyStage.stage) {
      case 'decision':
        return `${baseMessage} Estou pronto para fazer o orçamento.`;
      case 'consideration':
        return `${baseMessage} Gostaria de tirar algumas dúvidas sobre aplicação.`;
      case 'interest':
        return `${baseMessage} Quero entender melhor os benefícios do produto.`;
      default:
        return baseMessage;
    }
  };

  const handleCalculatorClick = () => {
    setHasInteracted(true);
    setIsExpanded(false);
    trackInteraction('calculator');
    trackCTAPerformance('floating_calculator', journeyStage.stage, 'Calculator Open', 'click');

    // Scroll to calculator or open in modal
    const calculatorElement = document.getElementById('calculator-widget');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Create and show calculator modal
      window.location.hash = '#calculator';
    }
  };

  const handleCloseExit = () => {
    setShowExitModal(false);
    trackCTAPerformance('exit_intent_close', journeyStage.stage, 'Exit Modal Closed', 'click');
  };

  if (!isVisible && !showExitModal) return null;

  return (
    <>
      {/* Main Floating CTA */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed ${getPositionStyles()} z-50 ${className}`}
          >
            <div className="relative">
              {/* Expanded Menu */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 min-w-[280px]"
                  >
                    {/* Header */}
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-1">
                        Como podemos ajudar?
                      </h4>
                      <p className="text-sm text-gray-600">
                        {journeyStage.stage === 'decision' ? 'Pronto para solicitar orçamento?' :
                         journeyStage.stage === 'consideration' ? 'Tem alguma dúvida?' :
                         journeyStage.stage === 'interest' ? 'Quer saber mais?' :
                         'Escolha a melhor opção para você'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleWhatsAppClick('expanded')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 border-2 border-green-200 transition-colors group"
                      >
                        <div className="p-2 bg-green-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-green-800">WhatsApp</div>
                          <div className="text-xs text-green-600">Resposta imediata</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={handleCalculatorClick}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 transition-colors group"
                      >
                        <div className="p-2 bg-blue-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-blue-800">Calculadora</div>
                          <div className="text-xs text-blue-600">Calcule sua economia</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => {
                          window.location.href = 'tel:' + PRODUCT_DATA.contact.whatsapp;
                          trackCTAPerformance('floating_phone', journeyStage.stage, 'Phone Call', 'conversion');
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 transition-colors group"
                      >
                        <div className="p-2 bg-orange-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-orange-800">Ligar Agora</div>
                          <div className="text-xs text-orange-600">Fale direto conosco</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        ⭐ {PRODUCT_DATA.contact.experience} • {PRODUCT_DATA.contact.projectsBuilt} construídos
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main CTA Button */}
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Pulse animation */}
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                
                {/* Icon */}
                <div className="relative z-10">
                  {isExpanded ? (
                    <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                  ) : (
                    <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
                  )}
                </div>

                {/* Notification Badge */}
                {behavior.timeOnPage > 60 && !hasInteracted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold"
                  >
                    1
                  </motion.div>
                )}
              </motion.button>

              {/* Tooltip */}
              {!isExpanded && behavior.scrollDepth > 50 && !hasInteracted && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
                >
                  Fale conosco!
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
                    <div className="border-4 border-transparent border-r-gray-900"></div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Intent Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={handleCloseExit}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseExit}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="mb-6">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl mb-4"
                >
                  ⏰
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Antes de sair!
                </h3>
                <p className="text-gray-600">
                  Não perca a oportunidade de economizar até <strong>35%</strong> na sua obra.
                  Fale conosco agora e tire suas dúvidas!
                </p>
              </div>

              {/* Offer */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6 border-2 border-green-200">
                <h4 className="font-bold text-green-800 mb-2">🎁 Oferta Especial</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✅ Consultoria técnica gratuita</li>
                  <li>✅ Cálculo personalizado da sua economia</li>
                  <li>✅ Suporte completo na aplicação</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => handleWhatsAppClick('exit')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp Agora
                </button>
                
                <button
                  onClick={handleCloseExit}
                  className="w-full text-gray-500 hover:text-gray-700 py-2 transition-colors"
                >
                  Talvez mais tarde
                </button>
              </div>

              {/* Social Proof */}
              <p className="text-xs text-gray-500 mt-4">
                🏆 Mais de 3 milhões de m² construídos com Hiperliga
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};