import { PropertyCard } from './PropertyCard'
import type { PropertyListing } from '@/types/property'

export function PropertyGrid({ properties }: { properties: PropertyListing[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
