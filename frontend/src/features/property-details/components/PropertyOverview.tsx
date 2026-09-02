import { Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { PropertyDetails } from '@/types/property'

export function PropertyOverview({ property }: { property: PropertyDetails }) {
  return (
    <div className="grid gap-6">
      <Card className="p-5">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Property Description
        </h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {property.description}
        </p>
      </Card>

      <Card className="p-5">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Key Features
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {property.features.map((feature) => (
            <div
              className="flex items-center gap-3 rounded-control border bg-surface px-3 py-2.5 text-sm font-semibold text-foreground"
              key={feature.id}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <Check className="size-4" aria-hidden="true" />
              </span>
              {feature.label}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
