import type {
  CurrentUserResponse,
  RoleCode,
} from '@/features/auth/types/auth.types'
import { titleCase } from '@/lib/format'

export function hasRole(
  currentUser: CurrentUserResponse | null | undefined,
  role: RoleCode,
) {
  return Boolean(currentUser?.roles.includes(role))
}

export function hasAnyRole(
  currentUser: CurrentUserResponse | null | undefined,
  allowedRoles: RoleCode[],
) {
  return allowedRoles.some((role) => hasRole(currentUser, role))
}

export function displayRole(role: RoleCode) {
  return formatRoleLabel(role)
}

export function formatRoleLabel(role: RoleCode) {
  const labels: Record<string, string> = {
    ADMIN: 'Administrator',
    AGENT: 'Agent',
    BUYER: 'Buyer',
    OPERATIONS: 'Operations',
    PROFESSIONAL: 'Professional',
    PROPERTY_MANAGER: 'Property Manager',
    SELLER: 'Seller',
    TENANT: 'Tenant',
    VERIFIER: 'Verifier',
  }

  return labels[role] ?? titleCase(role)
}

export function fallbackRoleLabel(role: RoleCode) {
  return role
    .toLowerCase()
    .split('_')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ')
}
