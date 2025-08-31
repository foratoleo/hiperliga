'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'pills' | 'underline'
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

const useTabs = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component')
  }
  return context
}

// Root Tabs Component
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'pills' | 'underline'
  children: React.ReactNode
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({
    value: controlledValue,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    variant = 'default',
    className,
    children,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')
    
    const value = controlledValue !== undefined ? controlledValue : internalValue
    
    const handleValueChange = (newValue: string) => {
      if (onValueChange) {
        onValueChange(newValue)
      } else {
        setInternalValue(newValue)
      }
    }

    return (
      <TabsContext.Provider value={{ 
        value, 
        onValueChange: handleValueChange, 
        orientation,
        variant
      }}>
        <div
          ref={ref}
          className={cn(
            'w-full',
            orientation === 'vertical' && 'flex',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = 'Tabs'

// Tabs List (Container for triggers)
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation, variant } = useTabs()

    const baseClasses = cn(
      'relative',
      orientation === 'horizontal' 
        ? 'flex items-center' 
        : 'flex flex-col items-stretch w-48 mr-6'
    )

    const variantClasses = {
      default: cn(
        'bg-muted p-1 rounded-md',
        orientation === 'horizontal' ? 'h-10 space-x-1' : 'space-y-1'
      ),
      pills: cn(
        'bg-transparent',
        orientation === 'horizontal' ? 'space-x-2' : 'space-y-2'
      ),
      underline: cn(
        'bg-transparent border-b border-border',
        orientation === 'horizontal' ? 'space-x-6' : 'border-r border-b-0 space-y-0'
      )
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        role="tablist"
        aria-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsList.displayName = 'TabsList'

// Tabs Trigger (Individual tab button)
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value: triggerValue, className, children, ...props }, ref) => {
    const { value, onValueChange, variant } = useTabs()
    const isActive = value === triggerValue

    const handleClick = () => {
      onValueChange(triggerValue)
    }

    const baseClasses = cn(
      'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium',
      'ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50'
    )

    const variantClasses = {
      default: cn(
        'rounded-sm px-3 py-1.5 relative',
        isActive 
          ? 'bg-background text-foreground shadow-sm' 
          : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
      ),
      pills: cn(
        'rounded-sm px-4 py-2 relative',
        isActive
          ? 'bg-brand-primary text-white shadow-sm'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      ),
      underline: cn(
        'px-4 py-2 relative border-b-2',
        isActive
          ? 'border-brand-primary text-brand-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
      )
    }

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${triggerValue}`}
        data-state={isActive ? 'active' : 'inactive'}
        onClick={handleClick}
        {...props}
      >
        {children}
        
        {/* Animated indicator for pills variant */}
        {variant === 'pills' && isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-brand-primary rounded-sm -z-10"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

// Tabs Content (Content for each tab)
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
  forceMount?: boolean
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value: contentValue, className, children, forceMount = false, ...props }, ref) => {
    const { value } = useTabs()
    const isActive = value === contentValue

    if (!forceMount && !isActive) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          !isActive && 'hidden',
          className
        )}
        role="tabpanel"
        aria-labelledby={`trigger-${contentValue}`}
        id={`panel-${contentValue}`}
        tabIndex={0}
        data-state={isActive ? 'active' : 'inactive'}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = 'TabsContent'

// Product Info Tabs - specialized for product information
interface ProductTabsProps extends Omit<TabsProps, 'children'> {
  product: {
    description?: React.ReactNode
    specifications?: Array<{ name: string; value: string; description?: string }>
    instructions?: React.ReactNode
    faq?: Array<{ question: string; answer: string }>
  }
}

const ProductTabs = React.forwardRef<HTMLDivElement, ProductTabsProps>(
  ({ product, defaultValue = 'description', ...props }, ref) => {
    const tabs = [
      { value: 'description', label: 'Descrição', content: product.description },
      { value: 'specs', label: 'Especificações', content: product.specifications },
      { value: 'instructions', label: 'Como Usar', content: product.instructions },
      { value: 'faq', label: 'FAQ', content: product.faq }
    ].filter(tab => tab.content)

    return (
      <Tabs 
        ref={ref} 
        defaultValue={defaultValue} 
        variant="underline"
        {...props}
      >
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {tab.value === 'description' && (
              <div className="prose prose-sm max-w-none">
                {tab.content}
              </div>
            )}
            
            {tab.value === 'specs' && Array.isArray(tab.content) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tab.content.map((spec, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="font-semibold text-foreground">{spec.name}</div>
                      <div className="text-lg font-medium text-brand-primary">{spec.value}</div>
                      {spec.description && (
                        <div className="text-sm text-muted-foreground mt-1">{spec.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab.value === 'instructions' && (
              <div className="prose prose-sm max-w-none">
                {tab.content}
              </div>
            )}

            {tab.value === 'faq' && Array.isArray(tab.content) && (
              <div className="space-y-4">
                {tab.content.map((item, index) => (
                  <div key={index} className="border-b border-border pb-4 last:border-b-0">
                    <h4 className="font-medium text-foreground mb-2">{item.question}</h4>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    )
  }
)
ProductTabs.displayName = 'ProductTabs'

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ProductTabs
}