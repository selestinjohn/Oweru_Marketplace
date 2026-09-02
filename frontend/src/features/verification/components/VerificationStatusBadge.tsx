import { Badge } from '@/components/ui/Badge'
import type { VerificationStatus } from '@/features/verification/types/verification.types'
import {
  verificationStatusLabel,
  verificationStatusTone,
} from '@/features/verification/utils/verificationStatus'

export function VerificationStatusBadge({
  status,
}: {
  status: VerificationStatus
}) {
  return (
    <Badge tone={verificationStatusTone(status)}>
      {verificationStatusLabel(status)}
    </Badge>
  )
}
