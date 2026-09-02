import { ArrowRight, CalendarClock, MapPin, PlayCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import { useStartVerification } from '@/features/verification/hooks/useStartVerification'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import {
  canShowStartAction,
  nextActionLabel,
} from '@/features/verification/utils/verificationPermissions'
import { verificationActionErrorMessage } from '@/features/verification/utils/verificationErrors'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { CurrentUserResponse } from '@/features/auth/types/auth.types'
import { VerificationStatusBadge } from './VerificationStatusBadge'

export function VerificationAssignmentCard({
  currentUser,
  verification,
}: {
  currentUser: CurrentUserResponse | null
  verification: VerificationDetails
}) {
  const navigate = useNavigate()
  const startVerification = useStartVerification(verification.id)
  const detailHref = routePaths.verificationDetail.replace(
    ':verificationId',
    verification.id,
  )
  const canStart = canShowStartAction(currentUser, verification)

  return (
    <Card className="grid gap-4 p-4 lg:grid-cols-[120px_1fr_auto] lg:items-center">
      <img
        alt={`${verification.propertySummary.title} assignment thumbnail`}
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
        <p className="mt-2 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
          <CalendarClock className="size-4 text-accent" aria-hidden="true" />
          Assigned{' '}
          {verification.assigned_at
            ? formatDate(verification.assigned_at)
            : 'awaiting assignment'}
          {' · '}Updated {formatDate(verification.updated_at)}
        </p>
      </div>

      <div className="flex flex-col gap-2 lg:min-w-44">
        {canStart ? (
          <PrimaryButton
            disabled={startVerification.isPending}
            onClick={() =>
              startVerification.mutate(undefined, {
                onSuccess: () => navigate(detailHref),
              })
            }
          >
            <PlayCircle className="size-4" aria-hidden="true" />
            {startVerification.isPending ? 'Starting...' : 'Start Verification'}
          </PrimaryButton>
        ) : (
          <Link
            className={cn(buttonVariants({ variant: 'primary' }), 'w-full')}
            to={detailHref}
          >
            {nextActionLabel(verification.status)}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
        {canStart && (
          <Link
            className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
            to={detailHref}
          >
            Open Details
          </Link>
        )}
        {startVerification.isError && (
          <p className="text-xs font-semibold text-danger" role="alert">
            {verificationActionErrorMessage(startVerification.error)}
          </p>
        )}
      </div>
    </Card>
  )
}
