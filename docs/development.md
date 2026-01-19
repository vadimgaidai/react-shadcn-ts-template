# Development Workflow

This document covers the development process, tools, and best practices for working with this project.

## Getting Started

### Prerequisites

- Node.js >= 20.0
- pnpm >= 10.0 (recommended)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd project-name

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

## Development Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `vite` | Start development server |
| `build` | `tsc -b && vite build` | Type check and build for production |
| `preview` | `vite preview` | Preview production build |
| `lint` | `eslint . --report-unused-disable-directives` | Lint TypeScript files |
| `lint:fix` | `eslint . --report-unused-disable-directives --fix` | Lint with auto-fix |
| `lint:staged` | `lint-staged --relative` | Lint staged files |
| `stylelint` | `stylelint "./src/**/*.{css,scss}"` | Lint styles |
| `stylelint:fix` | `stylelint "**/*.{css,scss}" --fix` | Lint styles with auto-fix |
| `format` | `prettier --write "**/*.{ts,tsx}"` | Format code |
| `typecheck` | `tsc --noEmit` | Run TypeScript type checking |
| `prepare` | `husky` | Install git hooks |

## Project Structure

See [Architecture Documentation](./architecture.md) for detailed information about the Feature-Sliced Design structure.

## Code Quality Tools

### ESLint

Configuration: `eslint.config.js`

- React 19 best practices
- TypeScript strict rules
- Import organization
- Accessibility checks

### Prettier

Configuration: `.prettierrc.json`

- Consistent code formatting
- No semicolons (`semi: false`)
- Double quotes (`singleQuote: false`)
- Trailing commas (`trailingComma: "es5"`)
- 100 character line width
- Tailwind CSS class sorting plugin

### Stylelint

Configuration: `.stylelintrc.json`

- CSS/SCSS linting
- Property order enforcement
- Vendor prefix handling

### Commitlint

Configuration: `commitlint.config.cjs`

- Conventional commit format validation
- Automatic commit message checking

## Git Workflow

### Branch Naming

```
feature/feature-name
fix/bug-description
docs/documentation-update
refactor/code-improvement
chore/maintenance-task
```

### Commit Convention

Follow [Conventional Commits](https://conventionalcommits.org/):

```bash
# Feature commits
feat: add user authentication
feat: implement user profile page

# Fix commits
fix: resolve token refresh bug
fix: correct button styling

# Documentation
docs: update API documentation
docs: add development guide

# Refactoring
refactor: simplify authentication logic
refactor: optimize component rendering

# Maintenance
chore: update dependencies
chore: clean up unused files
```

### Pre-commit Hooks

Configuration: `.husky/pre-commit`, `.husky/commit-msg`, `.lintstagedrc.json`

Automatic checks run on every commit:

1. **ESLint** on staged TypeScript/TSX files (with auto-fix)
2. **Prettier** formatting on staged files (JSON, JS, TS, JSX, TSX, HTML)
3. **Stylelint** on all CSS/SCSS files in src/
4. **Commitlint** message validation using conventional commits

## Import System

### Path Aliases

Configured in `tsconfig.paths.json` and `vite.config.ts`:

| Alias | Path     | Example                         |
| ----- | -------- | ------------------------------- |
| `@`   | `src`    | `import App from '@/app'`       |
| `~`   | `public` | `import logo from '~/logo.svg'` |

### Import Rules

- Use absolute imports with aliases
- Never use relative imports between layers
- Follow Feature-Sliced Design layer dependencies

## Adding New Features

### 1. Plan the Feature

- Identify which layer the feature belongs to
- Define the feature's responsibilities
- Plan the file structure

### 2. Create Feature Structure

```bash
# Example: Adding a user management feature
mkdir -p src/features/user-management/{api,hooks,model,ui}
```

### 3. Implement Files

```typescript
// src/features/user-management/model/types.ts
export interface User {
  id: string
  name: string
  email: string
}

// src/features/user-management/api/user.api.ts
export const userApi = {
  getUsers: () => api.get("/users"),
  createUser: (user: User) => api.post("/users", user),
}

// src/features/user-management/hooks/use-users.ts
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  })
}

// src/features/user-management/index.ts
export { useUsers } from "./hooks/use-users"
export type { User } from "./model/types"
```

### 4. Export from Feature

Always use barrel exports for clean imports:

```typescript
// src/features/user-management/index.ts
export { useUsers } from "./hooks/use-users"
export { userApi } from "./api/user.api"
export type { User, UserCreate } from "./model/types"
```

## Component Development

### UI Components

- Use Shadcn/ui components as base
- Follow Tailwind CSS utility-first approach
- Keep components small and focused

```typescript
// Good: Focused component
const UserCard = ({ user }: { user: User }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
      </CardContent>
    </Card>
  )
}
```

### Custom Hooks

- Extract business logic into custom hooks
- Follow naming convention: `useFeatureName`
- Handle loading, error, and success states

```typescript
// src/features/auth/hooks/use-login.ts
export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      tokenStorage.setTokens(data)
    },
  })

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  }
}
```

## Environment Configuration

### Environment Variables

Create `.env` file in project root:

```env
# Application Mode
MODE=development

# Application Name
VITE_APP_NAME=My App

# API Configuration
VITE_API_URL=http://localhost:3000

# Development Tools
VITE_ENABLE_DEVTOOLS=true
```

### Validation

Environment variables are validated using Zod schemas in `src/shared/config/env/`.

## Deployment

### Build Process

```bash
# Type check
pnpm typecheck

# Lint code
pnpm lint

# Build for production
pnpm build

# Preview build
pnpm preview
```

### Build Configuration

Vite configuration in `vite.config.ts` includes path aliases, build optimization, and development server settings.

#### Bundle Splitting with Manual Chunks

The build configuration uses manual chunks to split code into smaller pieces. This helps with caching and loading speed.

When you build the project, Vite creates separate files for different libraries. For example, React code is in one file, UI components in another, and your application code in a separate file.

This means:
- When you update your code, only your application file changes
- Browser can cache library files for longer
- Users download smaller files when the app updates

The configuration groups libraries by purpose:

- React and React DOM go together because they change rarely
- UI libraries like Radix UI are grouped together
- Form libraries like react-hook-form and zod are grouped
- Icons from lucide-react are separate because the library is large
- Other libraries are grouped by what they do

You can see the size of each chunk after building by checking the build output in the terminal.

#### Bundle Visualization

The project uses rollup-plugin-visualizer to create a visual report of bundle sizes. After building, check the `stats.html` file in the project root to see which parts of your code take up space.

To use it:
1. Run `pnpm build`
2. Open `stats.html` in your browser
3. Look at the sizes of different chunks
4. Find parts that are too large and consider code splitting

#### Performance Best Practices

This project follows performance guidelines from [Vercel React Best Practices](https://vercel.com/blog/introducing-react-best-practices). These practices help make apps faster by:

- Reducing the size of JavaScript files
- Splitting code into smaller pieces
- Loading code only when needed
- Optimizing how components render

The main areas covered are:
- Bundle size optimization through code splitting
- Eliminating unnecessary async operations
- Optimizing component re-renders
- Efficient data fetching patterns

## Performance Optimization

### Code Splitting

```typescript
// Lazy load routes
const HomePage = lazy(() => import("@pages/home"))
const DashboardPage = lazy(() => import("@pages/dashboard"))
```

### Bundle Analysis

Use Vite's built-in analyzer:

```bash
# Analyze bundle size (requires @vitejs/plugin-legacy or similar)
npx vite-bundle-analyzer dist
```

### Image Optimization

```typescript
// Use optimized images
import avatar from "@/shared/assets/avatar.webp"
```

## Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check TypeScript errors
pnpm typecheck
```

#### Import Issues

1. Restart TypeScript server
2. Check `tsconfig.paths.json` aliases
3. Verify file extensions

#### Linting Issues

```bash
# Auto-fix ESLint issues
pnpm lint:fix

# Auto-fix styling issues
pnpm stylelint:fix
```

#### Git Hook Issues

```bash
# Skip hooks for a commit
git commit --no-verify

# Debug hooks
git config core.hooksPath .git/hooks
```

## Contributing

### Code Review Process

1. Create feature branch
2. Implement changes
3. Run linting and type checking
4. Create pull request
5. Code review and approval
6. Merge to main branch

### Code Review Checklist

- [ ] Code follows FSD architecture
- [ ] TypeScript types are correct
- [ ] Code is linted and formatted
- [ ] Documentation is updated
- [ ] No console.logs in production code

## Resources

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/)
