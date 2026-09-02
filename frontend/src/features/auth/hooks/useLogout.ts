import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@/constants/routes'
import { authApi } from '@/features/auth/api/authApi'
import { authQueryKeys } from '@/features/auth/api/authQueryKeys'
import { authStorage } from '@/features/auth/utils/authStorage'

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const refresh = authStorage.getRefreshToken()

      if (!refresh) {
        return null
      }

      return authApi.logout(refresh)
    },
    onSettled: () => {
      authStorage.clearTokens()
      queryClient.removeQueries({ queryKey: authQueryKeys.all })
      navigate(routePaths.home)
    },
  })
}
