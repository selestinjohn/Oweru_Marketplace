import { MessagesDashboardPage } from '@/features/dashboard/pages/MessagesDashboardPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function MessagesPage() {
  usePageTitle('Messages')

  return <MessagesDashboardPage />
}
