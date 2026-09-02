import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PrimaryButton } from '@/components/ui/Button'
import { useAttachVerificationEvidence } from '@/features/verification/hooks/useAttachVerificationEvidence'
import {
  evidenceAttachmentSchema,
  type EvidenceAttachmentFormValues,
} from '@/features/verification/schemas/verificationForms'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { verificationActionErrorMessage } from '@/features/verification/utils/verificationErrors'
import { evidenceSourceLabel } from '@/features/verification/utils/verificationStatus'
import { cn } from '@/lib/utils'

export function AttachEvidenceForm({
  verification,
}: {
  verification: VerificationDetails
}) {
  const attachEvidence = useAttachVerificationEvidence(verification.id)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<EvidenceAttachmentFormValues>({
    defaultValues: {
      evidence: '',
      relevance_note: '',
    },
    resolver: zodResolver(evidenceAttachmentSchema),
  })

  useEffect(() => {
    if (attachEvidence.isSuccess) {
      reset()
    }
  }, [attachEvidence.isSuccess, reset])

  return (
    <form
      className="grid gap-4 rounded-card border bg-surface-muted p-4"
      onSubmit={handleSubmit((values) =>
        attachEvidence.mutate({
          evidence: values.evidence,
          relevance_note: values.relevance_note || undefined,
        }),
      )}
    >
      <label className="grid gap-2 text-sm font-bold text-foreground">
        Evidence from this property
        <select
          aria-invalid={Boolean(errors.evidence)}
          className={cn(
            'min-h-11 rounded-control border bg-surface px-3 text-sm font-normal text-foreground shadow-sm transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
            errors.evidence &&
              'border-danger focus:border-danger focus:ring-danger/15',
          )}
          {...register('evidence')}
        >
          <option value="">Select evidence</option>
          {verification.availableEvidence
            .filter((evidence) => evidence.property === verification.property)
            .map((evidence) => (
              <option key={evidence.id} value={evidence.id}>
                {evidence.title} · {evidenceSourceLabel(evidence.source_type)}
              </option>
            ))}
        </select>
        {errors.evidence?.message && (
          <span className="text-xs text-danger">{errors.evidence.message}</span>
        )}
      </label>

      <label className="grid gap-2 text-sm font-bold text-foreground">
        Relevance note
        <textarea
          aria-invalid={Boolean(errors.relevance_note)}
          className={cn(
            'min-h-24 rounded-control border bg-surface px-3 py-2 text-sm font-normal text-foreground shadow-sm transition placeholder:text-muted-foreground/75 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
            errors.relevance_note &&
              'border-danger focus:border-danger focus:ring-danger/15',
          )}
          placeholder="Explain why this evidence is relevant to this verification."
          {...register('relevance_note')}
        />
        {errors.relevance_note?.message && (
          <span className="text-xs text-danger">
            {errors.relevance_note.message}
          </span>
        )}
      </label>

      {attachEvidence.isError && (
        <p className="text-sm font-semibold text-danger" role="alert">
          {verificationActionErrorMessage(attachEvidence.error)}
        </p>
      )}

      <PrimaryButton disabled={attachEvidence.isPending} type="submit">
        {attachEvidence.isPending ? 'Attaching...' : 'Attach Evidence'}
      </PrimaryButton>
    </form>
  )
}
