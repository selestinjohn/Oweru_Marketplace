import { useMutation } from '@tanstack/react-query'
import { verificationApi } from '@/features/verification/api/verificationApi'
import { useVerificationInvalidation } from './useVerificationInvalidation'

export function useSubmitVerification(verificationId: string) {
  const invalidateVerification = useVerificationInvalidation(verificationId)

  return useMutation({
    mutationFn: () => verificationApi.submit(verificationId),
    onSuccess: invalidateVerification,
  })
}
