import type { LucideIcon } from 'lucide-react'
import { Bath, BedDouble, Home, MapPin, Maximize2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

export function VerificationPropertyContextCard({
  verification,
}: {
  verification: VerificationDetails
}) {
  const property = verification.propertySummary

  return (
    <Card className="overflow-hidden p-0">
      <img
        alt={`${property.title} property context`}
        className="h-44 w-full object-cover"
        src={property.image}
      />
      <div className="grid gap-4 p-5">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">
            Property Context
          </p>
          <h2 className="mt-2 font-display text-xl font-bold text-foreground">
            {property.title}
          </h2>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <MapPin className="size-4 text-accent" aria-hidden="true" />
            {property.location}
          </p>
        </div>

        <dl className="grid gap-2 rounded-card border bg-surface-muted p-3 text-sm">
          <ContextRow label="Price" value={formatCurrency(property.price, property.currency)} />
          <ContextRow label="Property Ref" value={property.id.toUpperCase()} />
          <ContextRow label="Property Type" value={property.propertyType} />
          <ContextRow label="Transaction" value={property.transactionType} />
        </dl>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <MiniMetric
            icon={BedDouble}
            label="Beds"
            value={property.bedrooms ? String(property.bedrooms) : 'N/A'}
          />
          <MiniMetric
            icon={Bath}
            label="Baths"
            value={property.bathrooms ? String(property.bathrooms) : 'N/A'}
          />
          <MiniMetric
            icon={Maximize2}
            label="sqm"
            value={String(property.area)}
          />
        </div>

        <Link
          className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
          to={routePaths.propertyDetail.replace(':propertyId', property.id)}
        >
          <Home className="size-4" aria-hidden="true" />
          View Property Page
        </Link>
      </div>
    </Card>
  )
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-bold text-foreground">{value}</dd>
    </div>
  )
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-control border bg-surface px-2 py-3">
      <Icon className="mx-auto size-4 text-accent" aria-hidden="true" />
      <p className="mt-1 font-display text-lg font-bold text-foreground">
        {value}
      </p>
      <p className="text-xs font-bold uppercase text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
