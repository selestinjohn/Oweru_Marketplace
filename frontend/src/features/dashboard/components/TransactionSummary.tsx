import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Landmark } from 'lucide-react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { routePaths } from '@/constants/routes'
import { transactionEmptyState } from '@/features/dashboard/data/mockDashboard'
import { DashboardStatusBadge } from '@/features/dashboard/components/DashboardStatusBadge'
import type { DashboardTransaction } from '@/features/dashboard/types/dashboard.types'

export function TransactionSummary({
  transactions,
}: {
  transactions: DashboardTransaction[]
}) {
  const navigate = useNavigate()

  if (!transactions.length) {
    return (
      <EmptyState
        title={transactionEmptyState.title}
        message={transactionEmptyState.message}
        action={{
          label: 'Browse properties',
          onClick: () => navigate(routePaths.properties),
        }}
      />
    )
  }

  return (
    <div className="grid gap-3">
      {transactions.slice(0, 2).map((transaction) => (
        <article className="rounded-control border bg-surface p-4" key={transaction.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
                <Landmark className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-bold text-foreground">
                  {transaction.propertyTitle}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {transaction.transactionType} · {transaction.nextStep}
                </p>
              </div>
            </div>
            <DashboardStatusBadge
              kind="transaction"
              status={transaction.status}
            />
          </div>
          <Link
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent transition hover:text-gold-hover"
            to={routePaths.transactions}
          >
            {transaction.actionLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  )
}
