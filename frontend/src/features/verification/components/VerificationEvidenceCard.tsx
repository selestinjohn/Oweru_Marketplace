import { FileSearch } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { VerificationEvidence } from '@/features/verification/types/verification.types'
import { evidenceSourceLabel } from '@/features/verification/utils/verificationStatus'
import { formatDate } from '@/lib/format'

export function VerificationEvidenceCard({
  evidenceLink,
}: {
  evidenceLink: VerificationEvidence
}) {
  const evidence = evidenceLink.evidenceSummary

  return (
    <article className="rounded-card border bg-surface p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
          <FileSearch className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-foreground">
            {evidence.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone={evidence.source_type === 'USER_SUPPLIED' ? 'muted' : 'navy'}>
              {evidenceSourceLabel(evidence.source_type)}
            </Badge>
            <span className="text-xs font-bold uppercase text-muted-foreground">
              Recorded {formatDate(evidence.recorded_at)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {evidence.description}
          </p>
          {evidenceLink.relevance_note && (
            <p className="mt-3 rounded-control border bg-surface-muted px-3 py-2 text-sm font-semibold leading-6 text-foreground">
              Relevance: {evidenceLink.relevance_note}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
