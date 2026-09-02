import { Bath, BedDouble, Building2, Maximize2 } from 'lucide-react'
import { titleCase } from '@/lib/format'
import type { PropertyDetails } from '@/types/property'

export function PropertySummaryStats({ property }: { property: PropertyDetails }) {
  const stats = [
    ...(property.bedrooms
      ? [{ icon: BedDouble, label: `${property.bedrooms} Beds` }]
      : []),
    ...(property.bathrooms
      ? [{ icon: Bath, label: `${property.bathrooms} Baths` }]
      : []),
    { icon: Maximize2, label: `${property.area.toLocaleString('en-TZ')} sqm` },
    { icon: Building2, label: titleCase(property.propertyType) },
  ]

  return (
    <dl className="flex flex-wrap gap-2">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <div
            className="inline-flex min-h-11 items-center gap-2 rounded-control border bg-surface px-3 text-sm font-bold text-muted-foreground shadow-sm"
            key={stat.label}
          >
            <Icon className="size-4 text-accent" aria-hidden="true" />
            <dt className="sr-only">{stat.label}</dt>
            <dd>{stat.label}</dd>
          </div>
        )
      })}
    </dl>
  )
}
