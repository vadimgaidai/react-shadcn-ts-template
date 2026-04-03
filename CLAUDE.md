# CLAUDE.md

> **IMPORTANT:** First read `CONVENTIONS.md` in the project root — it contains all shared project conventions (architecture, code style, patterns, commands).

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

Standalone agents in `.claude/agents/` — each handles one specific task:

| Agent | Skills | Purpose |
|---|---|---|
| `api-designer` | tanstack-query | Asks questions one-by-one → designs types, API methods, query keys, mutations |
| `fsd-scaffolder` | feature-sliced-design | Creates FSD module structure with all files |
| `component-builder` | shadcn, react-best-practices, composition-patterns | Implements UI with shadcn/ui, tokens, i18n, dark mode |
| `form-builder` | react-hook-form-zod, shadcn, react-best-practices | Builds forms: Zod schemas + React Hook Form + Field pattern |
| `query-builder` | tanstack-query | TanStack Query: queryOptions, mutations, cache invalidation |
| `feature-reviewer` | shadcn, fsd, tanstack-query, react-best-practices, composition-patterns, react-hook-form-zod | Reviews all code against conventions, runs lint/typecheck |

### Usage

Type `@` in the Claude Code prompt, then select the agent marked with `*` from autocomplete:

```
@api-designer — design the API layer
@fsd-scaffolder — create module structure
@component-builder — build a component
@form-builder — create a form with validation
@query-builder — set up TanStack Query
@feature-reviewer — review existing code
```

Or run an agent as the main session:

```bash
claude --agent=api-designer
```
