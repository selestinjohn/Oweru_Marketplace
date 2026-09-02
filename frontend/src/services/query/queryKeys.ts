export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  properties: {
    all: ['properties'] as const,
    lists: () => [...queryKeys.properties.all, 'list'] as const,
    detail: (propertyId: string) =>
      [...queryKeys.properties.all, 'detail', propertyId] as const,
  },
  listings: {
    all: ['listings'] as const,
    lists: () => [...queryKeys.listings.all, 'list'] as const,
    detail: (listingId: string) =>
      [...queryKeys.listings.all, 'detail', listingId] as const,
  },
  documents: {
    all: ['documents'] as const,
    mine: () => [...queryKeys.documents.all, 'mine'] as const,
    download: (documentId: string) =>
      [...queryKeys.documents.all, 'download', documentId] as const,
  },
  verifications: {
    all: ['verifications'] as const,
    list: () => [...queryKeys.verifications.all, 'list'] as const,
    mine: () => [...queryKeys.verifications.all, 'mine'] as const,
    workspace: () => [...queryKeys.verifications.all, 'workspace'] as const,
    detail: (verificationId: string) =>
      [...queryKeys.verifications.all, 'detail', verificationId] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    overview: () => [...queryKeys.dashboard.all, 'overview'] as const,
  },
}
