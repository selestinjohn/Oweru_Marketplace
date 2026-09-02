import type { ID } from '@/types/api'

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED'

export type PartyType = 'PERSON' | 'ORGANIZATION'

export type IdentityStatus =
  | 'NOT_VERIFIED'
  | 'PENDING'
  | 'VERIFIED'
  | 'EXPIRED'
  | 'REJECTED'

export type KnownRoleCode =
  | 'BUYER'
  | 'SELLER'
  | 'AGENT'
  | 'VERIFIER'
  | 'PROFESSIONAL'
  | 'TENANT'
  | 'PROPERTY_MANAGER'
  | 'ADMIN'
  | 'OPERATIONS'

export type RoleCode = KnownRoleCode | (string & {})

export type PermissionCode = string

export type AuthTokens = {
  access: string
  refresh: string
}

export type AuthUser = {
  id: ID
  email: string | null
  phone_number: string | null
  status: AccountStatus
  date_joined: string
}

export type Party = {
  id: ID
  display_name: string
  party_type: PartyType
  identity_status: IdentityStatus
}

export type CurrentUserResponse = {
  user: AuthUser
  party: Party | null
  roles: RoleCode[]
  permissions: PermissionCode[]
}

export type AuthSession = CurrentUserResponse & {
  tokens?: AuthTokens
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  display_name: string
  email?: string
  phone_number?: string
  password: string
}

export type NormalizedAuthError = {
  formError?: string
  fieldErrors: Record<string, string>
  code?: string
}
