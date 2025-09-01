// CTA Intelligence Logic for Hiperliga Website
// Real product data and conversion optimization patterns

export interface ProductData {
  hiperliga: {
    coverage: 20; // m² per 3kg bag
    efficiency: 20; // 1 bag = 60kg traditional
    waterReduction: 21; // 21x less water
    costSavings: 35; // 35% savings
    applicationSpeed: 3; // 3x faster
  };
  contact: {
    whatsapp: '5541988883365';
    location: 'Almirante Tamandaré-PR';
    experience: '10+ anos';
    projectsBuilt: '3M+ m²';
  };
  pricing: {
    traditional: 25; // R$ per m² (estimated)
    hiperliga: 16.25; // R$ per m² (35% savings)
  };
}

export const PRODUCT_DATA: ProductData = {
  hiperliga: {
    coverage: 20,
    efficiency: 20,
    waterReduction: 21,
    costSavings: 35,
    applicationSpeed: 3,
  },
  contact: {
    whatsapp: '5541988883365',
    location: 'Almirante Tamandaré-PR',
    experience: '10+ anos',
    projectsBuilt: '3M+ m²',
  },
  pricing: {
    traditional: 25,
    hiperliga: 16.25,
  },
};

// Calculator functions using real data
export const calculateProjectMetrics = (areaM2: number) => {
  const { hiperliga, pricing } = PRODUCT_DATA;
  
  // Hiperliga requirements
  const hiperligigaBags = Math.ceil(areaM2 / hiperliga.coverage);
  const hiperligigaWeight = hiperligigaBags * 3; // kg
  
  // Traditional requirements (for comparison)
  const traditionalWeight = hiperligigaBags * 60; // 1 bag = 60kg traditional
  const traditionalWater = hiperligigaWeight * hiperliga.waterReduction; // 21x more water needed
  
  // Cost calculations
  const traditionalCost = areaM2 * pricing.traditional;
  const hiperligigaCost = areaM2 * pricing.hiperliga;
  const savings = traditionalCost - hiperligigaCost;
  const savingsPercentage = hiperliga.costSavings;
  
  // Time calculations (assuming 1 day per 10m² traditional)
  const traditionalDays = Math.ceil(areaM2 / 10);
  const hiperligigaDays = Math.ceil(traditionalDays / hiperliga.applicationSpeed);
  
  return {
    area: areaM2,
    hiperliga: {
      bags: hiperligigaBags,
      weight: hiperligigaWeight,
      cost: hiperligigaCost,
      days: hiperligigaDays,
      waterLiters: Math.round(hiperligigaWeight * 0.5), // Approximate
    },
    traditional: {
      weight: traditionalWeight,
      cost: traditionalCost,
      days: traditionalDays,
      waterLiters: traditionalWater,
    },
    savings: {
      cost: savings,
      percentage: savingsPercentage,
      weight: traditionalWeight - hiperligigaWeight,
      time: traditionalDays - hiperligigaDays,
      water: traditionalWater - Math.round(hiperligigaWeight * 0.5),
    },
  };
};

// CTA content templates with real data
export const CTA_TEMPLATES = {
  discovery: {
    primary: [
      'Economize até 35% na sua obra',
      'Descubra o segredo da construção moderna',
      'Veja como 3kg fazem o trabalho de 60kg',
      'Conheça a revolução da construção',
    ],
    secondary: [
      'Assista ao vídeo demonstrativo',
      'Veja Hiperliga em ação',
      'Como funciona na prática',
      'Projetos reais em 60 segundos',
    ],
    whatsappMessage: 'Olá! Gostaria de saber mais sobre o Hiperliga e seus benefícios.',
  },
  interest: {
    primary: [
      'Calcule sua economia agora',
      'Descubra quanto você vai economizar',
      'Simule o custo do seu projeto',
      'Veja sua economia em tempo real',
    ],
    secondary: [
      'Compare com método tradicional',
      'Download da ficha técnica',
      'Veja especificações completas',
      'Entenda as vantagens técnicas',
    ],
    whatsappMessage: 'Olá! Tenho interesse em conhecer melhor os benefícios do Hiperliga para meu projeto.',
  },
  consideration: {
    primary: [
      'Fale com um especialista',
      'Tire suas dúvidas com quem entende',
      'Consultoria gratuita personalizada',
      'Especialista disponível agora',
    ],
    secondary: [
      'Veja projetos executados',
      'Cases de sucesso reais',
      'Depoimentos de clientes',
      'Galeria de projetos',
    ],
    whatsappMessage: 'Olá! Estou avaliando o Hiperliga para meu projeto e gostaria de falar com um especialista.',
  },
  decision: {
    primary: [
      'Solicite seu orçamento agora',
      'Compre Hiperliga com desconto',
      'Garanta sua economia hoje',
      'Peça seu orçamento personalizado',
    ],
    secondary: [
      'WhatsApp: resposta imediata',
      'Atendimento personalizado',
      'Suporte técnico completo',
      'Acompanhamento do projeto',
    ],
    whatsappMessage: 'Olá! Quero solicitar um orçamento para Hiperliga. Meu projeto tem aproximadamente [ÁREA]m².',
  },
  exitIntent: {
    primary: [
      'Antes de sair: economize 35% agora!',
      'Não perca esta oportunidade!',
      'Últimos minutos: consultoria grátis',
      'Ainda tem dúvidas? Vamos ajudar!',
    ],
    offers: [
      'Consultoria técnica gratuita',
      'Amostra grátis para teste',
      '10% desconto na primeira compra',
      'Guia completo de aplicação',
    ],
    whatsappMessage: 'Olá! Vi o site do Hiperliga e tenho algumas dúvidas. Podem me ajudar?',
  },
};

// Smart CTA selection based on user behavior
export const getSmartCTA = (
  stage: 'discovery' | 'interest' | 'consideration' | 'decision',
  scrollDepth: number,
  timeOnPage: number,
  deviceType: 'mobile' | 'tablet' | 'desktop',
  isReturningVisitor: boolean,
  calculatorUsage: number,
  abTestVariant?: string
) => {
  const templates = CTA_TEMPLATES[stage];
  
  // Primary CTA selection logic
  let primaryCTA: string;
  let secondaryCTA: string | undefined;
  let whatsappMessage: string;
  
  // A/B testing variants
  const primaryIndex = abTestVariant === 'B' ? 1 : 
                      isReturningVisitor ? 2 : 
                      calculatorUsage > 0 ? 3 : 0;
  
  primaryCTA = templates.primary[primaryIndex] || templates.primary[0];
  secondaryCTA = templates.secondary[0];
  whatsappMessage = templates.whatsappMessage;
  
  // Adjust based on behavior
  if (timeOnPage > 180 && stage === 'consideration') {
    primaryCTA = 'Já está há mais de 3 min aqui. Vamos conversar?';
  }
  
  if (scrollDepth > 90 && stage !== 'decision') {
    primaryCTA = 'Chegou até aqui? Vamos fechar negócio!';
    stage = 'decision';
  }
  
  if (deviceType === 'mobile') {
    // Mobile-optimized CTAs (shorter)
    primaryCTA = primaryCTA.length > 30 ? 
      templates.primary.find(cta => cta.length <= 30) || primaryCTA :
      primaryCTA;
  }
  
  return {
    primaryCTA,
    secondaryCTA,
    whatsappMessage,
    stage,
    urgency: stage === 'decision' ? 'high' : stage === 'consideration' ? 'medium' : 'low',
  };
};

// WhatsApp link generator
export const generateWhatsAppLink = (
  message: string, 
  projectArea?: number,
  calculatorResults?: ReturnType<typeof calculateProjectMetrics>
) => {
  let finalMessage = message;
  
  // Personalize message with calculator data
  if (projectArea) {
    finalMessage = finalMessage.replace('[ÁREA]', projectArea.toString());
  }
  
  if (calculatorResults) {
    finalMessage += `\n\nDetalhes do meu projeto:\n`;
    finalMessage += `• Área: ${calculatorResults.area}m²\n`;
    finalMessage += `• Economia estimada: R$ ${calculatorResults.savings.cost.toFixed(2)}\n`;
    finalMessage += `• Tempo de execução: ${calculatorResults.hiperliga.days} dias`;
  }
  
  const encodedMessage = encodeURIComponent(finalMessage);
  return `https://wa.me/${PRODUCT_DATA.contact.whatsapp}?text=${encodedMessage}`;
};

// CTA performance tracking
export interface CTAMetrics {
  id: string;
  stage: string;
  content: string;
  impressions: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  timestamp: number;
}

export const trackCTAPerformance = (
  ctaId: string,
  stage: string,
  content: string,
  action: 'impression' | 'click' | 'conversion'
) => {
  // Get existing metrics from localStorage
  const existingMetrics = JSON.parse(
    localStorage.getItem('hiperliga_cta_metrics') || '[]'
  ) as CTAMetrics[];
  
  // Find or create metric entry
  let metric = existingMetrics.find(m => m.id === ctaId);
  if (!metric) {
    metric = {
      id: ctaId,
      stage,
      content,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      conversionRate: 0,
      timestamp: Date.now(),
    };
    existingMetrics.push(metric);
  }
  
  // Update metrics
  switch (action) {
    case 'impression':
      metric.impressions++;
      break;
    case 'click':
      metric.clicks++;
      break;
    case 'conversion':
      metric.conversions++;
      break;
  }
  
  // Calculate conversion rate
  metric.conversionRate = metric.impressions > 0 ? 
    (metric.conversions / metric.impressions) * 100 : 0;
  
  // Save back to localStorage
  localStorage.setItem('hiperliga_cta_metrics', JSON.stringify(existingMetrics));
  
  // Send to analytics (placeholder)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', `cta_${action}`, {
      event_category: 'CTA',
      event_label: `${stage}_${ctaId}`,
      value: action === 'conversion' ? 1 : 0,
    });
  }
};

// Lead qualification scoring
export const calculateLeadScore = (
  timeOnPage: number,
  scrollDepth: number,
  calculatorUsage: number,
  pageViews: number,
  trafficSource: string,
  deviceType: string
) => {
  let score = 0;
  
  // Time engagement (0-25 points)
  if (timeOnPage > 300) score += 25; // 5+ minutes
  else if (timeOnPage > 180) score += 20; // 3+ minutes
  else if (timeOnPage > 120) score += 15; // 2+ minutes
  else if (timeOnPage > 60) score += 10; // 1+ minute
  
  // Scroll engagement (0-20 points)
  if (scrollDepth > 90) score += 20;
  else if (scrollDepth > 70) score += 15;
  else if (scrollDepth > 50) score += 10;
  else if (scrollDepth > 25) score += 5;
  
  // Calculator usage (0-30 points)
  score += Math.min(calculatorUsage * 15, 30);
  
  // Page views (0-15 points)
  score += Math.min(pageViews * 3, 15);
  
  // Traffic source quality (0-10 points)
  if (trafficSource === 'google') score += 10;
  else if (trafficSource === 'referral') score += 8;
  else if (trafficSource === 'facebook') score += 6;
  else score += 5; // direct
  
  // Device type (mobile users often more ready to buy)
  if (deviceType === 'mobile') score += 5;
  
  return Math.min(score, 100); // Cap at 100
};