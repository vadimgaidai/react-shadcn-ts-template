# React TypeScript FSD Template

Production-ready React template with [Feature-Sliced Design](https://feature-sliced.design/) architecture.

## Stack

- React 19 + TypeScript (strict mode, React Compiler)
- Vite 8
- Tailwind CSS v4 + shadcn/ui (new-york)
- TanStack Query v5
- React Router v7
- react-i18next
- ky (HTTP client)
- zod (validation)
- react-hook-form

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Requires Node.js >= 20, pnpm >= 10.

## Scripts

| Script           | Description              |
|------------------|--------------------------|
| `pnpm dev`       | Start dev server         |
| `pnpm build`     | Typecheck + build        |
| `pnpm preview`   | Preview production build |
| `pnpm lint`      | ESLint                   |
| `pnpm lint:fix`  | ESLint with auto-fix     |
| `pnpm stylelint` | CSS/SCSS lint            |
| `pnpm format`    | Prettier format          |
| `pnpm typecheck` | TypeScript check         |

## Project Structure

```
src/
├── app/          # Providers, routes, entry point
├── pages/        # Route components
├── widgets/      # Complex UI blocks (layouts)
├── features/     # User interactions (auth)
├── entities/     # Business models (user)
└── shared/       # UI components, utils, config, hooks, lib
```

**Layer dependencies:** `app → pages → widgets → features → entities → shared`

## Import Aliases

| Alias  | Path       |
|--------|------------|
| `@/*`  | `src/*`    |
| `~/*`  | `public/*` |

## Environment Variables

```env
MODE=development
VITE_APP_NAME=React App
VITE_API_URL=https://api.example.com
VITE_ENABLE_DEVTOOLS=false
```

## AI-Assisted Development

This project is fully configured for AI-assisted development with Claude Code. It includes skills (knowledge bases), custom agents (automated workflows), MCP servers (external tool integrations), and pre-commit hooks that enforce project conventions automatically.

### MCP Servers

Configured in `.mcp.json`:

| Server | Purpose |
|--------|---------|
| `shadcn` | shadcn/ui CLI integration — search components, view docs, add components |
| `context7` | Real-time library documentation — React 19, TanStack Query, React Router, Zod, etc. |
| `figma` | Figma design-to-code — fetch design context, screenshots, metadata |

### Skills

Skills are knowledge bases that teach Claude Code the project's patterns, conventions, and best practices. Located in `.claude/skills/`.

| Skill | What it teaches |
|-------|-----------------|
| `shadcn` | shadcn/ui component usage rules — forms, composition, styling, icons, base vs radix API |
| `vercel-react-best-practices` | React performance patterns — waterfalls, bundle size, re-renders, caching |
| `vercel-composition-patterns` | Component architecture — compound components, context, explicit variants |
| `feature-sliced-design` | FSD methodology — layers, slices, segments, import rules |
| `tanstack-query-best-practices` | Data fetching — query keys, caching, mutations, optimistic updates, prefetching |
| `react-hook-form-zod` | Form validation — Zod schemas, React Hook Form integration, field arrays, multi-step |
Skills are activated automatically when relevant tasks are detected, and agents load them via the `skills` field in their frontmatter. For example, `form-builder` auto-loads `react-hook-form-zod` and `shadcn`.

### Custom Agents

Agents are standalone tools that each handle one specific task. Located in `.claude/agents/`. Each agent auto-loads relevant skills via the `skills` field — no manual file reading needed.

#### How to invoke agents

Type `@` in the Claude Code prompt — an autocomplete menu appears. Select the entry marked with `*` (agent), not `+` (file reference):

```
@api-designer design API for product catalog
```

Alternative — run an agent as the main session:

```bash
claude --agent=api-designer
```

#### Available Agents

| Agent | Skills loaded | What it does | When to use |
|-------|--------------|-------------|-------------|
| `api-designer` | tanstack-query | Asks questions one-by-one, then designs types, API methods, query keys, mutations | Adding a new API integration |
| `fsd-scaffolder` | feature-sliced-design | Creates FSD module structure — folders, barrel exports, type/constant files | Creating a new entity, feature, widget, or page |
| `component-builder` | shadcn, react-best-practices, composition-patterns | Implements UI components using shadcn/ui, semantic tokens, compound pattern, i18n | Building a component from spec |
| `form-builder` | react-hook-form-zod, shadcn, react-best-practices | Builds forms with Zod schema, React Hook Form, FieldGroup/Field pattern | Validated form with API submission |
| `query-builder` | tanstack-query | Creates TanStack Query layer — queryOptions, mutation hooks with cache invalidation | Connecting a feature to backend |
| `feature-reviewer` | all skills | Reviews code against all project conventions, runs lint + typecheck | Validating code before committing |

**Usage examples:**

```
@api-designer                — design API layer for a feature
@fsd-scaffolder              — create module structure for a new entity
@component-builder           — build a component from description
@form-builder                — create a form with validation
@query-builder               — set up TanStack Query for an entity
@feature-reviewer            — review recently written code
```

### Pre-commit Hooks

Claude Code hooks (`.claude/hooks/`) enforce conventions in real-time during code generation:

| Hook | What it checks |
|------|---------------|
| `fsd-validator.sh` | FSD layer dependency rule — no upward imports |
| `kebab-case-validator.sh` | All file and folder names are kebab-case |
| `barrel-import-validator.sh` | Cross-module imports go through barrel `index.ts` |

These run automatically on every `Edit` and `Write` operation — no manual action needed.

### Configuration Files

| File | Purpose |
|------|---------|
| `CONVENTIONS.md` | All project conventions — architecture, code style, patterns (source of truth) |
| `CLAUDE.md` | Claude Code specific instructions — references conventions, lists skills and agents |
| `AGENTS.md` | Agent-specific rules — references conventions, documents the pipeline |
| `.claude/settings.json` | Permissions, hooks, MCP server allowlist |
| `.mcp.json` | MCP server configuration (shadcn, context7, figma) |

### Claude Code Directory Structure

```
.claude/
├── agents/               # Standalone agents (invoke via @agent-name)
│   ├── api-designer.md
│   ├── fsd-scaffolder.md
│   ├── component-builder.md
│   ├── form-builder.md
│   ├── query-builder.md
│   └── feature-reviewer.md
├── skills/               # Knowledge bases (auto-loaded by agents via skills field)
│   ├── shadcn/
│   ├── feature-sliced-design/
│   ├── tanstack-query-best-practices/
│   ├── react-hook-form-zod/
│   ├── vercel-react-best-practices/
│   └── vercel-composition-patterns/
├── hooks/                # Pre-commit validation hooks
│   ├── fsd-validator.sh
│   ├── kebab-case-validator.sh
│   └── barrel-import-validator.sh
└── settings.json         # Permissions, hooks config
```
