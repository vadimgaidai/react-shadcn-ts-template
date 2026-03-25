import type { Mutation, Query } from "@tanstack/react-query"
import { HTTPError } from "ky"

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

const MAX_REFRESH_ATTEMPTS = 1

let isRefreshing = false
let refreshAttempts = 0
let failedQueue: {
  query?: Query<unknown, unknown, unknown>
  mutation?: Mutation<unknown, unknown, unknown, unknown>
  variables?: unknown
}[] = []

const processFailedQueue = () => {
  const queue = [...failedQueue]
  failedQueue = []
  isRefreshing = false

  queue.forEach(({ query, mutation, variables }) => {
    if (mutation) {
      const { options } = mutation
      mutation.setOptions(options)
      mutation.execute(variables)
    }
    if (query) {
      query.fetch()
    }
  })
}

const clearRefreshState = () => {
  isRefreshing = false
  refreshAttempts = 0
  failedQueue = []
}

const refreshTokenAndRetry = async (
  query?: Query<unknown, unknown, unknown>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown
) => {
  const refreshToken = tokenStorage.getRefreshToken()

  if (!refreshToken || refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
    clearRefreshState()
    tokenStorage.clearTokens()
    return
  }

  if (!isRefreshing) {
    isRefreshing = true
    refreshAttempts++
    failedQueue.push({ query, mutation, variables })

    try {
      const responseData = await authApi.refresh()
      tokenStorage.setTokens(
        responseData.accessToken,
        responseData.refreshToken,
        responseData.expiresIn
      )
      refreshAttempts = 0
      processFailedQueue()
    } catch {
      clearRefreshState()
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
  if (error instanceof HTTPError && error.response.status === 401) {
    if (mutation) {
      refreshTokenAndRetry(undefined, mutation, variables)
    } else {
      refreshTokenAndRetry(query)
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
