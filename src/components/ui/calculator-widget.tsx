'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingDown, Clock, Droplets, Weight } from 'lucide-react';
import { Button } from './button';
import { calculateProjectMetrics, generateWhatsAppLink, trackCTAPerformance, PRODUCT_DATA } from '@/lib/cta-logic';
import { useUserJourney } from '@/hooks/use-user-journey';

interface CalculatorResult {
  area: number;
  hiperliga: {
    bags: number;
    weight: number;
    cost: number;
    days: number;
    waterLiters: number;
  };
  traditional: {
    weight: number;
    cost: number;
    days: number;
    waterLiters: number;
  };
  savings: {
    cost: number;
    percentage: number;
    weight: number;
    time: number;
    water: number;
  };
}

interface CalculatorWidgetProps {
  variant?: 'economy' | 'yield' | 'time' | 'comprehensive';
  title?: string;
  className?: string;
  onCalculate?: (result: CalculatorResult) => void;
  showLeadCapture?: boolean;
}

export const CalculatorWidget: React.FC<CalculatorWidgetProps> = ({
  variant = 'comprehensive',
  title,
  className = '',
  onCalculate,
  showLeadCapture = true,
}) => {
  const [area, setArea] = useState<string>('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '', phone: '' });
  const { trackInteraction } = useUserJourney();

  const handleCalculate = useCallback(async () => {
    const areaNum = parseFloat(area);
    if (!areaNum || areaNum <= 0) {
      alert('Por favor, insira uma área válida em metros quadrados.');
      return;
    }

    setIsCalculating(true);
    trackInteraction('calculator');
    trackCTAPerformance(`calculator_${variant}`, 'interest', 'Calculate Project', 'click');

    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const calculationResult = calculateProjectMetrics(areaNum);
    setResult(calculationResult);
    setShowResult(true);
    setIsCalculating(false);

    if (onCalculate) {
      onCalculate(calculationResult as any);
    }
  }, [area, variant, onCalculate, trackInteraction]);

  const handleWhatsAppContact = () => {
    if (!result) return;

    const message = PRODUCT_DATA.contact.whatsapp;
    const whatsappUrl = generateWhatsAppLink(
      `Olá! Calculei meu projeto de ${result.area}m² no site e gostaria de mais informações.`,
      result.area,
      result
    );

    trackInteraction('click');
    trackCTAPerformance('whatsapp_calculator', 'decision', 'WhatsApp Contact', 'conversion');
    window.open(whatsappUrl, '_blank');
  };

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send to your CRM/database
    console.log('Lead captured:', { ...leadData, calculatorResult: result });
    
    trackCTAPerformance('lead_capture', 'decision', 'Email Capture', 'conversion');
    
    // Show success state and WhatsApp option
    setShowLeadForm(false);
    alert('Obrigado! Em breve entraremos em contato. Que tal conversar agora no WhatsApp?');
  };

  const getVariantConfig = () => {
    switch (variant) {
      case 'economy':
        return {
          title: title || 'Calculadora de Economia',
          icon: TrendingDown,
          color: 'bg-green-500',
          description: 'Descubra quanto você pode economizar',
          focusMetric: 'cost',
        };
      case 'yield':
        return {
          title: title || 'Calculadora de Rendimento',
          icon: Weight,
          color: 'bg-blue-500',
          description: 'Calcule a quantidade necessária',
          focusMetric: 'bags',
        };
      case 'time':
        return {
          title: title || 'Calculadora de Tempo',
          icon: Clock,
          color: 'bg-orange-500',
          description: 'Veja quanto tempo você vai economizar',
          focusMetric: 'time',
        };
      default:
        return {
          title: title || 'Calculadora Completa Hiperliga',
          icon: Calculator,
          color: 'bg-hiperliga-600',
          description: 'Análise completa do seu projeto',
          focusMetric: 'comprehensive',
        };
    }
  };

  const config = getVariantConfig();
  const Icon = config.icon;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className={`${config.color} text-white p-6`}>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">{config.title}</h3>
            <p className="text-white/90 text-sm mt-1">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área do projeto (metros quadrados)
            </label>
            <div className="relative">
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Ex: 100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiperliga-500 focus:border-hiperliga-500 transition-colors"
                min="1"
                step="0.1"
              />
              <span className="absolute right-3 top-3 text-gray-500 text-sm">m²</span>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!area || isCalculating}
            className="w-full py-3"
            variant="default"
          >
            {isCalculating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Calculando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Calcular Economia
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 bg-gray-50">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  Resultados para {result.area}m²
                </h4>
                <p className="text-gray-600">
                  Veja as vantagens do Hiperliga no seu projeto
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Economy Focus */}
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Economia</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(result.savings.cost)}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {result.savings.percentage}% de economia vs. tradicional
                  </div>
                </div>

                {/* Time Savings */}
                <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">Tempo</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-700">
                    {result.savings.time} dias
                  </div>
                  <div className="text-sm text-orange-600 mt-1">
                    a menos de execução (3x mais rápido)
                  </div>
                </div>

                {/* Material Efficiency */}
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Material</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {result.hiperliga.bags} sacos
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    de 3kg cada (vs. {result.traditional.weight}kg tradicional)
                  </div>
                </div>

                {/* Water Savings */}
                <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold text-cyan-800">Água</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-700">
                    {result.savings.water}L
                  </div>
                  <div className="text-sm text-cyan-600 mt-1">
                    menos água necessária (21x economia)
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-lg p-4 border-2 border-hiperliga-200 mb-6">
                <h5 className="font-semibold text-hiperliga-800 mb-2">Resumo do Projeto</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Hiperliga necessário:</span>
                    <div className="font-semibold">{result.hiperliga.bags} sacos de 3kg</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Custo estimado:</span>
                    <div className="font-semibold">{formatCurrency(result.hiperliga.cost)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Tempo de execução:</span>
                    <div className="font-semibold">{result.hiperliga.days} dias</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Água necessária:</span>
                    <div className="font-semibold">{result.hiperliga.waterLiters}L</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full"
                  variant="sustainable"
                >
                  💬 Solicitar Orçamento no WhatsApp
                </Button>

                {showLeadCapture && !showLeadForm && (
                  <Button
                    onClick={() => setShowLeadForm(true)}
                    className="w-full"
                    variant="secondary"
                  >
                    📧 Receber Proposta Detalhada por Email
                  </Button>
                )}
              </div>

              {/* Lead Capture Form */}
              <AnimatePresence>
                {showLeadForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleLeadCapture}
                    className="mt-4 p-4 bg-gray-100 rounded-lg"
                  >
                    <h6 className="font-semibold mb-3">Receba sua proposta personalizada:</h6>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder="Seu nome completo"
                        value={leadData.name}
                        onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-hiperliga-500"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Seu melhor email"
                        value={leadData.email}
                        onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-hiperliga-500"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Seu telefone/WhatsApp"
                        value={leadData.phone}
                        onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-hiperliga-500"
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1" variant="sustainable">
                          Enviar Proposta
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => setShowLeadForm(false)}
                          variant="secondary"
                          className="px-4"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};