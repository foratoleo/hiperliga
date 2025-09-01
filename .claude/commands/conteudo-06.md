# CONTEUDO-06: Renovação Completa da Página "Sobre"

## 📋 Objetivo
Transformar a página "Sobre" em uma apresentação institucional completa e envolvente, usando os dados extraídos da empresa e criando uma narrativa profissional sobre a Hiperliga.

## ⏱️ Tempo Estimado
1.5 horas

## 🔧 Comandos MCP

### 1. Buscar padrões de páginas "About" corporativas
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/devinschumacher/patterns.dev"
  topic: "corporate about page design"
  tokens: 3000
```

### 2. Pesquisar componentes de timeline e história
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/cloudscape_design"
  topic: "timeline company history"
  tokens: 2000
```

## 📁 Arquivos a Modificar
- `src/app/sobre/page.tsx` - Página principal "Sobre"
- `src/components/sections/company-hero.tsx` - Hero institucional
- `src/components/sections/company-history.tsx` - História da empresa
- `src/components/sections/company-values.tsx` - Missão, visão, valores
- `src/components/sections/company-stats.tsx` - Estatísticas corporativas
- `src/components/ui/timeline.tsx` - Componente timeline
- `src/components/ui/value-card.tsx` - Card de valores

## ✅ Tarefas de Implementação

### 1. Hero Institucional
- [ ] Apresentação da "Hiperliga Materiais para Construção Ltda"
- [ ] Tagline baseada nas áreas de expertise
- [ ] Imagem de fábrica/equipe se disponível
- [ ] Dados de fundação e localização

### 2. História e Trajetória
- [ ] Narrativa sobre experiência em construção civil, mineração e química
- [ ] Timeline de marcos importantes
- [ ] Evolução dos produtos desenvolvidos
- [ ] Conquistas e certificações

### 3. Missão, Visão e Valores
- [ ] Cards visuais para cada valor
- [ ] Foco em "economia, rapidez e praticidade"
- [ ] Compromisso com sustentabilidade
- [ ] Inovação tecnológica

### 4. Estatísticas e Credenciais
- [ ] 3+ milhões de m² aplicados
- [ ] Área de cobertura (PR e região)
- [ ] Anos de experiência nas diferentes áreas
- [ ] Tipos de projetos atendidos

## 🚀 Comandos de Execução para o Claude

```bash
# 1. Renovar página principal
/implement --file src/app/sobre/page.tsx "Página institucional completa usando dados de data/empresa.json com seções hero, história, valores e estatísticas"

# 2. Criar seções especializadas
/implement --use-magic "Componentes CompanyHero, CompanyHistory com timeline, CompanyValues com cards visuais"

# 3. Implementar timeline interativa
/implement --component Timeline "Timeline interativa para marcos da empresa com animações e hover states"

# 4. Adicionar estatísticas visuais
/implement --section "company stats" "Seção de estatísticas com contadores animados e gráficos visuais"
```

## 📊 Dependências
- ✅ conteudo-03: Dados corporativos extraídos
- ✅ conteudo-02: Estatísticas gerais da empresa

## ✅ Critérios de Validação
- [ ] Página carrega dados reais de data/empresa.json
- [ ] História da empresa apresentada de forma envolvente
- [ ] Timeline interativa funciona corretamente
- [ ] Valores da empresa apresentados visualmente
- [ ] Estatísticas animadas mostram números corretos
- [ ] Informações de contato atualizadas
- [ ] Design responsivo e profissional

## 📊 Próximos Passos
- Executar conteudo-07 para otimização de performance
- Testar carregamento de todas as seções
- Validar informações apresentadas

## 🎯 Resultados Esperados
Página "Sobre" que transmite profissionalismo, credibilidade e confiança, apresentando a Hiperliga como empresa consolidada e inovadora no mercado de construção civil.