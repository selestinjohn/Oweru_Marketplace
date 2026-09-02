import { useQuery } from '@tanstack/react-query'
import { verificationKeys } from '@/features/verification/api/verificationQueryKeys'
import { getMockVerificationWorkspace } from '@/features/verification/data/mockVerifications'

export function useVerificationWorkspace() {
  return useQuery({
    queryKey: verificationKeys.workspace(),
    queryFn: async () => getMockVerificationWorkspace(),
    staleTime: 60_000,
  })
}
