import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { cn } from '@/lib/utils'

export function VerificationEmptyState() {
  return (
    <EmptyState
      title="No verification activity yet"
      message="When you request property verification, OWERU will show timeline, checklist, evidence, and decision updates here."
    />
  )
}

export function VerificationNotFoundState() {
  return (
    <div className="grid gap-4">
      <EmptyState
        title="Verification not found"
        message="This verification may no longer be available or the link may be incorrect."
      />
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          className={cn(buttonVariants({ variant: 'outline' }), 'sm:w-auto')}
          to={routePaths.verifications}
        >
          Back to Verifications
        </Link>
        <Link
          className={cn(buttonVariants({ variant: 'outline' }), 'sm:w-auto')}
          to={routePaths.dashboard}
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}
