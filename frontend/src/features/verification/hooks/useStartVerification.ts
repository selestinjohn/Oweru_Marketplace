import { useMutation } from '@tanstack/react-query'
import { verificationApi } from '@/features/verification/api/verificationApi'
import { useVerificationInvalidation } from './useVerificationInvalidation'

export function useStartVerification(verificationId: string) {
  const invalidateVerification = useVerificationInvalidation(verificationId)

  return useMutation({
    mutationFn: () => verificationApi.start(verificationId),
    onSuccess: invalidateVerification,
  })
}
