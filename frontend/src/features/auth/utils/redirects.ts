import { routePaths } from '@/constants/routes'

export function getSafeRedirectPath(value: string | null | undefined) {
  if (!value?.startsWith('/')) {
    return routePaths.dashboard
  }

  if (value.startsWith('//') || value.includes('://')) {
    return routePaths.dashboard
  }

  return value
}
