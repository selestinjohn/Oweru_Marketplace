import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routePaths } from '@/constants/routes'
import type { PropertyDetails } from '@/types/property'

export function PropertyBreadcrumb({ property }: { property: PropertyDetails }) {
  return (
    <nav
      className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      aria-label="Breadcrumb"
    >
      <Link
        className="inline-flex items-center gap-2 font-bold text-foreground transition hover:text-accent"
        to={routePaths.properties}
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to properties
      </Link>
      <span aria-hidden="true">/</span>
      <span className="truncate">{property.title}</span>
    </nav>
  )
}
