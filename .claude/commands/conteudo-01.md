# CONTEUDO-01: Extração de Especificações Técnicas dos Produtos

## 📋 Objetivo
Extrair dados técnicos detalhados de todos os produtos Hiperliga do site original para criar uma base de dados estruturada completa.

## ⏱️ Tempo Estimado
1.5 horas

## 🔧 Comandos MCP

### 1. Extrair dados da página principal de produtos
```bash
mcp__mendableai-mcp-server-firecrawl__firecrawl_scrape:
  url: "https://hiperliga.com.br/produtos"
  formats: ["markdown"]
  onlyMainContent: true
```

### 2. Extrair dados estruturados de produtos específicos
```bash
mcp__mendableai-mcp-server-firecrawl__firecrawl_extract:
  urls: [
    "https://hiperliga.com.br/produtos",
    "https://hiperliga.com.br/product/argamassa",
    "https://hiperliga.com.br/hiperliga"
  ]
  prompt: "Extraia para cada produto: nome, descrição, especificações técnicas (rendimento, peso, aplicação), modo de uso, benefícios"
  schema: {
    "type": "object",
    "properties": {
      "produtos": {
        "type": "array",
        "items": {
          "type": "object", 
          "properties": {
            "nome": {"type": "string"},
            "descricao": {"type": "string"},
            "peso": {"type": "string"},
            "rendimento": {"type": "string"},
            "aplicacao": {"type": "string"},
            "beneficios": {"type": "array"},
            "modo_uso": {"type": "string"}
          }
        }
      }
    }
  }
```

### 3. Buscar padrões de apresentação de produtos
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/devinschumacher/patterns.dev"
  topic: "product data presentation"
  tokens: 3000
```

## 📁 Arquivos a Criar/Modificar
- `data/produtos-especificacoes.json` - Base de dados dos produtos
- `src/types/produtos.ts` - Tipos TypeScript para produtos
- `src/lib/produtos-data.ts` - Helper para acessar dados dos produtos

## ✅ Critérios de Validação
- [ ] Arquivo JSON criado com pelo menos 5 produtos
- [ ] Cada produto tem especificações técnicas completas
- [ ] Tipos TypeScript definidos para estrutura de dados
- [ ] Helper function implementada para acessar dados

## 🚀 Comandos de Execução para o Claude

```bash
# 1. Extrair dados dos produtos
/task general-purpose "Use o MCP Firecrawl para extrair dados de produtos do site hiperliga.com.br/produtos. Crie um arquivo JSON estruturado com especificações técnicas completas em data/produtos-especificacoes.json"

# 2. Criar tipos TypeScript
/implement --type interface --file src/types/produtos.ts "Interface para dados de produtos baseada no JSON extraído"

# 3. Implementar helper
/implement --type utility --file src/lib/produtos-data.ts "Function para carregar e filtrar dados de produtos do JSON"
```

## 📊 Próximos Passos
- Executar conteudo-02 para extrair depoimentos
- Validar estrutura de dados criada
- Testar helper functions implementadas

## 🎯 Resultados Esperados
Ao final desta task, teremos uma base sólida de dados dos produtos que pode ser utilizada em qualquer página do site para apresentar informações precisas e atualizadas.