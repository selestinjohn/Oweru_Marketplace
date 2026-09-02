import { useQuery } from '@tanstack/react-query'
import { verificationKeys } from '@/features/verification/api/verificationQueryKeys'
import { mockVerificationRecords } from '@/features/verification/data/mockVerifications'

export function useVerifications() {
  return useQuery({
    queryKey: verificationKeys.mine(),
    queryFn: async () => mockVerificationRecords,
    staleTime: 60_000,
  })
}
