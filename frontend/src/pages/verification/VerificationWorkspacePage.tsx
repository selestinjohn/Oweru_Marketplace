import { VerificationWorkspacePage as VerificationWorkspaceFeaturePage } from '@/features/verification/pages/VerificationWorkspacePage'
import { usePageTitle } from '@/hooks/usePageTitle'

export function VerificationWorkspacePage() {
  usePageTitle('Verification Workspace')

  return <VerificationWorkspaceFeaturePage />
}
