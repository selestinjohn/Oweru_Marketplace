import { Search } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Input'

export function SearchBar({
  onChange,
  onSubmit,
  value,
}: {
  onChange: (value: string) => void
  onSubmit: () => void
  value: string
}) {
  return (
    <form
      className="flex flex-col gap-3 rounded-card border bg-surface p-2 shadow-panel sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <SearchInput
        aria-label="Search by location"
        className="border-0 shadow-none focus:ring-0"
        name="locationSearch"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by location, property type, or area..."
        value={value}
      />
      <PrimaryButton className="sm:min-w-32" type="submit">
        <Search className="size-4" aria-hidden="true" />
        Search
      </PrimaryButton>
    </form>
  )
}
