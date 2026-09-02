import { VerificationDetailsPage } from '@/features/verification/pages/VerificationDetailsPage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function VerificationDetailPage() {
  usePageTitle('Verification Tracking')

  return <VerificationDetailsPage />
}
