# CLAUDE.md

> **IMPORTANT:** First read `CONVENTIONS.md` in the project root — it contains all shared project conventions (architecture, code style, patterns, commands). For concrete reference code per convention, see `EXAMPLES.md`.
>
> **Token discipline:** do NOT run `pnpm build`, `pnpm lint`, or `pnpm stylelint` as verification — they are wired into Husky's pre-commit hook and CI. Use `pnpm typecheck` if explicit type validation is needed.

## MCP Servers

Configured in `.mcp.json`:

- `shadcn` — shadcn/ui CLI integration (component search, docs, add)
- `context7` — real-time library documentation (React 19, TanStack Query, React Router, Zod, etc.). Append "use context7" to prompts for up-to-date docs
- `figma` — Figma design-to-code workflow (get_design_context, screenshots, metadata)

## Claude Code Skills

Skills in `.claude/skills/` — auto-loaded by agents via the `skills` frontmatter field:

- `shadcn` — shadcn/ui component usage rules
- `vercel-react-best-practices` — React performance patterns
- `vercel-composition-patterns` — React composition patterns
- `feature-sliced-design` — FSD architecture methodology
- `tanstack-query-best-practices` — TanStack Query data fetching and caching
- `react-hook-form-zod` — React Hook Form + Zod validation patterns

## Claude Code Agents

Standalone agents in `.claude/agents/` — each step is intentionally narrow and reads a shared spec file produced by `feature-analyzer`.

### Pipeline

```
feature-analyzer → fsd-scaffolder → api-designer → query-builder → form-builder? → component-builder? → feature-reviewer
```

Every agent after `feature-analyzer` reads `.planning/[feature]/SPEC.md` as its single source of truth.

### Agents

| Agent | Skills | Purpose |
|---|---|---|
| `feature-analyzer` | feature-sliced-design | Q&A about a new feature → writes `.planning/[feature]/SPEC.md`. No code. |
| `fsd-scaffolder` | feature-sliced-design | Reads SPEC → creates folders + empty files + barrel. No logic. |
| `api-designer` | tanstack-query | Fills `model/types.ts`, `model/constants.ts`, `api/[name].api.ts`. |
| `query-builder` | tanstack-query | Adds `[name].queries.ts` (entities) / `[name].mutations.ts` (features). |
| `form-builder` | react-hook-form-zod, shadcn, react-best-practices | Schema in `model/schemas.ts` + form component in `ui/[name]-form.tsx`. |
| `component-builder` | shadcn, react-best-practices, composition-patterns | Non-form UI: compound components, shadcn wrappers, i18n, dark mode. |
| `feature-reviewer` | shadcn, fsd, tanstack-query, react-best-practices, composition-patterns, react-hook-form-zod | Reviews against CLAUDE/AGENTS/CONVENTIONS/EXAMPLES + runs only `pnpm typecheck`. |

### Usage

Type `@` in the Claude Code prompt, then select the agent from autocomplete:

```
@feature-analyzer  — start: ask questions, write SPEC
@fsd-scaffolder    — create module structure
@api-designer      — design the API layer
@query-builder     — set up TanStack Query
@form-builder      — create a form with validation
@component-builder — build a UI component
@feature-reviewer  — review the feature before merge
```

Or run an agent as the main session:

```bash
claude --agent=feature-analyzer
```
