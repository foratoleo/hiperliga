// Font optimization utilities
export const FONT_DISPLAY_STRATEGIES = {
  // Critical fonts (above the fold)
  critical: 'swap', // Show fallback immediately, swap when font loads
  
  // Non-critical fonts (below the fold)  
  nonCritical: 'fallback', // Use fallback for 100ms, then swap if font loads within 3s
  
  // Optional fonts (decorative)
  optional: 'optional', // Use only if font loads within 100ms
} as const

export const FONT_PRELOAD_CONFIG = {
  // Primary fonts that should be preloaded
  primary: [
    {
      href: '/fonts/inter-var.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    },
    {
      href: '/fonts/roboto-var.woff2', 
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    }
  ],
  
  // Secondary fonts loaded on demand
  secondary: [
    {
      href: '/fonts/inter-latin.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    }
  ]
} as const

// Font optimization CSS variables
export const FONT_CSS_VARIABLES = `
  :root {
    /* System font stack as fallback */
    --font-system: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    
    /* Optimized font stacks */
    --font-inter: "Inter", var(--font-system);
    --font-roboto: "Roboto", var(--font-system);
    
    /* Font metrics for layout stability */
    --font-inter-ascent: 0.8755;
    --font-inter-descent: -0.2066;
    --font-inter-line-gap: 0;
    
    --font-roboto-ascent: 0.9278;
    --font-roboto-descent: -0.2443;  
    --font-roboto-line-gap: 0;
  }
  
  /* Font face declarations with display strategies */
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url('/fonts/inter-var.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url('/fonts/roboto-var.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  
  /* Fallback font metrics to prevent layout shift */
  @font-face {
    font-family: 'Inter Fallback';
    font-style: normal;
    font-weight: 100 900;
    src: local('system-ui');
    ascent-override: 87.55%;
    descent-override: 20.66%;
    line-gap-override: 0%;
  }
` as const

// Utility to generate font preload links
export function generateFontPreloadLinks(fonts: typeof FONT_PRELOAD_CONFIG.primary) {
  return fonts.map(font => ({
    rel: 'preload',
    href: font.href,
    as: font.as,
    type: font.type,
    crossOrigin: font.crossOrigin,
  }))
}

// Font loading performance helper
export function optimizeWebFonts() {
  if (typeof window === 'undefined') return
  
  // Use font loading API if available
  if ('fonts' in document) {
    // Preload critical fonts
    const interFont = new FontFace('Inter', 'url(/fonts/inter-var.woff2)', {
      display: 'swap',
      weight: '100 900'
    })
    
    const robotoFont = new FontFace('Roboto', 'url(/fonts/roboto-var.woff2)', {
      display: 'swap', 
      weight: '100 900'
    })
    
    Promise.all([
      interFont.load(),
      robotoFont.load()
    ]).then(fonts => {
      fonts.forEach(font => document.fonts.add(font))
    }).catch(error => {
      console.warn('Font loading failed:', error)
    })
  }
}

// Resource hints for better font loading
export const FONT_RESOURCE_HINTS = `
  <!-- DNS prefetch for external font sources -->
  <link rel="dns-prefetch" href="//fonts.gstatic.com">
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
  
  <!-- Preconnect to font sources -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Critical font preloads -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/roboto-var.woff2" as="font" type="font/woff2" crossorigin>
` as const