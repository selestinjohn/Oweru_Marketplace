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
    create: '/properties/',
    detail: (propertyId: string) => `/properties/${propertyId}/`,
  },
  listings: {
    create: '/listings/',
    list: '/listings/',
    detail: (listingId: string) => `/listings/${listingId}/`,
    mine: '/listings/mine/',
    pause: (listingId: string) => `/listings/${listingId}/pause/`,
    publish: (listingId: string) => `/listings/${listingId}/publish/`,
    resume: (listingId: string) => `/listings/${listingId}/resume/`,
    close: (listingId: string) => `/listings/${listingId}/close/`,
  },
  documents: {
    create: '/documents/',
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
