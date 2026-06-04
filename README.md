# React TypeScript FSD Template

Production-ready React template with [Feature-Sliced Design](https://feature-sliced.design/) and a seven-agent Claude Code pipeline that turns a one-line feature request into reviewed code.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Requires Node.js ≥ 20, pnpm ≥ 10.

## Agent Pipeline

`feature-analyzer → fsd-scaffolder → api-designer → query-builder → form-builder? → component-builder? → feature-reviewer`

`feature-analyzer` asks focused questions and writes `.planning/[feature]/SPEC.md`. Every later agent reads that file as the single source of truth, so you don't repeat yourself.

In the Claude Code prompt type `@` and pick the agent. Start with:

```
@feature-analyzer I want to add comments to articles
```

Each agent prints the next command on completion — copy-paste your way through.

### Agents

- **feature-analyzer** — Q&A → writes the SPEC. No code.
- **fsd-scaffolder** — folders, empty files, barrel `index.ts`.
- **api-designer** — fills `model/types.ts`, `model/constants.ts`, `api/[name].api.ts`.
- **query-builder** — adds `[name].queries.ts` (entities) or `[name].mutations.ts` (features).
- **form-builder** — Zod schema in `model/schemas.ts` + form component using `Field`/`FieldGroup`.
- **component-builder** — non-form UI: compound components, shadcn wrappers, i18n, dark mode.
- **feature-reviewer** — reviews against the four project docs, runs `pnpm typecheck`, offers mechanical auto-fix.

### Skills (auto-loaded per agent)

`shadcn`, `feature-sliced-design`, `tanstack-query-best-practices`, `react-hook-form-zod`, `vercel-react-best-practices`, `vercel-composition-patterns`.

### Real-time hooks

Run on every Claude `Edit`/`Write` from `.claude/hooks/`:
`fsd-validator.sh` (no upward FSD imports), `kebab-case-validator.sh`, `barrel-import-validator.sh`.

### Token discipline

Agents never run `pnpm build` / `pnpm lint` / `pnpm stylelint` — Husky and CI cover that. The only validation command an agent runs is `pnpm typecheck`.

### Docs the agents read

`CLAUDE.md`, `AGENTS.md`, `CONVENTIONS.md` (rules), `EXAMPLES.md` (canonical code samples).

## Stack

React 19 + TypeScript (strict, React Compiler) · Vite 8 · Tailwind v4 + shadcn/ui (`new-york`) · TanStack Query v5 · React Router v7 · react-i18next · ky · zod + react-hook-form.

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — typecheck + production build
- `pnpm typecheck` — `tsc --noEmit` (preferred verification)
- `pnpm format` — Prettier
- `pnpm preview` — preview production build

(`lint`, `lint:fix`, `stylelint` exist but run automatically via Husky.)

## Project Structure

```
src/
├── app/        # providers, routes, entry
├── pages/      # route-level components
├── widgets/    # complex UI blocks
├── features/   # user interaction scenarios
├── entities/   # business domain models
└── shared/     # ui, lib, config, hooks, types
```

Layer dependency: `app → pages → widgets → features → entities → shared`. Higher layers import lower, never upward.

Full rules in [`CONVENTIONS.md`](./CONVENTIONS.md); reference code in [`EXAMPLES.md`](./EXAMPLES.md).

## Aliases

`@/*` → `src/*` · `~/*` → `public/*`.

## Environment

```env
MODE=development
VITE_APP_NAME=React App
VITE_API_URL=https://api.example.com
VITE_ENABLE_DEVTOOLS=false
```
