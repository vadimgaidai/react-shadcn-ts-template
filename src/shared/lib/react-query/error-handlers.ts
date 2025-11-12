import type { Mutation, Query } from "@tanstack/react-query"

import { queryClient } from "./client"

import { authApi } from "@/features/auth/api/auth.api"
import { tokenStorage } from "@/shared/lib"

let isRefreshing = false
let failedQueue: {
  query?: Query<unknown, unknown, unknown>
  mutation?: Mutation<unknown, unknown, unknown, unknown>
  variables?: unknown
}[] = []

const processFailedQueue = () => {
  failedQueue.forEach(({ query }) => {
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
  } catch (error) {
    console.error("Token refresh failed:", error)
    tokenStorage.clearTokens()
    queryClient.clear()
  }
}

const isUnauthorizedError = (error: unknown): boolean => {
  return (
    error instanceof Error &&
    "status" in error &&
    (error as unknown as { status?: number }).status === 401
  )
}

export const queryErrorHandler = (error: unknown, query: Query<unknown, unknown, unknown>) => {
  if (isUnauthorizedError(error)) {
    refreshTokenAndRetry(query)
  }
}

export const mutationErrorHandler = (
  error: unknown,
  variables: unknown,
  _context: unknown,
  mutation: Mutation<unknown, unknown, unknown, unknown>
) => {
  if (isUnauthorizedError(error)) {
    refreshTokenAndRetry(undefined, mutation, variables)
  }
}
