import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu',
  {
    variants: {
      variant: {
        // Enhanced default variants
        default: 'bg-gradient-professional text-white shadow-premium hover:shadow-luxury hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-brand-accent',
        secondary: 'bg-card text-brand-primary border-2 border-brand-primary shadow-soft hover:bg-brand-primary hover:text-primary-foreground hover:shadow-premium transition-all duration-300',
        ghost: 'bg-transparent text-brand-primary hover:bg-brand-primary/10 hover:backdrop-blur-sm',
        outline: 'border-2 border-brand-primary/20 bg-card/50 backdrop-blur-xs text-brand-primary hover:border-brand-primary hover:bg-brand-primary hover:text-primary-foreground hover:shadow-glow-blue',
        
        // Premium new variants
        sustainable: 'bg-gradient-sustainable text-white shadow-glow-green hover:shadow-luxury hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-sustainable-600',
        innovation: 'bg-gradient-innovation text-white shadow-glow-blue hover:shadow-luxury hover:scale-[1.02] active:scale-[0.98]',
        glass: 'bg-glass-effect backdrop-blur-glass border border-foreground/20 text-brand-primary hover:bg-card/20 hover:shadow-glass transition-all duration-500',
        shimmer: 'bg-gradient-professional text-white shadow-premium hover:shadow-luxury relative overflow-hidden before:absolute before:inset-0 before:bg-shimmer-effect before:animate-shimmer before:opacity-0 hover:before:opacity-100',
        luxury: 'bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent text-white shadow-depth hover:shadow-hard hover:scale-[1.02] active:scale-[0.98] animate-gradient-shift bg-[length:200%_200%]',
        
        // Utility variants
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-premium hover:from-red-600 hover:to-red-700 hover:shadow-luxury hover:scale-[1.02]',
        success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-premium hover:from-green-600 hover:to-green-700 hover:shadow-luxury hover:scale-[1.02]',
      },
      size: {
        sm: 'h-12 px-4 text-xs rounded-md min-h-[48px]', // Mobile-optimized minimum touch target
        default: 'h-12 px-6 py-2.5 text-sm rounded-lg min-h-[48px]', // Mobile-optimized
        lg: 'h-14 px-8 text-base rounded-xl font-bold min-h-[48px]',
        xl: 'h-16 px-10 text-lg rounded-xl font-bold min-h-[48px]',
        icon: 'h-12 w-12 rounded-lg min-h-[48px] min-w-[48px]', // Mobile-optimized square
        'icon-sm': 'h-11 w-11 rounded-md min-h-[44px] min-w-[44px]',
        'icon-lg': 'h-14 w-14 rounded-xl min-h-[48px] min-w-[48px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }