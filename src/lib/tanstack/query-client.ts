import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'

import authApi from '@/api/auth/api'
import { CACHE_TIME } from '@/constants/base.constant'
import { removeTokens, isAccessTokenExpired } from '@/utils/storage'

/**
 * QueryClient configuration for React Query
 *
 * Handles authentication errors:
 * - If access token is expired, tries to refresh before retrying.
 * - If refresh fails or 401 persists, logs out the user.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: async (error, query) => {
      if (isUnauthorizedError(error) && !query.meta?.isAuthRetry) {
        if (isAccessTokenExpired()) {
          try {
            await authApi.refresh()
            queryClient.invalidateQueries({ queryKey: query.queryKey })
          } catch {
            removeTokens()
          }
        } else {
          removeTokens()
        }
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: async (error, _variables, _context, mutation) => {
      if (isUnauthorizedError(error) && !mutation.meta?.isAuthRetry) {
        if (isAccessTokenExpired()) {
          try {
            await authApi.refresh()
            // Optionally, retry mutation or notify user
          } catch {
            removeTokens()
          }
        } else {
          removeTokens()
        }
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIME,
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

function isUnauthorizedError(error: unknown): boolean {
  if (!error) return false
  if (typeof error === 'object' && error !== null) {
    // Check for objects with a status field (e.g., ky Response or custom error objects)
    if (
      'status' in error &&
      typeof (error as { status?: number }).status === 'number' &&
      (error as { status: number }).status === 401
    )
      return true
    // Check for instances of Response (fetch/ky may throw this directly)
    if (error instanceof Response && error.status === 401) return true
  }
  return false
}
