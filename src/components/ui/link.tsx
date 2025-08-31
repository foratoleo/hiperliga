import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const linkVariants = cva(
  'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-foreground hover:text-brand-primary',
        primary: 'text-brand-primary hover:text-brand-secondary',
        secondary: 'text-muted-foreground hover:text-foreground',
        muted: 'text-muted-foreground hover:text-muted-foreground/80',
        underline: 'text-foreground underline underline-offset-4 hover:text-brand-primary',
        button: 'bg-brand-primary text-white hover:bg-brand-secondary rounded-md px-4 py-2 font-medium',
        outline: 'border border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2',
      },
      size: {
        default: 'text-sm',
        sm: 'text-xs',
        lg: 'text-base',
        xl: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface LinkProps
  extends Omit<React.ComponentProps<typeof Link>, 'className'>,
    VariantProps<typeof linkVariants> {
  className?: string
  external?: boolean
  showIcon?: boolean
}

const AppLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  LinkProps
>(({ className, variant, size, external, showIcon, children, ...props }, ref) => {
  const linkProps = external 
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Link
      className={cn(linkVariants({ variant, size, className }))}
      ref={ref}
      {...linkProps}
      {...props}
    >
      {children}
      {(external && showIcon) && (
        <svg
          className="ml-1 h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      )}
    </Link>
  )
})
AppLink.displayName = 'AppLink'

// Navigation Link - highlights active state
interface NavLinkProps extends LinkProps {
  isActive?: boolean
  activeClassName?: string
}

const NavLink = React.forwardRef<
  React.ElementRef<typeof Link>, 
  NavLinkProps
>(({ 
  className, 
  isActive, 
  activeClassName = 'text-brand-primary bg-brand-primary/10', 
  ...props 
}, ref) => {
  return (
    <AppLink
      ref={ref}
      className={cn(
        className,
        isActive && activeClassName
      )}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    />
  )
})
NavLink.displayName = 'NavLink'

// Breadcrumb Link
const BreadcrumbLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  LinkProps
>(({ className, ...props }, ref) => {
  return (
    <AppLink
      ref={ref}
      variant="muted"
      className={cn('hover:text-brand-primary', className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

// Button Link - looks like a button but acts as a link
interface ButtonLinkProps extends LinkProps {
  size?: 'sm' | 'default' | 'lg'
}

const ButtonLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  ButtonLinkProps  
>(({ size = 'default', className, ...props }, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <AppLink
      ref={ref}
      variant="button"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  )
})
ButtonLink.displayName = 'ButtonLink'

// Social Link - for social media links with icons
interface SocialLinkProps extends Omit<LinkProps, 'children'> {
  platform: 'instagram' | 'facebook' | 'youtube' | 'linkedin' | 'twitter'
  showLabel?: boolean
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
  ),
  twitter: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  )
}

const socialLabels = {
  instagram: 'Instagram',
  facebook: 'Facebook', 
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  twitter: 'Twitter'
}

const SocialLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  SocialLinkProps
>(({ platform, showLabel = false, className, ...props }, ref) => {
  return (
    <AppLink
      ref={ref}
      external
      variant="ghost"
      className={cn('p-2', className)}
      aria-label={`Siga-nos no ${socialLabels[platform]}`}
      {...props}
    >
      {socialIcons[platform]}
      {showLabel && (
        <span className="ml-2">{socialLabels[platform]}</span>
      )}
    </AppLink>
  )
})
SocialLink.displayName = 'SocialLink'

export { 
  AppLink, 
  linkVariants,
  NavLink,
  BreadcrumbLink,
  ButtonLink,
  SocialLink
}
export default AppLink