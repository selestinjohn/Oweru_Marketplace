import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { authStorage } from '@/features/auth/utils/authStorage'
import type { ApiErrorPayload } from '@/types/api'
import { apiEndpoints } from './endpoints'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 20_000,
})

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 20_000,
})

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStorage.getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const refresh = authStorage.getRefreshToken()

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      !refresh
    ) {
      if (error.response?.status === 401 && !refresh) {
        clearExpiredSession()
      }

      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const response = await refreshClient.post<{
        access: string
        refresh?: string
      }>(apiEndpoints.auth.refresh, { refresh })

      authStorage.setTokens({
        access: response.data.access,
        refresh: response.data.refresh ?? refresh,
      })

      return httpClient(originalRequest)
    } catch (refreshError) {
      clearExpiredSession()
      return Promise.reject(refreshError)
    }
  },
)

function clearExpiredSession() {
  authStorage.clearTokens()

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('oweru:auth:session-cleared'))
  }
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorPayload>
  const payload = axiosError.response?.data

  return (
    payload?.error?.message ??
    payload?.detail ??
    axiosError.message ??
    fallback
  )
}
