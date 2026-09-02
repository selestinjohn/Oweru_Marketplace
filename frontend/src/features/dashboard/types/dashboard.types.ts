import type { LucideIcon } from 'lucide-react'
import type { RoleCode } from '@/features/auth/types/auth.types'
import type { ID } from '@/types/api'
import type { PropertyListing } from '@/types/property'

export type DashboardNavItem = {
  href: string
  icon: LucideIcon
  label: string
  roles?: RoleCode[]
}

export type DashboardNavSection = {
  items: DashboardNavItem[]
  label: string
}

export type DashboardStatTone = 'gold' | 'navy' | 'success' | 'warning'

export type DashboardStat = {
  context: string
  icon: LucideIcon
  id: ID
  label: string
  tone: DashboardStatTone
  value: string
}

export type DashboardActivityType =
  | 'property_viewed'
  | 'property_saved'
  | 'verification'
  | 'message'
  | 'transaction'

export type DashboardActivity = {
  description: string
  href?: string
  id: ID
  timestamp: string
  title: string
  type: DashboardActivityType
}

export type BackendVerificationStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'

export type BackendDocumentStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'

export type BackendDocumentType =
  | 'TITLE'
  | 'OWNERSHIP'
  | 'TAX'
  | 'IDENTITY'
  | 'SURVEY'
  | 'OTHER'

export type BackendSourceType =
  | 'USER_SUPPLIED'
  | 'AUTHORITY_OBTAINED'
  | 'OWERU_ESTABLISHED'
  | 'OTHER'
  | string

export type BackendVerificationSummary = {
  assigned_at: string | null
  assigned_verifier: ID | null
  created_at: string
  decided_at: string | null
  decision_notes: string
  id: ID
  property: ID
  requested_at: string
  requested_by: ID
  started_at: string | null
  status: BackendVerificationStatus
  submitted_at: string | null
  updated_at: string
}

export type BackendDocumentSummary = {
  created_at: string
  description: string
  document_type: BackendDocumentType
  expires_at: string | null
  id: ID
  issued_at: string | null
  property: ID
  sighted_at: string | null
  source_type: BackendSourceType
  status: BackendDocumentStatus
  updated_at: string
  uploaded_by: ID
}

export type DashboardVerificationItem = {
  href: string
  id: ID
  lastUpdate: string
  propertyId: ID
  propertyTitle: string
  requestedDate: string
  status: BackendVerificationStatus
}

export type DashboardTransactionStatus =
  | 'OFFER_SUBMITTED'
  | 'NEGOTIATION'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type DashboardTransaction = {
  actionLabel: string
  id: ID
  lastUpdate: string
  nextStep: string
  propertyTitle: string
  status: DashboardTransactionStatus
  transactionType: 'Purchase' | 'Rental'
}

export type SavedProperty = {
  note: string
  property: PropertyListing
  savedAt: string
}

export type DashboardConversation = {
  id: ID
  lastMessage: string
  participant: string
  propertyTitle?: string
  timestamp: string
  unreadCount: number
}

export type DashboardDocument = {
  canDownload: boolean
  documentType: BackendDocumentType
  id: ID
  propertyTitle: string
  recordedDate: string
  source: BackendSourceType
  status: BackendDocumentStatus
}

export type DashboardNotification = {
  id: ID
  message: string
  timestamp: string
  title: string
}

export type DashboardOverview = {
  activities: DashboardActivity[]
  conversations: DashboardConversation[]
  documents: DashboardDocument[]
  notifications: DashboardNotification[]
  recommendedProperties: PropertyListing[]
  savedProperties: SavedProperty[]
  stats: DashboardStat[]
  transactions: DashboardTransaction[]
  verifications: DashboardVerificationItem[]
}
