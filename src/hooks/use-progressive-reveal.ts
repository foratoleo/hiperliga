'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

export interface ProgressiveRevealOptions {
  initialCount?: number
  increment?: number
  autoReveal?: boolean
  autoDelay?: number
  scrollTrigger?: boolean
  scrollThreshold?: number
  onReveal?: (newCount: number) => void
  onComplete?: () => void
}

export interface ProgressiveRevealState {
  visibleCount: number
  isRevealing: boolean
  isComplete: boolean
  progress: number
}

export interface ProgressiveRevealActions {
  reveal: () => void
  revealAll: () => void
  reset: () => void
  setVisibleCount: (count: number) => void
}

export function useProgressiveReveal(
  totalItems: number,
  options: ProgressiveRevealOptions = {}
): ProgressiveRevealState & ProgressiveRevealActions {
  const {
    initialCount = 3,
    increment = 3,
    autoReveal = false,
    autoDelay = 2000,
    scrollTrigger = false,
    scrollThreshold = 0.3,
    onReveal,
    onComplete
  } = options

  const [visibleCount, setVisibleCountState] = useState(initialCount)
  const [isRevealing, setIsRevealing] = useState(false)
  const autoRevealTriggered = useRef(false)
  const revealTimeouts = useRef<NodeJS.Timeout[]>([])

  // Calculate derived state
  const isComplete = visibleCount >= totalItems
  const progress = totalItems > 0 ? (visibleCount / totalItems) * 100 : 0

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      revealTimeouts.current.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  // Auto-reveal functionality
  useEffect(() => {
    if (autoReveal && !autoRevealTriggered.current && !isComplete) {
      autoRevealTriggered.current = true
      const timeout = setTimeout(() => {
        reveal()
      }, autoDelay)
      
      revealTimeouts.current.push(timeout)
    }
  }, [autoReveal, autoDelay, isComplete])

  const reveal = useCallback(() => {
    if (isRevealing || isComplete) return

    setIsRevealing(true)
    const newCount = Math.min(visibleCount + increment, totalItems)
    
    // Simulate async operation for smooth UX
    const timeout = setTimeout(() => {
      setVisibleCountState(newCount)
      setIsRevealing(false)
      
      onReveal?.(newCount)
      
      if (newCount >= totalItems) {
        onComplete?.()
      }
    }, 200)

    revealTimeouts.current.push(timeout)
  }, [visibleCount, increment, totalItems, isRevealing, isComplete, onReveal, onComplete])

  const revealAll = useCallback(() => {
    if (isRevealing) return

    setIsRevealing(true)
    
    const timeout = setTimeout(() => {
      setVisibleCountState(totalItems)
      setIsRevealing(false)
      onReveal?.(totalItems)
      onComplete?.()
    }, 200)

    revealTimeouts.current.push(timeout)
  }, [totalItems, isRevealing, onReveal, onComplete])

  const reset = useCallback(() => {
    // Clear any pending timeouts
    revealTimeouts.current.forEach(timeout => clearTimeout(timeout))
    revealTimeouts.current = []
    
    setVisibleCountState(initialCount)
    setIsRevealing(false)
    autoRevealTriggered.current = false
  }, [initialCount])

  const setVisibleCount = useCallback((count: number) => {
    const clampedCount = Math.max(0, Math.min(count, totalItems))
    setVisibleCountState(clampedCount)
    
    if (clampedCount >= totalItems) {
      onComplete?.()
    }
  }, [totalItems, onComplete])

  return {
    // State
    visibleCount,
    isRevealing,
    isComplete,
    progress,
    
    // Actions
    reveal,
    revealAll,
    reset,
    setVisibleCount
  }
}

// Hook for scroll-triggered progressive reveal
export function useScrollProgressiveReveal(
  totalItems: number,
  options: ProgressiveRevealOptions = {}
) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once: true,
    margin: "-30%"
  })

  const progressiveReveal = useProgressiveReveal(totalItems, options)

  // Trigger reveal when element comes into view
  useEffect(() => {
    if (isInView && !progressiveReveal.isComplete && options.scrollTrigger) {
      progressiveReveal.reveal()
    }
  }, [isInView, options.scrollTrigger, progressiveReveal.isComplete])

  return {
    ref,
    isInView,
    ...progressiveReveal
  }
}

// Hook for managing multiple progressive reveal sections
export function useMultiProgressiveReveal(
  sections: Array<{
    id: string
    totalItems: number
    options?: ProgressiveRevealOptions
  }>
) {
  const [reveals, setReveals] = useState<Record<string, ReturnType<typeof useProgressiveReveal>>>({})

  useEffect(() => {
    const newReveals: Record<string, ReturnType<typeof useProgressiveReveal>> = {}
    
    sections.forEach(section => {
      newReveals[section.id] = useProgressiveReveal(section.totalItems, section.options)
    })
    
    setReveals(newReveals)
  }, [sections])

  const revealSection = useCallback((sectionId: string) => {
    reveals[sectionId]?.reveal()
  }, [reveals])

  const revealAllSections = useCallback(() => {
    Object.values(reveals).forEach(reveal => reveal.revealAll())
  }, [reveals])

  const resetAllSections = useCallback(() => {
    Object.values(reveals).forEach(reveal => reveal.reset())
  }, [reveals])

  const getSectionProgress = useCallback((sectionId: string) => {
    return reveals[sectionId] || null
  }, [reveals])

  const overallProgress = Object.values(reveals).reduce((acc, reveal) => {
    return acc + (reveal.progress || 0)
  }, 0) / Math.max(Object.keys(reveals).length, 1)

  const allComplete = Object.values(reveals).every(reveal => reveal.isComplete)

  return {
    reveals,
    revealSection,
    revealAllSections,
    resetAllSections,
    getSectionProgress,
    overallProgress,
    allComplete
  }
}

// Hook for staggered progressive reveal with timing control
export function useStaggeredProgressiveReveal(
  totalItems: number,
  options: ProgressiveRevealOptions & {
    staggerDelay?: number
    batchSize?: number
  } = {}
) {
  const {
    staggerDelay = 100,
    batchSize = 1,
    ...baseOptions
  } = options

  const [currentBatch, setCurrentBatch] = useState(0)
  const progressiveReveal = useProgressiveReveal(totalItems, baseOptions)
  const staggerTimeouts = useRef<NodeJS.Timeout[]>([])

  const revealWithStagger = useCallback(() => {
    if (progressiveReveal.isRevealing || progressiveReveal.isComplete) return

    const totalBatches = Math.ceil(totalItems / batchSize)
    
    // Clear existing stagger timeouts
    staggerTimeouts.current.forEach(timeout => clearTimeout(timeout))
    staggerTimeouts.current = []

    for (let i = currentBatch; i < totalBatches; i++) {
      const timeout = setTimeout(() => {
        const startIndex = i * batchSize
        const endIndex = Math.min(startIndex + batchSize, totalItems)
        
        progressiveReveal.setVisibleCount(endIndex)
        setCurrentBatch(i + 1)
      }, (i - currentBatch) * staggerDelay)
      
      staggerTimeouts.current.push(timeout)
    }
  }, [currentBatch, totalItems, batchSize, staggerDelay, progressiveReveal])

  const resetStaggered = useCallback(() => {
    staggerTimeouts.current.forEach(timeout => clearTimeout(timeout))
    staggerTimeouts.current = []
    setCurrentBatch(0)
    progressiveReveal.reset()
  }, [progressiveReveal])

  useEffect(() => {
    return () => {
      staggerTimeouts.current.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  return {
    ...progressiveReveal,
    currentBatch,
    revealWithStagger,
    resetStaggered
  }
}

export default useProgressiveReveal