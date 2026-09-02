import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export function DashboardSectionCard({
  action,
  children,
  className,
  description,
  title,
}: {
  action?: ReactNode
  children: ReactNode
  className?: string
  description?: string
  title: string
}) {
  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b bg-surface px-5 py-4">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  )
}
