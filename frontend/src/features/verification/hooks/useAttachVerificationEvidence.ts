import { useMutation } from '@tanstack/react-query'
import { verificationApi } from '@/features/verification/api/verificationApi'
import type { AttachVerificationEvidencePayload } from '@/features/verification/types/verification.types'
import { useVerificationInvalidation } from './useVerificationInvalidation'

export function useAttachVerificationEvidence(verificationId: string) {
  const invalidateVerification = useVerificationInvalidation(verificationId)

  return useMutation({
    mutationFn: (payload: AttachVerificationEvidencePayload) =>
      verificationApi.attachEvidence(verificationId, payload),
    onSuccess: invalidateVerification,
  })
}
