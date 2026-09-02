import type { LucideIcon } from 'lucide-react'
import { ClipboardCheck, FileCheck2, PlayCircle, ShieldCheck } from 'lucide-react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/app/providers/authContext'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { useVerificationWorkspace } from '@/features/verification/hooks/useVerificationWorkspace'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { VerificationAssignmentCard } from '../components/VerificationAssignmentCard'
import { VerificationWorkspaceSkeleton } from '../components/VerificationWorkspaceSkeleton'

export function VerificationWorkspacePage() {
  const { currentUser } = useAuth()
  const workspaceQuery = useVerificationWorkspace()
  const assignments = workspaceQuery.data ?? []

  if (workspaceQuery.isLoading) {
    return <VerificationWorkspaceSkeleton />
  }

  if (workspaceQuery.isError) {
    return (
      <ErrorState
        title="Unable to load verification workspace"
        message="OWERU could not load assigned verification work. Please try again."
        action={{
          label: 'Try Again',
          onClick: () => void workspaceQuery.refetch(),
        }}
      />
    )
  }

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Verifier"
        title="Verification Workspace"
        description="Manage assigned OWERU verification work, review checklists, record findings, attach evidence, and submit completed records."
      />

      <WorkspaceStats assignments={assignments} />

      <Card className="grid gap-4 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-accent">
              Assignments
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Assigned Verifications
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Actions follow the backend workflow. Assigned records can be
            started, in-progress records can be continued, and submitted records
            are ready for review context.
          </p>
        </div>

        {!assignments.length ? (
          <EmptyState
            title="No assigned verifications"
            message="New verification assignments will appear here."
          />
        ) : (
          <div className="grid gap-3">
            {assignments.map((assignment) => (
              <VerificationAssignmentCard
                currentUser={currentUser}
                key={assignment.id}
                verification={assignment}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function WorkspaceStats({
  assignments,
}: {
  assignments: VerificationDetails[]
}) {
  const assigned = assignments.filter(
    (assignment) => assignment.status === 'ASSIGNED',
  ).length
  const inProgress = assignments.filter(
    (assignment) => assignment.status === 'IN_PROGRESS',
  ).length
  const submitted = assignments.filter(
    (assignment) => assignment.status === 'SUBMITTED',
  ).length
  const completed = assignments.filter((assignment) =>
    ['APPROVED', 'REJECTED', 'EXPIRED'].includes(assignment.status),
  ).length

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <WorkspaceStat icon={ClipboardCheck} label="Assigned" value={assigned} />
      <WorkspaceStat icon={PlayCircle} label="In Progress" value={inProgress} />
      <WorkspaceStat icon={FileCheck2} label="Submitted" value={submitted} />
      <WorkspaceStat icon={ShieldCheck} label="Completed" value={completed} />
    </section>
  )
}

function WorkspaceStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: number
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
      <span className="grid size-11 place-items-center rounded-control bg-primary/8 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
    </Card>
  )
}
