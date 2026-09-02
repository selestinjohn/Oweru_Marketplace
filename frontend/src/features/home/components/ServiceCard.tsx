import type { HomeIconContent } from '@/features/home/data/homeContent'

export function ServiceCard({ service }: { service: HomeIconContent }) {
  const Icon = service.icon

  return (
    <article className="grid gap-4 rounded-card border bg-surface p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent/35 hover:shadow-panel">
      <span className="flex size-12 items-center justify-center rounded-control bg-primary text-gold">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">
          {service.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {service.description}
        </p>
      </div>
    </article>
  )
}
