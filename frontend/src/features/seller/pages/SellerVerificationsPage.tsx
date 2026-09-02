import { ArrowRight, CalendarClock, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { SellerVerificationStatusBadge } from '@/features/seller/components/SellerStatusBadge'
import { useSellerVerifications } from '@/features/seller/hooks/useSellerQueries'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export function SellerVerificationsPage() {
  const verificationsQuery = useSellerVerifications()
  const items = verificationsQuery.data ?? []

  if (verificationsQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (verificationsQuery.isError) {
    return (
      <ErrorState
        title="Unable to load seller verifications"
        message="OWERU could not load verification activity for your properties."
        action={{
          label: 'Try again',
          onClick: () => void verificationsQuery.refetch(),
        }}
      />
    )
  }

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Seller verifications"
        title="Verification tracking"
        description="Follow OWERU verification progress for property records you manage. Verifier execution controls stay in the verifier workspace."
      />

      {!items.length ? (
        <EmptyState
          title="No verification requests yet"
          message="When you request OWERU verification for a property record, the progress will appear here."
        />
      ) : (
        <section className="grid gap-4" aria-label="Seller verification records">
          {items.map((item) => {
            const verification = item.verification

            if (!verification) {
              return null
            }

            return (
              <Card
                className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center"
                key={verification.id}
              >
                <div className="flex gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-control bg-success/10 text-success">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <SellerVerificationStatusBadge status={verification.status} />
                      <span className="text-xs font-extrabold uppercase text-muted-foreground">
                        {verification.id}
                      </span>
                    </div>
                    <h2 className="mt-2 font-display text-xl font-bold text-foreground">
                      {item.property.reference_number}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-muted-foreground">
                      {item.property.location_description}
                    </p>
                    <p className="mt-3 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                      <CalendarClock className="size-4 text-accent" aria-hidden="true" />
                      Requested {formatDate(verification.requested_at)}
                    </p>
                  </div>
                </div>
                <Link
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full md:w-auto')}
                  to={routePaths.verificationDetail.replace(
                    ':verificationId',
                    verification.id,
                  )}
                >
                  View Verification
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Card>
            )
          })}
        </section>
      )}
    </div>
  )
}
