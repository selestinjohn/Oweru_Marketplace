import { ArrowRight, CalendarClock, Eye, Megaphone, Pencil } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import type { SellerPropertyBundle } from '@/features/seller/types/seller.types'
import {
  formatSellerPrice,
  propertyTypeLabel,
} from '@/features/seller/utils/sellerFormat'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  SellerListingStatusBadge,
  SellerPropertyStatusBadge,
} from './SellerStatusBadge'

export function SellerListingCard({
  bundle,
}: {
  bundle: SellerPropertyBundle
}) {
  if (!bundle.listing) {
    return null
  }

  const { listing, property } = bundle
  const listingHref = routePaths.sellerListingDetail.replace(
    ':listingId',
    listing.id,
  )
  const publicHref =
    listing.status === 'PUBLISHED'
      ? routePaths.propertyDetail.replace(':propertyId', property.id)
      : undefined

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[180px_1fr_auto]">
        <div className="relative min-h-44 md:min-h-full">
          <img
            alt={`${listing.title} listing preview`}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            src={property.image}
          />
          <div className="absolute left-3 top-3">
            <Badge tone="gold">Listing Ad</Badge>
          </div>
        </div>

        <div className="grid gap-4 p-4 sm:p-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <SellerListingStatusBadge status={listing.status} />
              {listing.is_promoted && <Badge tone="navy">Promoted</Badge>}
            </div>
            <h2 className="mt-3 font-display text-xl font-bold leading-tight text-foreground">
              {listing.title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {property.reference_number} · {property.location_description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MiniInfo label="Price" value={formatSellerPrice(listing)} />
            <MiniInfo label="Property" value={propertyTypeLabel(property.property_type)} />
            <MiniInfo
              label="Record Status"
              value={<SellerPropertyStatusBadge status={property.status} />}
            />
          </div>

          <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <CalendarClock className="size-4 text-accent" aria-hidden="true" />
            {listing.published_at
              ? `Published ${formatDate(listing.published_at)}`
              : `Updated ${formatDate(listing.updated_at)}`}
          </p>
        </div>

        <div className="grid gap-2 border-t p-4 md:min-w-48 md:border-l md:border-t-0 md:p-5">
          <Link
            className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
            to={listingHref}
          >
            View Listing
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
            to={routePaths.sellerListingEdit.replace(':listingId', listing.id)}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Link>
          {publicHref && (
            <Link
              className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
              to={publicHref}
            >
              <Eye className="size-4" aria-hidden="true" />
              Public View
            </Link>
          )}
          <span className="mt-auto inline-flex items-center gap-2 rounded-control bg-primary/5 px-3 py-2 text-xs font-bold text-primary">
            <Megaphone className="size-4" aria-hidden="true" />
            Marketplace ad for one property record
          </span>
        </div>
      </div>
    </Card>
  )
}

function MiniInfo({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="rounded-control border bg-muted/40 p-3">
      <p className="text-xs font-extrabold uppercase text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 text-sm font-bold text-foreground">{value}</div>
    </div>
  )
}
