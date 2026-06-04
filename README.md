# React TypeScript FSD Template

Production-ready React template with [Feature-Sliced Design](https://feature-sliced.design/) architecture and a built-in seven-agent Claude Code pipeline that takes a one-line feature description from idea to reviewed code.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Requires Node.js >= 20 and pnpm >= 10.

## AI-Assisted Development — the headline feature

Most feature work in this template is meant to be driven through a chain of small, focused Claude Code agents. Each agent does one narrow step, reads a shared spec file (`.planning/[feature]/SPEC.md`), and hands off to the next. The result is fast, consistent code that matches the project's conventions every time.

### The pipeline

The chain starts with `feature-analyzer`, which asks you focused questions about the feature you want to build and writes a SPEC file that every later agent reads as its single source of truth. From there the work flows through `fsd-scaffolder` (folder skeleton), `api-designer` (types, constants, HTTP layer), `query-builder` (TanStack Query queries or mutations), optionally `form-builder` and/or `component-builder` for UI, and finally `feature-reviewer` to validate everything against the project's docs and run `pnpm typecheck`.

### How to use it

In the Claude Code prompt type `@` and pick the agent (the entry marked with `*`, not the file reference marked with `+`). Start with:

```
@feature-analyzer I want to add comments to articles
```

The analyzer will ask one question at a time — feature name, FSD layer, dependencies, endpoints, types, schemas, UI — then write `.planning/comments/SPEC.md`. You don't have to re-explain anything to the agents that come after, they all read that file.

Then walk the chain by invoking each agent in turn: `@fsd-scaffolder` creates the folder structure and empty files; `@api-designer` fills `model/types.ts`, `model/constants.ts`, and `api/[name].api.ts`; `@query-builder` adds the queries (for entities) or mutations (for features); `@form-builder` produces a Zod schema and a form component when the SPEC asks for one; `@component-builder` builds any non-form UI; `@feature-reviewer` checks the whole result against the four project docs and runs `pnpm typecheck`. Each agent prints the next command when it finishes, so you can copy-paste your way through.

### What each agent does

`feature-analyzer` runs a structured Q&A and writes the SPEC. It produces no code. Loaded skill: `feature-sliced-design`.

`fsd-scaffolder` reads the SPEC and creates the folder structure, empty placeholder files, and the barrel `index.ts`. No business logic. Loaded skill: `feature-sliced-design`.

`api-designer` fills the type layer (`model/types.ts`), the constants file (`model/constants.ts`), and the HTTP methods (`api/[name].api.ts`). Loaded skill: `tanstack-query-best-practices`.

`query-builder` adds the TanStack Query layer — `[name].queries.ts` with `createQueryKeyFactory` and `queryOptions` for entities, or `[name].mutations.ts` with `useMutation` hooks wired to cache invalidation for features. Loaded skill: `tanstack-query-best-practices`.

`form-builder` writes the Zod schema in `model/schemas.ts` and the form component in `ui/[name]-form.tsx`, wired to a mutation hook and following the shadcn `Field`/`FieldGroup` pattern. Loaded skills: `react-hook-form-zod`, `shadcn`, `vercel-react-best-practices`.

`component-builder` produces non-form UI — compound components, shadcn wrappers, i18n, dark mode via semantic tokens. Loaded skills: `shadcn`, `vercel-react-best-practices`, `vercel-composition-patterns`.

`feature-reviewer` reviews the entire feature against `CLAUDE.md`, `AGENTS.md`, `CONVENTIONS.md`, and `EXAMPLES.md`, runs `pnpm typecheck`, reports critical vs. minor issues, and offers a mechanical auto-fix pass. All skills loaded.

### Skills

Skills are knowledge bases auto-loaded into the right agent via its frontmatter, so an agent never needs to read them manually. They live in `.claude/skills/`. The set:

- `shadcn` — shadcn/ui usage rules (forms, composition, styling, icons).
- `vercel-react-best-practices` — React performance patterns: waterfalls, bundle size, re-renders, caching.
- `vercel-composition-patterns` — component architecture: compound components, context, explicit variants.
- `feature-sliced-design` — FSD methodology: layers, slices, segments, import rules.
- `tanstack-query-best-practices` — query keys, caching, mutations, optimistic updates, prefetching.
- `react-hook-form-zod` — Zod schemas, RHF integration, field arrays, multi-step forms.

### MCP servers

External tools the agents can call, configured in `.mcp.json`. The `shadcn` server gives access to the shadcn CLI for searching components and adding new ones. `context7` provides live library documentation for React 19, TanStack Query, React Router, Zod, and others. `figma` covers the design-to-code flow — fetching design context, screenshots, and metadata from Figma files.

### Real-time validation hooks

Hooks in `.claude/hooks/` run automatically on every `Edit` and `Write` from Claude Code. `fsd-validator.sh` blocks upward imports across FSD layers. `kebab-case-validator.sh` enforces `kebab-case` for all file and folder names. `barrel-import-validator.sh` ensures cross-module imports go through a barrel `index.ts` rather than reaching into module internals.

### Project docs the agents read

`CLAUDE.md` is the entry point for Claude Code and summarizes the pipeline, skills, and agents. `AGENTS.md` contains agent-specific rules and the same pipeline description. `CONVENTIONS.md` is the source of truth for architecture, naming, and code style. `EXAMPLES.md` holds canonical code samples for every convention — agents reference its sections instead of duplicating snippets. `.claude/settings.json` covers permissions, hooks, and the MCP allowlist. `.mcp.json` is the MCP server configuration.

### Token discipline

By design, agents never run `pnpm build`, `pnpm lint`, or `pnpm stylelint` — those are wired into Husky's pre-commit hook and CI. The only validation command an agent will run is `pnpm typecheck`. This keeps each agent's run cheap.

## Stack

React 19 with TypeScript in strict mode and the React Compiler enabled. Vite 8 as the build tool. Tailwind CSS v4 plus shadcn/ui in the `new-york` style. TanStack Query v5 for server state. React Router v7 for routing. `react-i18next` for translations. `ky` as the HTTP client. `zod` for validation paired with `react-hook-form` for forms.

## Scripts

`pnpm dev` starts the dev server. `pnpm build` runs the typecheck and the production build. `pnpm preview` serves the production build locally. `pnpm lint` and `pnpm lint:fix` run ESLint. `pnpm stylelint` lints CSS/SCSS. `pnpm format` runs Prettier. `pnpm typecheck` runs `tsc --noEmit`.

For day-to-day agent use, prefer `pnpm typecheck` — Husky and CI cover the rest.

## Project Structure

The codebase follows FSD layering. `src/app` holds providers, routes, and the entry point. `src/pages` is route-level components. `src/widgets` is complex reusable UI blocks (layouts, sidebars). `src/features` is user interaction scenarios such as auth. `src/entities` is business domain models like `user`. `src/shared` holds reusable infrastructure — UI components, utilities, config, hooks, and the http/storage/react-query libraries.

Layer dependency rule: `app → pages → widgets → features → entities → shared`. Higher layers may import from lower layers, never the other way around.

For the full set of architectural rules and reference code, see `CONVENTIONS.md` and `EXAMPLES.md`.

## Import Aliases

`@/*` resolves to `src/*`. `~/*` resolves to `public/*`.

## Environment Variables

```env
MODE=development
VITE_APP_NAME=React App
VITE_API_URL=https://api.example.com
VITE_ENABLE_DEVTOOLS=false
```
