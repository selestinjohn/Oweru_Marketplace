import { Card } from '@/components/ui/Card'
import { VerificationBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/format'
import type { PropertyDetails } from '@/types/property'
import {
  verificationBadgeState,
  verificationStatusLabel,
} from '@/features/property-details/utils/propertyDetailsUi'
import { VerificationChecklist } from './VerificationChecklist'
import { VerificationEvidence } from './VerificationEvidence'
import { VerificationFindings } from './VerificationFindings'
import { VerificationTimeline } from './VerificationTimeline'

export function PropertyVerification({
  property,
}: {
  property: PropertyDetails
}) {
  const verification = property.verification
  const metadata = [
    { label: 'Verification ID', value: verification.id },
    { label: 'Requested', value: formatDate(verification.requestedDate) },
    { label: 'Assigned Verifier', value: verification.assignedVerifier },
    {
      label: 'Started',
      value: verification.startedDate ? formatDate(verification.startedDate) : 'Pending',
    },
    {
      label: 'Submitted',
      value: verification.submittedDate
        ? formatDate(verification.submittedDate)
        : 'Pending',
    },
    {
      label: 'Decision',
      value: verification.decisionDate
        ? formatDate(verification.decisionDate)
        : 'Pending',
    },
    {
      label: 'Expiry',
      value: verification.expiryDate ? formatDate(verification.expiryDate) : 'Pending',
    },
  ]

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-accent">
            OWERU Verification
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
            {verificationStatusLabel(verification.status)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {verification.summaryNote}
          </p>
        </div>
        <VerificationBadge state={verificationBadgeState(verification.status)} />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metadata.map((item) => (
          <div
            className="rounded-control border bg-surface-muted p-3"
            key={item.label}
          >
            <dt className="text-xs font-bold uppercase text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm font-bold text-foreground">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-7">
        <VerificationTimeline steps={verification.timeline} />
        <VerificationChecklist checks={verification.checks} />
        <VerificationFindings findings={verification.findings} />
        <VerificationEvidence evidence={verification.evidence} />
      </div>
    </Card>
  )
}
