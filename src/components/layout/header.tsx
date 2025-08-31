'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bars3Icon, 
  XMarkIcon, 
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { MAIN_NAVIGATION, CONTACT_INFO } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { NavigationItem } from '@/types'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  const pathname = usePathname()

  // Handle scroll effect for sticky header
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when pathname changes
  React.useEffect(() => {
    setIsOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  // Close mobile menu on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setActiveDropdown(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const isActiveLink = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const handleContactClick = () => {
    const primaryPhone = CONTACT_INFO.phones.find(phone => phone.isPrimary)
    if (primaryPhone?.type === 'whatsapp') {
      const whatsappUrl = `https://wa.me/55${primaryPhone.number.replace(/\D/g, '')}`
      window.open(whatsappUrl, '_blank')
    } else {
      // Fallback to contact page
      window.location.href = '/contato'
    }
  }

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                   bg-brand-primary text-white px-4 py-2 rounded-md z-50 
                   focus:outline-none focus:ring-2 focus:ring-white"
      >
        Pular para o conteúdo principal
      </a>

      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm'
            : 'bg-background',
          className
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                href="/"
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-md"
                aria-label="Ir para página inicial da Hiperliga"
              >
                <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                  <OptimizedImage
                    src="/images/01_brand/logo_hiperliga-optimized.webp"
                    alt="Logo Hiperliga"
                    category="brand"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-extrabold text-brand-primary tracking-tight">
                    Hiperliga
                  </div>
                  <div className="text-xs text-muted-foreground/80 font-medium">
                    by Gran Finelle
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1" role="navigation">
              {MAIN_NAVIGATION.map((item) => (
                <div key={item.name} className="relative">
                  {item.children ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        className={cn(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          'focus:outline-none focus:ring-2 focus:ring-brand-primary',
                          isActiveLink(item.href)
                            ? 'bg-brand-primary/10 text-brand-primary'
                            : 'text-foreground'
                        )}
                        aria-expanded={activeDropdown === item.name}
                        aria-haspopup="true"
                      >
                        {item.name}
                        <ChevronDownIcon 
                          className={cn(
                            'ml-1 h-4 w-4 transition-transform',
                            activeDropdown === item.name && 'rotate-180'
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-1 w-64 bg-background/95 backdrop-blur-sm border border-border/50 rounded-md shadow-lg py-1"
                            role="menu"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={cn(
                                  'block px-4 py-3 text-sm transition-colors',
                                  'hover:bg-accent hover:text-accent-foreground',
                                  'focus:outline-none focus:bg-accent',
                                  isActiveLink(child.href)
                                    ? 'bg-brand-primary/5 text-brand-primary'
                                    : 'text-foreground'
                                )}
                                role="menuitem"
                              >
                                <div className="font-medium">{child.name}</div>
                                {child.description && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {child.description}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-brand-primary',
                        isActiveLink(item.href)
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'text-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Theme Toggle - Hidden on mobile for space optimization */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Contact CTA - Enhanced mobile visibility */}
              <div className="hidden sm:block">
                <Button
                  onClick={handleContactClick}
                  size="sm"
                  className="bg-sustainable-600 hover:bg-sustainable-700 hover:-translate-y-px hover:shadow-lg hover:shadow-sustainable-600/30 transition-all duration-200"
                >
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Orçamento</span>
                  <span className="md:hidden">Contato</span>
                </Button>
              </div>

              {/* Mobile-only WhatsApp CTA */}
              <div className="sm:hidden">
                <Button
                  onClick={handleContactClick}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 min-h-[44px] min-w-[44px]"
                  aria-label="Contato via WhatsApp"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                  </svg>
                </Button>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden min-h-[44px] min-w-[44px]"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm md:hidden"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />

              {/* Mobile Navigation Panel */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-background border-t border-border"
              >
                <nav className="container mx-auto px-4 py-4 space-y-2" role="navigation">
                  {MAIN_NAVIGATION.map((item) => (
                    <div key={item.name}>
                      {item.children ? (
                        <div>
                          <button
                            className={cn(
                              'flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md transition-colors',
                              'hover:bg-accent hover:text-accent-foreground',
                              'focus:outline-none focus:ring-2 focus:ring-brand-primary',
                              isActiveLink(item.href)
                                ? 'bg-brand-primary/10 text-brand-primary'
                                : 'text-foreground'
                            )}
                            onClick={() => toggleDropdown(item.name)}
                            aria-expanded={activeDropdown === item.name}
                          >
                            {item.name}
                            <ChevronDownIcon 
                              className={cn(
                                'h-5 w-5 transition-transform',
                                activeDropdown === item.name && 'rotate-180'
                              )}
                            />
                          </button>

                          <AnimatePresence>
                            {activeDropdown === item.name && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-6 py-2 space-y-1">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.name}
                                      href={child.href}
                                      className={cn(
                                        'block px-3 py-2 text-sm rounded-md transition-colors',
                                        'hover:bg-accent hover:text-accent-foreground',
                                        'focus:outline-none focus:ring-2 focus:ring-brand-primary',
                                        isActiveLink(child.href)
                                          ? 'bg-brand-primary/10 text-brand-primary'
                                          : 'text-muted-foreground'
                                      )}
                                    >
                                      {child.name}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            'block px-3 py-2 text-base font-medium rounded-md transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            'focus:outline-none focus:ring-2 focus:ring-brand-primary',
                            isActiveLink(item.href)
                              ? 'bg-brand-primary/10 text-brand-primary'
                              : 'text-foreground'
                          )}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* Mobile Contact CTA */}
                  <div className="pt-4 space-y-2">
                    <Button
                      onClick={handleContactClick}
                      className="w-full bg-sustainable-600 hover:bg-sustainable-700"
                    >
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Solicitar Orçamento
                    </Button>
                    
                    <Link href="/contato">
                      <Button
                        variant="ghost"
                        className="w-full"
                      >
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        Entre em Contato
                      </Button>
                    </Link>
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

export default Header