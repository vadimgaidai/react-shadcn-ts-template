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
