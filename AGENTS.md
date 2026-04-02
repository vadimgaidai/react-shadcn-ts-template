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

## MCP Servers

Configured in `.mcp.json`:

- `shadcn` — shadcn/ui CLI integration (component search, docs, add)
- `context7` — real-time library documentation. Append "use context7" to prompts for up-to-date docs
- `figma` — Figma design-to-code workflow (design context, screenshots, metadata)

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
- `react-hook-form-zod` — React Hook Form + Zod validation patterns
- `figma-design-system` — Figma design token mapping and component translation rules
