# CONTEUDO-02: Extração de Depoimentos e Cases de Sucesso

## 📋 Objetivo
Coletar depoimentos reais de clientes e cases de sucesso do site original para criar uma seção autêntica de social proof no novo site.

## ⏱️ Tempo Estimado
1 hora

## 🔧 Comandos MCP

### 1. Extrair conteúdo da homepage (onde estão os depoimentos)
```bash
mcp__mendableai-mcp-server-firecrawl__firecrawl_scrape:
  url: "https://hiperliga.com.br"
  formats: ["markdown"]
  onlyMainContent: true
```

### 2. Extrair dados estruturados dos depoimentos
```bash
mcp__mendableai-mcp-server-firecrawl__firecrawl_extract:
  urls: ["https://hiperliga.com.br"]
  prompt: "Extraia todos os depoimentos de clientes mostrados no site. Para cada depoimento colete: nome do cliente, cidade/estado, texto do depoimento, número de reviews se disponível"
  schema: {
    "type": "object",
    "properties": {
      "depoimentos": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "nome": {"type": "string"},
            "localizacao": {"type": "string"},
            "depoimento": {"type": "string"},
            "reviews": {"type": "number"},
            "categoria": {"type": "string"}
          }
        }
      },
      "estatisticas": {
        "type": "object",
        "properties": {
          "metros_aplicados": {"type": "string"},
          "anos_experiencia": {"type": "string"},
          "clientes_atendidos": {"type": "string"}
        }
      }
    }
  }
```

### 3. Pesquisar padrões de apresentação de testimonials
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/devinschumacher/patterns.dev"  
  topic: "testimonials social proof"
  tokens: 2000
```

## 📁 Arquivos a Criar/Modificar
- `data/depoimentos.json` - Base de dados dos depoimentos
- `src/components/ui/testimonial-card.tsx` - Componente para exibir depoimentos
- `src/components/sections/testimonials-section.tsx` - Seção completa de depoimentos
- `src/types/testimonials.ts` - Tipos para depoimentos

## ✅ Critérios de Validação
- [ ] Arquivo JSON com pelo menos 6 depoimentos reais
- [ ] Componente TestimonialCard responsivo criado
- [ ] Seção de depoimentos implementada com carousel
- [ ] Estatísticas da empresa extraídas (3M+ m² aplicados)

## 🚀 Comandos de Execução para o Claude

```bash
# 1. Extrair depoimentos do site original
/task general-purpose "Use MCP Firecrawl para extrair todos os depoimentos de clientes do site hiperliga.com.br. Salve em data/depoimentos.json com estrutura organizada"

# 2. Criar componente de depoimento
/implement --type component --use-magic "Componente TestimonialCard responsivo com nome, localização, texto e rating"

# 3. Criar seção de depoimentos
/implement --type section "Seção completa de depoimentos com carousel, estatísticas e animações usando os dados extraídos"
```

## 📊 Próximos Passos
- Executar conteudo-03 para extrair dados corporativos
- Integrar componentes na homepage
- Testar responsividade dos depoimentos

## 🎯 Resultados Esperados
Uma seção impactante de social proof que demonstra a credibilidade e satisfação dos clientes da Hiperliga, aumentando a confiança dos visitantes.