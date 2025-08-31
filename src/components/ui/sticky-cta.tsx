'use client'

import * as React from 'react'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { CONTACT_INFO } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface StickyCTAProps {
  className?: string
}

export function StickyCTA({ className }: StickyCTAProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  // Show CTA after user scrolls down a bit
  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWhatsAppClick = () => {
    const primaryPhone = CONTACT_INFO.phones.find(phone => phone.isPrimary && phone.type === 'whatsapp')
    if (primaryPhone) {
      const message = encodeURIComponent('Olá! Gostaria de saber mais sobre a Hiperliga e solicitar um orçamento.')
      const whatsappUrl = `https://wa.me/55${primaryPhone.number.replace(/\D/g, '')}?text=${message}`
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCallClick = () => {
    const primaryPhone = CONTACT_INFO.phones.find(phone => phone.isPrimary)
    if (primaryPhone) {
      window.location.href = `tel:${primaryPhone.number.replace(/\D/g, '')}`
    }
  }

  if (!isVisible) return null

  return (
    <div 
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 shadow-premium md:hidden',
        'animate-slide-up',
        className
      )}
    >
      <div className="flex items-center gap-3 max-w-sm mx-auto">
        {/* WhatsApp CTA - Primary */}
        <button
          onClick={handleWhatsAppClick}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-sm rounded-lg shadow-glow-green hover:shadow-luxury active:scale-95 transition-all duration-300"
          aria-label="Contatar via WhatsApp para orçamento"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
          </svg>
          <span>Orçamento WhatsApp</span>
        </button>

        {/* Phone CTA - Secondary */}
        <button
          onClick={handleCallClick}
          className="flex items-center justify-center px-4 py-3 border-2 border-sustainable-600 bg-background hover:bg-sustainable-600 text-sustainable-600 hover:text-white font-semibold rounded-lg transition-all duration-300 active:scale-95 min-w-[56px]"
          aria-label="Ligar agora para a Hiperliga"
        >
          <PhoneIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Optional: Collapse Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Fechar barra de contato"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default StickyCTA