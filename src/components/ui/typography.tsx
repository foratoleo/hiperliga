import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Heading variants
const headingVariants = cva('font-heading font-bold tracking-tight', {
  variants: {
    size: {
      h1: 'text-4xl sm:text-5xl lg:text-6xl',
      h2: 'text-3xl sm:text-4xl lg:text-5xl',
      h3: 'text-2xl sm:text-3xl lg:text-4xl',
      h4: 'text-xl sm:text-2xl lg:text-3xl',
      h5: 'text-lg sm:text-xl lg:text-2xl',
      h6: 'text-base sm:text-lg lg:text-xl',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-brand-primary',
      secondary: 'text-brand-secondary',
      success: 'text-brand-success',
      gradient: 'bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent',
    },
  },
  defaultVariants: {
    size: 'h2',
    variant: 'default',
  },
})

// Paragraph variants  
const paragraphVariants = cva('font-body leading-relaxed', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      lead: 'text-foreground text-lg sm:text-xl font-medium',
      subtle: 'text-muted-foreground text-sm',
    },
  },
  defaultVariants: {
    size: 'base',
    variant: 'default',
  },
})

// Lead text variants
const leadVariants = cva('font-body font-medium', {
  variants: {
    size: {
      sm: 'text-lg',
      base: 'text-xl sm:text-2xl',
      lg: 'text-2xl sm:text-3xl',
    },
  },
  defaultVariants: {
    size: 'base',
  },
})

// Heading Components
interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function Heading({
  as,
  size,
  variant,
  className,
  ...props
}: HeadingProps) {
  const Component = as || (size === 'h1' ? 'h1' : size === 'h2' ? 'h2' : size === 'h3' ? 'h3' : size === 'h4' ? 'h4' : size === 'h5' ? 'h5' : 'h6')
  
  return (
    <Component
      className={cn(headingVariants({ size, variant, className }))}
      {...props}
    />
  )
}

// Individual heading components
export function H1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(headingVariants({ size: 'h1', className }))}
      {...props}
    />
  )
}

export function H2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(headingVariants({ size: 'h2', className }))}
      {...props}
    />
  )
}

export function H3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(headingVariants({ size: 'h3', className }))}
      {...props}
    />
  )
}

export function H4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(headingVariants({ size: 'h4', className }))}
      {...props}
    />
  )
}

export function H5({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn(headingVariants({ size: 'h5', className }))}
      {...props}
    />
  )
}

export function H6({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h6
      className={cn(headingVariants({ size: 'h6', className }))}
      {...props}
    />
  )
}

// Paragraph Component
interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {}

export function P({
  size,
  variant,
  className,
  ...props
}: ParagraphProps) {
  return (
    <p
      className={cn(paragraphVariants({ size, variant, className }))}
      {...props}
    />
  )
}

// Lead text component
interface LeadProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof leadVariants> {}

export function Lead({
  size,
  className,
  ...props
}: LeadProps) {
  return (
    <p
      className={cn(leadVariants({ size, className }), 'text-muted-foreground')}
      {...props}
    />
  )
}

// Muted text component
export function Muted({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

// Small text component
export function Small({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <small
      className={cn('text-xs font-medium leading-none', className)}
      {...props}
    />
  )
}

// Code text component
export function Code({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
      {...props}
    />
  )
}

// Blockquote component
export function Blockquote({
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        'mt-6 border-l-2 border-border pl-6 italic text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

// List components
export function List({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('my-6 ml-6 list-disc space-y-2', className)}
      {...props}
    />
  )
}

export function ListItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn('text-foreground', className)}
      {...props}
    />
  )
}

// Text highlight component
export function Highlight({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'rounded-sm bg-brand-primary/10 px-1 py-0.5 text-brand-primary font-medium',
        className
      )}
      {...props}
    />
  )
}

export default {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Lead,
  Muted,
  Small,
  Code,
  Blockquote,
  List,
  ListItem,
  Highlight,
  Heading
}