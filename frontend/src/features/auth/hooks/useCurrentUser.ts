import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/authApi'
import { authQueryKeys } from '@/features/auth/api/authQueryKeys'
import { authStorage } from '@/features/auth/utils/authStorage'

export function useCurrentUser() {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: authApi.me,
    enabled: authStorage.hasSession(),
    retry: false,
    staleTime: 60_000,
  })
}
