import { CalendarClock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { formatDate } from '@/lib/format'

export function VerificationImportantDates({
  verification,
}: {
  verification: VerificationDetails
}) {
  const rows = [
    ['Requested', verification.requested_at],
    ['Assigned', verification.assigned_at],
    ['Started', verification.started_at],
    ['Submitted', verification.submitted_at],
    ['Decision', verification.decided_at],
    ['Expiry', verification.decision?.expires_at],
  ].filter(([, value]) => Boolean(value)) as Array<[string, string]>

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-control bg-accent/10 text-accent">
          <CalendarClock className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">Dates</p>
          <h2 className="font-display text-xl font-bold text-foreground">
            Important Dates
          </h2>
        </div>
      </div>

      <dl className="mt-5 grid gap-3">
        {rows.map(([label, value]) => (
          <div className="flex items-start justify-between gap-3" key={label}>
            <dt className="text-sm font-semibold text-muted-foreground">
              {label}
            </dt>
            <dd className="text-right text-sm font-bold text-foreground">
              {formatDate(value)}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
