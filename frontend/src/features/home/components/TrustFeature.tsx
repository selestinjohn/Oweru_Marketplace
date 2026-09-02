import type { HomeIconContent } from '@/features/home/data/homeContent'

export function TrustFeature({ feature }: { feature: HomeIconContent }) {
  const Icon = feature.icon

  return (
    <article className="flex gap-4 p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-control border border-accent/20 bg-accent/10 text-accent">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <h2 className="font-display text-base font-bold leading-tight text-foreground">
          {feature.title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {feature.description}
        </p>
      </div>
    </article>
  )
}
