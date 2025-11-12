import type { FC } from "react"
import { Outlet } from "react-router"

import { useAuth } from "@/features/auth"

export const ProtectedRoute: FC = () => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Authenticating...</div>
      </div>
    )
  }

  // TODO: Uncomment when login page is implemented
  // if (!isAuthenticated) {
  //   return <Navigate to={paths.login} replace />
  // }

  return <Outlet />
}
