# Feature-Sliced Design Architecture

This document explains the Feature-Sliced Design (FSD) architecture used in this project and how to structure your code properly.

## Layers Overview

FSD divides your application into layers based on business logic and technical concerns. Each layer has a specific purpose and clear boundaries.

### Layer Structure Template

Here's the general structure for each layer in FSD:

```
src/
├── app/                    # Application layer
│   ├── providers/          # Global providers and context
│   ├── routes/             # Routing configuration
│   └── index.tsx           # Application entry point
│
├── pages/                  # Page layer (route components)
│   └── [page-name]/
│       ├── ui/             # Page-specific UI components
│       └── index.ts        # Public API
│
├── widgets/                # Widget layer (complex UI blocks)
│   └── [widget-name]/
│       ├── components/     # Widget components
│       ├── config/         # Widget configuration
│       ├── model/          # Widget types and logic
│       └── index.ts        # Public API
│
├── features/               # Feature layer (user interactions)
│   └── [feature-name]/
│       ├── api/            # API calls and mutations
│       ├── hooks/          # Feature-specific hooks
│       ├── model/          # Business logic and types
│       ├── ui/             # Feature UI components (optional)
│       └── index.ts        # Public API
│
├── entities/               # Entity layer (business models)
│   └── [entity-name]/
│       ├── api/            # Entity API and queries
│       ├── model/          # Entity types and validation
│       └── index.ts        # Public API
│
└── shared/                 # Shared layer (reusable infrastructure)
    ├── config/             # Application configuration
    ├── lib/                # Libraries and utilities
    ├── ui/                 # Reusable UI components
    ├── hooks/              # Shared hooks
    ├── assets/             # Static assets
    └── types/              # Shared type definitions
```

## Layer Responsibilities

### App Layer (`src/app/`)

- Application initialization
- Global providers (QueryClient, Theme, Router)
- Global routing configuration
- Application-wide settings

**Structure:**

```
app/
├── providers/          # Global context providers
├── routes/             # Route definitions and guards
└── index.tsx          # Main App component
```

### Pages Layer (`src/pages/`)

- Route-level components
- Page layouts and composition
- Route-specific logic

**Structure:**

```
pages/
└── [page-name]/
    ├── ui/             # Page-specific components
    └── index.ts        # Page export
```

### Widgets Layer (`src/widgets/`)

- Complex UI blocks that can be reused across pages
- Layout components (headers, footers, sidebars)
- Form components
- Modal dialogs

**Structure:**

```
widgets/
└── [widget-name]/
    ├── components/     # Widget sub-components
    ├── config/         # Widget configuration
    ├── model/          # Widget types and logic
    └── index.ts        # Widget export
```

### Features Layer (`src/features/`)

- User interaction scenarios
- Business logic for specific features
- Feature-specific state management

**Structure:**

```
features/
└── [feature-name]/
    ├── api/            # API calls and mutations
    ├── hooks/          # Feature hooks
    ├── model/          # Business logic and types
    ├── ui/             # Feature UI (optional)
    └── index.ts        # Feature export
```

### Entities Layer (`src/entities/`)

- Business domain models
- Data validation schemas
- Entity-specific API calls

**Structure:**

```
entities/
└── [entity-name]/
    ├── api/            # Entity queries and mutations
    ├── model/          # Entity types and schemas
    └── index.ts        # Entity export
```

### Shared Layer (`src/shared/`)

- Reusable utilities and components
- Third-party library configurations
- Global constants and types

**Structure:**

```
shared/
├── config/             # App configuration
├── lib/                # Utility libraries
├── ui/                 # Reusable UI components
├── hooks/              # Shared custom hooks
├── assets/             # Static files
└── types/              # Global type definitions
```

## Import Rules

### Allowed Imports

- Higher layers can import from lower layers
- Same layer modules can import from each other

### Forbidden Imports

- Lower layers cannot import from higher layers
- This maintains clean architecture and prevents circular dependencies

**Import Flow:**

```
app -> pages -> widgets -> features -> entities -> shared
```

## File Organization Within Layers

### API Files (`api/`)

- HTTP requests and mutations
- API response types
- Error handling

### Model Files (`model/`)

- TypeScript types and interfaces
- Validation schemas (Zod)
- Business logic functions
- Constants

### UI Components (`ui/`)

- Presentational components
- Component-specific styles
- Component documentation

### Hooks (`hooks/`)

- Custom React hooks
- Business logic hooks
- Data fetching hooks

### Configuration (`config/`)

- Static configuration objects
- Environment-specific settings
- Component configurations

## Naming Conventions

### Files and Folders

- Use `kebab-case` for file and folder names
- Use `PascalCase` for component files
- Use `camelCase` for utility files

### Components

- Use `PascalCase` for component names
- Use descriptive, domain-specific names

### Hooks

- Prefix with `use` (e.g., `useAuth`, `useUser`)
- Use descriptive names that explain the purpose

## Examples

### Adding a New Feature

```bash
# Create feature directory structure
mkdir -p src/features/user-profile/{api,hooks,model,ui}

# Create files
touch src/features/user-profile/api/profile.api.ts
touch src/features/user-profile/hooks/use-profile.ts
touch src/features/user-profile/model/types.ts
touch src/features/user-profile/model/profile.ts
touch src/features/user-profile/ui/profile-form.tsx
touch src/features/user-profile/index.ts
```

### Adding a New Entity

```bash
# Create entity directory structure
mkdir -p src/entities/product/{api,model}

# Create files
touch src/entities/product/api/product.queries.ts
touch src/entities/product/model/types.ts
touch src/entities/product/model/schemas.ts
touch src/entities/product/index.ts
```

### Adding a New Widget

```bash
# Create widget directory structure
mkdir -p src/widgets/product-list/{components,config,model}

# Create files
touch src/widgets/product-list/components/product-card.tsx
touch src/widgets/product-list/components/product-grid.tsx
touch src/widgets/product-list/config/constants.ts
touch src/widgets/product-list/model/types.ts
touch src/widgets/product-list/index.ts
```

## Best Practices

### DO

- Keep layers separated and follow import rules
- Use barrel exports (`index.ts`) for clean imports
- Create small, focused modules
- Use TypeScript strictly
- Validate all data with schemas

### DON'T

- Mix business logic with UI components
- Create circular dependencies
- Import higher layers from lower layers
- Use relative imports between layers
- Skip type definitions

## Migration from Other Architectures

If migrating from a different architecture:

1. Identify your current components and group them by layer
2. Move business logic to appropriate feature/entity layers
3. Extract reusable UI to shared/widgets layers
4. Update imports to follow the dependency rules
5. Create barrel exports for clean APIs
