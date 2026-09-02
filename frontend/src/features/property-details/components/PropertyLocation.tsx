import { Card } from '@/components/ui/Card'
import type { PropertyDetails } from '@/types/property'
import { PropertyLocationMap } from './PropertyLocationMap'

export function PropertyLocation({ property }: { property: PropertyDetails }) {
  return (
    <Card className="grid gap-5 p-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Location
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {property.locationInfo.area}, {property.locationInfo.district},{' '}
          {property.locationInfo.city}
        </p>
      </div>
      <PropertyLocationMap location={property.locationInfo} />
      <p className="rounded-control border bg-surface-muted p-3 text-xs leading-5 text-muted-foreground">
        {property.locationInfo.note}
      </p>
    </Card>
  )
}
