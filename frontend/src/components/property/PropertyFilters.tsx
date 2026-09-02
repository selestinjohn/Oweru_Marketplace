import type { FormEvent } from 'react'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import {
  bedroomOptions,
  propertyTypeOptions,
  transactionTypeOptions,
} from '@/constants/propertyOptions'
import type { PropertyFilters as PropertyFiltersState } from '@/types/property'
import { OutlineButton, PrimaryButton } from '@/components/ui/Button'
import { Input, SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

export function PropertyFilters({
  filters,
  onApply,
  onChange,
  onReset,
}: {
  filters: PropertyFiltersState
  onApply: () => void
  onChange: <Key extends keyof PropertyFiltersState>(
    key: Key,
    value: PropertyFiltersState[Key],
  ) => void
  onReset: () => void
}) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onApply()
  }

  return (
    <form className="grid gap-6" data-testid="property-filters" onSubmit={onSubmit}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Filters
          </h2>
          <p className="text-sm text-muted-foreground">
            Refine verified marketplace results.
          </p>
        </div>
        <SlidersHorizontal className="size-5 text-accent" aria-hidden="true" />
      </div>

      <div className="grid gap-4">
        <Select
          label="Property Type"
          name="propertyType"
          onChange={(event) =>
            onChange('propertyType', event.target.value as PropertyFiltersState['propertyType'])
          }
          options={[...propertyTypeOptions]}
          value={filters.propertyType}
        />

        <Select
          label="Transaction Type"
          name="transactionType"
          onChange={(event) =>
            onChange(
              'transactionType',
              event.target.value as PropertyFiltersState['transactionType'],
            )
          }
          options={[...transactionTypeOptions]}
          value={filters.transactionType}
        />

        <SearchInput
          label="Location"
          name="location"
          onChange={(event) => onChange('location', event.target.value)}
          placeholder="Masaki, Kigamboni, Arusha..."
          value={filters.location}
        />

        <fieldset className="grid gap-3">
          <legend className="text-sm font-bold text-foreground">
            Price Range
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <Input
              aria-label="Minimum price"
              inputMode="numeric"
              name="minPrice"
              onChange={(event) => onChange('minPrice', event.target.value)}
              placeholder="Min"
              value={filters.minPrice}
            />
            <Input
              aria-label="Maximum price"
              inputMode="numeric"
              name="maxPrice"
              onChange={(event) => onChange('maxPrice', event.target.value)}
              placeholder="Max"
              value={filters.maxPrice}
            />
          </div>
        </fieldset>

        <Select
          label="Bedrooms"
          name="bedrooms"
          onChange={(event) =>
            onChange('bedrooms', event.target.value as PropertyFiltersState['bedrooms'])
          }
          options={[...bedroomOptions]}
          value={filters.bedrooms}
        />

        <fieldset className="grid gap-3">
          <legend className="text-sm font-bold text-foreground">
            Property Size
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <Input
              aria-label="Minimum property size"
              inputMode="numeric"
              name="minSize"
              onChange={(event) => onChange('minSize', event.target.value)}
              placeholder="Min sqm"
              value={filters.minSize}
            />
            <Input
              aria-label="Maximum property size"
              inputMode="numeric"
              name="maxSize"
              onChange={(event) => onChange('maxSize', event.target.value)}
              placeholder="Max sqm"
              value={filters.maxSize}
            />
          </div>
        </fieldset>
      </div>

      <div className="grid gap-3">
        <PrimaryButton type="submit">Apply Filters</PrimaryButton>
        <OutlineButton type="button" onClick={onReset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset Filters
        </OutlineButton>
      </div>
    </form>
  )
}
