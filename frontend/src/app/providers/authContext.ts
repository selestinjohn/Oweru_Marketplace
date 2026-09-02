import { createContext, useContext } from 'react'
import type {
  AuthUser,
  CurrentUserResponse,
  Party,
  PermissionCode,
  RoleCode,
} from '@/features/auth/types/auth.types'

export type AuthContextValue = {
  currentUser: CurrentUserResponse | null
  user: AuthUser | null
  party: Party | null
  roles: RoleCode[]
  permissions: PermissionCode[]
  isAuthenticated: boolean
  isLoading: boolean
  isError: boolean
  hasRole: (role: RoleCode) => boolean
  hasAnyRole: (roles: RoleCode[]) => boolean
  clearSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
