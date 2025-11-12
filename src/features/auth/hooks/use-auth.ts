import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "../api/auth.mutations"
import type { LoginCredentials, RegisterCredentials } from "../model/types"

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

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      await loginMutation.mutateAsync(credentials)
    },
    [loginMutation]
  )

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<void> => {
      await registerMutation.mutateAsync(credentials)
    },
    [registerMutation]
  )

  const logout = useCallback(async (): Promise<void> => {
    await logoutMutation.mutateAsync()
  }, [logoutMutation])

  return {
    user,
    isAuthenticated: Boolean(user && !isError),
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,

    login,
    register,
    logout,
  }
}
