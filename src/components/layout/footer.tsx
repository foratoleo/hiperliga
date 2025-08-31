'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

import { MAIN_NAVIGATION, CONTACT_INFO, COMPANY_INFO, SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

const socialIcons = {
  instagram: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C24.005 5.367 18.638.001 12.017.001zM8.449 16.988c-2.243 0-4.062-1.819-4.062-4.062s1.819-4.062 4.062-4.062 4.062 1.819 4.062 4.062-1.819 4.062-4.062 4.062zm7.138 0c-2.243 0-4.062-1.819-4.062-4.062s1.819-4.062 4.062-4.062 4.062 1.819 4.062 4.062-1.819 4.062-4.062 4.062z"/>
    </svg>
  ),
  facebook: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  youtube: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  linkedin: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const formatBusinessHours = (hours: string) => {
    if (hours === 'Fechado') return 'Fechado'
    return hours.replace(' - ', ' às ')
  }

  const handleSocialClick = (platform: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <footer className={cn('bg-muted/30 border-t', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Column 1: Brand & Credibility (2/5) */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative h-12 w-12">
                  <Image
                    src="/images/01_brand/logo_hiperliga-optimized.webp"
                    alt="Logo Hiperliga"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-xl font-bold text-brand-primary">
                    Hiperliga
                  </div>
                  <div className="text-sm text-muted-foreground">
                    by Gran Finelle
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                A revolução na construção civil. Argamassa polimérica 100% sustentável, 
                3x mais rápida e econômica.
              </p>

              {/* Credibility Indicators */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-sustainable-50 dark:bg-sustainable-900/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-sustainable-600">
                    {COMPANY_INFO.squareMetersBuilt}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    m² construídos
                  </div>
                </div>
                <div className="bg-brand-tech-light dark:bg-brand-tech-dark/20 rounded-lg p-3">
                  <div className="text-lg font-bold text-brand-primary">
                    {COMPANY_INFO.yearsInMarket}+ anos
                  </div>
                  <div className="text-xs text-muted-foreground">
                    no mercado
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Conecte-se conosco
                </h4>
                
                <div className="flex space-x-3">
                  {Object.entries(SITE_CONFIG.links).map(([platform, url]) => {
                    if (!url) return null
                    
                    return (
                      <button
                        key={platform}
                        onClick={() => handleSocialClick(platform, url)}
                        className="p-3 rounded-lg bg-muted hover:bg-sustainable-600 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sustainable-600"
                        aria-label={`Conecte-se conosco no ${platform}`}
                      >
                        {socialIcons[platform as keyof typeof socialIcons] || (
                          <div className="h-5 w-5 bg-current rounded" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Column 2: Navigation (1/5) */}
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
                Navegação
              </h3>
              
              <nav className="space-y-3">
                {MAIN_NAVIGATION.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-sustainable-600 transition-colors focus:outline-none focus:text-sustainable-600 block py-1"
                    >
                      {item.name}
                    </Link>
                    
                    {item.children && (
                      <div className="ml-3 mt-2 space-y-2 border-l border-border pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block text-xs text-muted-foreground hover:text-sustainable-600 transition-colors focus:outline-none focus:text-sustainable-600 py-0.5"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Column 3: Contact & Action (2/5) */}
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
                Fale Conosco
              </h3>
              
              <div className="space-y-4">
                {/* Primary Contact */}
                <div className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-sustainable-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-foreground leading-relaxed">
                      <div className="font-medium">{CONTACT_INFO.address.street}</div>
                      <div className="text-muted-foreground">
                        {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {CONTACT_INFO.phones.filter(phone => phone.isPrimary).map((phone, index) => (
                        <a
                          key={index}
                          href={phone.type === 'whatsapp' 
                            ? `https://wa.me/55${phone.number.replace(/\D/g, '')}` 
                            : `tel:${phone.number.replace(/\D/g, '')}`
                          }
                          className="flex items-center space-x-2 text-sm text-foreground hover:text-sustainable-600 transition-colors"
                          target={phone.type === 'whatsapp' ? '_blank' : undefined}
                          rel={phone.type === 'whatsapp' ? 'noopener noreferrer' : undefined}
                        >
                          <PhoneIcon className="h-4 w-4" />
                          <span>{phone.number}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-2">
                  <ClockIcon className="h-4 w-4 text-sustainable-600 mt-1 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <span className="font-medium text-foreground">Seg-Qui:</span>{' '}
                      {formatBusinessHours(CONTACT_INFO.businessHours.monday)}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Sexta:</span>{' '}
                      {formatBusinessHours(CONTACT_INFO.businessHours.friday)}
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-sustainable-50 to-brand-tech-light dark:from-sustainable-900/20 dark:to-brand-tech-dark/20 rounded-lg p-4 border border-sustainable-200 dark:border-sustainable-800">
                  <h4 className="font-semibold text-foreground mb-2">
                    Solicite um Orçamento
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Economize até 35% na sua obra com nossa tecnologia sustentável.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        const primaryPhone = CONTACT_INFO.phones.find(phone => phone.isPrimary && phone.type === 'whatsapp')
                        if (primaryPhone) {
                          const whatsappUrl = `https://wa.me/55${primaryPhone.number.replace(/\D/g, '')}`
                          window.open(whatsappUrl, '_blank')
                        }
                      }}
                      className="flex items-center justify-center px-4 py-2 bg-sustainable-600 hover:bg-sustainable-700 text-white text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-sustainable-600"
                    >
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      WhatsApp
                    </button>
                    
                    {CONTACT_INFO.emails.slice(0, 1).map((email, index) => (
                      <a
                        key={index}
                        href={`mailto:${email}`}
                        className="flex items-center justify-center px-4 py-2 border border-border hover:bg-accent text-foreground text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-sustainable-600"
                      >
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        E-mail
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              <div className="mb-1">
                © {currentYear} {COMPANY_INFO.name}. Todos os direitos reservados.
              </div>
              <div className="text-xs">
                {COMPANY_INFO.productName}® é uma marca registrada da {COMPANY_INFO.name}.
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-muted-foreground">
              <Link
                href="/politica-privacidade"
                className="hover:text-brand-primary transition-colors focus:outline-none focus:text-brand-primary"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/termos-uso"
                className="hover:text-brand-primary transition-colors focus:outline-none focus:text-brand-primary"
              >
                Termos de Uso
              </Link>
              <div className="text-center">
                Desenvolvido com ❤️ para a construção sustentável
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer