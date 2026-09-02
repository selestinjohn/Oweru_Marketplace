import { Card } from '@/components/ui/Card'
import { titleCase } from '@/lib/format'
import type { PropertyDetails } from '@/types/property'

function displayValue(value: string) {
  if (value.includes('sqm') || value.includes('-') || /\d/.test(value)) {
    return value.toUpperCase()
  }

  return titleCase(value)
}

export function PropertyDetailsGrid({
  property,
}: {
  property: PropertyDetails
}) {
  return (
    <Card className="p-5">
      <h2 className="font-display text-2xl font-bold text-foreground">
        Property Details
      </h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Structured attributes prepared for future backend detail fields.
      </p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {property.detailItems.map((item) => (
          <div
            className="rounded-control border bg-surface-muted p-4"
            key={item.label}
          >
            <dt className="text-xs font-bold uppercase text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">
              {displayValue(item.value)}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
