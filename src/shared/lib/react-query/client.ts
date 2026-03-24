import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { HTTPError } from "ky"

import { mutationErrorHandler, queryErrorHandler } from "./error-handlers"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (error instanceof HTTPError) {
          const status = error.response.status
          if (status >= 400 && status < 500) {
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
