import { SettingsDashboardPage } from '@/features/dashboard/pages/SettingsDashboardPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function SettingsPage() {
  usePageTitle('Settings')

  return <SettingsDashboardPage />
}
