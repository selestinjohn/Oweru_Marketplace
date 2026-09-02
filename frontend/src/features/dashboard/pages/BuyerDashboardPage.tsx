import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ErrorState } from '@/components/feedback/ErrorState'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { useAuth } from '@/app/providers/authContext'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSectionCard } from '@/features/dashboard/components/DashboardSectionCard'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { DashboardStatGrid } from '@/features/dashboard/components/DashboardStatGrid'
import { QuickActions } from '@/features/dashboard/components/QuickActions'
import { RecentActivityList } from '@/features/dashboard/components/RecentActivityList'
import { RecommendedProperties } from '@/features/dashboard/components/RecommendedProperties'
import { TransactionSummary } from '@/features/dashboard/components/TransactionSummary'
import { VerificationSummaryList } from '@/features/dashboard/components/VerificationSummaryList'
import { useDashboardOverview } from '@/features/dashboard/hooks/useDashboardOverview'
import { cn } from '@/lib/utils'

export function BuyerDashboardPage() {
  const { party, user } = useAuth()
  const dashboardQuery = useDashboardOverview()
  const displayName = party?.display_name ?? user?.email ?? 'there'
  const firstName = displayName.split(/\s+/)[0] || displayName

  if (dashboardQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <ErrorState
        title="We couldn't load your dashboard"
        message="Your account is active, but the dashboard activity could not be prepared right now."
        action={{
          label: 'Try again',
          onClick: () => {
            void dashboardQuery.refetch()
          },
        }}
      />
    )
  }

  const dashboard = dashboardQuery.data

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Buyer dashboard"
        title={`Welcome back, ${firstName}`}
        description="Here's what's happening with your OWERU activity."
        action={
          <Link
            className={cn(buttonVariants({ variant: 'primary' }), 'shrink-0')}
            to={routePaths.properties}
          >
            Browse Properties
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />

      <DashboardStatGrid stats={dashboard.stats} />

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr] xl:items-start">
        <div className="grid gap-6">
          <DashboardSectionCard
            title="Recent Activity"
            description="A clear trail of property, verification, and conversation updates."
          >
            <RecentActivityList activities={dashboard.activities} />
          </DashboardSectionCard>

          <DashboardSectionCard
            title="Verification Activity"
            description="Follow the checks and decisions connected to properties you care about."
            action={
              <Link
                className="text-sm font-bold text-accent transition hover:text-gold-hover"
                to={routePaths.verifications}
              >
                View all
              </Link>
            }
          >
            <VerificationSummaryList items={dashboard.verifications} />
          </DashboardSectionCard>
        </div>

        <div className="grid gap-6">
          <DashboardSectionCard
            title="Recommended for You"
            description="Verified opportunities based on your recent marketplace activity."
          >
            <RecommendedProperties properties={dashboard.recommendedProperties} />
          </DashboardSectionCard>

          <DashboardSectionCard
            title="Active Transactions"
            description="Track buyer-side transaction progress without inventing payment actions."
          >
            <TransactionSummary transactions={dashboard.transactions} />
          </DashboardSectionCard>

          <DashboardSectionCard title="Quick Actions">
            <QuickActions />
          </DashboardSectionCard>
        </div>
      </div>
    </div>
  )
}
