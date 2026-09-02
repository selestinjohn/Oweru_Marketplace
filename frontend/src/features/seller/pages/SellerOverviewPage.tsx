import { ArrowRight, FilePlus2, Home, Megaphone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/feedback/ErrorState'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSectionCard } from '@/features/dashboard/components/DashboardSectionCard'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { SellerActivityList } from '@/features/seller/components/SellerActivityList'
import { SellerAttentionList } from '@/features/seller/components/SellerAttentionList'
import { useSellerOverview } from '@/features/seller/hooks/useSellerQueries'
import { cn } from '@/lib/utils'

export function SellerOverviewPage() {
  const overviewQuery = useSellerOverview()

  if (overviewQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (overviewQuery.isError || !overviewQuery.data) {
    return (
      <ErrorState
        title="Seller workspace unavailable"
        message="OWERU could not prepare your seller workspace right now."
        action={{
          label: 'Try again',
          onClick: () => void overviewQuery.refetch(),
        }}
      />
    )
  }

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Seller workspace"
        title="Manage property records and marketplace listings"
        description="Build durable property records, attach documents, request verification, and manage the listing advertisement separately."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              className={cn(buttonVariants({ variant: 'primary' }))}
              to={routePaths.sellerPropertyNew}
            >
              <Home className="size-4" aria-hidden="true" />
              Add Property
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'outline' }))}
              to={routePaths.sellerListingNew}
            >
              <Megaphone className="size-4" aria-hidden="true" />
              Create Listing
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewQuery.data.metrics.map((metric) => {
          const Icon = metric.icon

          return (
            <Card className="p-4" key={metric.id}>
              <div className="flex items-start gap-3">
                <span className="grid size-10 place-items-center rounded-control bg-accent/10 text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
                    {metric.context}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
        <DashboardSectionCard
          title="Needs Your Attention"
          description="Practical seller tasks connected to property records, documents, verification, and listings."
        >
          <SellerAttentionList items={overviewQuery.data.attention} />
        </DashboardSectionCard>

        <div className="grid gap-6">
          <DashboardSectionCard
            title="Recent Seller Activity"
            description="A concise activity trail for property administration."
          >
            <SellerActivityList items={overviewQuery.data.recentActivity} />
          </DashboardSectionCard>

          <DashboardSectionCard title="Seller Quick Actions">
            <div className="grid gap-3">
              <QuickAction
                description="Start with the persistent property record."
                href={routePaths.sellerPropertyNew}
                icon={Home}
                label="Add Property"
              />
              <QuickAction
                description="Create a marketplace advertisement for a property."
                href={routePaths.sellerListingNew}
                icon={Megaphone}
                label="Create Listing"
              />
              <QuickAction
                description="Review supporting documents and upload metadata."
                href={routePaths.sellerProperties}
                icon={FilePlus2}
                label="Upload Document"
              />
            </div>
          </DashboardSectionCard>
        </div>
      </section>
    </div>
  )
}

function QuickAction({
  description,
  href,
  icon: Icon,
  label,
}: {
  description: string
  href: string
  icon: LucideIcon
  label: string
}) {
  return (
    <Link
      className="flex items-center gap-3 rounded-control border bg-surface p-3 transition hover:border-accent/35 hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      to={href}
    >
      <span className="grid size-10 place-items-center rounded-control bg-primary/8 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-foreground">{label}</span>
        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-accent" aria-hidden="true" />
    </Link>
  )
}
