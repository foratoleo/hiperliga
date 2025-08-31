import { useState, useEffect } from 'react'

/**
 * Hook para detectar breakpoints de media query
 * Otimizado para performance mobile evitando re-renders desnecessários
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // Usar addEventListener se disponível, senão fallback para addListener
    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      // @ts-ignore - Fallback para browsers antigos
      media.addListener(listener)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        // @ts-ignore - Fallback para browsers antigos
        media.removeListener(listener)
      }
    }
  }, [query])

  // Evitar hydration mismatch - retornar false até component mounted
  if (!mounted) {
    return false
  }

  return matches
}

/**
 * Breakpoints padronizados do Tailwind CSS
 */
export const useBreakpoint = () => {
  const isSm = useMediaQuery('(min-width: 640px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const is2Xl = useMediaQuery('(min-width: 1536px)')

  // Mobile-first approach
  const isMobile = !isMd
  const isTablet = isMd && !isLg
  const isDesktop = isLg

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile,
    isTablet,
    isDesktop
  }
}

export default useMediaQuery