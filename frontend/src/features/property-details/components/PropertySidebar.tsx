import type { PropertyDetails } from '@/types/property'
import { PropertyActionCard } from './PropertyActionCard'
import { VerificationSummaryCard } from './VerificationSummaryCard'
import type { PropertyDetailTabId } from './PropertyTabs'

export function PropertySidebar({
  onTabChange,
  property,
}: {
  onTabChange?: (tabId: PropertyDetailTabId) => void
  property: PropertyDetails
}) {
  return (
    <aside className="grid gap-4 lg:sticky lg:top-28 lg:self-start">
      <PropertyActionCard property={property} />
      <VerificationSummaryCard
        onViewDetails={() => onTabChange?.('verification')}
        property={property}
      />
    </aside>
  )
}
