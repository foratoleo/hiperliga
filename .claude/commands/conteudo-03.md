# CONTEUDO-03: Extração de Dados Corporativos e História da Empresa

## 📋 Objetivo
Extrair informações detalhadas sobre a empresa Hiperliga Materiais para Construção Ltda, sua história, missão e dados corporativos para enriquecer a página "Sobre".

## ⏱️ Tempo Estimado
45 minutos

## 🔧 Comandos MCP

### 1. Extrair conteúdo da página "Sobre Nós"
```bash
mcp__mendableai-mcp-server-firecrawl__firecrawl_scrape:
  url: "https://hiperliga.com.br/sobre-nos"
  formats: ["markdown"]
  onlyMainContent: true
```

### 2. Extrair dados estruturados da empresa
```bash
mcp__mendableai-mcp-server-firecrawl__firecrawl_extract:
  urls: ["https://hiperliga.com.br/sobre-nos", "https://hiperliga.com.br"]
  prompt: "Extraia informações corporativas: nome da empresa, endereço completo, áreas de experiência, história, missão, dados de contato, e qualquer informação sobre fundação ou marcos importantes"
  schema: {
    "type": "object",
    "properties": {
      "empresa": {
        "type": "object",
        "properties": {
          "razao_social": {"type": "string"},
          "nome_fantasia": {"type": "string"},
          "endereco": {
            "type": "object",
            "properties": {
              "rua": {"type": "string"},
              "bairro": {"type": "string"},
              "cep": {"type": "string"},
              "cidade": {"type": "string"},
              "estado": {"type": "string"}
            }
          },
          "areas_experiencia": {"type": "array"},
          "historia": {"type": "string"},
          "missao": {"type": "string"},
          "valores": {"type": "array"},
          "contato": {
            "type": "object",
            "properties": {
              "telefone": {"type": "string"},
              "whatsapp": {"type": "string"},
              "email": {"type": "string"}
            }
          },
          "marcos": {"type": "array"}
        }
      }
    }
  }
```

### 3. Mapear imagens da empresa e produtos
```bash
mcp__mendableai-mcp-server-firecrawl__firecrawl_map:
  url: "https://hiperliga.com.br"
  search: "logo empresa produto"
  limit: 15
```

## 📁 Arquivos a Criar/Modificar
- `data/empresa.json` - Dados corporativos estruturados
- `data/images-urls.json` - URLs das imagens importantes do site
- `src/types/empresa.ts` - Tipos para dados da empresa
- `scripts/download-images.js` - Script para baixar imagens relevantes

## ✅ Critérios de Validação
- [ ] Dados da empresa extraídos e estruturados
- [ ] Endereço completo e dados de contato salvos
- [ ] Lista de URLs de imagens mapeadas
- [ ] Script de download de imagens criado

## 🚀 Comandos de Execução para o Claude

```bash
# 1. Extrair dados corporativos
/task general-purpose "Use MCP Firecrawl para extrair dados completos da empresa do site hiperliga.com.br/sobre-nos. Salve em data/empresa.json"

# 2. Mapear imagens importantes
/task general-purpose "Use MCP Firecrawl para mapear URLs de imagens relevantes do site. Salve lista em data/images-urls.json"

# 3. Criar script de download
/implement --type script "Script Node.js para baixar imagens mapeadas organizando por categoria (logos, produtos, empresa)"
```

## 📊 Próximos Passos
- Executar conteudo-04 para integrar nas páginas
- Baixar e otimizar imagens importantes
- Atualizar página "Sobre" com novos dados

## 🎯 Resultados Esperados
Base completa de dados corporativos e assets visuais prontos para integração, fornecendo credibilidade e informações precisas sobre a empresa.