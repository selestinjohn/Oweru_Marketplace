import type {
  BackendDocumentStatus,
  BackendDocumentType,
  BackendSourceType,
  BackendVerificationStatus,
  DashboardTransactionStatus,
} from '@/features/dashboard/types/dashboard.types'
import { titleCase } from '@/lib/format'

export { formatRoleLabel } from '@/features/auth/utils/roles'

export function formatVerificationStatus(status: BackendVerificationStatus) {
  const labels: Record<BackendVerificationStatus, string> = {
    APPROVED: 'Verified',
    ASSIGNED: 'Assigned',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
    IN_PROGRESS: 'In Progress',
    REJECTED: 'Rejected',
    REQUESTED: 'Requested',
    SUBMITTED: 'Submitted',
  }

  return labels[status]
}

export function formatDocumentStatus(status: BackendDocumentStatus) {
  const labels: Record<BackendDocumentStatus, string> = {
    ACCEPTED: 'Accepted',
    EXPIRED: 'Expired',
    REJECTED: 'Rejected',
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
  }

  return labels[status]
}

export function formatDocumentType(type: BackendDocumentType) {
  const labels: Record<BackendDocumentType, string> = {
    IDENTITY: 'Identity Document',
    OTHER: 'Other Document',
    OWNERSHIP: 'Ownership Document',
    SURVEY: 'Survey Document',
    TAX: 'Tax Document',
    TITLE: 'Title Document',
  }

  return labels[type]
}

export function formatSourceType(source: BackendSourceType) {
  const labels: Record<string, string> = {
    AUTHORITY_OBTAINED: 'Authority Obtained',
    OTHER: 'Other Source',
    OWERU_ESTABLISHED: 'Established by OWERU',
    USER_SUPPLIED: 'User Supplied',
  }

  return labels[source] ?? titleCase(source)
}

export function formatTransactionStatus(status: DashboardTransactionStatus) {
  const labels: Record<DashboardTransactionStatus, string> = {
    ACCEPTED: 'Accepted',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed',
    IN_PROGRESS: 'In Progress',
    NEGOTIATION: 'Negotiation',
    OFFER_SUBMITTED: 'Offer Submitted',
  }

  return labels[status]
}
