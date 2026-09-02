import { useQuery } from '@tanstack/react-query'
import { mockDashboardOverview } from '@/features/dashboard/data/mockDashboard'
import type { DashboardOverview } from '@/features/dashboard/types/dashboard.types'
import { queryKeys } from '@/services/query/queryKeys'

export function useDashboardOverview() {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: async (): Promise<DashboardOverview> => mockDashboardOverview,
    staleTime: 60_000,
  })
}
