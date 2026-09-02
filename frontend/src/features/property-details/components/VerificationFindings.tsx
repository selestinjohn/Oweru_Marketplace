import { AlertTriangle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { VerificationFinding } from '@/types/property'
import {
  severityLabel,
  statusTone,
} from '@/features/property-details/utils/propertyDetailsUi'

export function VerificationFindings({
  findings,
}: {
  findings: VerificationFinding[]
}) {
  return (
    <div className="grid gap-3">
      <h3 className="font-display text-xl font-bold text-foreground">
        Verification Findings
      </h3>
      <div className="grid gap-3">
        {findings.map((finding) => {
          const Icon =
            finding.severity === 'high' || finding.severity === 'critical'
              ? AlertTriangle
              : Info

          return (
            <article
              className="grid gap-3 rounded-card border bg-surface p-4 shadow-sm"
              key={finding.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-muted text-muted-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h4 className="font-display text-lg font-bold text-foreground">
                    {finding.title}
                  </h4>
                </div>
                <Badge tone={statusTone(finding.severity)}>
                  {severityLabel(finding.severity)}
                </Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {finding.description}
              </p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
