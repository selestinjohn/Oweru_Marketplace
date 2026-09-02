import { ArrowRight, CalendarClock, MapPin, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import {
  verificationStatusLabel,
  verificationStatusTone,
} from '@/features/verification/utils/verificationStatus'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { VerificationStatusBadge } from './VerificationStatusBadge'

export function VerificationRecordCard({
  verification,
}: {
  verification: VerificationDetails
}) {
  const detailHref = routePaths.verificationDetail.replace(
    ':verificationId',
    verification.id,
  )

  return (
    <Card className="grid gap-4 p-4 lg:grid-cols-[104px_1fr_auto] lg:items-center">
      <img
        alt={`${verification.propertySummary.title} verification thumbnail`}
        className="h-28 w-full rounded-control object-cover lg:h-24"
        src={verification.propertySummary.image}
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <VerificationStatusBadge status={verification.status} />
          <span className="text-xs font-bold uppercase text-muted-foreground">
            {verification.id}
          </span>
        </div>
        <h2 className="mt-2 truncate font-display text-xl font-bold text-foreground">
          {verification.propertySummary.title}
        </h2>
        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <MapPin className="size-4 text-accent" aria-hidden="true" />
          {verification.propertySummary.location}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold uppercase text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="size-4 text-accent" aria-hidden="true" />
            Requested {formatDate(verification.requested_at)}
          </span>
          {verification.assignedVerifierName && (
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="size-4 text-accent" aria-hidden="true" />
              {verification.assignedVerifierName}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-2 lg:min-w-48">
        <div
          className={cn(
            'rounded-control border px-3 py-2 text-sm font-semibold',
            verificationStatusTone(verification.status) === 'success' &&
              'border-success/20 bg-success/8 text-success',
            verificationStatusTone(verification.status) === 'gold' &&
              'border-accent/20 bg-accent/8 text-foreground',
            verificationStatusTone(verification.status) === 'danger' &&
              'border-danger/20 bg-danger/8 text-danger',
            verificationStatusTone(verification.status) === 'muted' &&
              'bg-muted text-muted-foreground',
            verificationStatusTone(verification.status) === 'navy' &&
              'border-primary/15 bg-primary/5 text-primary',
          )}
        >
          {verificationStatusLabel(verification.status)}
        </div>
        <Link
          className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
          to={detailHref}
        >
          View Details
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  )
}
