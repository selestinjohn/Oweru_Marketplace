import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { SectionHeader } from '@/components/common/SectionHeader'
import { PropertyCard } from '@/components/property/PropertyCard'
import { Skeleton } from '@/components/feedback/LoadingSkeleton'
import { Card } from '@/components/ui/Card'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { useSimilarProperties } from '@/features/property-details/hooks/usePropertyDetails'
import { cn } from '@/lib/utils'

function SimilarPropertiesSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
      {Array.from({ length: 4 }, (_, index) => (
        <Card className="overflow-hidden p-0" key={index}>
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="grid gap-3 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-7 w-32" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export function SimilarProperties({ propertyId }: { propertyId: string }) {
  const similarQuery = useSimilarProperties(propertyId)
  const properties = similarQuery.data ?? []

  return (
    <PageSection className="bg-surface">
      <AppContainer className="grid gap-6">
        <SectionHeader
          title="Similar Properties"
          description="Continue exploring comparable verified opportunities."
          action={
            <Link
              className={cn(buttonVariants({ variant: 'outline' }), 'shrink-0')}
              to={routePaths.properties}
            >
              View more properties
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        {similarQuery.isLoading && <SimilarPropertiesSkeleton />}
        {!similarQuery.isLoading && properties.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </AppContainer>
    </PageSection>
  )
}
