# 10 - Implementar Página de Contato com Formulário e Validação

## Tarefas Principais

### 10.1 Layout da Página
- [ ] Criar estrutura duas colunas (desktop)
- [ ] Coluna esquerda: formulário
- [ ] Coluna direita: informações de contato
- [ ] Implementar versão mobile empilhada
- [ ] Adicionar introdução acolhedora
- [ ] Incluir breadcrumb navigation

### 10.2 Formulário de Contato
- [ ] Implementar com React Hook Form
- [ ] Campo Nome (obrigatório)
- [ ] Campo Email (obrigatório, validação)
- [ ] Campo Telefone (máscara, opcional)
- [ ] Campo Empresa (opcional)
- [ ] Campo Cidade/Estado (opcional)
- [ ] Campo Assunto (select/dropdown)
- [ ] Campo Mensagem (textarea, obrigatório)
- [ ] Checkbox de política de privacidade

### 10.3 Validações do Formulário
- [ ] Validação de email com regex
- [ ] Validação de telefone brasileiro
- [ ] Campos obrigatórios marcados
- [ ] Mensagens de erro inline
- [ ] Validação em tempo real
- [ ] Feedback visual nos campos
- [ ] Prevenir envio com erros
- [ ] Sanitização de inputs

### 10.4 Informações de Contato
- [ ] Adicionar telefones com ícones
- [ ] Destacar WhatsApp comercial
- [ ] Incluir email clicável
- [ ] Adicionar endereço completo
- [ ] Incluir horário de atendimento
- [ ] Adicionar CNPJ (se aplicável)
- [ ] Links para redes sociais

### 10.5 Integração com Mapa
- [ ] Implementar Google Maps embed
- [ ] Marcar localização da empresa
- [ ] Adicionar controles de zoom
- [ ] Implementar lazy loading do mapa
- [ ] Adicionar link "Ver no Google Maps"
- [ ] Incluir rotas/direções
- [ ] Fallback para erro de carregamento

### 10.6 Sistema de Envio
- [ ] Criar API route no Next.js
- [ ] Configurar envio de email (Nodemailer)
- [ ] Implementar template de email
- [ ] Adicionar confirmação de recebimento
- [ ] Enviar cópia para o usuário (opcional)
- [ ] Implementar rate limiting
- [ ] Adicionar logs de envio

### 10.7 Proteção Anti-Spam
- [ ] Implementar reCAPTCHA v3
- [ ] Adicionar honeypot field
- [ ] Implementar rate limiting por IP
- [ ] Validação server-side
- [ ] Blacklist de palavras spam
- [ ] Timeout entre envios
- [ ] Logs de tentativas suspeitas

### 10.8 Feedback ao Usuário
- [ ] Loading state durante envio
- [ ] Mensagem de sucesso clara
- [ ] Tratamento de erros amigável
- [ ] Opção de tentar novamente
- [ ] Limpar formulário após sucesso
- [ ] Toast notification (opcional)
- [ ] Redirecionamento pós-envio (opcional)

### 10.9 CTAs Alternativos
- [ ] Botão WhatsApp flutuante
- [ ] Link para email direto
- [ ] Números de telefone clicáveis (mobile)
- [ ] Botão "Ligar Agora" (mobile)
- [ ] Links para redes sociais
- [ ] FAQ - "Perguntas Frequentes"
- [ ] Horário de atendimento destacado

### 10.10 Responsividade e UX
- [ ] Campos touch-friendly no mobile
- [ ] Teclado numérico para telefone
- [ ] Auto-capitalize para nome
- [ ] Scroll suave para erros
- [ ] Focus management adequado
- [ ] Feedback tátil (vibração mobile)
- [ ] Modo escuro compatível

## Critérios de Conclusão
- Formulário enviando emails corretamente
- Validações funcionando perfeitamente
- Anti-spam implementado e testado
- Mapa carregando com lazy loading
- Mobile experience otimizada
- Feedback claro em todas as ações