import { QueryClient } from '@tanstack/react-query'

import { CACHE_TIME } from '@/constants/base.constant'

/**
 * QueryClient configuration for React Query
 *
 * This configuration sets up the default behavior for all queries and mutations:
 *
 * TODO: Implement error handling for authentication:
 * - QueryCache: Handle query errors (e.g., 401 Unauthorized)
 * - MutationCache: Handle mutation errors (e.g., token expiration)
 */
export const queryClient = new QueryClient({
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
