import type { LucideIcon } from 'lucide-react'
import { Clock3, FileCheck2, ShieldCheck, TimerOff } from 'lucide-react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Card } from '@/components/ui/Card'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { useVerifications } from '@/features/verification/hooks/useVerifications'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { VerificationRecordCard } from '../components/VerificationRecordCard'

export function VerificationListPage() {
  const verificationsQuery = useVerifications()
  const verifications = verificationsQuery.data ?? []

  if (verificationsQuery.isLoading) {
    return <DashboardSkeleton />
  }

  if (verificationsQuery.isError) {
    return (
      <ErrorState
        title="Unable to load verifications"
        message="OWERU could not load your verification activity. Please try again."
        action={{
          label: 'Try Again',
          onClick: () => void verificationsQuery.refetch(),
        }}
      />
    )
  }

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Verifications"
        title="Verification requests"
        description="Track the progress and outcome of your OWERU verification requests."
      />

      <VerificationListStats verifications={verifications} />

      {!verifications.length ? (
        <EmptyState
          title="No verification activity yet"
          message="When you request property verification, you can track its progress here."
        />
      ) : (
        <section className="grid gap-3" aria-label="Verification records">
          {verifications.map((verification) => (
            <VerificationRecordCard
              key={verification.id}
              verification={verification}
            />
          ))}
        </section>
      )}
    </div>
  )
}

function VerificationListStats({
  verifications,
}: {
  verifications: VerificationDetails[]
}) {
  const active = verifications.filter((verification) =>
    ['ASSIGNED', 'IN_PROGRESS'].includes(verification.status),
  ).length
  const pendingDecision = verifications.filter(
    (verification) => verification.status === 'SUBMITTED',
  ).length
  const verified = verifications.filter(
    (verification) => verification.status === 'APPROVED',
  ).length
  const expired = verifications.filter(
    (verification) => verification.status === 'EXPIRED',
  ).length

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <CompactStat icon={Clock3} label="Active" value={String(active)} />
      <CompactStat
        icon={FileCheck2}
        label="Pending Decision"
        value={String(pendingDecision)}
      />
      <CompactStat icon={ShieldCheck} label="Verified" value={String(verified)} />
      <CompactStat icon={TimerOff} label="Expired" value={String(expired)} />
    </section>
  )
}

function CompactStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div>
        <p className="text-xs font-extrabold uppercase text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 font-display text-3xl font-bold text-foreground">
          {value}
        </p>
      </div>
      <span className="grid size-11 place-items-center rounded-control bg-accent/10 text-accent">
        <Icon className="size-5" aria-hidden="true" />
      </span>
    </Card>
  )
}
