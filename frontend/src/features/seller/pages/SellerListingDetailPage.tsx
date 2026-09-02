import { ArrowLeft, Eye, Home, Megaphone, Pencil } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSectionCard } from '@/features/dashboard/components/DashboardSectionCard'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { ListingLifecycleActions } from '@/features/seller/components/ListingLifecycleActions'
import {
  SellerListingStatusBadge,
  SellerPropertyStatusBadge,
} from '@/features/seller/components/SellerStatusBadge'
import { useSellerListing } from '@/features/seller/hooks/useSellerQueries'
import {
  formatSellerPrice,
  propertyTypeLabel,
} from '@/features/seller/utils/sellerFormat'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export function SellerListingDetailPage() {
  const navigate = useNavigate()
  const { listingId } = useParams()
  const listingQuery = useSellerListing(listingId)

  if (listingQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (listingQuery.isError) {
    return (
      <ErrorState
        title="Unable to load listing"
        message="OWERU could not load this seller listing."
        action={{
          label: 'Back to My Listings',
          onClick: () => navigate(routePaths.sellerListings),
        }}
      />
    )
  }

  const bundle = listingQuery.data

  if (!bundle?.listing) {
    return (
      <EmptyState
        title="Listing not found"
        message="The listing may have been removed or the link may be incorrect."
        action={{
          label: 'Back to My Listings',
          onClick: () => navigate(routePaths.sellerListings),
        }}
      />
    )
  }

  const { listing, property } = bundle
  const publicHref =
    listing.status === 'PUBLISHED'
      ? routePaths.propertyDetail.replace(':propertyId', property.id)
      : undefined

  return (
    <div className="grid gap-6">
      <Link
        className={cn(
          buttonVariants({ size: 'sm', variant: 'ghost' }),
          'w-fit',
        )}
        to={routePaths.sellerListings}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to My Listings
      </Link>

      <DashboardPageHeader
        eyebrow="Marketplace listing"
        title={listing.title}
        description={`${property.reference_number} · ${property.location_description}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              className={cn(buttonVariants({ variant: 'outline' }))}
              to={routePaths.sellerListingEdit.replace(':listingId', listing.id)}
            >
              <Pencil className="size-4" aria-hidden="true" />
              Edit Listing
            </Link>
            {publicHref && (
              <Link
                className={cn(buttonVariants({ variant: 'primary' }))}
                to={publicHref}
              >
                <Eye className="size-4" aria-hidden="true" />
                View Public Listing
              </Link>
            )}
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr] xl:items-start">
        <div className="grid gap-6">
          <Card className="overflow-hidden">
            <div className="relative min-h-72">
              <img
                alt={`${listing.title} listing image`}
                className="absolute inset-0 size-full object-cover"
                loading="lazy"
                src={property.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/78 via-primary/16 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="gold">Listing Ad</Badge>
                  <SellerListingStatusBadge status={listing.status} />
                </div>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight">
                  {formatSellerPrice(listing)}
                </h2>
                <p className="mt-2 text-sm font-semibold text-primary-foreground/82">
                  Published:{' '}
                  {listing.published_at
                    ? formatDate(listing.published_at)
                    : 'Not published'}
                </p>
              </div>
            </div>
          </Card>

          <DashboardSectionCard
            title="Listing Description"
            description="Public-facing marketplace copy for buyers and tenants."
          >
            <p className="text-sm leading-7 text-muted-foreground">
              {listing.description}
            </p>
          </DashboardSectionCard>

          <DashboardSectionCard
            title="Lifecycle Actions"
            description="Use backend workflow actions for publication changes. Status is not patched directly from the frontend."
          >
            <ListingLifecycleActions listing={listing} />
          </DashboardSectionCard>
        </div>

        <aside className="grid gap-6 xl:sticky xl:top-28">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-control bg-accent/10 text-accent">
                <Megaphone className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Listing Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Marketplace advertisement details.
                </p>
              </div>
            </div>
            <dl className="mt-5 grid gap-3 text-sm">
              <Info label="Status" value={<SellerListingStatusBadge status={listing.status} />} />
              <Info label="Price" value={formatSellerPrice(listing)} />
              <Info label="Currency" value={listing.currency} />
              <Info label="Promoted" value={listing.is_promoted ? 'Yes' : 'No'} />
              <Info label="Updated" value={formatDate(listing.updated_at)} />
            </dl>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-control bg-primary/8 text-primary">
                <Home className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Attached Property Record
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  The listing advertises this persistent property record.
                </p>
              </div>
            </div>
            <dl className="mt-5 grid gap-3 text-sm">
              <Info label="Reference" value={property.reference_number} />
              <Info label="Type" value={propertyTypeLabel(property.property_type)} />
              <Info label="Status" value={<SellerPropertyStatusBadge status={property.status} />} />
              <Info label="Location" value={property.location_description} />
            </dl>
            <Link
              className={cn(buttonVariants({ variant: 'outline' }), 'mt-5 w-full')}
              to={routePaths.sellerPropertyDetail.replace(
                ':propertyId',
                property.id,
              )}
            >
              Manage Property Record
            </Link>
          </Card>
        </aside>
      </section>
    </div>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="grid gap-1 border-b pb-3 last:border-b-0 last:pb-0">
      <dt className="text-xs font-extrabold uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  )
}
