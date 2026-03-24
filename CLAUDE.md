# CLAUDE.md

## Project Overview

React TypeScript template with Feature-Sliced Design (FSD) architecture. Uses Vite, React 19, TanStack Query, shadcn/ui, Tailwind CSS v4, i18next.

## Commands

- `pnpm dev` — dev server
- `pnpm build` — typecheck + production build
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm stylelint` / `pnpm stylelint:fix` — CSS/SCSS lint
- `pnpm format` — Prettier
- `pnpm typecheck` — `tsc --noEmit`

## Architecture (Feature-Sliced Design)

### Layer Dependency Rule

```
app → pages → widgets → features → entities → shared
```

Higher layers import from lower layers only. Never import upward.

### Layer Structure

```
src/
├── app/              # Providers, routes, entry point
├── pages/            # Route-level components
├── widgets/          # Complex reusable UI blocks (layouts, sidebars)
├── features/         # User interaction scenarios (auth, forms)
├── entities/         # Business domain models (user, product)
└── shared/           # Reusable infrastructure
    ├── assets/       # global.css, static files
    ├── components/   # App-level shared components (page-loader)
    ├── config/       # env, i18n, routes
    ├── hooks/        # Shared hooks (use-mobile)
    ├── lib/          # Utilities, http client, react-query, storage
    ├── types/        # Global types (api.types)
    └── ui/           # shadcn/ui components (55+ components)
```

### Module Structure Patterns

**Feature** (`src/features/[name]/`):
```
api/          # API calls (.api.ts) and mutations (.mutations.ts)
hooks/        # Feature hooks (use-*.ts)
model/        # Types and business logic
ui/           # Feature UI components (optional)
index.ts      # Public API (barrel export)
```

**Entity** (`src/entities/[name]/`):
```
api/          # Entity API (.api.ts) and queries (.queries.ts)
model/        # Types, constants, validation schemas
index.ts      # Public API
```

**Widget** (`src/widgets/[name]/`):
```
components/   # or ui/ — sub-components
config/       # Configuration
model/        # Types
index.ts      # Public API (if needed)
```

**Page** (`src/pages/[name]/`):
```
[name]-page.tsx   # Page component
```

## Path Aliases

| Alias | Path     |
|-------|----------|
| `@/*` | `src/*`  |
| `~/*` | `public/*` |

Configured in `tsconfig.paths.json` and `vite.config.ts`.

## Code Conventions

### Naming

- Files and folders: `kebab-case`
- Components: `PascalCase`
- Hooks: `use-` prefix in filename, `use` prefix in function name
- API files: `[name].api.ts`, `[name].queries.ts`, `[name].mutations.ts`
- Types files: `types.ts`
- Constants: `constants.ts`

### Formatting (Prettier)

- No semicolons
- Double quotes
- Trailing commas: `es5`
- Line width: 100
- Tailwind class sorting enabled

### Imports

- Always use `@/` alias for imports between layers
- Relative imports only within the same module
- Import from barrel `index.ts` when importing from another module

### Barrel Exports

Every module must have `index.ts` that re-exports its public API. External code imports only through barrel files.

## File Separation Rules

### API files (`api/`)

Contain only HTTP calls and query/mutation definitions. Types and constants must **not** live in `api/`.

- `[name].api.ts` — object with API methods (`httpClient.get(...).json<Type>()`)
- `[name].queries.ts` — `queryOptions` + query key factory (for entities)
- `[name].mutations.ts` — `useMutation` hooks (for features)

### Model files (`model/`)

Contain types, interfaces, enums, constants, zod schemas. Everything that describes the domain.

- `types.ts` — interfaces, types, enums
- `constants.ts` — entity name, query key segments, other constants
- `schemas.ts` — zod validation schemas (when needed)

### Reference: Entity structure (user)

```
src/entities/user/
├── api/
│   ├── user.api.ts         # { getMe: () => httpClient.get("users/me").json<User>() }
│   └── user.queries.ts     # userKeys (createQueryKeyFactory) + userQueries (queryOptions)
├── model/
│   ├── types.ts            # User, UserProfile, UserRole
│   └── constants.ts        # USER_ENTITY, USER_QUERY_KEYS
└── index.ts                # Re-exports: userApi, userQueries, userKeys, User, UserProfile, UserRole
```

### Reference: Feature structure (auth)

```
src/features/auth/
├── api/
│   ├── auth.api.ts         # { login, register, refresh, logout } — direct ky calls
│   └── auth.mutations.ts   # useLoginMutation, useRegisterMutation, useLogoutMutation
├── hooks/
│   ├── use-auth.ts         # useAuth — main auth hook
│   └── use-require-auth.ts # useRequireAuth — redirect if not authenticated
├── model/
│   └── types.ts            # LoginCredentials, RegisterCredentials, AuthTokens
└── index.ts                # Re-exports public API
```

### Import Rules Within a Module

- `api/` imports types from `../model/types` (relative, within module)
- `api/` imports constants from own entity via `@/entities/[name]/model/constants`
- `api/` imports shared utils via `@/shared/lib`
- External code imports only from `index.ts` barrel

## Key Patterns

### HTTP Client

Built on `ky` (`src/shared/lib/http/client.ts`):
- Base URL from `VITE_API_URL` env
- Auto-attaches Bearer token from `tokenStorage`
- 30s timeout, no retry

### TanStack Query

Config in `src/shared/lib/react-query/client.ts`:
- staleTime: 5 min, gcTime: 30 min
- No refetch on window focus
- No retry on 4xx errors
- Global error handlers for 401 → auto token refresh

### Query Key Factory

Use `createQueryKeyFactory` from `@/shared/lib/react-query` for type-safe query keys. Keys are defined in `[entity].queries.ts`, constants for key segments live in `model/constants.ts`.

Pattern (see `src/entities/user/` as reference):

```typescript
// model/constants.ts
export const USER_ENTITY = "user" as const

export const USER_QUERY_KEYS = {
  ME: "me",
} as const

// api/user.queries.ts
import { createQueryKeyFactory } from "@/shared/lib/react-query"
import { USER_ENTITY, USER_QUERY_KEYS } from "@/entities/user/model/constants"

export const userKeys = createQueryKeyFactory(USER_ENTITY, (all) => ({
  me: () => [...all(), USER_QUERY_KEYS.ME] as const,
}))

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: userKeys.me(),
      queryFn: userApi.getMe,
    }),
}
```

### Authentication

- Token storage: `localStorage` via `src/shared/lib/storage/token-storage.ts`
- Auto refresh on 401 via React Query global error handlers (`src/shared/lib/react-query/error-handlers.ts`)
- Race condition protection: multiple 401s share single refresh promise
- Auth feature: `src/features/auth/` (login, register, logout mutations + useAuth, useRequireAuth hooks)
- Protected routes: `src/app/routes/protected-route.tsx`
- Auth API uses direct `ky` (not `httpClient`) because login/register don't need auth headers

### Routing

- React Router v7 (`react-router`)
- Route paths defined in `src/shared/config/routes/paths.ts`
- Lazy loading pages with `React.lazy`

### i18n (Translations)

- `react-i18next` configured in `src/shared/config/i18n/index.ts`
- Locale files: `src/shared/config/i18n/locales/[lang]/translation.json`
- Currently only English (`en`)
- Translations organized by namespace sections: `common`, `navigation`, `errorBoundary`, `home`, etc.
- Use `useTranslation()` hook in components, keys like `t("common.save")`, `t("home.welcome.title")`
- When adding new pages/features — add corresponding translation keys to `translation.json`
- When adding a new language — create `src/shared/config/i18n/locales/[lang]/translation.json` and register in `src/shared/config/i18n/index.ts`

### Theming

- `next-themes` for dark/light mode
- CSS variables via Tailwind CSS v4
- shadcn/ui style: `new-york`, base color: `neutral`

## shadcn/ui

Config: `components.json`. Components installed to `src/shared/ui/`. Hooks to `src/shared/hooks/`. Utils to `src/shared/lib/`.

## Git Hooks (Husky)

- **pre-commit**: `pnpm lint:staged` + `pnpm stylelint`
- **commit-msg**: commitlint (conventional commits)
- **lint-staged**: ESLint fix on `*.{ts,tsx}`, Prettier on `*.{json,js,ts,jsx,tsx,html}`

## Commit Convention

Follow [Conventional Commits](https://conventionalcommits.org/):
```
feat: add user profile page
fix: resolve token refresh race condition
refactor: simplify auth logic
chore: update dependencies
docs: update README
```

## Environment Variables

Validated via Zod in `src/shared/config/env/schema.ts`:
```
MODE=development
VITE_APP_NAME=React App
VITE_API_URL=https://api.example.com
VITE_ENABLE_DEVTOOLS=false
```

## Claude Code Skills

Skills are stored in two locations (`.claude/skills/` symlinks to `.agents/skills/`):

```
.agents/skills/           # Source skill definitions
.claude/skills/           # Symlinks used by Claude Code
```

Available skills:
- `shadcn` — manage shadcn/ui components
- `deploy-to-vercel` / `vercel-cli-with-tokens` — deploy to Vercel
- `vercel-react-best-practices` — React/Next.js performance patterns
- `vercel-composition-patterns` — React composition patterns
- `web-design-guidelines` — UI/UX review

## Build

- Vite 8 with React compiler (babel-plugin-react-compiler)
- Manual chunks for bundle splitting (React, Radix UI, form libs, icons)
- `rollup-plugin-visualizer` → `stats.html` after build
