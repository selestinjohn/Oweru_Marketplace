import { X } from 'lucide-react'
import { IconButton } from '@/components/ui/Button'
import { PropertyFilters } from './PropertyFilters'
import type { PropertyFilters as PropertyFiltersState } from '@/types/property'

export function MobilePropertyFilters({
  filters,
  isOpen,
  onApply,
  onChange,
  onClose,
  onReset,
}: {
  filters: PropertyFiltersState
  isOpen: boolean
  onApply: () => void
  onChange: <Key extends keyof PropertyFiltersState>(
    key: Key,
    value: PropertyFiltersState[Key],
  ) => void
  onClose: () => void
  onReset: () => void
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        className="absolute inset-0 bg-primary/45 backdrop-blur-sm"
        type="button"
        aria-label="Close property filters"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-[min(92vw,390px)] overflow-y-auto border-l bg-surface shadow-soft">
        <div className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b bg-surface px-5">
          <div>
            <p className="text-xs font-extrabold uppercase text-accent">
              Property Listings
            </p>
            <h2 className="font-display text-xl font-bold">Filters</h2>
          </div>
          <IconButton label="Close filters" variant="outline" onClick={onClose}>
            <X className="size-5" aria-hidden="true" />
          </IconButton>
        </div>
        <div className="p-5">
          <PropertyFilters
            filters={filters}
            onApply={() => {
              onApply()
              onClose()
            }}
            onChange={onChange}
            onReset={onReset}
          />
        </div>
      </aside>
    </div>
  )
}
