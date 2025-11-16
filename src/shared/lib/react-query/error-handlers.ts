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
