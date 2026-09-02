import { useState } from 'react'
import { Megaphone, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { DashboardPageHeader } from '@/features/dashboard/components/DashboardPageHeader'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'
import { SellerListingCard } from '@/features/seller/components/SellerListingCard'
import { sellerListingStatusOptions } from '@/features/seller/data/mockSellerWorkspace'
import { useSellerListings } from '@/features/seller/hooks/useSellerQueries'
import type { SellerListingStatus } from '@/features/seller/types/seller.types'
import { cn } from '@/lib/utils'

export function SellerListingsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | SellerListingStatus>('all')
  const listingsQuery = useSellerListings({ query, status })
  const bundles = listingsQuery.data ?? []

  if (listingsQuery.isPending) {
    return <DashboardSkeleton />
  }

  if (listingsQuery.isError) {
    return (
      <ErrorState
        title="Unable to load listings"
        message="OWERU could not load the marketplace listings you manage."
        action={{
          label: 'Try again',
          onClick: () => void listingsQuery.refetch(),
        }}
      />
    )
  }

  return (
    <div className="grid gap-6">
      <DashboardPageHeader
        eyebrow="Marketplace ads"
        title="My Listings"
        description="Manage listing advertisements attached to your OWERU property records."
        action={
          <Link
            className={cn(buttonVariants({ variant: 'primary' }))}
            to={routePaths.sellerListingNew}
          >
            <Plus className="size-4" aria-hidden="true" />
            Create Listing
          </Link>
        }
      />

      <section className="grid gap-3 rounded-card border bg-card p-4 shadow-panel lg:grid-cols-[1fr_240px]">
        <SearchInput
          label="Search listings"
          placeholder="Title, reference, or location..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          label="Listing status"
          options={sellerListingStatusOptions}
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as 'all' | SellerListingStatus)
          }
        />
      </section>

      {!bundles.length ? (
        <EmptyState
          title="No listings yet"
          message="Create a marketplace listing once a property record has enough information for buyers to review."
          action={{
            label: 'Create Listing',
            onClick: () => navigate(routePaths.sellerListingNew),
          }}
        />
      ) : (
        <section className="grid gap-4" aria-label="Seller listings">
          {bundles.map((bundle) => (
            <SellerListingCard bundle={bundle} key={bundle.listing?.id} />
          ))}
        </section>
      )}

      <section className="rounded-card border bg-primary p-5 text-primary-foreground shadow-panel">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-control bg-accent text-accent-foreground">
            <Megaphone className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold">
              Listing lifecycle
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-primary-foreground/76">
              The current backend exposes publish, pause, resume, and close as
              workflow actions. The frontend does not patch listing statuses
              directly.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
