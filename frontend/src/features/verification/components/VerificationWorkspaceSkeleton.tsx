import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import { Card } from '@/components/ui/Card'

export function VerificationWorkspaceSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true">
      <div className="grid gap-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-9 w-80 max-w-full" />
        <Skeleton className="h-5 w-[520px] max-w-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-28" key={index} />
        ))}
      </div>
      <Card className="grid gap-3 p-5">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-24" key={index} />
        ))}
      </Card>
    </div>
  )
}
