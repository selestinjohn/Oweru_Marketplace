import { useQuery } from '@tanstack/react-query'
import { propertyDetailsApi } from '@/features/property-details/api/propertyDetailsApi'
import { queryKeys } from '@/services/query/queryKeys'

export function usePropertyDetails(propertyId: string | undefined) {
  return useQuery({
    enabled: Boolean(propertyId),
    queryKey: propertyId
      ? queryKeys.properties.detail(propertyId)
      : [...queryKeys.properties.all, 'detail', 'missing'],
    queryFn: async () => propertyDetailsApi.detail(propertyId ?? ''),
  })
}

export function useSimilarProperties(propertyId: string | undefined) {
  return useQuery({
    enabled: Boolean(propertyId),
    queryKey: propertyId
      ? [...queryKeys.properties.detail(propertyId), 'similar']
      : [...queryKeys.properties.all, 'detail', 'missing', 'similar'],
    queryFn: async () => propertyDetailsApi.similar(propertyId ?? ''),
  })
}
