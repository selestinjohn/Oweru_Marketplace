import { ArrowLeft, Info } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { SellerPropertyForm } from '@/features/seller/components/SellerPropertyForm'
import { useUpdateProperty } from '@/features/seller/hooks/useSellerMutations'
import { useSellerProperty } from '@/features/seller/hooks/useSellerQueries'
import type { SellerPropertyFormValues } from '@/features/seller/schemas/sellerForms'
import type { UpdatePropertyPayload } from '@/features/seller/types/seller.types'
import { cn } from '@/lib/utils'

export function SellerPropertyEditPage() {
  const navigate = useNavigate()
  const { propertyId } = useParams()
  const propertyQuery = useSellerProperty(propertyId)
  const updateProperty = useUpdateProperty(propertyId ?? '')

  if (propertyQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (propertyQuery.isError) {
    return (
      <ErrorState
        title="Unable to load property"
        message="OWERU could not load this property record for editing."
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

  async function handleSubmit(values: SellerPropertyFormValues) {
    await updateProperty.mutateAsync(propertyFormToUpdatePayload(values))
  }

  return (
    <div className="grid gap-6">
      <Link
        className={cn(
          buttonVariants({ size: 'sm', variant: 'ghost' }),
          'w-fit',
        )}
        to={routePaths.sellerPropertyDetail.replace(
          ':propertyId',
          bundle.property.id,
        )}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Property
      </Link>

      <DashboardPageHeader
        eyebrow="Edit property"
        title={bundle.property.reference_number}
        description="Update the property record details without changing listing price, publication status, or verification workflow state."
      />

      <Card className="flex gap-3 border-accent/20 bg-accent/8 p-4 text-sm leading-6 text-foreground">
        <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
        The current Django property API does not expose a PATCH endpoint in the
        inspected viewset. The form is ready, but saving is blocked until that
        endpoint is added by the backend.
      </Card>

      <SellerPropertyForm
        bundle={bundle}
        isSubmitting={updateProperty.isPending}
        submitLabel="Save Property Changes"
        onSubmit={handleSubmit}
      />
    </div>
  )
}

function propertyFormToUpdatePayload(
  values: SellerPropertyFormValues,
): UpdatePropertyPayload {
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
