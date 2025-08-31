import * as React from 'react'
import { cn } from '@/lib/utils'
import { Header } from './header'
import { Footer } from './footer'
import { Breadcrumbs } from '../navigation/navigation'
import { Container } from './container'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  showBreadcrumbs?: boolean
  showHeader?: boolean
  showFooter?: boolean
  breadcrumbsClassName?: string
  headerClassName?: string
  footerClassName?: string
}

export function PageLayout({
  children,
  className,
  showBreadcrumbs = true,
  showHeader = true,
  showFooter = true,
  breadcrumbsClassName,
  headerClassName,
  footerClassName
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {showHeader && <Header className={headerClassName} />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="border-b border-border bg-muted/20">
            <Container>
              <div className="py-3">
                <Breadcrumbs className={breadcrumbsClassName} />
              </div>
            </Container>
          </div>
        )}

        {/* Main Content */}
        <main 
          id="main-content"
          className={cn('flex-1', className)}
          role="main"
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      {showFooter && <Footer className={footerClassName} />}
    </div>
  )
}

export default PageLayout