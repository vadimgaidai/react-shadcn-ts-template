import { Suspense } from 'react'
import type { RouteObject } from 'react-router'
import { Navigate, Outlet } from 'react-router'

import { paths } from '../constants/paths.constant'

import DashboardLayout from '@/layouts/dashboard'
import Home from '@/pages/home'

const routes: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={<div className="p-6 py-3">Loading...</div>}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { path: paths.homePage, element: <Home /> },
      { path: '*', element: <Navigate to={paths.homePage} /> },
    ],
  },
]

export default routes
