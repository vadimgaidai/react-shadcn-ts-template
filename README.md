# React TypeScript FSD Template

Production-ready React template with [Feature-Sliced Design](https://feature-sliced.design/) architecture.

## Stack

- React 19 + TypeScript (strict mode, React Compiler)
- Vite 8
- Tailwind CSS v4 + shadcn/ui (new-york)
- TanStack Query v5
- React Router v7
- react-i18next
- ky (HTTP client)
- zod (validation)
- react-hook-form

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Requires Node.js >= 20, pnpm >= 10.

## Scripts

| Script           | Description              |
|------------------|--------------------------|
| `pnpm dev`       | Start dev server         |
| `pnpm build`     | Typecheck + build        |
| `pnpm preview`   | Preview production build |
| `pnpm lint`      | ESLint                   |
| `pnpm lint:fix`  | ESLint with auto-fix     |
| `pnpm stylelint` | CSS/SCSS lint            |
| `pnpm format`    | Prettier format          |
| `pnpm typecheck` | TypeScript check         |

## Project Structure

```
src/
├── app/          # Providers, routes, entry point
├── pages/        # Route components
├── widgets/      # Complex UI blocks (layouts)
├── features/     # User interactions (auth)
├── entities/     # Business models (user)
└── shared/       # UI components, utils, config, hooks, lib
```

**Layer dependencies:** `app → pages → widgets → features → entities → shared`

## Import Aliases

| Alias  | Path       |
|--------|------------|
| `@/*`  | `src/*`    |
| `~/*`  | `public/*` |

## Environment Variables

```env
MODE=development
VITE_APP_NAME=React App
VITE_API_URL=https://api.example.com
VITE_ENABLE_DEVTOOLS=false
```
