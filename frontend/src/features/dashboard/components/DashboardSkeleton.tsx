import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading dashboard">
      <Card className="p-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-4 h-10 w-72 max-w-full" />
        <Skeleton className="mt-3 h-5 w-[520px] max-w-full" />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card className="p-4" key={index}>
            <Skeleton className="size-10" />
            <Skeleton className="mt-4 h-4 w-32" />
            <Skeleton className="mt-2 h-8 w-16" />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="p-5">
          <Skeleton className="h-7 w-48" />
          <div className="mt-5 grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton className="h-16" key={index} />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <Skeleton className="h-7 w-52" />
          <div className="mt-5 grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="h-36" key={index} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
