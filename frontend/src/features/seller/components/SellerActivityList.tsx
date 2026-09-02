import { Link } from 'react-router-dom'
import type { SellerActivity } from '@/features/seller/types/seller.types'
import { cn } from '@/lib/utils'

export function SellerActivityList({ items }: { items: SellerActivity[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const Icon = item.icon
        const content = (
          <>
            <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  {item.title}
                </h3>
                <span className="text-xs font-semibold text-muted-foreground">
                  {item.timestamp}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          </>
        )

        if (item.href) {
          return (
            <Link
              className={cn(
                'flex gap-3 rounded-control border bg-surface p-3 transition hover:border-accent/35 hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              )}
              key={item.id}
              to={item.href}
            >
              {content}
            </Link>
          )
        }

        return (
          <article
            className="flex gap-3 rounded-control border bg-surface p-3"
            key={item.id}
          >
            {content}
          </article>
        )
      })}
    </div>
  )
}
