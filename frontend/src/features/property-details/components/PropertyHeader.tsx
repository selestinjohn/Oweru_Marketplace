import { Heart, MapPin, Share2 } from 'lucide-react'
import { useState } from 'react'
import { VerificationBadge, StatusBadge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/format'
import type { PropertyDetails } from '@/types/property'
import {
  verificationBadgeState,
  verificationStatusLabel,
} from '@/features/property-details/utils/propertyDetailsUi'
import { PropertyStatusBadge } from './PropertyStatusBadge'
import { PropertySummaryStats } from './PropertySummaryStats'

export function PropertyHeader({ property }: { property: PropertyDetails }) {
  const [isSaved, setIsSaved] = useState(false)

  return (
    <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={property.transactionType} />
          <PropertyStatusBadge status={property.status} />
          <VerificationBadge
            state={verificationBadgeState(property.verification.status)}
          />
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
          {property.title}
        </h1>
        <p className="mt-3 flex items-center gap-2 text-base font-semibold text-muted-foreground">
          <MapPin className="size-4 text-accent" aria-hidden="true" />
          {property.location}
        </p>
        <div className="mt-5">
          <PropertySummaryStats property={property} />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-card border bg-surface p-4 shadow-panel sm:min-w-72">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">
            Price
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-foreground">
            {formatCurrency(property.price, property.currency)}
          </p>
          {property.transactionType === 'rent' && (
            <p className="text-sm font-semibold text-muted-foreground">
              per month
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <IconButton
            className="flex-1"
            label={isSaved ? 'Remove saved property' : 'Save property'}
            onClick={() => setIsSaved((current) => !current)}
            variant="outline"
          >
            <Heart
              className={isSaved ? 'size-5 fill-current text-danger' : 'size-5'}
              aria-hidden="true"
            />
          </IconButton>
          <IconButton
            className="flex-1"
            label="Share property"
            onClick={() => undefined}
            variant="outline"
          >
            <Share2 className="size-5" aria-hidden="true" />
          </IconButton>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Verification status: {verificationStatusLabel(property.verification.status)}
        </p>
      </div>
    </header>
  )
}
