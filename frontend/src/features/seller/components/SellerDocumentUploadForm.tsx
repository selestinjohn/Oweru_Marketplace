import { useState } from 'react'
import type { ReactNode } from 'react'
import type { FieldPath } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, FilePlus2, Loader2 } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { sellerDocumentTypes } from '@/features/seller/data/mockSellerWorkspace'
import {
  sellerDocumentSchema,
  type SellerDocumentFormValues,
} from '@/features/seller/schemas/sellerForms'
import { normalizeSellerError } from '@/features/seller/api/sellerApi'

const documentFields: FieldPath<SellerDocumentFormValues>[] = [
  'description',
  'documentType',
  'expiresAt',
  'file',
  'issuedAt',
]

export function SellerDocumentUploadForm({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting?: boolean
  onSubmit: (values: SellerDocumentFormValues) => Promise<void>
}) {
  const [formError, setFormError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting: formSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<SellerDocumentFormValues>({
    defaultValues: {
      description: '',
      documentType: 'OWNERSHIP',
      expiresAt: '',
      issuedAt: '',
    },
    resolver: zodResolver(sellerDocumentSchema),
  })
  const busy = Boolean(isSubmitting || formSubmitting)

  const submit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await onSubmit(values)
    } catch (error) {
      const normalized = normalizeSellerError(error)

      Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
        if (documentFields.includes(field as FieldPath<SellerDocumentFormValues>)) {
          setError(field as FieldPath<SellerDocumentFormValues>, {
            message,
            type: 'server',
          })
        }
      })

      setFormError(normalized.formError)
    }
  })

  return (
    <Card className="p-5">
      <div className="mb-5">
        <p className="text-xs font-extrabold uppercase text-accent">
          Secure Document Upload
        </p>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground">
          Add Document
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Seller uploads are recorded as User Supplied. OWERU or authority
          provenance must be established by backend-controlled workflows.
        </p>
      </div>

      <form className="grid gap-4" noValidate onSubmit={submit}>
        {formError && (
          <div className="flex gap-3 rounded-control border border-danger/20 bg-danger/8 p-4 text-danger">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p className="text-sm font-semibold leading-6">{formError}</p>
          </div>
        )}

        <FieldControl error={errors.documentType?.message}>
          <Select
            label="Document type"
            options={sellerDocumentTypes()}
            {...register('documentType')}
          />
        </FieldControl>

        <Textarea
          className="min-h-24"
          error={errors.description?.message}
          label="Description"
          placeholder="Add a short note about this document."
          {...register('description')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            error={errors.issuedAt?.message}
            label="Issue date"
            type="date"
            {...register('issuedAt')}
          />
          <Input
            error={errors.expiresAt?.message}
            label="Expiry date"
            type="date"
            {...register('expiresAt')}
          />
        </div>

        <Input
          error={errors.file?.message}
          label="Document file"
          type="file"
          {...register('file')}
        />

        <div className="rounded-control border bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
          The interface never displays private storage paths or document file
          references. Access is mediated by OWERU's authorized document API.
        </div>

        <PrimaryButton className="w-full sm:w-auto" disabled={busy} type="submit">
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Uploading...
            </>
          ) : (
            <>
              <FilePlus2 className="size-4" aria-hidden="true" />
              Upload Document
            </>
          )}
        </PrimaryButton>
      </form>
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
