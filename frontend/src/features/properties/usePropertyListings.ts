import { useQuery } from '@tanstack/react-query'
import { getMockProperties } from '@/data/mockProperties'
import { queryKeys } from '@/services/query/queryKeys'
import type { PropertyFilters, PropertySort } from '@/types/property'

export function usePropertyListings({
  filters,
  page,
  pageSize,
  sort,
}: {
  filters: PropertyFilters
  page: number
  pageSize: number
  sort: PropertySort
}) {
  return useQuery({
    queryKey: [...queryKeys.properties.lists(), filters, sort, page, pageSize],
    queryFn: async () => getMockProperties({ filters, sort, page, pageSize }),
  })
}
