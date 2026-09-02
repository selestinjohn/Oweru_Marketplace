import { MapPinned } from 'lucide-react'
import type { PropertyLocationInfo } from '@/types/property'

export function PropertyLocationMap({
  location,
}: {
  location: PropertyLocationInfo
}) {
  return (
    <div className="relative min-h-72 overflow-hidden rounded-card border bg-primary text-primary-foreground">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(var(--primary-foreground)_1px,transparent_1px),linear-gradient(90deg,var(--primary-foreground)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(200,145,40,0.26),transparent_30%)]" />
      <div className="relative grid min-h-72 place-items-center p-6 text-center">
        <div>
          <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <MapPinned className="size-7" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-2xl font-bold">
            {location.area}
          </h3>
          <p className="mt-1 text-sm text-primary-foreground/72">
            {location.district}, {location.city}
          </p>
          {location.coordinates && (
            <p className="mt-3 text-xs font-semibold text-primary-foreground/58">
              {location.coordinates.latitude.toFixed(4)},{' '}
              {location.coordinates.longitude.toFixed(4)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
