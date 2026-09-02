import { ProfileDashboardPage } from '@/features/dashboard/pages/ProfileDashboardPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function ProfilePage() {
  usePageTitle('Profile')

  return <ProfileDashboardPage />
}
