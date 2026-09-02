import type { AuthTokens } from '@/features/auth/types/auth.types'

const ACCESS_TOKEN_KEY = 'oweru.auth.access'
const REFRESH_TOKEN_KEY = 'oweru.auth.refresh'

function hasStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

// Keep token persistence behind this module so OWERU can later swap
// localStorage for HttpOnly cookie-backed sessions without touching UI code.
export const authStorage = {
  getAccessToken() {
    if (!hasStorage()) {
      return null
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  getRefreshToken() {
    if (!hasStorage()) {
      return null
    }

    return window.localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  getTokens(): AuthTokens | null {
    const access = authStorage.getAccessToken()
    const refresh = authStorage.getRefreshToken()

    if (!access || !refresh) {
      return null
    }

    return { access, refresh }
  },

  setTokens(tokens: AuthTokens) {
    if (!hasStorage()) {
      return
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
  },

  clearTokens() {
    if (!hasStorage()) {
      return
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY)
    window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  hasSession() {
    return Boolean(authStorage.getAccessToken())
  },
}
