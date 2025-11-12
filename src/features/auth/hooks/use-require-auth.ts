import { useEffect } from "react"
import { useNavigate } from "react-router"

import { useAuth } from "./use-auth"

export const useRequireAuth = (redirectTo: string = "/login") => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo])

  return { isAuthenticated, isLoading }
}
