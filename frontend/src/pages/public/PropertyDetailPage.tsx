import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { AppContainer } from '@/components/common/AppContainer'
import { PageSection } from '@/components/common/PageSection'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PropertyBreadcrumb } from '@/features/property-details/components/PropertyBreadcrumb'
import { PropertyDetailsSkeleton } from '@/features/property-details/components/PropertyDetailsSkeleton'
import { PropertyGallery } from '@/features/property-details/components/PropertyGallery'
import { PropertyHeader } from '@/features/property-details/components/PropertyHeader'
import { PropertyNotFound } from '@/features/property-details/components/PropertyNotFound'
import { PropertySidebar } from '@/features/property-details/components/PropertySidebar'
import {
  PropertyTabs,
  type PropertyDetailTabId,
} from '@/features/property-details/components/PropertyTabs'
import { SimilarProperties } from '@/features/property-details/components/SimilarProperties'
import { usePropertyDetails } from '@/features/property-details/hooks/usePropertyDetails'

export function PropertyDetailPage() {
  const { propertyId } = useParams()
  const [activeTab, setActiveTab] = useState<PropertyDetailTabId>('overview')
  const propertyQuery = usePropertyDetails(propertyId)
  const property = propertyQuery.data

  if (propertyQuery.isLoading) {
    return <PropertyDetailsSkeleton />
  }

  if (propertyQuery.isError) {
    return (
      <PageSection className="bg-surface-muted">
        <AppContainer>
          <ErrorState
            title="Unable to load property"
            message="The property detail record could not be loaded. Try refreshing the page or return to the marketplace."
            action={{
              label: 'Try Again',
              onClick: () => void propertyQuery.refetch(),
            }}
          />
        </AppContainer>
      </PageSection>
    )
  }

  if (!property) {
    return <PropertyNotFound />
  }

  return (
    <div className="bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-muted)_44%,var(--surface)_100%)]">
      <PageSection className="border-b bg-surface">
        <AppContainer className="grid gap-6">
          <PropertyBreadcrumb property={property} />
          <PropertyHeader property={property} />
          <PropertyGallery property={property} />
        </AppContainer>
      </PageSection>

      <PageSection>
        <AppContainer>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <PropertyTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              property={property}
            />
            <PropertySidebar onTabChange={setActiveTab} property={property} />
          </div>
        </AppContainer>
      </PageSection>

      <SimilarProperties propertyId={property.id} />
    </div>
  )
}
