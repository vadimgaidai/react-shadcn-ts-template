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
