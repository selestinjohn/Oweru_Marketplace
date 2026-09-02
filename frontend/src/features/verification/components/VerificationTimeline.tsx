import {
  CheckCircle2,
  Circle,
  Clock3,
  ShieldCheck,
  TimerOff,
  XCircle,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { Badge } from '@/components/ui/Badge'
import type {
  VerificationDetails,
  VerificationTimelineStageState,
} from '@/features/verification/types/verification.types'
import { buildVerificationTimeline } from '@/features/verification/utils/verificationStatus'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

function iconForState(state: VerificationTimelineStageState) {
  const icons = {
    cancelled: XCircle,
    completed: CheckCircle2,
    current: Clock3,
    expired: TimerOff,
    failed: XCircle,
    pending: Circle,
  }

  return icons[state]
}

function toneForState(state: VerificationTimelineStageState) {
  const tones = {
    cancelled: 'muted',
    completed: 'success',
    current: 'gold',
    expired: 'gold',
    failed: 'danger',
    pending: 'muted',
  } as const

  return tones[state]
}

export function VerificationTimeline({
  verification,
}: {
  verification: VerificationDetails
}) {
  const stages = buildVerificationTimeline(verification)

  return (
    <section aria-labelledby="verification-timeline-title">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">
            Process
          </p>
          <h2
            className="font-display text-2xl font-bold text-foreground"
            id="verification-timeline-title"
          >
            Requested to decision
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          OWERU Verify moves through requested, assigned, in-progress,
          submitted, and decision stages. Missing dates are shown as pending
          rather than invented.
        </p>
      </div>

      <ol
        className="grid gap-3 md:grid-cols-[repeat(var(--timeline-columns),minmax(0,1fr))]"
        style={{ '--timeline-columns': stages.length } as CSSProperties}
      >
        {stages.map((stage, index) => {
          const Icon = iconForState(stage.state)

          return (
            <li className="relative" key={stage.key}>
              {index < stages.length - 1 && (
                <span
                  className="absolute left-5 top-5 hidden h-px w-[calc(100%+0.75rem)] bg-border md:block"
                  aria-hidden="true"
                />
              )}
              <article
                className={cn(
                  'relative z-10 grid gap-3 rounded-card border bg-surface p-4 shadow-sm',
                  stage.state === 'current' && 'border-accent/35 bg-accent/5',
                  stage.state === 'failed' && 'border-danger/25 bg-danger/5',
                  stage.state === 'expired' && 'border-accent/25 bg-accent/5',
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-full border',
                      stage.state === 'completed' &&
                        'border-success/25 bg-success/10 text-success',
                      stage.state === 'current' &&
                        'border-accent/25 bg-accent/10 text-accent',
                      stage.state === 'failed' &&
                        'border-danger/25 bg-danger/10 text-danger',
                      stage.state === 'expired' &&
                        'border-accent/25 bg-accent/10 text-accent',
                      stage.state === 'cancelled' &&
                        'border-border bg-muted text-muted-foreground',
                      stage.state === 'pending' &&
                        'border-border bg-muted text-muted-foreground',
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold text-foreground">
                      {stage.label}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase text-muted-foreground">
                      {stage.date ? formatDate(stage.date) : 'Awaiting update'}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {stage.description}
                </p>
                <Badge tone={toneForState(stage.state)}>
                  {stage.state === 'current' ? 'Current' : stage.state}
                </Badge>
              </article>
            </li>
          )
        })}
      </ol>

      {verification.status === 'APPROVED' && (
        <p className="mt-4 flex items-start gap-2 rounded-control border border-success/20 bg-success/8 px-4 py-3 text-sm leading-6 text-success">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Verification reflects the recorded OWERU process and supporting
          evidence available at the time of review.
        </p>
      )}
    </section>
  )
}
