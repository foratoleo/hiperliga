# 12 - Configurar Acessibilidade e Responsividade Completa

## Tarefas Principais

### 12.1 Navegação por Teclado
- [ ] Implementar focus visible em todos elementos
- [ ] Configurar tab order lógica
- [ ] Adicionar skip navigation link
- [ ] Implementar navegação por setas em menus
- [ ] Configurar teclas de atalho (opcional)
- [ ] Garantir modals navegáveis
- [ ] Implementar focus trap em modals
- [ ] Adicionar ESC para fechar overlays

### 12.2 Screen Readers
- [ ] Adicionar ARIA labels apropriados
- [ ] Implementar ARIA live regions
- [ ] Configurar roles semânticos
- [ ] Adicionar alt text em todas imagens
- [ ] Implementar aria-describedby
- [ ] Configurar aria-expanded em accordions
- [ ] Adicionar screen reader only text
- [ ] Testar com NVDA/JAWS

### 12.3 Semântica HTML
- [ ] Usar tags HTML5 semânticas
- [ ] Hierarquia correta de headings
- [ ] Implementar landmarks ARIA
- [ ] Usar lists para navegação
- [ ] Adicionar figure/figcaption
- [ ] Implementar time tags
- [ ] Usar address para contatos
- [ ] Adicionar main, nav, aside

### 12.4 Formulários Acessíveis
- [ ] Associar labels a inputs
- [ ] Adicionar fieldsets e legends
- [ ] Implementar mensagens de erro claras
- [ ] Adicionar instruções de preenchimento
- [ ] Configurar autocomplete apropriado
- [ ] Implementar required e aria-required
- [ ] Adicionar descrições de formato
- [ ] Focus no primeiro erro

### 12.5 Contraste e Cores
- [ ] Garantir contraste WCAG AA (4.5:1)
- [ ] Verificar contraste em dark mode
- [ ] Não depender só de cor para info
- [ ] Adicionar patterns em gráficos
- [ ] Testar com simulador daltonismo
- [ ] Implementar high contrast mode
- [ ] Verificar focus indicators
- [ ] Garantir links distinguíveis

### 12.6 Responsividade Mobile
- [ ] Breakpoints: 375px, 768px, 1024px, 1440px
- [ ] Touch targets mínimo 44x44px
- [ ] Implementar gestos mobile
- [ ] Configurar viewport meta tag
- [ ] Prevenir zoom em inputs (iOS)
- [ ] Implementar menu hamburger
- [ ] Otimizar tabelas para mobile
- [ ] Configurar orientação portrait/landscape

### 12.7 Responsividade Tablet
- [ ] Layout duas colunas onde apropriado
- [ ] Ajustar grid de produtos
- [ ] Otimizar navegação tablet
- [ ] Configurar hover vs touch
- [ ] Adaptar modals e overlays
- [ ] Ajustar tamanhos de fonte
- [ ] Otimizar galeria de imagens

### 12.8 Responsividade Desktop
- [ ] Layouts multi-coluna
- [ ] Implementar mega menu (se aplicável)
- [ ] Configurar hover states
- [ ] Otimizar para telas wide
- [ ] Implementar sticky elements
- [ ] Ajustar containers max-width
- [ ] Configurar grid systems

### 12.9 Testes de Acessibilidade
- [ ] Executar axe DevTools
- [ ] Testar com Lighthouse
- [ ] Validar com WAVE
- [ ] Testar navegação só teclado
- [ ] Verificar com screen reader
- [ ] Testar com zoom 200%
- [ ] Validar em modo high contrast
- [ ] Testar reduced motion

### 12.10 Recursos Adicionais
- [ ] Implementar lang attribute
- [ ] Adicionar página de acessibilidade
- [ ] Configurar focus management SPA
- [ ] Implementar announcements
- [ ] Adicionar transcripts (vídeos)
- [ ] Configurar prefers-reduced-motion
- [ ] Implementar print styles
- [ ] Adicionar ajuda contextual

## Critérios de Conclusão
- Lighthouse Accessibility > 95
- WCAG 2.1 AA compliance
- Navegação 100% por teclado
- Screen reader totalmente funcional
- Responsivo 375px até 4K
- Contraste aprovado em todos elementos
- Zero erros no axe DevTools