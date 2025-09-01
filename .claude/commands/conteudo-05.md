# CONTEUDO-05: Expansão da Página de Produtos

## 📋 Objetivo
Transformar a página de produtos em um catálogo completo e detalhado usando os dados extraídos, com fichas técnicas, especificações e informações de aplicação.

## ⏱️ Tempo Estimado
2.5 horas

## 🔧 Comandos MCP

### 1. Buscar padrões de catálogo de produtos
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/ant.design/llmstxt"
  topic: "product catalog design"
  tokens: 3000
```

### 2. Pesquisar componentes de especificações técnicas
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/cloudscape_design"
  topic: "technical specifications tables"
  tokens: 2500
```

## 📁 Arquivos a Modificar
- `src/app/produtos/page.tsx` - Página principal de produtos
- `src/app/produtos/[slug]/page.tsx` - Páginas individuais de produtos (criar)
- `src/components/ui/product-card-detailed.tsx` - Card detalhado de produto
- `src/components/ui/technical-specs-table.tsx` - Tabela de especificações
- `src/components/sections/product-comparison.tsx` - Comparação entre produtos
- `src/lib/produtos-utils.ts` - Utilidades para manipular dados de produtos

## ✅ Tarefas de Implementação

### 1. Reestruturar Página Principal de Produtos
- [ ] Implementar filtros por categoria/tipo
- [ ] Criar grid responsivo com cards detalhados
- [ ] Adicionar busca por nome/características
- [ ] Implementar ordenação (nome, popularidade, aplicação)

### 2. Criar Páginas Individuais de Produtos
- [ ] Rota dinâmica `/produtos/[slug]`
- [ ] Layout com galeria de imagens
- [ ] Seção de especificações técnicas completas
- [ ] Modo de aplicação passo a passo
- [ ] CTAs específicos (onde comprar, orçamento)

### 3. Implementar Componentes Especializados
- [ ] ProductCardDetailed com mais informações
- [ ] TechnicalSpecsTable responsiva e organizada
- [ ] ProductComparison para comparar até 3 produtos
- [ ] ApplicationGuide com instruções detalhadas

### 4. Adicionar Funcionalidades Avançadas
- [ ] Calculadora de rendimento por m²
- [ ] Sugestões de produtos relacionados
- [ ] Download de fichas técnicas (PDF)
- [ ] Sistema de favoritos (localStorage)

## 🚀 Comandos de Execução para o Claude

```bash
# 1. Reestruturar página principal
/implement --file src/app/produtos/page.tsx "Página de catálogo completa com filtros, busca e grid de produtos usando data/produtos-especificacoes.json"

# 2. Criar páginas dinâmicas de produtos
/implement --route produtos/[slug] "Páginas individuais com specs completas, galeria, guias de aplicação e CTAs específicos"

# 3. Implementar componentes especializados
/implement --use-magic "Componentes ProductCardDetailed, TechnicalSpecsTable e ApplicationGuide com design moderno"

# 4. Adicionar funcionalidades avançadas
/implement --type utility "Calculadora de rendimento, sistema de favoritos e geração de sugestões baseadas em dados"
```

## 📊 Dependências
- ✅ conteudo-01: Base de dados de produtos
- ✅ conteudo-03: Imagens de produtos mapeadas

## ✅ Critérios de Validação
- [ ] Catálogo carrega todos os produtos de data/produtos-especificacoes.json
- [ ] Filtros e busca funcionam corretamente
- [ ] Páginas individuais são acessíveis via slug
- [ ] Especificações técnicas são apresentadas claramente
- [ ] Calculadora de rendimento funciona com dados reais
- [ ] Design responsivo em todos os componentes
- [ ] Performance mantida com lazy loading

## 📊 Próximos Passos
- Executar conteudo-06 para página "Sobre"
- Testar funcionalidades da calculadora
- Validar SEO das páginas de produtos

## 🎯 Resultados Esperados
Catálogo profissional e completo que serve como ferramenta de vendas eficaz, permitindo aos clientes encontrar exatamente o produto necessário com todas as informações técnicas relevantes.