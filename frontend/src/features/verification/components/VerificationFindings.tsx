import { EmptyState } from '@/components/feedback/EmptyState'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { AddFindingForm } from './AddFindingForm'
import { VerificationFindingCard } from './VerificationFindingCard'

export function VerificationFindings({
  canEdit,
  verification,
}: {
  canEdit: boolean
  verification: VerificationDetails
}) {
  return (
    <section className="grid gap-4" aria-labelledby="verification-findings-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">
            Findings
          </p>
          <h2
            className="font-display text-2xl font-bold text-foreground"
            id="verification-findings-title"
          >
            What has been recorded
          </h2>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {verification.findings.length} finding
          {verification.findings.length === 1 ? '' : 's'}
        </p>
      </div>

      {canEdit && <AddFindingForm verification={verification} />}

      {!verification.findings.length ? (
        <EmptyState
          title="No findings recorded"
          message="Recorded verification findings will appear here when the assigned verifier adds them."
        />
      ) : (
        <div className="grid gap-3">
          {verification.findings.map((finding) => (
            <VerificationFindingCard finding={finding} key={finding.id} />
          ))}
        </div>
      )}
    </section>
  )
}
