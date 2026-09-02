import { AlertTriangle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { VerificationFinding } from '@/features/verification/types/verification.types'
import {
  severityLabel,
  severityTone,
} from '@/features/verification/utils/verificationStatus'
import { formatDate } from '@/lib/format'

export function VerificationFindingCard({
  finding,
}: {
  finding: VerificationFinding
}) {
  const Icon =
    finding.severity === 'HIGH' || finding.severity === 'CRITICAL'
      ? AlertTriangle
      : Info

  return (
    <article className="rounded-card border bg-surface p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-muted text-muted-foreground">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              {finding.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {finding.description}
            </p>
          </div>
        </div>
        <Badge tone={severityTone(finding.severity)}>
          {severityLabel(finding.severity)}
        </Badge>
      </div>
      <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">
        Recorded {formatDate(finding.recorded_at)}
        {finding.recordedByName ? ` by ${finding.recordedByName}` : ''}
      </p>
    </article>
  )
}
