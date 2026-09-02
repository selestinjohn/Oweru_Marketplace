import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { SellerPropertyForm } from '@/features/seller/components/SellerPropertyForm'
import { useCreateProperty } from '@/features/seller/hooks/useSellerMutations'
import type { SellerPropertyFormValues } from '@/features/seller/schemas/sellerForms'
import type { CreatePropertyPayload } from '@/features/seller/types/seller.types'
import { cn } from '@/lib/utils'

export function SellerPropertyCreatePage() {
  const navigate = useNavigate()
  const createProperty = useCreateProperty()

  async function handleSubmit(values: SellerPropertyFormValues) {
    const property = await createProperty.mutateAsync(
      propertyFormToPayload(values),
    )

    navigate(
      routePaths.sellerPropertyDetail.replace(':propertyId', property.id),
      { replace: true },
    )
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
        eyebrow="Create property"
        title="Build the property record"
        description="Start with the durable property record. Documents, verification, and the marketplace listing will be managed after this is saved."
      />

      <SellerPropertyForm
        isSubmitting={createProperty.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

function propertyFormToPayload(
  values: SellerPropertyFormValues,
): CreatePropertyPayload {
  return {
    description: values.description?.trim() || undefined,
    latitude: parseOptionalNumber(values.latitude),
    location_description: values.locationDescription?.trim() || undefined,
    longitude: parseOptionalNumber(values.longitude),
    ownership_basis: values.ownershipBasis?.trim() || undefined,
    property_type: values.propertyType,
    reference_number: values.referenceNumber.trim(),
  }
}

function parseOptionalNumber(value?: string) {
  if (!value?.trim()) {
    return null
  }

  return Number(value)
}
