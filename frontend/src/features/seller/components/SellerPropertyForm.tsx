import { useState } from 'react'
import type { ReactNode } from 'react'
import type { FieldPath } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Save } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { sellerPropertyTypeOptions } from '@/features/seller/data/mockSellerWorkspace'
import {
  sellerPropertySchema,
  type SellerPropertyFormValues,
} from '@/features/seller/schemas/sellerForms'
import type { SellerPropertyBundle } from '@/features/seller/types/seller.types'
import { normalizeSellerError } from '@/features/seller/api/sellerApi'

const propertyFields: FieldPath<SellerPropertyFormValues>[] = [
  'description',
  'latitude',
  'locationDescription',
  'longitude',
  'ownershipBasis',
  'propertyType',
  'referenceNumber',
]

export function SellerPropertyForm({
  bundle,
  isSubmitting,
  onSubmit,
  submitLabel = 'Create Property Record',
}: {
  bundle?: SellerPropertyBundle
  isSubmitting?: boolean
  onSubmit: (values: SellerPropertyFormValues) => Promise<void>
  submitLabel?: string
}) {
  const [formError, setFormError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting: formSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<SellerPropertyFormValues>({
    defaultValues: {
      description: bundle?.property.description ?? '',
      latitude: bundle?.property.latitude ?? '',
      locationDescription: bundle?.property.location_description ?? '',
      longitude: bundle?.property.longitude ?? '',
      ownershipBasis: bundle?.property.ownership_basis ?? '',
      propertyType: bundle?.property.property_type ?? 'HOUSE',
      referenceNumber: bundle?.property.reference_number ?? '',
    },
    resolver: zodResolver(sellerPropertySchema),
  })
  const busy = Boolean(isSubmitting || formSubmitting)

  const submit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await onSubmit(values)
    } catch (error) {
      const normalized = normalizeSellerError(error)

      Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
        if (propertyFields.includes(field as FieldPath<SellerPropertyFormValues>)) {
          setError(field as FieldPath<SellerPropertyFormValues>, {
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

      <FormSection
        eyebrow="Property Record"
        title="Basic Information"
        description="Create the durable property record first. Listing price and marketplace publication come later."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            error={errors.referenceNumber?.message}
            label="Property reference number"
            placeholder="P-OWR-2026-000900"
            {...register('referenceNumber')}
          />
          <FieldControl error={errors.propertyType?.message}>
            <Select
              label="Property type"
              options={sellerPropertyTypeOptions.filter(
                (option) => option.value !== 'all',
              )}
              {...register('propertyType')}
            />
          </FieldControl>
        </div>
        <Textarea
          error={errors.description?.message}
          label="Property description"
          placeholder="Describe the property record, physical context, and key facts."
          {...register('description')}
        />
      </FormSection>

      <FormSection
        eyebrow="Location"
        title="Location Information"
        description="Coordinates are optional and support discovery only; they are not legal boundary evidence."
      >
        <Textarea
          className="min-h-24"
          error={errors.locationDescription?.message}
          label="Location description"
          placeholder="Example: Masaki, Dar es Salaam"
          {...register('locationDescription')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            error={errors.latitude?.message}
            inputMode="decimal"
            label="Latitude"
            placeholder="-6.7448920"
            {...register('latitude')}
          />
          <Input
            error={errors.longitude?.message}
            inputMode="decimal"
            label="Longitude"
            placeholder="39.2786410"
            {...register('longitude')}
          />
        </div>
      </FormSection>

      <FormSection
        eyebrow="Ownership"
        title="Ownership Information"
        description="Record the basis for the seller relationship without marking yourself as verified."
      >
        <Textarea
          className="min-h-24"
          error={errors.ownershipBasis?.message}
          label="Ownership basis"
          placeholder="Example: Registered owner with seller authorization on record."
          {...register('ownershipBasis')}
        />
      </FormSection>

      <Card className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Review and continue
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            After saving the property record, continue with documents,
            verification, then listing publication.
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
              <Save className="size-4" aria-hidden="true" />
              {submitLabel}
            </>
          )}
        </PrimaryButton>
      </Card>
    </form>
  )
}

function FormSection({
  children,
  description,
  eyebrow,
  title,
}: {
  children: ReactNode
  description: string
  eyebrow: string
  title: string
}) {
  return (
    <Card className="p-5">
      <div className="mb-5">
        <p className="text-xs font-extrabold uppercase text-accent">{eyebrow}</p>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="grid gap-4">{children}</div>
    </Card>
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
