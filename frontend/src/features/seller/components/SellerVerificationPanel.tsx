import { ArrowRight, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import type { SellerPropertyBundle } from '@/features/seller/types/seller.types'
import {
  canRequestVerification,
  hasActiveVerification,
} from '@/features/seller/utils/sellerFormat'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { SellerVerificationStatusBadge } from './SellerStatusBadge'

export function SellerVerificationPanel({
  bundle,
  onRequest,
  requestPending,
}: {
  bundle: SellerPropertyBundle
  onRequest: () => void
  requestPending?: boolean
}) {
  const verification = bundle.verification
  const active = hasActiveVerification(bundle)
  const requestable = canRequestVerification(bundle)

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-control bg-success/10 text-success">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Verification
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Verification information helps sellers and buyers understand the
            recorded OWERU review process. It is not presented as a legal
            guarantee.
          </p>
        </div>
      </div>

      {verification ? (
        <dl className="mt-5 grid gap-3 rounded-control border bg-surface p-4 text-sm">
          <InfoRow
            label="Overall Status"
            value={<SellerVerificationStatusBadge status={verification.status} />}
          />
          <InfoRow label="Verification ID" value={verification.id} />
          <InfoRow label="Requested" value={formatDate(verification.requested_at)} />
          <InfoRow
            label="Assigned To"
            value={verification.assigned_verifier_name ?? 'Awaiting assignment'}
          />
          {verification.decided_at && (
            <InfoRow label="Decision Date" value={formatDate(verification.decided_at)} />
          )}
          {verification.expires_at && (
            <InfoRow label="Validity" value={`Until ${formatDate(verification.expires_at)}`} />
          )}
        </dl>
      ) : (
        <div className="mt-5 rounded-control border bg-muted/50 p-4">
          <p className="text-sm font-bold text-foreground">
            No verification request yet
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Add supporting documents first where possible, then request OWERU
            verification for this property record.
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {verification && (
          <Link
            className={cn(buttonVariants({ variant: 'outline' }))}
            to={routePaths.verificationDetail.replace(
              ':verificationId',
              verification.id,
            )}
          >
            {active ? 'Track Verification' : 'View Verification'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
        {requestable && (
          <button
            className={cn(buttonVariants({ variant: 'primary' }))}
            disabled={requestPending}
            type="button"
            onClick={onRequest}
          >
            {verification?.status === 'EXPIRED'
              ? 'Request Re-verification'
              : 'Request Verification'}
          </button>
        )}
      </div>
    </Card>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[130px_1fr]">
      <dt className="text-xs font-extrabold uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  )
}
