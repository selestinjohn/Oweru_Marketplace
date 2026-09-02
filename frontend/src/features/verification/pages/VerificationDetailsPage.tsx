import { useParams } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { useAuth } from '@/app/providers/authContext'
import {
  VerificationNotFoundError,
  useVerification,
} from '@/features/verification/hooks/useVerification'
import {
  canShowDecisionControls,
  canShowStartAction,
  canShowSubmitAction,
  canShowWorkControls,
} from '@/features/verification/utils/verificationPermissions'
import { VerificationChecklist } from '../components/VerificationChecklist'
import { VerificationDecisionCard } from '../components/VerificationDecisionCard'
import { VerificationDetailsSkeleton } from '../components/VerificationDetailsSkeleton'
import { VerificationEvidenceList } from '../components/VerificationEvidenceList'
import { VerificationFindings } from '../components/VerificationFindings'
import { VerificationImportantDates } from '../components/VerificationImportantDates'
import { VerificationNotFoundState } from '../components/VerificationEmptyState'
import { VerificationProgressHeader } from '../components/VerificationProgressHeader'
import { VerificationPropertyContextCard } from '../components/VerificationPropertyContextCard'
import { VerificationSummaryCard } from '../components/VerificationSummaryCard'
import { VerificationTimeline } from '../components/VerificationTimeline'
import { VerificationWorkflowActions } from '../components/VerificationWorkflowActions'
import { SubmissionReadiness } from '../components/SubmissionReadiness'

export function VerificationDetailsPage() {
  const { verificationId } = useParams()
  const { currentUser } = useAuth()
  const verificationQuery = useVerification(verificationId)

  if (verificationQuery.isLoading) {
    return <VerificationDetailsSkeleton />
  }

  if (verificationQuery.isError) {
    if (verificationQuery.error instanceof VerificationNotFoundError) {
      return <VerificationNotFoundState />
    }

    return (
      <ErrorState
        title="Unable to load verification"
        message="OWERU could not load this verification record. Please try again."
        action={{
          label: 'Try Again',
          onClick: () => void verificationQuery.refetch(),
        }}
      />
    )
  }

  if (!verificationQuery.data) {
    return <VerificationNotFoundState />
  }

  const verification = verificationQuery.data
  const canWork = canShowWorkControls(currentUser, verification)
  const canStart = canShowStartAction(currentUser, verification)
  const canSubmit = canShowSubmitAction(currentUser, verification)
  const canDecide = canShowDecisionControls(currentUser, verification)

  return (
    <div className="grid gap-6">
      <VerificationProgressHeader verification={verification} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <main className="grid gap-6">
          <VerificationTimeline verification={verification} />
          <VerificationChecklist canEdit={canWork} verification={verification} />
          <VerificationFindings canEdit={canWork} verification={verification} />
          <VerificationEvidenceList
            canEdit={canWork}
            verification={verification}
          />
          <VerificationDecisionCard
            canDecide={canDecide}
            verification={verification}
          />
        </main>

        <aside className="grid gap-5 xl:sticky xl:top-24">
          <VerificationSummaryCard verification={verification} />
          <VerificationWorkflowActions
            canStart={canStart}
            canSubmit={canSubmit}
            verification={verification}
          />
          <SubmissionReadiness verification={verification} />
          <VerificationPropertyContextCard verification={verification} />
          <VerificationImportantDates verification={verification} />
        </aside>
      </div>
    </div>
  )
}
