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
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (
          error instanceof HTTPError &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      retry: false,
    },
  },
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
import { api } from "@/shared/lib/http"

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api.post("auth/login", { json: credentials }).json()
  },

  refresh: async (): Promise<AuthResponse> => {
    return api.post("auth/refresh").json()
  },

  logout: async (): Promise<void> => {
    return api.post("auth/logout").json()
  },
}
```

### Authentication Queries

```typescript
// src/features/auth/api/auth.queries.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authApi } from "./auth.api"
import { tokenStorage } from "@/shared/lib/storage"

export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      tokenStorage.setTokens(data)
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      tokenStorage.clear()
      queryClient.clear()
    },
  })
}
```

### User Entity API

```typescript
// src/entities/user/api/user.api.ts
import { api } from "@/shared/lib/http"

export interface User {
  id: string
  name: string
  email: string
}

export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    return api.get("user/me").json()
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return api.patch("user/profile", { json: data }).json()
  },
}
```

### User Queries

```typescript
// src/entities/user/api/user.queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userApi } from "./user.api"

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: userApi.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["user", "current"], data)
    },
  })
}
```

## Error Handling

### HTTP Error Types

```typescript
// src/shared/lib/http/types.ts
export class HTTPError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`${status}: ${statusText}`)
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super("Validation failed")
  }
}
```

### Error Handling in Queries

```typescript
// src/shared/lib/react-query/error-handlers.ts
import { HTTPError, NetworkError } from "@/shared/lib/http"

export const handleQueryError = (error: unknown) => {
  if (error instanceof HTTPError) {
    switch (error.status) {
      case 401:
        // Handle authentication error
        tokenStorage.clear()
        window.location.href = "/login"
        break
      case 403:
        // Handle forbidden error
        showToast("You do not have permission to perform this action")
        break
      case 422:
        // Handle validation error
        showValidationErrors(error.data)
        break
      default:
        // Handle other HTTP errors
        showToast("An error occurred. Please try again.")
    }
  } else if (error instanceof NetworkError) {
    showToast("Network error. Please check your connection.")
  } else {
    // Handle unknown errors
    console.error("Unknown error:", error)
    showToast("An unexpected error occurred.")
  }
}
```

## Request/Response Types

### Request Types

```typescript
// src/shared/types/api.types.ts
export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: {
    page: number
    limit: number
    total: number
  }
}

export interface PaginatedRequest {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
}
```

### Response Transformers

```typescript
// src/shared/lib/api/transformers.ts
export const transformApiResponse = <T>(response: ApiResponse<T>): T => {
  return response.data
}

export const transformPaginatedResponse = <T>(response: ApiResponse<T[]>): PaginatedResponse<T> => {
  return {
    data: response.data,
    pagination: {
      page: response.meta?.page ?? 1,
      limit: response.meta?.limit ?? 10,
      total: response.meta?.total ?? 0,
    },
  }
}
```

## Testing API Calls

### Mocking API Calls

```typescript
// __tests__/mocks/handlers.ts
import { rest } from "msw"

export const handlers = [
  rest.post("/api/auth/login", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        accessToken: "mock-token",
        refreshToken: "mock-refresh-token",
        user: { id: "1", name: "John Doe" },
      })
    )
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
        user: expect.objectContaining({
          name: expect.any(String)
        })
      })
    )
  })
})
```

## Performance Optimization

### Query Keys

```typescript
// src/shared/lib/react-query/keys.ts
export const queryKeys = {
  user: {
    current: () => ["user", "current"] as const,
    list: (filters?: UserFilters) => ["user", "list", filters] as const,
    detail: (id: string) => ["user", "detail", id] as const,
  },
  auth: {
    session: () => ["auth", "session"] as const,
  },
} as const
```

### Optimistic Updates

```typescript
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updateUser,
    onMutate: async (updatedUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.user.detail(updatedUser.id) })

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(queryKeys.user.detail(updatedUser.id))

      // Optimistically update
      queryClient.setQueryData(queryKeys.user.detail(updatedUser.id), updatedUser)

      return { previousUser }
    },
    onError: (err, updatedUser, context) => {
      // Revert on error
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.user.detail(updatedUser.id), context.previousUser)
      }
    },
    onSettled: (updatedUser) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.user.detail(updatedUser.id) })
    },
  })
}
```
