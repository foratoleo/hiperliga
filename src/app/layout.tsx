import type { Metadata } from 'next'
import { Inter, Roboto } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StickyCTA } from '@/components/ui/sticky-cta'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production' 
      ? 'https://hiperliga.com.br' 
      : 'http://localhost:3000'
  ),
  title: {
    default: 'Hiperliga - Argamassa Polimérica Inovadora | Gran Finelle',
    template: '%s | Hiperliga - Gran Finelle',
  },
  description:
    'Hiperliga é a argamassa polimérica revolucionária: 100% sustentável, 3x mais rápida, 0% água, areia ou cimento. Economia de até 35% na sua obra.',
  keywords: [
    'hiperliga',
    'argamassa polimérica',
    'construção sustentável',
    'gran finelle',
    'argamassa inovadora',
    'construção civil',
    'alvenaria',
    'sustentabilidade',
    'economia na obra',
  ],
  authors: [{ name: 'Gran Finelle' }],
  creator: 'Gran Finelle',
  publisher: 'Gran Finelle',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://hiperliga.com.br',
    siteName: 'Hiperliga',
    title: 'Hiperliga - Argamassa Polimérica Inovadora',
    description:
      'Revolucione sua obra com Hiperliga: argamassa polimérica 100% sustentável, 3x mais rápida e econômica.',
    images: [
      {
        url: '/images/01_brand/logo_hiperliga-optimized.webp',
        width: 1200,
        height: 630,
        alt: 'Hiperliga - Argamassa Polimérica Inovadora',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hiperliga - Argamassa Polimérica Inovadora',
    description:
      'Revolucione sua obra com Hiperliga: argamassa polimérica 100% sustentável, 3x mais rápida e econômica.',
    images: ['/images/01_brand/logo_hiperliga-optimized.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://hiperliga.com.br',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto.variable} font-sans`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <div className='min-h-screen flex flex-col'>
            <Header />
            <main id='main-content' className='flex-1'>
              {children}
            </main>
            <Footer />
            <StickyCTA />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}