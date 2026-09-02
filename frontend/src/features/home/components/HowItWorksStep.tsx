import type { HomeIconContent } from '@/features/home/data/homeContent'

export function HowItWorksStep({
  step,
  stepNumber,
}: {
  step: HomeIconContent
  stepNumber: string
}) {
  const Icon = step.icon

  return (
    <article className="relative grid gap-4 rounded-card border bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-bold text-accent">{stepNumber}</span>
        <span className="flex size-11 items-center justify-center rounded-control border border-accent/20 bg-accent/10 text-accent">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {step.description}
        </p>
      </div>
    </article>
  )
}
