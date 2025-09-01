# CONTEUDO-09: CTAs Contextuais e Jornada do Usuário Otimizada

## 📋 Objetivo
Implementar system de CTAs (Call-to-Actions) contextuais inteligentes e otimizar a jornada do usuário baseada nos dados reais da Hiperliga para maximizar conversões.

## ⏱️ Tempo Estimado
2 horas

## 🔧 Comandos MCP

### 1. Buscar padrões de CTAs de alta conversão
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/devinschumacher/patterns.dev"
  topic: "call to action optimization"
  tokens: 3500
```

### 2. Pesquisar user journey patterns
```bash
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/cloudscape_design"
  topic: "user journey optimization"
  tokens: 3000
```

## 📁 Arquivos a Criar/Modificar
- `src/components/ui/contextual-cta.tsx` - CTA contextual inteligente
- `src/components/ui/floating-cta.tsx` - CTA flutuante sticky
- `src/components/sections/cta-section.tsx` - Seção dedicada de CTA
- `src/hooks/use-user-journey.ts` - Hook para tracking da jornada
- `src/lib/cta-logic.ts` - Lógica de CTAs contextuais
- `src/components/ui/contact-modal.tsx` - Modal de contato otimizado
- `src/components/ui/calculator-widget.tsx` - Calculadora de economia

## ✅ Tarefas de Implementação

### 1. Sistema de CTAs Contextuais
- [ ] CTAs específicos por página (Homepage, Produtos, Sobre)
- [ ] Mensagens adaptadas ao contexto do usuário
- [ ] Priorização baseada na intenção (informação vs compra)
- [ ] A/B testing framework para otimização contínua

### 2. CTAs Baseados em Dados Reais
- [ ] "Economize 35% na sua obra" (baseado em dados extraídos)
- [ ] "Usado em 3M+ m² de construção" (social proof)
- [ ] "Aplique 3x mais rápido" (benefício de velocidade)
- [ ] "100% sustentável - 0% desperdício"

### 3. Jornada do Usuário Otimizada
- [ ] Tracking de comportamento (scroll, cliques, tempo)
- [ ] CTAs progressivos (informação → interesse → ação)
- [ ] Remarketing interno baseado em páginas visitadas
- [ ] Exit-intent CTAs para retenção

### 4. Widgets Interativos
- [ ] Calculadora de economia baseada em m²
- [ ] Calculadora de rendimento por produto
- [ ] Simulador de tempo de aplicação
- [ ] Comparador de custos tradicional vs Hiperliga

### 5. CTAs de Conversão Múltipla
- [ ] "Onde Comprar" - localização de revendedores
- [ ] "Solicitar Orçamento" - formulário qualificado
- [ ] "Falar com Especialista" - WhatsApp direto
- [ ] "Download Ficha Técnica" - lead magnet

## 🚀 Comandos de Execução para o Claude

```bash
# 1. Implementar sistema de CTAs contextuais
/implement --component ContextualCTA "Sistema de CTAs inteligentes que se adaptam ao contexto da página e comportamento do usuário"

# 2. Criar widgets de conversão
/implement --use-magic "Calculadora de economia e rendimento usando dados reais de produtos-especificacoes.json"

# 3. Desenvolver jornada otimizada
/implement --hook use-user-journey "Hook para tracking de jornada e apresentação de CTAs progressivos"

# 4. Implementar CTAs flutuantes
/implement --component FloatingCTA "CTA sticky inteligente que aparece baseado no scroll e tempo na página"

# 5. Criar modal de contato avançado
/implement --component ContactModal "Modal de contato com formulário qualificado e integração WhatsApp"
```

## 📊 Dependências
- ✅ conteudo-01: Dados de produtos para calculadoras
- ✅ conteudo-02: Depoimentos para social proof
- ✅ conteudo-03: Dados de contato da empresa
- ✅ conteudo-08: Micro-interações para feedback

## ✅ Critérios de Validação
- [ ] CTAs aparecem contextualmente em cada página
- [ ] Calculadoras funcionam com dados reais de rendimento
- [ ] Tracking de jornada registra comportamentos chave
- [ ] Modal de contato integra com WhatsApp real
- [ ] Exit-intent CTAs funcionam corretamente
- [ ] Performance não impactada pelos widgets
- [ ] CTAs são acessíveis e responsivos
- [ ] A/B testing framework operacional

## 📊 Próximos Passos
- Executar conteudo-10 para validação final
- Configurar analytics para CTAs
- Testar conversões em cenários reais

## 🎯 Resultados Esperados
Sistema sofisticado de CTAs que guia usuários através de uma jornada otimizada, usando dados reais da Hiperliga para criar urgência e relevância, maximizando conversões qualificadas.