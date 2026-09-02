export const apiEndpoints = {
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    refresh: '/auth/refresh/',
    logout: '/auth/logout/',
    me: '/auth/me/',
  },
  properties: {
    list: '/properties/',
    detail: (propertyId: string) => `/properties/${propertyId}/`,
  },
  listings: {
    list: '/listings/',
    detail: (listingId: string) => `/listings/${listingId}/`,
  },
  documents: {
    list: '/documents/',
    detail: (documentId: string) => `/documents/${documentId}/`,
    download: (documentId: string) => `/documents/${documentId}/download/`,
  },
  verifications: {
    list: '/verifications/',
    detail: (verificationId: string) => `/verifications/${verificationId}/`,
    assign: (verificationId: string) => `/verifications/${verificationId}/assign/`,
    checks: (verificationId: string) => `/verifications/${verificationId}/checks/`,
    decision: (verificationId: string) =>
      `/verifications/${verificationId}/decision/`,
    evidence: (verificationId: string) =>
      `/verifications/${verificationId}/evidence/`,
    findings: (verificationId: string) =>
      `/verifications/${verificationId}/findings/`,
    start: (verificationId: string) => `/verifications/${verificationId}/start/`,
    submit: (verificationId: string) =>
      `/verifications/${verificationId}/submit/`,
  },
} as const
