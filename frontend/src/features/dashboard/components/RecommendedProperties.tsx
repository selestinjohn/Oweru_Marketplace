import { Link } from 'react-router-dom'
import { PropertyCard } from '@/components/property/PropertyCard'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import type { PropertyListing } from '@/types/property'
import { cn } from '@/lib/utils'

export function RecommendedProperties({
  properties,
}: {
  properties: PropertyListing[]
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
        {properties.slice(0, 2).map((property) => (
          <PropertyCard property={property} key={property.id} />
        ))}
      </div>
      <Link
        className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
        to={routePaths.properties}
      >
        View all properties
      </Link>
    </div>
  )
}
