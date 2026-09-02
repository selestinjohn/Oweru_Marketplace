import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Input'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { routePaths } from '@/constants/routes'
import { cn } from '@/lib/utils'

export function HeroSearch() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const searchPath = query.trim()
    ? `${routePaths.properties}?location=${encodeURIComponent(query.trim())}`
    : routePaths.properties

  return (
    <form
      className="grid gap-3 rounded-card border border-primary-foreground/20 bg-primary-foreground p-2 shadow-soft sm:grid-cols-[minmax(0,1fr)_auto_auto]"
      onSubmit={(event) => {
        event.preventDefault()
        navigate(searchPath)
      }}
    >
      <SearchInput
        aria-label="Search properties"
        className="min-h-12 border-0 bg-primary-foreground px-4 shadow-none focus:ring-0"
        name="homepageSearch"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by location, property ID or keyword..."
        value={query}
      />
      <PrimaryButton className="min-h-12 sm:min-w-32" type="submit">
        <Search className="size-4" aria-hidden="true" />
        Search
      </PrimaryButton>
      <Link
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'min-h-12 border-primary/10 bg-surface text-foreground hover:border-accent/50',
        )}
        to={routePaths.properties}
      >
        Browse
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </form>
  )
}
