import { apiEndpoints } from './endpoints'
import { httpClient } from './httpClient'
import type { PaginatedResponse } from '@/types/api'
import type { PropertySummary } from '@/types/property'

export type PropertyListParams = {
  propertyType?: string
  transactionType?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  minSize?: number
  maxSize?: number
  page?: number
  pageSize?: number
}

export const propertiesService = {
  async list(params?: PropertyListParams) {
    const response = await httpClient.get<PaginatedResponse<PropertySummary>>(
      apiEndpoints.properties.list,
      { params },
    )
    return response.data
  },

  async detail(propertyId: string) {
    const response = await httpClient.get<PropertySummary>(
      apiEndpoints.properties.detail(propertyId),
    )
    return response.data
  },
}
