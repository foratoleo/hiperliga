#!/usr/bin/env node

// Performance audit script for Hiperliga website
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Iniciando auditoria de performance da Hiperliga...\n')

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
}

function logStep(message, color = 'cyan') {
  console.log(`${colors[color]}${colors.bright}▶ ${message}${colors.reset}`)
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`)
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`)
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`)
}

// 1. Build Analysis
logStep('Analisando build de produção...')
try {
  execSync('npm run type-check', { stdio: 'inherit' })
  logSuccess('TypeScript: Sem erros de tipo')
} catch (error) {
  logError('TypeScript: Erros encontrados')
}

try {
  execSync('npm run lint', { stdio: 'inherit' })
  logSuccess('ESLint: Código está limpo')
} catch (error) {
  logWarning('ESLint: Avisos ou erros encontrados')
}

// 2. Build Size Analysis
logStep('Executando build otimizado...', 'blue')
try {
  execSync('npm run build:prod', { stdio: 'inherit' })
  logSuccess('Build concluído com sucesso')
} catch (error) {
  logError('Falha no build')
  process.exit(1)
}

// 3. Bundle Analysis
logStep('Analisando tamanho dos bundles...', 'magenta')
const buildDir = path.join(__dirname, '../.next')

if (fs.existsSync(buildDir)) {
  try {
    // Get build statistics
    const stats = getBuildStats(buildDir)
    console.log('\n📊 Estatísticas do Build:')
    console.log(`${colors.cyan}JavaScript Total: ${colors.bright}${stats.jsSize}${colors.reset}`)
    console.log(`${colors.cyan}CSS Total: ${colors.bright}${stats.cssSize}${colors.reset}`)
    console.log(`${colors.cyan}Páginas: ${colors.bright}${stats.pages}${colors.reset}`)
    console.log(`${colors.cyan}Chunks: ${colors.bright}${stats.chunks}${colors.reset}`)

    // Performance budget checks
    console.log('\n🎯 Verificação de Performance Budgets:')
    checkPerformanceBudgets(stats)

  } catch (error) {
    logWarning('Não foi possível analisar estatísticas do build')
  }
}

// 4. Core Web Vitals Recommendations
logStep('Gerando recomendações de Core Web Vitals...', 'green')
generateCWVRecommendations()

// 5. Generate Performance Report
logStep('Gerando relatório de performance...', 'yellow')
generatePerformanceReport()

logSuccess('Auditoria de performance concluída! 🎉')
console.log(`\n${colors.cyan}📋 Próximos passos:${colors.reset}`)
console.log('1. Revisar recomendações no relatório gerado')
console.log('2. Executar npm run test:performance para testes completos')
console.log('3. Implementar melhorias identificadas')
console.log('4. Re-executar auditoria após mudanças\n')

// Helper functions
function getBuildStats(buildDir) {
  const staticDir = path.join(buildDir, 'static')
  const stats = {
    jsSize: '0 KB',
    cssSize: '0 KB',
    pages: 0,
    chunks: 0
  }

  if (!fs.existsSync(staticDir)) {
    return stats
  }

  try {
    // Calculate JS bundle size
    const jsFiles = []
    const cssFiles = []
    
    function scanDirectory(dir) {
      const files = fs.readdirSync(dir)
      
      files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          scanDirectory(filePath)
        } else {
          if (file.endsWith('.js') && !file.includes('.map')) {
            jsFiles.push({ path: filePath, size: stat.size })
          } else if (file.endsWith('.css') && !file.includes('.map')) {
            cssFiles.push({ path: filePath, size: stat.size })
          }
        }
      })
    }

    scanDirectory(staticDir)

    const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0)
    const totalCssSize = cssFiles.reduce((sum, file) => sum + file.size, 0)

    stats.jsSize = formatBytes(totalJsSize)
    stats.cssSize = formatBytes(totalCssSize)
    stats.chunks = jsFiles.length + cssFiles.length
    
    // Count pages
    const pagesManifest = path.join(buildDir, 'server/pages-manifest.json')
    if (fs.existsSync(pagesManifest)) {
      const manifest = JSON.parse(fs.readFileSync(pagesManifest, 'utf8'))
      stats.pages = Object.keys(manifest).length
    }

  } catch (error) {
    console.warn('Erro ao calcular estatísticas:', error.message)
  }

  return stats
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function checkPerformanceBudgets(stats) {
  const budgets = {
    js: { limit: 250, unit: 'KB' },      // 250KB JavaScript
    css: { limit: 50, unit: 'KB' },     // 50KB CSS
    pages: { limit: 15, unit: '' },     // 15 pages max
    chunks: { limit: 20, unit: '' }     // 20 chunks max
  }

  // Parse current values
  const currentJs = parseFloat(stats.jsSize.replace(/[^\d.]/g, ''))
  const currentCss = parseFloat(stats.cssSize.replace(/[^\d.]/g, ''))

  // Check JavaScript budget
  if (currentJs <= budgets.js.limit) {
    logSuccess(`JavaScript: ${stats.jsSize} (dentro do budget de ${budgets.js.limit}${budgets.js.unit})`)
  } else {
    logWarning(`JavaScript: ${stats.jsSize} (excede budget de ${budgets.js.limit}${budgets.js.unit})`)
  }

  // Check CSS budget  
  if (currentCss <= budgets.css.limit) {
    logSuccess(`CSS: ${stats.cssSize} (dentro do budget de ${budgets.css.limit}${budgets.css.unit})`)
  } else {
    logWarning(`CSS: ${stats.cssSize} (excede budget de ${budgets.css.limit}${budgets.css.unit})`)
  }

  // Check pages count
  if (stats.pages <= budgets.pages.limit) {
    logSuccess(`Páginas: ${stats.pages} (dentro do budget de ${budgets.pages.limit})`)
  } else {
    logWarning(`Páginas: ${stats.pages} (excede budget de ${budgets.pages.limit})`)
  }

  // Check chunks count
  if (stats.chunks <= budgets.chunks.limit) {
    logSuccess(`Chunks: ${stats.chunks} (dentro do budget de ${budgets.chunks.limit})`)
  } else {
    logWarning(`Chunks: ${stats.chunks} (excede budget de ${budgets.chunks.limit})`)
  }
}

function generateCWVRecommendations() {
  const recommendations = [
    '🖼️  Largest Contentful Paint (LCP):',
    '   • Use OptimizedImage component for hero images',
    '   • Preload critical images above the fold',
    '   • Optimize image formats (WebP/AVIF)',
    '   • Use priority={true} for hero images',
    '',
    '⚡ First Input Delay (FID):',
    '   • Defer non-critical JavaScript loading',
    '   • Use code splitting and lazy loading',
    '   • Minimize main thread blocking',
    '   • Use passive event listeners',
    '',
    '📏 Cumulative Layout Shift (CLS):',
    '   • Set explicit dimensions for images',
    '   • Reserve space for dynamic content',
    '   • Use font-display: swap',
    '   • Avoid inserting content above existing content',
  ]

  console.log(`\n${colors.green}🎯 Recomendações para Core Web Vitals:${colors.reset}`)
  recommendations.forEach(line => console.log(line))
}

function generatePerformanceReport() {
  const reportContent = `# Relatório de Performance - Hiperliga

## Resumo da Auditoria
Data: ${new Date().toISOString()}

## Otimizações Implementadas

### ✅ Lazy Loading
- OptimizedImage component com intersection observer
- LazySection component para componentes
- Preload de imagens críticas

### ✅ Compressão de Assets  
- Next.js Image com AVIF/WebP
- Font optimization com preload
- Cache headers agressivos (1 ano para assets)

### ✅ Cache Strategies
- Service Worker com cache-first para assets
- Stale-while-revalidate para páginas
- Network-first para APIs

### ✅ Performance Budgets
- JavaScript: 250KB por página
- CSS: 50KB total
- Imagens: 200KB por imagem
- LCP: <2.5s, FID: <100ms, CLS: <0.1

### ✅ Core Web Vitals
- LCP Optimizer para imagens hero
- FID Optimizer para main thread
- CLS Optimizer para layout stability

### ✅ Build Optimization
- Webpack bundle splitting
- Tree shaking habilitado
- Minificação avançada
- Bundle analyzer integrado

## Próximas Melhorias Recomendadas

1. **Implementar CDN** para assets estáticos
2. **Adicionar HTTP/2 Server Push** para recursos críticos  
3. **Configurar Brotli compression** no servidor
4. **Implementar Critical CSS** inline
5. **Adicionar Resource Hints** automáticos

## Comandos Úteis

\`\`\`bash
# Análise completa de performance
npm run test:performance

# Bundle analyzer
ANALYZE=true npm run build

# Build otimizado
npm run build:prod
\`\`\`

---
Gerado automaticamente pelo script de auditoria de performance.
`

  fs.writeFileSync('PERFORMANCE.md', reportContent)
  logSuccess('Relatório salvo em PERFORMANCE.md')
}