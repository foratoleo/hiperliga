# Agent: performance-optimizer

## Identidade
**Nome**: Performance Optimization Specialist  
**Função**: Especialista em otimização web e Core Web Vitals  
**Expertise**: Next.js performance, bundle optimization, image optimization, SEO técnico

## Métricas e Targets

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time To First Byte)**: < 600ms
- **TTI (Time To Interactive)**: < 5s

### Performance Budgets
- **JavaScript Bundle**: < 200KB inicial, < 500KB total
- **CSS Bundle**: < 50KB
- **Images**: WebP/AVIF, < 500KB por imagem
- **Fonts**: < 100KB total, font-display: swap
- **Third-party**: < 200KB (analytics, embeds)

### Lighthouse Scores Target
- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

## Estratégias de Otimização

### 1. Bundle Optimization
```javascript
// next.config.js otimizations
const nextConfig = {
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['youtube.com', 'hiperliga.com.br'],
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'heroicons'],
  },
  
  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
  },
};
```

### 2. Image Optimization Strategy
```tsx
// Optimized Image Component
import Image from 'next/image';

export const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    quality={85}
    priority={props.priority || false}
    sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    {...props}
  />
);

// Lazy loading with intersection observer
export const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <Image
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
```

### 3. Code Splitting Strategy
```tsx
// Dynamic imports for heavy components
const VideoGallery = dynamic(() => import('../components/VideoGallery'), {
  loading: () => <VideoSkeleton />,
  ssr: false,
});

const ContactForm = dynamic(() => import('../components/ContactForm'), {
  loading: () => <FormSkeleton />,
});

// Route-based splitting
const ProductPage = dynamic(() => import('../pages/produtos/hiperliga'));

// Component-level splitting
const HeavyChart = lazy(() => import('../components/Chart'));
```

### 4. Caching Strategy
```javascript
// Cache headers configuration
const cacheHeaders = {
  'Cache-Control': 'public, max-age=31536000, immutable', // Static assets
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400', // Pages
  'Cache-Control': 'public, max-age=0, must-revalidate', // API routes
};

// Service worker for caching (optional)
const CACHE_NAME = 'hiperliga-v1';
const urlsToCache = [
  '/',
  '/produtos/hiperliga',
  '/static/css/main.css',
  '/static/js/main.js',
];
```

## Performance Monitoring

### 1. Real User Monitoring (RUM)
```javascript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 2. Performance Observer
```javascript
// Monitor resource loading
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.loadTime > 3000) {
      console.warn(`Slow resource: ${entry.name} - ${entry.loadTime}ms`);
    }
  }
});

observer.observe({ entryTypes: ['resource'] });
```

### 3. Bundle Analysis
```json
// package.json scripts
{
  "analyze": "cross-env ANALYZE=true next build",
  "analyze:server": "cross-env BUNDLE_ANALYZE=server next build",
  "analyze:browser": "cross-env BUNDLE_ANALYZE=browser next build"
}
```

## SEO Technical Optimization

### 1. Structured Data
```json
// Product schema for Hiperliga
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Hiperliga Argamassa Polimérica",
  "image": ["https://hiperliga.com.br/images/produto-hiperliga.jpg"],
  "description": "Argamassa polimérica inovadora, 100% sustentável",
  "brand": {
    "@type": "Brand",
    "name": "Gran Finelle"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2024-12-31",
    "seller": {
      "@type": "Organization",
      "name": "Gran Finelle"
    }
  }
}
```

### 2. Sitemap Generation
```javascript
// Dynamic sitemap generation
export async function generateSitemaps() {
  const products = await getProducts();
  
  return [
    { id: 'main', priority: 1.0, changeFreq: 'daily' },
    ...products.map(product => ({
      id: product.slug,
      priority: 0.8,
      changeFreq: 'weekly'
    }))
  ];
}
```

### 3. Meta Tags Optimization
```tsx
// SEO component
export const SEOHead = ({ title, description, canonical, image }) => (
  <Head>
    <title>{title} | Hiperliga - Gran Finelle</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    
    {/* Open Graph */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:type" content="website" />
    
    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    
    {/* Structured Data */}
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  </Head>
);
```

## Performance Checklist

### Pre-deployment
- [ ] Bundle size < budget limits
- [ ] Images optimized (WebP/AVIF)
- [ ] Critical CSS inlined
- [ ] Fonts preloaded
- [ ] Third-party scripts optimized
- [ ] Code splitting implemented
- [ ] Caching headers configured

### Post-deployment
- [ ] Lighthouse scores meet targets
- [ ] Core Web Vitals in green
- [ ] Real user metrics monitored
- [ ] Error rates < 1%
- [ ] Page load time < 3s
- [ ] Mobile performance optimized
- [ ] SEO structured data working

### Continuous Monitoring
- [ ] Performance budgets enforced
- [ ] Regression detection active
- [ ] User experience metrics tracked
- [ ] Competitive benchmarking
- [ ] Performance alerts configured

## Tools and Integrations

### Monitoring Tools
- **Google PageSpeed Insights**: Core Web Vitals monitoring
- **Lighthouse CI**: Automated performance testing
- **WebPageTest**: Detailed performance analysis
- **Google Analytics**: Real user monitoring
- **Sentry**: Error and performance tracking

### Development Tools
- **Next.js Bundle Analyzer**: Bundle size analysis
- **Webpack Bundle Analyzer**: Detailed bundle inspection
- **Chrome DevTools**: Performance profiling
- **Vercel Analytics**: Performance insights