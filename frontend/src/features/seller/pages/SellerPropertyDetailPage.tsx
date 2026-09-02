import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowLeft,
  FilePlus2,
  MapPin,
  Megaphone,
  Pencil,
  ShieldCheck,
  X,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Badge } from '@/components/ui/Badge'
import { IconButton, OutlineButton, PrimaryButton } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSectionCard } from '@/features/dashboard/components/DashboardSectionCard'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { PropertyParticipants } from '@/features/seller/components/PropertyParticipants'
import { PropertySetupProgress } from '@/features/seller/components/PropertySetupProgress'
import { SellerActivityList } from '@/features/seller/components/SellerActivityList'
import { SellerDocumentsPanel } from '@/features/seller/components/SellerDocumentsPanel'
import { SellerVerificationPanel } from '@/features/seller/components/SellerVerificationPanel'
import {
  SellerListingStatusBadge,
  SellerPropertyStatusBadge,
} from '@/features/seller/components/SellerStatusBadge'
import { useRequestSellerVerification } from '@/features/seller/hooks/useSellerMutations'
import { useSellerProperty } from '@/features/seller/hooks/useSellerQueries'
import {
  canRequestVerification,
  formatSellerPrice,
  propertyTypeLabel,
  sellerPropertyDisplayName,
} from '@/features/seller/utils/sellerFormat'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export function SellerPropertyDetailPage() {
  const navigate = useNavigate()
  const { propertyId } = useParams()
  const [isConfirmingVerification, setIsConfirmingVerification] =
    useState(false)
  const propertyQuery = useSellerProperty(propertyId)
  const requestVerification = useRequestSellerVerification(propertyId ?? '')

  if (propertyQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (propertyQuery.isError) {
    return (
      <ErrorState
        title="Unable to load property"
        message="OWERU could not load this seller property record."
        action={{
          label: 'Back to My Properties',
          onClick: () => navigate(routePaths.sellerProperties),
        }}
      />
    )
  }

  const bundle = propertyQuery.data

  if (!bundle) {
    return (
      <EmptyState
        title="Property not found"
        message="The property may have been removed or the link may be incorrect."
        action={{
          label: 'Back to My Properties',
          onClick: () => navigate(routePaths.sellerProperties),
        }}
      />
    )
  }

  const { listing, property } = bundle
  const listingHref = listing
    ? routePaths.sellerListingDetail.replace(':listingId', listing.id)
    : `${routePaths.sellerListingNew}?property=${property.id}`

  async function confirmVerificationRequest() {
    await requestVerification.mutateAsync()
    setIsConfirmingVerification(false)
  }

  return (
    <div className="grid gap-6">
      <Link
        className={cn(
          buttonVariants({ size: 'sm', variant: 'ghost' }),
          'w-fit',
        )}
        to={routePaths.sellerProperties}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to My Properties
      </Link>

      <DashboardPageHeader
        eyebrow="Seller property record"
        title={sellerPropertyDisplayName(bundle)}
        description={`${property.reference_number} · ${property.location_description}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              className={cn(buttonVariants({ variant: 'outline' }))}
              to={routePaths.sellerPropertyEdit.replace(
                ':propertyId',
                property.id,
              )}
            >
              <Pencil className="size-4" aria-hidden="true" />
              Edit Property
            </Link>
            <Link
              className={cn(buttonVariants({ variant: 'outline' }))}
              to={routePaths.sellerPropertyDocuments.replace(
                ':propertyId',
                property.id,
              )}
            >
              <FilePlus2 className="size-4" aria-hidden="true" />
              Add Document
            </Link>
            <Link className={cn(buttonVariants({ variant: 'primary' }))} to={listingHref}>
              <Megaphone className="size-4" aria-hidden="true" />
              {listing ? 'View Listing' : 'Create Listing'}
            </Link>
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr] xl:items-start">
        <div className="grid gap-6">
          <Card className="overflow-hidden">
            <div className="relative min-h-72">
              <img
                alt={`${sellerPropertyDisplayName(bundle)} seller property view`}
                className="absolute inset-0 size-full object-cover"
                loading="lazy"
                src={property.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/78 via-primary/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <div className="flex flex-wrap gap-2">
                  <SellerPropertyStatusBadge status={property.status} />
                  {listing ? (
                    <SellerListingStatusBadge status={listing.status} />
                  ) : (
                    <Badge tone="muted">No Listing</Badge>
                  )}
                </div>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight">
                  {property.reference_number}
                </h2>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary-foreground/82">
                  <MapPin className="size-4 text-accent" aria-hidden="true" />
                  {property.location_description || 'Location not added'}
                </p>
              </div>
            </div>
          </Card>

          <DashboardSectionCard
            title="Overview"
            description="The durable property record, separate from marketplace pricing and publication."
          >
            <p className="text-sm leading-7 text-muted-foreground">
              {property.description || 'No property description has been recorded.'}
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCard label="Property Type" value={propertyTypeLabel(property.property_type)} />
              <InfoCard label="Record Status" value={<SellerPropertyStatusBadge status={property.status} />} />
              <InfoCard label="Created" value={formatDate(property.created_at)} />
              <InfoCard
                label="Project"
                value={property.project?.name ?? 'No project association'}
              />
              <InfoCard
                label="Latitude"
                value={property.latitude ?? 'Not provided'}
              />
              <InfoCard
                label="Longitude"
                value={property.longitude ?? 'Not provided'}
              />
            </dl>
            <div className="mt-5 rounded-control border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
              Coordinates are useful for discovery, but should not be interpreted
              as legal boundary evidence.
            </div>
          </DashboardSectionCard>

          <DashboardSectionCard
            title="Listing Information"
            description="The marketplace advertisement attached to this property record."
          >
            {listing ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <SellerListingStatusBadge status={listing.status} />
                    {listing.is_promoted && <Badge tone="navy">Promoted</Badge>}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
                    {listing.title}
                  </h3>
                  <p className="mt-2 font-display text-2xl font-bold text-accent">
                    {formatSellerPrice(listing)}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {listing.description}
                  </p>
                </div>
                <Link
                  className={cn(buttonVariants({ variant: 'outline' }))}
                  to={listingHref}
                >
                  Manage Listing
                  <Megaphone className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <div className="rounded-control border bg-muted/50 p-4">
                <h3 className="font-display text-lg font-bold text-foreground">
                  No listing attached
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Create a listing when this property record has enough detail
                  for marketplace presentation.
                </p>
                <Link
                  className={cn(buttonVariants({ variant: 'primary' }), 'mt-4')}
                  to={listingHref}
                >
                  Create Listing
                </Link>
              </div>
            )}
          </DashboardSectionCard>

          <SellerDocumentsPanel
            documents={bundle.documents}
            propertyReference={property.reference_number}
          />

          <PropertyParticipants participants={bundle.participants} />

          <DashboardSectionCard
            title="Property Activity"
            description="A seller-facing activity trail for this property record."
          >
            <SellerActivityList items={bundle.activity} />
          </DashboardSectionCard>
        </div>

        <aside className="grid gap-6 xl:sticky xl:top-28">
          <PropertySetupProgress bundle={bundle} />
          <SellerVerificationPanel
            bundle={bundle}
            requestPending={requestVerification.isPending}
            onRequest={() => setIsConfirmingVerification(true)}
          />
        </aside>
      </section>

      {isConfirmingVerification && (
        <VerificationConfirmDialog
          isPending={requestVerification.isPending}
          onClose={() => setIsConfirmingVerification(false)}
          onConfirm={() => void confirmVerificationRequest()}
          requestable={canRequestVerification(bundle)}
        />
      )}
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-control border bg-surface p-4">
      <dt className="text-xs font-extrabold uppercase text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-bold text-foreground">{value}</dd>
    </div>
  )
}

function VerificationConfirmDialog({
  isPending,
  onClose,
  onConfirm,
  requestable,
}: {
  isPending: boolean
  onClose: () => void
  onConfirm: () => void
  requestable: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-primary/58 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="seller-verification-dialog-title"
    >
      <Card className="w-full max-w-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-control bg-accent/10 text-accent">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <IconButton label="Close verification request dialog" onClick={onClose}>
            <X className="size-5" aria-hidden="true" />
          </IconButton>
        </div>
        <h2
          className="mt-5 font-display text-2xl font-bold text-foreground"
          id="seller-verification-dialog-title"
        >
          Request OWERU Verification?
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This will create a verification request for this property record.
          OWERU verification information helps users make more informed
          decisions, but it is not a legal guarantee.
        </p>
        {!requestable && (
          <p className="mt-3 rounded-control border bg-muted p-3 text-sm font-semibold text-muted-foreground">
            This property already has an active verification workflow.
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <OutlineButton disabled={isPending} onClick={onClose}>
            Cancel
          </OutlineButton>
          <PrimaryButton disabled={isPending || !requestable} onClick={onConfirm}>
            {isPending ? 'Requesting...' : 'Request Verification'}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  )
}
