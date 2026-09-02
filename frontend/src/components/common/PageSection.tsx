import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PageSection({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode
}) {
  return (
    <section className={cn('py-8 md:py-10', className)} {...props}>
      {children}
    </section>
  )
}
