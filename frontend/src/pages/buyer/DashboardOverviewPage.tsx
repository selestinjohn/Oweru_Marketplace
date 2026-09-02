import { BuyerDashboardPage } from '@/features/dashboard/pages/BuyerDashboardPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function DashboardOverviewPage() {
  usePageTitle('Dashboard')

  return <BuyerDashboardPage />
}
