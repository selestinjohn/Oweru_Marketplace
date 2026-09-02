import type { BadgeProps } from '@/components/ui/Badge'
import type {
  EvidenceSourceType,
  FindingSeverity,
  VerificationCheckStatus,
  VerificationDetails,
  VerificationStatus,
  VerificationTimelineStage,
} from '@/features/verification/types/verification.types'

export function verificationStatusLabel(status: VerificationStatus) {
  const labels: Record<VerificationStatus, string> = {
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

export function verificationStatusTone(
  status: VerificationStatus,
): BadgeProps['tone'] {
  const tones: Record<VerificationStatus, BadgeProps['tone']> = {
    APPROVED: 'success',
    ASSIGNED: 'navy',
    CANCELLED: 'muted',
    EXPIRED: 'gold',
    IN_PROGRESS: 'gold',
    REJECTED: 'danger',
    REQUESTED: 'muted',
    SUBMITTED: 'navy',
  }

  return tones[status]
}

export function checkStatusLabel(status: VerificationCheckStatus) {
  const labels: Record<VerificationCheckStatus, string> = {
    FAIL: 'Fail',
    NOT_APPLICABLE: 'Not Applicable',
    NOT_STARTED: 'Not Started',
    PASS: 'Pass',
  }

  return labels[status]
}

export function checkStatusTone(
  status: VerificationCheckStatus,
): BadgeProps['tone'] {
  const tones: Record<VerificationCheckStatus, BadgeProps['tone']> = {
    FAIL: 'danger',
    NOT_APPLICABLE: 'muted',
    NOT_STARTED: 'muted',
    PASS: 'success',
  }

  return tones[status]
}

export function severityLabel(severity: FindingSeverity) {
  const labels: Record<FindingSeverity, string> = {
    CRITICAL: 'Critical',
    HIGH: 'High',
    INFORMATIONAL: 'Informational',
    LOW: 'Low',
    MEDIUM: 'Medium',
  }

  return labels[severity]
}

export function severityTone(severity: FindingSeverity): BadgeProps['tone'] {
  const tones: Record<FindingSeverity, BadgeProps['tone']> = {
    CRITICAL: 'danger',
    HIGH: 'danger',
    INFORMATIONAL: 'muted',
    LOW: 'navy',
    MEDIUM: 'gold',
  }

  return tones[severity]
}

export function evidenceSourceLabel(source: EvidenceSourceType) {
  const labels: Record<EvidenceSourceType, string> = {
    AUTHORITY_OBTAINED: 'Authority Obtained',
    OWERU_ESTABLISHED: 'Established by OWERU',
    USER_SUPPLIED: 'User Supplied',
  }

  return labels[source]
}

export function buildVerificationTimeline(
  verification: VerificationDetails,
): VerificationTimelineStage[] {
  const status = verification.status
  const isRejected = status === 'REJECTED'
  const isApproved = status === 'APPROVED' || status === 'EXPIRED'
  const isCancelled = status === 'CANCELLED'

  const stages: VerificationTimelineStage[] = [
    {
      date: verification.requested_at,
      description: 'The verification request was opened in OWERU.',
      key: 'REQUESTED',
      label: 'Requested',
      state: status === 'REQUESTED' ? 'current' : 'completed',
    },
    {
      date: verification.assigned_at,
      description: 'A verifier is selected to handle the property review.',
      key: 'ASSIGNED',
      label: 'Assigned',
      state:
        status === 'REQUESTED'
          ? 'pending'
          : status === 'ASSIGNED'
            ? 'current'
            : 'completed',
    },
    {
      date: verification.started_at,
      description: 'Checks, findings, and evidence are being reviewed.',
      key: 'IN_PROGRESS',
      label: 'In Progress',
      state:
        status === 'REQUESTED' || status === 'ASSIGNED'
          ? 'pending'
          : status === 'IN_PROGRESS'
            ? 'current'
            : 'completed',
    },
    {
      date: verification.submitted_at,
      description: 'The verifier has submitted the record for decision.',
      key: 'SUBMITTED',
      label: 'Submitted',
      state:
        status === 'SUBMITTED'
          ? 'current'
          : isApproved || isRejected
            ? 'completed'
            : 'pending',
    },
    {
      date: verification.decided_at,
      description: isRejected
        ? 'The verification was reviewed and not approved.'
        : 'A decision is recorded after verification review.',
      key: 'DECISION',
      label: isApproved ? 'Verified' : isRejected ? 'Rejected' : 'Decision',
      state: isRejected ? 'failed' : isApproved ? 'completed' : 'pending',
    },
  ]

  if (status === 'EXPIRED') {
    stages.push({
      date: verification.decision?.expires_at,
      description: 'The previous verified record is no longer current.',
      key: 'EXPIRED',
      label: 'Expired',
      state: 'expired',
    })
  }

  if (isCancelled) {
    stages.push({
      date: verification.updated_at,
      description: 'The verification workflow was cancelled.',
      key: 'CANCELLED',
      label: 'Cancelled',
      state: 'cancelled',
    })
  }

  return stages
}

export function completedCheckCount(checks: VerificationDetails['checks']) {
  return checks.filter((check) =>
    ['PASS', 'FAIL', 'NOT_APPLICABLE'].includes(check.status),
  ).length
}
