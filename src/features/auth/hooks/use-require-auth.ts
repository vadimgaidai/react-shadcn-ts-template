import { useEffect } from "react"
import { useNavigate } from "react-router"

import { useAuthState } from "./use-auth-state"

import { paths } from "@/shared/config"

export const useRequireAuth = (redirectTo: string = paths.login) => {
  const { isAuthenticated, isLoading } = useAuthState()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo])

  return { isAuthenticated, isLoading }
}
