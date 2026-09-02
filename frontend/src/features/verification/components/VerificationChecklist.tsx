import { EmptyState } from '@/components/feedback/EmptyState'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { completedCheckCount } from '@/features/verification/utils/verificationStatus'
import { VerificationCheckItem } from './VerificationCheckItem'

export function VerificationChecklist({
  canEdit,
  verification,
}: {
  canEdit: boolean
  verification: VerificationDetails
}) {
  if (!verification.checks.length) {
    return (
      <EmptyState
        title="No verification checklist configured"
        message="Checklist items will appear here once the verification workflow has configured checks for this property."
      />
    )
  }

  return (
    <section className="grid gap-4" aria-labelledby="verification-checklist-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">
            Checklist
          </p>
          <h2
            className="font-display text-2xl font-bold text-foreground"
            id="verification-checklist-title"
          >
            What needs to be checked
          </h2>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {completedCheckCount(verification.checks)} of{' '}
          {verification.checks.length} checks recorded
        </p>
      </div>

      <div className="grid gap-3">
        {verification.checks.map((check) => (
          <VerificationCheckItem
            canEdit={canEdit}
            check={check}
            key={check.id}
            verificationId={verification.id}
          />
        ))}
      </div>
    </section>
  )
}
