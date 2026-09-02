import { TransactionsDashboardPage } from '@/features/dashboard/pages/TransactionsDashboardPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function DashboardTransactionsPage() {
  usePageTitle('Transactions')

  return <TransactionsDashboardPage />
}
