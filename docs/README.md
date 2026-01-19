# Documentation

This directory contains comprehensive documentation for the React TypeScript Feature-Sliced Design template.

## Table of Contents

### Architecture

- **[Architecture Overview](./architecture.md)** - Feature-Sliced Design structure and principles
- **[API Layer](./api.md)** - HTTP client, data fetching, and error handling
- **[Authentication](./authentication.md)** - Auth system implementation and security

### Development

- **[Development Workflow](./development.md)** - Tools, scripts, and best practices, including build configuration and performance optimization

## Quick Start

1. **Read the Architecture Overview** to understand the project structure
2. **Follow the Development Workflow** for coding standards and tools
3. **Check Authentication docs** for auth implementation details
4. **Review API docs** for data fetching patterns

## Key Concepts

### Feature-Sliced Design (FSD)

This project uses [Feature-Sliced Design](https://feature-sliced.design/) - a methodology for scalable frontend architecture that organizes code into layers based on business logic and technical concerns.

**Core Layers:**

- `app/` - Application initialization and routing
- `pages/` - Route-level components
- `widgets/` - Complex UI blocks
- `features/` - User interaction scenarios
- `entities/` - Business domain models
- `shared/` - Reusable infrastructure

**Key Principles:**

- Strict layer dependencies (higher layers import from lower layers)
- Public APIs through barrel exports
- Separation of business logic and presentation

### TypeScript + React

- **Strict TypeScript** configuration for maximum type safety
- **React 19** with modern patterns and hooks
- **TanStack Query** for server state management
- **Zod** for runtime type validation
- **Performance optimization** following [Vercel React Best Practices](https://vercel.com/blog/introducing-react-best-practices) for faster apps and smaller bundles

### Security First

- Secure token storage (memory for access tokens, sessionStorage for refresh tokens)
- Automatic token refresh with race condition protection
- HTTP-only cookies recommended for production

## Project Structure Template

```
src/
├── app/                    # Application layer
│   ├── providers/          # Global providers
│   ├── routes/             # Routing configuration
│   └── index.tsx           # App entry point
│
├── pages/                  # Page layer
│   └── [page-name]/
│       ├── ui/             # Page UI components
│       └── index.ts        # Public API
│
├── widgets/                # Widget layer
│   └── [widget-name]/
│       ├── components/     # Widget components
│       ├── config/         # Configuration
│       ├── model/          # Types and logic
│       └── index.ts        # Public API
│
├── features/               # Feature layer
│   └── [feature-name]/
│       ├── api/            # API calls
│       ├── hooks/          # Feature hooks
│       ├── model/          # Business logic
│       ├── ui/             # Feature UI (optional)
│       └── index.ts        # Public API
│
├── entities/               # Entity layer
│   └── [entity-name]/
│       ├── api/            # Entity API
│       ├── model/          # Entity types
│       └── index.ts        # Public API
│
└── shared/                 # Shared layer
    ├── config/             # App configuration
    ├── lib/                # Libraries and utilities
    ├── ui/                 # Reusable UI components
    ├── hooks/              # Shared hooks
    ├── assets/             # Static assets
    └── types/              # Global types
```

## Development Workflow

### 1. Setup

```bash
git clone <repository-url>
cd project-name
pnpm install
cp .env.example .env
pnpm dev
```

### 2. Development

- Follow FSD architecture principles
- Use absolute imports with aliases
- Run linting and type checking
- Follow conventional commits

### 3. Code Quality

- ESLint for code linting
- Prettier for code formatting
- Stylelint for CSS linting
- Commitlint for commit messages

### 4. Deployment

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Scripts

| Command              | Description                 |
| -------------------- | --------------------------- |
| `pnpm dev`           | Start development server    |
| `pnpm build`         | Build for production        |
| `pnpm preview`       | Preview production build    |
| `pnpm lint`          | Lint TypeScript files       |
| `pnpm lint:fix`      | Fix linting issues          |
| `pnpm lint:staged`   | Lint staged files           |
| `pnpm stylelint`     | Lint CSS/SCSS files         |
| `pnpm stylelint:fix` | Fix CSS/SCSS linting issues |
| `pnpm format`        | Format code                 |
| `pnpm typecheck`     | Run TypeScript checks       |
| `pnpm prepare`       | Install git hooks           |

## Import Aliases

| Alias | Path     |
| ----- | -------- |
| `@`   | `src`    |
| `~`   | `public` |

## Best Practices

### DO

- Follow FSD layer separation
- Use TypeScript strictly
- Use barrel exports for clean imports
- Validate data with schemas
- Follow conventional commits

### DON'T

- Import higher layers from lower layers
- Use `any` type (if it possible)
- Mix business logic with UI
- Skip error handling
- Use relative imports between layers
- Leave console.logs in production

## Contributing

1. Read the architecture documentation
2. Follow the development workflow
3. Create feature branches
4. Run linting and type checking
5. Follow conventional commits
6. Submit pull requests

## Support

- Check the documentation first
- Search existing issues
- Create detailed bug reports
- Ask specific questions

## License

This project is licensed under the MIT License.
