export const routePaths = {
  home: '/',
  properties: '/properties',
  propertyDetail: '/properties/:propertyId',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  onboarding: '/account/onboarding',
  dashboard: '/dashboard',
  savedProperties: '/dashboard/saved-properties',
  messages: '/dashboard/messages',
  transactions: '/dashboard/transactions',
  verifications: '/dashboard/verifications',
  documents: '/dashboard/documents',
  profile: '/dashboard/profile',
  settings: '/dashboard/settings',
  verificationWorkspace: '/dashboard/verification-workspace',
  verificationDetail: '/verification/:verificationId',
} as const

export type AppRoutePath = (typeof routePaths)[keyof typeof routePaths]
