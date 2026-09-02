import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function DashboardShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-[1380px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8',
        className,
      )}
    >
      {children}
    </div>
  )
}
