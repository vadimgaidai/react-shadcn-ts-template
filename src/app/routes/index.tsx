import { lazy, Suspense } from "react"
import type { RouteObject } from "react-router"
import { Navigate, Outlet } from "react-router"

import { ProtectedRoute } from "./protected-route"

import { PageLoader } from "@/shared/components"
import { paths } from "@/shared/config"
import { DashboardLayout } from "@/widgets/layouts/dashboard/dashboard-layout"

const HomePage = lazy(() => import("@/pages/home/home-page"))

export const routes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <DashboardLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        ),
        children: [
          { path: paths.home, element: <HomePage /> },
          { path: "*", element: <Navigate to={paths.home} replace /> },
        ],
      },
    ],
  },
]
