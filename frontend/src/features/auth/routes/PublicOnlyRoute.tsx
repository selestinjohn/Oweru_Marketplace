import type { ReactNode } from 'react'
import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { AuthRouteLoading } from '@/features/auth/components/AuthRouteLoading'
import { getSafeRedirectPath } from '@/features/auth/utils/redirects'
import { useAuth } from '@/app/providers/authContext'

export function PublicOnlyRoute({ children }: { children?: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const [searchParams] = useSearchParams()

  if (isLoading) {
    return <AuthRouteLoading />
  }

  if (isAuthenticated) {
    return (
      <Navigate
        replace
        to={getSafeRedirectPath(searchParams.get('next'))}
      />
    )
  }

  return children ? <>{children}</> : <Outlet />
}
