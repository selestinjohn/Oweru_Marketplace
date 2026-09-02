import { CalendarDays, MessageSquare, ShieldCheck } from 'lucide-react'
import { PrimaryButton, OutlineButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { formatDate, titleCase } from '@/lib/format'
import type { PropertyDetails } from '@/types/property'
import {
  propertyStatusLabel,
  verificationStatusLabel,
} from '@/features/property-details/utils/propertyDetailsUi'
import { PropertyStatusBadge } from './PropertyStatusBadge'

export function PropertyActionCard({ property }: { property: PropertyDetails }) {
  const items = [
    { label: 'Property ID', value: property.id.toUpperCase() },
    { label: 'Property Type', value: titleCase(property.propertyType) },
    {
      label: 'Transaction',
      value: property.transactionType === 'sale' ? 'For Sale' : 'For Rent',
    },
    { label: 'Current Status', value: propertyStatusLabel(property.status) },
    { label: 'Listed On', value: formatDate(property.listedOn) },
    { label: 'Listed By', value: property.listedBy },
  ]

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Property Information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Listing and marketplace context.
          </p>
        </div>
        <ShieldCheck className="size-5 text-accent" aria-hidden="true" />
      </div>

      <div className="mt-5 grid gap-3">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={property.transactionType} />
          <PropertyStatusBadge status={property.status} />
        </div>
        {items.map((item) => (
          <div
            className="flex items-start justify-between gap-4 border-t pt-3 text-sm"
            key={item.label}
          >
            <span className="text-muted-foreground">{item.label}</span>
            <span className="max-w-[58%] text-right font-bold text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        <PrimaryButton className="w-full">
          <MessageSquare className="size-4" aria-hidden="true" />
          Contact Agent
        </PrimaryButton>
        <OutlineButton className="w-full">
          <CalendarDays className="size-4" aria-hidden="true" />
          Schedule Viewing
        </OutlineButton>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Actions are prepared for backend workflows. Permissions and message
        delivery remain enforced by the OWERU API.
      </p>
      <p className="sr-only">
        Verification status is{' '}
        {verificationStatusLabel(property.verification.status)}.
      </p>
    </Card>
  )
}
