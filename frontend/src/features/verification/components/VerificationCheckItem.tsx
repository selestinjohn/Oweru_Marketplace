import { useId, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { OutlineButton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAddVerificationCheck } from '@/features/verification/hooks/useAddVerificationCheck'
import type {
  VerificationCheck,
  VerificationCheckStatus,
} from '@/features/verification/types/verification.types'
import { verificationActionErrorMessage } from '@/features/verification/utils/verificationErrors'
import {
  checkStatusLabel,
  checkStatusTone,
} from '@/features/verification/utils/verificationStatus'
import { formatDate } from '@/lib/format'

const checkStatusOptions: Array<{
  label: string
  value: VerificationCheckStatus
}> = [
  { label: 'Not Started', value: 'NOT_STARTED' },
  { label: 'Pass', value: 'PASS' },
  { label: 'Fail', value: 'FAIL' },
  { label: 'Not Applicable', value: 'NOT_APPLICABLE' },
]

export function VerificationCheckItem({
  canEdit,
  check,
  verificationId,
}: {
  canEdit: boolean
  check: VerificationCheck
  verificationId: string
}) {
  const findingsId = useId()
  const [status, setStatus] = useState<VerificationCheckStatus>(check.status)
  const [findings, setFindings] = useState(check.findings)
  const addCheck = useAddVerificationCheck(verificationId)

  return (
    <article className="grid gap-4 rounded-card border bg-surface p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-primary/8 text-primary">
            <ClipboardCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              {check.title}
            </h3>
            {check.description && (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {check.description}
              </p>
            )}
            {check.findings && (
              <p className="mt-2 text-sm font-semibold text-foreground">
                Notes: {check.findings}
              </p>
            )}
            {check.completed_at && (
              <p className="mt-2 text-xs font-bold uppercase text-muted-foreground">
                Completed {formatDate(check.completed_at)}
              </p>
            )}
          </div>
        </div>
        <Badge tone={checkStatusTone(check.status)}>
          {checkStatusLabel(check.status)}
        </Badge>
      </div>

      {canEdit && (
        <form
          className="grid gap-3 rounded-control border bg-surface-muted p-3 md:grid-cols-[180px_1fr_auto] md:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            addCheck.mutate({
              code: check.code,
              description: check.description,
              findings,
              status,
              title: check.title,
            })
          }}
        >
          <Select
            label="Result"
            name={`${check.id}-status`}
            options={checkStatusOptions}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as VerificationCheckStatus)
            }
          />
          <Input
            id={findingsId}
            label="Notes"
            name={`${check.id}-findings`}
            placeholder="Add concise check notes"
            value={findings}
            onChange={(event) => setFindings(event.target.value)}
          />
          <OutlineButton disabled={addCheck.isPending} type="submit">
            {addCheck.isPending ? 'Saving...' : 'Record Check'}
          </OutlineButton>
          {addCheck.isError && (
            <p className="text-sm font-semibold text-danger md:col-span-3" role="alert">
              {verificationActionErrorMessage(addCheck.error)}
            </p>
          )}
        </form>
      )}
    </article>
  )
}
