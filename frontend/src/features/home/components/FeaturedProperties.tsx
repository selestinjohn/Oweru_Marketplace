import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { SectionHeader } from '@/components/common/SectionHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import { PropertyCard } from '@/components/property/PropertyCard'
import { Card } from '@/components/ui/Card'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { defaultPropertyFilters } from '@/constants/propertyOptions'
import { routePaths } from '@/constants/routes'
import { usePropertyListings } from '@/features/properties/usePropertyListings'
import { cn } from '@/lib/utils'
import {
  featuredPropertyTabs,
  type FeaturedPropertyTabId,
} from '@/features/home/data/homeContent'
import type { PropertyFilters } from '@/types/property'

function getFiltersForTab(tabId: FeaturedPropertyTabId): PropertyFilters {
  if (tabId === 'sale') {
    return { ...defaultPropertyFilters, transactionType: 'sale' }
  }

  if (tabId === 'rent') {
    return { ...defaultPropertyFilters, transactionType: 'rent' }
  }

  if (tabId === 'land') {
    return { ...defaultPropertyFilters, propertyType: 'land' }
  }

  if (tabId === 'commercial') {
    return { ...defaultPropertyFilters, propertyType: 'commercial' }
  }

  return defaultPropertyFilters
}

function FeaturedPropertySkeletons() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
      {Array.from({ length: 4 }, (_, index) => (
        <Card className="overflow-hidden p-0" key={index}>
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="grid gap-3 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-7 w-36" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export function FeaturedProperties() {
  const [activeTab, setActiveTab] = useState<FeaturedPropertyTabId>('all')
  const navigate = useNavigate()
  const filters = useMemo(() => getFiltersForTab(activeTab), [activeTab])
  const propertiesQuery = usePropertyListings({
    filters,
    page: 1,
    pageSize: 4,
    sort: 'newest',
  })
  const properties = propertiesQuery.data?.items ?? []

  return (
    <PageSection className="bg-surface">
      <AppContainer className="grid gap-6">
        <SectionHeader
          title="Featured Properties"
          description="Explore selected verified properties across Tanzania."
          action={
            <Link
              className={cn(buttonVariants({ variant: 'outline' }), 'shrink-0')}
              to={routePaths.properties}
            >
              View all properties
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Featured property categories"
        >
          {featuredPropertyTabs.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className={cn(
                'min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition',
                activeTab === tab.id
                  ? 'border-accent bg-accent text-accent-foreground shadow-sm'
                  : 'border-transparent bg-muted text-muted-foreground hover:bg-surface hover:text-foreground',
              )}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {propertiesQuery.isLoading && <FeaturedPropertySkeletons />}

        {propertiesQuery.isError && (
          <ErrorState
            title="Unable to load featured properties"
            message="Featured listings could not be prepared. Try refreshing this section."
            action={{
              label: 'Try Again',
              onClick: () => void propertiesQuery.refetch(),
            }}
          />
        )}

        {!propertiesQuery.isLoading &&
          !propertiesQuery.isError &&
          properties.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

        {!propertiesQuery.isLoading &&
          !propertiesQuery.isError &&
          properties.length === 0 && (
            <EmptyState
              title="No featured properties found"
              message="Try another category or browse the full marketplace inventory."
              action={{
                label: 'Browse Properties',
                onClick: () => navigate(routePaths.properties),
              }}
            />
          )}
      </AppContainer>
    </PageSection>
  )
}
