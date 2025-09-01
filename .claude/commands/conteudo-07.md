# CONTEUDO-07: Otimização de Performance e SEO

## 📋 Objetivo
Garantir que todo o novo conteúdo integrado mantém alta performance, otimizar carregamento e implementar melhorias de SEO baseadas no conteúdo real extraído.

## ⏱️ Tempo Estimado
2 horas

## 🔧 Comandos MCP

### 1. Buscar padrões de otimização de conteúdo
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/websites/astro_build"
  topic: "content optimization performance"
  tokens: 3000
```

### 2. Pesquisar estratégias de lazy loading
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/devinschumacher/patterns.dev"
  topic: "lazy loading content images"
  tokens: 2500
```

## 📁 Arquivos a Modificar
- `src/components/ui/optimized-image.tsx` - Componente de imagem otimizada
- `src/components/ui/lazy-section.tsx` - Seções com lazy loading
- `src/lib/seo-utils.ts` - Utilidades de SEO
- `next.config.js` - Configurações de otimização
- `src/app/sitemap.ts` - Sitemap dinâmico
- `src/app/robots.ts` - Robots.txt dinâmico
- `public/sw.js` - Service Worker atualizado

## ✅ Tarefas de Implementação

### 1. Otimização de Imagens e Assets
- [ ] Implementar lazy loading para imagens de produtos
- [ ] Configurar placeholder blur para melhor UX
- [ ] Otimizar formatos (WebP, AVIF) para imagens extraídas
- [ ] Implementar preload para imagens críticas

### 2. Lazy Loading de Conteúdo
- [ ] LazySection para depoimentos e estatísticas
- [ ] Componente OptimizedContent para seções pesadas
- [ ] Implementar Intersection Observer para animações
- [ ] Lazy loading para dados JSON pesados

### 3. Otimização de SEO
- [ ] Meta tags dinâmicas baseadas em dados reais
- [ ] Schema.org para produtos e empresa
- [ ] Sitemap dinâmico incluindo produtos
- [ ] Open Graph otimizado com imagens corretas

### 4. Performance e Caching
- [ ] Service Worker para cache de dados extraídos
- [ ] Otimização de bundle splitting
- [ ] Preload de recursos críticos
- [ ] Compressão de dados JSON

### 5. Monitoramento e Validação
- [ ] Script de análise de Core Web Vitals
- [ ] Validação de dados estruturados
- [ ] Teste de carregamento progressivo
- [ ] Auditoria de acessibilidade

## 🚀 Comandos de Execução para o Claude

```bash
# 1. Implementar otimização de imagens
/improve --focus performance "Componente OptimizedImage com lazy loading, blur placeholder e formatos modernos para todas as imagens extraídas"

# 2. Configurar lazy loading de seções
/implement --component LazySection "Componente para carregamento progressivo de seções pesadas com loading states"

# 3. Otimizar SEO com dados reais
/implement --file src/lib/seo-utils.ts "Utilidades para gerar meta tags dinâmicas usando dados de empresa.json e produtos-especificacoes.json"

# 4. Atualizar Service Worker
/improve --file public/sw.js "Service Worker para cache inteligente de dados extraídos e assets otimizados"

# 5. Implementar monitoramento
/implement --type script "Scripts para monitoramento de performance e validação de dados estruturados"
```

## 📊 Dependências
- ✅ conteudo-04: Homepage com novo conteúdo
- ✅ conteudo-05: Página de produtos expandida  
- ✅ conteudo-06: Página "Sobre" renovada

## ✅ Critérios de Validação
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms  
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Lighthouse Score > 90 em todas as categorias
- [ ] Todas as imagens carregam com lazy loading
- [ ] Dados estruturados validados sem erros
- [ ] Service Worker cache funcionando
- [ ] Sitemap gerado dinamicamente

## 📊 Próximos Passos
- Executar conteudo-08 para otimizações UX
- Testar performance em diferentes dispositivos
- Validar SEO com ferramentas especializadas

## 🎯 Resultados Esperados
Site otimizado que mantém excelente performance mesmo com todo o conteúdo rico integrado, proporcionando experiência fluida e melhor posicionamento nos buscadores.