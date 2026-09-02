import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  title,
}: {
  actions?: ReactNode
  className?: string
  description: string
  eyebrow: string
  title: string
}) {
  return (
    <header
      className={cn(
        'flex flex-col justify-between gap-4 md:flex-row md:items-end',
        className,
      )}
    >
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-normal text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  )
}
