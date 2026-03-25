# AGENTS.md

> **IMPORTANT:** First read `CONVENTIONS.md` in the project root — it contains all shared project conventions (architecture, code style, patterns, commands).

## Agent-Specific Rules

- Always read `CONVENTIONS.md` before making any code changes
- Follow FSD layer dependency rule strictly — never import upward
- Use `@/` alias for all cross-layer imports
- All file and folder names must be `kebab-case`
- Every new module must have `index.ts` barrel export
- No semicolons, double quotes, trailing commas (Prettier config)
- Run `pnpm typecheck` after structural changes to verify types
- Run `pnpm lint` after code changes to verify linting

## Agents Skills

Skills are stored in location (`.agents/skills/`):

```
.agents/skills/           # Source skill definitions
```

Available skills:

- `shadcn` — manage shadcn/ui components
- `vercel-react-best-practices` — React/Next.js performance patterns
- `vercel-composition-patterns` — React composition patterns
- `feature-sliced-design` — FSD architecture methodology guidance
- `tanstack-query-best-practices` — TanStack Query data fetching and caching patterns
