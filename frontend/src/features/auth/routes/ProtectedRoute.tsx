import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { routePaths } from '@/constants/routes'
import { AuthRouteLoading } from '@/features/auth/components/AuthRouteLoading'
import { useAuth } from '@/app/providers/authContext'

export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <AuthRouteLoading />
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`)

    return <Navigate replace to={`${routePaths.login}?next=${next}`} />
  }

  return children ? <>{children}</> : <Outlet />
}
