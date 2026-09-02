import { Landmark } from 'lucide-react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { OutlineButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardStatusBadge } from '@/features/dashboard/components/DashboardStatusBadge'
import { useDashboardOverview } from '@/features/dashboard/hooks/useDashboardOverview'

export function TransactionsDashboardPage() {
  const transactions = useDashboardOverview().data?.transactions ?? []

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Transactions"
        title="Transaction tracking"
        description="A structured foundation for offers, negotiation, accepted transactions, and handover progress."
      />

      {!transactions.length ? (
        <EmptyState
          title="No active transactions"
          message="When you begin a property transaction, you can track its progress here."
        />
      ) : (
        <section className="grid gap-3">
          {transactions.map((transaction) => (
            <Card
              className="grid gap-4 p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center"
              key={transaction.id}
            >
              <div className="flex gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
                  <Landmark className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    {transaction.propertyTitle}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {transaction.transactionType} · {transaction.nextStep}
                  </p>
                </div>
              </div>
              <DashboardStatusBadge
                kind="transaction"
                status={transaction.status}
              />
              <OutlineButton size="sm">{transaction.actionLabel}</OutlineButton>
            </Card>
          ))}
        </section>
      )}
    </div>
  )
}
