import { CalendarClock, ShieldCheck, UserRound } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { verificationStatusLabel } from '@/features/verification/utils/verificationStatus'
import { formatDate } from '@/lib/format'
import { VerificationStatusBadge } from './VerificationStatusBadge'

export function VerificationSummaryCard({
  verification,
}: {
  verification: VerificationDetails
}) {
  const rows = [
    ['Verification ID', verification.id],
    ['Property', verification.propertySummary.title],
    ['Requested By', verification.requestedByName],
    ['Assigned Verifier', verification.assignedVerifierName],
    ['Requested', formatDate(verification.requested_at)],
    verification.started_at && ['Started', formatDate(verification.started_at)],
    verification.submitted_at && [
      'Submitted',
      formatDate(verification.submitted_at),
    ],
    verification.decided_at && ['Decision', formatDate(verification.decided_at)],
    verification.decision?.expires_at && [
      'Expiry',
      formatDate(verification.decision.expires_at),
    ],
  ].filter(Boolean) as Array<[string, string]>

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">
            Verification Summary
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
            {verificationStatusLabel(verification.status)}
          </h2>
        </div>
        <VerificationStatusBadge status={verification.status} />
      </div>

      <dl className="mt-5 grid gap-3">
        {rows.map(([label, value]) => (
          <div className="flex items-start justify-between gap-4" key={label}>
            <dt className="text-sm font-semibold text-muted-foreground">
              {label}
            </dt>
            <dd className="text-right text-sm font-bold text-foreground">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid gap-3 rounded-card border bg-surface-muted p-4 text-sm leading-6 text-muted-foreground">
        <p className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
          Verification information helps users make more informed property
          decisions. It is not presented as a guarantee of ownership or a
          risk-free transaction.
        </p>
        <p className="flex items-start gap-2">
          <UserRound className="mt-0.5 size-4 shrink-0 text-accent" />
          The assigned verifier handles the working record; customers see
          tracking information in read-only form.
        </p>
        <p className="flex items-start gap-2">
          <CalendarClock className="mt-0.5 size-4 shrink-0 text-accent" />
          Validity dates are shown only when a backend decision includes them.
        </p>
      </div>
    </Card>
  )
}
