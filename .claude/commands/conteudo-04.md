# CONTEUDO-04: Integração de Dados na Homepage

## 📋 Objetivo
Integrar os dados extraídos nas tasks anteriores na homepage do projeto, enriquecendo as seções existentes com conteúdo real e impactante.

## ⏱️ Tempo Estimado
2 horas

## 🔧 Comandos MCP

### 1. Buscar padrões de homepage de alta conversão
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/devinschumacher/patterns.dev"
  topic: "homepage conversion optimization"
  tokens: 4000
```

### 2. Pesquisar padrões de apresentação de benefícios
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/cloudscape_design"
  topic: "benefit presentation cards"
  tokens: 3000
```

## 📁 Arquivos a Modificar
- `src/app/page.tsx` - Homepage principal
- `src/components/sections/hero-section.tsx` - Seção hero
- `src/components/sections/benefits-section.tsx` - Seção de benefícios
- `src/components/sections/stats-section.tsx` - Seção de estatísticas
- `src/components/ui/product-preview-card.tsx` - Card de preview de produtos

## ✅ Tarefas de Implementação

### 1. Atualizar Hero Section
- [ ] Integrar estatística "3+ milhões m² aplicados"
- [ ] Adicionar contador animado usando dados reais
- [ ] Implementar CTA mais específico baseado no site original

### 2. Enriquecer Seção de Benefícios
- [ ] Usar dados técnicos reais dos produtos (rendimento, economia)
- [ ] Adicionar ícones específicos para cada benefício
- [ ] Implementar animações de entrada baseadas em scroll

### 3. Implementar Seção de Depoimentos
- [ ] Integrar componente TestimonialCard criado na task anterior
- [ ] Usar dados reais de depoimentos extraídos
- [ ] Implementar carousel responsivo

### 4. Adicionar Preview de Produtos
- [ ] Criar cards com dados reais dos produtos
- [ ] Link para páginas específicas de produtos
- [ ] Implementar lazy loading para imagens

## 🚀 Comandos de Execução para o Claude

```bash
# 1. Atualizar hero section com dados reais
/improve --file src/app/page.tsx --focus "hero section" "Integrar estatísticas reais: 3M+ m² aplicados, 35% economia, 3x velocidade usando dados de data/empresa.json"

# 2. Enriquecer seção de benefícios
/improve --file src/app/page.tsx --focus "benefits section" "Usar especificações técnicas reais de data/produtos-especificacoes.json para tornar benefícios mais específicos e convincentes"

# 3. Integrar depoimentos reais
/implement --file src/app/page.tsx --use-magic "Seção de depoimentos usando dados de data/depoimentos.json com carousel responsivo e animações"

# 4. Implementar preview de produtos
/implement --section "product preview" "Cards de produtos usando dados extraídos com lazy loading e links para páginas específicas"
```

## 📊 Dependências
- ✅ conteudo-01: Dados de produtos
- ✅ conteudo-02: Depoimentos e estatísticas
- ✅ conteudo-03: Dados da empresa

## ✅ Critérios de Validação
- [ ] Homepage carrega dados reais de arquivos JSON
- [ ] Estatísticas animadas mostram números corretos
- [ ] Depoimentos são exibidos em carousel funcional
- [ ] Performance não degradada (LCP < 2.5s)
- [ ] Design responsivo mantido em todos os dispositivos

## 📊 Próximos Passos
- Executar conteudo-05 para página de produtos
- Testar performance com novo conteúdo
- Validar conversão com CTAs atualizados

## 🎯 Resultados Esperados
Homepage mais convincente e autêntica que usa dados reais para aumentar credibilidade e taxa de conversão dos visitantes.