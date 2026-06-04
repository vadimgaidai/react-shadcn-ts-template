# AGENTS.md

> **IMPORTANT:** First read `CONVENTIONS.md` in the project root — it contains all shared project conventions. For concrete reference code per convention (entity, feature, queries, mutations, schemas, compound components, extending shadcn components, etc.) see `EXAMPLES.md`.

## Agent-Specific Rules

- Always read `CONVENTIONS.md` before making any code changes; consult `EXAMPLES.md` when you need a working pattern
- Follow FSD layer dependency rule strictly — never import upward
- Use `@/` alias for all cross-layer imports
- All file and folder names must be `kebab-case`
- Every new module must have `index.ts` barrel export
- No semicolons, double quotes, trailing commas (Prettier config)
- Run `pnpm typecheck` after structural changes to verify types
- **Do NOT run `pnpm build`, `pnpm lint`, or `pnpm stylelint`** — they are wired into Husky's pre-commit hook and CI; running them locally only burns tokens

## MCP Servers

Configured in `.mcp.json`:

- `shadcn` — shadcn/ui CLI integration (component search, docs, add)
- `context7` — real-time library documentation. Append "use context7" to prompts for up-to-date docs
- `figma` — Figma design-to-code workflow (design context, screenshots, metadata)

## Skills

Skills in `.claude/skills/` are auto-loaded by agents via the `skills` frontmatter field — agents do NOT need to read skill files manually.

- `shadcn` — shadcn/ui component usage rules
- `vercel-react-best-practices` — React performance patterns
- `vercel-composition-patterns` — React composition patterns
- `feature-sliced-design` — FSD architecture methodology
- `tanstack-query-best-practices` — TanStack Query data fetching and caching
- `react-hook-form-zod` — React Hook Form + Zod validation patterns

## Custom Agents

Standalone agents in `.claude/agents/`. The pipeline is sequential; each step is small and reads a shared spec file.

### Pipeline

```
feature-analyzer → fsd-scaffolder → api-designer → query-builder → form-builder? → component-builder? → feature-reviewer
```

`feature-analyzer` writes `.planning/[feature]/SPEC.md`. Every later agent reads that file as the single source of truth — no agent depends on conversation history with the user beyond minor follow-ups.

### Agents

| Agent | Skills loaded | What it does |
|---|---|---|
| `feature-analyzer` | feature-sliced-design | Asks targeted questions one-at-a-time → writes `.planning/[feature]/SPEC.md`. No code. |
| `fsd-scaffolder` | feature-sliced-design | Reads SPEC → scaffolds folders + empty files + barrel. No logic. |
| `api-designer` | tanstack-query | Fills `model/types.ts`, `model/constants.ts`, `api/[name].api.ts`. |
| `query-builder` | tanstack-query | Adds `[name].queries.ts` (entities) or `[name].mutations.ts` (features). |
| `form-builder` | react-hook-form-zod, shadcn, react-best-practices | Schema in `model/schemas.ts` + form component in `ui/[name]-form.tsx`. |
| `component-builder` | shadcn, react-best-practices, composition-patterns | Non-form UI; compound + shadcn-wrapper patterns; i18n; dark mode. |
| `feature-reviewer` | shadcn, fsd, tanstack-query, react-best-practices, composition-patterns, react-hook-form-zod | Reviews against CLAUDE/AGENTS/CONVENTIONS/EXAMPLES; runs only `pnpm typecheck`. |

### Agent design principles

- **Lean prompts** — each agent is ~50–100 lines. Canonical code lives in `EXAMPLES.md`; agents reference it instead of duplicating snippets.
- **Lazy loading** — agents read project files only after they know what they need (mostly the SPEC + one matching reference module via `Glob()`).
- **Skills via frontmatter** — skills auto-inject without manual reads.
- **SPEC as contract** — given the same SPEC.md, every agent should produce the same code.
- **Token discipline** — never run `pnpm build`, `pnpm lint`, or `pnpm stylelint`. Husky + CI already do this. Only `pnpm typecheck` is allowed.
- **One question per turn** — `feature-analyzer` uses `AskUserQuestion` and never asks multiple questions at once.
