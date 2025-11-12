import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authApi } from "./auth.api"

import { userKeys } from "@/entities/user"
import { tokenStorage } from "@/shared/lib/storage"

export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (tokens) => {
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn)
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
    onError: (error) => {
      console.error("Login failed:", error)
    },
  })
}

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (tokens) => {
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn)
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      tokenStorage.clearTokens()
      queryClient.clear()
      queryClient.setQueryData(userKeys.me(), null)
    },
    onError: (error) => {
      console.error("Logout failed:", error)
      tokenStorage.clearTokens()
      queryClient.clear()
    },
  })
}

export const useRefreshMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.refresh,
    onSuccess: (tokens) => {
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn)
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
    onError: () => {
      tokenStorage.clearTokens()
      queryClient.clear()
    },
  })
}
