import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "../api/auth.mutations"

import { useAuthState } from "./use-auth-state"

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthState()

  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const logoutMutation = useLogoutMutation()

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,

    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  }
}
