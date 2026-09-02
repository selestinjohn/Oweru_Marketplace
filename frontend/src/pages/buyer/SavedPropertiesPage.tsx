import { SavedPropertiesDashboardPage } from '@/features/dashboard/pages/SavedPropertiesDashboardPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function SavedPropertiesPage() {
  usePageTitle('Saved properties')

  return <SavedPropertiesDashboardPage />
}
