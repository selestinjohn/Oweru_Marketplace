import {
  ArrowRight,
  FileText,
  MapPin,
  Megaphone,
  Pencil,
  ShieldCheck,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import type { SellerPropertyBundle } from '@/features/seller/types/seller.types'
import {
  propertyTypeLabel,
  sellerPropertyDisplayName,
  sellerVerificationStatusLabel,
} from '@/features/seller/utils/sellerFormat'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  SellerListingStatusBadge,
  SellerPropertyStatusBadge,
  SellerVerificationStatusBadge,
} from './SellerStatusBadge'

export function SellerPropertyCard({
  bundle,
}: {
  bundle: SellerPropertyBundle
}) {
  const { listing, property, verification } = bundle
  const detailHref = routePaths.sellerPropertyDetail.replace(
    ':propertyId',
    property.id,
  )
  const documentsHref = routePaths.sellerPropertyDocuments.replace(
    ':propertyId',
    property.id,
  )
  const listingHref = listing
    ? routePaths.sellerListingDetail.replace(':listingId', listing.id)
    : `${routePaths.sellerListingNew}?property=${property.id}`

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
        <div className="relative min-h-48 lg:min-h-full">
          <img
            alt={`${sellerPropertyDisplayName(bundle)} property preview`}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            src={property.image}
          />
          <div className="absolute left-3 top-3">
            <Badge tone="navy">Property Record</Badge>
          </div>
        </div>

        <div className="grid gap-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase text-accent">
                {property.reference_number}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold leading-tight text-foreground">
                {sellerPropertyDisplayName(bundle)}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                {property.location_description || 'Location not added'}
              </p>
            </div>
            <SellerPropertyStatusBadge status={property.status} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MiniStatus label="Type" value={propertyTypeLabel(property.property_type)} />
            <MiniStatus
              label="Listing"
              value={
                listing ? (
                  <SellerListingStatusBadge status={listing.status} />
                ) : (
                  <Badge tone="muted">No Listing</Badge>
                )
              }
            />
            <MiniStatus
              label="Verification"
              value={
                verification ? (
                  <SellerVerificationStatusBadge status={verification.status} />
                ) : (
                  <Badge tone="muted">Not Requested</Badge>
                )
              }
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <p className="text-xs font-semibold text-muted-foreground">
              Updated {formatDate(property.updated_at)}
              {verification && (
                <>
                  {' '}
                  · {sellerVerificationStatusLabel(verification.status)}
                </>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
                to={detailHref}
              >
                View
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                className={cn(buttonVariants({ size: 'sm', variant: 'ghost' }))}
                to={routePaths.sellerPropertyEdit.replace(
                  ':propertyId',
                  property.id,
                )}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </Link>
              <Link
                className={cn(buttonVariants({ size: 'sm', variant: 'ghost' }))}
                to={documentsHref}
              >
                <FileText className="size-4" aria-hidden="true" />
                Documents
              </Link>
              <Link
                className={cn(buttonVariants({ size: 'sm', variant: 'ghost' }))}
                to={listingHref}
              >
                <Megaphone className="size-4" aria-hidden="true" />
                {listing ? 'Listing' : 'Create Listing'}
              </Link>
              <Link
                className={cn(buttonVariants({ size: 'sm', variant: 'ghost' }))}
                to={detailHref}
              >
                <ShieldCheck className="size-4" aria-hidden="true" />
                Verification
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function MiniStatus({
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
