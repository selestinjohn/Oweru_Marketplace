import { apiEndpoints } from '@/services/api/endpoints'
import { httpClient } from '@/services/api/httpClient'
import type {
  AuthSession,
  CurrentUserResponse,
  LoginPayload,
  RegisterPayload,
} from '@/features/auth/types/auth.types'

export const authApi = {
  async login(payload: LoginPayload) {
    const response = await httpClient.post<AuthSession>(
      apiEndpoints.auth.login,
      payload,
    )
    return response.data
  },

  async register(payload: RegisterPayload) {
    const response = await httpClient.post<AuthSession>(
      apiEndpoints.auth.register,
      payload,
    )
    return response.data
  },

  async me() {
    const response = await httpClient.get<CurrentUserResponse>(
      apiEndpoints.auth.me,
    )
    return response.data
  },

  async logout(refresh: string) {
    const response = await httpClient.post<{ detail: string }>(
      apiEndpoints.auth.logout,
      { refresh },
    )
    return response.data
  },
}
