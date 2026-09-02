import { useQuery } from '@tanstack/react-query'
import { verificationKeys } from '@/features/verification/api/verificationQueryKeys'
import { getMockVerification } from '@/features/verification/data/mockVerifications'

export class VerificationNotFoundError extends Error {
  constructor() {
    super('Verification not found')
  }
}

export function useVerification(verificationId: string | undefined) {
  return useQuery({
    enabled: Boolean(verificationId),
    queryKey: verificationKeys.detail(verificationId ?? 'unknown'),
    queryFn: async () => {
      const verification = getMockVerification(verificationId)

      if (!verification) {
        throw new VerificationNotFoundError()
      }

      return verification
    },
    staleTime: 60_000,
  })
}
