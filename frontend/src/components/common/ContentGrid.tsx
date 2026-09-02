import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function ContentGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-6 lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
