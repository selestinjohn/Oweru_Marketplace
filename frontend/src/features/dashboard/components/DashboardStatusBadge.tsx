import { Badge } from '@/components/ui/Badge'
import type {
  BackendDocumentStatus,
  BackendVerificationStatus,
  DashboardTransactionStatus,
} from '@/features/dashboard/types/dashboard.types'
import {
  formatDocumentStatus,
  formatTransactionStatus,
  formatVerificationStatus,
} from '@/features/dashboard/utils/dashboardFormat'

type StatusKind = 'document' | 'transaction' | 'verification'

export function DashboardStatusBadge({
  kind,
  status,
}: {
  kind: StatusKind
  status: BackendDocumentStatus | BackendVerificationStatus | DashboardTransactionStatus
}) {
  if (kind === 'verification') {
    const value = status as BackendVerificationStatus
    return (
      <Badge tone={verificationTone(value)}>
        {formatVerificationStatus(value)}
      </Badge>
    )
  }

  if (kind === 'document') {
    const value = status as BackendDocumentStatus
    return <Badge tone={documentTone(value)}>{formatDocumentStatus(value)}</Badge>
  }

  const value = status as DashboardTransactionStatus
  return <Badge tone={transactionTone(value)}>{formatTransactionStatus(value)}</Badge>
}

function verificationTone(status: BackendVerificationStatus) {
  if (status === 'APPROVED') return 'success' as const
  if (status === 'REJECTED' || status === 'CANCELLED') return 'danger' as const
  if (status === 'IN_PROGRESS' || status === 'SUBMITTED') return 'gold' as const
  return 'muted' as const
}

function documentTone(status: BackendDocumentStatus) {
  if (status === 'ACCEPTED') return 'success' as const
  if (status === 'REJECTED' || status === 'EXPIRED') return 'danger' as const
  if (status === 'UNDER_REVIEW') return 'gold' as const
  return 'muted' as const
}

function transactionTone(status: DashboardTransactionStatus) {
  if (status === 'COMPLETED') return 'success' as const
  if (status === 'CANCELLED') return 'danger' as const
  if (status === 'ACCEPTED' || status === 'IN_PROGRESS') return 'gold' as const
  return 'navy' as const
}
