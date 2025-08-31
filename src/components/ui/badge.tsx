import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transform-gpu',
  {
    variants: {
      variant: {
        // Enhanced default variants
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'text-foreground border-border hover:bg-accent hover:text-accent-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success: 'border-transparent bg-brand-success text-white hover:bg-green-600',
        warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600',
        brand: 'border-transparent bg-brand-primary text-white hover:bg-brand-secondary',
        muted: 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80',
        
        // Premium new variants
        sustainable: 'border-transparent bg-gradient-sustainable text-white shadow-glow-green hover:shadow-premium hover:scale-105 animate-bounce-soft',
        innovation: 'border-transparent bg-gradient-innovation text-white shadow-glow-blue hover:shadow-premium hover:scale-105',
        luxury: 'border-transparent bg-gradient-professional text-white shadow-premium hover:shadow-luxury hover:scale-105',
        glass: 'bg-glass-effect backdrop-blur-glass border border-white/20 text-brand-primary hover:bg-white/20 hover:shadow-glass',
        shimmer: 'border-transparent bg-gradient-professional text-white relative overflow-hidden before:absolute before:inset-0 before:bg-shimmer-effect before:animate-shimmer before:opacity-0 hover:before:opacity-100',
        premium: 'border-transparent bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent text-white shadow-depth hover:shadow-luxury hover:scale-105 animate-gradient-shift bg-[length:200%_200%]',
        eco: 'border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white shadow-glow-green hover:from-green-600 hover:to-green-700 hover:scale-105',
        tech: 'border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-glow-blue hover:from-blue-600 hover:to-blue-700 hover:scale-105',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant, size }), className)} 
      {...props} 
    />
  )
}

// Tag component (alias for Badge with outline variant)
interface TagProps extends BadgeProps {
  removable?: boolean
  onRemove?: () => void
}

function Tag({ 
  removable, 
  onRemove, 
  variant = 'outline', 
  className, 
  children,
  ...props 
}: TagProps) {
  return (
    <Badge 
      variant={variant} 
      className={cn('gap-1', className)} 
      {...props}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 h-3 w-3 rounded-sm hover:bg-foreground/20 focus:outline-none focus:ring-1 focus:ring-ring"
          aria-label="Remove tag"
        >
          ×
        </button>
      )}
    </Badge>
  )
}

// Status Badge - for indicating states
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'draft'
}

function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const variants = {
    active: 'success' as const,
    inactive: 'muted' as const,
    pending: 'warning' as const,
    approved: 'success' as const,
    rejected: 'destructive' as const,
    draft: 'secondary' as const,
  }

  const labels = {
    active: 'Ativo',
    inactive: 'Inativo', 
    pending: 'Pendente',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    draft: 'Rascunho',
  }

  return (
    <Badge variant={variants[status]} {...props}>
      {labels[status]}
    </Badge>
  )
}

// Notification Badge - for counts
interface NotificationBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number
  max?: number
  showZero?: boolean
}

function NotificationBadge({ 
  count, 
  max = 99, 
  showZero = false,
  variant = 'destructive',
  size = 'sm',
  className,
  ...props 
}: NotificationBadgeProps) {
  if (count === 0 && !showZero) return null

  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <Badge 
      variant={variant} 
      size={size}
      className={cn('min-w-[1.25rem] justify-center rounded-sm', className)}
      {...props}
    >
      {displayCount}
    </Badge>
  )
}

// Product Badge - for product categories/features
interface ProductBadgeProps extends BadgeProps {
  type?: 'new' | 'popular' | 'sale' | 'featured' | 'sustainable' | 'premium'
}

function ProductBadge({ type = 'featured', ...props }: ProductBadgeProps) {
  const typeConfig = {
    new: { variant: 'success' as const, label: 'Novo' },
    popular: { variant: 'warning' as const, label: 'Popular' },
    sale: { variant: 'destructive' as const, label: 'Promoção' },
    featured: { variant: 'brand' as const, label: 'Destaque' },
    sustainable: { variant: 'success' as const, label: 'Sustentável' },
    premium: { variant: 'default' as const, label: 'Premium' },
  }

  const config = typeConfig[type]

  return (
    <Badge variant={config.variant} {...props}>
      {config.label}
    </Badge>
  )
}

export { 
  Badge, 
  badgeVariants,
  Tag,
  StatusBadge,
  NotificationBadge,
  ProductBadge
}