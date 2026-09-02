import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarCheck, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { Badge } from '@/components/ui/Badge'
import { PrimaryButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useDecideVerification } from '@/features/verification/hooks/useDecideVerification'
import {
  decisionSchema,
  type DecisionFormValues,
} from '@/features/verification/schemas/verificationForms'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { verificationActionErrorMessage } from '@/features/verification/utils/verificationErrors'
import {
  verificationStatusLabel,
  verificationStatusTone,
} from '@/features/verification/utils/verificationStatus'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export function VerificationDecisionCard({
  canDecide,
  verification,
}: {
  canDecide: boolean
  verification: VerificationDetails
}) {
  const decision = verification.decision
  const isRejected = verification.status === 'REJECTED'
  const isExpired = verification.status === 'EXPIRED'
  const Icon = isRejected || isExpired ? ShieldAlert : ShieldCheck

  return (
    <Card className="grid gap-5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">
            Decision
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
            {decision
              ? decision.outcome === 'APPROVED'
                ? isExpired
                  ? 'Verification Expired'
                  : 'Verified'
                : 'Verification Not Approved'
              : 'Awaiting Decision'}
          </h2>
        </div>
        <Badge tone={verificationStatusTone(verification.status)}>
          {verificationStatusLabel(verification.status)}
        </Badge>
      </div>

      <div className="rounded-card border bg-surface-muted p-4">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-primary/8 text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm leading-6 text-muted-foreground">
              {decision?.summary ??
                'A decision is recorded after the verification has been submitted for review.'}
            </p>
            {decision && (
              <dl className="mt-4 grid gap-2 text-sm">
                <DecisionRow label="Decision date" value={formatDate(decision.decided_at)} />
                {decision.expires_at && (
                  <DecisionRow
                    label="Validity"
                    value={`Valid until ${formatDate(decision.expires_at)}`}
                  />
                )}
                {decision.decidedByName && (
                  <DecisionRow label="Decided by" value={decision.decidedByName} />
                )}
              </dl>
            )}
          </div>
        </div>
      </div>

      {verification.status === 'EXPIRED' && (
        <p className="rounded-control border border-accent/20 bg-accent/8 px-4 py-3 text-sm font-semibold leading-6 text-foreground">
          The previous verification is no longer current. A re-verification
          action should only be offered once the backend supports that workflow.
        </p>
      )}

      <p className="text-sm leading-6 text-muted-foreground">
        Verification reflects the recorded OWERU verification process and
        supporting evidence. Users should review available information when
        making property decisions.
      </p>

      {canDecide && <DecisionForm verification={verification} />}
    </Card>
  )
}

function DecisionForm({ verification }: { verification: VerificationDetails }) {
  const decideVerification = useDecideVerification(verification.id)
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<DecisionFormValues>({
    defaultValues: {
      expires_at: '',
      outcome: 'APPROVED',
      summary: '',
    },
    resolver: zodResolver(decisionSchema),
  })
  const outcome = useWatch({ control, name: 'outcome' })

  useEffect(() => {
    if (decideVerification.isSuccess) {
      reset()
    }
  }, [decideVerification.isSuccess, reset])

  return (
    <form
      className="grid gap-4 rounded-card border bg-surface-muted p-4"
      onSubmit={handleSubmit((values) =>
        decideVerification.mutate({
          expires_at: values.expires_at || undefined,
          outcome: values.outcome,
          summary: values.summary,
        }),
      )}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-foreground">
          Outcome
          <select
            aria-invalid={Boolean(errors.outcome)}
            className="min-h-11 rounded-control border bg-surface px-3 text-sm font-normal text-foreground shadow-sm transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
            {...register('outcome')}
          >
            <option value="APPROVED">Approve</option>
            <option value="REJECTED">Reject</option>
          </select>
        </label>
        <Input
          disabled={outcome === 'REJECTED'}
          error={errors.expires_at?.message}
          label="Expiry date"
          type="date"
          {...register('expires_at')}
        />
      </div>
      <label className="grid gap-2 text-sm font-bold text-foreground">
        Decision summary
        <textarea
          aria-invalid={Boolean(errors.summary)}
          className={cn(
            'min-h-28 rounded-control border bg-surface px-3 py-2 text-sm font-normal text-foreground shadow-sm transition placeholder:text-muted-foreground/75 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15',
            errors.summary &&
              'border-danger focus:border-danger focus:ring-danger/15',
          )}
          placeholder="Summarize the review decision without overstating certainty."
          {...register('summary')}
        />
        {errors.summary?.message && (
          <span className="text-xs text-danger">{errors.summary.message}</span>
        )}
      </label>
      {decideVerification.isError && (
        <p className="text-sm font-semibold text-danger" role="alert">
          {verificationActionErrorMessage(decideVerification.error)}
        </p>
      )}
      <PrimaryButton disabled={decideVerification.isPending} type="submit">
        <CalendarCheck className="size-4" aria-hidden="true" />
        {decideVerification.isPending ? 'Recording...' : 'Record Decision'}
      </PrimaryButton>
    </form>
  )
}

function DecisionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-bold text-foreground">{value}</dd>
    </div>
  )
}
