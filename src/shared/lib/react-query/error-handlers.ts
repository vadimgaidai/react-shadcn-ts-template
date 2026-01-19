import type { Mutation, Query } from "@tanstack/react-query"

/**
 * FSD VIOLATION: This file imports from features/auth layer.
 *
 * This is a conscious architectural decision because:
 * 1. Token refresh is tightly coupled to global error handling infrastructure
 * 2. Moving this logic to features would require features to import features (also a violation)
 * 3. Alternative patterns (DI, events) add complexity without meaningful benefit
 *
 * The app/ layer approach with useEffect configuration was considered but rejected
 * as it introduces unnecessary runtime complexity for a compile-time dependency.
 */
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

  if (!isRefreshing) {
    isRefreshing = true
    failedQueue.push({ query, mutation, variables })

    try {
      const responseData = await authApi.refresh()
      tokenStorage.setTokens(
        responseData.accessToken,
        responseData.refreshToken,
        responseData.expiresIn
      )
      processFailedQueue()
    } catch {
      isRefreshing = false
      failedQueue = []
      tokenStorage.clearTokens()
    }
  } else {
    failedQueue.push({ query, mutation, variables })
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
