import { useCallback, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { authQueryKeys } from '@/features/auth/api/authQueryKeys'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import type { RoleCode } from '@/features/auth/types/auth.types'
import { authStorage } from '@/features/auth/utils/authStorage'
import {
  hasAnyRole as currentUserHasAnyRole,
  hasRole as currentUserHasRole,
} from '@/features/auth/utils/roles'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const currentUserQuery = useCurrentUser()

  const clearSession = useCallback(() => {
    authStorage.clearTokens()
    queryClient.removeQueries({ queryKey: authQueryKeys.all })
  }, [queryClient])

  useEffect(() => {
    window.addEventListener('oweru:auth:session-cleared', clearSession)

    return () => {
      window.removeEventListener('oweru:auth:session-cleared', clearSession)
    }
  }, [clearSession])

  useEffect(() => {
    const status = isAxiosError(currentUserQuery.error)
      ? currentUserQuery.error.response?.status
      : undefined

    if (status === 401 || status === 403) {
      clearSession()
    }
  }, [clearSession, currentUserQuery.error])

  const currentUser = currentUserQuery.data ?? null
  const isResolvingStoredSession =
    authStorage.hasSession() && currentUserQuery.isPending

  const value = useMemo(
    () => ({
      currentUser,
      user: currentUser?.user ?? null,
      party: currentUser?.party ?? null,
      roles: currentUser?.roles ?? [],
      permissions: currentUser?.permissions ?? [],
      isAuthenticated: Boolean(currentUser),
      isLoading: isResolvingStoredSession,
      isError: currentUserQuery.isError,
      hasRole: (role: RoleCode) => currentUserHasRole(currentUser, role),
      hasAnyRole: (roles: RoleCode[]) =>
        currentUserHasAnyRole(currentUser, roles),
      clearSession,
    }),
    [clearSession, currentUser, currentUserQuery.isError, isResolvingStoredSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
