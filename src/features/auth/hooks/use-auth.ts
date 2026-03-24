import { useQuery } from "@tanstack/react-query"

import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "../api/auth.mutations"

import { userQueries } from "@/entities/user"
import { tokenStorage } from "@/shared/lib"

export const useAuth = () => {
  const hasTokens = tokenStorage.hasTokens()

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    ...userQueries.me(),
    enabled: hasTokens,
  })

  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const logoutMutation = useLogoutMutation()

  return {
    user,
    isAuthenticated: Boolean(user && !isError),
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,

    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  }
}
