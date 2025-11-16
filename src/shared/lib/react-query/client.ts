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
