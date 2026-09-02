import { FileSearch } from 'lucide-react'
import { formatDate } from '@/lib/format'
import type { EvidenceSummary } from '@/types/property'

export function VerificationEvidence({
  evidence,
}: {
  evidence: EvidenceSummary[]
}) {
  return (
    <div className="grid gap-3">
      <h3 className="font-display text-xl font-bold text-foreground">
        Supporting Evidence
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {evidence.map((item) => (
          <article
            className="rounded-card border bg-surface p-4 shadow-sm"
            key={item.id}
          >
            <span className="flex size-10 items-center justify-center rounded-control bg-accent/10 text-accent">
              <FileSearch className="size-5" aria-hidden="true" />
            </span>
            <h4 className="mt-3 font-display text-lg font-bold text-foreground">
              {item.title}
            </h4>
            <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
              {item.sourceType} - {formatDate(item.recordedDate)}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.relevance}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
