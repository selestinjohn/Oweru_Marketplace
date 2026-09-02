import { useMutation, useQueryClient } from '@tanstack/react-query'
import { verificationApi } from '@/features/verification/api/verificationApi'
import { verificationKeys } from '@/features/verification/api/verificationQueryKeys'
import { queryKeys } from '@/services/query/queryKeys'
import { sellerApi } from '@/features/seller/api/sellerApi'
import type {
  CreateDocumentPayload,
  CreateListingPayload,
  CreatePropertyPayload,
  ListingWorkflowAction,
  UpdateListingPayload,
  UpdatePropertyPayload,
} from '@/features/seller/types/seller.types'

function useSellerInvalidation() {
  const queryClient = useQueryClient()

  return {
    invalidateAll() {
      void queryClient.invalidateQueries({ queryKey: queryKeys.seller.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
    },
    invalidateProperty(propertyId: string) {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.property(propertyId),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.documents.property(propertyId),
      })
      void queryClient.invalidateQueries({
        queryKey: verificationKeys.list(),
      })
    },
    invalidateListing(listingId: string) {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.seller.listing(listingId),
      })
    },
  }
}

export function useCreateProperty() {
  const invalidation = useSellerInvalidation()

  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) =>
      sellerApi.createProperty(payload),
    onSuccess: () => {
      invalidation.invalidateAll()
    },
  })
}

export function useUpdateProperty(propertyId: string) {
  const invalidation = useSellerInvalidation()

  return useMutation({
    mutationFn: (payload: UpdatePropertyPayload) =>
      sellerApi.updateProperty(propertyId, payload),
    onSuccess: () => {
      invalidation.invalidateProperty(propertyId)
      invalidation.invalidateAll()
    },
  })
}

export function useCreateListing() {
  const invalidation = useSellerInvalidation()

  return useMutation({
    mutationFn: (payload: CreateListingPayload) =>
      sellerApi.createListing(payload),
    onSuccess: () => {
      invalidation.invalidateAll()
    },
  })
}

export function useUpdateListing(listingId: string) {
  const invalidation = useSellerInvalidation()

  return useMutation({
    mutationFn: (payload: UpdateListingPayload) =>
      sellerApi.updateListing(listingId, payload),
    onSuccess: () => {
      invalidation.invalidateListing(listingId)
      invalidation.invalidateAll()
    },
  })
}

export function useListingWorkflowAction(listingId: string) {
  const invalidation = useSellerInvalidation()

  return useMutation({
    mutationFn: (action: ListingWorkflowAction) =>
      sellerApi.transitionListing(listingId, action),
    onSuccess: () => {
      invalidation.invalidateListing(listingId)
      invalidation.invalidateAll()
    },
  })
}

export function useCreateSellerDocument(propertyId: string) {
  const invalidation = useSellerInvalidation()

  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) =>
      sellerApi.createDocument(payload),
    onSuccess: () => {
      invalidation.invalidateProperty(propertyId)
      invalidation.invalidateAll()
    },
  })
}

export function useRequestSellerVerification(propertyId: string) {
  const invalidation = useSellerInvalidation()

  return useMutation({
    mutationFn: () => verificationApi.request({ property: propertyId }),
    onSuccess: () => {
      invalidation.invalidateProperty(propertyId)
      invalidation.invalidateAll()
    },
  })
}
