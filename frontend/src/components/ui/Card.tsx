import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card border bg-card text-foreground shadow-panel',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('grid gap-1.5 p-5', className)}>{children}</div>
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('p-5 pt-0', className)}>{children}</div>
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        'font-display text-lg font-bold leading-tight text-foreground',
        className,
      )}
    >
      {children}
    </h2>
  )
}
