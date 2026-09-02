import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { SellerListingForm } from '@/features/seller/components/SellerListingForm'
import { useCreateListing } from '@/features/seller/hooks/useSellerMutations'
import type { SellerListingFormValues } from '@/features/seller/schemas/sellerForms'
import type { CreateListingPayload } from '@/features/seller/types/seller.types'
import { cn } from '@/lib/utils'

export function SellerListingCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const createListing = useCreateListing()
  const defaultPropertyId = searchParams.get('property') ?? undefined

  async function handleSubmit(values: SellerListingFormValues) {
    const listing = await createListing.mutateAsync(listingFormToPayload(values))

    navigate(routePaths.sellerListingDetail.replace(':listingId', listing.id), {
      replace: true,
    })
  }

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
        eyebrow="Create listing"
        title="Create a marketplace listing"
        description="Choose a property record and create the public-facing advertisement. The backend creates new listings as drafts."
      />

      <SellerListingForm
        defaultPropertyId={defaultPropertyId}
        isSubmitting={createListing.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

function listingFormToPayload(
  values: SellerListingFormValues,
): CreateListingPayload {
  return {
    currency: values.currency.trim().toUpperCase(),
    description: values.description.trim(),
    price: values.price.trim(),
    property: values.property,
    title: values.title.trim(),
  }
}
