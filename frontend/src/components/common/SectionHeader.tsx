import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SectionHeader({
  action,
  className,
  description,
  title,
}: {
  action?: ReactNode
  className?: string
  description?: string
  title: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-3 sm:flex-row sm:items-end',
        className,
      )}
    >
      <div>
        <h2 className="font-display text-2xl font-bold leading-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
