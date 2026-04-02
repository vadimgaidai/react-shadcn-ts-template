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

## Custom Agents (Figma-to-Production Pipeline)

Agents in `.claude/agents/` — specialized for the full design-to-code workflow:

### Pipeline orchestrator

- **`figma-pipeline`** — orchestrates the full Figma → Production flow (user-invocable via `/figma-pipeline`)

### Stage agents

| Stage | Agent | Input | Output |
|---|---|---|---|
| 1. ANALYZE | `figma-analyzer` | Figma URL | Implementation plan (components, tokens, FSD layers) |
| 2. CLARIFY | `api-designer` | Endpoint list | Types, API methods, query keys, mutations design |
| 3. SCAFFOLD | `fsd-scaffolder` | Module specs | FSD directory structure with all files |
| 4. IMPLEMENT | `component-builder` | Component specs | UI components (shadcn, i18n, dark mode) |
| 4b. FORMS | `form-builder` | Form specs | Zod schemas + RHF forms + Field pattern |
| 5. INTEGRATE | `query-builder` | API design | TanStack Query layer (queries, mutations, cache) |
| 6. REVIEW | `feature-reviewer` | All files | Convention compliance report + auto-fixes |

### Pipeline flow

```
Figma URL → ANALYZE → [user confirms] → CLARIFY API → [user answers]
  → SCAFFOLD → IMPLEMENT (+ FORMS parallel) → INTEGRATE → REVIEW
```

### User checkpoints

The pipeline pauses for user confirmation at 3 points:
1. After ANALYZE — review the implementation plan
2. After CLARIFY — review the API design
3. After REVIEW — review found issues before auto-fix
