import { useMutation } from '@tanstack/react-query'
import { verificationApi } from '@/features/verification/api/verificationApi'
import type { AddVerificationCheckPayload } from '@/features/verification/types/verification.types'
import { useVerificationInvalidation } from './useVerificationInvalidation'

export function useAddVerificationCheck(verificationId: string) {
  const invalidateVerification = useVerificationInvalidation(verificationId)

  return useMutation({
    mutationFn: (payload: AddVerificationCheckPayload) =>
      verificationApi.addCheck(verificationId, payload),
    onSuccess: invalidateVerification,
  })
}
