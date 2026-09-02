import { useQuery } from '@tanstack/react-query'
import {
  filterSellerListings,
  filterSellerProperties,
  findSellerListingBundle,
  findSellerPropertyBundle,
  getMockSellerOverview,
  mockSellerPropertyBundles,
} from '@/features/seller/data/mockSellerWorkspace'
import type {
  SellerListingStatus,
  SellerPropertyStatus,
  SellerPropertyType,
} from '@/features/seller/types/seller.types'
import { queryKeys } from '@/services/query/queryKeys'

export function useSellerOverview() {
  return useQuery({
    queryKey: queryKeys.seller.overview(),
    queryFn: async () => getMockSellerOverview(),
    staleTime: 60_000,
  })
}

export function useSellerProperties(filters?: {
  propertyType?: 'all' | SellerPropertyType
  query?: string
  status?: 'all' | SellerPropertyStatus
}) {
  return useQuery({
    queryKey: [
      ...queryKeys.seller.properties(),
      filters?.query ?? '',
      filters?.status ?? 'all',
      filters?.propertyType ?? 'all',
    ],
    queryFn: async () =>
      filterSellerProperties({
        propertyType: filters?.propertyType ?? 'all',
        query: filters?.query ?? '',
        status: filters?.status ?? 'all',
      }),
    staleTime: 60_000,
  })
}

export function useSellerProperty(propertyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.seller.property(propertyId ?? 'missing'),
    queryFn: async () =>
      propertyId ? findSellerPropertyBundle(propertyId) ?? null : null,
    staleTime: 60_000,
  })
}

export function useSellerListings(filters?: {
  query?: string
  status?: 'all' | SellerListingStatus
}) {
  return useQuery({
    queryKey: [
      ...queryKeys.seller.listings(),
      filters?.query ?? '',
      filters?.status ?? 'all',
    ],
    queryFn: async () =>
      filterSellerListings({
        query: filters?.query ?? '',
        status: filters?.status ?? 'all',
      }),
    staleTime: 60_000,
  })
}

export function useSellerListing(listingId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.seller.listing(listingId ?? 'missing'),
    queryFn: async () =>
      listingId ? findSellerListingBundle(listingId) ?? null : null,
    staleTime: 60_000,
  })
}

export function useSellerVerifications() {
  return useQuery({
    queryKey: queryKeys.seller.verifications(),
    queryFn: async () =>
      mockSellerPropertyBundles
        .filter((bundle) => bundle.verification)
        .map((bundle) => ({
          property: bundle.property,
          verification: bundle.verification,
        })),
    staleTime: 60_000,
  })
}
