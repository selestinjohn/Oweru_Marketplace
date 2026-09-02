import type {
  CurrentUserResponse,
  RoleCode,
} from '@/features/auth/types/auth.types'
import { hasAnyRole } from '@/features/auth/utils/roles'
import type {
  VerificationDetails,
  VerificationStatus,
} from '@/features/verification/types/verification.types'

const reviewerRoles: RoleCode[] = ['ADMIN', 'OPERATIONS']

export function isAssignedVerifier(
  currentUser: CurrentUserResponse | null | undefined,
  verification: Pick<VerificationDetails, 'assigned_verifier'>,
) {
  return Boolean(
    currentUser?.user.id &&
      verification.assigned_verifier &&
      currentUser.user.id === verification.assigned_verifier,
  )
}

export function canShowStartAction(
  currentUser: CurrentUserResponse | null | undefined,
  verification: Pick<VerificationDetails, 'assigned_verifier' | 'status'>,
) {
  return (
    verification.status === 'ASSIGNED' &&
    canPerformVerificationWork(currentUser, verification)
  )
}

export function canShowWorkControls(
  currentUser: CurrentUserResponse | null | undefined,
  verification: Pick<VerificationDetails, 'assigned_verifier' | 'status'>,
) {
  return (
    verification.status === 'IN_PROGRESS' &&
    canPerformVerificationWork(currentUser, verification)
  )
}

export function canShowSubmitAction(
  currentUser: CurrentUserResponse | null | undefined,
  verification: Pick<VerificationDetails, 'assigned_verifier' | 'status'>,
) {
  return canShowWorkControls(currentUser, verification)
}

export function canShowDecisionControls(
  currentUser: CurrentUserResponse | null | undefined,
  verification: Pick<VerificationDetails, 'status'>,
) {
  return (
    verification.status === 'SUBMITTED' &&
    (hasAnyRole(currentUser, reviewerRoles) ||
      Boolean(currentUser?.permissions.includes('verification.review')))
  )
}

export function nextActionLabel(status: VerificationStatus) {
  const labels: Record<VerificationStatus, string> = {
    APPROVED: 'View verified record',
    ASSIGNED: 'Start Verification',
    CANCELLED: 'View record',
    EXPIRED: 'View expired record',
    IN_PROGRESS: 'Continue Verification',
    REJECTED: 'View decision',
    REQUESTED: 'View Details',
    SUBMITTED: 'View Submission',
  }

  return labels[status]
}

function canPerformVerificationWork(
  currentUser: CurrentUserResponse | null | undefined,
  verification: Pick<VerificationDetails, 'assigned_verifier'>,
) {
  return (
    isAssignedVerifier(currentUser, verification) &&
    (hasAnyRole(currentUser, ['VERIFIER', 'ADMIN', 'OPERATIONS']) ||
      Boolean(currentUser?.permissions.includes('verification.perform')))
  )
}
