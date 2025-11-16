# API Documentation

This document covers the API layer implementation, including HTTP client configuration, data fetching patterns, and error handling.

## HTTP Client

### Configuration

The HTTP client is built on top of `ky` and configured in `src/shared/lib/http/client.ts`. It provides:

- Automatic token attachment
- Request/response interceptors
- Error handling
- Timeout configuration

### Base Configuration

```typescript
// src/shared/lib/http/client.ts
import ky, { type KyInstance, type HTTPError } from "ky"

import { env } from "@/shared/config"
import { tokenStorage } from "@/shared/lib"

const createHttpClient = (): KyInstance => {
  return ky.create({
    prefixUrl: `${env.VITE_API_URL}/api/`,
    timeout: 30000,
    retry: {
      limit: 0,
      methods: ["get", "post", "put", "patch", "delete"],
    },
  })
}

export const httpClient = createHttpClient()
export type { HTTPError }
```

### Authentication Interceptors

```typescript
// Automatic token attachment in createHttpClient()
hooks: {
  beforeRequest: [
    (request) => {
      const token = tokenStorage.getAccessToken()
      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`)
      }
    },
  ],
}
```

### Error Handling

Token refresh on 401 responses is handled by the React Query error handlers in `src/shared/lib/react-query/error-handlers.ts`.

## Data Fetching Patterns

### TanStack Query Integration

All API calls use TanStack Query for:

- Caching
- Background refetching
- Error handling
- Loading states

### Query Configuration

```typescript
// src/shared/lib/react-query/client.ts
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { mutationErrorHandler, queryErrorHandler } from "./error-handlers"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && "response" in error) {
          const status = (error as { response?: { status?: number } }).response?.status
          if (status && status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: queryErrorHandler,
  }),
  mutationCache: new MutationCache({
    onError: mutationErrorHandler,
  }),
})
```

## API Layer Structure

### Feature API Files

Each feature contains its API logic:

```
src/features/[feature]/
├── api/
│   ├── [feature].api.ts      # API calls
│   ├── [feature].mutations.ts # Mutations
│   └── [feature].queries.ts   # Queries
```

### Entity API Files

Entities contain domain-specific API calls:

```
src/entities/[entity]/
├── api/
│   ├── [entity].api.ts       # API calls
│   └── [entity].queries.ts    # Queries
```

## API Implementation Examples

### Authentication API

```typescript
// src/features/auth/api/auth.api.ts
import ky from "ky"
import type { LoginCredentials, RegisterCredentials, AuthTokens } from "../model/types"
import { env } from "@/shared/config"
import { tokenStorage } from "@/shared/lib"

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    return ky
      .post(`${env.VITE_API_URL}/api/auth/login`, {
        json: credentials,
      })
      .json<AuthTokens>()
  },

  register: async (credentials: RegisterCredentials): Promise<AuthTokens> => {
    return ky
      .post(`${env.VITE_API_URL}/api/auth/register`, {
        json: credentials,
      })
      .json<AuthTokens>()
  },

  refresh: async (): Promise<AuthTokens> => {
    const refreshToken = tokenStorage.getRefreshToken()

    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    return ky
      .post(`${env.VITE_API_URL}/api/auth/refresh`, {
        json: { refreshToken },
      })
      .json<AuthTokens>()
  },

  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken()

    if (refreshToken) {
      try {
        await ky.post(`${env.VITE_API_URL}/api/auth/logout`, {
          json: { refreshToken },
        })
      } catch (error) {
        console.warn("Logout request failed:", error)
      }
    }
  },
}
```

**Note:** Authentication API uses direct `ky` calls instead of `httpClient` because:

- Login/register don't require authentication tokens
- Refresh token is sent in the request body, not as a header
- Logout should work even if the request fails

### Authentication Mutations

```typescript
// src/features/auth/api/auth.mutations.ts
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

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (tokens) => {
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn)
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      tokenStorage.clearTokens()
      queryClient.clear()
      queryClient.setQueryData(userKeys.me(), null)
    },
    onError: (error) => {
      console.error("Logout failed:", error)
      tokenStorage.clearTokens()
      queryClient.clear()
    },
  })
}

export const useRefreshMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.refresh,
    onSuccess: (tokens) => {
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn)
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
    onError: () => {
      tokenStorage.clearTokens()
      queryClient.clear()
    },
  })
}
```

### User Entity API

```typescript
// src/entities/user/api/user.api.ts
import type { User } from "../model/types"
import { httpClient } from "@/shared/lib"

export const userApi = {
  getMe: async (): Promise<User> => {
    return httpClient.get("users/me").json<User>()
  },
}
```

### User Queries

```typescript
// src/entities/user/api/user.queries.ts
import { queryOptions } from "@tanstack/react-query"
import { userApi } from "./user.api"

export const userKeys = {
  me: () => ["me"] as const,
}

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: userKeys.me(),
      queryFn: userApi.getMe,
    }),
}
```

### Using User Queries

```typescript
// In components or hooks
import { useQuery } from "@tanstack/react-query"
import { userQueries } from "@/entities/user"

const MyComponent = () => {
  const { data: user, isLoading, isError } = useQuery({
    ...userQueries.me(),
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading user</div>

  return <div>Hello, {user.name}!</div>
}
```

## Error Handling

### HTTP Error Types

The HTTP client uses `HTTPError` from the `ky` library:

```typescript
// src/shared/lib/http/client.ts
import ky, { type HTTPError } from "ky"

export type { HTTPError }
```

The `HTTPError` type from `ky` includes:

- `response`: Response object with status, statusText, etc.
- `request`: Request object
- `message`: Error message

### Error Handling in Queries

Token refresh on 401 errors is handled automatically by React Query error handlers:

```typescript
// src/shared/lib/react-query/error-handlers.ts
import type { Mutation, Query } from "@tanstack/react-query"
import { authApi } from "@/features/auth/api/auth.api"
import { tokenStorage } from "@/shared/lib"

let isRefreshing = false
let failedQueue: {
  query?: Query<unknown, unknown, unknown>
  mutation?: Mutation<unknown, unknown, unknown, unknown>
  variables?: unknown
}[] = []

const processFailedQueue = () => {
  failedQueue.forEach(({ query, mutation, variables }) => {
    if (mutation) {
      const { options } = mutation
      mutation.setOptions(options)
      mutation.execute(variables)
    }
    if (query) {
      query.fetch()
    }
  })
  isRefreshing = false
  failedQueue = []
}

const refreshTokenAndRetry = async (
  query?: Query<unknown, unknown, unknown>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown
) => {
  const refreshToken = tokenStorage.getRefreshToken()

  if (!refreshToken) {
    tokenStorage.clearTokens()
    return
  }

  try {
    if (!isRefreshing) {
      isRefreshing = true
      failedQueue.push({ query, mutation, variables })

      const responseData = await authApi.refresh()
      tokenStorage.setTokens(
        responseData.accessToken,
        responseData.refreshToken,
        responseData.expiresIn
      )

      processFailedQueue()
    } else {
      failedQueue.push({ query, mutation, variables })
    }
  } catch {
    tokenStorage.clearTokens()
  }
}

const errorHandler = (
  error: unknown,
  query?: Query<unknown, unknown, unknown>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown
) => {
  if (error && typeof error === "object" && "response" in error) {
    const httpError = error as { response?: { status?: number } }
    const status = httpError.response?.status

    if (status === 401) {
      if (mutation) {
        refreshTokenAndRetry(undefined, mutation, variables)
      } else {
        refreshTokenAndRetry(query)
      }
    }
  }
}

export const queryErrorHandler = (error: unknown, query: Query<unknown, unknown, unknown>) => {
  errorHandler(error, query)
}

export const mutationErrorHandler = (
  error: unknown,
  variables: unknown,
  _context: unknown,
  mutation: Mutation<unknown, unknown, unknown, unknown>
) => {
  errorHandler(error, undefined, mutation, variables)
}
```

**Key Features:**

- Automatic token refresh on 401 errors
- Race condition protection (multiple 401s share the same refresh)
- Failed requests are queued and retried after refresh
- Tokens are cleared if refresh fails

## Request/Response Types

### API Types

```typescript
// src/shared/types/api.types.ts
export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
```

### HTTP Client Types

```typescript
// src/shared/lib/http/types.ts
import type { HTTPError } from "ky"

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface HttpClientConfig {
  baseUrl: string
  timeout?: number
}

export type { HTTPError }
```

## Testing API Calls

### Mocking API Calls

```typescript
// __tests__/mocks/handlers.ts
import { http, HttpResponse } from "msw"

export const handlers = [
  http.post("http://localhost:3000/api/auth/login", async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      accessToken: "mock-token",
      refreshToken: "mock-refresh-token",
      expiresIn: 3600,
    })
  }),
]
```

### Testing Queries

```typescript
// __tests__/features/auth/use-login.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLoginMutation } from '@/features/auth'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useLoginMutation', () => {
  it('should login user successfully', async () => {
    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper()
    })

    result.current.mutate({
      email: 'user@example.com',
      password: 'password'
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: expect.any(Number),
      })
    )
  })
})
```

## Performance Optimization

### Query Keys Pattern

Query keys are defined alongside queries using a consistent pattern:

```typescript
// src/entities/user/api/user.queries.ts
export const userKeys = {
  me: () => ["me"] as const,
}

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: userKeys.me(),
      queryFn: userApi.getMe,
    }),
}
```

**Benefits:**

- Type-safe query keys
- Centralized key management
- Easy invalidation using `queryClient.invalidateQueries({ queryKey: userKeys.me() })`

### Using Query Options

The `queryOptions` helper from TanStack Query provides better TypeScript inference:

```typescript
import { useQuery } from "@tanstack/react-query"
import { userQueries } from "@/entities/user"

// Spread the query options for full type safety
const { data, isLoading } = useQuery({
  ...userQueries.me(),
})
```

### Optimistic Updates Example

```typescript
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updateUser,
    onMutate: async (updatedUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.me() })

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(userKeys.me())

      // Optimistically update
      queryClient.setQueryData(userKeys.me(), updatedUser)

      return { previousUser }
    },
    onError: (err, updatedUser, context) => {
      // Revert on error
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.me(), context.previousUser)
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}
```
