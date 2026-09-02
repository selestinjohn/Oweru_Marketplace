import { useState } from 'react'
import {
  Bath,
  BedDouble,
  Building2,
  FileCheck2,
  Heart,
  MapPin,
  Maximize2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { VerificationBadge, StatusBadge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import { formatCurrency, formatNumber, titleCase } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { PropertyListing } from '@/types/property'

export function PropertyCard({ property }: { property: PropertyListing }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const detailPath = routePaths.propertyDetail.replace(
    ':propertyId',
    property.id,
  )
  const isResidential =
    property.propertyType === 'house' || property.propertyType === 'apartment'
  const detailStats = [
    {
      icon: isResidential ? BedDouble : Building2,
      label:
        isResidential && property.bedrooms
          ? `${property.bedrooms} beds`
          : titleCase(property.propertyType),
      srLabel: isResidential ? 'Bedrooms' : 'Property category',
    },
    {
      icon: property.bathrooms ? Bath : FileCheck2,
      label: property.bathrooms
        ? `${property.bathrooms} baths`
        : property.propertyType === 'land' || property.propertyType === 'agricultural'
          ? 'Title ready'
          : 'Facilities',
      srLabel: property.bathrooms ? 'Bathrooms' : 'Readiness',
    },
    {
      icon: Maximize2,
      label: `${formatNumber(property.area)} sqm`,
      srLabel: 'Area',
    },
  ]

  return (
    <Card
      className="group overflow-hidden shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent/35 hover:shadow-soft"
      data-testid="property-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Link to={detailPath} aria-label={`View ${property.title}`}>
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
            src={property.image}
            alt={`${property.title} in ${property.location}`}
            loading="lazy"
            decoding="async"
          />
        </Link>
        <div className="absolute left-3 top-3">
          <StatusBadge status={property.transactionType} />
        </div>
        <div className="absolute right-3 top-3">
          <IconButton
            className={cn(
              'bg-surface/90 text-muted-foreground shadow-panel hover:text-danger',
              isFavorite && 'text-danger',
            )}
            label={
              isFavorite
                ? `Remove ${property.title} from saved properties`
                : `Save ${property.title}`
            }
            onClick={() => setIsFavorite((current) => !current)}
            variant="ghost"
          >
            <Heart
              className={cn('size-5', isFavorite && 'fill-current')}
              aria-hidden="true"
            />
          </IconButton>
        </div>
      </div>

      <div className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              {titleCase(property.propertyType)}
            </p>
            <Link to={detailPath}>
              <h2 className="mt-1 line-clamp-2 font-display text-xl font-bold leading-tight text-foreground transition group-hover:text-accent">
                {property.title}
              </h2>
            </Link>
          </div>
          <VerificationBadge state={property.verificationState} />
        </div>

        <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <MapPin className="size-4 text-accent" aria-hidden="true" />
          {property.location}
        </p>

        <div>
          <p className="font-display text-2xl font-bold leading-none text-foreground">
            {formatCurrency(property.price, property.currency)}
          </p>
          {property.transactionType === 'rent' && (
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              per month
            </p>
          )}
        </div>

        <dl className="grid grid-cols-3 gap-2 border-t pt-4 text-sm text-muted-foreground">
          {detailStats.map((stat) => {
            const StatIcon = stat.icon

            return (
              <div className="flex min-w-0 items-center gap-1.5" key={stat.srLabel}>
                <StatIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <dt className="sr-only">{stat.srLabel}</dt>
                <dd className="truncate">{stat.label}</dd>
              </div>
            )
          })}
        </dl>
      </div>
    </Card>
  )
}
