import { Clock3 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/format'
import type { PropertyDetails } from '@/types/property'

export function PropertyHistory({ property }: { property: PropertyDetails }) {
  return (
    <Card className="p-5">
      <h2 className="font-display text-2xl font-bold text-foreground">
        Property History
      </h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        A public summary of the recorded OWERU property lifecycle.
      </p>

      <ol className="mt-6 grid gap-5">
        {property.history.map((event, index) => (
          <li className="relative flex gap-4" key={event.id}>
            {index < property.history.length - 1 && (
              <span
                className="absolute left-5 top-11 h-[calc(100%+1.25rem)] w-px bg-border"
                aria-hidden="true"
              />
            )}
            <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border bg-surface text-accent shadow-sm">
              <Clock3 className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 rounded-card border bg-surface-muted p-4">
              <p className="text-xs font-bold uppercase text-accent">
                {formatDate(event.date)}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                {event.event}
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {event.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}
