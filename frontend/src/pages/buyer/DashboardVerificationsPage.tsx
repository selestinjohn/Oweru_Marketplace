import { VerificationListPage } from '@/features/verification/pages/VerificationListPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function DashboardVerificationsPage() {
  usePageTitle('Verifications')

  return <VerificationListPage />
}
