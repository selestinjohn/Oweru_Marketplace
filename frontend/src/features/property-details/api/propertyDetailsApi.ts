import {
  getMockPropertyDetail,
  getMockSimilarProperties,
} from '@/features/property-details/data/mockPropertyDetails'

export const propertyDetailsApi = {
  async detail(propertyId: string) {
    return getMockPropertyDetail(propertyId) ?? null
  },

  async similar(propertyId: string) {
    return getMockSimilarProperties(propertyId)
  },
}
