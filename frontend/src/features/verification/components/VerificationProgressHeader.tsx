import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, Bath, BedDouble, MapPin, Maximize2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { routePaths } from '@/constants/routes'
import type { VerificationDetails } from '@/features/verification/types/verification.types'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { VerificationStatusBadge } from './VerificationStatusBadge'

export function VerificationProgressHeader({
  verification,
}: {
  verification: VerificationDetails
}) {
  const property = verification.propertySummary

  return (
    <header className="grid gap-5">
      <Link
        className="inline-flex w-fit items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-accent"
        to={routePaths.verifications}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to verifications
      </Link>

      <Card className="overflow-hidden p-0">
        <div className="grid lg:grid-cols-[280px_1fr]">
          <div className="relative min-h-56 overflow-hidden bg-primary lg:min-h-full">
            <img
              alt={`${property.title} verification property thumbnail`}
              className="absolute inset-0 h-full w-full object-cover"
              src={property.image}
            />
            <div className="absolute inset-0 bg-primary/25" />
          </div>
          <div className="grid gap-5 p-5 md:p-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase text-accent">
                  OWERU Verify
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
                    {property.title}
                  </h1>
                  <VerificationStatusBadge status={verification.status} />
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <MapPin className="size-4 text-accent" aria-hidden="true" />
                  {property.location}
                </p>
              </div>
              <div className="rounded-card border bg-surface-muted px-4 py-3 xl:text-right">
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Verification ID
                </p>
                <p className="mt-1 font-mono text-sm font-bold text-foreground">
                  {verification.id}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <HeaderMetric label="Property Ref" value={property.id.toUpperCase()} />
              <HeaderMetric
                label="Price"
                value={formatCurrency(property.price, property.currency)}
              />
              <HeaderMetric
                icon={BedDouble}
                label="Beds"
                value={property.bedrooms ? String(property.bedrooms) : 'N/A'}
              />
              <HeaderMetric
                icon={Bath}
                label="Baths"
                value={property.bathrooms ? String(property.bathrooms) : 'N/A'}
              />
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Maximize2 className="size-4 text-accent" aria-hidden="true" />
                {property.area.toLocaleString()} sqm · {property.propertyType}
              </p>
              <Link
                className={cn(buttonVariants({ variant: 'outline' }), 'sm:w-auto')}
                to={routePaths.propertyDetail.replace(':propertyId', property.id)}
              >
                View Property
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </header>
  )
}

function HeaderMetric({
  icon: Icon,
  label,
  value,
}: {
  icon?: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-control border bg-surface px-4 py-3">
      <p className="text-xs font-bold uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 flex items-center gap-2 font-display text-lg font-bold text-foreground">
        {Icon && <Icon className="size-4 text-accent" aria-hidden="true" />}
        {value}
      </p>
    </div>
  )
}
