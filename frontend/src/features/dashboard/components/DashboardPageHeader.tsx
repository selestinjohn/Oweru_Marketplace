import type { ReactNode } from 'react'

export function DashboardPageHeader({
  action,
  description,
  eyebrow,
  title,
}: {
  action?: ReactNode
  description: string
  eyebrow?: string
  title: string
}) {
  return (
    <section className="flex flex-col justify-between gap-4 rounded-card border bg-card p-5 shadow-panel sm:p-6 lg:flex-row lg:items-end">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase text-accent">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
      {action}
    </section>
  )
}
