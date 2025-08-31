# Repository Guidelines

## Project Structure & Modules
- Source in `src/`; routing via Next.js App Router under `src/app/` (`page.tsx`, `layout.tsx`, nested routes). Example: `src/app/produtos/hiperliga/page.tsx`.
- Reusable UI in `src/components/` (e.g., `ui/`, `layout/`, `forms/`). Import with aliases like `@/components/...`.
- Utilities in `src/lib/`; types in `src/types/`; styles in `src/styles/`; static assets in `public/`.
- Path aliases configured in `tsconfig.json` (e.g., `@/*`, `@/lib/*`).

## Build, Test, and Development
- `npm run dev`: Start local dev server with hot reload.
- `npm run build`: Production build (Next.js 15 + TypeScript).
- `npm run start`: Run the built app.
- `npm run lint`: ESLint check using Next + Prettier config.
- `npm run format`: Prettier write across the repo.
- `npm run type-check`: Strict TypeScript check (no emit).
- Environment: copy `.env.local.example` to `.env.local`. Use `NEXT_PUBLIC_` only for safe, public vars.

## Coding Style & Conventions
- Formatting: Prettier (2‑space indent, single quotes, no semicolons, width 100).
- Linting: ESLint extends `next/core-web-vitals`, `next/typescript`, `prettier`.
- TypeScript: `strict` enabled; prefer `const`; consistent type imports enforced.
- Naming: React components PascalCase (`Button.tsx`), hooks `useXyz`, functions/vars camelCase, route folders lowercase; avoid default exports for shared components.
- Files: co-locate minimal logic; keep server-only code out of `NEXT_PUBLIC` imports.

## Testing Guidelines
- No test framework is configured yet. If adding tests, prefer Vitest or Jest + React Testing Library.
- Place tests near source or under `src/__tests__/`; name as `*.test.ts(x)`.
- Aim for key view and util coverage (forms, navigation, lib utilities). Add `npm run test` when tooling is introduced.

## Commit & Pull Requests
- Commits: follow Conventional Commits (e.g., `feat: add hero section`, `fix: correct SEO meta`).
- PRs: clear description, linked issue, screenshots for UI, and checklist: `lint`, `type-check`, `format`, build passes.
- Scope PRs narrowly; update docs when adding envs or scripts.

## Security & Configuration
- Never commit secrets; keep them in `.env.local`.
- Public assets go in `public/`; optimize images via Next/Image.
- Use path aliases (`@/...`) instead of long relative imports.
