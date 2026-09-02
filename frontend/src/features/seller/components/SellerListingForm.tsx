import { useState } from 'react'
import type { ReactNode } from 'react'
import type { FieldPath } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Megaphone } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { propertyOptionsForListing } from '@/features/seller/data/mockSellerWorkspace'
import {
  sellerListingSchema,
  type SellerListingFormValues,
} from '@/features/seller/schemas/sellerForms'
import type { SellerPropertyBundle } from '@/features/seller/types/seller.types'
import { normalizeSellerError } from '@/features/seller/api/sellerApi'

const listingFields: FieldPath<SellerListingFormValues>[] = [
  'currency',
  'description',
  'price',
  'property',
  'title',
]

export function SellerListingForm({
  bundle,
  defaultPropertyId,
  isSubmitting,
  onSubmit,
  submitLabel = 'Create Draft Listing',
}: {
  bundle?: SellerPropertyBundle
  defaultPropertyId?: string
  isSubmitting?: boolean
  onSubmit: (values: SellerListingFormValues) => Promise<void>
  submitLabel?: string
}) {
  const [formError, setFormError] = useState<string | null>(null)
  const propertyOptions = propertyOptionsForListing()
  const {
    formState: { errors, isSubmitting: formSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<SellerListingFormValues>({
    defaultValues: {
      currency: bundle?.listing?.currency ?? 'TZS',
      description: bundle?.listing?.description ?? '',
      price: bundle?.listing?.price
        ? String(Number(bundle.listing.price))
        : '',
      property: bundle?.property.id ?? defaultPropertyId ?? '',
      title: bundle?.listing?.title ?? '',
    },
    resolver: zodResolver(sellerListingSchema),
  })
  const busy = Boolean(isSubmitting || formSubmitting)

  const submit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await onSubmit(values)
    } catch (error) {
      const normalized = normalizeSellerError(error)

      Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
        if (listingFields.includes(field as FieldPath<SellerListingFormValues>)) {
          setError(field as FieldPath<SellerListingFormValues>, {
            message,
            type: 'server',
          })
        }
      })

      setFormError(normalized.formError)
    }
  })

  return (
    <form className="grid gap-5" noValidate onSubmit={submit}>
      {formError && (
        <div className="flex gap-3 rounded-control border border-danger/20 bg-danger/8 p-4 text-danger">
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold leading-6">{formError}</p>
        </div>
      )}

      <Card className="p-5">
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase text-accent">
            Marketplace Listing
          </p>
          <h2 className="mt-2 font-display text-xl font-bold text-foreground">
            Listing advertisement
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Select the existing property record, then create the marketplace
            advertisement. Publication is handled by listing workflow actions.
          </p>
        </div>

        <div className="grid gap-4">
          <FieldControl error={errors.property?.message}>
            <Select
              label="Property record"
              options={[
                { label: 'Select property record', value: '' },
                ...propertyOptions,
              ]}
              {...register('property')}
            />
          </FieldControl>
          <Input
            error={errors.title?.message}
            label="Listing title"
            placeholder="Modern 4 Bedroom Duplex"
            {...register('title')}
          />
          <Textarea
            error={errors.description?.message}
            label="Listing description"
            placeholder="Describe the property for buyers while keeping verification claims factual."
            {...register('description')}
          />
          <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
            <Input
              error={errors.price?.message}
              inputMode="decimal"
              label="Price"
              placeholder="850000000"
              {...register('price')}
            />
            <Input
              error={errors.currency?.message}
              label="Currency"
              maxLength={3}
              placeholder="TZS"
              {...register('currency')}
            />
          </div>
        </div>
      </Card>

      <Card className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Save listing
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            The backend creates listings as drafts. Use lifecycle actions after
            review to publish, pause, resume, or close.
          </p>
        </div>
        <PrimaryButton className="shrink-0" disabled={busy} type="submit">
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            <>
              <Megaphone className="size-4" aria-hidden="true" />
              {submitLabel}
            </>
          )}
        </PrimaryButton>
      </Card>
    </form>
  )
}

function FieldControl({
  children,
  error,
}: {
  children: ReactNode
  error?: string
}) {
  return (
    <div className="grid gap-2">
      {children}
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
