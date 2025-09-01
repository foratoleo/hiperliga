'use client'

import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { getDepoimentos } from '@/lib/depoimentos-data'
import { H1, P } from '@/components/ui/typography'

export default function DepoimentosPage() {
  const depoimentosData = getDepoimentos()

  return (
    <div>
      {/* Hero Section */}
      <Section className="py-16 bg-gradient-to-br from-hiperliga-600 to-hiperliga-700 text-white">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <H1 className="text-white mb-6">
              O que nossos clientes dizem sobre a Hiperliga
            </H1>
            <P className="text-lg text-white/90">
              Depoimentos reais de profissionais e consumidores que confiam na qualidade 
              e eficiência da nossa argamassa polimérica revolucionária.
            </P>
          </div>
        </Container>
      </Section>

      {/* Full Testimonials Section with Stats */}
      <TestimonialsSection 
        data={depoimentosData} 
        showStats={true} 
        autoPlay={true} 
        autoPlayInterval={8000}
      />

      {/* Additional Statistics Section */}
      <Section className="bg-muted/30">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Por que confiam na Hiperliga?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-hiperliga-600 mb-2">100%</div>
                <h3 className="font-semibold mb-2">Satisfação Comprovada</h3>
                <p className="text-muted-foreground text-sm">
                  Todos os clientes avaliam positivamente a qualidade e praticidade
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-hiperliga-600 mb-2">10+</div>
                <h3 className="font-semibold mb-2">Anos de Confiança</h3>
                <p className="text-muted-foreground text-sm">
                  Mais de uma década construindo relacionamentos sólidos
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-hiperliga-600 mb-2">3M+</div>
                <h3 className="font-semibold mb-2">Metros Aplicados</h3>
                <p className="text-muted-foreground text-sm">
                  Milhões de metros quadrados construídos com sucesso
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}