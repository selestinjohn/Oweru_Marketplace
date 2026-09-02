import { ArrowRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/buttonVariants'
import type { SellerAttentionItem } from '@/features/seller/types/seller.types'
import { cn } from '@/lib/utils'

export function SellerAttentionList({
  items,
}: {
  items: SellerAttentionItem[]
}) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <article
          className="grid gap-4 rounded-control border bg-surface p-4 transition hover:border-accent/35 hover:bg-muted/50 md:grid-cols-[1fr_auto] md:items-center"
          key={item.id}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid size-9 place-items-center rounded-control bg-warning/10 text-warning">
                <AlertCircle className="size-4" aria-hidden="true" />
              </span>
              <Badge tone={item.tone}>{item.status}</Badge>
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-foreground">
              {item.title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {item.context}
            </p>
          </div>
          <Link
            className={cn(buttonVariants({ variant: 'outline' }), 'w-full md:w-auto')}
            to={item.actionHref}
          >
            {item.actionLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  )
}
