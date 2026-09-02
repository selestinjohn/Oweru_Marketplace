import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { quickActions } from '@/features/dashboard/data/mockDashboard'

export function QuickActions() {
  return (
    <div className="grid gap-3">
      {quickActions.map((action) => {
        const Icon = action.icon

        return (
          <Link
            className="group flex items-start gap-3 rounded-control border bg-surface p-4 transition hover:border-accent/35 hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            key={action.label}
            to={action.href}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-foreground">
                {action.label}
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                {action.description}
              </span>
            </span>
            <ArrowRight
              className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden="true"
            />
          </Link>
        )
      })}
    </div>
  )
}
