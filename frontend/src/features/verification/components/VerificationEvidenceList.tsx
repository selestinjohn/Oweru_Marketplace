import { EmptyState } from '@/components/feedback/EmptyState'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { AttachEvidenceForm } from './AttachEvidenceForm'
import { VerificationEvidenceCard } from './VerificationEvidenceCard'

export function VerificationEvidenceList({
  canEdit,
  verification,
}: {
  canEdit: boolean
  verification: VerificationDetails
}) {
  return (
    <section className="grid gap-4" aria-labelledby="verification-evidence-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">
            Evidence
          </p>
          <h2
            className="font-display text-2xl font-bold text-foreground"
            id="verification-evidence-title"
          >
            What information supports the record
          </h2>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {verification.evidenceLinks.length} linked item
          {verification.evidenceLinks.length === 1 ? '' : 's'}
        </p>
      </div>

      {canEdit && <AttachEvidenceForm verification={verification} />}

      {!verification.evidenceLinks.length ? (
        <EmptyState
          title="No evidence linked yet"
          message="Evidence links will appear here when an assigned verifier attaches permitted property evidence."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {verification.evidenceLinks.map((evidenceLink) => (
            <VerificationEvidenceCard
              evidenceLink={evidenceLink}
              key={evidenceLink.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
