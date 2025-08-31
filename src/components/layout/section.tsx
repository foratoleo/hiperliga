import * as React from 'react'
import { cn } from '@/lib/utils'
import { Container } from './container'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  background?: 'default' | 'muted' | 'accent' | 'primary'
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  noContainer?: boolean
  as?: keyof JSX.IntrinsicElements
}

const backgroundVariants = {
  default: '',
  muted: 'bg-muted/30',
  accent: 'bg-accent/10',
  primary: 'bg-brand-primary text-white'
}

const spacingVariants = {
  none: '',
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16',
  lg: 'py-16 sm:py-20',
  xl: 'py-20 sm:py-24'
}

export function Section({
  children,
  background = 'default',
  spacing = 'md',
  containerSize = 'xl',
  noContainer = false,
  as: Component = 'section',
  className,
  ...props
}: SectionProps) {
  const content = noContainer ? (
    children
  ) : (
    <Container size={containerSize}>
      {children}
    </Container>
  )

  return (
    <Component
      className={cn(
        backgroundVariants[background],
        spacingVariants[spacing],
        className
      )}
      {...props}
    >
      {content}
    </Component>
  )
}

export default Section