import { apiEndpoints } from './endpoints'
import { httpClient } from './httpClient'
import type { PaginatedResponse } from '@/types/api'
import type { PropertySummary } from '@/types/property'

export const listingsService = {
  async list() {
    const response = await httpClient.get<PaginatedResponse<PropertySummary>>(
      apiEndpoints.listings.list,
    )
    return response.data
  },

  async detail(listingId: string) {
    const response = await httpClient.get<PropertySummary>(
      apiEndpoints.listings.detail(listingId),
    )
    return response.data
  },
}
