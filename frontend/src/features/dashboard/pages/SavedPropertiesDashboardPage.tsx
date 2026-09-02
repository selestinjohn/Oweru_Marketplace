import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PropertyGridSkeleton } from '@/components/property/PropertyGridSkeleton'
import { PropertyCard } from '@/components/property/PropertyCard'
import { OutlineButton } from '@/components/ui/Button'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { useDashboardOverview } from '@/features/dashboard/hooks/useDashboardOverview'
import { formatDate } from '@/lib/format'

export function SavedPropertiesDashboardPage() {
  const navigate = useNavigate()
  const dashboardQuery = useDashboardOverview()
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const savedProperties = useMemo(
    () =>
      dashboardQuery.data?.savedProperties.filter(
        (item) => !removedIds.includes(item.property.id),
      ) ?? [],
    [dashboardQuery.data?.savedProperties, removedIds],
  )

  if (dashboardQuery.isPending) {
    return <PropertyGridSkeleton />
  }

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Saved properties"
        title="Saved opportunities"
        description="Properties you've saved for later comparison and follow-up."
      />

      {!savedProperties.length ? (
        <EmptyState
          title="No saved properties yet"
          message="Save properties while browsing and they'll appear here."
          action={{
            label: 'Browse Properties',
            onClick: () => navigate(routePaths.properties),
          }}
        />
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {savedProperties.map((saved) => (
            <article className="grid gap-3" key={saved.property.id}>
              <PropertyCard property={saved.property} />
              <div className="grid gap-3 rounded-card border bg-surface-muted p-4 shadow-sm">
                <p className="text-sm leading-6 text-muted-foreground">
                  {saved.note}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase text-muted-foreground">
                    Saved {formatDate(saved.savedAt)}
                  </span>
                  <OutlineButton
                    size="sm"
                    onClick={() =>
                      setRemovedIds((ids) => [...ids, saved.property.id])
                    }
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Remove
                  </OutlineButton>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
