import { FileText, LockKeyhole } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/format'
import type { PropertyDocumentSummary } from '@/types/property'
import {
  accessLabel,
  reviewStatusLabel,
  statusTone,
} from '@/features/property-details/utils/propertyDetailsUi'

export function DocumentCard({
  document,
}: {
  document: PropertyDocumentSummary
}) {
  return (
    <article className="grid gap-4 rounded-card border bg-surface p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-start">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary text-gold">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-foreground">
            {document.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{document.type}</p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase text-muted-foreground">
                Source
              </dt>
              <dd className="font-semibold text-foreground">{document.source}</dd>
            </div>
            {document.issueDate && (
              <div>
                <dt className="text-xs font-bold uppercase text-muted-foreground">
                  Issue Date
                </dt>
                <dd className="font-semibold text-foreground">
                  {formatDate(document.issueDate)}
                </dd>
              </div>
            )}
            {document.expiryDate && (
              <div>
                <dt className="text-xs font-bold uppercase text-muted-foreground">
                  Expiry
                </dt>
                <dd className="font-semibold text-foreground">
                  {formatDate(document.expiryDate)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 md:justify-end">
        <Badge tone={statusTone(document.reviewStatus)}>
          {reviewStatusLabel(document.reviewStatus)}
        </Badge>
        <Badge tone={statusTone(document.access)}>
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          {accessLabel(document.access)}
        </Badge>
      </div>
    </article>
  )
}
