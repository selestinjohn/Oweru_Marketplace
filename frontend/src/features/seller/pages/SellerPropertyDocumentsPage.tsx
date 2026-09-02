import { ArrowLeft, FilePlus2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { SellerDocumentUploadForm } from '@/features/seller/components/SellerDocumentUploadForm'
import { SellerDocumentsPanel } from '@/features/seller/components/SellerDocumentsPanel'
import { useCreateSellerDocument } from '@/features/seller/hooks/useSellerMutations'
import { useSellerProperty } from '@/features/seller/hooks/useSellerQueries'
import type { SellerDocumentFormValues } from '@/features/seller/schemas/sellerForms'
import { cn } from '@/lib/utils'

export function SellerPropertyDocumentsPage() {
  const navigate = useNavigate()
  const { propertyId } = useParams()
  const propertyQuery = useSellerProperty(propertyId)
  const createDocument = useCreateSellerDocument(propertyId ?? '')

  if (propertyQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (propertyQuery.isError) {
    return (
      <ErrorState
        title="Unable to load documents"
        message="OWERU could not load the document workspace for this property."
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

  async function handleUpload(values: SellerDocumentFormValues) {
    const file = values.file.item(0)

    if (!file || !propertyId) {
      throw new Error('Choose a document file to upload.')
    }

    await createDocument.mutateAsync({
      description: values.description?.trim() || undefined,
      document_type: values.documentType,
      expires_at: values.expiresAt || undefined,
      file,
      issued_at: values.issuedAt || undefined,
      property: propertyId,
      source_type: 'USER_SUPPLIED',
    })
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
        eyebrow="Property documents"
        title={`${bundle.property.reference_number} documents`}
        description="Manage supporting document metadata without exposing private storage paths or unrestricted download URLs."
        action={
          <span className="inline-flex items-center gap-2 rounded-control bg-accent/10 px-3 py-2 text-sm font-bold text-accent">
            <FilePlus2 className="size-4" aria-hidden="true" />
            User Supplied Uploads
          </span>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_420px] xl:items-start">
        <SellerDocumentsPanel
          documents={bundle.documents}
          propertyReference={bundle.property.reference_number}
        />
        <div className="xl:sticky xl:top-28">
          <SellerDocumentUploadForm
            isSubmitting={createDocument.isPending}
            onSubmit={handleUpload}
          />
        </div>
      </section>
    </div>
  )
}
