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

## Skills

Skills in `.claude/skills/` are auto-loaded by agents via the `skills` frontmatter field — agents do NOT need to read skill files manually.

- `shadcn` — shadcn/ui component usage rules
- `vercel-react-best-practices` — React performance patterns
- `vercel-composition-patterns` — React composition patterns
- `feature-sliced-design` — FSD architecture methodology
- `tanstack-query-best-practices` — TanStack Query data fetching and caching
- `react-hook-form-zod` — React Hook Form + Zod validation patterns

## Custom Agents

Standalone agents in `.claude/agents/` — each handles one specific task independently:

| Agent | Skills loaded | What it does |
|---|---|---|
| `api-designer` | tanstack-query | Conversational Q&A → designs types, API methods, query keys, mutations |
| `fsd-scaffolder` | feature-sliced-design | Creates FSD module structure (entity, feature, widget, page) |
| `component-builder` | shadcn, react-best-practices, composition-patterns | Implements UI components with shadcn/ui, i18n, dark mode |
| `form-builder` | react-hook-form-zod, shadcn, react-best-practices | Builds Zod schemas + React Hook Form + FieldGroup/Field pattern |
| `query-builder` | tanstack-query | Creates queryOptions, mutation hooks, cache invalidation |
| `feature-reviewer` | shadcn, fsd, tanstack-query, react-best-practices, composition-patterns, react-hook-form-zod | Reviews code against all conventions, runs lint + typecheck |

### Agent design principles

- **Lazy loading** — agents don't read project files at startup. They first understand the task, then read `CONVENTIONS.md` and search for existing patterns before generating code
- **Skills via frontmatter** — agents declare `skills: ...` in their YAML frontmatter, which auto-injects skill content into the agent's context without manual file reads
- **Dynamic references** — agents search for existing code patterns with `Glob()` instead of hardcoding file paths, so they work even when example modules are deleted
- **One question at a time** — conversational agents (api-designer) ask questions sequentially, not all at once
