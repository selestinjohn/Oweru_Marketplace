import { CheckCircle2, Circle, Clock3, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { VerificationTimelineStep } from '@/types/property'
import { statusTone } from '@/features/property-details/utils/propertyDetailsUi'

function StepIcon({ state }: { state: VerificationTimelineStep['state'] }) {
  if (state === 'completed') {
    return <CheckCircle2 className="size-4" aria-hidden="true" />
  }

  if (state === 'active') {
    return <Clock3 className="size-4" aria-hidden="true" />
  }

  if (state === 'failed') {
    return <XCircle className="size-4" aria-hidden="true" />
  }

  return <Circle className="size-4" aria-hidden="true" />
}

export function VerificationTimeline({
  steps,
}: {
  steps: VerificationTimelineStep[]
}) {
  return (
    <div
      className="grid gap-3 md:grid-cols-5"
      aria-label="Verification workflow timeline"
    >
      {steps.map((step, index) => (
        <div className="relative" key={step.status}>
          {index < steps.length - 1 && (
            <span
              className="absolute left-5 top-5 hidden h-px w-[calc(100%+0.75rem)] bg-border md:block"
              aria-hidden="true"
            />
          )}
          <div className="relative z-10 grid gap-2 rounded-card border bg-surface p-4">
            <span
              className={cn(
                'flex size-10 items-center justify-center rounded-full border',
                step.state === 'completed' &&
                  'border-success/25 bg-success/10 text-success',
                step.state === 'active' &&
                  'border-accent/25 bg-accent/10 text-accent',
                step.state === 'failed' &&
                  'border-danger/25 bg-danger/10 text-danger',
                step.state === 'pending' &&
                  'border-border bg-muted text-muted-foreground',
              )}
            >
              <StepIcon state={step.state} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                {step.label}
              </h3>
              <div className="mt-2">
                <Badge tone={statusTone(step.state)}>{step.state}</Badge>
              </div>
              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                {step.date ? formatDate(step.date) : 'Awaiting update'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
