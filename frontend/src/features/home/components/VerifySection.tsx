import { ArrowRight, CheckCircle2, Circle, Clock3 } from 'lucide-react'
import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { Badge, VerificationBadge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { buttonVariants } from '@/components/ui/buttonVariants'
import {
  verifyChecklist,
  verifyTimeline,
} from '@/features/home/data/homeContent'
import { cn } from '@/lib/utils'

function TimelineIcon({ state }: { state: (typeof verifyTimeline)[number]['state'] }) {
  if (state === 'complete') {
    return <CheckCircle2 className="size-4" aria-hidden="true" />
  }

  if (state === 'active') {
    return <Clock3 className="size-4" aria-hidden="true" />
  }

  return <Circle className="size-4" aria-hidden="true" />
}

export function VerifySection() {
  return (
    <PageSection className="bg-primary text-primary-foreground" id="verify">
      <AppContainer className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="mb-3 text-sm font-bold uppercase text-gold">
            OWERU Verify
          </p>
          <h2 className="max-w-xl font-display text-3xl font-bold leading-tight md:text-4xl">
            Know More Before You Commit
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/78">
            OWERU helps users understand the verification status of a property
            through structured checks, supporting documents, evidence, and clear
            progress tracking.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/68">
            Verification information helps users make more informed decisions.
            It should not be read as legal certainty or a replacement for
            qualified professional advice.
          </p>
          <a
            className={cn(
              buttonVariants({ variant: 'primary', size: 'lg' }),
              'mt-7',
            )}
            href="#how-it-works"
          >
            Learn about OWERU Verify
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <Card className="overflow-hidden bg-surface p-0 text-foreground">
          <div className="flex flex-col gap-4 border-b bg-surface-muted p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-accent">
                Verification Preview
              </p>
              <h3 className="mt-1 font-display text-xl font-bold">
                Modern 4 Bedroom Duplex
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Property ID: OWR-DAR-000245
              </p>
            </div>
            <VerificationBadge state="in_review" />
          </div>

          <div className="grid gap-6 p-5">
            <div className="grid gap-3 sm:grid-cols-5">
              {verifyTimeline.map((step) => (
                <div className="relative grid gap-2" key={step.label}>
                  <span
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full border text-sm',
                      step.state === 'complete' &&
                        'border-success bg-success/10 text-success',
                      step.state === 'active' &&
                        'border-accent bg-accent/10 text-accent',
                      step.state === 'pending' &&
                        'border-border bg-muted text-muted-foreground',
                    )}
                  >
                    <TimelineIcon state={step.state} />
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid gap-3">
              {verifyChecklist.map((item) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-control border bg-surface px-4 py-3"
                  key={item.label}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {item.label}
                  </span>
                  <Badge
                    tone={
                      item.status === 'Completed'
                        ? 'success'
                        : item.status === 'In Review'
                          ? 'gold'
                          : 'muted'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </AppContainer>
    </PageSection>
  )
}
