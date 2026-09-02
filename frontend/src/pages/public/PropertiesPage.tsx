import { useMemo, useState } from 'react'
import { LayoutGrid, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { AppContainer } from '@/components/common/AppContainer'
import { ContentGrid } from '@/components/common/ContentGrid'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSection } from '@/components/common/PageSection'
import { PaginationControls } from '@/components/common/PaginationControls'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { MobilePropertyFilters } from '@/components/property/MobilePropertyFilters'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { PropertyGridSkeleton } from '@/components/property/PropertyGridSkeleton'
import { Card } from '@/components/ui/Card'
import { OutlineButton } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import {
  defaultPropertyFilters,
  propertyPageSize,
  propertySortOptions,
} from '@/constants/propertyOptions'
import { usePropertyListings } from '@/features/properties/usePropertyListings'
import type {
  PropertyFilters as PropertyFiltersState,
  PropertySort,
} from '@/types/property'

const supportedPropertyTypes: PropertyFiltersState['propertyType'][] = [
  'all',
  'house',
  'apartment',
  'land',
  'commercial',
  'warehouse',
  'agricultural',
]
const supportedTransactionTypes: PropertyFiltersState['transactionType'][] = [
  'all',
  'sale',
  'rent',
]

function getInitialFilters(searchParams: URLSearchParams): PropertyFiltersState {
  const propertyType = searchParams.get('propertyType')
  const transactionType = searchParams.get('transactionType')

  return {
    ...defaultPropertyFilters,
    location: searchParams.get('location') ?? '',
    propertyType: supportedPropertyTypes.includes(
      propertyType as PropertyFiltersState['propertyType'],
    )
      ? (propertyType as PropertyFiltersState['propertyType'])
      : defaultPropertyFilters.propertyType,
    transactionType: supportedTransactionTypes.includes(
      transactionType as PropertyFiltersState['transactionType'],
    )
      ? (transactionType as PropertyFiltersState['transactionType'])
      : defaultPropertyFilters.transactionType,
  }
}

export function PropertiesPage() {
  const [searchParams] = useSearchParams()
  const initialFilters = useMemo(
    () => getInitialFilters(searchParams),
    [searchParams],
  )
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const [draftFilters, setDraftFilters] = useState(initialFilters)
  const [sort, setSort] = useState<PropertySort>('newest')
  const [page, setPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const propertiesQuery = usePropertyListings({
    filters: appliedFilters,
    page,
    pageSize: propertyPageSize,
    sort,
  })

  const result = propertiesQuery.data
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((result?.total ?? 0) / propertyPageSize)),
    [result?.total],
  )

  const updateDraftFilter = <Key extends keyof PropertyFiltersState>(
    key: Key,
    value: PropertyFiltersState[Key],
  ) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const applyFilters = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const resetFilters = () => {
    setDraftFilters(defaultPropertyFilters)
    setAppliedFilters(defaultPropertyFilters)
    setPage(1)
  }

  return (
    <div className="bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-muted)_42%,var(--surface)_100%)]">
      <PageSection className="border-b bg-surface">
        <AppContainer className="grid gap-6">
          <PageHeader
            eyebrow="Property Listings"
            title="Browse verified Tanzanian properties"
            description="Discover verified homes, land, apartments, and commercial properties across Tanzania."
            actions={
              <OutlineButton
                className="lg:hidden"
                onClick={() => setIsFilterOpen(true)}
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filters
              </OutlineButton>
            }
          />

          <SearchBar
            value={draftFilters.location}
            onChange={(value) => updateDraftFilter('location', value)}
            onSubmit={applyFilters}
          />
        </AppContainer>
      </PageSection>

      <PageSection>
        <AppContainer>
          <ContentGrid>
            <aside className="hidden lg:block">
              <Card className="sticky top-28 p-5">
                <PropertyFilters
                  filters={draftFilters}
                  onApply={applyFilters}
                  onChange={updateDraftFilter}
                  onReset={resetFilters}
                />
              </Card>
            </aside>

            <section className="grid min-w-0 gap-5">
              <div className="flex flex-col gap-4 rounded-card border bg-surface p-4 shadow-panel md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase text-accent">
                    {propertiesQuery.isLoading
                      ? 'Loading results'
                      : `${result?.total ?? 0} properties found`}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
                    Verified marketplace inventory
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-control border bg-surface-muted px-3 text-sm font-bold text-muted-foreground">
                    <LayoutGrid className="size-4 text-accent" aria-hidden="true" />
                    Grid View
                  </span>
                  <Select
                    className="min-w-44"
                    label="Sort by"
                    name="sort"
                    onChange={(event) => {
                      setSort(event.target.value as PropertySort)
                      setPage(1)
                    }}
                    options={propertySortOptions}
                    value={sort}
                  />
                </div>
              </div>

              {propertiesQuery.isLoading && <PropertyGridSkeleton />}

              {propertiesQuery.isError && (
                <ErrorState
                  title="Unable to load properties"
                  message="The marketplace inventory could not be loaded. Try refreshing the results."
                  action={{
                    label: 'Try Again',
                    onClick: () => void propertiesQuery.refetch(),
                  }}
                />
              )}

              {!propertiesQuery.isLoading &&
                !propertiesQuery.isError &&
                result &&
                result.items.length > 0 && (
                  <>
                    <PropertyGrid properties={result.items} />
                    <PaginationControls
                      currentPage={page}
                      onPageChange={setPage}
                      totalPages={totalPages}
                    />
                  </>
                )}

              {!propertiesQuery.isLoading &&
                !propertiesQuery.isError &&
                result?.items.length === 0 && (
                  <EmptyState
                    title="No properties match your filters"
                    message="Try a broader location, remove a price limit, or reset the filters to see all verified opportunities."
                    action={{
                      label: 'Reset Filters',
                      onClick: resetFilters,
                    }}
                  />
                )}
            </section>
          </ContentGrid>
        </AppContainer>
      </PageSection>

      <MobilePropertyFilters
        filters={draftFilters}
        isOpen={isFilterOpen}
        onApply={applyFilters}
        onChange={updateDraftFilter}
        onClose={() => setIsFilterOpen(false)}
        onReset={resetFilters}
      />
    </div>
  )
}
