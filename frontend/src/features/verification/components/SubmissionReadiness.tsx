import type { LucideIcon } from 'lucide-react'
import { AlertCircle, FileSearch, ListChecks } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { completedCheckCount } from '@/features/verification/utils/verificationStatus'

export function SubmissionReadiness({
  verification,
}: {
  verification: VerificationDetails
}) {
  const completed = completedCheckCount(verification.checks)
  const openFindings = verification.findings.filter((finding) =>
    ['MEDIUM', 'HIGH', 'CRITICAL'].includes(finding.severity),
  ).length

  return (
    <Card className="p-5">
      <p className="text-xs font-extrabold uppercase text-accent">
        Submission Readiness
      </p>
      <h2 className="mt-2 font-display text-xl font-bold text-foreground">
        Work progress
      </h2>

      <div className="mt-5 grid gap-3">
        <ReadinessMetric
          icon={ListChecks}
          label="Checklist recorded"
          value={`${completed}/${verification.checks.length}`}
        />
        <ReadinessMetric
          icon={AlertCircle}
          label="Medium+ findings"
          value={String(openFindings)}
        />
        <ReadinessMetric
          icon={FileSearch}
          label="Evidence linked"
          value={String(verification.evidenceLinks.length)}
        />
      </div>

      <p className="mt-5 rounded-control border bg-surface-muted px-3 py-3 text-sm leading-6 text-muted-foreground">
        These indicators summarize progress only. Backend validation and OWERU
        review remain authoritative for whether a verification can be
        submitted or decided.
      </p>
    </Card>
  )
}

function ReadinessMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-control border bg-surface px-3 py-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Icon className="size-4 text-accent" aria-hidden="true" />
        {label}
      </span>
      <strong className="font-display text-lg text-foreground">{value}</strong>
    </div>
  )
}
