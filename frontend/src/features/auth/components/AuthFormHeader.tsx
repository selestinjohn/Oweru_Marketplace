import type { LucideIcon } from 'lucide-react'

export function AuthFormHeader({
  description,
  eyebrow = 'OWERU Marketplace',
  icon: Icon,
  title,
}: {
  description: string
  eyebrow?: string
  icon: LucideIcon
  title: string
}) {
  return (
    <div>
      <span className="inline-flex size-12 items-center justify-center rounded-control border border-accent/20 bg-accent/10 text-accent">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-5 text-xs font-bold uppercase text-accent">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
