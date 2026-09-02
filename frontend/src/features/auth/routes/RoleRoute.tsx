import type { ReactNode } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { routePaths } from '@/constants/routes'
import { AuthRouteLoading } from '@/features/auth/components/AuthRouteLoading'
import type { RoleCode } from '@/features/auth/types/auth.types'
import { hasAnyRole } from '@/features/auth/utils/roles'
import { useAuth } from '@/app/providers/authContext'

type RoleRouteProps = {
  allowedRoles: RoleCode[]
  children?: ReactNode
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { currentUser, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return <AuthRouteLoading />
  }

  if (!isAuthenticated) {
    return <Navigate replace to={routePaths.login} />
  }

  // Frontend role guards improve navigation UX only. Django remains the
  // authorization authority for protected data and actions.
  if (!hasAnyRole(currentUser, allowedRoles)) {
    return (
      <ErrorState
        title="Access not available"
        message="Your current OWERU account does not have access to this workspace."
        action={{
          label: 'Go to dashboard',
          onClick: () => {
            navigate(routePaths.dashboard)
          },
        }}
      />
    )
  }

  return children ? <>{children}</> : <Outlet />
}
