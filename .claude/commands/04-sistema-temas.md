# 04 - Implementar Sistema de Temas (Modo Claro/Escuro)

## Tarefas Principais

### 4.1 Configurar Next-Themes
- [ ] Instalar e configurar next-themes
- [ ] Implementar ThemeProvider no _app.tsx
- [ ] Configurar atributo de tema no HTML
- [ ] Definir tema padrão (claro)
- [ ] Habilitar detecção de preferência do sistema
- [ ] Configurar storage key para persistência

### 4.2 Definir Paleta de Cores
- [ ] Criar variáveis CSS para modo claro
- [ ] Criar variáveis CSS para modo escuro
- [ ] Definir cores primárias da marca
- [ ] Definir cores secundárias e auxiliares
- [ ] Configurar cores de texto e backgrounds
- [ ] Definir cores para estados (hover, active, disabled)
- [ ] Garantir contraste adequado WCAG AA

### 4.3 Implementar Toggle Component
- [ ] Criar componente ThemeToggle
- [ ] Adicionar ícones sol/lua
- [ ] Implementar animação de transição
- [ ] Adicionar tooltip indicativo
- [ ] Garantir acessibilidade (aria-labels)
- [ ] Posicionar no header fixo
- [ ] Adicionar feedback visual ao alternar

### 4.4 Adaptar Componentes Base
- [ ] Atualizar Header para suportar ambos temas
- [ ] Atualizar Footer para suportar ambos temas
- [ ] Adaptar Cards e componentes UI
- [ ] Configurar sombras apropriadas por tema
- [ ] Ajustar bordas e divisores
- [ ] Adaptar overlays e modals

### 4.5 Configurar Imagens e Mídia
- [ ] Implementar filtros para imagens no dark mode
- [ ] Ajustar brightness de vídeos embedados
- [ ] Configurar logos alternativos se necessário
- [ ] Adaptar ícones SVG para temas
- [ ] Garantir visibilidade de gráficos
- [ ] Testar contraste em fotos de produto

### 4.6 Otimizar Transições
- [ ] Configurar transition duration global
- [ ] Prevenir flash of unstyled content (FOUC)
- [ ] Implementar smooth color transitions
- [ ] Adicionar classe para desabilitar transições
- [ ] Testar performance das transições
- [ ] Respeitar prefers-reduced-motion

### 4.7 Testes e Validação
- [ ] Testar persistência entre páginas
- [ ] Validar persistência após refresh
- [ ] Testar em diferentes navegadores
- [ ] Verificar contraste em ambos os modos
- [ ] Testar com ferramentas de acessibilidade
- [ ] Validar em dispositivos móveis

## Critérios de Conclusão
- Toggle funcional em todas as páginas
- Temas aplicados consistentemente
- Preferência salva e persistente
- Transições suaves sem flicker
- Contraste adequado (WCAG AA)
- Performance não impactada