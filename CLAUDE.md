# CLAUDE.md

> **IMPORTANT:** First read `CONVENTIONS.md` in the project root — it contains all shared project conventions (architecture, code style, patterns, commands).

## MCP Servers

Configured in `.mcp.json`:

- `shadcn` — shadcn/ui CLI integration (component search, docs, add)
- `context7` — real-time library documentation (React 19, TanStack Query, React Router, Zod, etc.). Append "use context7" to prompts for up-to-date docs
- `figma` — Figma design-to-code workflow (get_design_context, screenshots, metadata)

## Claude Code Skills

Skills are stored in location (`.claude/skills/`):

```
.claude/skills/           # Source skill definitions
```

Available skills:

- `shadcn` — manage shadcn/ui components
- `vercel-react-best-practices` — React/Next.js performance patterns
- `vercel-composition-patterns` — React composition patterns
- `feature-sliced-design` — FSD architecture methodology guidance
- `tanstack-query-best-practices` — TanStack Query data fetching and caching patterns
- `react-hook-form-zod` — React Hook Form + Zod validation patterns
- `figma-design-system` — Figma design token mapping and component translation rules

## Claude Code Agents

Custom agents in `.claude/agents/` for the Figma-to-Production pipeline:

| Agent | Purpose |
|---|---|
| `figma-pipeline` | **Orchestrator** — full pipeline from Figma URL to production code (user-invocable) |
| `figma-analyzer` | Reads Figma design → structured implementation plan |
| `api-designer` | Asks API questions → types, methods, query keys, mutations |
| `fsd-scaffolder` | Creates FSD module structure with all files |
| `component-builder` | Implements UI with shadcn/ui, tokens, i18n, dark mode |
| `form-builder` | Builds forms: Zod schemas + React Hook Form + Field pattern |
| `query-builder` | TanStack Query: queryOptions, mutations, cache invalidation |
| `feature-reviewer` | Reviews all code against conventions, runs lint/typecheck |

### Usage

Type `@` in the Claude Code prompt, then select the agent marked with `*` from autocomplete:

```
@figma-pipeline https://figma.com/design/abc123/MyApp?node-id=10:200
@figma-analyzer — just analyze a design
@api-designer — just design the API layer
@fsd-scaffolder — just create module structure
@feature-reviewer — just review existing code
```

Or run an agent as the main session:

```bash
claude --agent=figma-pipeline
```
