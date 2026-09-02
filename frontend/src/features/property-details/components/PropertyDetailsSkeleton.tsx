import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import { Card } from '@/components/ui/Card'

export function PropertyDetailsSkeleton() {
  return (
    <PageSection className="bg-surface-muted">
      <AppContainer className="grid gap-6" aria-busy="true">
        <Skeleton className="h-6 w-44" />
        <div className="grid gap-3">
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="h-6 w-72" />
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr]">
          <Skeleton className="min-h-[420px]" />
          <div className="grid gap-3">
            <Skeleton className="min-h-[204px]" />
            <Skeleton className="min-h-[204px]" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="p-5">
            <Skeleton className="h-12 w-full" />
            <div className="mt-6 grid gap-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          </Card>
          <div className="grid gap-4">
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </AppContainer>
    </PageSection>
  )
}
