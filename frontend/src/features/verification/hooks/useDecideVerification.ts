import { useMutation } from '@tanstack/react-query'
import { verificationApi } from '@/features/verification/api/verificationApi'
import type { DecideVerificationPayload } from '@/features/verification/types/verification.types'
import { useVerificationInvalidation } from './useVerificationInvalidation'

export function useDecideVerification(verificationId: string) {
  const invalidateVerification = useVerificationInvalidation(verificationId)

  return useMutation({
    mutationFn: (payload: DecideVerificationPayload) =>
      verificationApi.decide(verificationId, payload),
    onSuccess: invalidateVerification,
  })
}
