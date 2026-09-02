import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import { Card } from '@/components/ui/Card'

export function VerificationDetailsSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true">
      <Skeleton className="h-5 w-36" />
      <Card className="grid gap-4 p-5 lg:grid-cols-[280px_1fr]">
        <Skeleton className="min-h-56 rounded-card" />
        <div className="grid gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <div className="grid gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton className="h-20" key={index} />
            ))}
          </div>
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5">
          <Skeleton className="h-44" />
          <Skeleton className="h-72" />
          <Skeleton className="h-64" />
        </div>
        <div className="grid gap-5">
          <Skeleton className="h-80" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  )
}
