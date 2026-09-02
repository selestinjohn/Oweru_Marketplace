import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { VerificationBadge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { PropertyDetails } from '@/types/property'
import {
  verificationBadgeState,
  verificationStatusLabel,
} from '@/features/property-details/utils/propertyDetailsUi'

export function VerificationSummaryCard({
  onViewDetails,
  property,
}: {
  onViewDetails?: () => void
  property: PropertyDetails
}) {
  const verification = property.verification
  const summaryRows = [
    {
      label: 'Verified On',
      value: verification.verifiedOn ? formatDate(verification.verifiedOn) : 'In review',
    },
    { label: 'Verification Reference', value: verification.id },
    {
      label: 'Validity',
      value: verification.expiryDate
        ? `Valid until ${formatDate(verification.expiryDate)}`
        : 'Pending decision',
    },
    { label: 'Performed By', value: verification.performedBy },
  ]

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-accent">
            Overall Verification Status
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
            {verificationStatusLabel(verification.status)}
          </h2>
        </div>
        <span className="flex size-11 items-center justify-center rounded-control bg-success/10 text-success">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4">
        <VerificationBadge state={verificationBadgeState(verification.status)} />
      </div>

      <div className="mt-5 grid gap-3">
        {summaryRows.map((item) => (
          <div
            className="flex items-start justify-between gap-4 border-t pt-3 text-sm"
            key={item.label}
          >
            <span className="text-muted-foreground">{item.label}</span>
            <span className="max-w-[58%] text-right font-bold text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-control border bg-success/5 p-3 text-xs leading-5 text-muted-foreground">
        {verification.summaryNote}
      </p>

      <button
        className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 w-full')}
        onClick={() => {
          onViewDetails?.()
          document
            .getElementById('property-detail-tabs')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        type="button"
      >
        View verification details
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </Card>
  )
}
