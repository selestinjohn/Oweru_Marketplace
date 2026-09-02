import { useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import type { PropertyDetails } from '@/types/property'
import { PropertyDetailsGrid } from './PropertyDetailsGrid'
import { PropertyDocuments } from './PropertyDocuments'
import { PropertyHistory } from './PropertyHistory'
import { PropertyLocation } from './PropertyLocation'
import { PropertyOverview } from './PropertyOverview'
import { PropertyVerification } from './PropertyVerification'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'location', label: 'Location' },
  { id: 'documents', label: 'Documents' },
  { id: 'verification', label: 'Verification' },
  { id: 'history', label: 'History' },
] as const

export type PropertyDetailTabId = (typeof tabs)[number]['id']

export function PropertyTabs({
  activeTab,
  onTabChange,
  property,
}: {
  activeTab?: PropertyDetailTabId
  onTabChange?: (tabId: PropertyDetailTabId) => void
  property: PropertyDetails
}) {
  const [internalTab, setInternalTab] = useState<PropertyDetailTabId>('overview')
  const selectedTab = activeTab ?? internalTab

  const selectedPanel = useMemo(() => {
    if (selectedTab === 'details') {
      return <PropertyDetailsGrid property={property} />
    }

    if (selectedTab === 'location') {
      return <PropertyLocation property={property} />
    }

    if (selectedTab === 'documents') {
      return <PropertyDocuments property={property} />
    }

    if (selectedTab === 'verification') {
      return <PropertyVerification property={property} />
    }

    if (selectedTab === 'history') {
      return <PropertyHistory property={property} />
    }

    return <PropertyOverview property={property} />
  }, [property, selectedTab])

  const handleTabChange = (tabId: PropertyDetailTabId) => {
    setInternalTab(tabId)
    onTabChange?.(tabId)
  }

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    tabId: PropertyDetailTabId,
  ) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === tabId)
    const lastIndex = tabs.length - 1
    let nextIndex: number

    if (event.key === 'ArrowRight') {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1
    } else if (event.key === 'ArrowLeft') {
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = lastIndex
    } else {
      return
    }

    event.preventDefault()
    const nextTab = tabs[nextIndex]
    handleTabChange(nextTab.id)
    document.getElementById(`${nextTab.id}-tab`)?.focus()
  }

  return (
    <section className="grid content-start gap-5" id="property-detail-tabs">
      <div
        className="overflow-x-auto rounded-card border bg-surface p-1 shadow-panel"
        role="tablist"
        aria-label="Property details sections"
      >
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => (
            <button
              aria-controls={`${tab.id}-panel`}
              aria-selected={selectedTab === tab.id}
              className={cn(
                'min-h-11 rounded-control px-4 text-sm font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                selectedTab === tab.id &&
                  'bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground',
              )}
              id={`${tab.id}-tab`}
              key={tab.id}
              onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        aria-labelledby={`${selectedTab}-tab`}
        id={`${selectedTab}-panel`}
        role="tabpanel"
        tabIndex={0}
      >
        {selectedPanel}
      </div>
    </section>
  )
}
