import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PrimaryButton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAddVerificationFinding } from '@/features/verification/hooks/useAddVerificationFinding'
import {
  findingSchema,
  type FindingFormValues,
} from '@/features/verification/schemas/verificationForms'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { verificationActionErrorMessage } from '@/features/verification/utils/verificationErrors'
import { cn } from '@/lib/utils'

const severityOptions = [
  { label: 'Informational', value: 'INFORMATIONAL' },
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Critical', value: 'CRITICAL' },
]

export function AddFindingForm({
  verification,
}: {
  verification: VerificationDetails
}) {
  const addFinding = useAddVerificationFinding(verification.id)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FindingFormValues>({
    defaultValues: {
      description: '',
      severity: 'INFORMATIONAL',
      title: '',
      verification_check: '',
    },
    resolver: zodResolver(findingSchema),
  })

  useEffect(() => {
    if (addFinding.isSuccess) {
      reset()
    }
  }, [addFinding.isSuccess, reset])

  return (
    <form
      className="grid gap-4 rounded-card border bg-surface-muted p-4"
      onSubmit={handleSubmit((values) =>
        addFinding.mutate({
          description: values.description,
          severity: values.severity,
          title: values.title,
          ...(values.verification_check
            ? { verification_check: values.verification_check }
            : {}),
        }),
      )}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          error={errors.title?.message}
          label="Finding title"
          placeholder="Example: Inspection evidence pending"
          {...register('title')}
        />
        <label className="grid gap-2 text-sm font-bold text-foreground">
          Severity
          <select
            aria-invalid={Boolean(errors.severity)}
            className="min-h-11 rounded-control border bg-surface px-3 text-sm font-normal text-foreground shadow-sm transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
            {...register('severity')}
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.severity?.message && (
            <span className="text-xs text-danger">
              {errors.severity.message}
            </span>
          )}
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-foreground">
        Related check
        <select
          className="min-h-11 rounded-control border bg-surface px-3 text-sm text-foreground shadow-sm transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
          {...register('verification_check')}
        >
          <option value="">No specific check</option>
          {verification.checks.map((check) => (
            <option key={check.id} value={check.id}>
              {check.title}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-bold text-foreground">
        Description
        <textarea
          aria-invalid={Boolean(errors.description)}
          className={cn(
            'min-h-28 rounded-control border bg-surface px-3 py-2 text-sm font-normal text-foreground shadow-sm transition placeholder:text-muted-foreground/75 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
            errors.description &&
              'border-danger focus:border-danger focus:ring-danger/15',
          )}
          placeholder="Describe the finding without adding private document paths or unsupported claims."
          {...register('description')}
        />
        {errors.description?.message && (
          <span className="text-xs text-danger">
            {errors.description.message}
          </span>
        )}
      </label>

      {addFinding.isError && (
        <p className="text-sm font-semibold text-danger" role="alert">
          {verificationActionErrorMessage(addFinding.error)}
        </p>
      )}

      <PrimaryButton disabled={addFinding.isPending} type="submit">
        {addFinding.isPending ? 'Recording...' : 'Add Finding'}
      </PrimaryButton>
    </form>
  )
}
