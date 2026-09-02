import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import { Card } from '@/components/ui/Card'

export function PropertyGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <Card className="overflow-hidden p-0" key={index}>
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="grid gap-3 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      ))}
    </div>
  )
}
