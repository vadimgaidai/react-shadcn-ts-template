# EXAMPLES.md

Concrete reference code for every convention in [`CONVENTIONS.md`](./CONVENTIONS.md). Every snippet is taken from (or modeled on) real code in this repository — when in doubt, prefer the live file over this document.

> Read [`CONVENTIONS.md`](./CONVENTIONS.md) first. This file is only the "what does it look like in code" companion.

## Table of Contents

- [FSD — Module Anatomy](#fsd--module-anatomy)
- [Entity Example (`user`)](#entity-example-user)
- [Feature Example (`auth`)](#feature-example-auth)
- [Query Key Factory & TanStack Query](#query-key-factory--tanstack-query)
- [Mutations & Cache Invalidation](#mutations--cache-invalidation)
- [Typing & File Splitting](#typing--file-splitting)
- [Validation Schemas (`schemas.ts`)](#validation-schemas-schemasts)
- [Compound Component Pattern](#compound-component-pattern)
- [Extending Base Components](#extending-base-components)
- [Barrel Exports](#barrel-exports)

---

## FSD — Module Anatomy

A **module** is a self-contained piece of business logic on one of the FSD layers (`entities`, `features`, `widgets`, `pages`). Every module has the same skeleton:

```
[module]/
├── api/         # HTTP calls + query/mutation hooks
├── hooks/       # use-*.ts hooks composed from api/model
├── model/       # types.ts, constants.ts, schemas.ts (domain only)
├── ui/          # React components (optional)
└── index.ts     # public barrel — only file outside code may import
```

Layer-specific differences:

- **Entity** has `api/[name].queries.ts` (read-side) — no mutations.
- **Feature** has `api/[name].mutations.ts` (write-side) — no queryOptions.
- **Widget** usually has only `ui/` + `model/` + `config/`.
- **Page** is just one component file.

Layer dependency direction (a higher layer may import a lower one, never the reverse):

```
app → pages → widgets → features → entities → shared
```

---

## Entity Example (`user`)

Source: `src/entities/user/`.

### `model/types.ts`

We prefer the **`as const` object + derived type** pattern over TypeScript `enum`. It produces no runtime class, tree-shakes cleanly, plays well with JSON, and the type is structurally the union of literal values.

Naming: interfaces are prefixed with `I`, types (including the derived union) with `T`. The const value keeps its plain name.

```typescript
export const UserRole = {
  Admin: "admin",
  User: "user",
  Guest: "guest",
} as const

export type TUserRole = (typeof UserRole)[keyof typeof UserRole]
// → "admin" | "user" | "guest"

export interface IUser {
  id: string
  email: string
  name: string
  role: TUserRole
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface IUserProfile extends IUser {
  bio?: string
  phone?: string
}
```

Usage in code:

```typescript
import { UserRole, type IUser, type TUserRole } from "@/entities/user"

if (user.role === UserRole.Admin) {
  // ...
}

const assignRole = (role: TUserRole) => {
  // role is "admin" | "user" | "guest"
}
```

Why not `enum`:

- Numeric enums leak runtime objects and don't tree-shake.
- String enums are nominally typed — they don't accept the underlying string literal, which makes API/JSON round-trips awkward.
- The `as const` pattern gives you a real const value AND a literal-union type with zero extra runtime cost.

### `model/constants.ts`

```typescript
export const USER_ENTITY = "user" as const

export const USER_QUERY_KEYS = {
  ME: "me",
} as const
```

### `api/user.api.ts`

```typescript
import type { IUser } from "../model/types"

import { httpClient } from "@/shared/lib"

export const userApi = {
  getMe: async (): Promise<IUser> => {
    return httpClient.get("users/me").json<IUser>()
  },
}
```

### `api/user.queries.ts`

```typescript
import { queryOptions } from "@tanstack/react-query"

import { userApi } from "./user.api"

import { USER_ENTITY, USER_QUERY_KEYS } from "@/entities/user/model/constants"
import { createQueryKeyFactory } from "@/shared/lib/react-query"

export const userKeys = createQueryKeyFactory(USER_ENTITY, (all) => ({
  me: () => [...all(), USER_QUERY_KEYS.ME] as const,
}))

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: userKeys.me(),
      queryFn: userApi.getMe,
    }),
}
```

### `index.ts` (public API)

`UserRole` (the const object value) and `TUserRole` (the derived union type) are distinct identifiers, so they don't need separate `type` exports.

```typescript
export { userApi } from "./api/user.api"
export { userQueries, userKeys } from "./api/user.queries"
export { UserRole } from "./model/types"
export type { IUser, IUserProfile, TUserRole } from "./model/types"
```

External code consumes the entity only through this barrel:

```typescript
import { userQueries, UserRole, type IUser, type TUserRole } from "@/entities/user"
```

---

## Feature Example (`auth`)

Source: `src/features/auth/`. Features bundle the **write-side** of a flow (mutations) plus the hooks that compose it for UI.

### Folder layout

```
src/features/auth/
├── api/
│   ├── auth.api.ts         # direct ky calls (no auth headers on login/register)
│   └── auth.mutations.ts   # useLoginMutation, useRegisterMutation, useLogoutMutation, useRefreshMutation
├── hooks/
│   ├── use-auth.ts         # high-level facade combining state + mutations
│   ├── use-auth-state.ts   # derived isAuthenticated / isLoading / user
│   └── use-require-auth.ts # redirect guard for protected routes
├── model/
│   └── types.ts            # LoginCredentials, RegisterCredentials, AuthTokens, AuthState
└── index.ts                # barrel
```

### `model/types.ts`

```typescript
export interface ILoginCredentials {
  email: string
  password: string
}

export interface IRegisterCredentials extends ILoginCredentials {
  name: string
}

export interface IAuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface IAuthState {
  isAuthenticated: boolean
  isLoading: boolean
}
```

### `api/auth.api.ts`

Auth uses `ky` directly (not `httpClient`) because login/register must not send the Bearer token.

```typescript
import ky from "ky"

import type { ILoginCredentials, IRegisterCredentials, IAuthTokens } from "../model/types"

import { env } from "@/shared/config"
import { tokenStorage } from "@/shared/lib"

export const authApi = {
  login: async (credentials: ILoginCredentials): Promise<IAuthTokens> => {
    return ky
      .post(`${env.VITE_API_URL}/api/auth/login`, { json: credentials })
      .json<IAuthTokens>()
  },

  register: async (credentials: IRegisterCredentials): Promise<IAuthTokens> => {
    return ky
      .post(`${env.VITE_API_URL}/api/auth/register`, { json: credentials })
      .json<IAuthTokens>()
  },

  refresh: async (): Promise<IAuthTokens> => {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) throw new Error("No refresh token available")
    return ky
      .post(`${env.VITE_API_URL}/api/auth/refresh`, { json: { refreshToken } })
      .json<IAuthTokens>()
  },

  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) return
    await ky.post(`${env.VITE_API_URL}/api/auth/logout`, { json: { refreshToken } })
  },
}
```

### `hooks/use-auth.ts` — composing API + state

```typescript
import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "../api/auth.mutations"

import { useAuthState } from "./use-auth-state"

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthState()

  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const logoutMutation = useLogoutMutation()

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  }
}
```

### `index.ts` (public API)

```typescript
export { useAuth } from "./hooks/use-auth"
export { useAuthState } from "./hooks/use-auth-state"
export { useRequireAuth } from "./hooks/use-require-auth"
export { useLoginMutation, useLogoutMutation, useRegisterMutation } from "./api/auth.mutations"
export type { ILoginCredentials, IRegisterCredentials, IAuthTokens } from "./model/types"
```

---

## Query Key Factory & TanStack Query

### The factory itself (`src/shared/lib/react-query/query-key-factory.ts`)

```typescript
type TQueryKeyFactory<T extends Record<string, (...args: never[]) => readonly unknown[]>> = {
  [K in keyof T]: T[K]
} & {
  all: () => readonly [string]
}

export const createQueryKeyFactory = <
  T extends Record<string, (...args: never[]) => readonly unknown[]>,
>(
  entity: string,
  keys: (all: () => readonly [string]) => T
): TQueryKeyFactory<T> => {
  const all = () => [entity] as const
  return { all, ...keys(all) }
}
```

### Defining keys + queryOptions

Defined inside the entity (`entities/[name]/api/[name].queries.ts`). Constants live in `model/constants.ts` to keep string segments out of the api layer.

```typescript
// entities/user/api/user.queries.ts
export const userKeys = createQueryKeyFactory(USER_ENTITY, (all) => ({
  me: () => [...all(), USER_QUERY_KEYS.ME] as const,
  byId: (id: string) => [...all(), id] as const,
  list: (filters: { role?: TUserRole }) => [...all(), "list", filters] as const,
}))

export const userQueries = {
  me: () => queryOptions({ queryKey: userKeys.me(), queryFn: userApi.getMe }),
  byId: (id: string) =>
    queryOptions({ queryKey: userKeys.byId(id), queryFn: () => userApi.getById(id) }),
}
```

### Consuming a query in a component

```tsx
import { useQuery } from "@tanstack/react-query"
import { userQueries } from "@/entities/user"

export const ProfileBadge = () => {
  const { data: user, isPending } = useQuery(userQueries.me())
  if (isPending || !user) return null
  return <span>{user.name}</span>
}
```

### Invalidation patterns

```typescript
// Invalidate a specific query
queryClient.invalidateQueries({ queryKey: userKeys.me() })

// Invalidate all user-scoped queries
queryClient.invalidateQueries({ queryKey: userKeys.all() })

// Invalidate by id
queryClient.invalidateQueries({ queryKey: userKeys.byId(userId) })
```

---

## Mutations & Cache Invalidation

Source: `src/features/auth/api/auth.mutations.ts`. Mutations live in the **feature** that owns the action, and invalidate the **entity** keys that the action affects.

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authApi } from "./auth.api"

import { userKeys } from "@/entities/user"
import { tokenStorage } from "@/shared/lib/storage"

export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (tokens) => {
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn)
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
    onError: (error) => {
      console.error("Login failed:", error)
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      tokenStorage.clearTokens()
      await queryClient.cancelQueries()
      queryClient.clear()
    },
  })
}
```

Rules visible in this example:

- Mutation hooks are colocated with the api in `api/[name].mutations.ts`.
- The mutation imports query keys from the entity it touches (`@/entities/user`) — features may depend on entities, never the reverse.
- Side-effects (token storage, cache clearing) belong in `onSuccess` / `onError`, not in the component.

---

## Typing & File Splitting

### Prefer `as const` objects over `enum`

For closed sets of string literals (roles, statuses, kinds, query-key segments), use a `const` object + derived union type instead of a TypeScript `enum`. See the `UserRole` example above.

```typescript
export const OrderStatus = {
  Draft: "draft",
  Pending: "pending",
  Paid: "paid",
  Refunded: "refunded",
} as const

export type TOrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]
```

### Naming: `I` for interfaces, `T` for types

- `interface IUser`, `interface ILoginCredentials`, `interface IDashboardLayoutProps`
- `type TUserRole`, `type TLoginFormValues`, `type TQueryKey`
- The derived type from a `const` object also gets the `T` prefix — the value keeps its plain name (`UserRole` value, `TUserRole` type).
- Generic parameters keep the standard short form (`T`, `K`, `V`, `TData`) — no double prefix.

### Default: one `model/types.ts`

Most modules need a single `model/types.ts`. Co-locate domain interfaces, const-object enums, and helper aliases together — readers can scan one file.

```typescript
// features/auth/model/types.ts
export interface ILoginCredentials { email: string; password: string }
export interface IRegisterCredentials extends ILoginCredentials { name: string }
export interface IAuthTokens { accessToken: string; refreshToken: string; expiresIn: number }
```

### When `types.ts` gets large — split by concern, not by usage site

If a module's types file grows past ~150 lines or covers clearly separate concerns, convert it into a `model/types/` folder and re-export from a single `index.ts`:

```
features/checkout/model/
├── types/
│   ├── cart.ts        # Cart, CartItem, CartTotals
│   ├── shipping.ts    # ShippingAddress, ShippingMethod
│   ├── payment.ts     # PaymentMethod, PaymentIntent
│   └── index.ts       # export * from "./cart" / "./shipping" / "./payment"
├── constants.ts
└── schemas.ts
```

```typescript
// features/checkout/model/types/index.ts
export * from "./cart"
export * from "./shipping"
export * from "./payment"
```

Rules:

- **Never** scatter `*.types.ts` next to api / ui / hooks files. They must live under `model/`.
- Consumers always import from `../model/types` (or the module barrel), not from a specific sub-file.
- Inferred types from zod schemas live next to the schema (`model/schemas.ts`) and may be re-exported from `model/types.ts` if needed externally.

---

## Validation Schemas (`schemas.ts`)

All zod validation lives in `model/schemas.ts`. Do **not** inline schemas inside components or API files.

### Defining a schema + inferring the type

```typescript
// features/auth/model/schemas.ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name is too short"),
})

export type TLoginFormValues = z.infer<typeof loginSchema>
export type TRegisterFormValues = z.infer<typeof registerSchema>
```

### Reference: env validation (`src/shared/config/env/schema.ts`)

```typescript
import { z } from "zod"

const envSchema = z.object({
  MODE: z.enum(["development", "production"]).default("development"),
  VITE_API_URL: z.string().url(),
  VITE_APP_NAME: z.string().default("React App"),
  VITE_ENABLE_DEVTOOLS: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
})

export type TEnv = z.infer<typeof envSchema>
export { envSchema }
```

### Using a schema with React Hook Form

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { loginSchema, type TLoginFormValues } from "../model/schemas"

const form = useForm<TLoginFormValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: "", password: "" },
})
```

Rules:

- Filename: `schemas.ts` for multiple schemas, or `[name].schema.ts` if a single dominant schema (e.g. `env/schema.ts`).
- Always `export type X = z.infer<typeof xSchema>` next to the schema — no manual duplicate interfaces.
- Schemas and their inferred types are imported via `../model/schemas` from inside the module, or via the module barrel from outside.

---

## Compound Component Pattern

When a component has 2+ tightly related sub-components, export an object with `.Root` and named sub-components. Source: `src/widgets/dashboard-layout/ui/dashboard-layout.tsx`.

### Definition

```tsx
import type { FC, ReactNode } from "react"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar"

interface IDashboardLayoutProps {
  children: ReactNode
}

const DashboardLayoutRoot: FC<IDashboardLayoutProps> = ({ children }) => {
  return <SidebarProvider>{children}</SidebarProvider>
}

const DashboardLayoutAside: FC = () => {
  return <Aside />
}

const DashboardLayoutMain: FC<{ children: ReactNode }> = ({ children }) => {
  return <SidebarInset>{children}</SidebarInset>
}

const DashboardLayoutHeader: FC = () => {
  return <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">…</header>
}

const DashboardLayoutContent: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
}

export const DashboardLayout = {
  Root: DashboardLayoutRoot,
  Aside: DashboardLayoutAside,
  Main: DashboardLayoutMain,
  Header: DashboardLayoutHeader,
  Content: DashboardLayoutContent,
}
```

### Usage

```tsx
<DashboardLayout.Root>
  <DashboardLayout.Aside />
  <DashboardLayout.Main>
    <DashboardLayout.Header />
    <DashboardLayout.Content>{children}</DashboardLayout.Content>
  </DashboardLayout.Main>
</DashboardLayout.Root>
```

### Minimal generic version

```tsx
const LayoutRoot: FC<{ children: ReactNode }> = ({ children }) => <Provider>{children}</Provider>
const LayoutHeader: FC = () => <header>...</header>
const LayoutContent: FC<{ children: ReactNode }> = ({ children }) => <div>{children}</div>

export const Layout = {
  Root: LayoutRoot,
  Header: LayoutHeader,
  Content: LayoutContent,
}
```

```tsx
<Layout.Root>
  <Layout.Header />
  <Layout.Content>{children}</Layout.Content>
</Layout.Root>
```

Rules:

- 2+ sub-components → use this pattern.
- Always expose `.Root` as the wrapper.
- Internal helpers that are not part of the public surface stay as separate files in the module, not on the compound object.
- Does **not** apply to `shared/ui/` — those are managed by shadcn and stay flat.

---

## Extending Base Components

When you build on top of a shadcn (or any base) component, **inherit its props** rather than redeclaring HTML attributes or variants.

### shadcn `Button` — the base

```tsx
// src/shared/ui/button.tsx
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  // ...
}
```

### A domain-specific wrapper (`SubmitButton`)

```tsx
// features/auth/ui/submit-button.tsx
import type { ComponentProps, FC } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib"

interface ISubmitButtonProps extends ComponentProps<typeof Button> {
  isPending?: boolean
}

export const SubmitButton: FC<ISubmitButtonProps> = ({
  isPending,
  disabled,
  className,
  children,
  ...rest
}) => {
  return (
    <Button
      type="submit"
      disabled={disabled || isPending}
      className={cn("relative", className)}
      {...rest}
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : children}
    </Button>
  )
}
```

What this gets us for free:

- All HTML `<button>` attributes (`onClick`, `aria-*`, `data-*`, `form`, `name`, `value`, …)
- All shadcn variants (`variant`, `size`, `asChild`) via `VariantProps`
- `className` merging via `cn()`
- `disabled` works correctly because we spread `...rest` *after* our own override only where needed

Rules:

- Use `ComponentProps<typeof Button>` (or the exported `ButtonProps`) — never copy-paste props.
- Forward `...rest` to the base component.
- Don't re-declare variant props — re-export base variants if a consumer needs them.
- Wrappers tied to a domain go inside the matching feature/entity/widget `ui/` folder, never in `shared/ui/`.

### Another example — Input with leading icon

```tsx
// features/search/ui/search-input.tsx
import type { ComponentProps, FC, ReactNode } from "react"

import { Input } from "@/shared/ui/input"
import { cn } from "@/shared/lib"

interface ISearchInputProps extends ComponentProps<typeof Input> {
  icon: ReactNode
}

export const SearchInput: FC<ISearchInputProps> = ({ icon, className, ...rest }) => {
  return (
    <div className="relative">
      <span className="absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground">{icon}</span>
      <Input className={cn("pl-8", className)} {...rest} />
    </div>
  )
}
```

---

## Barrel Exports

Every module exposes its public API through one `index.ts`. External code may **only** import from the barrel — never reach into a module's internal files.

### Entity barrel

```typescript
// src/entities/user/index.ts
export { userApi } from "./api/user.api"
export { userQueries, userKeys } from "./api/user.queries"
export { UserRole } from "./model/types"
export type { IUser, IUserProfile, TUserRole } from "./model/types"
```

### Feature barrel

```typescript
// src/features/auth/index.ts
export { useAuth } from "./hooks/use-auth"
export { useAuthState } from "./hooks/use-auth-state"
export { useRequireAuth } from "./hooks/use-require-auth"
export { useLoginMutation, useLogoutMutation, useRegisterMutation } from "./api/auth.mutations"
export type { ILoginCredentials, IRegisterCredentials, IAuthTokens } from "./model/types"
```

### Widget barrel

```typescript
// src/widgets/dashboard-layout/index.ts
export { DashboardLayout } from "./ui/dashboard-layout"
export { menuConfig } from "./config/menu.config"
export type { INavigationConfig, INavigationItem, INavigationSubItem } from "./model/types"
```

### Consuming

```typescript
// ✅ Correct — through the barrel
import { useAuth } from "@/features/auth"
import { userQueries, type IUser } from "@/entities/user"
import { DashboardLayout } from "@/widgets/dashboard-layout"

// ❌ Wrong — reaching into internals
import { useAuth } from "@/features/auth/hooks/use-auth"
import { userApi } from "@/entities/user/api/user.api"
```

Exception: shadcn components in `shared/ui/` are imported directly by file path (`@/shared/ui/button`) — they're not a module, they're a flat component library managed by shadcn CLI.
