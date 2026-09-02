import { useQueryClient } from '@tanstack/react-query'
import { verificationKeys } from '@/features/verification/api/verificationQueryKeys'
import { queryKeys } from '@/services/query/queryKeys'

export function useVerificationInvalidation(verificationId?: string) {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.invalidateQueries({ queryKey: verificationKeys.list() })
    void queryClient.invalidateQueries({ queryKey: verificationKeys.mine() })
    void queryClient.invalidateQueries({ queryKey: verificationKeys.workspace() })
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })

    if (verificationId) {
      void queryClient.invalidateQueries({
        queryKey: verificationKeys.detail(verificationId),
      })
    }
  }
}
