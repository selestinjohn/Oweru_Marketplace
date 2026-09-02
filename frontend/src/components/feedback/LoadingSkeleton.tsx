export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid gap-3" aria-label="Loading" aria-busy="true">
      {Array.from({ length: rows }, (_, index) => (
        <div
          className="h-24 animate-pulse rounded-card border bg-muted shadow-sm"
          key={index}
        />
      ))}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-card bg-muted ${className}`}
      aria-hidden="true"
    />
  )
}
