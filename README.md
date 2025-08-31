# Hiperliga Website

Website oficial da Hiperliga - Argamassa Polimérica Inovadora da Gran Finelle.

## 🚀 Stack Tecnológica

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Icons**: Heroicons + Lucide React
- **SEO**: Next-SEO
- **Theme**: next-themes (dark/light mode)
- **Image Optimization**: Next.js Image + Sharp

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone [url-do-repositorio]

# Entrar no diretório
cd hiperliga

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.local.example .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Linting
npm run lint

# Formatação de código
npm run format

# Verificação de tipos
npm run type-check
```

## 📁 Estrutura do Projeto

```
src/
├── app/                 # App Router (Next.js 15)
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página inicial
│   └── globals.css     # Estilos globais
├── components/         # Componentes React
│   ├── ui/            # Componentes de UI base
│   ├── layout/        # Componentes de layout
│   └── forms/         # Componentes de formulários
├── lib/               # Utilitários e configurações
│   ├── utils.ts       # Funções utilitárias
│   └── constants.ts   # Constantes da aplicação
├── types/             # Definições TypeScript
│   └── index.ts       # Tipos principais
└── styles/            # Estilos adicionais
    └── globals.css    # Estilos globais Tailwind

public/
├── images/            # Imagens estáticas
│   ├── logos/        # Logos da marca
│   ├── products/     # Imagens de produtos
│   └── hero/         # Imagens do hero
├── videos/           # Vídeos demonstrativos
├── docs/             # PDFs e documentos
└── icons/            # Ícones PWA
```

## 🎨 Design System

### Cores Principais

- **Brand Primary**: `#1a365d` (Azul escuro profissional)
- **Brand Secondary**: `#2c5282` (Azul médio)
- **Brand Accent**: `#3182ce` (Azul destaque)
- **Success**: `#38a169` (Verde sustentabilidade)

### Tipografia

- **Sans**: Inter (texto geral)
- **Heading**: Roboto (títulos e cabeçalhos)

### Componentes Base

- Buttons com variantes (primary, secondary, ghost)
- Cards com hover effects
- Inputs com validação
- Theme toggle (dark/light)

## 📋 Funcionalidades

### ✅ Implementadas

- [x] Setup inicial do projeto
- [x] Configuração Tailwind CSS
- [x] Tema dark/light
- [x] Componentes base (Button, ThemeToggle)
- [x] Layout responsivo
- [x] TypeScript configurado
- [x] SEO otimizado

### 🔄 Em Desenvolvimento

- [ ] Páginas principais (Home, Produtos, Contato)
- [ ] Componentes de formulário
- [ ] Sistema de navegação
- [ ] Animações e microinterações
- [ ] Galeria de vídeos
- [ ] FAQ interativo

### 📝 Planejadas

- [ ] Sistema de CMS (opcional)
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] Testes automatizados

## 🚀 Deploy

O projeto está configurado para deploy automático na Vercel:

1. Conectar repositório na Vercel
2. Configurar variáveis de ambiente
3. Deploy automático a cada push

### Variáveis de Ambiente

Ver arquivo `.env.local.example` para todas as variáveis necessárias.

## 📞 Contato & Suporte

Para dúvidas sobre o desenvolvimento:

- Email: [dev-email]
- Documentação: [link-docs]

## 📄 Licença

Este projeto é propriedade da Gran Finelle. Todos os direitos reservados.