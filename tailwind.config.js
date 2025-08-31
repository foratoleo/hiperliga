/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic colors using CSS variables
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          foreground: 'rgb(var(--success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          foreground: 'rgb(var(--warning-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        
        // Keep brand colors for gradients and special uses
        brand: {
          primary: '#1a365d',
          secondary: '#2c5282', 
          accent: '#3182ce',
          success: '#38a169',
          warning: '#d69e2e',
          error: '#e53e3e',
          'eco-light': '#f0fff4',
          'eco-medium': '#68d391',
          'eco-dark': '#2f855a',
          'tech-light': '#ebf8ff',
          'tech-medium': '#4299e1',
          'tech-dark': '#2b6cb0',
        },
        
        // Enhanced sustainable colors (based on Gemini analysis)
        sustainable: {
          50: '#f0fdf4',    // Very light green
          100: '#dcfce7',   // Light green
          400: '#4ade80',   // Vibrant green
          500: '#5a7d6c',   // Sage green (professional sustainability)
          600: '#22c55e',   // Medium bright green
          700: '#2f855a',   // Dark green (existing eco-dark)
          800: '#2f4d3d',   // Forest green (sophisticated)
          900: '#1f2937',   // Very dark green
        },
        
        // Natural/organic colors (construction materials theme)
        natural: {
          50: '#f5f3f0',    // Light limestone/sand
          100: '#f3f4f6',   // Very light gray
          200: '#e5e7eb',   // Light gray
          300: '#d1d5db',   // Medium light gray
          400: '#9ca3af',   // Medium gray
          500: '#6b7280',   // Balanced gray
          600: '#4b5563',   // Dark gray
          700: '#374151',   // Very dark gray
          800: '#1f2937',   // Almost black
          900: '#111827',   // Pure dark
        },
        hiperliga: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',   // Enhanced vibrancy
          500: '#0ea5e9',   // Primary blue (maintain)
          600: '#0284c7',   // Corporate blue
          700: '#0369a1',   // Professional dark blue
          750: '#1e40af',   // New: Professional deep blue (better contrast)
          800: '#075985',
          900: '#0c4a6e',
        },
        granfinelle: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-roboto)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        // Enhanced existing animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // Premium animations
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
        'scale-in': 'scaleIn 0.4s ease-out',
        'bounce-soft': 'bounceSoft 1s ease-out',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'reveal-up': 'revealUp 0.6s ease-out',
        'reveal-right': 'revealRight 0.6s ease-out',
        'loading-dots': 'loadingDots 1.5s infinite',
      },
      keyframes: {
        // Enhanced existing keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        
        // Premium keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        revealUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        revealRight: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        loadingDots: {
          '0%, 20%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      boxShadow: {
        // Enhanced existing shadows
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        
        // Premium shadows
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.1)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'depth': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24), 0 10px 20px rgba(0, 0, 0, 0.1)',
      },
      
      // Premium gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-sustainable': 'linear-gradient(135deg, #f0fdf4 0%, #5a7d6c 50%, #2f4d3d 100%)',
        'gradient-innovation': 'linear-gradient(135deg, #ebf8ff 0%, #4299e1 50%, #1e40af 100%)',
        'gradient-professional': 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #0369a1 100%)',
        'gradient-natural': 'linear-gradient(135deg, #f5f3f0 0%, #9ca3af 50%, #374151 100%)',
        'shimmer-effect': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        'glass-effect': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      
      // Premium backdrop filters
      backdropBlur: {
        'xs': '2px',
        'glass': '10px',
        'premium': '16px',
      },
      
      // Premium spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}