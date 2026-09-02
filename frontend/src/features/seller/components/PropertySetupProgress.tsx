import { CheckCircle2, CircleDashed } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { SellerPropertyBundle } from '@/features/seller/types/seller.types'
import { propertySetupItems } from '@/features/seller/data/mockSellerWorkspace'

export function PropertySetupProgress({
  bundle,
}: {
  bundle: SellerPropertyBundle
}) {
  const items = propertySetupItems(bundle)

  return (
    <Card className="p-5">
      <div>
        <p className="text-xs font-extrabold uppercase text-accent">
          Property Setup
        </p>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground">
          Record progress
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          These steps describe the current frontend-visible record state. OWERU
          backend workflows remain the authority for publication and permissions.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {items.map((item) => {
          const complete = ['Complete', 'Recorded', 'Created', 'Tracked'].includes(
            item.state,
          )

          return (
            <div
              className="flex items-start gap-3 rounded-control border bg-surface p-3"
              key={item.label}
            >
              <span className="mt-0.5 grid size-8 place-items-center rounded-control bg-accent/10 text-accent">
                {complete ? (
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                ) : (
                  <CircleDashed className="size-4" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    {item.label}
                  </h3>
                  <Badge tone={complete ? 'success' : 'muted'}>{item.state}</Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
