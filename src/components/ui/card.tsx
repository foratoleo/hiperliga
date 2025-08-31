import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-xl border bg-card text-card-foreground transition-all duration-500 transform-gpu',
  {
    variants: {
      variant: {
        // Enhanced default variants
        default: 'border-border/50 shadow-soft bg-card/80 backdrop-blur-xs',
        elevated: 'border-border/30 shadow-premium hover:shadow-luxury bg-card/90 backdrop-blur-sm',
        outline: 'border-2 border-brand-primary/20 shadow-none bg-card/50 backdrop-blur-xs',
        ghost: 'border-transparent shadow-none bg-transparent',
        
        // Premium new variants
        glass: 'bg-glass-effect backdrop-blur-glass border border-foreground/20 shadow-glass hover:shadow-premium hover:bg-card/20',
        premium: 'bg-gradient-to-br from-card/95 to-card/80 border border-foreground/30 shadow-premium hover:shadow-luxury backdrop-blur-premium',
        sustainable: 'bg-gradient-to-br from-brand-eco-light/20 to-card/90 border border-brand-eco-medium/20 shadow-glow-green hover:shadow-luxury',
        innovation: 'bg-gradient-to-br from-brand-tech-light/20 to-card/90 border border-brand-tech-medium/20 shadow-glow-blue hover:shadow-luxury',
        luxury: 'bg-gradient-to-br from-card/95 via-brand-primary/5 to-card/90 border border-brand-primary/10 shadow-depth hover:shadow-hard',
        product: 'bg-card/95 backdrop-blur-sm border border-foreground/40 shadow-premium hover:shadow-luxury hover:border-brand-primary/30',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-2 hover:shadow-luxury',
        glow: 'hover:ring-2 hover:ring-brand-primary/30 hover:ring-offset-2',
        scale: 'hover:scale-[1.02] active:scale-[0.98]',
        float: 'hover:-translate-y-1 hover:shadow-premium animate-float',
        premium: 'hover:-translate-y-3 hover:scale-[1.01] hover:shadow-hard hover:rotate-1',
        subtle: 'hover:-translate-y-0.5 hover:shadow-medium hover:brightness-105',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      hover: 'none',
    },
  }
)

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, hover, className }))}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight text-card-foreground',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn('pt-0', className)} 
    {...props} 
  />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-6', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// Product Card - specialized card for products
interface ProductCardProps extends CardProps {
  product: {
    name: string
    description: string
    image?: string
    href?: string
    badge?: string
  }
  children?: React.ReactNode
  onCardClick?: () => void
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, children, onCardClick, className, hover = 'premium', ...props }, ref) => (
    <Card
      ref={ref}
      variant="product"
      hover={hover}
      className={cn(
        'cursor-pointer group overflow-hidden relative',
        'before:absolute before:inset-0 before:bg-gradient-professional before:opacity-0 before:transition-all before:duration-500',
        'hover:before:opacity-[0.03]',
        onCardClick && 'hover:border-brand-primary/40',
        className
      )}
      onClick={onCardClick}
      {...props}
    >
      {product.image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-50 to-gray-100 mb-6 relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <CardHeader className="pb-6 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="group-hover:text-brand-primary transition-all duration-300 text-lg font-bold leading-tight">
            {product.name}
          </CardTitle>
          {product.badge && (
            <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold bg-gradient-sustainable text-white shadow-soft animate-bounce-soft">
              {product.badge}
            </span>
          )}
        </div>
        <CardDescription className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      {children && (
        <CardContent className="relative z-10">
          {children}
        </CardContent>
      )}
      
      {/* Premium shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Card>
  )
)
ProductCard.displayName = 'ProductCard'

// Feature Card - specialized card for features/benefits
interface FeatureCardProps extends CardProps {
  icon?: React.ReactNode
  title: string
  description: string
  children?: React.ReactNode
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, description, children, className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="innovation"
      hover="lift"
      className={cn('text-center relative overflow-hidden group', className)}
      {...props}
    >
      <CardHeader className="relative z-10">
        {icon && (
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-innovation shadow-glow-blue text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <div className="text-2xl">
              {icon}
            </div>
          </div>
        )}
        <CardTitle className="text-xl font-bold mb-3 group-hover:text-brand-tech-dark transition-colors duration-300">
          {title}
        </CardTitle>
        <CardDescription className="text-base leading-relaxed text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </CardDescription>
      </CardHeader>
      
      {children && (
        <CardContent className="relative z-10">
          {children}
        </CardContent>
      )}
      
      {/* Floating particles effect */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-brand-tech-medium rounded-sm opacity-0 group-hover:opacity-60 transition-all duration-700 animate-float" />
      <div className="absolute bottom-6 left-6 w-1 h-1 bg-brand-tech-light rounded-sm opacity-0 group-hover:opacity-40 transition-all duration-500 delay-100 animate-float" />
      <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-brand-tech-medium/60 rounded-sm opacity-0 group-hover:opacity-50 transition-all duration-600 delay-200 animate-float" />
    </Card>
  )
)
FeatureCard.displayName = 'FeatureCard'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ProductCard,
  FeatureCard
}