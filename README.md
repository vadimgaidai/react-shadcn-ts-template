# React Shadcn TypeScript Template

A modern, production-grade React template leveraging TypeScript, Vite, Tailwind CSS, and the Shadcn UI component system. This template is designed for rapid development of scalable, maintainable web applications, providing a robust foundation with best-in-class tooling for code quality, styling, and developer experience.

**Main Purpose:** This template targets developers and teams seeking a highly configurable, opinionated React starter kit. It features a modular architecture, comprehensive linting and formatting, internationalization support, and a rich set of prebuilt UI components. The project is ideal for building admin panels, dashboards, SaaS products, and modern web apps.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Core Technologies and Libraries](#core-technologies-and-libraries)
- [Installation and Setup](#installation-and-setup)
- [Scripts](#scripts)
- [Import and Module Details](#import-and-module-details)
- [Linting and Code Style](#linting-and-code-style)
- [Continuous Integration/Deployment](#continuous-integrationdeployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
src/
├── api/                # API modules (e.g., auth, user)
├── assets/             # Static assets (global CSS, images, SVGs)
├── components/         # Reusable React components (UI, aside, etc.)
├── constants/          # Application-wide constants
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization (i18n) config and translations
├── layouts/            # Layout components (e.g., dashboard)
├── lib/                # Utility libraries and third-party integrations
├── pages/              # Top-level page components
├── providers/          # Context providers (auth, theme, etc.)
├── routes/             # Application routing configuration
├── utils/              # Utility/helper functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── vite-env.d.ts       # Vite TypeScript environment declarations

# Root-level config and meta files:
.browserslistrc         # Target browsers for build
.editorconfig           # Editor formatting rules
.gitignore              # Git ignored files
.lintstagedrc.json      # Lint-staged config for pre-commit hooks
.prettierrc.json        # Prettier formatting config
.stylelintrc.json       # Stylelint config for CSS/SCSS
commitlint.config.cjs   # Commit message linting config
components.json         # Shadcn UI generator config
eslint.config.js        # ESLint config (flat config)
index.html              # HTML entry point for Vite
package.json            # Project metadata and scripts
pnpm-lock.yaml          # pnpm lockfile
postcss.config.mjs      # PostCSS config
tsconfig*.json          # TypeScript configs
vite.config.ts          # Vite build and dev server config
```

**Notes:**

- Static assets are located in `src/assets/`.
- All configuration files are at the project root.

---

## Core Technologies and Libraries

- **React**: UI library for building component-based user interfaces.
- **TypeScript**: Strongly-typed JavaScript for safer, scalable code.
- **Vite**: Lightning-fast build tool and dev server.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Shadcn UI**: Headless, customizable React component library.
- **@tanstack/react-query**: Data fetching and caching for React.
- **React Router**: Declarative routing for React apps.
- **Zod**: TypeScript-first schema validation.
- **i18next / react-i18next**: Internationalization support.
- **ESLint**: Linting for JavaScript/TypeScript.
- **Prettier**: Code formatter for consistent style.
- **Stylelint**: Linting for CSS/SCSS.
- **Husky & lint-staged**: Git hooks for enforcing code quality pre-commit.

---

## Installation and Setup

### Prerequisites

- **Node.js** (v18+ recommended)
- **pnpm** (preferred), or npm/yarn

### Local Development

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Environment Variables

- No `.env` file is required by default.
- Add environment variables as needed for your API endpoints, secrets, etc.

---

## Scripts

| Script          | Command                             | Purpose                             |
| --------------- | ----------------------------------- | ----------------------------------- |
| `dev`           | `vite`                              | Start local development server      |
| `build`         | `tsc -b && vite build`              | Type-check and build for production |
| `preview`       | `vite preview`                      | Preview the production build        |
| `lint`          | `eslint . --ext ts,tsx ...`         | Run ESLint on all source files      |
| `lint:fix`      | `eslint . --ext ts,tsx ... --fix`   | Lint and auto-fix issues            |
| `lint:staged`   | `lint-staged --relative`            | Lint staged files before commit     |
| `stylelint`     | `stylelint "./src/**/*.{css,scss}"` | Lint CSS/SCSS files                 |
| `stylelint:fix` | `stylelint "**/*.{css,scss}" --fix` | Lint and auto-fix CSS/SCSS          |
| `format`        | `prettier --write "**/*.{ts,tsx}"`  | Format code with Prettier           |
| `prepare`       | `husky`                             | Set up Git hooks                    |

---

## Import and Module Details

### Import Aliases

This project uses absolute import aliases for cleaner, maintainable imports. Aliases are configured in `vite.config.ts` and `components.json`:

| Alias        | Path Mapping      | Example Import                                  |
| ------------ | ----------------- | ----------------------------------------------- |
| `@`          | `src/`            | `import { X } from '@/lib/utils'`               |
| `~`          | `public/`         | `import img from '~/logo.svg'`                  |
| `components` | `@/components`    | `import { Button } from 'components/ui/button'` |
| `utils`      | `@/lib/utils`     | `import { fn } from 'utils'`                    |
| `ui`         | `@/components/ui` | `import { Card } from 'ui/card'`                |
| `lib`        | `@/lib`           | `import { ky } from 'lib/ky'`                   |
| `hooks`      | `@/hooks`         | `import { useMobile } from 'hooks/use-mobile'`  |

**Configuration:**

- See `vite.config.ts` (`resolve.alias`) and `components.json` (`aliases`).

---

## Linting and Code Style

- **ESLint**: Enforces code quality and best practices for TypeScript/React. Configured in `eslint.config.js`.
- **Prettier**: Formats code for consistency. Configured in `.prettierrc.json`.
- **Stylelint**: Lints CSS/SCSS (including Tailwind). Configured in `.stylelintrc.json`.
- **lint-staged**: Runs linters/formatters on staged files before commit.
- **Husky**: Sets up Git hooks for pre-commit checks.
- **Commitlint**: Enforces conventional commit messages (`commitlint.config.cjs`).

### Running Linters and Formatters

```bash
pnpm lint         # Lint TypeScript/JavaScript
pnpm lint:fix     # Lint and auto-fix
pnpm stylelint    # Lint CSS/SCSS
pnpm stylelint:fix# Lint and auto-fix CSS/SCSS
pnpm format       # Format code with Prettier
```

---

## Continuous Integration/Deployment

- **Automation**: Pre-commit hooks (Husky, lint-staged) enforce code quality locally.
- **Recommendation**: Integrate with GitHub Actions, GitLab CI, or similar for automated testing, linting, and deployment.

---
