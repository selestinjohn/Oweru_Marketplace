import { useState } from 'react'
import { Home, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { SellerPropertyCard } from '@/features/seller/components/SellerPropertyCard'
import {
  sellerPropertyStatusOptions,
  sellerPropertyTypeOptions,
} from '@/features/seller/data/mockSellerWorkspace'
import { useSellerProperties } from '@/features/seller/hooks/useSellerQueries'
import type {
  SellerPropertyStatus,
  SellerPropertyType,
} from '@/features/seller/types/seller.types'
import { cn } from '@/lib/utils'

export function SellerPropertiesPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | SellerPropertyStatus>('all')
  const [propertyType, setPropertyType] = useState<'all' | SellerPropertyType>(
    'all',
  )
  const propertiesQuery = useSellerProperties({ propertyType, query, status })
  const bundles = propertiesQuery.data ?? []

  if (propertiesQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (propertiesQuery.isError) {
    return (
      <ErrorState
        title="Unable to load properties"
        message="OWERU could not load the property records you manage."
        action={{
          label: 'Try again',
          onClick: () => void propertiesQuery.refetch(),
        }}
      />
    )
  }

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Property records"
        title="My Properties"
        description="Manage persistent OWERU property records before creating or publishing marketplace listings."
        action={
          <Link
            className={cn(buttonVariants({ variant: 'primary' }))}
            to={routePaths.sellerPropertyNew}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add Property
          </Link>
        }
      />

      <section className="grid gap-3 rounded-card border bg-card p-4 shadow-panel lg:grid-cols-[1fr_220px_220px]">
        <SearchInput
          label="Search property records"
          placeholder="Reference, location, or listing title..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          label="Property status"
          options={sellerPropertyStatusOptions}
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as 'all' | SellerPropertyStatus)
          }
        />
        <Select
          label="Property type"
          options={sellerPropertyTypeOptions}
          value={propertyType}
          onChange={(event) =>
            setPropertyType(event.target.value as 'all' | SellerPropertyType)
          }
        />
      </section>

      {!bundles.length ? (
        <EmptyState
          title="No properties yet"
          message="Add your first property to start building a verified property record on OWERU."
          action={{
            label: 'Add Property',
            onClick: () => navigate(routePaths.sellerPropertyNew),
          }}
        />
      ) : (
        <section className="grid gap-4" aria-label="Seller property records">
          {bundles.map((bundle) => (
            <SellerPropertyCard bundle={bundle} key={bundle.property.id} />
          ))}
        </section>
      )}

      <section className="rounded-card border bg-primary p-5 text-primary-foreground shadow-panel">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-control bg-accent text-accent-foreground">
            <Home className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold">
              Property record first
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-primary-foreground/76">
              A property record stores durable property context, documents,
              participants, and verification. A listing is the marketplace
              advertisement attached to that record.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
