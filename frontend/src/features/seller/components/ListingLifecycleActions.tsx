import { AlertCircle, Pause, Play, Send, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Button, OutlineButton } from '@/components/ui/Button'
import { useListingWorkflowAction } from '@/features/seller/hooks/useSellerMutations'
import type {
  ListingWorkflowAction,
  SellerListing,
} from '@/features/seller/types/seller.types'
import { normalizeSellerError } from '@/features/seller/api/sellerApi'

export function ListingLifecycleActions({
  listing,
}: {
  listing: SellerListing
}) {
  const transition = useListingWorkflowAction(listing.id)
  const [error, setError] = useState<string | null>(null)
  const actions = workflowActionsForStatus(listing.status)

  async function runAction(action: ListingWorkflowAction) {
    setError(null)

    try {
      await transition.mutateAsync(action)
    } catch (actionError) {
      setError(normalizeSellerError(actionError).formError)
    }
  }

  if (!actions.length) {
    return (
      <div className="rounded-control border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
        No direct lifecycle action is available for this listing status in the
        current backend contract.
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {error && (
        <div className="flex gap-2 rounded-control border border-danger/20 bg-danger/8 p-3 text-sm font-semibold text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          const ActionButton = action.variant === 'primary' ? Button : OutlineButton

          return (
            <ActionButton
              disabled={transition.isPending}
              key={action.value}
              onClick={() => void runAction(action.value)}
            >
              <Icon className="size-4" aria-hidden="true" />
              {action.label}
            </ActionButton>
          )
        })}
      </div>
    </div>
  )
}

function workflowActionsForStatus(status: SellerListing['status']) {
  if (status === 'DRAFT') {
    return [
      {
        icon: Send,
        label: 'Publish Listing',
        value: 'publish' as const,
        variant: 'primary' as const,
      },
    ]
  }

  if (status === 'PUBLISHED') {
    return [
      {
        icon: Pause,
        label: 'Pause',
        value: 'pause' as const,
        variant: 'outline' as const,
      },
      {
        icon: XCircle,
        label: 'Close',
        value: 'close' as const,
        variant: 'outline' as const,
      },
    ]
  }

  if (status === 'PAUSED') {
    return [
      {
        icon: Play,
        label: 'Resume',
        value: 'resume' as const,
        variant: 'primary' as const,
      },
      {
        icon: XCircle,
        label: 'Close',
        value: 'close' as const,
        variant: 'outline' as const,
      },
    ]
  }

  return []
}
