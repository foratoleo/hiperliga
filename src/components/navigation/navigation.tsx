'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

import { MAIN_NAVIGATION } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { NavigationItem } from '@/types'

interface NavigationProps {
  items: NavigationItem[]
  className?: string
}

interface BreadcrumbProps {
  className?: string
}

interface ActiveLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  activeClassName?: string
  exactMatch?: boolean
}

// Main Navigation Component
export function Navigation({ items, className }: NavigationProps) {
  const pathname = usePathname()

  const isActiveLink = (href: string, exactMatch = false): boolean => {
    if (exactMatch || href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className={cn('flex items-center space-x-1', className)} role="navigation">
      {items.map((item) => (
        <div key={item.name} className="relative">
          {item.children ? (
            <div className="group relative">
              <Link
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-brand-primary',
                  'group-hover:bg-accent group-hover:text-accent-foreground',
                  isActiveLink(item.href)
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'text-foreground'
                )}
              >
                {item.name}
              </Link>

              {/* Dropdown for desktop */}
              <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
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
                    >
                      <div className="font-medium">{child.name}</div>
                      {child.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {child.description}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link
              href={item.href}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary',
                isActiveLink(item.href, item.href === '/')
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
  )
}

// Active Link Component with highlighting
export function ActiveLink({ 
  href, 
  children, 
  className, 
  activeClassName = 'text-brand-primary bg-brand-primary/10',
  exactMatch = false,
  ...props 
}: ActiveLinkProps & Omit<React.ComponentProps<typeof Link>, 'href'>) {
  const pathname = usePathname()
  
  const isActive = exactMatch || href === '/' 
    ? pathname === href 
    : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        className,
        isActive && activeClassName
      )}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </Link>
  )
}

// Breadcrumb Component
export function Breadcrumbs({ className }: BreadcrumbProps) {
  const pathname = usePathname()
  
  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = React.useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs: { name: string; href: string }[] = [
      { name: 'Início', href: '/' }
    ]

    let currentPath = ''
    
    for (const segment of pathSegments) {
      currentPath += `/${segment}`
      
      // Find the navigation item that matches this path
      const findNavItem = (items: NavigationItem[], path: string): NavigationItem | null => {
        for (const item of items) {
          if (item.href === path) return item
          if (item.children) {
            const found = findNavItem(item.children, path)
            if (found) return found
          }
        }
        return null
      }

      const navItem = findNavItem(MAIN_NAVIGATION, currentPath)
      
      if (navItem) {
        breadcrumbs.push({
          name: navItem.name,
          href: currentPath
        })
      } else {
        // Fallback: capitalize and clean segment
        const name = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        breadcrumbs.push({
          name,
          href: currentPath
        })
      }
    }

    return breadcrumbs
  }, [pathname])

  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {generateBreadcrumbs.map((item, index) => {
          const isLast = index === generateBreadcrumbs.length - 1

          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground mx-1" />
              )}
              
              {index === 0 && (
                <HomeIcon className="h-4 w-4 mr-1" />
              )}
              
              {isLast ? (
                <span 
                  className="text-foreground font-medium" 
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-brand-primary transition-colors focus:outline-none focus:text-brand-primary"
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Mobile Menu Component
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function MobileMenu({ isOpen, onClose, children, className }: MobileMenuProps) {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 top-16 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel */}
      <div className={cn(
        'relative bg-background border-t border-border shadow-lg',
        className
      )}>
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

// Skip Navigation Link (for accessibility)
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 bg-brand-primary text-white px-4 py-2 rounded-md z-50 
                 focus:outline-none focus:ring-2 focus:ring-white"
    >
      Pular para o conteúdo principal
    </a>
  )
}

export default Navigation