import { useQuery } from "@tanstack/react-query"
import { useSyncExternalStore } from "react"

import { userQueries } from "@/entities/user"
import { tokenStorage } from "@/shared/lib"

export const useAuthState = () => {
  const hasTokens = useSyncExternalStore(tokenStorage.subscribe, tokenStorage.getSnapshot)

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    ...userQueries.me(),
    enabled: hasTokens,
  })

  return {
    user,
    isAuthenticated: Boolean(user && !isError),
    isLoading,
  }
}
