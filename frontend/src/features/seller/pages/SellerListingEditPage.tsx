import { ArrowLeft, Info } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { SellerListingForm } from '@/features/seller/components/SellerListingForm'
import { useUpdateListing } from '@/features/seller/hooks/useSellerMutations'
import { useSellerListing } from '@/features/seller/hooks/useSellerQueries'
import type { SellerListingFormValues } from '@/features/seller/schemas/sellerForms'
import type { UpdateListingPayload } from '@/features/seller/types/seller.types'
import { cn } from '@/lib/utils'

export function SellerListingEditPage() {
  const navigate = useNavigate()
  const { listingId } = useParams()
  const listingQuery = useSellerListing(listingId)
  const updateListing = useUpdateListing(listingId ?? '')

  if (listingQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (listingQuery.isError) {
    return (
      <ErrorState
        title="Unable to load listing"
        message="OWERU could not load this listing for editing."
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

  async function handleSubmit(values: SellerListingFormValues) {
    await updateListing.mutateAsync(listingFormToUpdatePayload(values))
  }

  return (
    <div className="grid gap-6">
      <Link
        className={cn(
          buttonVariants({ size: 'sm', variant: 'ghost' }),
          'w-fit',
        )}
        to={routePaths.sellerListingDetail.replace(
          ':listingId',
          bundle.listing.id,
        )}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Listing
      </Link>

      <DashboardPageHeader
        eyebrow="Edit listing"
        title={bundle.listing.title}
        description="Update marketplace listing copy and pricing separately from the property record."
      />

      <Card className="flex gap-3 border-accent/20 bg-accent/8 p-4 text-sm leading-6 text-foreground">
        <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
        The current Django listing API does not expose a PATCH endpoint for
        listing metadata. Lifecycle changes are available through dedicated
        publish, pause, resume, and close actions.
      </Card>

      <SellerListingForm
        bundle={bundle}
        isSubmitting={updateListing.isPending}
        submitLabel="Save Listing Changes"
        onSubmit={handleSubmit}
      />
    </div>
  )
}

function listingFormToUpdatePayload(
  values: SellerListingFormValues,
): UpdateListingPayload {
  return {
    currency: values.currency.trim().toUpperCase(),
    description: values.description.trim(),
    price: values.price.trim(),
    property: values.property,
    title: values.title.trim(),
  }
}
