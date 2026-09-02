import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { DashboardStatusBadge } from '@/features/dashboard/components/DashboardStatusBadge'
import type { DashboardVerificationItem } from '@/features/dashboard/types/dashboard.types'

export function VerificationSummaryList({
  items,
}: {
  items: DashboardVerificationItem[]
}) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <article
          className="flex flex-col gap-3 rounded-control border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          key={item.id}
        >
          <div className="flex gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-control bg-success/10 text-success">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-bold text-foreground">{item.propertyTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.id} · Updated {item.lastUpdate}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <DashboardStatusBadge kind="verification" status={item.status} />
            <Link
              className="inline-flex items-center gap-1 text-sm font-bold text-accent transition hover:text-gold-hover"
              to={item.href}
            >
              View details
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
