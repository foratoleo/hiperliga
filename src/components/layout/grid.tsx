import * as React from 'react'
import { cn } from '@/lib/utils'

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  colsMd?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  colsLg?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  wrap?: boolean
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

const colsVariants = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12'
}

const colsMdVariants = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2', 
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  12: 'md:grid-cols-12'
}

const colsLgVariants = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3', 
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  12: 'lg:grid-cols-12'
}

const gapVariants = {
  none: 'gap-0',
  sm: 'gap-2 sm:gap-4',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
  xl: 'gap-8 sm:gap-10'
}

const alignVariants = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline'
}

const justifyVariants = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly'
}

const directionVariants = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse'
}

// Grid Component
export function Grid({
  children,
  cols = 1,
  colsMd,
  colsLg,
  gap = 'md',
  align = 'stretch',
  justify,
  className,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        colsVariants[cols],
        colsMd && colsMdVariants[colsMd],
        colsLg && colsLgVariants[colsLg],
        gapVariants[gap],
        alignVariants[align],
        justify && justifyVariants[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Flex Component
export function Flex({
  children,
  direction = 'row',
  wrap = false,
  gap = 'md',
  align = 'stretch',
  justify,
  className,
  ...props
}: FlexProps) {
  return (
    <div
      className={cn(
        'flex',
        directionVariants[direction],
        wrap && 'flex-wrap',
        gapVariants[gap],
        alignVariants[align],
        justify && justifyVariants[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Grid Item Component
interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full'
  spanMd?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full'
  spanLg?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full'
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
}

const spanVariants = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  12: 'col-span-12',
  full: 'col-span-full'
}

const spanMdVariants = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  12: 'md:col-span-12',
  full: 'md:col-span-full'
}

const spanLgVariants = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  12: 'lg:col-span-12',
  full: 'lg:col-span-full'
}

export function GridItem({
  children,
  span,
  spanMd,
  spanLg,
  start,
  end,
  className,
  ...props
}: GridItemProps) {
  return (
    <div
      className={cn(
        span && spanVariants[span],
        spanMd && spanMdVariants[spanMd],
        spanLg && spanLgVariants[spanLg],
        start && `col-start-${start}`,
        end && `col-end-${end}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Grid as default }