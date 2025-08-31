# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Official website for Hiperliga - Innovative Polymeric Mortar by Gran Finelle. Built with modern web technologies focusing on performance, accessibility, and user experience.

## Technology Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS 3 with custom Hiperliga/Gran Finelle theme
- **Animations**: Framer Motion
- **Forms**: React Hook Form  
- **Icons**: Heroicons + Lucide React
- **SEO**: Next-SEO optimizations
- **Theme**: next-themes (dark/light mode support)
- **Image Optimization**: Next.js Image + Sharp

## Development Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier  
npm run type-check   # TypeScript type checking
```

## Architecture

### Directory Structure
```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout with theme provider
│   └── page.tsx        # Homepage
├── components/         
│   ├── ui/            # Reusable UI components
│   ├── layout/        # Layout components (planned)
│   └── forms/         # Form components (planned)
├── lib/               
│   ├── utils.ts       # Utility functions (cn, formatters)
│   └── constants.ts   # App constants and config
├── types/             # TypeScript definitions
└── styles/           # Global styles and Tailwind config

public/
├── images/           # Static images (logos, products, hero)
├── videos/          # Demo videos
├── docs/            # PDFs and documents
└── icons/           # PWA icons
```

### Design System

**Brand Colors:**
- Primary: `#1a365d` (Professional dark blue)
- Secondary: `#2c5282` (Medium blue)
- Success: `#38a169` (Sustainability green)
- Hiperliga palette: Blue shades (50-900)
- Gran Finelle palette: Gray shades (50-900)

**Typography:**
- Body: Inter (--font-inter)
- Headings: Roboto (--font-roboto)

**Components:**
- Button: Multiple variants (primary, secondary, ghost)
- ThemeToggle: Dark/light mode switcher
- Card: Reusable card component with hover effects

**New Components Library (Task 02):**

*Layout Components:*
- Header: Full navigation with responsive design, dropdown menus, sticky behavior
- Footer: 4-column layout with company info, contact details, social media
- Container: Responsive max-width wrapper (sm/md/lg/xl/full)
- Section: Reusable sections with background variants and spacing
- Grid/Flex: Layout system with responsive breakpoints
- PageLayout: Complete page wrapper with header, footer, breadcrumbs
- SEO: Complete meta tags, Open Graph, structured data

*Navigation Components:*
- Navigation: Main nav with active states and dropdown support
- ActiveLink: Auto-highlighting navigation links  
- Breadcrumbs: Dynamic breadcrumb generation
- MobileMenu: Full-screen mobile navigation with overlay
- SkipNavigation: Accessibility skip-to-content links

*UI Components:*
- Card: Basic, Product, Feature cards with hover effects
- Typography: Complete H1-H6, P, Lead, Code, Blockquote system
- Badge: Status, notification, product badges with variants
- Link: AppLink, NavLink, ButtonLink, SocialLink components  
- Icon: Heroicons wrapper with status icons and spinner

*Feedback Components:*
- Spinner: Loading states with dots, overlay, button variants
- Toast: Notification system with context provider and helpers
- Modal: Accessible modals with confirmation dialog variant
- Accordion: FAQ accordion with search and categorization
- Tabs: Responsive tabs with underline, pills, default variants
- Skeleton: Loading placeholders for content

## Implementation Status

### ✅ Completed (Task 01-configurar-ambiente)
- [x] Next.js 15 project setup with TypeScript
- [x] Tailwind CSS with custom theme
- [x] Development tools (ESLint, Prettier)
- [x] Essential dependencies installation
- [x] Base file structure and TypeScript config
- [x] Assets structure and PWA setup
- [x] Base UI components (Button, ThemeToggle)
- [x] Theme support (dark/light mode)
- [x] SEO optimization setup
- [x] Accessibility foundations

### ✅ Completed (Task 02-componentes-base)
- [x] **Header Component** - Responsive navigation with logo, menu, theme toggle, sticky scroll
- [x] **Footer Component** - 4-column layout with company info, links, contact, social media
- [x] **Navigation System** - Routes, active links, breadcrumbs, mobile menu, accessibility
- [x] **Layout Components** - Container, Section, Grid/Flex, PageLayout, SEO
- [x] **UI Components** - Card, Typography, Badge, Link, Icon systems
- [x] **Feedback Components** - Spinner, Toast, Modal, Accordion, Tabs, Skeleton

### ✅ Completed (Task 03-implementar-paginas)
- [x] **Main Pages** - All 10 pages implemented (Home, Products, Contact, FAQ, Videos, About)
- [x] **Product Pages** - Hiperliga, Texturas, Grafiatos, Tintas with specifications
- [x] **Navigation** - Complete routing with App Router structure
- [x] **Responsive Design** - Mobile-first with animations and interactions

### ✅ Completed (Task 04-adicionar-conteudo)
- [x] **Real Content Integration** - All PRD content implemented
- [x] **Company Information** - Gran Finelle data (2008, Almirante Tamandaré-PR)
- [x] **Technical Specifications** - 1 bisnaga = 60kg, 21x less water, 35% savings
- [x] **Contact Data** - Real addresses, phones, business hours
- [x] **Brand Consistency** - Validated across all pages

### ✅ Completed (Task 05-otimizar-performance)
- [x] **Lazy Loading** - OptimizedImage, LazySection components
- [x] **Asset Optimization** - Font, image, cache strategies
- [x] **Service Worker** - Advanced caching with multiple strategies
- [x] **Performance Budgets** - Monitoring system with budgets per page type
- [x] **Core Web Vitals** - LCP, FID, CLS optimizers
- [x] **Build Optimization** - Webpack config, bundle splitting, minification

### 🎯 Next Steps - Production Deployment
1. **06-preparar-deploy** - Production configuration and deployment setup
2. **07-teste-final** - Complete testing and quality assurance
3. **08-go-live** - Launch preparation and monitoring setup

## Key Features

**Accessibility:**
- Skip to content links
- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader optimizations
- Color contrast compliance

**Performance:**
- Static generation where possible
- Image optimization with Next.js Image
- Code splitting and lazy loading ready
- Tailwind CSS purging for minimal bundle size

**SEO:**
- Complete meta tags configuration
- Open Graph and Twitter Cards
- Structured data ready
- Sitemap and robots.txt configured

**PWA Ready:**
- Manifest.json configured
- Icons structure prepared
- Service worker ready for implementation

## Content Structure (from PRD)

**Main Pages:**
- Home: Hero, benefits, products overview, CTA
- Products: Hiperliga, Texturas & Grafiatos, Tintas
- About: Company history, mission, values  
- FAQ: Collapsible Q&A sections
- Videos: Demo gallery with lazy loading
- Contact: Form + company information

**Key Messages:**
- 100% sustainable (0% water, sand, cement, lime)
- 3x faster application
- Up to 35% cost savings
- 3+ million m² built with Hiperliga

## Development Notes

- Uses App Router (Next.js 15) - avoid Pages Router patterns
- All components use TypeScript with proper typing
- Tailwind classes use custom brand colors and utilities
- Theme switching persists across sessions
- Mobile-first responsive design approach
- All images should use Next.js Image component for optimization

## Deployment

Configured for Vercel deployment:
- Automatic deployments on main branch
- Environment variables in `.env.local.example`
- Build optimization enabled
- Static generation where applicable