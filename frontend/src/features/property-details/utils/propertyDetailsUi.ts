import type {
  DocumentAccessState,
  DocumentReviewStatus,
  PropertyStatus,
  VerificationCheckStatus,
  VerificationFindingSeverity,
  VerificationState,
  VerificationTimelineState,
  VerificationWorkflowStatus,
} from '@/types/property'

export function propertyStatusLabel(status: PropertyStatus) {
  const labels: Record<PropertyStatus, string> = {
    available: 'Available',
    inactive: 'Inactive',
    rented: 'Rented',
    reserved: 'Reserved',
    sold: 'Sold',
    under_offer: 'Under Offer',
  }

  return labels[status]
}

export function verificationStatusLabel(status: VerificationWorkflowStatus) {
  const labels: Record<VerificationWorkflowStatus, string> = {
    approved: 'Verified',
    assigned: 'Assigned',
    cancelled: 'Cancelled',
    expired: 'Expired',
    in_progress: 'In Progress',
    rejected: 'Rejected',
    requested: 'Requested',
    submitted: 'Submitted',
  }

  return labels[status]
}

export function verificationBadgeState(
  status: VerificationWorkflowStatus,
): VerificationState {
  if (status === 'approved') {
    return 'verified'
  }

  if (status === 'rejected' || status === 'cancelled' || status === 'expired') {
    return 'rejected'
  }

  if (status === 'requested' || status === 'assigned') {
    return 'pending'
  }

  return 'in_review'
}

export function statusTone(
  status:
    | DocumentReviewStatus
    | DocumentAccessState
    | VerificationCheckStatus
    | VerificationFindingSeverity
    | VerificationTimelineState
    | PropertyStatus
    | VerificationWorkflowStatus,
) {
  if (
    [
      'accepted',
      'approved',
      'available',
      'completed',
      'pass',
      'success',
    ].includes(status)
  ) {
    return 'success' as const
  }

  if (
    [
      'active',
      'assigned',
      'authorized_due_diligence',
      'in_progress',
      'low',
      'submitted',
      'under_offer',
      'under_review',
    ].includes(status)
  ) {
    return 'gold' as const
  }

  if (
    ['cancelled', 'critical', 'expired', 'fail', 'high', 'rejected'].includes(
      status,
    )
  ) {
    return 'danger' as const
  }

  return 'muted' as const
}

export function accessLabel(access: DocumentAccessState) {
  const labels: Record<DocumentAccessState, string> = {
    authorized_due_diligence: 'Authorized due diligence',
    login_required: 'Login required',
    restricted: 'Restricted',
  }

  return labels[access]
}

export function reviewStatusLabel(status: DocumentReviewStatus) {
  const labels: Record<DocumentReviewStatus, string> = {
    accepted: 'Accepted',
    pending: 'Pending',
    rejected: 'Rejected',
    under_review: 'Under Review',
  }

  return labels[status]
}

export function checkStatusLabel(status: VerificationCheckStatus) {
  const labels: Record<VerificationCheckStatus, string> = {
    completed: 'Completed',
    fail: 'Fail',
    in_progress: 'In Progress',
    not_applicable: 'Not Applicable',
    pass: 'Pass',
    pending: 'Pending',
  }

  return labels[status]
}

export function severityLabel(severity: VerificationFindingSeverity) {
  const labels: Record<VerificationFindingSeverity, string> = {
    critical: 'Critical',
    high: 'High',
    informational: 'Informational',
    low: 'Low',
    medium: 'Medium',
  }

  return labels[severity]
}
