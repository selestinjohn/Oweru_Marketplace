import type { ComponentType, SVGProps } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

export function StatCard({
  className,
  context,
  icon: Icon,
  label,
  tone = 'gold',
  value,
}: {
  className?: string
  context?: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  tone?: 'gold' | 'navy' | 'success' | 'warning'
  value: string
}) {
  const toneClass = {
    gold: 'bg-accent/10 text-accent',
    navy: 'bg-primary/8 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  }[tone]

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center gap-3">
        <span className={cn('grid size-10 place-items-center rounded-control', toneClass)}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">
            {label}
          </p>
          <p className="font-display text-2xl font-bold text-foreground">
            {value}
          </p>
          {context && (
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
              {context}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
