import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/authApi'
import { authQueryKeys } from '@/features/auth/api/authQueryKeys'
import { authStorage } from '@/features/auth/utils/authStorage'
import type {
  AuthSession,
  CurrentUserResponse,
  LoginPayload,
} from '@/features/auth/types/auth.types'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (session) => {
      persistAuthSession(session, queryClient)
    },
  })
}

export function persistAuthSession(
  session: AuthSession,
  queryClient: ReturnType<typeof useQueryClient>,
) {
  if (session.tokens) {
    authStorage.setTokens(session.tokens)
  }

  const currentUser: CurrentUserResponse = {
    user: session.user,
    party: session.party,
    roles: session.roles,
    permissions: session.permissions,
  }

  queryClient.setQueryData(authQueryKeys.me(), currentUser)
}
