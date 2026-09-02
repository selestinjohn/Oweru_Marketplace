import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/authApi'
import type { RegisterPayload } from '@/features/auth/types/auth.types'
import { persistAuthSession } from './useLogin'

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (session) => {
      persistAuthSession(session, queryClient)
    },
  })
}
