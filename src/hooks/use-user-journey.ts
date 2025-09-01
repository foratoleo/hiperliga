'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserBehavior {
  scrollDepth: number;
  timeOnPage: number;
  pageInteractions: number;
  videoEngagement: number;
  calculatorUsage: number;
  exitIntent: boolean;
  isReturningVisitor: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  trafficSource: string;
}

export interface JourneyStage {
  stage: 'discovery' | 'interest' | 'consideration' | 'decision';
  confidence: number;
  triggers: string[];
}

export interface ContextualCTAData {
  stage: JourneyStage;
  behavior: UserBehavior;
  recommendations: {
    primaryCTA: string;
    secondaryCTA?: string;
    ctaType: 'educational' | 'interactive' | 'trust-building' | 'direct';
    urgency: 'low' | 'medium' | 'high';
    placement: 'inline' | 'floating' | 'modal';
  };
}

export const useUserJourney = () => {
  const [behavior, setBehavior] = useState<UserBehavior>({
    scrollDepth: 0,
    timeOnPage: 0,
    pageInteractions: 0,
    videoEngagement: 0,
    calculatorUsage: 0,
    exitIntent: false,
    isReturningVisitor: false,
    deviceType: 'desktop',
    trafficSource: 'direct',
  });

  const [journeyStage, setJourneyStage] = useState<JourneyStage>({
    stage: 'discovery',
    confidence: 0.8,
    triggers: ['first-visit'],
  });

  const [contextualCTA, setContextualCTA] = useState<ContextualCTAData | null>(null);

  // Track scroll depth
  const updateScrollDepth = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
    
    setBehavior(prev => ({ ...prev, scrollDepth }));
  }, []);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setBehavior(prev => ({ 
        ...prev, 
        timeOnPage: Math.floor((Date.now() - startTime) / 1000) 
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track scroll depth
  useEffect(() => {
    window.addEventListener('scroll', updateScrollDepth, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDepth);
  }, [updateScrollDepth]);

  // Track device type and traffic source
  useEffect(() => {
    // Device detection
    const userAgent = navigator.userAgent.toLowerCase();
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    
    if (/mobile|android|iphone/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = 'tablet';
    }

    // Traffic source detection (simplified)
    const referrer = document.referrer;
    let trafficSource = 'direct';
    
    if (referrer.includes('google')) trafficSource = 'google';
    else if (referrer.includes('facebook')) trafficSource = 'facebook';
    else if (referrer.includes('instagram')) trafficSource = 'instagram';
    else if (referrer) trafficSource = 'referral';

    // Check if returning visitor
    const isReturning = localStorage.getItem('hiperliga_visitor') !== null;
    if (!isReturning) {
      localStorage.setItem('hiperliga_visitor', Date.now().toString());
    }

    setBehavior(prev => ({
      ...prev,
      deviceType,
      trafficSource,
      isReturningVisitor: isReturning,
    }));
  }, []);

  // Track exit intent (mouse leaving viewport)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setBehavior(prev => ({ ...prev, exitIntent: true }));
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Journey stage calculation
  useEffect(() => {
    const calculateJourneyStage = (): JourneyStage => {
      const { scrollDepth, timeOnPage, pageInteractions, calculatorUsage, isReturningVisitor } = behavior;
      
      let stage: JourneyStage['stage'] = 'discovery';
      let confidence = 0.8;
      let triggers: string[] = [];

      // Discovery (0-25% scroll, < 30s, low interactions)
      if (scrollDepth < 25 && timeOnPage < 30 && pageInteractions < 2) {
        stage = 'discovery';
        triggers = ['low-scroll', 'short-time'];
        confidence = 0.9;
      }
      // Interest (25-60% scroll, 30-120s, some interactions)
      else if (scrollDepth >= 25 && scrollDepth < 60 && timeOnPage >= 30 && timeOnPage < 120) {
        stage = 'interest';
        triggers = ['medium-scroll', 'engaged-time'];
        confidence = 0.8;
      }
      // Consideration (60-85% scroll, >120s, calculator used, multiple interactions)
      else if (scrollDepth >= 60 && scrollDepth < 85 && (timeOnPage > 120 || calculatorUsage > 0 || pageInteractions > 3)) {
        stage = 'consideration';
        triggers = ['high-scroll', 'calculator-used', 'high-engagement'];
        confidence = 0.85;
      }
      // Decision (>85% scroll, high engagement, returning visitor)
      else if (scrollDepth >= 85 || isReturningVisitor || calculatorUsage > 1) {
        stage = 'decision';
        triggers = ['bottom-scroll', 'returning-visitor', 'high-calculator-usage'];
        confidence = 0.9;
      }

      return { stage, confidence, triggers };
    };

    const newStage = calculateJourneyStage();
    setJourneyStage(newStage);
  }, [behavior]);

  // Contextual CTA recommendations
  useEffect(() => {
    const generateContextualCTA = (): ContextualCTAData => {
      const { stage } = journeyStage;
      const { scrollDepth, deviceType, exitIntent } = behavior;

      let recommendations;

      switch (stage) {
        case 'discovery':
          recommendations = {
            primaryCTA: 'Descubra como economizar até 35% na sua obra',
            secondaryCTA: 'Veja o Hiperliga em ação (vídeo)',
            ctaType: 'educational' as const,
            urgency: 'low' as const,
            placement: scrollDepth < 15 ? 'inline' as const : 'floating' as const,
          };
          break;

        case 'interest':
          recommendations = {
            primaryCTA: 'Calcule sua economia agora',
            secondaryCTA: 'Compare com o método tradicional',
            ctaType: 'interactive' as const,
            urgency: 'medium' as const,
            placement: 'inline' as const,
          };
          break;

        case 'consideration':
          recommendations = {
            primaryCTA: 'Fale com um especialista',
            secondaryCTA: 'Veja projetos reais',
            ctaType: 'trust-building' as const,
            urgency: 'medium' as const,
            placement: 'floating' as const,
          };
          break;

        case 'decision':
          recommendations = {
            primaryCTA: 'Solicite seu orçamento',
            secondaryCTA: 'Converse no WhatsApp',
            ctaType: 'direct' as const,
            urgency: 'high' as const,
            placement: exitIntent ? 'modal' as const : 'floating' as const,
          };
          break;

        default:
          recommendations = {
            primaryCTA: 'Saiba mais sobre Hiperliga',
            ctaType: 'educational' as const,
            urgency: 'low' as const,
            placement: 'inline' as const,
          };
      }

      return {
        stage: journeyStage,
        behavior,
        recommendations,
      };
    };

    const newCTA = generateContextualCTA();
    setContextualCTA(newCTA);
  }, [journeyStage, behavior]);

  // Track interactions
  const trackInteraction = useCallback((type: 'click' | 'video' | 'calculator' | 'form') => {
    setBehavior(prev => {
      const updates: Partial<UserBehavior> = {
        pageInteractions: prev.pageInteractions + 1,
      };

      if (type === 'video') {
        updates.videoEngagement = prev.videoEngagement + 1;
      } else if (type === 'calculator') {
        updates.calculatorUsage = prev.calculatorUsage + 1;
      }

      return { ...prev, ...updates };
    });
  }, []);

  // A/B testing support
  const getABTestVariant = useCallback((testName: string, variants: string[]): string => {
    const userId = localStorage.getItem('hiperliga_user_id') || 
                  `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    if (!localStorage.getItem('hiperliga_user_id')) {
      localStorage.setItem('hiperliga_user_id', userId);
    }

    // Simple hash-based assignment
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const variantIndex = Math.abs(hash) % variants.length;
    return variants[variantIndex];
  }, []);

  return {
    behavior,
    journeyStage,
    contextualCTA,
    trackInteraction,
    getABTestVariant,
  };
};