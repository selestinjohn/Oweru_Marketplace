import { SellerOverviewPage } from '@/features/seller/pages/SellerOverviewPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function SellerDashboardPage() {
  usePageTitle('Seller Workspace')

  return <SellerOverviewPage />
}
