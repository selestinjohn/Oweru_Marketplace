import { DocumentsDashboardPage } from '@/features/dashboard/pages/DocumentsDashboardPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function DashboardDocumentsPage() {
  usePageTitle('Documents')

  return <DocumentsDashboardPage />
}
