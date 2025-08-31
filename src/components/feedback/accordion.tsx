'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface AccordionContextType {
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  type: 'single' | 'multiple'
  collapsible?: boolean
  disabled?: boolean
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined)

const useAccordion = () => {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error('useAccordion must be used within an AccordionProvider')
  }
  return context
}

// Root Accordion Component
interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'single' | 'multiple'
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  collapsible?: boolean
  disabled?: boolean
  children: React.ReactNode
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ 
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible = false,
    disabled = false,
    className,
    children,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue || (type === 'multiple' ? [] : '')
    )

    const currentValue = value !== undefined ? value : internalValue
    
    const handleValueChange = (newValue: string | string[]) => {
      if (onValueChange) {
        onValueChange(newValue)
      } else {
        setInternalValue(newValue)
      }
    }

    return (
      <AccordionContext.Provider
        value={{
          value: currentValue,
          onValueChange: handleValueChange,
          type,
          collapsible,
          disabled,
        }}
      >
        <div
          ref={ref}
          className={cn('space-y-0', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = 'Accordion'

// Accordion Item
interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
  children: React.ReactNode
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    const { disabled: accordionDisabled } = useAccordion()
    const isDisabled = disabled || accordionDisabled

    return (
      <div
        ref={ref}
        className={cn(
          'border-b border-border',
          isDisabled && 'opacity-50',
          className
        )}
        data-state={isDisabled ? 'disabled' : 'enabled'}
        data-value={value}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AccordionItem.displayName = 'AccordionItem'

// Accordion Trigger
interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  hideIcon?: boolean
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, hideIcon = false, ...props }, ref) => {
    const { value, onValueChange, type, collapsible, disabled } = useAccordion()
    const itemValue = React.useContext(AccordionItemContext)
    
    if (!itemValue) {
      throw new Error('AccordionTrigger must be used within AccordionItem')
    }

    const isOpen = type === 'multiple' 
      ? Array.isArray(value) && value.includes(itemValue)
      : value === itemValue

    const handleClick = () => {
      if (!onValueChange || disabled) return

      if (type === 'multiple') {
        const currentValues = Array.isArray(value) ? value : []
        const newValues = isOpen
          ? currentValues.filter(v => v !== itemValue)
          : [...currentValues, itemValue]
        onValueChange(newValues)
      } else {
        // Single mode
        if (isOpen && collapsible) {
          onValueChange('')
        } else if (!isOpen) {
          onValueChange(itemValue)
        }
      }
    }

    return (
      <button
        ref={ref}
        className={cn(
          'flex w-full items-center justify-between py-4 px-0 text-left font-medium transition-all',
          'hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          '[&[data-state=open]>svg]:rotate-180',
          className
        )}
        data-state={isOpen ? 'open' : 'closed'}
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {children}
        {!hideIcon && (
          <ChevronDownIcon 
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" 
          />
        )}
      </button>
    )
  }
)
AccordionTrigger.displayName = 'AccordionTrigger'

// Context for AccordionItem value
const AccordionItemContext = React.createContext<string | undefined>(undefined)

// Enhanced AccordionItem with context
const AccordionItemWithContext = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, children, ...props }, ref) => {
    return (
      <AccordionItemContext.Provider value={value}>
        <AccordionItem ref={ref} value={value} {...props}>
          {children}
        </AccordionItem>
      </AccordionItemContext.Provider>
    )
  }
)
AccordionItemWithContext.displayName = 'AccordionItem'

// Accordion Content
interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { value, type } = useAccordion()
    const itemValue = React.useContext(AccordionItemContext)
    
    if (!itemValue) {
      throw new Error('AccordionContent must be used within AccordionItem')
    }

    const isOpen = type === 'multiple'
      ? Array.isArray(value) && value.includes(itemValue)
      : value === itemValue

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={ref}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="overflow-hidden"
            data-state={isOpen ? 'open' : 'closed'}
          >
            <div className={cn('pb-4 pt-0 text-muted-foreground', className)} {...props}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
AccordionContent.displayName = 'AccordionContent'

// FAQ Accordion - specialized for frequently asked questions
interface FAQAccordionProps extends Omit<AccordionProps, 'type' | 'children'> {
  faqs: Array<{
    id: string
    question: string
    answer: string | React.ReactNode
    category?: string
  }>
  searchable?: boolean
  categories?: boolean
}

const FAQAccordion = React.forwardRef<HTMLDivElement, FAQAccordionProps>(
  ({ 
    faqs, 
    searchable = false, 
    categories = false,
    className, 
    ...props 
  }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [selectedCategory, setSelectedCategory] = React.useState<string>('')

    // Filter FAQs based on search and category
    const filteredFAQs = React.useMemo(() => {
      return faqs.filter((faq) => {
        const matchesSearch = searchQuery === '' || 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
        
        const matchesCategory = selectedCategory === '' || 
          faq.category === selectedCategory

        return matchesSearch && matchesCategory
      })
    }, [faqs, searchQuery, selectedCategory])

    // Get unique categories
    const categoryList = React.useMemo(() => {
      return Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)))
    }, [faqs])

    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        {/* Search and Filter Controls */}
        {(searchable || categories) && (
          <div className="space-y-4">
            {searchable && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar nas perguntas frequentes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <div className="absolute right-3 top-2.5">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            )}

            {categories && categoryList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={cn(
                    'px-3 py-1 rounded-sm text-sm border transition-colors',
                    selectedCategory === ''
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-background text-foreground border-border hover:bg-accent'
                  )}
                >
                  Todas
                </button>
                {categoryList.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'px-3 py-1 rounded-sm text-sm border transition-colors',
                      selectedCategory === category
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-background text-foreground border-border hover:bg-accent'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible {...props}>
          {filteredFAQs.map((faq) => (
            <AccordionItemWithContext key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {typeof faq.answer === 'string' ? (
                  <div className="prose prose-sm max-w-none">
                    {faq.answer.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                ) : (
                  faq.answer
                )}
              </AccordionContent>
            </AccordionItemWithContext>
          ))}
        </Accordion>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma pergunta encontrada.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-brand-primary hover:underline"
              >
                Limpar busca
              </button>
            )}
          </div>
        )}
      </div>
    )
  }
)
FAQAccordion.displayName = 'FAQAccordion'

export { Accordion, AccordionTrigger, AccordionContent, FAQAccordion }
export { AccordionItemWithContext as AccordionItem }