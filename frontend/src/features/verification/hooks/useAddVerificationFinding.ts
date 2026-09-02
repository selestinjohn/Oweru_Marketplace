import { useMutation } from '@tanstack/react-query'
import { verificationApi } from '@/features/verification/api/verificationApi'
import type { AddVerificationFindingPayload } from '@/features/verification/types/verification.types'
import { useVerificationInvalidation } from './useVerificationInvalidation'

export function useAddVerificationFinding(verificationId: string) {
  const invalidateVerification = useVerificationInvalidation(verificationId)

  return useMutation({
    mutationFn: (payload: AddVerificationFindingPayload) =>
      verificationApi.addFinding(verificationId, payload),
    onSuccess: invalidateVerification,
  })
}
