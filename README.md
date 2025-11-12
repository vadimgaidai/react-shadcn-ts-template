# React TypeScript FSD Template

A production-ready React template with Feature-Sliced Design architecture.

## Features

- React with TypeScript strict mode
- Feature-Sliced Design architecture
- Secure authentication with automatic token refresh
- TanStack Query for data fetching
- Shadcn/ui components with Tailwind CSS
- Code quality tools (ESLint, Prettier, Stylelint)

## Project Structure

This template uses [Feature-Sliced Design](https://feature-sliced.design/) architecture:

```
src/
├── app/                    # Application layer
│   ├── providers/          # Global providers
│   ├── routes/             # Routing configuration
│   └── index.tsx           # App entry point
│
├── pages/                  # Page layer (route components)
│   └── [page-name]/
│       ├── ui/             # Page UI components
│       └── index.ts        # Public API
│
├── widgets/                # Widget layer (complex UI blocks)
│   └── [widget-name]/
│       ├── components/     # Widget components
│       ├── config/         # Configuration
│       ├── model/          # Types and logic
│       └── index.ts        # Public API
│
├── features/               # Feature layer (user interactions)
│   └── [feature-name]/
│       ├── api/            # API calls
│       ├── hooks/          # Feature hooks
│       ├── model/          # Business logic
│       ├── ui/             # Feature UI (optional)
│       └── index.ts        # Public API
│
├── entities/               # Entity layer (business models)
│   └── [entity-name]/
│       ├── api/            # Entity API
│       ├── model/          # Entity types
│       └── index.ts        # Public API
│
└── shared/                 # Shared layer (reusable infrastructure)
    ├── config/             # App configuration
    ├── lib/                # Libraries and utilities
    ├── ui/                 # Reusable UI components
    ├── hooks/              # Shared hooks
    ├── assets/             # Static assets
    └── types/              # Global types
```

**Layer Dependencies:** `app -> pages -> widgets -> features -> entities -> shared`

## Quick Start

### Requirements

- Node.js >= 20.0
- pnpm >= 10.0

### Installation

```bash
git clone <repository-url>
cd project-name
pnpm install
cp .env.example .env
pnpm dev
```

### Environment Variables

Create `.env` file:

```env
VITE_APP_NAME=My App
VITE_API_URL=http://localhost:3000
VITE_ENABLE_DEVTOOLS=true
```

## Scripts

| Script         | Command                  | Description |
| -------------- | ------------------------ | ----------- |
| `pnpm dev`     | Start development server |
| `pnpm build`   | Build for production     |
| `pnpm preview` | Preview production build |
| `pnpm lint`    | Lint code                |
| `pnpm format`  | Format code              |

## Import Aliases

| Alias       | Path           |
| ----------- | -------------- |
| `@app`      | `src/app`      |
| `@pages`    | `src/pages`    |
| `@widgets`  | `src/widgets`  |
| `@features` | `src/features` |
| `@entities` | `src/entities` |
| `@shared`   | `src/shared`   |

## Documentation

See [docs/](docs/) for comprehensive documentation:

- [Architecture](docs/architecture.md)
- [Authentication](docs/authentication.md)
- [API Layer](docs/api.md)
- [Development](docs/development.md)
