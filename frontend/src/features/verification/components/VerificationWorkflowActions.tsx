import { useEffect, useRef, useState } from 'react'
import { PlayCircle, SendHorizonal, X } from 'lucide-react'
import { OutlineButton, PrimaryButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useStartVerification } from '@/features/verification/hooks/useStartVerification'
import { useSubmitVerification } from '@/features/verification/hooks/useSubmitVerification'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { verificationActionErrorMessage } from '@/features/verification/utils/verificationErrors'

export function VerificationWorkflowActions({
  canStart,
  canSubmit,
  verification,
}: {
  canStart: boolean
  canSubmit: boolean
  verification: VerificationDetails
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const startVerification = useStartVerification(verification.id)
  const submitVerification = useSubmitVerification(verification.id)
  const error = startVerification.error ?? submitVerification.error

  useEffect(() => {
    if (isConfirmOpen) {
      closeButtonRef.current?.focus()
    }
  }, [isConfirmOpen])

  if (!canStart && !canSubmit) {
    return null
  }

  return (
    <Card className="grid gap-4 p-5">
      <div>
        <p className="text-xs font-extrabold uppercase text-accent">
          Verifier Actions
        </p>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground">
          Workflow controls
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          These controls call backend workflow actions. They do not patch status
          directly from the browser.
        </p>
      </div>

      {error && (
        <p className="rounded-control border border-danger/20 bg-danger/8 px-3 py-3 text-sm font-semibold text-danger">
          {verificationActionErrorMessage(error)}
        </p>
      )}

      {canStart && (
        <PrimaryButton
          disabled={startVerification.isPending}
          onClick={() => startVerification.mutate()}
        >
          <PlayCircle className="size-4" aria-hidden="true" />
          {startVerification.isPending ? 'Starting...' : 'Start Verification'}
        </PrimaryButton>
      )}

      {canSubmit && (
        <PrimaryButton onClick={() => setIsConfirmOpen(true)}>
          <SendHorizonal className="size-4" aria-hidden="true" />
          Submit Verification
        </PrimaryButton>
      )}

      {isConfirmOpen && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 grid place-items-center bg-primary/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-verification-title"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsConfirmOpen(false)
            }

            if (event.key !== 'Tab' || !dialogRef.current) {
              return
            }

            const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
            )
            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (!first || !last) {
              return
            }

            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault()
              last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault()
              first.focus()
            }
          }}
        >
          <Card className="w-full max-w-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase text-accent">
                  Submit for Review
                </p>
                <h3
                  className="mt-2 font-display text-2xl font-bold text-foreground"
                  id="submit-verification-title"
                >
                  Submit verification?
                </h3>
              </div>
              <OutlineButton
                aria-label="Close submit verification confirmation"
                className="size-10 p-0"
                onClick={() => setIsConfirmOpen(false)}
                ref={closeButtonRef}
              >
                <X className="size-4" aria-hidden="true" />
              </OutlineButton>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Once submitted, the verification moves to review. Submission does
              not mean approval, and a decision must be recorded separately.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <OutlineButton onClick={() => setIsConfirmOpen(false)}>
                Cancel
              </OutlineButton>
              <PrimaryButton
                disabled={submitVerification.isPending}
                onClick={() =>
                  submitVerification.mutate(undefined, {
                    onSuccess: () => setIsConfirmOpen(false),
                  })
                }
              >
                {submitVerification.isPending
                  ? 'Submitting...'
                  : 'Submit Verification'}
              </PrimaryButton>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}
